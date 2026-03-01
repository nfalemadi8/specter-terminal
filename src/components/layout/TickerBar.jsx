import { useState, useEffect } from 'react';
import { getIndices, getCommodities, getCurrencyRates, getCrypto } from '../../services/dataProvider';
import { formatPercent, round } from '../../utils/format';

export default function TickerBar() {
  const [tickers, setTickers] = useState([]);

  useEffect(() => {
    Promise.all([getIndices(), getCommodities(), getCurrencyRates(), getCrypto()]).then(([indices, commodities, currencies, crypto]) => {
      const items = [];
      // Top indices
      indices.slice(0, 6).forEach(i => items.push({ symbol: i.id, price: i.val, change: i.chgPct }));
      // Gold & Oil
      const gold = commodities.find(c => c.id === 'XAU');
      const oil = commodities.find(c => c.id === 'WTI');
      if (gold) items.push({ symbol: 'GOLD', price: gold.pr, change: gold.chgPct });
      if (oil) items.push({ symbol: 'OIL', price: oil.pr, change: oil.chgPct });
      // EUR/USD
      const eurRate = currencies.EUR?.rate;
      if (eurRate) items.push({ symbol: 'EUR/USD', price: round(1 / eurRate, 4), change: 0 });
      // BTC
      const btc = crypto.find(c => c.id === 'BTC');
      if (btc) items.push({ symbol: 'BTC', price: btc.pr, change: btc.chgPct });
      setTickers(items);
    });
  }, []);

  if (tickers.length === 0) return <div className="h-5 bg-bb-black border-b border-bb-border" />;

  return (
    <div className="flex items-center gap-0 px-2 py-[2px] bg-bb-black border-b border-bb-border overflow-x-auto scrollbar-none">
      {tickers.map((t, i) => (
        <div key={t.symbol} className="flex items-center gap-1 px-3 shrink-0">
          <span className="text-bb-amber text-[10px] font-semibold">{t.symbol}</span>
          <span className="text-bb-white text-[10px]">
            {typeof t.price === 'number' && t.price > 1000
              ? t.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              : round(t.price, t.price < 10 ? 4 : 2)}
          </span>
          <span className={`text-[10px] ${t.change >= 0 ? 'text-bb-green' : 'text-bb-red'}`}>
            {formatPercent(t.change)}
          </span>
          {i < tickers.length - 1 && <span className="text-bb-border ml-2">│</span>}
        </div>
      ))}
    </div>
  );
}
