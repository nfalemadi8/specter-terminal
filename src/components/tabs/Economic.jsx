import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Panel from '../layout/Panel';
import { economicIndicators, economicCalendar, fedRateHistory } from '../../data/economic';
import { colorClass } from '../../utils/format';

const chartTooltip = {
  contentStyle: { background: '#1a1a1a', border: '1px solid #2a2a2a', fontSize: '10px', fontFamily: 'monospace' },
  labelStyle: { color: '#ffbf00', fontSize: '10px' },
};

export default function Economic() {
  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      <Panel title="Key Economic Indicators" className="col-span-6 row-span-3">
        <table className="bb-table">
          <thead>
            <tr>
              <th>Indicator</th>
              <th className="text-right">Actual</th>
              <th className="text-right">Forecast</th>
              <th className="text-right">Previous</th>
              <th className="text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {economicIndicators.map(e => (
              <tr key={e.name}>
                <td className="text-bb-white">{e.name}</td>
                <td className="text-right font-bold">{e.value}</td>
                <td className="text-right text-bb-muted">{e.forecast}</td>
                <td className="text-right text-bb-muted">{e.previous}</td>
                <td className="text-right">
                  <span className={`text-[9px] px-1 py-[1px] rounded ${
                    e.status === 'beat' ? 'bg-bb-green/20 text-bb-green' :
                    e.status === 'miss' ? 'bg-bb-red/20 text-bb-red' :
                    'bg-bb-muted/20 text-bb-muted'
                  }`}>{e.status.toUpperCase()}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel title="Fed Funds Rate History" className="col-span-6 row-span-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={[...fedRateHistory].reverse()}>
            <defs>
              <linearGradient id="fedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff8c00" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ff8c00" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fill: '#6a6a6a', fontSize: 9 }} />
            <YAxis domain={[0, 6]} tick={{ fill: '#6a6a6a', fontSize: 9 }} tickFormatter={v => v.toFixed(1) + '%'} width={40} />
            <Tooltip {...chartTooltip} formatter={v => v.toFixed(2) + '%'} />
            <Area type="stepAfter" dataKey="rate" stroke="#ff8c00" fill="url(#fedGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </Panel>

      <Panel title="Economic Calendar" className="col-span-12 row-span-3">
        <table className="bb-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Time</th>
              <th>Event</th>
              <th>Country</th>
              <th className="text-right">Forecast</th>
              <th className="text-right">Previous</th>
              <th>Impact</th>
            </tr>
          </thead>
          <tbody>
            {economicCalendar.map((e, i) => (
              <tr key={i}>
                <td className="text-bb-amber">{e.date}</td>
                <td className="text-bb-muted">{e.time}</td>
                <td className="text-bb-white">{e.event}</td>
                <td className="text-bb-muted">{e.country}</td>
                <td className="text-right">{e.forecast}</td>
                <td className="text-right text-bb-muted">{e.previous}</td>
                <td>
                  <span className={`text-[9px] px-1 py-[1px] rounded ${
                    e.impact === 'high' ? 'bg-bb-red/20 text-bb-red' :
                    e.impact === 'medium' ? 'bg-bb-yellow/20 text-bb-yellow' :
                    'bg-bb-muted/20 text-bb-muted'
                  }`}>{e.impact.toUpperCase()}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
