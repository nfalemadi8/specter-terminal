import { useState, useMemo , memo } from 'react';
import Panel from '../layout/Panel';
import { stocks } from '../../data/stocks';
import { formatCurrency, formatPercent, colorClass } from '../../utils/format';

const insights = [
  { id: 1, time: '14:58', type: 'signal', severity: 'high', title: 'NVDA Momentum Breakout Signal', body: 'NVIDIA showing strong momentum with price breaking above 20-day SMA on above-average volume. RSI at 68 approaching overbought territory. Historical backtests suggest 72% probability of continued upward move in next 5 sessions.', tickers: ['NVDA'], category: 'Technical' },
  { id: 2, time: '14:42', type: 'risk', severity: 'high', title: 'Treasury Yield Curve Flattening Warning', body: '2s10s spread narrowing to 15bps, down from 45bps last month. Historically, sustained flattening precedes economic slowdowns. Consider reducing duration exposure and overweighting defensive sectors.', tickers: ['TLT', 'SPX'], category: 'Macro' },
  { id: 3, time: '14:25', type: 'opportunity', severity: 'medium', title: 'AAPL Relative Value Play vs MSFT', body: 'Apple trading at 29.3x P/E vs Microsoft at 35.8x, representing a 18% discount. Historically, this spread reverts within 2-3 quarters. Consider pairs trade: long AAPL / short MSFT.', tickers: ['AAPL', 'MSFT'], category: 'Valuation' },
  { id: 4, time: '14:10', type: 'signal', severity: 'medium', title: 'Energy Sector Rotation Detected', body: 'Large-cap energy names seeing institutional selling (XOM -2.16%, net outflows $340M). Rotation appears directed toward technology and communication services. Watch for continuation pattern.', tickers: ['XOM'], category: 'Flow' },
  { id: 5, time: '13:55', type: 'analysis', severity: 'low', title: 'GCC Markets: Aramco Stability Indicator', body: 'Saudi Aramco maintaining steady trading pattern with low volatility (beta 0.42). 6.12% dividend yield provides strong support floor. Regional sentiment positive on oil output agreement compliance.', tickers: ['2222.SR'], category: 'Regional' },
  { id: 6, time: '13:38', type: 'risk', severity: 'high', title: 'Concentration Risk Alert: Portfolio', body: 'Technology sector represents 58% of tracked portfolio value, well above recommended 35% maximum. Consider rebalancing into healthcare (currently underweight at 8%) and consumer staples.', tickers: ['AAPL', 'MSFT', 'NVDA', 'META'], category: 'Portfolio' },
  { id: 7, time: '13:20', type: 'opportunity', severity: 'medium', title: 'TSLA: Implied Vol Premium at 6-Month High', body: 'Tesla 30-day implied volatility at 62% vs 45% realized. Consider selling covered calls or put credit spreads. IV rank at 85th percentile suggests options are relatively expensive.', tickers: ['TSLA'], category: 'Options' },
  { id: 8, time: '13:05', type: 'analysis', severity: 'low', title: 'Earnings Season Trend Analysis', body: '73% of S&P 500 companies beating estimates this quarter vs 67% historical average. Revenue beats at 62%. Technology sector showing strongest surprise factor at +8.2% above consensus.', tickers: ['SPX'], category: 'Earnings' },
  { id: 9, time: '12:48', type: 'signal', severity: 'medium', title: 'JPM: Golden Cross Formation', body: 'JPMorgan Chase 50-day SMA crossing above 200-day SMA (Golden Cross). Historically signals bullish trend continuation. Combined with strong earnings, probability-weighted target at $185.', tickers: ['JPM'], category: 'Technical' },
  { id: 10, time: '12:30', type: 'risk', severity: 'medium', title: 'USD Strength Headwind for Multinationals', body: 'DXY index at 103.42 and trending higher. Strong dollar typically pressures multinational earnings. Most exposed in portfolio: AAPL (60% international revenue), MSFT (50%), GOOGL (54%).', tickers: ['AAPL', 'MSFT', 'GOOGL'], category: 'FX' },
  { id: 11, time: '12:15', type: 'opportunity', severity: 'high', title: 'Shariah-Compliant Opportunity: GOOGL', body: 'Alphabet passes all AAOIFI screening criteria: Debt/Assets 6% (<30%), Debt/Equity 10% (<33%), zero haram revenue. Trading at 25.4x P/E, below tech sector median of 32x.', tickers: ['GOOGL'], category: 'Shariah' },
  { id: 12, time: '12:00', type: 'analysis', severity: 'low', title: 'Crypto Correlation Breaking Down', body: 'BTC-SPX 30-day correlation falling to 0.18 from 0.62 last quarter. Suggests crypto decoupling from traditional risk assets. May offer diversification benefits for multi-asset portfolios.', tickers: ['BTC'], category: 'Crypto' },
];

const CATEGORIES = ['All', 'Technical', 'Macro', 'Valuation', 'Flow', 'Regional', 'Portfolio', 'Options', 'Earnings', 'FX', 'Shariah', 'Crypto'];
const TYPES = ['all', 'signal', 'risk', 'opportunity', 'analysis'];
const SEVERITY_COLORS = { high: 'text-bb-red', medium: 'text-bb-amber', low: 'text-bb-muted' };
const TYPE_COLORS = { signal: 'bg-bb-blue/20 text-bb-blue', risk: 'bg-bb-red/20 text-bb-red', opportunity: 'bg-bb-green/20 text-bb-green', analysis: 'bg-bb-cyan/20 text-bb-cyan' };

function AIInsights() {
  const [catFilter, setCatFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sevFilter, setSevFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  const filtered = useMemo(() => {
    let data = insights;
    if (catFilter !== 'All') data = data.filter(i => i.category === catFilter);
    if (typeFilter !== 'all') data = data.filter(i => i.type === typeFilter);
    if (sevFilter !== 'all') data = data.filter(i => i.severity === sevFilter);
    return data;
  }, [catFilter, typeFilter, sevFilter]);

  // Stats
  const highCount = insights.filter(i => i.severity === 'high').length;
  const signalCount = insights.filter(i => i.type === 'signal').length;
  const riskCount = insights.filter(i => i.type === 'risk').length;
  const oppCount = insights.filter(i => i.type === 'opportunity').length;

  // Most mentioned tickers
  const tickerMentions = useMemo(() => {
    const map = {};
    insights.forEach(i => i.tickers.forEach(t => { map[t] = (map[t] || 0) + 1; }));
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, []);

  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      {/* Filters */}
      <Panel title="AI Engine" className="col-span-2 row-span-6">
        <div className="space-y-2 text-[10px]">
          <div className="border border-bb-amber/30 p-2 bg-bb-amber/5 text-center">
            <div className="text-bb-amber font-bold text-[11px]">SPECTER AI</div>
            <div className="text-[8px] text-bb-muted mt-0.5">Market Intelligence Engine</div>
            <div className="text-[8px] text-bb-green mt-1 blink">● ACTIVE</div>
          </div>

          <div>
            <div className="text-[9px] text-bb-muted mb-1">TYPE</div>
            {TYPES.map(t => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`block w-full text-left px-1.5 py-0.5 border text-[9px] capitalize mb-0.5 ${
                  typeFilter === t ? 'border-bb-amber text-bb-amber bg-bb-amber/10' : 'border-bb-border text-bb-muted hover:text-bb-white'
                }`}>{t === 'all' ? 'All Types' : t}</button>
            ))}
          </div>

          <div>
            <div className="text-[9px] text-bb-muted mb-1">SEVERITY</div>
            {['all', 'high', 'medium', 'low'].map(s => (
              <button key={s} onClick={() => setSevFilter(s)}
                className={`block w-full text-left px-1.5 py-0.5 border text-[9px] capitalize mb-0.5 ${
                  sevFilter === s ? 'border-bb-amber text-bb-amber bg-bb-amber/10' : 'border-bb-border text-bb-muted hover:text-bb-white'
                }`}>{s === 'all' ? 'All' : s}</button>
            ))}
          </div>

          <div>
            <div className="text-[9px] text-bb-muted mb-1">CATEGORY</div>
            <div className="space-y-0.5 max-h-32 overflow-auto">
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCatFilter(c)}
                  className={`block w-full text-left px-1.5 py-0.5 border text-[9px] mb-0.5 ${
                    catFilter === c ? 'border-bb-amber text-bb-amber bg-bb-amber/10' : 'border-bb-border text-bb-muted hover:text-bb-white'
                  }`}>{c}</button>
              ))}
            </div>
          </div>
        </div>
      </Panel>

      {/* Insights Feed */}
      <Panel title={`AI Insights Feed (${filtered.length})`} className="col-span-7 row-span-6">
        <div className="space-y-1">
          {filtered.map(i => (
            <div key={i.id} onClick={() => setExpanded(expanded === i.id ? null : i.id)}
              className={`border p-2 cursor-pointer transition-colors ${
                expanded === i.id ? 'border-bb-amber bg-bb-amber/5' : 'border-bb-border hover:border-bb-muted'
              }`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] text-bb-muted">{i.time}</span>
                <span className={`text-[8px] px-1.5 py-[1px] rounded ${TYPE_COLORS[i.type]}`}>{i.type.toUpperCase()}</span>
                <span className={`text-[8px] font-bold ${SEVERITY_COLORS[i.severity]}`}>●</span>
                <span className="text-[8px] text-bb-muted">{i.category}</span>
                <div className="flex-1" />
                {i.tickers.map(t => (
                  <span key={t} className="text-[8px] px-1 py-[1px] bg-bb-dark border border-bb-border text-bb-amber">{t}</span>
                ))}
              </div>
              <div className="text-[10px] font-bold text-bb-white">{i.title}</div>
              {expanded === i.id && (
                <div className="mt-1.5 text-[9px] text-bb-muted leading-relaxed border-t border-bb-border pt-1.5">{i.body}</div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center text-bb-muted text-[10px] py-8">No insights match current filters</div>
          )}
        </div>
      </Panel>

      {/* Stats */}
      <Panel title="Dashboard" className="col-span-3 row-span-3">
        <div className="space-y-2 text-[10px] p-0.5">
          <div className="grid grid-cols-2 gap-1.5">
            <div className="border border-bb-border p-2 text-center">
              <div className="text-xl font-bold text-bb-amber">{insights.length}</div>
              <div className="text-[8px] text-bb-muted">INSIGHTS</div>
            </div>
            <div className="border border-bb-border p-2 text-center">
              <div className="text-xl font-bold text-bb-red">{highCount}</div>
              <div className="text-[8px] text-bb-muted">HIGH PRIORITY</div>
            </div>
          </div>

          <table className="bb-table"><tbody>
            {[
              ['Signals', signalCount, 'text-bb-blue'],
              ['Risk Alerts', riskCount, 'text-bb-red'],
              ['Opportunities', oppCount, 'text-bb-green'],
              ['Analysis', insights.filter(i => i.type === 'analysis').length, 'text-bb-cyan'],
            ].map(([l, v, c]) => (
              <tr key={l}><td className="text-bb-muted">{l}</td><td className={`text-right font-bold ${c}`}>{v}</td></tr>
            ))}
          </tbody></table>

          <div className="border-t border-bb-border pt-1.5">
            <div className="text-[9px] text-bb-muted mb-1">MODEL CONFIDENCE</div>
            <div className="w-full bg-bb-dark border border-bb-border h-3">
              <div className="bg-bb-green h-full" style={{ width: '78%' }} />
            </div>
            <div className="flex justify-between text-[8px] text-bb-muted mt-0.5">
              <span>Accuracy</span><span className="text-bb-green font-bold">78%</span>
            </div>
          </div>
        </div>
      </Panel>

      {/* Most Mentioned */}
      <Panel title="Most Referenced" className="col-span-3 row-span-3">
        <div className="space-y-1 text-[10px] p-0.5">
          <div className="text-[9px] text-bb-muted mb-1">TICKER MENTIONS</div>
          {tickerMentions.map(([ticker, count]) => {
            const stock = stocks.find(s => s.ticker === ticker);
            return (
              <div key={ticker} className="flex items-center justify-between border border-bb-border px-1.5 py-1">
                <div>
                  <span className="text-bb-amber font-bold">{ticker}</span>
                  {stock && <span className="text-bb-muted text-[8px] ml-1">{formatCurrency(stock.price)}</span>}
                </div>
                <div className="flex items-center gap-2">
                  {stock && <span className={`text-[9px] ${colorClass(stock.changePct)}`}>{formatPercent(stock.changePct)}</span>}
                  <span className="text-bb-cyan font-bold">{count}x</span>
                </div>
              </div>
            );
          })}

          <div className="border-t border-bb-border pt-1.5 mt-2">
            <div className="text-[9px] text-bb-muted mb-1">TOP CATEGORIES</div>
            {CATEGORIES.filter(c => c !== 'All').slice(0, 5).map(cat => {
              const count = insights.filter(i => i.category === cat).length;
              return count > 0 ? (
                <div key={cat} className="flex justify-between text-[9px] py-0.5">
                  <span className="text-bb-muted">{cat}</span>
                  <span className="font-bold">{count}</span>
                </div>
              ) : null;
            })}
          </div>
        </div>
      </Panel>
    </div>
  );
}

export default memo(AIInsights);
