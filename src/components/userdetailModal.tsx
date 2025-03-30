import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogTitle
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    AlertCircle,
    BarChart4,
    Calendar,
    CheckCircle,
    CreditCard,
    DollarSign,
    Power,
    Shield,
    User,
    Wallet
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

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

interface UserDetailsModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    user: {
        id: string;
        name: string;
        email: string;
    };
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ isOpen, setIsOpen, user }) => {
    const [mt5Accounts, setMt5Accounts] = useState<MT5Account[]>([]);
    const [bills, setBills] = useState({ pending: [], paid: [] });
    const [loading, setLoading] = useState(true);

    const fetchdata = async () => {
        if (!user?.id) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/getdetailViewadmin?user_id=${user.id}`);
            const data = await response.json();

            const userAccounts = data.userAccounts.map((account: any) => ({
                id: account.MT5_id.toString(),
                login: account.MT5_accountid,
                hasModel: account.model_id !== null,
                Model: account.model ? account.model.name : "No Model",
                balance: account.balance || 0,
                isSignalOn: account.signal_status === "ON",
                type: account.account_type || "Standard"
            }));

            setMt5Accounts(userAccounts || []);
            setBills(data.transformedBills || { pending: [], paid: [] });
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchdata();
        }
    }, [user, isOpen]);

    const getAccountStatusColor = (account: any) => {
        if (account.hasModel && account.isSignalOn) return "bg-gradient-to-r from-green-50 to-emerald-50 border-emerald-100";
        if (account.hasModel) return "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100";
        return "bg-white border-gray-100";
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen} >
            <DialogContent className="max-w-4xl bg-white max-h-[90vh] flex flex-col p-0 rounded-xl shadow-xl">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-t-xl">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                            <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-white">
                                {user.name || "User Profile"}
                            </DialogTitle>
                            <p className="text-blue-100 text-sm mt-1">
                                {user.email || ""}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Summary Bar */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-blue-100 grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100/70 p-2 rounded-lg">
                            <BarChart4 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-blue-800 uppercase">Total Accounts</p>
                            <p className="text-lg font-bold text-blue-900">{mt5Accounts.length}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-100/70 p-2 rounded-lg">
                            <Wallet className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-indigo-800 uppercase">Total Balance</p>
                            <p className="text-lg font-bold text-indigo-900">
                                ${mt5Accounts.reduce((sum, acc) => sum + acc.balance, 0).toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-100/70 p-2 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-purple-800 uppercase">Pending Bills</p>
                            <p className="text-lg font-bold text-purple-900">{bills.pending.length}</p>
                        </div>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto flex-1 p-6">
                    {/* MT5 Accounts Section */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-5">
                            <Shield className="w-5 h-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-800">Trading Accounts</h3>
                            <div className="h-px flex-1 bg-gray-200"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {mt5Accounts.map((account) => (
                                <div
                                    key={account.login}
                                    className={`rounded-xl p-5 border shadow-sm hover:shadow-md transition-all duration-200 ${getAccountStatusColor(account)}`}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-base font-semibold text-gray-800">{account.login}</span>
                                                {account.isSignalOn && (
                                                    <span className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                                        <Power className="w-3 h-3 mr-1" />
                                                        LIVE
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center text-xs text-gray-500">
                                                <span className="mr-2">ID: {account.id}</span>
                                                <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">{account.type}</span>
                                            </div>
                                        </div>
                                        {account.hasModel ? (
                                            <Badge className="bg-emerald-100 text-emerald-700 font-medium px-3 py-1">
                                                {account.Model}
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary" className="font-medium px-3 py-1">
                                                No Model
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                        <div className="bg-white/80 rounded-lg p-3 flex items-center gap-3 border border-gray-100">
                                            <div className={`p-2 rounded-full ${account.balance > 0 ? 'bg-green-100' : 'bg-gray-100'}`}>
                                                <DollarSign className={`w-4 h-4 ${account.balance > 0 ? 'text-green-600' : 'text-gray-500'}`} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Balance</p>
                                                <p className={`text-sm font-bold ${account.balance > 0 ? 'text-green-700' : 'text-gray-700'}`}>
                                                    ${account.balance.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-white/80 rounded-lg p-3 flex items-center gap-3 border border-gray-100">
                                            <div className={`p-2 rounded-full ${account.isSignalOn ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                                <Power className={`w-4 h-4 ${account.isSignalOn ? 'text-blue-600' : 'text-gray-500'}`} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Signal Status</p>
                                                <p className={`text-sm font-bold ${account.isSignalOn ? 'text-blue-700' : 'text-gray-600'}`}>
                                                    {account.isSignalOn ? 'Active' : 'Inactive'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {mt5Accounts.length === 0 && !loading && (
                                <div className="col-span-2 bg-gray-50 rounded-xl p-6 text-center">
                                    <p className="text-gray-500">No trading accounts found for this user.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Billing Section */}
                    <div>
                        <div className="flex items-center gap-3 mb-5">
                            <CreditCard className="w-5 h-5 text-purple-600" />
                            <h3 className="text-lg font-semibold text-gray-800">Billing History</h3>
                            <div className="h-px flex-1 bg-gray-200"></div>
                        </div>

                        <Tabs defaultValue="pending" className="w-full">
                            <TabsList className="w-full grid grid-cols-2 gap-2 bg-gray-100/50 p-1 rounded-lg mb-4">
                                <TabsTrigger
                                    value="pending"
                                    className="data-[state=active]:bg-rose-50 data-[state=active]:text-rose-700 data-[state=active]:shadow-sm rounded-md py-2"
                                >
                                    <AlertCircle className="w-4 h-4 mr-2" />
                                    Pending ({bills.pending.length})
                                </TabsTrigger>
                                <TabsTrigger
                                    value="paid"
                                    className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm rounded-md py-2"
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Paid ({bills.paid.length})
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="pending">
                                <div className="space-y-3">
                                    {bills.pending.map((bill: Bill) => (
                                        <div key={bill.id} className="bg-white rounded-lg p-4 border border-gray-100 hover:shadow-sm transition-all">
                                            <div className="flex justify-between items-center">
                                                <div className="flex-1">
                                                    <div className="flex items-start">
                                                        <div className="bg-rose-50 p-2 rounded-lg mr-3">
                                                            <AlertCircle className="w-4 h-4 text-rose-500" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-800">{bill.description}</p>
                                                            <div className="flex items-center gap-3 mt-1">
                                                                <div className="flex items-center gap-1 text-gray-500">
                                                                    <Calendar className="w-3 h-3" />
                                                                    <span className="text-xs">เริ่มเมื่อวันที่ {bill.date} น.</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right flex flex-col items-end">
                                                    <p className="text-sm font-bold text-rose-600">
                                                        ${bill.amount.toLocaleString()}
                                                    </p>
                                                    <Badge className="mt-1 bg-rose-50 text-rose-600 border border-rose-100">
                                                        Payment Due
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {bills.pending.length === 0 && (
                                        <div className="bg-gray-50 rounded-xl p-6 text-center">
                                            <p className="text-gray-500">No pending bills found.</p>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="paid">
                                <div className="space-y-3">
                                    {bills.paid.map((bill: Bill) => (
                                        <div key={bill.id} className="bg-white rounded-lg p-4 border border-gray-100 hover:shadow-sm transition-all">
                                            <div className="flex justify-between items-center">
                                                <div className="flex-1">
                                                    <div className="flex items-start">
                                                        <div className="bg-emerald-50 p-2 rounded-lg mr-3">
                                                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-800">{bill.description}</p>
                                                            <div className="flex items-center gap-1 text-gray-500 mt-1">
                                                                <Calendar className="w-3 h-3" />
                                                                <span className="text-xs">Paid on {bill.paidDate ? new Date(bill.paidDate).toLocaleString('th-TH', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                    second: '2-digit',
                                                                    hour12: false
                                                                }) : "N/A"}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right flex flex-col items-end">
                                                    <p className="text-sm font-bold text-emerald-600">
                                                        ${bill.amount.toLocaleString()}
                                                    </p>
                                                    <Badge className="mt-1 bg-emerald-50 text-emerald-600 border border-emerald-100">
                                                        Paid
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {bills.paid.length === 0 && (
                                        <div className="bg-gray-50 rounded-xl p-6 text-center">
                                            <p className="text-gray-500">No payment history found.</p>
                                        </div>
                                    )}
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