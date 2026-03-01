import { useState, useMemo , memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import Panel from '../layout/Panel';
import { stocks } from '../../data/stocks';
import { portfolioHoldings, calculatePortfolioMetrics } from '../../data/portfolio';
import { formatCurrency, formatPercent, colorClass, round } from '../../utils/format';

const chartTooltip = {
  contentStyle: { background: '#1a1a1a', border: '1px solid #2a2a2a', fontSize: '10px', fontFamily: 'monospace' },
  labelStyle: { color: '#ffbf00', fontSize: '10px' },
};

const SCENARIOS = [
  {
    id: 'crash2008',
    name: '2008 Financial Crisis',
    desc: 'S&P 500 -38.5%, credit freeze, bank failures',
    marketShock: -38.5,
    sectorShocks: { Financials: -55, Technology: -40, 'Consumer Discretionary': -42, Energy: -35, Healthcare: -25, 'Consumer Staples': -18 },
  },
  {
    id: 'covid2020',
    name: 'COVID-19 Crash (Mar 2020)',
    desc: 'S&P 500 -33.9%, pandemic shutdown, liquidity crisis',
    marketShock: -33.9,
    sectorShocks: { Energy: -52, Financials: -38, 'Consumer Discretionary': -35, Technology: -25, Healthcare: -20, 'Consumer Staples': -15 },
  },
  {
    id: 'dotcom',
    name: 'Dot-Com Bust (2000-02)',
    desc: 'S&P 500 -49.1%, tech bubble burst',
    marketShock: -49.1,
    sectorShocks: { Technology: -72, 'Communication Services': -65, 'Consumer Discretionary': -35, Financials: -20, Healthcare: -15, Energy: -10, 'Consumer Staples': -8 },
  },
  {
    id: 'rateshock2022',
    name: '2022 Rate Shock',
    desc: 'Fed 425bp hikes, S&P 500 -19.4%',
    marketShock: -19.4,
    sectorShocks: { Technology: -28, 'Real Estate': -25, 'Consumer Discretionary': -20, Financials: 5, Energy: 3, 'Consumer Staples': -8, Healthcare: -12 },
  },
  {
    id: 'blackmonday',
    name: 'Black Monday 1987',
    desc: 'Single-day crash -22.6%, program trading cascade',
    marketShock: -22.6,
    sectorShocks: { Technology: -25, Financials: -28, 'Consumer Discretionary': -22, Energy: -18, Healthcare: -15, 'Consumer Staples': -12 },
  },
  {
    id: 'gccoilcrash',
    name: 'GCC Oil Crash 2014',
    desc: 'Oil $115→$28, Gulf fiscal crisis',
    marketShock: -5,
    sectorShocks: { Energy: -48, Financials: -15, 'Real Estate': -25, Technology: -3, 'Consumer Staples': -2, Healthcare: -2 },
  },
  {
    id: 'stagflation',
    name: 'Stagflation 1973',
    desc: 'OPEC embargo, S&P -48%, gold +73%',
    marketShock: -48,
    sectorShocks: { Technology: -30, Financials: -28, 'Consumer Discretionary': -32, Energy: 10, 'Consumer Staples': -10, Healthcare: -15, 'Real Estate': -20 },
  },
  {
    id: 'oilshock',
    name: 'Oil Crisis ($150/bbl)',
    desc: 'Oil spikes to $150, supply disruption, inflation surge',
    marketShock: -15,
    sectorShocks: { Energy: 25, Technology: -18, 'Consumer Discretionary': -22, 'Consumer Staples': -12, Financials: -15, Healthcare: -10 },
  },
  {
    id: 'geopolitical',
    name: 'Geopolitical Escalation',
    desc: 'Major conflict disrupts global trade and supply chains',
    marketShock: -20,
    sectorShocks: { Technology: -25, Energy: 15, Financials: -18, 'Consumer Discretionary': -22, 'Consumer Staples': -8, Healthcare: -12 },
  },
  {
    id: 'gccreboom',
    name: 'GCC Real Estate Boom',
    desc: 'Mega-project completions, RE +40%, oil +15%',
    marketShock: 2,
    sectorShocks: { 'Real Estate': 40, Financials: 12, 'Consumer Discretionary': 8, Energy: 15, Technology: 3, Healthcare: 2, 'Consumer Staples': 3 },
  },
];

function runScenario(scenario, holdings, stockData) {
  const detailed = holdings.map(h => {
    const stockInfo = stockData.find(s => s.ticker === h.symbol) || {};
    const sectorShock = (scenario.sectorShocks[h.sector] ?? scenario.marketShock) / 100;
    const beta = stockInfo.beta || 1;
    // Beta-adjusted shock: sector-level shock * beta weighting
    const adjustedShock = sectorShock * (0.5 + beta * 0.5);
    const currentValue = h.shares * h.current;
    const stressedPrice = h.current * (1 + adjustedShock);
    const stressedValue = h.shares * stressedPrice;
    const pnl = stressedValue - currentValue;
    return {
      ...h,
      beta,
      shock: adjustedShock * 100,
      stressedPrice,
      stressedValue,
      pnl,
      pnlPct: adjustedShock * 100,
      currentValue,
    };
  });

  const totalCurrent = detailed.reduce((s, h) => s + h.currentValue, 0);
  const totalStressed = detailed.reduce((s, h) => s + h.stressedValue, 0);
  const totalPnl = totalStressed - totalCurrent;
  const totalPnlPct = (totalPnl / totalCurrent) * 100;

  // VaR approximation (95% confidence, 1-day)
  const avgBeta = detailed.reduce((s, h) => s + (h.beta * h.currentValue / totalCurrent), 0);
  const dailyVol = avgBeta * 1.2; // Approximate daily market vol
  const var95 = totalCurrent * dailyVol / 100 * 1.645;
  const var99 = totalCurrent * dailyVol / 100 * 2.326;

  // Max drawdown in scenario
  const maxDrawdown = Math.min(...detailed.map(h => h.pnlPct));

  return {
    holdings: detailed.sort((a, b) => a.pnl - b.pnl),
    totalCurrent,
    totalStressed,
    totalPnl,
    totalPnlPct,
    var95,
    var99,
    maxDrawdown,
    avgBeta,
    worstHolding: detailed.reduce((w, h) => h.pnlPct < w.pnlPct ? h : w, detailed[0]),
    bestHolding: detailed.reduce((b, h) => h.pnlPct > b.pnlPct ? h : b, detailed[0]),
  };
}

// Custom scenario
function buildCustomScenario(marketShock, sectorOverrides) {
  return {
    id: 'custom',
    name: 'Custom Scenario',
    desc: `Market ${marketShock >= 0 ? '+' : ''}${marketShock}% with sector overrides`,
    marketShock,
    sectorShocks: sectorOverrides,
  };
}

function StressTest() {
  const [selectedScenario, setSelectedScenario] = useState(SCENARIOS[0].id);
  const [customShock, setCustomShock] = useState(-20);
  const [customSectors, setCustomSectors] = useState({});
  const [useCustom, setUseCustom] = useState(false);

  const portfolio = useMemo(() => calculatePortfolioMetrics(portfolioHoldings), []);

  const scenario = useMemo(() => {
    if (useCustom) {
      return buildCustomScenario(customShock, customSectors);
    }
    return SCENARIOS.find(s => s.id === selectedScenario) || SCENARIOS[0];
  }, [selectedScenario, useCustom, customShock, customSectors]);

  const results = useMemo(
    () => runScenario(scenario, portfolioHoldings, stocks),
    [scenario]
  );

  // Multi-scenario comparison
  const comparison = useMemo(() =>
    SCENARIOS.map(sc => {
      const r = runScenario(sc, portfolioHoldings, stocks);
      return { name: sc.name.split(' ')[0], ...r, scenario: sc };
    }),
    []
  );

  // Drawdown path simulation
  const drawdownPath = useMemo(() => {
    const steps = 20;
    const shock = scenario.marketShock / 100;
    return Array.from({ length: steps + 1 }, (_, i) => {
      const t = i / steps;
      // Simulate a V-shaped or L-shaped drawdown
      const phase = t < 0.4 ? t / 0.4 : 1; // draw down in first 40%
      const recovery = t > 0.6 ? (t - 0.6) / 0.4 * 0.3 : 0; // partial recovery
      const change = shock * phase + recovery * Math.abs(shock);
      return {
        day: i,
        value: results.totalCurrent * (1 + change),
      };
    });
  }, [scenario, results.totalCurrent]);

  const sectors = [...new Set(portfolioHoldings.map(h => h.sector))];

  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      {/* Scenario Selection */}
      <Panel title="PORT SCEN — Scenario Selection" className="col-span-3 row-span-4">
        <div className="space-y-1 text-[10px]">
          <div className="flex gap-1 mb-1">
            <button
              onClick={() => setUseCustom(false)}
              className={`flex-1 py-0.5 border text-[9px] ${!useCustom ? 'border-bb-amber text-bb-amber bg-bb-amber/10' : 'border-bb-border text-bb-muted'}`}
            >
              Presets
            </button>
            <button
              onClick={() => setUseCustom(true)}
              className={`flex-1 py-0.5 border text-[9px] ${useCustom ? 'border-bb-amber text-bb-amber bg-bb-amber/10' : 'border-bb-border text-bb-muted'}`}
            >
              Custom
            </button>
          </div>

          {!useCustom ? (
            <div className="space-y-1 overflow-auto" style={{ maxHeight: 'calc(100% - 30px)' }}>
              {SCENARIOS.map(sc => (
                <button
                  key={sc.id}
                  onClick={() => setSelectedScenario(sc.id)}
                  className={`w-full text-left p-1.5 border transition-colors ${
                    selectedScenario === sc.id ? 'border-bb-red bg-bb-red/5' : 'border-bb-border hover:border-bb-muted'
                  }`}
                >
                  <div className={`font-bold text-[10px] ${selectedScenario === sc.id ? 'text-bb-red' : 'text-bb-white'}`}>
                    {sc.name}
                  </div>
                  <div className="text-bb-muted text-[8px] mt-0.5">{sc.desc}</div>
                  <div className={`text-[9px] mt-0.5 font-bold ${colorClass(sc.marketShock)}`}>
                    Market: {sc.marketShock > 0 ? '+' : ''}{sc.marketShock}%
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-bb-muted mb-0.5">
                  <span>Market Shock</span>
                  <span className={colorClass(customShock)}>{customShock}%</span>
                </div>
                <input type="range" min={-60} max={30} value={customShock}
                  onChange={e => setCustomShock(+e.target.value)}
                  className="w-full h-1 appearance-none bg-bb-border rounded cursor-pointer accent-[#ff3b3b]" />
              </div>
              <div className="border-t border-bb-border pt-1">
                <div className="text-bb-muted text-[9px] mb-1">SECTOR OVERRIDES</div>
                {sectors.map(sec => (
                  <div key={sec} className="flex items-center justify-between mb-1">
                    <span className="text-bb-muted text-[9px] w-28 truncate">{sec}</span>
                    <input
                      type="number"
                      value={customSectors[sec] ?? ''}
                      placeholder={customShock.toString()}
                      onChange={e => setCustomSectors(prev => ({
                        ...prev,
                        [sec]: e.target.value === '' ? undefined : +e.target.value,
                      }))}
                      className="w-14 bg-bb-dark border border-bb-border text-bb-white text-[9px] px-1 py-0.5 text-right font-mono focus:border-bb-amber focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Panel>

      {/* Portfolio Impact Summary */}
      <Panel title="Portfolio Impact" className="col-span-4 row-span-2">
        <div className="grid grid-cols-2 gap-2 p-1 text-[10px]">
          <div className="text-center py-2 border border-bb-border bg-bb-dark">
            <div className="text-bb-muted text-[9px]">CURRENT VALUE</div>
            <div className="text-lg font-bold text-bb-white">{formatCurrency(results.totalCurrent, 0)}</div>
          </div>
          <div className={`text-center py-2 border ${results.totalPnl >= 0 ? 'border-bb-green bg-bb-green/5' : 'border-bb-red bg-bb-red/5'}`}>
            <div className="text-bb-muted text-[9px]">STRESSED VALUE</div>
            <div className={`text-lg font-bold ${colorClass(results.totalPnl)}`}>{formatCurrency(results.totalStressed, 0)}</div>
          </div>
          <div className={`text-center py-1.5 border ${results.totalPnl >= 0 ? 'border-bb-green' : 'border-bb-red'}`}>
            <div className="text-bb-muted text-[9px]">P&L</div>
            <div className={`font-bold ${colorClass(results.totalPnl)}`}>{formatCurrency(results.totalPnl, 0)}</div>
            <div className={`text-[9px] ${colorClass(results.totalPnlPct)}`}>{formatPercent(results.totalPnlPct)}</div>
          </div>
          <div className="text-center py-1.5 border border-bb-border">
            <div className="text-bb-muted text-[9px]">PORTFOLIO BETA</div>
            <div className="font-bold text-bb-white">{round(results.avgBeta, 2)}</div>
          </div>
        </div>
      </Panel>

      {/* Risk Metrics */}
      <Panel title="Risk Metrics" className="col-span-2 row-span-2">
        <table className="bb-table">
          <tbody>
            {[
              ['VaR (95%, 1d)', formatCurrency(results.var95, 0), 'text-bb-red'],
              ['VaR (99%, 1d)', formatCurrency(results.var99, 0), 'text-bb-red'],
              ['Max DD (holding)', round(results.maxDrawdown, 1) + '%', 'text-bb-red'],
              ['Worst', results.worstHolding.symbol, colorClass(results.worstHolding.pnlPct)],
              ['Best', results.bestHolding.symbol, colorClass(results.bestHolding.pnlPct)],
            ].map(([label, val, cls]) => (
              <tr key={label}>
                <td className="text-bb-muted">{label}</td>
                <td className={`text-right font-bold ${cls}`}>{val}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      {/* Drawdown Path */}
      <Panel title="Scenario Drawdown Path" className="col-span-3 row-span-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={drawdownPath} margin={{ top: 5, right: 10, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis dataKey="day" tick={{ fill: '#6a6a6a', fontSize: 8 }} label={{ value: 'Days', position: 'bottom', fill: '#6a6a6a', fontSize: 8, offset: -2 }} />
            <YAxis tick={{ fill: '#6a6a6a', fontSize: 8 }} tickFormatter={v => '$' + round(v / 1000, 0) + 'K'} domain={['dataMin', 'dataMax']} />
            <Tooltip {...chartTooltip} formatter={v => formatCurrency(v, 0)} />
            <Line type="monotone" dataKey="value" stroke="#ff3b3b" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Panel>

      {/* Scenario Comparison Bar */}
      <Panel title="Multi-Scenario Comparison" className="col-span-3 row-span-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={comparison} margin={{ top: 5, right: 5, bottom: 5, left: 5 }} layout="vertical">
            <XAxis type="number" tick={{ fill: '#6a6a6a', fontSize: 8 }} tickFormatter={v => round(v, 0) + '%'} />
            <YAxis type="category" dataKey="name" tick={{ fill: '#6a6a6a', fontSize: 8 }} width={65} />
            <Tooltip {...chartTooltip} formatter={v => round(v, 1) + '%'} />
            <Bar dataKey="totalPnlPct" radius={[0, 2, 2, 0]}>
              {comparison.map(c => (
                <Cell key={c.name} fill={c.totalPnlPct >= 0 ? '#00d26a' : '#ff3b3b'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Panel>

      {/* Holdings Breakdown */}
      <Panel title="Per-Holding Stress Impact" className="col-span-6 row-span-4">
        <table className="bb-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Sector</th>
              <th className="text-right">Shares</th>
              <th className="text-right">Current</th>
              <th className="text-right">Stressed</th>
              <th className="text-right">Beta</th>
              <th className="text-right">Shock</th>
              <th className="text-right">P&L</th>
              <th className="text-right">P&L %</th>
            </tr>
          </thead>
          <tbody>
            {results.holdings.map(h => (
              <tr key={h.symbol}>
                <td className="text-bb-amber font-bold">{h.symbol}</td>
                <td className="text-bb-muted">{h.sector}</td>
                <td className="text-right">{h.shares}</td>
                <td className="text-right">{formatCurrency(h.currentValue, 0)}</td>
                <td className="text-right">{formatCurrency(h.stressedValue, 0)}</td>
                <td className="text-right">{round(h.beta, 2)}</td>
                <td className={`text-right font-bold ${colorClass(h.shock)}`}>{h.shock > 0 ? '+' : ''}{round(h.shock, 1)}%</td>
                <td className={`text-right font-bold ${colorClass(h.pnl)}`}>{formatCurrency(h.pnl, 0)}</td>
                <td className={`text-right font-bold ${colorClass(h.pnlPct)}`}>{formatPercent(h.pnlPct)}</td>
              </tr>
            ))}
            {/* Totals row */}
            <tr className="border-t-2 border-bb-amber">
              <td className="font-bold text-bb-white" colSpan={3}>TOTAL</td>
              <td className="text-right font-bold">{formatCurrency(results.totalCurrent, 0)}</td>
              <td className="text-right font-bold">{formatCurrency(results.totalStressed, 0)}</td>
              <td className="text-right font-bold">{round(results.avgBeta, 2)}</td>
              <td></td>
              <td className={`text-right font-bold ${colorClass(results.totalPnl)}`}>{formatCurrency(results.totalPnl, 0)}</td>
              <td className={`text-right font-bold ${colorClass(results.totalPnlPct)}`}>{formatPercent(results.totalPnlPct)}</td>
            </tr>
          </tbody>
        </table>

        {/* Impact bar chart */}
        <div className="mt-2 border-t border-bb-border pt-1">
          <div className="text-[9px] text-bb-muted mb-1">P&L BY HOLDING</div>
          <ResponsiveContainer width="100%" height={80}>
            <BarChart data={results.holdings} margin={{ top: 2, right: 5, bottom: 0, left: 5 }}>
              <XAxis dataKey="symbol" tick={{ fill: '#6a6a6a', fontSize: 8 }} />
              <YAxis tick={{ fill: '#6a6a6a', fontSize: 8 }} tickFormatter={v => '$' + round(v / 1000, 0) + 'K'} />
              <Tooltip {...chartTooltip} formatter={v => formatCurrency(v, 0)} />
              <Bar dataKey="pnl" radius={[2, 2, 0, 0]}>
                {results.holdings.map(h => (
                  <Cell key={h.symbol} fill={h.pnl >= 0 ? '#00d26a' : '#ff3b3b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      {/* Bottom: Sector Impact Heatmap */}
      <Panel title="Sector Shock Matrix" className="col-span-3 row-span-2">
        <div className="space-y-0.5 text-[10px] p-0.5">
          {Object.entries(scenario.sectorShocks || {}).sort((a, b) => a[1] - b[1]).map(([sector, shock]) => (
            <div key={sector} className="flex items-center justify-between">
              <span className="text-bb-muted text-[9px] w-28 truncate">{sector}</span>
              <div className="flex-1 mx-2 h-3 bg-bb-dark border border-bb-border relative">
                <div
                  className="absolute top-0 h-full"
                  style={{
                    width: `${Math.min(Math.abs(shock), 80)}%`,
                    backgroundColor: shock >= 0 ? '#00d26a' : '#ff3b3b',
                    opacity: 0.6,
                    left: shock >= 0 ? '50%' : undefined,
                    right: shock < 0 ? '50%' : undefined,
                  }}
                />
              </div>
              <span className={`w-10 text-right font-bold ${colorClass(shock)}`}>
                {shock > 0 ? '+' : ''}{shock}%
              </span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

export default memo(StressTest);
