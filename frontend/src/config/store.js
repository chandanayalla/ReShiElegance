const configuredWhatsAppNumber = import.meta.env.VITE_WHATSAPP_ADMIN_NUMBER || import.meta.env.VITE_WHATSAPP_NUMBER || '+91 7815861896';

export const WHATSAPP_ADMIN_NUMBER = configuredWhatsAppNumber.replace(/[^0-9]/g, '');
