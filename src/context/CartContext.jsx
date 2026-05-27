import React, { createContext, useState, useCallback } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const addToCart = useCallback((product, quantity = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      let updated;
      if (existingItem) {
        updated = prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updated = [...prev, { ...product, quantity }];
      }
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems(prev => {
      const updated = prev.filter(item => item.id !== productId);
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    setCartItems(prev => {
      const updated = quantity <= 0
        ? prev.filter(item => item.id !== productId)
        : prev.map(item =>
            item.id === productId
              ? { ...item, quantity }
              : item
          );
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.setItem('cart', JSON.stringify([]));
  }, []);

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
