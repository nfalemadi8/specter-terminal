import { tabs } from '../../data/tabs';

export default function TabBar({ activeTab, onTabChange }) {
  return (
    <div className="flex items-center gap-0 bg-bb-dark border-b border-bb-border overflow-x-auto scrollbar-none">
      {tabs.map((tab, i) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          aria-label={`${tab.label} tab${i < 9 ? `, shortcut ${i + 1}` : ''}`}
          className={`relative px-3 py-[5px] text-[10px] font-semibold tracking-wide whitespace-nowrap border-r border-bb-border transition-colors
            ${activeTab === tab.id
              ? 'bg-bb-panel text-bb-amber border-b-2 border-b-bb-amber'
              : 'text-bb-muted hover:text-bb-white hover:bg-bb-panel/50'
            }`}
        >
          {i < 9 && (
            <span className="text-[7px] text-bb-muted mr-1 opacity-60">{i + 1}</span>
          )}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
