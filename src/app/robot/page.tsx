"use client"
import { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
interface Bot {
  Model_id: number;
  name: string;
  version: string;
  Update_at: string;
  numberofuse: number;
}



const BotPresets = () => {

  const [bots, setBots] = useState<Bot[]>([]); // เก็บข้อมูลบอททั้งหมด
  const [filteredBots, setFilteredBots] = useState<Bot[]>([]); // เก็บบอทที่ผ่านการกรอง
  const [botNames, setBotNames] = useState([]); // เก็บชื่อบอททั้งหมดสำหรับ dropdown
  const [selectedBot, setSelectedBot] = useState("All"); // state เก็บค่าจาก dropdown



  // โหลดข้อมูลบอทจาก API
  useEffect(() => {
    const fetchBots = async () => {
      const response = await fetch(`/api/get-model`);
      const data = await response.json();
      setBots(data);
      setFilteredBots(data); // ตั้งค่า default ให้แสดงบอททั้งหมด

      // ดึงชื่อบอททั้งหมดเพื่อใช้ใน dropdown
      const names: any = Array.from(new Set(data.map((bot: { name: string; }) => bot.name))); // เอาชื่อไม่ซ้ำ
      setBotNames(names);
    };

    fetchBots();
  }, []);

  // ฟังก์ชันเปลี่ยนค่า dropdown
  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = event.target.value;
    setSelectedBot(selectedName);

    // กรองเฉพาะบอทที่มีชื่อตรงกับที่เลือก
    if (selectedName === "All") {
      setFilteredBots(bots);
    } else {
      setFilteredBots(bots.filter(bot => bot.name === selectedName));
    }
  };


  const [showModal, setShowModal] = useState(false);
  const [accounts, setAccounts] = useState([]); // ตัวอย่างข้อมูล MT5 accounts

  const [selectedAccount, setSelectedAccount] = useState<any>();
  const [selectedModel, setselectedModel] = useState<Bot>();

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

  const handleCopyBot = (bot: Bot) => {
    // console.log(bot)
    setselectedModel(bot)
    setShowModal(true); // เปิด Modal
  };
  const handleAccountSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAccount(e.target.value);
  };

  const handleSubmit = async () => {
    // ทำการเชื่อมต่อกับ MT5 account ที่เลือก
    console.log(selectedAccount)
    const mt5_id = selectedAccount? JSON.parse(selectedAccount).MT5_id : null
    if (mt5_id != null) {

      console.log(`Connecting to ${JSON.parse(selectedAccount).MT5_accountid} with ${selectedModel?.name} (${selectedModel?.Model_id})`);

      console.log("send data:",mt5_id,"model id: ",selectedModel?.Model_id)

      const response = await fetch('/api/connectmodel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mt5_id:mt5_id,
          selectedModelId: selectedModel?.Model_id
        }),
      });
      if (response.ok) {
        setShowModal(false);
        toast.success(`Added ${selectedModel?.name} to ${JSON.parse(selectedAccount).MT5_accountid} !`, { duration: 8000 });

        toast.success(<>
          <a href="/control_panel" target='_blank' className="text-blue-500">
            Go to Control room
          </a>
        </>, { duration: 8000 });
      } else {
        toast.error("Failed to connect account")
      }
    } else {
      toast.error("Need to select account")
    }

  };

 

  return (
    <div className="mx-auto p-10 bg-gray-100 min-h-screen">
      <Toaster position="top-center" reverseOrder={true} />
      <div className="header mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Signal Forex Robot</h1>
        <p className="text-lg text-gray-600">Choose your robot</p>
      </div>

      {/* Dropdown Filter */}
      <div className="filters mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Filters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="relative" >
            <label htmlFor="botName" className="block font-medium text-gray-700">Bot Name:</label>
            <select
              name="botName"
              id="botName"
              value={selectedBot}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none overflow-hidden   transition-opacity duration-300"
            >
              <option value="All">All</option>
              {botNames.map((name, index) => (
                <option key={index} value={name}>{name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bot List */}
      <div className="bot-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBots.map((bot, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-xl p-6 hover:scale-105 transition duration-300">
            <h3 className="text-xl font-medium text-gray-800 mb-3">{bot.name}</h3>
            <div className="text-gray-600">
              <p className="mb-1">Timeframe: {bot.name.split(" ")[1]}</p>
              <p className="mb-1">version: {bot.version}</p>
              <p className="mb-1">last update: {bot.Update_at}</p>
              <p>Total use: {bot.numberofuse}</p>
            </div>
            <button onClick={() => handleCopyBot(bot)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mt-4 transition duration-300">
              Use Bot
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Select MT5 Account</h2>
            <select value={selectedAccount} onChange={handleAccountSelect} className="w-full border border-gray-300 rounded-md p-2 mb-4">
              <option value="">Select an account</option>
              {accounts.map((account: any, index) => (
                <option key={index} value={JSON.stringify(account)}>{account.MT5_accountid}</option>
              ))}
            </select>
            <div className="flex justify-end gap-4">
              <button onClick={() => setShowModal(false)} className="bg-gray-400 text-white py-2 px-4 rounded-md">Cancel</button>
              <button onClick={handleSubmit} className="bg-blue-500 text-white py-2 px-4 rounded-md">Submit</button>
            </div>
          </div>
        </div>
      )}




    </div>

  );
};

export default BotPresets;
