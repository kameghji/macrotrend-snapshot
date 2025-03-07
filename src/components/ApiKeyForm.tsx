
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface ApiKeyFormProps {
  onApiKeySet: (apiKey: string) => void;
}

const API_KEY_STORAGE_KEY = 'openai_api_key';

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  // Check for saved API key on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (savedApiKey) {
      setApiKey(savedApiKey);
      onApiKeySet(savedApiKey);
    } else {
      // If no API key is found, open the dialog
      setOpen(true);
    }
  }, [onApiKeySet]);
  
  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }
    
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    onApiKeySet(apiKey);
    setOpen(false);
    
    toast({
      title: "API Key Saved",
      description: "Your OpenAI API key has been saved for fetching economic data",
    });
  };
  
  const handleClearApiKey = () => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    setApiKey('');
    toast({
      title: "API Key Removed",
      description: "Your OpenAI API key has been removed",
    });
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            {localStorage.getItem(API_KEY_STORAGE_KEY) ? "Update API Key" : "Set API Key"}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>OpenAI API Key</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Enter your OpenAI API key to fetch real economic data. The key is stored only in your browser's localStorage.
            </p>
            <Input
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              type="password"
              className="mb-4"
            />
            <div className="flex space-x-2">
              <Button onClick={handleSaveApiKey} className="flex-1">
                Save Key
              </Button>
              {localStorage.getItem(API_KEY_STORAGE_KEY) && (
                <Button onClick={handleClearApiKey} variant="outline">
                  Clear Key
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApiKeyForm;
