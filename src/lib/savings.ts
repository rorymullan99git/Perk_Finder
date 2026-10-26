import { SavingsAccount } from '@/types';

export interface SavingsEstimate {
  /** Portion of the balance that earns the advertised rate. */
  earningBalance: number;
  /** Interest over the first 12 months, blending any intro rate with the rate it reverts to. */
  firstYearInterest: number;
  isCapped: boolean;
}

/**
 * Simple-interest estimate for the first year. Intro rates only apply for
 * `introMonths`; the remaining months use `revertRatePercent`. Balance above
 * the cap is assumed to earn nothing extra.
 */
export function estimateFirstYear(account: SavingsAccount, balanceAud: number): SavingsEstimate {
  const balance = Math.max(0, balanceAud);
  const earningBalance = account.balanceCapAud ? Math.min(balance, account.balanceCapAud) : balance;

  const introMonths = Math.min(12, account.introMonths ?? 12);
  const revertRate = account.revertRatePercent ?? account.totalRatePercent;
  const blendedRate = (account.totalRatePercent * introMonths + revertRate * (12 - introMonths)) / 12;

  return {
    earningBalance,
    firstYearInterest: earningBalance * (blendedRate / 100),
    isCapped: Boolean(account.balanceCapAud && balance > account.balanceCapAud),
  };
}
