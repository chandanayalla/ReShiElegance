import React from 'react';
import { Link } from 'react-router-dom';

const ProductTable = ({ products = [], onDelete }) => {
  return (
    <div className="table-responsive admin-card">
      <table className="table table-borderless align-middle mb-0 admin-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Status</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center text-muted py-4">
                No products available yet.
              </td>
            </tr>
          ) : (
            products.map((product) => {
              const productId = product.id || product._id;
              return (
                <tr key={productId}>
                  <td style={{ width: '96px' }}>
                    <img
                      src={product.images?.[0] || 'https://via.placeholder.com/80'}
                      alt={product.name}
                      className="rounded-3 product-thumb"
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                      {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="text-end">
                    <Link to={`/admin/products/edit/${productId}`} className="btn btn-sm btn-pink me-2">
                      Edit
                    </Link>
                    <button type="button" className="btn btn-sm btn-soft-danger" onClick={() => onDelete(productId)}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
