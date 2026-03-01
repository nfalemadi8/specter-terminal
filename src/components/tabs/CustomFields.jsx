import { useState, useMemo, useEffect , memo } from 'react';
import Panel from '../layout/Panel';
import { stocks } from '../../data/stocks';
import { formatNumber, formatCurrency, formatPercent, colorClass, round } from '../../utils/format';

const STORAGE_KEY = 'specter_custom_fields';

const PRESETS = [
  { name: 'PEG Ratio', formula: 'pe / revGrowth', description: 'Price/Earnings to Growth ratio' },
  { name: 'EV/Revenue', formula: '(mcap + (debtEquity * mcap / (1 + debtEquity))) / (mcap / ps)', description: 'Enterprise Value to Revenue' },
  { name: 'Piotroski Score', formula: '(margin > 0 ? 1 : 0) + (roe > 0 ? 1 : 0) + (revGrowth > 0 ? 1 : 0) + (margin > 10 ? 1 : 0) + (debtEquity < 0.5 ? 1 : 0)', description: 'Simplified Piotroski F-Score' },
  { name: 'Altman Z-Score', formula: '1.2 * (margin/100) + 1.4 * (roe/100) + 3.3 * (eps/price) + 0.6 * (1/debtEquity) + 1.0 * (revGrowth/100 + 1)', description: 'Simplified Altman Z bankruptcy predictor' },
  { name: 'Shariah Score', formula: '(debtToAssets < 0.30 ? 33 : 0) + (debtEquity < 0.33 ? 33 : 0) + (haramRevenue < 5 ? 34 : 0)', description: 'AAOIFI compliance score (0-100)' },
  { name: 'Value Composite', formula: '(1/pe) * 100 + (1/pb) * 10 + divYield + (eps/price) * 100', description: 'Multi-factor value score' },
  { name: 'Quality Score', formula: 'roe * 0.3 + margin * 0.3 + (revGrowth > 0 ? revGrowth * 0.2 : 0) + (1 - debtEquity) * 20', description: 'Composite quality metric' },
  { name: 'Risk-Adj Return', formula: 'changePct / beta', description: 'Change % adjusted for beta risk' },
];

const AVAILABLE_FIELDS = ['price', 'change', 'changePct', 'pe', 'pb', 'ps', 'evEbitda', 'roe', 'debtEquity', 'debtToAssets', 'haramRevenue', 'divYield', 'revGrowth', 'margin', 'mcap', 'eps', 'beta', 'esgTotal', 'esgE', 'esgS', 'esgG', 'high52', 'low52'];

function loadFields() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
}
function saveFields(fields) { localStorage.setItem(STORAGE_KEY, JSON.stringify(fields)); }

function safeEval(formula, stock) {
  try {
    const vars = {};
    AVAILABLE_FIELDS.forEach(f => { vars[f] = typeof stock[f] === 'number' ? stock[f] : parseFloat(String(stock[f]).replace(/[^0-9.-]/g, '')) || 0; });
    const fn = new Function(...Object.keys(vars), `"use strict"; return (${formula});`);
    const result = fn(...Object.values(vars));
    if (!isFinite(result)) return null;
    return result;
  } catch {
    return null;
  }
}

function CustomFields() {
  const [fields, setFields] = useState(loadFields);
  const [newName, setNewName] = useState('');
  const [newFormula, setNewFormula] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [editId, setEditId] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState(-1);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => { saveFields(fields); }, [fields]);

  const addField = () => {
    if (!newName.trim() || !newFormula.trim()) return;
    if (editId !== null) {
      setFields(prev => prev.map((f, i) => i === editId ? { name: newName, formula: newFormula, description: newDesc } : f));
      setEditId(null);
    } else {
      setFields(prev => [...prev, { name: newName, formula: newFormula, description: newDesc }]);
    }
    setNewName(''); setNewFormula(''); setNewDesc('');
  };

  const deleteField = (idx) => setFields(prev => prev.filter((_, i) => i !== idx));
  const editField = (idx) => { const f = fields[idx]; setEditId(idx); setNewName(f.name); setNewFormula(f.formula); setNewDesc(f.description || ''); };
  const loadPreset = (p) => { setNewName(p.name); setNewFormula(p.formula); setNewDesc(p.description); };

  const testFormula = () => {
    if (!newFormula.trim()) return;
    const result = safeEval(newFormula, stocks[0]);
    setTestResult(result !== null ? `${stocks[0].ticker}: ${round(result, 4)}` : 'ERROR — check formula');
  };

  // Computed table
  const tableData = useMemo(() => {
    let data = stocks.map(s => {
      const computed = {};
      fields.forEach((f, i) => { computed[`f${i}`] = safeEval(f.formula, s); });
      return { ...s, computed };
    });
    if (sortField !== null) {
      data.sort((a, b) => {
        const aVal = a.computed[`f${sortField}`] || 0;
        const bVal = b.computed[`f${sortField}`] || 0;
        return (aVal - bVal) * sortDir;
      });
    }
    return data;
  }, [fields, sortField, sortDir]);

  const handleSort = (idx) => {
    if (sortField === idx) setSortDir(d => d * -1);
    else { setSortField(idx); setSortDir(-1); }
  };

  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      {/* Field Builder */}
      <Panel title="Custom Field Builder" className="col-span-4 row-span-3">
        <div className="space-y-1.5 text-[10px] p-0.5">
          <div>
            <div className="text-[9px] text-bb-muted mb-0.5">FIELD NAME</div>
            <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="My Ratio"
              className="w-full bg-bb-dark border border-bb-border text-bb-white text-[10px] px-1.5 py-0.5 font-mono focus:border-bb-amber focus:outline-none" />
          </div>
          <div>
            <div className="text-[9px] text-bb-muted mb-0.5">FORMULA</div>
            <textarea value={newFormula} onChange={e => setNewFormula(e.target.value)} placeholder="pe / revGrowth"
              className="w-full h-14 bg-bb-dark border border-bb-border text-bb-amber text-[10px] px-1.5 py-0.5 font-mono focus:border-bb-amber focus:outline-none resize-none" />
          </div>
          <div>
            <div className="text-[9px] text-bb-muted mb-0.5">DESCRIPTION</div>
            <input type="text" value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="What this calculates..."
              className="w-full bg-bb-dark border border-bb-border text-bb-white text-[10px] px-1.5 py-0.5 font-mono focus:border-bb-amber focus:outline-none" />
          </div>
          <div className="flex gap-1">
            <button onClick={testFormula} className="flex-1 py-0.5 text-[9px] border border-bb-cyan text-bb-cyan hover:bg-bb-cyan/10">TEST</button>
            <button onClick={addField} className="flex-1 py-0.5 text-[9px] font-bold border border-bb-amber text-bb-amber hover:bg-bb-amber/10">
              {editId !== null ? 'UPDATE' : 'ADD FIELD'}
            </button>
          </div>
          {testResult && (
            <div className={`text-[9px] p-1 border ${testResult.includes('ERROR') ? 'border-bb-red text-bb-red' : 'border-bb-green text-bb-green'}`}>{testResult}</div>
          )}
        </div>
      </Panel>

      {/* Presets */}
      <Panel title="Preset Formulas" className="col-span-4 row-span-3">
        <div className="space-y-0.5">
          {PRESETS.map(p => (
            <div key={p.name} onClick={() => loadPreset(p)}
              className="border border-bb-border p-1.5 cursor-pointer hover:border-bb-amber transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-bb-white">{p.name}</span>
                <button className="text-[8px] text-bb-amber">LOAD</button>
              </div>
              <div className="text-[8px] text-bb-amber font-mono mt-0.5">{p.formula}</div>
              <div className="text-[8px] text-bb-muted mt-0.5">{p.description}</div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Available Variables */}
      <Panel title="Available Variables" className="col-span-4 row-span-3">
        <div className="space-y-1 text-[10px] p-0.5">
          <div className="text-[9px] text-bb-muted mb-1">Use these in formulas. Standard JS math operators (+, -, *, /, %, ternary) are supported.</div>
          <div className="flex flex-wrap gap-1">
            {AVAILABLE_FIELDS.map(f => (
              <span key={f} className="text-[8px] px-1.5 py-0.5 bg-bb-dark border border-bb-border text-bb-cyan font-mono">{f}</span>
            ))}
          </div>
          <div className="border-t border-bb-border pt-1.5 mt-2">
            <div className="text-[9px] text-bb-muted mb-1">ACTIVE FIELDS ({fields.length})</div>
            {fields.map((f, i) => (
              <div key={i} className="flex items-center justify-between border border-bb-border px-1.5 py-0.5 mb-0.5">
                <span className="font-bold text-bb-amber text-[9px]">{f.name}</span>
                <div className="flex gap-1">
                  <button onClick={() => editField(i)} className="text-[8px] text-bb-blue hover:text-bb-cyan">EDT</button>
                  <button onClick={() => deleteField(i)} className="text-[8px] text-bb-red hover:text-bb-amber">DEL</button>
                </div>
              </div>
            ))}
            {fields.length === 0 && <div className="text-[9px] text-bb-muted">No custom fields — add one above or load a preset</div>}
          </div>
        </div>
      </Panel>

      {/* Results Table */}
      <Panel title={`Custom Screener (${fields.length} fields × ${stocks.length} stocks)`} className="col-span-12 row-span-3">
        <table className="bb-table">
          <thead>
            <tr>
              <th>Ticker</th>
              <th>Name</th>
              <th className="text-right">Price</th>
              <th className="text-right">Chg%</th>
              {fields.map((f, i) => (
                <th key={i} className="text-right cursor-pointer" onClick={() => handleSort(i)}>
                  {f.name}{sortField === i ? (sortDir === 1 ? ' ▲' : ' ▼') : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map(s => (
              <tr key={s.ticker}>
                <td className="text-bb-amber font-bold">{s.ticker}</td>
                <td className="text-bb-muted truncate max-w-[120px]">{s.name}</td>
                <td className="text-right">{formatCurrency(s.price)}</td>
                <td className={`text-right ${colorClass(s.changePct)}`}>{formatPercent(s.changePct)}</td>
                {fields.map((f, i) => {
                  const val = s.computed[`f${i}`];
                  return (
                    <td key={i} className="text-right font-bold">
                      {val !== null ? formatNumber(val, 2) : <span className="text-bb-red">ERR</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {fields.length === 0 && (
          <div className="text-center text-bb-muted text-[10px] py-8">Add custom fields to see computed values for all stocks</div>
        )}
      </Panel>
    </div>
  );
}

export default memo(CustomFields);
