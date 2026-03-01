import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, ScatterChart, Scatter, CartesianGrid } from 'recharts';
import Panel from '../layout/Panel';
import { stocks } from '../../data/stocks';
import { formatCurrency, formatPercent, formatMcap, colorClass } from '../../utils/format';

const STRATEGIES = [
  { id: 'equal', label: 'Equal Weight', desc: 'Distribute equally across all selected securities' },
  { id: 'mcap', label: 'Market Cap Weight', desc: 'Weight proportional to market capitalization' },
  { id: 'minvol', label: 'Min Volatility', desc: 'Minimize portfolio volatility using beta as proxy' },
  { id: 'maxsharpe', label: 'Max Sharpe', desc: 'Maximize risk-adjusted return (return/beta)' },
  { id: 'riskparity', label: 'Risk Parity', desc: 'Equalize risk contribution from each holding' },
  { id: 'momentum', label: 'Momentum', desc: 'Overweight recent outperformers by change %' },
];

const SECTOR_COLORS = {
  Technology: '#4a9eff',
  Financials: '#00d26a',
  Healthcare: '#ff8c00',
  'Consumer Discretionary': '#ffd700',
  Energy: '#ff3b3b',
  'Consumer Staples': '#00e5ff',
  'Communication Services': '#b388ff',
  'Real Estate': '#64ffda',
};

function optimize(selected, strategy, constraints) {
  const n = selected.length;
  if (n === 0) return [];

  let weights;
  switch (strategy) {
    case 'mcap': {
      const totalMcap = selected.reduce((s, st) => s + st.mcap, 0);
      weights = selected.map(st => st.mcap / totalMcap);
      break;
    }
    case 'minvol': {
      const invBeta = selected.map(st => 1 / Math.max(st.beta, 0.1));
      const total = invBeta.reduce((s, v) => s + v, 0);
      weights = invBeta.map(v => v / total);
      break;
    }
    case 'maxsharpe': {
      const sharpe = selected.map(st => (st.revGrowth || 1) / Math.max(st.beta, 0.1));
      const minS = Math.min(...sharpe);
      const adjusted = sharpe.map(s => s - minS + 0.1);
      const total = adjusted.reduce((s, v) => s + v, 0);
      weights = adjusted.map(v => v / total);
      break;
    }
    case 'riskparity': {
      const riskBudget = selected.map(st => Math.max(st.beta, 0.1));
      const invRisk = riskBudget.map(r => 1 / r);
      const total = invRisk.reduce((s, v) => s + v, 0);
      weights = invRisk.map(v => v / total);
      break;
    }
    case 'momentum': {
      const mom = selected.map(st => Math.max(st.changePct + 5, 0.1));
      const total = mom.reduce((s, v) => s + v, 0);
      weights = mom.map(v => v / total);
      break;
    }
    default: // equal
      weights = selected.map(() => 1 / n);
  }

  // Apply constraints
  if (constraints.maxWeight < 100) {
    const maxW = constraints.maxWeight / 100;
    let excess = 0;
    let belowCount = 0;
    weights = weights.map(w => {
      if (w > maxW) { excess += w - maxW; return maxW; }
      belowCount++;
      return w;
    });
    if (belowCount > 0 && excess > 0) {
      const add = excess / belowCount;
      weights = weights.map(w => w < constraints.maxWeight / 100 ? w + add : w);
    }
  }
  if (constraints.minWeight > 0) {
    const minW = constraints.minWeight / 100;
    weights = weights.map(w => Math.max(w, minW));
    const total = weights.reduce((s, v) => s + v, 0);
    weights = weights.map(w => w / total);
  }

  return selected.map((st, i) => ({
    ...st,
    weight: weights[i] * 100,
    allocation: weights[i],
  }));
}

function portfolioMetrics(holdings, investmentAmount) {
  const weightedBeta = holdings.reduce((s, h) => s + h.allocation * h.beta, 0);
  const weightedYield = holdings.reduce((s, h) => s + h.allocation * h.divYield, 0);
  const weightedPE = holdings.reduce((s, h) => s + h.allocation * h.pe, 0);
  const weightedGrowth = holdings.reduce((s, h) => s + h.allocation * h.revGrowth, 0);
  const weightedMargin = holdings.reduce((s, h) => s + h.allocation * h.margin, 0);
  const weightedESG = holdings.reduce((s, h) => s + h.allocation * h.esgTotal, 0);
  const shariahPct = holdings.filter(h => h.debtToAssets < 0.30 && h.debtEquity < 0.33 && h.haramRevenue < 5)
    .reduce((s, h) => s + h.weight, 0);

  const sectorMap = {};
  holdings.forEach(h => {
    sectorMap[h.sector] = (sectorMap[h.sector] || 0) + h.weight;
  });
  const sectors = Object.entries(sectorMap)
    .map(([name, value]) => ({ name, value: parseFloat(value.toFixed(1)), color: SECTOR_COLORS[name] || '#888' }))
    .sort((a, b) => b.value - a.value);

  return {
    beta: weightedBeta,
    divYield: weightedYield,
    pe: weightedPE,
    growth: weightedGrowth,
    margin: weightedMargin,
    esg: weightedESG,
    shariahPct,
    sectors,
    holdings: holdings.length,
    totalInvested: investmentAmount,
  };
}

export default function PortfolioGenerator() {
  const [selectedTickers, setSelectedTickers] = useState(
    new Set(['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'JNJ', 'JPM', 'XOM', 'PG'])
  );
  const [strategy, setStrategy] = useState('equal');
  const [constraints, setConstraints] = useState({ maxWeight: 25, minWeight: 2 });
  const [investmentAmount, setInvestmentAmount] = useState(100000);
  const [searchTerm, setSearchTerm] = useState('');
  const [generated, setGenerated] = useState(false);

  const filteredStocks = useMemo(() => {
    if (!searchTerm) return stocks;
    const q = searchTerm.toUpperCase();
    return stocks.filter(s => s.ticker.includes(q) || s.name.toUpperCase().includes(q));
  }, [searchTerm]);

  const toggleStock = (ticker) => {
    setSelectedTickers(prev => {
      const next = new Set(prev);
      if (next.has(ticker)) next.delete(ticker); else next.add(ticker);
      return next;
    });
    setGenerated(false);
  };

  const selectedStocks = useMemo(
    () => stocks.filter(s => selectedTickers.has(s.ticker)),
    [selectedTickers]
  );

  const allocations = useMemo(
    () => generated ? optimize(selectedStocks, strategy, constraints) : [],
    [generated, selectedStocks, strategy, constraints]
  );

  const metrics = useMemo(
    () => allocations.length > 0 ? portfolioMetrics(allocations, investmentAmount) : null,
    [allocations, investmentAmount]
  );

  // Efficient frontier simulation
  const frontierData = useMemo(() => {
    if (selectedStocks.length < 2) return [];
    const points = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const risk = selectedStocks.reduce((s, st) => s + st.beta, 0) / selectedStocks.length;
      const ret = selectedStocks.reduce((s, st) => s + st.revGrowth, 0) / selectedStocks.length;
      const simRisk = (risk * 0.3 + risk * t * 1.4) * 10;
      const simRet = ret * 0.2 + ret * t * 0.9 + (Math.random() - 0.5) * 2;
      points.push({ risk: parseFloat(simRisk.toFixed(1)), return: parseFloat(simRet.toFixed(1)) });
    }
    return points.sort((a, b) => a.risk - b.risk);
  }, [selectedStocks]);

  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      {/* Stock Selection */}
      <Panel title={`Select Securities (${selectedTickers.size})`} className="col-span-3 row-span-4">
        <div className="space-y-1 mb-1">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search ticker or name..."
            className="w-full bg-bb-dark border border-bb-border text-bb-white text-[10px] px-2 py-1 font-mono focus:border-bb-amber focus:outline-none"
          />
          <div className="flex gap-1 text-[9px]">
            <button onClick={() => { setSelectedTickers(new Set(stocks.map(s => s.ticker))); setGenerated(false); }}
              className="px-1.5 py-0.5 border border-bb-border text-bb-cyan hover:text-bb-white">All</button>
            <button onClick={() => { setSelectedTickers(new Set()); setGenerated(false); }}
              className="px-1.5 py-0.5 border border-bb-border text-bb-red hover:text-bb-white">None</button>
            <button onClick={() => {
              setSelectedTickers(new Set(stocks.filter(s => s.debtToAssets < 0.30 && s.debtEquity < 0.33 && s.haramRevenue < 5).map(s => s.ticker)));
              setGenerated(false);
            }}
              className="px-1.5 py-0.5 border border-bb-border text-bb-green hover:text-bb-white">Shariah</button>
          </div>
        </div>
        <div className="overflow-auto" style={{ maxHeight: 'calc(100% - 52px)' }}>
          <table className="bb-table">
            <thead><tr><th></th><th>Ticker</th><th className="text-right">MCap</th><th className="text-right">Beta</th></tr></thead>
            <tbody>
              {filteredStocks.map(s => (
                <tr key={s.ticker} onClick={() => toggleStock(s.ticker)} className="cursor-pointer">
                  <td>
                    <span className={`inline-block w-3 h-3 border text-center text-[8px] leading-3 ${
                      selectedTickers.has(s.ticker) ? 'border-bb-green bg-bb-green/20 text-bb-green' : 'border-bb-border text-bb-muted'
                    }`}>
                      {selectedTickers.has(s.ticker) ? '✓' : ''}
                    </span>
                  </td>
                  <td className={selectedTickers.has(s.ticker) ? 'text-bb-amber font-bold' : 'text-bb-muted'}>{s.ticker}</td>
                  <td className="text-right text-[10px]">{formatMcap(s.mcap)}</td>
                  <td className="text-right">{s.beta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Strategy & Constraints */}
      <Panel title="OPT — Optimization Strategy" className="col-span-3 row-span-2">
        <div className="space-y-1.5 text-[10px]">
          {STRATEGIES.map(st => (
            <label
              key={st.id}
              onClick={() => { setStrategy(st.id); setGenerated(false); }}
              className={`flex items-start gap-1.5 p-1 border cursor-pointer transition-colors ${
                strategy === st.id ? 'border-bb-amber bg-bb-amber/5' : 'border-bb-border hover:border-bb-muted'
              }`}
            >
              <span className={`mt-0.5 inline-block w-2.5 h-2.5 rounded-full border-2 ${
                strategy === st.id ? 'border-bb-amber bg-bb-amber' : 'border-bb-muted'
              }`} />
              <div>
                <div className={strategy === st.id ? 'text-bb-amber font-bold' : 'text-bb-white'}>{st.label}</div>
                <div className="text-bb-muted text-[8px]">{st.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </Panel>

      {/* Constraints */}
      <Panel title="Constraints" className="col-span-3 row-span-2">
        <div className="space-y-2 text-[10px] p-0.5">
          <div>
            <div className="flex justify-between text-bb-muted mb-0.5">
              <span>Max Weight per Holding</span>
              <span className="text-bb-white">{constraints.maxWeight}%</span>
            </div>
            <input type="range" min={5} max={100} value={constraints.maxWeight}
              onChange={e => { setConstraints(c => ({ ...c, maxWeight: +e.target.value })); setGenerated(false); }}
              className="w-full h-1 appearance-none bg-bb-border rounded cursor-pointer accent-[#ffbf00]" />
          </div>
          <div>
            <div className="flex justify-between text-bb-muted mb-0.5">
              <span>Min Weight per Holding</span>
              <span className="text-bb-white">{constraints.minWeight}%</span>
            </div>
            <input type="range" min={0} max={20} value={constraints.minWeight}
              onChange={e => { setConstraints(c => ({ ...c, minWeight: +e.target.value })); setGenerated(false); }}
              className="w-full h-1 appearance-none bg-bb-border rounded cursor-pointer accent-[#ffbf00]" />
          </div>
          <div>
            <div className="flex justify-between text-bb-muted mb-0.5">
              <span>Investment Amount</span>
              <span className="text-bb-white">{formatCurrency(investmentAmount, 0)}</span>
            </div>
            <input type="range" min={10000} max={10000000} step={10000} value={investmentAmount}
              onChange={e => setInvestmentAmount(+e.target.value)}
              className="w-full h-1 appearance-none bg-bb-border rounded cursor-pointer accent-[#ffbf00]" />
          </div>
          <button
            onClick={() => setGenerated(true)}
            disabled={selectedTickers.size === 0}
            className={`w-full py-1.5 font-bold text-[11px] border transition-colors ${
              selectedTickers.size > 0
                ? 'border-bb-green text-bb-green hover:bg-bb-green/10'
                : 'border-bb-border text-bb-muted cursor-not-allowed'
            }`}
          >
            GENERATE PORTFOLIO
          </button>
        </div>
      </Panel>

      {/* Efficient Frontier */}
      <Panel title="Efficient Frontier (Simulated)" className="col-span-3 row-span-2">
        {frontierData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 5, right: 10, bottom: 5, left: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="risk" name="Risk (%)" tick={{ fill: '#6a6a6a', fontSize: 8 }} label={{ value: 'Risk', position: 'bottom', fill: '#6a6a6a', fontSize: 8, offset: -2 }} />
              <YAxis dataKey="return" name="Return (%)" tick={{ fill: '#6a6a6a', fontSize: 8 }} label={{ value: 'Return', angle: -90, position: 'insideLeft', fill: '#6a6a6a', fontSize: 8 }} />
              <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', fontSize: '10px', fontFamily: 'monospace' }} />
              <Scatter data={frontierData} fill="#4a9eff" r={3} />
            </ScatterChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-bb-muted text-[10px]">Select 2+ securities</div>
        )}
      </Panel>

      {/* Results */}
      {generated && allocations.length > 0 ? (
        <>
          {/* Portfolio Metrics */}
          <Panel title="Portfolio Metrics" className="col-span-3 row-span-4">
            <div className="space-y-2 text-[10px] p-0.5">
              <div className="text-center py-1.5 border border-bb-border bg-bb-dark">
                <div className="text-bb-muted text-[9px]">TOTAL INVESTED</div>
                <div className="text-xl font-bold text-bb-white">{formatCurrency(investmentAmount, 0)}</div>
                <div className="text-bb-muted text-[9px]">{metrics.holdings} holdings</div>
              </div>

              <table className="bb-table">
                <tbody>
                  {[
                    ['Wtd Beta', metrics.beta.toFixed(2)],
                    ['Wtd P/E', metrics.pe.toFixed(1)],
                    ['Wtd Div Yield', metrics.divYield.toFixed(2) + '%'],
                    ['Wtd Rev Growth', formatPercent(metrics.growth)],
                    ['Wtd Net Margin', metrics.margin.toFixed(1) + '%'],
                    ['Wtd ESG Score', metrics.esg.toFixed(0)],
                    ['Shariah Weight', metrics.shariahPct.toFixed(1) + '%'],
                  ].map(([label, val]) => (
                    <tr key={label}>
                      <td className="text-bb-muted">{label}</td>
                      <td className="text-right font-bold">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Sector pie */}
              <div className="border-t border-bb-border pt-1">
                <div className="text-[9px] text-bb-muted mb-1">SECTOR ALLOCATION</div>
                <ResponsiveContainer width="100%" height={120}>
                  <PieChart>
                    <Pie data={metrics.sectors} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} innerRadius={25} strokeWidth={1} stroke="#1a1a1a">
                      {metrics.sectors.map(s => <Cell key={s.name} fill={s.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', fontSize: '10px', fontFamily: 'monospace' }} formatter={v => v + '%'} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-0.5 text-[9px]">
                  {metrics.sectors.map(s => (
                    <div key={s.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="inline-block w-2 h-2" style={{ backgroundColor: s.color }} />
                        <span className="text-bb-muted">{s.name}</span>
                      </div>
                      <span>{s.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Panel>

          {/* Allocation Table */}
          <Panel title="Optimized Allocation" className="col-span-6 row-span-4">
            <table className="bb-table">
              <thead>
                <tr>
                  <th>Ticker</th>
                  <th>Name</th>
                  <th className="text-right">Weight</th>
                  <th className="text-right">Amount</th>
                  <th className="text-right">Shares</th>
                  <th className="text-right">Price</th>
                  <th className="text-right">Beta</th>
                  <th className="text-right">Yield</th>
                  <th>Sector</th>
                </tr>
              </thead>
              <tbody>
                {allocations
                  .sort((a, b) => b.weight - a.weight)
                  .map(h => {
                    const amount = h.allocation * investmentAmount;
                    const shares = Math.floor(amount / h.price);
                    return (
                      <tr key={h.ticker}>
                        <td className="text-bb-amber font-bold">{h.ticker}</td>
                        <td>{h.name}</td>
                        <td className="text-right font-bold">{h.weight.toFixed(1)}%</td>
                        <td className="text-right">{formatCurrency(amount, 0)}</td>
                        <td className="text-right">{shares}</td>
                        <td className="text-right">{formatCurrency(h.price)}</td>
                        <td className="text-right">{h.beta}</td>
                        <td className="text-right">{h.divYield}%</td>
                        <td className="text-bb-muted">{h.sector}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>

            {/* Weight bar chart */}
            <div className="mt-2 border-t border-bb-border pt-1">
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={allocations.sort((a, b) => b.weight - a.weight)} margin={{ top: 5, right: 5, bottom: 0, left: 5 }}>
                  <XAxis dataKey="ticker" tick={{ fill: '#6a6a6a', fontSize: 8 }} />
                  <YAxis tick={{ fill: '#6a6a6a', fontSize: 8 }} tickFormatter={v => v + '%'} />
                  <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', fontSize: '10px', fontFamily: 'monospace' }} formatter={v => v.toFixed(1) + '%'} />
                  <Bar dataKey="weight" radius={[2, 2, 0, 0]}>
                    {allocations.map(h => (
                      <Cell key={h.ticker} fill={SECTOR_COLORS[h.sector] || '#4a9eff'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </>
      ) : (
        <Panel title="Portfolio Output" className="col-span-9 row-span-4">
          <div className="flex items-center justify-center h-full text-bb-muted text-[11px]">
            <div className="text-center space-y-2">
              <div className="text-2xl text-bb-border">OPT</div>
              <div>Select securities, choose a strategy, and click GENERATE PORTFOLIO</div>
              <div className="text-[9px]">Bloomberg OPT equivalent — Portfolio Optimization</div>
            </div>
          </div>
        </Panel>
      )}
    </div>
  );
}
