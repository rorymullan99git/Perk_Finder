import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

/**
 * Server-side admin client for seeding scripts only.
 * Uses the service role key, which bypasses RLS. Never import this from src/
 * and never prefix the key with NEXT_PUBLIC_ (that would ship it to browsers).
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
  }
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}
