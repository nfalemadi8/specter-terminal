import Panel from '../layout/Panel';

const shortcuts = [
  { key: 'F1-F10', action: 'Switch to tab 1-10' },
  { key: 'Ctrl+K', action: 'Focus command bar' },
  { key: 'Esc', action: 'Close overlays' },
  { key: '/', action: 'Quick search' },
];

const systemInfo = [
  { label: 'Version', value: 'SPECTER Terminal v3.0' },
  { label: 'Build', value: '2024.01.15-rc1' },
  { label: 'Data Feed', value: 'Simulated (Demo Mode)' },
  { label: 'Refresh Rate', value: '1000ms' },
  { label: 'Theme', value: 'Bloomberg Dark' },
  { label: 'Font', value: 'Consolas / SF Mono' },
  { label: 'Framework', value: 'React + Vite' },
  { label: 'Charts', value: 'Recharts' },
  { label: 'Styling', value: 'Tailwind CSS v4' },
];

export default function Settings() {
  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      <Panel title="System Information" className="col-span-6 row-span-3">
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

      <Panel title="Keyboard Shortcuts" className="col-span-6 row-span-3">
        <table className="bb-table">
          <thead>
            <tr>
              <th>Key</th>
              <th>Action</th>
            </tr>
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

      <Panel title="About" className="col-span-12 row-span-3">
        <div className="p-4 text-center space-y-2">
          <div className="text-bb-amber text-2xl font-bold tracking-widest">SPECTER TERMINAL</div>
          <div className="text-bb-muted text-xs">Personal Bloomberg Terminal-Style Financial Dashboard</div>
          <div className="text-bb-muted text-xs">Version 3.0 — Demo Mode</div>
          <div className="text-bb-border mt-4">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
          <div className="text-bb-muted text-[10px] mt-2">
            23 modules | Real-time layout | Dark terminal theme
          </div>
          <div className="text-bb-muted text-[10px]">
            Built with React, Recharts, Tailwind CSS
          </div>
        </div>
      </Panel>
    </div>
  );
}
