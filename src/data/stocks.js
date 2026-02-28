// Major equities with simulated market data
export const stocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 189.84, change: 2.31, changePct: 1.23, volume: '58.2M', marketCap: '2.95T', pe: 31.2, high52: 199.62, low52: 143.90, sector: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.91, change: -1.45, changePct: -0.38, volume: '22.1M', marketCap: '2.81T', pe: 35.8, high52: 384.30, low52: 275.37, sector: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 141.80, change: 0.97, changePct: 0.69, volume: '25.8M', marketCap: '1.78T', pe: 25.4, high52: 153.78, low52: 115.35, sector: 'Technology' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.25, change: 3.12, changePct: 1.78, volume: '48.3M', marketCap: '1.85T', pe: 58.7, high52: 189.77, low52: 118.35, sector: 'Consumer Discretionary' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 495.22, change: 12.87, changePct: 2.67, volume: '42.5M', marketCap: '1.22T', pe: 65.3, high52: 505.48, low52: 222.97, sector: 'Technology' },
  { symbol: 'META', name: 'Meta Platforms', price: 356.02, change: -4.18, changePct: -1.16, volume: '18.7M', marketCap: '914.8B', pe: 28.9, high52: 382.18, low52: 244.61, sector: 'Technology' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.48, change: 8.92, changePct: 3.72, volume: '112.4M', marketCap: '789.2B', pe: 78.4, high52: 299.29, low52: 152.37, sector: 'Consumer Discretionary' },
  { symbol: 'BRK.B', name: 'Berkshire Hathaway', price: 363.27, change: 0.84, changePct: 0.23, volume: '3.2M', marketCap: '786.5B', pe: 8.9, high52: 373.34, low52: 309.45, sector: 'Financials' },
  { symbol: 'JPM', name: 'JPMorgan Chase', price: 172.96, change: 1.53, changePct: 0.89, volume: '8.9M', marketCap: '498.2B', pe: 11.2, high52: 178.64, low52: 135.19, sector: 'Financials' },
  { symbol: 'V', name: 'Visa Inc.', price: 261.38, change: -0.72, changePct: -0.27, volume: '6.1M', marketCap: '536.4B', pe: 30.5, high52: 268.95, low52: 221.68, sector: 'Financials' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', price: 156.74, change: -0.38, changePct: -0.24, volume: '7.4M', marketCap: '378.1B', pe: 22.8, high52: 175.97, low52: 150.82, sector: 'Healthcare' },
  { symbol: 'WMT', name: 'Walmart Inc.', price: 163.42, change: 1.08, changePct: 0.67, volume: '5.8M', marketCap: '438.9B', pe: 27.3, high52: 167.87, low52: 143.15, sector: 'Consumer Staples' },
  { symbol: 'XOM', name: 'Exxon Mobil', price: 104.57, change: -2.31, changePct: -2.16, volume: '14.2M', marketCap: '417.3B', pe: 11.8, high52: 120.70, low52: 95.77, sector: 'Energy' },
  { symbol: 'UNH', name: 'UnitedHealth Group', price: 527.82, change: 3.94, changePct: 0.75, volume: '3.1M', marketCap: '487.6B', pe: 23.1, high52: 558.10, low52: 445.68, sector: 'Healthcare' },
  { symbol: 'HD', name: 'Home Depot', price: 312.64, change: -1.87, changePct: -0.59, volume: '4.2M', marketCap: '311.8B', pe: 22.7, high52: 338.42, low52: 275.11, sector: 'Consumer Discretionary' },
  { symbol: 'PG', name: 'Procter & Gamble', price: 152.19, change: 0.41, changePct: 0.27, volume: '5.9M', marketCap: '358.4B', pe: 25.6, high52: 161.53, low52: 141.45, sector: 'Consumer Staples' },
  { symbol: 'MA', name: 'Mastercard Inc.', price: 412.80, change: 2.15, changePct: 0.52, volume: '3.8M', marketCap: '384.7B', pe: 34.2, high52: 425.88, low52: 346.22, sector: 'Financials' },
  { symbol: 'DIS', name: 'Walt Disney Co.', price: 92.45, change: -0.62, changePct: -0.67, volume: '9.7M', marketCap: '169.2B', pe: 42.1, high52: 123.74, low52: 78.73, sector: 'Communication Services' },
  { symbol: 'BAC', name: 'Bank of America', price: 33.17, change: 0.28, changePct: 0.85, volume: '31.2M', marketCap: '262.4B', pe: 10.4, high52: 38.60, low52: 26.45, sector: 'Financials' },
  { symbol: 'NFLX', name: 'Netflix Inc.', price: 484.07, change: 7.63, changePct: 1.60, volume: '5.4M', marketCap: '213.1B', pe: 45.8, high52: 505.20, low52: 344.73, sector: 'Communication Services' },
];

// Generate historical price data for charts
export function generatePriceHistory(basePrice, days = 90) {
  const data = [];
  let price = basePrice * 0.85;
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const volatility = (Math.random() - 0.48) * basePrice * 0.03;
    price = Math.max(price + volatility, basePrice * 0.7);
    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2)),
      volume: Math.floor(Math.random() * 50000000) + 10000000,
      open: parseFloat((price + (Math.random() - 0.5) * 2).toFixed(2)),
      high: parseFloat((price + Math.random() * 3).toFixed(2)),
      low: parseFloat((price - Math.random() * 3).toFixed(2)),
    });
  }
  return data;
}

// S&P 500 sector performance
export const sectorPerformance = [
  { sector: 'Technology', change: 2.14, ytd: 38.7, weight: 28.1 },
  { sector: 'Healthcare', change: 0.43, ytd: 2.1, weight: 13.2 },
  { sector: 'Financials', change: 0.87, ytd: 9.8, weight: 12.8 },
  { sector: 'Consumer Disc.', change: 1.52, ytd: 28.4, weight: 10.7 },
  { sector: 'Comm. Services', change: 0.31, ytd: 42.1, weight: 8.9 },
  { sector: 'Industrials', change: -0.22, ytd: 8.2, weight: 8.6 },
  { sector: 'Consumer Staples', change: 0.15, ytd: -2.3, weight: 6.4 },
  { sector: 'Energy', change: -1.38, ytd: -3.8, weight: 4.3 },
  { sector: 'Utilities', change: 0.62, ytd: -8.1, weight: 2.5 },
  { sector: 'Real Estate', change: -0.41, ytd: -4.2, weight: 2.4 },
  { sector: 'Materials', change: 0.08, ytd: 5.7, weight: 2.1 },
];

// Market indices
export const indices = [
  { symbol: 'SPX', name: 'S&P 500', price: 4567.18, change: 26.83, changePct: 0.59 },
  { symbol: 'DJIA', name: 'Dow Jones', price: 35430.42, change: 132.28, changePct: 0.37 },
  { symbol: 'COMP', name: 'Nasdaq Comp.', price: 14258.49, change: 118.24, changePct: 0.84 },
  { symbol: 'RUT', name: 'Russell 2000', price: 1862.64, change: -8.37, changePct: -0.45 },
  { symbol: 'VIX', name: 'CBOE VIX', price: 14.21, change: -0.84, changePct: -5.58 },
  { symbol: 'DXY', name: 'US Dollar Index', price: 103.42, change: 0.18, changePct: 0.17 },
];
