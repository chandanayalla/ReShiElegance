import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import api from '../../services/api';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!name || !price || !stock || !description || !imageFile) {
      setError('Please fill all fields and choose an image.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('description', description);
    formData.append('image', imageFile);

    try {
      setSaving(true);
      await api.post('/products/add', formData);
      navigate('/admin/products');
    } catch (error) {
      console.error('Add product error:', error);
      setError('Unable to save product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-4">
        <p className="text-uppercase text-muted small mb-1">Add Product</p>
        <h2 className="mb-0">New Item</h2>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="admin-card p-4 bg-white rounded-4 shadow-sm">
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label">Product Name</label>
            <input
              type="text"
              className="form-control rounded-4"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label">Price</label>
            <input
              type="number"
              className="form-control rounded-4"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              required
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label">Stock</label>
            <input
              type="number"
              className="form-control rounded-4"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              min="0"
              required
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label">Product Image</label>
            <input
              type="file"
              className="form-control rounded-4"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0] || null)}
              required
            />
          </div>

          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea
              className="form-control rounded-4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              required
            />
          </div>

          <div className="col-12 d-flex gap-3 flex-wrap mt-3">
            <button type="submit" className="btn btn-primary rounded-pill px-4" disabled={saving}>
              {saving ? 'Saving...' : 'Save Product'}
            </button>
            <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => navigate('/admin/products')}>
              Cancel
            </button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AddProduct;
