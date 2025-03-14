
import OpenAI from 'openai';
import { MacroData, StockData, TechCompanyData } from '@/lib/data';

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
    console.log("Initializing OpenAI client with provided API key");
    const client = initializeOpenAI(apiKey);
    
    // Format the prompt with the sources to analyze
    const prompt = `
    I need the most accurate, up-to-date economic data from the United States and tech company financial information.
    
    Please extract the following data points from these specific sources (and use other reliable sources if needed):
    1. Current US Inflation Rate (CPI) from ${sources.inflation}
    2. Current Federal Reserve Interest Rate from ${sources.interest}
    3. Current US Unemployment Rate from ${sources.unemployment}
    4. Current Consumer Sentiment Index from ${sources.stockMarket}
    5. Tech company financial data from ${sources.techCompanies} (or any reliable financial source) for:
       - Amazon (AWS)
       - Google Cloud
       - ServiceNow
       - Snowflake
       - Microsoft
       - Palo Alto Networks
       - CrowdStrike
    
    For each economic indicator (inflation, interest, unemployment, consumer sentiment), provide:
    - The current rate (latest month)
    - Historical data for the previous 4 months (5 months total including current)
    - The month and year for each data point
    
    For the tech companies, provide the most accurate and up-to-date information for:
    - Current stock price
    - Revenue (most recent quarterly or annual)
    - Revenue year-over-year growth (as percentage)
    - Next earnings date
    - Stock price on January 1st of the current year
    - Price-to-Earnings (P/E) ratio
    
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
      ],
      "techCompanies": [
        {
          "name": "Company Name",
          "ticker": "Symbol",
          "currentPrice": number,
          "priceJan1": number,
          "priceChange": number,
          "revenue": string,
          "revenueGrowth": number,
          "earningsDate": "Date",
          "peRatio": number
        },
        // 7 companies total
      ]
    }
    
    Only return the JSON object, nothing else. Ensure the data is highly accurate, up-to-date, and factual as of the current date. Check multiple sources if needed to confirm the accuracy of the information.
    `;

    console.log("Sending data request to OpenAI...");
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a precise economic data analyst assistant. Extract accurate, real economic and financial data from trusted sources. Double-check your numbers against multiple sources when possible. Format exactly as requested using only verified, factual information. Your output must include accurate, current figures for all requested data points."
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
    if (!data.macroData || !Array.isArray(data.macroData) || !data.techCompanies || !Array.isArray(data.techCompanies)) {
      throw new Error("Invalid data structure returned from OpenAI");
    }

    // Log the data received for debugging
    console.log("Successfully received data from OpenAI");
    console.log("Sample macro data point:", data.macroData[data.macroData.length - 1]);
    console.log("Sample tech company:", data.techCompanies[0]);

    return {
      macroData: data.macroData,
      stockData: [], // We're not using this anymore, but keeping for backward compatibility
      techCompanies: data.techCompanies,
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
    
    return {
      macroData: [],
      stockData: [],
      techCompanies: [],
      success: false,
      error: errorMessage,
      errorType: errorType
    };
  }
};
