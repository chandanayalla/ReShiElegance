alter table public.products add column if not exists available_sizes text[] not null default '{}';

do $$
begin
  if to_regclass('public.customer_cart_items') is not null then
    alter table public.customer_cart_items add column if not exists selected_size text;
    drop index if exists customer_cart_items_user_id_product_id_key;
    alter table public.customer_cart_items drop constraint if exists customer_cart_items_user_id_product_id_key;
    create unique index if not exists customer_cart_items_user_product_size_idx
      on public.customer_cart_items(user_id, product_id, coalesce(selected_size, ''));
  end if;
end;
$$;