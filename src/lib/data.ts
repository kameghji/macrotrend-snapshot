
// Types for macroeconomic indicators
export interface MacroData {
  date: string;
  inflation: number;
  interest: number;
  unemployment: number;
  consumerSentiment: number;
}

// Type for tech company data
export interface TechCompanyData {
  name: string;
  ticker: string;
  currentPrice: number;
  priceJan1: number;
  priceChange: number;
  revenue: string;
  revenueGrowth: number;
  earningsDate: string;
  peRatio: number;
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
      consumerSentiment: 65.5 + randomVariation() * 5,
    });
  }
  
  // Reverse the array so it goes from oldest to newest (for chart display)
  return result.reverse();
};

// Generate mock tech company data
export const generateMockTechCompanyData = (): TechCompanyData[] => {
  return [
    {
      name: "Amazon (AWS)",
      ticker: "AMZN",
      currentPrice: 185.25,
      priceJan1: 151.16,
      priceChange: 22.55,
      revenue: "$143.3B",
      revenueGrowth: 12.5,
      earningsDate: "July 25, 2024",
      peRatio: 44.2
    },
    {
      name: "Google Cloud",
      ticker: "GOOGL",
      currentPrice: 176.80,
      priceJan1: 138.45,
      priceChange: 27.7,
      revenue: "$86.3B",
      revenueGrowth: 15.8,
      earningsDate: "July 23, 2024",
      peRatio: 23.4
    },
    {
      name: "ServiceNow",
      ticker: "NOW",
      currentPrice: 754.45,
      priceJan1: 706.20,
      priceChange: 6.83,
      revenue: "$8.97B",
      revenueGrowth: 23.5,
      earningsDate: "July 24, 2024",
      peRatio: 80.5
    },
    {
      name: "Snowflake",
      ticker: "SNOW",
      currentPrice: 125.60,
      priceJan1: 198.75,
      priceChange: -36.80,
      revenue: "$2.85B",
      revenueGrowth: 35.8,
      earningsDate: "August 21, 2024",
      peRatio: 0 // No P/E as they're not profitable yet
    },
    {
      name: "Microsoft",
      ticker: "MSFT",
      currentPrice: 425.35,
      priceJan1: 376.04,
      priceChange: 13.11,
      revenue: "$236.5B",
      revenueGrowth: 13.7,
      earningsDate: "July 23, 2024",
      peRatio: 36.8
    },
    {
      name: "Palo Alto Networks",
      ticker: "PANW",
      currentPrice: 316.20,
      priceJan1: 294.88,
      priceChange: 7.23,
      revenue: "$7.21B",
      revenueGrowth: 24.9,
      earningsDate: "August 19, 2024",
      peRatio: 45.7
    },
    {
      name: "CrowdStrike",
      ticker: "CRWD",
      currentPrice: 245.15,
      priceJan1: 254.33,
      priceChange: -3.61,
      revenue: "$3.06B",
      revenueGrowth: 33.6,
      earningsDate: "August 28, 2024",
      peRatio: 128.3
    }
  ];
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
    consumerSentiment: {
      current: latest.consumerSentiment,
      previous: previous.consumerSentiment,
      change: ((latest.consumerSentiment - previous.consumerSentiment) / previous.consumerSentiment) * 100,
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

// Mock tech company data
export const techCompanyData: TechCompanyData[] = generateMockTechCompanyData();
