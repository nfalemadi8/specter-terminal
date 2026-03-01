import { useState, useMemo , memo } from 'react';
import Panel from '../layout/Panel';
import { stocks } from '../../data/stocks';
import { formatNumber, formatPercent, formatChange, colorClass } from '../../utils/format';

function Screener() {
  const [sortBy, setSortBy] = useState('changePct');
  const [sortDir, setSortDir] = useState('desc');
  const [sectorFilter, setSectorFilter] = useState('All');

  const sectors = ['All', ...new Set(stocks.map(s => s.sector))];

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('desc');
    }
  };

  const filtered = useMemo(() => {
    let data = sectorFilter === 'All' ? stocks : stocks.filter(s => s.sector === sectorFilter);
    return [...data].sort((a, b) => {
      const mul = sortDir === 'asc' ? 1 : -1;
      return (a[sortBy] > b[sortBy] ? 1 : -1) * mul;
    });
  }, [sortBy, sortDir, sectorFilter]);

  const SortHeader = ({ field, children, align = 'left' }) => (
    <th
      className={`cursor-pointer hover:text-bb-white ${align === 'right' ? 'text-right' : ''}`}
      onClick={() => handleSort(field)}
    >
      {children} {sortBy === field ? (sortDir === 'asc' ? '▲' : '▼') : ''}
    </th>
  );

  return (
    <div className="h-full grid grid-cols-12 grid-rows-1 gap-[3px] p-[3px]">
      <Panel title="Stock Screener" className="col-span-12">
        <div className="flex gap-1 mb-2 flex-wrap">
          {sectors.map(s => (
            <button
              key={s}
              onClick={() => setSectorFilter(s)}
              className={`px-2 py-[2px] text-[10px] rounded border ${
                sectorFilter === s
                  ? 'border-bb-amber text-bb-amber bg-bb-amber/10'
                  : 'border-bb-border text-bb-muted hover:text-bb-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <table className="bb-table">
          <thead>
            <tr>
              <SortHeader field="symbol">Symbol</SortHeader>
              <SortHeader field="name">Name</SortHeader>
              <SortHeader field="price" align="right">Price</SortHeader>
              <SortHeader field="change" align="right">Chg</SortHeader>
              <SortHeader field="changePct" align="right">Chg%</SortHeader>
              <SortHeader field="pe" align="right">P/E</SortHeader>
              <th className="text-right">Vol</th>
              <th className="text-right">MCap</th>
              <th>Sector</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.symbol}>
                <td className="text-bb-amber">{s.symbol}</td>
                <td>{s.name}</td>
                <td className="text-right">{formatNumber(s.price)}</td>
                <td className={`text-right ${colorClass(s.change)}`}>{formatChange(s.change)}</td>
                <td className={`text-right ${colorClass(s.changePct)}`}>{formatPercent(s.changePct)}</td>
                <td className="text-right">{s.pe}</td>
                <td className="text-right text-bb-muted">{s.volume}</td>
                <td className="text-right text-bb-muted">{s.marketCap}</td>
                <td className="text-bb-muted">{s.sector}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

export default memo(Screener);
