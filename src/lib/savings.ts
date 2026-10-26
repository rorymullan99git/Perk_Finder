import { SavingsAccount } from '@/types';

export interface SavingsProjection {
  /** Interest earned over the projection window (term for term deposits, otherwise 12 months). */
  interestAud: number;
  /** Months covered by `interestAud`. */
  horizonMonths: number;
  /** interestAud averaged per month over the horizon. */
  monthlyAud: number;
  /** Balance earning the headline rate. */
  cappedBalanceAud: number;
  isCapped: boolean;
  hasIntroRate: boolean;
}

/**
 * Projects simple (non-compounding) interest.
 * - Term deposits: the term only, since the money is locked and paid out at maturity.
 * - Intro-rate savers: intro months at the intro rate, the remainder of the year at the ongoing rate.
 * - Balance caps: the headline rate applies up to the cap, the excess earns the above-cap rate
 *   (falling back to the base rate when the provider's tier is not recorded).
 */
export function projectInterest(acc: SavingsAccount, balanceAud: number): SavingsProjection {
  const balance = Math.max(0, balanceAud);
  const cap = acc.balanceCapAud;
  const isCapped = cap !== undefined && balance > cap;
  const cappedBalanceAud = isCapped ? cap : balance;
  const excess = isCapped ? balance - cap : 0;
  const aboveCapRate = acc.aboveCapRatePercent ?? acc.baseRatePercent;

  const horizonMonths = acc.type === 'term_deposit' ? acc.termMonths ?? 12 : 12;
  const introMonths = Math.min(acc.introMonths ?? 0, horizonMonths);
  const hasIntroRate = introMonths > 0 && acc.ongoingRatePercent !== undefined;

  const headlineMonths = hasIntroRate ? introMonths : horizonMonths;
  const laterMonths = horizonMonths - headlineMonths;
  const laterRate = hasIntroRate ? acc.ongoingRatePercent! : acc.totalRatePercent;

  const headlineInterest = cappedBalanceAud * (acc.totalRatePercent / 100) * (headlineMonths / 12);
  const laterInterest = cappedBalanceAud * (laterRate / 100) * (laterMonths / 12);
  const excessInterest = excess * (aboveCapRate / 100) * (horizonMonths / 12);

  const interestAud = headlineInterest + laterInterest + excessInterest;
  return {
    interestAud,
    horizonMonths,
    monthlyAud: interestAud / horizonMonths,
    cappedBalanceAud,
    isCapped,
    hasIntroRate,
  };
}

export function isEligibleForAge(acc: SavingsAccount, age: number): boolean {
  return (acc.minAge === undefined || age >= acc.minAge) && (acc.maxAge === undefined || age <= acc.maxAge);
}

export function isAgeRestricted(acc: SavingsAccount): boolean {
  return acc.minAge !== undefined || acc.maxAge !== undefined;
}
