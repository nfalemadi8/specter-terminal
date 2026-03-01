import { useState, memo, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Panel from '../layout/Panel';
import { stocks, generatePriceHistory } from '../../data/stocks';
import { formatNumber, formatPercent, formatChange, colorClass, round } from '../../utils/format';

const chartTooltip = {
  contentStyle: { background: '#1a1a1a', border: '1px solid #2a2a2a', fontSize: '10px', fontFamily: 'monospace' },
  labelStyle: { color: '#ffbf00', fontSize: '10px' },
};

function Equities() {
  const [selected, setSelected] = useState(stocks[0]);
  const history = useMemo(() => generatePriceHistory(selected.price, 90), [selected.symbol]);

  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      <Panel title="Equity Screener" className="col-span-5 row-span-6">
        <table className="bb-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Name</th>
              <th className="text-right">Price</th>
              <th className="text-right">Chg</th>
              <th className="text-right">Chg%</th>
              <th className="text-right">Vol</th>
              <th className="text-right">MCap</th>
              <th className="text-right">P/E</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map(s => (
              <tr
                key={s.symbol}
                className={`cursor-pointer ${selected.symbol === s.symbol ? 'bg-bb-blue/10' : ''}`}
                onClick={() => setSelected(s)}
              >
                <td className="text-bb-amber">{s.symbol}</td>
                <td className="text-bb-white">{s.name}</td>
                <td className="text-right">{formatNumber(s.price)}</td>
                <td className={`text-right ${colorClass(s.change)}`}>{formatChange(s.change)}</td>
                <td className={`text-right ${colorClass(s.changePct)}`}>{formatPercent(s.changePct)}</td>
                <td className="text-right text-bb-muted">{s.volume}</td>
                <td className="text-right text-bb-muted">{s.marketCap}</td>
                <td className="text-right">{s.pe}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <div className="col-span-7 row-span-6 flex flex-col gap-[3px]">
        <Panel title={`${selected.symbol} — ${selected.name}`} className="flex-1">
          <div className="flex gap-4 mb-2 text-[10px]">
            <div><span className="text-bb-muted">Last: </span><span className="text-bb-white font-bold text-sm">{formatNumber(selected.price)}</span></div>
            <div><span className="text-bb-muted">Chg: </span><span className={colorClass(selected.change)}>{formatChange(selected.change)} ({formatPercent(selected.changePct)})</span></div>
            <div><span className="text-bb-muted">Vol: </span><span>{selected.volume}</span></div>
            <div><span className="text-bb-muted">MCap: </span><span>{selected.marketCap}</span></div>
            <div><span className="text-bb-muted">P/E: </span><span>{selected.pe}</span></div>
            <div><span className="text-bb-muted">52H: </span><span className="text-bb-green">{formatNumber(selected.high52)}</span></div>
            <div><span className="text-bb-muted">52L: </span><span className="text-bb-red">{formatNumber(selected.low52)}</span></div>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4a9eff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4a9eff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: '#6a6a6a', fontSize: 9 }} tickFormatter={v => v.slice(5)} interval={15} />
                <YAxis domain={['dataMin', 'dataMax']} tick={{ fill: '#6a6a6a', fontSize: 9 }} width={50} />
                <Tooltip {...chartTooltip} />
                <Area type="monotone" dataKey="price" stroke="#4a9eff" fill="url(#eqGrad)" strokeWidth={1.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title={`${selected.symbol} — Volume`} className="h-[140px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={history.slice(-30)}>
              <XAxis dataKey="date" tick={{ fill: '#6a6a6a', fontSize: 9 }} tickFormatter={v => v.slice(8)} />
              <YAxis tick={{ fill: '#6a6a6a', fontSize: 9 }} tickFormatter={v => round(v / 1e6, 0) + 'M'} width={40} />
              <Tooltip {...chartTooltip} />
              <Bar dataKey="volume" fill="#4a9eff" opacity={0.6} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>
    </div>
  );
}

export default memo(Equities);
