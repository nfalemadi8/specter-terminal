import { useState, useMemo , memo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, BarChart, Bar, Cell } from 'recharts';
import Panel from '../layout/Panel';
import { treasuries, generateYieldCurve } from '../../data/bonds';
import { formatNumber, formatChange, colorClass, round } from '../../utils/format';

const tt = { contentStyle: { background: '#1a1a1a', border: '1px solid #2a2a2a', fontSize: '10px', fontFamily: 'monospace' }, labelStyle: { color: '#ffbf00', fontSize: '10px' } };

// Simulated historical curves
function genHistCurve(label, shift, flatten) {
  const base = generateYieldCurve();
  return base.map(p => ({
    ...p,
    yield: round(p.yield + shift + (flatten ? -p.maturity * 0.02 : 0) + (Math.random() - 0.5) * 0.1, 2),
  }));
}

const CURVES = [
  { id: 'current', label: 'Current', color: '#ffd700', data: generateYieldCurve() },
  { id: '3m', label: '3M Ago', color: '#4a9eff', data: genHistCurve('3m', 0.15, false) },
  { id: '6m', label: '6M Ago', color: '#00d26a', data: genHistCurve('6m', 0.3, true) },
  { id: '1y', label: '1Y Ago', color: '#ff8c00', data: genHistCurve('1y', -0.2, true) },
];

// Forward rates calculation
function forwardRate(y1, t1, y2, t2) {
  if (t2 <= t1) return 0;
  return ((y2 * t2 - y1 * t1) / (t2 - t1));
}

function YieldCurve() {
  const [selectedCurves, setSelectedCurves] = useState(['current', '3m']);

  const currentCurve = CURVES[0].data;

  // Merge curves for the chart
  const mergedData = useMemo(() => {
    return currentCurve.map((p, i) => {
      const point = { label: p.label, maturity: p.maturity };
      CURVES.forEach(c => {
        if (selectedCurves.includes(c.id)) {
          point[c.id] = c.data[i]?.yield;
        }
      });
      return point;
    });
  }, [selectedCurves]);

  // Key spreads time series (simulated)
  const spreadHistory = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (59 - i));
      const base2s10s = -59;
      const trend = i * 0.8;
      const noise = (Math.random() - 0.5) * 15;
      return {
        date: d.toISOString().split('T')[0],
        spread: round(base2s10s + trend + noise, 1),
      };
    });
  }, []);

  // Forward rates
  const forwards = useMemo(() => {
    const curve = currentCurve;
    const result = [];
    for (let i = 1; i < curve.length; i++) {
      const fwd = forwardRate(curve[i - 1].yield, curve[i - 1].maturity, curve[i].yield, curve[i].maturity);
      result.push({ label: `${curve[i - 1].label}→${curve[i].label}`, rate: round(fwd, 2) });
    }
    return result;
  }, []);

  // Curve change from previous close
  const curveChanges = useMemo(() =>
    treasuries.map(t => ({
      maturity: t.maturity,
      change: t.change * 100,
      yield: t.yield,
    })), []);

  // Key spreads
  const t1m = treasuries.find(t => t.maturity === '1M');
  const t3m = treasuries.find(t => t.maturity === '3M');
  const t2y = treasuries.find(t => t.maturity === '2Y');
  const t5y = treasuries.find(t => t.maturity === '5Y');
  const t10y = treasuries.find(t => t.maturity === '10Y');
  const t30y = treasuries.find(t => t.maturity === '30Y');

  const spreads = [
    { label: '2s10s', value: t10y && t2y ? ((t10y.yield - t2y.yield) * 100) : 0 },
    { label: '3m10Y', value: t10y && t3m ? ((t10y.yield - t3m.yield) * 100) : 0 },
    { label: '5s30s', value: t30y && t5y ? ((t30y.yield - t5y.yield) * 100) : 0 },
    { label: '2s5s', value: t5y && t2y ? ((t5y.yield - t2y.yield) * 100) : 0 },
  ];

  const toggleCurve = (id) => {
    setSelectedCurves(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      {/* Multi-Curve Overlay */}
      <Panel title="Yield Curve — Historical Overlay" className="col-span-8 row-span-3">
        <div className="flex gap-1 mb-1">
          {CURVES.map(c => (
            <button key={c.id} onClick={() => toggleCurve(c.id)}
              className={`px-2 py-[1px] text-[9px] border ${selectedCurves.includes(c.id) ? 'bg-opacity-10' : 'border-bb-border text-bb-muted'}`}
              style={selectedCurves.includes(c.id) ? { borderColor: c.color, color: c.color, backgroundColor: c.color + '15' } : undefined}>
              {c.label}
            </button>
          ))}
        </div>
        <ResponsiveContainer width="100%" height="88%">
          <LineChart data={mergedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis dataKey="label" tick={{ fill: '#6a6a6a', fontSize: 9 }} />
            <YAxis domain={[3, 6.5]} tick={{ fill: '#6a6a6a', fontSize: 9 }} tickFormatter={v => round(v, 1) + '%'} width={40} />
            <Tooltip {...tt} formatter={v => round(v, 2) + '%'} />
            {CURVES.filter(c => selectedCurves.includes(c.id)).map(c => (
              <Line key={c.id} type="monotone" dataKey={c.id} stroke={c.color} strokeWidth={c.id === 'current' ? 2.5 : 1.5} dot={{ r: c.id === 'current' ? 3 : 2 }} name={c.label} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Panel>

      {/* Key Spreads */}
      <Panel title="Key Spreads" className="col-span-4 row-span-3">
        <div className="space-y-2 p-0.5">
          {spreads.map(s => (
            <div key={s.label} className={`border p-1.5 text-center ${s.value < 0 ? 'border-bb-red bg-bb-red/5' : 'border-bb-green bg-bb-green/5'}`}>
              <div className="text-bb-muted text-[9px]">{s.label}</div>
              <div className={`text-xl font-bold ${colorClass(s.value)}`}>{round(s.value, 0)} bp</div>
              {s.value < 0 && <div className="text-bb-red text-[8px] font-bold">INVERTED</div>}
            </div>
          ))}
        </div>
      </Panel>

      {/* 2s10s Spread History */}
      <Panel title="2s10s Spread — 60D" className="col-span-4 row-span-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={spreadHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis dataKey="date" tick={{ fill: '#6a6a6a', fontSize: 8 }} tickFormatter={v => v.slice(5)} interval={12} />
            <YAxis tick={{ fill: '#6a6a6a', fontSize: 8 }} tickFormatter={v => v + 'bp'} />
            <Tooltip {...tt} formatter={v => v + ' bp'} />
            <Line type="monotone" dataKey="spread" stroke="#ff3b3b" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Panel>

      {/* Forward Rates */}
      <Panel title="Implied Forward Rates" className="col-span-4 row-span-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={forwards} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <XAxis dataKey="label" tick={{ fill: '#6a6a6a', fontSize: 7 }} angle={-30} />
            <YAxis tick={{ fill: '#6a6a6a', fontSize: 8 }} tickFormatter={v => v + '%'} />
            <Tooltip {...tt} formatter={v => v + '%'} />
            <Bar dataKey="rate" fill="#4a9eff" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Panel>

      {/* Daily Change */}
      <Panel title="Daily Yield Change (bp)" className="col-span-4 row-span-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={curveChanges} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <XAxis dataKey="maturity" tick={{ fill: '#6a6a6a', fontSize: 8 }} />
            <YAxis tick={{ fill: '#6a6a6a', fontSize: 8 }} />
            <Tooltip {...tt} formatter={v => round(v, 1) + ' bp'} />
            <Bar dataKey="change" radius={[2, 2, 0, 0]}>
              {curveChanges.map(c => <Cell key={c.maturity} fill={c.change >= 0 ? '#00d26a' : '#ff3b3b'} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Panel>
    </div>
  );
}

export default memo(YieldCurve);
