-- Privacy and couple-linking rules (docs/PLAN.md section 6).
-- Run with: npx supabase test db
-- Each block switches to a different signed-in person and checks what the
-- database lets them see or do. Everything is rolled back at the end.
begin;
create extension if not exists pgtap with schema extensions;
select plan(37);

-- People: Ada + Bayo (couple 1), Chidi + Dami (couple 2), Efe and Funke (single).
insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-0000-0000-00000000000a', 'ada@example.com', '{"display_name":"Ada"}'),
  ('00000000-0000-0000-0000-00000000000b', 'bayo@example.com', '{"display_name":"Bayo"}'),
  ('00000000-0000-0000-0000-00000000000c', 'chidi@example.com', '{"display_name":"Chidi"}'),
  ('00000000-0000-0000-0000-00000000000d', 'dami@example.com', '{"display_name":"Dami"}'),
  ('00000000-0000-0000-0000-00000000000e', 'efe@example.com', '{"display_name":"Efe"}'),
  ('00000000-0000-0000-0000-00000000000f', 'funke@example.com', '{"display_name":"Funke"}');

select is((select display_name from public.profiles
           where id = '00000000-0000-0000-0000-00000000000a'),
          'Ada', 'a profile is created for every new account');

-- ------------------------------------------------------------ linking
set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000a"}';
select is(public.create_couple(), 'created', 'Ada creates a couple space');
select is(public.create_couple(), 'already_linked', 'one couple space per person');
select set_config('t.code', code, true), set_config('t.token', token, true)
  from public.create_invite();
select ok(current_setting('t.code') ~ '^[0-9]{6}$', 'invite has a 6-digit code');
select ok(length(current_setting('t.token')) >= 32, 'invite link has a long random token');
select is(public.redeem_invite(current_setting('t.code')), 'own_invite',
          'you cannot join your own invite');
insert into public.private_entries (type, content) values ('journal', '{"text":"Ada only"}');

set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000b"}';
select is((select status from public.invite_preview(current_setting('t.token'))), 'ok',
          'the link shows who is inviting');
select is((select inviter_name from public.invite_preview(current_setting('t.token'))),
          'Ada', 'the link shows only the inviter''s name');
select is(public.redeem_invite('not-a-code'), 'not_found', 'a wrong code is turned down');
select is(public.redeem_invite(current_setting('t.code')), 'joined', 'Bayo joins with the code');
select is((select count(*)::int from public.profiles), 2, 'partners see each other''s profile');
insert into public.private_entries (type, content) values ('journal', '{"text":"Bayo only"}');

-- Couple 2 joins through the link instead.
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000c"}';
select public.create_couple();
select set_config('t.token2', token, true) from public.create_invite();
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000d"}';
select is(public.redeem_invite(current_setting('t.token2')), 'joined', 'Dami joins with the link');

set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000e"}';
select is(public.redeem_invite(current_setting('t.code')), 'not_found',
          'a used code cannot be used again');
select is(public.redeem_invite(current_setting('t.token2')), 'expired',
          'a used link cannot be used again');

-- ------------------------------------------- level 1: private to me
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000a"}';
select is((select count(*)::int from public.private_entries), 1,
          'Ada sees only her own private entry');
select is((select content ->> 'text' from public.private_entries), 'Ada only',
          'and it is hers');
with u as (update public.private_entries set content = '{}' returning 1)
select is(count(*)::int, 1, 'Ada can edit her own entry') from u;
select throws_ok(
  $$insert into public.private_entries (owner_id, type)
    values ('00000000-0000-0000-0000-00000000000b', 'journal')$$,
  '42501', null, 'nobody can write a private entry as someone else');

set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000b"}';
select is((select count(*)::int from public.private_entries
           where owner_id = '00000000-0000-0000-0000-00000000000a'), 0,
          'a partner cannot read your private entries');
with u as (update public.private_entries set content = '{}'
           where owner_id = '00000000-0000-0000-0000-00000000000a' returning 1)
select is(count(*)::int, 0, 'a partner cannot change your private entries') from u;

-- ------------------------------------------- level 2: shared with partner
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000a"}';
select set_config('t.couple1', (select id::text from public.couples), true);
insert into public.shared_items (couple_id, type, content)
values (current_setting('t.couple1')::uuid, 'memory', '{"caption":"Lekki"}');

set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000b"}';
select is((select count(*)::int from public.shared_items), 1, 'your partner sees shared items');
select throws_ok(
  format($$insert into public.shared_items (couple_id, type, created_by)
           values (%L, 'note', '00000000-0000-0000-0000-00000000000a')$$,
         current_setting('t.couple1')),
  '42501', null, 'you cannot add a shared item in your partner''s name');
select is((select count(*)::int from public.invites), 0, 'only the inviter sees invites');

-- ---------------------------------------------- other couples and strangers
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000c"}';
select is((select count(*)::int from public.shared_items
           where couple_id = current_setting('t.couple1')::uuid), 0,
          'another couple cannot read your shared items');
select is((select count(*)::int from public.couple_members
           where couple_id = current_setting('t.couple1')::uuid), 0,
          'another couple cannot see who is in your space');
select is((select count(*)::int from public.profiles
           where id = '00000000-0000-0000-0000-00000000000a'), 0,
          'another couple cannot see your profile');
select throws_ok(
  format($$insert into public.shared_items (couple_id, type) values (%L, 'note')$$,
         current_setting('t.couple1')),
  '42501', null, 'another couple cannot add to your space');

set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000e"}';
select throws_ok(
  format($$insert into public.couple_members (couple_id, user_id, role)
           values (%L, '00000000-0000-0000-0000-00000000000e', 'partner')$$,
         current_setting('t.couple1')),
  '42501', null, 'nobody can add themselves to a couple directly');

reset role;
set local role anon;
select throws_ok('select count(*) from public.private_entries', '42501', null,
                 'signed-out visitors cannot read anything');
reset role;
set local role authenticated;

-- ---------------------------------------------- full, expired, guessing
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000a"}';
select is((select status from public.create_invite()), 'full',
          'a couple space holds only two people');

set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000e"}';
select public.create_couple();
select set_config('t.token3', token, true) from public.create_invite();
reset role;
update public.invites set expires_at = now() - interval '1 minute'
where token = current_setting('t.token3');
set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000f"}';
select is(public.redeem_invite(current_setting('t.token3')), 'expired',
          'invites stop working after 7 days');
select count(public.redeem_invite('wrong' || g)) from generate_series(1, 10) g;
select is(public.redeem_invite('123456'), 'too_many_attempts',
          'guessing codes is limited to 10 tries an hour');

-- ---------------------------------------------- leaving (unlinking)
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000b"}';
select is(public.leave_couple(), 'left', 'Bayo leaves');
select is((select count(*)::int from public.shared_items)
          + (select count(*)::int from public.couples)
          + (select count(*)::int from public.profiles
             where id = '00000000-0000-0000-0000-00000000000a'), 0,
          'after leaving, all access to the space is gone at once');
select is((select count(*)::int from public.private_entries), 1,
          'your private entries leave with you');

set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000a"}';
select is((select count(*)::int from public.shared_items), 1,
          'the partner who stays keeps the shared items');
select is((select status from public.create_invite()), 'no_couple',
          'a space someone has left never takes a new partner');

select finish();
rollback;
