import { 
  BankDbRow, 
  ProductDbRow, 
  MerchantDbRow, 
  PerkOfferDbRow, 
  DepositRateDbRow 
} from './types';
import { CARDS_DATA } from '@/data/cards';
import { MERCHANTS_DATA } from '@/data/merchants';
import { PERK_OFFERS_DATA } from '@/data/perkOffers';
import { SAVINGS_ACCOUNTS_DATA } from '@/data/savingsRates';

// Helper to map card issuer to bank ID
export function getBankIdFromIssuer(issuer: string): string {
  const norm = issuer.toLowerCase();
  if (norm.includes('commonwealth') || norm.includes('cba')) return 'cba';
  if (norm.includes('westpac')) return 'westpac';
  if (norm.includes('macquarie')) return 'macquarie';
  if (norm.includes('anz')) return 'anz';
  if (norm.includes('nab')) return 'nab';
  if (norm.includes('up')) return 'up';
  if (norm.includes('american express') || norm.includes('amex')) return 'amex_au';
  if (norm.includes('coles')) return 'coles_financial';
  if (norm.includes('woolworths')) return 'everyday_rewards';
  if (norm.includes('ing')) return 'ing';
  if (norm.includes('hsbc')) return 'hsbc_au';
  if (norm.includes('bankwest')) return 'bankwest';
  if (norm.includes('virgin')) return 'virgin_money';
  if (norm.includes('ubank')) return 'ubank';
  if (norm.includes('bendigo')) return 'bendigo_bank';
  if (norm.includes('queensland') || norm.includes('boq')) return 'boq';
  if (norm.includes('great southern')) return 'great_southern_bank';
  if (norm.includes('judo')) return 'judo';
  if (norm.includes('amp')) return 'amp_bank';
  if (norm.includes('rabobank')) return 'rabobank';
  return 'other_au';
}

export const SEED_BANKS: BankDbRow[] = [
  { id: 'cba', brand_name: 'Commonwealth Bank of Australia', public_base_uri: 'https://www.commbank.com.au', is_major: true },
  { id: 'westpac', brand_name: 'Westpac Banking Corporation', public_base_uri: 'https://www.westpac.com.au', is_major: true },
  { id: 'macquarie', brand_name: 'Macquarie Bank', public_base_uri: 'https://www.macquarie.com.au', is_major: false },
  { id: 'anz', brand_name: 'Australia and New Zealand Banking Group', public_base_uri: 'https://www.anz.com.au', is_major: true },
  { id: 'nab', brand_name: 'National Australia Bank', public_base_uri: 'https://www.nab.com.au', is_major: true },
  { id: 'up', brand_name: 'Up (Bendigo & Adelaide Bank)', public_base_uri: 'https://up.com.au', is_major: false },
  { id: 'amex_au', brand_name: 'American Express Australia', public_base_uri: 'https://www.americanexpress.com/en-au', is_major: false },
  { id: 'coles_financial', brand_name: 'Coles Financial Services', public_base_uri: 'https://www.coles.com.au/credit-cards', is_major: false },
  { id: 'everyday_rewards', brand_name: 'Everyday Rewards / Woolworths', public_base_uri: 'https://www.everydayextra.com.au', is_major: false },
  { id: 'ing', brand_name: 'ING Australia', public_base_uri: 'https://www.ing.com.au', is_major: false },
  { id: 'hsbc_au', brand_name: 'HSBC Australia', public_base_uri: 'https://www.hsbc.com.au', is_major: false },
  { id: 'bankwest', brand_name: 'Bankwest (CBA Group)', public_base_uri: 'https://www.bankwest.com.au', is_major: false },
  { id: 'virgin_money', brand_name: 'Virgin Money Australia', public_base_uri: 'https://virginmoney.com.au', is_major: false },
  { id: 'ubank', brand_name: 'UBank (NAB Group)', public_base_uri: 'https://www.ubank.com.au', is_major: false },
  { id: 'bendigo_bank', brand_name: 'Bendigo Bank', public_base_uri: 'https://www.bendigobank.com.au', is_major: false },
  { id: 'boq', brand_name: 'Bank of Queensland', public_base_uri: 'https://www.boq.com.au', is_major: false },
  { id: 'great_southern_bank', brand_name: 'Great Southern Bank', public_base_uri: 'https://www.greatsouthernbank.com.au', is_major: false },
  { id: 'judo', brand_name: 'Judo Bank', logo_url: '/logos/judo.svg', public_base_uri: 'https://api.judo.bank', is_major: false },
  { id: 'amp_bank', brand_name: 'AMP Bank', public_base_uri: 'https://www.amp.com.au/banking', is_major: false },
  { id: 'rabobank', brand_name: 'Rabobank Australia', public_base_uri: 'https://www.rabobank.com.au', is_major: false },
  { id: 'other_au', brand_name: 'Other Australian Financial Institution', public_base_uri: null, is_major: false },
];

export const SEED_PRODUCTS: ProductDbRow[] = CARDS_DATA.map((card) => {
  const bankId = getBankIdFromIssuer(card.issuer);
  return {
    id: card.id,
    bank_id: bankId,
    name: card.name,
    category: card.type === 'credit' ? 'CRED_AND_CHRG_CARDS' : 'TRANS_AND_SAVINGS',
    annual_fee: card.annualFeeAud,
    fx_fee_pct: card.fxFeePercent,
    base_points_rate: card.pointsPerAudStandard,
    points_currency: card.rewardProgram !== 'None' ? card.rewardProgram : null,
    tmd_url: `https://perkpilot.au/tmd/${card.id}`,
    pds_url: `https://perkpilot.au/pds/${card.id}`,
  };
});

export const SEED_MERCHANTS: MerchantDbRow[] = MERCHANTS_DATA.map((m) => ({
  id: m.id,
  name: m.name,
  category: m.category,
  logo_url: `/logos/${m.id}.svg`,
}));

export const SEED_PERK_OFFERS: PerkOfferDbRow[] = PERK_OFFERS_DATA.map((o) => {
  let offer_type: 'EGIFT_DISCOUNT' | 'BANK_CASHBACK' | 'POINTS_BOOSTER' | 'BASE_REWARDS' = 'BASE_REWARDS';
  if (o.perkType === 'gift_card_discount') offer_type = 'EGIFT_DISCOUNT';
  else if (o.perkType === 'direct_cashback') offer_type = 'BANK_CASHBACK';
  else if (o.perkType === 'points_multiplier') offer_type = 'POINTS_BOOSTER';

  return {
    product_id: o.cardId,
    merchant_id: o.merchantId || null,
    offer_type,
    discount_pct: o.discountPercent || null,
    cashback_pct: o.cashbackPercent || null,
    cashback_cap: o.maxDiscountAud || null,
    points_rate: o.bonusPointsPerAud || null,
    points_currency: o.perkType === 'points_multiplier' ? 'Reward Points' : null,
    activation_required: Boolean(o.terms.toLowerCase().includes('activate')),
    activation_instructions: o.instructions || null,
    direct_url: `https://perkpilot.au/offers/${o.id}`,
    affiliate_url: null, // strictly null or neutral
  };
});

export const SEED_DEPOSIT_RATES: DepositRateDbRow[] = SAVINGS_ACCOUNTS_DATA.map((acc) => {
  const bankId = getBankIdFromIssuer(acc.bank);
  let deposit_type: 'SAVINGS_UNCONDITIONAL' | 'SAVINGS_CONDITIONAL' | 'TERM_DEPOSIT' = 'SAVINGS_UNCONDITIONAL';
  if (acc.type === 'term_deposit') {
    deposit_type = 'TERM_DEPOSIT';
  } else if (!acc.isUnconditional) {
    deposit_type = 'SAVINGS_CONDITIONAL';
  }

  return {
    bank_id: bankId,
    account_name: acc.accountName,
    deposit_type,
    base_rate_pct: acc.baseRatePercent,
    bonus_rate_pct: acc.bonusRatePercent,
    total_rate_pct: acc.totalRatePercent,
    conditions: {
      checklist: acc.conditions,
      minMonthlyDepositAud: acc.minMonthlyDepositAud || 0,
      cardTransactionsRequired: acc.cardTransactionsRequired || 0,
      growBalanceRequired: Boolean(acc.growBalanceRequired),
      balanceCapAud: acc.balanceCapAud || null,
    },
    term_months: acc.termMonths || null,
    min_deposit: acc.type === 'term_deposit' ? 1000 : 0,
    payout_frequency: 'Monthly',
    direct_url: acc.directUrl || null,
  };
});
