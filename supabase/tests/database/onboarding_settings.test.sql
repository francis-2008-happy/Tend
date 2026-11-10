-- About me, settings, data export and account deletion (Phase 3).
-- Run with: npx supabase test db
begin;
create extension if not exists pgtap with schema extensions;
select plan(23);

-- Ada + Bayo are a couple; Efe is on her own.
insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-0000-0000-00000000000a', 'ada@example.com', '{"display_name":"Ada"}'),
  ('00000000-0000-0000-0000-00000000000b', 'bayo@example.com', '{"display_name":"Bayo"}'),
  ('00000000-0000-0000-0000-00000000000e', 'efe@example.com', '{"display_name":"Efe"}');

set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000a"}';
select public.create_couple();
select set_config('t.code', code, true) from public.create_invite();
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000b"}';
select public.redeem_invite(current_setting('t.code'));

-- ------------------------------------------------------------ about me
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000a"}';
insert into public.about_me (love_languages, budget_band, kids, shared_fields)
values ('{time}', '10k_30k', 'none', '{budget_band}');
insert into public.private_entries (type, content) values ('journal', '{"text":"Ada only"}');
insert into public.my_settings (faith_pack) values (true);
select is((select count(*)::int from public.about_me), 1, 'Ada sees her own answers');

set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000b"}';
select throws_ok(
  $$insert into public.about_me (love_languages) values ('{words,time,gifts}')$$,
  '23514', null, 'answers must be from the allowed choices');
select throws_ok(
  $$insert into public.about_me (budget_band) values ('millions')$$,
  '23514', null, 'budget must be one of the naira bands');
insert into public.about_me (love_languages, kids) values ('{words}', 'little');
insert into public.private_entries (type, content) values ('journal', '{"text":"Bayo only"}');

select is((select count(*)::int from public.about_me), 1,
          'a partner cannot read your answers directly');
select is((select count(*)::int from public.my_settings), 0,
          'a partner cannot read your settings');
with u as (
  update public.about_me set kids = 'grown'
  where user_id = '00000000-0000-0000-0000-00000000000a' returning 1)
select is(count(*)::int, 0, 'a partner cannot change your answers') from u;
select throws_ok(
  $$insert into public.about_me (user_id, kids)
    values ('00000000-0000-0000-0000-00000000000e', 'none')$$,
  '42501', null, 'nobody can write answers for someone else');

select is((select budget_band from public.partner_about_me()), '10k_30k',
          'a partner sees an answer you chose to share');
select is((select love_languages from public.partner_about_me()), null,
          'a partner does not see answers you kept private');
select is((select kids from public.partner_about_me()), null,
          'unshared answers stay hidden');
select is((select partner_name from public.partner_about_me()), 'Ada',
          'shared answers come with the partner''s name');

set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000a"}';
select is((select count(*)::int from public.partner_about_me()), 0,
          'nothing shows when your partner has shared nothing');

set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000e"}';
select is((select count(*)::int from public.partner_about_me())
          + (select count(*)::int from public.about_me), 0,
          'someone outside the couple sees no answers at all');

-- --------------------------------------------------------------- export
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000a"}';
select set_config('t.export', public.export_my_data()::text, true);
select is(current_setting('t.export')::jsonb #>> '{about_me,budget_band}', '10k_30k',
          'the export holds your answers');
select is(current_setting('t.export')::jsonb #>> '{settings,faith_pack}', 'true',
          'the export holds your settings');
select ok(current_setting('t.export') like '%Ada only%',
          'the export holds your private entries');
select ok(current_setting('t.export') not like '%Bayo only%'
          and current_setting('t.export') not like '%little%',
          'the export never holds your partner''s private things');
select is(current_setting('t.export')::jsonb #>> '{couple_space,partner_name}', 'Bayo',
          'the export names your couple space partner');

reset role;
set local role anon;
select throws_ok($$select public.export_my_data()$$, '42501', null,
                 'signed-out visitors cannot export anything');

-- ------------------------------------------------------- delete account
set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000b"}';
insert into public.shared_items (couple_id, type, content)
select couple_id, 'memory', '{"text":"our walk"}' from public.couple_members
where user_id = '00000000-0000-0000-0000-00000000000b';
select is(public.delete_my_account(), 'deleted', 'Bayo deletes his account');

reset role;
select is((select count(*)::int from auth.users
           where id = '00000000-0000-0000-0000-00000000000b')
          + (select count(*)::int from public.about_me
             where user_id = '00000000-0000-0000-0000-00000000000b')
          + (select count(*)::int from public.private_entries
             where owner_id = '00000000-0000-0000-0000-00000000000b')
          + (select count(*)::int from public.couple_members
             where user_id = '00000000-0000-0000-0000-00000000000b'), 0,
          'a deleted account leaves nothing of theirs behind');

set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000a"}';
select is((select count(*)::int from public.shared_items), 1,
          'the partner who stays keeps the shared things');

-- Efe makes a space nobody joined, then deletes her account.
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000e"}';
select public.create_couple();
select public.delete_my_account();
reset role;
select is((select count(*)::int from public.couples c
           where not exists (select 1 from public.couple_members m
                             where m.couple_id = c.id)
             and c.ended_at is null), 0,
          'deleting an account leaves no empty couple space behind');

select finish();
rollback;
