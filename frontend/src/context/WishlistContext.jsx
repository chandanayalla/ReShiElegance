import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from './AuthContext';
import { supabase } from '../services/supabase';
import { fetchProductsByIds, mergeWishlistItems, readStoredItems, resolveStoredProducts, sameProductId } from '../utils/customerItems';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [wishlistItems, setWishlistItems] = useState(() => readStoredItems('wishlist'));
  const [syncError, setSyncError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const previousUserId = useRef(null);
  const remoteQueue = useRef(Promise.resolve());

  const getAuthenticatedUser = useCallback(async () => {
    if (!supabase) throw new Error('Supabase is not configured.');

    if (authLoading) {
      setStatusMessage('Please wait while your login is restored.');
      return null;
    }

    const { data, error } = await supabase.auth.getUser();
    if (error) {
      const message = error.message?.toLowerCase() || '';
      if (error.status === 401 || error.name === 'AuthSessionMissingError' || message.includes('session missing')) {
        setStatusMessage('Please login to save items to your wishlist.');
        return null;
      }
      throw error;
    }
    if (!data.user) {
      setStatusMessage('Please login to save items to your wishlist.');
      return null;
    }

    if (!user || user.id !== data.user.id) {
      setStatusMessage('Please wait while your login is restored.');
      return null;
    }

    return data.user;
  }, [authLoading, user]);

  const queueRemoteOperation = useCallback((operation) => {
    remoteQueue.current = remoteQueue.current
      .catch(() => undefined)
      .then(operation)
      .catch((error) => {
        setSyncError(error?.message || 'Unable to sync your wishlist. Your changes are saved on this device and will retry later.');
      });
  }, []);

  const saveWishlist = useCallback(async (items) => {
    const authUser = await getAuthenticatedUser();
    if (!authUser) return false;
    if (!items.length) return;

    const { error } = await supabase
      .from('customer_wishlists')
      .upsert(items.map((item) => ({ user_id: authUser.id, product_id: item.id })), {
        onConflict: 'user_id,product_id',
      });
    if (error) throw error;
    return true;
  }, [getAuthenticatedUser]);

  useEffect(() => {
    let isActive = true;

    if (authLoading) return () => { isActive = false; };

    if (!user) {
      if (previousUserId.current) {
        setWishlistItems([]);
        localStorage.removeItem('wishlist');
      }
      previousUserId.current = null;
      setSyncError('');
      return () => { isActive = false; };
    }

    const localItems = previousUserId.current ? [] : readStoredItems('wishlist');
    previousUserId.current = user.id;
    setWishlistItems([]);

    const hydrateWishlist = async () => {
      try {
        if (!supabase) throw new Error('Supabase is not configured.');
        const { data: rows, error } = await supabase
          .from('customer_wishlists')
          .select('product_id')
          .eq('user_id', user.id);
        if (error) throw error;

        const remoteRows = rows || [];
        const resolvedLocalItems = await resolveStoredProducts(localItems, supabase);
        const remoteProducts = await fetchProductsByIds(remoteRows.map((row) => row.product_id), supabase);
        const productsById = new Map(remoteProducts.map((product) => [String(product.id), product]));
        const remoteItems = remoteRows.map((row) => productsById.get(String(row.product_id)) || { id: row.product_id });
        const mergedItems = mergeWishlistItems(resolvedLocalItems, remoteItems);

        await saveWishlist(mergedItems);
        if (isActive) {
          setWishlistItems(mergedItems);
          localStorage.removeItem('wishlist');
          setSyncError('');
          setStatusMessage('');
        }
      } catch (error) {
        if (isActive) {
          setWishlistItems(localItems);
          setSyncError(error?.message || 'Unable to load your saved wishlist. Your local wishlist is still available.');
        }
      }
    };

    hydrateWishlist();
    return () => { isActive = false; };
  }, [authLoading, saveWishlist, user]);

  const updateWishlistState = useCallback((updater, remoteOperation) => {
    setWishlistItems((previousItems) => {
      const updatedItems = updater(previousItems);
      localStorage.setItem('wishlist', JSON.stringify(updatedItems));
      if (user) queueRemoteOperation(() => remoteOperation(updatedItems));
      return updatedItems;
    });
  }, [queueRemoteOperation, user]);

  const addToWishlist = useCallback(async (product) => {
    const authUser = await getAuthenticatedUser();
    if (!authUser) return;

    updateWishlistState((prev) => {
      if (prev.find(item => sameProductId(item.id, product.id))) {
        return prev;
      }
      return [...prev, product];
    }, async () => {
      const { error } = await supabase.from('customer_wishlists').upsert(
        { user_id: authUser.id, product_id: product.id },
        { onConflict: 'user_id,product_id' }
      );
      if (error) throw error;
    });
    if (!user) setStatusMessage('Please login to save items to your wishlist.');
  }, [getAuthenticatedUser, updateWishlistState, user]);

  const removeFromWishlist = useCallback(async (productId) => {
    const authUser = await getAuthenticatedUser();
    if (!authUser) return;

    updateWishlistState(
      (prev) => prev.filter(item => !sameProductId(item.id, productId)),
      async () => {
        const { error } = await supabase.from('customer_wishlists')
          .delete().eq('user_id', authUser.id).eq('product_id', productId);
        if (error) throw error;
      }
    );
  }, [getAuthenticatedUser, updateWishlistState, user]);

  const toggleWishlist = useCallback(async (product) => {
    const authUser = await getAuthenticatedUser();
    if (!authUser) return;

    updateWishlistState((prev) => {
      const exists = prev.find(item => sameProductId(item.id, product.id));
      if (exists) {
        return prev.filter(item => !sameProductId(item.id, product.id));
      }
      return [...prev, product];
    }, async (items) => {
      const isPresent = items.some((item) => sameProductId(item.id, product.id));
      const query = supabase.from('customer_wishlists');
      const result = isPresent
        ? await query.upsert({ user_id: authUser.id, product_id: product.id }, { onConflict: 'user_id,product_id' })
        : await query.delete().eq('user_id', authUser.id).eq('product_id', product.id);
      if (result.error) throw result.error;
    });
    if (!user) setStatusMessage('Please login to save items to your wishlist.');
  }, [getAuthenticatedUser, updateWishlistState, user]);

  const isInWishlist = useCallback((productId) => {
    return wishlistItems.some(item => sameProductId(item.id, productId));
  }, [wishlistItems]);

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    syncError,
    statusMessage,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
