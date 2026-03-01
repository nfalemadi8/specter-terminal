import { round } from './format';

// DCF Valuation
export function calculateDCF(eps, growthRate, discountRate, terminalGrowth, years = 10) {
  let totalPV = 0;
  let currentEPS = eps;
  for (let i = 1; i <= years; i++) {
    currentEPS *= (1 + growthRate / 100);
    totalPV += currentEPS / Math.pow(1 + discountRate / 100, i);
  }
  const terminalValue = (currentEPS * (1 + terminalGrowth / 100)) / (discountRate / 100 - terminalGrowth / 100);
  const pvTerminal = terminalValue / Math.pow(1 + discountRate / 100, years);
  return round(totalPV + pvTerminal, 2);
}

// Black-Scholes for options
export function blackScholes(S, K, T, r, sigma, type = 'call') {
  const d1 = (Math.log(S / K) + (r + sigma * sigma / 2) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);
  const Nd1 = normalCDF(d1);
  const Nd2 = normalCDF(d2);
  if (type === 'call') {
    return S * Nd1 - K * Math.exp(-r * T) * Nd2;
  }
  return K * Math.exp(-r * T) * (1 - Nd2) - S * (1 - Nd1);
}

function normalCDF(x) {
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429;
  const p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);
  const t = 1 / (1 + p * x);
  const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return 0.5 * (1 + sign * y);
}

// Greeks
export function calculateGreeks(S, K, T, r, sigma) {
  const d1 = (Math.log(S / K) + (r + sigma * sigma / 2) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);
  const nd1 = Math.exp(-d1 * d1 / 2) / Math.sqrt(2 * Math.PI);
  return {
    delta: round(normalCDF(d1), 4),
    gamma: round(nd1 / (S * sigma * Math.sqrt(T)), 6),
    theta: round(-(S * nd1 * sigma) / (2 * Math.sqrt(T)) - r * K * Math.exp(-r * T) * normalCDF(d2), 4),
    vega: round(S * nd1 * Math.sqrt(T) / 100, 4),
  };
}

// CSV export helper
export function exportToCSV(data, filename) {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row => headers.map(h => {
      const val = row[h];
      return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
    }).join(','))
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Currency conversion rates
export const currencyRates = {
  USD: 1,
  QAR: 3.64,
  AED: 3.67,
  SAR: 3.75,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.42,
  CHF: 0.878,
  CNY: 7.25,
  AUD: 1.53,
};

export function convertCurrency(amount, from, to) {
  const inUSD = from === 'USD' ? amount : amount / currencyRates[from];
  return to === 'USD' ? inUSD : inUSD * currencyRates[to];
}
