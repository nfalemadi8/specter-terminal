import { useState, useEffect, useRef, useCallback } from 'react';
import { tabs } from '../../data/tabs';
import { universalSearch } from '../../services/dataProvider';
import { round } from '../../utils/format';

// Fuzzy match scoring
function fuzzyMatch(query, target) {
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  if (t === q) return 100;
  if (t.startsWith(q)) return 90;
  if (t.includes(q)) return 70;
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
  }
  return qi === q.length ? 50 : 0;
}

const TYPE_BADGE = {
  tab:       'bg-bb-amber/20 text-bb-amber',
  stock:     'bg-bb-blue/20 text-bb-blue',
  bond:      'bg-bb-green/20 text-bb-green',
  etf:       'bg-bb-cyan/20 text-bb-cyan',
  crypto:    'bg-bb-orange/20 text-bb-orange',
  index:     'bg-bb-yellow/20 text-bb-yellow',
  currency:  'bg-bb-blue/20 text-bb-blue',
  commodity: 'bg-bb-red/20 text-bb-red',
  command:   'bg-bb-cyan/20 text-bb-cyan',
};

const TYPE_TAB_MAP = {
  stock:     'equities',
  bond:      'fixedIncome',
  etf:       'etfs',
  crypto:    'crypto',
  index:     'indices',
  currency:  'forex',
  commodity: 'commodities',
};

export default function CommandBar({ onTabChange }) {
  const [input, setInput] = useState('');
  const [spotlight, setSpotlight] = useState(false);
  const [spotlightQuery, setSpotlightQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [assetResults, setAssetResults] = useState([]);
  const inputRef = useRef(null);
  const spotlightRef = useRef(null);
  const searchTimer = useRef(null);

  // Debounced async search for assets
  useEffect(() => {
    if (!spotlight || !spotlightQuery.trim()) {
      setAssetResults([]);
      return;
    }
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      universalSearch(spotlightQuery.trim()).then(setAssetResults);
    }, 150);
    return () => clearTimeout(searchTimer.current);
  }, [spotlight, spotlightQuery]);

  // Build search results — merge tabs, commands, and async asset results
  const results = spotlight && spotlightQuery.trim() ? (() => {
    const q = spotlightQuery.trim();
    const items = [];

    // Tabs
    tabs.forEach(t => {
      const score = Math.max(fuzzyMatch(q, t.label), fuzzyMatch(q, t.id));
      if (score > 0) items.push({ type: 'tab', id: t.id, label: t.label, shortcut: t.shortcut, score, action: () => { onTabChange(t.id); setSpotlight(false); } });
    });

    // Commands
    const commands = [
      { id: 'cmd:dashboard', label: 'Go to Dashboard', action: () => { onTabChange('dashboard'); setSpotlight(false); } },
      { id: 'cmd:settings', label: 'Open Settings', action: () => { onTabChange('settings'); setSpotlight(false); } },
      { id: 'cmd:alerts', label: 'View Alerts', action: () => { onTabChange('alerts'); setSpotlight(false); } },
      { id: 'cmd:watchlist', label: 'Open Watchlist', action: () => { onTabChange('watchlist'); setSpotlight(false); } },
      { id: 'cmd:search', label: 'Advanced Search (EQS)', action: () => { onTabChange('search'); setSpotlight(false); } },
      { id: 'cmd:portfolio', label: 'Portfolio Manager', action: () => { onTabChange('portfolio'); setSpotlight(false); } },
      { id: 'cmd:reference', label: 'Reference Guide', action: () => { onTabChange('reference'); setSpotlight(false); } },
    ];
    commands.forEach(c => {
      const score = fuzzyMatch(q, c.label);
      if (score > 0) items.push({ type: 'command', ...c, score });
    });

    // Asset results from universalSearch (bonds, ETFs, crypto, indices, currencies, commodities, stocks)
    assetResults.forEach(r => {
      const targetTab = TYPE_TAB_MAP[r.type] || 'equities';
      items.push({
        type: r.type,
        id: `${r.type}:${r.id}`,
        label: r.id,
        sublabel: r.name,
        detail: r.detail,
        score: 60, // ranked below exact tab/command matches
        action: () => { onTabChange(targetTab); setSpotlight(false); },
      });
    });

    // De-duplicate stocks (old tab search may overlap with universalSearch stocks)
    const seen = new Set();
    const deduped = [];
    for (const item of items.sort((a, b) => b.score - a.score)) {
      const key = item.id;
      if (!seen.has(key)) { seen.add(key); deduped.push(item); }
    }
    return deduped.slice(0, 20);
  })() : [];

  // Keyboard shortcuts: F1-F10, Ctrl+K, Esc
  const handleGlobalKeyDown = useCallback((e) => {
    // Ctrl+K — open spotlight
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      setSpotlight(true);
      setSpotlightQuery('');
      setSelectedIndex(0);
      return;
    }

    // Esc — close spotlight
    if (e.key === 'Escape') {
      if (spotlight) { setSpotlight(false); return; }
    }

    // F1-F10 — switch tabs (only when not in input)
    if (e.key.startsWith('F') && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const fNum = parseInt(e.key.slice(1));
      if (fNum >= 1 && fNum <= 10) {
        const tab = tabs.find(t => t.shortcut === `F${fNum}`);
        if (tab) {
          e.preventDefault();
          onTabChange(tab.id);
        }
      }
    }

    // 1-9 — quick tab switch (only when not focused on an input/textarea/select)
    const tag = document.activeElement?.tagName;
    if (!e.ctrlKey && !e.metaKey && !e.altKey && tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
      const num = parseInt(e.key);
      if (num >= 1 && num <= 9 && tabs[num - 1]) {
        e.preventDefault();
        onTabChange(tabs[num - 1].id);
      }
    }
  }, [onTabChange, spotlight]);

  useEffect(() => {
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handleGlobalKeyDown]);

  // Focus spotlight input when opened
  useEffect(() => {
    if (spotlight && spotlightRef.current) spotlightRef.current.focus();
  }, [spotlight]);

  // Spotlight keyboard navigation
  const handleSpotlightKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(i => Math.min(i + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(i => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (results[selectedIndex]) results[selectedIndex].action(); }
    else if (e.key === 'Escape') { setSpotlight(false); }
  };

  // CMD bar submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const cmd = input.trim().toUpperCase();
    const match = tabs.find(t => t.label === cmd || t.id.toUpperCase() === cmd);
    if (match) { onTabChange(match.id); setInput(''); return; }
    // Try asset search for quick navigation
    universalSearch(input.trim()).then(res => {
      if (res.length > 0) {
        const targetTab = TYPE_TAB_MAP[res[0].type] || 'equities';
        onTabChange(targetTab);
      }
    });
    setInput('');
  };

  return (
    <>
      {/* Spotlight Overlay */}
      {spotlight && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center pt-[15vh]" onClick={() => setSpotlight(false)}>
          <div role="dialog" aria-modal="true" aria-label="Command spotlight search" className="w-[90vw] max-w-[560px] bg-bb-panel border border-bb-amber/50 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center px-3 py-2 border-b border-bb-border">
              <span className="text-bb-amber text-[11px] font-bold mr-2" aria-hidden="true">SPECTER &gt;</span>
              <input
                ref={spotlightRef}
                type="text"
                role="combobox"
                aria-expanded={results.length > 0}
                aria-controls="spotlight-results"
                aria-activedescendant={results[selectedIndex] ? `result-${selectedIndex}` : undefined}
                value={spotlightQuery}
                onChange={e => { setSpotlightQuery(e.target.value); setSelectedIndex(0); }}
                onKeyDown={handleSpotlightKeyDown}
                className="flex-1 bg-transparent text-bb-white text-[12px] outline-none placeholder-bb-muted font-mono"
                placeholder="Search stocks, bonds, ETFs, crypto, indices, FX, commodities..."
                spellCheck={false}
                autoComplete="off"
              />
              <span className="text-bb-muted text-[9px] border border-bb-border px-1.5 py-0.5" aria-hidden="true">ESC</span>
            </div>

            <div id="spotlight-results" role="listbox" className="max-h-[350px] overflow-auto" aria-label="Search results">
              {results.length > 0 ? results.map((r, i) => (
                <div key={r.id} id={`result-${i}`} role="option" aria-selected={i === selectedIndex} onClick={() => r.action()}
                  className={`flex items-center px-3 py-1.5 cursor-pointer border-b border-bb-border/50 ${
                    i === selectedIndex ? 'bg-bb-amber/10' : 'hover:bg-bb-dark'
                  }`}>
                  <span className={`text-[7px] px-1.5 py-[1px] rounded mr-2 min-w-[35px] text-center ${TYPE_BADGE[r.type] || 'bg-bb-muted/20 text-bb-muted'}`}>
                    {r.type.toUpperCase()}
                  </span>

                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-bold text-bb-white">{r.label}</span>
                    {r.sublabel && <span className="text-[9px] text-bb-muted ml-2 truncate">{r.sublabel}</span>}
                  </div>

                  {r.detail && (
                    <span className="text-[9px] text-bb-muted ml-2 shrink-0">{r.detail}</span>
                  )}
                  {r.shortcut && <span className="text-[8px] text-bb-muted border border-bb-border px-1 py-[1px] ml-2">{r.shortcut}</span>}
                </div>
              )) : spotlightQuery.trim() ? (
                <div className="text-center text-bb-muted text-[10px] py-6">No results for &ldquo;{spotlightQuery}&rdquo;</div>
              ) : (
                <div className="px-3 py-2 text-[10px] text-bb-muted space-y-1">
                  <div className="text-bb-amber font-bold mb-1">Universal Search</div>
                  <div>Type a <span className="text-bb-amber">tab name</span> to navigate (e.g. &ldquo;dashboard&rdquo;, &ldquo;equities&rdquo;)</div>
                  <div>Type a <span className="text-bb-blue">stock ticker</span> (e.g. &ldquo;AAPL&rdquo;, &ldquo;NVDA&rdquo;, &ldquo;2222.SR&rdquo;)</div>
                  <div>Type a <span className="text-bb-green">bond</span>, <span className="text-bb-cyan">ETF</span>, <span className="text-bb-orange">crypto</span>, <span className="text-bb-yellow">index</span>, or <span className="text-bb-red">commodity</span></div>
                  <div>Type a <span className="text-bb-cyan">command</span> to execute (e.g. &ldquo;settings&rdquo;, &ldquo;alerts&rdquo;)</div>
                  <div className="border-t border-bb-border pt-1 mt-1 text-[9px]">
                    <span className="text-bb-muted">&uarr;&darr;</span> Navigate &nbsp;
                    <span className="text-bb-muted">Enter</span> Select &nbsp;
                    <span className="text-bb-muted">Esc</span> Close
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Command Bar — hidden on mobile */}
      <form
        onSubmit={handleSubmit}
        className="hidden sm:flex items-center px-3 py-[3px] bg-bb-dark border-t border-bb-border"
      >
        <span className="text-bb-amber text-[10px] font-bold mr-2">CMD &gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 bg-transparent text-bb-white text-[11px] outline-none placeholder-bb-muted font-mono"
          placeholder={`Type command or ticker... (${navigator.platform?.includes('Mac') ? '⌘' : 'Ctrl'}+K for search)`}
          spellCheck={false}
          autoComplete="off"
        />
        <button type="button" onClick={() => { setSpotlight(true); setSpotlightQuery(''); setSelectedIndex(0); }}
          className="text-bb-muted text-[9px] border border-bb-border px-1.5 py-0.5 mr-2 hover:text-bb-amber hover:border-bb-amber transition-colors">
          {navigator.platform?.includes('Mac') ? '⌘K' : 'Ctrl+K'}
        </button>
        <span className="text-bb-muted text-[10px]">SPECTER v3.0</span>
      </form>

      {/* Mobile FAB — visible only on mobile */}
      <button
        type="button"
        onClick={() => { setSpotlight(true); setSpotlightQuery(''); setSelectedIndex(0); }}
        className="sm:hidden fixed bottom-4 right-4 z-40 w-12 h-12 bg-bb-amber text-bb-black rounded-full shadow-lg flex items-center justify-center text-lg font-bold hover:bg-bb-amber/90 transition-colors"
        aria-label="Open command search"
      >
        ⌘
      </button>
    </>
  );
}
