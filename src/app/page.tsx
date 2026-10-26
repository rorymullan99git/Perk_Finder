'use client';

import React, { useEffect, useState } from 'react';
import { usePerkStore } from '@/store/usePerkStore';
import { PerkOptimizerView } from '@/components/optimizer/PerkOptimizerView';
import { WalletView } from '@/components/wallet/WalletView';
import { SavingsBenchmarkView } from '@/components/savings/SavingsBenchmarkView';
import { GiftCardMarketplaceView } from '@/components/giftcards/GiftCardMarketplaceView';
import { MathManifestoView } from '@/components/manifesto/MathManifestoView';

export default function Home() {
  const { activeTab } = usePerkStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    usePerkStore.persist.rehydrate();
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-amber-500 animate-spin flex items-center justify-center text-white font-bold">
            P
          </div>
          <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 tracking-wider uppercase">
            Loading PerkPilot Engine...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {activeTab === 'ranker' && <PerkOptimizerView />}
      {activeTab === 'wallet' && <WalletView />}
      {activeTab === 'savings' && <SavingsBenchmarkView />}
      {activeTab === 'giftcards' && <GiftCardMarketplaceView />}
      {activeTab === 'manifesto' && <MathManifestoView />}
    </div>
  );
}
