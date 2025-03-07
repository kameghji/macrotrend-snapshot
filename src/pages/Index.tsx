
import React, { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import MacroIndicator from '@/components/MacroIndicator';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import useMacroData from '@/hooks/useMacroData';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';

const Index = () => {
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();
  
  // Use the custom hook to fetch macro and stock data
  const { macroData, stockData, isLoading, error } = useMacroData();

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
            {isLoading && (
              <span className="text-sm text-muted-foreground animate-pulse">
                Refreshing data...
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <MacroIndicator 
              title="Inflation Rate" 
              data={macroData}
              dataKey="inflation"
              color="#f97316"
              isPercent
              isLoading={isLoading}
            />
            
            <MacroIndicator 
              title="Interest Rate" 
              data={macroData}
              dataKey="interest"
              color="#3b82f6"
              isPercent
              isLoading={isLoading}
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
            />
            
            <MacroIndicator 
              title="Stock Market Index" 
              data={macroData}
              dataKey="stockIndex"
              color="#10b981"
              formatter={(value) => value.toLocaleString()}
              isLoading={isLoading}
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
                  className="glass p-6 rounded-2xl"
                >
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="font-medium">{stock.name}</h3>
                    <span className="text-sm text-muted-foreground">{stock.symbol}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-2xl font-semibold">{stock.price.toLocaleString()}</span>
                    <span className={stock.change >= 0 ? "text-green-600" : "text-red-600"}>
                      {stock.change > 0 ? "+" : ""}{stock.change}%
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <footer className="mt-20 text-center text-sm text-muted-foreground">
          <p>Data updated as of {lastUpdated}</p>
          <p className="mt-1">© {new Date().getFullYear()} Macrotrend Snapshot</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
