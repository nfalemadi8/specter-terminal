import { useState, useEffect } from 'react';
import { currentTime, currentDate } from '../../utils/format';

export default function Header() {
  const [time, setTime] = useState(currentTime());

  useEffect(() => {
    const interval = setInterval(() => setTime(currentTime()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex items-center justify-between px-4 py-1 bg-bb-dark border-b border-bb-border">
      <div className="flex items-center gap-3">
        <span className="text-bb-amber font-bold text-sm tracking-wider">SPECTER</span>
        <span className="text-bb-muted text-[10px]">TERMINAL v3.0</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-bb-muted text-[10px]">{currentDate()}</span>
        <span className="text-bb-green font-bold text-xs">{time}</span>
        <span className="text-bb-green text-[10px]">● LIVE</span>
      </div>
    </header>
  );
}
