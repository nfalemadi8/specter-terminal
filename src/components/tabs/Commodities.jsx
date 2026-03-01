import { useState, useMemo } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Panel from '../layout/Panel';
import { commodities, generateCommodityHistory } from '../../data/commodities';
import { formatNumber, formatPercent, formatChange, colorClass, round } from '../../utils/format';

const chartTooltip = {
  contentStyle: { background: '#1a1a1a', border: '1px solid #2a2a2a', fontSize: '10px', fontFamily: 'monospace' },
  labelStyle: { color: '#ffbf00', fontSize: '10px' },
};

const CATEGORIES = ['All', 'Precious Metals', 'Energy', 'Agriculture', 'Industrial'];
const PERIODS = [
  { label: '1W', days: 7 },
  { label: '1M', days: 30 },
  { label: '3M', days: 90 },
  { label: '6M', days: 180 },
];

const CATEGORY_COLORS = {
  'Precious Metals': '#ffd700',
  Energy: '#ff3b3b',
  Agriculture: '#00d26a',
  Industrial: '#4a9eff',
};

export default function Commodities() {
  const [selected, setSelected] = useState(commodities[0]);
  const [category, setCategory] = useState('All');
  const [period, setPeriod] = useState(90);

  const filtered = useMemo(
    () => category === 'All' ? commodities : commodities.filter(c => c.category === category),
    [category]
  );

  const history = useMemo(() => generateCommodityHistory(selected.price, period), [selected.symbol, period]);

  // Category performance summary
  const catPerf = useMemo(() => {
    const cats = {};
    commodities.forEach(c => {
      if (!cats[c.category]) cats[c.category] = { sum: 0, count: 0, ytdSum: 0 };
      cats[c.category].sum += c.changePct;
      cats[c.category].ytdSum += c.ytd;
      cats[c.category].count++;
    });
    return Object.entries(cats).map(([name, d]) => ({
      name,
      avgChange: d.sum / d.count,
      avgYtd: d.ytdSum / d.count,
      color: CATEGORY_COLORS[name] || '#888',
    }));
  }, []);

  // YTD performance bar chart
  const ytdData = useMemo(
    () => filtered.map(c => ({ symbol: c.symbol, ytd: c.ytd, name: c.name })).sort((a, b) => b.ytd - a.ytd),
    [filtered]
  );

  const decimals = selected.price < 10 ? 3 : 2;

  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      {/* Commodity List */}
      <Panel title="GLCO — Global Commodities" className="col-span-4 row-span-4">
        <div className="flex gap-1 mb-1.5 flex-wrap">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-2 py-[2px] text-[9px] border ${
                category === c ? 'border-bb-amber text-bb-amber bg-bb-amber/10' : 'border-bb-border text-bb-muted hover:text-bb-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="overflow-auto" style={{ maxHeight: 'calc(100% - 28px)' }}>
          <table className="bb-table">
            <thead>
              <tr>
                <th>Sym</th>
                <th>Name</th>
                <th className="text-right">Price</th>
                <th className="text-right">Chg%</th>
                <th className="text-right">YTD</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr
                  key={c.symbol}
                  className={`cursor-pointer ${selected.symbol === c.symbol ? 'bg-bb-amber/10' : ''}`}
                  onClick={() => setSelected(c)}
                >
                  <td className="text-bb-amber">{c.symbol}</td>
                  <td>{c.name}</td>
                  <td className="text-right">{formatNumber(c.price, c.price < 10 ? 3 : 2)}</td>
                  <td className={`text-right ${colorClass(c.changePct)}`}>{formatPercent(c.changePct)}</td>
                  <td className={`text-right ${colorClass(c.ytd)}`}>{formatPercent(c.ytd)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Price Chart */}
      <Panel title={`${selected.name} (${selected.symbol})`} className="col-span-5 row-span-3">
        <div className="flex gap-1 mb-1">
          {PERIODS.map(p => (
            <button
              key={p.label}
              onClick={() => setPeriod(p.days)}
              className={`px-1.5 py-[1px] text-[9px] border ${
                period === p.days ? 'border-bb-amber text-bb-amber' : 'border-bb-border text-bb-muted'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <ResponsiveContainer width="100%" height="90%">
          <AreaChart data={history}>
            <defs>
              <linearGradient id="glcoGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CATEGORY_COLORS[selected.category] || '#ff8c00'} stopOpacity={0.3} />
                <stop offset="95%" stopColor={CATEGORY_COLORS[selected.category] || '#ff8c00'} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fill: '#6a6a6a', fontSize: 8 }} tickFormatter={v => v.slice(5)} interval={Math.floor(period / 6)} />
            <YAxis domain={['dataMin', 'dataMax']} tick={{ fill: '#6a6a6a', fontSize: 8 }} width={55} />
            <Tooltip {...chartTooltip} />
            <Area type="monotone" dataKey="price" stroke={CATEGORY_COLORS[selected.category] || '#ff8c00'} fill="url(#glcoGrad)" strokeWidth={1.5} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </Panel>

      {/* Commodity Details */}
      <Panel title="Details" className="col-span-3 row-span-3">
        <div className="space-y-1 text-[10px] p-0.5">
          <div className="text-center py-2 border border-bb-border bg-bb-dark">
            <div className="text-bb-muted text-[9px]">{selected.name}</div>
            <div className="text-2xl font-bold text-bb-white">{formatNumber(selected.price, decimals)}</div>
            <div className={`text-sm font-bold ${colorClass(selected.change)}`}>
              {formatChange(selected.change, decimals)} ({formatPercent(selected.changePct)})
            </div>
          </div>
          <table className="bb-table">
            <tbody>
              {[
                ['Unit', selected.unit],
                ['Category', selected.category],
                ['YTD Return', formatPercent(selected.ytd), colorClass(selected.ytd)],
                ['Day Change', formatChange(selected.change, decimals), colorClass(selected.change)],
              ].map(([label, val, cls]) => (
                <tr key={label}>
                  <td className="text-bb-muted">{label}</td>
                  <td className={`text-right font-bold ${cls || ''}`}>{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Category Performance */}
      <Panel title="Category Performance" className="col-span-3 row-span-3">
        <div className="space-y-2 p-0.5">
          {catPerf.map(c => (
            <div key={c.name} className="border border-bb-border p-1.5">
              <div className="flex items-center justify-between text-[10px]">
                <span style={{ color: c.color }} className="font-bold">{c.name}</span>
                <span className={colorClass(c.avgChange)}>{formatPercent(c.avgChange)}</span>
              </div>
              <div className="flex items-center justify-between text-[9px] text-bb-muted mt-0.5">
                <span>YTD Avg</span>
                <span className={colorClass(c.avgYtd)}>{formatPercent(c.avgYtd)}</span>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* YTD Performance Bar */}
      <Panel title="YTD Performance (%)" className="col-span-5 row-span-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ytdData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }} layout="vertical">
            <XAxis type="number" tick={{ fill: '#6a6a6a', fontSize: 8 }} tickFormatter={v => v + '%'} />
            <YAxis type="category" dataKey="symbol" tick={{ fill: '#6a6a6a', fontSize: 8 }} width={30} />
            <Tooltip {...chartTooltip} formatter={v => round(v, 1) + '%'} />
            <Bar dataKey="ytd" radius={[0, 2, 2, 0]}>
              {ytdData.map(d => (
                <Cell key={d.symbol} fill={d.ytd >= 0 ? '#00d26a' : '#ff3b3b'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Panel>

      {/* Bottom: Correlation Heatmap Simplified */}
      <Panel title="Cross-Market Snapshot" className="col-span-4 row-span-2">
        <table className="bb-table">
          <thead>
            <tr>
              <th>Pair</th>
              <th className="text-right">Ratio</th>
              <th className="text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { pair: 'Gold/Silver', a: 'GC', b: 'SI' },
              { pair: 'Gold/Oil', a: 'GC', b: 'CL' },
              { pair: 'Oil Brent/WTI', a: 'BZ', b: 'CL' },
              { pair: 'Copper/Gold', a: 'HG', b: 'GC' },
              { pair: 'Corn/Wheat', a: 'ZC', b: 'ZW' },
            ].map(r => {
              const a = commodities.find(c => c.symbol === r.a);
              const b = commodities.find(c => c.symbol === r.b);
              if (!a || !b) return null;
              const ratio = a.price / b.price;
              return (
                <tr key={r.pair}>
                  <td className="text-bb-muted">{r.pair}</td>
                  <td className="text-right font-bold">{formatNumber(ratio, ratio < 1 ? 4 : 2)}</td>
                  <td className={`text-right text-[9px] ${colorClass(a.changePct - b.changePct)}`}>
                    {a.changePct > b.changePct ? 'A outperf' : 'B outperf'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
