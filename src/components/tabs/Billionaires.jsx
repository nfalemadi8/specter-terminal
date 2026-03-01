import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import Panel from '../layout/Panel';
import { formatLargeNumber, colorClass, round } from '../../utils/format';

const tt = { contentStyle: { background: '#1a1a1a', border: '1px solid #2a2a2a', fontSize: '10px', fontFamily: 'monospace' }, labelStyle: { color: '#ffbf00', fontSize: '10px' } };

const billionaires = [
  { rank: 1, name: 'Elon Musk', netWorth: 251.0, change: 4.2, changePct: 1.7, source: 'Tesla, SpaceX', country: 'US', sector: 'Technology', age: 53, selfMade: true },
  { rank: 2, name: 'Bernard Arnault', netWorth: 233.0, change: -1.8, changePct: -0.8, source: 'LVMH', country: 'France', sector: 'Consumer', age: 75, selfMade: false },
  { rank: 3, name: 'Jeff Bezos', netWorth: 209.0, change: 3.1, changePct: 1.5, source: 'Amazon', country: 'US', sector: 'Technology', age: 60, selfMade: true },
  { rank: 4, name: 'Mark Zuckerberg', netWorth: 200.0, change: 5.8, changePct: 3.0, source: 'Meta', country: 'US', sector: 'Technology', age: 40, selfMade: true },
  { rank: 5, name: 'Larry Ellison', netWorth: 188.0, change: 2.4, changePct: 1.3, source: 'Oracle', country: 'US', sector: 'Technology', age: 80, selfMade: true },
  { rank: 6, name: 'Warren Buffett', netWorth: 143.0, change: 0.8, changePct: 0.6, source: 'Berkshire Hathaway', country: 'US', sector: 'Finance', age: 94, selfMade: true },
  { rank: 7, name: 'Larry Page', netWorth: 156.0, change: 1.2, changePct: 0.8, source: 'Google', country: 'US', sector: 'Technology', age: 51, selfMade: true },
  { rank: 8, name: 'Sergey Brin', netWorth: 149.0, change: 1.1, changePct: 0.7, source: 'Google', country: 'US', sector: 'Technology', age: 51, selfMade: true },
  { rank: 9, name: 'Steve Ballmer', netWorth: 136.0, change: -0.5, changePct: -0.4, source: 'Microsoft', country: 'US', sector: 'Technology', age: 68, selfMade: true },
  { rank: 10, name: 'Jensen Huang', netWorth: 127.0, change: 8.2, changePct: 6.9, source: 'NVIDIA', country: 'US', sector: 'Technology', age: 61, selfMade: true },
  { rank: 11, name: 'Amancio Ortega', netWorth: 120.0, change: 1.5, changePct: 1.3, source: 'Zara / Inditex', country: 'Spain', sector: 'Retail', age: 88, selfMade: true },
  { rank: 12, name: 'Mukesh Ambani', netWorth: 115.0, change: 0.9, changePct: 0.8, source: 'Reliance', country: 'India', sector: 'Diversified', age: 67, selfMade: false },
  { rank: 13, name: 'Prince Alwaleed bin Talal', netWorth: 18.7, change: 0.3, changePct: 1.6, source: 'Kingdom Holding', country: 'Saudi Arabia', sector: 'Diversified', age: 69, selfMade: false },
  { rank: 14, name: 'Abdulla Al Futtaim', netWorth: 7.2, change: 0.1, changePct: 1.4, source: 'Al Futtaim Group', country: 'UAE', sector: 'Diversified', age: 84, selfMade: false },
  { rank: 15, name: 'Hussain Sajwani', netWorth: 5.8, change: 0.2, changePct: 3.6, source: 'DAMAC Properties', country: 'UAE', sector: 'Real Estate', age: 71, selfMade: true },
  { rank: 16, name: 'Mohammed Al Amoudi', netWorth: 8.4, change: -0.1, changePct: -1.2, source: 'MIDROC', country: 'Saudi Arabia', sector: 'Diversified', age: 78, selfMade: true },
  { rank: 17, name: 'Nassef Sawiris', netWorth: 8.2, change: 0.4, changePct: 5.1, source: 'OCI / Adidas', country: 'Egypt', sector: 'Construction', age: 63, selfMade: true },
  { rank: 18, name: 'Gautam Adani', netWorth: 84.0, change: -2.1, changePct: -2.4, source: 'Adani Group', country: 'India', sector: 'Infrastructure', age: 62, selfMade: true },
  { rank: 19, name: 'Bill Gates', netWorth: 104.0, change: 0.6, changePct: 0.6, source: 'Microsoft', country: 'US', sector: 'Technology', age: 69, selfMade: true },
  { rank: 20, name: 'Michael Bloomberg', netWorth: 96.3, change: 0.4, changePct: 0.4, source: 'Bloomberg LP', country: 'US', sector: 'Finance', age: 82, selfMade: true },
];

const SECTORS = ['All', ...new Set(billionaires.map(b => b.sector))];
const COUNTRIES = ['All', ...new Set(billionaires.map(b => b.country))];
const COLORS = ['#ffbf00', '#4a9eff', '#00d26a', '#ff3b3b', '#ff8c00', '#00e5ff', '#ffd700', '#6a6a6a'];

export default function Billionaires() {
  const [sectorFilter, setSectorFilter] = useState('All');
  const [countryFilter, setCountryFilter] = useState('All');
  const [sortKey, setSortKey] = useState('rank');
  const [sortDir, setSortDir] = useState(1);
  const [selected, setSelected] = useState(billionaires[0]);

  const filtered = useMemo(() => {
    let data = [...billionaires];
    if (sectorFilter !== 'All') data = data.filter(b => b.sector === sectorFilter);
    if (countryFilter !== 'All') data = data.filter(b => b.country === countryFilter);
    data.sort((a, b) => {
      const aVal = a[sortKey], bVal = b[sortKey];
      if (typeof aVal === 'string') return aVal.localeCompare(bVal) * sortDir;
      return ((aVal || 0) - (bVal || 0)) * sortDir;
    });
    return data;
  }, [sectorFilter, countryFilter, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d * -1);
    else { setSortKey(key); setSortDir(key === 'rank' ? 1 : -1); }
  };

  // Stats
  const totalWealth = filtered.reduce((s, b) => s + b.netWorth, 0);
  const avgAge = Math.round(filtered.reduce((s, b) => s + b.age, 0) / (filtered.length || 1));
  const selfMadeCount = filtered.filter(b => b.selfMade).length;
  const biggestGainer = [...filtered].sort((a, b) => b.changePct - a.changePct)[0];
  const biggestLoser = [...filtered].sort((a, b) => a.changePct - b.changePct)[0];

  // By sector chart
  const bySector = useMemo(() => {
    const map = {};
    filtered.forEach(b => { map[b.sector] = (map[b.sector] || 0) + b.netWorth; });
    return Object.entries(map).map(([name, value]) => ({ name, value: round(value, 1) })).sort((a, b) => b.value - a.value);
  }, [filtered]);

  // By country chart
  const byCountry = useMemo(() => {
    const map = {};
    filtered.forEach(b => { map[b.country] = (map[b.country] || 0) + b.netWorth; });
    return Object.entries(map).map(([name, value]) => ({ name, value: round(value, 1) })).sort((a, b) => b.value - a.value);
  }, [filtered]);

  // Top 10 wealth chart
  const topChart = useMemo(() => filtered.slice(0, 10).map(b => ({ name: b.name.split(' ').pop(), worth: b.netWorth, change: b.changePct })), [filtered]);

  const sortIcon = (key) => sortKey === key ? (sortDir === 1 ? ' ▲' : ' ▼') : '';

  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      {/* Filters */}
      <Panel title="Filters" className="col-span-2 row-span-4">
        <div className="space-y-2 text-[10px]">
          <div>
            <div className="text-[9px] text-bb-muted mb-1">SECTOR</div>
            <div className="space-y-0.5">
              {SECTORS.map(s => (
                <button key={s} onClick={() => setSectorFilter(s)}
                  className={`block w-full text-left px-1.5 py-0.5 border text-[9px] ${
                    sectorFilter === s ? 'border-bb-amber text-bb-amber bg-bb-amber/10' : 'border-bb-border text-bb-muted hover:text-bb-white'
                  }`}>{s}</button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[9px] text-bb-muted mb-1">COUNTRY</div>
            <div className="space-y-0.5 max-h-40 overflow-auto">
              {COUNTRIES.map(c => (
                <button key={c} onClick={() => setCountryFilter(c)}
                  className={`block w-full text-left px-1.5 py-0.5 border text-[9px] ${
                    countryFilter === c ? 'border-bb-amber text-bb-amber bg-bb-amber/10' : 'border-bb-border text-bb-muted hover:text-bb-white'
                  }`}>{c}</button>
              ))}
            </div>
          </div>
        </div>
      </Panel>

      {/* Rankings Table */}
      <Panel title={`Billionaires Index (${filtered.length})`} className="col-span-7 row-span-4">
        <table className="bb-table">
          <thead>
            <tr>
              <th className="cursor-pointer" onClick={() => handleSort('rank')}>#{ sortIcon('rank')}</th>
              <th className="cursor-pointer" onClick={() => handleSort('name')}>Name{sortIcon('name')}</th>
              <th className="text-right cursor-pointer" onClick={() => handleSort('netWorth')}>Net Worth ($B){sortIcon('netWorth')}</th>
              <th className="text-right cursor-pointer" onClick={() => handleSort('changePct')}>Chg%{sortIcon('changePct')}</th>
              <th>Source</th>
              <th>Country</th>
              <th className="cursor-pointer" onClick={() => handleSort('age')}>Age{sortIcon('age')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b.rank} onClick={() => setSelected(b)} className={`cursor-pointer ${selected.rank === b.rank ? 'bg-bb-amber/10' : ''}`}>
                <td className="text-bb-muted">{b.rank}</td>
                <td className="text-bb-amber font-bold">{b.name}</td>
                <td className="text-right font-bold">${round(b.netWorth, 1)}B</td>
                <td className={`text-right ${colorClass(b.changePct)}`}>{b.changePct > 0 ? '+' : ''}{round(b.changePct, 1)}%</td>
                <td className="text-bb-muted text-[9px] truncate max-w-[100px]">{b.source}</td>
                <td className="text-[9px]">{b.country}</td>
                <td className="text-bb-muted">{b.age}</td>
                <td>{b.selfMade ? <span className="text-[7px] px-1 py-[1px] bg-bb-green/20 text-bb-green">SELF</span> : <span className="text-[7px] px-1 py-[1px] bg-bb-blue/20 text-bb-blue">INHR</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      {/* Stats */}
      <Panel title="Statistics" className="col-span-3 row-span-4">
        <div className="space-y-2 text-[10px] p-0.5">
          <div className="grid grid-cols-2 gap-1.5">
            <div className="border border-bb-border p-2 text-center">
              <div className="text-lg font-bold text-bb-amber">${round(totalWealth, 0)}B</div>
              <div className="text-[8px] text-bb-muted">TOTAL WEALTH</div>
            </div>
            <div className="border border-bb-border p-2 text-center">
              <div className="text-lg font-bold text-bb-white">{avgAge}</div>
              <div className="text-[8px] text-bb-muted">AVG AGE</div>
            </div>
          </div>
          <table className="bb-table"><tbody>
            {[
              ['Self-Made', `${selfMadeCount}/${filtered.length}`],
              ['Biggest Gainer', biggestGainer ? `${biggestGainer.name.split(' ').pop()} +${round(biggestGainer.changePct, 1)}%` : '—'],
              ['Biggest Loser', biggestLoser ? `${biggestLoser.name.split(' ').pop()} ${round(biggestLoser.changePct, 1)}%` : '—'],
            ].map(([l, v]) => (
              <tr key={l}><td className="text-bb-muted">{l}</td><td className="text-right font-bold">{v}</td></tr>
            ))}
          </tbody></table>

          <div className="border-t border-bb-border pt-1.5">
            <div className="text-[9px] text-bb-muted mb-1">SELECTED: {selected.name}</div>
            <table className="bb-table"><tbody>
              {[
                ['Net Worth', `$${round(selected.netWorth, 1)}B`],
                ['Source', selected.source],
                ['Country', selected.country],
                ['Sector', selected.sector],
                ['Daily Chg', `$${round(selected.change, 1)}B (${selected.changePct > 0 ? '+' : ''}${round(selected.changePct, 1)}%)`],
                ['Self-Made', selected.selfMade ? 'Yes' : 'No'],
              ].map(([l, v]) => (
                <tr key={l}><td className="text-bb-muted">{l}</td><td className="text-right font-bold">{v}</td></tr>
              ))}
            </tbody></table>
          </div>
        </div>
      </Panel>

      {/* Top Wealth Bar Chart */}
      <Panel title="Top 10 by Wealth ($B)" className="col-span-4 row-span-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topChart} layout="vertical" margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <XAxis type="number" tick={{ fill: '#6a6a6a', fontSize: 8 }} />
            <YAxis type="category" dataKey="name" tick={{ fill: '#6a6a6a', fontSize: 8 }} width={60} />
            <Tooltip {...tt} formatter={v => `$${round(v, 1)}B`} />
            <Bar dataKey="worth" radius={[0, 2, 2, 0]}>
              {topChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Panel>

      {/* By Sector Pie */}
      <Panel title="Wealth by Sector" className="col-span-4 row-span-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={bySector} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="80%" innerRadius="40%" paddingAngle={2} label={({ name, value }) => `${name}: $${value}B`} labelLine={false}>
              {bySector.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip {...tt} formatter={v => `$${round(v, 1)}B`} />
          </PieChart>
        </ResponsiveContainer>
      </Panel>

      {/* By Country */}
      <Panel title="Wealth by Country" className="col-span-4 row-span-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={byCountry} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <XAxis dataKey="name" tick={{ fill: '#6a6a6a', fontSize: 8 }} />
            <YAxis tick={{ fill: '#6a6a6a', fontSize: 8 }} width={40} />
            <Tooltip {...tt} formatter={v => `$${round(v, 1)}B`} />
            <Bar dataKey="value" radius={[2, 2, 0, 0]}>
              {byCountry.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Panel>
    </div>
  );
}
