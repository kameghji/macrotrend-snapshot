
import React, { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import MacroIndicator from '@/components/MacroIndicator';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import useMacroData from '@/hooks/useMacroData';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Database, GhostIcon } from 'lucide-react';

const Index = () => {
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();
  
  // Use the custom hook to fetch macro and stock data
  const { macroData, stockData, isLoading, error, isRealData } = useMacroData();

  // Show error toast if data fetching fails
  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading data",
        description: "Could not fetch the latest economic data. Using cached data instead.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Use this to trigger animations
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get the last update date (current date or from data if available)
  const lastUpdated = macroData.length > 0 
    ? macroData[macroData.length - 1].date 
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

  return (
    <div className={cn(
      "min-h-screen bg-background",
      "transition-opacity duration-700 ease-in-out",
      mounted ? "opacity-100" : "opacity-0"
    )}>
      <Hero />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-slide-up [animation-delay:300ms]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">
              Economic Indicators
            </h2>
            <div className="flex items-center">
              {isLoading && (
                <span className="text-sm text-muted-foreground animate-pulse mr-2">
                  Refreshing data...
                </span>
              )}
              {!isRealData && (
                <span className="text-sm text-amber-600 flex items-center mr-2">
                  <GhostIcon className="h-3 w-3 mr-1" />
                  Mock Data
                </span>
              )}
              {isRealData && (
                <span className="text-sm text-green-600 flex items-center">
                  <Database className="h-3 w-3 mr-1" />
                  Live Data
                </span>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <MacroIndicator 
              title="Inflation Rate" 
              data={macroData}
              dataKey="inflation"
              color="#f97316"
              isPercent
              isLoading={isLoading}
              isMockData={!isRealData}
            />
            
            <MacroIndicator 
              title="Interest Rate" 
              data={macroData}
              dataKey="interest"
              color="#3b82f6"
              isPercent
              isLoading={isLoading}
              isMockData={!isRealData}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <MacroIndicator 
              title="Unemployment Rate" 
              data={macroData}
              dataKey="unemployment"
              color="#ef4444"
              isPercent
              inverseTrend
              isLoading={isLoading}
              isMockData={!isRealData}
            />
            
            <MacroIndicator 
              title="Stock Market Index" 
              data={macroData}
              dataKey="stockIndex"
              color="#10b981"
              formatter={(value) => value.toLocaleString()}
              isLoading={isLoading}
              isMockData={!isRealData}
            />
          </div>
        </div>
        
        <Separator className="my-10" />
        
        <div className="animate-slide-up [animation-delay:400ms]">
          <h2 className="text-2xl font-semibold tracking-tight mb-6">
            Major Stock Indices
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {isLoading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="glass animate-pulse p-6 rounded-2xl h-24"></div>
              ))
            ) : (
              stockData.map((stock) => (
                <div 
                  key={stock.symbol}
                  className={cn(
                    "glass p-6 rounded-2xl",
                    !isRealData && "border border-dashed border-amber-300/50 bg-amber-50/10"
                  )}
                >
                  <div className="flex justify-between items-baseline mb-2">
                    <div className="flex items-center">
                      <h3 className={cn(
                        "font-medium",
                        !isRealData && "text-gray-600"
                      )}>{stock.name}</h3>
                      {!isRealData && (
                        <span className="inline-flex items-center tooltip" aria-label="Mock data">
                          <GhostIcon className="h-3 w-3 text-amber-500 ml-1" />
                        </span>
                      )}
                    </div>
                    <span className={cn(
                      "text-sm",
                      !isRealData ? "text-gray-500" : "text-muted-foreground"
                    )}>{stock.symbol}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className={cn(
                      "text-2xl font-semibold", 
                      !isRealData && "text-gray-600"
                    )}>{stock.price.toLocaleString()}</span>
                    <span className={cn(
                      !isRealData 
                        ? (stock.change >= 0 ? "text-green-600/50" : "text-red-600/50")
                        : (stock.change >= 0 ? "text-green-600" : "text-red-600")
                    )}>
                      {stock.change > 0 ? "+" : ""}{stock.change}%
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <footer className="mt-20 text-center text-sm text-muted-foreground">
          <p>Data {isRealData ? "fetched" : "updated"} as of {lastUpdated}</p>
          <p className="mt-1">© {new Date().getFullYear()} Macrotrend Snapshot{isRealData ? " • Powered by OpenAI" : ""}</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
