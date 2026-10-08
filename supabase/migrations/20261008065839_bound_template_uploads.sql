create function public.bound_template_upload_queue() returns trigger
language plpgsql set search_path = '' as $$
begin
  perform pg_advisory_xact_lock(684203002);
  if (select count(*) from public.template_file_cleanup where ready_at > now()) >= 25 then
    raise exception 'UPLOAD_LIMIT';
  end if;
  return new;
end $$;
create trigger bound_template_upload_queue before insert on public.template_file_cleanup
for each row execute function public.bound_template_upload_queue();
revoke all on function public.bound_template_upload_queue() from public, anon, authenticated;
grant execute on function public.bound_template_upload_queue() to service_role;
