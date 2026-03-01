import { useState, useEffect } from 'react';
import { currentTime, currentDate } from '../../utils/format';

export default function Header() {
  const [time, setTime] = useState(currentTime());

  useEffect(() => {
    const interval = setInterval(() => setTime(currentTime()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex items-center justify-between px-2 sm:px-4 py-1 bg-bb-dark border-b border-bb-border">
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="text-bb-amber font-bold text-xs sm:text-sm tracking-wider">SPECTER</span>
        <span className="text-bb-muted text-[9px] sm:text-[10px] hidden sm:inline">TERMINAL v3.0</span>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <span className="text-bb-muted text-[9px] sm:text-[10px] hidden sm:inline">{currentDate()}</span>
        <span className="text-bb-green font-bold text-[10px] sm:text-xs">{time}</span>
        <span className="text-bb-green text-[9px] sm:text-[10px]">● LIVE</span>
      </div>
    </header>
  );
}
