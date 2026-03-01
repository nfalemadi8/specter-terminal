import { useState, useEffect, useMemo, memo } from 'react';
import Panel from '../layout/Panel';
import { getAllStocks } from '../../services/dataProvider';
import { formatNumber, formatPercent, formatMcap, colorClass, round } from '../../utils/format';

function Screener() {
  const [stocks, setStocks] = useState(null);
  const [sortBy, setSortBy] = useState('changePercent');
  const [sortDir, setSortDir] = useState('desc');
  const [sectorFilter, setSectorFilter] = useState('All');
  const [countryFilter, setCountryFilter] = useState('All');
  const [exchangeFilter, setExchangeFilter] = useState('All');

  useEffect(() => { getAllStocks().then(setStocks); }, []);

  const sectors = useMemo(() => stocks ? ['All', ...new Set(stocks.map(s => s.sector).filter(Boolean))] : ['All'], [stocks]);
  const countries = useMemo(() => stocks ? ['All', ...new Set(stocks.map(s => s.country).filter(Boolean))] : ['All'], [stocks]);
  const exchanges = useMemo(() => stocks ? ['All', ...new Set(stocks.map(s => s.exchange).filter(Boolean))] : ['All'], [stocks]);

  const handleSort = (field) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortDir('desc'); }
  };

  const filtered = useMemo(() => {
    if (!stocks) return [];
    let data = stocks;
    if (sectorFilter !== 'All') data = data.filter(s => s.sector === sectorFilter);
    if (countryFilter !== 'All') data = data.filter(s => s.country === countryFilter);
    if (exchangeFilter !== 'All') data = data.filter(s => s.exchange === exchangeFilter);
    return [...data].sort((a, b) => {
      const mul = sortDir === 'asc' ? 1 : -1;
      return ((a[sortBy] || 0) > (b[sortBy] || 0) ? 1 : -1) * mul;
    });
  }, [stocks, sortBy, sortDir, sectorFilter, countryFilter, exchangeFilter]);

  if (!stocks) return <div className="p-4 text-bb-muted text-center text-[11px]">Loading stock data…</div>;

  const SortHeader = ({ field, children, align = 'left' }) => (
    <th className={`cursor-pointer hover:text-bb-white ${align === 'right' ? 'text-right' : ''}`}
      onClick={() => handleSort(field)}>
      {children} {sortBy === field ? (sortDir === 'asc' ? '▲' : '▼') : ''}
    </th>
  );

  return (
    <div className="h-full grid grid-cols-12 grid-rows-1 gap-[3px] p-[3px]">
      <Panel title={`Global Stock Screener (${filtered.length} of ${stocks.length})`} className="col-span-12">
        <div className="flex gap-2 mb-2 flex-wrap text-[10px]">
          <div className="flex items-center gap-1">
            <span className="text-bb-muted">Sector:</span>
            <select value={sectorFilter} onChange={e => setSectorFilter(e.target.value)}
              className="bg-bb-dark border border-bb-border text-bb-white text-[10px] px-1 py-[2px] font-mono focus:border-bb-amber focus:outline-none">
              {sectors.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-bb-muted">Country:</span>
            <select value={countryFilter} onChange={e => setCountryFilter(e.target.value)}
              className="bg-bb-dark border border-bb-border text-bb-white text-[10px] px-1 py-[2px] font-mono focus:border-bb-amber focus:outline-none">
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-bb-muted">Exchange:</span>
            <select value={exchangeFilter} onChange={e => setExchangeFilter(e.target.value)}
              className="bg-bb-dark border border-bb-border text-bb-white text-[10px] px-1 py-[2px] font-mono focus:border-bb-amber focus:outline-none">
              {exchanges.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
        </div>
        <table className="bb-table">
          <thead>
            <tr>
              <SortHeader field="ticker">Ticker</SortHeader>
              <SortHeader field="name">Name</SortHeader>
              <th>Exchange</th>
              <SortHeader field="price" align="right">Price</SortHeader>
              <SortHeader field="changePercent" align="right">Chg%</SortHeader>
              <SortHeader field="pe" align="right">P/E</SortHeader>
              <SortHeader field="marketCap" align="right">MCap</SortHeader>
              <SortHeader field="divYield" align="right">Div%</SortHeader>
              <SortHeader field="beta" align="right">Beta</SortHeader>
              <th>Sector</th>
              <th>Country</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.ticker}>
                <td className="text-bb-amber">{s.ticker}</td>
                <td>{s.name}</td>
                <td className="text-bb-muted">{s.exchange}</td>
                <td className="text-right">{formatNumber(s.price)}</td>
                <td className={`text-right ${colorClass(s.changePercent)}`}>{formatPercent(s.changePercent)}</td>
                <td className="text-right">{s.pe > 0 ? round(s.pe, 1) : '—'}</td>
                <td className="text-right text-bb-muted">{formatMcap(s.marketCap)}</td>
                <td className="text-right">{s.divYield > 0 ? round(s.divYield, 2) + '%' : '—'}</td>
                <td className="text-right">{round(s.beta, 2)}</td>
                <td className="text-bb-muted">{s.sector}</td>
                <td className="text-bb-muted">{s.country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

export default memo(Screener);
