import { useState, useMemo } from 'react';
import Panel from '../layout/Panel';
import { economicCalendar, economicIndicators } from '../../data/economic';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const REGIONS = ['All', 'US', 'EU', 'UK', 'JP', 'CN', 'QA', 'AE'];
const IMPACTS = ['all', 'high', 'medium', 'low'];

export default function EconCalendar() {
  const [regionFilter, setRegionFilter] = useState('All');
  const [impactFilter, setImpactFilter] = useState('all');
  const [selectedDay, setSelectedDay] = useState(null);

  const filtered = useMemo(() => {
    let data = economicCalendar;
    if (regionFilter !== 'All') data = data.filter(e => e.region === regionFilter || e.country === regionFilter);
    if (impactFilter !== 'all') data = data.filter(e => e.impact === impactFilter);
    if (selectedDay) data = data.filter(e => e.date === selectedDay);
    return data;
  }, [regionFilter, impactFilter, selectedDay]);

  const byDay = useMemo(() => {
    const map = {};
    DAYS.forEach(d => { map[d] = economicCalendar.filter(e => e.date === d); });
    return map;
  }, []);

  const highImpactCount = economicCalendar.filter(e => e.impact === 'high').length;
  const todayEvents = byDay[DAYS[0]] || [];

  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-[3px] p-[3px]">
      {/* Week Overview */}
      <Panel title="ECO — Weekly Calendar" className="col-span-12 row-span-2">
        <div className="grid grid-cols-5 gap-[3px] h-full">
          {DAYS.map(day => {
            const events = byDay[day] || [];
            const highEvents = events.filter(e => e.impact === 'high');
            return (
              <div
                key={day}
                onClick={() => setSelectedDay(selectedDay === day ? null : day)}
                className={`border p-1.5 cursor-pointer transition-colors overflow-auto ${
                  selectedDay === day ? 'border-bb-amber bg-bb-amber/5' : 'border-bb-border hover:border-bb-muted'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-bold ${selectedDay === day ? 'text-bb-amber' : 'text-bb-white'}`}>{day}</span>
                  <span className="text-[8px] text-bb-muted">{events.length} events</span>
                </div>
                {events.slice(0, 4).map((e, i) => (
                  <div key={i} className="flex items-center gap-1 text-[8px] mb-0.5">
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${
                      e.impact === 'high' ? 'bg-bb-red' : e.impact === 'medium' ? 'bg-bb-yellow' : 'bg-bb-muted'
                    }`} />
                    <span className="text-bb-muted truncate">{e.time}</span>
                    <span className="truncate">{e.event}</span>
                  </div>
                ))}
                {events.length > 4 && <div className="text-[8px] text-bb-muted">+{events.length - 4} more</div>}
              </div>
            );
          })}
        </div>
      </Panel>

      {/* Filters */}
      <Panel title="Filters" className="col-span-2 row-span-4">
        <div className="space-y-2 text-[10px]">
          <div>
            <div className="text-[9px] text-bb-muted mb-1">REGION</div>
            <div className="space-y-0.5">
              {REGIONS.map(r => (
                <button key={r} onClick={() => setRegionFilter(r)}
                  className={`block w-full text-left px-1.5 py-0.5 border text-[9px] ${
                    regionFilter === r ? 'border-bb-amber text-bb-amber bg-bb-amber/10' : 'border-bb-border text-bb-muted hover:text-bb-white'
                  }`}>{r}</button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[9px] text-bb-muted mb-1">IMPACT</div>
            <div className="space-y-0.5">
              {IMPACTS.map(imp => (
                <button key={imp} onClick={() => setImpactFilter(imp)}
                  className={`block w-full text-left px-1.5 py-0.5 border text-[9px] capitalize ${
                    impactFilter === imp ? 'border-bb-amber text-bb-amber bg-bb-amber/10' : 'border-bb-border text-bb-muted hover:text-bb-white'
                  }`}>{imp === 'all' ? 'All' : imp}</button>
              ))}
            </div>
          </div>
          <div className="border-t border-bb-border pt-1.5">
            <div className="text-[9px] text-bb-muted mb-1">SUMMARY</div>
            <table className="bb-table"><tbody>
              {[['Total Events', economicCalendar.length], ['High Impact', highImpactCount], ['Filtered', filtered.length]].map(([l, v]) => (
                <tr key={l}><td className="text-bb-muted">{l}</td><td className="text-right font-bold">{v}</td></tr>
              ))}
            </tbody></table>
          </div>
          {selectedDay && (
            <button onClick={() => setSelectedDay(null)} className="w-full text-center py-0.5 border border-bb-border text-bb-muted hover:text-bb-white text-[9px]">Clear Day Filter</button>
          )}
        </div>
      </Panel>

      {/* Events List */}
      <Panel title={`Events${selectedDay ? ` — ${selectedDay}` : ''} (${filtered.length})`} className="col-span-6 row-span-4">
        <table className="bb-table">
          <thead>
            <tr><th>Day</th><th>Time</th><th></th><th>Event</th><th>Country</th><th className="text-right">Forecast</th><th className="text-right">Previous</th></tr>
          </thead>
          <tbody>
            {filtered.map((e, i) => (
              <tr key={i}>
                <td className="text-bb-amber">{e.date}</td>
                <td className="text-bb-muted">{e.time}</td>
                <td>
                  <span className={`inline-block w-2 h-2 rounded-full ${
                    e.impact === 'high' ? 'bg-bb-red' : e.impact === 'medium' ? 'bg-bb-yellow' : 'bg-bb-muted'
                  }`} />
                </td>
                <td className="font-bold">{e.event}</td>
                <td className="text-bb-muted">{e.country}</td>
                <td className="text-right text-bb-cyan">{e.forecast}</td>
                <td className="text-right text-bb-muted">{e.previous}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="text-center text-bb-muted py-4">No events match filters</td></tr>
            )}
          </tbody>
        </table>
      </Panel>

      {/* Key Indicators */}
      <Panel title="Latest Indicators" className="col-span-4 row-span-4">
        <table className="bb-table">
          <thead><tr><th>Indicator</th><th className="text-right">Actual</th><th className="text-right">Fcst</th><th className="text-right">Prev</th><th></th></tr></thead>
          <tbody>
            {economicIndicators.map(ind => (
              <tr key={ind.name}>
                <td className="text-bb-muted">{ind.name}</td>
                <td className="text-right font-bold">{ind.value}</td>
                <td className="text-right text-bb-cyan">{ind.forecast}</td>
                <td className="text-right text-bb-muted">{ind.previous}</td>
                <td>
                  <span className={`text-[8px] px-1 py-0.5 ${
                    ind.status === 'beat' ? 'text-bb-green' : ind.status === 'miss' ? 'text-bb-red' : 'text-bb-muted'
                  }`}>
                    {ind.status === 'beat' ? 'BEAT' : ind.status === 'miss' ? 'MISS' : 'INLINE'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
