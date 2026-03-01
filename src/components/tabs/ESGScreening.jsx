import { useState, useMemo , memo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import Panel from '../layout/Panel';
import { stocks } from '../../data/stocks';
import { formatNumber, formatPercent, formatMcap, colorClass, round } from '../../utils/format';

const tt = { contentStyle: { background: '#1a1a1a', border: '1px solid #2a2a2a', fontSize: '10px', fontFamily: 'monospace' }, labelStyle: { color: '#ffbf00', fontSize: '10px' } };

const ESG_TIERS = [
  { label: 'Leader', min: 70, color: '#00d26a' },
  { label: 'Average', min: 50, color: '#ffd700' },
  { label: 'Laggard', min: 0, color: '#ff3b3b' },
];

function esgTier(score) {
  return ESG_TIERS.find(t => score >= t.min) || ESG_TIERS[2];
}

function ESGScreening() {
  const [minESG, setMinESG] = useState(0);
  const [sortBy, setSortBy] = useState('esgTotal');
  const [sortDir, setSortDir] = useState('desc');
  const [selectedTicker, setSelectedTicker] = useState(null);

  const filtered = useMemo(() => {
    let data = stocks.filter(s => s.esgTotal >= minESG);
    const mul = sortDir === 'asc' ? 1 : -1;
    data.sort((a, b) => ((a[sortBy] || 0) - (b[sortBy] || 0)) * mul);
    return data;
  }, [minESG, sortBy, sortDir]);

  const selected = useMemo(() => selectedTicker ? stocks.find(s => s.ticker === selectedTicker) : null, [selectedTicker]);

  // Sector avg ESG
  const sectorESG = useMemo(() => {
    const map = {};
    stocks.forEach(s => {
      if (!map[s.sector]) map[s.sector] = { sumE: 0, sumS: 0, sumG: 0, sumT: 0, count: 0 };
      map[s.sector].sumE += s.esgE; map[s.sector].sumS += s.esgS; map[s.sector].sumG += s.esgG; map[s.sector].sumT += s.esgTotal; map[s.sector].count++;
    });
    return Object.entries(map).map(([name, d]) => ({
      name, e: d.sumE / d.count, s: d.sumS / d.count, g: d.sumG / d.count, total: d.sumT / d.count,
    })).sort((a, b) => b.total - a.total);
  }, []);

  // ESG vs Performance scatter
  const scatter = useMemo(() => stocks.map(s => ({ ticker: s.ticker, esg: s.esgTotal, return: s.changePct, mcap: s.mcap })), []);

  // Best/Worst
  const bestESG = useMemo(() => [...stocks].sort((a, b) => b.esgTotal - a.esgTotal).slice(0, 5), []);
  const worstESG = useMemo(() => [...stocks].sort((a, b) => a.esgTotal - b.esgTotal).slice(0, 5), []);

  const handleSort = (field) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortDir('desc'); }
  };

  // Radar for selected stock
  const radarData = useMemo(() => {
    if (!selected) return [];
    const avg = { e: 0, s: 0, g: 0 };
    stocks.forEach(st => { avg.e += st.esgE; avg.s += st.esgS; avg.g += st.esgG; });
    avg.e /= stocks.length; avg.s /= stocks.length; avg.g /= stocks.length;
    return [
      { metric: 'Environmental', stock: selected.esgE, average: avg.e },
      { metric: 'Social', stock: selected.esgS, average: avg.s },
      { metric: 'Governance', stock: selected.esgG, average: avg.g },
    ];
  }, [selected]);

  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      {/* Filter */}
      <Panel title="ESG Screening" className="col-span-2 row-span-6">
        <div className="space-y-2 text-[10px] p-0.5">
          <div>
            <div className="flex justify-between text-bb-muted mb-0.5"><span>Min ESG Score</span><span className="text-bb-white">{minESG}</span></div>
            <input type="range" min={0} max={90} value={minESG} onChange={e => setMinESG(+e.target.value)}
              className="w-full h-1 appearance-none bg-bb-border rounded cursor-pointer accent-[#ffbf00]" />
          </div>
          <div className="border-t border-bb-border pt-1">
            <div className="text-[9px] text-bb-muted mb-1">ESG TIERS</div>
            {ESG_TIERS.map(t => (
              <div key={t.label} className="flex items-center justify-between py-0.5">
                <div className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} /><span>{t.label}</span></div>
                <span className="text-bb-muted">{t.min}+</span>
              </div>
            ))}
          </div>
          <div className="border-t border-bb-border pt-1">
            <div className="text-[9px] text-bb-muted mb-1">TOP 5</div>
            {bestESG.map(s => (
              <div key={s.ticker} className="flex justify-between py-0.5 cursor-pointer hover:text-bb-amber" onClick={() => setSelectedTicker(s.ticker)}>
                <span className="text-bb-green">{s.ticker}</span><span className="font-bold">{s.esgTotal}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-bb-border pt-1">
            <div className="text-[9px] text-bb-muted mb-1">BOTTOM 5</div>
            {worstESG.map(s => (
              <div key={s.ticker} className="flex justify-between py-0.5 cursor-pointer hover:text-bb-amber" onClick={() => setSelectedTicker(s.ticker)}>
                <span className="text-bb-red">{s.ticker}</span><span className="font-bold">{s.esgTotal}</span>
              </div>
            ))}
          </div>
          <div className="text-bb-muted text-[9px]">{filtered.length} stocks pass</div>
        </div>
      </Panel>

      {/* ESG vs Return Scatter */}
      <Panel title="ESG Score vs Daily Return" className="col-span-5 row-span-3">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 5, right: 10, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis dataKey="esg" name="ESG" tick={{ fill: '#6a6a6a', fontSize: 8 }} label={{ value: 'ESG Score', position: 'bottom', fill: '#6a6a6a', fontSize: 8, offset: -2 }} />
            <YAxis dataKey="return" name="Return (%)" tick={{ fill: '#6a6a6a', fontSize: 8 }} tickFormatter={v => v + '%'} />
            <Tooltip {...tt} formatter={(v, name) => name === 'ESG' ? v : round(v, 2) + '%'} />
            <Scatter data={scatter} fill="#4a9eff" r={4}>
              {scatter.map(s => <Cell key={s.ticker} fill={esgTier(s.esg).color} />)}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </Panel>

      {/* Sector ESG */}
      <Panel title="Sector ESG Averages" className="col-span-5 row-span-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sectorESG} layout="vertical" margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <XAxis type="number" tick={{ fill: '#6a6a6a', fontSize: 8 }} domain={[0, 100]} />
            <YAxis type="category" dataKey="name" tick={{ fill: '#6a6a6a', fontSize: 8 }} width={85} />
            <Tooltip {...tt} />
            <Bar dataKey="total" radius={[0, 2, 2, 0]}>
              {sectorESG.map(s => <Cell key={s.name} fill={esgTier(s.total).color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Panel>

      {/* Detail Radar */}
      {selected ? (
        <Panel title={`${selected.ticker} ESG Breakdown`} className="col-span-3 row-span-3">
          <div className="text-center text-[10px] mb-1">
            <span className="text-bb-muted">Total: </span>
            <span className="font-bold text-lg" style={{ color: esgTier(selected.esgTotal).color }}>{selected.esgTotal}</span>
            <span className="text-bb-muted ml-1">({esgTier(selected.esgTotal).label})</span>
          </div>
          <ResponsiveContainer width="100%" height="80%">
            <RadarChart data={radarData} outerRadius="70%">
              <PolarGrid stroke="#2a2a2a" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#6a6a6a', fontSize: 9 }} />
              <PolarRadiusAxis tick={false} domain={[0, 100]} />
              <Radar name={selected.ticker} dataKey="stock" stroke="#ffbf00" fill="#ffbf00" fillOpacity={0.15} strokeWidth={2} />
              <Radar name="Average" dataKey="average" stroke="#6a6a6a" fill="transparent" strokeWidth={1} strokeDasharray="3 3" />
            </RadarChart>
          </ResponsiveContainer>
        </Panel>
      ) : (
        <Panel title="Select a stock" className="col-span-3 row-span-3">
          <div className="flex items-center justify-center h-full text-bb-muted text-[10px]">Click a stock for ESG breakdown</div>
        </Panel>
      )}

      {/* Results Table */}
      <Panel title={`Results (${filtered.length})`} className="col-span-7 row-span-3">
        <table className="bb-table">
          <thead>
            <tr>
              {[{ k: 'ticker', l: 'Ticker' }, { k: 'name', l: 'Name' }, { k: 'sector', l: 'Sector' }, { k: 'esgE', l: 'E', a: 'right' }, { k: 'esgS', l: 'S', a: 'right' }, { k: 'esgG', l: 'G', a: 'right' }, { k: 'esgTotal', l: 'Total', a: 'right' }, { k: 'changePct', l: 'Chg%', a: 'right' }, { k: 'pe', l: 'P/E', a: 'right' }].map(c => (
                <th key={c.k} className={`cursor-pointer hover:text-bb-white ${c.a === 'right' ? 'text-right' : ''}`} onClick={() => handleSort(c.k)}>
                  {c.l} {sortBy === c.k ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.ticker} onClick={() => setSelectedTicker(s.ticker)} className={`cursor-pointer ${selectedTicker === s.ticker ? 'bg-bb-amber/10' : ''}`}>
                <td className="text-bb-amber font-bold">{s.ticker}</td>
                <td>{s.name}</td>
                <td className="text-bb-muted">{s.sector}</td>
                <td className="text-right" style={{ color: '#00d26a' }}>{s.esgE}</td>
                <td className="text-right" style={{ color: '#4a9eff' }}>{s.esgS}</td>
                <td className="text-right" style={{ color: '#ffd700' }}>{s.esgG}</td>
                <td className="text-right font-bold" style={{ color: esgTier(s.esgTotal).color }}>{s.esgTotal}</td>
                <td className={`text-right ${colorClass(s.changePct)}`}>{formatPercent(s.changePct)}</td>
                <td className="text-right">{s.pe}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

export default memo(ESGScreening);
