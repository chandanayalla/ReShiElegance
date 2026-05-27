import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { db } from '../firebase.js';

dotenv.config();

export const protectAdmin = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  const token = authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminDoc = await db.collection('admins').doc(decoded.id).get();
    if (!adminDoc.exists) {
      return res.status(401).json({ message: 'Invalid auth token.' });
    }

    const { password, ...adminData } = adminDoc.data();
    req.admin = { id: adminDoc.id, ...adminData };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid auth token.' });
  }
};
