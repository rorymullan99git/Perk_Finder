'use client';

import React, { useMemo, useState } from 'react';
import { usePerkStore } from '@/store/usePerkStore';
import { MERCHANTS_DATA, MERCHANTS_MAP } from '@/data/merchants';
import { CARDS_MAP } from '@/data/cards';
import { PERK_OFFERS_DATA } from '@/data/perkOffers';
import { rankOffers } from '@/lib/ranker';
import { RankedOffer } from '@/types';
import { cn, formatAud, formatPercent } from '@/lib/utils';
import { MerchantCombobox } from '@/components/ui/combobox';
import { AmountInput } from '@/components/ui/amount-input';
import { ChevronDown } from 'lucide-react';

const INITIAL_ROWS = 5;

export const PerkOptimizerView: React.FC = () => {
  const {
    selectedMerchantId,
    setSelectedMerchantId,
    spendAud,
    setSpendAud,
    heldCardIds,
    favoriteMerchants,
    toggleHeldCard,
    setActiveTab,
  } = usePerkStore();

  const [showAll, setShowAll] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const merchant = MERCHANTS_MAP[selectedMerchantId] || MERCHANTS_DATA[0];

  const { bestOwned, bestMarket } = useMemo(
    () => rankOffers(PERK_OFFERS_DATA, CARDS_MAP, heldCardIds, merchant.id, spendAud),
    [heldCardIds, merchant.id, spendAud]
  );

  const topOwned: RankedOffer | undefined = bestOwned[0];
  const topMarket: RankedOffer | undefined = bestMarket[0];
  const hasCards = heldCardIds.length > 0;
  const pick = topOwned ?? topMarket;
  const gapAud = topOwned && topMarket ? Math.max(0, topMarket.netBenefitAud - topOwned.netBenefitAud) : 0;
  const rows = showAll ? bestMarket : bestMarket.slice(0, INITIAL_ROWS);

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Which card should I use?</h1>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_10rem]">
        <MerchantCombobox
          id="merchant"
          label="Store"
          merchants={MERCHANTS_DATA}
          selectedId={merchant.id}
          onSelect={(id) => {
            setSelectedMerchantId(id);
            setExpandedId(null);
          }}
        />
        <AmountInput id="spend" label="Amount" value={spendAud} min={1} step={5} onChange={setSpendAud} />
      </div>

      {favoriteMerchants.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm" aria-label="Quick picks">
          {favoriteMerchants.map((id) => {
            const m = MERCHANTS_MAP[id];
            if (!m) return null;
            return (
              <button
                key={id}
                onClick={() => setSelectedMerchantId(id)}
                aria-pressed={id === merchant.id}
                className={cn(
                  'underline-offset-4 hover:underline',
                  id === merchant.id ? 'font-medium text-stone-900 underline' : 'text-stone-500'
                )}
              >
                {m.name}
              </button>
            );
          })}
        </div>
      )}

      {/* The answer */}
      {pick && (
        <section aria-live="polite" className="mt-8 rounded-xl border border-stone-200 p-6">
          <p className="text-sm text-stone-500">
            {topOwned ? `From your cards, use` : `Best option at ${merchant.name}`}
          </p>
          <h2 className="mt-1 text-xl font-semibold">{pick.card.name}</h2>
          <p className="mt-4 text-3xl font-semibold tracking-tight text-emerald-700">
            {formatAud(pick.netBenefitAud)}
            <span className="ml-2 text-base font-normal text-stone-500">
              back on {formatAud(spendAud)} ({formatPercent(pick.effectiveReturnPercent)})
            </span>
          </p>
          <p className="mt-3 text-sm text-stone-600">
            {pick.perk.instructions ?? `${pick.actionLabel}.`}
          </p>

          {topOwned && topMarket && gapAud > 0 && (
            <div className="mt-5 flex flex-col gap-2 border-t border-stone-100 pt-4 text-sm text-stone-600 sm:flex-row sm:items-center sm:justify-between">
              <span>
                {topMarket.card.name} would get you {formatAud(gapAud)} more.
              </span>
              <button
                onClick={() => toggleHeldCard(topMarket.card.id)}
                className="self-start text-stone-900 underline underline-offset-4 sm:self-auto"
              >
                I have this card
              </button>
            </div>
          )}

          {!hasCards && (
            <div className="mt-5 border-t border-stone-100 pt-4 text-sm text-stone-600">
              Tell us which cards you have for a personal pick.{' '}
              <button onClick={() => setActiveTab('cards')} className="text-stone-900 underline underline-offset-4">
                Choose my cards
              </button>
            </div>
          )}
        </section>
      )}

      {/* Everything else, ranked */}
      <section className="mt-10">
        <div className="flex items-baseline justify-between">
          <h2 className="font-semibold">All options at {merchant.name}</h2>
          <button onClick={() => setActiveTab('method')} className="text-sm text-stone-500 underline underline-offset-4 hover:text-stone-900">
            How we rank
          </button>
        </div>

        <ol className="mt-3 divide-y divide-stone-100 border-y border-stone-100">
          {rows.map((item, index) => {
            const isOpen = expandedId === item.offerId;
            return (
              <li key={item.offerId}>
                <button
                  onClick={() => setExpandedId(isOpen ? null : item.offerId)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-4 py-3 text-left hover:bg-stone-50"
                >
                  <span className="w-5 shrink-0 text-right text-sm tabular-nums text-stone-400">{index + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block">
                      {item.card.name}
                      {item.isOwned && <span className="ml-2 text-xs text-emerald-700">Yours</span>}
                    </span>
                    <span className="block text-sm text-stone-500">{item.perk.title}</span>
                  </span>
                  <span className="shrink-0 text-right tabular-nums">{formatAud(item.netBenefitAud)}</span>
                  <ChevronDown className={cn('h-4 w-4 shrink-0 text-stone-400 transition-transform', isOpen && 'rotate-180')} />
                </button>

                {isOpen && (
                  <div className="space-y-2 pb-4 pl-9 pr-8 text-sm text-stone-600">
                    <ul className="space-y-1">
                      {item.breakdownSteps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                    {item.perk.terms && <p className="text-stone-500">Conditions: {item.perk.terms}</p>}
                    {item.card.annualFeeAud > 0 && (
                      <p className="text-stone-500">Annual fee: {formatAud(item.card.annualFeeAud)}</p>
                    )}
                    <button
                      onClick={() => toggleHeldCard(item.card.id)}
                      className="text-stone-900 underline underline-offset-4"
                    >
                      {item.isOwned ? 'Remove from my cards' : 'I have this card'}
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ol>

        {bestMarket.length > INITIAL_ROWS && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="mt-3 text-sm text-stone-500 underline underline-offset-4 hover:text-stone-900"
          >
            {showAll ? 'Show fewer' : `Show all ${bestMarket.length}`}
          </button>
        )}
      </section>
    </div>
  );
};
