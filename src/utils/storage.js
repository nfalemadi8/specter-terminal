const KEYS = {
  portfolio: 'specter-portfolio',
  watchlist: 'specter-watchlist',
  alerts: 'specter-alerts',
  fields: 'specter-fields',
  prefs: 'specter-prefs',
};

export function loadData(key) {
  try {
    const data = localStorage.getItem(KEYS[key] || key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function saveData(key, data) {
  try {
    localStorage.setItem(KEYS[key] || key, JSON.stringify(data));
  } catch {
    // Silently fail if localStorage is unavailable or quota exceeded
  }
}

export function clearData(key) {
  localStorage.removeItem(KEYS[key] || key);
}
