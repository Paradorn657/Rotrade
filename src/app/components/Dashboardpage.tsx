"use client";

import { randomBytes } from "crypto";
import { useEffect, useState } from "react";
import { Dropdown } from "flowbite-react";
import { Clipboard } from "flowbite-react";
import { RefreshCcw } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js/auto';
import { Doughnut } from 'react-chartjs-2';


export function Component({ api_token }: { api_token: string }) {
  const displayedToken = api_token.length > 10 ? api_token.slice(0, 10) + " ************" : api_token;

  return (
    <div className="grid w-52 max-w-64">
      <div className="relative">
        <label htmlFor="api-token" className="sr-only">
          API Token
        </label>
        <input
          id="api-token"
          type="text"
          className="col-span-6 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          value={displayedToken}
          disabled
          readOnly
        />
        <Clipboard.WithIcon valueToCopy={api_token} />
      </div>
    </div>
  );
}

const MT5Dashboard = ({ email }: { email: string }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [token, setToken] = useState("");
  const [mt5InstanceId, setMt5InstanceId] = useState("");

  const [mt5Id, setMt5Id] = useState("");
  const [mt5Name, setMt5Name] = useState("");

  function generateRandomToken(length: number = 32): string {
    return randomBytes(length).toString('hex'); // สร้าง token ที่มีความยาว 32 ตัวอักษรในรูปแบบ hex
  }

  const handleGenerateToken = async () => {
    if (!email) {
      alert("User session is invalid or email is missing!");
      return;
    }
    if (!mt5Id || !mt5Name) {
      alert("Please fill in both MT5 ID and MT5 Name");
      return;
    }

    try {
      const token = generateRandomToken();
      setToken(token);
    } catch (error) {
      console.error(error);
      alert("Error generating token");
    }
  };

  const handleCreate = async () => {
    if (!token || !mt5Id || !mt5Name) {
      alert("Please make sure all fields are filled.");
      return;
    }

    const data = {
      mt5Id,
      mt5Name,
      token
    };

    try {
      // เรียก API เพื่อเพิ่มข้อมูลลงในฐานข้อมูล
      const response = await fetch('/api/create-Mt5', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || 'Failed to create Account');
      } else {
        console.log('Successfully added to database:', result);

        // แสดงข้อความหรือการดำเนินการอื่น ๆ เมื่อสำเร็จ
        alert("Data successfully added!");
      }

    } catch (error) {
      console.error('Error creating data:', error);
      alert("MT5 ID ALREADY IN USE");
    }
  };

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/get-mt5");
      if (!response.ok) throw new Error("Failed to fetch accounts");

      const data = await response.json();
      setAccounts(data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();

  }, []);

  const centerTextPlugin = {
    id: "centerText",
    beforeDraw: (chart: any) => {
      const { width, height, ctx } = chart;
      ctx.restore();
      const fontSize = (height / 314).toFixed(2);
      ctx.font = `${fontSize}em sans-serif`;
      ctx.textBaseline = "middle";
  
      const text = "Number of assets: 4";
      const textX = Math.round((width - ctx.measureText(text).width) / 2);
      const textY = height / 2;
  
      ctx.fillStyle = "black"; // ✅ สีตัวอักษร
      ctx.fillText(text, textX, textY);
      ctx.save();
    },
  };
  

  ChartJS.register(ArcElement, Tooltip, Legend);
  const options = {
    cutout:"80%",
    responsive: true,          // ทำให้ Chart ปรับตามหน้าจอ
    maintainAspectRatio: false, // ปิดการคงอัตราส่วน (ทำให้ใช้ height & width ได้)
    plugins: {
      legend: {
        display: false, // ✅ ซ่อน Legend
      },
      centerText: {}, // ✅ ใช้ Custom Plugin
    },
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Top Section (60%) */}
      <div className="flex-1 bg-gray-200 flex items-center justify-center">
        <div className="w-60 h-60">
        <Doughnut
        data={
          {labels: [
            'Red',
            'Blue',
            'Yellow'
          ],
          datasets: [{
            label: 'My First Dataset',
            data: [300, 50, 100],
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)'
            ],
            hoverOffset: 4,
            borderWidth:0
          }]}
          
        }
        options={options}
        plugins={[centerTextPlugin]}
        />
        </div>

      </div>

      {/* Bottom Section (40%) */}
      <div className="h-[45%] bg-white relative p-7">
        <div className="bg-white rounded-lg shadow-md p-6 relative">
          <div className="flex absolute top-4 right-4"> {/* Button positioning */}
          <button
            >
             <RefreshCcw onClick={fetchAccounts} className="mr-7"/>
          </button>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Add MT5 Account
            </button>
          </div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Metatrader Accounts</h2>
          {loading ? (
            <p className="text-center text-gray-500 animate-pulse">Loading...</p>
          ) : accounts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse rounded-lg overflow-hidden">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"></th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">MT5 ID</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Token</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Balance (USD)</th>
                  </tr>
                </thead>
                <tbody>
                {accounts
                    .slice() // Clone array เพื่อไม่ให้เปลี่ยนค่า accounts ต้นฉบับ
                    .sort((a:any, b) => (a.status === "Connected" ? -1 : 1)) // ให้ "Connected" มาก่อน
                    .map((account: any, index) => (
                      <tr key={account.MT5_id} className="hover:bg-gray-100 transition-all duration-300">
                        <td><img className="ml-15 w-8" src="https://www.infinox.com/global/wp-content/uploads/sites/5/2023/06/MT5-hero-pic.webp" alt="คำอธิบายรูปภาพ" /></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{account.MT5_accountid}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{account.MT5_name}</td>
                        <td className="px-6 py-4 truncate max-w-[200px] text-sm text-gray-800"><Component api_token={account.api_token} /></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${account.status === "Connected" ? "bg-[#00FF00] text-black" : "bg-red-500 text-white"}`}>
                            {account.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{account.balance.toFixed(2)}</td>
                        <td>
                          <Dropdown label="Dropdown button" dismissOnClick={false} renderTrigger={() => (
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
                              <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                            </svg>
                          )}>
                            <Dropdown.Item>Dashboard</Dropdown.Item>
                            <Dropdown.Item>Settings</Dropdown.Item>
                            <Dropdown.Item>Earnings</Dropdown.Item>
                            <Dropdown.Item>Sign out</Dropdown.Item>
                          </Dropdown>
                        </td>
                      </tr>
                    ))
                  }

                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500">No MT5 accounts found.</p>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      {isSidebarOpen && (
        <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 flex flex-col p-4">


          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Connect Metatrader Account</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              ✕
            </button>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">MT5 ID</label>
              <input

                value={mt5Id}
                onChange={(e) => setMt5Id(e.target.value)}
                type="text"
                id="first_name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="ID"
                required />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">MT5 NAME</label>
              <input
                value={mt5Name}
                onChange={(e) => setMt5Name(e.target.value)}
                type="text" id="first_name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name" required />
            </div>

            <p className="text-sm text-gray-700">
              Token will be generated for : <b>{email}</b>
            </p>
            <button
              onClick={handleGenerateToken}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Generate Token
            </button>
          </div>

          {token && (
            <>
              <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">Generated Token:</h3>
                <p className="text-xs break-words">
                  <b>Token:</b> {token}
                </p>
                {/* <p className="text-xs mt-2">
                <b>MT5 Instance ID:</b> {mt5InstanceId}
              </p> */}

              </div>
              <button type="button"
                onClick={handleCreate}
                className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200
               dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center  mb-2 mt-4">
                Create</button>
            </>

          )}


        </div>
      )}
    </div>
  );
};

export default MT5Dashboard;
