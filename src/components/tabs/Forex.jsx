import Panel from '../layout/Panel';
import { forexPairs } from '../../data/forex';
import { formatNumber, formatPercent, colorClass } from '../../utils/format';

export default function Forex() {
  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      <Panel title="Major FX Pairs" className="col-span-12 row-span-6">
        <table className="bb-table">
          <thead>
            <tr>
              <th>Pair</th>
              <th className="text-right">Bid</th>
              <th className="text-right">Ask</th>
              <th className="text-right">Spread</th>
              <th className="text-right">Change</th>
              <th className="text-right">Chg%</th>
              <th className="text-right">High</th>
              <th className="text-right">Low</th>
            </tr>
          </thead>
          <tbody>
            {forexPairs.map(f => {
              const spread = ((f.ask - f.bid) * (f.bid > 100 ? 100 : 10000)).toFixed(1);
              return (
                <tr key={f.pair}>
                  <td className="text-bb-amber font-semibold">{f.pair}</td>
                  <td className="text-right">{formatNumber(f.bid, f.bid > 100 ? 2 : 4)}</td>
                  <td className="text-right">{formatNumber(f.ask, f.ask > 100 ? 2 : 4)}</td>
                  <td className="text-right text-bb-muted">{spread}</td>
                  <td className={`text-right ${colorClass(f.change)}`}>{f.change > 0 ? '+' : ''}{formatNumber(f.change, 4)}</td>
                  <td className={`text-right ${colorClass(f.changePct)}`}>{formatPercent(f.changePct)}</td>
                  <td className="text-right text-bb-green">{formatNumber(f.high, f.high > 100 ? 2 : 4)}</td>
                  <td className="text-right text-bb-red">{formatNumber(f.low, f.low > 100 ? 2 : 4)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
