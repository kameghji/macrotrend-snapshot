
import { TechCompanyData } from '@/lib/data';

// API endpoint for finance data (we'll use a proxy or direct service)
// In production, this would be a serverless function or backend API
const FINANCE_API_URL = 'https://query1.finance.yahoo.com/v8/finance/chart/';

interface YahooFinanceResponse {
  chart: {
    result: Array<{
      meta: {
        symbol: string;
        regularMarketPrice: number;
        chartPreviousClose: number;
      };
      timestamp: number[];
      indicators: {
        quote: Array<{
          open: number[];
          high: number[];
          low: number[];
          close: number[];
          volume: number[];
        }>;
      };
    }>;
    error: any;
  };
}

export const fetchStockData = async (symbols: string[]): Promise<TechCompanyData[]> => {
  try {
    console.log("Fetching direct stock data for:", symbols);
    
    // Map company names to their tickers for display
    const companyNameMap: Record<string, string> = {
      'AMZN': 'Amazon (AWS)',
      'GOOGL': 'Google Cloud',
      'NOW': 'ServiceNow',
      'SNOW': 'Snowflake',
      'MSFT': 'Microsoft',
      'PANW': 'Palo Alto Networks',
      'CRWD': 'CrowdStrike'
    };
    
    // Get the start of year date for YTD calculations
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const startOfYearTimestamp = Math.floor(startOfYear.getTime() / 1000);
    
    // Create requests for current data and start-of-year data for each symbol
    const techCompanies: TechCompanyData[] = [];
    
    // Process each symbol
    for (const symbol of symbols) {
      try {
        console.log(`Fetching data for ${symbol}...`);
        
        // Get current data
        const currentResponse = await fetch(`${FINANCE_API_URL}${symbol}?interval=1d&range=5d`);
        const currentData: YahooFinanceResponse = await currentResponse.json();
        
        // Get YTD data (from January 1st)
        const ytdResponse = await fetch(`${FINANCE_API_URL}${symbol}?interval=1d&period1=${startOfYearTimestamp}&period2=${Math.floor(Date.now() / 1000)}`);
        const ytdData: YahooFinanceResponse = await ytdResponse.json();
        
        if (currentData.chart.error || !currentData.chart.result || currentData.chart.result.length === 0) {
          console.error(`Error fetching data for ${symbol}:`, currentData.chart.error);
          continue;
        }
        
        // Extract current price
        const result = currentData.chart.result[0];
        const currentPrice = result.meta.regularMarketPrice;
        
        // Find January 1st price
        let priceJan1 = 0;
        if (ytdData.chart.result && ytdData.chart.result[0]) {
          const ytdResult = ytdData.chart.result[0];
          const firstIndex = 0; // First trading day in the year
          
          if (ytdResult.indicators.quote[0].close && ytdResult.indicators.quote[0].close[firstIndex]) {
            priceJan1 = ytdResult.indicators.quote[0].close[firstIndex];
          }
        }
        
        // Calculate YTD change
        const priceChange = priceJan1 > 0 ? ((currentPrice - priceJan1) / priceJan1) * 100 : 0;
        
        // Add to results
        techCompanies.push({
          name: companyNameMap[symbol] || symbol,
          ticker: symbol,
          currentPrice: currentPrice,
          priceJan1: priceJan1,
          priceChange: priceChange,
          revenue: "Loading...", // These would come from quarterly reports or other sources
          revenueGrowth: 0,      // Would need additional API calls to get this data
          earningsDate: "Loading...", // Would need additional API calls
          peRatio: 0            // Would need additional API calls
        });
        
      } catch (error) {
        console.error(`Error processing ${symbol}:`, error);
      }
    }
    
    console.log("Successfully fetched direct stock data:", techCompanies.length, "companies");
    return techCompanies;
  } catch (error) {
    console.error("Error fetching direct stock data:", error);
    throw error;
  }
};

// Fetch economic indicators - this could be expanded to use BLS or FRED APIs
export const fetchEconomicIndicators = async (): Promise<any> => {
  // This would be implemented with direct API calls to economic data sources
  // For now, we'll return mock data
  return [];
};
