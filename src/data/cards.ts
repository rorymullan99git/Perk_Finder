import { BankCard } from '@/types';

export const CARDS_DATA: BankCard[] = [
  // 1. Commonwealth Bank (CBA)
  {
    id: 'cba_ultimate_awards',
    name: 'CBA Ultimate Awards',
    issuer: 'Commonwealth Bank',
    type: 'credit',
    network: 'mastercard',
    tier: 'Black',
    annualFeeAud: 420, // $35/m waived with $2.5k monthly spend
    fxFeePercent: 0, // No international transaction fees
    rewardProgram: 'CommBank Awards',
    pointsPerAudStandard: 1.0, // 3 pts/aud on international, 2 pts on supermarkets, 1 pt regular
    pointsProgramValueAudPerPoint: 0.0045, // ~0.45c per point
    color: {
      bg: 'from-amber-500 to-yellow-600',
      border: 'border-amber-400',
      text: 'text-amber-950',
      accent: '#FFCD00',
    },
    features: ['Fee waived with $2,500/m spend', 'CommBank Yello Cashback eligible', '0% FX fee on online/overseas', 'Travel insurance included'],
  },
  {
    id: 'cba_smart_awards',
    name: 'CBA Smart Awards',
    issuer: 'Commonwealth Bank',
    type: 'credit',
    network: 'mastercard',
    tier: 'Platinum',
    annualFeeAud: 228, // $19/m waived with $2,000 spend
    fxFeePercent: 0,
    rewardProgram: 'CommBank Awards',
    pointsPerAudStandard: 0.75,
    pointsProgramValueAudPerPoint: 0.0045,
    color: {
      bg: 'from-yellow-400 to-amber-500',
      border: 'border-yellow-300',
      text: 'text-stone-900',
      accent: '#E6A100',
    },
    features: ['Fee waived with $2,000/m spend', 'CommBank Yello eligible', '0% FX fee'],
  },
  {
    id: 'cba_smart_debit',
    name: 'CBA Smart Access Debit',
    issuer: 'Commonwealth Bank',
    type: 'debit',
    network: 'mastercard',
    tier: 'Standard',
    annualFeeAud: 0,
    fxFeePercent: 3.0,
    rewardProgram: 'None',
    pointsPerAudStandard: 0,
    pointsProgramValueAudPerPoint: 0,
    color: {
      bg: 'from-yellow-500 to-yellow-600',
      border: 'border-yellow-400',
      text: 'text-stone-900',
      accent: '#FFCD00',
    },
    features: ['CommBank Yello cashback deals', 'Instant PayID', 'Everyday spend tracking'],
  },
  {
    id: 'cba_steppay',
    name: 'CommBank StepPay',
    issuer: 'Commonwealth Bank',
    type: 'debit',
    network: 'mastercard',
    tier: 'Digital BNPL',
    annualFeeAud: 0,
    fxFeePercent: 0,
    rewardProgram: 'CommBank Awards',
    pointsPerAudStandard: 0.5,
    pointsProgramValueAudPerPoint: 0.0045,
    color: {
      bg: 'from-amber-600 to-neutral-800',
      border: 'border-amber-500',
      text: 'text-white',
      accent: '#FFCD00',
    },
    features: ['Split purchases into 4 installments', 'No interest', 'Eligible for CommBank Yello cashback'],
  },

  // 2. Westpac
  {
    id: 'westpac_altitude_black_qantas',
    name: 'Westpac Altitude Black (Qantas)',
    issuer: 'Westpac',
    type: 'credit',
    network: 'mastercard',
    tier: 'Black',
    annualFeeAud: 250,
    fxFeePercent: 3.3,
    rewardProgram: 'Qantas Frequent Flyer',
    pointsPerAudStandard: 0.75, // uncapped
    pointsProgramValueAudPerPoint: 0.0105, // ~1.05c per Qantas point
    color: {
      bg: 'from-red-600 to-rose-900',
      border: 'border-red-500',
      text: 'text-white',
      accent: '#DA1710',
    },
    features: ['0.75 Qantas pts per $1 uncapped', '2x Qantas Lounge passes/yr', 'Westpac Extras Cashback (ShopBack partner)', 'Comprehensive insurances'],
  },
  {
    id: 'westpac_altitude_black_rewards',
    name: 'Westpac Altitude Black (Altitude Points)',
    issuer: 'Westpac',
    type: 'credit',
    network: 'mastercard',
    tier: 'Black',
    annualFeeAud: 250,
    fxFeePercent: 3.3,
    rewardProgram: 'Westpac Altitude Rewards',
    pointsPerAudStandard: 1.25,
    pointsProgramValueAudPerPoint: 0.0045, // ~0.45c
    color: {
      bg: 'from-neutral-900 to-red-950',
      border: 'border-red-600',
      text: 'text-white',
      accent: '#DA1710',
    },
    features: ['1.25 Altitude pts per $1', 'Westpac Extras boost', 'Priority Pass 2 passes'],
  },
  {
    id: 'westpac_everyday_debit',
    name: 'Westpac Choice Everyday Debit',
    issuer: 'Westpac',
    type: 'debit',
    network: 'mastercard',
    tier: 'Standard',
    annualFeeAud: 0,
    fxFeePercent: 3.0,
    rewardProgram: 'Westpac Extras',
    pointsPerAudStandard: 0,
    pointsProgramValueAudPerPoint: 0,
    color: {
      bg: 'from-red-500 to-red-700',
      border: 'border-red-400',
      text: 'text-white',
      accent: '#E61C24',
    },
    features: ['Westpac Extras merchant cashback', 'ShopBack card-linked offers', 'Fee free under 30 or $2,000 deposit'],
  },

  // 3. Macquarie Bank (Marketplace King)
  {
    id: 'macquarie_transaction_debit',
    name: 'Macquarie Transaction Account',
    issuer: 'Macquarie Bank',
    type: 'debit',
    network: 'mastercard',
    tier: 'Standard',
    annualFeeAud: 0,
    fxFeePercent: 0, // Zero international fee
    rewardProgram: 'Macquarie Marketplace',
    pointsPerAudStandard: 0,
    pointsProgramValueAudPerPoint: 0,
    color: {
      bg: 'from-slate-900 to-black',
      border: 'border-slate-600',
      text: 'text-white',
      accent: '#10B981',
    },
    features: ['Macquarie Marketplace: 3-5% off gift cards instantly', '0% international transaction fees worldwide', 'Refunds ATM fees abroad', 'Earns 4.75% p.a. on transaction balance'],
  },
  {
    id: 'macquarie_platinum_card',
    name: 'Macquarie Platinum Card',
    issuer: 'Macquarie Bank',
    type: 'credit',
    network: 'visa',
    tier: 'Platinum',
    annualFeeAud: 0, // Often $0
    fxFeePercent: 0,
    rewardProgram: 'Macquarie Marketplace & Rewards',
    pointsPerAudStandard: 0.5,
    pointsProgramValueAudPerPoint: 0.005,
    color: {
      bg: 'from-gray-800 to-zinc-900',
      border: 'border-gray-500',
      text: 'text-white',
      accent: '#3B82F6',
    },
    features: ['0% FX fee on online/overseas purchases', 'Macquarie Marketplace discount access', 'Overseas travel insurance'],
  },

  // 4. ANZ
  {
    id: 'anz_rewards_black',
    name: 'ANZ Rewards Black',
    issuer: 'ANZ',
    type: 'credit',
    network: 'visa',
    tier: 'Black',
    annualFeeAud: 375,
    fxFeePercent: 3.0,
    rewardProgram: 'ANZ Rewards',
    pointsPerAudStandard: 1.5, // up to $5k/m then 0.5
    pointsProgramValueAudPerPoint: 0.0045,
    color: {
      bg: 'from-blue-700 to-sky-900',
      border: 'border-blue-400',
      text: 'text-white',
      accent: '#0072AC',
    },
    features: ['1.5 ANZ Reward pts per $1', 'Complimentary insurances', 'Transfer to Velocity/KrisFlyer/Asia Miles'],
  },
  {
    id: 'anz_frequent_flyer_black',
    name: 'ANZ Frequent Flyer Black',
    issuer: 'ANZ',
    type: 'credit',
    network: 'visa',
    tier: 'Black',
    annualFeeAud: 425,
    fxFeePercent: 3.0,
    rewardProgram: 'Qantas Frequent Flyer',
    pointsPerAudStandard: 1.0, // up to $7,500/m
    pointsProgramValueAudPerPoint: 0.0105,
    color: {
      bg: 'from-slate-900 to-blue-950',
      border: 'border-sky-500',
      text: 'text-white',
      accent: '#0072AC',
    },
    features: ['1.0 Qantas pt per $1 up to $7,500', '2x Qantas Club invitations', 'Qantas lounge invitations annually'],
  },
  {
    id: 'anz_plus_debit',
    name: 'ANZ Plus Account & Debit',
    issuer: 'ANZ',
    type: 'debit',
    network: 'visa',
    tier: 'Digital App',
    annualFeeAud: 0,
    fxFeePercent: 0, // No overseas ATM or FX transaction fees
    rewardProgram: 'None',
    pointsPerAudStandard: 0,
    pointsProgramValueAudPerPoint: 0,
    color: {
      bg: 'from-emerald-700 to-teal-900',
      border: 'border-emerald-400',
      text: 'text-white',
      accent: '#10B981',
    },
    features: ['0% foreign currency fee', 'Auto-roundups & savings goals', 'Competitive savings interest rate'],
  },

  // 5. NAB
  {
    id: 'nab_rewards_signature',
    name: 'NAB Rewards Signature',
    issuer: 'NAB',
    type: 'credit',
    network: 'visa',
    tier: 'Signature',
    annualFeeAud: 295,
    fxFeePercent: 3.0,
    rewardProgram: 'NAB Rewards',
    pointsPerAudStandard: 1.25, // 3.75 at major department/hardware, 2.5 on supermarkets
    pointsProgramValueAudPerPoint: 0.0045,
    color: {
      bg: 'from-red-700 to-neutral-900',
      border: 'border-red-600',
      text: 'text-white',
      accent: '#C70000',
    },
    features: ['Triple points (3.75 pts/$1) at hardware & department stores', 'Double points on grocery purchases', 'Transfer to Flybuys & airline partners'],
  },
  {
    id: 'nab_classic_debit',
    name: 'NAB Classic Banking Debit',
    issuer: 'NAB',
    type: 'debit',
    network: 'visa',
    tier: 'Standard',
    annualFeeAud: 0,
    fxFeePercent: 3.0,
    rewardProgram: 'None',
    pointsPerAudStandard: 0,
    pointsProgramValueAudPerPoint: 0,
    color: {
      bg: 'from-neutral-800 to-red-950',
      border: 'border-red-500',
      text: 'text-white',
      accent: '#C70000',
    },
    features: ['No monthly account fees', 'Wide national ATM network', 'Over-the-counter branch access'],
  },

  // 6. Up Bank
  {
    id: 'up_everyday_debit',
    name: 'Up Everyday Debit Card',
    issuer: 'Up (Bendigo & Adelaide Bank)',
    type: 'debit',
    network: 'mastercard',
    tier: 'Digital',
    annualFeeAud: 0,
    fxFeePercent: 0, // Zero FX markup
    rewardProgram: 'Up Perks & Hookups',
    pointsPerAudStandard: 0,
    pointsProgramValueAudPerPoint: 0,
    color: {
      bg: 'from-amber-500 to-orange-600',
      border: 'border-orange-400',
      text: 'text-white',
      accent: '#FF7043',
    },
    features: ['0% foreign exchange fees', 'Up Perks merchant deals & occasional Hookups', 'Instant spend notifications with logos', 'Split bills effortlessly'],
  },

  // 7. American Express Australia
  {
    id: 'amex_explorer',
    name: 'Amex Explorer Credit Card',
    issuer: 'American Express',
    type: 'credit',
    network: 'amex',
    tier: 'Premium',
    annualFeeAud: 395,
    fxFeePercent: 3.0,
    rewardProgram: 'Amex Membership Rewards Gateway',
    pointsPerAudStandard: 2.0, // 2 points per $1 on all eligible spend! (1 pt on gov)
    pointsProgramValueAudPerPoint: 0.005, // 2 pts = 1 airline mile = ~$0.01 value (~1% back)
    color: {
      bg: 'from-blue-600 to-sky-700',
      border: 'border-blue-400',
      text: 'text-white',
      accent: '#002663',
    },
    features: ['$400 Annual Travel Credit', '2 Amex MR points per $1 everywhere', 'Transfer to 8 frequent flyer programs', 'Amex Offers merchant cashback'],
  },
  {
    id: 'amex_platinum_edge',
    name: 'Amex Platinum Edge',
    issuer: 'American Express',
    type: 'credit',
    network: 'amex',
    tier: 'Platinum',
    annualFeeAud: 195,
    fxFeePercent: 3.0,
    rewardProgram: 'Amex Membership Rewards Ascent',
    pointsPerAudStandard: 1.0, // 3 pts on Supermarkets & Fuel!
    pointsProgramValueAudPerPoint: 0.005,
    color: {
      bg: 'from-slate-400 to-slate-700',
      border: 'border-slate-300',
      text: 'text-white',
      accent: '#E5E7EB',
    },
    features: ['$200 Annual Travel Credit', '3 Amex points per $1 on Supermarkets & Fuel', 'Comprehensive domestic/international insurance', 'Amex Offers statement credits'],
  },
  {
    id: 'amex_velocity_platinum',
    name: 'Amex Velocity Platinum',
    issuer: 'American Express',
    type: 'credit',
    network: 'amex',
    tier: 'Platinum',
    annualFeeAud: 375,
    fxFeePercent: 3.0,
    rewardProgram: 'Velocity Frequent Flyer',
    pointsPerAudStandard: 1.25, // 2.25 on Virgin flights
    pointsProgramValueAudPerPoint: 0.010, // ~1c per Velocity point
    color: {
      bg: 'from-purple-900 to-rose-900',
      border: 'border-purple-400',
      text: 'text-white',
      accent: '#7E22CE',
    },
    features: ['Complimentary return domestic Virgin flight annually', '2 Virgin Australia Lounge passes', '1.25 Velocity pts per $1 everyday spend', 'Amex Offers sync'],
  },
  {
    id: 'amex_qantas_discovery',
    name: 'Amex Qantas Discovery Card',
    issuer: 'American Express',
    type: 'credit',
    network: 'amex',
    tier: 'Entry',
    annualFeeAud: 0, // $0 annual fee!
    fxFeePercent: 3.0,
    rewardProgram: 'Qantas Frequent Flyer',
    pointsPerAudStandard: 0.75,
    pointsProgramValueAudPerPoint: 0.0105,
    color: {
      bg: 'from-red-800 to-neutral-900',
      border: 'border-red-500',
      text: 'text-white',
      accent: '#E11D48',
    },
    features: ['$0 annual fee for life', '0.75 Qantas point per $1 spent', 'Qantas direct sweep into QFF account', 'Amex Offers credits'],
  },

  // 8. Coles / Flybuys
  {
    id: 'coles_rewards_mastercard',
    name: 'Coles Rewards Mastercard',
    issuer: 'Coles Financial Services (NAB)',
    type: 'credit',
    network: 'mastercard',
    tier: 'Rewards',
    annualFeeAud: 99,
    fxFeePercent: 0, // 0% international transaction fees!
    rewardProgram: 'Flybuys Points',
    pointsPerAudStandard: 2.0, // 2 Flybuys pts per $1 up to $3k/m
    pointsProgramValueAudPerPoint: 0.005, // 2,000 Flybuys = $10 at checkout = 0.5c/pt
    color: {
      bg: 'from-red-600 to-red-800',
      border: 'border-red-400',
      text: 'text-white',
      accent: '#E01A22',
    },
    features: ['0% international transaction fee', '2 Flybuys points per $1 everywhere', 'Points instantly convert to Coles supermarket dollars', 'Free delivery on Coles orders'],
  },
  {
    id: 'coles_no_annual_fee_mastercard',
    name: 'Coles No Annual Fee Mastercard',
    issuer: 'Coles Financial Services (NAB)',
    type: 'credit',
    network: 'mastercard',
    tier: 'No Fee',
    annualFeeAud: 0,
    fxFeePercent: 2.5,
    rewardProgram: 'Flybuys Points',
    pointsPerAudStandard: 0.5,
    pointsProgramValueAudPerPoint: 0.005,
    color: {
      bg: 'from-stone-700 to-red-900',
      border: 'border-stone-500',
      text: 'text-white',
      accent: '#E01A22',
    },
    features: ['$0 annual fee permanently', '0.5 Flybuys point per $1', 'Flybuys integration'],
  },

  // 9. Everyday Rewards / Woolworths
  {
    id: 'everyday_rewards_platinum',
    name: 'Everyday Extra Platinum Card',
    issuer: 'Woolworths / Everyday Rewards',
    type: 'credit',
    network: 'visa',
    tier: 'Platinum',
    annualFeeAud: 49,
    fxFeePercent: 3.0,
    rewardProgram: 'Everyday Rewards',
    pointsPerAudStandard: 1.0, // 3 pts at Woolworths Group
    pointsProgramValueAudPerPoint: 0.005, // 2,000 Everyday pts = $10 off
    color: {
      bg: 'from-emerald-600 to-green-800',
      border: 'border-emerald-400',
      text: 'text-white',
      accent: '#15803D',
    },
    features: ['10% off one Woolworths & BIG W shop each month', '3 points per $1 at Woolies, BWS & partner stores', 'Fuel discounts at EG Ampol'],
  },

  // 10. ING
  {
    id: 'ing_orange_everyday',
    name: 'ING Orange Everyday Debit',
    issuer: 'ING Australia',
    type: 'debit',
    network: 'visa',
    tier: 'Everyday',
    annualFeeAud: 0,
    fxFeePercent: 0, // Rebated if requirements met ($1,000 dep + 5 swipes)
    rewardProgram: 'ING Rebates',
    pointsPerAudStandard: 0,
    pointsProgramValueAudPerPoint: 0,
    color: {
      bg: 'from-orange-500 to-amber-600',
      border: 'border-orange-400',
      text: 'text-white',
      accent: '#FF6200',
    },
    features: ['100% International FX & ATM fee rebate with monthly criteria', 'Unlocks ING Savings Maximiser 5.50% interest', 'Apple Pay & Google Pay ready'],
  },
  {
    id: 'ing_one_low_rate',
    name: 'ING One Low Rate Credit Card',
    issuer: 'ING Australia',
    type: 'credit',
    network: 'visa',
    tier: 'Low Rate',
    annualFeeAud: 0,
    fxFeePercent: 0,
    rewardProgram: 'None',
    pointsPerAudStandard: 0,
    pointsProgramValueAudPerPoint: 0,
    color: {
      bg: 'from-zinc-800 to-orange-950',
      border: 'border-orange-500',
      text: 'text-white',
      accent: '#FF6200',
    },
    features: ['$0 annual fee with zero hoops', '0% international transaction fees', 'Low interest purchase rate'],
  },

  // 11. HSBC (Cashback Giant)
  {
    id: 'hsbc_everyday_global',
    name: 'HSBC Everyday Global Account',
    issuer: 'HSBC Australia',
    type: 'debit',
    network: 'visa',
    tier: 'Everyday',
    annualFeeAud: 0,
    fxFeePercent: 0, // Zero FX fees
    rewardProgram: 'HSBC 2% Tap Cashback',
    pointsPerAudStandard: 0,
    pointsProgramValueAudPerPoint: 0,
    color: {
      bg: 'from-rose-700 to-neutral-900',
      border: 'border-rose-500',
      text: 'text-white',
      accent: '#DB0011',
    },
    features: ['2% cashback on eligible tap & pay purchases under $100 (up to $50/month)', '0% foreign transaction fees in 10 currencies', 'No monthly account keeping fee'],
  },

  // 12. Bankwest
  {
    id: 'bankwest_qantas_transaction',
    name: 'Bankwest Qantas Transaction Debit',
    issuer: 'Bankwest',
    type: 'debit',
    network: 'mastercard',
    tier: 'Frequent Flyer',
    annualFeeAud: 72, // $6/m waived with $2,000 deposit
    fxFeePercent: 0, // 0% foreign transaction fee!
    rewardProgram: 'Qantas Frequent Flyer',
    pointsPerAudStandard: 0.1, // Points per swipe & on account balance
    pointsProgramValueAudPerPoint: 0.0105,
    color: {
      bg: 'from-amber-600 to-orange-800',
      border: 'border-amber-400',
      text: 'text-white',
      accent: '#F59E0B',
    },
    features: ['Earn Qantas Points on your everyday bank balance', '0% foreign transaction fee on online & overseas', 'Qantas points on every eligible debit swipe'],
  },
  {
    id: 'bankwest_more_platinum',
    name: 'Bankwest More Platinum',
    issuer: 'Bankwest',
    type: 'credit',
    network: 'mastercard',
    tier: 'Platinum',
    annualFeeAud: 140,
    fxFeePercent: 0,
    rewardProgram: 'Bankwest More Rewards',
    pointsPerAudStandard: 1.5,
    pointsProgramValueAudPerPoint: 0.0035,
    color: {
      bg: 'from-zinc-900 to-amber-950',
      border: 'border-amber-500',
      text: 'text-white',
      accent: '#F59E0B',
    },
    features: ['0% foreign currency conversion fee', 'Comprehensive travel insurance included', '1.5 More Rewards points per $1'],
  },

  // 13. Virgin Money
  {
    id: 'virgin_money_flyer',
    name: 'Virgin Money Flyer Credit Card',
    issuer: 'Virgin Money',
    type: 'credit',
    network: 'visa',
    tier: 'Flyer',
    annualFeeAud: 129,
    fxFeePercent: 3.3,
    rewardProgram: 'Velocity Frequent Flyer',
    pointsPerAudStandard: 0.66, // 0.66 Velocity pts per $1
    pointsProgramValueAudPerPoint: 0.010,
    color: {
      bg: 'from-red-600 to-violet-900',
      border: 'border-red-400',
      text: 'text-white',
      accent: '#E10600',
    },
    features: ['$129 Virgin Australia gift voucher every year', 'Direct earn Velocity Frequent Flyer points', 'Complimentary insurances'],
  },

  // 14. UBank
  {
    id: 'ubank_spend_debit',
    name: 'UBank Spend Account & Debit',
    issuer: 'UBank (NAB)',
    type: 'debit',
    network: 'visa',
    tier: 'Digital',
    annualFeeAud: 0,
    fxFeePercent: 0, // No overseas FX fee
    rewardProgram: 'None',
    pointsPerAudStandard: 0,
    pointsProgramValueAudPerPoint: 0,
    color: {
      bg: 'from-purple-800 to-indigo-950',
      border: 'border-purple-400',
      text: 'text-white',
      accent: '#8B5CF6',
    },
    features: ['Zero international purchase fees', 'Zero account fees', 'Pair with Save account for top interest rate'],
  },

  // 15. Bendigo Bank
  {
    id: 'bendigo_platinum_rewards',
    name: 'Bendigo Platinum Rewards',
    issuer: 'Bendigo Bank',
    type: 'credit',
    network: 'mastercard',
    tier: 'Platinum',
    annualFeeAud: 149,
    fxFeePercent: 3.0,
    rewardProgram: 'Bendigo Rewards',
    pointsPerAudStandard: 1.5,
    pointsProgramValueAudPerPoint: 0.004,
    color: {
      bg: 'from-rose-800 to-stone-900',
      border: 'border-rose-400',
      text: 'text-white',
      accent: '#991B1B',
    },
    features: ['1.5 points per $1 spent', 'International travel insurance', 'Community bank backing'],
  },

  // 16. Revolut Australia
  {
    id: 'revolut_debit',
    name: 'Revolut Multi-Currency Debit',
    issuer: 'Revolut Australia',
    type: 'debit',
    network: 'visa',
    tier: 'Digital App',
    annualFeeAud: 0,
    fxFeePercent: 0,
    rewardProgram: 'RevPoints',
    pointsPerAudStandard: 0.2,
    pointsProgramValueAudPerPoint: 0.01,
    color: {
      bg: 'from-sky-700 to-blue-950',
      border: 'border-sky-400',
      text: 'text-white',
      accent: '#0075EB',
    },
    features: ['0% FX fees with interbank exchange rates', 'Disposable virtual cards for security', 'Access to daily-interest Savings Vaults', 'Multi-currency holding in 30+ currencies'],
  },

  // 17. NRMA & Auto Clubs (RACV, RACQ, RAA)
  {
    id: 'nrma_blue_member',
    name: 'NRMA Blue / RACV Member Perks',
    issuer: 'NRMA / RACV / RACQ',
    type: 'debit',
    network: 'visa',
    tier: 'Member Benefits',
    annualFeeAud: 0,
    fxFeePercent: 0,
    rewardProgram: 'Auto Club eGift Discounts',
    pointsPerAudStandard: 0,
    pointsProgramValueAudPerPoint: 0,
    color: {
      bg: 'from-blue-700 to-indigo-900',
      border: 'border-blue-400',
      text: 'text-white',
      accent: '#004B87',
    },
    features: ['Up to 4-5% off instant eGift cards (Woolworths, Coles, Ampol, JB Hi-Fi, Apple)', '4c/L off Ampol fuel with app barcode', 'Accessible to 3M+ Australian auto club members'],
  },

  // 18. Suncorp Bank
  {
    id: 'suncorp_everyday_options',
    name: 'Suncorp Everyday Options Account',
    issuer: 'Suncorp Bank',
    type: 'debit',
    network: 'visa',
    tier: 'Everyday',
    annualFeeAud: 0,
    fxFeePercent: 3.0,
    rewardProgram: 'Suncorp App eGift Cards',
    pointsPerAudStandard: 0,
    pointsProgramValueAudPerPoint: 0,
    color: {
      bg: 'from-emerald-700 to-teal-950',
      border: 'border-emerald-400',
      text: 'text-white',
      accent: '#007A33',
    },
    features: ['Suncorp App discounted eGift Cards (Woolies 4%, JB 4%, Kmart 4%)', '$0 monthly account fees with zero deposit hurdles', 'Up to 9 sub-accounts for smart budgeting'],
  },

  // 19. ShopBack / Cashrewards
  {
    id: 'shopback_gift_cards',
    name: 'ShopBack / Cashrewards eGift Cards',
    issuer: 'ShopBack / Cashrewards',
    type: 'debit',
    network: 'mastercard',
    tier: 'Card-Linked',
    annualFeeAud: 0,
    fxFeePercent: 0,
    rewardProgram: 'Instant Cashback eGift Cards',
    pointsPerAudStandard: 0,
    pointsProgramValueAudPerPoint: 0,
    color: {
      bg: 'from-red-600 to-rose-900',
      border: 'border-rose-400',
      text: 'text-white',
      accent: '#FF3366',
    },
    features: ['Instant digital gift cards with immediate cashback', 'Pay with any card (Visa, Mastercard, Apple Pay)', 'Stackable with underlying credit card points'],
  },

  // 20. Bupa Life Rewards
  {
    id: 'bupa_life_rewards',
    name: 'Bupa Life Rewards / Health Perks',
    issuer: 'Bupa Australia',
    type: 'debit',
    network: 'visa',
    tier: 'Health Member Benefits',
    annualFeeAud: 0,
    fxFeePercent: 0,
    rewardProgram: 'Bupa Life Rewards',
    pointsPerAudStandard: 0,
    pointsProgramValueAudPerPoint: 0,
    color: {
      bg: 'from-cyan-700 to-sky-950',
      border: 'border-cyan-400',
      text: 'text-white',
      accent: '#00A3E0',
    },
    features: ['4% off Woolworths & Coles digital eGift Cards', '4% off JB Hi-Fi and tech', 'Available to Bupa health insurance members'],
  }
];

export const CARDS_MAP: Record<string, BankCard> = CARDS_DATA.reduce((acc, card) => {
  acc[card.id] = card;
  return acc;
}, {} as Record<string, BankCard>);
