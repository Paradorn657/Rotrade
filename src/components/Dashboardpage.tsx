"use client";
import { randomBytes } from "crypto";
import { useEffect, useState } from "react";
import { Doughnut } from 'react-chartjs-2';
import { Clipboard } from "flowbite-react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TrendingUp, Award, AlertTriangle, Percent, ChevronDown, Trash2 } from 'lucide-react';
import { Label } from "@/components/ui/label"
import { Sparkles, BarChart2, Clock } from 'lucide-react';
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
import { Session } from "next-auth";
import { Bills } from "@prisma/client";
import toast, { Toaster } from "react-hot-toast";




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

const MT5Dashboard = ({ session }: { session: Session }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [token, setToken] = useState("");
  const [mt5InstanceId, setMt5InstanceId] = useState("");
  const [mt5Id, setMt5Id] = useState("");
  const [mt5Name, setMt5Name] = useState("");


  function generateRandomToken(length: number = 32): string {
    return randomBytes(length).toString('hex');
  }

  const handleGenerateToken = async () => {
    if (!session.user.email) {
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
        toast.error(result.message || 'Failed to create Account');
      } else {
        fetchAccounts(),
          toast.success(
            <div className="flex flex-col gap-2">
              <p>Added MT5 Account</p>
            </div>,
            { duration: 5000 }
          );
      }
    } catch (error) {
      toast.error("Error creating data: MT5 ID ALREADY IN USE");
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
    } else {
      if (loading) {
        setChartText(`Loading.....`);
      } else {
        setChartText(`Connect Metatrader Account to show Assets`);
      }
    }

    console.log(`Number of Assets: ${accountNames.length}`);
  }, [accountNames, loading]);



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

  async function fetchUserData() {
    try {
      const response = await fetch(`/api/get-usersdetail?userId=${session.user.id}`);
      const data = await response.json();
      if (response.ok) {
        setUser(data.usersDB);
      }
      console.log("userdata", data.usersDB)
      setLoading(false);

    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {

    fetchAccounts();
    fetchUserData();



  }, []);





  const [user, setUser] = useState<any>();
  console.log("userbILL", user?.Bills)
  const isTradeEnabled = user?.role !== "BAN";

  const calculateAccountAge = (createDate: any) => {
    if (!createDate) return "N/A";
    const created: any = new Date(createDate);
    const now: any = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) return `${diffDays} days`;
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return `${diffMonths} months`;
    const diffYears = Math.floor(diffMonths / 12);
    const remainingMonths = diffMonths % 12;
    return remainingMonths > 0 ? `${diffYears}y ${remainingMonths}m` : `${diffYears} years`;
  };

  const generateHSLColor = (index: any) => {
    const hue = (index * 36) % 360; // ปรับมุม Hue ให้แตกต่างกัน
    return `hsl(${hue}, 70%, 50%)`;  // Saturation 70%, Lightness 50%
  };


  const [totalDeals, setTotalDeals] = useState(0);
  const [winDeals, setWinDeals] = useState(0);
  const [loseDeals, setLoseDeals] = useState(0);
  const [winPercentage, setWinPercentage] = useState(0);

  useEffect(() => {
    if (!user || !user.Bills) return;

    let total = 0;
    let win = 0;
    let lose = 0;

    user.Bills.forEach((bill: Bills) => {
      if (Array.isArray(bill.dealsData)) {
        total += bill.dealsData.length;
        win += bill.dealsData.filter((deal: any) => deal?.profit > 0).length;
        lose += bill.dealsData.filter((deal: any) => deal?.profit <= 0).length;
      }
    });

    setTotalDeals(total);
    setWinDeals(win);
    setLoseDeals(lose);
    setWinPercentage(total > 0 ? (win / total) * 100 : 0);
  }, [user]);





  const DeleteMt5 = async (mt5id: Number) => {
    try {
      const respone = await fetch("/api/DeleteMt5", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mt5_id: mt5id }),

      });
      if (respone.ok) {
        const data = await respone.json();
        setComfirmDelleteOpen(false);
        fetchAccounts();

        toast.success(
          <div className="flex flex-col gap-2">
            <p>Deleted MT5 Account {data.mt5.MT5_accountid}</p>
          </div>,
          { duration: 5000 }
        );
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  }

  const [isComfirmDelleteOpen, setComfirmDelleteOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      <Toaster position="top-center" />
      <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-200 p-6">
        <div className="h-full flex flex-col md:flex-row gap-5">
          {/* Left Column - Profile and Performance */}
          <div className="w-full md:w-2/3 flex flex-col gap-4">
            {/* Trader Profile Card */}
            {user && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 h-auto">
                {/* Header with gradient and profile info */}
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-white font-bold text-lg flex items-center">
                      <Sparkles className="w-5 h-5 mr-2" /> Trader Profile
                    </h2>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${isTradeEnabled
                      ? "bg-emerald-400 text-emerald-900"
                      : "bg-red-400 text-black"
                      }`}>
                      {isTradeEnabled ? "ACTIVE TRADER" : "ACCOUNT SUSPENDED"}
                    </div>
                  </div>

                  {/* User brief info */}
                  <div className="flex items-center">
                    <div className="flex-shrink-0 relative">
                      <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-lg font-bold">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'ภ'}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${isTradeEnabled ? "bg-green-500" : "bg-red-500"
                        }`}></div>
                    </div>
                    <div className="ml-3 text-white">
                      <h3 className="font-bold text-base">{user?.name || 'ภราดร จันทร์เจริญ'}</h3>
                      <p className="text-white/80 text-xs flex items-center">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-300 mr-1.5"></span>
                        {user?.email || 'paradorn657@gmail.com'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Account Info and Status */}
                <div className="p-4">
                  {/* Account details cards */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3 flex items-center shadow-sm">
                      <div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center text-blue-600 mr-2">
                        <BarChart2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">ACCOUNT ID</p>
                        <p className="text-sm font-bold text-gray-800"># {user?.id || "1"}</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 flex items-center shadow-sm">
                      <div className="w-8 h-8 rounded-md bg-purple-100 flex items-center justify-center text-purple-600 mr-2">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">ACCOUNT AGE</p>
                        <p className="text-sm font-bold text-gray-800">{calculateAccountAge(user?.create_at)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Trading Status */}
                  <div >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">Trading Status</span>
                      <span className={`text-sm font-bold ${isTradeEnabled ? "text-green-500" : "text-red-500"}`}>
                        {isTradeEnabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                    {/* <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: isTradeEnabled ? '100%' : '30%' }}
                      ></div>
                    </div> */}
                  </div>
                </div>
              </div>
            )}

            {/* Trading Performance Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 p-4">
              <h3 className="text-sm font-bold text-gray-700 mb-3">Trading Performance</h3>
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-blue-50 rounded-lg p-3 text-center shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex justify-center mb-2">
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                  </div>
                  <p className="text-xs text-gray-500">รวมดีล</p>
                  <p className="text-base font-bold text-blue-600">{totalDeals}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex justify-center mb-2">
                    <Award className="w-4 h-4 text-green-500" />
                  </div>
                  <p className="text-xs text-gray-500">ชนะ</p>
                  <p className="text-base font-bold text-green-600">{winDeals}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3 text-center shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex justify-center mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  </div>
                  <p className="text-xs text-gray-500">แพ้</p>
                  <p className="text-base font-bold text-red-600">{loseDeals}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex justify-center mb-2">
                    <Percent className="w-4 h-4 text-purple-500" />
                  </div>
                  <p className="text-xs text-gray-500">อัตราชนะ</p>
                  <p className="text-base font-bold text-purple-600">{winPercentage.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Doughnut Chart and Connected Accounts */}
          <div className="w-full md:w-1/3  flex flex-col gap-4">
            {/* Doughnut Chart Card */}
            <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col h-full items-center">
              <h3 className="text-sm font-bold text-gray-700 mb-3 self-start">Account Balance</h3>
              <div className="w-48 h-48 md:w-72 md:h-72">
                <Doughnut
                  key={chartText}
                  data={{
                    labels: accountNames,
                    datasets: [{
                      label: 'Balance',
                      data: balances,
                      backgroundColor: accountNames.map((_, index) => generateHSLColor(index)), // สร้างสีสุ่ม
                      borderWidth: 0,
                    }],
                  }}
                  options={options}
                  plugins={[centerTextPlugin]}
                />
              </div>
              <div className="mt-3 w-full">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Total Balance</span>
                  <span className="font-semibold text-gray-700">${balances.reduce((sum, val) => sum + val, 0).toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>

      {/* Bottom Section (40%) */}
      <div className="h-[50%] bg-white relative p-7">
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
                    Token will be generated for: <b>{session.user.email}</b>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button onClick={() => setComfirmDelleteOpen(true)} className="px-3 py-1 text-white rounded-lg text-xs hover:bg-red-200 transition-all">
                          <Trash2 className="text-red-900" />
                        </button>

                        {isComfirmDelleteOpen && (
                          <div className="fixed inset-0 flex items-center justify-center z-50">
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black opacity-50"></div>
                            {/* Modal Container */}
                            <div className="relative bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-sm z-10">
                              <h2 className="text-xl font-bold mb-4">ยืนยันการลบ</h2>
                              <p className="mb-6">คุณแน่ใจหรือไม่ที่จะลบบัญชี {account.MT5_accountid} นี้?</p>
                              <div className="flex justify-end space-x-4">
                                <button
                                  onClick={() => setComfirmDelleteOpen(false)}
                                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                                >
                                  ยกเลิก
                                </button>
                                <button
                                  onClick={() => DeleteMt5(account.MT5_id)}
                                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                >
                                  ลบ
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                      </td>
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
