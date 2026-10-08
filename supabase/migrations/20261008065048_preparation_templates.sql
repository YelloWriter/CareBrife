-- Mission 6: deliberately public, non-sensitive examples; no patient data.
create table public.preparation_templates (
 id uuid primary key,
 title text not null check (char_length(btrim(title)) between 2 and 60),
 category text not null check (category in ('진료 전 준비','질문 정리','동행 체크')),
 summary text not null check (char_length(btrim(summary)) between 5 and 200),
 checklist text not null check (char_length(btrim(checklist)) between 5 and 2000),
 image_path text,
 image_alt text,
 version integer not null default 1 check (version > 0),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 constraint image_pair check ((image_path is null and image_alt is null) or
   (image_path is not null and image_alt is not null and char_length(btrim(image_alt)) between 1 and 120))
);
create index preparation_templates_created_idx on public.preparation_templates(created_at desc, id desc);
create table public.template_file_cleanup (
 path text primary key,
 ready_at timestamptz not null default (now() + interval '1 hour')
);
alter table public.preparation_templates enable row level security;
alter table public.template_file_cleanup enable row level security;
revoke all on public.preparation_templates, public.template_file_cleanup from anon, authenticated;
grant select, insert, update, delete on public.preparation_templates, public.template_file_cleanup to service_role;

create function public.template_before_change() returns trigger
language plpgsql set search_path = '' as $$
begin
  if TG_OP = 'INSERT' then
    perform pg_advisory_xact_lock(684203001);
    if (select count(*) from public.preparation_templates) >= 100 then
      raise exception 'TEMPLATE_LIMIT';
    end if;
  else
    new.version := old.version + 1;
    new.updated_at := clock_timestamp();
  end if;
  return new;
end $$;
create trigger template_before_change before insert or update on public.preparation_templates
for each row execute function public.template_before_change();

create function public.template_after_change() returns trigger
language plpgsql set search_path = '' as $$
begin
  if TG_OP in ('UPDATE','DELETE') and old.image_path is not null then
    if TG_OP = 'DELETE' or old.image_path is distinct from new.image_path then
      insert into public.template_file_cleanup(path, ready_at) values (old.image_path, now())
      on conflict (path) do update set ready_at = excluded.ready_at;
    end if;
  end if;
  if TG_OP in ('INSERT','UPDATE') and new.image_path is not null then
    delete from public.template_file_cleanup where path = new.image_path;
  end if;
  return null;
end $$;
create trigger template_after_change after insert or update or delete on public.preparation_templates
for each row execute function public.template_after_change();

create function public.save_preparation_template(
 p_id uuid, p_version integer, p_title text, p_category text, p_summary text,
 p_checklist text, p_image_path text, p_image_alt text
) returns uuid language plpgsql set search_path = '' as $$
begin
 if p_version = 0 then
  insert into public.preparation_templates(id,title,category,summary,checklist,image_path,image_alt)
  values(p_id,p_title,p_category,p_summary,p_checklist,p_image_path,p_image_alt);
 else
  update public.preparation_templates set title=p_title, category=p_category, summary=p_summary,
   checklist=p_checklist,image_path=p_image_path,image_alt=p_image_alt where id=p_id and version=p_version;
  if not found then raise exception 'VERSION_CONFLICT'; end if;
 end if;
 return p_id;
end $$;
revoke all on function public.save_preparation_template(uuid,integer,text,text,text,text,text,text) from public, anon, authenticated;
grant execute on function public.save_preparation_template(uuid,integer,text,text,text,text,text,text) to service_role;
revoke all on function public.template_before_change(), public.template_after_change() from public, anon, authenticated;
grant execute on function public.template_before_change(), public.template_after_change() to service_role;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('template-examples','template-examples',false,2097152,array['image/png','image/jpeg','image/webp']);
