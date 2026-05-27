import express from 'express';
import multer from 'multer';
import { db, bucket } from '../firebaseAdmin.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const uploadImageToStorage = async (file) => {
  const safeName = file.originalname.replace(/\s+/g, '_');
  const filename = `products/${Date.now()}-${safeName}`;
  const fileRef = bucket.file(filename);

  await fileRef.save(file.buffer, {
    metadata: {
      contentType: file.mimetype,
    },
  });

  await fileRef.makePublic();
  return `https://storage.googleapis.com/${bucket.name}/${filename}`;
};

router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const { name, price, stock, description } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'Please upload an image file.' });
    }

    const imageUrl = await uploadImageToStorage(file);
    const stockNumber = Number(stock) || 0;
    const status = stockNumber > 0 ? 'In Stock' : 'Out of Stock';

    const product = {
      name: name?.trim() || 'Untitled product',
      price: Number(price) || 0,
      stock: stockNumber,
      description: description?.trim() || '',
      image: imageUrl,
      status,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection('products').add(product);
    const newProduct = { id: docRef.id, ...product };

    return res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    return res.status(500).json({ message: 'Unable to save product.' });
  }
});

router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('products').orderBy('createdAt', 'desc').get();
    const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: 'Unable to load products.' });
  }
});

export default router;