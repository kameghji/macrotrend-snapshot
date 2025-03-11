
import React from 'react';
import { cn } from '@/lib/utils';
import { RefreshCw, Database, AlertTriangle } from 'lucide-react';
import ApiKeyForm from './ApiKeyForm';
import { Button } from '@/components/ui/button';
import useMacroData from '@/hooks/useMacroData';

interface HeroProps {
  className?: string;
}

const Hero: React.FC<HeroProps> = ({ className }) => {
  const { isLoading, isRealData, updateApiKey, refetchData, error } = useMacroData();

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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium text-muted-foreground">{formattedDate}</p>
                {isLoading && <RefreshCw className="h-3 w-3 animate-spin text-muted-foreground" />}
                {isRealData && <Database className="h-3 w-3 text-green-500 ml-2" />}
              </div>
              <div className="flex items-center space-x-2">
                <ApiKeyForm onApiKeySet={updateApiKey} />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => refetchData()} 
                  disabled={isLoading}
                >
                  <RefreshCw className={cn("h-3 w-3 mr-2", isLoading && "animate-spin")} />
                  Refresh
                </Button>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Macroeconomic Snapshot
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              {isRealData 
                ? "Live data from Trading Economics, BLS, and Yahoo Finance via OpenAI"
                : "Using mock data for demonstration purposes"}
            </p>
            
            {error && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-amber-800">API Error Detected</p>
                  <p className="text-sm text-amber-700">
                    {error.type === "quota_exceeded" 
                      ? "Your OpenAI API key has exceeded its quota. To see real data, please update your API key or check your OpenAI account billing."
                      : error.type === "invalid_key"
                        ? "Your OpenAI API key appears to be invalid. Please check the key and try again."
                        : "Could not connect to OpenAI API. Displaying mock data instead."}
                  </p>
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
