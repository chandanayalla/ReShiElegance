import express from 'express';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const products = [];
let nextProductId = 1;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseProductsTable = process.env.SUPABASE_PRODUCTS_TABLE || 'products';
const supabaseStorageBucket = process.env.SUPABASE_STORAGE_BUCKET || 'products';

const supabase = supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

const hasSupabase = () => Boolean(supabase);

const toImageDataUrl = (file) => {
  if (!file) {
    return '';
  }

  return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
};

const uploadImageToSupabaseStorage = async (file) => {
  const safeName = file.originalname.replace(/\s+/g, '_');
  const filePath = `products/${Date.now()}-${safeName}`;

  const { error } = await supabase.storage
    .from(supabaseStorageBucket)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from(supabaseStorageBucket).getPublicUrl(filePath);
  return data.publicUrl;
};

const buildProduct = (payload, existingProduct = null, image = null) => {
  const stockNumber = Number(payload.stock) || 0;

  return {
    id: existingProduct?.id || String(nextProductId++),
    name: payload.name?.trim() || 'Untitled product',
    price: Number(payload.price) || 0,
    stock: stockNumber,
    description: payload.description?.trim() || '',
    image: image ?? (existingProduct?.image || ''),
    status: stockNumber > 0 ? 'In Stock' : 'Out of Stock',
    createdAt: existingProduct?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

const sortProducts = (items) => [...items].sort((left, right) => {
  const leftTime = new Date(left.createdAt || 0).getTime();
  const rightTime = new Date(right.createdAt || 0).getTime();
  return rightTime - leftTime;
});

const loadProductsFromSupabase = async () => {
  const { data, error } = await supabase
    .from(supabaseProductsTable)
    .select('*')
    .order('createdAt', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
};

const getProductFromSupabase = async (id) => {
  const { data, error } = await supabase
    .from(supabaseProductsTable)
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }

    throw error;
  }

  return data;
};

const saveProductToSupabase = async (product) => {
  const { data, error } = await supabase
    .from(supabaseProductsTable)
    .insert([product])
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data;
};

const updateProductInSupabase = async (id, product) => {
  const { data, error } = await supabase
    .from(supabaseProductsTable)
    .update(product)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data;
};

const deleteProductFromSupabase = async (id) => {
  const { error } = await supabase
    .from(supabaseProductsTable)
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
};

router.get('/', (req, res) => {
  if (hasSupabase()) {
    loadProductsFromSupabase()
      .then((items) => res.json(items))
      .catch((error) => {
        console.error('Error fetching products from Supabase:', error);
        res.status(500).json({ message: 'Unable to load products.' });
      });
    return;
  }

  res.json(sortProducts(products));
});

router.get('/:id', async (req, res) => {
  if (hasSupabase()) {
    try {
      const product = await getProductFromSupabase(req.params.id);

      if (!product) {
        return res.status(404).json({ message: 'Product not found.' });
      }

      return res.json(product);
    } catch (error) {
      console.error('Error fetching product from Supabase:', error);
      return res.status(500).json({ message: 'Unable to load product.' });
    }
  }

  const product = products.find((item) => item.id === req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  return res.json(product);
});

router.post('/add', upload.single('image'), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'Please upload an image file.' });
  }

  const image = hasSupabase() ? await uploadImageToSupabaseStorage(file) : toImageDataUrl(file);
  const product = buildProduct(req.body, null, image);

  if (hasSupabase()) {
    try {
      const savedProduct = await saveProductToSupabase(product);
      return res.status(201).json(savedProduct);
    } catch (error) {
      console.error('Error adding product to Supabase:', error);
      return res.status(500).json({ message: 'Unable to save product.' });
    }
  }

  products.push(product);

  return res.status(201).json(product);
});

router.put('/:id', upload.single('image'), async (req, res) => {
  if (hasSupabase()) {
    try {
      const existingProduct = await getProductFromSupabase(req.params.id);

      if (!existingProduct) {
        return res.status(404).json({ message: 'Product not found.' });
      }

      const image = req.file ? await uploadImageToSupabaseStorage(req.file) : existingProduct.image;
      const product = buildProduct(req.body, existingProduct, image);
      const updatedProduct = await updateProductInSupabase(req.params.id, product);
      return res.json(updatedProduct);
    } catch (error) {
      console.error('Error updating product in Supabase:', error);
      return res.status(500).json({ message: 'Unable to update product.' });
    }
  }

  const index = products.findIndex((item) => item.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  const image = req.file ? toImageDataUrl(req.file) : products[index].image;
  const product = buildProduct(req.body, products[index], image);
  products[index] = product;

  return res.json(product);
});

router.delete('/:id', async (req, res) => {
  if (hasSupabase()) {
    try {
      const existingProduct = await getProductFromSupabase(req.params.id);

      if (!existingProduct) {
        return res.status(404).json({ message: 'Product not found.' });
      }

      await deleteProductFromSupabase(req.params.id);
      return res.status(204).send();
    } catch (error) {
      console.error('Error deleting product from Supabase:', error);
      return res.status(500).json({ message: 'Unable to delete product.' });
    }
  }

  const index = products.findIndex((item) => item.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  products.splice(index, 1);
  return res.status(204).send();
});

export default router;