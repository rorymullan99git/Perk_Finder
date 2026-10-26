import { createAdminClient } from './supabaseAdmin';
import {
  SEED_BANKS,
  SEED_PRODUCTS,
  SEED_MERCHANTS,
  SEED_PERK_OFFERS,
  SEED_DEPOSIT_RATES,
} from '../src/lib/supabase/seedData';

const supabase = createAdminClient();

async function run() {
  const steps: [string, () => PromiseLike<{ error: { message: string } | null }>][] = [
    ['banks', () => supabase.from('banks').upsert(SEED_BANKS, { onConflict: 'id' })],
    ['products', () => supabase.from('products').upsert(SEED_PRODUCTS, { onConflict: 'id' })],
    ['merchants', () => supabase.from('merchants').upsert(SEED_MERCHANTS, { onConflict: 'id' })],
    ['perk_offers', () => supabase.from('perk_offers').insert(SEED_PERK_OFFERS)],
    ['deposit_rates', () => supabase.from('deposit_rates').insert(SEED_DEPOSIT_RATES)],
  ];

  for (const [table, write] of steps) {
    const { error } = await write();
    if (error) {
      console.error(`Failed seeding ${table}: ${error.message}`);
      process.exit(1);
    }
    console.log(`Seeded ${table}`);
  }
}

run();
