import { useState, useEffect } from 'react';
import { getExchanges } from '../../services/dataProvider';

const KEY_EXCHANGES = ['NYSE', 'NASDAQ', 'LSE', 'XETRA', 'EURONEXT', 'TSE_TOKYO', 'HKEX', 'SSE', 'TADAWUL', 'DFM', 'QSE', 'ASX', 'BSE'];

const STATUS_COLORS = {
  open: 'text-bb-green',
  'pre-market': 'text-bb-amber',
  'after-hours': 'text-bb-amber',
  closed: 'text-bb-red',
};

const STATUS_DOT = {
  open: 'bg-green-500',
  'pre-market': 'bg-amber-500',
  'after-hours': 'bg-amber-500',
  closed: 'bg-red-500',
};

function getLocalTime(tz) {
  try {
    return new Date().toLocaleTimeString('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false });
  } catch {
    return '--:--';
  }
}

export default function MarketClock() {
  const [exchanges, setExchanges] = useState([]);

  useEffect(() => {
    getExchanges().then(all => {
      const filtered = all.filter(e => KEY_EXCHANGES.includes(e.id));
      // Sort by KEY_EXCHANGES order
      filtered.sort((a, b) => KEY_EXCHANGES.indexOf(a.id) - KEY_EXCHANGES.indexOf(b.id));
      setExchanges(filtered);
    });

    // Refresh every 60 seconds
    const interval = setInterval(() => {
      getExchanges().then(all => {
        const filtered = all.filter(e => KEY_EXCHANGES.includes(e.id));
        filtered.sort((a, b) => KEY_EXCHANGES.indexOf(a.id) - KEY_EXCHANGES.indexOf(b.id));
        setExchanges(filtered);
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (exchanges.length === 0) return null;

  return (
    <div className="flex items-center gap-0 px-2 py-[1px] bg-bb-dark/50 border-b border-bb-border overflow-x-auto scrollbar-none">
      <span className="text-bb-muted text-[8px] font-bold mr-2 shrink-0">MARKETS</span>
      {exchanges.map((ex, i) => (
        <div key={ex.id} className="flex items-center gap-1 px-2 shrink-0">
          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[ex.status] || 'bg-gray-500'}`} />
          <span className="text-bb-muted text-[8px]">{ex.id.replace('_', ' ')}</span>
          <span className={`text-[8px] font-bold ${STATUS_COLORS[ex.status] || 'text-bb-muted'}`}>
            {ex.status === 'open' ? 'OPEN' : ex.status === 'pre-market' ? 'PRE' : ex.status === 'after-hours' ? 'AH' : 'CLSD'}
          </span>
          <span className="text-[8px] text-bb-muted">{getLocalTime(ex.tz)}</span>
          {i < exchanges.length - 1 && <span className="text-bb-border/50 ml-1 text-[8px]">│</span>}
        </div>
      ))}
    </div>
  );
}
