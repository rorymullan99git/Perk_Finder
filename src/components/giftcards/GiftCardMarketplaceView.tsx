'use client';

import React, { useMemo, useState } from 'react';
import { PERK_OFFERS_DATA } from '@/data/perkOffers';
import { MERCHANTS_MAP } from '@/data/merchants';
import { CARDS_MAP } from '@/data/cards';
import { usePerkStore } from '@/store/usePerkStore';
import { PageHeader } from '@/components/ui/page-header';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

const PROVIDERS: [prefix: string, name: string][] = [
  ['macquarie', 'Macquarie Marketplace'],
  ['nrma', 'NRMA Blue'],
  ['suncorp', 'Suncorp'],
  ['shopback', 'ShopBack'],
  ['bupa', 'Bupa Life Rewards'],
];

function providerName(cardId: string): string {
  return PROVIDERS.find(([prefix]) => cardId.startsWith(prefix))?.[1] ?? CARDS_MAP[cardId]?.name ?? 'Provider';
}

const GIFT_CARD_OFFERS = PERK_OFFERS_DATA.filter((o) => o.isGiftCardPurchase && o.discountPercent).sort(
  (a, b) => (b.discountPercent || 0) - (a.discountPercent || 0)
);

export const GiftCardMarketplaceView: React.FC = () => {
  const { setSelectedMerchantId, setActiveTab } = usePerkStore();
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const offers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return GIFT_CARD_OFFERS;
    return GIFT_CARD_OFFERS.filter((o) => {
      const merchant = o.merchantId ? MERCHANTS_MAP[o.merchantId] : null;
      return (
        o.title.toLowerCase().includes(q) ||
        providerName(o.cardId).toLowerCase().includes(q) ||
        (merchant?.name.toLowerCase().includes(q) ?? false) ||
        (merchant?.aliases.some((a) => a.toLowerCase().includes(q)) ?? false)
      );
    });
  }, [search]);

  return (
    <div>
      <PageHeader
        title="Gift card discounts"
        description="Buy a discounted digital gift card in the provider's app just before you pay. It usually takes under a minute."
      />

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search a store or provider"
        aria-label="Search gift card offers"
        className="h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-base placeholder:text-stone-400 focus:border-stone-900 focus:outline-none"
      />

      {offers.length === 0 ? (
        <p className="py-10 text-center text-sm text-stone-500">No gift card offers match &ldquo;{search}&rdquo;.</p>
      ) : (
        <ul className="mt-4 divide-y divide-stone-100 border-y border-stone-100">
          {offers.map((offer) => {
            const merchant = offer.merchantId ? MERCHANTS_MAP[offer.merchantId] : null;
            const isOpen = expandedId === offer.id;
            return (
              <li key={offer.id}>
                <button
                  onClick={() => setExpandedId(isOpen ? null : offer.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-4 py-3 text-left hover:bg-stone-50"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block">{merchant?.name ?? offer.title}</span>
                    <span className="block text-sm text-stone-500">via {providerName(offer.cardId)}</span>
                  </span>
                  <span className="shrink-0 tabular-nums text-emerald-700">{offer.discountPercent}% off</span>
                  <ChevronDown className={cn('h-4 w-4 shrink-0 text-stone-400 transition-transform', isOpen && 'rotate-180')} />
                </button>

                {isOpen && (
                  <div className="space-y-2 pb-4 pr-8 text-sm text-stone-600">
                    <p>{offer.instructions ?? offer.description}</p>
                    {offer.terms && <p className="text-stone-500">Conditions: {offer.terms}</p>}
                    {merchant && (
                      <button
                        onClick={() => {
                          setSelectedMerchantId(merchant.id);
                          setActiveTab('best');
                        }}
                        className="text-stone-900 underline underline-offset-4"
                      >
                        Compare all options at {merchant.name}
                      </button>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
