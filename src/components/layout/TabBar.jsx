import { tabs } from '../../data/tabs';

export default function TabBar({ activeTab, onTabChange }) {
  return (
    <div role="tablist" aria-label="Terminal modules" className="flex items-center gap-0 bg-bb-dark border-b border-bb-border overflow-x-auto scrollbar-none">
      {tabs.map((tab, i) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`relative px-2 sm:px-3 py-[5px] text-[9px] sm:text-[10px] font-semibold tracking-wide whitespace-nowrap border-r border-bb-border transition-colors
            ${activeTab === tab.id
              ? 'bg-bb-panel text-bb-amber border-b-2 border-b-bb-amber'
              : 'text-bb-muted hover:text-bb-white hover:bg-bb-panel/50'
            }`}
        >
          {i < 9 && (
            <span aria-hidden="true" className="text-[7px] text-bb-muted mr-1 opacity-60">{i + 1}</span>
          )}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
