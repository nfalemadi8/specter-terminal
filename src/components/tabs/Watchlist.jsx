import { useState, useMemo, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Panel from '../layout/Panel';
import { stocks, generatePriceHistory } from '../../data/stocks';
import { formatNumber, formatPercent, formatChange, formatCurrency, formatMcap, colorClass, round } from '../../utils/format';

const tt = { contentStyle: { background: '#1a1a1a', border: '1px solid #2a2a2a', fontSize: '10px', fontFamily: 'monospace' }, labelStyle: { color: '#ffbf00', fontSize: '10px' } };
const STORAGE_KEY = 'specter_watchlists';

function loadWatchlists() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (data && data.lists && data.lists.length > 0) return data;
    return defaultWatchlists();
  } catch { return defaultWatchlists(); }
}

function defaultWatchlists() {
  return {
    activeList: 'Main',
    lists: [
      { name: 'Main', tickers: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META', 'NFLX', 'JPM', 'V'], notes: {} },
      { name: 'Tech', tickers: ['AAPL', 'MSFT', 'GOOGL', 'NVDA', 'META', 'AVGO'], notes: {} },
      { name: 'GCC', tickers: ['2222.SR', 'EMAAR.AE'], notes: {} },
    ],
  };
}

function saveWatchlists(data) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

export default function Watchlist() {
  const [data, setData] = useState(loadWatchlists);
  const [selectedTicker, setSelectedTicker] = useState(null);
  const [addTicker, setAddTicker] = useState('');
  const [newListName, setNewListName] = useState('');
  const [editNote, setEditNote] = useState('');
  const [sortKey, setSortKey] = useState('ticker');
  const [sortDir, setSortDir] = useState(1);

  useEffect(() => { saveWatchlists(data); }, [data]);

  const activeList = data.lists.find(l => l.name === data.activeList) || data.lists[0];
  const watchlistData = useMemo(() => {
    return activeList.tickers.map(t => stocks.find(s => s.ticker === t)).filter(Boolean);
  }, [activeList.tickers]);

  const sorted = useMemo(() => {
    return [...watchlistData].sort((a, b) => {
      const aVal = a[sortKey], bVal = b[sortKey];
      if (typeof aVal === 'string') return aVal.localeCompare(bVal) * sortDir;
      return ((aVal || 0) - (bVal || 0)) * sortDir;
    });
  }, [watchlistData, sortKey, sortDir]);

  const selectedStock = useMemo(() => selectedTicker ? stocks.find(s => s.ticker === selectedTicker) : null, [selectedTicker]);
  const history = useMemo(() => selectedStock ? generatePriceHistory(selectedStock.price, 60) : [], [selectedStock?.ticker]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d * -1);
    else { setSortKey(key); setSortDir(1); }
  };

  const addToList = (ticker) => {
    if (!ticker || activeList.tickers.includes(ticker)) return;
    setData(prev => ({
      ...prev,
      lists: prev.lists.map(l => l.name === prev.activeList ? { ...l, tickers: [...l.tickers, ticker] } : l),
    }));
    setAddTicker('');
  };

  const removeFromList = (ticker) => {
    setData(prev => ({
      ...prev,
      lists: prev.lists.map(l => l.name === prev.activeList ? { ...l, tickers: l.tickers.filter(t => t !== ticker) } : l),
    }));
    if (selectedTicker === ticker) setSelectedTicker(null);
  };

  const createList = () => {
    if (!newListName.trim() || data.lists.some(l => l.name === newListName.trim())) return;
    setData(prev => ({
      ...prev,
      activeList: newListName.trim(),
      lists: [...prev.lists, { name: newListName.trim(), tickers: [], notes: {} }],
    }));
    setNewListName('');
  };

  const deleteList = (name) => {
    if (data.lists.length <= 1) return;
    setData(prev => ({
      activeList: prev.activeList === name ? prev.lists.find(l => l.name !== name).name : prev.activeList,
      lists: prev.lists.filter(l => l.name !== name),
    }));
  };

  const saveNote = (ticker, note) => {
    setData(prev => ({
      ...prev,
      lists: prev.lists.map(l => l.name === prev.activeList ? { ...l, notes: { ...l.notes, [ticker]: note } } : l),
    }));
  };

  // Stats
  const gainers = watchlistData.filter(s => s.changePct > 0).length;
  const losers = watchlistData.filter(s => s.changePct < 0).length;
  const avgChange = watchlistData.length > 0 ? watchlistData.reduce((s, v) => s + v.changePct, 0) / watchlistData.length : 0;
  const totalMcap = watchlistData.reduce((s, v) => s + (v.mcap || 0), 0);

  const sortIcon = (key) => sortKey === key ? (sortDir === 1 ? ' ▲' : ' ▼') : '';

  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      {/* Lists Sidebar */}
      <Panel title="Watchlists" className="col-span-2 row-span-6">
        <div className="space-y-1 text-[10px]">
          {data.lists.map(l => (
            <div key={l.name} className={`flex items-center justify-between px-1.5 py-1 border cursor-pointer ${
              l.name === data.activeList ? 'border-bb-amber text-bb-amber bg-bb-amber/10' : 'border-bb-border text-bb-muted hover:text-bb-white'
            }`} onClick={() => setData(prev => ({ ...prev, activeList: l.name }))}>
              <span className="font-bold truncate">{l.name}</span>
              <div className="flex items-center gap-1">
                <span className="text-[8px]">{l.tickers.length}</span>
                {data.lists.length > 1 && (
                  <button onClick={(e) => { e.stopPropagation(); deleteList(l.name); }} className="text-[8px] text-bb-red hover:text-bb-amber">×</button>
                )}
              </div>
            </div>
          ))}
          <div className="flex gap-0.5 mt-2">
            <input type="text" value={newListName} onChange={e => setNewListName(e.target.value)} placeholder="New list..."
              onKeyDown={e => e.key === 'Enter' && createList()}
              className="flex-1 bg-bb-dark border border-bb-border text-bb-white text-[9px] px-1 py-0.5 font-mono focus:border-bb-amber focus:outline-none" />
            <button onClick={createList} className="px-1.5 py-0.5 text-[9px] border border-bb-amber text-bb-amber hover:bg-bb-amber/10">+</button>
          </div>

          <div className="border-t border-bb-border pt-1.5 mt-2">
            <div className="text-[9px] text-bb-muted mb-0.5">ADD STOCK</div>
            <select value={addTicker} onChange={e => { addToList(e.target.value); }}
              className="w-full bg-bb-dark border border-bb-border text-bb-white text-[9px] px-1 py-0.5 font-mono focus:border-bb-amber focus:outline-none">
              <option value="">Select...</option>
              {stocks.filter(s => !activeList.tickers.includes(s.ticker)).map(s => (
                <option key={s.ticker} value={s.ticker}>{s.ticker}</option>
              ))}
            </select>
          </div>

          <div className="border-t border-bb-border pt-1.5 mt-2">
            <div className="text-[9px] text-bb-muted mb-1">SUMMARY</div>
            <table className="bb-table"><tbody>
              {[['Stocks', watchlistData.length], ['Gainers', gainers], ['Losers', losers], ['Avg Chg', formatPercent(avgChange)], ['Total MCap', formatMcap(totalMcap)]].map(([l, v]) => (
                <tr key={l}><td className="text-bb-muted">{l}</td><td className="text-right font-bold">{v}</td></tr>
              ))}
            </tbody></table>
          </div>
        </div>
      </Panel>

      {/* Main Watchlist Table */}
      <Panel title={`${activeList.name} (${watchlistData.length})`} className="col-span-7 row-span-4">
        <table className="bb-table">
          <thead>
            <tr>
              <th className="cursor-pointer" onClick={() => handleSort('ticker')}>Ticker{sortIcon('ticker')}</th>
              <th>Name</th>
              <th className="text-right cursor-pointer" onClick={() => handleSort('price')}>Price{sortIcon('price')}</th>
              <th className="text-right cursor-pointer" onClick={() => handleSort('change')}>Chg{sortIcon('change')}</th>
              <th className="text-right cursor-pointer" onClick={() => handleSort('changePct')}>Chg%{sortIcon('changePct')}</th>
              <th className="text-right cursor-pointer" onClick={() => handleSort('mcap')}>MCap{sortIcon('mcap')}</th>
              <th className="text-right">52w Hi</th>
              <th className="text-right">52w Lo</th>
              <th>Note</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(s => (
              <tr key={s.ticker} onClick={() => setSelectedTicker(s.ticker)}
                className={`cursor-pointer ${selectedTicker === s.ticker ? 'bg-bb-amber/10' : ''}`}>
                <td className="text-bb-amber font-bold">{s.ticker}</td>
                <td className="text-bb-muted truncate max-w-[100px]">{s.name}</td>
                <td className="text-right font-bold">{formatCurrency(s.price)}</td>
                <td className={`text-right ${colorClass(s.change)}`}>{formatChange(s.change)}</td>
                <td className={`text-right ${colorClass(s.changePct)}`}>{formatPercent(s.changePct)}</td>
                <td className="text-right text-bb-muted">{formatMcap(s.mcap)}</td>
                <td className="text-right text-bb-green text-[9px]">{formatCurrency(s.high52)}</td>
                <td className="text-right text-bb-red text-[9px]">{formatCurrency(s.low52)}</td>
                <td className="text-bb-muted text-[9px] truncate max-w-[60px]">{activeList.notes[s.ticker] || '—'}</td>
                <td>
                  <button onClick={(e) => { e.stopPropagation(); removeFromList(s.ticker); }} className="text-[8px] text-bb-red hover:text-bb-amber">×</button>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr><td colSpan={10} className="text-center text-bb-muted py-4">Empty watchlist — add stocks from sidebar</td></tr>
            )}
          </tbody>
        </table>
      </Panel>

      {/* Chart */}
      <Panel title={selectedStock ? `${selectedStock.ticker} — 60D` : 'Select a Stock'} className="col-span-3 row-span-4">
        {selectedStock ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
              <defs><linearGradient id="wlG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={selectedStock.changePct >= 0 ? '#00d26a' : '#ff3b3b'} stopOpacity={0.3} /><stop offset="95%" stopColor={selectedStock.changePct >= 0 ? '#00d26a' : '#ff3b3b'} stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="date" tick={{ fill: '#6a6a6a', fontSize: 8 }} tickFormatter={v => v.slice(5)} interval={12} />
              <YAxis domain={['dataMin', 'dataMax']} tick={{ fill: '#6a6a6a', fontSize: 8 }} width={50} />
              <Tooltip {...tt} formatter={v => '$' + round(v, 2)} />
              <Area type="monotone" dataKey="price" stroke={selectedStock.changePct >= 0 ? '#00d26a' : '#ff3b3b'} fill="url(#wlG)" strokeWidth={1.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-bb-muted text-[10px]">Click a stock to view chart</div>
        )}
      </Panel>

      {/* Detail + Notes */}
      <Panel title={selectedStock ? `${selectedStock.ticker} Details` : 'Details'} className="col-span-5 row-span-2">
        {selectedStock ? (
          <div className="grid grid-cols-2 gap-2 text-[10px] p-0.5">
            <table className="bb-table"><tbody>
              {[['Sector', selectedStock.sector], ['Industry', selectedStock.industry], ['P/E', formatNumber(selectedStock.pe)], ['P/B', formatNumber(selectedStock.pb)], ['EPS', formatCurrency(selectedStock.eps)], ['Div Yield', formatPercent(selectedStock.divYield)]].map(([l, v]) => (
                <tr key={l}><td className="text-bb-muted">{l}</td><td className="text-right font-bold">{v}</td></tr>
              ))}
            </tbody></table>
            <div>
              <div className="text-[9px] text-bb-muted mb-0.5">NOTE</div>
              <textarea value={editNote || activeList.notes[selectedStock.ticker] || ''} onChange={e => setEditNote(e.target.value)}
                className="w-full h-16 bg-bb-dark border border-bb-border text-bb-white text-[9px] px-1.5 py-1 font-mono focus:border-bb-amber focus:outline-none resize-none"
                placeholder="Add notes..." />
              <button onClick={() => { saveNote(selectedStock.ticker, editNote); setEditNote(''); }}
                className="w-full mt-0.5 py-0.5 text-[8px] border border-bb-amber text-bb-amber hover:bg-bb-amber/10">SAVE NOTE</button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-bb-muted text-[10px]">Select a stock to see details</div>
        )}
      </Panel>

      {/* Performance Heatmap */}
      <Panel title="Performance" className="col-span-7 row-span-2">
        <div className="flex flex-wrap gap-1 p-1">
          {watchlistData.map(s => (
            <div key={s.ticker} onClick={() => setSelectedTicker(s.ticker)}
              className={`border px-2 py-1.5 cursor-pointer ${
                s.changePct >= 2 ? 'border-bb-green bg-bb-green/20' :
                s.changePct >= 0 ? 'border-bb-green/50 bg-bb-green/5' :
                s.changePct >= -2 ? 'border-bb-red/50 bg-bb-red/5' :
                'border-bb-red bg-bb-red/20'
              }`}>
              <div className="text-[9px] font-bold text-bb-white">{s.ticker}</div>
              <div className={`text-[10px] font-bold ${colorClass(s.changePct)}`}>{formatPercent(s.changePct)}</div>
            </div>
          ))}
          {watchlistData.length === 0 && <div className="text-bb-muted text-[10px] p-2">No stocks in watchlist</div>}
        </div>
      </Panel>
    </div>
  );
}
