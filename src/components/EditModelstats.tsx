"use client"
import React, { useState, useEffect } from 'react';
import { Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast, { Toaster } from 'react-hot-toast';

const ModelStatsModal = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (open: boolean) => void }) => {
  const [models, setModels] = useState<{
      winrate: number | null;
      balance_drawdown: number | null;
      equity_drawdown: number | null; 
      Model_id: number; 
      name: string; 
      version: string 
  }[]>([]);
  const [selectedModel, setSelectedModel] = useState<{ Model_id: number; name: string; version: string } | null>(null);
  const [stats, setStats] = useState({
    winrate: '',
    balance_drawdown: '',
    equity_drawdown: ''
  });

  // Fetch models on component mount
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch('/api/get-model');
        if (!response.ok) {
          throw new Error('Failed to fetch models');
        }
        const data = await response.json();
        setModels(data);
      } catch (error) {
        toast.error('Could not fetch models');
      }
    };

    fetchModels();
  }, []);

  const handleModelSelect = (modelId: string) => {
    const model = models.find(m => m.Model_id === Number(modelId));
    setSelectedModel(model || null);

    if (model) {
      setStats({
        winrate: model.winrate !== null ? model.winrate.toString() : '',
        balance_drawdown: model.balance_drawdown !== null ? model.balance_drawdown.toString() : '',
        equity_drawdown: model.equity_drawdown !== null ? model.equity_drawdown.toString() : ''
      });
    } else {
      setStats({
        winrate: '',
        balance_drawdown: '',
        equity_drawdown: ''
      });
    }
  };

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setStats(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    
    if (!selectedModel) {
      toast.error('Please select a model');
      return;
    }

    try {
      const response = await fetch('/api/update-model-stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          modelId: selectedModel.Model_id,
          ...stats
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update model stats');
      }

      toast.success('Model stats updated successfully');
      setIsOpen(false);

      // Reset form
      setStats({
        winrate: '',
        balance_drawdown: '',
        equity_drawdown: ''
      });
      setSelectedModel(null);
    } catch (error) {
      toast.error('Could not update model stats');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} >

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center justify-between ">
            <span className="text-xl font-semibold">Model Performance Stats</span>
          
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 p-4">
          {/* Model Selection */}
          <div className="space-y-2">
            <Label className="block text-sm font-medium text-gray-700">
              Select Model
            </Label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={(e) => handleModelSelect(e.target.value)}
              value={selectedModel?.Model_id || ''}
            >
              <option value="">Select a Model</option>
              {models.map(model => (
                <option key={model.Model_id} value={model.Model_id}>
                  {model.name} (v{model.version})
                </option>
              ))}
            </select>
          </div>

          {/* Stats Input */}
          <div className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Winrate (%)
              </Label>
              <Input 
                type="number" 
                step="0.01" 
                name="winrate"
                value={stats.winrate}
                onChange={handleInputChange}
                placeholder="Enter Winrate"
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Balance Drawdown (%)
              </Label>
              <Input 
                type="number" 
                step="0.01" 
                name="balance_drawdown"
                value={stats.balance_drawdown}
                onChange={handleInputChange}
                placeholder="Enter Balance Drawdown"
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Equity Drawdown (%)
              </Label>
              <Input 
                type="number" 
                step="0.01" 
                name="equity_drawdown"
                value={stats.equity_drawdown}
                onChange={handleInputChange}
                placeholder="Enter Equity Drawdown"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full mt-4"
            disabled={!selectedModel}
          >
            Update Model Stats
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModelStatsModal;