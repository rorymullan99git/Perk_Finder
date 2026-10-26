'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { SAVINGS_ACCOUNTS_DATA, SAVINGS_RATES_AS_OF } from '@/data/savingsRates';
import { projectInterest, isEligibleForAge, isAgeRestricted } from '@/lib/savings';
import { SavingsAccount } from '@/types';
import { formatAud } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { 
  PiggyBank, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign, 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  HelpCircle,
  Sliders,
  ExternalLink
} from 'lucide-react';

export const SavingsBenchmarkView: React.FC = () => {
  const [balanceAud, setBalanceAud] = useState<number>(35000);
  const [balanceText, setBalanceText] = useState('35000');
  const [ageText, setAgeText] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unconditional' | 'conditional' | 'term_deposit'>('all');
  const [selectedAccount, setSelectedAccount] = useState<SavingsAccount | null>(null);

  useEffect(() => {
    if (!selectedAccount) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelectedAccount(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedAccount]);

  const balancePresets = [10000, 25000, 50000, 100000, 250000];

  const age = ageText === '' ? null : Number(ageText);
  const hasAge = age !== null && Number.isFinite(age) && age > 0;

  // Project interest for each account the user is eligible for, ranked by annualised return
  const accountsWithCalculations = useMemo(() => {
    return SAVINGS_ACCOUNTS_DATA
      .filter((acc) => !hasAge || isEligibleForAge(acc, age as number))
      .map((acc) => ({ ...acc, ...projectInterest(acc, balanceAud) }))
      .sort((a, b) => b.monthlyAud - a.monthlyAud);
  }, [balanceAud, hasAge, age]);

  const filteredAccounts = useMemo(() => {
    if (filterType === 'unconditional') {
      return accountsWithCalculations.filter(a => a.isUnconditional && a.type === 'savings');
    }
    if (filterType === 'conditional') {
      return accountsWithCalculations.filter(a => !a.isUnconditional && a.type === 'savings');
    }
    if (filterType === 'term_deposit') {
      return accountsWithCalculations.filter(a => a.type === 'term_deposit');
    }
    return accountsWithCalculations;
  }, [accountsWithCalculations, filterType]);

  // Without an age, don't headline an account most people can't open
  const topAccount = filteredAccounts.find((a) => hasAge || !isAgeRestricted(a));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Stop letting inflation eat your cash."
        description="Zero-hoop accounts, bonus-rate maximisers and term deposits, calculated on your exact balance."
      />

      {/* Interactive Deposit Calculator Controls */}
      <div className="rounded-3xl border border-stone-200 bg-white p-5 md:p-7 shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          {/* Balance Input */}
          <div className="md:col-span-7 space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="balance" className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                Your savings balance (AUD)
              </label>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                FCS Guarantee covers up to $250,000 per ADI
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-stone-600">
                $
              </span>
              <input
                id="balance"
                type="number"
                inputMode="decimal"
                min="100"
                step="1000"
                value={balanceText}
                onChange={(e) => {
                  setBalanceText(e.target.value);
                  const n = parseFloat(e.target.value);
                  if (Number.isFinite(n) && n >= 0) setBalanceAud(n);
                }}
                onBlur={() => setBalanceText(String(balanceAud))}
                className="flex h-12 w-full rounded-2xl border border-stone-200 bg-white pl-9 pr-4 py-2 text-xl font-black text-stone-900 shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
              />
            </div>
            {/* Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600 py-1 mr-1">Presets:</span>
              <div className="inline-flex rounded-xl border border-stone-900/30 dark:border-stone-700 bg-stone-100 dark:bg-stone-950 p-0.5 divide-x divide-stone-900/30 dark:divide-stone-700 shadow-sm">
                {balancePresets.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setBalanceAud(amount);
                      setBalanceText(String(amount));
                    }}
                    aria-pressed={balanceAud === amount}
                    className={`text-xs px-2.5 py-1 font-bold transition-all first:rounded-l-lg last:rounded-r-lg ${
                      balanceAud === amount
                        ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-sm'
                        : 'text-stone-700 hover:text-stone-950 hover:bg-white dark:text-stone-300 dark:hover:text-white dark:hover:bg-stone-800'
                    }`}
                  >
                    ${(amount / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Age eligibility */}
          <div className="md:col-span-12 flex flex-wrap items-center gap-2 -mt-3">
            <label htmlFor="age" className="text-xs font-bold uppercase tracking-wider text-stone-600">
              Your age (optional)
            </label>
            <input
              id="age"
              type="number"
              inputMode="numeric"
              min="14"
              max="120"
              value={ageText}
              onChange={(e) => setAgeText(e.target.value)}
              placeholder="e.g. 29"
              className="h-9 w-24 rounded-xl border border-stone-300 bg-white px-3 text-sm font-semibold text-stone-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
            />
            <span className="text-xs text-stone-600 dark:text-stone-400">
              Hides age-restricted accounts you cannot open.
            </span>
          </div>

          {/* Top earner preview card */}
          {topAccount && (
            <div className="md:col-span-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 p-4 space-y-1">
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-800 dark:text-emerald-300">
                Top Rate in Selected Filter:
              </span>
              <div className="flex items-baseline justify-between">
                <span className="font-extrabold text-base text-stone-900 dark:text-white truncate">
                  {topAccount.bank} ({topAccount.totalRatePercent}% p.a.{topAccount.hasIntroRate ? ' intro' : ''})
                </span>
                <span className="text-xl font-black text-emerald-700 dark:text-emerald-400">
                  +{formatAud(topAccount.interestAud)}{topAccount.horizonMonths === 12 ? '/yr' : ` / ${topAccount.horizonMonths}mo`}
                </span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                Approx <strong>{formatAud(topAccount.monthlyAud)}</strong> interest a month on your ${balanceAud.toLocaleString()} deposit
                {topAccount.hasIntroRate ? `, including the ${topAccount.introMonths}-month intro rate then ${topAccount.ongoingRatePercent}% p.a.` : '.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="inline-flex flex-wrap rounded-xl border border-stone-900/30 dark:border-stone-700 bg-stone-100 dark:bg-stone-950 p-0.5 divide-x divide-stone-900/30 dark:divide-stone-700 shadow-sm">
          <button
            onClick={() => setFilterType('all')}
            aria-pressed={filterType === 'all'}
            className={`px-4 py-2 text-xs font-bold rounded-l-lg transition-all ${
              filterType === 'all'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-stone-700 hover:text-stone-950 hover:bg-white dark:text-stone-300 dark:hover:text-white dark:hover:bg-stone-800'
            }`}
          >
            All Accounts ({accountsWithCalculations.length})
          </button>
          <button
            onClick={() => setFilterType('unconditional')}
            aria-pressed={filterType === 'unconditional'}
            className={`px-4 py-2 text-xs font-bold transition-all ${
              filterType === 'unconditional'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-stone-700 hover:text-stone-950 hover:bg-white dark:text-stone-300 dark:hover:text-white dark:hover:bg-stone-800'
            }`}
          >
            Zero Hoops (Unconditional)
          </button>
          <button
            onClick={() => setFilterType('conditional')}
            aria-pressed={filterType === 'conditional'}
            className={`px-4 py-2 text-xs font-bold transition-all ${
              filterType === 'conditional'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-stone-700 hover:text-stone-950 hover:bg-white dark:text-stone-300 dark:hover:text-white dark:hover:bg-stone-800'
            }`}
          >
            High-Interest Maximisers
          </button>
          <button
            onClick={() => setFilterType('term_deposit')}
            aria-pressed={filterType === 'term_deposit'}
            className={`px-4 py-2 text-xs font-bold rounded-r-lg transition-all ${
              filterType === 'term_deposit'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-stone-700 hover:text-stone-950 hover:bg-white dark:text-stone-300 dark:hover:text-white dark:hover:bg-stone-800'
            }`}
          >
            Fixed Term Deposits
          </button>
        </div>

        <span className="text-xs text-stone-600">
          Hand-entered rate snapshot as of {SAVINGS_RATES_AS_OF}, not live. Confirm on the bank&apos;s page before you apply.
        </span>
      </div>

      {filteredAccounts.length === 0 && (
        <div className="rounded-2xl border border-dashed border-stone-300 py-12 text-center text-sm text-stone-600">
          No accounts in this filter.
        </div>
      )}

      {/* Savings Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAccounts.map((account) => {
          return (
            <div
              key={account.id}
              className="flex flex-col justify-between rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm hover:border-stone-300 dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-700 transition-all"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
                      {account.bank}
                    </span>
                    <h3 className="font-bold text-base text-stone-900 dark:text-white leading-tight">
                      {account.accountName}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
                      {account.totalRatePercent.toFixed(2)}%
                    </div>
                    <span className="text-xs text-stone-600 uppercase font-semibold">p.a.</span>
                  </div>
                </div>

                {/* Badge tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {account.highlightBadge && (
                    <Badge variant="brand" className="text-xs py-0">
                      {account.highlightBadge}
                    </Badge>
                  )}
                  {account.hasIntroRate && (
                    <Badge variant="warning" className="text-xs py-0">
                      Intro {account.introMonths}M then {account.ongoingRatePercent?.toFixed(2)}%
                    </Badge>
                  )}
                  {isAgeRestricted(account) && (
                    <Badge variant="secondary" className="text-xs py-0">
                      Ages {account.minAge}-{account.maxAge}
                    </Badge>
                  )}
                  {account.isUnconditional ? (
                    <Badge variant="success" className="text-xs py-0">
                      Zero Hoops
                    </Badge>
                  ) : (
                    <Badge variant="warning" className="text-xs py-0">
                      Conditional
                    </Badge>
                  )}
                  {account.type === 'term_deposit' && (
                    <Badge variant="secondary" className="text-xs py-0">
                      Fixed {account.termMonths}M
                    </Badge>
                  )}
                </div>

                {/* Calculated returns box */}
                <div className="rounded-xl bg-stone-50 dark:bg-stone-800/80 p-3 mb-3 border border-stone-100 dark:border-stone-700/60">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-stone-600">Avg. Monthly Interest:</span>
                    <span className="font-extrabold text-stone-900 dark:text-white">
                      +{formatAud(account.monthlyAud)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-600">
                      {account.horizonMonths === 12 ? '12-Month Total:' : `Interest over ${account.horizonMonths}-month term:`}
                    </span>
                    <span className="font-black text-emerald-700 dark:text-emerald-400">
                      +{formatAud(account.interestAud)}
                    </span>
                  </div>
                  {account.isCapped && (
                    <div className="mt-2 text-xs text-amber-700 dark:text-amber-300 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                      <span>
                        Headline rate applies to the first ${account.balanceCapAud?.toLocaleString()}; the rest earns{' '}
                        {(account.aboveCapRatePercent ?? account.baseRatePercent).toFixed(2)}%.
                      </span>
                    </div>
                  )}
                </div>

                {/* Conditions breakdown */}
                <div className="space-y-1 text-xs text-stone-600 dark:text-stone-300">
                  <span className="font-bold text-xs uppercase tracking-wider text-stone-600">
                    Requirements:
                  </span>
                  {account.conditions.map((cond, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{cond}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom notes */}
              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 text-xs text-stone-600 flex items-center justify-between">
                <span>{account.fcsProtected ? 'Gov FCS Protected' : 'Check FCS cover with provider'}</span>
                <div className="flex items-center gap-3">
                  {account.directUrl && (
                    <a
                      href={account.directUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-stone-600 hover:text-stone-800 dark:hover:text-stone-200 flex items-center gap-1 font-medium"
                      title="Visit official bank product page"
                    >
                      <span>Bank PDS</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  <button
                    onClick={() => setSelectedAccount(account)}
                    className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline"
                  >
                    Criteria →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Account Details Modal */}
      {selectedAccount && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Account criteria"
          onClick={() => setSelectedAccount(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in"
        >
          <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
                  {selectedAccount.bank}
                </span>
                <h3 className="text-xl font-black text-stone-900 dark:text-white">
                  {selectedAccount.accountName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAccount(null)}
                aria-label="Close"
                className="rounded-full p-2 text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">Interest Rate</span>
                <div className="text-3xl font-black text-emerald-800 dark:text-emerald-300">
                  {selectedAccount.totalRatePercent.toFixed(2)}% <span className="text-sm font-semibold">p.a.</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">Rate Structure</span>
                <div className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  {selectedAccount.baseRatePercent}% Base + {selectedAccount.bonusRatePercent}% Bonus
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                Monthly Hoops & Criteria:
              </span>
              <div className="space-y-2 p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                {selectedAccount.conditions.map((cond, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-emerald-700 font-bold">•</span>
                    <span>{cond}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              {selectedAccount.notes}
            </p>

            <div className="pt-2 flex items-center justify-between">
              {selectedAccount.directUrl ? (
                <a
                  href={selectedAccount.directUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 text-white font-semibold hover:bg-emerald-800 text-xs transition-colors"
                >
                  <span>Visit Official Bank Page</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : <div />}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedAccount(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
