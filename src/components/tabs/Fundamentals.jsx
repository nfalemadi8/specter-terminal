import Panel from '../layout/Panel';
import { formatNumber, formatCurrency } from '../../utils/format';

const companyData = {
  symbol: 'AAPL',
  name: 'Apple Inc.',
  exchange: 'NASDAQ',
  sector: 'Technology',
  industry: 'Consumer Electronics',
  employees: '164,000',
  website: 'apple.com',
};

const valuationMetrics = [
  { metric: 'Market Cap', value: '$2.95T' },
  { metric: 'Enterprise Value', value: '$3.02T' },
  { metric: 'P/E Ratio (TTM)', value: '31.20' },
  { metric: 'Forward P/E', value: '28.45' },
  { metric: 'PEG Ratio', value: '2.84' },
  { metric: 'Price/Sales', value: '7.82' },
  { metric: 'Price/Book', value: '48.52' },
  { metric: 'EV/EBITDA', value: '24.18' },
  { metric: 'EV/Revenue', value: '7.95' },
];

const financials = [
  { metric: 'Revenue (TTM)', value: '$383.3B' },
  { metric: 'Revenue Growth', value: '-2.8%' },
  { metric: 'Gross Margin', value: '44.1%' },
  { metric: 'Operating Margin', value: '29.8%' },
  { metric: 'Net Margin', value: '25.3%' },
  { metric: 'EPS (TTM)', value: '$6.13' },
  { metric: 'EPS Growth', value: '-0.5%' },
  { metric: 'ROE', value: '156.2%' },
  { metric: 'ROA', value: '28.4%' },
  { metric: 'ROIC', value: '48.7%' },
];

const balanceSheet = [
  { metric: 'Cash & Equivalents', value: '$29.9B' },
  { metric: 'Short-term Investments', value: '$31.3B' },
  { metric: 'Total Cash', value: '$61.2B' },
  { metric: 'Total Debt', value: '$111.1B' },
  { metric: 'Net Debt', value: '$49.9B' },
  { metric: 'Debt/Equity', value: '1.81' },
  { metric: 'Current Ratio', value: '0.99' },
  { metric: 'Quick Ratio', value: '0.94' },
  { metric: 'Book Value/Share', value: '$3.91' },
];

const dividendInfo = [
  { metric: 'Dividend Yield', value: '0.51%' },
  { metric: 'Annual Dividend', value: '$0.96' },
  { metric: 'Payout Ratio', value: '15.6%' },
  { metric: 'Ex-Dividend Date', value: 'Feb 9, 2024' },
  { metric: '5Y Div Growth', value: '5.8%' },
];

export default function Fundamentals() {
  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      <Panel title={`${companyData.symbol} — ${companyData.name}`} className="col-span-12 row-span-1">
        <div className="flex gap-6 text-[10px] p-1">
          <div><span className="text-bb-muted">Exchange: </span><span>{companyData.exchange}</span></div>
          <div><span className="text-bb-muted">Sector: </span><span>{companyData.sector}</span></div>
          <div><span className="text-bb-muted">Industry: </span><span>{companyData.industry}</span></div>
          <div><span className="text-bb-muted">Employees: </span><span>{companyData.employees}</span></div>
        </div>
      </Panel>

      <Panel title="Valuation" className="col-span-3 row-span-5">
        <table className="bb-table">
          <tbody>
            {valuationMetrics.map(m => (
              <tr key={m.metric}>
                <td className="text-bb-muted">{m.metric}</td>
                <td className="text-right font-bold">{m.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel title="Income Statement" className="col-span-3 row-span-5">
        <table className="bb-table">
          <tbody>
            {financials.map(m => (
              <tr key={m.metric}>
                <td className="text-bb-muted">{m.metric}</td>
                <td className={`text-right font-bold ${m.value.startsWith('-') ? 'text-bb-red' : ''}`}>{m.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel title="Balance Sheet" className="col-span-3 row-span-5">
        <table className="bb-table">
          <tbody>
            {balanceSheet.map(m => (
              <tr key={m.metric}>
                <td className="text-bb-muted">{m.metric}</td>
                <td className="text-right font-bold">{m.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel title="Dividends" className="col-span-3 row-span-5">
        <table className="bb-table">
          <tbody>
            {dividendInfo.map(m => (
              <tr key={m.metric}>
                <td className="text-bb-muted">{m.metric}</td>
                <td className="text-right font-bold">{m.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
