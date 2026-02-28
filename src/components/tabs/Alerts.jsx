import { useState } from 'react';
import Panel from '../layout/Panel';
import { watchlist } from '../../data/news';
import { formatNumber, formatPercent, colorClass } from '../../utils/format';

const alertHistory = [
  { id: 1, time: '14:15', symbol: 'NVDA', type: 'Price Above', target: 490.00, triggered: 495.22, status: 'triggered' },
  { id: 2, time: '13:42', symbol: 'SPX', type: 'Price Above', target: 4550.00, triggered: 4567.18, status: 'triggered' },
  { id: 3, time: '11:28', symbol: 'TSLA', type: 'Volume Spike', target: '100M', triggered: '112.4M', status: 'triggered' },
  { id: 4, time: '10:05', symbol: 'XOM', type: 'Price Below', target: 105.00, triggered: 104.57, status: 'triggered' },
  { id: 5, time: '09:35', symbol: 'VIX', type: 'Price Below', target: 15.00, triggered: 14.21, status: 'triggered' },
];

export default function Alerts() {
  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      <Panel title="Active Alerts" className="col-span-6 row-span-6">
        <table className="bb-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Condition</th>
              <th className="text-right">Target</th>
              <th className="text-right">Current</th>
              <th className="text-right">Distance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {watchlist.map(w => {
              const dist = ((w.target - w.current) / w.current * 100);
              return (
                <tr key={w.symbol}>
                  <td className="text-bb-amber">{w.symbol}</td>
                  <td className={w.alert === 'above' ? 'text-bb-green' : 'text-bb-red'}>
                    {w.alert === 'above' ? '> Above' : '< Below'}
                  </td>
                  <td className="text-right">{formatNumber(w.target)}</td>
                  <td className="text-right">{formatNumber(w.current)}</td>
                  <td className={`text-right ${colorClass(dist)}`}>{formatPercent(dist)}</td>
                  <td>
                    <span className="text-[9px] px-1 py-[1px] rounded bg-bb-blue/20 text-bb-blue">ACTIVE</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Panel>

      <Panel title="Alert History" className="col-span-6 row-span-6">
        <table className="bb-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Symbol</th>
              <th>Type</th>
              <th className="text-right">Target</th>
              <th className="text-right">Triggered At</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {alertHistory.map(a => (
              <tr key={a.id}>
                <td className="text-bb-muted">{a.time}</td>
                <td className="text-bb-amber">{a.symbol}</td>
                <td>{a.type}</td>
                <td className="text-right">{a.target}</td>
                <td className="text-right">{a.triggered}</td>
                <td>
                  <span className="text-[9px] px-1 py-[1px] rounded bg-bb-amber/20 text-bb-amber">FIRED</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
