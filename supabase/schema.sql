-- ==============================================================================
-- PerkPilot AU - PostgreSQL Schema
-- Pure Math. Zero Affiliate Bias. Verified Australian Banking & Perks Aggregator.
--
-- DATA PROVENANCE & SOURCING ARCHITECTURE:
-- 1. CDR_OPEN_BANKING:
--    APRA-regulated Consumer Data Right (CDR) Product Reference Data APIs
--    Provides live, audited data for base points rates, overseas FX fees, 
--    annual card fees, and deposit interest rates directly from bank endpoints.
-- 2. GCDB_DATABASE:
--    Live Australian eGift Card Database tracking instant digital discount percentages
--    across verified providers (Macquarie Marketplace, Suncorp Member Benefits, NRMA Blue).
-- 3. BANK_APP_CLO:
--    Card-Linked Offers from proprietary Australian banking portals
--    (CommBank Yello Cashback, Westpac Extras / ShopBack integration, ANZ Rewards, NAB).
-- 4. AU_AUTO_CLUB:
--    Verified state auto club portals (NRMA Blue, RACV, RACQ) for everyday retail discounts.
-- 5. HEALTH_FUND:
--    Private health insurance member discount programs (e.g. Bupa Life Rewards).
-- 6. COMMUNITY_VERIFIED:
--    Peer-reviewed crowdsourced and auditor-verified community deals.
-- ==============================================================================

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
    expires_at TIMESTAMPTZ,
    -- Provenance & Sourcing Tracking Columns
    source_type TEXT NOT NULL DEFAULT 'COMMUNITY_VERIFIED' CHECK (source_type IN ('CDR_OPEN_BANKING', 'BANK_APP_CLO', 'GCDB_DATABASE', 'AU_AUTO_CLUB', 'HEALTH_FUND', 'COMMUNITY_VERIFIED')),
    source_name TEXT NOT NULL DEFAULT 'Verified Australian Market Data',
    source_url TEXT,
    verified_at TIMESTAMPTZ DEFAULT NOW(),
    verification_method TEXT DEFAULT 'Direct Product Audit'
);

COMMENT ON COLUMN perk_offers.source_type IS 'Provenance tier: CDR_OPEN_BANKING, BANK_APP_CLO, GCDB_DATABASE, AU_AUTO_CLUB, HEALTH_FUND, COMMUNITY_VERIFIED';
COMMENT ON COLUMN perk_offers.source_name IS 'Originating platform or partner (e.g. Macquarie Marketplace, CommBank Yello, Westpac Extras, NRMA Blue)';
COMMENT ON COLUMN perk_offers.source_url IS 'Direct non-affiliate URL to the published product terms or offer portal';
COMMENT ON COLUMN perk_offers.verified_at IS 'Timestamp when this rate and discount structure was last mathematically audited';
COMMENT ON COLUMN perk_offers.verification_method IS 'Validation procedure (e.g. In-App Purchase Audit, CDR API Payload, Daily Scrape Validation)';

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

-- Public read-only access. There are deliberately NO insert/update/delete
-- policies: with RLS enabled, the browser (anon / publishable key) can only
-- read. Seed scripts write with the service role key, which bypasses RLS.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read-only banks') THEN
        CREATE POLICY "Public read-only banks" ON banks FOR SELECT TO anon, authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read-only products') THEN
        CREATE POLICY "Public read-only products" ON products FOR SELECT TO anon, authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read-only merchants') THEN
        CREATE POLICY "Public read-only merchants" ON merchants FOR SELECT TO anon, authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read-only perk_offers') THEN
        CREATE POLICY "Public read-only perk_offers" ON perk_offers FOR SELECT TO anon, authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read-only deposit_rates') THEN
        CREATE POLICY "Public read-only deposit_rates" ON deposit_rates FOR SELECT TO anon, authenticated USING (true);
    END IF;
END $$;

-- Remove the old world-writable policies if an earlier version of this file was applied.
DROP POLICY IF EXISTS "Allow write banks" ON banks;
DROP POLICY IF EXISTS "Allow write products" ON products;
DROP POLICY IF EXISTS "Allow write merchants" ON merchants;
DROP POLICY IF EXISTS "Allow write perk_offers" ON perk_offers;
DROP POLICY IF EXISTS "Allow write deposit_rates" ON deposit_rates;
