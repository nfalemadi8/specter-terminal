import Panel from '../layout/Panel';
import { formatNumber, formatPercent, formatChange, colorClass } from '../../utils/format';

const futuresData = [
  { symbol: 'ES', name: 'E-mini S&P 500', month: 'Mar 24', last: 4572.25, change: 28.50, changePct: 0.63, volume: '1.2M', oi: '2.8M' },
  { symbol: 'NQ', name: 'E-mini Nasdaq', month: 'Mar 24', last: 16125.50, change: 142.75, changePct: 0.89, volume: '842K', oi: '1.4M' },
  { symbol: 'YM', name: 'E-mini Dow', month: 'Mar 24', last: 35482.00, change: 138.00, changePct: 0.39, volume: '425K', oi: '680K' },
  { symbol: 'RTY', name: 'E-mini Russell', month: 'Mar 24', last: 1865.20, change: -7.80, changePct: -0.42, volume: '312K', oi: '520K' },
  { symbol: 'CL', name: 'Crude Oil', month: 'Feb 24', last: 78.42, change: -1.28, changePct: -1.61, volume: '845K', oi: '1.6M' },
  { symbol: 'GC', name: 'Gold', month: 'Feb 24', last: 2024.50, change: 12.30, changePct: 0.61, volume: '425K', oi: '890K' },
  { symbol: 'SI', name: 'Silver', month: 'Mar 24', last: 24.18, change: 0.42, changePct: 1.77, volume: '128K', oi: '245K' },
  { symbol: 'ZB', name: '30Y T-Bond', month: 'Mar 24', last: 122.28, change: 0.84, changePct: 0.69, volume: '520K', oi: '1.1M' },
  { symbol: 'ZN', name: '10Y T-Note', month: 'Mar 24', last: 112.16, change: 0.42, changePct: 0.38, volume: '1.4M', oi: '3.2M' },
  { symbol: 'ZC', name: 'Corn', month: 'Mar 24', last: 487.25, change: 3.50, changePct: 0.72, volume: '245K', oi: '680K' },
  { symbol: 'ZW', name: 'Wheat', month: 'Mar 24', last: 612.50, change: -8.75, changePct: -1.41, volume: '128K', oi: '345K' },
  { symbol: 'ZS', name: 'Soybeans', month: 'Mar 24', last: 1342.75, change: 11.25, changePct: 0.85, volume: '185K', oi: '425K' },
  { symbol: '6E', name: 'Euro FX', month: 'Mar 24', last: 1.0894, change: -0.0018, changePct: -0.17, volume: '312K', oi: '580K' },
  { symbol: '6J', name: 'Japanese Yen', month: 'Mar 24', last: 0.006694, change: -0.000016, changePct: -0.24, volume: '185K', oi: '320K' },
  { symbol: '6B', name: 'British Pound', month: 'Mar 24', last: 1.2718, change: 0.0024, changePct: 0.19, volume: '98K', oi: '210K' },
];

export default function Futures() {
  return (
    <div className="h-full grid grid-cols-12 grid-rows-1 gap-[3px] p-[3px]">
      <Panel title="Futures Market" className="col-span-12">
        <table className="bb-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Name</th>
              <th>Month</th>
              <th className="text-right">Last</th>
              <th className="text-right">Change</th>
              <th className="text-right">Chg%</th>
              <th className="text-right">Volume</th>
              <th className="text-right">Open Int.</th>
            </tr>
          </thead>
          <tbody>
            {futuresData.map(f => (
              <tr key={f.symbol}>
                <td className="text-bb-amber">{f.symbol}</td>
                <td>{f.name}</td>
                <td className="text-bb-muted">{f.month}</td>
                <td className="text-right">{formatNumber(f.last, f.last < 10 ? 6 : 2)}</td>
                <td className={`text-right ${colorClass(f.change)}`}>{formatChange(f.change, f.last < 10 ? 4 : 2)}</td>
                <td className={`text-right ${colorClass(f.changePct)}`}>{formatPercent(f.changePct)}</td>
                <td className="text-right text-bb-muted">{f.volume}</td>
                <td className="text-right text-bb-muted">{f.oi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
