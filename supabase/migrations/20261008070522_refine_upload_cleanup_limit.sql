create or replace function public.bound_template_upload_queue() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.ready_at > now() then
    perform pg_advisory_xact_lock(684203002);
    if (select count(*) from public.template_file_cleanup where ready_at > now()) >= 25 then
      raise exception 'UPLOAD_LIMIT';
    end if;
  end if;
  return new;
end $$;
