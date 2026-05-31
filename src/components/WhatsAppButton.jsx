import React from 'react';
import './WhatsAppButton.css';

const WhatsAppButton = () => {
  const phone = (import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/[^0-9]/g, '');
  const rawMessage = import.meta.env.VITE_WHATSAPP_MESSAGE || 'Hi, I need help with an order.';

  const defaultMessage = (() => {
    try {
      return decodeURIComponent(rawMessage);
    } catch {
      return rawMessage;
    }
  })();

  if (!phone) return null;

  const href = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(defaultMessage)}`;

  return (
    <a
      className="whatsapp-button"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact support on WhatsApp"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
        <path d="M20.52 3.48A11.94 11.94 0 0012 0C5.373 0 .012 5.373 0 12c0 2.115.554 4.182 1.606 6.004L0 24l6.247-1.61A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12 0-3.208-1.248-6.214-3.48-8.52zM12 21.5c-1.9 0-3.742-.5-5.34-1.44l-.38-.22-3.71.96.99-3.61-.25-.38A9.44 9.44 0 012.5 12c0-5.247 4.253-9.5 9.5-9.5S21.5 6.753 21.5 12 17.247 21.5 12 21.5z" />
        <path d="M17.01 14.46c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14s-.7.9-.86 1.08c-.16.18-.32.2-.6.07a7.04 7.04 0 01-2.08-1.28c-.39-.35-.65-.78-.72-1.06-.07-.27-.01-.48.2-.63.2-.15.45-.38.67-.58.22-.2.3-.36.45-.6.15-.24.07-.46-.03-.63-.1-.18-.61-1.47-.84-2.02-.22-.53-.45-.46-.62-.47-.16-.01-.34-.01-.52-.01s-.5.07-.76.36c-.26.29-1 1-1 2.44s1.03 2.83 1.17 3.03c.14.2 2.02 3.08 4.9 4.31 2.16.93 2.68.98 3.64.82.56-.1 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.18-.53-.31z" />
      </svg>
    </a>
  );
};

export default WhatsAppButton;
