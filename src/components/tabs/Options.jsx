import Panel from '../layout/Panel';
import { formatNumber, colorClass } from '../../utils/format';

const optionsChain = {
  underlying: 'AAPL',
  underlyingPrice: 189.84,
  expiry: '2024-02-16',
  calls: [
    { strike: 180, last: 11.20, change: 0.85, bid: 11.10, ask: 11.30, volume: 12450, oi: 45280, iv: 0.248 },
    { strike: 182.5, last: 9.15, change: 0.72, bid: 9.05, ask: 9.25, volume: 8920, oi: 32140, iv: 0.242 },
    { strike: 185, last: 7.25, change: 0.58, bid: 7.15, ask: 7.35, volume: 15680, oi: 52470, iv: 0.235 },
    { strike: 187.5, last: 5.50, change: 0.42, bid: 5.40, ask: 5.60, volume: 22340, oi: 68920, iv: 0.228 },
    { strike: 190, last: 3.95, change: 0.28, bid: 3.85, ask: 4.05, volume: 35120, oi: 84560, iv: 0.222 },
    { strike: 192.5, last: 2.65, change: -0.15, bid: 2.55, ask: 2.75, volume: 28450, oi: 71240, iv: 0.218 },
    { strike: 195, last: 1.68, change: -0.32, bid: 1.60, ask: 1.76, volume: 42180, oi: 95640, iv: 0.215 },
    { strike: 197.5, last: 0.98, change: -0.22, bid: 0.92, ask: 1.04, volume: 18920, oi: 54280, iv: 0.212 },
    { strike: 200, last: 0.52, change: -0.18, bid: 0.48, ask: 0.56, volume: 24560, oi: 62480, iv: 0.210 },
  ],
  puts: [
    { strike: 180, last: 1.35, change: -0.42, bid: 1.28, ask: 1.42, volume: 8920, oi: 28560, iv: 0.252 },
    { strike: 182.5, last: 1.78, change: -0.38, bid: 1.70, ask: 1.86, volume: 6450, oi: 22140, iv: 0.248 },
    { strike: 185, last: 2.38, change: -0.32, bid: 2.30, ask: 2.46, volume: 11280, oi: 38920, iv: 0.242 },
    { strike: 187.5, last: 3.12, change: -0.25, bid: 3.02, ask: 3.22, volume: 15640, oi: 45680, iv: 0.236 },
    { strike: 190, last: 4.08, change: 0.12, bid: 3.98, ask: 4.18, volume: 28920, oi: 72340, iv: 0.230 },
    { strike: 192.5, last: 5.28, change: 0.28, bid: 5.18, ask: 5.38, volume: 19450, oi: 51280, iv: 0.225 },
    { strike: 195, last: 6.78, change: 0.45, bid: 6.68, ask: 6.88, volume: 14280, oi: 42560, iv: 0.222 },
    { strike: 197.5, last: 8.58, change: 0.52, bid: 8.48, ask: 8.68, volume: 7820, oi: 28450, iv: 0.220 },
    { strike: 200, last: 10.62, change: 0.68, bid: 10.52, ask: 10.72, volume: 5640, oi: 22180, iv: 0.218 },
  ],
};

export default function Options() {
  const { underlying, underlyingPrice, expiry, calls, puts } = optionsChain;
  return (
    <div className="h-full grid grid-cols-12 grid-rows-1 gap-[3px] p-[3px]">
      <Panel title={`${underlying} Options Chain — Exp: ${expiry} — Spot: ${formatNumber(underlyingPrice)}`} className="col-span-12">
        <div className="grid grid-cols-2 gap-[3px]">
          <div>
            <div className="text-bb-green text-[10px] font-bold mb-1 text-center">CALLS</div>
            <table className="bb-table">
              <thead>
                <tr>
                  <th className="text-right">Last</th>
                  <th className="text-right">Chg</th>
                  <th className="text-right">Bid</th>
                  <th className="text-right">Ask</th>
                  <th className="text-right">Vol</th>
                  <th className="text-right">OI</th>
                  <th className="text-right">IV</th>
                  <th className="text-center text-bb-amber">Strike</th>
                </tr>
              </thead>
              <tbody>
                {calls.map(c => (
                  <tr key={c.strike} className={c.strike <= underlyingPrice ? 'bg-bb-green/5' : ''}>
                    <td className="text-right">{formatNumber(c.last)}</td>
                    <td className={`text-right ${colorClass(c.change)}`}>{c.change > 0 ? '+' : ''}{formatNumber(c.change)}</td>
                    <td className="text-right">{formatNumber(c.bid)}</td>
                    <td className="text-right">{formatNumber(c.ask)}</td>
                    <td className="text-right text-bb-muted">{c.volume.toLocaleString()}</td>
                    <td className="text-right text-bb-muted">{c.oi.toLocaleString()}</td>
                    <td className="text-right">{(c.iv * 100).toFixed(1)}%</td>
                    <td className="text-center text-bb-amber font-bold">{formatNumber(c.strike, 1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <div className="text-bb-red text-[10px] font-bold mb-1 text-center">PUTS</div>
            <table className="bb-table">
              <thead>
                <tr>
                  <th className="text-center text-bb-amber">Strike</th>
                  <th className="text-right">Last</th>
                  <th className="text-right">Chg</th>
                  <th className="text-right">Bid</th>
                  <th className="text-right">Ask</th>
                  <th className="text-right">Vol</th>
                  <th className="text-right">OI</th>
                  <th className="text-right">IV</th>
                </tr>
              </thead>
              <tbody>
                {puts.map(p => (
                  <tr key={p.strike} className={p.strike >= underlyingPrice ? 'bg-bb-red/5' : ''}>
                    <td className="text-center text-bb-amber font-bold">{formatNumber(p.strike, 1)}</td>
                    <td className="text-right">{formatNumber(p.last)}</td>
                    <td className={`text-right ${colorClass(p.change)}`}>{p.change > 0 ? '+' : ''}{formatNumber(p.change)}</td>
                    <td className="text-right">{formatNumber(p.bid)}</td>
                    <td className="text-right">{formatNumber(p.ask)}</td>
                    <td className="text-right text-bb-muted">{p.volume.toLocaleString()}</td>
                    <td className="text-right text-bb-muted">{p.oi.toLocaleString()}</td>
                    <td className="text-right">{(p.iv * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Panel>
    </div>
  );
}
