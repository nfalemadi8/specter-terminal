import { tabs } from '../../data/tabs';

export default function TabBar({ activeTab, onTabChange }) {
  return (
    <div className="flex items-center gap-0 bg-bb-dark border-b border-bb-border overflow-x-auto">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-3 py-[5px] text-[10px] font-semibold tracking-wide whitespace-nowrap border-r border-bb-border transition-colors
            ${activeTab === tab.id
              ? 'bg-bb-panel text-bb-amber border-b-2 border-b-bb-amber'
              : 'text-bb-muted hover:text-bb-white hover:bg-bb-panel/50'
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
