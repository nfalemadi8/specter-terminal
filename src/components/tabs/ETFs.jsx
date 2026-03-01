import Panel from '../layout/Panel';
import { formatNumber, formatPercent, formatChange, colorClass, round } from '../../utils/format';

const etfData = [
  { symbol: 'SPY', name: 'SPDR S&P 500', price: 456.72, change: 2.68, changePct: 0.59, volume: '68.2M', aum: '480.2B', expense: 0.09, category: 'Large Blend' },
  { symbol: 'QQQ', name: 'Invesco QQQ', price: 389.45, change: 3.42, changePct: 0.89, volume: '42.8M', aum: '225.4B', expense: 0.20, category: 'Large Growth' },
  { symbol: 'IWM', name: 'iShares Russell 2000', price: 186.28, change: -0.84, changePct: -0.45, volume: '28.4M', aum: '62.8B', expense: 0.19, category: 'Small Blend' },
  { symbol: 'VTI', name: 'Vanguard Total Market', price: 234.56, change: 1.42, changePct: 0.61, volume: '4.2M', aum: '368.7B', expense: 0.03, category: 'Large Blend' },
  { symbol: 'DIA', name: 'SPDR Dow Jones', price: 354.18, change: 1.32, changePct: 0.37, volume: '3.8M', aum: '32.4B', expense: 0.16, category: 'Large Value' },
  { symbol: 'GLD', name: 'SPDR Gold Trust', price: 188.92, change: 1.15, changePct: 0.61, volume: '8.4M', aum: '57.2B', expense: 0.40, category: 'Commodities' },
  { symbol: 'TLT', name: 'iShares 20+ Treasury', price: 92.45, change: 0.68, changePct: 0.74, volume: '32.8M', aum: '38.9B', expense: 0.15, category: 'Long Govt.' },
  { symbol: 'XLK', name: 'Technology Select', price: 192.38, change: 2.14, changePct: 1.12, volume: '8.2M', aum: '52.4B', expense: 0.10, category: 'Technology' },
  { symbol: 'XLF', name: 'Financial Select', price: 37.84, change: 0.28, changePct: 0.74, volume: '42.6M', aum: '38.2B', expense: 0.10, category: 'Financial' },
  { symbol: 'XLE', name: 'Energy Select', price: 82.56, change: -1.84, changePct: -2.18, volume: '18.4M', aum: '36.8B', expense: 0.10, category: 'Energy' },
  { symbol: 'VWO', name: 'Vanguard EM', price: 39.84, change: -0.32, changePct: -0.80, volume: '12.4M', aum: '72.4B', expense: 0.08, category: 'Emerging Mkts' },
  { symbol: 'EFA', name: 'iShares EAFE', price: 74.28, change: 0.42, changePct: 0.57, volume: '18.2M', aum: '58.4B', expense: 0.32, category: 'Foreign Large' },
  { symbol: 'HYG', name: 'iShares High Yield', price: 76.42, change: 0.18, changePct: 0.24, volume: '28.4M', aum: '16.8B', expense: 0.49, category: 'High Yield' },
  { symbol: 'LQD', name: 'iShares IG Corp', price: 108.56, change: 0.42, changePct: 0.39, volume: '18.6M', aum: '32.4B', expense: 0.14, category: 'Corp Bond' },
  { symbol: 'ARKK', name: 'ARK Innovation', price: 48.72, change: 1.84, changePct: 3.92, volume: '24.8M', aum: '8.2B', expense: 0.75, category: 'Large Growth' },
];

export default function ETFs() {
  return (
    <div className="h-full grid grid-cols-12 grid-rows-1 gap-[3px] p-[3px]">
      <Panel title="Exchange-Traded Funds" className="col-span-12">
        <table className="bb-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Name</th>
              <th>Category</th>
              <th className="text-right">Price</th>
              <th className="text-right">Chg</th>
              <th className="text-right">Chg%</th>
              <th className="text-right">Volume</th>
              <th className="text-right">AUM</th>
              <th className="text-right">Expense</th>
            </tr>
          </thead>
          <tbody>
            {etfData.map(e => (
              <tr key={e.symbol}>
                <td className="text-bb-amber">{e.symbol}</td>
                <td>{e.name}</td>
                <td className="text-bb-muted">{e.category}</td>
                <td className="text-right">{formatNumber(e.price)}</td>
                <td className={`text-right ${colorClass(e.change)}`}>{formatChange(e.change)}</td>
                <td className={`text-right ${colorClass(e.changePct)}`}>{formatPercent(e.changePct)}</td>
                <td className="text-right text-bb-muted">{e.volume}</td>
                <td className="text-right text-bb-muted">{e.aum}</td>
                <td className="text-right">{round(e.expense, 2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
