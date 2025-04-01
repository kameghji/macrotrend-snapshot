
import { useQuery } from '@tanstack/react-query';
import { MacroData, StockData, TechCompanyData, generateMockTechCompanyData, calculateTrends } from '@/lib/data';
import { fetchEconomicDataWithAI } from '@/services/openaiService';
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

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

// The actual data fetching function that tries to use OpenAI first
const fetchRealEconomicData = async (apiKey: string | null): Promise<{
  macroData: MacroData[];
  stockData: StockData[];
  techCompanies: TechCompanyData[];
  errorMessage?: string;
  errorType?: string;
  isUsingMockData: boolean;
  hasRealStockData: boolean;
}> => {
  // If no API key is provided, fall back to mock data
  if (!apiKey) {
    console.log("No API key provided, using mock data");
    return {
      macroData: await generateMockData(),
      stockData: await generateMockStockData(),
      techCompanies: await generateMockTechCompanyData(),
      isUsingMockData: true,
      hasRealStockData: false
    };
  }

  try {
    console.log("Fetching real economic data with OpenAI");
    const result = await fetchEconomicDataWithAI(apiKey);
    
    // If we have tech company data but no macro data
    if (!result.success && result.techCompanies.length > 0) {
      console.log("Partial success: Got real stock data but not economic indicators");
      return {
        macroData: await generateMockData(),
        stockData: result.stockData,
        techCompanies: result.techCompanies,
        errorMessage: result.error,
        errorType: result.errorType,
        isUsingMockData: true,
        hasRealStockData: true
      };
    }
    
    if (!result.success || !result.macroData.length) {
      console.log("Failed to fetch real data:", result.error);
      throw new Error(result.error || "Failed to fetch data");
    }
    
    console.log("Successfully fetched real economic data");
    return {
      macroData: result.macroData,
      stockData: result.stockData,
      techCompanies: result.techCompanies,
      isUsingMockData: false,
      hasRealStockData: true
    };
  } catch (error) {
    console.error("Error fetching real data, falling back to mock data:", error);
    
    // Extract error details
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    let errorType = "unknown";
    
    // Check specific error types from the openaiService
    if (error instanceof Error && "errorType" in error) {
      errorType = (error as any).errorType;
    }
    // Or detect common error patterns in the message
    else if (errorMessage.includes("exceeded") || errorMessage.includes("quota") || errorMessage.includes("429")) {
      errorType = "quota_exceeded";
    } else if (errorMessage.includes("invalid") || errorMessage.includes("incorrect") || errorMessage.includes("401")) {
      errorType = "invalid_key";
    }
    
    // Check if the error has any tech companies data
    const errorWithData = error as any;
    if (errorWithData && errorWithData.techCompanies && errorWithData.techCompanies.length > 0) {
      console.log("Using real stock data despite OpenAI error");
      return {
        macroData: await generateMockData(),
        stockData: [],
        techCompanies: errorWithData.techCompanies,
        errorMessage: errorMessage,
        errorType: errorType,
        isUsingMockData: true,
        hasRealStockData: true
      };
    }
    
    return {
      macroData: await generateMockData(),
      stockData: await generateMockStockData(),
      techCompanies: await generateMockTechCompanyData(),
      errorMessage: errorMessage,
      errorType: errorType,
      isUsingMockData: true,
      hasRealStockData: false
    };
  }
};

export const useMacroData = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState<string | null>(
    localStorage.getItem('openai_api_key')
  );
  const [errorDetails, setErrorDetails] = useState<{
    message: string;
    type: string;
  } | null>(null);
  
  // Function to update the API key
  const updateApiKey = useCallback((newApiKey: string) => {
    if (newApiKey) {
      localStorage.setItem('openai_api_key', newApiKey);
      setApiKey(newApiKey);
      // Clear any previous errors when setting a new key
      setErrorDetails(null);
      toast({
        title: "API Key Updated",
        description: "Your OpenAI API key has been saved. Fetching live data...",
      });
    }
  }, [toast]);
  
  // Check for API key on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey && savedKey !== apiKey) {
      setApiKey(savedKey);
    } else if (!savedKey) {
      toast({
        title: "API Key Required",
        description: "Please provide an OpenAI API key to get real-time economic data.",
        variant: "default",
      });
    }
  }, [apiKey, toast]);
  
  // Fetch economic data with react-query
  const { 
    data, 
    isLoading,
    error,
    refetch 
  } = useQuery({
    queryKey: ['economicData', apiKey],
    queryFn: () => fetchRealEconomicData(apiKey),
    staleTime: 1800000, // 30 minutes in milliseconds
    refetchOnWindowFocus: false,
    retry: 1, // Only retry once to avoid excessive API calls on quota issues
  });
  
  // Track if we're using mock data and update error details
  useEffect(() => {
    if (data?.isUsingMockData && data.errorMessage) {
      setErrorDetails({
        message: data.errorMessage,
        type: data.errorType || "unknown"
      });
      
      // Show appropriate toast based on error type
      if (data.errorType === "quota_exceeded") {
        toast({
          title: "API Quota Exceeded",
          description: data.hasRealStockData 
            ? "Your OpenAI API key has exceeded its quota. Stock data is still live, but economic indicators are using mock data."
            : "Your OpenAI API key has exceeded its quota. Using mock data instead.",
          variant: "destructive",
        });
      } else if (data.errorType === "invalid_key") {
        toast({
          title: "Invalid API Key",
          description: data.hasRealStockData 
            ? "The OpenAI API key appears to be invalid. Stock data is still live, but economic indicators are using mock data."
            : "The OpenAI API key appears to be invalid. Using mock data instead.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error loading data",
          description: data.hasRealStockData 
            ? "Could not fetch economic indicators. Stock data is still live, but economic indicators are using mock data."
            : "Could not fetch live economic data. Using mock data instead.",
          variant: "destructive",
        });
      }
    } else {
      setErrorDetails(null);
    }
  }, [data, toast]);
  
  // Show error toast if data fetching fails completely
  useEffect(() => {
    if (error && apiKey) {
      toast({
        title: "Error loading data",
        description: "Could not fetch economic data. Please try again later.",
        variant: "destructive",
      });
    }
  }, [error, toast, apiKey]);
  
  // Calculate trends if macro data is available
  const trends = data?.macroData ? calculateTrends(data.macroData) : null;
  
  return { 
    macroData: data?.macroData || [],
    stockData: data?.stockData || [],
    techCompanies: data?.techCompanies || [],
    trends,
    isLoading,
    error: errorDetails,
    isRealData: !!apiKey && !data?.isUsingMockData,
    hasRealStockData: !!data?.hasRealStockData,
    updateApiKey,
    refetchData: refetch
  };
};

export default useMacroData;
