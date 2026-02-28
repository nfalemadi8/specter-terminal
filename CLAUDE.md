# CLAUDE.md — Specter Terminal v3.0

## Project Overview

Specter Terminal is a personal Bloomberg Terminal-style financial dashboard built with React. It features 23 interactive modules covering equities, fixed income, commodities, forex, crypto, options, futures, ETFs, economic data, news, portfolio management, and more — all rendered in a dark terminal theme with monospace fonts and amber/green Bloomberg-style coloring.

## Tech Stack

- **Framework**: React 19 (Vite 7)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite` plugin)
- **Charts**: Recharts
- **Utilities**: Lodash
- **Routing**: react-router-dom (available, tab switching via state)

## Build & Run

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Production build to dist/
npm run preview      # Preview production build
```

## Project Structure

```
src/
├── main.jsx                     # Entry point
├── App.jsx                      # Root component with tab routing
├── index.css                    # Tailwind imports + Bloomberg theme
├── components/
│   ├── layout/
│   │   ├── Header.jsx           # Top bar with clock and live indicator
│   │   ├── TickerBar.jsx        # Scrolling market ticker
│   │   ├── TabBar.jsx           # 23-tab navigation bar
│   │   ├── CommandBar.jsx       # Bottom command input
│   │   └── Panel.jsx            # Reusable panel container
│   └── tabs/
│       ├── Dashboard.jsx        # Main overview (indices, movers, news, etc.)
│       ├── Equities.jsx         # Stock screener with detail chart
│       ├── FixedIncome.jsx      # Treasury yield curve + corporate bonds
│       ├── Commodities.jsx      # Commodity prices with charts
│       ├── Forex.jsx            # FX pairs table
│       ├── Crypto.jsx           # Cryptocurrency market
│       ├── Indices.jsx          # US and global indices
│       ├── Options.jsx          # Options chain (calls/puts)
│       ├── Futures.jsx          # Futures contracts
│       ├── ETFs.jsx             # ETF listings
│       ├── News.jsx             # Filterable news feed
│       ├── Economic.jsx         # Economic indicators + calendar
│       ├── Earnings.jsx         # Earnings calendar
│       ├── Portfolio.jsx        # Portfolio holdings + P&L
│       ├── Watchlist.jsx        # Watchlist + price alerts
│       ├── Screener.jsx         # Sortable/filterable stock screener
│       ├── Technicals.jsx       # Technical analysis (RSI, SMA, levels)
│       ├── Fundamentals.jsx     # Fundamental data (valuation, financials)
│       ├── Sectors.jsx          # Sector performance analysis
│       ├── HeatMap.jsx          # Market cap heat map
│       ├── Alerts.jsx           # Active alerts + history
│       ├── IPOs.jsx             # Upcoming and recent IPOs
│       └── Settings.jsx         # System info and shortcuts
├── data/
│   ├── stocks.js                # Stock data, indices, sectors, price generator
│   ├── bonds.js                 # Treasury + corporate bond data
│   ├── commodities.js           # Commodity prices + history generator
│   ├── forex.js                 # FX pairs + crypto pairs
│   ├── economic.js              # Economic indicators, calendar, earnings, fed rate
│   ├── news.js                  # News items + watchlist alerts
│   ├── portfolio.js             # Holdings, metrics calculator, history
│   └── tabs.js                  # Tab definitions (23 tabs)
└── utils/
    └── format.js                # Number, currency, percent formatting utilities
```

## Theme & Design

- **Color scheme**: Bloomberg-inspired dark terminal (`#0a0a0a` background, `#ffbf00` amber headers, `#00d26a` green / `#ff3b3b` red for changes)
- **Font**: Monospace (Consolas, SF Mono, Fira Code)
- **Font size**: 10-12px for data-dense terminal feel
- **Custom CSS classes**: `.bb-panel`, `.bb-panel-header`, `.bb-table`, `.positive`, `.negative`
- **Tailwind theme colors**: `bb-black`, `bb-dark`, `bb-panel`, `bb-border`, `bb-green`, `bb-red`, `bb-amber`, `bb-blue`, `bb-cyan`, `bb-muted`, etc.

## Code Conventions

- Functional React components only
- Tab components are self-contained with their own data imports
- Panel component wraps all content sections with consistent styling
- Data is static/simulated (demo mode) — no external API calls
- Format utilities in `src/utils/format.js` for consistent number display
