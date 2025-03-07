
import React from 'react';
import { cn } from '@/lib/utils';
import { latestData, trends, formatPercent, macroData } from '@/lib/data';
import { ArrowDown, ArrowUpRight, Minus } from 'lucide-react';
import AnimatedNumber from './AnimatedNumber';

interface HeroProps {
  className?: string;
}

const Hero: React.FC<HeroProps> = ({ className }) => {
  if (!trends) return null;

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

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className="relative z-10 py-12 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="animate-fade-in">
          <div className="flex flex-col space-y-2 mb-8">
            <p className="text-sm font-medium text-muted-foreground">{formattedDate}</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Macroeconomic Snapshot
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Monthly overview of key economic indicators tracked from July 2024 to present
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-up [animation-delay:200ms]">
            <div className="glass p-5 rounded-2xl">
              <p className="text-sm font-medium text-muted-foreground mb-1">Inflation Rate</p>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-semibold">
                  <AnimatedNumber 
                    value={trends.inflation.current} 
                    formatFn={(v) => formatPercent(v)} 
                  />
                </span>
                <span className={cn("flex items-center text-sm", getColor(trends.inflation.change))}>
                  {getArrow(trends.inflation.change)}
                  {trends.inflation.change > 0 ? '+' : ''}
                  {trends.inflation.change.toFixed(1)}%
                </span>
              </div>
            </div>
            
            <div className="glass p-5 rounded-2xl">
              <p className="text-sm font-medium text-muted-foreground mb-1">Interest Rate</p>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-semibold">
                  <AnimatedNumber 
                    value={trends.interest.current} 
                    formatFn={(v) => formatPercent(v)} 
                  />
                </span>
                <span className={cn("flex items-center text-sm", getColor(trends.interest.change))}>
                  {getArrow(trends.interest.change)}
                  {trends.interest.change > 0 ? '+' : ''}
                  {trends.interest.change.toFixed(2)}%
                </span>
              </div>
            </div>
            
            <div className="glass p-5 rounded-2xl">
              <p className="text-sm font-medium text-muted-foreground mb-1">Unemployment</p>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-semibold">
                  <AnimatedNumber 
                    value={trends.unemployment.current} 
                    formatFn={(v) => formatPercent(v)} 
                  />
                </span>
                <span className={cn("flex items-center text-sm", getColor(trends.unemployment.change, true))}>
                  {getArrow(trends.unemployment.change)}
                  {trends.unemployment.change > 0 ? '+' : ''}
                  {trends.unemployment.change.toFixed(1)}%
                </span>
              </div>
            </div>
            
            <div className="glass p-5 rounded-2xl">
              <p className="text-sm font-medium text-muted-foreground mb-1">Market Index</p>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-semibold">
                  <AnimatedNumber 
                    value={trends.stockIndex.current} 
                    formatFn={(v) => v.toLocaleString()} 
                  />
                </span>
                <span className={cn("flex items-center text-sm", getColor(trends.stockIndex.change))}>
                  {getArrow(trends.stockIndex.change)}
                  {trends.stockIndex.change > 0 ? '+' : ''}
                  {trends.stockIndex.change.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="glass rounded-2xl p-4 overflow-hidden animate-slide-up [animation-delay:400ms]">
            <div className="ticker-wrapper">
              <div className="ticker">
                {Array(2).fill(macroData).flat().map((item, index) => (
                  <span key={index} className="inline-block mx-6">
                    <strong>{item.date}:</strong> Inflation {item.inflation}% | Interest {item.interest}% | Unemployment {item.unemployment}% | Index {item.stockIndex.toLocaleString()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/5 pointer-events-none"></div>
    </div>
  );
};

export default Hero;
