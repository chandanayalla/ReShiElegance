import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import api from '../../services/api';
import ProductForm from '../../components/ProductForm';

const AddProduct = () => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSave = async (formData) => {
    try {
      setSaving(true);
      setError('');
      await api.post('/products/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/admin/products');
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to save product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-4">
        <p className="text-uppercase text-muted small mb-1">Add Product</p>
        <h2 className="mb-0">New Collection Item</h2>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      <ProductForm onSubmit={handleSave} loading={saving} />
    </AdminLayout>
  );
};

export default AddProduct;
