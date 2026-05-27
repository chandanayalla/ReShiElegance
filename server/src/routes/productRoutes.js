import express from 'express';
import multer from 'multer';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { bucket, db } from '../firebase.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const uploadImage = async (file) => {
  const filename = `products/${Date.now()}-${Math.random().toString(36).slice(2)}-${file.originalname.replace(/\s+/g, '_')}`;
  const fileUpload = bucket.file(filename);

  await fileUpload.save(file.buffer, {
    metadata: { contentType: file.mimetype },
    public: true,
  });

  await fileUpload.makePublic();
  return `https://storage.googleapis.com/${bucket.name}/${filename}`;
};

router.get('/', protectAdmin, async (req, res) => {
  try {
    const snapshot = await db.collection('products').orderBy('createdAt', 'desc').get();
    const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to load products.' });
  }
});

router.get('/:id', protectAdmin, async (req, res) => {
  try {
    const doc = await db.collection('products').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to load product.' });
  }
});

router.post('/', protectAdmin, upload.array('images'), async (req, res) => {
  try {
    if (req.files && req.files.length > 4) {
      return res.status(400).json({ message: 'You can upload a maximum of 4 images.' });
    }

    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const imageUrl = await uploadImage(file);
        images.push(imageUrl);
      }
    }

    const productData = {
      name: req.body.name,
      category: req.body.category,
      price: Number(req.body.price),
      stock: Number(req.body.stock),
      status: req.body.status,
      description: req.body.description,
      images,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await db.collection('products').add(productData);
    const doc = await docRef.get();
    res.status(201).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to create product.' });
  }
});

router.put('/:id', protectAdmin, upload.array('images'), async (req, res) => {
  try {
    const docRef = db.collection('products').doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const existingImages = req.body.existingImages ? JSON.parse(req.body.existingImages) : [];
    if (existingImages.length + (req.files?.length || 0) > 4) {
      return res.status(400).json({ message: 'You can keep a maximum of 4 images per product.' });
    }

    const images = [...existingImages];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const imageUrl = await uploadImage(file);
        images.push(imageUrl);
      }
    }

    const updatedData = {
      name: req.body.name,
      category: req.body.category,
      price: Number(req.body.price),
      stock: Number(req.body.stock),
      status: req.body.status,
      description: req.body.description,
      images,
      updatedAt: new Date().toISOString(),
    };

    await docRef.update(updatedData);
    const updatedDoc = await docRef.get();
    res.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to update product.' });
  }
});

router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    const docRef = db.collection('products').doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    await docRef.delete();
    res.json({ message: 'Product deleted.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to delete product.' });
  }
});

export default router;
