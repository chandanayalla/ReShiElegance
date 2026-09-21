export const mapSupabaseProduct = (product) => ({
  ...product,
  searchId: product.search_id ?? product.searchId,
  originalPrice: product.original_price ?? product.originalPrice,
  reviewsCount: product.reviews_count ?? product.reviewsCount,
  isNewArrival: product.is_new_arrival ?? product.isNewArrival,
  isBestSeller: product.is_best_seller ?? product.isBestSeller,
  productType: product.product_type ?? product.productType,
});

export const readStoredItems = (key) => {
  try {
    const saved = localStorage.getItem(key);
    const items = saved ? JSON.parse(saved) : [];
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
};

export const sameProductId = (left, right) => String(left) === String(right);

export const mergeCartItems = (localItems, remoteItems) => {
  const merged = new Map();

  remoteItems.forEach((item) => {
    merged.set(String(item.id), { ...item, quantity: Number(item.quantity) || 0 });
  });

  localItems.forEach((item) => {
    const key = String(item.id);
    const existing = merged.get(key);
    merged.set(key, {
      ...(existing || {}),
      ...item,
      quantity: (existing?.quantity || 0) + (Number(item.quantity) || 0),
    });
  });

  return Array.from(merged.values()).filter((item) => item.quantity > 0);
};

export const mergeWishlistItems = (localItems, remoteItems) => {
  const merged = new Map();
  [...remoteItems, ...localItems].forEach((item) => {
    merged.set(String(item.id), item);
  });
  return Array.from(merged.values());
};

export const fetchProductsByIds = async (ids, supabase) => {
  if (!ids.length) return [];

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .in('id', ids);

  if (error) throw error;
  return (data || []).map(mapSupabaseProduct);
};

export const resolveStoredProducts = async (items, supabase) => {
  if (!items.length) return [];

  const { data, error } = await supabase.from('products').select('*');
  if (error) throw error;

  const products = (data || []).map(mapSupabaseProduct);
  return items.map((item) => {
    const match = products.find((product) => [product.id, product.searchId, product.name]
      .some((value) => String(value || '') === String(item.id) || String(value || '') === String(item.name || '')));
    return match ? { ...match, quantity: item.quantity } : item;
  });
};
