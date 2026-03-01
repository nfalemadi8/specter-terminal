export default function LoadingFallback() {
  return (
    <div className="h-full bg-bb-black p-[3px]" role="status" aria-label="Loading module">
      <div className="h-full flex flex-col gap-[3px]">
        <div className="flex gap-[3px] flex-1">
          <div className="flex-[5] bb-panel flex flex-col">
            <div className="bb-panel-header animate-pulse">LOADING...</div>
            <div className="flex-1 p-2 space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-3 bg-bb-border/30 rounded-sm animate-pulse" style={{ width: `${70 + Math.random() * 30}%`, animationDelay: `${i * 100}ms` }} />
              ))}
            </div>
          </div>
          <div className="flex-[7] bb-panel flex flex-col">
            <div className="bb-panel-header animate-pulse opacity-50">&nbsp;</div>
            <div className="flex-1 p-2 flex items-center justify-center">
              <div className="text-center">
                <div className="text-bb-amber text-sm font-mono mb-2 blink">LOADING MODULE...</div>
                <div className="w-48 h-1 bg-bb-border mx-auto overflow-hidden">
                  <div className="h-full bg-bb-amber animate-pulse" style={{ width: '60%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-24 bb-panel flex flex-col">
          <div className="bb-panel-header animate-pulse opacity-50">&nbsp;</div>
          <div className="flex-1 p-2 space-y-1.5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-2.5 bg-bb-border/20 rounded-sm animate-pulse" style={{ width: `${50 + Math.random() * 50}%`, animationDelay: `${i * 150}ms` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
