import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const table = process.env.SUPABASE_PRODUCTS_TABLE || 'products';

console.log('SUPABASE_URL', !!url);
console.log('SUPABASE_KEY_SET', !!key);

if (!url || !key) {
  console.error('Supabase env missing');
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

(async () => {
  try {
    const { data, error, status } = await supabase.from(table).select('id').limit(5);
    console.log('STATUS', status);
    if (error) {
      console.error('ERROR', JSON.stringify(error, null, 2));
      process.exit(1);
    }
    console.log('ROWS', data?.length, data?.slice(0,5));
  } catch (e) {
    console.error('EXCEPTION', e && e.message ? e.message : e);
    process.exit(1);
  }
})();
