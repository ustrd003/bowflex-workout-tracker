-- Apply before deploying the difficulty checkbox feature.
alter table public.w_workout_entries
  add column if not exists too_easy boolean not null default false;
