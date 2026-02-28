export function formatNumber(num, decimals = 2) {
  if (num === null || num === undefined) return '-';
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatCurrency(num, decimals = 2) {
  if (num === null || num === undefined) return '-';
  return '$' + formatNumber(num, decimals);
}

export function formatPercent(num, decimals = 2) {
  if (num === null || num === undefined) return '-';
  const sign = num > 0 ? '+' : '';
  return sign + num.toFixed(decimals) + '%';
}

export function formatChange(num, decimals = 2) {
  if (num === null || num === undefined) return '-';
  const sign = num > 0 ? '+' : '';
  return sign + num.toFixed(decimals);
}

export function formatLargeNumber(num) {
  if (num === null || num === undefined) return '-';
  if (typeof num === 'string') {
    // Try to parse numeric strings
    const parsed = parseFloat(num.replace(/[^0-9.-]/g, ''));
    if (isNaN(parsed)) return num;
    num = parsed;
  }
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toString();
}

export function formatMcap(num) {
  if (num === null || num === undefined) return '-';
  if (typeof num === 'string') return num;
  if (num >= 1e12) return '$' + (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return '$' + (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return '$' + (num / 1e6).toFixed(2) + 'M';
  return '$' + num.toLocaleString('en-US');
}

export function colorClass(value) {
  if (value > 0) return 'positive';
  if (value < 0) return 'negative';
  return '';
}

export function currentTime() {
  return new Date().toLocaleTimeString('en-US', { hour12: false });
}

export function currentDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
