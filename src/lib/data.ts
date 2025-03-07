
// Mock data for macroeconomic indicators from July 2024
export interface MacroData {
  date: string;
  inflation: number;
  interest: number;
  unemployment: number;
  stockIndex: number;
}

export const macroData: MacroData[] = [
  {
    date: "Jul 2024",
    inflation: 3.1,
    interest: 5.5,
    unemployment: 4.3,
    stockIndex: 5600,
  },
  {
    date: "Aug 2024",
    inflation: 3.0,
    interest: 5.5,
    unemployment: 4.2,
    stockIndex: 5650,
  },
  {
    date: "Sep 2024",
    inflation: 2.9,
    interest: 5.25,
    unemployment: 4.1,
    stockIndex: 5800,
  },
  {
    date: "Oct 2024",
    inflation: 2.8,
    interest: 5.0,
    unemployment: 4.0,
    stockIndex: 5900,
  },
  {
    date: "Nov 2024",
    inflation: 2.7,
    interest: 4.75,
    unemployment: 3.9,
    stockIndex: 6100,
  }
];

// Calculate trends and changes
export const calculateTrends = (data: MacroData[]) => {
  if (data.length < 2) return null;

  const latest = data[data.length - 1];
  const previous = data[data.length - 2];
  
  return {
    inflation: {
      current: latest.inflation,
      previous: previous.inflation,
      change: latest.inflation - previous.inflation,
    },
    interest: {
      current: latest.interest,
      previous: previous.interest,
      change: latest.interest - previous.interest,
    },
    unemployment: {
      current: latest.unemployment,
      previous: previous.unemployment,
      change: latest.unemployment - previous.unemployment,
    },
    stockIndex: {
      current: latest.stockIndex,
      previous: previous.stockIndex,
      change: ((latest.stockIndex - previous.stockIndex) / previous.stockIndex) * 100,
    }
  };
};

export const latestData = macroData[macroData.length - 1];
export const trends = calculateTrends(macroData);

// Format functions for display
export const formatPercent = (num: number) => {
  return num.toFixed(1) + "%";
};

export const formatCurrency = (num: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

// Stock market data
export interface StockData {
  name: string;
  symbol: string;
  price: number;
  change: number;
}

export const stockData: StockData[] = [
  { name: "S&P 500", symbol: "SPX", price: 6100, change: 1.2 },
  { name: "Dow Jones", symbol: "DJI", price: 41500, change: 0.8 },
  { name: "NASDAQ", symbol: "IXIC", price: 19200, change: 1.5 },
  { name: "Russell 2000", symbol: "RUT", price: 2300, change: -0.4 }
];
