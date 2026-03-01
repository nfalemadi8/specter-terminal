# CLAUDE.md — Specter Terminal v3.0

## Project Overview

Specter Terminal is a personal Bloomberg Terminal-style financial dashboard built with React. It features 39 interactive modules covering equities, fixed income, commodities, forex, crypto, options, futures, ETFs, economic data, news, portfolio management, stress testing, ESG screening, M&A tracking, and more — all rendered in a dark terminal theme with JetBrains Mono font and amber/green Bloomberg-style coloring.

## Tech Stack

- **Framework**: React 19 (Vite 7)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite` plugin)
- **Charts**: Recharts (with ResponsiveContainer)
- **Utilities**: Lodash
- **Code Splitting**: React.lazy + Suspense for all 39 tabs
- **Deployment**: GitHub Pages via GitHub Actions

## Build & Run

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Production build to docs/
npm run preview      # Preview production build
```

## Project Structure

```
src/
├── main.jsx                     # Entry point
├── App.jsx                      # Root with React.lazy tabs + Suspense
├── index.css                    # Tailwind imports + Bloomberg theme
├── components/
│   ├── layout/
│   │   ├── Header.jsx           # Top bar with clock and live indicator
│   │   ├── TickerBar.jsx        # Scrolling market ticker
│   │   ├── TabBar.jsx           # 39-tab navigation with 1-9 shortcuts
│   │   ├── CommandBar.jsx       # Bottom command input + Ctrl+K spotlight
│   │   ├── Panel.jsx            # Reusable panel container
│   │   ├── LoadingFallback.jsx  # Suspense loading skeleton
│   │   ├── ExportButton.jsx     # Reusable CSV export button
│   │   └── MetricTooltip.jsx    # Hover tooltips for financial metrics
│   └── tabs/                    # 39 tab components (lazy-loaded)
├── data/
│   ├── stocks.js                # Stock data, indices, sectors, price generator
│   ├── bonds.js                 # Treasury + corporate bond + Sukuk data
│   ├── commodities.js           # Commodity prices + history generator
│   ├── forex.js                 # FX pairs + crypto pairs
│   ├── economic.js              # Economic indicators, calendar, earnings
│   ├── news.js                  # News items
│   ├── portfolio.js             # Holdings, metrics calculator, history
│   ├── deals.js                 # M&A deals including GCC
│   ├── billionaires.js          # Billionaire wealth data
│   ├── stress-scenarios.js      # 10 stress test scenarios
│   └── tabs.js                  # Tab definitions (39 tabs)
└── utils/
    ├── format.js                # Number/currency/percent formatting + round()
    ├── calculations.js          # DCF, Black-Scholes, Greeks, currency conversion
    ├── exportCsv.js             # CSV export utility
    └── storage.js               # localStorage helper
```

## Theme & Design

- **Color scheme**: Bloomberg-inspired dark terminal (`#0a0a0a` background, `#ffbf00` amber headers, `#00d26a` green / `#ff3b3b` red for changes)
- **Font**: JetBrains Mono (primary), Consolas, SF Mono (fallbacks)
- **Font size**: 10-12px for data-dense terminal feel
- **Custom CSS classes**: `.bb-panel`, `.bb-panel-header`, `.bb-table`, `.positive`, `.negative`, `.data-dense`, `.section-header`
- **Tailwind theme colors**: `bb-black`, `bb-dark`, `bb-panel`, `bb-border`, `bb-green`, `bb-red`, `bb-amber`, `bb-blue`, `bb-cyan`, `bb-muted`

## Code Conventions

- Functional React components only
- Tab components are self-contained with their own data imports
- All tabs lazy-loaded via React.lazy() for code splitting
- Panel component wraps all content sections with consistent styling
- Data is static/simulated (demo mode) — no external API calls
- Safe number formatting via `round()` from `src/utils/format.js` — never use `.toFixed()`
- Format utilities: `formatCurrency`, `formatPercent`, `formatChange`, `formatNumber`, `formatMcap`
- Keyboard shortcuts: 1-9 for first 9 tabs, F1-F10 for first 10, Ctrl+K for spotlight

## Accessibility

- Skip-to-content link
- ARIA labels on tab buttons
- role="dialog" on spotlight overlay
- ▲/▼ arrows alongside color for change indicators
