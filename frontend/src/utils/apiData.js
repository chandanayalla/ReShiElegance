export const readArrayResponse = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.orders)) return data.orders;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

export const findProductByIdentifier = (products, identifier) => {
  const value = String(identifier || '').toLowerCase();
  if (!value) return undefined;
  return products.find((product) => [product.id, product._id, product.searchId]
    .some((candidate) => String(candidate || '').toLowerCase() === value));
};
