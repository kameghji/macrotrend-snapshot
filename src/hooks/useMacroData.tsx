
import { useQuery } from '@tanstack/react-query';
import { MacroData, StockData, TechCompanyData, generateMockTechCompanyData } from '@/lib/data';
import { fetchEconomicDataWithAI } from '@/services/openaiService';
import { useState, useCallback } from 'react';

// Generate mock data as fallback
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
      consumerSentiment: 65.5 + randomVariation() * 5,
    });
  }
  
  // Reverse the array so it goes from oldest to newest (for chart display)
  return months.reverse();
};

// Generate mock stock data as fallback
const generateMockStockData = (): StockData[] => {
  return [
    { name: "S&P 500", symbol: "SPX", price: 6100, change: 1.2 },
    { name: "Dow Jones", symbol: "DJI", price: 41500, change: 0.8 },
    { name: "NASDAQ", symbol: "IXIC", price: 19200, change: 1.5 },
    { name: "Russell 2000", symbol: "RUT", price: 2300, change: -0.4 }
  ];
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
    consumerSentiment: {
      current: latest.consumerSentiment,
      previous: previous.consumerSentiment,
      change: ((latest.consumerSentiment - previous.consumerSentiment) / previous.consumerSentiment) * 100,
    }
  };
};

// Mock fetching functions as fallback
const fetchMockMacroData = async (): Promise<MacroData[]> => {
  // Simulate a small delay to mimic network request
  await new Promise(resolve => setTimeout(resolve, 500));
  return generateMockData();
};

const fetchMockStockData = async (): Promise<StockData[]> => {
  // Simulate a small delay to mimic network request
  await new Promise(resolve => setTimeout(resolve, 500));
  return generateMockStockData();
};

const fetchMockTechCompaniesData = async (): Promise<TechCompanyData[]> => {
  // Simulate a small delay to mimic network request
  await new Promise(resolve => setTimeout(resolve, 500));
  return generateMockTechCompanyData();
};

// The actual data fetching function that tries to use OpenAI first
const fetchRealEconomicData = async (apiKey: string | null): Promise<{
  macroData: MacroData[];
  stockData: StockData[];
  techCompanies: TechCompanyData[];
}> => {
  // If no API key is provided, fall back to mock data
  if (!apiKey) {
    console.log("No API key provided, using mock data");
    return {
      macroData: await fetchMockMacroData(),
      stockData: await fetchMockStockData(),
      techCompanies: await fetchMockTechCompaniesData()
    };
  }

  try {
    console.log("Fetching real economic data with OpenAI");
    const result = await fetchEconomicDataWithAI(apiKey);
    
    if (!result.success || !result.macroData.length) {
      console.log("Failed to fetch real data:", result.error);
      throw new Error(result.error || "Failed to fetch data");
    }
    
    console.log("Successfully fetched real economic data");
    return {
      macroData: result.macroData,
      stockData: result.stockData,
      techCompanies: result.techCompanies
    };
  } catch (error) {
    console.error("Error fetching real data, falling back to mock data:", error);
    return {
      macroData: await fetchMockMacroData(),
      stockData: await fetchMockStockData(),
      techCompanies: await fetchMockTechCompaniesData()
    };
  }
};

export const useMacroData = () => {
  const [apiKey, setApiKey] = useState<string | null>(
    localStorage.getItem('openai_api_key')
  );
  
  // Function to update the API key
  const updateApiKey = useCallback((newApiKey: string) => {
    setApiKey(newApiKey);
  }, []);
  
  // Fetch economic data with react-query
  const { 
    data, 
    isLoading,
    error,
    refetch 
  } = useQuery({
    queryKey: ['economicData', apiKey],
    queryFn: () => fetchRealEconomicData(apiKey),
    staleTime: 3600000, // 1 hour in milliseconds
    refetchOnWindowFocus: false,
  });
  
  // Calculate trends if macro data is available
  const trends = data?.macroData ? calculateTrends(data.macroData) : null;
  
  return { 
    macroData: data?.macroData || [],
    stockData: data?.stockData || [],
    techCompanies: data?.techCompanies || [],
    trends,
    isLoading,
    error,
    isRealData: !!apiKey,
    updateApiKey,
    refetchData: refetch
  };
};

export default useMacroData;
