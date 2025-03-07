
import React from 'react';
import { cn } from '@/lib/utils';
import { formatPercent } from '@/lib/data';
import { ArrowDown, ArrowUpRight, Minus, RefreshCw } from 'lucide-react';
import AnimatedNumber from './AnimatedNumber';
import useMacroData from '@/hooks/useMacroData';

interface HeroProps {
  className?: string;
}

const Hero: React.FC<HeroProps> = ({ className }) => {
  const { trends, macroData, isLoading } = useMacroData();

  if (!trends && !isLoading) return null;

  const getArrow = (change: number) => {
    if (change > 0) return <ArrowUpRight className="h-4 w-4" />;
    if (change < 0) return <ArrowDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  const getColor = (change: number, inverse = false) => {
    if (change === 0) return "text-gray-500";
    if (inverse) {
      return change < 0 ? "text-green-600" : "text-red-600";
    }
    return change > 0 ? "text-green-600" : "text-red-600";
  };

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Create placeholder data for loading state
  const placeholderTrends = {
    inflation: { current: 0, previous: 0, change: 0 },
    interest: { current: 0, previous: 0, change: 0 },
    unemployment: { current: 0, previous: 0, change: 0 },
    stockIndex: { current: 0, previous: 0, change: 0 }
  };

  // Use actual trends or placeholder based on loading state
  const displayTrends = isLoading ? placeholderTrends : trends;

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className="relative z-10 py-12 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="animate-fade-in">
          <div className="flex flex-col space-y-2 mb-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium text-muted-foreground">{formattedDate}</p>
              {isLoading && <RefreshCw className="h-3 w-3 animate-spin text-muted-foreground" />}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Macroeconomic Snapshot
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Monthly overview of key economic indicators with auto-updating data
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-up [animation-delay:200ms]">
            <div className={cn("glass p-5 rounded-2xl", isLoading && "animate-pulse")}>
              <p className="text-sm font-medium text-muted-foreground mb-1">Inflation Rate</p>
              {isLoading ? (
                <div className="h-8 bg-gray-200/50 rounded-md"></div>
              ) : (
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-semibold">
                    <AnimatedNumber 
                      value={displayTrends.inflation.current} 
                      formatFn={(v) => formatPercent(v)} 
                    />
                  </span>
                  <span className={cn("flex items-center text-sm", getColor(displayTrends.inflation.change))}>
                    {getArrow(displayTrends.inflation.change)}
                    {displayTrends.inflation.change > 0 ? '+' : ''}
                    {displayTrends.inflation.change.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
            
            <div className={cn("glass p-5 rounded-2xl", isLoading && "animate-pulse")}>
              <p className="text-sm font-medium text-muted-foreground mb-1">Interest Rate</p>
              {isLoading ? (
                <div className="h-8 bg-gray-200/50 rounded-md"></div>
              ) : (
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-semibold">
                    <AnimatedNumber 
                      value={displayTrends.interest.current} 
                      formatFn={(v) => formatPercent(v)} 
                    />
                  </span>
                  <span className={cn("flex items-center text-sm", getColor(displayTrends.interest.change))}>
                    {getArrow(displayTrends.interest.change)}
                    {displayTrends.interest.change > 0 ? '+' : ''}
                    {displayTrends.interest.change.toFixed(2)}%
                  </span>
                </div>
              )}
            </div>
            
            <div className={cn("glass p-5 rounded-2xl", isLoading && "animate-pulse")}>
              <p className="text-sm font-medium text-muted-foreground mb-1">Unemployment</p>
              {isLoading ? (
                <div className="h-8 bg-gray-200/50 rounded-md"></div>
              ) : (
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-semibold">
                    <AnimatedNumber 
                      value={displayTrends.unemployment.current} 
                      formatFn={(v) => formatPercent(v)} 
                    />
                  </span>
                  <span className={cn("flex items-center text-sm", getColor(displayTrends.unemployment.change, true))}>
                    {getArrow(displayTrends.unemployment.change)}
                    {displayTrends.unemployment.change > 0 ? '+' : ''}
                    {displayTrends.unemployment.change.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
            
            <div className={cn("glass p-5 rounded-2xl", isLoading && "animate-pulse")}>
              <p className="text-sm font-medium text-muted-foreground mb-1">Market Index</p>
              {isLoading ? (
                <div className="h-8 bg-gray-200/50 rounded-md"></div>
              ) : (
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-semibold">
                    <AnimatedNumber 
                      value={displayTrends.stockIndex.current} 
                      formatFn={(v) => v.toLocaleString()} 
                    />
                  </span>
                  <span className={cn("flex items-center text-sm", getColor(displayTrends.stockIndex.change))}>
                    {getArrow(displayTrends.stockIndex.change)}
                    {displayTrends.stockIndex.change > 0 ? '+' : ''}
                    {displayTrends.stockIndex.change.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Ticker with historical rates */}
          <div className={cn("glass rounded-2xl p-4 overflow-hidden animate-slide-up [animation-delay:400ms]", 
                            isLoading && "animate-pulse")}>
            {isLoading ? (
              <div className="h-6 bg-gray-200/50 rounded-md w-full"></div>
            ) : (
              <div className="ticker-wrapper">
                <div className="ticker">
                  {Array(2).fill(macroData).map((data, index) => (
                    <div key={index} className="inline-flex space-x-8 mx-6">
                      {data.map((month, i) => (
                        <span key={i} className="whitespace-nowrap">
                          <span className="font-medium">{month.date}:</span>{' '}
                          <span className="text-blue-600">Inflation {month.inflation.toFixed(1)}%</span>{' | '}
                          <span className="text-green-600">Interest {month.interest.toFixed(1)}%</span>{' | '}
                          <span className="text-red-600">Unemployment {month.unemployment.toFixed(1)}%</span>{' | '}
                          <span className="text-purple-600">Market {month.stockIndex.toLocaleString()}</span>
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/5 pointer-events-none"></div>
    </div>
  );
};

export default Hero;
