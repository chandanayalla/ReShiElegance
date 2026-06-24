import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@reshi.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-me';

const createToken = (admin) => jwt.sign(admin, JWT_SECRET, { expiresIn: '8h' });

export const requireAdmin = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';

  if (!token) return res.status(401).json({ message: 'Admin authentication required.' });

  try {
    req.admin = jwt.verify(token, JWT_SECRET);
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired admin session.' });
  }
};

// Admin login
router.post('/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const admin = { email: ADMIN_EMAIL, name: 'ReShi Admin', role: 'admin' };
  const token = createToken(admin);

  return res.json({ admin, token });
});

router.get('/me', requireAdmin, (req, res) => {
  res.json({ admin: req.admin });
});

export default router;
