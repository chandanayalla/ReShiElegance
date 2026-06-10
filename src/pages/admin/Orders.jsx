import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import api from '../../services/api';
import { readArrayResponse } from '../../utils/apiData';

const statusOptions = ['Pending', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(readArrayResponse(response.data));
    } catch (error) {
      console.error('Order load error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      setOrders((prevOrders) => prevOrders.map((order) => ((order.id || order._id) === orderId ? { ...order, status } : order)));
    } catch (error) {
      console.error('Order update error:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-4">
        <p className="text-uppercase text-muted small mb-1">Order Management</p>
        <h2 className="mb-0">Orders</h2>
      </div>

      {loading ? (
        <div className="admin-card p-4 text-center">Loading orders...</div>
      ) : (
        <div className="admin-card p-4 table-responsive">
          <table className="table table-borderless align-middle mb-0">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Products</th>
                <th>Status</th>
                <th className="text-end">Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    No orders have been placed yet.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id || order._id}>
                    <td>{String(order.id || order._id).slice(-8).toUpperCase()}</td>
                    <td>{order.customerName}</td>
                    <td>{(order.products || []).map((item) => item.name).join(', ')}</td>
                    <td>{order.status}</td>
                    <td className="text-end">
                      <select
                        className="form-select rounded-pill w-auto d-inline-block me-2"
                        value={order.status}
                        onChange={(event) => handleStatusChange(order.id || order._id, event.target.value)}
                      >
                        {statusOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default Orders;
