import Panel from '../layout/Panel';
import { earningsCalendar } from '../../data/economic';
import { colorClass } from '../../utils/format';

export default function Earnings() {
  const upcoming = earningsCalendar.filter(e => !e.actual);
  const reported = earningsCalendar.filter(e => e.actual);

  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      <Panel title="Upcoming Earnings" className="col-span-6 row-span-6">
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

      <Panel title="Recent Earnings" className="col-span-6 row-span-6">
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
