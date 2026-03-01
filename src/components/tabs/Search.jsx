import { useState, useMemo } from 'react';
import Panel from '../layout/Panel';
import { stocks } from '../../data/stocks';
import { formatNumber, formatCurrency, formatPercent, formatMcap, colorClass } from '../../utils/format';
import { exportToCSV } from '../../utils/calculations';

const FILTER_DEFS = [
  { id: 'sector', label: 'Sector', type: 'select', options: () => [...new Set(stocks.map(s => s.sector))] },
  { id: 'industry', label: 'Industry', type: 'select', options: () => [...new Set(stocks.map(s => s.industry))] },
  { id: 'country', label: 'Country', type: 'select', options: () => [...new Set(stocks.map(s => s.country))] },
  { id: 'pe', label: 'P/E Ratio', type: 'range', min: 0, max: 200, step: 1 },
  { id: 'pb', label: 'P/B Ratio', type: 'range', min: 0, max: 100, step: 0.5 },
  { id: 'ps', label: 'P/S Ratio', type: 'range', min: 0, max: 50, step: 0.5 },
  { id: 'evEbitda', label: 'EV/EBITDA', type: 'range', min: 0, max: 100, step: 1 },
  { id: 'mcap', label: 'Market Cap ($)', type: 'range', min: 0, max: 10e12, step: 1e9, fmt: 'mcap' },
  { id: 'divYield', label: 'Dividend Yield (%)', type: 'range', min: 0, max: 15, step: 0.1 },
  { id: 'revGrowth', label: 'Revenue Growth (%)', type: 'range', min: -50, max: 200, step: 1 },
  { id: 'margin', label: 'Net Margin (%)', type: 'range', min: -20, max: 80, step: 1 },
  { id: 'roe', label: 'ROE (%)', type: 'range', min: -20, max: 200, step: 1 },
  { id: 'eps', label: 'EPS ($)', type: 'range', min: -10, max: 100, step: 0.5 },
  { id: 'beta', label: 'Beta', type: 'range', min: 0, max: 3, step: 0.05 },
  { id: 'debtEquity', label: 'Debt/Equity', type: 'range', min: 0, max: 5, step: 0.05 },
  { id: 'debtToAssets', label: 'Debt/Assets', type: 'range', min: 0, max: 1, step: 0.01 },
  { id: 'esgTotal', label: 'ESG Score', type: 'range', min: 0, max: 100, step: 1 },
  { id: 'haramRevenue', label: 'Haram Revenue (%)', type: 'range', min: 0, max: 100, step: 1 },
  { id: 'shariah', label: 'Shariah Compliant', type: 'bool' },
];

function isShariah(s) {
  return s.debtToAssets < 0.30 && s.debtEquity < 0.33 && s.haramRevenue < 5;
}

function applyFilter(stock, filter) {
  const def = FILTER_DEFS.find(d => d.id === filter.id);
  if (!def) return true;

  if (def.type === 'select') {
    return stock[def.id] === filter.value;
  }
  if (def.type === 'bool') {
    return filter.value === 'yes' ? isShariah(stock) : !isShariah(stock);
  }
  if (def.type === 'range') {
    const val = stock[def.id];
    if (val === undefined || val === null) return false;
    if (filter.min !== '' && val < parseFloat(filter.min)) return false;
    if (filter.max !== '' && val > parseFloat(filter.max)) return false;
    return true;
  }
  return true;
}

const SORT_FIELDS = [
  { id: 'ticker', label: 'Ticker' },
  { id: 'price', label: 'Price' },
  { id: 'changePct', label: 'Chg%' },
  { id: 'mcap', label: 'MCap' },
  { id: 'pe', label: 'P/E' },
  { id: 'pb', label: 'P/B' },
  { id: 'divYield', label: 'Yield' },
  { id: 'revGrowth', label: 'Rev Grw' },
  { id: 'margin', label: 'Margin' },
  { id: 'roe', label: 'ROE' },
  { id: 'beta', label: 'Beta' },
  { id: 'esgTotal', label: 'ESG' },
];

export default function Search() {
  const [filters, setFilters] = useState([]);
  const [addingFilter, setAddingFilter] = useState(false);
  const [sortBy, setSortBy] = useState('mcap');
  const [sortDir, setSortDir] = useState('desc');

  const usedIds = new Set(filters.map(f => f.id));
  const availableFilters = FILTER_DEFS.filter(d => !usedIds.has(d.id));

  const addFilter = (id) => {
    const def = FILTER_DEFS.find(d => d.id === id);
    if (!def) return;
    const newFilter = { id };
    if (def.type === 'select') newFilter.value = def.options()[0];
    else if (def.type === 'bool') newFilter.value = 'yes';
    else if (def.type === 'range') { newFilter.min = ''; newFilter.max = ''; }
    setFilters(prev => [...prev, newFilter]);
    setAddingFilter(false);
  };

  const updateFilter = (index, updates) => {
    setFilters(prev => prev.map((f, i) => i === index ? { ...f, ...updates } : f));
  };

  const removeFilter = (index) => {
    setFilters(prev => prev.filter((_, i) => i !== index));
  };

  const results = useMemo(() => {
    let data = stocks.filter(s => filters.every(f => applyFilter(s, f)));
    data.sort((a, b) => {
      const mul = sortDir === 'asc' ? 1 : -1;
      const av = a[sortBy] ?? 0;
      const bv = b[sortBy] ?? 0;
      if (typeof av === 'string') return av.localeCompare(bv) * mul;
      return (av - bv) * mul;
    });
    return data;
  }, [filters, sortBy, sortDir]);

  const handleSort = (field) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortDir('desc'); }
  };

  const handleExport = () => {
    exportToCSV(results.map(s => ({
      Ticker: s.ticker, Name: s.name, Sector: s.sector, Price: s.price,
      'Chg%': s.changePct, MCap: s.mcap, PE: s.pe, PB: s.pb, DivYield: s.divYield,
      RevGrowth: s.revGrowth, Margin: s.margin, ROE: s.roe, Beta: s.beta, ESG: s.esgTotal,
      Shariah: isShariah(s) ? 'Yes' : 'No',
    })), 'eqs_screen_results.csv');
  };

  // Presets
  const loadPreset = (name) => {
    const presets = {
      'Value': [
        { id: 'pe', min: '', max: '15' },
        { id: 'pb', min: '', max: '3' },
        { id: 'divYield', min: '2', max: '' },
      ],
      'Growth': [
        { id: 'revGrowth', min: '10', max: '' },
        { id: 'roe', min: '15', max: '' },
        { id: 'margin', min: '10', max: '' },
      ],
      'Quality': [
        { id: 'roe', min: '20', max: '' },
        { id: 'margin', min: '15', max: '' },
        { id: 'debtEquity', min: '', max: '1' },
      ],
      'Shariah': [
        { id: 'shariah', value: 'yes' },
        { id: 'debtEquity', min: '', max: '0.33' },
        { id: 'haramRevenue', min: '', max: '5' },
      ],
      'Dividend': [
        { id: 'divYield', min: '1.5', max: '' },
        { id: 'pe', min: '', max: '30' },
      ],
      'Low Vol': [
        { id: 'beta', min: '', max: '0.8' },
        { id: 'divYield', min: '1', max: '' },
      ],
    };
    setFilters(presets[name] || []);
  };

  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      {/* Filter Builder */}
      <Panel title="EQS — Equity Screening" className="col-span-3 row-span-6">
        <div className="space-y-2 text-[10px]">
          {/* Presets */}
          <div>
            <div className="text-bb-muted text-[9px] mb-1">PRESET SCREENS</div>
            <div className="flex flex-wrap gap-1">
              {['Value', 'Growth', 'Quality', 'Shariah', 'Dividend', 'Low Vol'].map(p => (
                <button
                  key={p}
                  onClick={() => loadPreset(p)}
                  className="px-2 py-0.5 border border-bb-border text-bb-cyan hover:text-bb-white hover:border-bb-cyan transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-bb-border pt-2">
            <div className="text-bb-muted text-[9px] mb-1">ACTIVE FILTERS ({filters.length})</div>
          </div>

          {/* Active Filters */}
          {filters.map((f, idx) => {
            const def = FILTER_DEFS.find(d => d.id === f.id);
            if (!def) return null;
            return (
              <div key={f.id} className="border border-bb-border p-1.5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-bb-amber font-bold text-[9px]">{def.label}</span>
                  <button onClick={() => removeFilter(idx)} className="text-bb-red hover:text-bb-white text-[9px] px-1">X</button>
                </div>

                {def.type === 'select' && (
                  <select
                    value={f.value}
                    onChange={e => updateFilter(idx, { value: e.target.value })}
                    className="w-full bg-bb-dark border border-bb-border text-bb-white text-[10px] px-1 py-0.5 font-mono focus:border-bb-amber focus:outline-none"
                  >
                    {def.options().map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                )}

                {def.type === 'bool' && (
                  <select
                    value={f.value}
                    onChange={e => updateFilter(idx, { value: e.target.value })}
                    className="w-full bg-bb-dark border border-bb-border text-bb-white text-[10px] px-1 py-0.5 font-mono focus:border-bb-amber focus:outline-none"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                )}

                {def.type === 'range' && (
                  <div className="flex gap-1 items-center">
                    <input
                      type="number"
                      placeholder="Min"
                      value={f.min}
                      onChange={e => updateFilter(idx, { min: e.target.value })}
                      step={def.step}
                      className="w-1/2 bg-bb-dark border border-bb-border text-bb-white text-[10px] px-1 py-0.5 font-mono focus:border-bb-amber focus:outline-none"
                    />
                    <span className="text-bb-muted">—</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={f.max}
                      onChange={e => updateFilter(idx, { max: e.target.value })}
                      step={def.step}
                      className="w-1/2 bg-bb-dark border border-bb-border text-bb-white text-[10px] px-1 py-0.5 font-mono focus:border-bb-amber focus:outline-none"
                    />
                  </div>
                )}
              </div>
            );
          })}

          {/* Add Filter */}
          {addingFilter ? (
            <div className="border border-bb-amber p-1.5">
              <div className="text-bb-amber text-[9px] mb-1">SELECT CRITERIA</div>
              <div className="max-h-40 overflow-auto space-y-0.5">
                {availableFilters.map(d => (
                  <button
                    key={d.id}
                    onClick={() => addFilter(d.id)}
                    className="block w-full text-left px-1.5 py-0.5 text-bb-white hover:bg-bb-amber/10 hover:text-bb-amber"
                  >
                    {d.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setAddingFilter(false)}
                className="mt-1 w-full text-center text-bb-muted hover:text-bb-white text-[9px]"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAddingFilter(true)}
              className="w-full py-1 border border-dashed border-bb-border text-bb-muted hover:text-bb-amber hover:border-bb-amber transition-colors"
            >
              + Add Filter
            </button>
          )}

          {/* Clear */}
          {filters.length > 0 && (
            <button
              onClick={() => setFilters([])}
              className="w-full py-0.5 text-bb-red hover:text-bb-white text-[9px]"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </Panel>

      {/* Results Header */}
      <Panel title={`Results — ${results.length} of ${stocks.length} securities`} className="col-span-9 row-span-1">
        <div className="flex items-center justify-between text-[10px] p-0.5">
          <div className="flex items-center gap-3">
            <span className="text-bb-muted">Universe: <span className="text-bb-white">{stocks.length} equities</span></span>
            <span className="text-bb-muted">Matched: <span className={results.length > 0 ? 'text-bb-green font-bold' : 'text-bb-red font-bold'}>{results.length}</span></span>
            <span className="text-bb-muted">Filters: <span className="text-bb-amber">{filters.length}</span></span>
          </div>
          <button
            onClick={handleExport}
            className="px-2 py-0.5 border border-bb-border text-bb-cyan hover:text-bb-white hover:border-bb-cyan"
          >
            Export CSV
          </button>
        </div>
      </Panel>

      {/* Results Table */}
      <Panel title="" className="col-span-9 row-span-5">
        <table className="bb-table">
          <thead>
            <tr>
              {[
                { id: 'ticker', label: 'Ticker', align: 'left' },
                { id: 'name', label: 'Name', align: 'left' },
                { id: 'sector', label: 'Sector', align: 'left' },
                { id: 'price', label: 'Price', align: 'right' },
                { id: 'changePct', label: 'Chg%', align: 'right' },
                { id: 'mcap', label: 'MCap', align: 'right' },
                { id: 'pe', label: 'P/E', align: 'right' },
                { id: 'divYield', label: 'Yield', align: 'right' },
                { id: 'revGrowth', label: 'Rev Grw', align: 'right' },
                { id: 'roe', label: 'ROE', align: 'right' },
                { id: 'beta', label: 'Beta', align: 'right' },
                { id: 'esgTotal', label: 'ESG', align: 'right' },
                { id: 'shariah', label: 'Shariah', align: 'center' },
              ].map(col => (
                <th
                  key={col.id}
                  className={`cursor-pointer hover:text-bb-white ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''}`}
                  onClick={() => col.id !== 'shariah' && handleSort(col.id)}
                >
                  {col.label} {sortBy === col.id ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.length === 0 ? (
              <tr><td colSpan={13} className="text-center text-bb-muted py-4">No securities match your criteria</td></tr>
            ) : (
              results.map(s => (
                <tr key={s.ticker}>
                  <td className="text-bb-amber font-bold">{s.ticker}</td>
                  <td>{s.name}</td>
                  <td className="text-bb-muted">{s.sector}</td>
                  <td className="text-right">{formatCurrency(s.price)}</td>
                  <td className={`text-right ${colorClass(s.changePct)}`}>{formatPercent(s.changePct)}</td>
                  <td className="text-right">{formatMcap(s.mcap)}</td>
                  <td className="text-right">{s.pe}</td>
                  <td className="text-right">{s.divYield}%</td>
                  <td className={`text-right ${colorClass(s.revGrowth)}`}>{formatPercent(s.revGrowth)}</td>
                  <td className="text-right">{s.roe}%</td>
                  <td className="text-right">{s.beta}</td>
                  <td className="text-right">{s.esgTotal}</td>
                  <td className="text-center">
                    {isShariah(s)
                      ? <span className="text-bb-green">PASS</span>
                      : <span className="text-bb-red">FAIL</span>
                    }
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
