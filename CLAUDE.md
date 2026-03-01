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
├── index.css                    # Tailwind imports + Bloomberg theme + flash animations
├── components/
│   ├── layout/
│   │   ├── Header.jsx           # Top bar with clock and live indicator
│   │   ├── MarketClock.jsx      # Exchange status bar (13 exchanges, open/closed/pre)
│   │   ├── TickerBar.jsx        # Scrolling market ticker (async global data)
│   │   ├── TabBar.jsx           # 39-tab navigation with 1-9 shortcuts
│   │   ├── CommandBar.jsx       # Bottom command input + Ctrl+K universal search
│   │   ├── Panel.jsx            # Reusable panel container
│   │   ├── LoadingFallback.jsx  # Suspense loading skeleton
│   │   ├── ExportButton.jsx     # Reusable CSV export button
│   │   └── MetricTooltip.jsx    # Hover tooltips for financial metrics
│   └── tabs/                    # 39 tab components (lazy-loaded)
├── data/
│   ├── globalMarkets.js         # Global market data: 51 exchanges, 159 stocks,
│   │                            #   63 bonds, 36 indices, 46 currencies, 25 commodities,
│   │                            #   20 crypto, 38 ETFs (lazy-loaded, ~82 kB chunk)
│   ├── stocks.js                # Legacy stock data (used by modules not yet migrated)
│   ├── bonds.js                 # Legacy bond data
│   ├── forex.js                 # Legacy FX pairs
│   ├── economic.js              # Economic indicators, calendar, earnings
│   ├── news.js                  # News items
│   ├── portfolio.js             # Holdings, metrics calculator, history
│   ├── deals.js                 # M&A deals including GCC
│   ├── billionaires.js          # Billionaire wealth data
│   ├── stress-scenarios.js      # 10 stress test scenarios
│   └── tabs.js                  # Tab definitions (39 tabs)
├── services/
│   └── dataProvider.js          # API abstraction layer over globalMarkets.js
│                                #   Async getters: getAllStocks(), getBonds(), getIndices(),
│                                #   getCommodities(), getCrypto(), getETFs(), getCurrencyRates(),
│                                #   getExchanges(), getYieldCurve(), universalSearch()
│                                #   Real-time: subscribeToPrices()
├── hooks/
│   └── usePriceSimulation.js    # React hook for real-time price simulation
│                                #   Flash animations, localStorage settings, auto-cleanup
└── utils/
    ├── format.js                # Number/currency/percent formatting + round()
    ├── calculations.js          # DCF, Black-Scholes, Greeks, currency conversion
    ├── exportCsv.js             # CSV export utility
    └── storage.js               # localStorage helper
```

## Data Architecture

### Global Data Layer (`globalMarkets.js` → `dataProvider.js`)
- **Lazy-loaded**: dynamically imported on first access, cached in memory
- **51 exchanges** with timezone, hours, MIC codes, status computation
- **159 stocks** across NYSE, NASDAQ, LSE, XETRA, Euronext, TSE, HKEX, SSE, Tadawul, DFM, QSE, BSE, B3, JSE, ASX
- **63 bonds**: US Treasuries, UK Gilts, German Bunds, JGBs, corporate bonds, sukuk
- **36 indices**: S&P 500, DJIA, NASDAQ, FTSE, DAX, CAC, Nikkei, HSI, SSE, Tadawul, QE, and more
- **46 currencies** with cross-rate matrix and strength calculation
- **25 commodities**: energy, metals, agriculture with price history
- **20 crypto** assets with market cap, ATH, dominance, volume
- **38 ETFs** across equity, bond, commodity, specialty categories

### Async Loading Pattern
Modules use `useState(null)` + `useEffect(() => getData().then(set), [])` + loading guard:
```jsx
const [data, setData] = useState(null);
useEffect(() => { getAllStocks().then(setData); }, []);
if (!data) return <LoadingState />;
```

### Real-time Simulation
- `subscribeToPrices(assetType, callback, intervalMs)` — price updates with random walk
- `usePriceSimulation(assetType)` hook — wraps subscribe with React lifecycle
- CSS flash animations: `.price-flash-up` / `.price-flash-down`
- Settings persisted to localStorage (`specter-sim-settings`)

## Theme & Design

- **Color scheme**: Bloomberg-inspired dark terminal (`#0a0a0a` background, `#ffbf00` amber headers, `#00d26a` green / `#ff3b3b` red for changes)
- **Font**: JetBrains Mono (primary), Consolas, SF Mono (fallbacks)
- **Font size**: 10-12px for data-dense terminal feel
- **Custom CSS classes**: `.bb-panel`, `.bb-panel-header`, `.bb-table`, `.positive`, `.negative`, `.data-dense`, `.section-header`, `.price-flash-up`, `.price-flash-down`
- **Tailwind theme colors**: `bb-black`, `bb-dark`, `bb-panel`, `bb-border`, `bb-green`, `bb-red`, `bb-amber`, `bb-blue`, `bb-cyan`, `bb-muted`, `bb-orange`, `bb-yellow`

## Code Conventions

- Functional React components only
- Tab components are self-contained with their own data imports
- All tabs lazy-loaded via React.lazy() for code splitting
- Panel component wraps all content sections with consistent styling
- Data is static/simulated (demo mode) — no external API calls
- Safe number formatting via `round()` from `src/utils/format.js` — never use `.toFixed()`
- Format utilities: `formatCurrency`, `formatPercent`, `formatChange`, `formatNumber`, `formatMcap`
- Keyboard shortcuts: 1-9 for first 9 tabs, F1-F10 for first 10, Ctrl+K for universal spotlight
- Migrated modules use async `dataProvider.js` getters; legacy modules still use direct `data/*.js` imports

## Build Optimization

- **Manual chunks**: `recharts` (449 kB), `market-data` / globalMarkets (82 kB)
- **Code splitting**: 39 tab chunks + shared utilities (Panel, ExportButton, calculations)
- **Main bundle**: ~211 kB (React + layout + routing)
- **Total gzipped**: ~67 kB main + 128 kB recharts (loaded on demand) + 23 kB market-data (lazy)

## Accessibility

- Skip-to-content link
- ARIA labels on tab buttons
- role="dialog" on spotlight overlay
- ▲/▼ arrows alongside color for change indicators
