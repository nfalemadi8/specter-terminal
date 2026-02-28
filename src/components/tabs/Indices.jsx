import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Panel from '../layout/Panel';
import { indices, generatePriceHistory } from '../../data/stocks';
import { formatNumber, formatPercent, formatChange, colorClass } from '../../utils/format';

const globalIndices = [
  { symbol: 'FTSE', name: 'FTSE 100', price: 7682.50, change: 42.18, changePct: 0.55 },
  { symbol: 'DAX', name: 'DAX 40', price: 16751.64, change: 89.32, changePct: 0.54 },
  { symbol: 'CAC', name: 'CAC 40', price: 7557.87, change: 28.44, changePct: 0.38 },
  { symbol: 'N225', name: 'Nikkei 225', price: 33763.18, change: 456.72, changePct: 1.37 },
  { symbol: 'HSI', name: 'Hang Seng', price: 16589.44, change: -187.42, changePct: -1.12 },
  { symbol: 'SSEC', name: 'Shanghai Comp.', price: 2942.56, change: -18.34, changePct: -0.62 },
  { symbol: 'KOSPI', name: 'KOSPI', price: 2578.48, change: 22.18, changePct: 0.87 },
  { symbol: 'ASX', name: 'ASX 200', price: 7542.80, change: 38.64, changePct: 0.51 },
];

const spxHistory = generatePriceHistory(4567.18, 60);

export default function Indices() {
  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      <Panel title="US Indices" className="col-span-5 row-span-3">
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
            {indices.map(i => (
              <tr key={i.symbol}>
                <td className="text-bb-amber">{i.symbol}</td>
                <td>{i.name}</td>
                <td className="text-right">{formatNumber(i.price)}</td>
                <td className={`text-right ${colorClass(i.change)}`}>{formatChange(i.change)}</td>
                <td className={`text-right ${colorClass(i.changePct)}`}>{formatPercent(i.changePct)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel title="S&P 500 — 60D" className="col-span-7 row-span-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={spxHistory}>
            <defs>
              <linearGradient id="idxGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4a9eff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4a9eff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fill: '#6a6a6a', fontSize: 9 }} tickFormatter={v => v.slice(5)} interval={10} />
            <YAxis domain={['dataMin', 'dataMax']} tick={{ fill: '#6a6a6a', fontSize: 9 }} width={50} />
            <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', fontSize: '10px' }} />
            <Area type="monotone" dataKey="price" stroke="#4a9eff" fill="url(#idxGrad)" strokeWidth={1.5} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </Panel>

      <Panel title="Global Indices" className="col-span-12 row-span-3">
        <table className="bb-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Name</th>
              <th className="text-right">Last</th>
              <th className="text-right">Change</th>
              <th className="text-right">Chg%</th>
            </tr>
          </thead>
          <tbody>
            {globalIndices.map(i => (
              <tr key={i.symbol}>
                <td className="text-bb-amber">{i.symbol}</td>
                <td>{i.name}</td>
                <td className="text-right">{formatNumber(i.price)}</td>
                <td className={`text-right ${colorClass(i.change)}`}>{formatChange(i.change)}</td>
                <td className={`text-right ${colorClass(i.changePct)}`}>{formatPercent(i.changePct)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
