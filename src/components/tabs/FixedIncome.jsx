import { useState, useEffect, useMemo, memo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Panel from '../layout/Panel';
import { getBonds, getYieldCurve } from '../../services/dataProvider';
import { formatNumber, formatChange, colorClass, round } from '../../utils/format';

const tt = { contentStyle: { background: '#1a1a1a', border: '1px solid #2a2a2a', fontSize: '10px', fontFamily: 'monospace' }, labelStyle: { color: '#ffbf00', fontSize: '10px' } };

function bondPrice(face, coupon, ytm, years) {
  const c = face * coupon / 2, n = years * 2, r = ytm / 2;
  let pv = 0;
  for (let i = 1; i <= n; i++) pv += c / Math.pow(1 + r, i);
  return pv + face / Math.pow(1 + r, n);
}
function modDuration(face, coupon, ytm, years) {
  const r = ytm / 2, n = years * 2, c = face * coupon / 2;
  let macD = 0, price = 0;
  for (let i = 1; i <= n; i++) { const pv = c / Math.pow(1 + r, i); macD += (i / 2) * pv; price += pv; }
  const pvF = face / Math.pow(1 + r, n); macD += (n / 2) * pvF; price += pvF;
  return (macD / price) / (1 + r);
}
function calcDv01(face, coupon, ytm, years) {
  return Math.abs(bondPrice(face, coupon, ytm + 0.0001, years) - bondPrice(face, coupon, ytm - 0.0001, years)) / 2;
}

const YIELD_COUNTRIES = ['US', 'GB', 'DE', 'JP'];

function FixedIncome() {
  const [allBonds, setAllBonds] = useState(null);
  const [yieldCurve, setYieldCurve] = useState(null);
  const [yieldCountry, setYieldCountry] = useState('US');
  const [bondFilter, setBondFilter] = useState('All');
  const [calcFace, setCalcFace] = useState(1000);
  const [calcCoupon, setCalcCoupon] = useState(4.5);
  const [calcYtm, setCalcYtm] = useState(5.0);
  const [calcYears, setCalcYears] = useState(5);

  useEffect(() => {
    getBonds().then(setAllBonds);
    getYieldCurve('US').then(setYieldCurve);
  }, []);

  useEffect(() => {
    getYieldCurve(yieldCountry).then(setYieldCurve);
  }, [yieldCountry]);

  const sovereigns = useMemo(() => allBonds ? allBonds.filter(b => b.type !== 'corporate' && b.type !== 'sukuk') : [], [allBonds]);
  const usTreasuries = useMemo(() => sovereigns.filter(b => b.country === 'US'), [sovereigns]);
  const corporates = useMemo(() => {
    if (!allBonds) return [];
    if (bondFilter === 'All') return allBonds.filter(b => b.type === 'corporate' || b.type === 'sukuk');
    if (bondFilter === 'Corporate') return allBonds.filter(b => b.type === 'corporate');
    if (bondFilter === 'Sukuk') return allBonds.filter(b => b.type === 'sukuk');
    return [];
  }, [allBonds, bondFilter]);

  const cp = useMemo(() => bondPrice(calcFace, calcCoupon / 100, calcYtm / 100, calcYears), [calcFace, calcCoupon, calcYtm, calcYears]);
  const cd = useMemo(() => modDuration(calcFace, calcCoupon / 100, calcYtm / 100, calcYears), [calcFace, calcCoupon, calcYtm, calcYears]);
  const cdv = useMemo(() => calcDv01(calcFace, calcCoupon / 100, calcYtm / 100, calcYears), [calcFace, calcCoupon, calcYtm, calcYears]);

  const sensitivity = useMemo(() =>
    [-100, -50, -25, 0, 25, 50, 100].map(bp => {
      const p = bondPrice(calcFace, calcCoupon / 100, calcYtm / 100 + bp / 10000, calcYears);
      return { shift: bp, price: p, change: (p / cp - 1) * 100 };
    }), [calcFace, calcCoupon, calcYtm, calcYears, cp]);

  const t2 = usTreasuries.find(t => t.maturity === '2Y');
  const t10 = usTreasuries.find(t => t.maturity === '10Y');
  const t3m = usTreasuries.find(t => t.maturity === '3M');
  const s2s10 = t10 && t2 ? (t10.yield - t2.yield) * 100 : 0;
  const s3m10 = t10 && t3m ? (t10.yield - t3m.yield) * 100 : 0;

  if (!allBonds) return <div className="p-4 text-bb-muted text-center text-[11px]">Loading bond data…</div>;

  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      <Panel title="Sovereign Yield Curve" className="col-span-5 row-span-3">
        <div className="flex gap-1 mb-1">
          {YIELD_COUNTRIES.map(c => (
            <button key={c} onClick={() => setYieldCountry(c)}
              className={`px-1.5 py-[1px] text-[9px] border ${yieldCountry === c ? 'border-bb-amber text-bb-amber bg-bb-amber/10' : 'border-bb-border text-bb-muted'}`}>{c}</button>
          ))}
        </div>
        {yieldCurve && (
          <ResponsiveContainer width="100%" height="90%">
            <AreaChart data={yieldCurve}>
              <defs><linearGradient id="ycG2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ffd700" stopOpacity={0.3} /><stop offset="95%" stopColor="#ffd700" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="label" tick={{ fill: '#6a6a6a', fontSize: 9 }} />
              <YAxis domain={['auto', 'auto']} tick={{ fill: '#6a6a6a', fontSize: 9 }} tickFormatter={v => round(v, 1) + '%'} width={40} />
              <Tooltip {...tt} formatter={v => round(v, 2) + '%'} />
              <Area type="monotone" dataKey="yield" stroke="#ffd700" fill="url(#ycG2)" strokeWidth={2} dot={{ fill: '#ffd700', r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </Panel>

      <Panel title="US Treasury Rates" className="col-span-4 row-span-3">
        <table className="bb-table">
          <thead><tr><th>Tenor</th><th className="text-right">Yield</th><th className="text-right">Coupon</th><th className="text-right">Duration</th><th>Rating</th></tr></thead>
          <tbody>
            {usTreasuries.map(t => (
              <tr key={t.id}>
                <td className="text-bb-amber">{t.maturity}</td>
                <td className="text-right font-bold">{round(t.yield, 2)}%</td>
                <td className="text-right text-bb-muted">{round(t.coupon, 2)}%</td>
                <td className="text-right text-bb-muted">{round(t.duration, 2)}</td>
                <td className="text-bb-green">{t.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel title="Key Spreads" className="col-span-3 row-span-3">
        <div className="space-y-2 p-1 text-[10px]">
          {[{ label: '2s10s Spread', value: s2s10, desc: '10Y − 2Y' }, { label: '3m10Y Spread', value: s3m10, desc: '10Y − 3M' }].map(s => (
            <div key={s.label} className={`text-center py-2 border ${s.value < 0 ? 'border-bb-red bg-bb-red/5' : 'border-bb-green bg-bb-green/5'}`}>
              <div className="text-bb-muted text-[9px]">{s.label}</div>
              <div className={`text-xl font-bold ${colorClass(s.value)}`}>{round(s.value, 0)} bp</div>
              <div className="text-bb-muted text-[8px]">{s.desc}</div>
              {s.value < 0 && <div className="text-bb-red text-[8px] font-bold">INVERTED</div>}
            </div>
          ))}
          <div className="border border-bb-border p-1.5 text-center">
            <div className="text-bb-muted text-[9px]">SIGNAL</div>
            <div className={`font-bold ${s2s10 < 0 ? 'text-bb-red' : 'text-bb-green'}`}>
              {s2s10 < 0 ? 'RECESSION RISK' : s2s10 < 50 ? 'CAUTIOUS' : 'NORMAL'}
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="GC — Bond Calculator" className="col-span-3 row-span-3">
        <div className="space-y-1.5 text-[10px] p-0.5">
          <CInput label="Face ($)" value={calcFace} set={setCalcFace} step={100} />
          <CInput label="Coupon (%)" value={calcCoupon} set={setCalcCoupon} step={0.25} />
          <CInput label="YTM (%)" value={calcYtm} set={setCalcYtm} step={0.25} />
          <CInput label="Years" value={calcYears} set={setCalcYears} step={1} />
          <div className="border-t border-bb-border pt-1.5">
            <table className="bb-table"><tbody>
              {[['Price', '$' + formatNumber(cp)], ['Price %', round(cp / calcFace * 100, 2) + '%'], ['Mod Duration', round(cd, 3)], ['DV01', '$' + formatNumber(cdv, 4)], ['Curr Yield', round(calcFace * calcCoupon / 100 / cp * 100, 2) + '%']].map(([l, v]) => (
                <tr key={l}><td className="text-bb-muted">{l}</td><td className="text-right font-bold">{v}</td></tr>
              ))}
            </tbody></table>
          </div>
        </div>
      </Panel>

      <Panel title="Price Sensitivity" className="col-span-3 row-span-3">
        <table className="bb-table">
          <thead><tr><th className="text-right">bp</th><th className="text-right">Price</th><th className="text-right">Chg%</th></tr></thead>
          <tbody>
            {sensitivity.map(s => (
              <tr key={s.shift} className={s.shift === 0 ? 'bg-bb-amber/10' : ''}>
                <td className={`text-right ${s.shift === 0 ? 'text-bb-amber font-bold' : 'text-bb-muted'}`}>{s.shift > 0 ? '+' : ''}{s.shift}</td>
                <td className="text-right font-bold">${formatNumber(s.price)}</td>
                <td className={`text-right ${colorClass(s.change)}`}>{s.change > 0 ? '+' : ''}{round(s.change, 2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel title="Corporate Bonds & Sukuk" className="col-span-6 row-span-3">
        <div className="flex gap-1 mb-1">
          {['All', 'Corporate', 'Sukuk'].map(t => (
            <button key={t} onClick={() => setBondFilter(t)} className={`px-2 py-[2px] text-[9px] border ${bondFilter === t ? 'border-bb-amber text-bb-amber bg-bb-amber/10' : 'border-bb-border text-bb-muted'}`}>{t}</button>
          ))}
        </div>
        <table className="bb-table">
          <thead><tr><th>Issuer</th><th className="text-right">Cpn</th><th>Mat</th><th>Rating</th><th className="text-right">Yield</th><th className="text-right">Sprd</th><th className="text-right">Price</th><th className="text-right">Dur</th><th>Type</th></tr></thead>
          <tbody>
            {corporates.map(b => (
              <tr key={b.id}>
                <td className="text-bb-amber">{b.issuer || b.name}</td>
                <td className="text-right">{round(b.coupon, 2)}%</td>
                <td>{b.maturity}</td>
                <td><span className={b.rating.startsWith('AA') ? 'text-bb-green' : b.rating.startsWith('A') ? 'text-bb-blue' : b.rating.startsWith('BBB') ? 'text-bb-yellow' : 'text-bb-orange'}>{b.rating}</span></td>
                <td className="text-right font-bold">{round(b.yield, 2)}%</td>
                <td className="text-right">{b.spread}</td>
                <td className="text-right">{formatNumber(b.price)}</td>
                <td className="text-right text-bb-muted">{round(b.duration, 1)}</td>
                <td className={b.type === 'sukuk' ? 'text-bb-green font-bold' : 'text-bb-muted'}>{b.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

function CInput({ label, value, set, step }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-bb-muted">{label}</span>
      <input type="number" value={value} onChange={e => set(parseFloat(e.target.value) || 0)} step={step}
        className="w-20 bg-bb-dark border border-bb-border text-bb-white text-[10px] px-1.5 py-0.5 font-mono text-right focus:border-bb-amber focus:outline-none" />
    </div>
  );
}

export default memo(FixedIncome);
