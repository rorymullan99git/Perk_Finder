export type ProductDbCategory = 'CRED_AND_CHRG_CARDS' | 'TRANS_AND_SAVINGS';
export type OfferDbType = 'EGIFT_DISCOUNT' | 'BANK_CASHBACK' | 'POINTS_BOOSTER' | 'BASE_REWARDS';
export type DepositDbType = 'SAVINGS_UNCONDITIONAL' | 'SAVINGS_CONDITIONAL' | 'TERM_DEPOSIT';

export interface BankDbRow {
  id: string;
  brand_name: string;
  logo_url?: string | null;
  public_base_uri?: string | null;
  is_major?: boolean;
}

export interface ProductDbRow {
  id: string;
  bank_id: string;
  name: string;
  category: ProductDbCategory;
  annual_fee?: number;
  fx_fee_pct?: number;
  base_points_rate?: number;
  points_currency?: string | null;
  tmd_url?: string | null;
  pds_url?: string | null;
}

export interface MerchantDbRow {
  id: string;
  name: string;
  category: string;
  logo_url?: string | null;
}

export interface PerkOfferDbRow {
  id?: string;
  product_id: string;
  merchant_id?: string | null;
  offer_type: OfferDbType;
  discount_pct?: number | null;
  cashback_pct?: number | null;
  cashback_cap?: number | null;
  points_rate?: number | null;
  points_currency?: string | null;
  activation_required?: boolean;
  activation_instructions?: string | null;
  direct_url: string;
  affiliate_url?: string | null;
  expires_at?: string | null;
}

export interface DepositRateDbRow {
  id?: string;
  bank_id: string;
  account_name: string;
  deposit_type: DepositDbType;
  base_rate_pct: number;
  bonus_rate_pct?: number;
  total_rate_pct: number;
  conditions?: Record<string, any> | null;
  term_months?: number | null;
  min_deposit?: number;
  payout_frequency?: string;
  direct_url?: string | null;
}
