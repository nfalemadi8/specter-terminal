import Panel from '../layout/Panel';
import { stocks } from '../../data/stocks';
import { watchlist } from '../../data/news';
import { formatNumber, formatPercent, formatChange, colorClass } from '../../utils/format';

const watchlistStocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META', 'NFLX', 'JPM', 'V'];
const watchlistData = stocks.filter(s => watchlistStocks.includes(s.symbol));

export default function Watchlist() {
  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      <Panel title="Watchlist" className="col-span-8 row-span-6">
        <table className="bb-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Name</th>
              <th className="text-right">Price</th>
              <th className="text-right">Chg</th>
              <th className="text-right">Chg%</th>
              <th className="text-right">Volume</th>
              <th className="text-right">52w High</th>
              <th className="text-right">52w Low</th>
              <th>Sector</th>
            </tr>
          </thead>
          <tbody>
            {watchlistData.map(s => (
              <tr key={s.symbol}>
                <td className="text-bb-amber">{s.symbol}</td>
                <td>{s.name}</td>
                <td className="text-right font-bold">{formatNumber(s.price)}</td>
                <td className={`text-right ${colorClass(s.change)}`}>{formatChange(s.change)}</td>
                <td className={`text-right ${colorClass(s.changePct)}`}>{formatPercent(s.changePct)}</td>
                <td className="text-right text-bb-muted">{s.volume}</td>
                <td className="text-right text-bb-green">{formatNumber(s.high52)}</td>
                <td className="text-right text-bb-red">{formatNumber(s.low52)}</td>
                <td className="text-bb-muted">{s.sector}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel title="Price Alerts" className="col-span-4 row-span-6">
        <table className="bb-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Alert</th>
              <th className="text-right">Target</th>
              <th className="text-right">Current</th>
              <th className="text-right">Distance</th>
            </tr>
          </thead>
          <tbody>
            {watchlist.map(w => {
              const distance = ((w.target - w.current) / w.current * 100);
              return (
                <tr key={w.symbol}>
                  <td className="text-bb-amber">{w.symbol}</td>
                  <td className={w.alert === 'above' ? 'text-bb-green' : 'text-bb-red'}>
                    {w.alert.toUpperCase()}
                  </td>
                  <td className="text-right">{formatNumber(w.target)}</td>
                  <td className="text-right">{formatNumber(w.current)}</td>
                  <td className={`text-right ${colorClass(distance)}`}>{formatPercent(distance)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
