'use client';

import React, { useEffect, useState } from 'react';
import { usePerkStore, isAppTab } from '@/store/usePerkStore';
import { PerkOptimizerView } from '@/components/optimizer/PerkOptimizerView';
import { WalletView } from '@/components/wallet/WalletView';
import { SavingsBenchmarkView } from '@/components/savings/SavingsBenchmarkView';
import { GiftCardMarketplaceView } from '@/components/giftcards/GiftCardMarketplaceView';
import { MethodView } from '@/components/method/MethodView';

export default function Home() {
  const activeTab = usePerkStore((s) => s.activeTab);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    usePerkStore.persist.rehydrate();

    // The URL hash is the source of truth for the tab, so links and the back button work.
    const syncFromHash = () => {
      const hash = window.location.hash.slice(1);
      usePerkStore.setState({ activeTab: isAppTab(hash) ? hash : 'best' });
    };
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    setMounted(true);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  useEffect(() => {
    if (mounted) window.scrollTo({ top: 0 });
  }, [activeTab, mounted]);

  if (!mounted) {
    return <div className="min-h-[50vh]" aria-busy="true" />;
  }

  return (
    <>
      {activeTab === 'best' && <PerkOptimizerView />}
      {activeTab === 'cards' && <WalletView />}
      {activeTab === 'savings' && <SavingsBenchmarkView />}
      {activeTab === 'giftcards' && <GiftCardMarketplaceView />}
      {activeTab === 'method' && <MethodView />}
    </>
  );
}
