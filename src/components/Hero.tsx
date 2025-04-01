
import React from 'react';
import { cn } from '@/lib/utils';
import { RefreshCw, Database, LineChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useMacroData from '@/hooks/useMacroData';

interface HeroProps {
  className?: string;
}

const Hero: React.FC<HeroProps> = ({ className }) => {
  const { isLoading, isRealData, refetchData } = useMacroData();

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
                {isRealData && <LineChart className="h-3 w-3 text-blue-500 ml-2" />}
              </div>
              <div className="flex items-center space-x-2">
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
              Using DataFrame-processed financial and economic data
            </p>
          </div>
        </div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/5 pointer-events-none"></div>
    </div>
  );
};

export default Hero;
