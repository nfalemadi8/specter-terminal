import { memo } from 'react';
import Panel from '../layout/Panel';
import { colorClass, formatPercent, round } from '../../utils/format';

const upcomingIPOs = [
  { company: 'Reddit Inc.', symbol: 'RDDT', exchange: 'NYSE', priceRange: '$31-34', date: 'Mar 2024', sector: 'Technology', underwriter: 'Morgan Stanley' },
  { company: 'Astera Labs', symbol: 'ALAB', exchange: 'NASDAQ', priceRange: '$27-30', date: 'Mar 2024', sector: 'Semiconductors', underwriter: 'Morgan Stanley' },
  { company: 'BrightSpring Health', symbol: 'BTSG', exchange: 'NASDAQ', priceRange: '$15-17', date: 'Jan 2024', sector: 'Healthcare', underwriter: 'J.P. Morgan' },
  { company: 'Amer Sports', symbol: 'AS', exchange: 'NYSE', priceRange: '$13-16', date: 'Feb 2024', sector: 'Consumer', underwriter: 'Goldman Sachs' },
  { company: 'Waystar Health', symbol: 'WAY', exchange: 'NASDAQ', priceRange: '$20-23', date: 'Q1 2024', sector: 'Healthcare IT', underwriter: 'Barclays' },
];

const recentIPOs = [
  { company: 'Arm Holdings', symbol: 'ARM', ipoPrice: 51.00, current: 78.42, date: 'Sep 2023', return: 53.76, sector: 'Semiconductors' },
  { company: 'Instacart (Maplebear)', symbol: 'CART', ipoPrice: 30.00, current: 28.45, date: 'Sep 2023', return: -5.17, sector: 'Technology' },
  { company: 'Birkenstock', symbol: 'BIRK', ipoPrice: 46.00, current: 52.18, date: 'Oct 2023', return: 13.43, sector: 'Consumer' },
  { company: 'Klaviyo', symbol: 'KVYO', ipoPrice: 30.00, current: 26.82, date: 'Sep 2023', return: -10.60, sector: 'Technology' },
  { company: 'Oddity Tech', symbol: 'ODD', ipoPrice: 35.00, current: 42.56, date: 'Jul 2023', return: 21.60, sector: 'Consumer' },
  { company: 'Cava Group', symbol: 'CAVA', ipoPrice: 22.00, current: 48.72, date: 'Jun 2023', return: 121.45, sector: 'Restaurant' },
  { company: 'Savers Value', symbol: 'SVV', ipoPrice: 18.00, current: 12.84, date: 'Jun 2023', return: -28.67, sector: 'Retail' },
  { company: 'Kodiak Gas', symbol: 'KGS', ipoPrice: 21.00, current: 26.48, date: 'Jun 2023', return: 26.10, sector: 'Energy' },
];

function IPOs() {
  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      <Panel title="Upcoming IPOs" className="col-span-12 row-span-3">
        <table className="bb-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Symbol</th>
              <th>Exchange</th>
              <th className="text-right">Price Range</th>
              <th>Expected Date</th>
              <th>Sector</th>
              <th>Lead Underwriter</th>
            </tr>
          </thead>
          <tbody>
            {upcomingIPOs.map(ipo => (
              <tr key={ipo.symbol}>
                <td className="text-bb-white">{ipo.company}</td>
                <td className="text-bb-amber">{ipo.symbol}</td>
                <td className="text-bb-muted">{ipo.exchange}</td>
                <td className="text-right">{ipo.priceRange}</td>
                <td>{ipo.date}</td>
                <td className="text-bb-muted">{ipo.sector}</td>
                <td className="text-bb-muted">{ipo.underwriter}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel title="Recent IPO Performance" className="col-span-12 row-span-3">
        <table className="bb-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Symbol</th>
              <th className="text-right">IPO Price</th>
              <th className="text-right">Current</th>
              <th>IPO Date</th>
              <th className="text-right">Return</th>
              <th>Sector</th>
            </tr>
          </thead>
          <tbody>
            {recentIPOs.map(ipo => (
              <tr key={ipo.symbol}>
                <td className="text-bb-white">{ipo.company}</td>
                <td className="text-bb-amber">{ipo.symbol}</td>
                <td className="text-right">${round(ipo.ipoPrice, 2)}</td>
                <td className="text-right">${round(ipo.current, 2)}</td>
                <td className="text-bb-muted">{ipo.date}</td>
                <td className={`text-right font-bold ${colorClass(ipo.return)}`}>{formatPercent(ipo.return)}</td>
                <td className="text-bb-muted">{ipo.sector}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

export default memo(IPOs);
