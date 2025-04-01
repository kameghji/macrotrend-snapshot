
import OpenAI from 'openai';
import { MacroData, StockData, TechCompanyData } from '@/lib/data';
import { fetchStockData } from './financeService';

// OpenAI client
let openaiClient: OpenAI | null = null;

const initializeOpenAI = (apiKey: string): OpenAI => {
  if (!openaiClient || openaiClient.apiKey !== apiKey) {
    openaiClient = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true // Only for demo purposes, in production use server-side API calls
    });
  }
  return openaiClient;
};

export interface EconomicDataResponse {
  macroData: MacroData[];
  stockData: StockData[];
  techCompanies: TechCompanyData[];
  success: boolean;
  error?: string;
  errorType?: string;
}

export const fetchEconomicDataWithAI = async (
  apiKey: string,
  sources = {
    inflation: "https://tradingeconomics.com/united-states/inflation-cpi",
    interest: "https://tradingeconomics.com/united-states/interest-rate",
    unemployment: "https://tradingeconomics.com/united-states/unemployment-rate",
    stockMarket: "https://tradingeconomics.com/united-states/consumer-confidence",
    techCompanies: "https://finance.yahoo.com/"
  }
): Promise<EconomicDataResponse> => {
  try {
    console.log("Starting data fetching process");
    
    // First, try to fetch tech company data directly using Yahoo Finance API
    const techSymbols = ['AMZN', 'GOOGL', 'NOW', 'SNOW', 'MSFT', 'PANW', 'CRWD'];
    const techCompanies = await fetchStockData(techSymbols);
    
    // Now get economic data using OpenAI
    console.log("Initializing OpenAI client with provided API key for economic indicators");
    const client = initializeOpenAI(apiKey);
    
    // Format the prompt with the sources to analyze - now focused just on economic indicators
    const prompt = `
    I need the most accurate, up-to-date economic data from the United States.
    
    Please extract the following data points from these specific sources (and use other reliable sources if needed):
    1. Current US Inflation Rate (CPI) from ${sources.inflation}
    2. Current Federal Reserve Interest Rate from ${sources.interest}
    3. Current US Unemployment Rate from ${sources.unemployment}
    4. Current Consumer Sentiment Index from ${sources.stockMarket}
    
    For each economic indicator (inflation, interest, unemployment, consumer sentiment), provide:
    - The current rate (latest month)
    - Historical data for the previous 4 months (5 months total including current)
    - The month and year for each data point
    
    Format your response as a JSON object with this exact structure:
    {
      "macroData": [
        {
          "date": "Month Year",
          "inflation": number,
          "interest": number,
          "unemployment": number,
          "consumerSentiment": number
        },
        // 5 months total, ordered from oldest to newest
      ]
    }
    
    Only return the JSON object, nothing else. Ensure the data is highly accurate, up-to-date, and factual as of the current date. Check multiple sources if needed to confirm the accuracy of the information.
    `;

    console.log("Sending economic indicators request to OpenAI...");
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a precise economic data analyst assistant. Extract accurate, real economic data from trusted sources. Double-check your numbers against multiple sources when possible. Format exactly as requested using only verified, factual information. Your output must include accurate, current figures for all requested data points."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.0, // Set to 0 for maximum determinism and factuality
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content returned from OpenAI");
    }

    // Parse the JSON response
    const data = JSON.parse(content);
    
    // Validate the response structure
    if (!data.macroData || !Array.isArray(data.macroData)) {
      throw new Error("Invalid data structure returned from OpenAI");
    }

    // Log the data received for debugging
    console.log("Successfully received data from OpenAI");
    console.log("Sample macro data point:", data.macroData[data.macroData.length - 1]);
    console.log("Sample tech company (from direct API):", techCompanies[0]);

    return {
      macroData: data.macroData,
      stockData: [], // We're not using this anymore, but keeping for backward compatibility
      techCompanies: techCompanies,
      success: true
    };
  } catch (error) {
    console.error("Error fetching economic data with AI:", error);
    
    // Identify specific error types for better user messaging
    let errorType = "unknown";
    let errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    
    // Check for quota exceeded errors
    if (errorMessage.includes("exceeded your current quota") || errorMessage.includes("429")) {
      errorType = "quota_exceeded";
      errorMessage = "Your OpenAI API key has exceeded its quota. Please check your OpenAI account billing or try a different API key.";
    } 
    // Check for invalid API key
    else if (errorMessage.includes("Incorrect API key") || errorMessage.includes("401")) {
      errorType = "invalid_key";
      errorMessage = "Your OpenAI API key appears to be invalid. Please check the key and try again.";
    }
    
    try {
      // Even if OpenAI fails, try to get tech company data directly
      console.log("Attempting to at least fetch tech company data directly...");
      const techSymbols = ['AMZN', 'GOOGL', 'NOW', 'SNOW', 'MSFT', 'PANW', 'CRWD'];
      const techCompanies = await fetchStockData(techSymbols);
      
      return {
        macroData: [],
        stockData: [],
        techCompanies: techCompanies,
        success: false,
        error: errorMessage,
        errorType: errorType
      };
    } catch (directError) {
      console.error("Failed to fetch tech data directly:", directError);
      return {
        macroData: [],
        stockData: [],
        techCompanies: [],
        success: false,
        error: errorMessage,
        errorType: errorType
      };
    }
  }
};
