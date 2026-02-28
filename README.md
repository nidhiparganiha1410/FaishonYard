# Fashion Yard

A luxury editorial blogging and affiliate marketing platform with a minimalist aesthetic.

## Tech Stack

- **Frontend**: React 19 + Vite + TailwindCSS v4
- **Backend**: Supabase (Auth, Database, Storage)
- **Hosting**: Vercel (Static + Serverless Functions)
- **UI**: Motion (Framer Motion), Lucide Icons, Recharts

## Getting Started (Local)

```bash
# Install dependencies
npm install

# Copy env template and add your Supabase keys
cp .env.example .env

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Environment Variables

| Variable | Usage | Required |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL (client-side) | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key (client-side) | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin key (serverless functions) | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Optional |
| `VITE_GA_MEASUREMENT_ID` | Google Analytics ID | Optional |

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the repo in [Vercel](https://vercel.com/new)
3. Add the environment variables above in Vercel → Settings → Environment Variables
4. Deploy — Vercel auto-detects the Vite config

## Database Setup

Execute the SQL in `supabase/migrations/20240225000000_initial_schema.sql` in your Supabase SQL Editor to create all required tables.

## Project Structure

```
├── api/              # Vercel Serverless Functions
│   ├── admin/stats.ts
│   ├── go/[slug].ts
│   └── posts/[id]/view.ts
├── src/
│   ├── components/   # Reusable UI components
│   ├── data/         # Mock/static data
│   ├── lib/          # Supabase client & utilities
│   └── pages/        # Page components
├── index.html        # SPA entry point
├── vite.config.ts    # Vite configuration
└── vercel.json       # Vercel deployment config
```
