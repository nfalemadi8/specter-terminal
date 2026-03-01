export const stressScenarios = [
  {
    id: 1,
    name: '2008 Financial Crisis',
    description: 'Global banking collapse and credit freeze triggered by subprime mortgage defaults',
    impacts: { sp500: -38.5, bonds: 5, gold: 25, oil: -54, realEstate: -30 },
  },
  {
    id: 2,
    name: 'COVID-19 Pandemic',
    description: 'Global pandemic shutdown March 2020 with unprecedented economic contraction',
    impacts: { sp500: -33.9, bonds: 8, gold: 16, oil: -65, realEstate: -15 },
  },
  {
    id: 3,
    name: 'Dot-Com Bust',
    description: 'Technology bubble burst 2000-2002 with massive tech stock devaluations',
    impacts: { sp500: -49.1, bonds: 12, gold: -5, oil: -20, realEstate: -5 },
  },
  {
    id: 4,
    name: '2022 Rate Shock',
    description: 'Aggressive Federal Reserve tightening cycle with 425bp of rate hikes in a single year',
    impacts: { sp500: -19.4, bonds: -18, gold: -3, oil: 45, realEstate: -20 },
  },
  {
    id: 5,
    name: 'Black Monday 1987',
    description: 'Single-day market crash of 22.6% driven by program trading and portfolio insurance',
    impacts: { sp500: -22.6, bonds: 4, gold: 3, oil: -10, realEstate: -5 },
  },
  {
    id: 6,
    name: 'GCC Oil Crash 2014',
    description: 'Oil price collapse from $115 to $28 per barrel devastating Gulf economies and fiscal budgets',
    impacts: { sp500: -5, bonds: 2, gold: -2, oil: -48, realEstate: -25 },
  },
  {
    id: 7,
    name: 'Stagflation 1973',
    description: 'OPEC oil embargo combined with high inflation and economic stagnation across Western economies',
    impacts: { sp500: -48, bonds: -8, gold: 73, oil: 130, realEstate: -15 },
  },
  {
    id: 8,
    name: 'Custom: Rates +300bp',
    description: 'Hypothetical scenario of a sudden 300 basis point rate increase across the yield curve',
    impacts: { sp500: -15, bonds: -22, gold: -5, oil: -10, realEstate: -18 },
  },
  {
    id: 9,
    name: 'Custom: Oil Shock +50%',
    description: 'Hypothetical supply disruption causing crude oil prices to spike 50% within a quarter',
    impacts: { sp500: -8, bonds: -2, gold: 12, oil: 50, realEstate: -5 },
  },
  {
    id: 10,
    name: 'Custom: GCC RE Boom',
    description: 'Hypothetical GCC real estate super-cycle driven by mega-project completions and population influx',
    impacts: { sp500: 2, bonds: -3, gold: 5, oil: 15, realEstate: 40 },
  },
];
