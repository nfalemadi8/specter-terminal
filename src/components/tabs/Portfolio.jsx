import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Panel from '../layout/Panel';
import { portfolioHoldings, calculatePortfolioMetrics, portfolioHistory, sectorAllocation } from '../../data/portfolio';
import { formatNumber, formatCurrency, formatPercent, colorClass } from '../../utils/format';

const portfolio = calculatePortfolioMetrics(portfolioHoldings);
const chartTooltip = {
  contentStyle: { background: '#1a1a1a', border: '1px solid #2a2a2a', fontSize: '10px', fontFamily: 'monospace' },
  labelStyle: { color: '#ffbf00', fontSize: '10px' },
};

export default function Portfolio() {
  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      <Panel title="Portfolio Performance — 90D" className="col-span-8 row-span-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={portfolioHistory}>
            <defs>
              <linearGradient id="pfGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00d26a" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00d26a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fill: '#6a6a6a', fontSize: 9 }} tickFormatter={v => v.slice(5)} interval={15} />
            <YAxis domain={['dataMin', 'dataMax']} tick={{ fill: '#6a6a6a', fontSize: 9 }} tickFormatter={v => '$' + (v / 1000).toFixed(0) + 'K'} width={50} />
            <Tooltip {...chartTooltip} formatter={v => formatCurrency(v)} />
            <Area type="monotone" dataKey="value" stroke="#00d26a" fill="url(#pfGrad)" strokeWidth={1.5} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </Panel>

      <Panel title="Summary" className="col-span-4 row-span-2">
        <div className="space-y-3 p-1">
          <div>
            <div className="text-bb-muted text-[10px]">TOTAL VALUE</div>
            <div className="text-bb-white text-xl font-bold">{formatCurrency(portfolio.totalValue)}</div>
          </div>
          <div>
            <div className="text-bb-muted text-[10px]">COST BASIS</div>
            <div className="text-bb-muted text-sm">{formatCurrency(portfolio.totalCost)}</div>
          </div>
          <div>
            <div className="text-bb-muted text-[10px]">TOTAL P&L</div>
            <div className={`text-lg font-bold ${colorClass(portfolio.totalGainLoss)}`}>
              {formatCurrency(portfolio.totalGainLoss)} ({formatPercent(portfolio.totalGainLossPct)})
            </div>
          </div>
          <div className="flex gap-2 flex-wrap mt-2">
            {sectorAllocation.map(s => (
              <div key={s.name} className="flex items-center gap-1 text-[9px]">
                <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                <span className="text-bb-muted">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      <Panel title="Holdings" className="col-span-12 row-span-4">
        <table className="bb-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th className="text-right">Shares</th>
              <th className="text-right">Avg Cost</th>
              <th className="text-right">Current</th>
              <th className="text-right">Mkt Value</th>
              <th className="text-right">Cost Basis</th>
              <th className="text-right">P&L</th>
              <th className="text-right">P&L %</th>
              <th className="text-right">Weight</th>
              <th>Sector</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.holdings.map(h => (
              <tr key={h.symbol}>
                <td className="text-bb-amber">{h.symbol}</td>
                <td className="text-right">{h.shares}</td>
                <td className="text-right">{formatCurrency(h.avgCost)}</td>
                <td className="text-right">{formatCurrency(h.current)}</td>
                <td className="text-right">{formatCurrency(h.marketValue)}</td>
                <td className="text-right text-bb-muted">{formatCurrency(h.costBasis)}</td>
                <td className={`text-right ${colorClass(h.gainLoss)}`}>{formatCurrency(h.gainLoss)}</td>
                <td className={`text-right ${colorClass(h.gainLossPct)}`}>{formatPercent(h.gainLossPct)}</td>
                <td className="text-right">{h.weight.toFixed(1)}%</td>
                <td className="text-bb-muted">{h.sector}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
