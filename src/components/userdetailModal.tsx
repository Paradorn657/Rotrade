import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link2, XCircle, Power, User, Calendar, DollarSign, Clock, Wallet, TrendingUp } from 'lucide-react';

interface MT5Account {
    id: string;
    login: string;
    hasModel: boolean;
    Model: string;
    balance: number;
    isSignalOn: boolean;
    type: string;
  }


  interface Bill {
    id: number;
    amount: number;
    date: string | "-";
    description: string;
    paidDate?: string | "-"; // optional ถ้ายังไม่จ่าย
  }

const UserDetailsModal = ({ isOpen, setIsOpen, user }) => {

    const [mt5Accounts, setMt5Accounts] = useState<MT5Account[]>([]);
    const [bills, setBills] = useState({ pending: [], paid: [] });

    const fetchdata = async ()=>{
        if (!user?.id) return; // ถ้ายังไม่มี user.id ให้ return ออกไปก่อน

        try {
            const response = await fetch(`/api/getdetailViewadmin?user_id=${user.id}`);
            const data = await response.json();

            console.log("data fecth",data)

            const userAccounts = data.userAccounts.map((account:any) => ({
                id: account.MT5_id.toString(),
                login: account.MT5_accountid,
                hasModel: account.model_id !== null,  // ถ้ามี model_id แสดงว่ามีโมเดล
                Model: account.model? account.model.name : "No Model",  // ใส่ค่าหากไม่มีโมเดล
                balance: account.balance || 0,  // ป้องกัน undefined
                isSignalOn: account.signal_status === "ON",
                type: "Standard"  // ใส่ค่า type ตามที่ต้องการ
            }));
            
            // อัปเดตค่า state
            setMt5Accounts(userAccounts || []);
            setBills(data.transformedBills || { pending: [], paid: [] });
           
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        

    }

    useEffect(() => {
        if (isOpen) {
            fetchdata();
        }
    },[user,isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-4xl bg-gradient-to-b from-blue-50 to-white max-h-[90vh] flex flex-col p-0">
                {/* Fixed Header */}
                <div className="p-6 bg-gradient-to-b from-blue-50 to-white sticky top-0 z-10 border-b">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <DialogTitle className="text-xl font-semibold text-gray-800">
                            {user.name} Profile
                        </DialogTitle>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto flex-1 p-6">
                    {/* MT5 Accounts Section */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <h3 className="text-base font-medium text-gray-600">Trading Accounts</h3>
                            <div className="h-px flex-1 bg-gray-200"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {mt5Accounts.map((account) => (
                                <div key={account.login}
                                    className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-gray-700">{account.login}</span>

                                            </div>
                                            <span className="text-xs text-gray-500">ID: {account.id}</span>
                                        </div>
                                        {account.hasModel ? (
                                            <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                                                {account.Model} Model Connected
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary" className="text-xs">
                                                No Model
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex items-center gap-2">
                                            <Wallet className="w-4 h-4 text-blue-500" />
                                            <div>
                                                <p className="text-xs text-gray-500">Balance</p>
                                                <p className="text-sm font-medium">${account.balance.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Power className={`w-4 h-4 ${account.isSignalOn ? 'text-green-500' : 'text-gray-400'}`} />
                                            <div>
                                                <p className="text-xs text-gray-500">Signal Status</p>
                                                <p className={`text-sm font-medium ${account.isSignalOn ? 'text-green-600' : 'text-gray-600'}`}>
                                                    {account.isSignalOn ? 'Active' : 'Inactive'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Billing Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <h3 className="text-base font-medium text-gray-600">Billing History</h3>
                            <div className="h-px flex-1 bg-gray-200"></div>
                        </div>
                        <Tabs defaultValue="pending" className="w-full">
                            <TabsList className="w-full grid grid-cols-2 gap-2 bg-gray-100/50 p-1 rounded-lg mb-4">
                                <TabsTrigger
                                    value="pending"
                                    className="data-[state=active]:bg-white data-[state=active]:text-gray-800 rounded-md"
                                >
                                    Pending
                                </TabsTrigger>
                                <TabsTrigger
                                    value="paid"
                                    className="data-[state=active]:bg-white data-[state=active]:text-gray-800 rounded-md"
                                >
                                    Paid
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="pending">
                                <div className="space-y-3">
                                    {bills.pending.map((bill:Bill) => (
                                        <div key={bill.id} className="bg-white rounded-lg p-4 border border-gray-100 hover:shadow-sm transition-all">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">{bill.description}</p>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <div className="flex items-center gap-1 text-gray-500">
                                                            <Calendar className="w-3 h-3" />
                                                            <span className="text-xs">Bill create at {bill.date}</span>
                                                        </div>
                                                        
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-semibold text-red-600">
                                                        ${bill.amount.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="paid">
                                <div className="space-y-3">
                                    {bills.paid.map((bill:Bill) => (
                                        <div key={bill.id} className="bg-white rounded-lg p-4 border border-gray-100 hover:shadow-sm transition-all">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">{bill.description}</p>
                                                    <div className="flex items-center gap-1 text-gray-500 mt-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {/* ต้องแก้ db ตรงนี้ให้เก็บวันที่จ่ายเงินด้วย */}
                                                        <span className="text-xs">This bill paid at {bill.paidDate}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-semibold text-emerald-600">
                                                        ${bill.amount.toLocaleString()}
                                                    </p>
                                                    <Badge className="text-xs bg-emerald-100 text-emerald-700 mt-1">
                                                        Paid
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UserDetailsModal;