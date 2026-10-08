import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from './AuthContext';
import { supabase } from '../services/supabase';
import { fetchProductsByIds, mergeCartItems, readStoredItems, resolveStoredProducts, sameCartItem } from '../utils/customerItems';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState(() => readStoredItems('cart'));
  const [syncError, setSyncError] = useState('');
  const previousUserId = useRef(null);
  const remoteQueue = useRef(Promise.resolve());

  const queueRemoteOperation = useCallback((operation) => {
    remoteQueue.current = remoteQueue.current
      .catch(() => undefined)
      .then(operation)
      .catch((error) => {
        setSyncError(error?.message || 'Unable to sync your cart. Your changes are saved on this device and will retry later.');
      });
  }, []);

  const saveCart = useCallback(async (userId, items) => {
    if (!supabase) throw new Error('Supabase is not configured.');
    const rows = items.map((item) => ({ user_id: userId, product_id: item.id, selected_size: item.selectedSize || null, quantity: item.quantity }));

    if (!rows.length) {
      const { error } = await supabase.from('customer_cart_items').delete().eq('user_id', userId);
      if (error) throw error;
      return;
    }

    const { error: deleteError } = await supabase.from('customer_cart_items').delete().eq('user_id', userId);
    if (deleteError) throw deleteError;
    const { error } = await supabase.from('customer_cart_items').insert(rows);
    if (error) throw error;
  }, []);

  useEffect(() => {
    let isActive = true;

    if (authLoading) return () => { isActive = false; };

    if (!user) {
      if (previousUserId.current) {
        setCartItems([]);
        localStorage.removeItem('cart');
      }
      previousUserId.current = null;
      setSyncError('');
      return () => { isActive = false; };
    }

    const localItems = previousUserId.current ? [] : readStoredItems('cart');
    previousUserId.current = user.id;
    setCartItems([]);

    const hydrateCart = async () => {
      try {
        if (!supabase) throw new Error('Supabase is not configured.');
        const { data: rows, error } = await supabase
          .from('customer_cart_items')
          .select('product_id, selected_size, quantity')
          .eq('user_id', user.id);
        if (error) throw error;

        const remoteRows = rows || [];
        const resolvedLocalItems = await resolveStoredProducts(localItems, supabase);
        const products = await fetchProductsByIds(remoteRows.map((row) => row.product_id), supabase);
        const productsById = new Map(products.map((product) => [String(product.id), product]));
        const remoteItems = remoteRows.map((row) => ({
          ...(productsById.get(String(row.product_id)) || { id: row.product_id }),
          selectedSize: row.selected_size || undefined,
          quantity: row.quantity,
        }));
        const mergedItems = mergeCartItems(resolvedLocalItems, remoteItems);

        await saveCart(user.id, mergedItems);
        if (isActive) {
          setCartItems(mergedItems);
          localStorage.removeItem('cart');
          setSyncError('');
        }
      } catch (error) {
        if (isActive) {
          setCartItems(localItems);
          setSyncError(error?.message || 'Unable to load your saved cart. Your local cart is still available.');
        }
      }
    };

    hydrateCart();
    return () => { isActive = false; };
  }, [authLoading, saveCart, user]);

  const updateCartState = useCallback((updater, remoteOperation) => {
    setCartItems((previousItems) => {
      const updatedItems = updater(previousItems);
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      if (user) queueRemoteOperation(() => remoteOperation(updatedItems));
      return updatedItems;
    });
  }, [queueRemoteOperation, user]);

  const addToCart = useCallback((product, quantity = 1) => {
    if (!user) return;
    updateCartState((prev) => {
      const existingItem = prev.find(item => sameCartItem(item, product));
      if (existingItem) {
        return prev.map(item =>
          sameCartItem(item, product)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    }, (items) => saveCart(user.id, items));
  }, [updateCartState, user]);

  const removeFromCart = useCallback((productId, selectedSize = '') => {
    updateCartState(
      (prev) => prev.filter(item => !sameCartItem(item, { id: productId, selectedSize })),
      (items) => saveCart(user.id, items)
    );
  }, [saveCart, updateCartState, user]);

  const updateQuantity = useCallback((productId, quantity, selectedSize = '') => {
    updateCartState((prev) => quantity <= 0
      ? prev.filter(item => !sameCartItem(item, { id: productId, selectedSize }))
      : prev.map(item => sameCartItem(item, { id: productId, selectedSize }) ? { ...item, quantity } : item),
    (items) => saveCart(user.id, items));
  }, [saveCart, updateCartState, user]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.setItem('cart', JSON.stringify([]));
    if (user) {
      queueRemoteOperation(async () => {
        if (!supabase) throw new Error('Supabase is not configured.');
        const { error } = await supabase.from('customer_cart_items').delete().eq('user_id', user.id);
        if (error) throw error;
      });
    }
  }, [queueRemoteOperation, user]);

  const buyNow = useCallback((product, quantity = 1) => {
    if (!user) return;
    const updated = [{ ...product, quantity }];
    updateCartState(() => [{ ...product, quantity }], (items) => saveCart(user.id, items));
  }, [saveCart, updateCartState, user]);

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
    buyNow,
    syncError,
    getTotalItems,
    getTotalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
