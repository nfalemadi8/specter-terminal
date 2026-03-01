import { memo } from 'react';
import Panel from '../layout/Panel';
import { tabs } from '../../data/tabs';

const shortcuts = [
  { key: 'F1', action: 'Dashboard' },
  { key: 'F2', action: 'Equities' },
  { key: 'F3', action: 'Fixed Income' },
  { key: 'F4', action: 'Commodities' },
  { key: 'F5', action: 'Forex' },
  { key: 'F6', action: 'Crypto' },
  { key: 'F7', action: 'Indices' },
  { key: 'F8', action: 'Options' },
  { key: 'F9', action: 'Futures' },
  { key: 'F10', action: 'ETFs' },
  { key: 'Ctrl+K', action: 'Open Spotlight Search' },
  { key: 'Esc', action: 'Close overlays / spotlight' },
  { key: 'Enter', action: 'Execute command in CMD bar' },
  { key: '↑ / ↓', action: 'Navigate spotlight results' },
];

const systemInfo = [
  { label: 'Version', value: 'SPECTER Terminal v3.0' },
  { label: 'Build', value: '2026.03.01' },
  { label: 'Modules', value: `${tabs.length} tabs` },
  { label: 'Data Feed', value: 'Simulated (Demo Mode)' },
  { label: 'Theme', value: 'Bloomberg Dark' },
  { label: 'Font', value: 'Consolas / SF Mono / Fira Code' },
  { label: 'Framework', value: 'React 19 + Vite 7' },
  { label: 'Charts', value: 'Recharts' },
  { label: 'Styling', value: 'Tailwind CSS v4' },
  { label: 'Persistence', value: 'localStorage (Alerts, Watchlists, Custom Fields)' },
];

const features = [
  'Market Data: Equities, Fixed Income, Commodities, Forex, Crypto, Indices, Options, Futures, ETFs',
  'Analysis: Technicals, Fundamentals/Analysis, Screener, Search (EQS), Peer Comparison, Heat Map, Sectors',
  'Portfolio: Holdings, Watchlist, Portfolio Generator (OPT), Stress Test, Backtest Engine, Alerts',
  'Specialized: FX Monitor, Econ Calendar, Yield Curve, Supply Chain, ESG, M&A Tracker, IPOs',
  'Advanced: Billionaires Database, AI Insights, Custom Fields Calculator, Reference Guide',
  'Islamic Finance: AAOIFI Shariah Screening, Sukuk, Halal Portfolio Filters, GCC Markets',
  'Command Bar: Ctrl+K spotlight search with fuzzy matching across tabs, stocks, and commands',
  'Keyboard Shortcuts: F1-F10 tab switching, Esc for overlays, full keyboard navigation',
  'Persistence: Alerts, Watchlists, and Custom Fields saved to localStorage',
];

function Settings() {
  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      <Panel title="System Information" className="col-span-5 row-span-3">
        <table className="bb-table">
          <tbody>
            {systemInfo.map(s => (
              <tr key={s.label}>
                <td className="text-bb-muted">{s.label}</td>
                <td className="text-bb-amber">{s.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel title="Keyboard Shortcuts" className="col-span-4 row-span-3">
        <table className="bb-table">
          <thead>
            <tr><th>Key</th><th>Action</th></tr>
          </thead>
          <tbody>
            {shortcuts.map(s => (
              <tr key={s.key}>
                <td><span className="px-1 py-[1px] bg-bb-dark border border-bb-border rounded text-bb-amber text-[10px]">{s.key}</span></td>
                <td>{s.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel title={`All Modules (${tabs.length})`} className="col-span-3 row-span-3">
        <div className="space-y-0.5">
          {tabs.map(t => (
            <div key={t.id} className="flex items-center justify-between text-[9px] border border-bb-border px-1.5 py-0.5">
              <span className="text-bb-muted">{t.label}</span>
              {t.shortcut && <span className="text-[8px] text-bb-amber">{t.shortcut}</span>}
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="About" className="col-span-5 row-span-3">
        <div className="p-4 text-center space-y-2">
          <div className="text-bb-amber text-2xl font-bold tracking-widest">SPECTER TERMINAL</div>
          <div className="text-bb-muted text-xs">Personal Bloomberg Terminal-Style Financial Dashboard</div>
          <div className="text-bb-muted text-xs">Version 3.0 — Demo Mode</div>
          <div className="text-bb-border mt-4">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
          <div className="text-bb-muted text-[10px] mt-2">
            {tabs.length} modules | Real-time layout | Dark terminal theme
          </div>
          <div className="text-bb-muted text-[10px]">
            Built with React 19, Recharts, Tailwind CSS v4
          </div>
        </div>
      </Panel>

      <Panel title="Features" className="col-span-7 row-span-3">
        <div className="space-y-1 text-[10px] p-0.5">
          {features.map((f, i) => (
            <div key={i} className="border border-bb-border px-2 py-1">
              <span className="text-bb-muted">{f}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

export default memo(Settings);
