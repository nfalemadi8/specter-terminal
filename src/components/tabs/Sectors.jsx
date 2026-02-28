import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Panel from '../layout/Panel';
import { sectorPerformance } from '../../data/stocks';
import { formatPercent, colorClass } from '../../utils/format';

const sectorDetail = sectorPerformance.map(s => ({
  ...s,
  week: parseFloat((s.change * 2.5 + (Math.random() - 0.5) * 2).toFixed(2)),
  month: parseFloat((s.change * 8 + (Math.random() - 0.5) * 5).toFixed(2)),
}));

export default function Sectors() {
  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      <Panel title="Sector Performance — Daily Change %" className="col-span-7 row-span-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sectorDetail} layout="vertical" margin={{ left: 100 }}>
            <XAxis type="number" tick={{ fill: '#6a6a6a', fontSize: 9 }} tickFormatter={v => v + '%'} />
            <YAxis type="category" dataKey="sector" tick={{ fill: '#e0e0e0', fontSize: 9 }} width={95} />
            <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', fontSize: '10px' }} formatter={v => v + '%'} />
            <Bar dataKey="change" fill="#4a9eff">
              {sectorDetail.map((entry, i) => (
                <rect key={i} fill={entry.change >= 0 ? '#00d26a' : '#ff3b3b'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Panel>

      <Panel title="YTD Performance" className="col-span-5 row-span-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sectorDetail} layout="vertical" margin={{ left: 100 }}>
            <XAxis type="number" tick={{ fill: '#6a6a6a', fontSize: 9 }} tickFormatter={v => v + '%'} />
            <YAxis type="category" dataKey="sector" tick={{ fill: '#e0e0e0', fontSize: 9 }} width={95} />
            <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', fontSize: '10px' }} formatter={v => v + '%'} />
            <Bar dataKey="ytd" fill="#4a9eff">
              {sectorDetail.map((entry, i) => (
                <rect key={i} fill={entry.ytd >= 0 ? '#00d26a' : '#ff3b3b'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Panel>

      <Panel title="Sector Breakdown" className="col-span-12 row-span-3">
        <table className="bb-table">
          <thead>
            <tr>
              <th>Sector</th>
              <th className="text-right">Daily</th>
              <th className="text-right">Weekly</th>
              <th className="text-right">Monthly</th>
              <th className="text-right">YTD</th>
              <th className="text-right">S&P Weight</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            {sectorDetail.map(s => (
              <tr key={s.sector}>
                <td className="text-bb-amber">{s.sector}</td>
                <td className={`text-right ${colorClass(s.change)}`}>{formatPercent(s.change)}</td>
                <td className={`text-right ${colorClass(s.week)}`}>{formatPercent(s.week)}</td>
                <td className={`text-right ${colorClass(s.month)}`}>{formatPercent(s.month)}</td>
                <td className={`text-right ${colorClass(s.ytd)}`}>{formatPercent(s.ytd)}</td>
                <td className="text-right">{s.weight.toFixed(1)}%</td>
                <td>
                  <div className="w-20 h-2 bg-bb-dark rounded overflow-hidden">
                    <div
                      className={`h-full ${s.change >= 0 ? 'bg-bb-green' : 'bg-bb-red'}`}
                      style={{ width: `${Math.min(Math.abs(s.change) * 30, 100)}%` }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
