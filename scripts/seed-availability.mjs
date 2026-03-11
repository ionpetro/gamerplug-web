import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Load env
const envContent = readFileSync('.env', 'utf8');
const env = {};
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const GAMERTAG = 'iiribit';

async function main() {
  // 1. Find user
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, gamertag')
    .ilike('gamertag', GAMERTAG)
    .maybeSingle();

  if (userError || !user) {
    console.error('User not found:', userError);
    return;
  }
  console.log('Found user:', user.id, user.gamertag);

  // 2. Check profile
  const { data: profile } = await supabase
    .from('pay_to_play_profiles')
    .select('user_id, headline, timezone')
    .eq('user_id', user.id)
    .maybeSingle();
  console.log('Profile:', profile);

  // 3. Check offers
  const { data: offers } = await supabase
    .from('pay_to_play_offers')
    .select('id, title, is_active, duration_minutes, booking_notice_hours')
    .eq('provider_id', user.id);
  console.log('Offers:', offers);

  // 4. Check existing availability
  const { data: existingAvail } = await supabase
    .from('pay_to_play_availability')
    .select('*')
    .eq('provider_id', user.id);
  console.log('Existing availability:', existingAvail);

  // 5. Insert demo availability if none exists
  if (existingAvail && existingAvail.length > 0) {
    console.log('Availability already exists, skipping insert.');
    return;
  }

  // Set availability: Mon-Fri 9AM-5PM, Sat 10AM-2PM (America/New_York)
  const timezone = 'America/New_York';
  const rules = [
    { day_of_week: 0, start_time: '00:00', end_time: '00:00', is_active: false }, // Sun off
    { day_of_week: 1, start_time: '09:00', end_time: '17:00', is_active: true },  // Mon
    { day_of_week: 2, start_time: '09:00', end_time: '17:00', is_active: true },  // Tue
    { day_of_week: 3, start_time: '09:00', end_time: '17:00', is_active: true },  // Wed
    { day_of_week: 4, start_time: '09:00', end_time: '17:00', is_active: true },  // Thu
    { day_of_week: 5, start_time: '09:00', end_time: '17:00', is_active: true },  // Fri
    { day_of_week: 6, start_time: '10:00', end_time: '14:00', is_active: true },  // Sat
  ];

  const rows = rules.map(r => ({
    provider_id: user.id,
    day_of_week: r.day_of_week,
    start_time: r.start_time,
    end_time: r.end_time,
    timezone,
    is_active: r.is_active,
  }));

  const { data: inserted, error: insertError } = await supabase
    .from('pay_to_play_availability')
    .insert(rows)
    .select('id, day_of_week, start_time, end_time, is_active');

  if (insertError) {
    console.error('Insert error:', insertError);
    return;
  }

  console.log('Inserted availability:');
  for (const row of inserted) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    console.log(`  ${days[row.day_of_week]}: ${row.is_active ? `${row.start_time} - ${row.end_time}` : 'Off'}`);
  }
  console.log('Done! Timezone:', timezone);
}

main();
