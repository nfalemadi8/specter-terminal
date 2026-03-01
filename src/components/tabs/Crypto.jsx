import { memo } from 'react';
import Panel from '../layout/Panel';
import { cryptoPairs } from '../../data/forex';
import { formatNumber, formatPercent, colorClass } from '../../utils/format';

function Crypto() {
  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      <Panel title="Cryptocurrency Market" className="col-span-12 row-span-6">
        <table className="bb-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Name</th>
              <th className="text-right">Price</th>
              <th className="text-right">24h Change</th>
              <th className="text-right">24h Chg%</th>
              <th className="text-right">24h Volume</th>
              <th className="text-right">Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {cryptoPairs.map(c => (
              <tr key={c.symbol}>
                <td className="text-bb-amber font-semibold">{c.symbol}</td>
                <td>{c.name}</td>
                <td className="text-right font-bold">{formatNumber(c.price, c.price < 1 ? 4 : 2)}</td>
                <td className={`text-right ${colorClass(c.change)}`}>
                  {c.change > 0 ? '+' : ''}{formatNumber(c.change, c.change < 1 ? 4 : 2)}
                </td>
                <td className={`text-right ${colorClass(c.changePct)}`}>{formatPercent(c.changePct)}</td>
                <td className="text-right text-bb-muted">{c.volume}</td>
                <td className="text-right text-bb-muted">{c.marketCap}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

export default memo(Crypto);
