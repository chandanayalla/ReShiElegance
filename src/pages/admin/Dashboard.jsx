import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import api from '../../services/api';
import { readArrayResponse } from '../../utils/apiData';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [productResponse, orderResponse] = await Promise.all([api.get('/products'), api.get('/orders')]);
      setProducts(readArrayResponse(productResponse.data));
      setOrders(readArrayResponse(orderResponse.data));
    } catch (error) {
      console.error('Dashboard loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <AdminLayout>
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 gap-3">
        <div>
          <p className="text-uppercase text-muted small mb-1">Admin Dashboard</p>
          <h2 className="mb-0">ReShi Elegance</h2>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12 col-md-4">
          <div className="admin-card p-4">
            <p className="text-uppercase text-muted small mb-2">Total Products</p>
            <h3 className="mb-0">{loading ? '...' : products.length}</h3>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="admin-card p-4">
            <p className="text-uppercase text-muted small mb-2">Total Orders</p>
            <h3 className="mb-0">{loading ? '...' : orders.length}</h3>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="admin-card p-4">
            <p className="text-uppercase text-muted small mb-2">Stock Items</p>
            <h3 className="mb-0">{loading ? '...' : products.filter((item) => item.stock > 0).length}</h3>
          </div>
        </div>
      </div>

      <div className="admin-card p-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h5 className="mb-1">Recent Orders</h5>
            <p className="text-muted mb-0">Quick view of the latest order statuses.</p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-borderless align-middle mb-0">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Products</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">
                    No recent orders yet.
                  </td>
                </tr>
              ) : (
                orders.slice(0, 5).map((order) => (
                  <tr key={order.id || order._id}>
                    <td>{String(order.id || order._id).slice(-8).toUpperCase()}</td>
                    <td>{order.customerName}</td>
                    <td>{(order.products || []).map((item) => item.name).join(', ')}</td>
                    <td>
                      <span className={`badge ${order.status === 'Delivered' ? 'bg-success' : order.status === 'Shipped' ? 'bg-warning' : 'bg-secondary'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
