import { useState, useMemo , memo } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Panel from '../layout/Panel';
import MetricTooltip from '../layout/MetricTooltip';
import { stocks, generatePriceHistory } from '../../data/stocks';
import { calculateDCF } from '../../utils/calculations';
import { formatNumber, formatCurrency, formatPercent, formatMcap, colorClass, round } from '../../utils/format';

// Map display labels to MetricTooltip keys
const TOOLTIP_KEY = {
  'P/E (TTM)': 'P/E',
  'P/B': 'P/B',
  'Div Yield': 'Div Yield',
  'EPS': 'EPS',
  'Beta': 'Beta',
  'ROE': 'ROE',
  'D/E Ratio': 'D/E',
  'D/A Ratio': 'D/A',
};

const chartTooltip = {
  contentStyle: { background: '#1a1a1a', border: '1px solid #2a2a2a', fontSize: '10px', fontFamily: 'monospace' },
  labelStyle: { color: '#ffbf00', fontSize: '10px' },
};

// Shariah compliance thresholds (AAOIFI-based)
const SHARIAH = {
  debtToAssets: { max: 0.30, label: 'Debt / Total Assets < 30%' },
  haramRevenue: { max: 5, label: 'Impermissible Revenue < 5%' },
  debtEquity: { max: 0.33, label: 'Debt / Equity < 33%' },
};

function shariahCheck(stock) {
  const checks = [
    {
      name: 'Debt / Assets',
      value: stock.debtToAssets,
      threshold: SHARIAH.debtToAssets.max,
      pass: stock.debtToAssets < SHARIAH.debtToAssets.max,
      display: `${round(stock.debtToAssets * 100, 1)}% < 30%`,
    },
    {
      name: 'Debt / Equity',
      value: stock.debtEquity,
      threshold: SHARIAH.debtEquity.max,
      pass: stock.debtEquity < SHARIAH.debtEquity.max,
      display: `${round(stock.debtEquity * 100, 1)}% < 33%`,
    },
    {
      name: 'Haram Revenue',
      value: stock.haramRevenue,
      threshold: SHARIAH.haramRevenue.max,
      pass: stock.haramRevenue < SHARIAH.haramRevenue.max,
      display: `${stock.haramRevenue}% < 5%`,
    },
  ];
  const compliant = checks.every(c => c.pass);
  return { checks, compliant };
}

function Fundamentals() {
  const [selectedTicker, setSelectedTicker] = useState(stocks[0]?.ticker || 'AAPL');
  const [sectorFilter, setSectorFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // DCF inputs
  const [dcfGrowth, setDcfGrowth] = useState(12);
  const [dcfDiscount, setDcfDiscount] = useState(10);
  const [dcfTerminal, setDcfTerminal] = useState(3);
  const [dcfYears, setDcfYears] = useState(10);

  const sectors = useMemo(() => ['All', ...new Set(stocks.map(s => s.sector))], []);

  const filteredStocks = useMemo(() => {
    let list = stocks;
    if (sectorFilter !== 'All') list = list.filter(s => s.sector === sectorFilter);
    if (searchTerm) {
      const q = searchTerm.toUpperCase();
      list = list.filter(s => s.ticker.includes(q) || s.name.toUpperCase().includes(q));
    }
    return list;
  }, [sectorFilter, searchTerm]);

  const stock = useMemo(() => stocks.find(s => s.ticker === selectedTicker) || stocks[0], [selectedTicker]);

  const priceHistory = useMemo(() => generatePriceHistory(stock.price), [stock.ticker]);

  const revenueData = useMemo(() =>
    (stock.quarterlyRevenue || []).map((v, i) => ({
      quarter: `Q${((stock.quarterlyRevenue.length - i - 1) % 4) + 1}`,
      revenue: v,
    })).reverse(),
  [stock.ticker]);

  const shariah = useMemo(() => shariahCheck(stock), [stock.ticker]);

  const dcfValue = useMemo(() => {
    if (!stock.eps || stock.eps <= 0) return null;
    return calculateDCF(stock.eps, dcfGrowth, dcfDiscount, dcfTerminal, dcfYears);
  }, [stock.eps, dcfGrowth, dcfDiscount, dcfTerminal, dcfYears]);

  const dcfUpside = dcfValue ? ((dcfValue - stock.price) / stock.price) * 100 : null;

  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      {/* LEFT: Screener Sidebar */}
      <Panel title="Screener" className="col-span-3 row-span-6">
        <div className="space-y-1 mb-2">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search ticker or name..."
            className="w-full bg-bb-dark border border-bb-border text-bb-white text-[10px] px-2 py-1 font-mono focus:border-bb-amber focus:outline-none"
          />
          <div className="flex gap-1 flex-wrap">
            {sectors.map(s => (
              <button
                key={s}
                onClick={() => setSectorFilter(s)}
                className={`px-1.5 py-[1px] text-[9px] border ${
                  sectorFilter === s
                    ? 'border-bb-amber text-bb-amber bg-bb-amber/10'
                    : 'border-bb-border text-bb-muted hover:text-bb-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-auto" style={{ maxHeight: 'calc(100% - 58px)' }}>
          <table className="bb-table">
            <thead>
              <tr>
                <th>Ticker</th>
                <th className="text-right">Price</th>
                <th className="text-right">Chg%</th>
              </tr>
            </thead>
            <tbody>
              {filteredStocks.map(s => (
                <tr
                  key={s.ticker}
                  onClick={() => setSelectedTicker(s.ticker)}
                  className={`cursor-pointer transition-colors ${
                    s.ticker === selectedTicker
                      ? 'bg-bb-amber/10 border-l-2 border-bb-amber'
                      : 'hover:bg-bb-dark/50'
                  }`}
                >
                  <td className={s.ticker === selectedTicker ? 'text-bb-amber font-bold' : 'text-bb-amber'}>{s.ticker}</td>
                  <td className="text-right">{formatNumber(s.price)}</td>
                  <td className={`text-right ${colorClass(s.changePct)}`}>{formatPercent(s.changePct)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* TOP CENTER: Company Header + Price Chart */}
      <Panel title={`${stock.ticker} — ${stock.name}`} className="col-span-6 row-span-2">
        <div className="flex h-full">
          {/* Company info */}
          <div className="w-44 shrink-0 p-1 space-y-1 border-r border-bb-border text-[10px]">
            <div className="text-2xl font-bold text-bb-white">{formatCurrency(stock.price)}</div>
            <div className={`text-sm font-bold ${colorClass(stock.change)}`}>
              {stock.change > 0 ? '+' : ''}{round(stock.change, 2)} ({formatPercent(stock.changePct)})
            </div>
            <div className="pt-1 space-y-0.5">
              <div><span className="text-bb-muted">Sector: </span>{stock.sector}</div>
              <div><span className="text-bb-muted">Industry: </span>{stock.industry}</div>
              <div><span className="text-bb-muted">Country: </span>{stock.country}</div>
              <div><span className="text-bb-muted">MCap: </span>{formatMcap(stock.mcap)}</div>
              <div><span className="text-bb-muted">Beta: </span>{stock.beta}</div>
              <div><span className="text-bb-muted">52W: </span>{formatNumber(stock.low52)}–{formatNumber(stock.high52)}</div>
            </div>
          </div>
          {/* Price chart */}
          <div className="flex-1 pl-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={priceHistory}>
                <defs>
                  <linearGradient id="saGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={stock.change >= 0 ? '#00d26a' : '#ff3b3b'} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={stock.change >= 0 ? '#00d26a' : '#ff3b3b'} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: '#6a6a6a', fontSize: 8 }} tickFormatter={v => v.slice(5)} interval={20} />
                <YAxis domain={['dataMin', 'dataMax']} tick={{ fill: '#6a6a6a', fontSize: 8 }} tickFormatter={v => '$' + round(v, 0)} width={45} />
                <Tooltip {...chartTooltip} formatter={v => formatCurrency(v)} />
                <Area type="monotone" dataKey="price" stroke={stock.change >= 0 ? '#00d26a' : '#ff3b3b'} fill="url(#saGrad)" strokeWidth={1.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Panel>

      {/* TOP RIGHT: Islamic Compliance */}
      <Panel title="Shariah Compliance" className="col-span-3 row-span-2">
        <div className="p-1 space-y-2">
          {/* Overall verdict */}
          <div className={`text-center py-2 border ${
            shariah.compliant
              ? 'border-bb-green bg-bb-green/10 text-bb-green'
              : 'border-bb-red bg-bb-red/10 text-bb-red'
          }`}>
            <div className="text-lg font-bold">{shariah.compliant ? 'COMPLIANT' : 'NON-COMPLIANT'}</div>
            <div className="text-[9px] text-bb-muted">AAOIFI Screening</div>
          </div>

          {/* Individual checks */}
          {shariah.checks.map(c => (
            <div key={c.name} className="flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className={`inline-block w-2 h-2 rounded-full ${c.pass ? 'bg-bb-green' : 'bg-bb-red'}`} />
                <span className="text-bb-muted">{c.name}</span>
              </div>
              <span className={c.pass ? 'text-bb-green' : 'text-bb-red'}>{c.display}</span>
            </div>
          ))}

          {/* ESG scores */}
          <div className="border-t border-bb-border pt-1.5">
            <div className="text-[9px] text-bb-muted mb-1">ESG SCORE</div>
            <div className="grid grid-cols-4 gap-1 text-center text-[9px]">
              {[
                { label: 'ENV', val: stock.esgE, color: '#00d26a' },
                { label: 'SOC', val: stock.esgS, color: '#4a9eff' },
                { label: 'GOV', val: stock.esgG, color: '#ffbf00' },
                { label: 'TOT', val: stock.esgTotal, color: '#00e5ff' },
              ].map(e => (
                <div key={e.label}>
                  <div className="text-bb-muted">{e.label}</div>
                  <div className="font-bold" style={{ color: e.color }}>{e.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Panel>

      {/* BOTTOM CENTER: Valuation + Income + Balance */}
      <Panel title="Valuation" className="col-span-2 row-span-4">
        <table className="bb-table">
          <tbody>
            {[
              ['P/E (TTM)', stock.pe],
              ['P/B', stock.pb],
              ['P/S', stock.ps],
              ['EV/EBITDA', stock.evEbitda],
              ['Div Yield', stock.divYield + '%'],
              ['EPS', '$' + stock.eps],
              ['Beta', stock.beta],
            ].map(([label, val]) => (
              <tr key={label}>
                <td className="text-bb-muted">
                  {TOOLTIP_KEY[label] ? <MetricTooltip label={TOOLTIP_KEY[label]}>{label}</MetricTooltip> : label}
                </td>
                <td className="text-right font-bold">{val}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel title="Profitability" className="col-span-2 row-span-4">
        <table className="bb-table">
          <tbody>
            {[
              ['ROE', stock.roe + '%'],
              ['Net Margin', stock.margin + '%'],
              ['Rev Growth', formatPercent(stock.revGrowth)],
              ['D/E Ratio', round(stock.debtEquity, 2)],
              ['D/A Ratio', round(stock.debtToAssets * 100, 1) + '%'],
              ['Volume', stock.volume],
            ].map(([label, val]) => (
              <tr key={label}>
                <td className="text-bb-muted">
                  {TOOLTIP_KEY[label] ? <MetricTooltip label={TOOLTIP_KEY[label]}>{label}</MetricTooltip> : label}
                </td>
                <td className={`text-right font-bold ${
                  label === 'Rev Growth' ? colorClass(stock.revGrowth) : ''
                }`}>{val}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Quarterly Revenue mini-chart */}
        {revenueData.length > 0 && (
          <div className="mt-1 border-t border-bb-border pt-1">
            <div className="text-[9px] text-bb-muted mb-1">QUARTERLY REV ($B)</div>
            <ResponsiveContainer width="100%" height={70}>
              <BarChart data={revenueData}>
                <Bar dataKey="revenue" fill="#4a9eff" radius={[1, 1, 0, 0]} />
                <XAxis dataKey="quarter" tick={{ fill: '#6a6a6a', fontSize: 8 }} />
                <Tooltip {...chartTooltip} formatter={v => `$${v}B`} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Panel>

      <Panel title="Supply Chain" className="col-span-2 row-span-2">
        <div className="space-y-1.5 p-0.5 text-[10px]">
          <div>
            <div className="text-bb-muted text-[9px] mb-0.5">KEY SUPPLIERS</div>
            <div className="flex flex-wrap gap-1">
              {(stock.suppliers || []).map(s => (
                <span key={s} className="px-1.5 py-0.5 border border-bb-border text-bb-cyan text-[9px]">{s}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-bb-muted text-[9px] mb-0.5">KEY CUSTOMERS</div>
            <div className="flex flex-wrap gap-1">
              {(stock.customers || []).map(c => (
                <span key={c} className="px-1.5 py-0.5 border border-bb-border text-bb-amber text-[9px]">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </Panel>

      {/* BOTTOM RIGHT: DCF Calculator */}
      <Panel title="DCF Valuation" className="col-span-3 row-span-4">
        <div className="p-1 space-y-2 text-[10px]">
          {/* DCF Result */}
          {dcfValue !== null ? (
            <div className="text-center py-1.5 border border-bb-border bg-bb-dark">
              <div className="text-bb-muted text-[9px]">FAIR VALUE</div>
              <div className="text-xl font-bold text-bb-white">{formatCurrency(dcfValue)}</div>
              <div className={`text-sm font-bold ${colorClass(dcfUpside)}`}>
                {dcfUpside > 0 ? '+' : ''}{round(dcfUpside, 1)}% {dcfUpside >= 0 ? 'Upside' : 'Downside'}
              </div>
              <div className="text-bb-muted text-[9px] mt-0.5">vs. Current: {formatCurrency(stock.price)}</div>
            </div>
          ) : (
            <div className="text-center py-2 text-bb-muted">No EPS data available for DCF</div>
          )}

          {/* DCF Inputs */}
          <div className="space-y-1.5">
            <div className="text-bb-muted text-[9px] font-bold">MODEL INPUTS</div>
            <DCFInput label="EPS (TTM)" value={stock.eps} disabled />
            <DCFInput label="Growth Rate (%)" value={dcfGrowth} onChange={setDcfGrowth} min={0} max={50} step={0.5} />
            <DCFInput label="Discount Rate (%)" value={dcfDiscount} onChange={setDcfDiscount} min={5} max={20} step={0.5} />
            <DCFInput label="Terminal Growth (%)" value={dcfTerminal} onChange={setDcfTerminal} min={0} max={5} step={0.25} />
            <DCFInput label="Projection Years" value={dcfYears} onChange={setDcfYears} min={5} max={20} step={1} />
          </div>

          {/* Sensitivity hint */}
          {dcfValue !== null && (
            <div className="border-t border-bb-border pt-1.5 space-y-1">
              <div className="text-bb-muted text-[9px] font-bold">SENSITIVITY</div>
              <div className="grid grid-cols-3 gap-1 text-center text-[9px]">
                {[
                  { label: 'Bear', g: dcfGrowth * 0.5, d: dcfDiscount + 2 },
                  { label: 'Base', g: dcfGrowth, d: dcfDiscount },
                  { label: 'Bull', g: dcfGrowth * 1.5, d: dcfDiscount - 1 },
                ].map(sc => {
                  const val = calculateDCF(stock.eps, sc.g, sc.d, dcfTerminal, dcfYears);
                  const up = ((val - stock.price) / stock.price) * 100;
                  return (
                    <div key={sc.label} className="border border-bb-border p-1">
                      <div className="text-bb-muted">{sc.label}</div>
                      <div className="font-bold text-bb-white">{formatCurrency(val)}</div>
                      <div className={`text-[8px] ${colorClass(up)}`}>{up > 0 ? '+' : ''}{round(up, 1)}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Panel>

      {/* Bottom left remaining: 52W range visual */}
      <Panel title="52-Week Range" className="col-span-2 row-span-2">
        <div className="p-1 space-y-2">
          <div className="text-[10px]">
            <div className="flex justify-between text-bb-muted mb-1">
              <span>{formatCurrency(stock.low52)}</span>
              <span>{formatCurrency(stock.high52)}</span>
            </div>
            <div className="relative w-full h-2 bg-bb-dark border border-bb-border rounded-sm">
              <div
                className="absolute top-0 h-full w-1 bg-bb-amber rounded-sm"
                style={{
                  left: `${((stock.price - stock.low52) / (stock.high52 - stock.low52)) * 100}%`,
                }}
              />
            </div>
            <div className="text-center text-bb-amber text-[10px] mt-1 font-bold">
              {formatCurrency(stock.price)}
            </div>
          </div>

          {/* Quick stats */}
          <div className="border-t border-bb-border pt-1 text-[9px] space-y-0.5">
            <div className="flex justify-between">
              <span className="text-bb-muted">MCap</span>
              <span>{formatMcap(stock.mcap)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-bb-muted">Vol</span>
              <span>{stock.volume}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-bb-muted">Div Yield</span>
              <span>{stock.divYield}%</span>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}

function DCFInput({ label, value, onChange, disabled, min, max, step }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-bb-muted">{label}</span>
      {disabled ? (
        <span className="text-bb-white font-bold">${value}</span>
      ) : (
        <input
          type="number"
          value={value}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          min={min}
          max={max}
          step={step}
          className="w-16 bg-bb-dark border border-bb-border text-bb-white text-[10px] px-1.5 py-0.5 font-mono text-right focus:border-bb-amber focus:outline-none"
        />
      )}
    </div>
  );
}

export default memo(Fundamentals);
