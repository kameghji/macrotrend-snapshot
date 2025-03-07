
import React, { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import MacroIndicator from '@/components/MacroIndicator';
import { macroData, stockData } from '@/lib/data';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const Index = () => {
  const [mounted, setMounted] = useState(false);

  // Use this to trigger animations
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={cn(
      "min-h-screen bg-background",
      "transition-opacity duration-700 ease-in-out",
      mounted ? "opacity-100" : "opacity-0"
    )}>
      <Hero />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-slide-up [animation-delay:300ms]">
          <h2 className="text-2xl font-semibold tracking-tight mb-6">
            Economic Indicators
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <MacroIndicator 
              title="Inflation Rate" 
              data={macroData}
              dataKey="inflation"
              color="#f97316"
              isPercent
            />
            
            <MacroIndicator 
              title="Interest Rate" 
              data={macroData}
              dataKey="interest"
              color="#3b82f6"
              isPercent
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
            />
            
            <MacroIndicator 
              title="Stock Market Index" 
              data={macroData}
              dataKey="stockIndex"
              color="#10b981"
              formatter={(value) => value.toLocaleString()}
            />
          </div>
        </div>
        
        <Separator className="my-10" />
        
        <div className="animate-slide-up [animation-delay:400ms]">
          <h2 className="text-2xl font-semibold tracking-tight mb-6">
            Major Stock Indices
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stockData.map((stock) => (
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
            ))}
          </div>
        </div>
        
        <footer className="mt-20 text-center text-sm text-muted-foreground">
          <p>Data updated as of {new Date().toLocaleDateString()}</p>
          <p className="mt-1">© {new Date().getFullYear()} Macrotrend Snapshot</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
