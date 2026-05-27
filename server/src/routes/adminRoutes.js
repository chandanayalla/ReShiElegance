import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { db } from '../firebase.js';

dotenv.config();

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const snapshot = await db.collection('admins').where('email', '==', email).limit(1).get();

    if (snapshot.empty) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const adminDoc = snapshot.docs[0];
    const admin = adminDoc.data();
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: adminDoc.id }, process.env.JWT_SECRET, { expiresIn: '6h' });
    res.json({ token, admin: { name: admin.name, email: admin.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to complete login.' });
  }
});

export default router;
