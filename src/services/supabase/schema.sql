-- Run these in the Supabase SQL Editor (Dashboard → SQL Editor)

-- Favorites table
create table if not exists favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  video_id text not null,
  video_data jsonb not null,
  created_at timestamptz default now(),
  unique(user_id, video_id)
);
alter table favorites enable row level security;
create policy "Users manage own favorites" on favorites
  for all using (auth.uid() = user_id);

-- Watch history table
create table if not exists watch_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  video_id text not null,
  video_data jsonb not null,
  watched_at timestamptz default now()
);
alter table watch_history enable row level security;
create policy "Users manage own history" on watch_history
  for all using (auth.uid() = user_id);
