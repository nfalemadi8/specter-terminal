export const treasuries = [
  { maturity: '1M', yield: 5.53, change: 0.01, prev: 5.52, type: 'Government', duration: 0.08 },
  { maturity: '3M', yield: 5.47, change: -0.02, prev: 5.49, type: 'Government', duration: 0.25 },
  { maturity: '6M', yield: 5.38, change: -0.01, prev: 5.39, type: 'Government', duration: 0.50 },
  { maturity: '1Y', yield: 5.15, change: -0.03, prev: 5.18, type: 'Government', duration: 0.98 },
  { maturity: '2Y', yield: 4.87, change: -0.05, prev: 4.92, type: 'Government', duration: 1.94 },
  { maturity: '3Y', yield: 4.62, change: -0.04, prev: 4.66, type: 'Government', duration: 2.85 },
  { maturity: '5Y', yield: 4.38, change: -0.06, prev: 4.44, type: 'Government', duration: 4.62 },
  { maturity: '7Y', yield: 4.41, change: -0.05, prev: 4.46, type: 'Government', duration: 6.28 },
  { maturity: '10Y', yield: 4.28, change: -0.07, prev: 4.35, type: 'Government', duration: 8.54 },
  { maturity: '20Y', yield: 4.56, change: -0.04, prev: 4.60, type: 'Government', duration: 14.82 },
  { maturity: '30Y', yield: 4.42, change: -0.06, prev: 4.48, type: 'Government', duration: 19.64 },
];

export const corporateBonds = [
  { issuer: 'Apple Inc.', coupon: 3.85, maturity: '2028', rating: 'AA+', yield: 4.12, spread: 45, price: 97.82, type: 'Corporate', duration: 4.2 },
  { issuer: 'Microsoft', coupon: 3.50, maturity: '2030', rating: 'AAA', yield: 4.08, spread: 38, price: 96.45, type: 'Corporate', duration: 5.8 },
  { issuer: 'Amazon', coupon: 4.05, maturity: '2029', rating: 'AA', yield: 4.35, spread: 62, price: 98.12, type: 'Corporate', duration: 4.9 },
  { issuer: 'JPMorgan', coupon: 4.50, maturity: '2027', rating: 'A+', yield: 4.78, spread: 85, price: 99.15, type: 'Corporate', duration: 3.4 },
  { issuer: 'Goldman Sachs', coupon: 5.15, maturity: '2029', rating: 'A+', yield: 5.02, spread: 98, price: 100.48, type: 'Corporate', duration: 4.6 },
  { issuer: 'AT&T Inc.', coupon: 4.75, maturity: '2031', rating: 'BBB', yield: 5.62, spread: 148, price: 94.37, type: 'Corporate', duration: 6.4 },
  { issuer: 'Verizon', coupon: 4.40, maturity: '2030', rating: 'BBB+', yield: 5.28, spread: 125, price: 95.68, type: 'Corporate', duration: 5.6 },
  { issuer: 'Meta Platforms', coupon: 4.45, maturity: '2028', rating: 'AA-', yield: 4.52, spread: 55, price: 99.72, type: 'Corporate', duration: 3.8 },
  { issuer: 'Boeing Co.', coupon: 5.80, maturity: '2029', rating: 'BBB-', yield: 6.15, spread: 195, price: 98.24, type: 'Corporate', duration: 4.4 },
  { issuer: 'Ford Motor', coupon: 6.10, maturity: '2028', rating: 'BB+', yield: 6.85, spread: 268, price: 97.15, type: 'Corporate', duration: 3.6 },
  // Islamic Bonds (Sukuk)
  { issuer: 'QNB Sukuk', coupon: 4.60, maturity: '2029', rating: 'A', yield: 4.85, spread: 72, price: 98.45, type: 'Sukuk', duration: 4.8 },
  { issuer: 'DIB Sukuk', coupon: 4.90, maturity: '2028', rating: 'A-', yield: 5.12, spread: 95, price: 99.12, type: 'Sukuk', duration: 3.9 },
  { issuer: 'ISDB Sukuk', coupon: 3.75, maturity: '2030', rating: 'AAA', yield: 3.95, spread: 18, price: 97.85, type: 'Sukuk', duration: 5.6 },
  { issuer: 'Aldar Sukuk', coupon: 5.20, maturity: '2031', rating: 'BBB+', yield: 5.45, spread: 132, price: 98.68, type: 'Sukuk', duration: 6.2 },
];

export function generateYieldCurve() {
  const maturities = [0.08, 0.25, 0.5, 1, 2, 3, 5, 7, 10, 20, 30];
  const yields = [5.53, 5.47, 5.38, 5.15, 4.87, 4.62, 4.38, 4.41, 4.28, 4.56, 4.42];
  const labels = ['1M', '3M', '6M', '1Y', '2Y', '3Y', '5Y', '7Y', '10Y', '20Y', '30Y'];
  return labels.map((label, i) => ({
    label,
    maturity: maturities[i],
    yield: yields[i],
  }));
}
