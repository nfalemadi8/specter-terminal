import { useState, useEffect, memo, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Panel from '../layout/Panel';
import { getIndices } from '../../services/dataProvider';
import { formatNumber, formatPercent, formatChange, colorClass, round } from '../../utils/format';

const tt = { contentStyle: { background: '#1a1a1a', border: '1px solid #2a2a2a', fontSize: '10px', fontFamily: 'monospace' }, labelStyle: { color: '#ffbf00', fontSize: '10px' } };
const REGIONS = ['all', 'us', 'europe', 'asia', 'gcc', 'latam', 'africa'];

function Indices() {
  const [allIndices, setAllIndices] = useState(null);
  const [region, setRegion] = useState('all');
  const [selected, setSelected] = useState(null);

  useEffect(() => { getIndices().then(d => { setAllIndices(d); setSelected(d[0]); }); }, []);

  const filtered = useMemo(() => {
    if (!allIndices) return [];
    if (region === 'all') return allIndices;
    const regionMap = {
      us: ['US'], europe: ['GB', 'DE', 'FR', 'EU', 'CH', 'ES', 'IT'],
      asia: ['JP', 'HK', 'CN', 'KR', 'TW', 'SG', 'AU', 'IN', 'TH', 'ID'],
      gcc: ['SA', 'AE', 'QA', 'KW', 'OM', 'BH'],
      latam: ['BR', 'MX', 'AR'], africa: ['ZA', 'NG'],
    };
    const countries = regionMap[region] || [];
    return allIndices.filter(i => countries.includes(i.co));
  }, [allIndices, region]);

  if (!allIndices) return <div className="p-4 text-bb-muted text-center text-[11px]">Loading indices…</div>;

  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      <Panel title="Global Indices" className="col-span-5 row-span-6">
        <div className="flex gap-1 mb-1 flex-wrap">
          {REGIONS.map(r => (
            <button key={r} onClick={() => setRegion(r)}
              className={`px-1.5 py-[1px] text-[9px] border uppercase ${region === r ? 'border-bb-amber text-bb-amber bg-bb-amber/10' : 'border-bb-border text-bb-muted'}`}>
              {r}
            </button>
          ))}
        </div>
        <div className="overflow-auto" style={{ maxHeight: 'calc(100% - 28px)' }}>
          <table className="bb-table">
            <thead>
              <tr>
                <th>Index</th>
                <th>Name</th>
                <th className="text-right">Last</th>
                <th className="text-right">Chg</th>
                <th className="text-right">Chg%</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(i => (
                <tr key={i.id} onClick={() => setSelected(i)} className={`cursor-pointer ${selected?.id === i.id ? 'bg-bb-amber/10' : ''}`}>
                  <td className="text-bb-amber">{i.id}</td>
                  <td>{i.n}</td>
                  <td className="text-right">{formatNumber(i.val, i.val > 1000 ? 0 : 2)}</td>
                  <td className={`text-right ${colorClass(i.chg)}`}>{formatChange(i.chg, i.chg > 10 ? 0 : 2)}</td>
                  <td className={`text-right ${colorClass(i.chgPct)}`}>{formatPercent(i.chgPct)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {selected && (
        <>
          <Panel title={`${selected.n} (${selected.id}) — 30D`} className="col-span-7 row-span-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={selected.priceHistory}>
                <defs>
                  <linearGradient id="idxGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4a9eff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4a9eff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: '#6a6a6a', fontSize: 9 }} tickFormatter={v => v.slice(5)} interval={5} />
                <YAxis domain={['dataMin', 'dataMax']} tick={{ fill: '#6a6a6a', fontSize: 9 }} width={55} />
                <Tooltip {...tt} formatter={v => formatNumber(v)} />
                <Area type="monotone" dataKey="price" stroke="#4a9eff" fill="url(#idxGrad)" strokeWidth={1.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title={`${selected.id} Details`} className="col-span-7 row-span-2">
            <div className="grid grid-cols-3 gap-2 text-[10px] p-0.5">
              <div className="text-center py-2 border border-bb-border bg-bb-dark">
                <div className="text-bb-muted text-[9px]">{selected.n}</div>
                <div className="text-xl font-bold text-bb-white">{formatNumber(selected.val, 0)}</div>
                <div className={`text-sm font-bold ${colorClass(selected.chgPct)}`}>{formatPercent(selected.chgPct)}</div>
              </div>
              <div className="text-center py-2 border border-bb-border bg-bb-dark">
                <div className="text-bb-muted text-[9px]">DAY CHANGE</div>
                <div className={`text-lg font-bold ${colorClass(selected.chg)}`}>{formatChange(selected.chg, 0)}</div>
              </div>
              <div className="text-center py-2 border border-bb-border bg-bb-dark">
                <div className="text-bb-muted text-[9px]">COUNTRY</div>
                <div className="text-lg font-bold text-bb-white">{selected.co}</div>
              </div>
            </div>
          </Panel>
        </>
      )}
    </div>
  );
}

export default memo(Indices);
