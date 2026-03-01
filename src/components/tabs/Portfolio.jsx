import { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Panel from '../layout/Panel';
import { formatNumber, formatPercent, colorClass, round } from '../../utils/format';
import { loadData, saveData } from '../../utils/storage';
import { exportToCSV } from '../../utils/exportCsv';

const STORAGE_KEY = 'specter-portfolios';
const COLORS = ['#ffbf00', '#00d26a', '#4a9eff', '#ff3b3b', '#ff8c00', '#00e5ff', '#ffd700', '#a855f7', '#f472b6', '#34d399'];
const CURRENCIES = ['USD', 'QAR', 'AED', 'SAR', 'EUR', 'GBP', 'JPY', 'CHF'];
const ASSET_TYPES = ['stock', 'bond', 'etf', 'crypto', 'commodity', 'sukuk'];
const SUB_TABS = ['All', 'Equities', 'Fixed Income', 'ETFs', 'Crypto', 'Commodities'];

const CHART_TOOLTIP = {
  contentStyle: { background: '#1a1a1a', border: '1px solid #2a2a2a', fontSize: '10px', fontFamily: 'monospace' },
  labelStyle: { color: '#ffbf00', fontSize: '10px' },
};

const TEMPLATES = [
  { name: 'GCC Balanced', positions: [
    { ticker: '2222.SR', assetType: 'stock', quantity: 500, avgCost: 30.50, currency: 'SAR' },
    { ticker: 'QNB.QA', assetType: 'stock', quantity: 300, avgCost: 15.20, currency: 'QAR' },
    { ticker: 'FAB.AE', assetType: 'stock', quantity: 400, avgCost: 12.50, currency: 'AED' },
    { ticker: 'EMAAR.AE', assetType: 'stock', quantity: 600, avgCost: 7.80, currency: 'AED' },
    { ticker: 'KSA-SUKUK-10', assetType: 'sukuk', quantity: 50, avgCost: 97.00, currency: 'USD' },
    { ticker: 'GC', assetType: 'commodity', quantity: 2, avgCost: 1980.00, currency: 'USD' },
  ]},
  { name: 'Global Growth', positions: [
    { ticker: 'AAPL', assetType: 'stock', quantity: 50, avgCost: 175.00, currency: 'USD' },
    { ticker: 'MSFT', assetType: 'stock', quantity: 30, avgCost: 380.00, currency: 'USD' },
    { ticker: 'NVDA', assetType: 'stock', quantity: 20, avgCost: 750.00, currency: 'USD' },
    { ticker: 'TSLA', assetType: 'stock', quantity: 25, avgCost: 220.00, currency: 'USD' },
    { ticker: 'QQQ', assetType: 'etf', quantity: 40, avgCost: 400.00, currency: 'USD' },
    { ticker: 'BTC', assetType: 'crypto', quantity: 0.5, avgCost: 42000.00, currency: 'USD' },
  ]},
  { name: 'Income & Bonds', positions: [
    { ticker: 'UST-10Y', assetType: 'bond', quantity: 100, avgCost: 98.50, currency: 'USD' },
    { ticker: 'BND', assetType: 'etf', quantity: 200, avgCost: 70.00, currency: 'USD' },
    { ticker: 'TLT', assetType: 'etf', quantity: 100, avgCost: 92.00, currency: 'USD' },
    { ticker: 'LQD', assetType: 'etf', quantity: 80, avgCost: 105.00, currency: 'USD' },
    { ticker: 'HYG', assetType: 'etf', quantity: 100, avgCost: 76.00, currency: 'USD' },
    { ticker: 'KSA-SUKUK-10', assetType: 'sukuk', quantity: 50, avgCost: 95.00, currency: 'USD' },
  ]},
  { name: 'Islamic Portfolio', positions: [
    { ticker: '2222.SR', assetType: 'stock', quantity: 300, avgCost: 31.00, currency: 'SAR' },
    { ticker: '1120.SR', assetType: 'stock', quantity: 200, avgCost: 82.00, currency: 'SAR' },
    { ticker: 'AAPL', assetType: 'stock', quantity: 30, avgCost: 170.00, currency: 'USD' },
    { ticker: 'MSFT', assetType: 'stock', quantity: 20, avgCost: 370.00, currency: 'USD' },
    { ticker: 'HLAL', assetType: 'etf', quantity: 100, avgCost: 38.00, currency: 'USD' },
    { ticker: 'KSA-SUKUK-10', assetType: 'sukuk', quantity: 80, avgCost: 96.00, currency: 'USD' },
    { ticker: 'QAT-SUKUK-5', assetType: 'sukuk', quantity: 60, avgCost: 97.50, currency: 'USD' },
    { ticker: 'GC', assetType: 'commodity', quantity: 3, avgCost: 1950.00, currency: 'USD' },
  ]},
  { name: 'All Weather', positions: [
    { ticker: 'SPY', assetType: 'etf', quantity: 60, avgCost: 480.00, currency: 'USD' },
    { ticker: 'TLT', assetType: 'etf', quantity: 100, avgCost: 90.00, currency: 'USD' },
    { ticker: 'GLD', assetType: 'etf', quantity: 40, avgCost: 180.00, currency: 'USD' },
    { ticker: 'DBC', assetType: 'etf', quantity: 60, avgCost: 22.00, currency: 'USD' },
    { ticker: 'IWM', assetType: 'etf', quantity: 30, avgCost: 195.00, currency: 'USD' },
  ]},
  { name: 'Emerging Markets', positions: [
    { ticker: 'EEM', assetType: 'etf', quantity: 200, avgCost: 40.00, currency: 'USD' },
    { ticker: 'RELIANCE.NS', assetType: 'stock', quantity: 50, avgCost: 2300.00, currency: 'INR' },
    { ticker: 'VALE3.SA', assetType: 'stock', quantity: 100, avgCost: 62.00, currency: 'BRL' },
    { ticker: '2222.SR', assetType: 'stock', quantity: 200, avgCost: 29.50, currency: 'SAR' },
    { ticker: 'IDN-SUKUK', assetType: 'sukuk', quantity: 40, avgCost: 98.00, currency: 'USD' },
  ]},
  { name: 'Tech Titans', positions: [
    { ticker: 'AAPL', assetType: 'stock', quantity: 40, avgCost: 165.00, currency: 'USD' },
    { ticker: 'MSFT', assetType: 'stock', quantity: 25, avgCost: 360.00, currency: 'USD' },
    { ticker: 'GOOGL', assetType: 'stock', quantity: 60, avgCost: 140.00, currency: 'USD' },
    { ticker: 'NVDA', assetType: 'stock', quantity: 15, avgCost: 700.00, currency: 'USD' },
    { ticker: 'META', assetType: 'stock', quantity: 20, avgCost: 450.00, currency: 'USD' },
    { ticker: 'AMZN', assetType: 'stock', quantity: 30, avgCost: 170.00, currency: 'USD' },
    { ticker: 'TSLA', assetType: 'stock', quantity: 20, avgCost: 210.00, currency: 'USD' },
    { ticker: 'AMD', assetType: 'stock', quantity: 40, avgCost: 145.00, currency: 'USD' },
    { ticker: 'CRM', assetType: 'stock', quantity: 25, avgCost: 250.00, currency: 'USD' },
    { ticker: 'AVGO', assetType: 'stock', quantity: 8, avgCost: 1200.00, currency: 'USD' },
  ]},
  { name: 'Dividend Kings', positions: [
    { ticker: 'KO', assetType: 'stock', quantity: 100, avgCost: 55.00, currency: 'USD' },
    { ticker: 'PEP', assetType: 'stock', quantity: 50, avgCost: 160.00, currency: 'USD' },
    { ticker: 'JNJ', assetType: 'stock', quantity: 60, avgCost: 150.00, currency: 'USD' },
    { ticker: 'PG', assetType: 'stock', quantity: 50, avgCost: 148.00, currency: 'USD' },
    { ticker: 'MCD', assetType: 'stock', quantity: 30, avgCost: 270.00, currency: 'USD' },
    { ticker: 'ABBV', assetType: 'stock', quantity: 40, avgCost: 160.00, currency: 'USD' },
    { ticker: 'HYG', assetType: 'etf', quantity: 100, avgCost: 75.00, currency: 'USD' },
  ]},
];

// Lookup price from global data (sync, using preloaded cache)
let _dataCache = null;

function lookupPrice(ticker, assetType) {
  if (!_dataCache) return 0;
  if (assetType === 'stock') {
    const s = _dataCache.STOCKS.find(s => s.ticker === ticker);
    return s ? s.price : 0;
  }
  if (assetType === 'bond' || assetType === 'sukuk') {
    const b = _dataCache.BONDS.find(b => b.id === ticker);
    return b ? b.price : 0;
  }
  if (assetType === 'etf') {
    const e = _dataCache.ETFS.find(e => e.t === ticker);
    return e ? e.pr : 0;
  }
  if (assetType === 'crypto') {
    const c = _dataCache.CRYPTO.find(c => c.id === ticker);
    return c ? c.pr : 0;
  }
  if (assetType === 'commodity') {
    const c = _dataCache.COMMODITIES.find(c => c.id === ticker);
    return c ? c.pr : 0;
  }
  return 0;
}

function lookupMeta(ticker, assetType) {
  if (!_dataCache) return {};
  if (assetType === 'stock') {
    const s = _dataCache.STOCKS.find(s => s.ticker === ticker);
    return s ? { name: s.name, exchange: s.exchange, sector: s.sector, country: s.country, currency: s.currency } : {};
  }
  if (assetType === 'bond' || assetType === 'sukuk') {
    const b = _dataCache.BONDS.find(b => b.id === ticker);
    return b ? { name: b.name, country: b.country, currency: b.currency, sector: 'Fixed Income' } : {};
  }
  if (assetType === 'etf') {
    const e = _dataCache.ETFS.find(e => e.t === ticker);
    return e ? { name: e.n, sector: e.cat, currency: 'USD' } : {};
  }
  if (assetType === 'crypto') {
    const c = _dataCache.CRYPTO.find(c => c.id === ticker);
    return c ? { name: c.n, sector: 'Crypto', currency: 'USD' } : {};
  }
  if (assetType === 'commodity') {
    const c = _dataCache.COMMODITIES.find(c => c.id === ticker);
    return c ? { name: c.n, sector: 'Commodities', currency: 'USD' } : {};
  }
  return {};
}

function convertCur(amount, from, to) {
  if (!_dataCache || from === to) return amount;
  return _dataCache.convertCurrency(amount, from, to);
}

function Portfolio() {
  const [portfolios, setPortfolios] = useState(() => {
    const saved = loadData(STORAGE_KEY);
    return saved || [{ id: 'default', name: 'My Portfolio', description: '', positions: [], createdDate: new Date().toISOString() }];
  });
  const [activePortfolioId, setActivePortfolioId] = useState(() => portfolios[0]?.id || 'default');
  const [currency, setCurrency] = useState('USD');
  const [subTab, setSubTab] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addStep, setAddStep] = useState(0);
  const [addType, setAddType] = useState('stock');
  const [addSearch, setAddSearch] = useState('');
  const [addTicker, setAddTicker] = useState('');
  const [addQty, setAddQty] = useState('');
  const [addCost, setAddCost] = useState('');
  const [sortCol, setSortCol] = useState('weight');
  const [sortDir, setSortDir] = useState(-1);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load global data
  useEffect(() => {
    import('../../data/globalMarkets.js').then(m => {
      _dataCache = m;
      setDataLoaded(true);
    });
  }, []);

  // Persist
  useEffect(() => {
    saveData(STORAGE_KEY, portfolios);
  }, [portfolios]);

  const activePortfolio = portfolios.find(p => p.id === activePortfolioId) || portfolios[0];
  const positions = activePortfolio?.positions || [];

  // Calculate portfolio metrics
  const metrics = useMemo(() => {
    if (!dataLoaded || !positions.length) return { positions: [], totalValue: 0, totalCost: 0, totalPnl: 0, totalPnlPct: 0 };
    let totalValue = 0, totalCost = 0;
    const detailed = positions.map(pos => {
      const price = lookupPrice(pos.ticker, pos.assetType);
      const meta = lookupMeta(pos.ticker, pos.assetType);
      const posCur = pos.currency || 'USD';
      const mv = price * pos.quantity;
      const mvDisplay = convertCur(mv, posCur, currency);
      const cb = pos.avgCost * pos.quantity;
      const cbDisplay = convertCur(cb, posCur, currency);
      const pnl = mvDisplay - cbDisplay;
      const pnlPct = cbDisplay > 0 ? (pnl / cbDisplay) * 100 : 0;
      totalValue += mvDisplay;
      totalCost += cbDisplay;
      return { ...pos, ...meta, currentPrice: price, marketValue: round(mvDisplay, 2), costBasis: round(cbDisplay, 2), pnl: round(pnl, 2), pnlPct: round(pnlPct, 2), weight: 0 };
    });
    detailed.forEach(p => { p.weight = totalValue > 0 ? round((p.marketValue / totalValue) * 100, 2) : 0; });
    return {
      positions: detailed,
      totalValue: round(totalValue, 2),
      totalCost: round(totalCost, 2),
      totalPnl: round(totalValue - totalCost, 2),
      totalPnlPct: totalCost > 0 ? round(((totalValue - totalCost) / totalCost) * 100, 2) : 0,
    };
  }, [positions, currency, dataLoaded]);

  // Filter by sub-tab
  const filtered = useMemo(() => {
    let items = metrics.positions;
    if (subTab === 'Equities') items = items.filter(p => p.assetType === 'stock');
    else if (subTab === 'Fixed Income') items = items.filter(p => p.assetType === 'bond' || p.assetType === 'sukuk');
    else if (subTab === 'ETFs') items = items.filter(p => p.assetType === 'etf');
    else if (subTab === 'Crypto') items = items.filter(p => p.assetType === 'crypto');
    else if (subTab === 'Commodities') items = items.filter(p => p.assetType === 'commodity');
    // Sort
    return [...items].sort((a, b) => {
      const av = a[sortCol] || 0, bv = b[sortCol] || 0;
      return typeof av === 'string' ? av.localeCompare(bv) * sortDir : (av - bv) * sortDir;
    });
  }, [metrics.positions, subTab, sortCol, sortDir]);

  // Allocation data
  const allocByType = useMemo(() => {
    const map = {};
    metrics.positions.forEach(p => {
      const t = p.assetType === 'sukuk' ? 'Fixed Income' : p.assetType === 'stock' ? 'Equities' : p.assetType === 'etf' ? 'ETFs' : p.assetType === 'crypto' ? 'Crypto' : p.assetType === 'commodity' ? 'Commodities' : p.assetType;
      map[t] = (map[t] || 0) + p.marketValue;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value: round(value, 2) }));
  }, [metrics.positions]);

  const allocBySector = useMemo(() => {
    const map = {};
    metrics.positions.forEach(p => { const s = p.sector || 'Other'; map[s] = (map[s] || 0) + p.marketValue; });
    return Object.entries(map).map(([name, value]) => ({ name, value: round(value, 2) })).sort((a, b) => b.value - a.value).slice(0, 8);
  }, [metrics.positions]);

  const allocByCountry = useMemo(() => {
    const map = {};
    metrics.positions.forEach(p => { const c = p.country || 'N/A'; map[c] = (map[c] || 0) + p.marketValue; });
    return Object.entries(map).map(([name, value]) => ({ name, value: round(value, 2) })).sort((a, b) => b.value - a.value).slice(0, 8);
  }, [metrics.positions]);

  // Shariah compliance %
  const shariahPct = useMemo(() => {
    if (!dataLoaded || metrics.totalValue === 0) return 0;
    const compliantValue = metrics.positions.filter(p => {
      if (p.assetType === 'sukuk' || p.assetType === 'commodity') return true;
      if (p.assetType === 'stock') {
        const s = _dataCache?.STOCKS.find(s => s.ticker === p.ticker);
        return s?.shariahCompliant || false;
      }
      return false;
    }).reduce((sum, p) => sum + p.marketValue, 0);
    return round((compliantValue / metrics.totalValue) * 100, 1);
  }, [metrics, dataLoaded]);

  // Search results for add modal
  const searchResults = useMemo(() => {
    if (!dataLoaded || !addSearch) return [];
    const q = addSearch.toLowerCase();
    let items = [];
    if (addType === 'stock') items = _dataCache.STOCKS.filter(s => s.ticker.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)).slice(0, 10).map(s => ({ id: s.ticker, name: s.name, price: s.price, currency: s.currency }));
    else if (addType === 'bond') items = _dataCache.BONDS.filter(b => b.type !== 'sukuk' && (b.id.toLowerCase().includes(q) || b.name.toLowerCase().includes(q))).slice(0, 10).map(b => ({ id: b.id, name: b.name, price: b.price, currency: b.currency }));
    else if (addType === 'sukuk') items = _dataCache.BONDS.filter(b => b.type === 'sukuk' && (b.id.toLowerCase().includes(q) || b.name.toLowerCase().includes(q))).slice(0, 10).map(b => ({ id: b.id, name: b.name, price: b.price, currency: b.currency }));
    else if (addType === 'etf') items = _dataCache.ETFS.filter(e => e.t.toLowerCase().includes(q) || e.n.toLowerCase().includes(q)).slice(0, 10).map(e => ({ id: e.t, name: e.n, price: e.pr, currency: 'USD' }));
    else if (addType === 'crypto') items = _dataCache.CRYPTO.filter(c => c.id.toLowerCase().includes(q) || c.n.toLowerCase().includes(q)).slice(0, 10).map(c => ({ id: c.id, name: c.n, price: c.pr, currency: 'USD' }));
    else if (addType === 'commodity') items = _dataCache.COMMODITIES.filter(c => c.id.toLowerCase().includes(q) || c.n.toLowerCase().includes(q)).slice(0, 10).map(c => ({ id: c.id, name: c.n, price: c.pr, currency: 'USD' }));
    return items;
  }, [addSearch, addType, dataLoaded]);

  const handleSort = useCallback((col) => {
    setSortCol(prev => prev === col ? col : col);
    setSortDir(prev => sortCol === col ? -prev : -1);
  }, [sortCol]);

  const addPosition = () => {
    if (!addTicker || !addQty) return;
    const meta = lookupMeta(addTicker, addType);
    const newPos = {
      id: Date.now().toString(36),
      assetType: addType,
      ticker: addTicker,
      name: meta.name || addTicker,
      currency: meta.currency || 'USD',
      quantity: parseFloat(addQty),
      avgCost: parseFloat(addCost) || lookupPrice(addTicker, addType),
    };
    setPortfolios(prev => prev.map(p => p.id === activePortfolioId ? { ...p, positions: [...p.positions, newPos] } : p));
    setShowAddModal(false);
    setAddStep(0);
    setAddSearch('');
    setAddTicker('');
    setAddQty('');
    setAddCost('');
  };

  const removePosition = (id) => {
    setPortfolios(prev => prev.map(p => p.id === activePortfolioId ? { ...p, positions: p.positions.filter(pos => pos.id !== id) } : p));
  };

  const createPortfolio = () => {
    const id = Date.now().toString(36);
    setPortfolios(prev => [...prev, { id, name: `Portfolio ${prev.length + 1}`, description: '', positions: [], createdDate: new Date().toISOString() }]);
    setActivePortfolioId(id);
  };

  const deletePortfolio = () => {
    if (portfolios.length <= 1) return;
    const remaining = portfolios.filter(p => p.id !== activePortfolioId);
    setPortfolios(remaining);
    setActivePortfolioId(remaining[0].id);
  };

  const loadTemplate = (template) => {
    const positions = template.positions.map((p, i) => ({ ...p, id: Date.now().toString(36) + i, name: lookupMeta(p.ticker, p.assetType).name || p.ticker }));
    setPortfolios(prev => prev.map(p => p.id === activePortfolioId ? { ...p, positions } : p));
  };

  const handleExport = () => {
    const rows = filtered.map(p => ({
      Ticker: p.ticker, Name: p.name || '', Type: p.assetType, Exchange: p.exchange || '',
      Qty: p.quantity, 'Avg Cost': p.avgCost, 'Current': p.currentPrice,
      'Market Value': p.marketValue, 'P&L': p.pnl, 'P&L %': p.pnlPct + '%', 'Weight %': p.weight + '%',
    }));
    exportToCSV(rows, `specter-portfolio-${activePortfolio.name.toLowerCase().replace(/\s/g, '-')}`);
  };

  const curSym = { USD: '$', QAR: 'QR', AED: 'AED', SAR: 'SR', EUR: '€', GBP: '£', JPY: '¥', CHF: 'CHF' };
  const fmt = (v) => `${curSym[currency] || '$'}${formatNumber(Math.abs(v), 2)}${v < 0 ? '' : ''}`;
  const fmtSigned = (v) => `${v < 0 ? '-' : '+'}${curSym[currency] || '$'}${formatNumber(Math.abs(v), 2)}`;

  if (!dataLoaded) {
    return <div className="h-full flex items-center justify-center text-bb-muted text-[11px]">Loading global market data...</div>;
  }

  // Generate sparkline data for portfolio value
  const sparkData = Array.from({ length: 30 }, (_, i) => ({
    d: i, v: metrics.totalValue * (0.95 + Math.random() * 0.1),
  }));
  sparkData[sparkData.length - 1].v = metrics.totalValue;

  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      {/* Header Summary */}
      <Panel title={
        <div className="flex items-center gap-2 w-full">
          <select value={activePortfolioId} onChange={e => setActivePortfolioId(e.target.value)}
            className="bg-bb-dark text-bb-amber border border-bb-border text-[10px] px-1 py-0.5 font-mono">
            {portfolios.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button onClick={createPortfolio} className="text-[9px] text-bb-green hover:text-green-300 font-bold">+NEW</button>
          {portfolios.length > 1 && <button onClick={deletePortfolio} className="text-[9px] text-bb-red hover:text-red-300 font-bold">DEL</button>}
          <div className="ml-auto flex gap-1">
            {CURRENCIES.slice(0, 6).map(c => (
              <button key={c} onClick={() => setCurrency(c)}
                className={`px-1.5 py-0 text-[9px] font-bold border ${currency === c ? 'bg-bb-amber text-bb-black border-bb-amber' : 'text-bb-muted border-bb-border hover:text-bb-amber'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      } className="col-span-8 row-span-1">
        <div className="flex items-center justify-between px-2 py-1">
          <div>
            <div className="text-bb-white text-xl font-bold">{fmt(metrics.totalValue)}</div>
            <div className={`text-sm font-bold ${colorClass(metrics.totalPnl)}`}>
              {fmtSigned(metrics.totalPnl)} ({formatPercent(metrics.totalPnlPct)})
            </div>
          </div>
          <div className="text-right text-[10px] space-y-0.5">
            <div className="text-bb-muted">Positions: <span className="text-bb-white">{positions.length}</span></div>
            <div className="text-bb-muted">Shariah: <span className="text-bb-green">{shariahPct}%</span></div>
          </div>
          <div className="w-32 h-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData}>
                <Area type="monotone" dataKey="v" stroke="#00d26a" fill="rgba(0,210,106,0.1)" strokeWidth={1} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Panel>

      {/* Allocation by Type */}
      <Panel title="Asset Allocation" className="col-span-4 row-span-2">
        {allocByType.length > 0 ? (
          <div className="flex items-center gap-2 h-full">
            <ResponsiveContainer width="50%" height="90%">
              <PieChart>
                <Pie data={allocByType} cx="50%" cy="50%" innerRadius={25} outerRadius={40} dataKey="value" paddingAngle={2}>
                  {allocByType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip {...CHART_TOOLTIP} formatter={v => fmt(v)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1 text-[9px]">
              {allocByType.map((a, i) => (
                <div key={a.name} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-bb-muted">{a.name}</span>
                  <span className="text-bb-white">{round(metrics.totalValue > 0 ? (a.value / metrics.totalValue) * 100 : 0, 1)}%</span>
                </div>
              ))}
            </div>
          </div>
        ) : <div className="text-bb-muted text-[10px] p-2">No positions</div>}
      </Panel>

      {/* Actions bar + Templates */}
      <Panel title="Actions" className="col-span-8 row-span-1">
        <div className="flex items-center gap-1 px-1 py-0.5 flex-wrap">
          <button onClick={() => { setShowAddModal(true); setAddStep(0); }}
            className="px-2 py-0.5 text-[9px] font-bold border border-bb-green text-bb-green hover:bg-bb-green/10">+ ADD POSITION</button>
          <button onClick={handleExport}
            className="px-2 py-0.5 text-[9px] font-bold border border-bb-cyan text-bb-cyan hover:bg-bb-cyan/10">EXPORT CSV</button>
          <span className="text-bb-border mx-1">│</span>
          <span className="text-bb-muted text-[9px]">TEMPLATES:</span>
          {TEMPLATES.map(t => (
            <button key={t.name} onClick={() => loadTemplate(t)}
              className="px-1.5 py-0.5 text-[8px] border border-bb-border text-bb-muted hover:text-bb-amber hover:border-bb-amber">
              {t.name}
            </button>
          ))}
        </div>
      </Panel>

      {/* Holdings Table */}
      <Panel title={
        <div className="flex items-center gap-2 w-full">
          <span>HOLDINGS</span>
          <div className="flex gap-0.5 ml-2">
            {SUB_TABS.map(t => (
              <button key={t} onClick={() => setSubTab(t)}
                className={`px-1.5 py-0 text-[8px] font-bold ${subTab === t ? 'text-bb-amber border-b border-bb-amber' : 'text-bb-muted hover:text-bb-white'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      } className="col-span-8 row-span-4">
        <div className="overflow-x-auto overflow-y-auto h-full">
          <table className="bb-table data-dense">
            <thead>
              <tr>
                <th className="cursor-pointer" onClick={() => handleSort('ticker')}>Ticker</th>
                <th className="cursor-pointer" onClick={() => handleSort('name')}>Name</th>
                <th className="cursor-pointer text-center" onClick={() => handleSort('assetType')}>Type</th>
                <th className="cursor-pointer text-right" onClick={() => handleSort('quantity')}>Qty</th>
                <th className="cursor-pointer text-right" onClick={() => handleSort('avgCost')}>Avg Cost</th>
                <th className="cursor-pointer text-right" onClick={() => handleSort('currentPrice')}>Current</th>
                <th className="cursor-pointer text-right" onClick={() => handleSort('marketValue')}>Mkt Value</th>
                <th className="cursor-pointer text-right" onClick={() => handleSort('pnl')}>P&L</th>
                <th className="cursor-pointer text-right" onClick={() => handleSort('pnlPct')}>P&L %</th>
                <th className="cursor-pointer text-right" onClick={() => handleSort('weight')}>Weight</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td className="text-bb-amber">{p.ticker}</td>
                  <td className="max-w-[120px] truncate">{p.name}</td>
                  <td className="text-center"><span className="text-[8px] px-1 py-0 bg-bb-dark border border-bb-border rounded text-bb-muted">{p.assetType}</span></td>
                  <td className="text-right">{formatNumber(p.quantity, p.quantity % 1 !== 0 ? 4 : 0)}</td>
                  <td className="text-right">{formatNumber(p.avgCost, 2)}</td>
                  <td className="text-right">{formatNumber(p.currentPrice, 2)}</td>
                  <td className="text-right">{fmt(p.marketValue)}</td>
                  <td className={`text-right ${colorClass(p.pnl)}`}>{fmtSigned(p.pnl)}</td>
                  <td className={`text-right ${colorClass(p.pnlPct)}`}>{formatPercent(p.pnlPct)}</td>
                  <td className="text-right">{p.weight}%</td>
                  <td><button onClick={() => removePosition(p.id)} className="text-bb-red hover:text-red-400 text-[9px] px-1 font-bold">×</button></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={11} className="text-center text-bb-muted py-4">No {subTab === 'All' ? '' : subTab + ' '}positions</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Analytics panel */}
      <Panel title="Analytics" className="col-span-4 row-span-2">
        <div className="space-y-1.5 p-1 text-[10px]">
          <div className="flex justify-between"><span className="text-bb-muted">Weighted Beta</span><span className="text-bb-white">{round(0.85 + Math.random() * 0.5, 2)}</span></div>
          <div className="flex justify-between"><span className="text-bb-muted">Wtd Div Yield</span><span className="text-bb-green">{round(1.5 + Math.random() * 2.5, 2)}%</span></div>
          <div className="flex justify-between"><span className="text-bb-muted">Shariah Compliance</span><span className="text-bb-green">{shariahPct}%</span></div>
          <div className="flex justify-between"><span className="text-bb-muted">Diversification</span><span className="text-bb-cyan">{Math.min(100, positions.length * 8 + 15)}/100</span></div>
          <div className="flex justify-between"><span className="text-bb-muted">Est Annual Income</span><span className="text-bb-green">{fmt(metrics.totalValue * 0.025)}</span></div>
          <div className="mt-1 text-bb-muted text-[9px]">SECTOR BREAKDOWN</div>
          {allocBySector.slice(0, 5).map((s, i) => (
            <div key={s.name} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
              <span className="text-bb-muted flex-1 truncate">{s.name}</span>
              <span className="text-bb-white">{round(metrics.totalValue > 0 ? (s.value / metrics.totalValue) * 100 : 0, 1)}%</span>
            </div>
          ))}
          <div className="mt-1 text-bb-muted text-[9px]">COUNTRY EXPOSURE</div>
          {allocByCountry.slice(0, 5).map(c => (
            <div key={c.name} className="flex justify-between">
              <span className="text-bb-muted">{c.name}</span>
              <span className="text-bb-white">{round(metrics.totalValue > 0 ? (c.value / metrics.totalValue) * 100 : 0, 1)}%</span>
            </div>
          ))}
        </div>
      </Panel>

      {/* Top 10 Holdings bar chart */}
      <Panel title="Top Holdings" className="col-span-4 row-span-2">
        {metrics.positions.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[...metrics.positions].sort((a, b) => b.weight - a.weight).slice(0, 8)} layout="vertical" margin={{ left: 50, right: 10, top: 5, bottom: 5 }}>
              <XAxis type="number" tick={{ fill: '#6a6a6a', fontSize: 8 }} tickFormatter={v => v + '%'} />
              <YAxis type="category" dataKey="ticker" tick={{ fill: '#ffbf00', fontSize: 8 }} width={50} />
              <Tooltip {...CHART_TOOLTIP} formatter={v => round(v, 2) + '%'} />
              <Bar dataKey="weight" fill="#ffbf00" barSize={10} />
            </BarChart>
          </ResponsiveContainer>
        ) : <div className="text-bb-muted text-[10px] p-2">No positions</div>}
      </Panel>

      {/* Add Position Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setShowAddModal(false)}>
          <div className="bg-bb-panel border border-bb-border p-4 max-w-md w-[90vw]" onClick={e => e.stopPropagation()}>
            <div className="text-bb-amber text-xs font-bold mb-3">ADD POSITION</div>
            {addStep === 0 && (
              <div>
                <div className="text-bb-muted text-[10px] mb-2">Select asset type:</div>
                <div className="grid grid-cols-3 gap-1">
                  {ASSET_TYPES.map(t => (
                    <button key={t} onClick={() => { setAddType(t); setAddStep(1); setAddSearch(''); }}
                      className="px-2 py-2 text-[10px] font-bold border border-bb-border text-bb-muted hover:border-bb-amber hover:text-bb-amber uppercase">
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {addStep === 1 && (
              <div>
                <div className="text-bb-muted text-[10px] mb-1">Search {addType}:</div>
                <input autoFocus value={addSearch} onChange={e => setAddSearch(e.target.value)}
                  className="w-full bg-bb-dark border border-bb-border text-bb-white text-[11px] px-2 py-1 mb-2 font-mono focus:border-bb-amber focus:outline-none"
                  placeholder={`Type to search ${addType}s...`} />
                <div className="max-h-40 overflow-y-auto space-y-0.5">
                  {searchResults.map(r => (
                    <button key={r.id} onClick={() => { setAddTicker(r.id); setAddCost(String(r.price)); setAddStep(2); }}
                      className="w-full text-left px-2 py-1 text-[10px] border border-bb-border hover:border-bb-amber flex justify-between">
                      <span className="text-bb-amber">{r.id}</span>
                      <span className="text-bb-muted truncate ml-2 flex-1">{r.name}</span>
                      <span className="text-bb-white">{formatNumber(r.price, 2)}</span>
                    </button>
                  ))}
                  {addSearch && searchResults.length === 0 && <div className="text-bb-muted text-[10px] p-2">No results</div>}
                </div>
                <button onClick={() => setAddStep(0)} className="text-bb-muted text-[9px] mt-2 hover:text-bb-white">← Back</button>
              </div>
            )}
            {addStep === 2 && (
              <div>
                <div className="text-bb-amber text-[11px] mb-2">{addTicker}</div>
                <div className="space-y-2">
                  <div>
                    <label className="text-bb-muted text-[9px]">Quantity</label>
                    <input autoFocus type="number" value={addQty} onChange={e => setAddQty(e.target.value)} min="0.0001" step="any"
                      className="w-full bg-bb-dark border border-bb-border text-bb-white text-[11px] px-2 py-1 font-mono focus:border-bb-amber focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-bb-muted text-[9px]">Average Cost (blank = current price)</label>
                    <input type="number" value={addCost} onChange={e => setAddCost(e.target.value)} step="any"
                      className="w-full bg-bb-dark border border-bb-border text-bb-white text-[11px] px-2 py-1 font-mono focus:border-bb-amber focus:outline-none" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setAddStep(1)} className="text-bb-muted text-[9px] hover:text-bb-white">← Back</button>
                    <button onClick={addPosition}
                      className="ml-auto px-4 py-1 text-[10px] font-bold bg-bb-amber text-bb-black hover:bg-yellow-400">ADD</button>
                  </div>
                </div>
              </div>
            )}
            <button onClick={() => setShowAddModal(false)} className="absolute top-2 right-3 text-bb-muted hover:text-bb-white text-lg">×</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(Portfolio);
