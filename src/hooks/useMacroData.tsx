
import { useQuery } from '@tanstack/react-query';
import { MacroData, StockData, TechCompanyData } from '@/lib/data';
import { fetchEconomicDataWithAI } from '@/services/openaiService';
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// The actual data fetching function that uses our DataFrame data
const fetchDataFrameEconomicData = async (): Promise<{
  macroData: MacroData[];
  stockData: StockData[];
  techCompanies: TechCompanyData[];
  errorMessage?: string;
  errorType?: string;
  isUsingRealData: boolean;
}> => {
  try {
    console.log("Fetching economic data using DataFrame approach");
    const result = await fetchEconomicDataWithAI();
    
    if (!result.success || !result.macroData.length) {
      console.log("Failed to fetch DataFrame data:", result.error);
      throw new Error(result.error || "Failed to fetch DataFrame data");
    }
    
    console.log("Successfully fetched DataFrame economic data");
    return {
      macroData: result.macroData,
      stockData: result.stockData,
      techCompanies: result.techCompanies,
      isUsingRealData: true
    };
  } catch (error) {
    console.error("Error fetching DataFrame data:", error);
    
    // Extract error details
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    // Check if the error has any tech companies data
    const errorWithData = error as any;
    if (errorWithData && errorWithData.techCompanies && errorWithData.techCompanies.length > 0) {
      console.log("Using partial DataFrame data despite error");
      return {
        macroData: [],
        stockData: [],
        techCompanies: errorWithData.techCompanies,
        errorMessage: errorMessage,
        errorType: "partial_data",
        isUsingRealData: true
      };
    }
    
    throw error;
  }
};

export const useMacroData = () => {
  const { toast } = useToast();
  const [errorDetails, setErrorDetails] = useState<{
    message: string;
    type: string;
  } | null>(null);
  
  // Fetch economic data with react-query
  const { 
    data, 
    isLoading,
    error,
    refetch 
  } = useQuery({
    queryKey: ['economicDataFrame'],
    queryFn: () => fetchDataFrameEconomicData(),
    staleTime: 1800000, // 30 minutes in milliseconds
    refetchOnWindowFocus: false,
    retry: 1
  });
  
  // Update API key is now a no-op since we don't use OpenAI anymore
  const updateApiKey = useCallback((newApiKey: string) => {
    toast({
      title: "Using DataFrame Data",
      description: "This app now uses local DataFrame data instead of API calls.",
    });
  }, [toast]);
  
  // Show error toast if data fetching fails completely
  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading data",
        description: "Could not fetch DataFrame economic data. Please check the console for details.",
        variant: "destructive",
      });
    }
  }, [error, toast]);
  
  // Calculate trends if macro data is available
  const calculateTrends = (macroData: MacroData[]) => {
    if (macroData.length < 2) return null;
  
    const latest = macroData[macroData.length - 1];
    const previous = macroData[macroData.length - 2];
    
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
  
  const trends = data?.macroData ? calculateTrends(data.macroData) : null;
  
  return { 
    macroData: data?.macroData || [],
    stockData: data?.stockData || [],
    techCompanies: data?.techCompanies || [],
    trends,
    isLoading,
    error: errorDetails,
    isRealData: !!data?.isUsingRealData,
    hasRealStockData: !!data?.isUsingRealData,
    updateApiKey,
    refetchData: refetch
  };
};

export default useMacroData;
