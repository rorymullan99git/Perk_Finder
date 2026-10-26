import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { MathModal } from '@/components/manifesto/MathModal';

export const metadata: Metadata = {
  title: 'PerkPilot AU | The Honest Australian Banking & Perks Aggregator',
  description: 'Pure financial math dictates every ranking. Compare cards, eGift card discounts, cashbacks, and high-interest savings accounts in Australia with zero affiliate bias.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-AU">
      <body className="min-h-screen flex flex-col bg-background text-stone-900 dark:text-stone-100 antialiased selection:bg-emerald-500 selection:text-white">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          {children}
        </main>
        <MathModal />

        <footer className="border-t border-stone-200 bg-white py-8 text-xs text-stone-500 mt-16 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-stone-900 dark:text-white">PerkPilot AU</span>
              <span>•</span>
              <span>Pure math. Zero affiliate bias. Free.</span>
            </div>
            <div className="text-center md:text-right text-[11px] text-stone-400">
              Information provided for general educational comparison only. Not personal financial product advice.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
