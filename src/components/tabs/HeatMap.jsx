import { memo, useMemo } from 'react';
import Panel from '../layout/Panel';
import { stocks } from '../../data/stocks';
import { formatPercent } from '../../utils/format';

function getHeatColor(pct) {
  if (pct > 3) return 'bg-green-700';
  if (pct > 2) return 'bg-green-600';
  if (pct > 1) return 'bg-green-500/80';
  if (pct > 0) return 'bg-green-500/40';
  if (pct > -1) return 'bg-red-500/40';
  if (pct > -2) return 'bg-red-500/80';
  if (pct > -3) return 'bg-red-600';
  return 'bg-red-700';
}

function getSize(marketCap) {
  if (typeof marketCap === 'string') {
    if (marketCap.includes('T')) return 'col-span-2 row-span-2';
    if (parseFloat(marketCap) > 500) return 'col-span-2 row-span-1';
  }
  return 'col-span-1 row-span-1';
}

function HeatMap() {
  const sorted = useMemo(() => [...stocks].sort((a, b) => {
    const av = a.marketCap.includes('T') ? parseFloat(a.marketCap) * 1000 : parseFloat(a.marketCap);
    const bv = b.marketCap.includes('T') ? parseFloat(b.marketCap) * 1000 : parseFloat(b.marketCap);
    return bv - av;
  }), []);

  return (
    <div className="h-full grid grid-cols-12 grid-rows-1 gap-[3px] p-[3px]">
      <Panel title="Market Heat Map — S&P 500 by Market Cap" className="col-span-12">
        <div className="grid grid-cols-8 gap-[2px] p-1">
          {sorted.map(s => (
            <div
              key={s.symbol}
              className={`${getHeatColor(s.changePct)} ${getSize(s.marketCap)} rounded-sm p-2 flex flex-col items-center justify-center cursor-pointer hover:opacity-80 transition-opacity`}
            >
              <div className="text-white font-bold text-xs">{s.symbol}</div>
              <div className="text-white/80 text-[10px]">{formatPercent(s.changePct)}</div>
              <div className="text-white/60 text-[9px]">{s.marketCap}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-1 mt-3">
          <span className="text-bb-muted text-[9px]">-3%</span>
          {['bg-red-700', 'bg-red-600', 'bg-red-500/80', 'bg-red-500/40', 'bg-green-500/40', 'bg-green-500/80', 'bg-green-600', 'bg-green-700'].map((c, i) => (
            <div key={i} className={`w-8 h-3 ${c} rounded-sm`} />
          ))}
          <span className="text-bb-muted text-[9px]">+3%</span>
        </div>
      </Panel>
    </div>
  );
}

export default memo(HeatMap);
