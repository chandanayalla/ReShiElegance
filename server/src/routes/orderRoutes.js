import express from 'express';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { db } from '../firebase.js';

const router = express.Router();

router.get('/', protectAdmin, async (req, res) => {
  try {
    const snapshot = await db.collection('orders').orderBy('createdAt', 'desc').get();
    const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to load orders.' });
  }
});

router.put('/:id/status', protectAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const docRef = db.collection('orders').doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    await docRef.update({ status, updatedAt: new Date().toISOString() });
    const updatedDoc = await docRef.get();
    res.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to update order.' });
  }
});

export default router;
