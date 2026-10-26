export type CardType = 'credit' | 'debit';
export type CardNetwork = 'visa' | 'mastercard' | 'amex' | 'eftpos';

export type MerchantCategory = 
  | 'groceries'
  | 'retail_tech'
  | 'liquor_dining'
  | 'travel_fuel'
  | 'department'
  | 'services';

export interface BankCard {
  id: string;
  name: string;
  issuer: string;
  type: CardType;
  network: CardNetwork;
  tier: string; // e.g. 'Platinum', 'Black', 'Standard', 'Rewards'
  annualFeeAud: number;
  fxFeePercent: number; // e.g. 0 or 3.0
  rewardProgram: string; // e.g. 'CommBank Awards', 'Qantas Frequent Flyer', 'Westpac Altitude', 'Macquarie Rewards'
  pointsPerAudStandard: number;
  pointsProgramValueAudPerPoint: number; // e.g. 0.01 for Qantas, 0.005 for Amex, 0.0045 for CBA
  color: {
    bg: string;
    border: string;
    text: string;
    accent: string;
  };
  features: string[];
  affiliateUrl?: string; // strictly opportunistic, never used in calculation
}

export interface Merchant {
  id: string;
  name: string;
  category: MerchantCategory;
  pillarCategory?: 'essentials' | 'tech' | 'fuel';
  defaultSpendAud: number;
  popularItems: string[];
  aliases: string[];
  color: string;
  iconName: string;
  brandTag?: string;
  currency?: string; // 'AUD' (default) or foreign e.g. 'USD'
}

export type PerkType = 
  | 'gift_card_discount'
  | 'direct_cashback'
  | 'points_multiplier'
  | 'surcharge_free'
  | 'category_bonus'
  | 'FX_FEE_WAIVER';

export interface PerkOffer {
  id: string;
  cardId: string; // links to BankCard
  merchantId?: string; // null if universal or category-wide
  merchantCategory?: MerchantCategory;
  perkType: PerkType;
  offer_type?: 'EGIFT_DISCOUNT' | 'BANK_CASHBACK' | 'POINTS_BOOSTER' | 'BASE_REWARDS' | 'FX_FEE_WAIVER';
  currency?: string; // e.g. 'AUD', 'USD', or null
  title: string;
  description: string;
  discountPercent?: number; // e.g., 4% for gift card
  cashbackPercent?: number; // e.g., 10% cash back
  bonusPointsPerAud?: number; // extra points
  terms: string;
  minSpendAud?: number;
  maxDiscountAud?: number;
  isGiftCardPurchase?: boolean;
  instructions?: string;
  activeUntil?: string;
}

export interface RankedOffer {
  offerId: string;
  card: BankCard;
  perk: PerkOffer;
  spendAud: number;
  grossSavingsAud: number;
  pointsEarned: number;
  pointsValueAud: number;
  netBenefitAud: number;
  effectiveReturnPercent: number;
  breakdownSteps: string[];
  actionLabel: string;
  isGiftCard: boolean;
  isOwned: boolean;
  badgeText?: string;
}

export interface SavingsAccount {
  id: string;
  bank: string;
  accountName: string;
  baseRatePercent: number;
  bonusRatePercent: number;
  totalRatePercent: number;
  type: 'savings' | 'term_deposit';
  termMonths?: number;
  isUnconditional: boolean;
  conditions: string[];
  minMonthlyDepositAud?: number;
  cardTransactionsRequired?: number;
  growBalanceRequired?: boolean;
  balanceCapAud?: number;
  notes: string;
  highlightBadge?: string;
  directUrl?: string;
}
