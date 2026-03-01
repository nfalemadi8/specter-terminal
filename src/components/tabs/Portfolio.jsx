import { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Panel from '../layout/Panel';
import ExportButton from '../layout/ExportButton';
import { portfolioHoldings, calculatePortfolioMetrics, portfolioHistory, sectorAllocation } from '../../data/portfolio';
import { stocks } from '../../data/stocks';
import { formatNumber, formatCurrency, formatPercent, colorClass, round } from '../../utils/format';
import { loadData, saveData } from '../../utils/storage';
import { convertCurrency, exportToCSV, currencyRates } from '../../utils/calculations';

const STORAGE_KEY = 'specter-portfolio';
const GOAL_QAR = 18000000;
const GOAL_USD = GOAL_QAR / 3.64; // ~$4,945,054

const CURRENCY_SYMBOLS = { USD: '$', QAR: 'QR', AED: 'AED' };

const validSymbols = stocks.map(s => s.symbol);

const chartTooltip = {
  contentStyle: { background: '#1a1a1a', border: '1px solid #2a2a2a', fontSize: '10px', fontFamily: 'monospace' },
  labelStyle: { color: '#ffbf00', fontSize: '10px' },
};

function formatWithCurrency(value, currency) {
  const converted = convertCurrency(value, 'USD', currency);
  const sym = CURRENCY_SYMBOLS[currency];
  const formatted = formatNumber(Math.abs(converted), 2);
  const sign = converted < 0 ? '-' : '';
  return `${sign}${sym} ${formatted}`;
}

export default function Portfolio() {
  const [holdings, setHoldings] = useState(() => {
    const saved = loadData(STORAGE_KEY);
    return saved || portfolioHoldings;
  });
  const [currency, setCurrency] = useState('USD');
  const [newTicker, setNewTicker] = useState('');
  const [newShares, setNewShares] = useState('');
  const [newCost, setNewCost] = useState('');
  const [tickerError, setTickerError] = useState('');

  // Save to localStorage whenever holdings change
  useEffect(() => {
    saveData(STORAGE_KEY, holdings);
  }, [holdings]);

  // Calculate portfolio metrics
  const portfolio = useMemo(() => calculatePortfolioMetrics(holdings), [holdings]);

  // Compute sector allocation from current holdings
  const computedSectors = useMemo(() => {
    const sectorMap = {};
    const sectorColors = {};
    sectorAllocation.forEach(s => { sectorColors[s.name] = s.color; });

    portfolio.holdings.forEach(h => {
      const sec = h.sector || 'Other';
      sectorMap[sec] = (sectorMap[sec] || 0) + h.marketValue;
    });

    return Object.entries(sectorMap)
      .map(([name, value]) => ({
        name,
        value: (value / portfolio.totalValue) * 100,
        color: sectorColors[name] || '#6a6a6a',
      }))
      .sort((a, b) => b.value - a.value);
  }, [portfolio]);

  // Goal progress
  const goalProgress = useMemo(() => {
    const totalInQAR = convertCurrency(portfolio.totalValue, 'USD', 'QAR');
    return Math.min((totalInQAR / GOAL_QAR) * 100, 100);
  }, [portfolio.totalValue]);

  // Add position handler
  const handleAddPosition = () => {
    const ticker = newTicker.trim().toUpperCase();
    if (!ticker) return;

    if (!validSymbols.includes(ticker)) {
      setTickerError(`Invalid ticker: ${ticker}`);
      return;
    }

    const shares = parseInt(newShares, 10);
    const avgCost = parseFloat(newCost);

    if (!shares || shares <= 0 || !avgCost || avgCost <= 0) {
      setTickerError('Invalid shares or cost');
      return;
    }

    const stockData = stocks.find(s => s.symbol === ticker);
    const existingIdx = holdings.findIndex(h => h.symbol === ticker);

    if (existingIdx !== -1) {
      // Merge with existing position
      const existing = holdings[existingIdx];
      const totalShares = existing.shares + shares;
      const totalCost = (existing.shares * existing.avgCost) + (shares * avgCost);
      const newAvgCost = totalCost / totalShares;

      const updated = [...holdings];
      updated[existingIdx] = {
        ...existing,
        shares: totalShares,
        avgCost: round(newAvgCost, 2),
      };
      setHoldings(updated);
    } else {
      setHoldings([...holdings, {
        symbol: ticker,
        shares,
        avgCost,
        current: stockData.price,
        sector: stockData.sector,
      }]);
    }

    setNewTicker('');
    setNewShares('');
    setNewCost('');
    setTickerError('');
  };

  // Remove position handler
  const handleRemove = (symbol) => {
    setHoldings(holdings.filter(h => h.symbol !== symbol));
  };

  // CSV export handler
  const handleExport = () => {
    const rows = portfolio.holdings.map(h => ({
      Symbol: h.symbol,
      Shares: h.shares,
      'Avg Cost': h.avgCost,
      'Current Price': h.current,
      'Market Value': h.marketValue,
      'Cost Basis': h.costBasis,
      'P&L': h.gainLoss,
      'P&L %': round(h.gainLossPct, 2) + '%',
      'Weight %': round(h.weight, 1) + '%',
      Sector: h.sector,
    }));
    exportToCSV(rows, 'specter-portfolio-export');
  };

  const currencies = ['USD', 'QAR', 'AED'];

  if (holdings.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-bb-amber text-2xl font-bold mb-2">NO HOLDINGS</div>
          <div className="text-bb-muted text-[11px] mb-4">
            Your portfolio is empty. Add a position using the form below to get started.
          </div>
          <div className="inline-flex gap-1 text-[10px]">
            <input type="text" value={newTicker} onChange={e => { setNewTicker(e.target.value.toUpperCase()); setTickerError(''); }}
              placeholder="TICKER" className="w-20 bg-bb-dark border border-bb-border text-bb-white px-1.5 py-1 font-mono focus:border-bb-amber focus:outline-none" />
            <input type="number" value={newShares} onChange={e => setNewShares(e.target.value)}
              placeholder="SHARES" className="w-20 bg-bb-dark border border-bb-border text-bb-white px-1.5 py-1 font-mono focus:border-bb-amber focus:outline-none" />
            <input type="number" value={newCost} onChange={e => setNewCost(e.target.value)}
              placeholder="AVG COST" className="w-24 bg-bb-dark border border-bb-border text-bb-white px-1.5 py-1 font-mono focus:border-bb-amber focus:outline-none" />
            <button onClick={handleAddPosition}
              className="px-3 py-1 text-[9px] font-bold border border-bb-amber text-bb-amber hover:bg-bb-amber/10">ADD</button>
          </div>
          {tickerError && <div className="text-bb-red text-[9px] mt-1">{tickerError}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      {/* Performance Chart */}
      <Panel title="Portfolio Performance — 90D" className="col-span-8 row-span-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={portfolioHistory}>
            <defs>
              <linearGradient id="pfGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00d26a" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00d26a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fill: '#6a6a6a', fontSize: 9 }} tickFormatter={v => v.slice(5)} interval={15} />
            <YAxis domain={['dataMin', 'dataMax']} tick={{ fill: '#6a6a6a', fontSize: 9 }} tickFormatter={v => '$' + round(v / 1000, 0) + 'K'} width={50} />
            <Tooltip {...chartTooltip} formatter={v => formatCurrency(v)} />
            <Area type="monotone" dataKey="value" stroke="#00d26a" fill="url(#pfGrad)" strokeWidth={1.5} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </Panel>

      {/* Summary Panel */}
      <Panel title="Summary" className="col-span-4 row-span-2">
        <div className="space-y-2 p-1">
          {/* Currency Toggle */}
          <div className="flex items-center gap-1 mb-2">
            {currencies.map(c => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`px-2 py-0.5 text-[10px] font-bold border transition-colors ${
                  currency === c
                    ? 'bg-bb-amber text-bb-black border-bb-amber'
                    : 'bg-transparent text-bb-muted border-bb-border hover:border-bb-amber hover:text-bb-amber'
                }`}
              >
                {c}
              </button>
            ))}
            <button
              onClick={handleExport}
              className="ml-auto px-2 py-0.5 text-[10px] font-bold border border-bb-border text-bb-cyan hover:border-bb-cyan transition-colors"
              title="Export CSV"
            >
              CSV
            </button>
          </div>

          <div>
            <div className="text-bb-muted text-[10px]">TOTAL VALUE</div>
            <div className="text-bb-white text-xl font-bold">
              {formatWithCurrency(portfolio.totalValue, currency)}
            </div>
          </div>
          <div>
            <div className="text-bb-muted text-[10px]">COST BASIS</div>
            <div className="text-bb-muted text-sm">
              {formatWithCurrency(portfolio.totalCost, currency)}
            </div>
          </div>
          <div>
            <div className="text-bb-muted text-[10px]">TOTAL P&L</div>
            <div className={`text-lg font-bold ${colorClass(portfolio.totalGainLoss)}`}>
              {formatWithCurrency(portfolio.totalGainLoss, currency)} ({formatPercent(portfolio.totalGainLossPct)})
            </div>
          </div>
          <div>
            <div className="text-bb-muted text-[10px]">POSITIONS</div>
            <div className="text-bb-white text-sm">{portfolio.holdings.length}</div>
          </div>

          {/* Goal Progress */}
          <div>
            <div className="text-bb-muted text-[10px] mb-1">
              GOAL: QR {formatNumber(GOAL_QAR, 0)} ({round(goalProgress, 1)}%)
            </div>
            <div className="w-full h-2 bg-bb-dark border border-bb-border rounded-sm overflow-hidden">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${goalProgress}%`,
                  background: goalProgress >= 100 ? '#00d26a' : '#ffbf00',
                }}
              />
            </div>
          </div>

          {/* Sector Allocation */}
          <div>
            <div className="text-bb-muted text-[10px] mb-1">SECTOR ALLOCATION</div>
            <div className="flex gap-2 flex-wrap">
              {computedSectors.map(s => (
                <div key={s.name} className="flex items-center gap-1 text-[9px]">
                  <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  <span className="text-bb-muted">{s.name} {round(s.value, 1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Panel>

      {/* Holdings Table */}
      <Panel title="Holdings" className="col-span-12 row-span-4">
        <div className="flex justify-end px-1 py-0.5">
          <ExportButton data={portfolioHoldings} filename="portfolio-holdings" />
        </div>
        <table className="bb-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th className="text-right">Shares</th>
              <th className="text-right">Avg Cost</th>
              <th className="text-right">Current</th>
              <th className="text-right">Mkt Value</th>
              <th className="text-right">Cost Basis</th>
              <th className="text-right">P&L</th>
              <th className="text-right">P&L %</th>
              <th className="text-right">Weight</th>
              <th className="text-center"></th>
            </tr>
          </thead>
          <tbody>
            {portfolio.holdings.map(h => (
              <tr key={h.symbol}>
                <td className="text-bb-amber">{h.symbol}</td>
                <td className="text-right">{h.shares}</td>
                <td className="text-right">{formatWithCurrency(h.avgCost, currency)}</td>
                <td className="text-right">{formatWithCurrency(h.current, currency)}</td>
                <td className="text-right">{formatWithCurrency(h.marketValue, currency)}</td>
                <td className="text-right text-bb-muted">{formatWithCurrency(h.costBasis, currency)}</td>
                <td className={`text-right ${colorClass(h.gainLoss)}`}>
                  {formatWithCurrency(h.gainLoss, currency)}
                </td>
                <td className={`text-right ${colorClass(h.gainLossPct)}`}>
                  {formatPercent(h.gainLossPct)}
                </td>
                <td className="text-right">{round(h.weight, 1)}%</td>
                <td className="text-center">
                  <button
                    onClick={() => handleRemove(h.symbol)}
                    className="text-bb-red hover:text-red-400 text-[10px] font-bold px-1"
                    title={`Remove ${h.symbol}`}
                  >
                    DEL
                  </button>
                </td>
              </tr>
            ))}

            {/* Add Position Row */}
            <tr className="border-t border-bb-border">
              <td>
                <input
                  type="text"
                  value={newTicker}
                  onChange={e => { setNewTicker(e.target.value.toUpperCase()); setTickerError(''); }}
                  placeholder="TICKER"
                  className="bg-bb-dark border border-bb-border text-bb-white text-[11px] px-2 py-1 w-20 font-mono focus:border-bb-amber focus:outline-none"
                />
              </td>
              <td className="text-right">
                <input
                  type="number"
                  value={newShares}
                  onChange={e => setNewShares(e.target.value)}
                  placeholder="Shares"
                  min="1"
                  className="bg-bb-dark border border-bb-border text-bb-white text-[11px] px-2 py-1 w-20 font-mono text-right focus:border-bb-amber focus:outline-none"
                />
              </td>
              <td className="text-right">
                <input
                  type="number"
                  value={newCost}
                  onChange={e => setNewCost(e.target.value)}
                  placeholder="Avg Cost"
                  min="0.01"
                  step="0.01"
                  className="bg-bb-dark border border-bb-border text-bb-white text-[11px] px-2 py-1 w-24 font-mono text-right focus:border-bb-amber focus:outline-none"
                />
              </td>
              <td colSpan="6"></td>
              <td className="text-center">
                <button
                  onClick={handleAddPosition}
                  className="bg-bb-amber text-bb-black text-[10px] font-bold px-3 py-1 hover:bg-yellow-400 transition-colors"
                >
                  ADD
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        {tickerError && (
          <div className="text-bb-red text-[10px] px-2 py-1">{tickerError}</div>
        )}
      </Panel>
    </div>
  );
}
