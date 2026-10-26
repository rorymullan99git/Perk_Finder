/**
 * Server-side seeder. Run manually: `npm run seed`.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS. Never prefix it with
 * NEXT_PUBLIC_, never commit it, and never import this file from src/.
 */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import {
  SEED_BANKS,
  SEED_PRODUCTS,
  SEED_MERCHANTS,
  SEED_PERK_OFFERS,
  SEED_DEPOSIT_RATES,
} from './seedData';

dotenv.config({ path: '.env.local' });

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local (server-side only).');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

async function step(label: string, op: PromiseLike<{ error: { message: string } | null }>) {
  const { error } = await op;
  if (error) throw new Error(`${label}: ${error.message}`);
  console.log(`ok  ${label}`);
}

async function main() {
  await step('banks', supabase.from('banks').upsert(SEED_BANKS, { onConflict: 'id' }));
  await step('products', supabase.from('products').upsert(SEED_PRODUCTS, { onConflict: 'id' }));
  await step('merchants', supabase.from('merchants').upsert(SEED_MERCHANTS, { onConflict: 'id' }));

  // These tables use generated UUID keys, so replace their contents to stay idempotent.
  await step('clear perk_offers', supabase.from('perk_offers').delete().not('id', 'is', null));
  await step('perk_offers', supabase.from('perk_offers').insert(SEED_PERK_OFFERS));
  await step('clear deposit_rates', supabase.from('deposit_rates').delete().not('id', 'is', null));
  await step('deposit_rates', supabase.from('deposit_rates').insert(SEED_DEPOSIT_RATES));
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
