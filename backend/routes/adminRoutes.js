import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const DEFAULT_ADMIN_EMAIL = 'admin@reshi.com';
const DEFAULT_ADMIN_PASSWORD = 'change-me';
const ADMIN_EMAIL = String(process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).trim();
const ADMIN_PASSWORD = String(process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD).trim();

const normalizeEmail = (value = '') => String(value).trim().toLowerCase();
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
  const email = String(req.body?.email ?? '').trim();
  const password = String(req.body?.password ?? '').trim();

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const emailMatches = normalizeEmail(email) === normalizeEmail(ADMIN_EMAIL);
  const passwordMatches = password === ADMIN_PASSWORD;

  if (!emailMatches || !passwordMatches) {
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
