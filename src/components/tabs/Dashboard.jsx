import { useState, useEffect, useMemo, memo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Panel from '../layout/Panel';
import { getIndices, getTopMovers, getCommodities, getBonds, getYieldCurve, getAllStocks } from '../../services/dataProvider';
import { newsItems } from '../../data/news';
import { economicIndicators } from '../../data/economic';
import { formatNumber, formatPercent, formatChange, formatCurrency, colorClass, round } from '../../utils/format';

const chartTooltipStyle = {
  contentStyle: { background: '#1a1a1a', border: '1px solid #2a2a2a', fontSize: '10px', fontFamily: 'monospace' },
  labelStyle: { color: '#ffbf00', fontSize: '10px' },
};

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    Promise.all([
      getIndices(),
      getTopMovers(10),
      getCommodities(),
      getBonds(),
      getYieldCurve('US'),
      getAllStocks(),
    ]).then(([indices, movers, commodities, bonds, yieldCurve, stocks]) => {
      // Compute sector performance from stocks
      const sectorMap = {};
      stocks.forEach(s => {
        if (!sectorMap[s.sector]) sectorMap[s.sector] = { sum: 0, count: 0 };
        sectorMap[s.sector].sum += s.changePercent;
        sectorMap[s.sector].count++;
      });
      const sectorPerf = Object.entries(sectorMap)
        .map(([sector, d]) => ({ sector, change: d.sum / d.count }))
        .sort((a, b) => b.change - a.change);

      // S&P 500 chart from index
      const spx = indices.find(i => i.id === 'SPX');

      setData({ indices, movers, commodities, bonds, yieldCurve, sectorPerf, spxHistory: spx?.priceHistory || [] });
    });
  }, []);

  if (!data) return <div className="p-4 text-bb-muted text-center text-[11px]">Loading dashboard…</div>;

  const { indices, movers, commodities, sectorPerf, spxHistory } = data;
  const usTreasuries = data.bonds.filter(b => b.country === 'US' && b.type !== 'corporate' && b.type !== 'sukuk');

  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      {/* Row 1: Market indices + S&P chart */}
      <Panel title="Market Indices" className="col-span-3 row-span-2">
        <table className="bb-table">
          <thead><tr><th>Index</th><th className="text-right">Last</th><th className="text-right">Chg%</th></tr></thead>
          <tbody>
            {indices.slice(0, 10).map(idx => (
              <tr key={idx.id}>
                <td className="text-bb-amber">{idx.id}</td>
                <td className="text-right">{formatNumber(idx.val, idx.val > 1000 ? 0 : 2)}</td>
                <td className={`text-right ${colorClass(idx.chgPct)}`}>{formatPercent(idx.chgPct)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel title="S&P 500 — 30D" className="col-span-5 row-span-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={spxHistory}>
            <defs>
              <linearGradient id="spxGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4a9eff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4a9eff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fill: '#6a6a6a', fontSize: 9 }} tickFormatter={v => v.slice(5)} interval={5} />
            <YAxis domain={['dataMin', 'dataMax']} tick={{ fill: '#6a6a6a', fontSize: 9 }} tickFormatter={v => round(v, 0)} width={45} />
            <Tooltip {...chartTooltipStyle} />
            <Area type="monotone" dataKey="price" stroke="#4a9eff" fill="url(#spxGrad)" strokeWidth={1.5} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </Panel>

      <Panel title="Economic Indicators" className="col-span-4 row-span-2">
        <table className="bb-table">
          <thead><tr><th>Indicator</th><th className="text-right">Actual</th><th className="text-right">Prev</th><th className="text-right">Status</th></tr></thead>
          <tbody>
            {economicIndicators.slice(0, 8).map(e => (
              <tr key={e.name}>
                <td className="text-bb-white text-[10px]">{e.name}</td>
                <td className="text-right">{e.value}</td>
                <td className="text-right text-bb-muted">{e.previous}</td>
                <td className="text-right">
                  <span className={`text-[9px] px-1 py-[1px] rounded ${e.status === 'beat' ? 'bg-bb-green/20 text-bb-green' : e.status === 'miss' ? 'bg-bb-red/20 text-bb-red' : 'bg-bb-muted/20 text-bb-muted'}`}>
                    {e.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      {/* Row 2: Top movers + Treasury yields + Sector perf */}
      <Panel title="Top Movers" className="col-span-4 row-span-2">
        <table className="bb-table">
          <thead><tr><th>Ticker</th><th className="text-right">Price</th><th className="text-right">Chg%</th><th>Exchange</th></tr></thead>
          <tbody>
            {[...movers.gainers.slice(0, 5), ...movers.losers.slice(0, 5)].map(s => (
              <tr key={s.ticker}>
                <td className="text-bb-amber">{s.ticker}</td>
                <td className="text-right">{formatNumber(s.price)}</td>
                <td className={`text-right ${colorClass(s.changePercent)}`}>{formatPercent(s.changePercent)}</td>
                <td className="text-bb-muted">{s.exchange}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel title="US Treasury Yields" className="col-span-4 row-span-2">
        {data.yieldCurve && (
          <div className="h-[90px] mb-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.yieldCurve}>
                <defs>
                  <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffd700" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ffd700" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" tick={{ fill: '#6a6a6a', fontSize: 9 }} />
                <YAxis domain={['auto', 'auto']} tick={{ fill: '#6a6a6a', fontSize: 9 }} width={35} />
                <Tooltip {...chartTooltipStyle} formatter={v => round(v, 2) + '%'} />
                <Area type="monotone" dataKey="yield" stroke="#ffd700" fill="url(#yieldGrad)" strokeWidth={1.5} dot={{ fill: '#ffd700', r: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
        <table className="bb-table">
          <thead><tr><th>Tenor</th><th className="text-right">Yield</th><th className="text-right">Coupon</th><th>Rating</th></tr></thead>
          <tbody>
            {usTreasuries.slice(0, 6).map(t => (
              <tr key={t.id}>
                <td className="text-bb-amber">{t.maturity}</td>
                <td className="text-right font-bold">{round(t.yield, 2)}%</td>
                <td className="text-right text-bb-muted">{round(t.coupon, 2)}%</td>
                <td className="text-bb-green">{t.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel title="Sector Performance" className="col-span-4 row-span-2">
        {sectorPerf.map(s => (
          <div key={s.sector} className="flex items-center gap-2 py-[2px]">
            <span className="text-bb-white text-[10px] w-28 truncate">{s.sector}</span>
            <div className="flex-1 h-3 bg-bb-dark rounded-sm overflow-hidden">
              <div className={`h-full ${s.change >= 0 ? 'bg-bb-green/60' : 'bg-bb-red/60'}`}
                style={{ width: `${Math.min(Math.abs(s.change) * 30, 100)}%` }} />
            </div>
            <span className={`text-[10px] w-12 text-right ${colorClass(s.change)}`}>{formatPercent(s.change)}</span>
          </div>
        ))}
      </Panel>

      {/* Row 3: Commodities + News */}
      <Panel title="Commodities" className="col-span-4 row-span-2">
        <table className="bb-table">
          <thead><tr><th>Name</th><th className="text-right">Price</th><th className="text-right">Chg%</th><th className="text-right">Unit</th></tr></thead>
          <tbody>
            {commodities.slice(0, 10).map(c => (
              <tr key={c.id}>
                <td className="text-bb-amber">{c.n}</td>
                <td className="text-right">{formatNumber(c.pr, c.pr < 10 ? 3 : 2)}</td>
                <td className={`text-right ${colorClass(c.chgPct)}`}>{formatPercent(c.chgPct)}</td>
                <td className="text-right text-bb-muted">{c.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel title="News Feed" className="col-span-8 row-span-2">
        <div className="space-y-[2px]">
          {newsItems.slice(0, 14).map(n => (
            <div key={n.id} className="flex gap-2 py-[2px] border-b border-bb-border/50">
              <span className="text-bb-muted text-[10px] shrink-0">{n.time}</span>
              <span className={`text-[10px] shrink-0 font-semibold ${
                n.source === 'RTRS' ? 'text-bb-cyan' :
                n.source === 'BBG' ? 'text-bb-orange' :
                n.source === 'FT' ? 'text-bb-amber' :
                'text-bb-blue'
              }`}>{n.source}</span>
              <span className="text-bb-white text-[10px] truncate">{n.headline}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

export default memo(Dashboard);
