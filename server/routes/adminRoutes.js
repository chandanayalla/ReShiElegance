import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@reshi.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-me';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// Simple admin login route — compares against env creds and returns a JWT
router.post('/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const token = jwt.sign({ email, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });

  return res.json({ admin: { email }, token });
});

export default router;
