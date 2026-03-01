import { useState } from 'react';

const METRIC_TIPS = {
  'P/E': 'Price-to-Earnings ratio. Stock price divided by earnings per share. Lower may indicate undervaluation.',
  'P/B': 'Price-to-Book ratio. Market cap divided by book value. Below 1 may signal undervaluation.',
  'ROE': 'Return on Equity. Net income divided by shareholders equity. Higher indicates more efficient profit generation.',
  'EPS': 'Earnings Per Share. Net income divided by outstanding shares.',
  'D/E': 'Debt-to-Equity ratio. Total debt divided by shareholders equity. Lower means less leverage.',
  'D/A': 'Debt-to-Assets ratio. Measures portion of assets financed by debt.',
  'Beta': 'Volatility relative to the market. >1 means more volatile, <1 means less volatile.',
  'RSI': 'Relative Strength Index. Above 70 = overbought, below 30 = oversold.',
  'VaR': 'Value at Risk. Maximum expected loss at a given confidence level.',
  'Sharpe': 'Sharpe Ratio. Risk-adjusted return. Higher is better; above 1 is generally good.',
  'MCap': 'Market Capitalization. Share price multiplied by total outstanding shares.',
  'Div Yield': 'Dividend Yield. Annual dividend per share divided by stock price.',
  'YTD': 'Year-to-Date return. Performance since January 1st of the current year.',
  'SMA': 'Simple Moving Average. Average closing price over a specified period.',
  'MACD': 'Moving Average Convergence Divergence. Trend-following momentum indicator.',
  'IV': 'Implied Volatility. Market expectation of future price movement derived from options prices.',
  'Delta': 'Options Delta. Rate of change in option price per $1 change in underlying.',
  'Gamma': 'Options Gamma. Rate of change in delta per $1 change in underlying.',
  'Theta': 'Options Theta. Time decay — how much option value decreases per day.',
  'Vega': 'Options Vega. Sensitivity to volatility — change in option price per 1% change in IV.',
};

export default function MetricTooltip({ label, children }) {
  const [show, setShow] = useState(false);
  const tip = METRIC_TIPS[label];
  if (!tip) return children || <span>{label}</span>;

  return (
    <span
      className="relative cursor-help border-b border-dotted border-bb-muted"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children || label}
      {show && (
        <span className="absolute z-50 left-0 bottom-full mb-1 w-48 p-1.5 bg-bb-dark border border-bb-border text-[9px] text-bb-white leading-tight shadow-lg">
          <span className="text-bb-amber font-bold">{label}</span>
          <br />
          {tip}
        </span>
      )}
    </span>
  );
}
