import express from 'express';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { createStoreOrder } from './orderRoutes.js';

const router = express.Router();
const paymentsTable = process.env.SUPABASE_PAYMENTS_TABLE || 'payments';
const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  && !process.env.SUPABASE_URL.includes('your-project')
  && !process.env.SUPABASE_SERVICE_ROLE_KEY.includes('your-service-role-key')
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;

const payments = [];

const razorpayAuthHeader = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  return `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`;
};

const hasValidRazorpayKeys = () => {
  const keyId = process.env.RAZORPAY_KEY_ID || '';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
  return Boolean(
    keyId
    && keySecret
    && keyId.startsWith('rzp_')
    && !keyId.includes('your_key')
    && !keyId.includes('xxxxxxxx')
    && !keySecret.includes('your_razorpay')
    && !keySecret.includes('your-razorpay')
  );
};

const savePayment = async ({ order, razorpayOrderId, razorpayPaymentId, razorpaySignature, status }) => {
  const payment = {
    order_id: order.id,
    razorpay_order_id: razorpayOrderId,
    razorpay_payment_id: razorpayPaymentId,
    razorpay_signature: razorpaySignature,
    status,
    amount: order.total,
  };

  if (supabase) {
    const { error } = await supabase.from(paymentsTable).insert(payment);
    if (error) throw error;
  } else {
    payments.push({ id: crypto.randomUUID(), ...payment, created_at: new Date().toISOString() });
  }
};

router.post('/razorpay/order', async (req, res) => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const amount = Math.round(Number(req.body.amount || 0) * 100);

  if (!hasValidRazorpayKeys()) {
    return res.status(500).json({
      message: 'Razorpay keys are placeholders. Add real RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in server/.env, then restart the backend.',
    });
  }

  if (amount <= 0) {
    return res.status(400).json({ message: 'Invalid payment amount.' });
  }

  try {
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: razorpayAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency: 'INR',
        receipt: `reshi_${Date.now()}`,
        notes: { source: 'ReShi Elegance checkout' },
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ message: data.error?.description || 'Razorpay order creation failed.' });
    }

    return res.json({ ...data, keyId });
  } catch (error) {
    console.error('Razorpay order error:', error);
    return res.status(500).json({ message: 'Unable to create Razorpay order.' });
  }
});

router.post('/razorpay/verify', async (req, res) => {
  const {
    razorpay_order_id: razorpayOrderId,
    razorpay_payment_id: razorpayPaymentId,
    razorpay_signature: razorpaySignature,
    order,
  } = req.body;

  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  if (!razorpaySignature || expected !== razorpaySignature) {
    return res.status(400).json({ message: 'Payment verification failed.' });
  }

  try {
    const savedOrder = await createStoreOrder({
      ...order,
      paymentStatus: 'paid',
      razorpayOrderId,
      razorpayPaymentId,
    });
    await savePayment({
      order: savedOrder,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      status: 'paid',
    });

    return res.json({ verified: true, order: savedOrder });
  } catch (error) {
    console.error('Verified order save error:', error);
    return res.status(500).json({ message: 'Payment verified, but order could not be saved.' });
  }
});

router.post('/razorpay/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!secret) return res.status(200).json({ received: true });

  const expected = crypto.createHmac('sha256', secret).update(req.body).digest('hex');
  if (expected !== signature) return res.status(400).json({ message: 'Invalid webhook signature.' });

  return res.status(200).json({ received: true });
});

export default router;
