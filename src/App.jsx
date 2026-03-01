import { useState } from 'react';
import Header from './components/layout/Header';
import TickerBar from './components/layout/TickerBar';
import TabBar from './components/layout/TabBar';
import CommandBar from './components/layout/CommandBar';
import Dashboard from './components/tabs/Dashboard';
import Equities from './components/tabs/Equities';
import FixedIncome from './components/tabs/FixedIncome';
import Commodities from './components/tabs/Commodities';
import Forex from './components/tabs/Forex';
import Crypto from './components/tabs/Crypto';
import Indices from './components/tabs/Indices';
import Options from './components/tabs/Options';
import Futures from './components/tabs/Futures';
import ETFs from './components/tabs/ETFs';
import News from './components/tabs/News';
import Economic from './components/tabs/Economic';
import Earnings from './components/tabs/Earnings';
import Portfolio from './components/tabs/Portfolio';
import Watchlist from './components/tabs/Watchlist';
import Screener from './components/tabs/Screener';
import Technicals from './components/tabs/Technicals';
import Fundamentals from './components/tabs/Fundamentals';
import Sectors from './components/tabs/Sectors';
import HeatMap from './components/tabs/HeatMap';
import Alerts from './components/tabs/Alerts';
import IPOs from './components/tabs/IPOs';
import Search from './components/tabs/Search';
import PortfolioGenerator from './components/tabs/PortfolioGenerator';
import StressTest from './components/tabs/StressTest';
import PeerComparison from './components/tabs/PeerComparison';
import SupplyChain from './components/tabs/SupplyChain';
import EconCalendar from './components/tabs/EconCalendar';
import FXMonitor from './components/tabs/FXMonitor';
import YieldCurve from './components/tabs/YieldCurve';
import ESGScreening from './components/tabs/ESGScreening';
import MATracker from './components/tabs/MATracker';
import Backtest from './components/tabs/Backtest';
import Billionaires from './components/tabs/Billionaires';
import AIInsights from './components/tabs/AIInsights';
import CustomFields from './components/tabs/CustomFields';
import Reference from './components/tabs/Reference';
import Settings from './components/tabs/Settings';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

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
        {renderTab()}
      </main>
      <CommandBar onTabChange={setActiveTab} />
    </div>
  );
}
