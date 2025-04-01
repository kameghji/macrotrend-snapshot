
import { MacroData, StockData, TechCompanyData } from '@/lib/data';
import { fetchStockData, fetchEconomicIndicators } from './financeService';

export interface EconomicDataResponse {
  macroData: MacroData[];
  stockData: StockData[];
  techCompanies: TechCompanyData[];
  success: boolean;
  error?: string;
  errorType?: string;
}

export const fetchEconomicDataWithAI = async (
  apiKey: string | null = null
): Promise<EconomicDataResponse> => {
  try {
    console.log("Starting data fetching process using DataFrame approach");
    
    // Define tech companies to fetch
    const techSymbols = ['AMZN', 'GOOGL', 'NOW', 'SNOW', 'MSFT', 'PANW', 'CRWD'];
    
    // Get tech company data from our DataFrame-based service
    const techCompanies = await fetchStockData(techSymbols);
    
    // Get economic indicators from our DataFrame-based service
    const macroData = await fetchEconomicIndicators();
    
    console.log("Successfully fetched DataFrame-based data");
    console.log("Sample tech company:", techCompanies[0]);
    console.log("Sample macro data point:", macroData[macroData.length - 1]);
    
    return {
      macroData: macroData,
      stockData: [],
      techCompanies: techCompanies,
      success: true
    };
  } catch (error) {
    console.error("Error fetching DataFrame-based economic data:", error);
    
    try {
      // Even if there's an error, try to get tech company data
      console.log("Attempting to at least fetch tech company data...");
      const techSymbols = ['AMZN', 'GOOGL', 'NOW', 'SNOW', 'MSFT', 'PANW', 'CRWD'];
      const techCompanies = await fetchStockData(techSymbols);
      
      return {
        macroData: [],
        stockData: [],
        techCompanies: techCompanies,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        errorType: "internal_error"
      };
    } catch (directError) {
      console.error("Failed to fetch tech data:", directError);
      return {
        macroData: [],
        stockData: [],
        techCompanies: [],
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        errorType: "internal_error"
      };
    }
  }
};
