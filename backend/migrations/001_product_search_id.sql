alter table public.products add column if not exists search_id text;

create unique index if not exists products_search_id_unique_idx
  on public.products(search_id)
  where search_id is not null;

create or replace function public.allocate_product_search_id(p_product_type text)
returns text
language plpgsql
as $$
declare
  prefix text := case when p_product_type = 'jewellery' then 'RE-JW-' else 'RE-CL-' end;
  next_number integer;
begin
  perform pg_advisory_xact_lock(hashtext(prefix));
  select coalesce(max(substring(search_id from 7)::integer), 0) + 1
    into next_number
    from public.products
   where search_id like prefix || '%';
  return prefix || lpad(next_number::text, 3, '0');
end;
$$;

do $$
declare
  product_row record;
begin
  for product_row in
    select id, product_type
    from public.products
    where search_id is null
    order by created_at, id
  loop
    update public.products
    set search_id = public.allocate_product_search_id(product_row.product_type)
    where id = product_row.id;
  end loop;
end;
$$;