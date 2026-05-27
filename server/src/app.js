import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import debugRoutes from './routes/debugRoutes.js';
import { createDefaultAdmin } from './utils/seedAdmin.js';

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/debug', debugRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'ReShi Elegance admin API is running.' });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await createDefaultAdmin();
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Startup error:', error);
    process.exit(1);
  }
};

startServer();
