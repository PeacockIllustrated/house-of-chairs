-- House of Chairs: the public forms write through the server only.
--
-- Until now anyone holding the browser (anon) key could insert straight into
-- these three tables, skipping the bot checks, Turnstile and rate limit in the
-- /api/enquire, /api/interest and /api/subscribe routes. The routes now write
-- with the service-role key (lib/supabase/formsDb.ts), which bypasses RLS, so
-- the public insert policies can go.
--
-- Run this only AFTER the site code that writes with the service-role key is
-- live, or the forms will fail to save. Reading, updating and deleting stay
-- owner-only exactly as before. Touches modern_ tables only.

drop policy if exists "anyone may lodge an enquiry" on modern_enquiries;
drop policy if exists "anyone may register interest" on modern_interest;
drop policy if exists "anyone may join the list" on modern_subscribers;

-- To undo:
-- create policy "anyone may lodge an enquiry" on modern_enquiries for insert with check (true);
-- create policy "anyone may register interest" on modern_interest for insert with check (true);
-- create policy "anyone may join the list" on modern_subscribers for insert with check (true);
