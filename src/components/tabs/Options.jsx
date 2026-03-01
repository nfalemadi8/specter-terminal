import { useState, useMemo } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import Panel from '../layout/Panel';
import { formatNumber, formatCurrency, colorClass, round } from '../../utils/format';
import { blackScholes, calculateGreeks } from '../../utils/calculations';

const chainData = {
  underlying: 'AAPL', underlyingPrice: 189.84, expiry: '2024-02-16',
  calls: [
    { strike: 180, last: 11.20, change: 0.85, bid: 11.10, ask: 11.30, volume: 12450, oi: 45280, iv: 0.248 },
    { strike: 182.5, last: 9.15, change: 0.72, bid: 9.05, ask: 9.25, volume: 8920, oi: 32140, iv: 0.242 },
    { strike: 185, last: 7.25, change: 0.58, bid: 7.15, ask: 7.35, volume: 15680, oi: 52470, iv: 0.235 },
    { strike: 187.5, last: 5.50, change: 0.42, bid: 5.40, ask: 5.60, volume: 22340, oi: 68920, iv: 0.228 },
    { strike: 190, last: 3.95, change: 0.28, bid: 3.85, ask: 4.05, volume: 35120, oi: 84560, iv: 0.222 },
    { strike: 192.5, last: 2.65, change: -0.15, bid: 2.55, ask: 2.75, volume: 28450, oi: 71240, iv: 0.218 },
    { strike: 195, last: 1.68, change: -0.32, bid: 1.60, ask: 1.76, volume: 42180, oi: 95640, iv: 0.215 },
    { strike: 197.5, last: 0.98, change: -0.22, bid: 0.92, ask: 1.04, volume: 18920, oi: 54280, iv: 0.212 },
    { strike: 200, last: 0.52, change: -0.18, bid: 0.48, ask: 0.56, volume: 24560, oi: 62480, iv: 0.210 },
  ],
  puts: [
    { strike: 180, last: 1.35, change: -0.42, bid: 1.28, ask: 1.42, volume: 8920, oi: 28560, iv: 0.252 },
    { strike: 182.5, last: 1.78, change: -0.38, bid: 1.70, ask: 1.86, volume: 6450, oi: 22140, iv: 0.248 },
    { strike: 185, last: 2.38, change: -0.32, bid: 2.30, ask: 2.46, volume: 11280, oi: 38920, iv: 0.242 },
    { strike: 187.5, last: 3.12, change: -0.25, bid: 3.02, ask: 3.22, volume: 15640, oi: 45680, iv: 0.236 },
    { strike: 190, last: 4.08, change: 0.12, bid: 3.98, ask: 4.18, volume: 28920, oi: 72340, iv: 0.230 },
    { strike: 192.5, last: 5.28, change: 0.28, bid: 5.18, ask: 5.38, volume: 19450, oi: 51280, iv: 0.225 },
    { strike: 195, last: 6.78, change: 0.45, bid: 6.68, ask: 6.88, volume: 14280, oi: 42560, iv: 0.222 },
    { strike: 197.5, last: 8.58, change: 0.52, bid: 8.48, ask: 8.68, volume: 7820, oi: 28450, iv: 0.220 },
    { strike: 200, last: 10.62, change: 0.68, bid: 10.52, ask: 10.72, volume: 5640, oi: 22180, iv: 0.218 },
  ],
};

const STRATEGIES = [
  { id: 'single_call', label: 'Long Call', legs: [{ type: 'call', dir: 1 }] },
  { id: 'single_put', label: 'Long Put', legs: [{ type: 'put', dir: 1 }] },
  { id: 'covered_call', label: 'Covered Call', legs: [{ type: 'stock', dir: 1 }, { type: 'call', dir: -1 }] },
  { id: 'protective_put', label: 'Protective Put', legs: [{ type: 'stock', dir: 1 }, { type: 'put', dir: 1 }] },
  { id: 'straddle', label: 'Long Straddle', legs: [{ type: 'call', dir: 1 }, { type: 'put', dir: 1 }] },
  { id: 'strangle', label: 'Long Strangle', legs: [{ type: 'call', dir: 1, strikeOffset: 1 }, { type: 'put', dir: 1, strikeOffset: -1 }] },
];

const tt = { contentStyle: { background: '#1a1a1a', border: '1px solid #2a2a2a', fontSize: '10px', fontFamily: 'monospace' }, labelStyle: { color: '#ffbf00', fontSize: '10px' } };

export default function Options() {
  const { underlying, underlyingPrice, expiry, calls, puts } = chainData;

  // Pricer state
  const [pSpot, setPSpot] = useState(underlyingPrice);
  const [pStrike, setPStrike] = useState(190);
  const [pDays, setPDays] = useState(30);
  const [pVol, setPVol] = useState(22.2);
  const [pRate, setPRate] = useState(5.25);
  const [pType, setPType] = useState('call');

  // Strategy
  const [strategyId, setStrategyId] = useState('single_call');
  const [stratStrike, setStratStrike] = useState(4); // index into calls/puts

  const T = pDays / 365;
  const bsPrice = useMemo(() => blackScholes(pSpot, pStrike, T, pRate / 100, pVol / 100, pType), [pSpot, pStrike, T, pRate, pVol, pType]);
  const greeks = useMemo(() => calculateGreeks(pSpot, pStrike, T, pRate / 100, pVol / 100), [pSpot, pStrike, T, pRate, pVol]);

  // IV Smile
  const ivSmile = useMemo(() => calls.map((c, i) => ({ strike: c.strike, callIV: (c.iv * 100), putIV: (puts[i].iv * 100) })), []);

  // Payoff diagram
  const payoff = useMemo(() => {
    const strat = STRATEGIES.find(s => s.id === strategyId);
    const si = stratStrike;
    const points = [];
    for (let s = underlyingPrice * 0.8; s <= underlyingPrice * 1.2; s += underlyingPrice * 0.005) {
      let pnl = 0;
      strat.legs.forEach(leg => {
        const offset = leg.strikeOffset || 0;
        const idx = Math.max(0, Math.min(si + offset, calls.length - 1));
        if (leg.type === 'stock') {
          pnl += leg.dir * (s - underlyingPrice);
        } else if (leg.type === 'call') {
          const premium = calls[idx].last;
          const strike = calls[idx].strike;
          pnl += leg.dir * (Math.max(0, s - strike) - premium);
        } else {
          const premium = puts[idx].last;
          const strike = puts[idx].strike;
          pnl += leg.dir * (Math.max(0, strike - s) - premium);
        }
      });
      points.push({ price: round(s, 2), pnl: round(pnl * 100, 2) });
    }
    return points;
  }, [strategyId, stratStrike]);

  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      {/* Options Chain - Calls */}
      <Panel title={`${underlying} Calls — Exp: ${expiry}`} className="col-span-5 row-span-3">
        <table className="bb-table">
          <thead><tr><th className="text-right">Last</th><th className="text-right">Chg</th><th className="text-right">Bid</th><th className="text-right">Ask</th><th className="text-right">Vol</th><th className="text-right">OI</th><th className="text-right">IV</th><th className="text-center text-bb-amber">Strike</th></tr></thead>
          <tbody>
            {calls.map(c => (
              <tr key={c.strike} className={c.strike <= underlyingPrice ? 'bg-bb-green/5' : ''}>
                <td className="text-right">{formatNumber(c.last)}</td>
                <td className={`text-right ${colorClass(c.change)}`}>{c.change > 0 ? '+' : ''}{formatNumber(c.change)}</td>
                <td className="text-right">{formatNumber(c.bid)}</td>
                <td className="text-right">{formatNumber(c.ask)}</td>
                <td className="text-right text-bb-muted">{c.volume.toLocaleString()}</td>
                <td className="text-right text-bb-muted">{c.oi.toLocaleString()}</td>
                <td className="text-right">{round(c.iv * 100, 1)}%</td>
                <td className="text-center text-bb-amber font-bold">{formatNumber(c.strike, 1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      {/* Options Chain - Puts */}
      <Panel title={`${underlying} Puts — Spot: ${formatCurrency(underlyingPrice)}`} className="col-span-5 row-span-3">
        <table className="bb-table">
          <thead><tr><th className="text-center text-bb-amber">Strike</th><th className="text-right">Last</th><th className="text-right">Chg</th><th className="text-right">Bid</th><th className="text-right">Ask</th><th className="text-right">Vol</th><th className="text-right">OI</th><th className="text-right">IV</th></tr></thead>
          <tbody>
            {puts.map(p => (
              <tr key={p.strike} className={p.strike >= underlyingPrice ? 'bg-bb-red/5' : ''}>
                <td className="text-center text-bb-amber font-bold">{formatNumber(p.strike, 1)}</td>
                <td className="text-right">{formatNumber(p.last)}</td>
                <td className={`text-right ${colorClass(p.change)}`}>{p.change > 0 ? '+' : ''}{formatNumber(p.change)}</td>
                <td className="text-right">{formatNumber(p.bid)}</td>
                <td className="text-right">{formatNumber(p.ask)}</td>
                <td className="text-right text-bb-muted">{p.volume.toLocaleString()}</td>
                <td className="text-right text-bb-muted">{p.oi.toLocaleString()}</td>
                <td className="text-right">{round(p.iv * 100, 1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      {/* OVME Pricer */}
      <Panel title="OVME — Option Pricer" className="col-span-2 row-span-6">
        <div className="space-y-1.5 text-[10px] p-0.5">
          <div className="flex gap-1 mb-1">
            {['call', 'put'].map(t => (
              <button key={t} onClick={() => setPType(t)} className={`flex-1 py-0.5 border text-[9px] uppercase ${pType === t ? 'border-bb-amber text-bb-amber bg-bb-amber/10' : 'border-bb-border text-bb-muted'}`}>{t}</button>
            ))}
          </div>
          <PInput label="Spot" value={pSpot} set={setPSpot} step={1} />
          <PInput label="Strike" value={pStrike} set={setPStrike} step={2.5} />
          <PInput label="Days" value={pDays} set={setPDays} step={1} />
          <PInput label="Vol (%)" value={pVol} set={setPVol} step={0.5} />
          <PInput label="Rate (%)" value={pRate} set={setPRate} step={0.25} />

          <div className="border-t border-bb-border pt-1.5">
            <div className="text-center py-2 border border-bb-border bg-bb-dark">
              <div className="text-bb-muted text-[9px]">THEORETICAL PRICE</div>
              <div className="text-xl font-bold text-bb-white">{formatCurrency(bsPrice)}</div>
            </div>
          </div>

          <div className="border-t border-bb-border pt-1.5">
            <div className="text-bb-muted text-[9px] mb-1">GREEKS</div>
            {[
              ['Delta (Δ)', round(greeks.delta, 4), '#4a9eff'],
              ['Gamma (Γ)', round(greeks.gamma, 6), '#00d26a'],
              ['Theta (Θ)', round(greeks.theta, 4), '#ff3b3b'],
              ['Vega (ν)', round(greeks.vega, 4), '#ffd700'],
            ].map(([label, val, color]) => (
              <div key={label} className="flex items-center justify-between py-0.5">
                <span className="text-bb-muted">{label}</span>
                <span className="font-bold" style={{ color }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      {/* IV Smile */}
      <Panel title="IV Smile" className="col-span-5 row-span-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={ivSmile}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis dataKey="strike" tick={{ fill: '#6a6a6a', fontSize: 8 }} />
            <YAxis tick={{ fill: '#6a6a6a', fontSize: 8 }} tickFormatter={v => v + '%'} domain={['dataMin - 1', 'dataMax + 1']} />
            <Tooltip {...tt} formatter={v => round(v, 1) + '%'} />
            <ReferenceLine x={underlyingPrice} stroke="#ffbf00" strokeDasharray="3 3" />
            <Line type="monotone" dataKey="callIV" stroke="#00d26a" strokeWidth={2} dot={{ r: 3 }} name="Call IV" />
            <Line type="monotone" dataKey="putIV" stroke="#ff3b3b" strokeWidth={2} dot={{ r: 3 }} name="Put IV" />
          </LineChart>
        </ResponsiveContainer>
      </Panel>

      {/* Strategy Payoff */}
      <Panel title="Strategy Payoff" className="col-span-5 row-span-3">
        <div className="flex gap-1 mb-1 flex-wrap">
          {STRATEGIES.map(s => (
            <button key={s.id} onClick={() => setStrategyId(s.id)} className={`px-1.5 py-[1px] text-[9px] border ${strategyId === s.id ? 'border-bb-cyan text-bb-cyan bg-bb-cyan/10' : 'border-bb-border text-bb-muted'}`}>{s.label}</button>
          ))}
        </div>
        <div className="flex gap-1 mb-1 text-[9px]">
          <span className="text-bb-muted">Strike:</span>
          <select value={stratStrike} onChange={e => setStratStrike(+e.target.value)} className="bg-bb-dark border border-bb-border text-bb-white text-[9px] px-1 font-mono focus:border-bb-amber focus:outline-none">
            {calls.map((c, i) => <option key={c.strike} value={i}>{c.strike}</option>)}
          </select>
        </div>
        <ResponsiveContainer width="100%" height="80%">
          <AreaChart data={payoff}>
            <defs>
              <linearGradient id="payGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4a9eff" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#4a9eff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis dataKey="price" tick={{ fill: '#6a6a6a', fontSize: 8 }} tickFormatter={v => '$' + v} />
            <YAxis tick={{ fill: '#6a6a6a', fontSize: 8 }} tickFormatter={v => '$' + v} />
            <Tooltip {...tt} formatter={v => formatCurrency(v)} />
            <ReferenceLine y={0} stroke="#ffbf00" strokeDasharray="3 3" />
            <ReferenceLine x={underlyingPrice} stroke="#6a6a6a" strokeDasharray="3 3" />
            <Area type="monotone" dataKey="pnl" stroke="#4a9eff" fill="url(#payGrad)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </Panel>
    </div>
  );
}

function PInput({ label, value, set, step }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-bb-muted">{label}</span>
      <input type="number" value={value} onChange={e => set(parseFloat(e.target.value) || 0)} step={step}
        className="w-16 bg-bb-dark border border-bb-border text-bb-white text-[10px] px-1 py-0.5 font-mono text-right focus:border-bb-amber focus:outline-none" />
    </div>
  );
}
