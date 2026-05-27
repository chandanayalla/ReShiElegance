import React, { useEffect, useState } from 'react';

const categoryOptions = ['Sarees', 'Blouses', 'Lehengas', 'Accessories', 'New Arrivals'];
const statusOptions = ['In Stock', 'Out of Stock'];

const ProductForm = ({ initialValues = null, onSubmit, loading = false }) => {
  const [values, setValues] = useState({
    name: '',
    category: 'Sarees',
    price: '',
    stock: '',
    status: 'In Stock',
    description: '',
    existingImages: [],
    newImages: [],
  });
  const [newPreviews, setNewPreviews] = useState([]);
  const [imageError, setImageError] = useState('');

  useEffect(() => {
    if (initialValues) {
      setValues({
        name: initialValues.name || '',
        category: initialValues.category || 'Sarees',
        price: initialValues.price || '',
        stock: initialValues.stock || '',
        status: initialValues.status || 'In Stock',
        description: initialValues.description || '',
        existingImages: initialValues.images || [],
        newImages: [],
      });
      setNewPreviews([]);
    }
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setImageError('');
    const currentTotal = values.existingImages.length + values.newImages.length;
    const allowed = Math.max(0, 4 - currentTotal);
    if (allowed === 0) {
      setImageError('You can upload a maximum of 4 images per product.');
      return;
    }

    const selectedFiles = files.slice(0, allowed);
    if (files.length > allowed) {
      setImageError('Only the first 4 images are accepted.');
    }

    setValues((prev) => ({ ...prev, newImages: [...prev.newImages, ...selectedFiles] }));
    setNewPreviews((prev) => [...prev, ...selectedFiles.map((file) => URL.createObjectURL(file))]);
  };

  const removeExistingImage = (index) => {
    setValues((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter((_, i) => i !== index),
    }));
  };

  const removeNewImage = (index) => {
    setValues((prev) => ({
      ...prev,
      newImages: prev.newImages.filter((_, i) => i !== index),
    }));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('category', values.category);
    formData.append('price', values.price);
    formData.append('stock', values.stock);
    formData.append('status', values.status);
    formData.append('description', values.description);
    formData.append('existingImages', JSON.stringify(values.existingImages));
    values.newImages.forEach((file) => {
      formData.append('images', file);
    });
    onSubmit(formData);
  };

  return (
    <form className="admin-card p-4" onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-12 col-md-6">
          <label className="form-label">Product Name</label>
          <input
            type="text"
            name="name"
            className="form-control rounded-4"
            value={values.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label">Category</label>
          <select name="category" className="form-select rounded-4" value={values.category} onChange={handleChange}>
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12 col-md-4">
          <label className="form-label">Price</label>
          <input
            type="number"
            name="price"
            className="form-control rounded-4"
            value={values.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="col-12 col-md-4">
          <label className="form-label">Stock Quantity</label>
          <input
            type="number"
            name="stock"
            className="form-control rounded-4"
            value={values.stock}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div className="col-12 col-md-4">
          <label className="form-label">Status</label>
          <select name="status" className="form-select rounded-4" value={values.status} onChange={handleChange}>
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12">
          <label className="form-label">Short Description</label>
          <textarea
            name="description"
            className="form-control rounded-4"
            rows="4"
            value={values.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-12">
          <label className="form-label">Product Images</label>
          <input
            type="file"
            className="form-control rounded-4"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
          <small className="text-muted">You can upload up to 4 images total.</small>
          {imageError && <div className="text-danger mt-2">{imageError}</div>}
        </div>

        {values.existingImages.length > 0 && (
          <div className="col-12">
            <div className="image-preview-grid">
              {values.existingImages.map((image, index) => (
                <div className="image-preview-card" key={image + index}>
                  <img src={image} alt={`Product ${index + 1}`} />
                  <button type="button" className="btn btn-sm btn-soft-danger" onClick={() => removeExistingImage(index)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {newPreviews.length > 0 && (
          <div className="col-12">
            <div className="image-preview-grid">
              {newPreviews.map((preview, index) => (
                <div className="image-preview-card" key={preview + index}>
                  <img src={preview} alt={`Upload ${index + 1}`} />
                  <button type="button" className="btn btn-sm btn-soft-danger" onClick={() => removeNewImage(index)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="col-12 d-flex gap-3 flex-wrap mt-3">
          <button type="submit" className="btn btn-primary rounded-pill px-4" disabled={loading}>
            {loading ? 'Saving...' : 'Save Product'}
          </button>
          <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => window.history.back()}>
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
