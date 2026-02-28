import { useState } from 'react';
import Panel from '../layout/Panel';
import { newsItems } from '../../data/news';

const categories = ['All', 'Equities', 'Fixed Income', 'Commodities', 'Central Banks', 'Economics', 'Earnings', 'Crypto', 'Forex', 'Technology'];

export default function News() {
  const [filter, setFilter] = useState('All');
  const filtered = filter === 'All' ? newsItems : newsItems.filter(n => n.category === filter);

  return (
    <div className="h-full grid grid-cols-12 grid-rows-1 gap-[3px] p-[3px]">
      <Panel title="News Feed" className="col-span-12">
        <div className="flex gap-1 mb-2 flex-wrap">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-2 py-[2px] text-[10px] rounded border ${
                filter === c
                  ? 'border-bb-amber text-bb-amber bg-bb-amber/10'
                  : 'border-bb-border text-bb-muted hover:text-bb-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="space-y-0">
          {filtered.map(n => (
            <div key={n.id} className="flex gap-3 py-[4px] border-b border-bb-border/50 hover:bg-bb-panel/50">
              <span className="text-bb-muted text-[10px] shrink-0 w-10">{n.time}</span>
              <span className={`text-[10px] shrink-0 w-8 font-bold ${
                n.source === 'RTRS' ? 'text-bb-cyan' :
                n.source === 'BBG' ? 'text-bb-orange' :
                n.source === 'FT' ? 'text-bb-amber' : 'text-bb-blue'
              }`}>{n.source}</span>
              <span className={`text-[9px] shrink-0 w-3 ${
                n.priority === 'high' ? 'text-bb-red' :
                n.priority === 'medium' ? 'text-bb-yellow' : 'text-bb-muted'
              }`}>
                {n.priority === 'high' ? '!' : n.priority === 'medium' ? '-' : ' '}
              </span>
              <span className="text-bb-white text-[11px]">{n.headline}</span>
              <span className="text-bb-muted text-[9px] shrink-0 ml-auto">{n.category}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
