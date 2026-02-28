import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Panel from '../layout/Panel';
import { commodities, generateCommodityHistory } from '../../data/commodities';
import { formatNumber, formatPercent, formatChange, colorClass } from '../../utils/format';

const chartTooltip = {
  contentStyle: { background: '#1a1a1a', border: '1px solid #2a2a2a', fontSize: '10px', fontFamily: 'monospace' },
  labelStyle: { color: '#ffbf00', fontSize: '10px' },
};

export default function Commodities() {
  const [selected, setSelected] = useState(commodities[0]);
  const history = generateCommodityHistory(selected.price, 60);

  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      <Panel title="Commodities" className="col-span-5 row-span-6">
        <table className="bb-table">
          <thead>
            <tr>
              <th>Sym</th>
              <th>Name</th>
              <th className="text-right">Price</th>
              <th className="text-right">Chg</th>
              <th className="text-right">Chg%</th>
              <th className="text-right">Unit</th>
            </tr>
          </thead>
          <tbody>
            {commodities.map(c => (
              <tr
                key={c.symbol}
                className={`cursor-pointer ${selected.symbol === c.symbol ? 'bg-bb-blue/10' : ''}`}
                onClick={() => setSelected(c)}
              >
                <td className="text-bb-amber">{c.symbol}</td>
                <td>{c.name}</td>
                <td className="text-right">{formatNumber(c.price, c.price < 10 ? 3 : 2)}</td>
                <td className={`text-right ${colorClass(c.change)}`}>{formatChange(c.change, c.price < 10 ? 3 : 2)}</td>
                <td className={`text-right ${colorClass(c.changePct)}`}>{formatPercent(c.changePct)}</td>
                <td className="text-right text-bb-muted">{c.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel title={`${selected.name} (${selected.symbol}) — 60D`} className="col-span-7 row-span-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history}>
            <defs>
              <linearGradient id="cmdGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff8c00" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ff8c00" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fill: '#6a6a6a', fontSize: 9 }} tickFormatter={v => v.slice(5)} interval={10} />
            <YAxis domain={['dataMin', 'dataMax']} tick={{ fill: '#6a6a6a', fontSize: 9 }} width={50} />
            <Tooltip {...chartTooltip} />
            <Area type="monotone" dataKey="price" stroke="#ff8c00" fill="url(#cmdGrad)" strokeWidth={1.5} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </Panel>

      <Panel title="Commodity Details" className="col-span-7 row-span-2">
        <div className="grid grid-cols-3 gap-4 p-2">
          <div>
            <div className="text-bb-muted text-[10px]">LAST PRICE</div>
            <div className="text-bb-white text-lg font-bold">{formatNumber(selected.price, selected.price < 10 ? 3 : 2)}</div>
          </div>
          <div>
            <div className="text-bb-muted text-[10px]">CHANGE</div>
            <div className={`text-lg font-bold ${colorClass(selected.change)}`}>{formatChange(selected.change, selected.price < 10 ? 3 : 2)}</div>
          </div>
          <div>
            <div className="text-bb-muted text-[10px]">CHANGE %</div>
            <div className={`text-lg font-bold ${colorClass(selected.changePct)}`}>{formatPercent(selected.changePct)}</div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
