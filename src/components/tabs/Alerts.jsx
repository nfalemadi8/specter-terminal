import { useState, useMemo, useEffect } from 'react';
import Panel from '../layout/Panel';
import { stocks } from '../../data/stocks';
import { formatNumber, formatPercent, formatCurrency, colorClass, currentTime, round } from '../../utils/format';

const ALERT_TYPES = ['Price Above', 'Price Below', 'Pct Change Above', 'Pct Change Below', 'Volume Above'];
const STORAGE_KEY = 'specter_alerts';
const HISTORY_KEY = 'specter_alert_history';

function loadAlerts() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
}
function saveAlerts(alerts) { localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts)); }
function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; } catch { return []; }
}
function saveHistory(history) { localStorage.setItem(HISTORY_KEY, JSON.stringify(history)); }

// Check if alert is triggered
function checkAlert(alert, stock) {
  if (!stock) return false;
  switch (alert.type) {
    case 'Price Above': return stock.price >= alert.target;
    case 'Price Below': return stock.price <= alert.target;
    case 'Pct Change Above': return Math.abs(stock.changePct) >= alert.target;
    case 'Pct Change Below': return Math.abs(stock.changePct) <= alert.target;
    case 'Volume Above': {
      const vol = parseFloat(String(stock.volume).replace(/[^0-9.]/g, ''));
      return vol >= alert.target;
    }
    default: return false;
  }
}

function getTargetLabel(type) {
  if (type.includes('Pct')) return '%';
  if (type.includes('Volume')) return 'M shares';
  return '$';
}

export default function Alerts() {
  const [alerts, setAlerts] = useState(loadAlerts);
  const [history, setHistory] = useState(loadHistory);
  const [newTicker, setNewTicker] = useState('AAPL');
  const [newType, setNewType] = useState(ALERT_TYPES[0]);
  const [newTarget, setNewTarget] = useState('');
  const [newNote, setNewNote] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, triggered
  const [editId, setEditId] = useState(null);

  useEffect(() => { saveAlerts(alerts); }, [alerts]);
  useEffect(() => { saveHistory(history); }, [history]);

  // Check alerts against current prices
  const alertsWithStatus = useMemo(() => {
    return alerts.map(a => {
      const stock = stocks.find(s => s.ticker === a.ticker);
      const triggered = checkAlert(a, stock);
      return { ...a, stock, triggered, currentPrice: stock?.price };
    });
  }, [alerts]);

  // Auto-fire triggered alerts
  useEffect(() => {
    const newHistory = [];
    const updatedAlerts = alerts.map(a => {
      if (a.status === 'fired') return a;
      const stock = stocks.find(s => s.ticker === a.ticker);
      if (checkAlert(a, stock)) {
        newHistory.push({
          id: Date.now() + Math.random(),
          time: currentTime(),
          ticker: a.ticker,
          type: a.type,
          target: a.target,
          triggeredAt: stock?.price || 0,
          note: a.note,
          firedAt: new Date().toISOString(),
        });
        return { ...a, status: 'fired' };
      }
      return a;
    });
    if (newHistory.length > 0) {
      setAlerts(updatedAlerts);
      setHistory(prev => [...newHistory, ...prev].slice(0, 100));
    }
  }, []); // Run once on mount

  const addAlert = () => {
    const target = parseFloat(newTarget);
    if (!newTicker || isNaN(target)) return;
    if (editId) {
      setAlerts(prev => prev.map(a => a.id === editId ? { ...a, ticker: newTicker, type: newType, target, note: newNote } : a));
      setEditId(null);
    } else {
      setAlerts(prev => [...prev, { id: Date.now(), ticker: newTicker, type: newType, target, note: newNote, status: 'active', createdAt: new Date().toISOString() }]);
    }
    setNewTarget(''); setNewNote('');
  };

  const deleteAlert = (id) => setAlerts(prev => prev.filter(a => a.id !== id));
  const resetAlert = (id) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'active' } : a));
  const editAlert = (a) => { setEditId(a.id); setNewTicker(a.ticker); setNewType(a.type); setNewTarget(String(a.target)); setNewNote(a.note || ''); };
  const clearHistory = () => { setHistory([]); };

  const filtered = useMemo(() => {
    if (filter === 'active') return alertsWithStatus.filter(a => a.status === 'active');
    if (filter === 'triggered') return alertsWithStatus.filter(a => a.triggered || a.status === 'fired');
    return alertsWithStatus;
  }, [alertsWithStatus, filter]);

  const activeCount = alerts.filter(a => a.status === 'active').length;
  const firedCount = alerts.filter(a => a.status === 'fired').length;

  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      {/* Create Alert */}
      <Panel title={editId ? 'Edit Alert' : 'Create Alert'} className="col-span-3 row-span-3">
        <div className="space-y-1.5 text-[10px] p-0.5">
          <div>
            <div className="text-[9px] text-bb-muted mb-0.5">TICKER</div>
            <select value={newTicker} onChange={e => setNewTicker(e.target.value)}
              className="w-full bg-bb-dark border border-bb-border text-bb-white text-[10px] px-1.5 py-0.5 font-mono focus:border-bb-amber focus:outline-none">
              {stocks.map(s => <option key={s.ticker} value={s.ticker}>{s.ticker} — {s.name}</option>)}
            </select>
          </div>
          <div>
            <div className="text-[9px] text-bb-muted mb-0.5">CONDITION</div>
            <select value={newType} onChange={e => setNewType(e.target.value)}
              className="w-full bg-bb-dark border border-bb-border text-bb-white text-[10px] px-1.5 py-0.5 font-mono focus:border-bb-amber focus:outline-none">
              {ALERT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <div className="text-[9px] text-bb-muted mb-0.5">TARGET ({getTargetLabel(newType)})</div>
            <input type="number" value={newTarget} onChange={e => setNewTarget(e.target.value)} placeholder="0.00"
              className="w-full bg-bb-dark border border-bb-border text-bb-white text-[10px] px-1.5 py-0.5 font-mono focus:border-bb-amber focus:outline-none" />
          </div>
          <div>
            <div className="text-[9px] text-bb-muted mb-0.5">NOTE (optional)</div>
            <input type="text" value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Reason..."
              className="w-full bg-bb-dark border border-bb-border text-bb-white text-[10px] px-1.5 py-0.5 font-mono focus:border-bb-amber focus:outline-none" />
          </div>
          <div className="flex gap-1 pt-1">
            <button onClick={addAlert} className="flex-1 py-1 text-[9px] font-bold border border-bb-amber text-bb-amber hover:bg-bb-amber/10">
              {editId ? 'UPDATE' : 'CREATE ALERT'}
            </button>
            {editId && (
              <button onClick={() => { setEditId(null); setNewTarget(''); setNewNote(''); }}
                className="px-2 py-1 text-[9px] border border-bb-border text-bb-muted hover:text-bb-white">CANCEL</button>
            )}
          </div>
        </div>
      </Panel>

      {/* Summary */}
      <Panel title="Alert Summary" className="col-span-3 row-span-3">
        <div className="space-y-2 text-[10px] p-0.5">
          <div className="grid grid-cols-3 gap-1.5">
            <div className="border border-bb-border p-2 text-center">
              <div className="text-xl font-bold text-bb-amber">{alerts.length}</div>
              <div className="text-[8px] text-bb-muted">TOTAL</div>
            </div>
            <div className="border border-bb-border p-2 text-center">
              <div className="text-xl font-bold text-bb-green">{activeCount}</div>
              <div className="text-[8px] text-bb-muted">ACTIVE</div>
            </div>
            <div className="border border-bb-border p-2 text-center">
              <div className="text-xl font-bold text-bb-red">{firedCount}</div>
              <div className="text-[8px] text-bb-muted">FIRED</div>
            </div>
          </div>

          <div className="border-t border-bb-border pt-1.5">
            <div className="text-[9px] text-bb-muted mb-1">FILTER</div>
            <div className="flex gap-1">
              {['all', 'active', 'triggered'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`flex-1 py-0.5 text-[9px] border capitalize ${filter === f ? 'border-bb-amber text-bb-amber bg-bb-amber/10' : 'border-bb-border text-bb-muted hover:text-bb-white'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-bb-border pt-1.5">
            <div className="text-[9px] text-bb-muted mb-1">BY TYPE</div>
            {ALERT_TYPES.map(t => {
              const count = alerts.filter(a => a.type === t).length;
              return count > 0 ? (
                <div key={t} className="flex justify-between text-[9px] py-0.5">
                  <span className="text-bb-muted">{t}</span>
                  <span className="font-bold">{count}</span>
                </div>
              ) : null;
            })}
          </div>

          <div className="border-t border-bb-border pt-1.5">
            <div className="text-[9px] text-bb-muted mb-1">QUICK ALERTS</div>
            {stocks.slice(0, 3).map(s => (
              <div key={s.ticker} className="flex gap-1 mb-0.5">
                <button onClick={() => { setNewTicker(s.ticker); setNewType('Price Above'); setNewTarget(String(round(s.price * 1.05, 2))); }}
                  className="flex-1 text-[8px] py-0.5 border border-bb-border text-bb-muted hover:text-bb-green hover:border-bb-green">
                  {s.ticker} &gt; {formatCurrency(s.price * 1.05)}
                </button>
                <button onClick={() => { setNewTicker(s.ticker); setNewType('Price Below'); setNewTarget(String(round(s.price * 0.95, 2))); }}
                  className="flex-1 text-[8px] py-0.5 border border-bb-border text-bb-muted hover:text-bb-red hover:border-bb-red">
                  {s.ticker} &lt; {formatCurrency(s.price * 0.95)}
                </button>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      {/* Active Alerts */}
      <Panel title={`Alerts (${filtered.length})`} className="col-span-6 row-span-3">
        <table className="bb-table">
          <thead>
            <tr><th>Ticker</th><th>Condition</th><th className="text-right">Target</th><th className="text-right">Current</th><th className="text-right">Distance</th><th>Status</th><th>Note</th><th></th></tr>
          </thead>
          <tbody>
            {filtered.map(a => {
              const dist = a.currentPrice ? ((a.target - a.currentPrice) / a.currentPrice * 100) : 0;
              return (
                <tr key={a.id}>
                  <td className="text-bb-amber font-bold">{a.ticker}</td>
                  <td className="text-[9px]">{a.type}</td>
                  <td className="text-right">{a.type.includes('Pct') ? formatPercent(a.target) : a.type.includes('Volume') ? a.target + 'M' : formatCurrency(a.target)}</td>
                  <td className="text-right">{a.currentPrice ? formatCurrency(a.currentPrice) : '—'}</td>
                  <td className={`text-right ${colorClass(dist)}`}>{a.currentPrice ? formatPercent(dist) : '—'}</td>
                  <td>
                    <span className={`text-[8px] px-1 py-[1px] rounded ${
                      a.status === 'fired' ? 'bg-bb-red/20 text-bb-red' :
                      a.triggered ? 'bg-bb-amber/20 text-bb-amber blink' :
                      'bg-bb-blue/20 text-bb-blue'
                    }`}>{a.status === 'fired' ? 'FIRED' : a.triggered ? 'TRIGGER' : 'ACTIVE'}</span>
                  </td>
                  <td className="text-bb-muted text-[9px] truncate max-w-[80px]">{a.note || '—'}</td>
                  <td className="text-right">
                    <div className="flex gap-0.5 justify-end">
                      <button onClick={() => editAlert(a)} className="text-[8px] text-bb-blue hover:text-bb-cyan">EDT</button>
                      {a.status === 'fired' && <button onClick={() => resetAlert(a.id)} className="text-[8px] text-bb-green hover:text-bb-cyan">RST</button>}
                      <button onClick={() => deleteAlert(a.id)} className="text-[8px] text-bb-red hover:text-bb-amber">DEL</button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="text-center text-bb-muted py-4">No alerts — create one to get started</td></tr>
            )}
          </tbody>
        </table>
      </Panel>

      {/* Alert History */}
      <Panel title={`Alert History (${history.length})`} className="col-span-12 row-span-3">
        <div className="flex justify-between items-center mb-1 px-0.5">
          <span className="text-[9px] text-bb-muted">Recent triggered alerts</span>
          {history.length > 0 && (
            <button onClick={clearHistory} className="text-[8px] text-bb-muted hover:text-bb-red border border-bb-border px-1.5 py-0.5">CLEAR</button>
          )}
        </div>
        <table className="bb-table">
          <thead>
            <tr><th>Time</th><th>Ticker</th><th>Type</th><th className="text-right">Target</th><th className="text-right">Triggered At</th><th>Note</th><th>Date</th></tr>
          </thead>
          <tbody>
            {history.slice(0, 20).map(h => (
              <tr key={h.id}>
                <td className="text-bb-muted">{h.time}</td>
                <td className="text-bb-amber font-bold">{h.ticker}</td>
                <td>{h.type}</td>
                <td className="text-right text-bb-cyan">{h.type?.includes('Pct') ? formatPercent(h.target) : formatCurrency(h.target)}</td>
                <td className="text-right font-bold">{formatCurrency(h.triggeredAt)}</td>
                <td className="text-bb-muted text-[9px]">{h.note || '—'}</td>
                <td className="text-bb-muted text-[9px]">{h.firedAt ? new Date(h.firedAt).toLocaleDateString() : '—'}</td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr><td colSpan={7} className="text-center text-bb-muted py-4">No alert history yet</td></tr>
            )}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
