
import { TechCompanyData } from '@/lib/data';

// This service will now use pre-processed data rather than making API calls
// The data structure mimics what would be returned from the DataFrame you provided

// Company name mapping
const companyNameMap: Record<string, string> = {
  'AMZN': 'Amazon (AWS)',
  'GOOGL': 'Google Cloud',
  'NOW': 'ServiceNow',
  'SNOW': 'Snowflake',
  'MSFT': 'Microsoft',
  'PANW': 'Palo Alto Networks',
  'CRWD': 'CrowdStrike'
};

// Mock DataFrame-based data (structured like the output from your Python code)
const stockDataFrame = [
  {
    symbol: 'AMZN',
    Close: 182.50,
    Close_previous_year_quarter: 159.31,
    Close_year_start: 151.16,
    Close_YoY: 0.1457,
    Close_ytd: 0.2074,
    Year: 2024
  },
  {
    symbol: 'GOOGL',
    Close: 175.64,
    Close_previous_year_quarter: 129.27,
    Close_year_start: 138.45,
    Close_YoY: 0.3586,
    Close_ytd: 0.2686,
    Year: 2024
  },
  {
    symbol: 'NOW',
    Close: 742.80,
    Close_previous_year_quarter: 528.57,
    Close_year_start: 706.20,
    Close_YoY: 0.4053,
    Close_ytd: 0.0519,
    Year: 2024
  },
  {
    symbol: 'SNOW',
    Close: 127.81,
    Close_previous_year_quarter: 164.98,
    Close_year_start: 199.75,
    Close_YoY: -0.2253,
    Close_ytd: -0.3601,
    Year: 2024
  },
  {
    symbol: 'MSFT',
    Close: 417.72,
    Close_previous_year_quarter: 335.40,
    Close_year_start: 376.04,
    Close_YoY: 0.2454,
    Close_ytd: 0.1108,
    Year: 2024
  },
  {
    symbol: 'PANW',
    Close: 310.38,
    Close_previous_year_quarter: 242.33,
    Close_year_start: 294.88,
    Close_YoY: 0.2809,
    Close_ytd: 0.0526,
    Year: 2024
  },
  {
    symbol: 'CRWD',
    Close: 246.72,
    Close_previous_year_quarter: 150.06,
    Close_year_start: 254.33,
    Close_YoY: 0.6442,
    Close_ytd: -0.0299,
    Year: 2024
  }
];

// Quarterly revenue data (would come from your DataFrame)
const quarterlyRevenue = {
  'AMZN': { revenue: '$143.3B', growth: 12.5 },
  'GOOGL': { revenue: '$86.3B', growth: 15.8 },
  'NOW': { revenue: '$8.97B', growth: 23.5 },
  'SNOW': { revenue: '$2.85B', growth: 35.8 },
  'MSFT': { revenue: '$236.5B', growth: 13.7 },
  'PANW': { revenue: '$7.21B', growth: 24.9 },
  'CRWD': { revenue: '$3.06B', growth: 33.6 }
};

// Earnings dates (would come from your DataFrame)
const earningsDates = {
  'AMZN': 'July 25, 2024',
  'GOOGL': 'July 23, 2024',
  'NOW': 'July 24, 2024',
  'SNOW': 'August 21, 2024',
  'MSFT': 'July 23, 2024',
  'PANW': 'August 19, 2024',
  'CRWD': 'August 28, 2024'
};

// PE Ratios (would come from your DataFrame)
const peRatios = {
  'AMZN': 44.2,
  'GOOGL': 23.4,
  'NOW': 80.5,
  'SNOW': 0, // No P/E as they're not profitable yet
  'MSFT': 36.8,
  'PANW': 45.7,
  'CRWD': 128.3
};

export const fetchStockData = async (symbols: string[]): Promise<TechCompanyData[]> => {
  try {
    console.log("Using DataFrame-based stock data for:", symbols);
    
    const techCompanies: TechCompanyData[] = [];
    
    // Process each symbol using our DataFrame-structured data
    for (const symbol of symbols) {
      try {
        // Find the data for this symbol
        const stockData = stockDataFrame.find(item => item.symbol === symbol);
        
        if (!stockData) {
          console.error(`No DataFrame data found for ${symbol}`);
          continue;
        }
        
        // Add to results
        techCompanies.push({
          name: companyNameMap[symbol] || symbol,
          ticker: symbol,
          currentPrice: stockData.Close,
          priceJan1: stockData.Close_year_start,
          priceChange: stockData.Close_ytd * 100, // Convert to percentage
          revenue: quarterlyRevenue[symbol]?.revenue || "N/A",
          revenueGrowth: quarterlyRevenue[symbol]?.growth || 0,
          earningsDate: earningsDates[symbol] || "TBD",
          peRatio: peRatios[symbol] || 0
        });
        
      } catch (error) {
        console.error(`Error processing ${symbol} from DataFrame:`, error);
      }
    }
    
    console.log("Successfully processed DataFrame stock data:", techCompanies.length, "companies");
    return techCompanies;
  } catch (error) {
    console.error("Error processing DataFrame stock data:", error);
    throw error;
  }
};

// Economic indicators data from DataFrame-like structure
export const fetchEconomicIndicators = async (): Promise<any> => {
  // This would be replaced with actual DataFrame data
  const economicData = [
    {
      date: "Jan 2024",
      inflation: 3.1,
      interest: 5.25,
      unemployment: 3.7,
      consumerSentiment: 78.8
    },
    {
      date: "Feb 2024",
      inflation: 3.2,
      interest: 5.25,
      unemployment: 3.8,
      consumerSentiment: 79.1
    },
    {
      date: "Mar 2024",
      inflation: 3.5,
      interest: 5.25,
      unemployment: 3.8,
      consumerSentiment: 76.9
    },
    {
      date: "Apr 2024",
      inflation: 3.4,
      interest: 5.25,
      unemployment: 3.9,
      consumerSentiment: 77.2
    },
    {
      date: "May 2024",
      inflation: 3.3,
      interest: 5.25,
      unemployment: 4.0,
      consumerSentiment: 69.1
    }
  ];
  
  return economicData;
};
