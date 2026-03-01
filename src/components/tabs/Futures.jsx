import { useState, memo, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Panel from '../layout/Panel';
import { formatNumber, formatPercent, formatChange, colorClass, round } from '../../utils/format';

const futuresData = [
  { symbol: 'ES', name: 'E-mini S&P 500', month: 'Mar 24', last: 4572.25, change: 28.50, changePct: 0.63, volume: '1.2M', oi: '2.8M' },
  { symbol: 'NQ', name: 'E-mini Nasdaq', month: 'Mar 24', last: 16125.50, change: 142.75, changePct: 0.89, volume: '842K', oi: '1.4M' },
  { symbol: 'YM', name: 'E-mini Dow', month: 'Mar 24', last: 35482.00, change: 138.00, changePct: 0.39, volume: '425K', oi: '680K' },
  { symbol: 'RTY', name: 'E-mini Russell', month: 'Mar 24', last: 1865.20, change: -7.80, changePct: -0.42, volume: '312K', oi: '520K' },
  { symbol: 'CL', name: 'Crude Oil', month: 'Feb 24', last: 78.42, change: -1.28, changePct: -1.61, volume: '845K', oi: '1.6M' },
  { symbol: 'GC', name: 'Gold', month: 'Feb 24', last: 2024.50, change: 12.30, changePct: 0.61, volume: '425K', oi: '890K' },
  { symbol: 'SI', name: 'Silver', month: 'Mar 24', last: 24.18, change: 0.42, changePct: 1.77, volume: '128K', oi: '245K' },
  { symbol: 'ZB', name: '30Y T-Bond', month: 'Mar 24', last: 122.28, change: 0.84, changePct: 0.69, volume: '520K', oi: '1.1M' },
  { symbol: 'ZN', name: '10Y T-Note', month: 'Mar 24', last: 112.16, change: 0.42, changePct: 0.38, volume: '1.4M', oi: '3.2M' },
  { symbol: 'ZC', name: 'Corn', month: 'Mar 24', last: 487.25, change: 3.50, changePct: 0.72, volume: '245K', oi: '680K' },
  { symbol: 'ZW', name: 'Wheat', month: 'Mar 24', last: 612.50, change: -8.75, changePct: -1.41, volume: '128K', oi: '345K' },
  { symbol: 'ZS', name: 'Soybeans', month: 'Mar 24', last: 1342.75, change: 11.25, changePct: 0.85, volume: '185K', oi: '425K' },
  { symbol: '6E', name: 'Euro FX', month: 'Mar 24', last: 1.0894, change: -0.0018, changePct: -0.17, volume: '312K', oi: '580K' },
  { symbol: '6J', name: 'Japanese Yen', month: 'Mar 24', last: 0.006694, change: -0.000016, changePct: -0.24, volume: '185K', oi: '320K' },
  { symbol: '6B', name: 'British Pound', month: 'Mar 24', last: 1.2718, change: 0.0024, changePct: 0.19, volume: '98K', oi: '210K' },
];

const categories = { ES: 'Equity', NQ: 'Equity', YM: 'Equity', RTY: 'Equity', CL: 'Commodity', GC: 'Commodity', SI: 'Commodity', ZC: 'Agri', ZW: 'Agri', ZS: 'Agri', ZB: 'Treasury', ZN: 'Treasury', '6E': 'Currency', '6J': 'Currency', '6B': 'Currency' };
const cats = ['All', 'Equity', 'Commodity', 'Treasury', 'Currency', 'Agri'];

function Futures() {
  const [filter, setFilter] = useState('All');
  const filtered = useMemo(() => filter === 'All' ? futuresData : futuresData.filter(f => categories[f.symbol] === filter), [filter]);
  const chartData = useMemo(() => filtered.map(f => ({ name: f.symbol, changePct: f.changePct })), [filtered]);
  const gainers = filtered.filter(f => f.changePct > 0).length;

  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      <Panel title="Performance" className="col-span-4 row-span-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 5 }}>
            <XAxis type="number" tick={{ fill: '#6a6a6a', fontSize: 8 }} tickFormatter={v => v + '%'} />
            <YAxis type="category" dataKey="name" tick={{ fill: '#e0e0e0', fontSize: 9 }} width={30} />
            <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', fontSize: '10px' }} formatter={v => round(v, 2) + '%'} />
            <Bar dataKey="changePct" radius={[0, 2, 2, 0]}>
              {chartData.map(d => <Cell key={d.name} fill={d.changePct >= 0 ? '#00d26a' : '#ff3b3b'} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Panel>

      <Panel title="Summary" className="col-span-2 row-span-3">
        <div className="space-y-2 p-1 text-[10px]">
          <div className="grid grid-cols-2 gap-1">
            <div className="border border-bb-border p-1.5 text-center"><div className="text-lg font-bold text-bb-green">{gainers}</div><div className="text-[8px] text-bb-muted">GAINERS</div></div>
            <div className="border border-bb-border p-1.5 text-center"><div className="text-lg font-bold text-bb-red">{filtered.length - gainers}</div><div className="text-[8px] text-bb-muted">LOSERS</div></div>
          </div>
          <div className="text-[9px] text-bb-muted">FILTER BY ASSET</div>
          <div className="flex flex-wrap gap-0.5">
            {cats.map(c => (
              <button key={c} onClick={() => setFilter(c)} className={`px-1.5 py-[2px] text-[8px] border ${filter === c ? 'border-bb-amber text-bb-amber bg-bb-amber/10' : 'border-bb-border text-bb-muted'}`}>{c}</button>
            ))}
          </div>
        </div>
      </Panel>

      <Panel title={`Futures Market (${filtered.length})`} className="col-span-6 row-span-3">
        <table className="bb-table">
          <thead>
            <tr><th>Symbol</th><th>Name</th><th>Month</th><th className="text-right">Last</th><th className="text-right">Change</th><th className="text-right">Chg%</th><th className="text-right">Volume</th><th className="text-right">Open Int.</th></tr>
          </thead>
          <tbody>
            {filtered.map(f => (
              <tr key={f.symbol}>
                <td className="text-bb-amber">{f.symbol}</td>
                <td>{f.name}</td>
                <td className="text-bb-muted">{f.month}</td>
                <td className="text-right">{formatNumber(f.last, f.last < 10 ? 6 : 2)}</td>
                <td className={`text-right ${colorClass(f.change)}`}>{formatChange(f.change, f.last < 10 ? 4 : 2)}</td>
                <td className={`text-right ${colorClass(f.changePct)}`}>{formatPercent(f.changePct)}</td>
                <td className="text-right text-bb-muted">{f.volume}</td>
                <td className="text-right text-bb-muted">{f.oi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel title="Basis & Expiry" className="col-span-12 row-span-3">
        <table className="bb-table">
          <thead><tr><th>Symbol</th><th>Name</th><th>Category</th><th>Expiry</th><th className="text-right">Spot Est.</th><th className="text-right">Futures</th><th className="text-right">Basis</th><th className="text-right">Annualized %</th></tr></thead>
          <tbody>
            {filtered.map(f => {
              const spot = f.last * (1 - f.changePct / 200);
              const basis = f.last - spot;
              const annBasis = (basis / spot) * 400;
              return (
                <tr key={f.symbol + '-basis'}>
                  <td className="text-bb-amber">{f.symbol}</td>
                  <td>{f.name}</td>
                  <td className="text-bb-muted text-[9px]">{categories[f.symbol]}</td>
                  <td className="text-bb-muted">{f.month}</td>
                  <td className="text-right">{formatNumber(spot, f.last < 10 ? 4 : 2)}</td>
                  <td className="text-right font-bold">{formatNumber(f.last, f.last < 10 ? 4 : 2)}</td>
                  <td className={`text-right ${colorClass(basis)}`}>{formatChange(basis, 2)}</td>
                  <td className={`text-right ${colorClass(annBasis)}`}>{formatPercent(annBasis)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

export default memo(Futures);
