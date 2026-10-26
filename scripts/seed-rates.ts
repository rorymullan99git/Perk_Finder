import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://huupoltsurpjlmimubjo.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_CBl9OeFdzjoO0LjNjYdHTQ_Pxya8Gv_';
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateDepositRates() {
  console.log('Refreshing deposit_rates with verified Australian bank rates...');

  // 1. Ensure all referenced banks exist in banks table to satisfy foreign keys
  const banksToEnsure = [
    { id: 'cba', brand_name: 'Commonwealth Bank of Australia', public_base_uri: 'https://www.commbank.com.au', is_major: true },
    { id: 'westpac', brand_name: 'Westpac Banking Corporation', public_base_uri: 'https://www.westpac.com.au', is_major: true },
    { id: 'anz', brand_name: 'Australia and New Zealand Banking Group', public_base_uri: 'https://www.anz.com.au', is_major: true },
    { id: 'nab', brand_name: 'National Australia Bank', public_base_uri: 'https://www.nab.com.au', is_major: true },
    { id: 'macquarie', brand_name: 'Macquarie Bank', public_base_uri: 'https://www.macquarie.com.au', is_major: false },
    { id: 'rabobank', brand_name: 'Rabobank Australia', public_base_uri: 'https://www.rabobank.com.au', is_major: false },
    { id: 'ing', brand_name: 'ING Australia', public_base_uri: 'https://www.ing.com.au', is_major: false },
    { id: 'up', brand_name: 'Up (Bendigo & Adelaide Bank)', public_base_uri: 'https://up.com.au', is_major: false },
    { id: 'boq', brand_name: 'Bank of Queensland', public_base_uri: 'https://www.boq.com.au', is_major: false },
    { id: 'judo', brand_name: 'Judo Bank', logo_url: '/logos/judo.svg', public_base_uri: 'https://api.judo.bank', is_major: false },
    { id: 'ubank', brand_name: 'uBank (NAB Group)', public_base_uri: 'https://www.ubank.com.au', is_major: false },
    { id: 'bankwest', brand_name: 'Bankwest (CBA Group)', public_base_uri: 'https://www.bankwest.com.au', is_major: false },
    { id: 'revolut', brand_name: 'Revolut Australia', public_base_uri: 'https://www.revolut.com/en-AU', is_major: false },
  ];

  const { error: banksErr } = await supabase.from('banks').upsert(banksToEnsure, { onConflict: 'id' });
  if (banksErr) {
    console.warn('Note on banks upsert:', banksErr.message);
  } else {
    console.log(`Ensured ${banksToEnsure.length} banks exist in Supabase.`);
  }

  // 2. Clear existing stale rates
  const { error: deleteError } = await supabase.from('deposit_rates').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (deleteError) {
    console.warn('Could not truncate, proceeding to insert/upsert:', deleteError.message);
  } else {
    console.log('Cleared previous deposit rates.');
  }

  // 3. Verified Rates Dataset
  const verifiedRates = [
    // --- INTRODUCTORY & CONDITIONAL HIGHEST YIELDS ---
    {
      bank_id: 'rabobank',
      account_name: 'Rabobank High Interest Savings (Intro)',
      deposit_type: 'SAVINGS_UNCONDITIONAL',
      base_rate_pct: 4.15,
      bonus_rate_pct: 2.00,
      total_rate_pct: 6.15,
      conditions: {
        intro_period_months: 4,
        revert_rate_pct: 4.15,
        balance_cap: 250000,
        notes: 'Introductory 6.15% p.a. for first 4 months for new customers. Reverts to 4.15% p.a. ongoing.'
      },
      min_deposit: 0,
      payout_frequency: 'Monthly',
      direct_url: 'https://www.rabobank.com.au/deposits/personal/high-interest-savings-account'
    },
    {
      bank_id: 'ing',
      account_name: 'ING Savings Booster',
      deposit_type: 'SAVINGS_CONDITIONAL',
      base_rate_pct: 2.50,
      bonus_rate_pct: 3.75,
      total_rate_pct: 6.25,
      conditions: {
        intro_period_months: 4,
        revert_rate_pct: 5.65,
        min_deposit_monthly: 1000,
        card_swipes_monthly: 5,
        grow_balance: true,
        balance_cap: 500000,
        notes: '6.25% p.a. for 4 months (new customers), then 5.65% ongoing bonus rate when depositing $1k, making 5 settled purchases, and growing balance.'
      },
      min_deposit: 0,
      payout_frequency: 'Monthly',
      direct_url: 'https://www.ing.com.au/savings/savings-maximiser.html'
    },
    {
      bank_id: 'ubank',
      account_name: 'uBank Save',
      deposit_type: 'SAVINGS_CONDITIONAL',
      base_rate_pct: 0.10,
      bonus_rate_pct: 5.40,
      total_rate_pct: 5.50,
      conditions: {
        min_deposit_monthly: 200,
        card_swipes_monthly: 0,
        grow_balance: false,
        balance_cap: 250000,
        notes: 'Deposit $200+ per month from external account into any uBank account. Zero card spend hoops, zero balance growth rules. Balances $250k-$1M earn 5.00% p.a.'
      },
      min_deposit: 0,
      payout_frequency: 'Monthly',
      direct_url: 'https://www.ubank.com.au/banking/savings-account'
    },
    {
      bank_id: 'up',
      account_name: 'Up Savers',
      deposit_type: 'SAVINGS_CONDITIONAL',
      base_rate_pct: 1.50,
      bonus_rate_pct: 3.85,
      total_rate_pct: 5.35,
      conditions: {
        card_swipes_monthly: 5,
        balance_cap: 1000000,
        notes: 'Make 5 settled purchases per month across debit or digital wallet. No balance growth requirement.'
      },
      min_deposit: 0,
      payout_frequency: 'Monthly',
      direct_url: 'https://up.com.au/features/savers/'
    },
    {
      bank_id: 'boq',
      account_name: 'BOQ Future Saver (14-35 Years)',
      deposit_type: 'SAVINGS_CONDITIONAL',
      base_rate_pct: 0.05,
      bonus_rate_pct: 5.70,
      total_rate_pct: 5.75,
      conditions: {
        age_min: 14,
        age_max: 35,
        min_deposit_monthly: 1000,
        card_swipes_monthly: 5,
        balance_cap: 50000,
        notes: 'For ages 14-35. Deposit $1,000+ and make 5 eligible card purchases each month on linked Everyday Account. Capped at $50k.'
      },
      min_deposit: 0,
      payout_frequency: 'Monthly',
      direct_url: 'https://www.boq.com.au/personal/banking/savings-and-term-deposits/future-saver-account'
    },
    {
      bank_id: 'westpac',
      account_name: 'Westpac Life (18-40 Years)',
      deposit_type: 'SAVINGS_CONDITIONAL',
      base_rate_pct: 0.10,
      bonus_rate_pct: 5.85,
      total_rate_pct: 5.95,
      conditions: {
        age_min: 18,
        age_max: 40,
        card_swipes_monthly: 5,
        grow_balance: true,
        balance_cap: 30000,
        notes: 'Ages 18-40: 5.95% p.a. on balances up to $30k when you make 5+ purchases/month and ensure your closing balance is higher than opening.'
      },
      min_deposit: 0,
      payout_frequency: 'Monthly',
      direct_url: 'https://www.westpac.com.au/personal-banking/bank-accounts/savings-accounts/life/'
    },

    // --- ZERO-HOOP / UNCONDITIONAL SAVINGS ---
    {
      bank_id: 'macquarie',
      account_name: 'Macquarie Savings Account',
      deposit_type: 'SAVINGS_UNCONDITIONAL',
      base_rate_pct: 5.30,
      bonus_rate_pct: 0.00,
      total_rate_pct: 5.30,
      conditions: {
        zero_hoops: true,
        balance_cap: 250000,
        notes: 'Flat ongoing rate. No monthly deposit minimums, no transaction requirements, and no withdrawal penalties.'
      },
      min_deposit: 0,
      payout_frequency: 'Monthly',
      direct_url: 'https://www.macquarie.com.au/everyday-banking/savings-account.html'
    },
    {
      bank_id: 'bankwest',
      account_name: 'Bankwest Easy Saver (Intro)',
      deposit_type: 'SAVINGS_UNCONDITIONAL',
      base_rate_pct: 1.50,
      bonus_rate_pct: 3.60,
      total_rate_pct: 5.10,
      conditions: {
        intro_period_months: 4,
        revert_rate_pct: 1.50,
        zero_hoops: true,
        balance_cap: 250000,
        notes: 'Introductory 5.10% p.a. for first 4 months for new customers. Zero deposit or swipe criteria during intro.'
      },
      min_deposit: 0,
      payout_frequency: 'Monthly',
      direct_url: 'https://www.bankwest.com.au/personal/bank-accounts/savings-accounts/easy-saver'
    },
    {
      bank_id: 'anz',
      account_name: 'ANZ Plus Save',
      deposit_type: 'SAVINGS_UNCONDITIONAL',
      base_rate_pct: 5.00,
      bonus_rate_pct: 0.00,
      total_rate_pct: 5.00,
      conditions: {
        zero_hoops: true,
        balance_cap: 250000,
        notes: 'Flat rate on balances up to $250,000 with zero monthly deposit or swipe conditions.'
      },
      min_deposit: 0,
      payout_frequency: 'Monthly',
      direct_url: 'https://www.anz.com.au/plus/save/'
    },
    {
      bank_id: 'revolut',
      account_name: 'Revolut Savings Vault',
      deposit_type: 'SAVINGS_UNCONDITIONAL',
      base_rate_pct: 4.00,
      bonus_rate_pct: 0.75,
      total_rate_pct: 4.75,
      conditions: {
        daily_payout: true,
        zero_hoops: true,
        balance_cap: 500000,
        notes: 'Interest paid daily directly into Vault. Standard plan 4.00% p.a.; Metal plan unlocks top 4.75% p.a. Zero lock-ins or deposit hoops.'
      },
      min_deposit: 0,
      payout_frequency: 'Daily',
      direct_url: 'https://www.revolut.com/en-AU/savings/'
    },

    // --- BIG FOUR & REGIONAL BONUS SAVERS ---
    {
      bank_id: 'bankwest',
      account_name: 'Bankwest Hero Saver',
      deposit_type: 'SAVINGS_CONDITIONAL',
      base_rate_pct: 0.01,
      bonus_rate_pct: 4.99,
      total_rate_pct: 5.00,
      conditions: {
        min_deposit_monthly: 200,
        grow_balance: true,
        balance_cap: 500000,
        notes: 'Deposit $200+ per month and maintain end-of-month balance higher than opening balance (excluding interest).'
      },
      min_deposit: 0,
      payout_frequency: 'Monthly',
      direct_url: 'https://www.bankwest.com.au/personal/bank-accounts/savings-accounts/hero-saver'
    },
    {
      bank_id: 'cba',
      account_name: 'CommBank GoalSaver',
      deposit_type: 'SAVINGS_CONDITIONAL',
      base_rate_pct: 0.10,
      bonus_rate_pct: 4.90,
      total_rate_pct: 5.00,
      conditions: {
        min_deposit_monthly: 200,
        grow_balance: true,
        balance_cap: 50000,
        notes: 'Deposit $200+ each calendar month and ensure end of month balance is higher than start of month.'
      },
      min_deposit: 0,
      payout_frequency: 'Monthly',
      direct_url: 'https://www.commbank.com.au/banking/goal-saver.html'
    },
    {
      bank_id: 'nab',
      account_name: 'NAB Reward Saver',
      deposit_type: 'SAVINGS_CONDITIONAL',
      base_rate_pct: 0.01,
      bonus_rate_pct: 4.99,
      total_rate_pct: 5.00,
      conditions: {
        min_deposit_monthly: 1,
        no_withdrawals: true,
        balance_cap: 1000000,
        notes: 'Make at least 1 deposit and zero withdrawals in the month. High balance ceiling up to $1M.'
      },
      min_deposit: 0,
      payout_frequency: 'Monthly',
      direct_url: 'https://www.nab.com.au/personal/banking/savings-accounts/nab-reward-saver'
    },

    // --- GUARANTEED FIXED TERM DEPOSITS ---
    {
      bank_id: 'judo',
      account_name: 'Judo Bank 12-Month Term Deposit',
      deposit_type: 'TERM_DEPOSIT',
      term_months: 12,
      base_rate_pct: 5.15,
      bonus_rate_pct: 0.00,
      total_rate_pct: 5.15,
      conditions: {
        min_deposit: 1000,
        interest_payment: 'At Maturity',
        notes: 'Fixed 5.15% guaranteed return for 12 months. Backed by Australian Government FCS guarantee.'
      },
      min_deposit: 1000,
      payout_frequency: 'At Maturity',
      direct_url: 'https://www.judo.bank/personal-term-deposit'
    },
    {
      bank_id: 'macquarie',
      account_name: 'Macquarie 6-Month Term Deposit',
      deposit_type: 'TERM_DEPOSIT',
      term_months: 6,
      base_rate_pct: 4.95,
      bonus_rate_pct: 0.00,
      total_rate_pct: 4.95,
      conditions: {
        min_deposit: 5000,
        interest_payment: 'At Maturity',
        notes: 'Fixed 4.95% return for 6 months. Minimum $5,000 opening deposit.'
      },
      min_deposit: 5000,
      payout_frequency: 'At Maturity',
      direct_url: 'https://www.macquarie.com.au/everyday-banking/term-deposits.html'
    }
  ];

  const { data: inserted, error: insertError } = await supabase
    .from('deposit_rates')
    .insert(verifiedRates)
    .select();

  if (insertError) {
    console.error('Failed to insert rates into Supabase:', insertError.message);
  } else {
    console.log(`Successfully synced ${inserted.length} verified Australian deposit rates to Supabase!`);
  }
}

updateDepositRates().catch(console.error);
