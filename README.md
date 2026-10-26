# PerkPilot AU

Find the card, gift card or savings account that pays you the most in Australia. Every option is ranked by the dollars it puts back in your pocket; referral or affiliate deals never change the order.

## What it does

- **Best card**: pick a store and an amount, and see which of your cards (or which card on the market) gives you the most back.
- **My cards**: tick the cards, accounts and memberships you hold. Saved in your browser only.
- **Savings**: savings accounts and term deposits ranked by first-year interest on your balance, including when intro rates end.
- **Gift cards**: discounted eGift cards (Macquarie, NRMA Blue, Suncorp, ShopBack, Bupa) you can buy just before paying.
- **How the ranking works**: the formula and the value used for each rewards point.

All calculations run in the browser from the data in `src/data/`. The site does not call a database at runtime.

## Tech stack

Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Zustand. Deployed as a standalone container on Google Cloud Run.

## Local development

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run build
```

## Deploying to Cloud Run

```bash
gcloud config set project YOUR_PROJECT_ID
SERVICE=perk-finder REGION=australia-southeast1 ./scripts/deploy-cloud-run.sh
```

The script builds from the `Dockerfile` and deploys with a dedicated no-permission service account, a max of 3 instances (caps cost if someone floods the site), and 512 MiB memory.

## Supabase (optional)

The live site does not need Supabase. The schema and seed scripts are kept for a future move of the data into Postgres.

1. Run `supabase/schema.sql` in the Supabase SQL Editor. Tables are publicly **readable** only; there are no write policies.
2. Put these in `.env.local` (see `.env.example`):
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (public)
   - `SUPABASE_SERVICE_ROLE_KEY` (secret, used only by the seed scripts on your machine)
3. `npm run seed:all` to load everything, or `npm run seed:rates` to refresh deposit rates.

Never put the service role key in a `NEXT_PUBLIC_` variable or in the Cloud Run service; it bypasses all database security.

## Security

- No accounts, no server-side user data. Card selections live in `localStorage`.
- Strict security headers (CSP, HSTS, frame blocking, nosniff) are set in `next.config.mjs`.
- The Next.js image optimiser is disabled, as no images need it.
- Database writes are only possible with the service role key.

## Disclaimer

General information only, not financial advice. Rates and offers are a manually collected snapshot; confirm with the provider before applying.

## License

MIT
