import { indices } from '../../data/stocks';
import { commodities } from '../../data/commodities';
import { forexPairs } from '../../data/forex';
import { cryptoPairs } from '../../data/forex';
import { formatPercent, round } from '../../utils/format';

export default function TickerBar() {
  const tickers = [
    ...indices.map(i => ({ symbol: i.symbol, price: i.price, change: i.changePct })),
    { symbol: 'GOLD', price: commodities[0].price, change: commodities[0].changePct },
    { symbol: 'OIL', price: commodities[4].price, change: commodities[4].changePct },
    { symbol: 'EUR/USD', price: forexPairs[0].bid, change: forexPairs[0].changePct },
    { symbol: 'BTC', price: cryptoPairs[0].price, change: cryptoPairs[0].changePct },
  ];

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
