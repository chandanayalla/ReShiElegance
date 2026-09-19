import React, { useEffect, useState } from 'react';

const categoryOptions = ['Sarees', 'Silk Sarees', 'Cotton Sarees', 'Designer Sarees', 'Party Wear Sarees', 'Kurtis', 'Dress Materials', 'Blouses', 'earrings', 'necklaces', 'sets', 'bangles', 'black-beads', 'thali-chains', 'rings', 'bridal', 'New Arrivals', 'Best Sellers'];

const ProductForm = ({ initialValues = null, onSubmit, loading = false }) => {
  const [values, setValues] = useState({
    searchId: '',
    name: '',
    productType: 'clothing',
    category: 'Sarees',
    price: '',
    originalPrice: '',
    stock: '',
    description: '',
    fabric: '',
    work: '',
    occasion: '',
    colors: '',
    isNewArrival: false,
    isBestSeller: false,
    imageItems: [],
  });
  const [imageError, setImageError] = useState('');

  useEffect(() => {
    if (initialValues) {
      setValues({
        searchId: initialValues.searchId || '',
        name: initialValues.name || '',
        productType: initialValues.productType || 'clothing',
        category: initialValues.category || 'Sarees',
        price: initialValues.price || '',
        originalPrice: initialValues.originalPrice || initialValues.price || '',
        stock: initialValues.stock || '',
        description: initialValues.description || '',
        fabric: initialValues.fabric || '',
        work: initialValues.work || '',
        occasion: initialValues.occasion || '',
        colors: (initialValues.colors || []).join(', '),
        isNewArrival: Boolean(initialValues.isNewArrival),
        isBestSeller: Boolean(initialValues.isBestSeller),
        imageItems: (initialValues.images || []).map((url) => ({ kind: 'existing', value: url })),
      });
    }
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setImageError('');
    const allowed = Math.max(0, 8 - values.imageItems.length);
    if (allowed === 0) {
      setImageError('You can upload a maximum of 8 images per product.');
      return;
    }

    const selectedFiles = files.slice(0, allowed);
    if (files.length > allowed) {
      setImageError('Only the first 8 images are accepted.');
    }

    setValues((prev) => ({
      ...prev,
      imageItems: [...prev.imageItems, ...selectedFiles.map((file) => ({
        kind: 'new',
        value: file,
        preview: URL.createObjectURL(file),
      }))],
    }));
  };

  const removeImage = (index) => {
    setValues((prev) => {
      if (prev.imageItems.length <= 1) {
        setImageError('Keep at least one product image.');
        return prev;
      }
      return { ...prev, imageItems: prev.imageItems.filter((_, i) => i !== index) };
    });
  };

  const moveImage = (index, direction) => {
    setValues((prev) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= prev.imageItems.length) return prev;
      const imageItems = [...prev.imageItems];
      [imageItems[index], imageItems[nextIndex]] = [imageItems[nextIndex], imageItems[index]];
      return { ...prev, imageItems };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!values.imageItems.length) {
      setImageError('Please add at least one product image.');
      return;
    }
    const formData = new FormData();
    formData.append('searchId', values.searchId);
    formData.append('name', values.name);
    formData.append('productType', values.productType);
    formData.append('category', values.category);
    formData.append('price', values.price);
    formData.append('originalPrice', values.originalPrice || values.price);
    formData.append('stock', values.stock);
    formData.append('description', values.description);
    formData.append('fabric', values.fabric);
    formData.append('work', values.work);
    formData.append('occasion', values.occasion);
    formData.append('colors', values.colors);
    formData.append('isNewArrival', String(values.isNewArrival));
    formData.append('isBestSeller', String(values.isBestSeller));
    const existingImages = values.imageItems.filter((item) => item.kind === 'existing').map((item) => item.value);
    const imageOrder = [];
    let existingIndex = 0;
    let newIndex = 0;
    values.imageItems.forEach((item) => {
      if (item.kind === 'existing') imageOrder.push({ type: 'existing', index: existingIndex++ });
      else imageOrder.push({ type: 'new', index: newIndex++ });
    });
    formData.append('existingImages', JSON.stringify(existingImages));
    formData.append('imageOrder', JSON.stringify(imageOrder));
    values.imageItems.filter((item) => item.kind === 'new').forEach((item) => formData.append('images', item.value));
    onSubmit(formData);
  };

  return (
    <form className="admin-card p-4" onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-12 col-md-6">
          <label className="form-label">Product Search ID</label>
          <input type="text" className="form-control rounded-4" value={values.searchId || 'Generated when saved'} readOnly />
          <small className="text-muted">Assigned permanently by the system.</small>
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label">Department</label>
          <select name="productType" className="form-select rounded-4" value={values.productType} onChange={handleChange}>
            <option value="clothing">Clothing</option>
            <option value="jewellery">Jewellery</option>
          </select>
        </div>

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
          <label className="form-label">Original Price</label>
          <input
            type="number"
            name="originalPrice"
            className="form-control rounded-4"
            value={values.originalPrice}
            onChange={handleChange}
            min="0"
            step="0.01"
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
          <label className="form-label">Fabric</label>
          <input name="fabric" className="form-control rounded-4" value={values.fabric} onChange={handleChange} placeholder="Pure silk" />
        </div>

        <div className="col-12 col-md-4">
          <label className="form-label">Work</label>
          <input name="work" className="form-control rounded-4" value={values.work} onChange={handleChange} placeholder="Zari, embroidery" />
        </div>

        <div className="col-12 col-md-4">
          <label className="form-label">Occasion</label>
          <input name="occasion" className="form-control rounded-4" value={values.occasion} onChange={handleChange} placeholder="Wedding, festive" />
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label">Colors</label>
          <input name="colors" className="form-control rounded-4" value={values.colors} onChange={handleChange} placeholder="Red, Gold" />
        </div>

        <div className="col-12 col-md-6 d-flex align-items-end gap-4">
          <label className="form-check">
            <input className="form-check-input" type="checkbox" name="isNewArrival" checked={values.isNewArrival} onChange={handleChange} />
            <span className="form-check-label">New Arrival</span>
          </label>
          <label className="form-check">
            <input className="form-check-input" type="checkbox" name="isBestSeller" checked={values.isBestSeller} onChange={handleChange} />
            <span className="form-check-label">Best Seller</span>
          </label>
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
          <p className="text-muted mb-2">Add at least 1 image. You can keep up to 8, and the first image is the primary image.</p>
          <input
            type="file"
            className="form-control rounded-4"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
          <small className="text-muted">Use the arrows below to preserve the customer-facing image order.</small>
          {imageError && <div className="text-danger mt-2">{imageError}</div>}
        </div>

        {values.imageItems.length > 0 && (
          <div className="col-12">
            <div className="image-preview-grid">
              {values.imageItems.map((item, index) => (
                <div className="image-preview-card" key={`${item.kind}-${item.value?.name || item.value}-${index}`}>
                  <img src={item.kind === 'existing' ? item.value : item.preview} alt={`Product ${index + 1}`} />
                  <div className="d-flex gap-1 justify-content-center flex-wrap">
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => moveImage(index, -1)} disabled={index === 0} aria-label="Move image left">←</button>
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => moveImage(index, 1)} disabled={index === values.imageItems.length - 1} aria-label="Move image right">→</button>
                    <button type="button" className="btn btn-sm btn-soft-danger" onClick={() => removeImage(index)}>
                    Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {initialValues && values.imageItems.length < 1 && (
          <div className="col-12"><div className="alert alert-warning mb-0">This product needs at least one image before it can be saved.</div></div>
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
