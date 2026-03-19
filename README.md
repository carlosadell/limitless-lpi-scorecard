# LPI Scorecard — Limitless Performance Indicators

A weekly/monthly KPI tracking app for FFS dental practices, built for **The Limitless Dentist Academy** by **A.I.conic Business Hub**.

## What It Does

- **Weekly CEO Scorecard** — Track Access & Flow, Conversion, and Hygiene KPIs every Monday
- **Monthly Profit & Capacity** — Track Financial Control and Capacity metrics monthly
- **Green / Yellow / Red** — Automatic status evaluation with exact thresholds
- **"If Red → Do This"** — Actionable guidance surfaced when a KPI hits red
- **History & Trends** — Historical scorecard library with mini trend charts
- **Dashboard** — Overall score ring, section summaries, and action-required alerts
- **Leading Indicators** — Referral %, review velocity, doctor energy

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- Recharts (for future chart expansion)
- localStorage for data persistence
- Vercel for hosting

## Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev
```

Opens at http://localhost:5173

## Deploy to Vercel

### Option A: CLI

```bash
npm install -g vercel
vercel
```

### Option B: Git Integration (Recommended)

1. Push this repo to GitHub
2. Go to https://vercel.com → New Project → Import your repo
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Click Deploy

### Custom Domain (Optional)

1. In Vercel → Project → Settings → Domains
2. Add your custom domain
3. Follow the DNS instructions Vercel provides

### The `vercel.json` Config

The included `vercel.json` handles SPA routing so all paths resolve to `index.html`. No additional config needed.

## Project Structure

```
src/
├── main.jsx                  # Entry point
├── App.jsx                   # Main app shell + routing
├── index.css                 # Tailwind + custom styles
├── data/
│   └── kpiDefinitions.js     # All KPI definitions, thresholds, actions
├── hooks/
│   └── useLpiData.js         # localStorage persistence hook
└── components/
    ├── ui/
    │   ├── Header.jsx        # App header + tab navigation
    │   ├── Footer.jsx        # Powered by A.I.conic footer
    │   ├── KpiInput.jsx      # Individual KPI input with status
    │   └── StatusBadge.jsx   # Green/Yellow/Red badge
    └── views/
        ├── DashboardView.jsx # Score ring + summaries + actions
        ├── WeeklyView.jsx    # Weekly KPI input form
        ├── MonthlyView.jsx   # Monthly KPI input form
        └── HistoryView.jsx   # Historical entries + trends
```

## Data Model

Currently uses `localStorage` for client-side persistence. The scorecard is designed as a single-doc FFS practice tool. Future variants (FFS + Associate, Mixed, Mixed + Associate) are scoped for paid clients.

## Branding

- **Colors**: Black (#0A0A0A), Red (#FF3333), White
- **Fonts**: Oswald (headings), DM Sans (body)
- **Style**: Dark, premium, high-contrast — Limitless / Code Black aesthetic
- **Footer**: "Powered by A.I.conic" (mandatory on all client apps)

## Built by A.I.conic Business Hub

https://aiconic.business
