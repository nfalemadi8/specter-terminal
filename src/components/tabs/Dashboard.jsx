import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import Panel from '../layout/Panel';
import { stocks, indices, sectorPerformance, generatePriceHistory } from '../../data/stocks';
import { treasuries } from '../../data/bonds';
import { commodities } from '../../data/commodities';
import { cryptoPairs } from '../../data/forex';
import { newsItems } from '../../data/news';
import { economicIndicators } from '../../data/economic';
import { portfolioHoldings, calculatePortfolioMetrics, portfolioHistory, sectorAllocation } from '../../data/portfolio';
import { formatNumber, formatPercent, formatChange, formatCurrency, colorClass, round } from '../../utils/format';

const spxHistory = generatePriceHistory(4567.18, 60);
const portfolio = calculatePortfolioMetrics(portfolioHoldings);

const chartTooltipStyle = {
  contentStyle: { background: '#1a1a1a', border: '1px solid #2a2a2a', fontSize: '10px', fontFamily: 'monospace' },
  labelStyle: { color: '#ffbf00', fontSize: '10px' },
};

export default function Dashboard() {
  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      {/* Row 1: Market indices + S&P chart */}
      <Panel title="Market Indices" className="col-span-3 row-span-2">
        <table className="bb-table">
          <thead>
            <tr>
              <th>Index</th>
              <th className="text-right">Last</th>
              <th className="text-right">Chg%</th>
            </tr>
          </thead>
          <tbody>
            {indices.map(idx => (
              <tr key={idx.symbol}>
                <td className="text-bb-amber">{idx.symbol}</td>
                <td className="text-right">{formatNumber(idx.price)}</td>
                <td className={`text-right ${colorClass(idx.changePct)}`}>{formatPercent(idx.changePct)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel title="S&P 500 — 60D" className="col-span-5 row-span-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={spxHistory}>
            <defs>
              <linearGradient id="spxGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4a9eff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4a9eff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fill: '#6a6a6a', fontSize: 9 }} tickFormatter={v => v.slice(5)} interval={10} />
            <YAxis domain={['dataMin', 'dataMax']} tick={{ fill: '#6a6a6a', fontSize: 9 }} tickFormatter={v => round(v, 0)} width={45} />
            <Tooltip {...chartTooltipStyle} />
            <Area type="monotone" dataKey="price" stroke="#4a9eff" fill="url(#spxGrad)" strokeWidth={1.5} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </Panel>

      <Panel title="Portfolio Summary" className="col-span-4 row-span-2">
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-bb-muted text-[10px]">TOTAL VALUE</span>
            <span className="text-bb-white text-sm font-bold">{formatCurrency(portfolio.totalValue)}</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-bb-muted text-[10px]">P&L</span>
            <span className={`text-sm font-bold ${colorClass(portfolio.totalGainLoss)}`}>
              {formatCurrency(portfolio.totalGainLoss)} ({formatPercent(portfolio.totalGainLossPct)})
            </span>
          </div>
          <div className="h-[70px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={portfolioHistory.slice(-30)}>
                <defs>
                  <linearGradient id="portGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d26a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00d26a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#00d26a" fill="url(#portGrad)" strokeWidth={1.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-1 flex-wrap">
            {sectorAllocation.map(s => (
              <div key={s.name} className="flex items-center gap-1 text-[9px]">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-bb-muted">{s.name} {s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      {/* Row 2: Top movers + Treasury yields + Economic */}
      <Panel title="Top Movers" className="col-span-4 row-span-2">
        <table className="bb-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th className="text-right">Price</th>
              <th className="text-right">Chg</th>
              <th className="text-right">Chg%</th>
              <th className="text-right">Vol</th>
            </tr>
          </thead>
          <tbody>
            {[...stocks].sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct)).slice(0, 10).map(s => (
              <tr key={s.symbol}>
                <td className="text-bb-amber">{s.symbol}</td>
                <td className="text-right">{formatNumber(s.price)}</td>
                <td className={`text-right ${colorClass(s.change)}`}>{formatChange(s.change)}</td>
                <td className={`text-right ${colorClass(s.changePct)}`}>{formatPercent(s.changePct)}</td>
                <td className="text-right text-bb-muted">{s.volume}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel title="US Treasury Yields" className="col-span-4 row-span-2">
        <div className="h-[90px] mb-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={treasuries}>
              <defs>
                <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffd700" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ffd700" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="maturity" tick={{ fill: '#6a6a6a', fontSize: 9 }} />
              <YAxis domain={['dataMin', 'dataMax']} tick={{ fill: '#6a6a6a', fontSize: 9 }} width={35} />
              <Tooltip {...chartTooltipStyle} />
              <Area type="monotone" dataKey="yield" stroke="#ffd700" fill="url(#yieldGrad)" strokeWidth={1.5} dot={{ fill: '#ffd700', r: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <table className="bb-table">
          <thead>
            <tr>
              <th>Tenor</th>
              <th className="text-right">Yield</th>
              <th className="text-right">Chg</th>
            </tr>
          </thead>
          <tbody>
            {treasuries.filter((_, i) => [0, 3, 4, 6, 8, 10].includes(i)).map(t => (
              <tr key={t.maturity}>
                <td className="text-bb-amber">{t.maturity}</td>
                <td className="text-right">{round(t.yield, 2)}%</td>
                <td className={`text-right ${colorClass(t.change)}`}>{formatChange(t.change)}bp</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel title="Economic Indicators" className="col-span-4 row-span-2">
        <table className="bb-table">
          <thead>
            <tr>
              <th>Indicator</th>
              <th className="text-right">Actual</th>
              <th className="text-right">Prev</th>
              <th className="text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {economicIndicators.slice(0, 10).map(e => (
              <tr key={e.name}>
                <td className="text-bb-white text-[10px]">{e.name}</td>
                <td className="text-right">{e.value}</td>
                <td className="text-right text-bb-muted">{e.previous}</td>
                <td className="text-right">
                  <span className={`text-[9px] px-1 py-[1px] rounded ${
                    e.status === 'beat' ? 'bg-bb-green/20 text-bb-green' :
                    e.status === 'miss' ? 'bg-bb-red/20 text-bb-red' :
                    'bg-bb-muted/20 text-bb-muted'
                  }`}>
                    {e.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      {/* Row 3: Sector perf + Commodities + News feed */}
      <Panel title="Sector Performance" className="col-span-3 row-span-2">
        {sectorPerformance.map(s => (
          <div key={s.sector} className="flex items-center gap-2 py-[2px]">
            <span className="text-bb-white text-[10px] w-24 truncate">{s.sector}</span>
            <div className="flex-1 h-3 bg-bb-dark rounded-sm overflow-hidden">
              <div
                className={`h-full ${s.change >= 0 ? 'bg-bb-green/60' : 'bg-bb-red/60'}`}
                style={{ width: `${Math.min(Math.abs(s.change) * 30, 100)}%` }}
              />
            </div>
            <span className={`text-[10px] w-12 text-right ${colorClass(s.change)}`}>
              {formatPercent(s.change)}
            </span>
          </div>
        ))}
      </Panel>

      <Panel title="Commodities" className="col-span-4 row-span-2">
        <table className="bb-table">
          <thead>
            <tr>
              <th>Name</th>
              <th className="text-right">Price</th>
              <th className="text-right">Chg%</th>
              <th className="text-right">Unit</th>
            </tr>
          </thead>
          <tbody>
            {commodities.slice(0, 10).map(c => (
              <tr key={c.symbol}>
                <td className="text-bb-amber">{c.name}</td>
                <td className="text-right">{formatNumber(c.price, c.price < 10 ? 3 : 2)}</td>
                <td className={`text-right ${colorClass(c.changePct)}`}>{formatPercent(c.changePct)}</td>
                <td className="text-right text-bb-muted">{c.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel title="News Feed" className="col-span-5 row-span-2">
        <div className="space-y-[2px]">
          {newsItems.slice(0, 12).map(n => (
            <div key={n.id} className="flex gap-2 py-[2px] border-b border-bb-border/50">
              <span className="text-bb-muted text-[10px] shrink-0">{n.time}</span>
              <span className={`text-[10px] shrink-0 font-semibold ${
                n.source === 'RTRS' ? 'text-bb-cyan' :
                n.source === 'BBG' ? 'text-bb-orange' :
                n.source === 'FT' ? 'text-bb-amber' :
                'text-bb-blue'
              }`}>{n.source}</span>
              <span className="text-bb-white text-[10px] truncate">{n.headline}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
