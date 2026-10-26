# PerkPilot AU (Perk_Finder)

> **The Honest Australian Banking & Perks Aggregator**  
> Pure financial math dictates all rankings. Monetization (referrals/affiliates) is strictly opportunistic and has ZERO influence on ranking, order, or visibility.

---

## 🌟 Overview

Australians lose thousands of dollars each year by swiping the wrong debit/credit card, missing high-interest savings bonus criteria, or paying full retail price when instant 2% to 4.5% digital eGift card discounts are available.

**PerkPilot AU** solves this with an instant, client-side, zero-bias utility:
- **Perk Optimizer**: Select an Australian merchant across **Essentials** (Woolworths, Coles, ALDI, Bunnings, Kmart), **Tech** (JB Hi-Fi, Apple, Officeworks), or **Fuel** (7-Eleven, Ampol, BP). PerkPilot calculates the optimal payment card or gift card to use based on authentic earn rates, FX fee rules, and merchant cashbacks.
- **My Deck**: Manage the cards and accounts you hold with local persistence.
- **Savings Benchmark**: Real-time deposit yield calculator for Australian APRA-regulated deposit accounts and term deposits (ING, Rabobank, uBank, Bankwest, Revolut, Up, Macquarie, ANZ Plus, CBA GoalSaver, NAB, Judo Bank).
- **eGift Card Marketplace**: Comprehensive directory of instant digital gift card discount programs across **Macquarie Marketplace**, **NRMA Blue / RACV Auto Clubs**, **Suncorp Bank Benefits**, **ShopBack / Cashrewards**, and **Bupa Life Rewards**.
- **Math Auditor**: Complete transparent disclosure of every formula, point valuation (e.g. Qantas at ~1.05¢, Amex MR at ~0.50¢, CBA/Westpac at ~0.45¢), and calculation step.

---

## 🚀 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Lucide React
- **State Management**: Zustand with `persist` middleware
- **Backend / Database**: Supabase (`@supabase/supabase-js`, `@supabase/ssr`, PostgreSQL with RLS)
- **Code Review**: CodeRabbit AI integration

---

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js 18.17+ or 20+
- npm or yarn

### 2. Installation
```bash
git clone https://github.com/rorymullan99git/Perk_Finder.git
cd Perk_Finder
npm install
```

### 3. Environment Configuration
Copy the template and fill in your Supabase credentials:
```bash
cp .env.example .env.local
```
Update `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-key
```

### 4. Database Setup (Optional)
To sync rates with your Supabase database:
1. Run the schema script in the Supabase SQL Editor from `supabase/schema.sql`.
2. Seed verified Australian rates:
   ```bash
   npx tsx scripts/seed-rates.ts
   ```

### 5. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

### 6. Production Build
```bash
npm run build
npm run start
```

---

## 🔒 Security & Privacy

- Client-side first: Card selections (`heldCardIds`), favorite merchants, and spend preferences remain private in local browser storage (`localStorage`).
- Zero tracking or affiliate ranking manipulation.

---

## 📄 License
MIT License.
