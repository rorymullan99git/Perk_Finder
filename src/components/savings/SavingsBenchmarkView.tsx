'use client';

import React, { useMemo, useState } from 'react';
import { SAVINGS_ACCOUNTS_DATA } from '@/data/savingsRates';
import { estimateFirstYear } from '@/lib/savings';
import { cn, formatAudWhole } from '@/lib/utils';
import { PageHeader } from '@/components/ui/page-header';
import { AmountInput } from '@/components/ui/amount-input';
import { Segmented } from '@/components/ui/segmented';
import { ChevronDown } from 'lucide-react';

type Filter = 'all' | 'unconditional' | 'conditional' | 'term_deposit';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'unconditional', label: 'No conditions' },
  { value: 'conditional', label: 'Bonus conditions' },
  { value: 'term_deposit', label: 'Term deposits' },
];

export const SavingsBenchmarkView: React.FC = () => {
  const [balanceAud, setBalanceAud] = useState(25000);
  const [filter, setFilter] = useState<Filter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const accounts = useMemo(() => {
    return SAVINGS_ACCOUNTS_DATA.filter((a) => {
      if (filter === 'unconditional') return a.type === 'savings' && a.isUnconditional;
      if (filter === 'conditional') return a.type === 'savings' && !a.isUnconditional;
      if (filter === 'term_deposit') return a.type === 'term_deposit';
      return true;
    })
      .map((a) => ({ ...a, ...estimateFirstYear(a, balanceAud) }))
      .sort((a, b) => b.firstYearInterest - a.firstYearInterest);
  }, [balanceAud, filter]);

  return (
    <div>
      <PageHeader
        title="Savings accounts"
        description="Ranked by how much interest your balance would earn in the first year, including when intro rates end."
      />

      <div className="max-w-xs">
        <AmountInput id="balance" label="Your balance" value={balanceAud} step={1000} onChange={setBalanceAud} />
      </div>

      <div className="mt-6">
        <Segmented label="Account type" options={FILTERS} value={filter} onChange={setFilter} />
      </div>

      <ol className="mt-4 divide-y divide-stone-100 border-y border-stone-100">
        {accounts.map((account) => {
          const isOpen = expandedId === account.id;
          const tags = [
            account.bank,
            account.type === 'term_deposit'
              ? `${account.termMonths} month term`
              : account.isUnconditional
                ? 'No conditions'
                : 'Conditions apply',
            account.introMonths ? `Intro rate for ${account.introMonths} months` : null,
          ].filter(Boolean);

          return (
            <li key={account.id}>
              <button
                onClick={() => setExpandedId(isOpen ? null : account.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-4 py-3 text-left hover:bg-stone-50"
              >
                <span className="min-w-0 flex-1">
                  <span className="block">{account.accountName}</span>
                  <span className="block text-sm text-stone-500">{tags.join(' · ')}</span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block tabular-nums">{formatAudWhole(account.firstYearInterest)}<span className="text-stone-500">/yr</span></span>
                  <span className="block text-sm tabular-nums text-stone-500">{account.totalRatePercent.toFixed(2)}%</span>
                </span>
                <ChevronDown className={cn('h-4 w-4 shrink-0 text-stone-400 transition-transform', isOpen && 'rotate-180')} />
              </button>

              {isOpen && (
                <div className="space-y-3 pb-4 pr-8 text-sm text-stone-600">
                  <ul className="list-disc space-y-1 pl-5">
                    {account.conditions.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                  {account.isCapped && (
                    <p>Only the first {formatAudWhole(account.balanceCapAud!)} earns this rate.</p>
                  )}
                  {account.directUrl && (
                    <a
                      href={account.directUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-stone-900 underline underline-offset-4"
                    >
                      View on {account.bank}&apos;s site
                    </a>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <p className="mt-6 text-xs text-stone-500">
        Rates are a manually collected snapshot and can change at any time. Confirm on the bank&apos;s site before
        opening an account. Deposits up to $250,000 per person per bank are covered by the Australian Government&apos;s
        Financial Claims Scheme.
      </p>
    </div>
  );
};
