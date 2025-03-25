"use client"
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import toast, { Toaster } from 'react-hot-toast';

const ModelStatsForm = () => {
  const [models, setModels] = useState<{
      winrate: number | null;
      balance_drawdown: number | null;
      equity_drawdown: number | null; Model_id: number; name: string; version: string 
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
        console.log(data);
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
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Model Performance Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Model Selection */}
            <div className="space-y-2">
              <Label>Select Model</Label>
              <select 
                className="w-full p-2 border rounded"
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
                <Label>Winrate (%)</Label>
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
                <Label>Balance Drawdown (%)</Label>
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
                <Label>Equity Drawdown (%)</Label>
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
              className="w-full"
              disabled={!selectedModel}
            >
              Update Model Stats
            </Button>
          </form>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
};

export default ModelStatsForm;