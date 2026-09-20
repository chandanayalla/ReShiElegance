-- Keep existing deployments aligned with the paid checkout flow.
alter table public.orders
  alter column status set default 'Pending';

update public.orders
set status = 'Confirmed'
where payment_status = 'paid'
  and status = 'Pending';