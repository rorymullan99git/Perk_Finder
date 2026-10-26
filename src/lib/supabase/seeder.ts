import { supabase } from './client';
import { 
  SEED_BANKS, 
  SEED_PRODUCTS, 
  SEED_MERCHANTS, 
  SEED_PERK_OFFERS, 
  SEED_DEPOSIT_RATES 
} from './seedData';

export interface SeedResult {
  success: boolean;
  message: string;
  counts?: {
    banks: number;
    products: number;
    merchants: number;
    perkOffers: number;
    depositRates: number;
  };
  error?: any;
}

export async function seedSupabaseDatabase(): Promise<SeedResult> {
  try {
    // 1. Seed Banks
    const { error: banksErr } = await supabase.from('banks').upsert(SEED_BANKS, { onConflict: 'id' });
    if (banksErr) {
      if (banksErr.code === 'PGRST205' || banksErr.message?.includes('schema cache')) {
        return {
          success: false,
          message: 'Supabase tables do not exist yet. Please execute supabase/schema.sql in your Supabase SQL editor first.',
          error: banksErr,
        };
      }
      return { success: false, message: `Failed seeding banks: ${banksErr.message}`, error: banksErr };
    }

    // 2. Seed Products
    const { error: productsErr } = await supabase.from('products').upsert(SEED_PRODUCTS, { onConflict: 'id' });
    if (productsErr) {
      return { success: false, message: `Failed seeding products: ${productsErr.message}`, error: productsErr };
    }

    // 3. Seed Merchants
    const { error: merchantsErr } = await supabase.from('merchants').upsert(SEED_MERCHANTS, { onConflict: 'id' });
    if (merchantsErr) {
      return { success: false, message: `Failed seeding merchants: ${merchantsErr.message}`, error: merchantsErr };
    }

    // 4. Seed Perk Offers
    const { error: offersErr } = await supabase.from('perk_offers').insert(SEED_PERK_OFFERS);
    if (offersErr) {
      return { success: false, message: `Failed seeding perk offers: ${offersErr.message}`, error: offersErr };
    }

    // 5. Seed Deposit Rates
    const { error: depositsErr } = await supabase.from('deposit_rates').insert(SEED_DEPOSIT_RATES);
    if (depositsErr) {
      return { success: false, message: `Failed seeding deposit rates: ${depositsErr.message}`, error: depositsErr };
    }

    return {
      success: true,
      message: 'Successfully seeded all banks, products, merchants, perk offers, and deposit rates to Supabase!',
      counts: {
        banks: SEED_BANKS.length,
        products: SEED_PRODUCTS.length,
        merchants: SEED_MERCHANTS.length,
        perkOffers: SEED_PERK_OFFERS.length,
        depositRates: SEED_DEPOSIT_RATES.length,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'An unexpected error occurred while seeding.',
      error: err,
    };
  }
}
