"use client";
import { randomBytes } from "crypto";
import { useEffect, useState } from "react";
import { Doughnut } from 'react-chartjs-2';
import { Clipboard } from "flowbite-react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { RefreshCcw } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js/auto';

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
    return randomBytes(length).toString('hex');
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

    const data = { mt5Id, mt5Name, token };

    try {
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
        alert("Data successfully added!");
      }
    } catch (error) {
      alert("Error creating data: MT5 ID ALREADY IN USE");
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

  

  const [balances, setBalances] = useState<number[]>([]);
  const [accountNames, setAccountNames] = useState<string[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);

  const [chartText, setChartText] = useState("Loading...");
  useEffect(() => {
    if (accountNames.length > 0) {
      setChartText(`Number of Assets: ${accountNames.length}`);
    }else{
      setChartText(`Connect Metatrader Account to show Assets`);
    }

    console.log(`Number of Assets: ${accountNames.length}`);
  }, [accountNames]);



  //ทุกครั้งที่ accounts เปลี่ยนก็คือมีการเพิ่มลบ mt5 account มันก็จะคำนวณใหม่
  useEffect(() => {
    if (accounts.length > 0) {
      const newBalances = accounts.map((account: any) => account.balance);
      const newAccountNames = accounts.map((account: any) => account.MT5_name || account.MT5_accountid);
      const newTotalBalance = newBalances.reduce((acc, balance) => acc + balance, 0);

      setBalances(newBalances);
      setAccountNames(newAccountNames);
      setTotalBalance(newTotalBalance);
    }
  }, [accounts]);

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

      const text = chartText;
      const textX = Math.round((width - ctx.measureText(text).width) / 2);
      const textY = height / 2;

      ctx.fillStyle = "black"; // ✅ สีตัวอักษร
      ctx.fillText(text, textX, textY);
      ctx.save();
    },
  };


  ChartJS.register(ArcElement, Tooltip, Legend);
  const options = {
    cutout: "80%",
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
           key={chartText} // 🔥 เปลี่ยน key ทุกครั้งที่ chartText เปลี่ยน
            data={{
              labels: accountNames,
              datasets: [{
                label: 'Balance',
                data: balances,
                backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)'],
                borderWidth: 0,
              }],
            }}
            options={options}
            plugins={[centerTextPlugin]}
          />
        </div>
      </div>

      {/* Bottom Section (40%) */}
      <div className="h-[45%] bg-white relative p-7">
        <div className="bg-white rounded-lg shadow-md p-6 relative">
          <div className="flex absolute top-4 right-4">
            <button>
              <RefreshCcw onClick={fetchAccounts} className="mr-7" />
            </button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" >Add MT5 Account</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Connect Metatrader Account</SheetTitle>
                  <SheetDescription>
                    Enter your MT5 details to generate a token.
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="mt5Id" className="text-left">MT5 ID</Label>
                    <Input
                      id="mt5Id"
                      value={mt5Id}
                      onChange={(e) => setMt5Id(e.target.value)}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="mt5Name" className="text-left">MT5 Name</Label>
                    <Input
                      id="mt5Name"
                      value={mt5Name}
                      onChange={(e) => setMt5Name(e.target.value)}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <p className="text-sm text-gray-700">
                    Token will be generated for: <b>{email}</b>
                  </p>
                  <Button onClick={handleGenerateToken}>Generate Token</Button>
                </div>

                {token && (
                  <>
                    <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
                      <h3 className="text-sm font-semibold text-gray-800 mb-2">Generated Token:</h3>
                      <p className="text-xs break-words"><b>Token:</b> {token}</p>
                    </div>
                    <SheetFooter>
                      <SheetClose asChild>
                        <Button
                          className="mt-7"
                          onClick={handleCreate}
                        >
                          Create
                        </Button>
                      </SheetClose>
                    </SheetFooter>
                  </>
                )}
              </SheetContent>
            </Sheet>
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
                  {accounts.map((account: any) => (
                    <tr key={account.MT5_id} className="hover:bg-gray-100 transition-all duration-300">
                      <td><img className="ml-15 w-8" src="https://www.infinox.com/global/wp-content/uploads/sites/5/2023/06/MT5-hero-pic.webp" alt="MT5" /></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{account.MT5_accountid}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{account.MT5_name}</td>
                      <td className="px-6 py-4 truncate max-w-[200px] text-sm text-gray-800"><Component api_token={account.api_token} /></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${account.status === "Connected" ? "bg-[#00FF00] text-black" : "bg-red-500 text-white"}`}>
                          {account.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{account.balance.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500">No MT5 accounts found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MT5Dashboard;
