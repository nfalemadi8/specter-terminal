// globalMarkets.js — Specter Terminal Global Data Layer
// Auto-generated comprehensive market data


// Price history generator
export function generatePriceHistory(base, days = 30, volatility = 0.02) {
  const arr = [];
  let p = base * (1 + (Math.random() - 0.5) * volatility * 2);
  for (let i = 0; i < days; i++) {
    p *= 1 + (Math.random() - 0.5) * volatility;
    arr.push(Math.round(p * 100) / 100);
  }
  return arr;
}

function genYieldHistory(base, days = 30) {
  const arr = [];
  let y = base;
  for (let i = 0; i < days; i++) {
    y += (Math.random() - 0.5) * 0.03;
    arr.push(Math.round(y * 1000) / 1000);
  }
  return arr;
}

function genQuarterlyRevenue(base) {
  return Array.from({ length: 8 }, () => Math.round(base * (0.9 + Math.random() * 0.2) * 10) / 10);
}

function genQuarterlyEps(base) {
  return Array.from({ length: 8 }, () => Math.round(base * (0.85 + Math.random() * 0.3) * 100) / 100);
}


export const EXCHANGES = {
  // North America
  NYSE: { name: 'New York Stock Exchange', country: 'US', currency: 'USD', timezone: 'America/New_York', open: '09:30', close: '16:00', preMarket: '04:00', afterHours: '20:00' },
  NASDAQ: { name: 'NASDAQ', country: 'US', currency: 'USD', timezone: 'America/New_York', open: '09:30', close: '16:00', preMarket: '04:00', afterHours: '20:00' },
  TSX: { name: 'Toronto Stock Exchange', country: 'CA', currency: 'CAD', timezone: 'America/Toronto', open: '09:30', close: '16:00', preMarket: '07:00', afterHours: '17:00' },
  // Europe
  LSE: { name: 'London Stock Exchange', country: 'GB', currency: 'GBP', timezone: 'Europe/London', open: '08:00', close: '16:30', preMarket: '07:00', afterHours: '17:00' },
  XETRA: { name: 'Deutsche Börse (Xetra)', country: 'DE', currency: 'EUR', timezone: 'Europe/Berlin', open: '09:00', close: '17:30', preMarket: '08:00', afterHours: '18:00' },
  EURONEXT: { name: 'Euronext Paris', country: 'FR', currency: 'EUR', timezone: 'Europe/Paris', open: '09:00', close: '17:30', preMarket: '07:15', afterHours: '18:00' },
  SIX: { name: 'SIX Swiss Exchange', country: 'CH', currency: 'CHF', timezone: 'Europe/Zurich', open: '09:00', close: '17:30', preMarket: '08:00', afterHours: '18:00' },
  BOLSA_MADRID: { name: 'Bolsa de Madrid', country: 'ES', currency: 'EUR', timezone: 'Europe/Madrid', open: '09:00', close: '17:30', preMarket: '08:30', afterHours: '18:00' },
  BORSA_ITALIANA: { name: 'Borsa Italiana', country: 'IT', currency: 'EUR', timezone: 'Europe/Rome', open: '09:00', close: '17:30', preMarket: '08:00', afterHours: '18:00' },
  MOEX: { name: 'Moscow Exchange', country: 'RU', currency: 'RUB', timezone: 'Europe/Moscow', open: '10:00', close: '18:50', preMarket: '09:50', afterHours: '19:00' },
  NASDAQ_NORDIC: { name: 'Nasdaq Nordic (Stockholm)', country: 'SE', currency: 'SEK', timezone: 'Europe/Stockholm', open: '09:00', close: '17:30', preMarket: '08:00', afterHours: '18:00' },
  ISE: { name: 'Irish Stock Exchange', country: 'IE', currency: 'EUR', timezone: 'Europe/Dublin', open: '08:00', close: '16:30', preMarket: '07:15', afterHours: '17:00' },
  WSE: { name: 'Warsaw Stock Exchange', country: 'PL', currency: 'PLN', timezone: 'Europe/Warsaw', open: '09:00', close: '17:05', preMarket: '08:30', afterHours: '17:30' },
  ATHEX: { name: 'Athens Stock Exchange', country: 'GR', currency: 'EUR', timezone: 'Europe/Athens', open: '10:00', close: '17:20', preMarket: '09:45', afterHours: '17:30' },
  BIST: { name: 'Borsa Istanbul', country: 'TR', currency: 'TRY', timezone: 'Europe/Istanbul', open: '10:00', close: '18:00', preMarket: '09:40', afterHours: '18:10' },
  // Asia-Pacific
  TSE_TOKYO: { name: 'Tokyo Stock Exchange', country: 'JP', currency: 'JPY', timezone: 'Asia/Tokyo', open: '09:00', close: '15:00', preMarket: '08:00', afterHours: '15:30' },
  SSE: { name: 'Shanghai Stock Exchange', country: 'CN', currency: 'CNY', timezone: 'Asia/Shanghai', open: '09:30', close: '15:00', preMarket: '09:15', afterHours: '15:00' },
  SZSE: { name: 'Shenzhen Stock Exchange', country: 'CN', currency: 'CNY', timezone: 'Asia/Shanghai', open: '09:30', close: '15:00', preMarket: '09:15', afterHours: '15:00' },
  HKEX: { name: 'Hong Kong Stock Exchange', country: 'HK', currency: 'HKD', timezone: 'Asia/Hong_Kong', open: '09:30', close: '16:00', preMarket: '09:00', afterHours: '16:10' },
  BSE: { name: 'Bombay Stock Exchange', country: 'IN', currency: 'INR', timezone: 'Asia/Kolkata', open: '09:15', close: '15:30', preMarket: '09:00', afterHours: '15:40' },
  NSE_INDIA: { name: 'National Stock Exchange India', country: 'IN', currency: 'INR', timezone: 'Asia/Kolkata', open: '09:15', close: '15:30', preMarket: '09:00', afterHours: '15:40' },
  KRX: { name: 'Korea Exchange', country: 'KR', currency: 'KRW', timezone: 'Asia/Seoul', open: '09:00', close: '15:30', preMarket: '08:30', afterHours: '18:00' },
  TWSE: { name: 'Taiwan Stock Exchange', country: 'TW', currency: 'TWD', timezone: 'Asia/Taipei', open: '09:00', close: '13:30', preMarket: '08:30', afterHours: '14:00' },
  SGX: { name: 'Singapore Exchange', country: 'SG', currency: 'SGD', timezone: 'Asia/Singapore', open: '09:00', close: '17:00', preMarket: '08:30', afterHours: '17:06' },
  ASX: { name: 'Australian Securities Exchange', country: 'AU', currency: 'AUD', timezone: 'Australia/Sydney', open: '10:00', close: '16:00', preMarket: '07:00', afterHours: '16:12' },
  NZX: { name: 'New Zealand Exchange', country: 'NZ', currency: 'NZD', timezone: 'Pacific/Auckland', open: '10:00', close: '16:45', preMarket: '09:00', afterHours: '17:00' },
  SET: { name: 'Stock Exchange of Thailand', country: 'TH', currency: 'THB', timezone: 'Asia/Bangkok', open: '10:00', close: '16:30', preMarket: '09:30', afterHours: '17:00' },
  IDX: { name: 'Indonesia Stock Exchange', country: 'ID', currency: 'IDR', timezone: 'Asia/Jakarta', open: '09:00', close: '15:00', preMarket: '08:45', afterHours: '15:15' },
  BURSA: { name: 'Bursa Malaysia', country: 'MY', currency: 'MYR', timezone: 'Asia/Kuala_Lumpur', open: '09:00', close: '17:00', preMarket: '08:30', afterHours: '17:10' },
  PSE: { name: 'Philippine Stock Exchange', country: 'PH', currency: 'PHP', timezone: 'Asia/Manila', open: '09:30', close: '15:30', preMarket: '09:00', afterHours: '15:30' },
  HOSE: { name: 'Ho Chi Minh Stock Exchange', country: 'VN', currency: 'VND', timezone: 'Asia/Ho_Chi_Minh', open: '09:00', close: '15:00', preMarket: '08:30', afterHours: '15:00' },
  // Middle East & GCC
  TADAWUL: { name: 'Saudi Exchange (Tadawul)', country: 'SA', currency: 'SAR', timezone: 'Asia/Riyadh', open: '10:00', close: '15:00', preMarket: '09:30', afterHours: '15:10' },
  DFM: { name: 'Dubai Financial Market', country: 'AE', currency: 'AED', timezone: 'Asia/Dubai', open: '10:00', close: '14:00', preMarket: '09:30', afterHours: '14:15' },
  ADX: { name: 'Abu Dhabi Securities Exchange', country: 'AE', currency: 'AED', timezone: 'Asia/Dubai', open: '10:00', close: '14:00', preMarket: '09:30', afterHours: '14:15' },
  QSE: { name: 'Qatar Stock Exchange', country: 'QA', currency: 'QAR', timezone: 'Asia/Qatar', open: '09:30', close: '13:15', preMarket: '09:00', afterHours: '13:25' },
  BHB: { name: 'Bahrain Bourse', country: 'BH', currency: 'BHD', timezone: 'Asia/Bahrain', open: '09:30', close: '13:00', preMarket: '09:15', afterHours: '13:15' },
  MSM: { name: 'Muscat Securities Market', country: 'OM', currency: 'OMR', timezone: 'Asia/Muscat', open: '10:00', close: '13:00', preMarket: '09:30', afterHours: '13:15' },
  BK: { name: 'Boursa Kuwait', country: 'KW', currency: 'KWD', timezone: 'Asia/Kuwait', open: '09:00', close: '12:40', preMarket: '08:30', afterHours: '13:00' },
  TASE: { name: 'Tel Aviv Stock Exchange', country: 'IL', currency: 'ILS', timezone: 'Asia/Jerusalem', open: '09:59', close: '17:14', preMarket: '09:00', afterHours: '17:25' },
  ASE: { name: 'Amman Stock Exchange', country: 'JO', currency: 'JOD', timezone: 'Asia/Amman', open: '10:00', close: '12:30', preMarket: '09:30', afterHours: '13:00' },
  EGX: { name: 'Egyptian Exchange', country: 'EG', currency: 'EGP', timezone: 'Africa/Cairo', open: '10:00', close: '14:30', preMarket: '09:30', afterHours: '14:45' },
  CSE_CASA: { name: 'Casablanca Stock Exchange', country: 'MA', currency: 'MAD', timezone: 'Africa/Casablanca', open: '09:30', close: '15:30', preMarket: '09:00', afterHours: '15:40' },
  // Africa
  JSE: { name: 'Johannesburg Stock Exchange', country: 'ZA', currency: 'ZAR', timezone: 'Africa/Johannesburg', open: '09:00', close: '17:00', preMarket: '08:30', afterHours: '17:10' },
  NGX: { name: 'Nigerian Exchange', country: 'NG', currency: 'NGN', timezone: 'Africa/Lagos', open: '09:30', close: '14:30', preMarket: '09:00', afterHours: '14:45' },
  NSE_NAIROBI: { name: 'Nairobi Securities Exchange', country: 'KE', currency: 'KES', timezone: 'Africa/Nairobi', open: '09:00', close: '15:00', preMarket: '08:30', afterHours: '15:10' },
  // Latin America
  B3: { name: 'B3 (Brasil Bolsa Balcão)', country: 'BR', currency: 'BRL', timezone: 'America/Sao_Paulo', open: '10:00', close: '17:00', preMarket: '09:45', afterHours: '17:30' },
  BMV: { name: 'Bolsa Mexicana de Valores', country: 'MX', currency: 'MXN', timezone: 'America/Mexico_City', open: '08:30', close: '15:00', preMarket: '08:00', afterHours: '15:00' },
  BCBA: { name: 'Buenos Aires Stock Exchange', country: 'AR', currency: 'ARS', timezone: 'America/Argentina/Buenos_Aires', open: '11:00', close: '17:00', preMarket: '10:00', afterHours: '17:15' },
  BCS: { name: 'Santiago Stock Exchange', country: 'CL', currency: 'CLP', timezone: 'America/Santiago', open: '09:30', close: '16:00', preMarket: '08:30', afterHours: '16:30' },
  BVL: { name: 'Lima Stock Exchange', country: 'PE', currency: 'PEN', timezone: 'America/Lima', open: '09:00', close: '16:00', preMarket: '08:30', afterHours: '16:15' },
  BVC: { name: 'Colombia Stock Exchange', country: 'CO', currency: 'COP', timezone: 'America/Bogota', open: '09:30', close: '16:00', preMarket: '09:00', afterHours: '16:15' },
};

export function getExchangeStatus(exchangeKey) {
  const ex = EXCHANGES[exchangeKey];
  if (!ex) return 'unknown';
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: ex.timezone,
      hour: '2-digit', minute: '2-digit',
      hour12: false,
    });
    const parts = formatter.formatToParts(now);
    const h = parseInt(parts.find(p => p.type === 'hour').value);
    const m = parseInt(parts.find(p => p.type === 'minute').value);
    const t = h * 60 + m;
    const dayFormatter = new Intl.DateTimeFormat('en-US', { timeZone: ex.timezone, weekday: 'short' });
    const day = dayFormatter.format(now);
    if (day === 'Sat' || day === 'Sun') return 'closed';
    const [oh, om] = ex.open.split(':').map(Number);
    const [ch, cm] = ex.close.split(':').map(Number);
    const [ph, pm] = ex.preMarket.split(':').map(Number);
    const [ah, am] = ex.afterHours.split(':').map(Number);
    const openT = oh * 60 + om, closeT = ch * 60 + cm;
    const preT = ph * 60 + pm, afterT = ah * 60 + am;
    if (t >= openT && t < closeT) return 'open';
    if (t >= preT && t < openT) return 'pre-market';
    if (t >= closeT && t < afterT) return 'after-hours';
    return 'closed';
  } catch { return 'closed'; }
}


export const CURRENCIES = {
  USD: { name: 'US Dollar', symbol: '$', rate: 1 },
  EUR: { name: 'Euro', symbol: '€', rate: 0.92 },
  GBP: { name: 'British Pound', symbol: '£', rate: 0.79 },
  JPY: { name: 'Japanese Yen', symbol: '¥', rate: 149.42 },
  CHF: { name: 'Swiss Franc', symbol: 'CHF', rate: 0.878 },
  CAD: { name: 'Canadian Dollar', symbol: 'C$', rate: 1.36 },
  AUD: { name: 'Australian Dollar', symbol: 'A$', rate: 1.53 },
  NZD: { name: 'New Zealand Dollar', symbol: 'NZ$', rate: 1.62 },
  SEK: { name: 'Swedish Krona', symbol: 'kr', rate: 10.42 },
  NOK: { name: 'Norwegian Krone', symbol: 'kr', rate: 10.55 },
  CNY: { name: 'Chinese Yuan', symbol: '¥', rate: 7.25 },
  HKD: { name: 'Hong Kong Dollar', symbol: 'HK$', rate: 7.82 },
  SGD: { name: 'Singapore Dollar', symbol: 'S$', rate: 1.34 },
  INR: { name: 'Indian Rupee', symbol: '₹', rate: 83.12 },
  KRW: { name: 'South Korean Won', symbol: '₩', rate: 1325.50 },
  TWD: { name: 'Taiwan Dollar', symbol: 'NT$', rate: 31.45 },
  THB: { name: 'Thai Baht', symbol: '฿', rate: 35.28 },
  MYR: { name: 'Malaysian Ringgit', symbol: 'RM', rate: 4.68 },
  IDR: { name: 'Indonesian Rupiah', symbol: 'Rp', rate: 15650 },
  PHP: { name: 'Philippine Peso', symbol: '₱', rate: 55.82 },
  VND: { name: 'Vietnamese Dong', symbol: '₫', rate: 24500 },
  QAR: { name: 'Qatari Riyal', symbol: 'QR', rate: 3.64 },
  AED: { name: 'UAE Dirham', symbol: 'AED', rate: 3.67 },
  SAR: { name: 'Saudi Riyal', symbol: 'SR', rate: 3.75 },
  KWD: { name: 'Kuwaiti Dinar', symbol: 'KD', rate: 0.307 },
  BHD: { name: 'Bahraini Dinar', symbol: 'BD', rate: 0.376 },
  OMR: { name: 'Omani Rial', symbol: 'OMR', rate: 0.385 },
  JOD: { name: 'Jordanian Dinar', symbol: 'JD', rate: 0.709 },
  EGP: { name: 'Egyptian Pound', symbol: 'E£', rate: 30.90 },
  ILS: { name: 'Israeli Shekel', symbol: '₪', rate: 3.68 },
  MAD: { name: 'Moroccan Dirham', symbol: 'MAD', rate: 10.05 },
  BRL: { name: 'Brazilian Real', symbol: 'R$', rate: 4.97 },
  MXN: { name: 'Mexican Peso', symbol: 'MX$', rate: 17.15 },
  ZAR: { name: 'South African Rand', symbol: 'R', rate: 18.65 },
  TRY: { name: 'Turkish Lira', symbol: '₺', rate: 28.85 },
  RUB: { name: 'Russian Ruble', symbol: '₽', rate: 91.50 },
  PLN: { name: 'Polish Zloty', symbol: 'zł', rate: 4.02 },
  CZK: { name: 'Czech Koruna', symbol: 'Kč', rate: 22.85 },
  HUF: { name: 'Hungarian Forint', symbol: 'Ft', rate: 352.50 },
  ARS: { name: 'Argentine Peso', symbol: 'AR$', rate: 350.50 },
  CLP: { name: 'Chilean Peso', symbol: 'CL$', rate: 895.20 },
  COP: { name: 'Colombian Peso', symbol: 'COL$', rate: 3925 },
  PEN: { name: 'Peruvian Sol', symbol: 'S/', rate: 3.72 },
  NGN: { name: 'Nigerian Naira', symbol: '₦', rate: 775.50 },
  KES: { name: 'Kenyan Shilling', symbol: 'KSh', rate: 152.80 },
  DKK: { name: 'Danish Krone', symbol: 'kr', rate: 6.88 },
};

export function convertCurrency(amount, from, to) {
  const fromRate = CURRENCIES[from]?.rate || 1;
  const toRate = CURRENCIES[to]?.rate || 1;
  const inUSD = amount / fromRate;
  return inUSD * toRate;
}


// ========= STOCK DATA =========
// Stock factory — builds full stock object from compact definition
function makeStock(d) {
  const prev = d.pr * (1 - (d.ch || ((Math.random() - 0.48) * 3)) / 100);
  const ch = d.pr - prev;
  const chPct = (ch / prev) * 100;
  const w52h = d.pr * (1.05 + Math.random() * 0.25);
  const w52l = d.pr * (0.65 + Math.random() * 0.15);
  return {
    ticker: d.t, name: d.n, exchange: d.x, country: d.co, currency: d.cu,
    sector: d.se, industry: d.in, price: d.pr,
    previousClose: Math.round(prev * 100) / 100,
    change: Math.round(ch * 100) / 100,
    changePercent: Math.round(chPct * 100) / 100,
    open: Math.round((d.pr + (Math.random() - 0.5) * d.pr * 0.005) * 100) / 100,
    high: Math.round((d.pr * (1 + Math.random() * 0.015)) * 100) / 100,
    low: Math.round((d.pr * (1 - Math.random() * 0.015)) * 100) / 100,
    volume: Math.round((d.vo || 5000000 + Math.random() * 20000000)),
    avgVolume: Math.round((d.vo || 5000000 + Math.random() * 20000000) * (0.9 + Math.random() * 0.2)),
    marketCap: d.mc, pe: d.pe, forwardPe: d.fpE, pb: d.pb, ps: d.ps,
    evEbitda: d.ev, roe: d.roe, roa: d.roa, debtToEquity: d.dte,
    debtToAssets: d.dta, currentRatio: d.cr, grossMargin: d.gm,
    operatingMargin: d.om, netMargin: d.nm, divYield: d.dy,
    payoutRatio: d.po, beta: d.be, eps: d.ep, revenue: d.re,
    netIncome: d.ni, freeCashFlow: d.fc,
    esgScore: d.es, envScore: d.en, socScore: d.so, govScore: d.go,
    haramRevenue: d.hr, shariahCompliant: d.sc,
    week52High: Math.round(w52h * 100) / 100,
    week52Low: Math.round(w52l * 100) / 100,
    quarterlyRevenue: genQuarterlyRevenue(d.re / 4000000000),
    quarterlyEps: genQuarterlyEps(d.ep || 1),
    priceHistory: generatePriceHistory(d.pr, 30, 0.02),
  };
}


const _stockDefs = [
  // ===== US STOCKS (40) =====
  {t:'AAPL',n:'Apple Inc',x:'NASDAQ',co:'US',cu:'USD',se:'Technology',in:'Consumer Electronics',pr:188.22,mc:2940e9,pe:31.2,fpE:29.8,pb:47.2,ps:7.8,ev:28.5,roe:160.1,roa:28.3,dte:1.76,dta:0.32,cr:1.07,gm:45.6,om:30.7,nm:25.3,dy:0.53,po:16.5,be:1.28,ep:6.03,re:383.6e9,ni:97e9,fc:111.4e9,es:72,en:68,so:74,go:73,hr:0,sc:true},
  {t:'MSFT',n:'Microsoft Corp',x:'NASDAQ',co:'US',cu:'USD',se:'Technology',in:'Software',pr:415.50,mc:3090e9,pe:36.5,fpE:33.1,pb:13.1,ps:14.2,ev:32.8,roe:38.5,roa:19.2,dte:0.42,dta:0.18,cr:1.77,gm:69.4,om:44.6,nm:36.4,dy:0.72,po:25.8,be:0.89,ep:11.38,re:218e9,ni:79.4e9,fc:63.4e9,es:82,en:78,so:84,go:83,hr:0,sc:true},
  {t:'GOOGL',n:'Alphabet Inc',x:'NASDAQ',co:'US',cu:'USD',se:'Technology',in:'Internet Services',pr:152.43,mc:1890e9,pe:25.8,fpE:22.4,pb:6.5,ps:7.1,ev:19.2,roe:27.8,roa:16.4,dte:0.11,dta:0.04,cr:2.93,gm:57.5,om:30.7,nm:24.2,dy:0,po:0,be:1.05,ep:5.91,re:307.4e9,ni:73.8e9,fc:69.5e9,es:78,en:74,so:80,go:79,hr:2.1,sc:true},
  {t:'AMZN',n:'Amazon.com Inc',x:'NASDAQ',co:'US',cu:'USD',se:'Technology',in:'E-Commerce',pr:186.85,mc:1950e9,pe:58.7,fpE:38.2,pb:8.4,ps:3.4,ev:28.4,roe:17.2,roa:5.8,dte:0.59,dta:0.21,cr:1.05,gm:47.6,om:7.8,nm:5.3,dy:0,po:0,be:1.15,ep:3.18,re:574.8e9,ni:30.4e9,fc:35.5e9,es:68,en:64,so:72,go:68,hr:0,sc:true},
  {t:'NVDA',n:'NVIDIA Corp',x:'NASDAQ',co:'US',cu:'USD',se:'Technology',in:'Semiconductors',pr:875.35,mc:2160e9,pe:68.2,fpE:42.5,pb:52.8,ps:37.2,ev:62.1,roe:91.5,roa:45.2,dte:0.41,dta:0.15,cr:4.17,gm:72.7,om:58.8,nm:55.6,dy:0.02,po:1.4,be:1.72,ep:12.83,re:60.9e9,ni:29.8e9,fc:27e9,es:70,en:66,so:72,go:71,hr:0,sc:true},
  {t:'META',n:'Meta Platforms',x:'NASDAQ',co:'US',cu:'USD',se:'Technology',in:'Social Media',pr:502.30,mc:1280e9,pe:28.6,fpE:23.1,pb:8.2,ps:9.5,ev:22.4,roe:31.5,roa:18.8,dte:0.36,dta:0.12,cr:2.65,gm:80.6,om:34.7,nm:28.9,dy:0.4,po:11.2,be:1.35,ep:17.56,re:134.9e9,ni:39.1e9,fc:43e9,es:52,en:48,so:54,go:55,hr:3.8,sc:false},
  {t:'TSLA',n:'Tesla Inc',x:'NASDAQ',co:'US',cu:'USD',se:'Consumer Cyclical',in:'Auto Manufacturers',pr:248.42,mc:789e9,pe:72.4,fpE:55.8,pb:15.2,ps:8.2,ev:58.3,roe:21.7,roa:8.5,dte:0.11,dta:0.05,cr:1.73,gm:18.2,om:9.2,nm:7.9,dy:0,po:0,be:2.05,ep:3.43,re:96.8e9,ni:7.6e9,fc:4.4e9,es:62,en:72,so:45,go:48,hr:0,sc:true},
  {t:'BRK.B',n:'Berkshire Hathaway',x:'NYSE',co:'US',cu:'USD',se:'Financial Services',in:'Insurance',pr:411.24,mc:895e9,pe:8.5,fpE:20.1,pb:1.5,ps:2.5,ev:8.2,roe:18.2,roa:6.1,dte:0.27,dta:0.12,cr:1.0,gm:38.2,om:22.5,nm:20.1,dy:0,po:0,be:0.55,ep:48.38,re:364.5e9,ni:96.2e9,fc:0,es:58,en:52,so:60,go:62,hr:5.2,sc:false},
  {t:'JPM',n:'JPMorgan Chase',x:'NYSE',co:'US',cu:'USD',se:'Financial Services',in:'Banking',pr:198.73,mc:571e9,pe:12.1,fpE:11.8,pb:1.9,ps:3.8,ev:0,roe:17.2,roa:1.2,dte:1.52,dta:0.11,cr:1.0,gm:0,om:38.5,nm:33.7,dy:2.15,po:26.1,be:1.08,ep:16.42,re:154.8e9,ni:49.6e9,fc:0,es:72,en:68,so:74,go:74,hr:8.5,sc:false},
  {t:'V',n:'Visa Inc',x:'NYSE',co:'US',cu:'USD',se:'Financial Services',in:'Credit Services',pr:278.50,mc:567e9,pe:30.8,fpE:27.2,pb:13.2,ps:17.4,ev:28.5,roe:47.5,roa:15.8,dte:1.05,dta:0.22,cr:1.35,gm:97.8,om:66.2,nm:52.4,dy:0.76,po:22.8,be:0.95,ep:9.04,re:32.7e9,ni:17.2e9,fc:18.9e9,es:74,en:70,so:76,go:76,hr:0,sc:true},
  {t:'UNH',n:'UnitedHealth Group',x:'NYSE',co:'US',cu:'USD',se:'Healthcare',in:'Health Plans',pr:527.18,mc:486e9,pe:21.5,fpE:19.8,pb:6.2,ps:1.4,ev:18.2,roe:25.8,roa:7.2,dte:0.78,dta:0.26,cr:0.76,gm:23.8,om:8.5,nm:6.2,dy:1.42,po:30.5,be:0.65,ep:24.52,re:371.6e9,ni:22.4e9,fc:21.8e9,es:68,en:64,so:72,go:68,hr:0,sc:true},
  {t:'JNJ',n:'Johnson & Johnson',x:'NYSE',co:'US',cu:'USD',se:'Healthcare',in:'Pharmaceuticals',pr:157.82,mc:380e9,pe:16.8,fpE:15.2,pb:5.8,ps:4.4,ev:14.5,roe:35.2,roa:10.8,dte:0.52,dta:0.18,cr:1.22,gm:69.2,om:24.8,nm:18.5,dy:2.95,po:44.2,be:0.58,ep:9.39,re:85.2e9,ni:14.1e9,fc:17.8e9,es:76,en:72,so:78,go:78,hr:0,sc:true},
  {t:'XOM',n:'Exxon Mobil',x:'NYSE',co:'US',cu:'USD',se:'Energy',in:'Oil & Gas',pr:104.55,mc:437e9,pe:13.2,fpE:12.5,pb:2.1,ps:1.3,ev:8.2,roe:16.8,roa:8.5,dte:0.21,dta:0.11,cr:1.48,gm:32.5,om:15.2,nm:10.5,dy:3.42,po:42.5,be:0.82,ep:7.92,re:344.6e9,ni:36e9,fc:33.4e9,es:42,en:35,so:48,go:52,hr:0,sc:true},
  {t:'WMT',n:'Walmart Inc',x:'NYSE',co:'US',cu:'USD',se:'Consumer Defensive',in:'Retail',pr:165.28,mc:445e9,pe:28.5,fpE:25.2,pb:5.4,ps:0.7,ev:18.8,roe:19.5,roa:6.8,dte:0.68,dta:0.18,cr:0.86,gm:24.5,om:4.2,nm:2.4,dy:1.35,po:38.2,be:0.52,ep:5.80,re:648.1e9,ni:15.5e9,fc:12.2e9,es:70,en:68,so:72,go:70,hr:3.5,sc:true},
  {t:'MA',n:'Mastercard Inc',x:'NYSE',co:'US',cu:'USD',se:'Financial Services',in:'Credit Services',pr:458.75,mc:428e9,pe:35.2,fpE:30.5,pb:50,ps:17.8,ev:32.5,roe:170.2,roa:22.5,dte:2.5,dta:0.35,cr:1.28,gm:100,om:57.5,nm:46.2,dy:0.55,po:19.2,be:1.05,ep:13.03,re:25.1e9,ni:11.2e9,fc:11.8e9,es:76,en:72,so:78,go:78,hr:0,sc:true},
  {t:'PG',n:'Procter & Gamble',x:'NYSE',co:'US',cu:'USD',se:'Consumer Defensive',in:'Household Products',pr:159.45,mc:376e9,pe:26.2,fpE:24.5,pb:8.2,ps:4.5,ev:22.8,roe:32.5,roa:11.2,dte:0.72,dta:0.22,cr:0.72,gm:51.2,om:22.8,nm:18.2,dy:2.42,po:62.5,be:0.42,ep:6.08,re:84e9,ni:14.7e9,fc:15.2e9,es:78,en:75,so:80,go:78,hr:0,sc:true},
  {t:'HD',n:'Home Depot',x:'NYSE',co:'US',cu:'USD',se:'Consumer Cyclical',in:'Home Improvement',pr:362.80,mc:360e9,pe:24.5,fpE:22.8,pb:200,ps:2.3,ev:20.2,roe:400,roa:16.2,dte:20,dta:0.68,cr:1.28,gm:33.5,om:14.8,nm:10.2,dy:2.48,po:55.2,be:1.02,ep:14.81,re:157.4e9,ni:15.1e9,fc:16.8e9,es:72,en:70,so:74,go:72,hr:0,sc:true},
  {t:'COST',n:'Costco Wholesale',x:'NASDAQ',co:'US',cu:'USD',se:'Consumer Defensive',in:'Retail',pr:732.50,mc:325e9,pe:48.5,fpE:42.2,pb:13.5,ps:1.3,ev:38.2,roe:28.5,roa:8.5,dte:0.35,dta:0.15,cr:1.02,gm:12.8,om:3.5,nm:2.6,dy:0.58,po:28.2,be:0.78,ep:15.10,re:242.3e9,ni:6.3e9,fc:5.2e9,es:74,en:72,so:76,go:74,hr:4.2,sc:true},
  {t:'ABBV',n:'AbbVie Inc',x:'NYSE',co:'US',cu:'USD',se:'Healthcare',in:'Pharmaceuticals',pr:174.88,mc:308e9,pe:38.2,fpE:14.8,pb:30,ps:5.6,ev:22.5,roe:60,roa:4.2,dte:5.5,dta:0.72,cr:0.85,gm:69.5,om:25.2,nm:9.8,dy:3.58,po:138,be:0.62,ep:4.58,re:54.3e9,ni:5.4e9,fc:22.1e9,es:62,en:58,so:64,go:64,hr:0,sc:true},
  {t:'MRK',n:'Merck & Co',x:'NYSE',co:'US',cu:'USD',se:'Healthcare',in:'Pharmaceuticals',pr:126.74,mc:321e9,pe:21.8,fpE:13.5,pb:6.5,ps:5.4,ev:16.8,roe:32.5,roa:12.8,dte:0.82,dta:0.28,cr:1.42,gm:74.2,om:28.5,nm:22.8,dy:2.45,po:48.2,be:0.42,ep:5.81,re:60.1e9,ni:14.5e9,fc:13.2e9,es:70,en:66,so:72,go:72,hr:0,sc:true},
  {t:'KO',n:'Coca-Cola Co',x:'NYSE',co:'US',cu:'USD',se:'Consumer Defensive',in:'Beverages',pr:60.82,mc:263e9,pe:24.5,fpE:22.8,pb:10.5,ps:5.8,ev:22.2,roe:42.8,roa:9.5,dte:1.52,dta:0.38,cr:1.12,gm:59.2,om:28.5,nm:22.2,dy:3.05,po:72.5,be:0.55,ep:2.48,re:45.8e9,ni:10.7e9,fc:9.5e9,es:72,en:68,so:74,go:74,hr:5.5,sc:false},
  {t:'PEP',n:'PepsiCo Inc',x:'NASDAQ',co:'US',cu:'USD',se:'Consumer Defensive',in:'Beverages',pr:172.45,mc:237e9,pe:24.8,fpE:22.5,pb:14.2,ps:2.6,ev:20.5,roe:55.8,roa:8.8,dte:2.12,dta:0.42,cr:0.82,gm:54.5,om:14.5,nm:10.2,dy:2.82,po:68.5,be:0.55,ep:6.95,re:91.5e9,ni:9.1e9,fc:7.8e9,es:74,en:72,so:76,go:74,hr:4.8,sc:false},
  {t:'LLY',n:'Eli Lilly',x:'NYSE',co:'US',cu:'USD',se:'Healthcare',in:'Pharmaceuticals',pr:782.55,mc:743e9,pe:118.5,fpE:52.2,pb:58.2,ps:18.5,ev:95.2,roe:58.5,roa:12.2,dte:2.12,dta:0.55,cr:1.15,gm:79.2,om:24.8,nm:16.5,dy:0.72,po:82.5,be:0.45,ep:6.60,re:34.1e9,ni:5.2e9,fc:4.8e9,es:74,en:70,so:76,go:76,hr:0,sc:true},
  {t:'AVGO',n:'Broadcom Inc',x:'NASDAQ',co:'US',cu:'USD',se:'Technology',in:'Semiconductors',pr:1328.40,mc:618e9,pe:52.8,fpE:28.5,pb:11.2,ps:14.8,ev:38.5,roe:22.5,roa:8.2,dte:1.68,dta:0.42,cr:2.82,gm:74.2,om:32.5,nm:15.8,dy:1.52,po:72.5,be:1.28,ep:25.15,re:38.9e9,ni:5.8e9,fc:16.5e9,es:62,en:58,so:64,go:64,hr:0,sc:true},
  {t:'TMO',n:'Thermo Fisher',x:'NYSE',co:'US',cu:'USD',se:'Healthcare',in:'Diagnostics',pr:582.30,mc:223e9,pe:34.2,fpE:26.5,pb:5.2,ps:5.2,ev:24.8,roe:15.8,roa:5.2,dte:0.72,dta:0.28,cr:1.55,gm:41.2,om:18.5,nm:14.2,dy:0.22,po:7.5,be:0.82,ep:17.02,re:42.9e9,ni:5.9e9,fc:6.2e9,es:74,en:72,so:76,go:74,hr:0,sc:true},
  {t:'CRM',n:'Salesforce Inc',x:'NYSE',co:'US',cu:'USD',se:'Technology',in:'Software',pr:272.65,mc:265e9,pe:48.5,fpE:28.2,pb:4.2,ps:8.5,ev:38.2,roe:9.5,roa:4.8,dte:0.18,dta:0.08,cr:1.05,gm:75.5,om:18.2,nm:11.5,dy:0.52,po:25.2,be:1.15,ep:5.62,re:34.9e9,ni:4.1e9,fc:8.4e9,es:78,en:76,so:80,go:78,hr:0,sc:true},
  {t:'MCD',n:"McDonald's Corp",x:'NYSE',co:'US',cu:'USD',se:'Consumer Cyclical',in:'Restaurants',pr:288.45,mc:207e9,pe:24.2,fpE:22.5,pb:0,ps:8.5,ev:22.8,roe:0,roa:12.8,dte:0,dta:0.85,cr:1.42,gm:56.8,om:45.2,nm:32.5,dy:2.22,po:55.2,be:0.65,ep:11.92,re:25.5e9,ni:8.5e9,fc:7.2e9,es:68,en:62,so:72,go:70,hr:8.2,sc:false},
  {t:'CSCO',n:'Cisco Systems',x:'NASDAQ',co:'US',cu:'USD',se:'Technology',in:'Networking',pr:48.92,mc:200e9,pe:14.8,fpE:13.5,pb:4.8,ps:3.8,ev:12.5,roe:28.5,roa:8.5,dte:0.38,dta:0.15,cr:1.35,gm:64.2,om:28.5,nm:22.8,dy:3.05,po:45.2,be:0.85,ep:3.31,re:53.8e9,ni:12.6e9,fc:15.2e9,es:80,en:78,so:82,go:80,hr:0,sc:true},
  {t:'ACN',n:'Accenture plc',x:'NYSE',co:'US',cu:'USD',se:'Technology',in:'IT Services',pr:332.75,mc:209e9,pe:28.5,fpE:25.2,pb:8.2,ps:3.2,ev:22.8,roe:28.5,roa:12.5,dte:0.15,dta:0.08,cr:1.32,gm:32.5,om:15.2,nm:11.5,dy:1.55,po:42.5,be:1.12,ep:11.67,re:64.9e9,ni:7.1e9,fc:8.5e9,es:82,en:80,so:84,go:82,hr:0,sc:true},
  {t:'NFLX',n:'Netflix Inc',x:'NASDAQ',co:'US',cu:'USD',se:'Communication Services',in:'Entertainment',pr:628.50,mc:271e9,pe:42.5,fpE:32.8,pb:12.5,ps:7.5,ev:35.2,roe:28.5,roa:10.2,dte:0.72,dta:0.22,cr:1.12,gm:43.2,om:22.8,nm:16.5,dy:0,po:0,be:1.42,ep:14.79,re:33.7e9,ni:5.4e9,fc:6.9e9,es:62,en:58,so:64,go:64,hr:5.2,sc:false},
  {t:'AMD',n:'Advanced Micro Devices',x:'NASDAQ',co:'US',cu:'USD',se:'Technology',in:'Semiconductors',pr:162.80,mc:263e9,pe:245,fpE:38.5,pb:4.2,ps:11.5,ev:52.8,roe:1.8,roa:1.2,dte:0.05,dta:0.02,cr:2.55,gm:50.2,om:5.5,nm:3.2,dy:0,po:0,be:1.52,ep:0.66,re:22.7e9,ni:854e6,fc:1.2e9,es:72,en:70,so:74,go:72,hr:0,sc:true},
  {t:'INTC',n:'Intel Corp',x:'NASDAQ',co:'US',cu:'USD',se:'Technology',in:'Semiconductors',pr:43.28,mc:183e9,pe:108,fpE:22.5,pb:1.5,ps:3.4,ev:28.5,roe:1.4,roa:0.8,dte:0.47,dta:0.15,cr:1.55,gm:42.5,om:1.2,nm:0.8,dy:1.12,po:100,be:0.98,ep:0.40,re:54.2e9,ni:1.7e9,fc:-14.2e9,es:68,en:64,so:70,go:70,hr:0,sc:true},
  {t:'IBM',n:'IBM Corp',x:'NYSE',co:'US',cu:'USD',se:'Technology',in:'IT Services',pr:188.72,mc:173e9,pe:22.8,fpE:18.5,pb:6.8,ps:2.8,ev:15.2,roe:30.5,roa:5.2,dte:2.58,dta:0.55,cr:1.12,gm:55.5,om:15.2,nm:12.8,dy:3.52,po:72.5,be:0.78,ep:8.28,re:61.9e9,ni:7.5e9,fc:10.3e9,es:78,en:76,so:80,go:78,hr:0,sc:true},
  {t:'GS',n:'Goldman Sachs',x:'NYSE',co:'US',cu:'USD',se:'Financial Services',in:'Investment Banking',pr:465.20,mc:156e9,pe:15.8,fpE:13.2,pb:1.4,ps:3.5,ev:0,roe:9.2,roa:0.8,dte:2.55,dta:0.12,cr:1.0,gm:0,om:28.5,nm:22.8,dy:2.42,po:35.2,be:1.38,ep:29.44,re:46.2e9,ni:8.5e9,fc:0,es:72,en:68,so:74,go:74,hr:12.5,sc:false},
  {t:'MS',n:'Morgan Stanley',x:'NYSE',co:'US',cu:'USD',se:'Financial Services',in:'Investment Banking',pr:95.80,mc:155e9,pe:16.2,fpE:14.5,pb:1.8,ps:2.8,ev:0,roe:11.2,roa:0.9,dte:2.82,dta:0.14,cr:1.0,gm:0,om:25.2,nm:18.5,dy:3.72,po:55.2,be:1.42,ep:5.91,re:53.5e9,ni:9.5e9,fc:0,es:74,en:70,so:76,go:76,hr:10.2,sc:false},
  {t:'BA',n:'Boeing Co',x:'NYSE',co:'US',cu:'USD',se:'Industrials',in:'Aerospace',pr:238.55,mc:142e9,pe:0,fpE:38.5,pb:0,ps:1.8,ev:0,roe:0,roa:-2.5,dte:0,dta:0.92,cr:1.18,gm:11.2,om:-1.5,nm:-2.8,dy:0,po:0,be:1.52,ep:-4.58,re:77.8e9,ni:-2.2e9,fc:-4.1e9,es:58,en:52,so:62,go:60,hr:0,sc:true},
  {t:'CAT',n:'Caterpillar Inc',x:'NYSE',co:'US',cu:'USD',se:'Industrials',in:'Farm & Construction',pr:318.45,mc:157e9,pe:16.5,fpE:15.8,pb:8.8,ps:2.4,ev:13.2,roe:55.2,roa:11.5,dte:2.15,dta:0.42,cr:1.42,gm:36.5,om:20.2,nm:14.8,dy:1.65,po:25.2,be:1.05,ep:19.30,re:67.1e9,ni:10.3e9,fc:9.8e9,es:68,en:62,so:72,go:70,hr:0,sc:true},
  {t:'DIS',n:'Walt Disney Co',x:'NYSE',co:'US',cu:'USD',se:'Communication Services',in:'Entertainment',pr:110.52,mc:202e9,pe:68.5,fpE:22.8,pb:2.2,ps:2.2,ev:28.5,roe:3.2,roa:1.5,dte:0.48,dta:0.18,cr:0.92,gm:35.2,om:8.5,nm:3.2,dy:0,po:0,be:1.28,ep:1.61,re:88.9e9,ni:2.9e9,fc:4.2e9,es:72,en:68,so:76,go:72,hr:8.5,sc:false},
  {t:'NKE',n:'Nike Inc',x:'NYSE',co:'US',cu:'USD',se:'Consumer Cyclical',in:'Footwear',pr:106.88,mc:163e9,pe:28.5,fpE:25.2,pb:11.2,ps:3.2,ev:24.5,roe:38.5,roa:14.2,dte:0.82,dta:0.25,cr:2.72,gm:44.5,om:12.8,nm:10.5,dy:1.15,po:32.5,be:1.08,ep:3.75,re:51.2e9,ni:5.1e9,fc:5.5e9,es:76,en:78,so:74,go:76,hr:0,sc:true},
  {t:'PYPL',n:'PayPal Holdings',x:'NASDAQ',co:'US',cu:'USD',se:'Financial Services',in:'Payments',pr:63.45,mc:68e9,pe:16.8,fpE:12.5,pb:3.5,ps:2.2,ev:12.8,roe:22.5,roa:3.8,dte:0.42,dta:0.12,cr:1.28,gm:39.2,om:15.5,nm:12.8,dy:0,po:0,be:1.38,ep:3.78,re:30.4e9,ni:3.9e9,fc:5.2e9,es:68,en:64,so:70,go:70,hr:0,sc:true},
  // ===== EUROPE (30) =====
  {t:'ASML.AS',n:'ASML Holding',x:'EURONEXT',co:'NL',cu:'EUR',se:'Technology',in:'Semiconductors',pr:682.40,mc:276e9,pe:42.5,fpE:35.2,pb:22.5,ps:12.8,ev:38.5,roe:58.2,roa:18.5,dte:0.42,dta:0.15,cr:1.58,gm:51.2,om:32.5,nm:25.8,dy:0.72,po:28.5,be:1.15,ep:16.06,re:27.6e9,ni:7.8e9,fc:6.5e9,es:78,en:76,so:80,go:78,hr:0,sc:true},
  {t:'NOVO.B.CO',n:'Novo Nordisk',x:'NASDAQ_NORDIC',co:'DK',cu:'DKK',se:'Healthcare',in:'Pharmaceuticals',pr:898.20,mc:403e9,pe:42.8,fpE:35.5,pb:32.5,ps:14.2,ev:38.2,roe:82.5,roa:22.5,dte:0.55,dta:0.18,cr:0.82,gm:83.5,om:42.8,nm:34.2,dy:1.15,po:48.5,be:0.55,ep:20.98,re:232.8e9,ni:83.5e9,fc:72e9,es:76,en:72,so:78,go:78,hr:0,sc:true},
  {t:'NESN.SW',n:'Nestlé SA',x:'SIX',co:'CH',cu:'CHF',se:'Consumer Defensive',in:'Packaged Foods',pr:98.52,mc:268e9,pe:22.5,fpE:20.8,pb:5.8,ps:2.8,ev:18.2,roe:28.5,roa:8.2,dte:0.82,dta:0.28,cr:0.75,gm:47.5,om:17.2,nm:12.5,dy:2.82,po:62.5,be:0.65,ep:4.38,re:93e9,ni:11.8e9,fc:10.5e9,es:82,en:80,so:84,go:82,hr:4.5,sc:false},
  {t:'ROG.SW',n:'Roche Holding',x:'SIX',co:'CH',cu:'CHF',se:'Healthcare',in:'Pharmaceuticals',pr:278.50,mc:192e9,pe:18.5,fpE:15.2,pb:7.2,ps:3.2,ev:14.8,roe:38.5,roa:10.5,dte:0.62,dta:0.22,cr:1.42,gm:65.2,om:22.8,nm:17.5,dy:3.22,po:55.2,be:0.48,ep:15.05,re:58.7e9,ni:10.2e9,fc:14.8e9,es:78,en:74,so:80,go:80,hr:0,sc:true},
  {t:'MC.PA',n:'LVMH',x:'EURONEXT',co:'FR',cu:'EUR',se:'Consumer Cyclical',in:'Luxury Goods',pr:748.20,mc:375e9,pe:22.8,fpE:20.5,pb:5.5,ps:4.2,ev:18.5,roe:25.8,roa:9.2,dte:0.48,dta:0.18,cr:1.25,gm:68.2,om:26.5,nm:18.2,dy:1.72,po:38.5,be:0.95,ep:32.82,re:86.2e9,ni:15.2e9,fc:12.8e9,es:72,en:68,so:74,go:74,hr:12.5,sc:false},
  {t:'SAP.DE',n:'SAP SE',x:'XETRA',co:'DE',cu:'EUR',se:'Technology',in:'Software',pr:178.52,mc:220e9,pe:52.8,fpE:32.5,pb:5.2,ps:6.8,ev:38.2,roe:10.2,roa:5.5,dte:0.38,dta:0.12,cr:1.18,gm:72.5,om:18.2,nm:10.5,dy:1.42,po:72.5,be:0.98,ep:3.38,re:31.4e9,ni:3.2e9,fc:5.8e9,es:82,en:80,so:84,go:82,hr:0,sc:true},
  {t:'SIE.DE',n:'Siemens AG',x:'XETRA',co:'DE',cu:'EUR',se:'Industrials',in:'Conglomerates',pr:182.45,mc:146e9,pe:18.5,fpE:16.2,pb:3.2,ps:1.8,ev:14.5,roe:17.5,roa:5.2,dte:0.82,dta:0.28,cr:1.22,gm:38.5,om:12.5,nm:8.2,dy:2.85,po:48.5,be:1.12,ep:9.86,re:77.8e9,ni:6.2e9,fc:8.5e9,es:82,en:82,so:82,go:82,hr:0,sc:true},
  {t:'AZN.L',n:'AstraZeneca',x:'LSE',co:'GB',cu:'GBP',se:'Healthcare',in:'Pharmaceuticals',pr:115.82,mc:180e9,pe:35.2,fpE:18.5,pb:5.8,ps:3.8,ev:22.5,roe:16.8,roa:5.5,dte:0.72,dta:0.25,cr:1.32,gm:81.2,om:18.5,nm:8.5,dy:2.02,po:68.5,be:0.42,ep:3.29,re:45.8e9,ni:3.9e9,fc:5.2e9,es:78,en:76,so:80,go:78,hr:0,sc:true},
  {t:'SHEL.L',n:'Shell plc',x:'LSE',co:'GB',cu:'GBP',se:'Energy',in:'Oil & Gas',pr:27.85,mc:198e9,pe:8.2,fpE:8.5,pb:1.2,ps:0.6,ev:5.5,roe:15.2,roa:6.8,dte:0.38,dta:0.15,cr:1.28,gm:25.5,om:12.2,nm:8.5,dy:3.85,po:32.5,be:0.72,ep:3.40,re:316.2e9,ni:28.4e9,fc:42.5e9,es:48,en:38,so:55,go:58,hr:0,sc:true},
  {t:'HSBA.L',n:'HSBC Holdings',x:'LSE',co:'GB',cu:'GBP',se:'Financial Services',in:'Banking',pr:6.95,mc:138e9,pe:7.2,fpE:7.8,pb:0.9,ps:2.2,ev:0,roe:12.5,roa:0.5,dte:0,dta:0.05,cr:1.0,gm:0,om:35.2,nm:22.8,dy:5.82,po:42.5,be:0.82,ep:0.97,re:52.3e9,ni:17.8e9,fc:0,es:68,en:62,so:72,go:70,hr:10.5,sc:false},
  {t:'ULVR.L',n:'Unilever plc',x:'LSE',co:'GB',cu:'GBP',se:'Consumer Defensive',in:'Household Products',pr:44.28,mc:113e9,pe:18.5,fpE:17.2,pb:6.2,ps:1.8,ev:15.8,roe:35.2,roa:9.8,dte:1.52,dta:0.38,cr:0.82,gm:42.5,om:16.8,nm:10.5,dy:3.52,po:62.5,be:0.48,ep:2.39,re:59.6e9,ni:6.2e9,fc:7.5e9,es:82,en:82,so:82,go:82,hr:3.8,sc:false},
  {t:'BP.L',n:'BP plc',x:'LSE',co:'GB',cu:'GBP',se:'Energy',in:'Oil & Gas',pr:5.12,mc:97e9,pe:12.5,fpE:8.2,pb:1.5,ps:0.5,ev:7.2,roe:12.5,roa:4.5,dte:0.52,dta:0.18,cr:1.15,gm:22.5,om:8.2,nm:5.5,dy:4.28,po:52.5,be:0.78,ep:0.41,re:211.5e9,ni:10.8e9,fc:14.2e9,es:45,en:38,so:52,go:55,hr:0,sc:true},
  {t:'GSK.L',n:'GSK plc',x:'LSE',co:'GB',cu:'GBP',se:'Healthcare',in:'Pharmaceuticals',pr:15.82,mc:64e9,pe:12.2,fpE:10.5,pb:4.8,ps:1.8,ev:10.5,roe:42.5,roa:8.2,dte:2.15,dta:0.48,cr:0.92,gm:64.2,om:22.5,nm:15.8,dy:3.82,po:45.2,be:0.42,ep:1.30,re:36.9e9,ni:5.8e9,fc:5.2e9,es:76,en:74,so:78,go:76,hr:0,sc:true},
  {t:'RIO.L',n:'Rio Tinto',x:'LSE',co:'GB',cu:'GBP',se:'Basic Materials',in:'Mining',pr:54.42,mc:88e9,pe:10.2,fpE:9.5,pb:2.2,ps:1.5,ev:6.5,roe:22.5,roa:10.5,dte:0.28,dta:0.12,cr:1.62,gm:42.5,om:28.5,nm:20.2,dy:5.52,po:55.2,be:0.85,ep:5.34,re:54e9,ni:10.1e9,fc:8.5e9,es:62,en:55,so:68,go:65,hr:0,sc:true},
  {t:'TTE.PA',n:'TotalEnergies SE',x:'EURONEXT',co:'FR',cu:'EUR',se:'Energy',in:'Oil & Gas',pr:62.85,mc:152e9,pe:8.5,fpE:7.8,pb:1.5,ps:0.7,ev:5.8,roe:18.5,roa:7.2,dte:0.38,dta:0.15,cr:1.25,gm:35.2,om:18.5,nm:10.2,dy:4.82,po:38.5,be:0.72,ep:7.39,re:218.5e9,ni:21.6e9,fc:28.5e9,es:52,en:42,so:58,go:62,hr:0,sc:true},
  {t:'SAN.PA',n:'Sanofi SA',x:'EURONEXT',co:'FR',cu:'EUR',se:'Healthcare',in:'Pharmaceuticals',pr:92.45,mc:118e9,pe:15.2,fpE:12.5,pb:2.2,ps:2.8,ev:12.8,roe:14.5,roa:5.2,dte:0.28,dta:0.12,cr:1.42,gm:70.5,om:22.5,nm:15.8,dy:3.52,po:52.5,be:0.48,ep:6.08,re:42.2e9,ni:6.8e9,fc:8.2e9,es:80,en:78,so:82,go:80,hr:0,sc:true},
  {t:'OR.PA',n:"L'Oréal SA",x:'EURONEXT',co:'FR',cu:'EUR',se:'Consumer Cyclical',in:'Personal Products',pr:418.55,mc:224e9,pe:35.2,fpE:30.5,pb:7.2,ps:5.2,ev:28.5,roe:22.5,roa:10.5,dte:0.32,dta:0.12,cr:1.22,gm:73.5,om:20.2,nm:14.5,dy:1.52,po:52.5,be:0.72,ep:11.89,re:41.2e9,ni:5.8e9,fc:6.2e9,es:82,en:82,so:82,go:82,hr:0,sc:true},
  {t:'BNP.PA',n:'BNP Paribas',x:'EURONEXT',co:'FR',cu:'EUR',se:'Financial Services',in:'Banking',pr:62.15,mc:77e9,pe:7.2,fpE:6.8,pb:0.6,ps:1.5,ev:0,roe:8.5,roa:0.4,dte:0,dta:0.04,cr:1.0,gm:0,om:25.5,nm:15.2,dy:6.52,po:45.2,be:1.22,ep:8.63,re:48.5e9,ni:7.2e9,fc:0,es:74,en:72,so:76,go:74,hr:8.5,sc:false},
  {t:'ALV.DE',n:'Allianz SE',x:'XETRA',co:'DE',cu:'EUR',se:'Financial Services',in:'Insurance',pr:258.80,mc:108e9,pe:11.2,fpE:10.5,pb:1.8,ps:0.7,ev:8.5,roe:16.5,roa:0.8,dte:0,dta:0.04,cr:1.0,gm:0,om:12.5,nm:5.8,dy:4.52,po:48.5,be:0.95,ep:23.11,re:152.8e9,ni:8.5e9,fc:0,es:78,en:76,so:80,go:78,hr:5.2,sc:false},
  {t:'DTE.DE',n:'Deutsche Telekom',x:'XETRA',co:'DE',cu:'EUR',se:'Communication Services',in:'Telecom',pr:22.85,mc:114e9,pe:12.5,fpE:11.2,pb:2.2,ps:1.0,ev:8.2,roe:18.2,roa:3.5,dte:1.52,dta:0.42,cr:0.88,gm:58.5,om:18.2,nm:8.5,dy:3.42,po:42.5,be:0.62,ep:1.83,re:111.8e9,ni:9.5e9,fc:12.5e9,es:72,en:68,so:74,go:74,hr:0,sc:true},
  {t:'BMW.DE',n:'BMW AG',x:'XETRA',co:'DE',cu:'EUR',se:'Consumer Cyclical',in:'Auto Manufacturers',pr:98.42,mc:62e9,pe:5.8,fpE:6.2,pb:0.7,ps:0.4,ev:8.2,roe:13.5,roa:2.5,dte:1.82,dta:0.55,cr:1.08,gm:18.5,om:10.2,nm:6.5,dy:5.52,po:32.5,be:1.42,ep:16.97,re:155e9,ni:10.1e9,fc:5.2e9,es:72,en:70,so:74,go:72,hr:0,sc:true},
  {t:'VOW3.DE',n:'Volkswagen AG',x:'XETRA',co:'DE',cu:'EUR',se:'Consumer Cyclical',in:'Auto Manufacturers',pr:118.55,mc:60e9,pe:3.8,fpE:4.5,pb:0.4,ps:0.2,ev:5.2,roe:10.5,roa:2.2,dte:1.42,dta:0.48,cr:1.15,gm:18.2,om:7.2,nm:4.5,dy:5.82,po:22.5,be:1.28,ep:31.20,re:322.3e9,ni:14.8e9,fc:8.5e9,es:68,en:65,so:70,go:68,hr:0,sc:true},
  {t:'BAYN.DE',n:'Bayer AG',x:'XETRA',co:'DE',cu:'EUR',se:'Healthcare',in:'Pharmaceuticals',pr:32.85,mc:32e9,pe:0,fpE:8.5,pb:0.8,ps:0.7,ev:12.5,roe:-15.2,roa:-4.5,dte:1.82,dta:0.55,cr:1.28,gm:62.5,om:-5.2,nm:-12.5,dy:0.35,po:0,be:0.92,ep:-5.02,re:47.6e9,ni:-5.8e9,fc:2.5e9,es:62,en:58,so:64,go:64,hr:0,sc:true},
  {t:'NOVN.SW',n:'Novartis AG',x:'SIX',co:'CH',cu:'CHF',se:'Healthcare',in:'Pharmaceuticals',pr:98.25,mc:198e9,pe:25.5,fpE:15.2,pb:5.2,ps:4.2,ev:18.5,roe:20.5,roa:7.8,dte:0.52,dta:0.18,cr:0.92,gm:75.2,om:28.5,nm:18.5,dy:3.42,po:82.5,be:0.45,ep:3.85,re:45.4e9,ni:8.2e9,fc:12.5e9,es:80,en:78,so:82,go:80,hr:0,sc:true},
  {t:'SAN.MC',n:'Banco Santander',x:'BOLSA_MADRID',co:'ES',cu:'EUR',se:'Financial Services',in:'Banking',pr:4.22,mc:68e9,pe:6.2,fpE:5.8,pb:0.7,ps:1.2,ev:0,roe:11.5,roa:0.6,dte:0,dta:0.04,cr:1.0,gm:0,om:35.2,nm:18.5,dy:3.82,po:22.5,be:1.22,ep:0.68,re:57.2e9,ni:10.6e9,fc:0,es:70,en:68,so:72,go:70,hr:5.8,sc:false},
  {t:'ISP.MI',n:'Intesa Sanpaolo',x:'BORSA_ITALIANA',co:'IT',cu:'EUR',se:'Financial Services',in:'Banking',pr:3.12,mc:60e9,pe:7.5,fpE:7.2,pb:1.0,ps:2.5,ev:0,roe:13.8,roa:0.5,dte:0,dta:0.04,cr:1.0,gm:0,om:32.5,nm:22.5,dy:7.52,po:55.2,be:1.18,ep:0.42,re:23.2e9,ni:5.2e9,fc:0,es:72,en:70,so:74,go:72,hr:5.2,sc:false},
  {t:'ENEL.MI',n:'Enel SpA',x:'BORSA_ITALIANA',co:'IT',cu:'EUR',se:'Utilities',in:'Electric Utilities',pr:6.48,mc:66e9,pe:12.5,fpE:10.2,pb:1.8,ps:0.7,ev:8.5,roe:14.5,roa:3.2,dte:1.55,dta:0.45,cr:0.92,gm:35.2,om:15.2,nm:6.5,dy:6.52,po:72.5,be:0.82,ep:0.52,re:92.5e9,ni:6e9,fc:4.5e9,es:75,en:78,so:72,go:75,hr:0,sc:true},
  {t:'ABN.AS',n:'ABN AMRO Bank',x:'EURONEXT',co:'NL',cu:'EUR',se:'Financial Services',in:'Banking',pr:15.85,mc:14e9,pe:7.8,fpE:7.2,pb:0.6,ps:1.8,ev:0,roe:8.2,roa:0.4,dte:0,dta:0.03,cr:1.0,gm:0,om:28.5,nm:18.2,dy:8.52,po:62.5,be:1.12,ep:2.03,re:8.2e9,ni:2.5e9,fc:0,es:74,en:72,so:76,go:74,hr:6.2,sc:false},
  {t:'PHIA.AS',n:'Koninklijke Philips',x:'EURONEXT',co:'NL',cu:'EUR',se:'Healthcare',in:'Medical Devices',pr:24.55,mc:22e9,pe:25.8,fpE:16.5,pb:1.8,ps:1.2,ev:15.2,roe:7.2,roa:2.8,dte:0.58,dta:0.22,cr:1.42,gm:42.5,om:8.2,nm:4.5,dy:2.82,po:68.5,be:0.95,ep:0.95,re:18.2e9,ni:800e6,fc:1.2e9,es:82,en:80,so:84,go:82,hr:0,sc:true},

  // ===== GCC (25) =====
  {t:'2222.SR',n:'Saudi Aramco',x:'TADAWUL',co:'SA',cu:'SAR',se:'Energy',in:'Oil & Gas',pr:32.15,mc:7220e9,pe:15.8,fpE:14.2,pb:3.8,ps:4.5,ev:12.5,roe:25.2,roa:15.8,dte:0.08,dta:0.04,cr:1.52,gm:58.2,om:42.5,nm:28.5,dy:6.52,po:100,be:0.45,ep:2.04,re:1655e9,ni:467e9,fc:420e9,es:55,en:42,so:62,go:65,hr:0,sc:true},
  {t:'2010.SR',n:'SABIC',x:'TADAWUL',co:'SA',cu:'SAR',se:'Basic Materials',in:'Chemicals',pr:78.50,mc:235.5e9,pe:18.5,fpE:15.2,pb:1.5,ps:1.2,ev:12.8,roe:8.2,roa:4.5,dte:0.32,dta:0.12,cr:1.82,gm:22.5,om:12.5,nm:8.2,dy:4.82,po:85,be:0.78,ep:4.24,re:148.5e9,ni:12.8e9,fc:8.5e9,es:65,en:58,so:68,go:70,hr:0,sc:true},
  {t:'1120.SR',n:'Al Rajhi Bank',x:'TADAWUL',co:'SA',cu:'SAR',se:'Financial Services',in:'Banking',pr:88.20,mc:332e9,pe:14.5,fpE:13.2,pb:3.2,ps:8.5,ev:0,roe:22.5,roa:2.8,dte:0,dta:0.08,cr:1.0,gm:0,om:58.2,nm:42.5,dy:2.82,po:40,be:0.72,ep:6.08,re:26.2e9,ni:14.2e9,fc:0,es:68,en:62,so:72,go:70,hr:0,sc:true},
  {t:'1180.SR',n:'Al Tawuniya',x:'TADAWUL',co:'SA',cu:'SAR',se:'Financial Services',in:'Insurance',pr:142.80,mc:21.4e9,pe:12.2,fpE:11.5,pb:2.8,ps:1.2,ev:8.5,roe:24.5,roa:5.2,dte:0.15,dta:0.08,cr:1.12,gm:28.5,om:15.2,nm:10.5,dy:3.52,po:42.5,be:0.82,ep:11.70,re:18.5e9,ni:1.8e9,fc:1.2e9,es:62,en:58,so:64,go:64,hr:0,sc:true},
  {t:'2350.SR',n:'Saudi Kayan',x:'TADAWUL',co:'SA',cu:'SAR',se:'Basic Materials',in:'Chemicals',pr:12.82,mc:19.2e9,pe:0,fpE:25.5,pb:0.8,ps:1.2,ev:18.5,roe:-5.2,roa:-2.5,dte:0.72,dta:0.28,cr:1.05,gm:8.5,om:-5.2,nm:-8.5,dy:0,po:0,be:1.15,ep:-0.85,re:15.2e9,ni:-1.2e9,fc:-0.5e9,es:55,en:48,so:58,go:62,hr:0,sc:true},
  {t:'4001.SR',n:'Abdullah Al Othaim',x:'TADAWUL',co:'SA',cu:'SAR',se:'Consumer Defensive',in:'Retail',pr:52.40,mc:9.4e9,pe:15.8,fpE:14.2,pb:3.2,ps:0.5,ev:12.5,roe:20.5,roa:5.8,dte:0.82,dta:0.32,cr:0.92,gm:28.5,om:5.2,nm:3.5,dy:3.82,po:58.5,be:0.75,ep:3.32,re:18.2e9,ni:0.6e9,fc:0.8e9,es:58,en:52,so:62,go:60,hr:2.5,sc:true},
  {t:'EMAAR.AE',n:'Emaar Properties',x:'DFM',co:'AE',cu:'AED',se:'Real Estate',in:'Real Estate Development',pr:8.75,mc:72.5e9,pe:8.2,fpE:7.5,pb:1.2,ps:1.8,ev:8.5,roe:15.2,roa:5.8,dte:0.48,dta:0.18,cr:1.42,gm:38.5,om:22.5,nm:18.2,dy:3.52,po:28.5,be:0.85,ep:1.07,re:38.5e9,ni:7.2e9,fc:5.8e9,es:62,en:55,so:65,go:68,hr:0,sc:true},
  {t:'FAB.AE',n:'First Abu Dhabi Bank',x:'ADX',co:'AE',cu:'AED',se:'Financial Services',in:'Banking',pr:13.82,mc:153e9,pe:10.5,fpE:9.8,pb:1.8,ps:5.2,ev:0,roe:17.2,roa:1.8,dte:0,dta:0.06,cr:1.0,gm:0,om:52.5,nm:38.2,dy:4.52,po:45.2,be:0.68,ep:1.32,re:30.2e9,ni:15.5e9,fc:0,es:72,en:68,so:74,go:74,hr:0,sc:true},
  {t:'ETISALAT.AE',n:'e& (Etisalat)',x:'ADX',co:'AE',cu:'AED',se:'Communication Services',in:'Telecom',pr:24.50,mc:213e9,pe:22.5,fpE:20.2,pb:5.8,ps:3.5,ev:15.2,roe:26.5,roa:8.5,dte:0.42,dta:0.15,cr:0.75,gm:52.5,om:28.5,nm:18.2,dy:3.82,po:82.5,be:0.55,ep:1.09,re:62.5e9,ni:11.5e9,fc:15.2e9,es:68,en:62,so:72,go:70,hr:0,sc:true},
  {t:'DIB.AE',n:'Dubai Islamic Bank',x:'DFM',co:'AE',cu:'AED',se:'Financial Services',in:'Banking',pr:5.85,mc:42.5e9,pe:8.2,fpE:7.8,pb:1.2,ps:3.8,ev:0,roe:15.2,roa:1.5,dte:0,dta:0.05,cr:1.0,gm:0,om:48.5,nm:35.2,dy:5.82,po:45.2,be:0.72,ep:0.71,re:11.2e9,ni:5.2e9,fc:0,es:68,en:62,so:72,go:70,hr:0,sc:true},
  {t:'ADNOCDIST.AE',n:'ADNOC Distribution',x:'ADX',co:'AE',cu:'AED',se:'Energy',in:'Oil & Gas',pr:3.52,mc:44e9,pe:18.2,fpE:16.5,pb:5.2,ps:1.2,ev:12.5,roe:28.5,roa:12.5,dte:0.32,dta:0.12,cr:0.82,gm:12.5,om:8.2,nm:5.5,dy:4.82,po:85,be:0.55,ep:0.19,re:38.5e9,ni:2.4e9,fc:2.8e9,es:62,en:55,so:65,go:68,hr:0,sc:true},
  {t:'ALDAR.AE',n:'Aldar Properties',x:'ADX',co:'AE',cu:'AED',se:'Real Estate',in:'Real Estate Development',pr:6.28,mc:49.2e9,pe:12.5,fpE:11.2,pb:1.5,ps:3.2,ev:15.2,roe:12.5,roa:4.2,dte:0.52,dta:0.22,cr:1.82,gm:35.2,om:22.5,nm:18.2,dy:3.82,po:45.2,be:0.72,ep:0.50,re:14.8e9,ni:4.8e9,fc:3.2e9,es:68,en:62,so:72,go:70,hr:0,sc:true},
  {t:'QNB.QA',n:'Qatar National Bank',x:'QSE',co:'QA',cu:'QAR',se:'Financial Services',in:'Banking',pr:16.85,mc:155e9,pe:9.5,fpE:8.8,pb:1.5,ps:4.5,ev:0,roe:16.2,roa:1.5,dte:0,dta:0.06,cr:1.0,gm:0,om:55.2,nm:42.5,dy:4.52,po:42.5,be:0.65,ep:1.77,re:35.2e9,ni:15.8e9,fc:0,es:72,en:68,so:74,go:74,hr:0,sc:true},
  {t:'QEWS.QA',n:'Qatar Electricity & Water',x:'QSE',co:'QA',cu:'QAR',se:'Utilities',in:'Electric Utilities',pr:16.20,mc:17.8e9,pe:14.5,fpE:13.2,pb:1.8,ps:3.2,ev:12.5,roe:12.5,roa:5.8,dte:0.28,dta:0.12,cr:1.52,gm:35.2,om:28.5,nm:22.5,dy:5.52,po:78.5,be:0.42,ep:1.12,re:5.5e9,ni:1.2e9,fc:1.5e9,es:68,en:72,so:64,go:68,hr:0,sc:true},
  {t:'INDUSTRIES.QA',n:'Industries Qatar',x:'QSE',co:'QA',cu:'QAR',se:'Basic Materials',in:'Chemicals',pr:12.55,mc:75.8e9,pe:10.2,fpE:9.5,pb:1.5,ps:2.2,ev:8.5,roe:15.2,roa:8.5,dte:0.15,dta:0.08,cr:2.82,gm:42.5,om:28.5,nm:22.5,dy:6.82,po:68.5,be:0.62,ep:1.23,re:34.2e9,ni:7.5e9,fc:6.2e9,es:58,en:52,so:62,go:62,hr:0,sc:true},
  {t:'ORDS.QA',n:'Ooredoo QSC',x:'QSE',co:'QA',cu:'QAR',se:'Communication Services',in:'Telecom',pr:9.85,mc:31.5e9,pe:12.5,fpE:11.2,pb:1.2,ps:1.2,ev:5.5,roe:9.8,roa:3.2,dte:0.58,dta:0.22,cr:0.72,gm:55.2,om:18.5,nm:12.5,dy:4.52,po:55.2,be:0.55,ep:0.79,re:28.5e9,ni:3.5e9,fc:5.2e9,es:62,en:58,so:64,go:64,hr:0,sc:true},
  {t:'NBK.KW',n:'National Bank of Kuwait',x:'BK',co:'KW',cu:'KWD',se:'Financial Services',in:'Banking',pr:1.05,mc:10.2e9,pe:12.5,fpE:11.5,pb:1.8,ps:5.2,ev:0,roe:14.5,roa:1.2,dte:0,dta:0.05,cr:1.0,gm:0,om:52.5,nm:38.5,dy:3.82,po:45.2,be:0.55,ep:0.084,re:2.2e9,ni:1.2e9,fc:0,es:68,en:62,so:72,go:70,hr:0,sc:true},
  {t:'ZAIN.KW',n:'Zain Group',x:'BK',co:'KW',cu:'KWD',se:'Communication Services',in:'Telecom',pr:0.58,mc:2.5e9,pe:10.2,fpE:9.5,pb:1.5,ps:0.8,ev:6.5,roe:15.2,roa:4.2,dte:0.82,dta:0.28,cr:0.62,gm:52.5,om:18.2,nm:12.5,dy:6.82,po:68.5,be:0.65,ep:0.057,re:5.8e9,ni:0.6e9,fc:0.8e9,es:58,en:52,so:62,go:60,hr:0,sc:true},
  {t:'KFH.KW',n:'Kuwait Finance House',x:'BK',co:'KW',cu:'KWD',se:'Financial Services',in:'Banking',pr:0.82,mc:11.5e9,pe:14.2,fpE:13.5,pb:2.5,ps:5.8,ev:0,roe:18.2,roa:1.8,dte:0,dta:0.06,cr:1.0,gm:0,om:55.2,nm:42.5,dy:3.52,po:48.5,be:0.62,ep:0.058,re:2.8e9,ni:1.2e9,fc:0,es:72,en:68,so:74,go:74,hr:0,sc:true},
  {t:'BKMB.BH',n:'Bank of Bahrain & Kuwait',x:'BHB',co:'BH',cu:'BHD',se:'Financial Services',in:'Banking',pr:0.68,mc:1.2e9,pe:10.5,fpE:9.8,pb:1.2,ps:3.2,ev:0,roe:11.5,roa:1.2,dte:0,dta:0.05,cr:1.0,gm:0,om:42.5,nm:28.5,dy:5.82,po:58.5,be:0.62,ep:0.065,re:0.42e9,ni:0.12e9,fc:0,es:58,en:52,so:62,go:60,hr:0,sc:true},
  {t:'OMANTEL.OM',n:'Oman Telecommunications',x:'MSM',co:'OM',cu:'OMR',se:'Communication Services',in:'Telecom',pr:0.82,mc:2.1e9,pe:12.5,fpE:11.5,pb:2.2,ps:1.5,ev:8.5,roe:18.2,roa:6.5,dte:0.42,dta:0.15,cr:0.85,gm:55.2,om:22.5,nm:15.2,dy:5.52,po:68.5,be:0.52,ep:0.066,re:1.4e9,ni:0.2e9,fc:0.3e9,es:62,en:58,so:64,go:64,hr:0,sc:true},
  {t:'BML.OM',n:'Bank Muscat',x:'MSM',co:'OM',cu:'OMR',se:'Financial Services',in:'Banking',pr:0.52,mc:3.8e9,pe:8.5,fpE:8.2,pb:1.2,ps:3.5,ev:0,roe:14.5,roa:1.5,dte:0,dta:0.05,cr:1.0,gm:0,om:48.5,nm:32.5,dy:5.82,po:48.5,be:0.55,ep:0.061,re:1.2e9,ni:0.45e9,fc:0,es:62,en:58,so:64,go:64,hr:0,sc:true},
  {t:'NBB.BH',n:'National Bank of Bahrain',x:'BHB',co:'BH',cu:'BHD',se:'Financial Services',in:'Banking',pr:0.72,mc:1.5e9,pe:9.2,fpE:8.8,pb:1.5,ps:4.2,ev:0,roe:16.5,roa:1.5,dte:0,dta:0.05,cr:1.0,gm:0,om:52.5,nm:38.5,dy:5.82,po:52.5,be:0.52,ep:0.078,re:0.38e9,ni:0.16e9,fc:0,es:62,en:58,so:64,go:64,hr:0,sc:true},
  {t:'NLCS.QA',n:'Nakilat (Qatar Gas Transport)',x:'QSE',co:'QA',cu:'QAR',se:'Energy',in:'Oil & Gas Transport',pr:3.85,mc:21.4e9,pe:15.2,fpE:14.5,pb:2.2,ps:2.5,ev:12.5,roe:14.5,roa:3.5,dte:1.82,dta:0.58,cr:0.72,gm:32.5,om:22.5,nm:15.2,dy:4.52,po:68.5,be:0.42,ep:0.25,re:8.5e9,ni:1.4e9,fc:2.2e9,es:62,en:58,so:64,go:64,hr:0,sc:true},
  {t:'QIIB.QA',n:'Qatar International Islamic Bank',x:'QSE',co:'QA',cu:'QAR',se:'Financial Services',in:'Banking',pr:9.42,mc:14.2e9,pe:10.5,fpE:9.8,pb:1.5,ps:4.8,ev:0,roe:14.5,roa:1.5,dte:0,dta:0.05,cr:1.0,gm:0,om:58.2,nm:42.5,dy:4.82,po:48.5,be:0.55,ep:0.90,re:2.9e9,ni:1.4e9,fc:0,es:72,en:68,so:74,go:74,hr:0,sc:true},
  // ===== ASIA (40) =====
  {t:'7203.T',n:'Toyota Motor',x:'TSE_TOKYO',co:'JP',cu:'JPY',se:'Consumer Cyclical',in:'Auto Manufacturers',pr:3285,mc:42500e9,pe:10.2,fpE:9.5,pb:1.2,ps:0.9,ev:8.5,roe:12.5,roa:4.2,dte:0.58,dta:0.22,cr:1.22,gm:18.5,om:10.2,nm:7.5,dy:2.42,po:24.5,be:0.72,ep:322,re:37150e9,ni:2880e9,fc:2200e9,es:72,en:68,so:74,go:74,hr:0,sc:true},
  {t:'6758.T',n:'Sony Group',x:'TSE_TOKYO',co:'JP',cu:'JPY',se:'Technology',in:'Consumer Electronics',pr:12850,mc:16200e9,pe:18.5,fpE:16.2,pb:2.5,ps:1.4,ev:12.8,roe:13.5,roa:4.8,dte:0.32,dta:0.12,cr:0.82,gm:28.5,om:12.5,nm:8.2,dy:0.52,po:9.5,be:0.95,ep:694.59,re:11500e9,ni:972e9,fc:850e9,es:78,en:75,so:80,go:78,hr:5.2,sc:false},
  {t:'9984.T',n:'SoftBank Group',x:'TSE_TOKYO',co:'JP',cu:'JPY',se:'Technology',in:'Conglomerates',pr:8425,mc:12500e9,pe:22.5,fpE:15.2,pb:1.8,ps:1.8,ev:18.5,roe:8.2,roa:2.5,dte:1.82,dta:0.48,cr:1.52,gm:52.5,om:15.2,nm:8.5,dy:0.82,po:18.5,be:1.55,ep:374.44,re:6600e9,ni:518e9,fc:350e9,es:62,en:58,so:64,go:64,hr:0,sc:true},
  {t:'6861.T',n:'Keyence Corp',x:'TSE_TOKYO',co:'JP',cu:'JPY',se:'Technology',in:'Scientific Instruments',pr:62500,mc:15200e9,pe:38.5,fpE:32.5,pb:8.2,ps:16.5,ev:32.5,roe:21.5,roa:15.2,dte:0.02,dta:0.01,cr:5.82,gm:82.5,om:52.5,nm:38.5,dy:0.25,po:9.5,be:0.75,ep:1623.38,re:922e9,ni:355e9,fc:320e9,es:72,en:68,so:74,go:74,hr:0,sc:true},
  {t:'8306.T',n:'MUFG',x:'TSE_TOKYO',co:'JP',cu:'JPY',se:'Financial Services',in:'Banking',pr:1545,mc:19800e9,pe:11.2,fpE:10.5,pb:0.8,ps:2.2,ev:0,roe:7.2,roa:0.3,dte:0,dta:0.03,cr:1.0,gm:0,om:25.5,nm:18.2,dy:2.82,po:32.5,be:0.82,ep:137.95,re:8200e9,ni:1200e9,fc:0,es:68,en:62,so:72,go:70,hr:5.8,sc:false},
  {t:'9432.T',n:'NTT Corp',x:'TSE_TOKYO',co:'JP',cu:'JPY',se:'Communication Services',in:'Telecom',pr:168.50,mc:15200e9,pe:12.5,fpE:11.8,pb:1.5,ps:1.2,ev:8.5,roe:12.5,roa:3.8,dte:0.72,dta:0.28,cr:0.88,gm:32.5,om:16.5,nm:8.5,dy:3.02,po:38.5,be:0.42,ep:13.48,re:13200e9,ni:1120e9,fc:1500e9,es:72,en:68,so:74,go:74,hr:0,sc:true},
  {t:'0700.HK',n:'Tencent Holdings',x:'HKEX',co:'HK',cu:'HKD',se:'Technology',in:'Internet Services',pr:375.20,mc:3600e9,pe:22.5,fpE:18.5,pb:4.2,ps:6.5,ev:18.2,roe:18.5,roa:8.2,dte:0.42,dta:0.15,cr:1.52,gm:52.5,om:28.5,nm:22.5,dy:0.82,po:18.5,be:0.92,ep:16.68,re:615e9,ni:142e9,fc:158e9,es:62,en:58,so:64,go:64,hr:8.5,sc:false},
  {t:'9988.HK',n:'Alibaba Group',x:'HKEX',co:'HK',cu:'HKD',se:'Technology',in:'E-Commerce',pr:82.45,mc:1680e9,pe:15.8,fpE:11.5,pb:1.5,ps:1.8,ev:8.5,roe:10.2,roa:4.5,dte:0.22,dta:0.08,cr:1.82,gm:38.5,om:12.5,nm:8.2,dy:1.82,po:28.5,be:0.85,ep:5.22,re:941e9,ni:72e9,fc:115e9,es:58,en:52,so:62,go:62,hr:3.5,sc:false},
  {t:'0939.HK',n:'China Construction Bank',x:'HKEX',co:'HK',cu:'HKD',se:'Financial Services',in:'Banking',pr:5.82,mc:14600e9,pe:4.8,fpE:4.5,pb:0.5,ps:1.8,ev:0,roe:11.5,roa:0.9,dte:0,dta:0.04,cr:1.0,gm:0,om:42.5,nm:32.5,dy:7.52,po:35.2,be:0.75,ep:1.21,re:770e9,ni:252e9,fc:0,es:55,en:48,so:58,go:62,hr:5.2,sc:false},
  {t:'1299.HK',n:'AIA Group',x:'HKEX',co:'HK',cu:'HKD',se:'Financial Services',in:'Insurance',pr:62.50,mc:730e9,pe:15.2,fpE:12.5,pb:1.8,ps:3.2,ev:12.5,roe:12.5,roa:1.2,dte:0.15,dta:0.02,cr:1.0,gm:0,om:22.5,nm:15.2,dy:2.02,po:28.5,be:0.82,ep:4.11,re:42e9,ni:4.8e9,fc:0,es:72,en:68,so:74,go:74,hr:2.5,sc:false},
  {t:'3690.HK',n:'Meituan',x:'HKEX',co:'HK',cu:'HKD',se:'Technology',in:'Internet Services',pr:128.50,mc:800e9,pe:35.2,fpE:22.5,pb:4.5,ps:2.5,ev:28.5,roe:12.8,roa:4.5,dte:0.32,dta:0.12,cr:1.82,gm:32.5,om:5.2,nm:3.5,dy:0,po:0,be:1.15,ep:3.65,re:280e9,ni:12e9,fc:25e9,es:58,en:52,so:62,go:60,hr:5.8,sc:false},
  {t:'9618.HK',n:'JD.com',x:'HKEX',co:'HK',cu:'HKD',se:'Technology',in:'E-Commerce',pr:115.80,mc:360e9,pe:12.5,fpE:10.2,pb:1.5,ps:0.3,ev:5.2,roe:12.5,roa:3.8,dte:0.15,dta:0.05,cr:1.12,gm:10.2,om:3.5,nm:2.8,dy:1.82,po:22.5,be:0.92,ep:9.26,re:1085e9,ni:35e9,fc:42e9,es:55,en:48,so:58,go:62,hr:3.2,sc:false},
  {t:'600519.SS',n:'Kweichow Moutai',x:'SSE',co:'CN',cu:'CNY',se:'Consumer Defensive',in:'Beverages',pr:1680.50,mc:2110e9,pe:28.5,fpE:25.2,pb:10.5,ps:14.2,ev:22.5,roe:38.5,roa:22.5,dte:0.02,dta:0.01,cr:3.82,gm:91.5,om:58.5,nm:48.2,dy:2.82,po:72.5,be:0.45,ep:58.95,re:148.5e9,ni:71.2e9,fc:65e9,es:55,en:48,so:58,go:62,hr:100,sc:false},
  {t:'601318.SS',n:'Ping An Insurance',x:'SSE',co:'CN',cu:'CNY',se:'Financial Services',in:'Insurance',pr:48.25,mc:880e9,pe:8.5,fpE:7.8,pb:1.0,ps:0.5,ev:5.2,roe:12.5,roa:1.5,dte:0,dta:0.05,cr:1.0,gm:0,om:12.5,nm:5.8,dy:3.82,po:32.5,be:0.92,ep:5.68,re:1228e9,ni:105e9,fc:0,es:58,en:52,so:62,go:60,hr:5.2,sc:false},
  {t:'000858.SZ',n:'Wuliangye Yibin',x:'SZSE',co:'CN',cu:'CNY',se:'Consumer Defensive',in:'Beverages',pr:148.20,mc:575e9,pe:18.5,fpE:16.2,pb:5.2,ps:6.8,ev:15.2,roe:28.5,roa:15.8,dte:0.05,dta:0.02,cr:3.52,gm:75.2,om:42.5,nm:35.2,dy:3.52,po:62.5,be:0.55,ep:8.01,re:84.8e9,ni:29.5e9,fc:25e9,es:52,en:45,so:55,go:58,hr:100,sc:false},
  {t:'005930.KS',n:'Samsung Electronics',x:'KRX',co:'KR',cu:'KRW',se:'Technology',in:'Consumer Electronics',pr:72800,mc:434000e9,pe:18.5,fpE:12.5,pb:1.2,ps:1.5,ev:8.5,roe:6.5,roa:3.8,dte:0.05,dta:0.02,cr:2.82,gm:38.5,om:12.5,nm:8.5,dy:2.02,po:35.2,be:1.08,ep:3935.14,re:258900e9,ni:15400e9,fc:22500e9,es:72,en:68,so:74,go:74,hr:0,sc:true},
  {t:'000660.KS',n:'SK Hynix',x:'KRX',co:'KR',cu:'KRW',se:'Technology',in:'Semiconductors',pr:142500,mc:103800e9,pe:0,fpE:8.5,pb:1.8,ps:2.2,ev:12.5,roe:-5.2,roa:-2.5,dte:0.42,dta:0.15,cr:1.82,gm:18.5,om:-15.2,nm:-18.5,dy:1.52,po:0,be:1.72,ep:-12500,re:44300e9,ni:-7800e9,fc:-5200e9,es:65,en:58,so:68,go:70,hr:0,sc:true},
  {t:'2330.TW',n:'TSMC',x:'TWSE',co:'TW',cu:'TWD',se:'Technology',in:'Semiconductors',pr:585,mc:15200e9,pe:22.5,fpE:18.5,pb:5.8,ps:10.2,ev:18.5,roe:26.5,roa:12.8,dte:0.28,dta:0.12,cr:2.22,gm:55.2,om:42.5,nm:38.5,dy:1.52,po:32.5,be:0.95,ep:26,re:2162e9,ni:850e9,fc:420e9,es:78,en:76,so:80,go:78,hr:0,sc:true},
  {t:'2317.TW',n:'Hon Hai (Foxconn)',x:'TWSE',co:'TW',cu:'TWD',se:'Technology',in:'Electronics Manufacturing',pr:108.50,mc:1500e9,pe:12.5,fpE:10.2,pb:1.5,ps:0.2,ev:5.2,roe:12.5,roa:3.2,dte:0.42,dta:0.15,cr:1.32,gm:6.5,om:3.2,nm:2.5,dy:4.52,po:55.2,be:0.95,ep:8.68,re:6600e9,ni:158e9,fc:120e9,es:58,en:52,so:62,go:60,hr:0,sc:true},
  {t:'RELIANCE.NS',n:'Reliance Industries',x:'NSE_INDIA',co:'IN',cu:'INR',se:'Energy',in:'Conglomerates',pr:2485,mc:16800e9,pe:28.5,fpE:22.5,pb:2.5,ps:2.2,ev:18.5,roe:9.2,roa:3.8,dte:0.42,dta:0.15,cr:1.22,gm:22.5,om:12.5,nm:7.5,dy:0.35,po:9.5,be:0.82,ep:87.19,re:9750e9,ni:695e9,fc:520e9,es:55,en:42,so:62,go:65,hr:0,sc:true},
  {t:'TCS.NS',n:'Tata Consultancy',x:'NSE_INDIA',co:'IN',cu:'INR',se:'Technology',in:'IT Services',pr:3725,mc:13500e9,pe:28.5,fpE:25.2,pb:14.2,ps:5.5,ev:22.5,roe:48.5,roa:22.5,dte:0.08,dta:0.04,cr:2.52,gm:42.5,om:25.2,nm:18.5,dy:1.22,po:32.5,be:0.65,ep:130.70,re:2390e9,ni:420e9,fc:380e9,es:82,en:80,so:84,go:82,hr:0,sc:true},
  {t:'HDFCBANK.NS',n:'HDFC Bank',x:'NSE_INDIA',co:'IN',cu:'INR',se:'Financial Services',in:'Banking',pr:1628,mc:12300e9,pe:18.5,fpE:16.2,pb:2.8,ps:5.2,ev:0,roe:16.5,roa:1.8,dte:0,dta:0.06,cr:1.0,gm:0,om:42.5,nm:28.5,dy:1.12,po:20.5,be:0.82,ep:88,re:2280e9,ni:460e9,fc:0,es:72,en:68,so:74,go:74,hr:0,sc:true},
  {t:'INFY.NS',n:'Infosys Ltd',x:'NSE_INDIA',co:'IN',cu:'INR',se:'Technology',in:'IT Services',pr:1485,mc:6200e9,pe:25.2,fpE:22.5,pb:8.5,ps:4.2,ev:18.5,roe:32.5,roa:15.8,dte:0.08,dta:0.04,cr:2.22,gm:35.2,om:22.5,nm:16.5,dy:2.42,po:58.5,be:0.75,ep:58.93,re:1560e9,ni:248e9,fc:220e9,es:82,en:82,so:82,go:82,hr:0,sc:true},
  {t:'HINDUNILVR.NS',n:'Hindustan Unilever',x:'NSE_INDIA',co:'IN',cu:'INR',se:'Consumer Defensive',in:'Household Products',pr:2540,mc:5960e9,pe:58.5,fpE:48.2,pb:12.5,ps:9.8,ev:45.2,roe:22.5,roa:15.8,dte:0.12,dta:0.05,cr:1.52,gm:52.5,om:22.5,nm:16.5,dy:1.52,po:85,be:0.42,ep:43.42,re:608e9,ni:96e9,fc:85e9,es:82,en:82,so:82,go:82,hr:3.5,sc:false},
  {t:'ICICIBANK.NS',n:'ICICI Bank',x:'NSE_INDIA',co:'IN',cu:'INR',se:'Financial Services',in:'Banking',pr:985,mc:6850e9,pe:18.5,fpE:15.2,pb:3.2,ps:5.8,ev:0,roe:17.5,roa:2.2,dte:0,dta:0.07,cr:1.0,gm:0,om:45.2,nm:32.5,dy:0.82,po:15.2,be:0.92,ep:53.24,re:1250e9,ni:400e9,fc:0,es:68,en:62,so:72,go:70,hr:0,sc:true},
  {t:'D05.SI',n:'DBS Group',x:'SGX',co:'SG',cu:'SGD',se:'Financial Services',in:'Banking',pr:35.82,mc:92e9,pe:10.2,fpE:9.5,pb:1.5,ps:4.8,ev:0,roe:15.2,roa:1.2,dte:0,dta:0.05,cr:1.0,gm:0,om:55.2,nm:42.5,dy:4.52,po:42.5,be:0.72,ep:3.51,re:19.5e9,ni:8.5e9,fc:0,es:78,en:76,so:80,go:78,hr:0,sc:true},
  {t:'O39.SI',n:'OCBC Bank',x:'SGX',co:'SG',cu:'SGD',se:'Financial Services',in:'Banking',pr:13.85,mc:62e9,pe:9.8,fpE:9.2,pb:1.2,ps:4.2,ev:0,roe:12.5,roa:1.0,dte:0,dta:0.04,cr:1.0,gm:0,om:48.5,nm:35.2,dy:5.52,po:52.5,be:0.62,ep:1.41,re:14.8e9,ni:5.2e9,fc:0,es:76,en:74,so:78,go:76,hr:0,sc:true},
  {t:'Z74.SI',n:'SingTel',x:'SGX',co:'SG',cu:'SGD',se:'Communication Services',in:'Telecom',pr:2.85,mc:47e9,pe:22.5,fpE:18.5,pb:1.5,ps:1.8,ev:12.5,roe:6.8,roa:2.5,dte:0.42,dta:0.15,cr:0.82,gm:32.5,om:12.5,nm:8.2,dy:4.82,po:100,be:0.55,ep:0.13,re:16.2e9,ni:2.1e9,fc:3.5e9,es:72,en:68,so:74,go:74,hr:0,sc:true},
  {t:'BHP.AX',n:'BHP Group',x:'ASX',co:'AU',cu:'AUD',se:'Basic Materials',in:'Mining',pr:44.85,mc:227e9,pe:12.5,fpE:11.2,pb:2.8,ps:3.8,ev:8.2,roe:22.5,roa:12.5,dte:0.32,dta:0.12,cr:1.42,gm:52.5,om:32.5,nm:22.5,dy:4.52,po:55.2,be:0.85,ep:3.59,re:55.2e9,ni:13.4e9,fc:15.2e9,es:68,en:58,so:72,go:75,hr:0,sc:true},
  {t:'CBA.AX',n:'Commonwealth Bank',x:'ASX',co:'AU',cu:'AUD',se:'Financial Services',in:'Banking',pr:112.45,mc:188e9,pe:18.5,fpE:17.2,pb:2.8,ps:6.5,ev:0,roe:15.2,roa:0.8,dte:0,dta:0.05,cr:1.0,gm:0,om:42.5,nm:32.5,dy:3.52,po:62.5,be:0.55,ep:6.08,re:28.5e9,ni:9.2e9,fc:0,es:75,en:72,so:78,go:75,hr:0,sc:true},
  {t:'CSL.AX',n:'CSL Ltd',x:'ASX',co:'AU',cu:'AUD',se:'Healthcare',in:'Biotechnology',pr:282.50,mc:136e9,pe:35.2,fpE:28.5,pb:8.2,ps:8.5,ev:28.5,roe:22.5,roa:6.8,dte:0.82,dta:0.28,cr:1.05,gm:55.2,om:22.5,nm:16.5,dy:1.02,po:35.2,be:0.45,ep:8.03,re:16.2e9,ni:2.5e9,fc:2.2e9,es:78,en:76,so:80,go:78,hr:0,sc:true},
  {t:'WBC.AX',n:'Westpac Banking',x:'ASX',co:'AU',cu:'AUD',se:'Financial Services',in:'Banking',pr:25.82,mc:92e9,pe:14.5,fpE:13.2,pb:1.2,ps:3.8,ev:0,roe:8.5,roa:0.5,dte:0,dta:0.04,cr:1.0,gm:0,om:35.2,nm:22.5,dy:4.82,po:68.5,be:0.72,ep:1.78,re:22.5e9,ni:5.2e9,fc:0,es:68,en:62,so:72,go:70,hr:0,sc:true},
  {t:'NAB.AX',n:'National Australia Bank',x:'ASX',co:'AU',cu:'AUD',se:'Financial Services',in:'Banking',pr:32.45,mc:105e9,pe:13.5,fpE:12.8,pb:1.5,ps:4.2,ev:0,roe:11.2,roa:0.7,dte:0,dta:0.04,cr:1.0,gm:0,om:38.5,nm:25.2,dy:4.52,po:58.5,be:0.68,ep:2.40,re:24.8e9,ni:6.5e9,fc:0,es:72,en:68,so:74,go:74,hr:0,sc:true},
  {t:'STC.BK',n:'Siam Cement',x:'SET',co:'TH',cu:'THB',se:'Industrials',in:'Building Materials',pr:285,mc:341e9,pe:18.5,fpE:15.2,pb:1.8,ps:0.8,ev:12.5,roe:9.8,roa:3.5,dte:0.82,dta:0.28,cr:1.12,gm:22.5,om:8.2,nm:5.5,dy:2.82,po:48.5,be:0.78,ep:15.41,re:430e9,ni:22.5e9,fc:18e9,es:75,en:72,so:78,go:75,hr:0,sc:true},
  {t:'PTT.BK',n:'PTT Public Co',x:'SET',co:'TH',cu:'THB',se:'Energy',in:'Oil & Gas',pr:32.50,mc:925e9,pe:8.5,fpE:7.8,pb:0.8,ps:0.3,ev:5.2,roe:9.5,roa:3.2,dte:0.52,dta:0.18,cr:1.28,gm:18.5,om:8.5,nm:4.2,dy:5.52,po:45.2,be:0.82,ep:3.82,re:2850e9,ni:120e9,fc:85e9,es:58,en:48,so:62,go:68,hr:0,sc:true},
  {t:'BBCA.JK',n:'Bank Central Asia',x:'IDX',co:'ID',cu:'IDR',se:'Financial Services',in:'Banking',pr:9625,mc:1190000e9,pe:25.5,fpE:22.5,pb:4.8,ps:10.2,ev:0,roe:18.5,roa:3.5,dte:0,dta:0.08,cr:1.0,gm:0,om:55.2,nm:42.5,dy:1.82,po:42.5,be:0.65,ep:377.45,re:105e12,ni:42.5e12,fc:0,es:72,en:68,so:74,go:74,hr:0,sc:true},
  {t:'TLKM.JK',n:'Telkom Indonesia',x:'IDX',co:'ID',cu:'IDR',se:'Communication Services',in:'Telecom',pr:3850,mc:380000e9,pe:14.5,fpE:12.8,pb:2.5,ps:2.2,ev:8.5,roe:17.5,roa:6.8,dte:0.52,dta:0.18,cr:0.72,gm:55.2,om:22.5,nm:15.2,dy:4.52,po:62.5,be:0.52,ep:265.52,re:148e12,ni:22.5e12,fc:28e12,es:72,en:68,so:74,go:74,hr:0,sc:true},
  {t:'ASII.JK',n:'Astra International',x:'IDX',co:'ID',cu:'IDR',se:'Consumer Cyclical',in:'Conglomerates',pr:5475,mc:222000e9,pe:8.5,fpE:7.8,pb:1.2,ps:0.5,ev:5.2,roe:14.5,roa:5.2,dte:0.42,dta:0.15,cr:1.32,gm:22.5,om:10.2,nm:7.5,dy:5.82,po:48.5,be:0.92,ep:643.53,re:316e12,ni:28.5e12,fc:22e12,es:62,en:55,so:65,go:68,hr:0,sc:true},
  {t:'MAYBANK.KL',n:'Malayan Banking',x:'BURSA',co:'MY',cu:'MYR',se:'Financial Services',in:'Banking',pr:9.55,mc:107e9,pe:12.5,fpE:11.5,pb:1.2,ps:3.5,ev:0,roe:10.2,roa:0.8,dte:0,dta:0.05,cr:1.0,gm:0,om:42.5,nm:28.5,dy:5.82,po:68.5,be:0.65,ep:0.76,re:28.5e9,ni:8.2e9,fc:0,es:72,en:68,so:74,go:74,hr:0,sc:true},
  {t:'TENAGA.KL',n:'Tenaga Nasional',x:'BURSA',co:'MY',cu:'MYR',se:'Utilities',in:'Electric Utilities',pr:13.42,mc:76e9,pe:14.5,fpE:12.5,pb:1.5,ps:1.2,ev:8.5,roe:10.5,roa:3.5,dte:0.62,dta:0.22,cr:0.92,gm:22.5,om:12.5,nm:8.2,dy:3.82,po:52.5,be:0.55,ep:0.93,re:55e9,ni:5.2e9,fc:4.5e9,es:68,en:72,so:64,go:68,hr:0,sc:true},

  // ===== LATIN AMERICA (15) =====
  {t:'VALE3.SA',n:'Vale SA',x:'B3',co:'BR',cu:'BRL',se:'Basic Materials',in:'Mining',pr:68.42,mc:325e9,pe:6.5,fpE:5.8,pb:1.5,ps:1.2,ev:4.5,roe:22.5,roa:10.5,dte:0.52,dta:0.18,cr:1.82,gm:42.5,om:32.5,nm:22.5,dy:8.52,po:52.5,be:0.95,ep:10.53,re:262e9,ni:62e9,fc:42e9,es:55,en:42,so:62,go:65,hr:0,sc:true},
  {t:'PETR4.SA',n:'Petrobras',x:'B3',co:'BR',cu:'BRL',se:'Energy',in:'Oil & Gas',pr:38.52,mc:500e9,pe:4.2,fpE:4.5,pb:1.2,ps:0.8,ev:3.2,roe:28.5,roa:12.5,dte:0.62,dta:0.22,cr:1.05,gm:48.5,om:32.5,nm:22.5,dy:12.5,po:52.5,be:0.85,ep:9.17,re:585e9,ni:128e9,fc:120e9,es:48,en:38,so:55,go:58,hr:0,sc:true},
  {t:'ITUB4.SA',n:'Itaú Unibanco',x:'B3',co:'BR',cu:'BRL',se:'Financial Services',in:'Banking',pr:32.85,mc:320e9,pe:8.5,fpE:7.8,pb:1.8,ps:3.5,ev:0,roe:21.5,roa:1.5,dte:0,dta:0.05,cr:1.0,gm:0,om:42.5,nm:28.5,dy:4.52,po:38.5,be:0.92,ep:3.86,re:82.5e9,ni:32.5e9,fc:0,es:72,en:68,so:74,go:74,hr:0,sc:true},
  {t:'BBDC4.SA',n:'Bradesco',x:'B3',co:'BR',cu:'BRL',se:'Financial Services',in:'Banking',pr:15.28,mc:162e9,pe:9.5,fpE:7.2,pb:1.0,ps:1.8,ev:0,roe:10.5,roa:0.8,dte:0,dta:0.04,cr:1.0,gm:0,om:22.5,nm:12.5,dy:6.82,po:62.5,be:1.05,ep:1.61,re:85.2e9,ni:15.2e9,fc:0,es:68,en:62,so:72,go:70,hr:0,sc:true},
  {t:'WEGE3.SA',n:'WEG SA',x:'B3',co:'BR',cu:'BRL',se:'Industrials',in:'Electrical Equipment',pr:42.85,mc:180e9,pe:32.5,fpE:28.5,pb:10.2,ps:5.8,ev:25.5,roe:32.5,roa:12.5,dte:0.15,dta:0.08,cr:2.52,gm:32.5,om:18.5,nm:14.2,dy:1.22,po:38.5,be:0.72,ep:1.32,re:32.5e9,ni:4.8e9,fc:3.5e9,es:78,en:82,so:76,go:76,hr:0,sc:true},
  {t:'AMXL.MX',n:'América Móvil',x:'BMV',co:'MX',cu:'MXN',se:'Communication Services',in:'Telecom',pr:17.85,mc:1200e9,pe:12.5,fpE:11.2,pb:3.2,ps:1.2,ev:8.5,roe:25.5,roa:5.8,dte:1.52,dta:0.42,cr:0.72,gm:52.5,om:18.5,nm:12.5,dy:3.52,po:42.5,be:0.72,ep:1.43,re:1050e9,ni:120e9,fc:85e9,es:62,en:58,so:64,go:64,hr:0,sc:true},
  {t:'FEMSAUBD.MX',n:'FEMSA',x:'BMV',co:'MX',cu:'MXN',se:'Consumer Defensive',in:'Retail',pr:185.50,mc:660e9,pe:22.5,fpE:18.5,pb:2.8,ps:1.2,ev:15.2,roe:12.5,roa:4.5,dte:0.42,dta:0.15,cr:1.22,gm:35.2,om:8.5,nm:5.5,dy:1.82,po:38.5,be:0.72,ep:8.24,re:542e9,ni:35e9,fc:28e9,es:72,en:68,so:74,go:74,hr:5.8,sc:false},
  {t:'GFNORTEO.MX',n:'Grupo Financiero Banorte',x:'BMV',co:'MX',cu:'MXN',se:'Financial Services',in:'Banking',pr:172.50,mc:498e9,pe:8.5,fpE:7.8,pb:1.5,ps:3.2,ev:0,roe:18.5,roa:1.8,dte:0,dta:0.06,cr:1.0,gm:0,om:52.5,nm:35.2,dy:4.52,po:38.5,be:0.92,ep:20.29,re:155e9,ni:55e9,fc:0,es:68,en:62,so:72,go:70,hr:0,sc:true},
  {t:'WALMEX.MX',n:'Walmart de Mexico',x:'BMV',co:'MX',cu:'MXN',se:'Consumer Defensive',in:'Retail',pr:62.50,mc:1100e9,pe:22.5,fpE:20.2,pb:5.8,ps:1.2,ev:15.2,roe:25.5,roa:8.5,dte:0.32,dta:0.12,cr:0.82,gm:22.5,om:8.2,nm:5.5,dy:1.82,po:42.5,be:0.55,ep:2.78,re:920e9,ni:52e9,fc:42e9,es:72,en:68,so:74,go:74,hr:3.5,sc:true},
  {t:'CEMEXCPO.MX',n:'CEMEX',x:'BMV',co:'MX',cu:'MXN',se:'Basic Materials',in:'Building Materials',pr:12.25,mc:182e9,pe:10.2,fpE:8.5,pb:0.8,ps:0.5,ev:7.2,roe:8.5,roa:3.2,dte:0.72,dta:0.28,cr:0.72,gm:32.5,om:12.5,nm:5.5,dy:0,po:0,be:1.22,ep:1.20,re:345e9,ni:18e9,fc:22e9,es:68,en:72,so:65,go:68,hr:0,sc:true},
  {t:'GGAL.BA',n:'Grupo Financiero Galicia',x:'BCBA',co:'AR',cu:'ARS',se:'Financial Services',in:'Banking',pr:5420,mc:2700e9,pe:5.2,fpE:4.8,pb:1.2,ps:1.5,ev:0,roe:22.5,roa:2.5,dte:0,dta:0.08,cr:1.0,gm:0,om:48.5,nm:32.5,dy:2.82,po:15.2,be:1.55,ep:1042.31,re:1850e9,ni:580e9,fc:0,es:55,en:48,so:58,go:62,hr:0,sc:true},
  {t:'YPF.BA',n:'YPF SA',x:'BCBA',co:'AR',cu:'ARS',se:'Energy',in:'Oil & Gas',pr:28500,mc:11000e9,pe:8.5,fpE:5.2,pb:1.2,ps:0.5,ev:4.2,roe:14.5,roa:5.2,dte:0.82,dta:0.28,cr:1.05,gm:42.5,om:22.5,nm:12.5,dy:0,po:0,be:1.42,ep:3352.94,re:20500e9,ni:2500e9,fc:1800e9,es:42,en:35,so:48,go:52,hr:0,sc:true},
  {t:'BSAC.SN',n:'Banco Santander Chile',x:'BCS',co:'CL',cu:'CLP',se:'Financial Services',in:'Banking',pr:42500,mc:8100e9,pe:10.2,fpE:9.5,pb:2.2,ps:4.5,ev:0,roe:22.5,roa:1.5,dte:0,dta:0.05,cr:1.0,gm:0,om:48.5,nm:35.2,dy:4.52,po:45.2,be:0.82,ep:4166.67,re:1850e9,ni:625e9,fc:0,es:72,en:68,so:74,go:74,hr:0,sc:true},
  {t:'FALABELLA.SN',n:'Falabella',x:'BCS',co:'CL',cu:'CLP',se:'Consumer Cyclical',in:'Retail',pr:2850,mc:7200e9,pe:15.2,fpE:12.5,pb:1.2,ps:0.5,ev:10.2,roe:8.2,roa:2.5,dte:0.82,dta:0.28,cr:1.12,gm:32.5,om:5.2,nm:3.5,dy:2.82,po:42.5,be:1.15,ep:187.50,re:13500e9,ni:475e9,fc:350e9,es:68,en:65,so:70,go:68,hr:0,sc:true},
  {t:'BVN.LM',n:'Buenaventura Mining',x:'BVL',co:'PE',cu:'PEN',se:'Basic Materials',in:'Mining',pr:14.85,mc:3.8e9,pe:15.2,fpE:12.5,pb:1.2,ps:2.2,ev:8.5,roe:8.5,roa:4.2,dte:0.22,dta:0.08,cr:2.52,gm:42.5,om:18.5,nm:12.5,dy:1.82,po:28.5,be:0.85,ep:0.98,re:1.8e9,ni:0.25e9,fc:0.2e9,es:55,en:45,so:58,go:65,hr:0,sc:true},
  // ===== AFRICA (10) =====
  {t:'NPN.JO',n:'Naspers Ltd',x:'JSE',co:'ZA',cu:'ZAR',se:'Technology',in:'Internet Services',pr:3685,mc:790e9,pe:18.5,fpE:12.5,pb:2.5,ps:8.2,ev:15.2,roe:14.5,roa:5.2,dte:0.22,dta:0.08,cr:1.82,gm:42.5,om:12.5,nm:8.5,dy:0.22,po:4.2,be:1.05,ep:199.19,re:100e9,ni:15e9,fc:12e9,es:62,en:58,so:64,go:64,hr:5.8,sc:false},
  {t:'SOL.JO',n:'Sasol Ltd',x:'JSE',co:'ZA',cu:'ZAR',se:'Energy',in:'Chemicals',pr:128.50,mc:78e9,pe:5.8,fpE:5.2,pb:0.5,ps:0.3,ev:4.2,roe:8.5,roa:3.2,dte:0.82,dta:0.28,cr:1.28,gm:28.5,om:12.5,nm:5.5,dy:5.82,po:32.5,be:1.22,ep:22.16,re:245e9,ni:14e9,fc:18e9,es:42,en:32,so:48,go:55,hr:0,sc:true},
  {t:'SBK.JO',n:'Standard Bank',x:'JSE',co:'ZA',cu:'ZAR',se:'Financial Services',in:'Banking',pr:185.20,mc:310e9,pe:8.5,fpE:7.8,pb:1.2,ps:2.5,ev:0,roe:14.5,roa:1.0,dte:0,dta:0.05,cr:1.0,gm:0,om:42.5,nm:28.5,dy:5.52,po:45.2,be:0.85,ep:21.79,re:122e9,ni:35e9,fc:0,es:72,en:68,so:74,go:74,hr:0,sc:true},
  {t:'ANG.JO',n:'AngloGold Ashanti',x:'JSE',co:'ZA',cu:'ZAR',se:'Basic Materials',in:'Gold Mining',pr:425.80,mc:175e9,pe:22.5,fpE:12.5,pb:2.5,ps:3.2,ev:12.5,roe:11.5,roa:4.5,dte:0.42,dta:0.15,cr:2.22,gm:42.5,om:22.5,nm:12.5,dy:1.82,po:38.5,be:0.72,ep:18.92,re:58e9,ni:7.5e9,fc:5.2e9,es:62,en:52,so:68,go:70,hr:0,sc:true},
  {t:'DANGCEM.NG',n:'Dangote Cement',x:'NGX',co:'NG',cu:'NGN',se:'Basic Materials',in:'Building Materials',pr:285.50,mc:4850e9,pe:12.5,fpE:10.2,pb:3.2,ps:2.2,ev:8.5,roe:25.5,roa:8.5,dte:0.42,dta:0.15,cr:0.72,gm:52.5,om:28.5,nm:15.2,dy:4.52,po:55.2,be:0.75,ep:22.84,re:2200e9,ni:350e9,fc:280e9,es:58,en:48,so:62,go:68,hr:0,sc:true},
  {t:'GTCO.NG',n:'Guaranty Trust Holding',x:'NGX',co:'NG',cu:'NGN',se:'Financial Services',in:'Banking',pr:42.50,mc:1250e9,pe:4.2,fpE:3.8,pb:0.8,ps:2.5,ev:0,roe:18.5,roa:3.5,dte:0,dta:0.08,cr:1.0,gm:0,om:55.2,nm:42.5,dy:8.52,po:35.2,be:0.85,ep:10.12,re:520e9,ni:215e9,fc:0,es:62,en:55,so:65,go:68,hr:0,sc:true},
  {t:'AIRTELAFRI.NG',n:'Airtel Africa',x:'NGX',co:'NG',cu:'NGN',se:'Communication Services',in:'Telecom',pr:1850,mc:6950e9,pe:18.5,fpE:14.5,pb:5.2,ps:2.8,ev:12.5,roe:28.5,roa:6.8,dte:1.22,dta:0.38,cr:0.62,gm:55.2,om:22.5,nm:12.5,dy:3.52,po:62.5,be:0.75,ep:100,re:2450e9,ni:305e9,fc:385e9,es:62,en:58,so:64,go:64,hr:0,sc:true},
  {t:'SCOM.NR',n:'Safaricom',x:'NSE_NAIROBI',co:'KE',cu:'KES',se:'Communication Services',in:'Telecom',pr:28.50,mc:1140e9,pe:15.2,fpE:13.5,pb:5.8,ps:2.8,ev:10.2,roe:38.5,roa:12.5,dte:0.32,dta:0.12,cr:0.72,gm:42.5,om:22.5,nm:18.2,dy:5.52,po:82.5,be:0.52,ep:1.88,re:395e9,ni:72e9,fc:55e9,es:72,en:68,so:74,go:74,hr:0,sc:true},
  {t:'EQTY.NR',n:'Equity Group Holdings',x:'NSE_NAIROBI',co:'KE',cu:'KES',se:'Financial Services',in:'Banking',pr:42.85,mc:162e9,pe:5.2,fpE:4.8,pb:1.2,ps:2.8,ev:0,roe:22.5,roa:3.2,dte:0,dta:0.08,cr:1.0,gm:0,om:48.5,nm:32.5,dy:4.52,po:22.5,be:0.82,ep:8.24,re:58e9,ni:18.8e9,fc:0,es:72,en:68,so:74,go:74,hr:0,sc:true},
  {t:'COOP.NR',n:'Co-operative Bank',x:'NSE_NAIROBI',co:'KE',cu:'KES',se:'Financial Services',in:'Banking',pr:14.25,mc:72e9,pe:5.8,fpE:5.2,pb:0.8,ps:2.2,ev:0,roe:14.5,roa:2.5,dte:0,dta:0.06,cr:1.0,gm:0,om:42.5,nm:28.5,dy:6.52,po:35.2,be:0.72,ep:2.46,re:32.5e9,ni:9.2e9,fc:0,es:62,en:58,so:64,go:64,hr:0,sc:true},
];

export const STOCKS = _stockDefs.map(makeStock);


// ========= BOND DATA =========
const _bondDefs = [
  // US Treasuries (full curve)
  {id:'UST-1M',n:'US Treasury 1M',co:'US',cu:'USD',mat:'1M',y:5.42,c:0,pr:99.55,r:'AAA',tp:'sovereign'},
  {id:'UST-3M',n:'US Treasury 3M',co:'US',cu:'USD',mat:'3M',y:5.38,c:0,pr:98.65,r:'AAA',tp:'sovereign'},
  {id:'UST-6M',n:'US Treasury 6M',co:'US',cu:'USD',mat:'6M',y:5.30,c:0,pr:97.40,r:'AAA',tp:'sovereign'},
  {id:'UST-1Y',n:'US Treasury 1Y',co:'US',cu:'USD',mat:'1Y',y:5.12,c:4.75,pr:99.65,r:'AAA',tp:'sovereign'},
  {id:'UST-2Y',n:'US Treasury 2Y',co:'US',cu:'USD',mat:'2Y',y:4.72,c:4.50,pr:99.58,r:'AAA',tp:'sovereign'},
  {id:'UST-5Y',n:'US Treasury 5Y',co:'US',cu:'USD',mat:'5Y',y:4.28,c:4.25,pr:99.86,r:'AAA',tp:'sovereign'},
  {id:'UST-10Y',n:'US Treasury 10Y',co:'US',cu:'USD',mat:'10Y',y:4.35,c:4.00,pr:97.15,r:'AAA',tp:'sovereign'},
  {id:'UST-20Y',n:'US Treasury 20Y',co:'US',cu:'USD',mat:'20Y',y:4.62,c:4.50,pr:98.05,r:'AAA',tp:'sovereign'},
  {id:'UST-30Y',n:'US Treasury 30Y',co:'US',cu:'USD',mat:'30Y',y:4.48,c:4.25,pr:95.82,r:'AAA',tp:'sovereign'},
  // UK Gilts
  {id:'GILT-2Y',n:'UK Gilt 2Y',co:'GB',cu:'GBP',mat:'2Y',y:4.52,c:4.25,pr:99.48,r:'AA',tp:'sovereign'},
  {id:'GILT-10Y',n:'UK Gilt 10Y',co:'GB',cu:'GBP',mat:'10Y',y:4.18,c:3.75,pr:96.42,r:'AA',tp:'sovereign'},
  {id:'GILT-30Y',n:'UK Gilt 30Y',co:'GB',cu:'GBP',mat:'30Y',y:4.65,c:4.50,pr:97.25,r:'AA',tp:'sovereign'},
  // German Bunds
  {id:'BUND-2Y',n:'German Bund 2Y',co:'DE',cu:'EUR',mat:'2Y',y:2.85,c:2.50,pr:99.32,r:'AAA',tp:'sovereign'},
  {id:'BUND-10Y',n:'German Bund 10Y',co:'DE',cu:'EUR',mat:'10Y',y:2.42,c:2.00,pr:96.25,r:'AAA',tp:'sovereign'},
  {id:'BUND-30Y',n:'German Bund 30Y',co:'DE',cu:'EUR',mat:'30Y',y:2.68,c:2.50,pr:95.82,r:'AAA',tp:'sovereign'},
  // Japan JGBs
  {id:'JGB-2Y',n:'Japan JGB 2Y',co:'JP',cu:'JPY',mat:'2Y',y:0.08,c:0.05,pr:99.94,r:'A+',tp:'sovereign'},
  {id:'JGB-10Y',n:'Japan JGB 10Y',co:'JP',cu:'JPY',mat:'10Y',y:0.82,c:0.50,pr:96.85,r:'A+',tp:'sovereign'},
  {id:'JGB-30Y',n:'Japan JGB 30Y',co:'JP',cu:'JPY',mat:'30Y',y:1.72,c:1.50,pr:94.52,r:'A+',tp:'sovereign'},
  // Other sovereign
  {id:'OAT-10Y',n:'France OAT 10Y',co:'FR',cu:'EUR',mat:'10Y',y:3.05,c:2.75,pr:97.42,r:'AA-',tp:'sovereign'},
  {id:'BTP-10Y',n:'Italy BTP 10Y',co:'IT',cu:'EUR',mat:'10Y',y:3.88,c:3.50,pr:96.52,r:'BBB',tp:'sovereign'},
  {id:'SPAIN-10Y',n:'Spain 10Y',co:'ES',cu:'EUR',mat:'10Y',y:3.35,c:3.00,pr:97.15,r:'A',tp:'sovereign'},
  {id:'CAN-10Y',n:'Canada 10Y',co:'CA',cu:'CAD',mat:'10Y',y:3.52,c:3.25,pr:97.85,r:'AAA',tp:'sovereign'},
  {id:'AUS-10Y',n:'Australia 10Y',co:'AU',cu:'AUD',mat:'10Y',y:4.15,c:3.75,pr:96.82,r:'AAA',tp:'sovereign'},
  {id:'SWI-10Y',n:'Switzerland 10Y',co:'CH',cu:'CHF',mat:'10Y',y:0.82,c:0.50,pr:96.85,r:'AAA',tp:'sovereign'},
  {id:'CHN-10Y',n:'China 10Y',co:'CN',cu:'CNY',mat:'10Y',y:2.68,c:2.50,pr:98.25,r:'A+',tp:'sovereign'},
  {id:'IND-10Y',n:'India 10Y',co:'IN',cu:'INR',mat:'10Y',y:7.15,c:7.00,pr:98.82,r:'BBB-',tp:'sovereign'},
  {id:'BRA-10Y',n:'Brazil 10Y',co:'BR',cu:'BRL',mat:'10Y',y:11.25,c:10.00,pr:92.15,r:'BB-',tp:'sovereign'},
  {id:'MEX-10Y',n:'Mexico 10Y',co:'MX',cu:'MXN',mat:'10Y',y:9.42,c:8.50,pr:93.25,r:'BBB',tp:'sovereign'},
  {id:'ZAF-10Y',n:'South Africa 10Y',co:'ZA',cu:'ZAR',mat:'10Y',y:10.15,c:9.00,pr:91.85,r:'BB-',tp:'sovereign'},
  {id:'TUR-10Y',n:'Turkey 10Y',co:'TR',cu:'TRY',mat:'10Y',y:25.80,c:20.00,pr:75.42,r:'B',tp:'sovereign'},
  {id:'KOR-10Y',n:'Korea 10Y',co:'KR',cu:'KRW',mat:'10Y',y:3.55,c:3.25,pr:97.52,r:'AA',tp:'sovereign'},
  {id:'IDN-10Y',n:'Indonesia 10Y',co:'ID',cu:'IDR',mat:'10Y',y:6.82,c:6.50,pr:97.25,r:'BBB',tp:'sovereign'},
  // GCC Sovereigns
  {id:'KSA-10Y',n:'Saudi Arabia 10Y',co:'SA',cu:'USD',mat:'10Y',y:4.85,c:4.50,pr:97.05,r:'A',tp:'sovereign'},
  {id:'UAE-10Y',n:'UAE 10Y',co:'AE',cu:'USD',mat:'10Y',y:4.72,c:4.25,pr:96.15,r:'AA',tp:'sovereign'},
  {id:'QAT-10Y',n:'Qatar 10Y',co:'QA',cu:'USD',mat:'10Y',y:4.65,c:4.00,pr:95.82,r:'AA-',tp:'sovereign'},
  {id:'KWT-10Y',n:'Kuwait 10Y',co:'KW',cu:'USD',mat:'10Y',y:4.42,c:4.00,pr:96.55,r:'A+',tp:'sovereign'},
  {id:'OMN-10Y',n:'Oman 10Y',co:'OM',cu:'USD',mat:'10Y',y:5.52,c:5.00,pr:95.25,r:'BB+',tp:'sovereign'},
  {id:'BHR-10Y',n:'Bahrain 10Y',co:'BH',cu:'USD',mat:'10Y',y:5.85,c:5.50,pr:96.42,r:'B+',tp:'sovereign'},
  // Corporate Bonds
  {id:'AAPL-CORP',n:'Apple Inc 2.65% 2030',co:'US',cu:'USD',mat:'2030',y:4.12,c:2.65,pr:90.25,r:'AA+',tp:'corporate'},
  {id:'MSFT-CORP',n:'Microsoft 2.40% 2028',co:'US',cu:'USD',mat:'2028',y:3.95,c:2.40,pr:94.82,r:'AAA',tp:'corporate'},
  {id:'JPM-CORP',n:'JPMorgan 4.25% 2032',co:'US',cu:'USD',mat:'2032',y:4.85,c:4.25,pr:96.55,r:'A-',tp:'corporate'},
  {id:'ARAMCO-CORP',n:'Saudi Aramco 3.50% 2029',co:'SA',cu:'USD',mat:'2029',y:4.42,c:3.50,pr:95.82,r:'A',tp:'corporate'},
  {id:'QNB-CORP',n:'QNB 3.50% 2028',co:'QA',cu:'USD',mat:'2028',y:4.28,c:3.50,pr:97.15,r:'A',tp:'corporate'},
  {id:'FAB-CORP',n:'First Abu Dhabi Bank 2.50% 2027',co:'AE',cu:'USD',mat:'2027',y:4.15,c:2.50,pr:95.42,r:'AA-',tp:'corporate'},
  {id:'ADNOC-CORP',n:'ADNOC 3.00% 2029',co:'AE',cu:'USD',mat:'2029',y:4.25,c:3.00,pr:94.82,r:'AA',tp:'corporate'},
  {id:'SHEL-CORP',n:'Shell 3.25% 2030',co:'GB',cu:'USD',mat:'2030',y:4.35,c:3.25,pr:93.52,r:'AA-',tp:'corporate'},
  {id:'TM-CORP',n:'Toyota Motor 3.05% 2028',co:'JP',cu:'USD',mat:'2028',y:4.05,c:3.05,pr:96.82,r:'A+',tp:'corporate'},
  {id:'NESN-CORP',n:'Nestlé 2.00% 2027',co:'CH',cu:'EUR',mat:'2027',y:2.85,c:2.00,pr:97.52,r:'AA',tp:'corporate'},
  {id:'TSLA-CORP',n:'Tesla 5.30% 2028',co:'US',cu:'USD',mat:'2028',y:5.82,c:5.30,pr:98.15,r:'BBB-',tp:'corporate'},
  {id:'F-CORP',n:'Ford Motor 6.10% 2032',co:'US',cu:'USD',mat:'2032',y:6.55,c:6.10,pr:96.82,r:'BB+',tp:'corporate'},
  {id:'CCL-CORP',n:'Carnival Corp 5.75% 2027',co:'US',cu:'USD',mat:'2027',y:6.82,c:5.75,pr:96.25,r:'B+',tp:'corporate'},
  {id:'GS-CORP',n:'Goldman Sachs 3.50% 2030',co:'US',cu:'USD',mat:'2030',y:4.72,c:3.50,pr:93.82,r:'A+',tp:'corporate'},
  {id:'AMZN-CORP',n:'Amazon 3.15% 2032',co:'US',cu:'USD',mat:'2032',y:4.22,c:3.15,pr:92.55,r:'AA',tp:'corporate'},
  // Sukuk
  {id:'KSA-SUKUK-10',n:'Saudi Arabia Sovereign Sukuk 2034',co:'SA',cu:'USD',mat:'2034',y:4.92,c:4.50,pr:96.25,r:'A',tp:'sukuk',st:'Ijarah'},
  {id:'QAT-SUKUK-5',n:'Qatar Sovereign Sukuk 2029',co:'QA',cu:'USD',mat:'2029',y:4.55,c:4.00,pr:97.15,r:'AA-',tp:'sukuk',st:'Wakalah'},
  {id:'DIB-SUKUK',n:'Dubai Islamic Bank Sukuk 2028',co:'AE',cu:'USD',mat:'2028',y:4.82,c:4.25,pr:96.82,r:'A',tp:'sukuk',st:'Mudarabah'},
  {id:'ISDB-SUKUK',n:'Islamic Development Bank Sukuk 2027',co:'SA',cu:'USD',mat:'2027',y:3.85,c:3.25,pr:97.55,r:'AAA',tp:'sukuk',st:'Wakalah'},
  {id:'ARAMCO-SUKUK',n:'Saudi Aramco Sukuk 2033',co:'SA',cu:'USD',mat:'2033',y:4.75,c:4.25,pr:95.82,r:'A',tp:'sukuk',st:'Murabaha'},
  {id:'MYS-SUKUK',n:'Malaysia Sovereign Sukuk 2030',co:'MY',cu:'USD',mat:'2030',y:4.15,c:3.75,pr:97.25,r:'A-',tp:'sukuk',st:'Wakalah'},
  {id:'IDN-SUKUK',n:'Indonesia Sovereign Sukuk 2029',co:'ID',cu:'USD',mat:'2029',y:4.85,c:4.50,pr:97.52,r:'BBB',tp:'sukuk',st:'Ijarah'},
  {id:'TUR-SUKUK',n:'Turkey Sovereign Sukuk 2028',co:'TR',cu:'USD',mat:'2028',y:7.52,c:6.50,pr:95.25,r:'B',tp:'sukuk',st:'Ijarah'},
  {id:'ALDAR-SUKUK',n:'Aldar Properties Sukuk 2029',co:'AE',cu:'USD',mat:'2029',y:5.15,c:4.75,pr:97.05,r:'BBB+',tp:'sukuk',st:'Ijarah'},
  {id:'EMAAR-SUKUK',n:'Emaar Properties Sukuk 2030',co:'AE',cu:'USD',mat:'2030',y:5.42,c:5.00,pr:96.55,r:'BBB',tp:'sukuk',st:'Wakalah'},
];

function makeBond(d) {
  const dur = d.mat.includes('M') ? parseInt(d.mat) / 12 : d.mat.includes('Y') ? parseInt(d.mat) :
    (parseInt(d.mat) - 2025);
  return {
    id: d.id, name: d.n, country: d.co, currency: d.cu, maturity: d.mat,
    yield: d.y, coupon: d.c, price: d.pr, rating: d.r, type: d.tp,
    structure: d.st || null,
    duration: Math.max(0.1, Math.round(dur * 0.85 * 100) / 100),
    spread: d.tp === 'sovereign' ? 0 : Math.round((d.y - 4.35) * 100),
    yieldHistory: genYieldHistory(d.y, 30),
  };
}

export const BONDS = _bondDefs.map(makeBond);

export function getYieldCurveData(country) {
  const maturities = { '1M': 0.083, '3M': 0.25, '6M': 0.5, '1Y': 1, '2Y': 2, '5Y': 5, '10Y': 10, '20Y': 20, '30Y': 30 };
  return BONDS
    .filter(b => b.country === country && b.type === 'sovereign')
    .map(b => ({ maturity: b.maturity, years: maturities[b.maturity] || parseInt(b.maturity), yield: b.yield }))
    .sort((a, b) => a.years - b.years);
}


// ========= GLOBAL INDICES =========
export const INDICES = [
  // US
  {id:'SPX',n:'S&P 500',co:'US',val:5088.80,ch:0.52,ytd:7.8,priceHistory:generatePriceHistory(5088.80,30,0.008)},
  {id:'DJI',n:'Dow Jones Industrial',co:'US',val:38671.69,ch:0.35,ytd:4.2,priceHistory:generatePriceHistory(38671.69,30,0.006)},
  {id:'IXIC',n:'NASDAQ Composite',co:'US',val:15996.82,ch:0.78,ytd:9.5,priceHistory:generatePriceHistory(15996.82,30,0.012)},
  {id:'RUT',n:'Russell 2000',co:'US',val:2048.32,ch:-0.28,ytd:1.2,priceHistory:generatePriceHistory(2048.32,30,0.015)},
  {id:'VIX',n:'CBOE Volatility Index',co:'US',val:14.82,ch:-2.15,ytd:-18.5,priceHistory:generatePriceHistory(14.82,30,0.08)},
  // Europe
  {id:'UKX',n:'FTSE 100',co:'GB',val:7682.50,ch:0.18,ytd:3.2,priceHistory:generatePriceHistory(7682.50,30,0.007)},
  {id:'DAX',n:'DAX 40',co:'DE',val:17419.58,ch:0.42,ytd:5.8,priceHistory:generatePriceHistory(17419.58,30,0.008)},
  {id:'CAC',n:'CAC 40',co:'FR',val:7932.15,ch:0.28,ytd:4.5,priceHistory:generatePriceHistory(7932.15,30,0.008)},
  {id:'SX5E',n:'Euro Stoxx 50',co:'EU',val:4922.82,ch:0.35,ytd:6.2,priceHistory:generatePriceHistory(4922.82,30,0.008)},
  {id:'SMI',n:'Swiss Market Index',co:'CH',val:11482.50,ch:0.22,ytd:3.8,priceHistory:generatePriceHistory(11482.50,30,0.006)},
  {id:'IBEX',n:'IBEX 35',co:'ES',val:10285.42,ch:0.48,ytd:5.2,priceHistory:generatePriceHistory(10285.42,30,0.009)},
  {id:'FTSEMIB',n:'FTSE MIB',co:'IT',val:31842.55,ch:0.55,ytd:8.5,priceHistory:generatePriceHistory(31842.55,30,0.009)},
  // Asia-Pacific
  {id:'NKY',n:'Nikkei 225',co:'JP',val:38487.24,ch:0.85,ytd:15.2,priceHistory:generatePriceHistory(38487.24,30,0.01)},
  {id:'HSI',n:'Hang Seng',co:'HK',val:16589.55,ch:-0.42,ytd:-5.2,priceHistory:generatePriceHistory(16589.55,30,0.015)},
  {id:'SHCOMP',n:'Shanghai Composite',co:'CN',val:2972.18,ch:0.15,ytd:-2.5,priceHistory:generatePriceHistory(2972.18,30,0.01)},
  {id:'SZCOMP',n:'Shenzhen Composite',co:'CN',val:1725.42,ch:0.28,ytd:-4.8,priceHistory:generatePriceHistory(1725.42,30,0.012)},
  {id:'KOSPI',n:'KOSPI',co:'KR',val:2655.28,ch:0.35,ytd:2.8,priceHistory:generatePriceHistory(2655.28,30,0.01)},
  {id:'TAIEX',n:'Taiwan Weighted',co:'TW',val:18425.82,ch:0.72,ytd:8.2,priceHistory:generatePriceHistory(18425.82,30,0.01)},
  {id:'STI',n:'Straits Times',co:'SG',val:3182.55,ch:0.18,ytd:1.5,priceHistory:generatePriceHistory(3182.55,30,0.006)},
  {id:'AS51',n:'ASX 200',co:'AU',val:7685.42,ch:0.25,ytd:3.5,priceHistory:generatePriceHistory(7685.42,30,0.007)},
  {id:'SENSEX',n:'BSE Sensex',co:'IN',val:72085.55,ch:0.42,ytd:5.8,priceHistory:generatePriceHistory(72085.55,30,0.01)},
  {id:'NIFTY',n:'Nifty 50',co:'IN',val:21842.82,ch:0.38,ytd:5.5,priceHistory:generatePriceHistory(21842.82,30,0.01)},
  {id:'SETI',n:'SET Index',co:'TH',val:1385.42,ch:-0.52,ytd:-8.2,priceHistory:generatePriceHistory(1385.42,30,0.012)},
  {id:'JCI',n:'Jakarta Composite',co:'ID',val:7285.55,ch:0.22,ytd:2.2,priceHistory:generatePriceHistory(7285.55,30,0.008)},
  // GCC
  {id:'TASI',n:'Tadawul All Share',co:'SA',val:12185.42,ch:0.35,ytd:4.2,priceHistory:generatePriceHistory(12185.42,30,0.008)},
  {id:'DFMGI',n:'DFM General Index',co:'AE',val:4185.55,ch:0.48,ytd:6.5,priceHistory:generatePriceHistory(4185.55,30,0.009)},
  {id:'ADI',n:'ADX General Index',co:'AE',val:9285.42,ch:0.32,ytd:3.8,priceHistory:generatePriceHistory(9285.42,30,0.007)},
  {id:'QSI',n:'QE General Index',co:'QA',val:10485.82,ch:0.22,ytd:2.5,priceHistory:generatePriceHistory(10485.82,30,0.008)},
  {id:'BKP',n:'Boursa Kuwait Premier',co:'KW',val:7585.42,ch:0.15,ytd:1.8,priceHistory:generatePriceHistory(7585.42,30,0.006)},
  {id:'MSM30',n:'MSM 30',co:'OM',val:4685.55,ch:0.12,ytd:1.2,priceHistory:generatePriceHistory(4685.55,30,0.005)},
  {id:'BHBI',n:'Bahrain All Share',co:'BH',val:1985.42,ch:0.08,ytd:0.8,priceHistory:generatePriceHistory(1985.42,30,0.005)},
  // Latin America
  {id:'IBOV',n:'Ibovespa',co:'BR',val:128542.82,ch:0.72,ytd:-3.5,priceHistory:generatePriceHistory(128542.82,30,0.012)},
  {id:'MEXBOL',n:'IPC Mexico',co:'MX',val:55285.42,ch:0.32,ytd:-2.8,priceHistory:generatePriceHistory(55285.42,30,0.01)},
  {id:'MERVAL',n:'MERVAL',co:'AR',val:985542.82,ch:1.85,ytd:42.5,priceHistory:generatePriceHistory(985542.82,30,0.025)},
  // Africa
  {id:'JALSH',n:'JSE All Share',co:'ZA',val:74285.55,ch:0.42,ytd:2.8,priceHistory:generatePriceHistory(74285.55,30,0.01)},
  {id:'NGXASI',n:'NGX All Share',co:'NG',val:98485.42,ch:0.55,ytd:35.2,priceHistory:generatePriceHistory(98485.42,30,0.015)},
];

// ========= COMMODITIES =========
export const COMMODITIES = [
  // Energy
  {id:'CL',n:'WTI Crude Oil',pr:78.42,ch:1.25,unit:'bbl',x:'NYMEX',cat:'energy',priceHistory:generatePriceHistory(78.42,30,0.02)},
  {id:'BZ',n:'Brent Crude Oil',pr:82.85,ch:1.18,unit:'bbl',x:'ICE',cat:'energy',priceHistory:generatePriceHistory(82.85,30,0.02)},
  {id:'NG',n:'Natural Gas',pr:2.15,ch:-2.42,unit:'MMBtu',x:'NYMEX',cat:'energy',priceHistory:generatePriceHistory(2.15,30,0.04)},
  {id:'HO',n:'Heating Oil',pr:2.72,ch:0.85,unit:'gal',x:'NYMEX',cat:'energy',priceHistory:generatePriceHistory(2.72,30,0.02)},
  {id:'RB',n:'RBOB Gasoline',pr:2.28,ch:0.52,unit:'gal',x:'NYMEX',cat:'energy',priceHistory:generatePriceHistory(2.28,30,0.025)},
  {id:'UX',n:'Uranium',pr:85.50,ch:2.15,unit:'lb',x:'COMEX',cat:'energy',priceHistory:generatePriceHistory(85.50,30,0.03)},
  // Precious Metals
  {id:'GC',n:'Gold',pr:2042.50,ch:0.42,unit:'oz',x:'COMEX',cat:'metals',priceHistory:generatePriceHistory(2042.50,30,0.008)},
  {id:'SI',n:'Silver',pr:22.85,ch:0.82,unit:'oz',x:'COMEX',cat:'metals',priceHistory:generatePriceHistory(22.85,30,0.02)},
  {id:'PL',n:'Platinum',pr:928.50,ch:-0.55,unit:'oz',x:'NYMEX',cat:'metals',priceHistory:generatePriceHistory(928.50,30,0.015)},
  {id:'PA',n:'Palladium',pr:965.80,ch:-1.22,unit:'oz',x:'NYMEX',cat:'metals',priceHistory:generatePriceHistory(965.80,30,0.025)},
  // Industrial Metals
  {id:'HG',n:'Copper',pr:3.85,ch:0.72,unit:'lb',x:'COMEX',cat:'metals',priceHistory:generatePriceHistory(3.85,30,0.015)},
  {id:'AL',n:'Aluminum',pr:2285.50,ch:0.35,unit:'mt',x:'LME',cat:'metals',priceHistory:generatePriceHistory(2285.50,30,0.012)},
  {id:'NI',n:'Nickel',pr:16850,ch:-0.82,unit:'mt',x:'LME',cat:'metals',priceHistory:generatePriceHistory(16850,30,0.02)},
  {id:'ZN',n:'Zinc',pr:2485.80,ch:0.55,unit:'mt',x:'LME',cat:'metals',priceHistory:generatePriceHistory(2485.80,30,0.015)},
  {id:'LI',n:'Lithium Carbonate',pr:13500,ch:-1.85,unit:'mt',x:'SGX',cat:'metals',priceHistory:generatePriceHistory(13500,30,0.04)},
  // Agriculture
  {id:'ZC',n:'Corn',pr:452.25,ch:-0.42,unit:'bu',x:'CBOT',cat:'agriculture',priceHistory:generatePriceHistory(452.25,30,0.015)},
  {id:'ZW',n:'Wheat',pr:582.50,ch:0.85,unit:'bu',x:'CBOT',cat:'agriculture',priceHistory:generatePriceHistory(582.50,30,0.02)},
  {id:'ZS',n:'Soybeans',pr:1185.25,ch:0.22,unit:'bu',x:'CBOT',cat:'agriculture',priceHistory:generatePriceHistory(1185.25,30,0.015)},
  {id:'KC',n:'Coffee',pr:192.85,ch:1.52,unit:'lb',x:'ICE',cat:'agriculture',priceHistory:generatePriceHistory(192.85,30,0.025)},
  {id:'SB',n:'Sugar',pr:24.52,ch:-0.85,unit:'lb',x:'ICE',cat:'agriculture',priceHistory:generatePriceHistory(24.52,30,0.02)},
  {id:'CC',n:'Cocoa',pr:4285.50,ch:2.82,unit:'mt',x:'ICE',cat:'agriculture',priceHistory:generatePriceHistory(4285.50,30,0.03)},
  {id:'CT',n:'Cotton',pr:82.45,ch:-0.52,unit:'lb',x:'ICE',cat:'agriculture',priceHistory:generatePriceHistory(82.45,30,0.02)},
  {id:'OJ',n:'Orange Juice',pr:385.82,ch:1.15,unit:'lb',x:'ICE',cat:'agriculture',priceHistory:generatePriceHistory(385.82,30,0.03)},
  {id:'LC',n:'Live Cattle',pr:178.52,ch:0.22,unit:'lb',x:'CME',cat:'agriculture',priceHistory:generatePriceHistory(178.52,30,0.01)},
  {id:'LH',n:'Lean Hogs',pr:72.85,ch:-1.15,unit:'lb',x:'CME',cat:'agriculture',priceHistory:generatePriceHistory(72.85,30,0.02)},
];

// ========= CRYPTO =========
export const CRYPTO = [
  {id:'BTC',n:'Bitcoin',pr:52485.82,ch24h:2.15,mc:1028e9,vol24h:28.5e9,supply:19.6e6,maxSupply:21e6,priceHistory:generatePriceHistory(52485.82,30,0.04)},
  {id:'ETH',n:'Ethereum',pr:2885.42,ch24h:1.85,mc:347e9,vol24h:15.2e9,supply:120.2e6,maxSupply:null,priceHistory:generatePriceHistory(2885.42,30,0.035)},
  {id:'BNB',n:'BNB',pr:312.85,ch24h:0.72,mc:48.2e9,vol24h:1.2e9,supply:154e6,maxSupply:200e6,priceHistory:generatePriceHistory(312.85,30,0.03)},
  {id:'SOL',n:'Solana',pr:105.42,ch24h:3.52,mc:45.8e9,vol24h:2.8e9,supply:435e6,maxSupply:null,priceHistory:generatePriceHistory(105.42,30,0.06)},
  {id:'XRP',n:'XRP',pr:0.5542,ch24h:-0.82,mc:30.2e9,vol24h:1.5e9,supply:54.5e9,maxSupply:100e9,priceHistory:generatePriceHistory(0.5542,30,0.04)},
  {id:'ADA',n:'Cardano',pr:0.5985,ch24h:1.22,mc:21.2e9,vol24h:0.8e9,supply:35.4e9,maxSupply:45e9,priceHistory:generatePriceHistory(0.5985,30,0.045)},
  {id:'DOGE',n:'Dogecoin',pr:0.0842,ch24h:-1.55,mc:12.1e9,vol24h:0.6e9,supply:143.5e9,maxSupply:null,priceHistory:generatePriceHistory(0.0842,30,0.06)},
  {id:'AVAX',n:'Avalanche',pr:38.25,ch24h:2.85,mc:14.2e9,vol24h:0.8e9,supply:372e6,maxSupply:720e6,priceHistory:generatePriceHistory(38.25,30,0.05)},
  {id:'DOT',n:'Polkadot',pr:7.82,ch24h:0.42,mc:10.5e9,vol24h:0.4e9,supply:1.35e9,maxSupply:null,priceHistory:generatePriceHistory(7.82,30,0.04)},
  {id:'LINK',n:'Chainlink',pr:18.55,ch24h:1.82,mc:10.8e9,vol24h:0.6e9,supply:587e6,maxSupply:1e9,priceHistory:generatePriceHistory(18.55,30,0.045)},
  {id:'MATIC',n:'Polygon',pr:0.8542,ch24h:0.55,mc:8.5e9,vol24h:0.4e9,supply:9.9e9,maxSupply:10e9,priceHistory:generatePriceHistory(0.8542,30,0.04)},
  {id:'UNI',n:'Uniswap',pr:7.28,ch24h:1.15,mc:5.5e9,vol24h:0.2e9,supply:752e6,maxSupply:1e9,priceHistory:generatePriceHistory(7.28,30,0.05)},
  {id:'ATOM',n:'Cosmos',pr:9.85,ch24h:0.82,mc:3.8e9,vol24h:0.2e9,supply:386e6,maxSupply:null,priceHistory:generatePriceHistory(9.85,30,0.04)},
  {id:'LTC',n:'Litecoin',pr:72.42,ch24h:-0.42,mc:5.4e9,vol24h:0.4e9,supply:74.2e6,maxSupply:84e6,priceHistory:generatePriceHistory(72.42,30,0.035)},
  {id:'NEAR',n:'NEAR Protocol',pr:3.85,ch24h:2.22,mc:4.2e9,vol24h:0.3e9,supply:1.1e9,maxSupply:null,priceHistory:generatePriceHistory(3.85,30,0.05)},
  {id:'USDT',n:'Tether',pr:1.0002,ch24h:0.01,mc:95.2e9,vol24h:42.5e9,supply:95.2e9,maxSupply:null,priceHistory:generatePriceHistory(1.0002,30,0.001)},
  {id:'USDC',n:'USD Coin',pr:0.9998,ch24h:-0.01,mc:28.5e9,vol24h:5.2e9,supply:28.5e9,maxSupply:null,priceHistory:generatePriceHistory(0.9998,30,0.001)},
  {id:'ARB',n:'Arbitrum',pr:1.25,ch24h:1.82,mc:3.2e9,vol24h:0.3e9,supply:2.55e9,maxSupply:10e9,priceHistory:generatePriceHistory(1.25,30,0.05)},
  {id:'OP',n:'Optimism',pr:3.42,ch24h:2.55,mc:3.8e9,vol24h:0.2e9,supply:1.1e9,maxSupply:4.3e9,priceHistory:generatePriceHistory(3.42,30,0.05)},
  {id:'APT',n:'Aptos',pr:8.85,ch24h:1.42,mc:3.5e9,vol24h:0.2e9,supply:395e6,maxSupply:null,priceHistory:generatePriceHistory(8.85,30,0.05)},
];

// ========= ETF DATABASE =========
export const ETFS = [
  // US Equity
  {t:'SPY',n:'SPDR S&P 500 ETF',cat:'US Equity',pr:508.82,exp:0.09,aum:488e9,ytd:7.8,hold:503,priceHistory:generatePriceHistory(508.82,30,0.008)},
  {t:'QQQ',n:'Invesco QQQ Trust',cat:'US Equity',pr:438.55,exp:0.20,aum:225e9,ytd:9.5,hold:101,priceHistory:generatePriceHistory(438.55,30,0.012)},
  {t:'IVV',n:'iShares Core S&P 500',cat:'US Equity',pr:510.42,exp:0.03,aum:420e9,ytd:7.8,hold:503,priceHistory:generatePriceHistory(510.42,30,0.008)},
  {t:'VTI',n:'Vanguard Total Stock Market',cat:'US Equity',pr:252.85,exp:0.03,aum:380e9,ytd:7.2,hold:3800,priceHistory:generatePriceHistory(252.85,30,0.008)},
  {t:'VOO',n:'Vanguard S&P 500',cat:'US Equity',pr:468.55,exp:0.03,aum:405e9,ytd:7.8,hold:503,priceHistory:generatePriceHistory(468.55,30,0.008)},
  {t:'IWM',n:'iShares Russell 2000',cat:'US Equity',pr:204.82,exp:0.19,aum:62e9,ytd:1.2,hold:2000,priceHistory:generatePriceHistory(204.82,30,0.015)},
  {t:'ARKK',n:'ARK Innovation ETF',cat:'US Equity',pr:48.55,exp:0.75,aum:8.2e9,ytd:-5.2,hold:35,priceHistory:generatePriceHistory(48.55,30,0.035)},
  // International
  {t:'EFA',n:'iShares MSCI EAFE',cat:'International',pr:78.82,exp:0.32,aum:58e9,ytd:4.5,hold:800,priceHistory:generatePriceHistory(78.82,30,0.008)},
  {t:'EEM',n:'iShares MSCI Emerging Mkts',cat:'International',pr:42.15,exp:0.68,aum:22e9,ytd:1.2,hold:1200,priceHistory:generatePriceHistory(42.15,30,0.012)},
  {t:'VWO',n:'Vanguard FTSE Emerging Mkts',cat:'International',pr:42.82,exp:0.08,aum:82e9,ytd:1.5,hold:5500,priceHistory:generatePriceHistory(42.82,30,0.012)},
  {t:'VEA',n:'Vanguard FTSE Developed Mkts',cat:'International',pr:48.55,exp:0.05,aum:118e9,ytd:4.2,hold:4000,priceHistory:generatePriceHistory(48.55,30,0.008)},
  {t:'INDA',n:'iShares MSCI India',cat:'International',pr:52.42,exp:0.64,aum:8.5e9,ytd:5.8,hold:120,priceHistory:generatePriceHistory(52.42,30,0.015)},
  {t:'MCHI',n:'iShares MSCI China',cat:'International',pr:42.85,exp:0.59,aum:5.8e9,ytd:-4.2,hold:600,priceHistory:generatePriceHistory(42.85,30,0.02)},
  {t:'KSA',n:'iShares MSCI Saudi Arabia',cat:'International',pr:42.55,exp:0.74,aum:1.2e9,ytd:4.2,hold:80,priceHistory:generatePriceHistory(42.55,30,0.012)},
  {t:'UAE',n:'iShares MSCI UAE',cat:'International',pr:15.82,exp:0.59,aum:0.5e9,ytd:6.5,hold:40,priceHistory:generatePriceHistory(15.82,30,0.012)},
  {t:'QAT',n:'iShares MSCI Qatar',cat:'International',pr:18.42,exp:0.59,aum:0.08e9,ytd:2.5,hold:25,priceHistory:generatePriceHistory(18.42,30,0.012)},
  // Bonds
  {t:'AGG',n:'iShares Core US Aggregate Bond',cat:'Bonds',pr:98.82,exp:0.03,aum:92e9,ytd:-0.8,hold:11000,priceHistory:generatePriceHistory(98.82,30,0.004)},
  {t:'BND',n:'Vanguard Total Bond Market',cat:'Bonds',pr:72.55,exp:0.03,aum:105e9,ytd:-0.5,hold:10000,priceHistory:generatePriceHistory(72.55,30,0.004)},
  {t:'TLT',n:'iShares 20+ Year Treasury',cat:'Bonds',pr:95.42,exp:0.15,aum:42e9,ytd:-4.2,hold:40,priceHistory:generatePriceHistory(95.42,30,0.012)},
  {t:'SHY',n:'iShares 1-3 Year Treasury',cat:'Bonds',pr:81.82,exp:0.15,aum:22e9,ytd:0.8,hold:80,priceHistory:generatePriceHistory(81.82,30,0.002)},
  {t:'LQD',n:'iShares Investment Grade Corp',cat:'Bonds',pr:108.55,exp:0.14,aum:35e9,ytd:-0.2,hold:2500,priceHistory:generatePriceHistory(108.55,30,0.005)},
  {t:'HYG',n:'iShares High Yield Corp',cat:'Bonds',pr:78.42,exp:0.49,aum:15e9,ytd:1.5,hold:1200,priceHistory:generatePriceHistory(78.42,30,0.006)},
  {t:'EMB',n:'iShares J.P. Morgan EM Bond',cat:'Bonds',pr:88.85,exp:0.39,aum:14e9,ytd:0.5,hold:600,priceHistory:generatePriceHistory(88.85,30,0.008)},
  {t:'BNDX',n:'Vanguard Total Intl Bond',cat:'Bonds',pr:48.25,exp:0.07,aum:48e9,ytd:-0.2,hold:7000,priceHistory:generatePriceHistory(48.25,30,0.003)},
  // Commodities
  {t:'GLD',n:'SPDR Gold Shares',cat:'Commodities',pr:189.55,exp:0.40,aum:58e9,ytd:2.5,hold:1,priceHistory:generatePriceHistory(189.55,30,0.008)},
  {t:'SLV',n:'iShares Silver Trust',cat:'Commodities',pr:21.42,exp:0.50,aum:10e9,ytd:-2.8,hold:1,priceHistory:generatePriceHistory(21.42,30,0.02)},
  {t:'USO',n:'United States Oil Fund',cat:'Commodities',pr:72.85,exp:0.60,aum:2.5e9,ytd:5.2,hold:1,priceHistory:generatePriceHistory(72.85,30,0.02)},
  {t:'DBA',n:'Invesco DB Agriculture',cat:'Commodities',pr:22.15,exp:0.85,aum:0.8e9,ytd:-3.2,hold:10,priceHistory:generatePriceHistory(22.15,30,0.012)},
  {t:'DBC',n:'Invesco DB Commodity Index',cat:'Commodities',pr:23.85,exp:0.85,aum:2.2e9,ytd:2.8,hold:14,priceHistory:generatePriceHistory(23.85,30,0.01)},
  // Sectors
  {t:'XLF',n:'Financial Select Sector SPDR',cat:'Sector',pr:40.82,exp:0.10,aum:38e9,ytd:8.2,hold:72,priceHistory:generatePriceHistory(40.82,30,0.01)},
  {t:'XLK',n:'Technology Select Sector SPDR',cat:'Sector',pr:202.55,exp:0.10,aum:58e9,ytd:10.5,hold:65,priceHistory:generatePriceHistory(202.55,30,0.012)},
  {t:'XLE',n:'Energy Select Sector SPDR',cat:'Sector',pr:88.42,exp:0.10,aum:35e9,ytd:2.8,hold:22,priceHistory:generatePriceHistory(88.42,30,0.015)},
  {t:'XLV',n:'Health Care Select Sector SPDR',cat:'Sector',pr:142.85,exp:0.10,aum:38e9,ytd:5.5,hold:63,priceHistory:generatePriceHistory(142.85,30,0.008)},
  {t:'XLRE',n:'Real Estate Select Sector SPDR',cat:'Sector',pr:38.55,exp:0.10,aum:5.5e9,ytd:-2.5,hold:30,priceHistory:generatePriceHistory(38.55,30,0.012)},
  // Islamic/Shariah
  {t:'SPSK',n:'SP Funds Dow Jones Global Sukuk',cat:'Islamic',pr:22.85,exp:0.55,aum:0.5e9,ytd:0.8,hold:200,priceHistory:generatePriceHistory(22.85,30,0.004)},
  {t:'HLAL',n:'Wahed FTSE USA Shariah ETF',cat:'Islamic',pr:42.55,exp:0.50,aum:0.3e9,ytd:6.8,hold:200,priceHistory:generatePriceHistory(42.55,30,0.01)},
  // Crypto
  {t:'IBIT',n:'iShares Bitcoin Trust',cat:'Crypto',pr:38.82,exp:0.25,aum:22e9,ytd:25.5,hold:1,priceHistory:generatePriceHistory(38.82,30,0.04)},
  {t:'ETHA',n:'iShares Ethereum Trust',cat:'Crypto',pr:28.55,exp:0.25,aum:5.2e9,ytd:18.2,hold:1,priceHistory:generatePriceHistory(28.55,30,0.045)},
];
