import { round } from '../utils/format';

export const commodities = [
  { symbol: 'GC', name: 'Gold', price: 2024.50, change: 12.30, changePct: 0.61, unit: '$/oz', category: 'Precious Metals', ytd: 8.4 },
  { symbol: 'SI', name: 'Silver', price: 24.18, change: 0.42, changePct: 1.77, unit: '$/oz', category: 'Precious Metals', ytd: -1.2 },
  { symbol: 'PL', name: 'Platinum', price: 912.40, change: -8.60, changePct: -0.93, unit: '$/oz', category: 'Precious Metals', ytd: -6.8 },
  { symbol: 'PA', name: 'Palladium', price: 1068.20, change: -22.40, changePct: -2.05, unit: '$/oz', category: 'Precious Metals', ytd: -28.4 },
  { symbol: 'CL', name: 'Crude Oil WTI', price: 78.42, change: -1.28, changePct: -1.61, unit: '$/bbl', category: 'Energy', ytd: -2.8 },
  { symbol: 'BZ', name: 'Brent Crude', price: 82.85, change: -0.94, changePct: -1.12, unit: '$/bbl', category: 'Energy', ytd: -1.5 },
  { symbol: 'NG', name: 'Natural Gas', price: 2.847, change: 0.062, changePct: 2.23, unit: '$/MMBtu', category: 'Energy', ytd: 18.2 },
  { symbol: 'HO', name: 'Heating Oil', price: 2.7845, change: -0.0312, changePct: -1.11, unit: '$/gal', category: 'Energy', ytd: -5.4 },
  { symbol: 'UX', name: 'Uranium', price: 56.80, change: 0.95, changePct: 1.70, unit: '$/lb', category: 'Energy', ytd: 12.6 },
  { symbol: 'ZC', name: 'Corn', price: 487.25, change: 3.50, changePct: 0.72, unit: 'c/bu', category: 'Agriculture', ytd: -8.5 },
  { symbol: 'ZW', name: 'Wheat', price: 612.50, change: -8.75, changePct: -1.41, unit: 'c/bu', category: 'Agriculture', ytd: -14.2 },
  { symbol: 'ZS', name: 'Soybeans', price: 1342.75, change: 11.25, changePct: 0.85, unit: 'c/bu', category: 'Agriculture', ytd: -4.8 },
  { symbol: 'CT', name: 'Cotton', price: 82.14, change: -0.67, changePct: -0.81, unit: 'c/lb', category: 'Agriculture', ytd: -2.1 },
  { symbol: 'KC', name: 'Coffee', price: 187.45, change: 4.20, changePct: 2.29, unit: 'c/lb', category: 'Agriculture', ytd: 22.8 },
  { symbol: 'SB', name: 'Sugar', price: 27.32, change: 0.18, changePct: 0.66, unit: 'c/lb', category: 'Agriculture', ytd: -12.4 },
  { symbol: 'HG', name: 'Copper', price: 3.842, change: 0.028, changePct: 0.73, unit: '$/lb', category: 'Industrial', ytd: 2.4 },
  { symbol: 'LI', name: 'Lithium', price: 15420, change: -185.00, changePct: -1.19, unit: '$/t', category: 'Industrial', ytd: -42.5 },
  { symbol: 'FE', name: 'Iron Ore', price: 128.50, change: 1.85, changePct: 1.46, unit: '$/t', category: 'Industrial', ytd: 5.8 },
  { symbol: 'AL', name: 'Aluminum', price: 2285, change: 18.40, changePct: 0.81, unit: '$/t', category: 'Industrial', ytd: -3.2 },
];

export function generateCommodityHistory(basePrice, days = 60) {
  const data = [];
  let price = basePrice;
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const volatility = (Math.random() - 0.5) * basePrice * 0.02;
    price = Math.max(price + volatility, basePrice * 0.8);
    data.push({
      date: date.toISOString().split('T')[0],
      price: round(price, 2),
    });
  }
  return data;
}
