-- Phase 2: couple linking (F2), unlinking (F3) and the privacy core (F5).
-- docs/PLAN.md section 6. Every table gets Row Level Security in this file.
--
-- Privacy levels:
--   1. Private to me      -> private_entries (owner only, always)
--   2. Shared with partner -> shared_items (members of that couple only)
--   3. Mutual reveal       -> enforced by a database function when its first
--                             feature (daily question, Phase 4) is built.
-- Couples, members and invites are only ever changed through the functions
-- at the bottom, which check who is calling.

-- ---------------------------------------------------------------- profiles
-- Only what a partner may see: name and picture. Private settings get their
-- own owner-only table in Phase 3.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '' check (char_length(display_name) <= 60),
  avatar_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------- couples
create table public.couples (
  id uuid primary key default gen_random_uuid(),
  created_by uuid references auth.users (id) on delete set null,
  season text check (char_length(season) <= 40),
  anniversary date,
  plan text not null default 'free' check (plan in ('free', 'plus')),
  created_at timestamptz not null default now(),
  -- Set when a partner leaves. An ended space never takes a new partner, so
  -- nobody new ever sees the old shared memories.
  ended_at timestamptz
);

create table public.couple_members (
  couple_id uuid not null references public.couples (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('creator', 'partner')),
  joined_at timestamptz not null default now(),
  primary key (couple_id, user_id),
  unique (user_id) -- one couple space per person
);

-- ----------------------------------------------------------------- invites
create table public.invites (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples (id) on delete cascade,
  code text not null check (code ~ '^[0-9]{6}$'),
  token text not null unique check (char_length(token) >= 32),
  created_by uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '7 days',
  used_at timestamptz,
  used_by uuid references auth.users (id) on delete set null,
  cancelled_at timestamptz
);
-- A code can only be live once at a time.
create unique index invites_live_code on public.invites (code)
  where used_at is null and cancelled_at is null;
create index invites_couple on public.invites (couple_id);

-- Wrong-code guesses, to stop anyone trying all million codes.
create table public.invite_attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  attempted_at timestamptz not null default now()
);
create index invite_attempts_recent on public.invite_attempts (user_id, attempted_at);

-- ---------------------------------------------------- level 1: private to me
create table public.private_entries (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  type text not null check (char_length(type) between 1 and 40),
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index private_entries_owner on public.private_entries (owner_id, type);

-- ----------------------------------------------- level 2: shared with partner
create table public.shared_items (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples (id) on delete cascade,
  type text not null check (type in ('memory', 'plan', 'bucket', 'note')),
  content jsonb not null default '{}'::jsonb,
  created_by uuid default auth.uid() references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index shared_items_couple on public.shared_items (couple_id, type);

-- ---------------------------------------------------------- helper checks
-- security definer so the checks can read couple_members without tripping
-- that table's own rules (which would loop).
create function public.is_member(target uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.couple_members
    where couple_id = target and user_id = (select auth.uid())
  );
$$;

create function public.shares_couple_with(other uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1
    from public.couple_members mine
    join public.couple_members theirs on theirs.couple_id = mine.couple_id
    where mine.user_id = (select auth.uid()) and theirs.user_id = other
  );
$$;

-- ---------------------------------------------------- row level security
alter table public.profiles enable row level security;
alter table public.couples enable row level security;
alter table public.couple_members enable row level security;
alter table public.invites enable row level security;
alter table public.invite_attempts enable row level security;
alter table public.private_entries enable row level security;
alter table public.shared_items enable row level security;

-- Signed-out visitors get nothing at all.
revoke all on public.profiles, public.couples, public.couple_members,
  public.invites, public.invite_attempts, public.private_entries,
  public.shared_items from anon;

-- Signed-in users only get the actions below; everything else goes through
-- the functions.
revoke all on public.profiles, public.couples, public.couple_members,
  public.invites, public.invite_attempts from authenticated;
grant select on public.profiles, public.couples, public.couple_members,
  public.invites to authenticated;
grant update (display_name, avatar_path) on public.profiles to authenticated;
grant update (season, anniversary) on public.couples to authenticated;

create policy "see yourself and your partner" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or public.shares_couple_with(id));
create policy "edit only yourself" on public.profiles
  for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy "members see their couple" on public.couples
  for select to authenticated using (public.is_member(id));
create policy "members edit season and anniversary" on public.couples
  for update to authenticated
  using (public.is_member(id)) with check (public.is_member(id));

create policy "members see each other" on public.couple_members
  for select to authenticated using (public.is_member(couple_id));

create policy "creator sees their invites" on public.invites
  for select to authenticated using (created_by = (select auth.uid()));

-- invite_attempts: no policies, so no one can read or write it directly.

create policy "only the owner" on public.private_entries
  for all to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create policy "members read" on public.shared_items
  for select to authenticated using (public.is_member(couple_id));
create policy "members add as themselves" on public.shared_items
  for insert to authenticated
  with check (public.is_member(couple_id) and created_by = (select auth.uid()));
create policy "members edit" on public.shared_items
  for update to authenticated
  using (public.is_member(couple_id)) with check (public.is_member(couple_id));
create policy "members remove" on public.shared_items
  for delete to authenticated using (public.is_member(couple_id));

-- ------------------------------------------- profiles follow the accounts
create function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, left(coalesce(new.raw_user_meta_data ->> 'display_name', ''), 60))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- People who signed up before this migration.
insert into public.profiles (id, display_name)
select id, left(coalesce(raw_user_meta_data ->> 'display_name', ''), 60)
from auth.users
on conflict (id) do nothing;

-- ---------------------------------------------------- couple functions
-- Each returns a short status word instead of raising errors, so a wrong
-- invite code can still be recorded for the guess limit.

-- Leaves any ended space (deleting it if empty) so the caller can start over.
create function public._leave_ended_space(uid uuid)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  old uuid;
begin
  select m.couple_id into old
  from public.couple_members m join public.couples c on c.id = m.couple_id
  where m.user_id = uid and c.ended_at is not null;
  if old is null then return; end if;
  delete from public.couple_members where couple_id = old and user_id = uid;
  delete from public.couples c where c.id = old
    and not exists (select 1 from public.couple_members where couple_id = old);
end;
$$;

create function public.create_couple()
returns text
language plpgsql security definer set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  new_id uuid;
begin
  if uid is null then return 'signed_out'; end if;
  perform public._leave_ended_space(uid);
  if exists (select 1 from public.couple_members where user_id = uid) then
    return 'already_linked';
  end if;
  insert into public.couples (created_by) values (uid) returning id into new_id;
  insert into public.couple_members (couple_id, user_id, role)
  values (new_id, uid, 'creator');
  return 'created';
end;
$$;

create function public.create_invite()
returns table (status text, code text, token text, expires_at timestamptz)
language plpgsql security definer set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  cid uuid;
  new_code text;
  new_token text;
  new_expiry timestamptz;
begin
  select m.couple_id into cid
  from public.couple_members m join public.couples c on c.id = m.couple_id
  where m.user_id = uid and c.ended_at is null;
  if cid is null then
    return query select 'no_couple'::text, null::text, null::text, null::timestamptz;
    return;
  end if;
  if (select count(*) from public.couple_members where couple_id = cid) >= 2 then
    return query select 'full'::text, null::text, null::text, null::timestamptz;
    return;
  end if;

  -- Only one live invite per space.
  update public.invites set cancelled_at = now()
  where couple_id = cid and used_at is null and cancelled_at is null;

  loop
    -- gen_random_uuid() is cryptographically random.
    new_code := lpad(
      (abs(('x' || substr(md5(gen_random_uuid()::text), 1, 8))::bit(32)::int) % 1000000)::text,
      6, '0');
    -- Retire an expired invite that still holds this code.
    update public.invites i set cancelled_at = now()
    where i.code = new_code and i.used_at is null and i.cancelled_at is null
      and i.expires_at <= now();
    exit when not exists (
      select 1 from public.invites i
      where i.code = new_code and i.used_at is null and i.cancelled_at is null
    );
  end loop;
  new_token := replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '');

  insert into public.invites (couple_id, code, token, created_by)
  values (cid, new_code, new_token, uid)
  returning invites.expires_at into new_expiry;
  return query select 'created'::text, new_code, new_token, new_expiry;
end;
$$;

-- What the join screen may show before joining: only the inviter's name,
-- and only for a full link token (not a guessable code).
create function public.invite_preview(link_token text)
returns table (status text, inviter_name text)
language plpgsql stable security definer set search_path = ''
as $$
declare
  inv public.invites%rowtype;
begin
  if auth.uid() is null then
    return query select 'signed_out'::text, null::text; return;
  end if;
  select * into inv from public.invites i where i.token = link_token;
  if not found then
    return query select 'not_found'::text, null::text; return;
  end if;
  if inv.used_at is not null or inv.cancelled_at is not null or inv.expires_at <= now() then
    return query select 'expired'::text, null::text; return;
  end if;
  return query
    select 'ok'::text, p.display_name from public.profiles p where p.id = inv.created_by;
end;
$$;

create function public.redeem_invite(code_or_token text)
returns text
language plpgsql security definer set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  input text := trim(coalesce(code_or_token, ''));
  inv public.invites%rowtype;
  ended timestamptz;
begin
  if uid is null then return 'signed_out'; end if;

  if (select count(*) from public.invite_attempts
      where user_id = uid and attempted_at > now() - interval '1 hour') >= 10 then
    return 'too_many_attempts';
  end if;

  select * into inv from public.invites i
  where (i.code = input or i.token = input)
    and i.used_at is null and i.cancelled_at is null
  order by i.created_at desc
  limit 1
  for update;

  if not found then
    insert into public.invite_attempts (user_id) values (uid);
    if exists (select 1 from public.invites i where i.token = input) then
      return 'expired';
    end if;
    return 'not_found';
  end if;
  if inv.expires_at <= now() then return 'expired'; end if;
  if inv.created_by = uid then return 'own_invite'; end if;

  perform public._leave_ended_space(uid);
  if exists (select 1 from public.couple_members where user_id = uid) then
    return 'already_linked';
  end if;

  select c.ended_at into ended from public.couples c where c.id = inv.couple_id;
  if ended is not null then return 'expired'; end if;
  if (select count(*) from public.couple_members where couple_id = inv.couple_id) >= 2 then
    return 'full';
  end if;

  update public.invites set used_at = now(), used_by = uid where id = inv.id;
  insert into public.couple_members (couple_id, user_id, role)
  values (inv.couple_id, uid, 'partner');
  return 'joined';
end;
$$;

create function public.leave_couple()
returns text
language plpgsql security definer set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  cid uuid;
begin
  if uid is null then return 'signed_out'; end if;
  select couple_id into cid from public.couple_members where user_id = uid;
  if cid is null then return 'not_linked'; end if;

  delete from public.couple_members where couple_id = cid and user_id = uid;
  update public.couples set ended_at = coalesce(ended_at, now()) where id = cid;
  update public.invites set cancelled_at = now()
  where couple_id = cid and used_at is null and cancelled_at is null;
  -- Nobody left: the space and its shared items go too.
  delete from public.couples c where c.id = cid
    and not exists (select 1 from public.couple_members where couple_id = cid);
  return 'left';
end;
$$;

-- Only signed-in users may call the functions; internal helpers not at all.
revoke execute on function public.is_member(uuid), public.shares_couple_with(uuid),
  public.handle_new_user(), public._leave_ended_space(uuid), public.create_couple(),
  public.create_invite(), public.invite_preview(text), public.redeem_invite(text),
  public.leave_couple()
  from public, anon;
revoke execute on function public.handle_new_user(), public._leave_ended_space(uuid)
  from authenticated;
grant execute on function public.is_member(uuid), public.shares_couple_with(uuid),
  public.create_couple(), public.create_invite(), public.invite_preview(text),
  public.redeem_invite(text), public.leave_couple()
  to authenticated;
