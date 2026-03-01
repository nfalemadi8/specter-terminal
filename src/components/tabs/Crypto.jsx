import { useState, useEffect, memo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Panel from '../layout/Panel';
import { getCrypto } from '../../services/dataProvider';
import { formatNumber, formatPercent, colorClass, round } from '../../utils/format';

const tt = { contentStyle: { background: '#1a1a1a', border: '1px solid #2a2a2a', fontSize: '10px', fontFamily: 'monospace' }, labelStyle: { color: '#ffbf00', fontSize: '10px' } };

function Crypto() {
  const [cryptos, setCryptos] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getCrypto().then(d => { setCryptos(d); setSelected(d[0]); });
  }, []);

  if (!cryptos) return <div className="p-4 text-bb-muted text-center text-[11px]">Loading crypto data…</div>;

  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      <Panel title="Cryptocurrency Market" className="col-span-7 row-span-6">
        <table className="bb-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Name</th>
              <th className="text-right">Price</th>
              <th className="text-right">24h Chg</th>
              <th className="text-right">Chg%</th>
              <th className="text-right">Volume</th>
              <th className="text-right">MCap</th>
              <th className="text-right">Dom%</th>
            </tr>
          </thead>
          <tbody>
            {cryptos.map(c => (
              <tr key={c.id} onClick={() => setSelected(c)} className={`cursor-pointer ${selected?.id === c.id ? 'bg-bb-amber/10' : ''}`}>
                <td className="text-bb-amber font-semibold">{c.id}</td>
                <td>{c.n}</td>
                <td className="text-right font-bold">{c.pr < 1 ? round(c.pr, 4) : formatNumber(c.pr)}</td>
                <td className={`text-right ${colorClass(c.chg)}`}>
                  {c.chg > 0 ? '+' : ''}{Math.abs(c.chg) < 1 ? round(c.chg, 4) : formatNumber(c.chg)}
                </td>
                <td className={`text-right ${colorClass(c.chgPct)}`}>{formatPercent(c.chgPct)}</td>
                <td className="text-right text-bb-muted">${round(c.vol24h / 1e9, 1)}B</td>
                <td className="text-right text-bb-muted">${round(c.mcap / 1e9, 1)}B</td>
                <td className="text-right text-bb-muted">{round(c.dom, 1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      {selected && (
        <>
          <Panel title={`${selected.n} (${selected.id}) — 30D`} className="col-span-5 row-span-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={selected.priceHistory}>
                <defs>
                  <linearGradient id="cryptoGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f7931a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f7931a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: '#6a6a6a', fontSize: 8 }} tickFormatter={v => v.slice(5)} interval={5} />
                <YAxis domain={['dataMin', 'dataMax']} tick={{ fill: '#6a6a6a', fontSize: 8 }} width={60} tickFormatter={v => '$' + round(v, 0).toLocaleString()} />
                <Tooltip {...tt} formatter={v => '$' + formatNumber(v)} />
                <Area type="monotone" dataKey="price" stroke="#f7931a" fill="url(#cryptoGrad)" strokeWidth={1.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title={`${selected.id} Details`} className="col-span-5 row-span-2">
            <div className="grid grid-cols-2 gap-2 text-[10px] p-0.5">
              <div className="text-center py-2 border border-bb-border bg-bb-dark">
                <div className="text-bb-muted text-[9px]">PRICE</div>
                <div className="text-lg font-bold text-bb-white">${formatNumber(selected.pr)}</div>
                <div className={`text-[10px] font-bold ${colorClass(selected.chgPct)}`}>{formatPercent(selected.chgPct)}</div>
              </div>
              <div className="text-center py-2 border border-bb-border bg-bb-dark">
                <div className="text-bb-muted text-[9px]">MARKET CAP</div>
                <div className="text-lg font-bold text-bb-white">${round(selected.mcap / 1e9, 1)}B</div>
              </div>
              <table className="bb-table col-span-2"><tbody>
                {[
                  ['ATH', '$' + formatNumber(selected.ath)],
                  ['Supply', formatNumber(selected.supply / 1e6, 1) + 'M'],
                  ['24h Vol', '$' + round(selected.vol24h / 1e9, 1) + 'B'],
                  ['Dominance', round(selected.dom, 2) + '%'],
                ].map(([l, v]) => (
                  <tr key={l}><td className="text-bb-muted">{l}</td><td className="text-right font-bold">{v}</td></tr>
                ))}
              </tbody></table>
            </div>
          </Panel>
        </>
      )}
    </div>
  );
}

export default memo(Crypto);
