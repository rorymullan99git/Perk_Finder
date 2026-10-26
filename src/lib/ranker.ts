import { BankCard, Merchant, PerkOffer, RankedOffer } from '@/types';
import { MERCHANTS_MAP } from '@/data/merchants';

/**
 * Calculates net financial value and breakdown for a perk offer.
 * Strictly enforces that 0% Foreign Transaction Fee waivers only generate
 * financial savings on international/foreign currency transactions.
 * For domestic AUD purchases, FX savings evaluate to $0.00 (0% return).
 */
export function calculateNetValue(
  offer: PerkOffer,
  card: BankCard,
  spendAud: number,
  merchant?: Merchant
): {
  grossSavingsAud: number;
  pointsEarned: number;
  pointsValueAud: number;
  netBenefitAud: number;
  effectiveReturnPercent: number;
  breakdownSteps: string[];
} {
  let grossSavingsAud = 0;
  const breakdownSteps: string[] = [];

  const isFxWaiver = 
    offer.offer_type === 'FX_FEE_WAIVER' || 
    offer.perkType === 'surcharge_free' || 
    offer.perkType === 'FX_FEE_WAIVER';

  // 1. Ensure domestic transactions do not receive FX fee savings:
  if (isFxWaiver) {
    const transactionCurrency = merchant?.currency || offer.currency || 'AUD';
    const isDomesticAud = !transactionCurrency || transactionCurrency === 'AUD';

    if (isDomesticAud) {
      grossSavingsAud = 0;
      breakdownSteps.push('Domestic AUD transaction: 0% FX saving does not apply.');
    } else {
      const benchmarkFxRate = (offer.discountPercent ? offer.discountPercent / 100 : 0.03); // 3% typical fee
      const saved = spendAud * benchmarkFxRate;
      grossSavingsAud = saved;
      breakdownSteps.push(
        `Saved ${(benchmarkFxRate * 100).toFixed(1)}% standard international card fee ($${saved.toFixed(2)})`
      );
    }
  } else if (offer.perkType === 'gift_card_discount' && offer.discountPercent) {
    grossSavingsAud = (spendAud * offer.discountPercent) / 100;
    breakdownSteps.push(
      `Instant eGift Card Discount (${offer.discountPercent}%): Save $${grossSavingsAud.toFixed(2)} upfront on $${spendAud.toFixed(2)} purchase.`
    );
  } else if (offer.perkType === 'direct_cashback' && offer.cashbackPercent) {
    let rawCashback = (spendAud * offer.cashbackPercent) / 100;
    if (offer.maxDiscountAud && rawCashback > offer.maxDiscountAud) {
      grossSavingsAud = offer.maxDiscountAud;
      breakdownSteps.push(
        `Direct Cashback (${offer.cashbackPercent}%): Capped at max $${offer.maxDiscountAud.toFixed(2)} statement credit.`
      );
    } else {
      grossSavingsAud = rawCashback;
      breakdownSteps.push(
        `Direct Cashback (${offer.cashbackPercent}%): $${grossSavingsAud.toFixed(2)} credited back to your account.`
      );
    }
  }

  // 2. Calculate Reward Points Earned & AUD Valuation
  let pointsPerAud = offer.bonusPointsPerAud ?? card.pointsPerAudStandard;
  let pointsEarned = 0;
  let pointsValueAud = 0;

  if (pointsPerAud > 0 && card.pointsProgramValueAudPerPoint > 0) {
    pointsEarned = Math.round(spendAud * pointsPerAud);
    pointsValueAud = pointsEarned * card.pointsProgramValueAudPerPoint;
    const ptValCents = (card.pointsProgramValueAudPerPoint * 100).toFixed(2);
    breakdownSteps.push(
      `Reward Points (${pointsPerAud} pts/$1): ${pointsEarned.toLocaleString()} ${card.rewardProgram} points valued at ~${ptValCents}¢/pt = $${pointsValueAud.toFixed(2)} AUD.`
    );
  }

  const netBenefitAud = Number((grossSavingsAud + pointsValueAud).toFixed(2));
  const effectiveReturnPercent = spendAud > 0 ? Number(((netBenefitAud / spendAud) * 100).toFixed(2)) : 0;

  return {
    grossSavingsAud: Number(grossSavingsAud.toFixed(2)),
    pointsEarned,
    pointsValueAud: Number(pointsValueAud.toFixed(2)),
    netBenefitAud,
    effectiveReturnPercent,
    breakdownSteps,
  };
}

/**
 * Pure Math Ranking Engine for PerkPilot AU
 * 
 * Strict merit-first ranking model:
 * Pure financial math dictates all rankings; monetization/affiliates
 * has ZERO influence on ranking, order, or visibility.
 */
export function rankOffers(
  offers: PerkOffer[],
  products: Record<string, BankCard>,
  heldCardIds: string[],
  merchantId: string,
  spendAud: number
): { bestOwned: RankedOffer[]; bestMarket: RankedOffer[] } {
  const safeSpend = Math.max(0.01, spendAud || 100);
  const merchant: Merchant | undefined = MERCHANTS_MAP[merchantId];
  const merchantCategory = merchant?.category;

  const rankedList: RankedOffer[] = [];
  const processedOfferKeys = new Set<string>();

  // 1. Process explicit Perk Offers (eGift cards, cashback boosts, category multipliers)
  for (const offer of offers) {
    const card = products[offer.cardId];
    if (!card) continue;

    // Filter by merchant match or category match or universal
    const isExactMerchant = offer.merchantId === merchantId;
    const isCategoryMatch = !offer.merchantId && offer.merchantCategory && offer.merchantCategory === merchantCategory;
    const isUniversal = !offer.merchantId && !offer.merchantCategory;

    if (!isExactMerchant && !isCategoryMatch && !isUniversal) {
      continue;
    }

    // Check min spend if any
    if (offer.minSpendAud && safeSpend < offer.minSpendAud) {
      continue;
    }

    // Special condition: HSBC tap & pay cashback is valid for purchases <= $100 AUD
    if (offer.id.startsWith('hsbc_tap') && safeSpend > 100) {
      continue;
    }

    const {
      grossSavingsAud,
      pointsEarned,
      pointsValueAud,
      netBenefitAud,
      effectiveReturnPercent,
      breakdownSteps
    } = calculateNetValue(offer, card, safeSpend, merchant);

    const isOwned = heldCardIds.includes(card.id);

    let actionLabel = 'Pay directly with card';
    if (offer.isGiftCardPurchase) {
      actionLabel = 'Buy discounted eGift card first in app';
    } else if (offer.perkType === 'direct_cashback' && offer.title.includes('Yello')) {
      actionLabel = 'Activate Yello offer & pay with card';
    } else if (offer.perkType === 'direct_cashback' && offer.title.includes('Extras')) {
      actionLabel = 'Link in Westpac Extras & pay';
    } else if (offer.id.startsWith('hsbc_tap')) {
      actionLabel = 'Tap card / phone (contactless)';
    }

    let badgeText = '';
    const isFxWaiver = 
      offer.offer_type === 'FX_FEE_WAIVER' || 
      offer.perkType === 'surcharge_free' || 
      offer.perkType === 'FX_FEE_WAIVER';

    if (offer.isGiftCardPurchase) badgeText = 'eGift Card Discount';
    else if (offer.perkType === 'direct_cashback') badgeText = 'Direct Cashback';
    else if (offer.perkType === 'points_multiplier') badgeText = 'Points Multiplier';
    else if (isFxWaiver) badgeText = grossSavingsAud > 0 ? '0% FX Fee' : '0% FX (Domestic $0)';

    const ranked: RankedOffer = {
      offerId: offer.id,
      card,
      perk: offer,
      spendAud: safeSpend,
      grossSavingsAud,
      pointsEarned,
      pointsValueAud,
      netBenefitAud,
      effectiveReturnPercent,
      breakdownSteps,
      actionLabel,
      isGiftCard: Boolean(offer.isGiftCardPurchase),
      isOwned,
      badgeText,
    };

    rankedList.push(ranked);
    processedOfferKeys.add(`${card.id}_${offer.id}`);
  }

  // 2. Also calculate standard baseline earn for every card not covered by a specialized promo above
  // This guarantees that any card the user holds has a calculated return based on standard reward rates!
  for (const card of Object.values(products)) {
    // If card has points and wasn't already covered in a merchant offer
    const alreadyProcessed = rankedList.some(r => r.card.id === card.id);
    const earnsPoints = card.pointsPerAudStandard > 0 && card.pointsProgramValueAudPerPoint > 0;
    // Held cards that earn nothing still get a $0 row, so the user's deck never ranks as empty.
    if (!alreadyProcessed && (earnsPoints || heldCardIds.includes(card.id))) {
      const pointsEarned = Math.round(safeSpend * card.pointsPerAudStandard);
      const pointsValueAud = pointsEarned * card.pointsProgramValueAudPerPoint;
      const netBenefitAud = Number(pointsValueAud.toFixed(2));
      const effectiveReturnPercent = Number(((netBenefitAud / safeSpend) * 100).toFixed(2));
      const ptValCents = (card.pointsProgramValueAudPerPoint * 100).toFixed(2);

      const baselineOffer: PerkOffer = {
        id: `base_${card.id}`,
        cardId: card.id,
        perkType: 'points_multiplier',
        title: `${card.name} Standard Earn`,
        description: `Standard everyday reward points earn on all eligible spending.`,
        bonusPointsPerAud: card.pointsPerAudStandard,
        terms: 'Standard credit/debit card purchase.',
      };

      rankedList.push({
        offerId: `base_${card.id}`,
        card,
        perk: baselineOffer,
        spendAud: safeSpend,
        grossSavingsAud: 0,
        pointsEarned,
        pointsValueAud: Number(pointsValueAud.toFixed(2)),
        netBenefitAud,
        effectiveReturnPercent,
        breakdownSteps: earnsPoints
          ? [`Base Points (${card.pointsPerAudStandard} pts/$1): ${pointsEarned.toLocaleString()} ${card.rewardProgram} points valued at ~${ptValCents}¢/pt = $${pointsValueAud.toFixed(2)} AUD.`]
          : ['No rewards or cashback on standard spend with this card.'],
        actionLabel: 'Pay directly with card',
        isGiftCard: false,
        isOwned: heldCardIds.includes(card.id),
        badgeText: earnsPoints ? 'Base Points' : 'No Rewards',
      });
    }
  }

  // Deduplicate per card to present the single best strategy for that card
  const deduplicateByCard = (items: RankedOffer[]): RankedOffer[] => {
    const bestByCard: Record<string, RankedOffer> = {};
    for (const item of items) {
      const existing = bestByCard[item.card.id];
      if (!existing || item.netBenefitAud > existing.netBenefitAud) {
        bestByCard[item.card.id] = item;
      }
    }
    return Object.values(bestByCard);
  };

  // Rank owned cards
  const ownedOffers = deduplicateByCard(rankedList.filter(r => r.isOwned))
    .sort((a, b) => b.netBenefitAud - a.netBenefitAud);

  // Rank market-wide offers
  const marketOffers = deduplicateByCard(rankedList)
    .sort((a, b) => b.netBenefitAud - a.netBenefitAud);

  return {
    bestOwned: ownedOffers,
    bestMarket: marketOffers,
  };
}
