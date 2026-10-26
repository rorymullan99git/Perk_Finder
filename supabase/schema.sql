CREATE TABLE IF NOT EXISTS banks (
    id TEXT PRIMARY KEY,
    brand_name TEXT NOT NULL,
    logo_url TEXT,
    public_base_uri TEXT,
    is_major BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    bank_id TEXT REFERENCES banks(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('CRED_AND_CHRG_CARDS', 'TRANS_AND_SAVINGS')),
    annual_fee NUMERIC DEFAULT 0,
    fx_fee_pct NUMERIC DEFAULT 0,
    base_points_rate NUMERIC DEFAULT 0,
    points_currency TEXT,
    tmd_url TEXT,
    pds_url TEXT
);

CREATE TABLE IF NOT EXISTS merchants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    logo_url TEXT
);

CREATE TABLE IF NOT EXISTS perk_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
    merchant_id TEXT REFERENCES merchants(id) ON DELETE CASCADE NULL,
    offer_type TEXT NOT NULL CHECK (offer_type IN ('EGIFT_DISCOUNT', 'BANK_CASHBACK', 'POINTS_BOOSTER', 'BASE_REWARDS')),
    discount_pct NUMERIC,
    cashback_pct NUMERIC,
    cashback_cap NUMERIC,
    points_rate NUMERIC,
    points_currency TEXT,
    activation_required BOOLEAN DEFAULT false,
    activation_instructions TEXT,
    direct_url TEXT NOT NULL,
    affiliate_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS deposit_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bank_id TEXT REFERENCES banks(id) ON DELETE CASCADE,
    account_name TEXT NOT NULL,
    deposit_type TEXT NOT NULL CHECK (deposit_type IN ('SAVINGS_UNCONDITIONAL', 'SAVINGS_CONDITIONAL', 'TERM_DEPOSIT')),
    base_rate_pct NUMERIC NOT NULL,
    bonus_rate_pct NUMERIC DEFAULT 0,
    total_rate_pct NUMERIC NOT NULL,
    conditions JSONB,
    term_months INTEGER,
    min_deposit NUMERIC DEFAULT 0,
    payout_frequency TEXT DEFAULT 'Monthly',
    direct_url TEXT
);

CREATE INDEX IF NOT EXISTS idx_products_bank_id ON products(bank_id);
CREATE INDEX IF NOT EXISTS idx_perk_offers_merchant_id ON perk_offers(merchant_id);
CREATE INDEX IF NOT EXISTS idx_perk_offers_product_id ON perk_offers(product_id);
CREATE INDEX IF NOT EXISTS idx_deposit_rates_bank_id ON deposit_rates(bank_id);

ALTER TABLE banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE perk_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposit_rates ENABLE ROW LEVEL SECURITY;

-- Row Level Security: the public (anon) role may READ only. There are deliberately
-- no INSERT/UPDATE/DELETE policies, so writes are rejected for anon and authenticated
-- users. Seeding and ingestion use the service-role key (server-side only), which
-- bypasses RLS. See scripts/seed.ts.

-- Remove the permissive write policies created by earlier versions of this schema.
DROP POLICY IF EXISTS "Allow write banks" ON banks;
DROP POLICY IF EXISTS "Allow write products" ON products;
DROP POLICY IF EXISTS "Allow write merchants" ON merchants;
DROP POLICY IF EXISTS "Allow write perk_offers" ON perk_offers;
DROP POLICY IF EXISTS "Allow write deposit_rates" ON deposit_rates;

DROP POLICY IF EXISTS "Public read-only banks" ON banks;
DROP POLICY IF EXISTS "Public read-only products" ON products;
DROP POLICY IF EXISTS "Public read-only merchants" ON merchants;
DROP POLICY IF EXISTS "Public read-only perk_offers" ON perk_offers;
DROP POLICY IF EXISTS "Public read-only deposit_rates" ON deposit_rates;

CREATE POLICY "Public read-only banks" ON banks FOR SELECT USING (true);
CREATE POLICY "Public read-only products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read-only merchants" ON merchants FOR SELECT USING (true);
CREATE POLICY "Public read-only perk_offers" ON perk_offers FOR SELECT USING (true);
CREATE POLICY "Public read-only deposit_rates" ON deposit_rates FOR SELECT USING (true);

-- Belt and braces: strip table-level write grants from the API roles as well.
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON banks, products, merchants, perk_offers, deposit_rates FROM anon, authenticated;
