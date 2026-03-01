import { memo, useMemo } from 'react';
import Panel from '../layout/Panel';
import { earningsCalendar } from '../../data/economic';
import { colorClass } from '../../utils/format';

function Earnings() {
  const upcoming = useMemo(() => earningsCalendar.filter(e => !e.actual), []);
  const reported = useMemo(() => earningsCalendar.filter(e => e.actual), []);

  const beats = useMemo(() => reported.filter(e => e.surprise && parseFloat(e.surprise) > 0).length, [reported]);
  const misses = reported.length - beats;
  const beatRate = reported.length > 0 ? (beats / reported.length * 100) : 0;

  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      <Panel title="Earnings Summary" className="col-span-12 row-span-1">
        <div className="flex items-center gap-4 text-[10px] p-0.5">
          <div className="flex items-center gap-2">
            <span className="text-bb-muted">Upcoming:</span>
            <span className="text-bb-amber font-bold text-sm">{upcoming.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-bb-muted">Reported:</span>
            <span className="font-bold text-sm">{reported.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-bb-muted">Beats:</span>
            <span className="text-bb-green font-bold text-sm">{beats}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-bb-muted">Misses:</span>
            <span className="text-bb-red font-bold text-sm">{misses}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-bb-muted">Beat Rate:</span>
            <span className={`font-bold text-sm ${beatRate >= 50 ? 'text-bb-green' : 'text-bb-red'}`}>{Math.round(beatRate)}%</span>
          </div>
          <div className="flex-1 h-2 bg-bb-dark border border-bb-border rounded-sm overflow-hidden">
            <div className="h-full bg-bb-green" style={{ width: `${beatRate}%` }} />
          </div>
        </div>
      </Panel>

      <Panel title="Upcoming Earnings" className="col-span-6 row-span-5">
        <table className="bb-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Company</th>
              <th>Date</th>
              <th>Time</th>
              <th className="text-right">EPS Est.</th>
            </tr>
          </thead>
          <tbody>
            {upcoming.map(e => (
              <tr key={e.symbol}>
                <td className="text-bb-amber">{e.symbol}</td>
                <td>{e.name}</td>
                <td className="text-bb-white">{e.date}</td>
                <td className="text-bb-muted">{e.time}</td>
                <td className="text-right">${e.estimate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel title="Recent Earnings" className="col-span-6 row-span-5">
        <table className="bb-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Company</th>
              <th>Date</th>
              <th className="text-right">Estimate</th>
              <th className="text-right">Actual</th>
              <th className="text-right">Surprise</th>
            </tr>
          </thead>
          <tbody>
            {reported.map(e => {
              const surpriseVal = e.surprise ? parseFloat(e.surprise) : 0;
              return (
                <tr key={e.symbol}>
                  <td className="text-bb-amber">{e.symbol}</td>
                  <td>{e.name}</td>
                  <td className="text-bb-muted">{e.date}</td>
                  <td className="text-right">${e.estimate}</td>
                  <td className="text-right font-bold">${e.actual}</td>
                  <td className={`text-right ${colorClass(surpriseVal)}`}>
                    <span className={`text-[9px] px-1 py-[1px] rounded ${
                      surpriseVal > 0 ? 'bg-bb-green/20 text-bb-green' : 'bg-bb-red/20 text-bb-red'
                    }`}>{e.surprise}</span>
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

export default memo(Earnings);
