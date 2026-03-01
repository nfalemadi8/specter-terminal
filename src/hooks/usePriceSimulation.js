import { useState, useEffect, useRef, useCallback } from 'react';
import { subscribeToPrices } from '../services/dataProvider';

// Read simulation settings from localStorage
function getSimSettings() {
  try {
    const raw = localStorage.getItem('specter-sim-settings');
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { enabled: true, intervalMs: 5000 };
}

export function saveSimSettings(settings) {
  localStorage.setItem('specter-sim-settings', JSON.stringify(settings));
}

/**
 * Hook for subscribing to real-time price simulation.
 * @param {string} assetType - 'stocks' | 'bonds' | 'crypto' | 'commodities' | 'forex'
 * @returns {{ prices: Array, changes: Map<string, 'up'|'down'|null> }}
 */
export function usePriceSimulation(assetType) {
  const [prices, setPrices] = useState([]);
  const [changes, setChanges] = useState(new Map());
  const prevPricesRef = useRef(new Map());

  useEffect(() => {
    const settings = getSimSettings();
    if (!settings.enabled) return;

    const unsubscribe = subscribeToPrices(assetType, (items) => {
      const newChanges = new Map();

      items.forEach(item => {
        const key = item.ticker || item.id || item.currency;
        const currentPrice = item.price || item.rate;
        const prevPrice = prevPricesRef.current.get(key);

        if (prevPrice !== undefined) {
          if (currentPrice > prevPrice) newChanges.set(key, 'up');
          else if (currentPrice < prevPrice) newChanges.set(key, 'down');
        }

        prevPricesRef.current.set(key, currentPrice);
      });

      setPrices(items);
      setChanges(newChanges);

      // Clear flash after 800ms
      setTimeout(() => setChanges(new Map()), 800);
    }, settings.intervalMs);

    return unsubscribe;
  }, [assetType]);

  const getFlashClass = useCallback((key) => {
    const dir = changes.get(key);
    if (dir === 'up') return 'price-flash-up';
    if (dir === 'down') return 'price-flash-down';
    return '';
  }, [changes]);

  return { prices, changes, getFlashClass };
}
