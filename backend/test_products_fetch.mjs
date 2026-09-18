import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const productsTable = process.env.SUPABASE_PRODUCTS_TABLE || 'products';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });

const publicProductFields = `
  id,name,slug,category,price,original_price,discount,description,fabric,work,
  occasion,colors,stock,status,rating,reviews_count,images,is_new_arrival,
  is_best_seller,created_at
`;

const toCamelProduct = (product) => {
  if (!product) return null;
  const originalPrice = Number(product.original_price ?? product.originalPrice ?? product.price ?? 0);
  const price = Number(product.price || 0);
  const stock = Number(product.stock || 0);
  const images = product.images?.length ? product.images : product.image ? [product.image] : [];

  return {
    id: String(product.id ?? product._id),
    _id: String(product.id ?? product._id),
    name: product.name || '',
    slug: product.slug || '',
    category: product.category || 'Sarees',
    price,
    originalPrice,
    discount: Number(product.discount || 0),
    description: product.description || '',
    fabric: product.fabric || '',
    work: product.work || '',
    occasion: product.occasion || '',
    colors: Array.isArray(product.colors) ? product.colors : [],
    stock,
    status: product.status || (stock > 0 ? 'In Stock' : 'Out of Stock'),
    rating: Number(product.rating || 4.6),
    reviewsCount: Number(product.reviews_count ?? product.reviewsCount ?? 0),
    images,
    image: images[0] || '',
    isNewArrival: Boolean(product.is_new_arrival ?? product.isNewArrival),
    isBestSeller: Boolean(product.is_best_seller ?? product.isBestSeller),
    createdAt: product.created_at || product.createdAt || new Date().toISOString(),
    updatedAt: product.updated_at || product.updatedAt || new Date().toISOString(),
  };
};

(async () => {
  try {
    const { data, error } = await supabase
      .from(productsTable)
      .select(publicProductFields)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('SUPABASE_ERROR', error);
      process.exit(1);
    }

    console.log('ROWS', (data || []).length);
    const items = (data || []).map(toCamelProduct);
    console.log('MAPPED_FIRST', items[0]);
  } catch (e) {
    console.error('EXCEPTION', e && e.message ? e.message : e);
    process.exit(1);
  }
})();
