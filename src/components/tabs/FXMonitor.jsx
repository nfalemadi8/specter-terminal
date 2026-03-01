import { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, CartesianGrid } from 'recharts';
import Panel from '../layout/Panel';
import { forexPairs, cryptoPairs } from '../../data/forex';
import { formatNumber, formatPercent, formatChange, colorClass, round } from '../../utils/format';
import { currencyRates, convertCurrency } from '../../utils/calculations';

const tt = { contentStyle: { background: '#1a1a1a', border: '1px solid #2a2a2a', fontSize: '10px', fontFamily: 'monospace' }, labelStyle: { color: '#ffbf00', fontSize: '10px' } };

// Generate FX history
function genFXHistory(baseRate, days = 60) {
  const data = [];
  let rate = baseRate;
  for (let i = days; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    rate += (Math.random() - 0.5) * baseRate * 0.005;
    rate = Math.max(rate * 0.95, rate);
    data.push({ date: d.toISOString().split('T')[0], rate: round(rate, 4) });
  }
  return data;
}

// Majors vs GCC split
const majors = forexPairs.filter(p => !['USD/QAR', 'USD/AED', 'USD/SAR'].includes(p.pair));
const gcc = forexPairs.filter(p => ['USD/QAR', 'USD/AED', 'USD/SAR'].includes(p.pair));

// Currency strength (simplified: sum of changes where currency appears)
function calcStrength(pairs) {
  const str = {};
  pairs.forEach(p => {
    const [base, quote] = p.pair.split('/');
    str[base] = (str[base] || 0) + p.changePct;
    str[quote] = (str[quote] || 0) - p.changePct;
  });
  return Object.entries(str).map(([cur, val]) => ({ currency: cur, strength: round(val, 3) })).sort((a, b) => b.strength - a.strength);
}

export default function FXMonitor() {
  const [selectedPair, setSelectedPair] = useState(forexPairs[0]);
  const [convFrom, setConvFrom] = useState('USD');
  const [convTo, setConvTo] = useState('QAR');
  const [convAmount, setConvAmount] = useState(1000);

  const history = useMemo(() => genFXHistory(selectedPair.bid, 60), [selectedPair.pair]);
  const strength = useMemo(() => calcStrength(forexPairs), []);
  const converted = useMemo(() => convertCurrency(convAmount, convFrom, convTo), [convAmount, convFrom, convTo]);
  const currencies = Object.keys(currencyRates);

  // Cross-rate matrix currencies
  const crossCurs = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'AUD'];
  const crossRates = useMemo(() => {
    return crossCurs.map(base => {
      const row = { base };
      crossCurs.forEach(quote => {
        if (base === quote) { row[quote] = 1; return; }
        row[quote] = round(convertCurrency(1, base, quote), 4);
      });
      return row;
    });
  }, []);

  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      {/* Major Pairs */}
      <Panel title="FX Monitor — Major Pairs" className="col-span-5 row-span-3">
        <table className="bb-table">
          <thead><tr><th>Pair</th><th className="text-right">Bid</th><th className="text-right">Ask</th><th className="text-right">Chg</th><th className="text-right">Chg%</th><th className="text-right">High</th><th className="text-right">Low</th></tr></thead>
          <tbody>
            {majors.map(p => (
              <tr key={p.pair} onClick={() => setSelectedPair(p)} className={`cursor-pointer ${selectedPair.pair === p.pair ? 'bg-bb-amber/10' : ''}`}>
                <td className="text-bb-amber font-bold">{p.pair}</td>
                <td className="text-right">{formatNumber(p.bid, 4)}</td>
                <td className="text-right">{formatNumber(p.ask, 4)}</td>
                <td className={`text-right ${colorClass(p.change)}`}>{formatChange(p.change, 4)}</td>
                <td className={`text-right ${colorClass(p.changePct)}`}>{formatPercent(p.changePct)}</td>
                <td className="text-right text-bb-muted">{formatNumber(p.high, 4)}</td>
                <td className="text-right text-bb-muted">{formatNumber(p.low, 4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      {/* Chart */}
      <Panel title={`${selectedPair.pair} — 60D`} className="col-span-4 row-span-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history}>
            <defs><linearGradient id="fxG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4a9eff" stopOpacity={0.3} /><stop offset="95%" stopColor="#4a9eff" stopOpacity={0} /></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis dataKey="date" tick={{ fill: '#6a6a6a', fontSize: 8 }} tickFormatter={v => v.slice(5)} interval={12} />
            <YAxis domain={['dataMin', 'dataMax']} tick={{ fill: '#6a6a6a', fontSize: 8 }} width={55} />
            <Tooltip {...tt} formatter={v => round(v, 4)} />
            <Area type="monotone" dataKey="rate" stroke="#4a9eff" fill="url(#fxG)" strokeWidth={1.5} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </Panel>

      {/* Currency Strength */}
      <Panel title="Currency Strength" className="col-span-3 row-span-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={strength} layout="vertical" margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <XAxis type="number" tick={{ fill: '#6a6a6a', fontSize: 8 }} />
            <YAxis type="category" dataKey="currency" tick={{ fill: '#6a6a6a', fontSize: 9 }} width={35} />
            <Tooltip {...tt} formatter={v => round(v, 3)} />
            <Bar dataKey="strength" radius={[0, 2, 2, 0]}>
              {strength.map(s => <Cell key={s.currency} fill={s.strength >= 0 ? '#00d26a' : '#ff3b3b'} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Panel>

      {/* GCC Pegged Currencies */}
      <Panel title="GCC Pegged Currencies" className="col-span-3 row-span-2">
        <table className="bb-table">
          <thead><tr><th>Pair</th><th className="text-right">Bid</th><th className="text-right">Ask</th><th>Status</th></tr></thead>
          <tbody>
            {gcc.map(p => (
              <tr key={p.pair}>
                <td className="text-bb-amber">{p.pair}</td>
                <td className="text-right font-bold">{formatNumber(p.bid, 4)}</td>
                <td className="text-right">{formatNumber(p.ask, 4)}</td>
                <td><span className="text-bb-green text-[9px]">PEGGED</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      {/* Currency Converter */}
      <Panel title="Converter" className="col-span-3 row-span-2">
        <div className="space-y-1.5 text-[10px] p-0.5">
          <div className="flex gap-1">
            <input type="number" value={convAmount} onChange={e => setConvAmount(parseFloat(e.target.value) || 0)}
              className="flex-1 bg-bb-dark border border-bb-border text-bb-white text-[10px] px-1.5 py-0.5 font-mono focus:border-bb-amber focus:outline-none" />
            <select value={convFrom} onChange={e => setConvFrom(e.target.value)}
              className="bg-bb-dark border border-bb-border text-bb-white text-[10px] px-1 font-mono focus:border-bb-amber focus:outline-none">
              {currencies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="text-center text-bb-muted">↓</div>
          <div className="flex gap-1">
            <div className="flex-1 bg-bb-dark border border-bb-amber/30 text-bb-amber text-[10px] px-1.5 py-0.5 font-mono font-bold">{formatNumber(converted, 2)}</div>
            <select value={convTo} onChange={e => setConvTo(e.target.value)}
              className="bg-bb-dark border border-bb-border text-bb-white text-[10px] px-1 font-mono focus:border-bb-amber focus:outline-none">
              {currencies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="text-[9px] text-bb-muted text-center">Rate: {formatNumber(convertCurrency(1, convFrom, convTo), 4)}</div>
        </div>
      </Panel>

      {/* Cross Rate Matrix */}
      <Panel title="Cross-Rate Matrix" className="col-span-6 row-span-2">
        <table className="bb-table">
          <thead>
            <tr><th></th>{crossCurs.map(c => <th key={c} className="text-right text-[9px]">{c}</th>)}</tr>
          </thead>
          <tbody>
            {crossRates.map(row => (
              <tr key={row.base}>
                <td className="text-bb-amber font-bold">{row.base}</td>
                {crossCurs.map(c => (
                  <td key={c} className={`text-right ${row.base === c ? 'text-bb-muted' : ''}`}>
                    {row.base === c ? '—' : round(row[c], 4)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      {/* Pair Details */}
      <Panel title={`${selectedPair.pair} Details`} className="col-span-2 row-span-2">
        <div className="space-y-1 text-[10px] p-0.5">
          <div className="text-center py-1.5 border border-bb-border bg-bb-dark">
            <div className="text-bb-muted text-[9px]">{selectedPair.pair}</div>
            <div className="text-lg font-bold text-bb-white">{formatNumber(selectedPair.bid, 4)}</div>
            <div className={`text-[10px] font-bold ${colorClass(selectedPair.changePct)}`}>{formatPercent(selectedPair.changePct)}</div>
          </div>
          <table className="bb-table"><tbody>
            {[['Spread', round((selectedPair.ask - selectedPair.bid) * 10000, 1) + ' pips'], ['High', formatNumber(selectedPair.high, 4)], ['Low', formatNumber(selectedPair.low, 4)]].map(([l, v]) => (
              <tr key={l}><td className="text-bb-muted">{l}</td><td className="text-right font-bold">{v}</td></tr>
            ))}
          </tbody></table>
        </div>
      </Panel>
    </div>
  );
}
