import { useState, useEffect, lazy, Suspense } from 'react';
import { tabs } from './data/tabs';
import Header from './components/layout/Header';
import TickerBar from './components/layout/TickerBar';
import TabBar from './components/layout/TabBar';
import CommandBar from './components/layout/CommandBar';
import LoadingFallback from './components/layout/LoadingFallback';

const Dashboard = lazy(() => import('./components/tabs/Dashboard'));
const Equities = lazy(() => import('./components/tabs/Equities'));
const FixedIncome = lazy(() => import('./components/tabs/FixedIncome'));
const Commodities = lazy(() => import('./components/tabs/Commodities'));
const Forex = lazy(() => import('./components/tabs/Forex'));
const Crypto = lazy(() => import('./components/tabs/Crypto'));
const Indices = lazy(() => import('./components/tabs/Indices'));
const Options = lazy(() => import('./components/tabs/Options'));
const Futures = lazy(() => import('./components/tabs/Futures'));
const ETFs = lazy(() => import('./components/tabs/ETFs'));
const News = lazy(() => import('./components/tabs/News'));
const Economic = lazy(() => import('./components/tabs/Economic'));
const Earnings = lazy(() => import('./components/tabs/Earnings'));
const Portfolio = lazy(() => import('./components/tabs/Portfolio'));
const Watchlist = lazy(() => import('./components/tabs/Watchlist'));
const Screener = lazy(() => import('./components/tabs/Screener'));
const Technicals = lazy(() => import('./components/tabs/Technicals'));
const Fundamentals = lazy(() => import('./components/tabs/Fundamentals'));
const Sectors = lazy(() => import('./components/tabs/Sectors'));
const HeatMap = lazy(() => import('./components/tabs/HeatMap'));
const Alerts = lazy(() => import('./components/tabs/Alerts'));
const IPOs = lazy(() => import('./components/tabs/IPOs'));
const Search = lazy(() => import('./components/tabs/Search'));
const PortfolioGenerator = lazy(() => import('./components/tabs/PortfolioGenerator'));
const StressTest = lazy(() => import('./components/tabs/StressTest'));
const PeerComparison = lazy(() => import('./components/tabs/PeerComparison'));
const SupplyChain = lazy(() => import('./components/tabs/SupplyChain'));
const EconCalendar = lazy(() => import('./components/tabs/EconCalendar'));
const FXMonitor = lazy(() => import('./components/tabs/FXMonitor'));
const YieldCurve = lazy(() => import('./components/tabs/YieldCurve'));
const ESGScreening = lazy(() => import('./components/tabs/ESGScreening'));
const MATracker = lazy(() => import('./components/tabs/MATracker'));
const Backtest = lazy(() => import('./components/tabs/Backtest'));
const Billionaires = lazy(() => import('./components/tabs/Billionaires'));
const AIInsights = lazy(() => import('./components/tabs/AIInsights'));
const CustomFields = lazy(() => import('./components/tabs/CustomFields'));
const Reference = lazy(() => import('./components/tabs/Reference'));
const Settings = lazy(() => import('./components/tabs/Settings'));

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const tab = tabs.find(t => t.id === activeTab);
    document.title = tab ? `${tab.label} — SPECTER Terminal` : 'SPECTER Terminal';
  }, [activeTab]);

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'equities': return <Equities />;
      case 'fixed-income': return <FixedIncome />;
      case 'commodities': return <Commodities />;
      case 'forex': return <Forex />;
      case 'crypto': return <Crypto />;
      case 'indices': return <Indices />;
      case 'options': return <Options />;
      case 'futures': return <Futures />;
      case 'etfs': return <ETFs />;
      case 'news': return <News />;
      case 'economic': return <Economic />;
      case 'earnings': return <Earnings />;
      case 'portfolio': return <Portfolio />;
      case 'watchlist': return <Watchlist />;
      case 'screener': return <Screener />;
      case 'technicals': return <Technicals />;
      case 'fundamentals': return <Fundamentals />;
      case 'sectors': return <Sectors />;
      case 'heatmap': return <HeatMap />;
      case 'alerts': return <Alerts />;
      case 'ipos': return <IPOs />;
      case 'search': return <Search />;
      case 'portgen': return <PortfolioGenerator />;
      case 'stresstest': return <StressTest />;
      case 'peers': return <PeerComparison />;
      case 'supplychain': return <SupplyChain />;
      case 'econcal': return <EconCalendar />;
      case 'fxmonitor': return <FXMonitor />;
      case 'yieldcurve': return <YieldCurve />;
      case 'esg': return <ESGScreening />;
      case 'ma': return <MATracker />;
      case 'backtest': return <Backtest />;
      case 'billionaires': return <Billionaires />;
      case 'aiinsights': return <AIInsights />;
      case 'customfields': return <CustomFields />;
      case 'reference': return <Reference />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-bb-black font-mono">
      <Header />
      <TickerBar />
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-hidden">
        <Suspense fallback={<LoadingFallback />}>
          {renderTab()}
        </Suspense>
      </main>
      <CommandBar onTabChange={setActiveTab} />
    </div>
  );
}
