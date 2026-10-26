import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log('Testing Supabase Connection to:', SUPABASE_URL);

async function run() {
  const { data, error } = await supabase.from('banks').select('count');
  if (error) {
    console.log('Status: Tables not yet initialized in Supabase.');
    console.log('Reason:', error.message);
    console.log('\n--> Instructions to initialize Supabase tables:');
    console.log('1. Open your Supabase Dashboard SQL Editor (https://supabase.com/dashboard)');
    console.log('2. Copy the contents of supabase/schema.sql');
    console.log('3. Paste and click "Run" in the SQL Editor.');
    console.log('4. Once run, the RLS policies and tables will be live and ready for seeding!\n');
    return;
  }
  console.log('Banks table is live! Current record count:', data);
}

run();
