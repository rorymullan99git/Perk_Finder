'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { usePerkStore } from '@/store/usePerkStore';
import { CARDS_DATA } from '@/data/cards';
import { BankCard } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { 
  CreditCard, 
  Check, 
  Search, 
  ShieldCheck, 
  Filter, 
  Plus, 
  Trash2, 
  Sparkles,
  Info,
  DollarSign
} from 'lucide-react';

export const WalletView: React.FC = () => {
  const { heldCardIds, toggleHeldCard, setHeldCardIds, clearAllHeldCards, setActiveTab } = usePerkStore();

  const [search, setSearch] = useState('');
  const [selectedIssuer, setSelectedIssuer] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewOnlyHeld, setViewOnlyHeld] = useState<boolean>(false);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    if (!confirmClear) return;
    const t = setTimeout(() => setConfirmClear(false), 4000);
    return () => clearTimeout(t);
  }, [confirmClear]);

  // Extract unique issuers
  const issuers = useMemo(() => {
    const list = Array.from(new Set(CARDS_DATA.map(c => c.issuer)));
    return ['all', ...list];
  }, []);

  // Filtered card list
  const filteredCards = useMemo(() => {
    return CARDS_DATA.filter((card) => {
      const q = search.toLowerCase();
      const matchSearch = 
        card.name.toLowerCase().includes(q) ||
        card.issuer.toLowerCase().includes(q) ||
        card.rewardProgram.toLowerCase().includes(q) ||
        card.features.some(f => f.toLowerCase().includes(q));

      const matchIssuer = selectedIssuer === 'all' || card.issuer === selectedIssuer;
      const matchType = selectedType === 'all' || card.type === selectedType;
      const matchHeld = !viewOnlyHeld || heldCardIds.includes(card.id);

      return matchSearch && matchIssuer && matchType && matchHeld;
    });
  }, [search, selectedIssuer, selectedType, viewOnlyHeld, heldCardIds]);

  // Fast starter pack selector
  const selectStarterPack = () => {
    const starterPackIds = [
      'macquarie_transaction_debit', // marketplace + 0% fx
      'cba_smart_debit',            // yello cashback
      'ing_orange_everyday',         // 5.5% savings linked
      'hsbc_everyday_global',        // 2% tap cashback
      'coles_rewards_mastercard',    // 2 flybuys/$1 + 0% fx
    ];
    setHeldCardIds(starterPackIds);
  };

  // Portfolio calculation
  const heldCards = CARDS_DATA.filter(c => heldCardIds.includes(c.id));
  const totalAnnualFees = heldCards.reduce((sum, c) => sum + c.annualFeeAud, 0);
  const hasZeroFx = heldCards.some(c => c.fxFeePercent === 0);
  const hasMacquarieMarketplace = heldCardIds.includes('macquarie_transaction_debit') || heldCardIds.includes('macquarie_platinum_card');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Which cards do you actually hold?"
        description="Tick them once. The optimizer then names your best card at every checkout. Selections stay in this browser only."
      >
        <dl className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <dt className="text-stone-400">In your deck</dt>
            <dd className="text-xl font-extrabold">{heldCardIds.length} <span className="text-sm font-medium text-stone-400">of {CARDS_DATA.length}</span></dd>
          </div>
          <div>
            <dt className="text-stone-400">Annual fees</dt>
            <dd className="text-xl font-extrabold text-emerald-400">${totalAnnualFees}/yr</dd>
          </div>
          <div>
            <dt className="text-stone-400">0% FX card</dt>
            <dd className="text-xl font-extrabold">{hasZeroFx ? 'Yes' : 'None'}</dd>
          </div>
          <div>
            <dt className="text-stone-400">eGift marketplace</dt>
            <dd className="text-xl font-extrabold">{hasMacquarieMarketplace ? 'Active' : 'Inactive'}</dd>
          </div>
        </dl>

        <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-white/10">
          <Button size="sm" variant="emerald" onClick={selectStarterPack}>
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Popular starter pack
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setHeldCardIds(CARDS_DATA.map(c => c.id))}
            className="text-stone-200 hover:bg-white/10 hover:text-white"
          >
            Select all ({CARDS_DATA.length})
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              if (confirmClear) {
                clearAllHeldCards();
                setConfirmClear(false);
              } else {
                setConfirmClear(true);
              }
            }}
            className="text-rose-300 hover:text-rose-200 hover:bg-rose-950/40"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            {confirmClear ? `Click again to remove ${heldCardIds.length} cards` : 'Clear deck'}
          </Button>
          <Button size="sm" variant="emerald" onClick={() => setActiveTab('ranker')} className="ml-auto">
            Run optimizer →
          </Button>
        </div>
      </PageHeader>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-900 flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-600" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search card name, bank, points..."
            aria-label="Search cards"
            className="h-10 w-full pl-9 pr-4 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
          />
        </div>

        {/* Filter selects & view toggle */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Issuer filter */}
          <select
            aria-label="Filter by issuer"
            value={selectedIssuer}
            onChange={(e) => setSelectedIssuer(e.target.value)}
            className="h-10 rounded-xl border border-stone-900/30 bg-white px-3 text-xs font-medium text-stone-800 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-200 focus:outline-none shadow-sm"
          >
            <option value="all">All Issuers ({issuers.length - 1})</option>
            {issuers.filter(i => i !== 'all').map((iss) => (
              <option key={iss} value={iss}>
                {iss}
              </option>
            ))}
          </select>

          {/* Type filter */}
          <select
            aria-label="Filter by card type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="h-10 rounded-xl border border-stone-900/30 bg-white px-3 text-xs font-medium text-stone-800 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-200 focus:outline-none shadow-sm"
          >
            <option value="all">All Types (Credit & Debit)</option>
            <option value="credit">Credit Cards Only</option>
            <option value="debit">Debit Cards Only</option>
          </select>

          {/* Only held toggle */}
          <button
            onClick={() => setViewOnlyHeld(!viewOnlyHeld)}
            aria-pressed={viewOnlyHeld}
            className={`h-10 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              viewOnlyHeld
                ? 'bg-emerald-700 text-white border-stone-900 shadow-sm font-bold'
                : 'bg-white text-stone-700 hover:text-stone-950 border-stone-900/30 hover:border-stone-900 dark:bg-stone-900 dark:text-stone-300 dark:border-stone-700'
            }`}
          >
            <Check className="h-3.5 w-3.5" />
            <span>Held Only ({heldCardIds.length})</span>
          </button>
        </div>
      </div>

      {filteredCards.length === 0 && (
        <div className="rounded-2xl border border-dashed border-stone-300 py-12 text-center text-sm text-stone-600">
          No cards match those filters. Try clearing the search or switching off &ldquo;Held only&rdquo;.
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCards.map((card) => {
          const isHeld = heldCardIds.includes(card.id);

          return (
            <div
              key={card.id}
              role="checkbox"
              aria-checked={isHeld}
              tabIndex={0}
              onClick={() => toggleHeldCard(card.id)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggleHeldCard(card.id))}
              className={`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 group relative cursor-pointer rounded-2xl border-2 p-5 transition-all duration-200 shadow-sm ${
                isHeld
                  ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 dark:border-emerald-500 shadow-emerald-500/10'
                  : 'border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900 hover:border-stone-300 dark:hover:border-stone-700'
              }`}
            >
              {/* Checkbox indicator */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-6 w-6 rounded-lg flex items-center justify-center transition-all ${
                      isHeld
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'border border-stone-300 bg-white group-hover:border-stone-400 dark:border-stone-700 dark:bg-stone-800'
                    }`}
                  >
                    {isHeld && <Check className="h-4 w-4 stroke-[3]" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
                      {card.issuer}
                    </span>
                    <h3 className="font-bold text-base text-stone-900 dark:text-white leading-tight">
                      {card.name}
                    </h3>
                  </div>
                </div>

                <Badge
                  variant={card.type === 'credit' ? 'secondary' : 'outline'}
                  className="text-xs uppercase font-bold"
                >
                  {card.type}
                </Badge>
              </div>

              {/* Card visual badge bar */}
              <div className="rounded-xl bg-stone-100 dark:bg-stone-800/80 p-3 mb-3 text-xs space-y-1.5">
                <div className="flex justify-between items-center text-stone-600 dark:text-stone-300">
                  <span>Annual Fee:</span>
                  <span className="font-bold text-stone-900 dark:text-white">
                    {card.annualFeeAud === 0 ? '$0 (No annual fee)' : `$${card.annualFeeAud}/yr`}
                  </span>
                </div>
                <div className="flex justify-between items-center text-stone-600 dark:text-stone-300">
                  <span>Foreign FX Fee:</span>
                  <span className={`font-bold ${card.fxFeePercent === 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-900 dark:text-white'}`}>
                    {card.fxFeePercent === 0 ? '0% (Fee Free)' : `${card.fxFeePercent}%`}
                  </span>
                </div>
                {card.rewardProgram !== 'None' && (
                  <div className="flex justify-between items-center text-stone-600 dark:text-stone-300">
                    <span>Reward Program:</span>
                    <span className="font-semibold text-stone-900 dark:text-white truncate max-w-[150px]">
                      {card.rewardProgram}
                    </span>
                  </div>
                )}
              </div>

              {/* Key Features Bullet List */}
              <div className="space-y-1 text-xs text-stone-600 dark:text-stone-400">
                {card.features.slice(0, 3).map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-700 font-bold">•</span>
                    <span className="line-clamp-1">{feat}</span>
                  </div>
                ))}
              </div>

              {/* Status bar */}
              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs font-semibold">
                <span className={isHeld ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-600'}>
                  {isHeld ? '✓ Card in Your Deck' : '+ Click to Add'}
                </span>
                <span className="text-xs text-stone-600 uppercase font-mono">
                  {card.network}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
