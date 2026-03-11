-- Allow users to delete only swipes they created.
-- Needed for "Refresh Discovery" (clear left swipes).
drop policy if exists "Users can delete their own swipes" on public.swipes;

create policy "Users can delete their own swipes"
on public.swipes
for delete
using (auth.uid() = from_user_id);
