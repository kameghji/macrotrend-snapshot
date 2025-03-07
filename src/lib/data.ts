
// Types for macroeconomic indicators
export interface MacroData {
  date: string;
  inflation: number;
  interest: number;
  unemployment: number;
  stockIndex: number;
}

// Generate mock data starting from current month and going backward
const generateHistoricalData = (): MacroData[] => {
  const now = new Date();
  const result: MacroData[] = [];
  
  // Generate data for the current month and 4 months back (5 months total)
  for (let i = 0; i < 5; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    // Generate realistic but random variations
    const randomVariation = () => (Math.random() * 0.2) - 0.1; // -0.1 to +0.1
    
    result.push({
      date: monthYear,
      inflation: 2.7 + randomVariation(),
      interest: 4.75 + randomVariation() * 2,
      unemployment: 3.9 + randomVariation(),
      stockIndex: 6100 + Math.floor(randomVariation() * 500),
    });
  }
  
  // Reverse the array so it goes from oldest to newest (for chart display)
  return result.reverse();
};

// Historical mock data (generated from current month backward)
export const macroData: MacroData[] = generateHistoricalData();

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

// Stock market data types
export interface StockData {
  name: string;
  symbol: string;
  price: number;
  change: number;
}

// Mock stock data (will be replaced by API call)
export const stockData: StockData[] = [
  { name: "S&P 500", symbol: "SPX", price: 6100, change: 1.2 },
  { name: "Dow Jones", symbol: "DJI", price: 41500, change: 0.8 },
  { name: "NASDAQ", symbol: "IXIC", price: 19200, change: 1.5 },
  { name: "Russell 2000", symbol: "RUT", price: 2300, change: -0.4 }
];
