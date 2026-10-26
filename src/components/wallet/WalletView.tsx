'use client';

import React, { useMemo, useState } from 'react';
import { usePerkStore } from '@/store/usePerkStore';
import { CARDS_DATA } from '@/data/cards';
import { PageHeader } from '@/components/ui/page-header';
import { formatAudWhole } from '@/lib/utils';

export const WalletView: React.FC = () => {
  const { heldCardIds, toggleHeldCard, clearAllHeldCards, setActiveTab } = usePerkStore();
  const [search, setSearch] = useState('');

  const filteredCards = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return CARDS_DATA;
    return CARDS_DATA.filter(
      (card) =>
        card.name.toLowerCase().includes(q) ||
        card.issuer.toLowerCase().includes(q) ||
        card.rewardProgram.toLowerCase().includes(q)
    );
  }, [search]);

  const totalAnnualFees = CARDS_DATA.filter((c) => heldCardIds.includes(c.id)).reduce(
    (sum, c) => sum + c.annualFeeAud,
    0
  );

  return (
    <div>
      <PageHeader
        title="My cards"
        description="Tick the cards, accounts and memberships you have. This is saved in your browser only and never sent anywhere."
      />

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-stone-500">
        <span>
          {heldCardIds.length} selected
          {totalAnnualFees > 0 && ` · ${formatAudWhole(totalAnnualFees)} a year in fees`}
        </span>
        <span className="flex gap-4">
          {heldCardIds.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm(`Remove all ${heldCardIds.length} cards?`)) clearAllHeldCards();
              }}
              className="underline underline-offset-4 hover:text-stone-900"
            >
              Clear
            </button>
          )}
          <button onClick={() => setActiveTab('best')} className="text-stone-900 underline underline-offset-4">
            Find my best card
          </button>
        </span>
      </div>

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by card, bank or rewards program"
        aria-label="Search cards"
        className="mt-4 h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-base placeholder:text-stone-400 focus:border-stone-900 focus:outline-none"
      />

      {filteredCards.length === 0 ? (
        <p className="py-10 text-center text-sm text-stone-500">No cards match &ldquo;{search}&rdquo;.</p>
      ) : (
        <ul className="mt-4 divide-y divide-stone-100 border-y border-stone-100">
          {filteredCards.map((card) => {
            const isHeld = heldCardIds.includes(card.id);
            const details = [
              card.issuer,
              card.type === 'credit' ? 'Credit' : 'Debit',
              card.annualFeeAud > 0 ? `${formatAudWhole(card.annualFeeAud)}/yr` : 'No annual fee',
              card.fxFeePercent === 0 ? 'No overseas fee' : null,
            ].filter(Boolean);

            return (
              <li key={card.id}>
                <label className="flex cursor-pointer items-center gap-3 py-3 hover:bg-stone-50">
                  <input
                    type="checkbox"
                    checked={isHeld}
                    onChange={() => toggleHeldCard(card.id)}
                    className="h-4 w-4 shrink-0 accent-emerald-700"
                  />
                  <span className="min-w-0">
                    <span className="block">{card.name}</span>
                    <span className="block text-sm text-stone-500">{details.join(' · ')}</span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
