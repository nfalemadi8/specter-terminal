import { memo } from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Panel from '../layout/Panel';
import { generatePriceHistory } from '../../data/stocks';
import { formatNumber, round } from '../../utils/format';

const priceData = generatePriceHistory(189.84, 120);

// Simple moving averages
const withIndicators = priceData.map((d, i, arr) => {
  const sma20 = i >= 19 ? arr.slice(i - 19, i + 1).reduce((s, v) => s + v.price, 0) / 20 : null;
  const sma50 = i >= 49 ? arr.slice(i - 49, i + 1).reduce((s, v) => s + v.price, 0) / 50 : null;
  return { ...d, sma20, sma50 };
});

// RSI calculation
const rsiData = priceData.map((d, i) => {
  if (i < 14) return { date: d.date, rsi: 50 };
  let gains = 0, losses = 0;
  for (let j = i - 13; j <= i; j++) {
    const diff = priceData[j].price - priceData[j - 1].price;
    if (diff > 0) gains += diff; else losses -= diff;
  }
  const rs = losses === 0 ? 100 : gains / losses;
  return { date: d.date, rsi: round(100 - 100 / (1 + rs), 1) };
});

const technicalSignals = [
  { indicator: 'RSI (14)', value: round(rsiData[rsiData.length - 1].rsi, 1), signal: rsiData[rsiData.length - 1].rsi > 70 ? 'OVERBOUGHT' : rsiData[rsiData.length - 1].rsi < 30 ? 'OVERSOLD' : 'NEUTRAL' },
  { indicator: 'MACD', value: '2.45', signal: 'BUY' },
  { indicator: 'SMA 20', value: formatNumber(withIndicators[withIndicators.length - 1].sma20), signal: withIndicators[withIndicators.length - 1].price > withIndicators[withIndicators.length - 1].sma20 ? 'BUY' : 'SELL' },
  { indicator: 'SMA 50', value: formatNumber(withIndicators[withIndicators.length - 1].sma50), signal: withIndicators[withIndicators.length - 1].price > withIndicators[withIndicators.length - 1].sma50 ? 'BUY' : 'SELL' },
  { indicator: 'Bollinger Bands', value: 'Upper: 195.20', signal: 'NEUTRAL' },
  { indicator: 'Stochastic', value: '72.4', signal: 'NEUTRAL' },
  { indicator: 'ADX', value: '28.5', signal: 'TRENDING' },
  { indicator: 'ATR (14)', value: '4.82', signal: '-' },
];

function Technicals() {
  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      <Panel title="AAPL — Price with Moving Averages" className="col-span-8 row-span-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={withIndicators.slice(50)}>
            <XAxis dataKey="date" tick={{ fill: '#6a6a6a', fontSize: 9 }} tickFormatter={v => v.slice(5)} interval={10} />
            <YAxis domain={['dataMin', 'dataMax']} tick={{ fill: '#6a6a6a', fontSize: 9 }} width={50} />
            <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', fontSize: '10px' }} />
            <Line type="monotone" dataKey="price" stroke="#e0e0e0" strokeWidth={1.5} dot={false} name="Price" />
            <Line type="monotone" dataKey="sma20" stroke="#4a9eff" strokeWidth={1} dot={false} name="SMA 20" strokeDasharray="3 3" />
            <Line type="monotone" dataKey="sma50" stroke="#ff8c00" strokeWidth={1} dot={false} name="SMA 50" strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </Panel>

      <Panel title="Technical Signals" className="col-span-4 row-span-3">
        <table className="bb-table">
          <thead>
            <tr>
              <th>Indicator</th>
              <th className="text-right">Value</th>
              <th className="text-right">Signal</th>
            </tr>
          </thead>
          <tbody>
            {technicalSignals.map(t => (
              <tr key={t.indicator}>
                <td className="text-bb-white">{t.indicator}</td>
                <td className="text-right">{t.value}</td>
                <td className="text-right">
                  <span className={`text-[9px] px-1 py-[1px] rounded ${
                    t.signal === 'BUY' ? 'bg-bb-green/20 text-bb-green' :
                    t.signal === 'SELL' || t.signal === 'OVERBOUGHT' ? 'bg-bb-red/20 text-bb-red' :
                    t.signal === 'OVERSOLD' ? 'bg-bb-orange/20 text-bb-orange' :
                    'bg-bb-muted/20 text-bb-muted'
                  }`}>{t.signal}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel title="RSI (14)" className="col-span-8 row-span-1.5">
        <ResponsiveContainer width="100%" height={80}>
          <AreaChart data={rsiData.slice(50)}>
            <defs>
              <linearGradient id="rsiGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00e5ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={false} />
            <YAxis domain={[0, 100]} tick={{ fill: '#6a6a6a', fontSize: 9 }} ticks={[30, 50, 70]} width={30} />
            <Area type="monotone" dataKey="rsi" stroke="#00e5ff" fill="url(#rsiGrad)" strokeWidth={1} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </Panel>

      <Panel title="Volume" className="col-span-8 row-span-1.5">
        <ResponsiveContainer width="100%" height={80}>
          <BarChart data={priceData.slice(-30)}>
            <XAxis dataKey="date" tick={false} />
            <YAxis tick={{ fill: '#6a6a6a', fontSize: 9 }} tickFormatter={v => round(v / 1e6, 0) + 'M'} width={35} />
            <Bar dataKey="volume" fill="#4a9eff" opacity={0.5} />
          </BarChart>
        </ResponsiveContainer>
      </Panel>

      <Panel title="Key Levels" className="col-span-4 row-span-3">
        <div className="space-y-2 p-1">
          {[
            { label: 'Resistance 3', value: '198.50', color: 'text-bb-red' },
            { label: 'Resistance 2', value: '195.20', color: 'text-bb-red' },
            { label: 'Resistance 1', value: '192.80', color: 'text-bb-red' },
            { label: 'Pivot', value: '189.84', color: 'text-bb-amber' },
            { label: 'Support 1', value: '186.40', color: 'text-bb-green' },
            { label: 'Support 2', value: '183.70', color: 'text-bb-green' },
            { label: 'Support 3', value: '180.20', color: 'text-bb-green' },
          ].map(l => (
            <div key={l.label} className="flex justify-between text-[10px]">
              <span className="text-bb-muted">{l.label}</span>
              <span className={l.color}>{l.value}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

export default memo(Technicals);
