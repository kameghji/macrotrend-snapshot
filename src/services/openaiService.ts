
import OpenAI from 'openai';
import { MacroData, StockData } from '@/lib/data';

// OpenAI client
let openaiClient: OpenAI | null = null;

const initializeOpenAI = (apiKey: string): OpenAI => {
  if (!openaiClient) {
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
  success: boolean;
  error?: string;
}

export const fetchEconomicDataWithAI = async (
  apiKey: string,
  sources = {
    inflation: "https://tradingeconomics.com/united-states/inflation-cpi",
    interest: "https://tradingeconomics.com/united-states/interest-rate",
    unemployment: "https://www.bls.gov/cps/",
    stockMarket: "https://finance.yahoo.com/markets/world-indices/"
  }
): Promise<EconomicDataResponse> => {
  try {
    const client = initializeOpenAI(apiKey);
    
    // Format the prompt with the sources to analyze
    const prompt = `
    I need the latest economic data from the United States.
    
    Please extract the following data points from these specific sources:
    1. Inflation Rate (CPI) from ${sources.inflation}
    2. Federal Reserve Interest Rate from ${sources.interest}
    3. Unemployment Rate from ${sources.unemployment}
    4. Major Market Indices (S&P 500, Dow Jones, NASDAQ, Russell 2000) from ${sources.stockMarket}
    
    For each economic indicator (inflation, interest, unemployment), provide:
    - The current rate (latest month)
    - Historical data for the previous 4 months (5 months total including current)
    - The month and year for each data point
    
    For the stock market indices, provide:
    - Current value
    - Percentage change
    
    Format your response as a JSON object with this exact structure:
    {
      "macroData": [
        {
          "date": "Month Year",
          "inflation": number,
          "interest": number,
          "unemployment": number,
          "stockIndex": number
        },
        // 5 months total, ordered from oldest to newest
      ],
      "stockData": [
        {
          "name": "Index Name",
          "symbol": "Symbol",
          "price": number,
          "change": number
        },
        // 4 indices total
      ]
    }
    
    Only return the JSON object, nothing else. The data must be up-to-date and accurate.
    `;

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an economic data analyst assistant. Extract accurate economic data from provided sources and format it precisely as requested."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2, // Lower temperature for more deterministic responses
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content returned from OpenAI");
    }

    // Parse the JSON response
    const data = JSON.parse(content);
    
    // Validate the response structure
    if (!data.macroData || !Array.isArray(data.macroData) || !data.stockData || !Array.isArray(data.stockData)) {
      throw new Error("Invalid data structure returned from OpenAI");
    }

    return {
      macroData: data.macroData,
      stockData: data.stockData,
      success: true
    };
  } catch (error) {
    console.error("Error fetching economic data with AI:", error);
    return {
      macroData: [],
      stockData: [],
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
};
