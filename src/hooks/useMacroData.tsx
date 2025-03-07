
import { useQuery } from '@tanstack/react-query';
import { MacroData, StockData } from '@/lib/data';

// Function to fetch macro data from an API
const fetchMacroData = async (): Promise<MacroData[]> => {
  // In a real app, we would fetch from a real API
  // For demo purposes, we're using a mock fetch that returns data with the current month
  const response = await fetch('https://api.example.com/macroeconomic-data');
  
  // If the API is not available, return mock data with current month
  if (!response.ok) {
    console.log('Using mock data as fallback');
    return generateMockData();
  }
  
  return response.json();
};

// Function to fetch stock data from an API
const fetchStockData = async (): Promise<StockData[]> => {
  // In a real app, we would fetch from a real API
  const response = await fetch('https://api.example.com/stock-data');
  
  // If the API is not available, return mock data
  if (!response.ok) {
    console.log('Using mock stock data as fallback');
    return [
      { name: "S&P 500", symbol: "SPX", price: 6100, change: 1.2 },
      { name: "Dow Jones", symbol: "DJI", price: 41500, change: 0.8 },
      { name: "NASDAQ", symbol: "IXIC", price: 19200, change: 1.5 },
      { name: "Russell 2000", symbol: "RUT", price: 2300, change: -0.4 }
    ];
  }
  
  return response.json();
};

// Generate mock data starting from current month backward
const generateMockData = (): MacroData[] => {
  const now = new Date();
  const months = [];
  
  // Generate data for the current month and 4 months back (5 months total)
  for (let i = 0; i < 5; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    // Generate realistic but random variations for each month
    const randomVariation = () => (Math.random() * 0.2) - 0.1; // -0.1 to +0.1
    
    months.push({
      date: monthYear,
      inflation: 2.7 + randomVariation(),
      interest: 4.75 + randomVariation() * 2,
      unemployment: 3.9 + randomVariation(),
      stockIndex: 6100 + Math.floor(randomVariation() * 500),
    });
  }
  
  // Reverse the array so it goes from oldest to newest (for chart display)
  return months.reverse();
};

// Calculate trends between the latest two data points
export const calculateTrends = (data: MacroData[]) => {
  if (!data || data.length < 2) return null;

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

export const useMacroData = () => {
  // Fetch macro data with react-query
  // Set staleTime to 1 day (86400000 ms) so it refreshes daily
  // This allows for monthly data to be current
  const { 
    data: macroData, 
    isLoading: isLoadingMacro,
    error: macroError 
  } = useQuery({
    queryKey: ['macroData'],
    queryFn: fetchMacroData,
    staleTime: 86400000, // 1 day in milliseconds
    refetchOnWindowFocus: false,
  });
  
  // Fetch stock data with react-query
  const { 
    data: stockData, 
    isLoading: isLoadingStock,
    error: stockError 
  } = useQuery({
    queryKey: ['stockData'],
    queryFn: fetchStockData,
    staleTime: 86400000, // 1 day in milliseconds
    refetchOnWindowFocus: false,
  });
  
  // Calculate trends if macro data is available
  const trends = macroData ? calculateTrends(macroData) : null;
  
  return { 
    macroData: macroData || [],
    stockData: stockData || [],
    trends,
    isLoading: isLoadingMacro || isLoadingStock,
    error: macroError || stockError 
  };
};

export default useMacroData;
