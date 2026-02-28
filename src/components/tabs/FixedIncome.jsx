import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Panel from '../layout/Panel';
import { treasuries, corporateBonds, generateYieldCurve } from '../../data/bonds';
import { formatNumber, formatChange, colorClass } from '../../utils/format';

const yieldCurve = generateYieldCurve();
const chartTooltip = {
  contentStyle: { background: '#1a1a1a', border: '1px solid #2a2a2a', fontSize: '10px', fontFamily: 'monospace' },
  labelStyle: { color: '#ffbf00', fontSize: '10px' },
};

export default function FixedIncome() {
  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      <Panel title="US Treasury Yield Curve" className="col-span-7 row-span-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={yieldCurve}>
            <defs>
              <linearGradient id="ycGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffd700" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ffd700" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="label" tick={{ fill: '#6a6a6a', fontSize: 9 }} />
            <YAxis domain={[3.5, 6]} tick={{ fill: '#6a6a6a', fontSize: 9 }} tickFormatter={v => v.toFixed(1) + '%'} width={40} />
            <Tooltip {...chartTooltip} formatter={v => v.toFixed(2) + '%'} />
            <Area type="monotone" dataKey="yield" stroke="#ffd700" fill="url(#ycGrad)" strokeWidth={2} dot={{ fill: '#ffd700', r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </Panel>

      <Panel title="Treasury Rates" className="col-span-5 row-span-3">
        <table className="bb-table">
          <thead>
            <tr>
              <th>Maturity</th>
              <th className="text-right">Yield</th>
              <th className="text-right">Change</th>
              <th className="text-right">Previous</th>
            </tr>
          </thead>
          <tbody>
            {treasuries.map(t => (
              <tr key={t.maturity}>
                <td className="text-bb-amber">{t.maturity}</td>
                <td className="text-right font-bold">{t.yield.toFixed(2)}%</td>
                <td className={`text-right ${colorClass(t.change)}`}>{formatChange(t.change, 2)}bp</td>
                <td className="text-right text-bb-muted">{t.prev.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel title="Corporate Bonds" className="col-span-12 row-span-3">
        <table className="bb-table">
          <thead>
            <tr>
              <th>Issuer</th>
              <th className="text-right">Coupon</th>
              <th className="text-right">Maturity</th>
              <th>Rating</th>
              <th className="text-right">Yield</th>
              <th className="text-right">Spread (bp)</th>
              <th className="text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {corporateBonds.map(b => (
              <tr key={b.issuer}>
                <td className="text-bb-amber">{b.issuer}</td>
                <td className="text-right">{b.coupon.toFixed(2)}%</td>
                <td className="text-right">{b.maturity}</td>
                <td>
                  <span className={`px-1 py-[1px] rounded text-[9px] ${
                    b.rating.startsWith('AA') ? 'bg-bb-green/20 text-bb-green' :
                    b.rating.startsWith('A') ? 'bg-bb-blue/20 text-bb-blue' :
                    b.rating.startsWith('BBB') ? 'bg-bb-yellow/20 text-bb-yellow' :
                    'bg-bb-orange/20 text-bb-orange'
                  }`}>{b.rating}</span>
                </td>
                <td className="text-right">{b.yield.toFixed(2)}%</td>
                <td className="text-right">{b.spread}</td>
                <td className="text-right">{formatNumber(b.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
