-- Phase 3: onboarding answers (F4), personal settings and faith pack (F10),
-- data export and account deletion (F8). New tables only.

-- ------------------------------------------------------------------ tables

-- About me: each partner's own answers. Only the owner reads this table;
-- a partner sees only the answers listed in shared_fields, through
-- partner_about_me().
create table public.about_me (
  user_id uuid primary key default auth.uid()
    references auth.users (id) on delete cascade,
  love_languages text[] not null default '{}'
    check (love_languages <@ array['words', 'time', 'gifts', 'acts', 'touch']
      and cardinality(love_languages) <= 2),
  budget_band text
    check (budget_band in ('free', 'under_10k', '10k_30k', '30k_75k', 'over_75k')),
  free_time text[] not null default '{}'
    check (free_time <@ array['weekday_evenings', 'weekend_mornings',
      'weekend_afternoons', 'weekend_evenings']),
  kids text
    check (kids in ('none', 'little', 'older', 'grown')),
  interests text[] not null default '{}'
    check (interests <@ array['food', 'music', 'outdoors', 'faith', 'films',
      'games', 'travel', 'fitness', 'learning', 'creativity', 'reading', 'sport']),
  surprise_style text
    check (surprise_style in ('surprises', 'plans', 'both')),
  shared_fields text[] not null default '{}'
    check (shared_fields <@ array['love_languages', 'budget_band', 'free_time',
      'kids', 'interests', 'surprise_style']),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Personal settings, never visible to a partner.
create table public.my_settings (
  user_id uuid primary key default auth.uid()
    references auth.users (id) on delete cascade,
  faith_pack boolean not null default false,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------- row level security
alter table public.about_me enable row level security;
alter table public.my_settings enable row level security;

revoke all on public.about_me, public.my_settings from anon;
revoke all on public.about_me, public.my_settings from authenticated;
grant select, insert, update on public.about_me, public.my_settings
  to authenticated;

create policy "only you, about you" on public.about_me
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "only you, your settings" on public.my_settings
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- -------------------------------------------------------------- functions

-- What your partner chose to show you. Only while you are both in the same
-- live space; any answer they didn't switch on comes back empty.
create function public.partner_about_me()
returns table (
  partner_name text,
  love_languages text[],
  budget_band text,
  free_time text[],
  kids text,
  interests text[],
  surprise_style text
)
language sql stable security definer set search_path = ''
as $$
  select
    p.display_name,
    case when 'love_languages' = any (a.shared_fields) then a.love_languages end,
    case when 'budget_band' = any (a.shared_fields) then a.budget_band end,
    case when 'free_time' = any (a.shared_fields) then a.free_time end,
    case when 'kids' = any (a.shared_fields) then a.kids end,
    case when 'interests' = any (a.shared_fields) then a.interests end,
    case when 'surprise_style' = any (a.shared_fields) then a.surprise_style end
  from public.couple_members mine
  join public.couples c on c.id = mine.couple_id and c.ended_at is null
  join public.couple_members theirs
    on theirs.couple_id = mine.couple_id and theirs.user_id <> mine.user_id
  join public.about_me a on a.user_id = theirs.user_id
  left join public.profiles p on p.id = theirs.user_id
  where mine.user_id = (select auth.uid())
    and cardinality(a.shared_fields) > 0;
$$;

-- Everything Tend holds about you, as one file. Never your partner's
-- private things or answers they haven't shared.
create function public.export_my_data()
returns jsonb
language plpgsql stable security definer set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  cid uuid;
begin
  if uid is null then return null; end if;
  select couple_id into cid from public.couple_members where user_id = uid;

  return jsonb_build_object(
    'exported_at', now(),
    'account', (
      select jsonb_build_object('id', u.id, 'email', u.email,
        'created_at', u.created_at)
      from auth.users u where u.id = uid),
    'profile', (
      select to_jsonb(p) from public.profiles p where p.id = uid),
    'about_me', (
      select to_jsonb(a) - 'user_id' from public.about_me a where a.user_id = uid),
    'settings', (
      select to_jsonb(s) - 'user_id' from public.my_settings s where s.user_id = uid),
    'private_entries', coalesce((
      select jsonb_agg(to_jsonb(e) - 'owner_id' order by e.created_at)
      from public.private_entries e where e.owner_id = uid), '[]'::jsonb),
    'couple_space', (
      select jsonb_build_object(
        'created_at', c.created_at,
        'season', c.season,
        'anniversary', c.anniversary,
        'plan', c.plan,
        'partner_name', (
          select p.display_name
          from public.couple_members m
          join public.profiles p on p.id = m.user_id
          where m.couple_id = c.id and m.user_id <> uid))
      from public.couples c where c.id = cid),
    'shared_items', coalesce((
      select jsonb_agg(jsonb_build_object(
          'type', i.type, 'content', i.content, 'created_at', i.created_at,
          'added_by_me', i.created_by = uid)
        order by i.created_at)
      from public.shared_items i where i.couple_id = cid), '[]'::jsonb),
    'invites_i_made', coalesce((
      select jsonb_agg(jsonb_build_object(
          'created_at', v.created_at, 'expires_at', v.expires_at,
          'used_at', v.used_at, 'cancelled_at', v.cancelled_at)
        order by v.created_at)
      from public.invites v where v.created_by = uid), '[]'::jsonb)
  );
end;
$$;

-- Deletes your account at once. Leaving works like leave_couple(): your
-- partner keeps the shared things and the space never takes someone new.
-- Your login and everything of yours then go through on-delete-cascade.
create function public.delete_my_account()
returns text
language plpgsql security definer set search_path = ''
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then return 'signed_out'; end if;
  perform public.leave_couple();
  -- A space you made but nobody is in any more (e.g. created, never joined).
  delete from public.couples c
  where c.created_by = uid
    and not exists (select 1 from public.couple_members m where m.couple_id = c.id);
  delete from auth.users where id = uid;
  return 'deleted';
end;
$$;

revoke execute on function public.partner_about_me(), public.export_my_data(),
  public.delete_my_account() from public, anon;
grant execute on function public.partner_about_me(), public.export_my_data(),
  public.delete_my_account() to authenticated;
