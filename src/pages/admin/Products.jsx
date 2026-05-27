import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import api from '../../services/api';
import ProductTable from '../../components/ProductTable';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data || []);
    } catch (error) {
      console.error('Product load error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (productId) => {
    const confirmed = window.confirm('Delete this product permanently?');
    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/products/${productId}`);
      loadProducts();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 gap-3">
        <div>
          <p className="text-uppercase text-muted small mb-1">Product Management</p>
          <h2 className="mb-0">Products</h2>
        </div>
        <button className="btn btn-primary rounded-pill" onClick={() => navigate('/admin/products/add')}>
          <i className="bi bi-plus-lg me-2"></i>Add Product
        </button>
      </div>

      {loading ? (
        <div className="admin-card p-4 text-center">Loading products...</div>
      ) : (
        <ProductTable products={products} onDelete={handleDelete} />
      )}
    </AdminLayout>
  );
};

export default Products;
