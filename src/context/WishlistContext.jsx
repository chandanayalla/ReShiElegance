import React, { createContext, useState, useCallback } from 'react';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem('wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const addToWishlist = useCallback((product) => {
    setWishlistItems(prev => {
      if (prev.find(item => item.id === product.id)) {
        return prev;
      }
      const updated = [...prev, product];
      localStorage.setItem('wishlist', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeFromWishlist = useCallback((productId) => {
    setWishlistItems(prev => {
      const updated = prev.filter(item => item.id !== productId);
      localStorage.setItem('wishlist', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const toggleWishlist = useCallback((product) => {
    setWishlistItems(prev => {
      const exists = prev.find(item => item.id === product.id);
      let updated;
      if (exists) {
        updated = prev.filter(item => item.id !== product.id);
      } else {
        updated = [...prev, product];
      }
      localStorage.setItem('wishlist', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isInWishlist = useCallback((productId) => {
    return wishlistItems.some(item => item.id === productId);
  }, [wishlistItems]);

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
