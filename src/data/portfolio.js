export const portfolioHoldings = [
  { symbol: 'AAPL', shares: 150, avgCost: 142.50, current: 189.84, sector: 'Technology' },
  { symbol: 'MSFT', shares: 80, avgCost: 285.20, current: 378.91, sector: 'Technology' },
  { symbol: 'GOOGL', shares: 120, avgCost: 108.75, current: 141.80, sector: 'Technology' },
  { symbol: 'AMZN', shares: 100, avgCost: 125.40, current: 178.25, sector: 'Consumer Discretionary' },
  { symbol: 'NVDA', shares: 60, avgCost: 245.80, current: 495.22, sector: 'Technology' },
  { symbol: 'JPM', shares: 200, avgCost: 138.90, current: 172.96, sector: 'Financials' },
  { symbol: 'JNJ', shares: 150, avgCost: 162.30, current: 156.74, sector: 'Healthcare' },
  { symbol: 'V', shares: 75, avgCost: 218.45, current: 261.38, sector: 'Financials' },
  { symbol: 'XOM', shares: 180, avgCost: 88.20, current: 104.57, sector: 'Energy' },
  { symbol: 'UNH', shares: 40, avgCost: 475.60, current: 527.82, sector: 'Healthcare' },
  { symbol: 'PG', shares: 100, avgCost: 138.70, current: 152.19, sector: 'Consumer Staples' },
  { symbol: 'HD', shares: 45, avgCost: 288.50, current: 312.64, sector: 'Consumer Discretionary' },
];

export function calculatePortfolioMetrics(holdings) {
  let totalValue = 0;
  let totalCost = 0;

  const detailed = holdings.map(h => {
    const marketValue = h.shares * h.current;
    const costBasis = h.shares * h.avgCost;
    const gainLoss = marketValue - costBasis;
    const gainLossPct = ((h.current - h.avgCost) / h.avgCost) * 100;
    totalValue += marketValue;
    totalCost += costBasis;
    return { ...h, marketValue, costBasis, gainLoss, gainLossPct };
  });

  const withWeight = detailed.map(h => ({
    ...h,
    weight: (h.marketValue / totalValue) * 100,
  }));

  return {
    holdings: withWeight,
    totalValue,
    totalCost,
    totalGainLoss: totalValue - totalCost,
    totalGainLossPct: ((totalValue - totalCost) / totalCost) * 100,
  };
}

export const portfolioHistory = Array.from({ length: 90 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (89 - i));
  const base = 350000;
  const trend = i * 800;
  const noise = (Math.random() - 0.5) * 15000;
  return {
    date: date.toISOString().split('T')[0],
    value: Math.round(base + trend + noise),
  };
});

export const sectorAllocation = [
  { name: 'Technology', value: 45.2, color: '#4a9eff' },
  { name: 'Financials', value: 18.7, color: '#00d26a' },
  { name: 'Healthcare', value: 12.8, color: '#ff8c00' },
  { name: 'Consumer Disc.', value: 10.4, color: '#ffd700' },
  { name: 'Energy', value: 7.5, color: '#ff3b3b' },
  { name: 'Consumer Staples', value: 5.4, color: '#00e5ff' },
];
