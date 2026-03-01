import { useState, useEffect, useMemo, memo } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import Panel from '../layout/Panel';
import { getCurrencyRates, doConvertCurrency, getCrossRateMatrix, getCurrencyStrength } from '../../services/dataProvider';
import { formatNumber, formatPercent, colorClass, round } from '../../utils/format';

const tt = { contentStyle: { background: '#1a1a1a', border: '1px solid #2a2a2a', fontSize: '10px', fontFamily: 'monospace' }, labelStyle: { color: '#ffbf00', fontSize: '10px' } };

const MAJOR_PAIRS = [
  { base: 'EUR', quote: 'USD' }, { base: 'GBP', quote: 'USD' }, { base: 'USD', quote: 'JPY' },
  { base: 'USD', quote: 'CHF' }, { base: 'AUD', quote: 'USD' }, { base: 'USD', quote: 'CAD' },
  { base: 'NZD', quote: 'USD' }, { base: 'EUR', quote: 'GBP' }, { base: 'EUR', quote: 'JPY' },
];

const GCC_CURS = ['QAR', 'AED', 'SAR', 'KWD', 'BHD', 'OMR'];
const CROSS_CURS = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'AUD', 'CAD', 'QAR', 'SAR', 'AED'];

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

function FXMonitor() {
  const [currencies, setCurrencies] = useState(null);
  const [crossMatrix, setCrossMatrix] = useState(null);
  const [strength, setStrength] = useState(null);
  const [selectedPair, setSelectedPair] = useState(null);
  const [convFrom, setConvFrom] = useState('USD');
  const [convTo, setConvTo] = useState('QAR');
  const [convAmount, setConvAmount] = useState(1000);
  const [converted, setConverted] = useState(null);

  useEffect(() => {
    Promise.all([
      getCurrencyRates(),
      getCrossRateMatrix(CROSS_CURS),
      getCurrencyStrength(),
    ]).then(([curs, matrix, str]) => {
      setCurrencies(curs);
      setCrossMatrix(matrix);
      setStrength(str);
      setSelectedPair(MAJOR_PAIRS[0]);
    });
  }, []);

  useEffect(() => {
    doConvertCurrency(convAmount, convFrom, convTo).then(setConverted);
  }, [convAmount, convFrom, convTo]);

  const pairs = useMemo(() => {
    if (!currencies) return [];
    return MAJOR_PAIRS.map(p => {
      const baseRate = currencies[p.base]?.rate || 1;
      const quoteRate = currencies[p.quote]?.rate || 1;
      const rate = quoteRate / baseRate;
      const spread = rate * 0.0002;
      return {
        ...p,
        pair: `${p.base}/${p.quote}`,
        bid: round(rate, 4),
        ask: round(rate + spread, 4),
        spread: round(spread * 10000, 1),
      };
    });
  }, [currencies]);

  const gccPairs = useMemo(() => {
    if (!currencies) return [];
    return GCC_CURS.map(c => ({
      pair: `USD/${c}`,
      bid: round(currencies[c]?.rate || 0, 4),
      ask: round((currencies[c]?.rate || 0) * 1.0001, 4),
      name: currencies[c]?.name || c,
    }));
  }, [currencies]);

  const selectedHistory = useMemo(() => {
    if (!selectedPair || !currencies) return [];
    const baseRate = currencies[selectedPair.base]?.rate || 1;
    const quoteRate = currencies[selectedPair.quote]?.rate || 1;
    return genFXHistory(quoteRate / baseRate, 60);
  }, [selectedPair, currencies]);

  const currencyList = useMemo(() => currencies ? Object.keys(currencies) : [], [currencies]);

  if (!currencies) return <div className="p-4 text-bb-muted text-center text-[11px]">Loading FX data…</div>;

  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      <Panel title="FX Monitor — Major Pairs" className="col-span-5 row-span-3">
        <table className="bb-table">
          <thead><tr><th>Pair</th><th className="text-right">Bid</th><th className="text-right">Ask</th><th className="text-right">Spread</th></tr></thead>
          <tbody>
            {pairs.map(p => (
              <tr key={p.pair} onClick={() => setSelectedPair(p)} className={`cursor-pointer ${selectedPair?.pair === p.pair ? 'bg-bb-amber/10' : ''}`}>
                <td className="text-bb-amber font-bold">{p.pair}</td>
                <td className="text-right">{formatNumber(p.bid, 4)}</td>
                <td className="text-right">{formatNumber(p.ask, 4)}</td>
                <td className="text-right text-bb-muted">{p.spread} pips</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      {selectedPair && (
        <Panel title={`${selectedPair.pair} — 60D`} className="col-span-4 row-span-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={selectedHistory}>
              <defs><linearGradient id="fxG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4a9eff" stopOpacity={0.3} /><stop offset="95%" stopColor="#4a9eff" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="date" tick={{ fill: '#6a6a6a', fontSize: 8 }} tickFormatter={v => v.slice(5)} interval={12} />
              <YAxis domain={['dataMin', 'dataMax']} tick={{ fill: '#6a6a6a', fontSize: 8 }} width={55} />
              <Tooltip {...tt} formatter={v => round(v, 4)} />
              <Area type="monotone" dataKey="rate" stroke="#4a9eff" fill="url(#fxG)" strokeWidth={1.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>
      )}

      {strength && (
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
      )}

      <Panel title="GCC Currencies" className="col-span-3 row-span-2">
        <table className="bb-table">
          <thead><tr><th>Pair</th><th className="text-right">Bid</th><th className="text-right">Ask</th><th>Status</th></tr></thead>
          <tbody>
            {gccPairs.map(p => (
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

      <Panel title="Converter" className="col-span-3 row-span-2">
        <div className="space-y-1.5 text-[10px] p-0.5">
          <div className="flex gap-1">
            <input type="number" value={convAmount} onChange={e => setConvAmount(parseFloat(e.target.value) || 0)}
              className="flex-1 bg-bb-dark border border-bb-border text-bb-white text-[10px] px-1.5 py-0.5 font-mono focus:border-bb-amber focus:outline-none" />
            <select value={convFrom} onChange={e => setConvFrom(e.target.value)}
              className="bg-bb-dark border border-bb-border text-bb-white text-[10px] px-1 font-mono focus:border-bb-amber focus:outline-none">
              {currencyList.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="text-center text-bb-muted">↓</div>
          <div className="flex gap-1">
            <div className="flex-1 bg-bb-dark border border-bb-amber/30 text-bb-amber text-[10px] px-1.5 py-0.5 font-mono font-bold">
              {converted !== null ? formatNumber(converted, 2) : '…'}
            </div>
            <select value={convTo} onChange={e => setConvTo(e.target.value)}
              className="bg-bb-dark border border-bb-border text-bb-white text-[10px] px-1 font-mono focus:border-bb-amber focus:outline-none">
              {currencyList.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </Panel>

      {crossMatrix && (
        <Panel title="Cross-Rate Matrix" className="col-span-6 row-span-2">
          <div className="overflow-auto">
            <table className="bb-table">
              <thead>
                <tr><th></th>{CROSS_CURS.map(c => <th key={c} className="text-right text-[8px]">{c}</th>)}</tr>
              </thead>
              <tbody>
                {CROSS_CURS.map(base => (
                  <tr key={base}>
                    <td className="text-bb-amber font-bold text-[9px]">{base}</td>
                    {CROSS_CURS.map(quote => (
                      <td key={quote} className={`text-right text-[9px] ${base === quote ? 'text-bb-muted' : ''}`}>
                        {base === quote ? '—' : round(crossMatrix[base]?.[quote] || 0, 4)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {selectedPair && (
        <Panel title={`${selectedPair.pair} Details`} className="col-span-2 row-span-2">
          <div className="space-y-1 text-[10px] p-0.5">
            <div className="text-center py-1.5 border border-bb-border bg-bb-dark">
              <div className="text-bb-muted text-[9px]">{selectedPair.pair}</div>
              <div className="text-lg font-bold text-bb-white">{formatNumber(selectedPair.bid, 4)}</div>
            </div>
            <table className="bb-table"><tbody>
              {[
                ['Spread', selectedPair.spread + ' pips'],
                ['Bid', formatNumber(selectedPair.bid, 4)],
                ['Ask', formatNumber(selectedPair.ask, 4)],
              ].map(([l, v]) => (
                <tr key={l}><td className="text-bb-muted">{l}</td><td className="text-right font-bold">{v}</td></tr>
              ))}
            </tbody></table>
          </div>
        </Panel>
      )}
    </div>
  );
}

export default memo(FXMonitor);
