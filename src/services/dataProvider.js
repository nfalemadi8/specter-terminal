// dataProvider.js — API abstraction layer for Specter Terminal
// All components import from here. Swap this file to switch to live data.

let _data = null;

async function getData() {
  if (!_data) {
    _data = await import('../data/globalMarkets.js');
  }
  return _data;
}

// Synchronous cache for after initial load
let _cache = null;

export async function initData() {
  _cache = await getData();
  return _cache;
}

function getCache() {
  return _cache;
}

// ========= SIMULATED PRICE MOVEMENT =========
function jitter(price, volatility = 0.002) {
  return Math.round(price * (1 + (Math.random() - 0.5) * volatility) * 100) / 100;
}

// ========= EXCHANGE FUNCTIONS =========
export async function getExchanges() {
  const d = await getData();
  return Object.entries(d.EXCHANGES).map(([key, ex]) => ({
    ...ex, id: key, status: d.getExchangeStatus(key),
  }));
}

export async function getExchangeStatus(exchangeKey) {
  const d = await getData();
  return d.getExchangeStatus(exchangeKey);
}

// ========= STOCK FUNCTIONS =========
export async function getStockQuote(ticker) {
  const d = await getData();
  const stock = d.STOCKS.find(s => s.ticker === ticker);
  if (!stock) return null;
  return { ...stock, price: jitter(stock.price, 0.003) };
}

export async function searchStocks(query, filters = {}) {
  const d = await getData();
  let results = [...d.STOCKS];
  if (query) {
    const q = query.toLowerCase();
    results = results.filter(s =>
      s.ticker.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q)
    );
  }
  if (filters.exchange) results = results.filter(s => s.exchange === filters.exchange);
  if (filters.country) results = results.filter(s => s.country === filters.country);
  if (filters.sector) results = results.filter(s => s.sector === filters.sector);
  if (filters.minMarketCap) results = results.filter(s => s.marketCap >= filters.minMarketCap);
  if (filters.maxPe) results = results.filter(s => s.pe > 0 && s.pe <= filters.maxPe);
  if (filters.divYieldMin) results = results.filter(s => s.divYield >= filters.divYieldMin);
  if (filters.shariahOnly) results = results.filter(s => s.shariahCompliant);
  if (filters.esgMin) results = results.filter(s => s.esgScore >= filters.esgMin);
  return results;
}

export async function getStocksByExchange(exchangeCode) {
  const d = await getData();
  return d.STOCKS.filter(s => s.exchange === exchangeCode);
}

export async function getStocksByCountry(countryCode) {
  const d = await getData();
  return d.STOCKS.filter(s => s.country === countryCode);
}

export async function getStocksBySector(sector) {
  const d = await getData();
  return d.STOCKS.filter(s => s.sector === sector);
}

export async function getTopMovers(n = 10) {
  const d = await getData();
  const sorted = [...d.STOCKS].sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
  const gainers = sorted.filter(s => s.changePercent > 0).slice(0, n);
  const losers = sorted.filter(s => s.changePercent < 0).slice(0, n);
  return { gainers, losers };
}

export async function getAllStocks() {
  const d = await getData();
  return d.STOCKS;
}

// ========= BOND FUNCTIONS =========
export async function getBonds(type = 'all') {
  const d = await getData();
  if (type === 'all') return d.BONDS;
  return d.BONDS.filter(b => b.type === type);
}

export async function getBondsByCountry(country) {
  const d = await getData();
  return d.BONDS.filter(b => b.country === country);
}

export async function getYieldCurve(country) {
  const d = await getData();
  return d.getYieldCurveData(country);
}

export async function getSukuk() {
  const d = await getData();
  return d.BONDS.filter(b => b.type === 'sukuk');
}

export async function getBondsByRating(minRating) {
  const d = await getData();
  const ratingOrder = ['AAA', 'AA+', 'AA', 'AA-', 'A+', 'A', 'A-', 'BBB+', 'BBB', 'BBB-', 'BB+', 'BB', 'BB-', 'B+', 'B', 'B-', 'CCC'];
  const minIdx = ratingOrder.indexOf(minRating);
  if (minIdx === -1) return d.BONDS;
  return d.BONDS.filter(b => {
    const idx = ratingOrder.indexOf(b.rating);
    return idx !== -1 && idx <= minIdx;
  });
}

// ========= INDEX FUNCTIONS =========
export async function getIndices(region = 'all') {
  const d = await getData();
  if (region === 'all') return d.INDICES;
  const regionMap = {
    us: ['US'],
    europe: ['GB', 'DE', 'FR', 'EU', 'CH', 'ES', 'IT'],
    asia: ['JP', 'HK', 'CN', 'KR', 'TW', 'SG', 'AU', 'IN', 'TH', 'ID'],
    gcc: ['SA', 'AE', 'QA', 'KW', 'OM', 'BH'],
    latam: ['BR', 'MX', 'AR'],
    africa: ['ZA', 'NG'],
  };
  const countries = regionMap[region] || [];
  return d.INDICES.filter(i => countries.includes(i.co));
}

export async function getIndexDetail(id) {
  const d = await getData();
  return d.INDICES.find(i => i.id === id) || null;
}

// ========= FOREX FUNCTIONS =========
export async function getCurrencyRates() {
  const d = await getData();
  return d.CURRENCIES;
}

export async function doConvertCurrency(amount, from, to) {
  const d = await getData();
  return d.convertCurrency(amount, from, to);
}

export async function getCrossRateMatrix(currencies) {
  const d = await getData();
  const matrix = {};
  for (const from of currencies) {
    matrix[from] = {};
    for (const to of currencies) {
      matrix[from][to] = from === to ? 1 : Math.round(d.convertCurrency(1, from, to) * 10000) / 10000;
    }
  }
  return matrix;
}

export async function getCurrencyStrength() {
  const d = await getData();
  const base = ['EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'NZD', 'QAR', 'SAR', 'AED'];
  return base.map(c => ({
    currency: c,
    name: d.CURRENCIES[c]?.name,
    strength: Math.round((1 / d.CURRENCIES[c].rate + (Math.random() - 0.5) * 0.1) * 100) / 100,
  })).sort((a, b) => b.strength - a.strength);
}

// ========= COMMODITY FUNCTIONS =========
export async function getCommodities(category = 'all') {
  const d = await getData();
  if (category === 'all') return d.COMMODITIES;
  return d.COMMODITIES.filter(c => c.cat === category);
}

// ========= CRYPTO FUNCTIONS =========
export async function getCrypto() {
  const d = await getData();
  return d.CRYPTO;
}

export async function getCryptoQuote(id) {
  const d = await getData();
  const c = d.CRYPTO.find(cr => cr.id === id);
  if (!c) return null;
  return { ...c, pr: jitter(c.pr, 0.01) };
}

// ========= ETF FUNCTIONS =========
export async function getETFs(category = 'all') {
  const d = await getData();
  if (category === 'all') return d.ETFS;
  return d.ETFS.filter(e => e.cat === category);
}

export async function getETFDetail(ticker) {
  const d = await getData();
  return d.ETFS.find(e => e.t === ticker) || null;
}

// ========= PORTFOLIO FUNCTIONS =========
export async function calculatePortfolioValue(positions, displayCurrency = 'USD') {
  const d = await getData();
  let totalValue = 0;
  let totalCost = 0;
  const detailed = positions.map(pos => {
    let currentPrice = pos.currentPrice || 0;
    // Look up current price from data
    const stock = d.STOCKS.find(s => s.ticker === pos.ticker);
    const bond = d.BONDS.find(b => b.id === pos.ticker);
    const etf = d.ETFS.find(e => e.t === pos.ticker);
    const crypto = d.CRYPTO.find(c => c.id === pos.ticker);
    const commodity = d.COMMODITIES.find(c => c.id === pos.ticker);
    if (stock) currentPrice = stock.price;
    else if (bond) currentPrice = bond.price;
    else if (etf) currentPrice = etf.pr;
    else if (crypto) currentPrice = crypto.pr;
    else if (commodity) currentPrice = commodity.pr;

    const positionCurrency = pos.currency || 'USD';
    const marketValue = currentPrice * (pos.quantity || 0);
    const marketValueDisplay = d.convertCurrency(marketValue, positionCurrency, displayCurrency);
    const costBasis = (pos.avgCost || 0) * (pos.quantity || 0);
    const costBasisDisplay = d.convertCurrency(costBasis, positionCurrency, displayCurrency);
    const pnl = marketValueDisplay - costBasisDisplay;
    const pnlPct = costBasisDisplay > 0 ? (pnl / costBasisDisplay) * 100 : 0;

    totalValue += marketValueDisplay;
    totalCost += costBasisDisplay;

    return {
      ...pos, currentPrice, marketValue: marketValueDisplay,
      costBasis: costBasisDisplay,
      unrealizedPnl: Math.round(pnl * 100) / 100,
      unrealizedPnlPercent: Math.round(pnlPct * 100) / 100,
    };
  });

  // Calculate weights
  detailed.forEach(p => {
    p.weight = totalValue > 0 ? Math.round((p.marketValue / totalValue) * 10000) / 100 : 0;
  });

  return {
    positions: detailed,
    totalValue: Math.round(totalValue * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    totalPnl: Math.round((totalValue - totalCost) * 100) / 100,
    totalPnlPercent: totalCost > 0 ? Math.round(((totalValue - totalCost) / totalCost) * 10000) / 100 : 0,
    displayCurrency,
  };
}

export async function calculatePortfolioRisk(positions) {
  // Simulated risk metrics
  const n = positions.length;
  return {
    beta: Math.round((0.8 + Math.random() * 0.6) * 100) / 100,
    volatility: Math.round((12 + Math.random() * 10) * 100) / 100,
    sharpe: Math.round((0.5 + Math.random() * 1.5) * 100) / 100,
    maxDrawdown: Math.round((-5 - Math.random() * 25) * 100) / 100,
    diversificationScore: Math.min(100, Math.round(n * 8 + Math.random() * 20)),
  };
}

export async function calculateCorrelationMatrix(tickers) {
  const n = tickers.length;
  const matrix = {};
  for (let i = 0; i < n; i++) {
    matrix[tickers[i]] = {};
    for (let j = 0; j < n; j++) {
      if (i === j) matrix[tickers[i]][tickers[j]] = 1;
      else if (matrix[tickers[j]]?.[tickers[i]] !== undefined) {
        matrix[tickers[i]][tickers[j]] = matrix[tickers[j]][tickers[i]];
      } else {
        matrix[tickers[i]][tickers[j]] = Math.round((Math.random() * 1.6 - 0.3) * 100) / 100;
      }
    }
  }
  return matrix;
}

// ========= SIMULATION =========
const _subscribers = new Map();
let _subId = 0;

export function subscribeToPrices(assetType, callback, intervalMs = 5000) {
  const id = ++_subId;
  const timer = setInterval(async () => {
    const d = await getData();
    let items;
    switch (assetType) {
      case 'stocks': items = d.STOCKS.map(s => ({ ticker: s.ticker, price: jitter(s.price, 0.003), prev: s.price })); break;
      case 'bonds': items = d.BONDS.map(b => ({ id: b.id, yield: Math.round((b.yield + (Math.random() - 0.5) * 0.05) * 1000) / 1000, prev: b.yield })); break;
      case 'crypto': items = d.CRYPTO.map(c => ({ id: c.id, price: jitter(c.pr, 0.015), prev: c.pr })); break;
      case 'commodities': items = d.COMMODITIES.map(c => ({ id: c.id, price: jitter(c.pr, 0.005), prev: c.pr })); break;
      case 'forex': items = Object.entries(d.CURRENCIES).map(([k, v]) => ({ currency: k, rate: jitter(v.rate, 0.0005), prev: v.rate })); break;
      default: items = [];
    }
    callback(items);
  }, intervalMs);

  _subscribers.set(id, timer);
  return () => {
    clearInterval(_subscribers.get(id));
    _subscribers.delete(id);
  };
}

// ========= UNIVERSAL SEARCH =========
export async function universalSearch(query) {
  if (!query || query.length < 1) return [];
  const d = await getData();
  const q = query.toLowerCase();
  const results = [];

  // Stocks
  d.STOCKS.forEach(s => {
    if (s.ticker.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)) {
      results.push({ type: 'stock', id: s.ticker, name: s.name, detail: `${s.exchange} · ${s.currency} ${s.price}`, data: s });
    }
  });

  // Bonds
  d.BONDS.forEach(b => {
    if (b.id.toLowerCase().includes(q) || b.name.toLowerCase().includes(q)) {
      results.push({ type: 'bond', id: b.id, name: b.name, detail: `${b.rating} · ${b.yield}%`, data: b });
    }
  });

  // ETFs
  d.ETFS.forEach(e => {
    if (e.t.toLowerCase().includes(q) || e.n.toLowerCase().includes(q)) {
      results.push({ type: 'etf', id: e.t, name: e.n, detail: `${e.cat} · $${e.pr}`, data: e });
    }
  });

  // Crypto
  d.CRYPTO.forEach(c => {
    if (c.id.toLowerCase().includes(q) || c.n.toLowerCase().includes(q)) {
      results.push({ type: 'crypto', id: c.id, name: c.n, detail: `$${c.pr.toLocaleString()}`, data: c });
    }
  });

  // Indices
  d.INDICES.forEach(i => {
    if (i.id.toLowerCase().includes(q) || i.n.toLowerCase().includes(q)) {
      results.push({ type: 'index', id: i.id, name: i.n, detail: `${i.val.toLocaleString()}`, data: i });
    }
  });

  // Currencies
  Object.entries(d.CURRENCIES).forEach(([k, v]) => {
    if (k.toLowerCase().includes(q) || v.name.toLowerCase().includes(q)) {
      results.push({ type: 'currency', id: k, name: v.name, detail: `${v.symbol} · Rate: ${v.rate}`, data: v });
    }
  });

  // Commodities
  d.COMMODITIES.forEach(c => {
    if (c.id.toLowerCase().includes(q) || c.n.toLowerCase().includes(q)) {
      results.push({ type: 'commodity', id: c.id, name: c.n, detail: `$${c.pr}/${c.unit}`, data: c });
    }
  });

  return results.slice(0, 25);
}
