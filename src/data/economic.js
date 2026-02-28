export const economicIndicators = [
  { name: 'GDP Growth (Q3)', value: '4.9%', previous: '2.1%', forecast: '4.5%', status: 'beat' },
  { name: 'CPI YoY', value: '3.2%', previous: '3.7%', forecast: '3.3%', status: 'beat' },
  { name: 'Core CPI YoY', value: '4.0%', previous: '4.1%', forecast: '4.1%', status: 'beat' },
  { name: 'Unemployment Rate', value: '3.7%', previous: '3.8%', forecast: '3.8%', status: 'beat' },
  { name: 'Non-Farm Payrolls', value: '199K', previous: '150K', forecast: '180K', status: 'beat' },
  { name: 'Fed Funds Rate', value: '5.50%', previous: '5.50%', forecast: '5.50%', status: 'inline' },
  { name: 'PCE YoY', value: '3.0%', previous: '3.4%', forecast: '3.1%', status: 'beat' },
  { name: 'ISM Manufacturing', value: '46.7', previous: '46.7', forecast: '47.6', status: 'miss' },
  { name: 'Consumer Confidence', value: '102.0', previous: '99.1', forecast: '101.0', status: 'beat' },
  { name: 'Retail Sales MoM', value: '0.3%', previous: '-0.2%', forecast: '0.1%', status: 'beat' },
];

export const economicCalendar = [
  // US Events
  { date: 'Mon', time: '08:30', event: 'Retail Sales MoM', country: 'US', impact: 'high', forecast: '0.2%', previous: '0.3%', region: 'US' },
  { date: 'Mon', time: '10:00', event: 'Business Inventories', country: 'US', impact: 'low', forecast: '0.2%', previous: '0.4%', region: 'US' },
  { date: 'Tue', time: '08:30', event: 'Housing Starts', country: 'US', impact: 'medium', forecast: '1.35M', previous: '1.37M', region: 'US' },
  { date: 'Tue', time: '09:15', event: 'Industrial Production', country: 'US', impact: 'medium', forecast: '0.1%', previous: '-0.6%', region: 'US' },
  { date: 'Wed', time: '14:00', event: 'FOMC Minutes', country: 'US', impact: 'high', forecast: '-', previous: '-', region: 'US' },
  { date: 'Thu', time: '08:30', event: 'Initial Jobless Claims', country: 'US', impact: 'high', forecast: '215K', previous: '202K', region: 'US' },
  { date: 'Thu', time: '10:00', event: 'Existing Home Sales', country: 'US', impact: 'medium', forecast: '3.78M', previous: '3.79M', region: 'US' },
  { date: 'Fri', time: '09:45', event: 'S&P PMI Manufacturing', country: 'US', impact: 'high', forecast: '49.5', previous: '49.4', region: 'US' },
  { date: 'Fri', time: '10:00', event: 'Consumer Sentiment', country: 'US', impact: 'medium', forecast: '70.0', previous: '69.7', region: 'US' },
  // EU Events
  { date: 'Thu', time: '07:45', event: 'ECB Rate Decision', country: 'EU', impact: 'high', forecast: '4.50%', previous: '4.50%', region: 'EU' },
  { date: 'Fri', time: '05:00', event: 'EU CPI Flash Estimate YoY', country: 'EU', impact: 'high', forecast: '2.8%', previous: '2.9%', region: 'EU' },
  // UK Events
  { date: 'Thu', time: '07:00', event: 'BoE Rate Decision', country: 'GB', impact: 'high', forecast: '5.25%', previous: '5.25%', region: 'UK' },
  { date: 'Fri', time: '02:00', event: 'UK GDP QoQ', country: 'GB', impact: 'high', forecast: '0.1%', previous: '-0.1%', region: 'UK' },
  // Japan Events
  { date: 'Tue', time: '23:00', event: 'BoJ Rate Decision', country: 'JP', impact: 'high', forecast: '-0.10%', previous: '-0.10%', region: 'JP' },
  { date: 'Wed', time: '19:30', event: 'Japan CPI YoY', country: 'JP', impact: 'medium', forecast: '2.8%', previous: '3.0%', region: 'JP' },
  // China Events
  { date: 'Mon', time: '21:30', event: 'China CPI YoY', country: 'CN', impact: 'high', forecast: '-0.3%', previous: '-0.5%', region: 'CN' },
  { date: 'Wed', time: '21:00', event: 'China Industrial Production YoY', country: 'CN', impact: 'medium', forecast: '6.8%', previous: '6.6%', region: 'CN' },
  // GCC Events
  { date: 'Tue', time: '09:00', event: 'Qatar GDP QoQ', country: 'QA', impact: 'medium', forecast: '1.8%', previous: '1.5%', region: 'QA' },
  { date: 'Wed', time: '09:00', event: 'UAE PMI', country: 'AE', impact: 'medium', forecast: '56.4', previous: '56.1', region: 'AE' },
  { date: 'Mon', time: '09:00', event: 'Saudi Arabia PMI', country: 'SA', impact: 'medium', forecast: '57.2', previous: '57.5', region: 'AE' },
];

export const earningsCalendar = [
  { symbol: 'AAPL', name: 'Apple Inc.', date: 'Jan 25', estimate: '2.10', actual: null, surprise: null, time: 'AMC' },
  { symbol: 'MSFT', name: 'Microsoft', date: 'Jan 23', estimate: '2.78', actual: null, surprise: null, time: 'AMC' },
  { symbol: 'GOOGL', name: 'Alphabet', date: 'Jan 23', estimate: '1.59', actual: null, surprise: null, time: 'AMC' },
  { symbol: 'AMZN', name: 'Amazon', date: 'Feb 1', estimate: '0.80', actual: null, surprise: null, time: 'AMC' },
  { symbol: 'META', name: 'Meta Platforms', date: 'Jan 31', estimate: '4.96', actual: null, surprise: null, time: 'AMC' },
  { symbol: 'TSLA', name: 'Tesla', date: 'Jan 24', estimate: '0.74', actual: '0.71', surprise: '-4.1%', time: 'AMC' },
  { symbol: 'NFLX', name: 'Netflix', date: 'Jan 23', estimate: '2.22', actual: '2.11', surprise: '-5.0%', time: 'AMC' },
  { symbol: 'JPM', name: 'JPMorgan', date: 'Jan 12', estimate: '3.32', actual: '3.97', surprise: '+19.6%', time: 'BMO' },
  { symbol: 'BAC', name: 'Bank of America', date: 'Jan 12', estimate: '0.68', actual: '0.70', surprise: '+2.9%', time: 'BMO' },
  { symbol: 'UNH', name: 'UnitedHealth', date: 'Jan 12', estimate: '5.98', actual: '6.16', surprise: '+3.0%', time: 'BMO' },
];

export const fedRateHistory = [
  { date: '2023-12', rate: 5.50 },
  { date: '2023-11', rate: 5.50 },
  { date: '2023-09', rate: 5.50 },
  { date: '2023-07', rate: 5.50 },
  { date: '2023-05', rate: 5.25 },
  { date: '2023-03', rate: 5.00 },
  { date: '2023-01', rate: 4.75 },
  { date: '2022-12', rate: 4.50 },
  { date: '2022-11', rate: 4.00 },
  { date: '2022-09', rate: 3.25 },
  { date: '2022-07', rate: 2.50 },
  { date: '2022-06', rate: 1.75 },
];
