
import React, { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import useMacroData from '@/hooks/useMacroData';
import { useToast } from '@/hooks/use-toast';
import { Database, GhostIcon } from 'lucide-react';
import TechCompanyTable from '@/components/TechCompanyTable';
import EconomicIndicatorsTable from '@/components/EconomicIndicatorsTable';

const Index = () => {
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();
  
  // Use the custom hook to fetch macro and stock data
  const { macroData, techCompanies, isLoading, error, isRealData } = useMacroData();

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
        {/* Tech Companies Financial Overview Section */}
        <div className="animate-slide-up [animation-delay:300ms]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">
              Tech Companies Financial Overview
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
          
          <TechCompanyTable 
            companies={techCompanies} 
            isLoading={isLoading} 
            isMockData={!isRealData} 
          />
        </div>
        
        <Separator className="my-10" />
        
        {/* US Economic Indicators Section */}
        <div className="animate-slide-up [animation-delay:400ms]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">
              US Economic Indicators
            </h2>
            <div className="flex items-center">
              {isLoading && (
                <span className="text-sm text-muted-foreground animate-pulse mr-2">
                  Refreshing data...
                </span>
              )}
              {!isRealData && (
                <span className="text-sm text-amber-600 flex items-center mr-2">
                  <GhostIcon className="h-3 w-3 mr-1" aria-label="Mock data" />
                  Mock Data
                </span>
              )}
              {isRealData && (
                <span className="text-sm text-green-600 flex items-center">
                  <Database className="h-3 w-3 mr-1" aria-label="Live data" />
                  Live Data
                </span>
              )}
            </div>
          </div>
          
          <EconomicIndicatorsTable
            data={macroData}
            isLoading={isLoading}
            isMockData={!isRealData}
          />
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
