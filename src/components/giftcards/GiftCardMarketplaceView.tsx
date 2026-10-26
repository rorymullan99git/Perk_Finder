'use client';

import React, { useState, useMemo } from 'react';
import { PERK_OFFERS_DATA, PERK_OFFERS_AS_OF } from '@/data/perkOffers';
import { MERCHANTS_MAP } from '@/data/merchants';
import { CARDS_MAP } from '@/data/cards';
import { formatAud } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/ui/page-header';
import { 
  Gift, 
  Search, 
  Smartphone, 
  Sparkles, 
  Tag, 
  ChevronRight, 
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { usePerkStore } from '@/store/usePerkStore';

export const GiftCardMarketplaceView: React.FC = () => {
  const { setSelectedMerchantId, setActiveTab } = usePerkStore();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [providerFilter, setProviderFilter] = useState<string>('all');
  const [exampleSpend, setExampleSpend] = useState<number>(200);

  const providers = [
    { id: 'all', label: 'All Providers' },
    { id: 'macquarie', label: 'Macquarie Marketplace' },
    { id: 'nrma', label: 'NRMA / RACV Auto Clubs' },
    { id: 'suncorp', label: 'Suncorp Bank' },
    { id: 'shopback', label: 'ShopBack / Cashrewards' },
    { id: 'bupa', label: 'Bupa Life Rewards' },
  ];

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'essentials', label: '🛒 Essentials' },
    { id: 'tech', label: '💻 Tech' },
    { id: 'travel_fuel', label: '⛽ Fuel' },
    { id: 'liquor_dining', label: '🍽️ Dining' },
  ];

  // Filter gift card offers
  const giftCardOffers = useMemo(() => {
    return PERK_OFFERS_DATA.filter((o) => {
      if (!o.isGiftCardPurchase || !o.discountPercent) return false;

      const merchant = o.merchantId ? MERCHANTS_MAP[o.merchantId] : null;
      const card = CARDS_MAP[o.cardId];
      const q = search.toLowerCase();

      // Search match
      const matchSearch = 
        !search ||
        o.title.toLowerCase().includes(q) ||
        (merchant && merchant.name.toLowerCase().includes(q)) ||
        (card && card.name.toLowerCase().includes(q)) ||
        o.description.toLowerCase().includes(q);

      // Provider filter match
      let matchProvider = true;
      if (providerFilter !== 'all') {
        if (providerFilter === 'macquarie') matchProvider = o.cardId.startsWith('macquarie');
        else if (providerFilter === 'nrma') matchProvider = o.cardId.startsWith('nrma');
        else if (providerFilter === 'suncorp') matchProvider = o.cardId.startsWith('suncorp');
        else if (providerFilter === 'shopback') matchProvider = o.cardId.startsWith('shopback');
        else if (providerFilter === 'bupa') matchProvider = o.cardId.startsWith('bupa');
      }

      // Category filter match
      let matchCategory = true;
      if (categoryFilter !== 'all') {
        if (categoryFilter === 'essentials') {
          matchCategory = merchant?.pillarCategory === 'essentials' || o.merchantCategory === 'groceries';
        } else if (categoryFilter === 'tech') {
          matchCategory = merchant?.pillarCategory === 'tech' || o.merchantCategory === 'retail_tech';
        } else if (categoryFilter === 'travel_fuel') {
          matchCategory = merchant?.pillarCategory === 'fuel' || o.merchantCategory === 'travel_fuel';
        } else {
          matchCategory = o.merchantCategory === categoryFilter || (merchant ? merchant.category === categoryFilter : false);
        }
      }

      return matchSearch && matchProvider && matchCategory;
    }).sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
  }, [search, categoryFilter, providerFilter]);

  // Helper for provider styling
  const getProviderBadge = (cardId: string) => {
    if (cardId.startsWith('macquarie')) {
      return { name: 'Macquarie Marketplace', bg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20' };
    }
    if (cardId.startsWith('nrma')) {
      return { name: 'NRMA / RACV Auto Club', bg: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20' };
    }
    if (cardId.startsWith('suncorp')) {
      return { name: 'Suncorp Bank Benefits', bg: 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20' };
    }
    if (cardId.startsWith('shopback')) {
      return { name: 'ShopBack Instant Cashback', bg: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20' };
    }
    if (cardId.startsWith('bupa')) {
      return { name: 'Bupa Life Rewards', bg: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20' };
    }
    return { name: 'Verified Partner', bg: 'bg-stone-500/10 text-stone-700 dark:text-stone-300 border-stone-500/20' };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="The instant 2% to 4.5% discount."
        description="Buy a digital eGift card seconds before you pay across Macquarie Marketplace, NRMA/RACV, Suncorp, ShopBack, or Bupa and the same groceries, tech and petrol cost less."
      />
      <p className="text-xs text-stone-600 dark:text-stone-400 -mt-4">
        Hand-entered discount rates as of {PERK_OFFERS_AS_OF}, not live. Rates change often, so check the provider&apos;s app before you buy.
      </p>

      {/* Control & Search Bar */}
      <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-900 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-600" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Woolworths, Coles, Apple, JB Hi-Fi, Ampol..."
              aria-label="Search eGift offers"
              className="h-10 w-full pl-9 pr-4 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <span className="text-xs text-stone-600 whitespace-nowrap">Example Spend:</span>
            <div className="inline-flex rounded-xl border border-stone-900/30 dark:border-stone-700 bg-stone-100 dark:bg-stone-950 p-0.5 divide-x divide-stone-900/30 dark:divide-stone-700 shadow-sm">
              {[100, 200, 500, 1000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setExampleSpend(amt)}
                  aria-pressed={exampleSpend === amt}
                  className={`text-xs px-2.5 py-1 font-bold transition-all first:rounded-l-lg last:rounded-r-lg ${
                    exampleSpend === amt
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-sm'
                      : 'text-stone-700 hover:text-stone-950 hover:bg-white dark:text-stone-300 dark:hover:text-white dark:hover:bg-stone-800'
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filters: Providers & Categories */}
        <div className="flex flex-col md:flex-row gap-3 pt-2 border-t border-stone-200 dark:border-stone-800 justify-between items-start md:items-center">
          {/* Provider Pills */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-600 mr-1 flex items-center gap-1">
              <Building2 className="h-3 w-3" /> Provider:
            </span>
            {providers.map((p) => {
              const isSelected = providerFilter === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setProviderFilter(p.id)}
                  aria-pressed={isSelected}
                  className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all border ${
                    isSelected
                      ? 'bg-emerald-700 text-white font-bold border-stone-900 shadow-sm'
                      : 'bg-white text-stone-700 hover:text-stone-950 border-stone-900/30 hover:border-stone-900 dark:bg-stone-900 dark:text-stone-300 dark:border-stone-700'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-1.5 items-center">
            {categories.map((c) => {
              const isSelected = categoryFilter === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setCategoryFilter(c.id)}
                  aria-pressed={isSelected}
                  className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all border ${
                    isSelected
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold border-stone-950'
                      : 'bg-white text-stone-700 hover:text-stone-950 border-stone-900/30 hover:border-stone-900 dark:bg-stone-900 dark:text-stone-300 dark:border-stone-700'
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {giftCardOffers.length === 0 && (
        <div className="rounded-2xl border border-dashed border-stone-300 py-12 text-center text-sm text-stone-600">
          No eGift offers match &ldquo;{search}&rdquo;. Try another retailer or reset the provider filter.
        </div>
      )}

      {/* Gift Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {giftCardOffers.map((offer) => {
          const merchant = offer.merchantId ? MERCHANTS_MAP[offer.merchantId] : null;
          const card = CARDS_MAP[offer.cardId];
          const discountPct = offer.discountPercent || 0;
          const savingsOnExample = (exampleSpend * discountPct) / 100;
          const providerInfo = getProviderBadge(offer.cardId);

          return (
            <div
              key={offer.id}
              className="flex flex-col justify-between rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm hover:border-emerald-400 dark:border-stone-800 dark:bg-stone-900 dark:hover:border-emerald-600 transition-all hover:shadow-md"
            >
              <div>
                {/* Header: Retailer, Title, Discount */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    {merchant && (
                      <span
                        className="h-3.5 w-3.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: merchant.color }}
                      />
                    )}
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
                        {merchant?.name || 'All Retailers'}
                      </span>
                      <h3 className="font-bold text-base text-stone-900 dark:text-white leading-tight">
                        {offer.title}
                      </h3>
                    </div>
                  </div>
                  <Badge variant="brand" className="text-sm px-2.5 py-1 font-black shrink-0">
                    {discountPct}% OFF
                  </Badge>
                </div>

                {/* Provider Badge */}
                <div className="mb-3">
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md border ${providerInfo.bg}`}>
                    <ShieldCheck className="h-3 w-3" />
                    {providerInfo.name}
                  </span>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
                  {offer.description}
                </p>

                {/* Savings on sample spend */}
                <div className="rounded-xl bg-stone-50 dark:bg-stone-800/80 p-3 mb-3 border border-stone-100 dark:border-stone-700/60 flex items-center justify-between">
                  <span className="text-xs text-stone-600">Savings on ${exampleSpend} spend:</span>
                  <span className="text-base font-black text-emerald-700 dark:text-emerald-400">
                    Save {formatAud(savingsOnExample)}
                  </span>
                </div>

                {offer.instructions && (
                  <div className="space-y-1 text-xs text-stone-600 dark:text-stone-300">
                    <span className="font-bold text-xs uppercase tracking-wider text-stone-600 flex items-center gap-1">
                      <Smartphone className="h-3.5 w-3.5" />
                      How to get it:
                    </span>
                    <p className="text-xs bg-stone-100/60 dark:bg-stone-800/40 p-2 rounded-lg leading-relaxed">
                      {offer.instructions}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                <span className="text-stone-600 font-medium truncate max-w-[170px]" title={card?.name}>
                  {card?.name}
                </span>
                {merchant && (
                  <button
                    onClick={() => {
                      setSelectedMerchantId(merchant.id);
                      setActiveTab('ranker');
                    }}
                    className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1 shrink-0"
                  >
                    Optimize Merchant →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
