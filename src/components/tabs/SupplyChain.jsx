import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Panel from '../layout/Panel';
import { stocks } from '../../data/stocks';
import { formatCurrency, formatPercent, formatMcap, colorClass, round } from '../../utils/format';

const tt = { contentStyle: { background: '#1a1a1a', border: '1px solid #2a2a2a', fontSize: '10px', fontFamily: 'monospace' }, labelStyle: { color: '#ffbf00', fontSize: '10px' } };

function buildNetwork(stock, allStocks) {
  const supplierStocks = (stock.suppliers || []).map(name => {
    const match = allStocks.find(s => s.name.includes(name) || s.ticker === name);
    return { name, ticker: match?.ticker || null, price: match?.price, changePct: match?.changePct, mcap: match?.mcap, found: !!match };
  });
  const customerStocks = (stock.customers || []).map(name => {
    const match = allStocks.find(s => s.name.includes(name) || s.ticker === name);
    return { name, ticker: match?.ticker || null, price: match?.price, changePct: match?.changePct, mcap: match?.mcap, found: !!match };
  });

  // Risk: how concentrated is the supply chain?
  const supplierConcentration = supplierStocks.length > 0 ? 100 / supplierStocks.length : 0;
  const customerConcentration = customerStocks.length > 0 ? 100 / customerStocks.length : 0;
  const geoDiv = new Set([stock.country]).size; // simplified
  const riskScore = Math.min(100, supplierConcentration + customerConcentration + (geoDiv < 2 ? 20 : 0));

  return { suppliers: supplierStocks, customers: customerStocks, riskScore, supplierConcentration, customerConcentration };
}

export default function SupplyChain() {
  const [selectedTicker, setSelectedTicker] = useState('AAPL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStocks = useMemo(() => {
    if (!searchTerm) return stocks;
    const q = searchTerm.toUpperCase();
    return stocks.filter(s => s.ticker.includes(q) || s.name.toUpperCase().includes(q));
  }, [searchTerm]);

  const stock = useMemo(() => stocks.find(s => s.ticker === selectedTicker) || stocks[0], [selectedTicker]);
  const network = useMemo(() => buildNetwork(stock, stocks), [stock]);

  // Find reverse relationships: who lists this stock as supplier/customer?
  const suppliesTo = useMemo(() =>
    stocks.filter(s => s.ticker !== stock.ticker && (s.suppliers || []).some(sup =>
      stock.name.includes(sup) || stock.ticker === sup || sup.includes(stock.name.split(' ')[0])
    )), [stock]);

  const buyersFrom = useMemo(() =>
    stocks.filter(s => s.ticker !== stock.ticker && (s.customers || []).some(cust =>
      stock.name.includes(cust) || stock.ticker === cust || cust.includes(stock.name.split(' ')[0])
    )), [stock]);

  // Sector exposure of supply chain
  const sectorExposure = useMemo(() => {
    const sectors = {};
    [...(stock.suppliers || []), ...(stock.customers || [])].forEach(name => {
      const match = stocks.find(s => s.name.includes(name) || s.ticker === name);
      if (match) sectors[match.sector] = (sectors[match.sector] || 0) + 1;
    });
    return Object.entries(sectors).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  }, [stock]);

  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      {/* Stock Selector */}
      <Panel title="Select Company" className="col-span-2 row-span-6">
        <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search..."
          className="w-full bg-bb-dark border border-bb-border text-bb-white text-[10px] px-2 py-1 mb-1 font-mono focus:border-bb-amber focus:outline-none" />
        <div className="overflow-auto" style={{ maxHeight: 'calc(100% - 28px)' }}>
          <table className="bb-table">
            <thead><tr><th>Ticker</th><th className="text-right">Chg%</th></tr></thead>
            <tbody>
              {filteredStocks.map(s => (
                <tr key={s.ticker} onClick={() => setSelectedTicker(s.ticker)} className={`cursor-pointer ${s.ticker === selectedTicker ? 'bg-bb-amber/10' : ''}`}>
                  <td className={s.ticker === selectedTicker ? 'text-bb-amber font-bold' : 'text-bb-muted'}>{s.ticker}</td>
                  <td className={`text-right ${colorClass(s.changePct)}`}>{formatPercent(s.changePct)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Company Header */}
      <Panel title={`${stock.ticker} — ${stock.name} Supply Chain`} className="col-span-7 row-span-1">
        <div className="flex gap-6 text-[10px] p-0.5">
          <span><span className="text-bb-muted">Sector: </span>{stock.sector}</span>
          <span><span className="text-bb-muted">Industry: </span>{stock.industry}</span>
          <span><span className="text-bb-muted">Country: </span>{stock.country}</span>
          <span><span className="text-bb-muted">MCap: </span>{formatMcap(stock.mcap)}</span>
        </div>
      </Panel>

      {/* Risk Score */}
      <Panel title="Supply Chain Risk" className="col-span-3 row-span-1">
        <div className="flex items-center justify-between text-[10px] p-0.5">
          <span className="text-bb-muted">Risk Score</span>
          <span className={`font-bold text-lg ${network.riskScore > 60 ? 'text-bb-red' : network.riskScore > 40 ? 'text-bb-yellow' : 'text-bb-green'}`}>
            {round(network.riskScore, 0)}/100
          </span>
        </div>
      </Panel>

      {/* Visual Network */}
      <Panel title="Supply Chain Network" className="col-span-7 row-span-3">
        <div className="flex items-center justify-center h-full gap-4">
          {/* Suppliers */}
          <div className="flex flex-col gap-1 items-end">
            <div className="text-[9px] text-bb-muted mb-1">SUPPLIERS</div>
            {network.suppliers.map(s => (
              <div key={s.name} className={`border px-2 py-1 text-[9px] ${s.found ? 'border-bb-blue text-bb-blue' : 'border-bb-border text-bb-muted'}`}>
                <div className="font-bold">{s.ticker || s.name}</div>
                {s.found && <div className="text-[8px]">{formatCurrency(s.price)}</div>}
              </div>
            ))}
          </div>

          {/* Arrows left */}
          <div className="flex flex-col gap-1 text-bb-muted">
            {network.suppliers.map((_, i) => <div key={i} className="text-[10px]">→</div>)}
          </div>

          {/* Center: selected company */}
          <div className="border-2 border-bb-amber px-4 py-3 text-center bg-bb-amber/5">
            <div className="text-bb-amber font-bold text-lg">{stock.ticker}</div>
            <div className="text-[9px] text-bb-muted">{stock.name}</div>
            <div className={`text-[10px] font-bold ${colorClass(stock.changePct)}`}>{formatCurrency(stock.price)}</div>
          </div>

          {/* Arrows right */}
          <div className="flex flex-col gap-1 text-bb-muted">
            {network.customers.map((_, i) => <div key={i} className="text-[10px]">→</div>)}
          </div>

          {/* Customers */}
          <div className="flex flex-col gap-1">
            <div className="text-[9px] text-bb-muted mb-1">CUSTOMERS</div>
            {network.customers.map(c => (
              <div key={c.name} className={`border px-2 py-1 text-[9px] ${c.found ? 'border-bb-green text-bb-green' : 'border-bb-border text-bb-muted'}`}>
                <div className="font-bold">{c.ticker || c.name}</div>
                {c.found && <div className="text-[8px]">{formatCurrency(c.price)}</div>}
              </div>
            ))}
          </div>
        </div>
      </Panel>

      {/* Risk Metrics */}
      <Panel title="Risk Breakdown" className="col-span-3 row-span-3">
        <div className="space-y-2 text-[10px] p-0.5">
          <table className="bb-table"><tbody>
            {[
              ['Suppliers', network.suppliers.length],
              ['Customers', network.customers.length],
              ['Supplier Conc.', round(network.supplierConcentration, 0) + '%'],
              ['Customer Conc.', round(network.customerConcentration, 0) + '%'],
              ['Supplies To (rev)', suppliesTo.length + ' companies'],
              ['Buys From (rev)', buyersFrom.length + ' companies'],
            ].map(([l, v]) => (
              <tr key={l}><td className="text-bb-muted">{l}</td><td className="text-right font-bold">{v}</td></tr>
            ))}
          </tbody></table>

          {sectorExposure.length > 0 && (
            <div className="border-t border-bb-border pt-1">
              <div className="text-[9px] text-bb-muted mb-1">SECTOR EXPOSURE</div>
              {sectorExposure.map(s => (
                <div key={s.name} className="flex justify-between text-[9px]">
                  <span className="text-bb-muted">{s.name}</span>
                  <span>{s.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Panel>

      {/* Supplier Details */}
      <Panel title="Supplier Details" className="col-span-5 row-span-2">
        <table className="bb-table">
          <thead><tr><th>Name</th><th>Ticker</th><th className="text-right">Price</th><th className="text-right">Chg%</th><th className="text-right">MCap</th></tr></thead>
          <tbody>
            {network.suppliers.map(s => (
              <tr key={s.name}>
                <td className="text-bb-blue">{s.name}</td>
                <td className="text-bb-amber">{s.ticker || '—'}</td>
                <td className="text-right">{s.price ? formatCurrency(s.price) : '—'}</td>
                <td className={`text-right ${s.changePct != null ? colorClass(s.changePct) : ''}`}>{s.changePct != null ? formatPercent(s.changePct) : '—'}</td>
                <td className="text-right text-bb-muted">{s.mcap ? formatMcap(s.mcap) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      {/* Customer Details */}
      <Panel title="Customer Details" className="col-span-5 row-span-2">
        <table className="bb-table">
          <thead><tr><th>Name</th><th>Ticker</th><th className="text-right">Price</th><th className="text-right">Chg%</th><th className="text-right">MCap</th></tr></thead>
          <tbody>
            {network.customers.map(c => (
              <tr key={c.name}>
                <td className="text-bb-green">{c.name}</td>
                <td className="text-bb-amber">{c.ticker || '—'}</td>
                <td className="text-right">{c.price ? formatCurrency(c.price) : '—'}</td>
                <td className={`text-right ${c.changePct != null ? colorClass(c.changePct) : ''}`}>{c.changePct != null ? formatPercent(c.changePct) : '—'}</td>
                <td className="text-right text-bb-muted">{c.mcap ? formatMcap(c.mcap) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
