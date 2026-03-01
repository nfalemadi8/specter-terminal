import { useState, useMemo , memo } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, BarChart, Bar, Cell } from 'recharts';
import Panel from '../layout/Panel';
import { stocks } from '../../data/stocks';
import { formatCurrency, formatPercent, formatNumber, colorClass, round } from '../../utils/format';

const tt = { contentStyle: { background: '#1a1a1a', border: '1px solid #2a2a2a', fontSize: '10px', fontFamily: 'monospace' }, labelStyle: { color: '#ffbf00', fontSize: '10px' } };

const STRATEGIES = [
  { id: 'momentum', label: 'Momentum', desc: 'Buy top performers, rebalance monthly', params: { lookback: 30, topN: 5 } },
  { id: 'meanrev', label: 'Mean Reversion', desc: 'Buy oversold, sell overbought', params: { lookback: 20, threshold: 2 } },
  { id: 'value', label: 'Value', desc: 'Buy low P/E stocks, equal weight', params: { maxPE: 15, topN: 5 } },
  { id: 'quality', label: 'Quality', desc: 'High ROE + low debt stocks', params: { minROE: 20, maxDE: 0.5 } },
  { id: 'dividend', label: 'Dividend', desc: 'Buy highest yielding stocks', params: { minYield: 1.5, topN: 5 } },
  { id: 'lowvol', label: 'Low Volatility', desc: 'Buy lowest beta stocks', params: { maxBeta: 0.8, topN: 5 } },
];

function runBacktest(strategy, capital, days) {
  // Simulated backtest engine
  const dailyReturns = [];
  let equity = capital;
  const equityCurve = [];
  let maxEquity = capital;
  let maxDrawdown = 0;
  let wins = 0, losses = 0;
  const trades = [];

  // Strategy-specific expected return/vol
  const profiles = {
    momentum: { mu: 0.08, sigma: 1.8, winRate: 0.54 },
    meanrev: { mu: 0.06, sigma: 1.4, winRate: 0.58 },
    value: { mu: 0.07, sigma: 1.2, winRate: 0.52 },
    quality: { mu: 0.09, sigma: 1.0, winRate: 0.56 },
    dividend: { mu: 0.05, sigma: 0.8, winRate: 0.55 },
    lowvol: { mu: 0.04, sigma: 0.7, winRate: 0.57 },
  };
  const profile = profiles[strategy.id] || profiles.momentum;

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    const dailyRet = (profile.mu / 252) + (profile.sigma / 100) * (Math.random() - 0.48);
    equity *= (1 + dailyRet);
    dailyReturns.push(dailyRet);

    if (equity > maxEquity) maxEquity = equity;
    const dd = (equity - maxEquity) / maxEquity;
    if (dd < maxDrawdown) maxDrawdown = dd;

    equityCurve.push({ date: date.toISOString().split('T')[0], equity: round(equity, 2), drawdown: round(dd * 100, 2) });

    // Generate trades on rebalance days
    if (i % 21 === 0 && i > 0) {
      const tradeReturn = dailyRet * 20 * 100;
      if (tradeReturn > 0) wins++; else losses++;
      trades.push({
        date: date.toISOString().split('T')[0],
        action: tradeReturn > 0 ? 'WIN' : 'LOSS',
        return: round(tradeReturn, 2),
        equity: round(equity, 0),
      });
    }
  }

  const totalReturn = (equity - capital) / capital;
  const avgDailyRet = dailyReturns.reduce((s, r) => s + r, 0) / dailyReturns.length;
  const dailyStd = Math.sqrt(dailyReturns.reduce((s, r) => s + Math.pow(r - avgDailyRet, 2), 0) / dailyReturns.length);
  const sharpe = (avgDailyRet / dailyStd) * Math.sqrt(252);
  const annualReturn = totalReturn / (days / 252);
  const annualVol = dailyStd * Math.sqrt(252);
  const calmar = annualReturn / Math.abs(maxDrawdown || 0.01);

  // Monthly returns
  const monthlyReturns = [];
  for (let i = 0; i < Math.min(12, Math.floor(days / 21)); i++) {
    const slice = dailyReturns.slice(i * 21, (i + 1) * 21);
    const monthRet = slice.reduce((s, r) => s + r, 0) * 100;
    monthlyReturns.push({ month: `M${i + 1}`, return: round(monthRet, 2) });
  }

  return {
    equityCurve, totalReturn, sharpe, maxDrawdown, annualReturn, annualVol, calmar,
    wins, losses, winRate: wins / (wins + losses || 1), trades, finalEquity: equity,
    monthlyReturns,
  };
}

// Select stocks for strategy
function getStrategyStocks(strategy) {
  switch (strategy.id) {
    case 'value': return stocks.filter(s => s.pe <= (strategy.params.maxPE || 15)).slice(0, strategy.params.topN || 5);
    case 'quality': return stocks.filter(s => s.roe >= (strategy.params.minROE || 20) && s.debtEquity <= (strategy.params.maxDE || 0.5));
    case 'dividend': return [...stocks].sort((a, b) => b.divYield - a.divYield).slice(0, strategy.params.topN || 5);
    case 'lowvol': return [...stocks].sort((a, b) => a.beta - b.beta).slice(0, strategy.params.topN || 5);
    case 'momentum': return [...stocks].sort((a, b) => b.changePct - a.changePct).slice(0, strategy.params.topN || 5);
    default: return stocks.slice(0, 5);
  }
}

function Backtest() {
  const [strategyId, setStrategyId] = useState('momentum');
  const [capital, setCapital] = useState(100000);
  const [days, setDays] = useState(252);
  const [hasRun, setHasRun] = useState(false);

  const strategy = STRATEGIES.find(s => s.id === strategyId);
  const results = useMemo(() => hasRun ? runBacktest(strategy, capital, days) : null, [hasRun, strategyId, capital, days]);
  const selectedStocks = useMemo(() => getStrategyStocks(strategy), [strategy]);

  // Benchmark (S&P 500 simulation)
  const benchmark = useMemo(() => {
    if (!hasRun) return null;
    let eq = capital;
    return results.equityCurve.map(p => {
      eq *= (1 + 0.1 / 252 + (Math.random() - 0.5) * 0.012);
      return { ...p, benchmark: round(eq, 2) };
    });
  }, [hasRun, results, capital]);

  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      {/* Strategy Selection */}
      <Panel title="Backtest Engine" className="col-span-3 row-span-3">
        <div className="space-y-1.5 text-[10px]">
          {STRATEGIES.map(s => (
            <button key={s.id} onClick={() => { setStrategyId(s.id); setHasRun(false); }}
              className={`w-full text-left p-1.5 border transition-colors ${strategyId === s.id ? 'border-bb-amber bg-bb-amber/5' : 'border-bb-border hover:border-bb-muted'}`}>
              <div className={strategyId === s.id ? 'text-bb-amber font-bold' : 'text-bb-white'}>{s.label}</div>
              <div className="text-bb-muted text-[8px]">{s.desc}</div>
            </button>
          ))}
        </div>
      </Panel>

      {/* Parameters */}
      <Panel title="Parameters" className="col-span-3 row-span-3">
        <div className="space-y-2 text-[10px] p-0.5">
          <div>
            <div className="flex justify-between text-bb-muted mb-0.5"><span>Initial Capital</span><span className="text-bb-white">{formatCurrency(capital, 0)}</span></div>
            <input type="range" min={10000} max={1000000} step={10000} value={capital} onChange={e => { setCapital(+e.target.value); setHasRun(false); }}
              className="w-full h-1 appearance-none bg-bb-border rounded cursor-pointer accent-[#ffbf00]" />
          </div>
          <div>
            <div className="flex justify-between text-bb-muted mb-0.5"><span>Backtest Period</span><span className="text-bb-white">{days} days ({round(days / 252, 1)}Y)</span></div>
            <input type="range" min={63} max={1260} step={63} value={days} onChange={e => { setDays(+e.target.value); setHasRun(false); }}
              className="w-full h-1 appearance-none bg-bb-border rounded cursor-pointer accent-[#ffbf00]" />
          </div>
          <div className="border-t border-bb-border pt-1.5">
            <div className="text-[9px] text-bb-muted mb-1">STOCK UNIVERSE ({selectedStocks.length})</div>
            {selectedStocks.map(s => (
              <div key={s.ticker} className="flex justify-between text-[9px] py-0.5">
                <span className="text-bb-amber">{s.ticker}</span>
                <span className="text-bb-muted">{s.sector}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setHasRun(true)}
            className="w-full py-1.5 font-bold text-[11px] border border-bb-green text-bb-green hover:bg-bb-green/10 transition-colors">
            RUN BACKTEST
          </button>
        </div>
      </Panel>

      {results ? (
        <>
          {/* Equity Curve */}
          <Panel title="Equity Curve" className="col-span-6 row-span-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={benchmark || results.equityCurve}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="date" tick={{ fill: '#6a6a6a', fontSize: 8 }} tickFormatter={v => v.slice(5)} interval={Math.floor(days / 6)} />
                <YAxis tick={{ fill: '#6a6a6a', fontSize: 8 }} tickFormatter={v => '$' + round(v / 1000, 0) + 'K'} />
                <Tooltip {...tt} formatter={v => formatCurrency(v, 0)} />
                <Line type="monotone" dataKey="equity" stroke="#00d26a" strokeWidth={2} dot={false} name="Strategy" />
                {benchmark && <Line type="monotone" dataKey="benchmark" stroke="#6a6a6a" strokeWidth={1} dot={false} name="Benchmark" strokeDasharray="3 3" />}
                <Legend wrapperStyle={{ fontSize: '9px' }} />
              </LineChart>
            </ResponsiveContainer>
          </Panel>

          {/* Performance Metrics */}
          <Panel title="Performance Metrics" className="col-span-3 row-span-3">
            <div className="space-y-1 text-[10px] p-0.5">
              <div className="text-center py-2 border border-bb-border bg-bb-dark">
                <div className="text-bb-muted text-[9px]">FINAL EQUITY</div>
                <div className="text-xl font-bold text-bb-white">{formatCurrency(results.finalEquity, 0)}</div>
                <div className={`text-sm font-bold ${colorClass(results.totalReturn)}`}>{formatPercent(results.totalReturn * 100)}</div>
              </div>
              <table className="bb-table"><tbody>
                {[
                  ['Sharpe Ratio', round(results.sharpe, 2), results.sharpe > 1 ? 'text-bb-green' : results.sharpe > 0.5 ? 'text-bb-yellow' : 'text-bb-red'],
                  ['Ann. Return', formatPercent(results.annualReturn * 100), colorClass(results.annualReturn)],
                  ['Ann. Volatility', formatPercent(results.annualVol * 100), ''],
                  ['Max Drawdown', formatPercent(results.maxDrawdown * 100), 'text-bb-red'],
                  ['Calmar Ratio', round(results.calmar, 2), ''],
                  ['Win Rate', round(results.winRate * 100, 1) + '%', results.winRate > 0.5 ? 'text-bb-green' : 'text-bb-red'],
                  ['Wins / Losses', `${results.wins} / ${results.losses}`, ''],
                ].map(([l, v, cls]) => (
                  <tr key={l}><td className="text-bb-muted">{l}</td><td className={`text-right font-bold ${cls}`}>{v}</td></tr>
                ))}
              </tbody></table>
            </div>
          </Panel>

          {/* Drawdown Chart */}
          <Panel title="Drawdown" className="col-span-3 row-span-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={results.equityCurve}>
                <defs><linearGradient id="ddGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ff3b3b" stopOpacity={0.3} /><stop offset="95%" stopColor="#ff3b3b" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="date" tick={{ fill: '#6a6a6a', fontSize: 8 }} tickFormatter={v => v.slice(5)} interval={Math.floor(days / 6)} />
                <YAxis tick={{ fill: '#6a6a6a', fontSize: 8 }} tickFormatter={v => v + '%'} />
                <Tooltip {...tt} formatter={v => v + '%'} />
                <Area type="monotone" dataKey="drawdown" stroke="#ff3b3b" fill="url(#ddGrad)" strokeWidth={1.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </Panel>

          {/* Monthly Returns */}
          <Panel title="Monthly Returns" className="col-span-3 row-span-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={results.monthlyReturns} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <XAxis dataKey="month" tick={{ fill: '#6a6a6a', fontSize: 8 }} />
                <YAxis tick={{ fill: '#6a6a6a', fontSize: 8 }} tickFormatter={v => v + '%'} />
                <Tooltip {...tt} formatter={v => v + '%'} />
                <Bar dataKey="return" radius={[2, 2, 0, 0]}>
                  {results.monthlyReturns.map((m, i) => <Cell key={i} fill={m.return >= 0 ? '#00d26a' : '#ff3b3b'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Panel>

          {/* Trade Log */}
          <Panel title="Trade Log" className="col-span-3 row-span-3">
            <table className="bb-table">
              <thead><tr><th>Date</th><th>Result</th><th className="text-right">Return</th><th className="text-right">Equity</th></tr></thead>
              <tbody>
                {results.trades.slice(-10).reverse().map((t, i) => (
                  <tr key={i}>
                    <td className="text-bb-muted">{t.date.slice(5)}</td>
                    <td><span className={t.action === 'WIN' ? 'text-bb-green' : 'text-bb-red'}>{t.action}</span></td>
                    <td className={`text-right ${colorClass(t.return)}`}>{t.return > 0 ? '+' : ''}{t.return}%</td>
                    <td className="text-right">{formatCurrency(t.equity, 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        </>
      ) : (
        <Panel title="Results" className="col-span-6 row-span-6">
          <div className="flex items-center justify-center h-full text-bb-muted text-[11px]">
            <div className="text-center space-y-2">
              <div className="text-3xl text-bb-border">BACKTEST</div>
              <div>Select a strategy, configure parameters, and click RUN BACKTEST</div>
              <div className="text-[9px]">Simulated historical performance engine</div>
            </div>
          </div>
        </Panel>
      )}
    </div>
  );
}

export default memo(Backtest);
