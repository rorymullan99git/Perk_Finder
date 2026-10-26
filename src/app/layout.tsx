import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { FooterLinks } from '@/components/FooterLinks';

export const metadata: Metadata = {
  title: 'PerkPilot AU | Which card should I use?',
  description:
    'Find the card, gift card or savings account that pays you the most in Australia. Ranked by the maths, never by affiliate deals.',
  icons: { icon: '/icon.svg' },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU">
      <body className="flex min-h-screen flex-col bg-white text-stone-900 antialiased">
        <Navbar />
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">{children}</main>
        <footer className="border-t border-stone-200">
          <div className="mx-auto flex max-w-3xl flex-col gap-2 px-4 py-6 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between">
            <span>General information only, not financial advice. Check terms with the provider before you apply.</span>
            <FooterLinks />
          </div>
        </footer>
      </body>
    </html>
  );
}
