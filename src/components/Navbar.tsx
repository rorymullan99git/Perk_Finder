'use client';

import React, { useState } from 'react';
import { usePerkStore, AppTab } from '@/store/usePerkStore';
import { Sparkles, PiggyBank, Gift, Scale, Wallet, Database } from 'lucide-react';
import { SupabaseSyncModal } from '@/components/supabase/SupabaseSyncModal';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, heldCardIds } = usePerkStore();
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);

  const navItems: { id: AppTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'ranker', label: 'Optimizer', icon: Sparkles },
    { id: 'wallet', label: 'My Deck', icon: Wallet, badge: `${heldCardIds.length}` },
    { id: 'savings', label: 'Savings', icon: PiggyBank },
    { id: 'giftcards', label: 'eGift Cards', icon: Gift },
    { id: 'manifesto', label: 'Math Auditor', icon: Scale },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-white/90 backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-4">
          {/* Wordmark */}
          <button
            onClick={() => setActiveTab('ranker')}
            className="flex items-center gap-2.5 shrink-0"
            aria-label="PerkPilot AU home"
          >
            <span className="h-8 w-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-bold text-base">
              P
            </span>
            <span className="font-extrabold text-lg tracking-tight text-stone-900 dark:text-white">
              PerkPilot <span className="text-emerald-700 dark:text-emerald-400">AU</span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav 
            className="hidden md:flex items-center rounded-xl border border-stone-300 dark:border-stone-600 bg-stone-100/70 dark:bg-stone-950/70 p-0.5 divide-x divide-stone-200 dark:divide-stone-600 shadow-sm" 
            aria-label="Primary"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-2 px-3.5 py-1.5 text-sm whitespace-nowrap transition-all font-semibold first:rounded-l-lg last:rounded-r-lg ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-stone-700 hover:text-stone-950 hover:bg-white dark:text-stone-300 dark:hover:text-white dark:hover:bg-stone-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[11px] leading-none px-1.5 py-0.5 rounded-full font-bold border ${
                        isActive
                          ? 'bg-emerald-900 text-white border-emerald-900'
                          : 'bg-stone-200 text-stone-800 border-stone-300 dark:bg-stone-800 dark:text-stone-200 dark:border-stone-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Utility */}
          <button
            onClick={() => setShowSupabaseModal(true)}
            className="p-2 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800 transition-colors"
            title="Cloud sync status"
            aria-label="Cloud sync status"
          >
            <Database className="h-4 w-4" />
          </button>
        </div>
      </div>

      <SupabaseSyncModal open={showSupabaseModal} onOpenChange={setShowSupabaseModal} />

      {/* Mobile nav */}
      <nav
        className="md:hidden flex overflow-x-auto border-t border-b border-stone-200 dark:border-stone-800 py-1.5 px-3 gap-1.5 scrollbar-none bg-stone-50 dark:bg-stone-950"
        aria-label="Primary"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap border transition-all ${
                isActive
                  ? 'bg-emerald-700 text-white font-bold border-emerald-800 shadow-sm'
                  : 'bg-white text-stone-700 font-medium border-stone-300 hover:border-stone-400 dark:bg-stone-900 dark:text-stone-300 dark:border-stone-700'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="text-[10px] bg-stone-200 dark:bg-stone-700 px-1.5 rounded-full font-bold border border-stone-300 dark:border-stone-600">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
