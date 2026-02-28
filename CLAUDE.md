# SPECTER TERMINAL v3.0 — Project Instructions

## Project Overview
Build a comprehensive personal Bloomberg Terminal-style financial dashboard as a React web application. This is a personal tool for a young investor in Qatar tracking a goal of turning 100,000 QAR into 18,000,000 QAR by age 26 through investments. The terminal should look and feel like Bloomberg Terminal / Reuters Eikon — dark theme, dense data, gold accents, monospace fonts.

## Tech Stack
- **Framework**: React 18+ with Vite (NOT Next.js — keep it simple, static SPA)
- **Styling**: Tailwind CSS + custom CSS variables for the Bloomberg dark theme
- **Charts**: Recharts for all data visualization
- **State**: React hooks (useState, useEffect, useMemo) + localStorage for persistence
- **Routing**: React Router for tab navigation (or simple state-based tab switching)
- **Deployment**: Vercel (static site, no server needed)
- **Package Manager**: npm

## Design System

### Colors (Bloomberg-inspired dark theme)
```
--bg-primary: #080c14        (main background)
--bg-panel: #0f1623          (panel/card background)
--bg-panel-alt: #131b2e      (alternate panel)
--border: #1a2744            (borders, dividers)
--hover: #182038             (hover states)
--accent: #d4a843            (gold — primary accent, like Bloomberg orange)
--accent-dim: #8b7033        (muted gold)
--green: #10b981             (positive values)
--red: #ef4444               (negative values)
--blue: #3b82f6              (info, links)
--cyan: #06b6d4              (secondary accent)
--purple: #a78bfa            (tertiary)
--text: #e2e8f0              (primary text)
--text-dim: #94a3b8          (secondary text)
--text-muted: #64748b        (muted/labels)
```

### Typography
- Primary font: `'JetBrains Mono', 'Fira Code', 'Consolas', monospace`
- Base size: 11px (dense terminal feel)
- Headers: 9px uppercase with letter-spacing: 2px (like Bloomberg section headers)
- Data values: 10-11px with tabular-nums for aligned numbers

### Layout Principles
- Dense, information-rich panels (like Bloomberg's multi-panel layout)
- Minimal padding (8-12px)
- 1px borders with --border color
- No rounded corners larger than 4px
- Grid-based layouts using CSS Grid
- Scrollable tables with sticky headers
- Top ticker bar showing live index prices

## Architecture

### File Structure
```
specter-terminal/
├── public/
│   └── index.html
├── src/
│   ├── main.jsx                    # Entry point
│   ├── App.jsx                     # Main app with tab routing + command bar
│   ├── styles/
│   │   └── globals.css             # Theme variables, base styles, scrollbar styling
│   ├── data/
│   │   ├── stocks.js               # Stock database (16+ stocks with 20+ metrics each)
│   │   ├── bonds.js                # Bond database (10+ bonds including Sukuk)
│   │   ├── commodities.js          # 18+ commodities across 4 categories
│   │   ├── fx.js                   # FX pairs and rates
│   │   ├── economics.js            # Economic calendar events
│   │   ├── billionaires.js         # Billionaires database
│   │   ├── deals.js                # M&A deal tracker data
│   │   ├── stress-scenarios.js     # 10 historical + custom stress scenarios
│   │   ├── yield-curve.js          # US Treasury yield curve data
│   │   └── bloomberg-reference.js  # Bloomberg + Eikon function reference
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx          # Logo, clock, currency toggle
│   │   │   ├── TickerBar.jsx       # Scrolling index ticker (SPX, NDX, DJI, TASI, Gold, Oil, BTC)
│   │   │   ├── TabBar.jsx          # All 23 module tabs
│   │   │   └── CommandBar.jsx      # Bloomberg-style Ctrl+K command palette
│   │   ├── shared/
│   │   │   ├── MiniChart.jsx       # Reusable area chart component
│   │   │   ├── DataRow.jsx         # Label-value row for detail panels
│   │   │   ├── Badge.jsx           # Colored status badge
│   │   │   ├── StatCard.jsx        # Big number stat display
│   │   │   └── ExportButton.jsx    # CSV/Excel export utility
│   │   └── tabs/
│   │       ├── DashboardTab.jsx    # Main overview dashboard
│   │       ├── PortfolioTab.jsx    # Portfolio tracker with goal projection
│   │       ├── StockAnalysisTab.jsx # Individual stock deep-dive
│   │       ├── SearchTab.jsx       # Advanced multi-filter stock screener (EQS)
│   │       ├── PortfolioGenTab.jsx # AI-assisted portfolio construction (OPT)
│   │       ├── StressTestTab.jsx   # Scenario stress testing (PORT SCEN)
│   │       ├── CommoditiesTab.jsx  # Global commodities dashboard (GLCO)
│   │       ├── BondsTab.jsx        # Fixed income + yield curve (YAS/GC)
│   │       ├── OptionsTab.jsx      # Options strategy builder (OVME/OMON)
│   │       ├── PeerCompareTab.jsx  # Peer comparison matrix (RV/EQRV)
│   │       ├── SupplyChainTab.jsx  # Supply chain mapping (SPLC)
│   │       ├── EconCalendarTab.jsx # Economic calendar (WECO)
│   │       ├── FxMonitorTab.jsx    # FX rates + calculator (WFX/FXCA)
│   │       ├── YieldCurveTab.jsx   # Yield curve with historical 3D view (GC3D)
│   │       ├── EsgScreenTab.jsx    # ESG screening + scoring
│   │       ├── MaTrackerTab.jsx    # M&A deal tracker (MA/MARB)
│   │       ├── BacktestTab.jsx     # Strategy back-testing engine (BKTR)
│   │       ├── AlertsTab.jsx       # Custom price/event alerts (ALRT)
│   │       ├── WatchlistTab.jsx    # Enhanced watchlist with relative valuation
│   │       ├── BillionairesTab.jsx # Billionaires database (RICH)
│   │       ├── AiInsightsTab.jsx   # AI-powered market insights feed
│   │       ├── CustomFieldsTab.jsx # User-defined calculated fields (CDE/BQL)
│   │       └── ReferenceTab.jsx    # Bloomberg + Eikon command reference
│   └── utils/
│       ├── formatters.js           # Number formatting (currency, %, abbreviated)
│       ├── calculations.js         # DCF, Black-Scholes, risk metrics
│       ├── storage.js              # localStorage persistence wrapper
│       ├── exportCsv.js            # CSV export utility
│       └── chartHelpers.js         # Generate historical price data, color utils
├── package.json
├── vite.config.js
├── tailwind.config.js
├── CLAUDE.md                       # This file
└── README.md
```

## Module Specifications

### 1. Dashboard (DashboardTab)
- Top section: 3-column grid
  - S&P 500 mini area chart (90 days)
  - Sector heatmap (colored tiles showing daily % change by sector)
  - Quick stats panel (VIX, DXY, 10Y yield, Fed Funds, CPI, Oil, Gold, BTC)
- Bottom section: 2-column grid
  - Watchlist table (top 10-12 stocks with price, change%, MCap) — clicking a stock navigates to Analysis tab
  - Economic calendar preview (next 8 events with date, name, impact level, forecast)

### 2. Portfolio (PortfolioTab)
- Persistent holdings stored in localStorage
- Stats row: Portfolio value, total P&L ($ and %), number of positions, progress toward 18M QAR goal
- Holdings table: Ticker, shares, avg cost, current price, market value, P&L, P&L%, delete button
- Add position row at bottom of table (ticker input, shares, cost, add button)
- Allocation pie chart (Recharts PieChart)
- Multi-currency toggle: USD / QAR / AED (conversion rates: USD/QAR=3.64, USD/AED=3.67)
- CSV export button that downloads portfolio as spreadsheet

### 3. Stock Analysis (StockAnalysisTab)
- Left sidebar: Scrollable stock list with search filter + Shariah toggle
- Main panel when stock selected:
  - Header: Ticker, name, price, Shariah compliance badge
  - Price chart (120-day area chart)
- Bottom 3-column grid:
  - Fundamentals panel: P/E, P/B, P/S, EV/EBITDA, ROE, Margin, D/E, Div Yield, Rev Growth, Beta, EPS, MCap
  - Islamic compliance panel: Debt/Assets ratio vs 33% threshold (progress bar), Haram Revenue vs 5% threshold, pass/fail verdict, ESG scores (E, S, G, Total)
  - DCF valuation calculator: Growth rate slider (0-30%), Discount rate slider (5-20%), Terminal growth slider (1-5%), calculated intrinsic value with overvalued/undervalued verdict

### 4. Search (SearchTab) — Bloomberg EQS equivalent
- Filter bar: Text search, sector dropdown, country dropdown, P/E range (min/max), min dividend yield, Shariah-only toggle
- Results count display
- Full results table with ALL metrics: Ticker, Name, Sector, Industry, Country, Price, P/E, P/B, ROE, Div Yield, Rev Growth, Margin, Beta, MCap, ESG
- Clicking a row navigates to Stock Analysis for that ticker

### 5. Portfolio Generator (PortfolioGenTab) — Bloomberg OPT equivalent
- Left config panel:
  - Investment amount input (default $100,000)
  - Strategy selector: Balanced, Growth, Value, Income, Momentum
  - Shariah-compliant-only toggle
  - Generate button
- Right results panel:
  - Generated portfolio table: Ticker, Name, Weight%, Allocation$, Shares, P/E, Yield, Growth, Beta, ESG
  - Portfolio stats summary: Avg P/E, Avg Yield, Avg Beta, Avg ESG
  - Allocation pie chart

### 6. Stress Test (StressTestTab) — Bloomberg PORT SCEN equivalent
- Left sidebar: List of 10 scenarios (clickable, with name + short description)
  - 2008 Financial Crisis, COVID-19, Dot-Com Bust, 2022 Rate Shock, Black Monday 1987, GCC Oil Crash 2014, Stagflation 1973, Custom: Rates +300bp, Custom: Oil Shock +50%, Custom: GCC RE Boom
- Each scenario has impact percentages for: S&P 500, Bonds, Gold, Oil, Real Estate
- Top row: 5 stat cards showing scenario's asset class impacts
- Bottom grid:
  - Portfolio impact panel: Current value, estimated loss, post-stress value + bar chart of per-position losses
  - Position detail table: Each holding's current value, scenario impact%, dollar loss, post-stress value
- The stress test should apply to the user's actual portfolio from localStorage, using stock sector/beta to calculate per-position impact

### 7. Commodities (CommoditiesTab) — Bloomberg GLCO equivalent
- Category filter tabs: All, Precious Metals, Energy, Industrial, Agriculture
- Left panel: Commodity table (Name, Symbol, Price, Unit, Daily Change%, YTD%)
- Right panel: Selected commodity's 90-day price chart + stats
- Bottom: YTD performance heatmap (colored tiles for all 18 commodities)
- Include: Gold, Silver, Platinum, Palladium, WTI Crude, Brent Crude, Natural Gas, Uranium, Copper, Aluminum, Iron Ore, Lithium, Wheat, Corn, Coffee, Cotton, Sugar, Soybeans

### 8. Bonds (BondsTab) — Bloomberg YAS/GC equivalent
- Top grid:
  - US Treasury yield curve (area chart with dots at each maturity point)
  - Selected bond detail panel
- Bond screener table with type filter (All, Government, Sovereign, Corporate, Sukuk)
- Each bond: Name, Type (color-coded badge), Yield, Coupon, Price, Maturity, Rating (color-coded), Duration, Currency
- Include Islamic bonds: QNB Sukuk, DIB Sukuk, ISDB Sukuk, Aldar Sukuk
- Price sensitivity display: Show estimated price change for +/-100bp rate shock (using duration)

### 9. Options (OptionsTab) — Bloomberg OVME/OMON equivalent
- Left panel: Strategy builder
  - Ticker selector, Strategy type (Long Call, Long Put, Straddle, Bull Call Spread, Bear Put Spread)
  - Strike price slider, Premium input, Days to expiry slider, Implied volatility slider
- Center panel: Greeks display (Delta, Gamma, Theta, Vega) in big number cards + max profit/loss/breakeven summary
- Right panel: P&L payoff diagram (area chart showing profit/loss at various underlying prices)
- Use Black-Scholes approximation for Greeks calculation

### 10. Peer Comparison (PeerCompareTab) — Bloomberg RV/EQRV equivalent
- Multi-select peer group (default: AAPL, MSFT, GOOGL, NVDA, META)
- Comparison matrix table: rows = metrics (P/E, P/B, ROE, Margin, D/E, Div Yield, Rev Growth, Beta, EV/EBITDA, ESG), columns = selected stocks + Average
- Highlight best value in each row with green color
- Grouped bar chart comparing all metrics across peers

### 11. Supply Chain (SupplyChainTab) — Bloomberg SPLC equivalent
- Ticker selector dropdown
- 3-column visual flow: Suppliers → Company → Customers
  - Left column: Supplier names in styled cards
  - Center column: Selected company with name, sector, and quarterly revenue bar chart
  - Right column: Customer names in styled cards
- Each stock in the database should have `supply` (array of supplier names) and `customers` (array of customer names)

### 12. Economic Calendar (EconCalendarTab) — Bloomberg WECO equivalent
- Region filter tabs: All, US, EU, UK, CN, QA, AE, JP
- Full table: Date, Event Name, Region (badge), Impact (High=red badge, Med=orange), Previous value, Forecast value
- Include 12+ events covering:
  - US: ISM PMI, ADP Employment, Nonfarm Payrolls, CPI, FOMC Meeting
  - EU: ECB Rate Decision
  - UK: GDP, BoE Rate Decision
  - Asia: China CPI, BoJ Rate Decision
  - GCC: Qatar GDP, UAE PMI

### 13. FX Monitor (FxMonitorTab) — Bloomberg WFX/FXCA equivalent
- Left panel: FX rates table (10 pairs) with Pair, Rate, Change%, Bid, Ask
  - Must include: USD/QAR, USD/AED, EUR/USD, GBP/USD, USD/JPY, USD/CHF, AUD/USD, USD/SAR, EUR/GBP, USD/CNY
- Right panel: FX Calculator
  - Amount input, From currency dropdown, To currency dropdown
  - Big display showing converted amount
  - Show exchange rate used
  - Support currencies: USD, QAR, AED, EUR, GBP, JPY, CHF, SAR, CNY, AUD

### 14. Yield Curve 3D (YieldCurveTab) — Bloomberg GC3D equivalent
- Show 12 months of yield curve history overlaid on one chart
- Each month is a separate line, with more recent months appearing thicker/brighter
- X-axis: Maturity terms (1M, 3M, 6M, 1Y, 2Y, 3Y, 5Y, 7Y, 10Y, 20Y, 30Y)
- Y-axis: Yield percentage
- Legend showing each month
- Add slight random variation to historical curves to simulate real movement
- Note at bottom explaining that thicker/brighter = more recent

### 15. ESG Screening (EsgScreenTab)
- Minimum ESG score slider (0-90)
- Table: Ticker, Name, E score, S score, G score, Total score, Sector, Rating (AAA/AA/A/BBB/BB)
- Color-code individual E/S/G scores: ≥70 green, ≥50 yellow, <50 red
- Rating badges color-coded: AAA=green, AA=teal, A=blue, BBB+=orange

### 16. M&A Tracker (MaTrackerTab) — Bloomberg MA/MARB equivalent
- Deal table: Date, Acquirer, Target, Deal Value, Sector (badge), Premium%, Status (Completed=green, Pending=orange)
- Bar chart showing deal values
- Include 8+ deals, some GCC-relevant (Emaar, ADNOC deals)

### 17. Backtest Engine (BacktestTab) — Bloomberg BKTR equivalent
- Left config panel:
  - Ticker selector
  - Strategy: Buy & Hold, Dollar Cost Averaging (monthly $500), Momentum (buy above 20d MA, sell below)
  - Period slider (60-500 days)
- Right panel:
  - Equity curve (area chart showing portfolio value over time)
  - Starting at $10,000
  - Total return displayed prominently with dollar final value
- Generate simulated historical prices for the selected ticker

### 18. Alerts System (AlertsTab) — Bloomberg ALRT equivalent
- Create alert form: Ticker, Condition (Price Above / Price Below / Change% Above / P/E Below), Threshold value
- Active alerts table with: Ticker, Condition, Threshold, Current Value, Status (Active/Triggered), Created date, Delete button
- Persist alerts in localStorage
- Check alerts against current stock data and mark as "Triggered" if condition is met

### 19. Watchlist+ (WatchlistTab) — Enhanced watchlist with analytics
- Add/remove tickers
- Table with relative valuation metrics: Ticker, Name, Price, P/E, vs Sector Avg P/E, P/B, ROE, Div Yield, Rev Growth, Shariah status
- Highlight undervalued stocks (P/E below sector average) in green
- Persist watchlist in localStorage

### 20. Billionaires (BillionairesTab) — Bloomberg RICH equivalent
- Table: Name, Net Worth ($B), Company, Source of Wealth, YTD Change%, Country
- Sortable columns
- Include 12+ billionaires, mix of global and GCC figures:
  - Elon Musk, Bernard Arnault, Jeff Bezos, Mark Zuckerberg, Larry Ellison, Warren Buffett, Bill Gates, Mukesh Ambani
  - GCC: Prince Alwaleed bin Talal, Hussain Sajwani (DAMAC), Nassef Sawiris, Mohammed Al Amoudi
- Bar chart showing top 10 by net worth

### 21. AI Insights (AiInsightsTab) — Bloomberg KI equivalent
- Display a feed of pre-generated market insight cards, each with:
  - Timestamp, Category badge (Market, Sector, Stock, Macro, Risk), Headline, Summary paragraph
  - Sentiment indicator (Bullish/Bearish/Neutral with color)
- 10+ pre-written insight entries covering: tech earnings, oil prices, Fed policy, GCC real estate, gold, crypto, emerging markets
- Filter by category
- Note: These are static/simulated. Later, we can integrate Claude API for real AI analysis.

### 22. Custom Fields (CustomFieldsTab) — Bloomberg CDE/BQL equivalent
- Let user define calculated fields using simple formulas
- Create field form: Field Name, Formula (using variables like `pe`, `pb`, `roe`, `dy`, `de`, `mg`, `beta`, `esg`)
  - Example: "Value Score" = `(1/pe) * roe * (1-de)` 
  - Example: "Quality Score" = `roe * mg / (de + 0.1)`
- Results table showing the calculated field applied to all stocks
- Sort by the custom field value
- Persist custom fields in localStorage

### 23. Reference (ReferenceTab) — Bloomberg/Eikon function reference
- Organized by category tabs: Equity, Fixed Income, Portfolio/Risk, Options, Commodities, FX/Econ, News/Research, M&A/PE, Tools
- Each category shows a table of: Function Code, Description
- Two sections: Bloomberg Functions and Eikon/LSEG Workspace equivalents
- Searchable with a text filter

## Command Bar (Bloomberg-style — Ctrl+K)
- Fixed overlay that appears when user presses Ctrl+K (or Cmd+K on Mac)
- Text input with "SPECTER >" prompt
- Searches through: All tab names, All stock tickers and names
- Selecting a tab navigates to it; selecting a stock navigates to Analysis tab with that stock pre-loaded
- Enter selects first result, Escape closes
- Show result type label (tab / stock)

## Cross-Cutting Features

### Ticker Bar (always visible at top)
- Horizontal scrolling bar showing: SPX, NASDAQ, DOW, FTSE, TADAWUL, ABU DHABI, GOLD, OIL, BTC
- Each with price and daily % change (color-coded green/red)

### Data Persistence
- Portfolio holdings → localStorage key: `specter-portfolio`
- Watchlist → localStorage key: `specter-watchlist`
- Alerts → localStorage key: `specter-alerts`
- Custom fields → localStorage key: `specter-fields`
- User preferences (currency) → localStorage key: `specter-prefs`

### Excel/CSV Export
- Portfolio tab: Export holdings as CSV
- Search tab: Export filtered results as CSV
- Any table should have an export button where useful

### Keyboard Shortcuts
- `Ctrl+K` / `Cmd+K` — Open command bar
- `Escape` — Close command bar
- Numbers 1-9 could optionally switch between first 9 tabs

## Important Context

### Islamic Finance Requirements
- Shariah screening uses AAOIFI standards:
  - Debt-to-Assets ratio must be < 33%
  - Haram revenue (alcohol, gambling, pork, conventional interest) must be < 5% of total revenue
- Every stock in the database should have `debtToAssets` and `haramRevenue` percentage fields
- Shariah-compliant stocks should be clearly badged throughout the UI

### GCC Market Focus
- Include Saudi Aramco (2222.SR), Emaar Properties (EMAAR.AE) in stock database
- Include QAR and AED in all currency conversions
- Economic calendar should include Qatar GDP, UAE PMI events
- M&A deals should include GCC deals (ADNOC, Emaar)
- Bonds should include Islamic Sukuk instruments

### User's Investment Context
- Starting capital: 100,000 QAR
- Target: 18,000,000 QAR by age 26
- Strategy: Global equities + options + alternative assets (art, watches)
- Financing: Islamic-compliant Commodity Murabaha (Tawarruq) structure
- Real estate targets: 4 warehouses + 8 apartments at 4% ROI reinvestment
- All financing must use Islamic-compliant structures (no conventional interest)

## Stock Database Schema
Each stock should have these fields:
```javascript
{
  ticker: "AAPL",
  name: "Apple Inc.",
  sector: "Technology",
  industry: "Consumer Electronics",
  country: "US",
  price: 228.5,
  pe: 29.3,           // P/E ratio
  pb: 48.2,           // P/B ratio
  ps: 8.5,            // P/S ratio
  evEbitda: 23.1,     // EV/EBITDA
  roe: 157.4,         // Return on Equity %
  debtEquity: 0.87,   // D/E ratio
  debtToAssets: 0.32,  // For Shariah screening
  haramRevenue: 0,     // % of revenue from haram sources
  divYield: 0.44,     // Dividend yield %
  revGrowth: 5.1,     // Revenue growth %
  margin: 26.3,       // Net margin %
  mcap: 3.52e12,      // Market cap
  eps: 7.8,           // Earnings per share
  beta: 1.24,
  esgE: 72,           // Environmental score
  esgS: 68,           // Social score
  esgG: 81,           // Governance score
  esgTotal: 74,       // Overall ESG
  suppliers: ["TSMC", "Foxconn", "Samsung Display", "Broadcom"],
  customers: ["Best Buy", "Verizon", "AT&T", "Amazon"],
  quarterlyRevenue: [95.4, 90.1, 85.2, 81.8, 78.1, 73.4]  // Last 6 quarters in $B
}
```

Include 16+ stocks: AAPL, MSFT, GOOGL, AMZN, NVDA, META, JPM, TSLA, XOM, V, JNJ, BRK, UNH, AVGO, 2222.SR (Aramco), EMAAR.AE (Emaar)

## Build Order (suggested)
1. Initialize Vite + React project with Tailwind
2. Set up the theme (globals.css with CSS variables)
3. Build layout shell: Header, TickerBar, TabBar, main content area
4. Build CommandBar overlay
5. Create shared components (MiniChart, DataRow, Badge, StatCard)
6. Create data files (stocks, bonds, commodities, etc.)
7. Build utility functions (formatters, calculations, storage)
8. Build tabs one by one starting with Dashboard
9. Test navigation and data persistence
10. Deploy to Vercel

## Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# From project root
vercel

# Or connect GitHub repo to Vercel dashboard for auto-deploys
```

## Notes
- All market data is SIMULATED (static data with random historical generation). This is a personal learning/analysis tool, not connected to live feeds.
- The tool is for personal use only, not commercial.
- Keep bundle size reasonable — lazy load tabs if needed.
- Make sure scrollbars are styled dark to match the theme.
- Tables should have hover effects on rows.
- The command bar is a key UX feature — make it feel snappy and Bloomberg-like.
