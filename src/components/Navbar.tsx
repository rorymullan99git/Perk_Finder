'use client';

import React from 'react';
import { usePerkStore, AppTab } from '@/store/usePerkStore';
import { cn } from '@/lib/utils';

const NAV_ITEMS: { id: AppTab; label: string }[] = [
  { id: 'best', label: 'Best card' },
  { id: 'cards', label: 'My cards' },
  { id: 'savings', label: 'Savings' },
  { id: 'giftcards', label: 'Gift cards' },
];

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab } = usePerkStore();

  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={() => setActiveTab('best')}
          className="self-start text-lg font-semibold tracking-tight text-stone-900"
        >
          PerkPilot <span className="text-emerald-700">AU</span>
        </button>

        <nav aria-label="Primary" className="-mx-1 flex gap-1 overflow-x-auto scrollbar-none">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition-colors',
                  isActive ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                )}
              >
                {item.label}
                {item.id === 'cards' && <CardCount />}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

/** Rendered client-side only after rehydration to avoid a server/client mismatch. */
function CardCount() {
  const count = usePerkStore((s) => s.heldCardIds.length);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted || count === 0) return null;
  return <span className="ml-1.5 tabular-nums opacity-60">{count}</span>;
}
