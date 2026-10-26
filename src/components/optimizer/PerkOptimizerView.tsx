'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { usePerkStore } from '@/store/usePerkStore';
import { MERCHANTS_DATA, MERCHANTS_MAP } from '@/data/merchants';
import { CARDS_MAP } from '@/data/cards';
import { PERK_OFFERS_DATA, PERK_OFFERS_AS_OF } from '@/data/perkOffers';
import { rankOffers } from '@/lib/ranker';
import { RankedOffer } from '@/types';
import { formatAud, formatPercent } from '@/lib/utils';
import { MerchantCombobox } from '@/components/ui/combobox';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Calculator,
  Gift,
  Coins,
  DollarSign,
  TrendingUp,
  Zap,
  Info,
  Layers
} from 'lucide-react';

export const PerkOptimizerView: React.FC = () => {
  const { 
    selectedMerchantId, 
    setSelectedMerchantId, 
    spendAud, 
    setSpendAud, 
    heldCardIds, 
    setActiveTab,
    toggleHeldCard,
    setShowMathModal
  } = usePerkStore();

  const [filterType, setFilterType] = useState<'all' | 'owned' | 'giftcard' | 'cashback'>('all');
  const [selectedOfferForDetail, setSelectedOfferForDetail] = useState<RankedOffer | null>(null);
  const [spendText, setSpendText] = useState(String(spendAud));

  useEffect(() => {
    if (!selectedOfferForDetail) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelectedOfferForDetail(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedOfferForDetail]);

  const selectedMerchant = MERCHANTS_MAP[selectedMerchantId] || MERCHANTS_DATA[0];

  type PillarCategory = 'essentials' | 'tech' | 'fuel';

  const categoryMerchants: Record<PillarCategory, string[]> = {
    essentials: ['woolworths', 'coles', 'aldi', 'bunnings', 'kmart'],
    tech: ['jb_hifi', 'apple', 'officeworks', 'the_good_guys'],
    fuel: ['seven_eleven', 'ampol', 'bp'],
  };

  const [activeCategory, setActiveCategory] = useState<PillarCategory>(() => {
    const current = MERCHANTS_MAP[selectedMerchantId];
    if (current?.pillarCategory === 'essentials' || current?.pillarCategory === 'tech' || current?.pillarCategory === 'fuel') {
      return current.pillarCategory;
    }
    return 'essentials';
  });

  // Keep active category in sync if merchant changes via combobox or URL
  useEffect(() => {
    const current = MERCHANTS_MAP[selectedMerchantId];
    if (current?.pillarCategory === 'essentials' || current?.pillarCategory === 'tech' || current?.pillarCategory === 'fuel') {
      setActiveCategory(current.pillarCategory);
    }
  }, [selectedMerchantId]);

  // Spend presets
  const spendPresets = [50, 100, 200, 500, 1200];

  // Pure Math Calculation
  const { bestOwned, bestMarket } = useMemo(() => {
    return rankOffers(
      PERK_OFFERS_DATA,
      CARDS_MAP,
      heldCardIds,
      selectedMerchant.id,
      spendAud
    );
  }, [heldCardIds, selectedMerchant.id, spendAud]);

  const topOwned: RankedOffer | undefined = bestOwned[0];
  const topMarket: RankedOffer | undefined = bestMarket[0];

  const isHoldingBest = topOwned && topMarket && topOwned.card.id === topMarket.card.id && topOwned.netBenefitAud >= topMarket.netBenefitAud;
  const missedSavingsAud = topMarket && topOwned ? Math.max(0, topMarket.netBenefitAud - topOwned.netBenefitAud) : (topMarket ? topMarket.netBenefitAud : 0);

  // Filter full ledger
  const filteredLedger = useMemo(() => {
    let list = bestMarket;
    if (filterType === 'owned') {
      list = list.filter(item => item.isOwned);
    } else if (filterType === 'giftcard') {
      list = list.filter(item => item.isGiftCard);
    } else if (filterType === 'cashback') {
      list = list.filter(item => item.perk.perkType === 'direct_cashback');
    }
    return list;
  }, [bestMarket, filterType]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Cathedral: the tool is the entrance */}
      <section className="rounded-3xl bg-stone-900 text-white p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Never swipe the wrong card again.
          </h1>
          <button
            onClick={() => setShowMathModal(true)}
            className="text-sm text-emerald-300 hover:text-emerald-200 underline underline-offset-4 self-start md:self-auto"
          >
            See the formula
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-7 space-y-2">
            <label className="text-sm font-semibold text-stone-300">Where are you shopping?</label>
            <MerchantCombobox
              merchants={MERCHANTS_DATA}
              selectedId={selectedMerchant.id}
              onSelect={(id) => setSelectedMerchantId(id)}
            />
            {/* Category tabs: Essentials, Tech, Fuel */}
            <div className="space-y-2 pt-2">
              <div className="inline-flex items-center rounded-xl border border-stone-700 bg-stone-950/80 p-0.5 divide-x divide-stone-700 shadow-sm">
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('essentials');
                    if (!categoryMerchants.essentials.includes(selectedMerchant.id)) {
                      setSelectedMerchantId('woolworths');
                    }
                  }}
                  className={`text-xs uppercase tracking-wider font-bold px-3 py-1.5 rounded-l-lg transition-all flex items-center gap-1.5 ${
                    activeCategory === 'essentials'
                      ? 'bg-emerald-500 text-stone-950 shadow-sm'
                      : 'text-stone-300 hover:text-white hover:bg-stone-900'
                  }`}
                >
                  <span>🛒</span>
                  <span>Essentials</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('tech');
                    if (!categoryMerchants.tech.includes(selectedMerchant.id)) {
                      setSelectedMerchantId('jb_hifi');
                    }
                  }}
                  className={`text-xs uppercase tracking-wider font-bold px-3 py-1.5 transition-all flex items-center gap-1.5 ${
                    activeCategory === 'tech'
                      ? 'bg-emerald-500 text-stone-950 shadow-sm'
                      : 'text-stone-300 hover:text-white hover:bg-stone-900'
                  }`}
                >
                  <span>💻</span>
                  <span>Tech</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('fuel');
                    if (!categoryMerchants.fuel.includes(selectedMerchant.id)) {
                      setSelectedMerchantId('seven_eleven');
                    }
                  }}
                  className={`text-xs uppercase tracking-wider font-bold px-3 py-1.5 rounded-r-lg transition-all flex items-center gap-1.5 ${
                    activeCategory === 'fuel'
                      ? 'bg-emerald-500 text-stone-950 shadow-sm'
                      : 'text-stone-300 hover:text-white hover:bg-stone-900'
                  }`}
                >
                  <span>⛽</span>
                  <span>Fuel (inc. 7-Eleven)</span>
                </button>
              </div>

              {/* Merchant chips for the active category */}
              <div className="flex flex-wrap gap-1.5 pt-0.5" role="group" aria-label="Category merchants">
                {categoryMerchants[activeCategory].map((id) => {
                  const m = MERCHANTS_MAP[id];
                  if (!m) return null;
                  const isSelected = m.id === selectedMerchant.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMerchantId(m.id)}
                      aria-pressed={isSelected}
                      className={`text-sm px-3 py-1.5 rounded-xl transition-all font-medium flex items-center gap-2 border ${
                        isSelected
                          ? 'bg-emerald-500 text-stone-950 font-bold border-stone-900 shadow-md scale-[1.02]'
                          : 'bg-stone-900/60 text-stone-200 border-stone-700 hover:border-emerald-400 hover:bg-stone-800'
                      }`}
                    >
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: m.color }}
                      />
                      <span>{m.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="md:col-span-5 space-y-2">
            <label htmlFor="spend" className="text-sm font-semibold text-stone-300 flex items-baseline justify-between">
              <span>Purchase amount (AUD)</span>
              <span className="text-xs font-normal text-stone-400">
                Typical at {selectedMerchant.name}: ${selectedMerchant.defaultSpendAud}
              </span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-stone-400">$</span>
              <input
                id="spend"
                type="number"
                inputMode="decimal"
                min="1"
                step="5"
                value={spendText}
                onChange={(e) => {
                  setSpendText(e.target.value);
                  const n = parseFloat(e.target.value);
                  if (Number.isFinite(n) && n > 0) setSpendAud(n);
                }}
                onBlur={() => setSpendText(String(spendAud))}
                className="flex h-12 w-full rounded-2xl border border-stone-700 bg-stone-950 pl-9 pr-4 text-lg font-bold text-white focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
              />
            </div>
            <div className="inline-flex rounded-xl border border-stone-700 bg-stone-950/80 p-0.5 divide-x divide-stone-700 shadow-sm mt-1" role="group" aria-label="Spend presets">
              {spendPresets.map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    setSpendAud(amount);
                    setSpendText(String(amount));
                  }}
                  aria-pressed={spendAud === amount}
                  className={`text-xs px-3 py-1.5 font-bold transition-all first:rounded-l-lg last:rounded-r-lg ${
                    spendAud === amount
                      ? 'bg-emerald-500 text-stone-950 shadow-sm'
                      : 'text-stone-300 hover:text-white hover:bg-stone-900'
                  }`}
                >
                  ${amount}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Verdict: the answer, in a sentence */}
        {topMarket && (
          <p className="mt-6 pt-5 border-t border-white/10 text-base md:text-lg text-stone-200" aria-live="polite">
            {isHoldingBest ? (
              <>You&apos;re already holding the best option at {selectedMerchant.name}: <strong className="text-emerald-300">{topMarket.card.name}</strong> returns <strong className="text-emerald-300">{formatAud(topMarket.netBenefitAud)}</strong> on ${spendAud}.</>
            ) : topOwned ? (
              <>Use <strong className="text-emerald-300">{topOwned.card.name}</strong> to keep <strong className="text-emerald-300">{formatAud(topOwned.netBenefitAud)}</strong>. <strong className="text-amber-300">{topMarket.card.name}</strong> would earn <strong className="text-amber-300">{formatAud(missedSavingsAud)}</strong> more.</>
            ) : (
              <>Best available at {selectedMerchant.name}: <strong className="text-amber-300">{topMarket.card.name}</strong> returns <strong className="text-amber-300">{formatAud(topMarket.netBenefitAud)}</strong> on ${spendAud}. Add your cards in My Deck for a personal pick.</>
            )}
          </p>
        )}
      </section>


      {/* Primary Comparison: Best Held Card vs Best in Australia */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Box 1: Your Best Card (Owned) */}
        <Card className="relative overflow-hidden h-full border-2 border-emerald-500/40 bg-gradient-to-b from-emerald-50/40 via-white to-white dark:from-emerald-950/20 dark:via-stone-900 dark:to-stone-900 shadow-lg shadow-emerald-500/5">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    Your Deck Recommendation
                  </span>
                  <CardTitle className="text-xl">Your Best Card to Swipe</CardTitle>
                </div>
              </div>
              {topOwned && (
                <Badge variant="success" className="text-sm px-3 py-1 font-bold">
                  {formatPercent(topOwned.effectiveReturnPercent)} Return
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {topOwned ? (
              <>
                <div className="p-4 rounded-2xl bg-white border border-stone-200/80 dark:bg-stone-800/80 dark:border-stone-700 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-lg text-stone-900 dark:text-white">
                          {topOwned.card.name}
                        </span>
                        <Badge variant="outline" className="text-xs uppercase font-bold">
                          {topOwned.card.issuer}
                        </Badge>
                      </div>
                      <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">
                        {topOwned.perk.title}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
                        +{formatAud(topOwned.netBenefitAud)}
                      </div>
                      <span className="text-xs text-stone-600">Est. value, before annual fee</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-700/60 flex items-center justify-between text-xs text-stone-600 dark:text-stone-300">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Zap className="h-3.5 w-3.5 text-amber-500" />
                      <span>Action: <strong>{topOwned.actionLabel}</strong></span>
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {topOwned.badgeText}
                    </Badge>
                  </div>
                </div>

                {/* Math Breakdown Steps */}
                <div className="rounded-xl bg-stone-50 p-3.5 text-xs space-y-1.5 text-stone-700 dark:bg-stone-800/50 dark:text-stone-300 border border-stone-200/60 dark:border-stone-700/40">
                  <div className="font-semibold text-stone-900 dark:text-stone-100 flex items-center justify-between">
                    <span>How the math works:</span>
                    <button
                      onClick={() => setShowMathModal(true)}
                      className="text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      <Info className="h-3 w-3" />
                      Audit
                    </button>
                  </div>
                  {topOwned.breakdownSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-700 font-bold">•</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>

                {topOwned.perk.instructions && (
                  <div className="text-xs text-stone-600 dark:text-stone-400 bg-stone-100/70 dark:bg-stone-800/40 p-2.5 rounded-xl">
                    <span className="font-bold text-stone-700 dark:text-stone-300">Execution steps: </span>
                    {topOwned.perk.instructions}
                  </div>
                )}
              </>
            ) : (
              <div className="py-8 px-4 text-center space-y-3 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700">
                <AlertCircle className="h-10 w-10 text-stone-600 mx-auto" />
                <div>
                  <h4 className="font-bold text-stone-800 dark:text-stone-200">
                    No cards selected in your deck
                  </h4>
                  <p className="text-xs text-stone-600 max-w-sm mx-auto mt-1">
                    Select the cards and bank accounts you hold in &apos;My Card Deck&apos; to instantly calculate your personal best return.
                  </p>
                </div>
                <Button 
                  variant="emerald" 
                  size="sm" 
                  onClick={() => setActiveTab('wallet')}
                >
                  Configure My Cards
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Box 2: Best on Australian Market */}
        <Card className={`relative overflow-hidden border-2 shadow-lg ${
          isHoldingBest 
            ? 'border-emerald-500/50 bg-white dark:bg-stone-900' 
            : 'border-amber-400/60 bg-gradient-to-b from-amber-50/30 via-white to-white dark:from-amber-950/20 dark:via-stone-900 dark:to-stone-900 shadow-amber-500/5'
        }`}>
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 to-yellow-500" />
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-700 dark:text-amber-400">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    Benchmark Target
                  </span>
                  <CardTitle className="text-xl">Best in Australian Market</CardTitle>
                </div>
              </div>
              {topMarket && (
                <Badge variant="warning" className="text-sm px-3 py-1 font-bold">
                  {formatPercent(topMarket.effectiveReturnPercent)} Return
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {topMarket ? (
              <>
                <div className="p-4 rounded-2xl bg-white border border-stone-200/80 dark:bg-stone-800/80 dark:border-stone-700 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-lg text-stone-900 dark:text-white">
                          {topMarket.card.name}
                        </span>
                        <Badge variant="outline" className="text-xs uppercase font-bold">
                          {topMarket.card.issuer}
                        </Badge>
                      </div>
                      <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mt-0.5">
                        {topMarket.perk.title}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-stone-900 dark:text-white">
                        +{formatAud(topMarket.netBenefitAud)}
                      </div>
                      <span className="text-xs text-stone-600">Total Reward AUD</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-700/60 flex items-center justify-between text-xs text-stone-600 dark:text-stone-300">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Zap className="h-3.5 w-3.5 text-amber-500" />
                      <span>{topMarket.actionLabel}</span>
                    </span>
                    <span className="text-xs text-stone-600">
                      Annual Fee: ${topMarket.card.annualFeeAud}/yr
                    </span>
                  </div>
                </div>

                {/* Status vs Owned */}
                {isHoldingBest ? (
                  <div className="rounded-xl bg-emerald-50 p-3.5 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2.5">
                    <CheckCircle2 className="h-5 w-5 text-emerald-700 flex-shrink-0" />
                    <div>
                      <strong>Optimal Efficiency:</strong> You already hold the highest-earning payment card in Australia for this purchase!
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl bg-amber-50 p-3.5 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-300 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="font-bold">Optimization Gap:</span>
                      <p>
                        You could save an additional <strong>+{formatAud(missedSavingsAud)}</strong> on this purchase by using {topMarket.card.name}.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="gold"
                      onClick={() => toggleHeldCard(topMarket.card.id)}
                      className="text-xs whitespace-nowrap ml-2"
                    >
                      Add to Deck
                    </Button>
                  </div>
                )}

                {/* Key feature bullets */}
                <div className="rounded-xl bg-stone-50 p-3 text-xs space-y-1 text-stone-600 dark:bg-stone-800/40 dark:text-stone-300">
                  <span className="font-semibold text-stone-800 dark:text-stone-200">Why this card wins:</span>
                  {topMarket.card.features.slice(0, 3).map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>

      {/* Comprehensive Ranked Ledger */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-stone-900 dark:text-white flex items-center gap-2">
              <Layers className="h-5 w-5 text-emerald-700" />
              <span>Ranked Card Ledger for {selectedMerchant.name}</span>
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              Ranked strictly by estimated AUD value on a ${spendAud} spend, before annual fees. Hand-entered offers as of {PERK_OFFERS_AS_OF}; confirm with the provider. 0% affiliate influence.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="inline-flex rounded-xl border border-stone-900/30 dark:border-stone-700 bg-stone-100 dark:bg-stone-950 p-0.5 divide-x divide-stone-900/30 dark:divide-stone-700 shadow-sm">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-l-lg transition-all ${
                filterType === 'all'
                  ? 'bg-emerald-700 text-white font-bold shadow-sm'
                  : 'text-stone-700 hover:text-stone-950 hover:bg-white dark:text-stone-300 dark:hover:text-white dark:hover:bg-stone-800'
              }`}
            >
              All Options ({bestMarket.length})
            </button>
            <button
              onClick={() => setFilterType('owned')}
              className={`px-3 py-1.5 text-xs font-semibold transition-all ${
                filterType === 'owned'
                  ? 'bg-emerald-700 text-white font-bold shadow-sm'
                  : 'text-stone-700 hover:text-stone-950 hover:bg-white dark:text-stone-300 dark:hover:text-white dark:hover:bg-stone-800'
              }`}
            >
              In My Deck ({bestMarket.filter(i => i.isOwned).length})
            </button>
            <button
              onClick={() => setFilterType('giftcard')}
              className={`px-3 py-1.5 text-xs font-semibold transition-all ${
                filterType === 'giftcard'
                  ? 'bg-emerald-700 text-white font-bold shadow-sm'
                  : 'text-stone-700 hover:text-stone-950 hover:bg-white dark:text-stone-300 dark:hover:text-white dark:hover:bg-stone-800'
              }`}
            >
              eGift Cards
            </button>
            <button
              onClick={() => setFilterType('cashback')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-r-lg transition-all ${
                filterType === 'cashback'
                  ? 'bg-emerald-700 text-white font-bold shadow-sm'
                  : 'text-stone-700 hover:text-stone-950 hover:bg-white dark:text-stone-300 dark:hover:text-white dark:hover:bg-stone-800'
              }`}
            >
              Direct Cashback
            </button>
          </div>
        </div>

        {/* Ledger Table / List */}
        <div className="space-y-2.5">
          {filteredLedger.map((item, index) => {
            const isTop = index === 0;
            return (
              <div
                key={item.offerId}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedOfferForDetail(item)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setSelectedOfferForDetail(item))}
                className={`cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all ${
                  item.isOwned
                    ? 'border-emerald-200/80 bg-emerald-50/20 dark:border-emerald-900/40 dark:bg-emerald-950/10'
                    : 'border-stone-200/80 bg-white dark:border-stone-800 dark:bg-stone-900'
                } hover:border-stone-300 hover:bg-stone-50 dark:hover:border-stone-700 shadow-sm`}
              >
                {/* Left: Rank & Card Identity */}
                <div className="flex items-center gap-3.5 mb-3 sm:mb-0">
                  <div className={`h-8 w-8 rounded-xl font-black text-sm flex items-center justify-center flex-shrink-0 ${
                    isTop 
                      ? 'bg-amber-400 text-amber-950 shadow-sm' 
                      : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300'
                  }`}>
                    #{index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-stone-900 dark:text-white">
                        {item.card.name}
                      </span>
                      {item.isOwned ? (
                        <Badge variant="success" className="text-xs py-0">
                          In Your Deck
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs py-0 text-stone-600">
                          Not Held
                        </Badge>
                      )}
                      <span className="text-xs text-stone-600 hidden md:inline">
                        • {item.card.issuer}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                      {item.perk.title}
                    </p>
                  </div>
                </div>

                {/* Right: Return Metrics & Math */}
                <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-0 border-stone-100 dark:border-stone-800">
                  <div className="text-left sm:text-right">
                    <div className="text-xs font-medium text-stone-600">
                      {formatPercent(item.effectiveReturnPercent)} Return
                    </div>
                    <div className="text-base font-extrabold text-emerald-700 dark:text-emerald-400">
                      +{formatAud(item.netBenefitAud)}
                    </div>
                  </div>

                  <ChevronRight className="h-5 w-5 text-stone-300" aria-hidden />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Offer Detail Drawer / Modal */}
      {selectedOfferForDetail && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Offer breakdown"
          onClick={() => setSelectedOfferForDetail(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in"
        >
          <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="brand" className="mb-2">
                  {selectedOfferForDetail.badgeText || 'Perk Breakdown'}
                </Badge>
                <h3 className="text-xl font-bold text-stone-900 dark:text-white">
                  {selectedOfferForDetail.card.name}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  {selectedOfferForDetail.perk.title}
                </p>
              </div>
              <button
                onClick={() => setSelectedOfferForDetail(null)}
                aria-label="Close"
                className="rounded-full p-2 text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">Net Benefit on ${spendAud}</span>
                <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
                  +{formatAud(selectedOfferForDetail.netBenefitAud)}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">Effective Return</span>
                <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
                  {formatPercent(selectedOfferForDetail.effectiveReturnPercent)}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                Financial Formula Steps:
              </span>
              <div className="space-y-1.5 p-3 rounded-xl bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                {selectedOfferForDetail.breakdownSteps.map((step, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-emerald-700 font-bold">✓</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {selectedOfferForDetail.perk.terms && (
              <div className="text-xs text-stone-600 dark:text-stone-400 border-t border-stone-100 dark:border-stone-800 pt-3">
                <strong>Conditions: </strong>
                {selectedOfferForDetail.perk.terms}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedOfferForDetail(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
