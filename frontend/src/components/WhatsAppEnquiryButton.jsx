import React from 'react';
import { WHATSAPP_ADMIN_NUMBER } from '../config/store';
import './WhatsAppEnquiryButton.css';

const WhatsAppEnquiryButton = ({ product }) => {
  if (!product || !WHATSAPP_ADMIN_NUMBER) return null;

  const image = product.images?.[0] || product.image || '';
  const imageUrl = image.startsWith('http') ? image : new URL(image, window.location.origin).href;
  const productUrl = `${window.location.origin}/product/${product.searchId || product.id}`;
  const message = [
    'Hello ReShi Elegance! 👋',
    '',
    'I am interested in this product:',
    '',
    `Product: ${product.name}`,
    `Product ID: ${product.searchId || product.id}`,
    `Category: ${product.category || product.productType || 'Jewellery'}`,
    `Price: ₹${Number(product.price || 0).toLocaleString('en-IN')}`,
    '',
    `Product Link: ${productUrl}`,
    `Product Image: ${imageUrl}`,
    '',
    'Please share more details about this item. 😊',
    '',
    'Thank you! 🌸',
  ].join('\n');

  return (
    <div className="whatsapp-enquiry-wrap">
      <a
        className="whatsapp-enquiry-button"
        href={`https://api.whatsapp.com/send?phone=${WHATSAPP_ADMIN_NUMBER}&text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className="bi bi-whatsapp" aria-hidden="true"></i>
        Enquire on WhatsApp
      </a>
      <small>Need more details? We&apos;re happy to help.</small>
    </div>
  );
};

export default WhatsAppEnquiryButton;
