import express from 'express';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from './adminRoutes.js';
import nodemailer from 'nodemailer';

const router = express.Router();
const ordersTable = process.env.SUPABASE_ORDERS_TABLE || 'orders';
const orderNotificationEmail = process.env.ORDER_NOTIFICATION_EMAIL || 'reshielagancee@gmail.com';
const hasSupabaseConfig = Boolean(
  process.env.SUPABASE_URL
  && process.env.SUPABASE_SERVICE_ROLE_KEY
  && !process.env.SUPABASE_URL.includes('your-project')
  && !process.env.SUPABASE_SERVICE_ROLE_KEY.includes('your-service-role-key')
);
const supabase = hasSupabaseConfig
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;

let orders = [];

const normalizeProducts = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return Array.isArray(value.items) ? value.items : [];
};

const parseAddress = (value) => {
  if (!value) return {};
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return { line1: String(value) };
  }
};

const createOrderId = (razorpayOrderId) => {
  const digest = crypto.createHash('sha256').update(String(razorpayOrderId)).digest('hex').slice(0, 8).toUpperCase();
  return `RE${digest}`;
};

const toOrder = (order) => ({
  id: String(order.order_id || order.id || order._id),
  _id: String(order.order_id || order.id || order._id),
  databaseId: order.id ? String(order.id) : '',
  customerName: order.customer_name || order.customerName || '',
  customerEmail: order.email || order.customer_email || order.customerEmail || '',
  customerPhone: order.phone || order.customer_phone || order.customerPhone || '',
  address: parseAddress(order.address),
  products: normalizeProducts(order.items || order.products),
  subtotal: Number(order.subtotal || order.total_amount || 0),
  shipping: 0,
  tax: 0,
  total: Number(order.total_amount || order.total || order.subtotal || 0),
  status: order.order_status || order.status || 'Pending',
  paymentStatus: order.payment_status || order.paymentStatus || 'Pending',
  razorpayOrderId: order.razorpay_order_id || '',
  razorpayPaymentId: order.razorpay_payment_id || '',
  createdAt: order.created_at || order.createdAt || new Date().toISOString(),
});

const toDbOrder = (order) => ({
  order_id: order.id,
  customer_name: order.customerName,
  phone: order.customerPhone,
  email: order.customerEmail || null,
  address: JSON.stringify(order.address || {}),
  items: order.products,
  total_amount: order.total,
  payment_status: order.paymentStatus,
  order_status: order.status,
});

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

export const sendOrderEmails = async (order) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error('Order email not sent: EMAIL_USER and EMAIL_PASSWORD are required.');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const itemsHtml = (order.products || []).map((product) => {
    const image = product.images?.[0] || product.image || product.imageUrl || '';
    const imageHtml = image
      ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(product.name || product.title || 'Product')}" style="width:90px;height:90px;object-fit:cover;border-radius:6px;display:block;" />`
      : '<span>No image available</span>';
    return `<tr>
      <td style="padding:8px;border-bottom:1px solid #eee;">${imageHtml}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;"><strong>${escapeHtml(product.name || product.title || 'Product')}</strong><br/>Qty: ${product.quantity || product.qty || 1}<br/>Price: ₹${product.price || product.amount || ''}</td>
    </tr>`;
  }).join('');

  const adminMailOptions = {
    from: process.env.EMAIL_USER,
    to: orderNotificationEmail,
    subject: `New ReshiElegance Order - ${order.id}`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.4;color:#222;">
        <h2 style="color:#b3476f">New Order Received</h2>
        <p><strong>Order ID:</strong> ${escapeHtml(order.id)}</p>
        <p><strong>Customer:</strong> ${escapeHtml(order.customerName)} (${escapeHtml(order.customerEmail)})</p>
        <p><strong>Phone:</strong> ${escapeHtml(order.customerPhone)}</p>
        <h4>Shipping Address</h4>
        <pre style="background:#f7f7f7;padding:10px;border-radius:4px">${escapeHtml(JSON.stringify(order.address || {}, null, 2))}</pre>
        <h4>Products</h4>
        <table style="border-collapse:collapse;width:100%;max-width:600px;">${itemsHtml}</table>
        <p><strong>Total:</strong> ₹${order.total}</p>
        <p><strong>Payment Status:</strong> ${escapeHtml(String(order.paymentStatus).toLowerCase() === 'paid' ? 'Paid' : order.paymentStatus)}</p>
        <p><strong>Order status:</strong> ${escapeHtml(order.status)}</p>
      </div>
    `,
  };

  await transporter.sendMail(adminMailOptions);

  if (order.customerEmail) {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: order.customerEmail,
      subject: `Order Confirmation - ${order.id}`,
      html: `<div style="font-family:Arial,sans-serif;color:#222;"><h2 style="color:#b3476f">Thank you for your order!</h2><p>We received your order <strong>${escapeHtml(order.id)}</strong>.</p><table style="border-collapse:collapse;width:100%;max-width:600px;">${itemsHtml}</table><p><strong>Total:</strong> ₹${order.total}</p><p>Regards,<br/>ReShi Elegance</p></div>`,
    });
  }
};

export const createStoreOrder = async (payload) => {
  const orderId = payload.orderId || createOrderId(payload.razorpayOrderId || crypto.randomUUID());
  const subtotal = Number(payload.subtotal || 0);
  const order = {
    id: orderId,
    _id: orderId,
    customerName: payload.customerName,
    customerEmail: payload.customerEmail,
    customerPhone: payload.customerPhone,
    address: payload.address,
    products: normalizeProducts(payload.products),
    subtotal,
    shipping: 0,
    tax: 0,
    total: subtotal,
    status: payload.status || (String(payload.paymentStatus || '').toLowerCase() === 'paid' ? 'Confirmed' : 'Pending'),
    paymentStatus: payload.paymentStatus || 'Paid',
    razorpayOrderId: payload.razorpayOrderId || '',
    razorpayPaymentId: payload.razorpayPaymentId || '',
    createdAt: new Date().toISOString(),
  };

  if (supabase) {
    const { data: existing, error: lookupError } = await supabase
      .from(ordersTable)
      .select('*')
      .eq('order_id', order.id)
      .maybeSingle();
    if (lookupError) throw lookupError;
    if (existing) return { ...toOrder(existing), alreadyExists: true };

    const { data, error } = await supabase
      .from(ordersTable)
      .insert(toDbOrder(order))
      .select('*')
      .single();
    if (error) throw error;
    return { ...toOrder(data), alreadyExists: false };
  }

  orders = [order, ...orders];
  return { ...order, alreadyExists: false };
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
    const order = await createStoreOrder({ ...req.body, paymentStatus: req.body.paymentStatus || 'Pending' });
    void sendOrderEmails(order).catch((mailError) => console.error('Failed to send order notification email:', mailError));

    return res.status(201).json(order);
  } catch (error) {
    console.error('Order create error:', error);
    return res.status(500).json({ message: 'Unable to create order.' });
  }
});

router.put('/:id/status', requireAdmin, async (req, res) => {
  const allowed = ['Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];
  const status = req.body.status;
  if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid order status.' });

  try {
    if (supabase) {
      const { data, error } = await supabase.from(ordersTable).update({ order_status: status }).eq('order_id', req.params.id).select('*').single();
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
