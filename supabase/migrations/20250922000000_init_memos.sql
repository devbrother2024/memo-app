-- Enable extension for UUID generation
create extension if not exists pgcrypto;

-- Enum for memo categories
do $$
begin
  if not exists (select 1 from pg_type where typname = 'memo_category') then
    create type memo_category as enum ('personal', 'work', 'study', 'idea', 'other');
  end if;
end $$;

-- Table: public.memos
create table if not exists public.memos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  category memo_category not null default 'personal',
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Update trigger for updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on public.memos;
create trigger set_updated_at
before update on public.memos
for each row execute function public.set_updated_at();

-- Indexes
create index if not exists idx_memos_created_at on public.memos (created_at desc);
create index if not exists idx_memos_category on public.memos (category);
create index if not exists idx_memos_tags_gin on public.memos using gin (tags);

-- RLS
alter table public.memos enable row level security;

-- Policies: allow full access to anon for demo
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'memos' and policyname = 'Allow anon all'
  ) then
    create policy "Allow anon all" on public.memos for all to anon using (true) with check (true);
  end if;
end $$;


