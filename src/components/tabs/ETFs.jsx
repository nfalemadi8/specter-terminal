import { useState, useEffect, memo, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Panel from '../layout/Panel';
import { getETFs } from '../../services/dataProvider';
import { formatNumber, formatPercent, formatChange, colorClass, round } from '../../utils/format';

const tt = { contentStyle: { background: '#1a1a1a', border: '1px solid #2a2a2a', fontSize: '10px', fontFamily: 'monospace' }, labelStyle: { color: '#ffbf00', fontSize: '10px' } };

function ETFs() {
  const [allEtfs, setAllEtfs] = useState(null);
  const [filter, setFilter] = useState('All');
  const [sortKey, setSortKey] = useState('chgPct');
  const [sortDir, setSortDir] = useState(-1);
  const [selected, setSelected] = useState(null);

  useEffect(() => { getETFs().then(d => { setAllEtfs(d); setSelected(d[0]); }); }, []);

  const categories = useMemo(() => allEtfs ? ['All', ...new Set(allEtfs.map(e => e.cat))] : ['All'], [allEtfs]);

  const filtered = useMemo(() => {
    if (!allEtfs) return [];
    const base = filter === 'All' ? allEtfs : allEtfs.filter(e => e.cat === filter);
    return [...base].sort((a, b) => ((a[sortKey] || 0) - (b[sortKey] || 0)) * sortDir);
  }, [allEtfs, filter, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d * -1);
    else { setSortKey(key); setSortDir(-1); }
  };

  if (!allEtfs) return <div className="p-4 text-bb-muted text-center text-[11px]">Loading ETF data…</div>;

  const avgExpense = filtered.length > 0 ? filtered.reduce((s, e) => s + e.exp, 0) / filtered.length : 0;
  const topPerf = filtered.length > 0 ? [...filtered].sort((a, b) => b.chgPct - a.chgPct)[0] : null;

  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      <Panel title="ETF Summary" className="col-span-3 row-span-3">
        <div className="space-y-2 text-[10px] p-0.5">
          <div className="grid grid-cols-2 gap-1">
            <div className="border border-bb-border p-1.5 text-center"><div className="text-lg font-bold text-bb-amber">{filtered.length}</div><div className="text-[8px] text-bb-muted">ETFs</div></div>
            <div className="border border-bb-border p-1.5 text-center"><div className="text-lg font-bold text-bb-blue">{round(avgExpense, 2)}%</div><div className="text-[8px] text-bb-muted">AVG EXP.</div></div>
          </div>
          {topPerf && (
            <div className="border border-bb-green/50 bg-bb-green/5 p-1.5">
              <div className="text-[8px] text-bb-muted">TOP PERFORMER</div>
              <div className="text-bb-amber font-bold">{topPerf.t}</div>
              <div className={`text-sm font-bold ${colorClass(topPerf.chgPct)}`}>{formatPercent(topPerf.chgPct)}</div>
            </div>
          )}
          <div className="text-[9px] text-bb-muted">FILTER</div>
          <div className="flex flex-wrap gap-0.5">
            {categories.map(c => (
              <button key={c} onClick={() => setFilter(c)} className={`px-1.5 py-[2px] text-[8px] border ${filter === c ? 'border-bb-amber text-bb-amber bg-bb-amber/10' : 'border-bb-border text-bb-muted'}`}>{c}</button>
            ))}
          </div>
        </div>
      </Panel>

      {selected && (
        <Panel title={`${selected.n} (${selected.t}) — 30D`} className="col-span-3 row-span-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={selected.priceHistory}>
              <defs>
                <linearGradient id="etfGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4a9eff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4a9eff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: '#6a6a6a', fontSize: 8 }} tickFormatter={v => v.slice(5)} interval={5} />
              <YAxis domain={['dataMin', 'dataMax']} tick={{ fill: '#6a6a6a', fontSize: 8 }} width={45} />
              <Tooltip {...tt} formatter={v => '$' + formatNumber(v)} />
              <Area type="monotone" dataKey="price" stroke="#4a9eff" fill="url(#etfGrad)" strokeWidth={1.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>
      )}

      <Panel title={`Exchange-Traded Funds (${filtered.length})`} className="col-span-6 row-span-6">
        <table className="bb-table">
          <thead>
            <tr>
              <th>Ticker</th>
              <th>Name</th>
              <th>Category</th>
              <th className="text-right cursor-pointer" onClick={() => handleSort('pr')}>Price</th>
              <th className="text-right cursor-pointer" onClick={() => handleSort('chg')}>Chg</th>
              <th className="text-right cursor-pointer" onClick={() => handleSort('chgPct')}>Chg%</th>
              <th className="text-right">AUM</th>
              <th className="text-right cursor-pointer" onClick={() => handleSort('exp')}>Exp%</th>
              <th className="text-right">Div%</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(e => (
              <tr key={e.t} onClick={() => setSelected(e)} className={`cursor-pointer ${selected?.t === e.t ? 'bg-bb-amber/10' : ''}`}>
                <td className="text-bb-amber">{e.t}</td>
                <td>{e.n}</td>
                <td className="text-bb-muted">{e.cat}</td>
                <td className="text-right">{formatNumber(e.pr)}</td>
                <td className={`text-right ${colorClass(e.chg)}`}>{formatChange(e.chg)}</td>
                <td className={`text-right ${colorClass(e.chgPct)}`}>{formatPercent(e.chgPct)}</td>
                <td className="text-right text-bb-muted">${round(e.aum / 1e9, 1)}B</td>
                <td className="text-right">{round(e.exp, 2)}%</td>
                <td className="text-right text-bb-muted">{round(e.div, 2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      {selected && (
        <Panel title={`${selected.t} Details`} className="col-span-6 row-span-3">
          <div className="grid grid-cols-3 gap-2 text-[10px] p-0.5">
            <div className="text-center py-2 border border-bb-border bg-bb-dark">
              <div className="text-bb-muted text-[9px]">NAV</div>
              <div className="text-lg font-bold text-bb-white">${formatNumber(selected.pr)}</div>
              <div className={`text-[10px] font-bold ${colorClass(selected.chgPct)}`}>{formatPercent(selected.chgPct)}</div>
            </div>
            <div className="text-center py-2 border border-bb-border bg-bb-dark">
              <div className="text-bb-muted text-[9px]">AUM</div>
              <div className="text-lg font-bold text-bb-white">${round(selected.aum / 1e9, 1)}B</div>
            </div>
            <div className="text-center py-2 border border-bb-border bg-bb-dark">
              <div className="text-bb-muted text-[9px]">HOLDINGS</div>
              <div className="text-lg font-bold text-bb-white">{selected.holdings}</div>
            </div>
            <table className="bb-table col-span-3"><tbody>
              {[
                ['Category', selected.cat],
                ['Expense Ratio', round(selected.exp, 2) + '%'],
                ['Dividend Yield', round(selected.div, 2) + '%'],
              ].map(([l, v]) => (
                <tr key={l}><td className="text-bb-muted">{l}</td><td className="text-right font-bold">{v}</td></tr>
              ))}
            </tbody></table>
          </div>
        </Panel>
      )}
    </div>
  );
}

export default memo(ETFs);
