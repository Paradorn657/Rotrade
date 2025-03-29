"use client"
import { useEffect, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';

import SimpleSpinner from '@/components/Loadingspinner';
import LoginRedirect from '@/components/loginredirect';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, Clock, Pointer, Users } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface IBot {
  Model_id: number;
  name: string;
  version: string;
  Update_at: string;
  numberofuse: number;
  winrate: number;
  balance_drawdown: number;
  equity_drawdown: number;
}



const BotPresets = () => {
  const [bots, setBots] = useState<IBot[]>([]);
  const [filteredBots, setFilteredBots] = useState<IBot[]>([]);
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
      console.log(data);
      setBots(data);
      setFilteredBots(data);
      const names = Array.from(new Set(data.map((bot: { name: any; }) => bot.name)));
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

  const handleFilterChange = (value: any) => {
    setSelectedBot(value);
    if (value === "All") {
      setFilteredBots(bots);
    } else {
      setFilteredBots(bots.filter(bot => bot.name === value));
    }
  };

  const handleCopyBot = (bot: any) => {
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

  if (!session) {
    return (<LoginRedirect />)
  } else {

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Toaster position="top-center" />

        <div className="max-w-7xl mx-auto p-1 ">
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
                  {botNames.map((name:any, index:any) => (
                    <SelectItem key={index} value={name}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBots.map((bot, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden 
          transition-all duration-300 hover:shadow-xl hover:border-blue-300 
          flex flex-col h-full transform hover:-translate-y-1"
                >
                  {/* Bot Header with Gradient */}
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <Bot className="w-6 h-6 text-white" />
                        <h2 className="text-xl font-bold">{bot.name}</h2>
                      </div>
                      <div className="bg-white text-indigo-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                        v{bot.version}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-4 flex-grow flex flex-col">
                    {/* Update Information */}
                    <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>อัพเดทล่าสุด:</span>
                      </div>
                      <span className="font-medium">
                        {new Date(bot.Update_at).toLocaleString('th-TH', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false
                        })}
                      </span>
                    </div>

                    {/* Backtest Banner */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-md">
                      <p className="text-sm font-medium text-blue-700">
                        ผลการ Backtest (1 ปี)
                      </p>
                    </div>

                    {/* Stats Section with Improved Design */}
                    <div className="grid grid-cols-3 gap-2 my-3">
                      <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-100">
                        <div className="text-xs uppercase text-gray-500 mb-1">Winrate</div>
                        <div className="text-xl font-bold text-blue-600">
                          {bot?.winrate? `${bot.winrate}%` : "-"}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-100">
                        <div className="text-xs uppercase text-gray-500 mb-1">Balance DD</div>
                        <div className="text-xl font-bold text-green-600">
                          {bot.balance_drawdown}%
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-100">
                        <div className="text-xs uppercase text-gray-500 mb-1">Equity DD</div>
                        <div className="text-xl font-bold text-red-600">
                          {bot.equity_drawdown}%
                        </div>
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className="space-y-3 text-sm border-t border-gray-100 pt-3 pb-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <span className="text-gray-600">Timeframe</span>
                        </div>
                        <span className="font-medium text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
                          {bot.name.split(" ")[1] || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-blue-400" />
                          <span className="text-gray-600">จำนวนผู้ใช้</span>
                        </div>
                        <span className="font-medium text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
                          {bot.numberofuse}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleCopyBot(bot)}
                      className="mt-4 w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold 
              hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 
              flex items-center justify-center 
              transform hover:scale-[1.02] active:scale-[0.98] shadow-md"
                    >
                      <Pointer className="w-5 h-5 mr-2" />
                      <span>เลือกใช้ Bot นี้</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
                      {accounts.map((account: any, index) => (
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