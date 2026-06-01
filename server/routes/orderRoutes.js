import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from './adminRoutes.js';

const router = express.Router();
const ordersTable = process.env.SUPABASE_ORDERS_TABLE || 'orders';
const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;

let orders = [];

const toOrder = (order) => ({
  id: String(order.id || order._id),
  _id: String(order.id || order._id),
  customerName: order.customer_name || order.customerName || '',
  customerEmail: order.customer_email || order.customerEmail || '',
  customerPhone: order.customer_phone || order.customerPhone || '',
  address: order.address || {},
  products: order.items || order.products || [],
  subtotal: Number(order.subtotal || 0),
  shipping: Number(order.shipping || 0),
  tax: Number(order.tax || 0),
  total: Number(order.total || 0),
  status: order.status || 'Pending',
  paymentStatus: order.payment_status || order.paymentStatus || 'pending',
  razorpayOrderId: order.razorpay_order_id || order.razorpayOrderId || '',
  razorpayPaymentId: order.razorpay_payment_id || order.razorpayPaymentId || '',
  createdAt: order.created_at || order.createdAt || new Date().toISOString(),
});

const toDbOrder = (order) => ({
  customer_name: order.customerName,
  customer_email: order.customerEmail,
  customer_phone: order.customerPhone,
  address: order.address,
  items: order.products,
  subtotal: order.subtotal,
  shipping: order.shipping,
  tax: order.tax,
  total: order.total,
  status: order.status,
  payment_status: order.paymentStatus,
  razorpay_order_id: order.razorpayOrderId,
  razorpay_payment_id: order.razorpayPaymentId,
});

export const createStoreOrder = async (payload) => {
  const orderId = crypto.randomUUID();
  const order = {
    id: orderId,
    _id: orderId,
    customerName: payload.customerName,
    customerEmail: payload.customerEmail,
    customerPhone: payload.customerPhone,
    address: payload.address,
    products: payload.products || [],
    subtotal: Number(payload.subtotal || 0),
    shipping: Number(payload.shipping || 0),
    tax: Number(payload.tax || 0),
    total: Number(payload.total || 0),
    status: 'Pending',
    paymentStatus: payload.paymentStatus || 'paid',
    razorpayOrderId: payload.razorpayOrderId || '',
    razorpayPaymentId: payload.razorpayPaymentId || '',
    createdAt: new Date().toISOString(),
  };

  if (supabase) {
    const { data, error } = await supabase
      .from(ordersTable)
      .insert(toDbOrder(order))
      .select('*')
      .single();
    if (error) throw error;
    return toOrder(data);
  }

  orders = [order, ...orders];
  return order;
};

router.get('/', requireAdmin, async (req, res) => {
  try {
    if (supabase) {
      const { data, error } = await supabase.from(ordersTable).select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return res.json((data || []).map(toOrder));
    }
    return res.json(orders);
  } catch (error) {
    console.error('Order fetch error:', error);
    return res.status(500).json({ message: 'Unable to load orders.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const order = await createStoreOrder({ ...req.body, paymentStatus: req.body.paymentStatus || 'pending' });
    return res.status(201).json(order);
  } catch (error) {
    console.error('Order create error:', error);
    return res.status(500).json({ message: 'Unable to create order.' });
  }
});

router.put('/:id/status', requireAdmin, async (req, res) => {
  const allowed = ['Pending', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];
  const status = req.body.status;
  if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid order status.' });

  try {
    if (supabase) {
      const { data, error } = await supabase.from(ordersTable).update({ status }).eq('id', req.params.id).select('*').single();
      if (error) throw error;
      return res.json(toOrder(data));
    }

    orders = orders.map((order) => (String(order.id) === String(req.params.id) ? { ...order, status } : order));
    return res.json(orders.find((order) => String(order.id) === String(req.params.id)));
  } catch (error) {
    console.error('Order status error:', error);
    return res.status(500).json({ message: 'Unable to update order.' });
  }
});

export default router;
