'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  Scale, 
  ShieldCheck, 
  Cpu, 
  Lock, 
  Coins, 
  CheckCircle2, 
  HelpCircle,
  FileCode,
  HeartHandshake
} from 'lucide-react';

export const MathManifestoView: React.FC = () => {
  const pointValuations = [
    { program: 'Qantas Frequent Flyer', valueCents: '1.05¢', perPtAud: '$0.0105', benchmark: 'Economy & Business flight rewards, upgrades' },
    { program: 'Velocity Frequent Flyer', valueCents: '1.00¢', perPtAud: '$0.0100', benchmark: 'Virgin Australia domestic & international partner redemptions' },
    { program: 'Amex Membership Rewards (Gateway/Ascent)', valueCents: '0.50¢', perPtAud: '$0.0050', benchmark: '2:1 transfer to 8 airline partners (yielding 1 airline mile per 2 MR)' },
    { program: 'Flybuys (Coles)', valueCents: '0.50¢', perPtAud: '$0.0050', benchmark: 'Standard redemption: 2,000 Flybuys points = $10 at Coles checkout' },
    { program: 'Everyday Rewards (Woolworths)', valueCents: '0.50¢', perPtAud: '$0.0050', benchmark: 'Standard redemption: 2,000 Everyday points = $10 off groceries' },
    { program: 'CommBank Awards', valueCents: '0.45¢', perPtAud: '$0.0045', benchmark: 'Travel bookings, gift cards & Flight Centre partner transfer' },
    { program: 'Westpac Altitude Rewards', valueCents: '0.45¢', perPtAud: '$0.0045', benchmark: 'Velocity/KrisFlyer transfer rates & Altitude gift vouchers' },
    { program: 'ANZ Rewards', valueCents: '0.45¢', perPtAud: '$0.0045', benchmark: '2:1 transfer to Velocity Frequent Flyer & cash back' },
    { program: 'NAB Rewards', valueCents: '0.45¢', perPtAud: '$0.0045', benchmark: 'Flybuys transfer (1:1) & retail store credits' },
    { program: 'Bankwest More Rewards', valueCents: '0.35¢', perPtAud: '$0.0035', benchmark: 'Standard catalog vouchers & statement offset' },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      <PageHeader
        title="Financial math first. Always."
        description="Most comparison sites rank whichever bank pays the biggest bounty. PerkPilot AU ranks by one formula, shown below, and nothing else."
      />

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="p-6 space-y-2 border-stone-200 dark:border-stone-800">
          <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
            <Cpu className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-base text-stone-900 dark:text-white">Pure Client-Side Math</h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            Every ranking is calculated in real time directly inside your browser. No server-side bias, no affiliate sorting weight, no sponsor overrides.
          </p>
        </Card>

        <Card className="p-6 space-y-2 border-stone-200 dark:border-stone-800">
          <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-base text-stone-900 dark:text-white">Strict Zero-Affiliate Bias</h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            Monetization (if any in the future) is strictly opportunistic and has ZERO influence on which card ranks #1, #2, or #10. If an un-monetized card gives you better math, it stays #1.
          </p>
        </Card>

        <Card className="p-6 space-y-2 border-stone-200 dark:border-stone-800">
          <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
            <Lock className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-base text-stone-900 dark:text-white">Total Privacy</h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            Your card deck and favorite stores never leave your device. Stored exclusively in local browser storage without user tracking or telemetry.
          </p>
        </Card>
      </div>

      {/* The Mathematical Formula */}
      <Card className="border-stone-200 dark:border-stone-800">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Coins className="h-5 w-5 text-emerald-700" />
            <span>The Ranking Formula</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-2xl bg-stone-900 text-stone-100 font-mono text-xs md:text-sm overflow-x-auto">
            <code>
              NetBenefit(AUD) = GrossDiscount + DirectCashback + (RewardPoints × RealPointValuation) - Surcharges
            </code>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            For example, if you spend $200 at Woolworths:
            <br />
            1. <strong>Macquarie eGift Card:</strong> Saves 4.0% upfront = <strong>$8.00 cash savings</strong>.
            <br />
            2. <strong>Amex Platinum Edge:</strong> Earns 3 MR points per $1 = 600 points. At $0.005/pt valuation = <strong>$3.00 real value</strong>.
            <br />
            Result: Macquarie ranks ahead of Amex because $8.00 &gt; $3.00. Unambiguous, provable math.
          </p>
        </CardContent>
      </Card>

      {/* Point Valuations Table */}
      <Card className="border-stone-200 dark:border-stone-800">
        <CardHeader>
          <CardTitle className="text-xl">Standardized Australian Reward Point Valuations</CardTitle>
          <p className="text-xs text-stone-600 dark:text-stone-400">
            Normalized against realistic Australian domestic and international redemptions (not inflated promotional claims).
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <caption className="sr-only">Reward point valuations by program</caption>
              <thead className="border-b border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 uppercase tracking-wider text-xs">
                <tr>
                  <th scope="col" className="py-3 px-3">Reward Program</th>
                  <th scope="col" className="py-3 px-3">Valuation / Point</th>
                  <th scope="col" className="py-3 px-3">Per Point AUD</th>
                  <th scope="col" className="py-3 px-3">Redemption Benchmark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-stone-700 dark:text-stone-300">
                {pointValuations.map((p, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/40">
                    <td className="py-3 px-3 font-semibold text-stone-900 dark:text-white">
                      {p.program}
                    </td>
                    <td className="py-3 px-3 font-bold text-emerald-700 dark:text-emerald-400">
                      {p.valueCents}
                    </td>
                    <td className="py-3 px-3 font-mono text-stone-600 dark:text-stone-400">
                      {p.perPtAud}
                    </td>
                    <td className="py-3 px-3 text-stone-600 dark:text-stone-400">
                      {p.benchmark}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
