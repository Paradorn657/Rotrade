"use client"
import { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';

import {Clock, Users, Bot } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSession } from 'next-auth/react';
import LoginRedirect from '@/components/loginredirect';
import SimpleSpinner from '@/components/Loadingspinner';

interface Bot {
  Model_id: number;
  name: string;
  version: string;
  Update_at: string;
  numberofuse: number;
}



const BotPresets = () => {
  const [bots, setBots] = useState([]);
  const [filteredBots, setFilteredBots] = useState<any>([]);
  const [botNames, setBotNames] = useState<any>([]);
  const [selectedBot, setSelectedBot] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState<any>();
  const [selectedModel, setSelectedModel] = useState<any>();

  useEffect(() => {
    const fetchBots = async () => {
      const response = await fetch(`/api/get-model`);
      const data = await response.json();
      setBots(data);
      setFilteredBots(data);
      const names = Array.from(new Set(data.map(bot => bot.name)));
      setBotNames(names);
    };
    fetchBots();
  }, []);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch('/api/get-available-mt5');
        const data = await response.json();
        setAccounts(data);
      } catch (error) {
        console.error('Error fetching MT5 accounts:', error);
      }
    };
    fetchAccounts();
  }, []);

  const handleFilterChange = (value:any) => {
    setSelectedBot(value);
    if (value === "All") {
      setFilteredBots(bots);
    } else {
      setFilteredBots(bots.filter(bot => bot.name === value));
    }
  };

  const handleCopyBot = (bot:any) => {
    setSelectedModel(bot);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    const mt5_id = selectedAccount ? JSON.parse(selectedAccount).MT5_id : null;
    if (mt5_id != null) {
      const response = await fetch('/api/connectmodel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mt5_id: mt5_id,
          selectedModelId: selectedModel?.Model_id
        }),
      });
      
      if (response.ok) {
        setShowModal(false);
        toast.success(
          <div className="flex flex-col gap-2">
            <p>Added {selectedModel?.name} to {JSON.parse(selectedAccount).MT5_accountid}!</p>
            <a href="/control_panel" target='_blank' className="text-blue-500 hover:text-blue-700 transition-colors">
              Go to Control Room →
            </a>
          </div>,
          { duration: 8000 }
        );
      } else {
        toast.error("Failed to connect account");
      }
    } else {
      toast.error("Please select an account");
    }
  };


  const { status, data: session } = useSession();

  if (status === "loading") {
    return <SimpleSpinner />;
  }

  if(!session){
    return(<LoginRedirect/>)
  }else{

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Toaster position="top-center" />
      
      <div className="max-w-7xl mx-auto p-8 ">
        <div className="space-y-2 mb-12 mt-9">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
            Signal Forex Robot
          </h1>
          <p className="text-gray-600">Select your automated trading companion</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-4 max-w-xs">
            <Select value={selectedBot} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by Bot Name" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Bots</SelectItem>
                {botNames.map((name, index) => (
                  <SelectItem key={index} value={name}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBots.map((bot, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-gray-200">
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Bot className="w-5 h-5 text-blue-500" />
                  {bot.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Timeframe: {bot.name.split(" ")[1]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      v{bot.version}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{bot.numberofuse} users</span>
                  </div>
                  <button
                    onClick={() => handleCopyBot(bot)}
                    className="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    Use Bot
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-96 p-6">
              <CardHeader>
                <CardTitle>Select MT5 Account</CardTitle>
              </CardHeader>
              <CardContent>
                <Select 
                  value={selectedAccount} 
                  onValueChange={setSelectedAccount}
                >
                  <SelectTrigger className="w-full mb-4">
                    <SelectValue placeholder="Choose an account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account:any, index) => (
                      <SelectItem key={index} value={JSON.stringify(account)}>
                        {account.MT5_accountid} ({account.MT5_name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Connect
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

}

export default BotPresets;