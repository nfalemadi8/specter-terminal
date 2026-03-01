import { useState, useEffect, useMemo, memo } from 'react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, Legend } from 'recharts';
import Panel from '../layout/Panel';
import ExportButton from '../layout/ExportButton';
import { getAllStocks } from '../../services/dataProvider';
import { formatNumber, formatCurrency, formatPercent, formatMcap, colorClass, round } from '../../utils/format';

const tt = { contentStyle: { background: '#1a1a1a', border: '1px solid #2a2a2a', fontSize: '10px', fontFamily: 'monospace' }, labelStyle: { color: '#ffbf00', fontSize: '10px' } };
const COLORS = ['#4a9eff', '#00d26a', '#ff8c00', '#ffd700', '#ff3b3b', '#00e5ff', '#b388ff', '#64ffda'];

function normalize(val, min, max) {
  if (max === min) return 50;
  return Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
}

function PeerComparison() {
  const [stocks, setStocks] = useState(null);
  const [selectedTicker, setSelectedTicker] = useState('AAPL');

  useEffect(() => { getAllStocks().then(setStocks); }, []);

  const stock = useMemo(() => stocks?.find(s => s.ticker === selectedTicker) || stocks?.[0], [stocks, selectedTicker]);
  const peers = useMemo(() => {
    if (!stocks || !stock) return [];
    const sameSector = stocks.filter(s => s.sector === stock.sector && s.ticker !== stock.ticker);
    return sameSector.length > 0 ? sameSector.slice(0, 5) : stocks.filter(s => s.ticker !== stock.ticker).slice(0, 5);
  }, [stocks, stock]);

  const allCompared = useMemo(() => stock ? [stock, ...peers] : [], [stock, peers]);

  const radarMetrics = ['pe', 'roe', 'netMargin', 'beta', 'esgScore'];
  const radarLabels = { pe: 'P/E', roe: 'ROE', netMargin: 'Margin', beta: 'Beta', esgScore: 'ESG' };

  const radarData = useMemo(() => {
    if (allCompared.length === 0) return [];
    const ranges = {};
    radarMetrics.forEach(m => {
      const vals = allCompared.map(s => s[m] || 0);
      ranges[m] = { min: Math.min(...vals), max: Math.max(...vals) };
    });
    return radarMetrics.map(m => {
      const point = { metric: radarLabels[m] };
      allCompared.forEach(s => {
        const invert = m === 'pe' || m === 'beta';
        const norm = normalize(s[m] || 0, ranges[m].min, ranges[m].max);
        point[s.ticker] = invert ? 100 - norm : norm;
      });
      return point;
    });
  }, [allCompared]);

  const metrics = [
    { key: 'price', label: 'Price', fmt: v => formatCurrency(v) },
    { key: 'changePercent', label: 'Day Chg%', fmt: v => formatPercent(v), color: true },
    { key: 'marketCap', label: 'Market Cap', fmt: v => formatMcap(v) },
    { key: 'pe', label: 'P/E', fmt: v => formatNumber(v, 1) },
    { key: 'pb', label: 'P/B', fmt: v => formatNumber(v, 1) },
    { key: 'ps', label: 'P/S', fmt: v => formatNumber(v, 1) },
    { key: 'evEbitda', label: 'EV/EBITDA', fmt: v => formatNumber(v, 1) },
    { key: 'roe', label: 'ROE (%)', fmt: v => formatNumber(v, 1) + '%' },
    { key: 'netMargin', label: 'Net Margin (%)', fmt: v => formatNumber(v, 1) + '%' },
    { key: 'divYield', label: 'Div Yield (%)', fmt: v => v + '%' },
    { key: 'debtToEquity', label: 'D/E Ratio', fmt: v => formatNumber(v, 2) },
    { key: 'beta', label: 'Beta', fmt: v => formatNumber(v, 2) },
    { key: 'eps', label: 'EPS', fmt: v => formatCurrency(v) },
    { key: 'esgScore', label: 'ESG Score', fmt: v => v },
  ];

  const relVal = useMemo(() =>
    allCompared.map(s => ({ ticker: s.ticker, pe: s.pe, pb: s.pb, roe: s.roe })),
    [allCompared]
  );

  if (!stocks) return <div className="p-4 text-bb-muted text-center text-[11px]">Loading stock data…</div>;

  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      <Panel title="Select Security" className="col-span-2 row-span-6">
        <div className="overflow-auto h-full">
          <table className="bb-table">
            <thead><tr><th>Ticker</th><th className="text-right">Chg%</th></tr></thead>
            <tbody>
              {stocks.map(s => (
                <tr key={s.ticker} onClick={() => setSelectedTicker(s.ticker)} className={`cursor-pointer ${s.ticker === selectedTicker ? 'bg-bb-amber/10' : ''}`}>
                  <td className={s.ticker === selectedTicker ? 'text-bb-amber font-bold' : 'text-bb-muted'}>{s.ticker}</td>
                  <td className={`text-right ${colorClass(s.changePercent)}`}>{formatPercent(s.changePercent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title={`${stock?.ticker} vs Sector Peers — Radar`} className="col-span-5 row-span-3">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} outerRadius="75%">
            <PolarGrid stroke="#2a2a2a" />
            <PolarAngleAxis dataKey="metric" tick={{ fill: '#6a6a6a', fontSize: 9 }} />
            <PolarRadiusAxis tick={false} domain={[0, 100]} />
            {stock && <Radar name={stock.ticker} dataKey={stock.ticker} stroke="#ffbf00" fill="#ffbf00" fillOpacity={0.15} strokeWidth={2} />}
            {peers.slice(0, 3).map((p, i) => (
              <Radar key={p.ticker} name={p.ticker} dataKey={p.ticker} stroke={COLORS[i + 1]} fill={COLORS[i + 1]} fillOpacity={0.05} strokeWidth={1} />
            ))}
            <Legend wrapperStyle={{ fontSize: '9px' }} />
            <Tooltip {...tt} />
          </RadarChart>
        </ResponsiveContainer>
      </Panel>

      <Panel title="Relative Valuation" className="col-span-5 row-span-3">
        <div className="grid grid-cols-3 gap-[3px] h-full">
          {['pe', 'pb', 'roe'].map(key => (
            <div key={key} className="flex flex-col">
              <div className="text-[9px] text-bb-amber text-center font-bold">{key === 'pe' ? 'P/E' : key === 'pb' ? 'P/B' : 'ROE (%)'}</div>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={relVal} margin={{ top: 5, right: 2, bottom: 0, left: 2 }}>
                    <XAxis dataKey="ticker" tick={{ fill: '#6a6a6a', fontSize: 7 }} />
                    <YAxis tick={{ fill: '#6a6a6a', fontSize: 7 }} width={30} />
                    <Tooltip {...tt} />
                    <Bar dataKey={key} radius={[2, 2, 0, 0]}>
                      {relVal.map((d, i) => (
                        <Cell key={d.ticker} fill={d.ticker === stock?.ticker ? '#ffbf00' : COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Peer Comparison Table" className="col-span-10 row-span-3">
        <div className="flex justify-end px-1 py-0.5">
          <ExportButton data={allCompared} filename="peer-comparison" />
        </div>
        <table className="bb-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th className="text-right text-bb-amber">{stock?.ticker}</th>
              {peers.map(p => <th key={p.ticker} className="text-right">{p.ticker}</th>)}
              <th className="text-right text-bb-cyan">Avg</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map(m => {
              const avg = allCompared.reduce((s, st) => s + (st[m.key] || 0), 0) / allCompared.length;
              return (
                <tr key={m.key}>
                  <td className="text-bb-muted">{m.label}</td>
                  <td className={`text-right font-bold text-bb-amber ${m.color ? colorClass(stock?.[m.key]) : ''}`}>{m.fmt(stock?.[m.key] || 0)}</td>
                  {peers.map(p => (
                    <td key={p.ticker} className={`text-right ${m.color ? colorClass(p[m.key]) : ''}`}>{m.fmt(p[m.key] || 0)}</td>
                  ))}
                  <td className="text-right text-bb-cyan">{typeof avg === 'number' ? m.fmt(avg) : '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

export default memo(PeerComparison);
