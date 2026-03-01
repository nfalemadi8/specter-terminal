// Safe rounding that avoids floating-point bugs with toFixed
export function round(value, decimals = 2) {
  if (value === null || value === undefined || isNaN(value)) return 0;
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

export function formatNumber(num, decimals = 2) {
  if (num === null || num === undefined) return '-';
  return round(num, decimals).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatCurrency(num, decimals = 2, currency = 'USD') {
  if (num === null || num === undefined) return '-';
  const prefixes = { USD: '$', QAR: 'QR ', AED: 'AED ', EUR: '€', GBP: '£', SAR: 'SR ', JPY: '¥' };
  const prefix = prefixes[currency] || '$';
  const abs = Math.abs(num);
  if (abs >= 1e12) return prefix + round(num / 1e12, 2) + 'T';
  if (abs >= 1e9) return prefix + round(num / 1e9, 2) + 'B';
  if (abs >= 1e6) return prefix + round(num / 1e6, 2) + 'M';
  if (abs >= 1e3 && decimals === 0) return prefix + round(num / 1e3, 1) + 'K';
  return prefix + formatNumber(num, decimals);
}

export function formatPercent(num, decimals = 2) {
  if (num === null || num === undefined) return '-';
  const sign = num > 0 ? '+' : '';
  return sign + round(num, decimals) + '%';
}

export function formatChange(num, decimals = 2) {
  if (num === null || num === undefined) return '-';
  const sign = num > 0 ? '+' : '';
  return sign + round(num, decimals);
}

export function formatLargeNumber(num) {
  if (num === null || num === undefined) return '-';
  if (typeof num === 'string') {
    const parsed = parseFloat(num.replace(/[^0-9.-]/g, ''));
    if (isNaN(parsed)) return num;
    num = parsed;
  }
  if (num >= 1e12) return round(num / 1e12, 2) + 'T';
  if (num >= 1e9) return round(num / 1e9, 2) + 'B';
  if (num >= 1e6) return round(num / 1e6, 2) + 'M';
  if (num >= 1e3) return round(num / 1e3, 2) + 'K';
  return num.toString();
}

export function formatMcap(num) {
  if (num === null || num === undefined) return '-';
  if (typeof num === 'string') return num;
  if (num >= 1e12) return '$' + round(num / 1e12, 2) + 'T';
  if (num >= 1e9) return '$' + round(num / 1e9, 2) + 'B';
  if (num >= 1e6) return '$' + round(num / 1e6, 2) + 'M';
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
