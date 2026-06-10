import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

const createToken = (admin) => jwt.sign(admin, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '8h' });

export const requireAdmin = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';

  if (!token) {
    return res.status(401).json({ message: 'Admin authentication required.' });
  }

  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired admin session.' });
  }
};

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL || 'reshielegance@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Rs@12345678';

  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({ message: 'Invalid admin credentials.' });
  }

  const admin = { email: adminEmail, name: 'ReShi Admin', role: 'admin' };
  return res.json({ admin, token: createToken(admin) });
});

router.get('/me', requireAdmin, (req, res) => {
  res.json({ admin: req.admin });
});

export default router;
