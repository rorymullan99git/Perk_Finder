'use client';

import React from 'react';
import { PageHeader } from '@/components/ui/page-header';

const POINT_VALUES: [program: string, cents: string][] = [
  ['Qantas Frequent Flyer', '1.05¢'],
  ['Velocity Frequent Flyer', '1.00¢'],
  ['Amex Membership Rewards', '0.50¢'],
  ['Flybuys', '0.50¢'],
  ['Everyday Rewards', '0.50¢'],
  ['CommBank Awards', '0.45¢'],
  ['Westpac Altitude', '0.45¢'],
  ['ANZ Rewards', '0.45¢'],
  ['NAB Rewards', '0.45¢'],
  ['Bankwest More Rewards', '0.35¢'],
];

export const MethodView: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="How the ranking works"
        description="Every option is ranked by the dollars it puts back in your pocket. Nothing else changes the order."
      />

      <div className="space-y-10 text-stone-700 leading-relaxed">
        <section>
          <h2 className="font-semibold text-stone-900">The formula</h2>
          <p className="mt-2 rounded-lg bg-stone-50 px-4 py-3 font-mono text-sm">
            Value = discount + cashback + (points × value per point)
          </p>
          <p className="mt-3">
            Example for $200 at Woolworths: a 4% eGift card discount saves $8.00. A card earning 3 points per dollar at
            0.5¢ a point is worth $3.00. The gift card ranks higher because $8.00 is more than $3.00.
          </p>
          <p className="mt-3">
            Overseas fee waivers only count when you pay in a foreign currency. Annual fees are shown but not subtracted,
            because they are paid once a year, not per purchase.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-stone-900">What a point is worth</h2>
          <p className="mt-2">Conservative values based on typical redemptions, not best-case flight bookings.</p>
          <table className="mt-3 w-full text-sm">
            <caption className="sr-only">Reward point valuations by program</caption>
            <thead>
              <tr className="border-b border-stone-200 text-left text-stone-500">
                <th scope="col" className="py-2 font-normal">Program</th>
                <th scope="col" className="py-2 text-right font-normal">Per point</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {POINT_VALUES.map(([program, cents]) => (
                <tr key={program}>
                  <td className="py-2">{program}</td>
                  <td className="py-2 text-right tabular-nums">{cents}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="font-semibold text-stone-900">Our promises</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>No paid placements. If we ever earn a referral fee, it will not change the ranking.</li>
            <li>Your cards stay in your browser. There are no accounts and no tracking.</li>
            <li>All calculations run on your device.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};
