import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import Panel from '../layout/Panel';
import { formatNumber, formatMcap, colorClass, round } from '../../utils/format';

const tt = { contentStyle: { background: '#1a1a1a', border: '1px solid #2a2a2a', fontSize: '10px', fontFamily: 'monospace' }, labelStyle: { color: '#ffbf00', fontSize: '10px' } };

const deals = [
  { id: 1, acquirer: 'Microsoft', target: 'Activision Blizzard', value: 68.7e9, premium: 45.2, status: 'Completed', sector: 'Technology', date: '2023-10', type: 'Cash', synergies: '$3.2B', rationale: 'Gaming expansion' },
  { id: 2, acquirer: 'Broadcom', target: 'VMware', value: 61.0e9, premium: 44.1, status: 'Completed', sector: 'Technology', date: '2023-11', type: 'Cash/Stock', synergies: '$8.5B', rationale: 'Enterprise software' },
  { id: 3, acquirer: 'Exxon Mobil', target: 'Pioneer Natural', value: 59.5e9, premium: 18.4, status: 'Completed', sector: 'Energy', date: '2024-01', type: 'All-Stock', synergies: '$2.0B', rationale: 'Permian Basin consolidation' },
  { id: 4, acquirer: 'Pfizer', target: 'Seagen', value: 43.0e9, premium: 33.0, status: 'Completed', sector: 'Healthcare', date: '2023-12', type: 'Cash', synergies: '$4.0B', rationale: 'Oncology pipeline' },
  { id: 5, acquirer: 'Cisco', target: 'Splunk', value: 28.0e9, premium: 31.2, status: 'Completed', sector: 'Technology', date: '2024-03', type: 'Cash', synergies: '$1.8B', rationale: 'Cybersecurity/AI' },
  { id: 6, acquirer: 'Capital One', target: 'Discover Financial', value: 35.3e9, premium: 26.6, status: 'Pending', sector: 'Financials', date: '2024-Q2', type: 'All-Stock', synergies: '$2.7B', rationale: 'Credit card scale' },
  { id: 7, acquirer: 'Synopsys', target: 'Ansys', value: 35.0e9, premium: 29.0, status: 'Pending', sector: 'Technology', date: '2024-Q4', type: 'Cash/Stock', synergies: '$1.5B', rationale: 'EDA + simulation' },
  { id: 8, acquirer: 'Nippon Steel', target: 'U.S. Steel', value: 14.9e9, premium: 40.0, status: 'Pending', sector: 'Materials', date: '2024-Q3', type: 'Cash', synergies: '$1.0B', rationale: 'Steel production' },
];

const rumors = [
  { target: 'Hess Corp', suitors: 'Chevron', sector: 'Energy', estValue: '$53B', likelihood: 'High' },
  { target: 'Juniper Networks', suitors: 'HPE', sector: 'Technology', estValue: '$14B', likelihood: 'High' },
  { target: 'Macy\'s', suitors: 'Arkhouse/Brigade', sector: 'Consumer', estValue: '$6.6B', likelihood: 'Medium' },
  { target: 'Spirit Airlines', suitors: 'JetBlue/Frontier', sector: 'Industrials', estValue: '$3.8B', likelihood: 'Low' },
];

const STATUS_COLORS = { Completed: '#00d26a', Pending: '#ffd700', Blocked: '#ff3b3b', Rumored: '#4a9eff' };

export default function MATracker() {
  const [statusFilter, setStatusFilter] = useState('All');
  const [sectorFilter, setSectorFilter] = useState('All');

  const sectors = useMemo(() => ['All', ...new Set(deals.map(d => d.sector))], []);

  const filtered = useMemo(() => {
    let data = deals;
    if (statusFilter !== 'All') data = data.filter(d => d.status === statusFilter);
    if (sectorFilter !== 'All') data = data.filter(d => d.sector === sectorFilter);
    return data.sort((a, b) => b.value - a.value);
  }, [statusFilter, sectorFilter]);

  // Sector breakdown
  const sectorData = useMemo(() => {
    const map = {};
    deals.forEach(d => { map[d.sector] = (map[d.sector] || 0) + d.value; });
    const colors = { Technology: '#4a9eff', Energy: '#ff3b3b', Healthcare: '#00d26a', Financials: '#ffd700', Materials: '#ff8c00' };
    return Object.entries(map).map(([name, value]) => ({
      name, value: round(value / 1e9, 1), color: colors[name] || '#6a6a6a',
    })).sort((a, b) => b.value - a.value);
  }, []);

  // Premium distribution
  const premiumData = useMemo(() => deals.map(d => ({ name: d.target.split(' ')[0], premium: d.premium })).sort((a, b) => b.premium - a.premium), []);

  // Stats
  const totalValue = deals.reduce((s, d) => s + d.value, 0);
  const avgPremium = deals.reduce((s, d) => s + d.premium, 0) / deals.length;
  const pendingCount = deals.filter(d => d.status === 'Pending').length;

  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      {/* Filters & Stats */}
      <Panel title="M&A Tracker" className="col-span-2 row-span-6">
        <div className="space-y-2 text-[10px] p-0.5">
          <div>
            <div className="text-[9px] text-bb-muted mb-1">STATUS</div>
            {['All', 'Completed', 'Pending'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`block w-full text-left px-1.5 py-0.5 border mb-0.5 text-[9px] ${statusFilter === s ? 'border-bb-amber text-bb-amber bg-bb-amber/10' : 'border-bb-border text-bb-muted'}`}>{s}</button>
            ))}
          </div>
          <div>
            <div className="text-[9px] text-bb-muted mb-1">SECTOR</div>
            {sectors.map(s => (
              <button key={s} onClick={() => setSectorFilter(s)}
                className={`block w-full text-left px-1.5 py-0.5 border mb-0.5 text-[9px] ${sectorFilter === s ? 'border-bb-blue text-bb-blue bg-bb-blue/10' : 'border-bb-border text-bb-muted'}`}>{s}</button>
            ))}
          </div>
          <div className="border-t border-bb-border pt-1.5">
            <div className="text-[9px] text-bb-muted mb-1">SUMMARY</div>
            <table className="bb-table"><tbody>
              {[['Total Deals', deals.length], ['Total Value', formatMcap(totalValue)], ['Avg Premium', round(avgPremium, 1) + '%'], ['Pending', pendingCount]].map(([l, v]) => (
                <tr key={l}><td className="text-bb-muted">{l}</td><td className="text-right font-bold">{v}</td></tr>
              ))}
            </tbody></table>
          </div>
        </div>
      </Panel>

      {/* Deal Table */}
      <Panel title={`Active Deals (${filtered.length})`} className="col-span-10 row-span-3">
        <table className="bb-table">
          <thead>
            <tr><th>Acquirer</th><th>Target</th><th className="text-right">Value</th><th className="text-right">Premium</th><th>Type</th><th>Sector</th><th>Date</th><th>Status</th><th>Synergies</th><th>Rationale</th></tr>
          </thead>
          <tbody>
            {filtered.map(d => (
              <tr key={d.id}>
                <td className="text-bb-amber font-bold">{d.acquirer}</td>
                <td className="text-bb-cyan">{d.target}</td>
                <td className="text-right font-bold">{formatMcap(d.value)}</td>
                <td className="text-right text-bb-green">+{d.premium}%</td>
                <td className="text-bb-muted">{d.type}</td>
                <td className="text-bb-muted">{d.sector}</td>
                <td className="text-bb-muted">{d.date}</td>
                <td><span style={{ color: STATUS_COLORS[d.status] }} className="font-bold text-[9px]">{d.status.toUpperCase()}</span></td>
                <td className="text-bb-muted">{d.synergies}</td>
                <td className="text-bb-muted text-[9px]">{d.rationale}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      {/* Sector Pie */}
      <Panel title="Deal Value by Sector ($B)" className="col-span-4 row-span-3">
        <ResponsiveContainer width="100%" height="70%">
          <PieChart>
            <Pie data={sectorData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={55} innerRadius={25} strokeWidth={1} stroke="#1a1a1a">
              {sectorData.map(s => <Cell key={s.name} fill={s.color} />)}
            </Pie>
            <Tooltip {...tt} formatter={v => '$' + v + 'B'} />
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-0.5 text-[9px]">
          {sectorData.map(s => (
            <div key={s.name} className="flex items-center justify-between">
              <div className="flex items-center gap-1"><span className="inline-block w-2 h-2" style={{ backgroundColor: s.color }} /><span className="text-bb-muted">{s.name}</span></div>
              <span>${s.value}B</span>
            </div>
          ))}
        </div>
      </Panel>

      {/* Premium Distribution */}
      <Panel title="Acquisition Premiums (%)" className="col-span-3 row-span-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={premiumData} layout="vertical" margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <XAxis type="number" tick={{ fill: '#6a6a6a', fontSize: 8 }} tickFormatter={v => v + '%'} />
            <YAxis type="category" dataKey="name" tick={{ fill: '#6a6a6a', fontSize: 8 }} width={65} />
            <Tooltip {...tt} formatter={v => v + '%'} />
            <Bar dataKey="premium" fill="#00d26a" radius={[0, 2, 2, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Panel>

      {/* Rumors */}
      <Panel title="Rumored / Speculated" className="col-span-3 row-span-3">
        <table className="bb-table">
          <thead><tr><th>Target</th><th>Suitor</th><th className="text-right">Est.</th><th>P(deal)</th></tr></thead>
          <tbody>
            {rumors.map(r => (
              <tr key={r.target}>
                <td className="text-bb-cyan">{r.target}</td>
                <td className="text-bb-muted">{r.suitors}</td>
                <td className="text-right">{r.estValue}</td>
                <td><span className={`text-[9px] ${r.likelihood === 'High' ? 'text-bb-green' : r.likelihood === 'Medium' ? 'text-bb-yellow' : 'text-bb-red'}`}>{r.likelihood}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
