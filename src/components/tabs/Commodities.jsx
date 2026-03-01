import { useState, useEffect, useMemo, memo } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Panel from '../layout/Panel';
import { getCommodities } from '../../services/dataProvider';
import { formatNumber, formatPercent, formatChange, colorClass, round } from '../../utils/format';

const tt = { contentStyle: { background: '#1a1a1a', border: '1px solid #2a2a2a', fontSize: '10px', fontFamily: 'monospace' }, labelStyle: { color: '#ffbf00', fontSize: '10px' } };
const CATEGORIES = ['all', 'energy', 'metals', 'agriculture'];
const CAT_COLORS = { energy: '#ff3b3b', metals: '#ffd700', agriculture: '#00d26a' };

function Commodities() {
  const [allCommodities, setAllCommodities] = useState(null);
  const [selected, setSelected] = useState(null);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    getCommodities().then(d => { setAllCommodities(d); setSelected(d[0]); });
  }, []);

  const filtered = useMemo(() => {
    if (!allCommodities) return [];
    return category === 'all' ? allCommodities : allCommodities.filter(c => c.cat === category);
  }, [allCommodities, category]);

  const catPerf = useMemo(() => {
    if (!allCommodities) return [];
    const cats = {};
    allCommodities.forEach(c => {
      if (!cats[c.cat]) cats[c.cat] = { sum: 0, count: 0 };
      cats[c.cat].sum += c.chgPct;
      cats[c.cat].count++;
    });
    return Object.entries(cats).map(([name, d]) => ({
      name, avgChange: d.sum / d.count, color: CAT_COLORS[name] || '#888',
    }));
  }, [allCommodities]);

  const perfData = useMemo(
    () => filtered.map(c => ({ id: c.id, name: c.n, chgPct: c.chgPct })).sort((a, b) => b.chgPct - a.chgPct),
    [filtered]
  );

  if (!allCommodities) return <div className="p-4 text-bb-muted text-center text-[11px]">Loading commodities…</div>;

  const decimals = selected && selected.pr < 10 ? 3 : 2;

  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      <Panel title="GLCO — Global Commodities" className="col-span-4 row-span-4">
        <div className="flex gap-1 mb-1.5 flex-wrap">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-2 py-[2px] text-[9px] border uppercase ${category === c ? 'border-bb-amber text-bb-amber bg-bb-amber/10' : 'border-bb-border text-bb-muted hover:text-bb-white'}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="overflow-auto" style={{ maxHeight: 'calc(100% - 28px)' }}>
          <table className="bb-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th className="text-right">Price</th>
                <th className="text-right">Chg%</th>
                <th className="text-right">Unit</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className={`cursor-pointer ${selected?.id === c.id ? 'bg-bb-amber/10' : ''}`} onClick={() => setSelected(c)}>
                  <td className="text-bb-amber">{c.id}</td>
                  <td>{c.n}</td>
                  <td className="text-right">{formatNumber(c.pr, c.pr < 10 ? 3 : 2)}</td>
                  <td className={`text-right ${colorClass(c.chgPct)}`}>{formatPercent(c.chgPct)}</td>
                  <td className="text-right text-bb-muted">{c.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {selected && (
        <Panel title={`${selected.n} (${selected.id}) — 30D`} className="col-span-5 row-span-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={selected.priceHistory}>
              <defs>
                <linearGradient id="glcoGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CAT_COLORS[selected.cat] || '#ff8c00'} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={CAT_COLORS[selected.cat] || '#ff8c00'} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: '#6a6a6a', fontSize: 8 }} tickFormatter={v => v.slice(5)} interval={5} />
              <YAxis domain={['dataMin', 'dataMax']} tick={{ fill: '#6a6a6a', fontSize: 8 }} width={55} />
              <Tooltip {...tt} />
              <Area type="monotone" dataKey="price" stroke={CAT_COLORS[selected.cat] || '#ff8c00'} fill="url(#glcoGrad)" strokeWidth={1.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>
      )}

      {selected && (
        <Panel title="Details" className="col-span-3 row-span-3">
          <div className="space-y-1 text-[10px] p-0.5">
            <div className="text-center py-2 border border-bb-border bg-bb-dark">
              <div className="text-bb-muted text-[9px]">{selected.n}</div>
              <div className="text-2xl font-bold text-bb-white">{formatNumber(selected.pr, decimals)}</div>
              <div className={`text-sm font-bold ${colorClass(selected.chg)}`}>
                {formatChange(selected.chg, decimals)} ({formatPercent(selected.chgPct)})
              </div>
            </div>
            <table className="bb-table"><tbody>
              {[
                ['Unit', selected.unit],
                ['Category', selected.cat],
                ['Day Change', formatChange(selected.chg, decimals), colorClass(selected.chg)],
              ].map(([label, val, cls]) => (
                <tr key={label}><td className="text-bb-muted">{label}</td><td className={`text-right font-bold ${cls || ''}`}>{val}</td></tr>
              ))}
            </tbody></table>
          </div>
        </Panel>
      )}

      <Panel title="Category Performance" className="col-span-3 row-span-3">
        <div className="space-y-2 p-0.5">
          {catPerf.map(c => (
            <div key={c.name} className="border border-bb-border p-1.5">
              <div className="flex items-center justify-between text-[10px]">
                <span style={{ color: c.color }} className="font-bold uppercase">{c.name}</span>
                <span className={colorClass(c.avgChange)}>{formatPercent(c.avgChange)}</span>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Performance (%)" className="col-span-5 row-span-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={perfData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }} layout="vertical">
            <XAxis type="number" tick={{ fill: '#6a6a6a', fontSize: 8 }} tickFormatter={v => v + '%'} />
            <YAxis type="category" dataKey="id" tick={{ fill: '#6a6a6a', fontSize: 8 }} width={35} />
            <Tooltip {...tt} formatter={v => round(v, 1) + '%'} />
            <Bar dataKey="chgPct" radius={[0, 2, 2, 0]}>
              {perfData.map(d => <Cell key={d.id} fill={d.chgPct >= 0 ? '#00d26a' : '#ff3b3b'} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Panel>

      <Panel title="Cross-Market Snapshot" className="col-span-4 row-span-2">
        <table className="bb-table">
          <thead><tr><th>Pair</th><th className="text-right">Ratio</th><th className="text-right">Status</th></tr></thead>
          <tbody>
            {[
              { pair: 'Gold/Silver', a: 'XAU', b: 'XAG' },
              { pair: 'Gold/Oil', a: 'XAU', b: 'WTI' },
              { pair: 'Brent/WTI', a: 'BRENT', b: 'WTI' },
              { pair: 'Copper/Gold', a: 'COPPER', b: 'XAU' },
            ].map(r => {
              const a = allCommodities.find(c => c.id === r.a);
              const b = allCommodities.find(c => c.id === r.b);
              if (!a || !b) return null;
              const ratio = a.pr / b.pr;
              return (
                <tr key={r.pair}>
                  <td className="text-bb-muted">{r.pair}</td>
                  <td className="text-right font-bold">{formatNumber(ratio, ratio < 1 ? 4 : 2)}</td>
                  <td className={`text-right text-[9px] ${colorClass(a.chgPct - b.chgPct)}`}>
                    {a.chgPct > b.chgPct ? 'A outperf' : 'B outperf'}
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

export default memo(Commodities);
