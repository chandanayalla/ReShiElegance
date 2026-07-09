import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import api from '../../services/api';
import ProductForm from '../../components/ProductForm';

const EditProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Load product error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const handleSave = async (formData) => {
    try {
      setSaving(true);
      await api.put(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/admin/products');
    } catch (error) {
      console.error('Update product error:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-4">
        <p className="text-uppercase text-muted small mb-1">Edit Product</p>
        <h2 className="mb-0">Update Item</h2>
      </div>

      {loading ? (
        <div className="admin-card p-4 text-center">Loading product details...</div>
      ) : (
        <ProductForm initialValues={product} onSubmit={handleSave} loading={saving} />
      )}
    </AdminLayout>
  );
};

export default EditProduct;
