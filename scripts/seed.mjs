import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Read-only connection check using the public (publishable) key.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log('Testing Supabase connection to:', SUPABASE_URL);

const { error } = await supabase.from('banks').select('id').limit(1);
if (error) {
  console.log('Tables not initialised yet:', error.message);
  console.log('Run supabase/schema.sql in the Supabase SQL Editor, then `npm run seed:all`.');
} else {
  console.log('Banks table is live and publicly readable.');
}
