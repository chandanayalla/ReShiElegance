import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from './adminRoutes.js';
import nodemailer from 'nodemailer';

const router = express.Router();
const ordersTable = process.env.SUPABASE_ORDERS_TABLE || 'orders';
const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
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

const toOrder = (order) => ({
  id: String(order.id || order._id),
  _id: String(order.id || order._id),
  customerName: order.customer_name || order.customerName || '',
  customerEmail: order.customer_email || order.customerEmail || '',
  customerPhone: order.customer_phone || order.customerPhone || '',
  address: order.address || {},
  products: normalizeProducts(order.items || order.products),
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
    products: normalizeProducts(payload.products),
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

    // Notify admin via email about the new order (best-effort)
    (async () => {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        });

        const itemsHtml = (order.products || [])
          .map((p) => `<li>${p.name || p.title || 'Product'} — Qty: ${p.quantity || p.qty || 1} — ₹${p.price || p.amount || ''}</li>`)
          .join('');

        const adminMailOptions = {
          from: process.env.EMAIL_USER,
          to: 'reshielegancee@gmail.com',
          subject: `New Order Received — ${order.id}`,
          html: `
            <div style="font-family: Arial, sans-serif; line-height:1.4; color:#222;">
              <h2 style="color:#b3476f">New Order Received</h2>
              <p><strong>Order ID:</strong> ${order.id}</p>
              <p><strong>Customer:</strong> ${order.customerName || order.customer_name || ''} (${order.customerEmail || order.customer_email || ''})</p>
              <p><strong>Phone:</strong> ${order.customerPhone || order.customer_phone || ''}</p>
              <h4>Shipping Address</h4>
              <pre style="background:#f7f7f7; padding:10px; border-radius:4px">${JSON.stringify(order.address || {}, null, 2)}</pre>
              <h4>Items</h4>
              <ul>${itemsHtml}</ul>
              <table style="width:100%; max-width:480px; border-collapse:collapse; margin-top:10px;">
                <tr><td style="padding:6px"><strong>Subtotal:</strong></td><td style="padding:6px">₹${order.subtotal}</td></tr>
                <tr><td style="padding:6px"><strong>Shipping:</strong></td><td style="padding:6px">₹${order.shipping}</td></tr>
                <tr><td style="padding:6px"><strong>Tax:</strong></td><td style="padding:6px">₹${order.tax}</td></tr>
                <tr style="border-top:1px solid #ddd"><td style="padding:6px"><strong>Total:</strong></td><td style="padding:6px">₹${order.total}</td></tr>
              </table>
              <p style="margin-top:12px">View orders in your admin panel to process this order.</p>
            </div>
          `,
        };

        await transporter.sendMail(adminMailOptions);

        // Send confirmation to the customer (if email provided)
        if (order.customerEmail) {
          try {
            const userMailOptions = {
              from: process.env.EMAIL_USER,
              to: order.customerEmail,
              subject: `Order Confirmation — ${order.id}`,
              html: `
                <div style="font-family: Arial, sans-serif; color:#222;">
                  <h2 style="color:#b3476f">Thank you for your order!</h2>
                  <p>Hi ${order.customerName || 'Customer'},</p>
                  <p>We have received your order <strong>${order.id}</strong>. Here are the details:</p>
                  <h4>Items</h4>
                  <ul>${itemsHtml}</ul>
                  <p><strong>Total:</strong> ₹${order.total}</p>
                  <p>We will notify you when your order is shipped.</p>
                  <p>Regards,<br/>ReShi Elegance</p>
                </div>
              `,
            };

            await transporter.sendMail(userMailOptions);
          } catch (userMailErr) {
            console.error('Failed to send customer confirmation email:', userMailErr);
          }
        }
      } catch (mailErr) {
        console.error('Failed to send order notification email:', mailErr);
      }
    })();

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
