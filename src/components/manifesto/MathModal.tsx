'use client';

import React from 'react';
import { usePerkStore } from '@/store/usePerkStore';
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Scale, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const MathModal: React.FC = () => {
  const { showMathModal, setShowMathModal } = usePerkStore();

  return (
    <Dialog open={showMathModal} onOpenChange={setShowMathModal} label="PerkPilot Pure Math Engine">
      <DialogHeader>
        <div className="flex items-center gap-2 mb-1">
          <div className="h-8 w-8 rounded-xl bg-emerald-500/20 text-emerald-700 flex items-center justify-center">
            <Scale className="h-4 w-4" />
          </div>
          <DialogTitle>PerkPilot Pure Math Engine</DialogTitle>
        </div>
        <DialogDescription>
          How we evaluate and rank every card and perk without commercial influence.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 text-xs text-stone-700 dark:text-stone-300">
        <div className="p-3.5 rounded-2xl bg-stone-900 text-stone-100 font-mono text-xs leading-relaxed">
          <code>
            Net Benefit (AUD) = Gross Cash Savings + (Reward Points × Real Pt Value) - Surcharges
          </code>
        </div>

        <div className="space-y-2">
          <h4 className="font-bold text-stone-900 dark:text-white uppercase tracking-wider text-xs">
            Standardized Point Benchmarks:
          </h4>
          <ul className="space-y-1.5 pl-2">
            <li className="flex items-center justify-between">
              <span>• Qantas Frequent Flyer:</span>
              <strong className="text-emerald-700 font-mono">1.05¢ / pt ($0.0105)</strong>
            </li>
            <li className="flex items-center justify-between">
              <span>• Velocity Frequent Flyer:</span>
              <strong className="text-emerald-700 font-mono">1.00¢ / pt ($0.0100)</strong>
            </li>
            <li className="flex items-center justify-between">
              <span>• Amex Membership Rewards:</span>
              <strong className="text-emerald-700 font-mono">0.50¢ / pt ($0.0050)</strong>
            </li>
            <li className="flex items-center justify-between">
              <span>• Flybuys & Everyday Rewards:</span>
              <strong className="text-emerald-700 font-mono">0.50¢ / pt ($0.0050)</strong>
            </li>
            <li className="flex items-center justify-between">
              <span>• CommBank, Westpac & ANZ Points:</span>
              <strong className="text-emerald-700 font-mono">0.45¢ / pt ($0.0045)</strong>
            </li>
          </ul>
        </div>

        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
          <strong>The Merit Guarantee:</strong> We do not accept sponsored rankings. The card with the highest net financial return in AUD for your specified spend is always ranked #1.
        </div>

        <div className="flex justify-end pt-2">
          <Button
            size="sm"
            variant="emerald"
            onClick={() => setShowMathModal(false)}
          >
            I Understand the Math
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
