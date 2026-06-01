import express from 'express';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import { products as seedProducts } from '../../src/data/products.js';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { files: 6, fileSize: 5 * 1024 * 1024 },
});

let products = seedProducts.map((product) => ({
  ...product,
  id: String(product.id),
  createdAt: product.createdAt || new Date().toISOString(),
  updatedAt: product.updatedAt || new Date().toISOString(),
}));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const productsTable = process.env.SUPABASE_PRODUCTS_TABLE || 'products';
const storageBucket = process.env.SUPABASE_STORAGE_BUCKET || 'products';
const seedFallbackEnabled = process.env.SEED_FALLBACK_ENABLED !== 'false';

const hasRealSupabaseConfig = Boolean(
  supabaseUrl
  && supabaseServiceRoleKey
  && !supabaseUrl.includes('your-project')
  && !supabaseServiceRoleKey.includes('your-service-role-key')
);

const supabase = hasRealSupabaseConfig
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;

const hasSupabase = () => Boolean(supabase);

const publicProductFields = `
  id,name,slug,category,price,original_price,discount,description,fabric,work,
  occasion,colors,stock,status,rating,reviews_count,images,is_new_arrival,
  is_best_seller,created_at,updated_at
`;

const toCamelProduct = (product) => {
  if (!product) return null;
  const originalPrice = Number(product.original_price ?? product.originalPrice ?? product.price ?? 0);
  const price = Number(product.price || 0);
  const stock = Number(product.stock || 0);
  const images = product.images?.length ? product.images : product.image ? [product.image] : [];

  return {
    id: String(product.id ?? product._id),
    _id: String(product.id ?? product._id),
    name: product.name || '',
    slug: product.slug || '',
    category: product.category || 'Sarees',
    price,
    originalPrice,
    discount: Number(product.discount || 0),
    description: product.description || '',
    fabric: product.fabric || '',
    work: product.work || '',
    occasion: product.occasion || '',
    colors: Array.isArray(product.colors) ? product.colors : [],
    stock,
    status: product.status || (stock > 0 ? 'In Stock' : 'Out of Stock'),
    rating: Number(product.rating || 4.6),
    reviewsCount: Number(product.reviews_count ?? product.reviewsCount ?? 0),
    images,
    image: images[0] || '',
    isNewArrival: Boolean(product.is_new_arrival ?? product.isNewArrival),
    isBestSeller: Boolean(product.is_best_seller ?? product.isBestSeller),
    createdAt: product.created_at || product.createdAt || new Date().toISOString(),
    updatedAt: product.updated_at || product.updatedAt || new Date().toISOString(),
  };
};

const toDbProduct = (product) => ({
  name: product.name,
  slug: product.slug,
  category: product.category,
  price: product.price,
  original_price: product.originalPrice,
  discount: product.discount,
  description: product.description,
  fabric: product.fabric,
  work: product.work,
  occasion: product.occasion,
  colors: product.colors,
  stock: product.stock,
  status: product.status,
  rating: product.rating,
  reviews_count: product.reviewsCount,
  images: product.images,
  is_new_arrival: product.isNewArrival,
  is_best_seller: product.isBestSeller,
  updated_at: new Date().toISOString(),
});

const slugify = (value) => value
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

const readArray = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return String(value).split(',').map((item) => item.trim()).filter(Boolean);
  }
};

const uploadImage = async (file) => {
  if (!file) return '';
  if (!hasSupabase()) {
    return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
  }

  const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filePath = `products/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
  const { error } = await supabase.storage.from(storageBucket).upload(filePath, file.buffer, {
    contentType: file.mimetype,
    upsert: false,
  });

  if (error) throw error;
  const { data } = supabase.storage.from(storageBucket).getPublicUrl(filePath);
  return data.publicUrl;
};

const buildProduct = async (payload, files = [], existing = null) => {
  const uploadedImages = await Promise.all(files.map(uploadImage));
  const existingImages = readArray(payload.existingImages);
  const fallbackImages = existing ? existing.images : [];
  const images = [...existingImages, ...uploadedImages].filter(Boolean);
  const price = Number(payload.price || 0);
  const originalPrice = Number(payload.originalPrice || payload.original_price || price);
  const stock = Number(payload.stock || 0);
  const productId = existing?.id || crypto.randomUUID();

  return {
    id: productId,
    _id: productId,
    name: payload.name?.trim() || existing?.name || 'Untitled product',
    slug: payload.slug?.trim() || slugify(payload.name || existing?.name || 'product'),
    category: payload.category || existing?.category || 'Sarees',
    price,
    originalPrice,
    discount: originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : Number(payload.discount || 0),
    description: payload.description?.trim() || '',
    fabric: payload.fabric?.trim() || existing?.fabric || '',
    work: payload.work?.trim() || existing?.work || '',
    occasion: payload.occasion?.trim() || existing?.occasion || '',
    colors: readArray(payload.colors),
    stock,
    status: stock > 0 ? 'In Stock' : 'Out of Stock',
    rating: Number(payload.rating || existing?.rating || 4.6),
    reviewsCount: Number(payload.reviewsCount || existing?.reviewsCount || 0),
    images: images.length ? images : fallbackImages,
    isNewArrival: payload.isNewArrival === 'true' || payload.isNewArrival === true || existing?.isNewArrival || false,
    isBestSeller: payload.isBestSeller === 'true' || payload.isBestSeller === true || existing?.isBestSeller || false,
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

const getProducts = async () => {
  if (!hasSupabase()) {
    return [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  const { data, error } = await supabase
    .from(productsTable)
    .select(publicProductFields)
    .order('created_at', { ascending: false });
  if (error) throw error;
  const items = (data || []).map(toCamelProduct);
  if (!items.length && seedFallbackEnabled) {
    return [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  return items;
};

const getProduct = async (id) => {
  if (!hasSupabase()) {
    return products.find((product) => String(product.id) === String(id) || String(product._id) === String(id)) || null;
  }

  const { data, error } = await supabase
    .from(productsTable)
    .select(publicProductFields)
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return toCamelProduct(data);
};

router.get('/', async (req, res) => {
  try {
    const items = await getProducts();
    res.json(items);
  } catch (error) {
    console.error('Product fetch error:', error);
    res.status(500).json({ message: 'Unable to load products.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await getProduct(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    return res.json(product);
  } catch (error) {
    console.error('Product detail error:', error);
    return res.status(500).json({ message: 'Unable to load product.' });
  }
});

router.post('/add', upload.array('images', 6), async (req, res) => {
  try {
    const files = req.files?.length ? req.files : req.file ? [req.file] : [];
    const product = await buildProduct(req.body, files);
    if (!product.images.length) return res.status(400).json({ message: 'Upload at least one product image.' });

    if (hasSupabase()) {
      const { data, error } = await supabase
        .from(productsTable)
        .insert(toDbProduct(product))
        .select(publicProductFields)
        .single();
      if (error) throw error;
      return res.status(201).json(toCamelProduct(data));
    }

    products = [product, ...products];
    return res.status(201).json(product);
  } catch (error) {
    console.error('Product create error:', error);
    return res.status(500).json({ message: 'Unable to save product.' });
  }
});

router.put('/:id', upload.array('images', 6), async (req, res) => {
  try {
    const existing = await getProduct(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Product not found.' });

    const product = await buildProduct(req.body, req.files || [], existing);
    if (!product.images.length) return res.status(400).json({ message: 'Keep or upload at least one product image.' });

    if (hasSupabase()) {
      const { data, error } = await supabase
        .from(productsTable)
        .update(toDbProduct(product))
        .eq('id', req.params.id)
        .select(publicProductFields)
        .single();
      if (error) throw error;
      return res.json(toCamelProduct(data));
    }

    products = products.map((item) => (String(item.id) === String(req.params.id) ? product : item));
    return res.json(product);
  } catch (error) {
    console.error('Product update error:', error);
    return res.status(500).json({ message: 'Unable to update product.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const existing = await getProduct(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Product not found.' });

    if (hasSupabase()) {
      const { error } = await supabase.from(productsTable).delete().eq('id', req.params.id);
      if (error) throw error;
    } else {
      products = products.filter((item) => String(item.id) !== String(req.params.id));
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Product delete error:', error);
    return res.status(500).json({ message: 'Unable to delete product.' });
  }
});

export default router;
