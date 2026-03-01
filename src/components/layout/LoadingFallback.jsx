export default function LoadingFallback() {
  return (
    <div className="h-full flex items-center justify-center bg-bb-black" role="status" aria-label="Loading module">
      <div className="text-center">
        <div className="text-bb-amber text-sm font-mono mb-2 blink">LOADING MODULE...</div>
        <div className="w-48 h-1 bg-bb-border mx-auto overflow-hidden">
          <div className="h-full bg-bb-amber animate-pulse" style={{ width: '60%' }} />
        </div>
      </div>
    </div>
  );
}
