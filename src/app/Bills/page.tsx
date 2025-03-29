"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';

import SimpleSpinner from '@/components/Loadingspinner';
import LoginRedirect from '@/components/loginredirect';
import { CheckoutPage } from '@/components/Payment';
import { Badge } from "@/components/ui/badge";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Calendar, ClipboardList, DollarSign, FileText, Loader2 } from "lucide-react";

interface Deal {
  dealTicket: number;
  symbol: string;
  volume: number;
  price: number;
  profit: number;
  time: number;
}

interface Bill {
  Bill_id: number;
  User_id: number;
  MT5_accountid: string;
  Billing_startdate: string;
  Billing_enddate: string;
  Paid_at: Date;
  status: string;
  Balance: number;
  Deals_count: number;
  bill_show: boolean | null;
}

interface BillData {
  bill: Bill;
  deals: Deal[];
  totalProfit: number;
  serviceFee: number;
}

const formatCurrency = (amount: string | number) => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return num.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  });
};
if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("cant find stripe public key");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const BillingList = () => {
  const [billData, setBillData] = useState<BillData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('open');
  const [selectedBill, setSelectedBill] = useState<BillData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const { status, data: session } = useSession();
  console.log("session Bills=", session);


  useEffect(() => {
    const fetchBillDetails = async () => {
      try {
        const session = await getSession();
        if (!session?.user?.id) {
          return;
        }

        const response = await fetch(`/api/get-bills?userId=${session.user.id}`);
        const data = await response.json();

        console.log("billdata", data);

        setBillData(
          Array.isArray(data)
            ? data.map(item => ({
              bill: {
                Bill_id: item.bill.Bill_id,
                User_id: item.bill.User_id,
                MT5_accountid: item.bill.MT5_accountid,
                Billing_startdate: item.bill.Billing_startdate,
                Billing_enddate: item.bill.Billing_enddate,
                Paid_at: item.bill.Paid_at,
                status: item.bill.status,
                Balance: item.bill.Balance,
                Deals_count: item.bill.Deals_count,
                bill_show: item.bill.bill_show,
              },
              deals: item.deals || [],
              totalProfit: item.totalProfit,
              serviceFee: item.serviceFee,
            }))
            : []
        );
      } catch (error) {
        console.error("Error fetching bill details:", error);
        toast.error("ไม่สามารถโหลดข้อมูลบิลได้ กรุณาลองใหม่อีกครั้ง");
      } finally {
        setLoading(false);
      }
    };

    fetchBillDetails();
  }, []);

  const handleViewDetails = (billItem: BillData) => {
    setSelectedBill(billItem);
    setDialogOpen(true);
  };

  const filteredBills = billData
    ? billData.filter(bill => {
      if (activeTab === 'all') return true;
      if (activeTab === 'open') return bill.bill.status !== 'Paid' && bill.bill.bill_show !== false;
      if (activeTab === 'past') return bill.bill.status === 'Paid' && bill.bill.bill_show !== false;
      if (activeTab === 'no-payment') return bill.bill.bill_show === false;
      return true;
    })
    : [];

  if (status === "loading") {
    return <SimpleSpinner />;
  }


  if (!session) {
    return (<LoginRedirect />)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <p className="text-gray-500 text-sm">กำลังโหลดข้อมูลบิล...</p>
      </div>
    );
  }

  if (!billData || billData.length === 0) {
    return (
      <Card className="max-w-4xl mx-auto p-12 text-center">
        <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-600 text-xl font-semibold">ไม่พบบิล</p>
        <p className="text-gray-500 text-sm mt-2">ยังไม่มีรายการบิลของคุณในระบบ</p>
      </Card>
    );
  }
  const handleTablePayment = (Bill: BillData) => {
    setSelectedBill(Bill);
    setPaymentModalOpen(true);
  };

  const handlePayment = (Bill: BillData) => {
    setSelectedBill(Bill);
    if (dialogOpen) {
      setDialogOpen(false);
    } else {
      setDialogOpen(true);
    }
    // เปิด Payment Modal
    setPaymentModalOpen(true);
  };




  return (
    <div className=" max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Toaster position="top-right" />

      <div className="flex flex-col space-y-3 mt-9">
        <h1 className="text-3xl font-bold text-gray-900">Billing & Invoices</h1>
        <p className="text-gray-500">จัดการและดูรายละเอียดบิลทั้งหมดของคุณได้ที่นี่</p>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center text-purple-600 gap-2 mb-2 sm:mb-0">
              <FileText className="h-5 w-5" />
              <CardTitle className="text-xl">รายการบิล</CardTitle>
            </div>
            <div className="flex space-x-2 w-full sm:w-auto bg-gray-50 p-1 rounded-lg">
              <Button
                variant="ghost"
                className={`flex-1 sm:flex-none text-sm h-9 ${activeTab === 'open' ? 'bg-white shadow text-purple-700 font-medium' : 'text-gray-600'}`}
                onClick={() => setActiveTab('open')}
              >
                รอชำระ
              </Button>
              <Button
                variant="ghost"
                className={`flex-1 sm:flex-none text-sm h-9 ${activeTab === 'past' ? 'bg-white shadow text-purple-700 font-medium' : 'text-gray-600'}`}
                onClick={() => setActiveTab('past')}
              >
                ชำระแล้ว
              </Button>
              <Button
                variant="ghost"
                className={`flex-1 sm:flex-none text-sm h-9 ${activeTab === 'no-payment' ? 'bg-white shadow text-purple-700 font-medium' : 'text-gray-600'}`}
                onClick={() => setActiveTab('no-payment')}
              >
                บิลที่ไม่ต้องจ่าย
              </Button>
              <Button
                variant="ghost"
                className={`flex-1 sm:flex-none text-sm h-9 ${activeTab === 'all' ? 'bg-white shadow text-purple-700 font-medium' : 'text-gray-600'}`}
                onClick={() => setActiveTab('all')}
              >
                ทั้งหมด
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="overflow-x-auto rounded-lg border border-gray-100 shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MT5 Account</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ระยะเวลา</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จำนวนดีล</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ยอดชำระ</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredBills.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center space-y-2">
                        <ClipboardList className="h-8 w-8 text-gray-300" />
                        <p>ไม่พบรายการในหมวดหมู่นี้</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredBills.map((billItem) => (
                    <tr key={billItem.bill.Bill_id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <span className="font-mono text-sm font-medium text-gray-700">#INV-{billItem.bill.Bill_id}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-mono text-sm font-medium text-gray-700">{billItem.bill.MT5_accountid}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm text-gray-700 font-medium">
                              {new Date(billItem.bill.Billing_startdate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                            </div>
                            <div className="text-xs text-gray-500">
                              ถึง {new Date(billItem.bill.Billing_enddate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center text-sm text-gray-700">
                          <ClipboardList className="h-4 w-4 text-gray-400 mr-2" />
                          {billItem.deals.length} รายการ
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(billItem.serviceFee)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {billItem.bill.bill_show === false ? (
                          <Badge className="bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 font-medium">
                            ไม่ต้องชำระ
                          </Badge>
                        ) : (
                          <Badge
                            className={`font-medium ${billItem.bill.status === 'Paid'
                              ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                              : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                              }`}
                          >
                            {billItem.bill.status === 'Paid' ? 'ชำระแล้ว' : 'รอชำระเงิน'}
                          </Badge>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-gray-700 hover:text-purple-600 hover:border-purple-300 transition-colors"
                            onClick={() => handleViewDetails(billItem)}
                          >
                            ดูรายละเอียด
                          </Button>
                          {billItem.bill.status !== 'Paid' && billItem.bill.bill_show !== false && (
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                              onClick={() => handleTablePayment(billItem)}
                            >
                              <DollarSign className="h-4 w-4 mr-1" />
                              ชำระเงิน
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog for viewing bill details */}
      {selectedBill && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-[90vw] md:max-w-[80vw] max-h-[90vh] overflow-y-auto rounded-lg">
            <DialogHeader className="border-b pb-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-50 rounded-full p-2">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-3">
                  <DialogTitle className="text-xl font-semibold text-gray-900">
                    รายละเอียดบิล #{selectedBill.bill.Bill_id} (MT5 ID {selectedBill.bill.MT5_accountid})
                  </DialogTitle>


                  <DialogDescription className="text-sm text-gray-500 mt-1">
                    ช่วงเวลา: {new Date(selectedBill.bill.Billing_startdate).toLocaleString('th-TH', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hourCycle: 'h23', // ใช้ระบบ 24 ชั่วโมง
                    })}
                    <span> ถึง </span>
                    {new Date(selectedBill.bill.Billing_enddate).toLocaleString('th-TH', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hourCycle: 'h23',
                    })}
                  </DialogDescription>


                </div>

                {selectedBill.bill.bill_show === false ? (
                  <Badge className="ml-auto bg-gray-50 text-gray-700 border-gray-200 font-medium">
                    ไม่ต้องชำระ
                  </Badge>
                ) : (
                  <Badge
                    className={`ml-auto ${selectedBill.bill.status === 'Paid'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                  >
                    {selectedBill.bill.status === 'Paid'
                      ? `ชำระแล้ว ณ วันที่ ${new Date(selectedBill.bill.Paid_at).toLocaleString('th-TH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false
                      })}`
                      : 'รอชำระเงิน'}
                  </Badge>
                )}
              </div>
            </DialogHeader>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 mt-4">
              <Card className="bg-gray-50 border-none shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <ClipboardList className="h-8 w-8 text-purple-500" />
                    <div className="ml-3">
                      <p className="text-sm text-gray-500">จำนวนดีล</p>
                      <p className="text-xl font-semibold text-gray-900">{selectedBill.deals.length} รายการ</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-none shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-green-500" />
                    <div className="ml-3">
                      <p className="text-sm text-gray-500">กำไรรวม</p>
                      <p className="text-xl font-semibold text-green-700">{formatCurrency(selectedBill.totalProfit)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-purple-50 border-none shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-purple-500" />
                    <div className="ml-3">
                      <p className="text-sm text-gray-500">ค่าบริการ</p>
                      <p className="text-xl font-semibold text-purple-700">{formatCurrency(selectedBill.serviceFee)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Deals Table */}
            <div className="mt-4 bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <p className="font-medium text-gray-700 text-base tracking-normal antialiased">รายละเอียดดีลที่ใช้คำนวณ</p>
              </div>
              <div className="overflow-x-auto max-h-[400px]">
                <table className="w-full">
                  <thead className="sticky bg-gray-50 bg-opacity-100 top-0 backdrop-filter backdrop-blur">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide antialiased">Deal Ticket</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide antialiased">Symbol</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide antialiased">Volume</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide antialiased">Price</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide antialiased">Profit</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide antialiased">เวลา</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {selectedBill.deals.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                          ไม่พบรายการดีลในบิลนี้
                        </td>
                      </tr>
                    ) : (
                      selectedBill.deals.map((deal) => (
                        <tr key={deal.dealTicket} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-500">{deal.dealTicket}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{deal.symbol}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{deal.volume.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{formatCurrency(deal.price)}</td>
                          <td className="px-4 py-3 text-sm font-medium text-green-600">{formatCurrency(deal.profit)}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {new Date((deal.time * 1000) - (2 * 60 * 60 * 1000)).toLocaleString('th-TH', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              timeZoneName: 'short'
                            })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <DialogFooter className="flex justify-end space-x-2 pt-4 mt-4 border-t">
              <DialogClose asChild>
                <Button variant="outline">ปิด</Button>
              </DialogClose>
              {selectedBill.bill.status !== 'Paid' && selectedBill.bill.bill_show !== false && (
                <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => handlePayment(selectedBill)}>
                  <DollarSign className="h-4 w-4 mr-2" />
                  ชำระเงิน
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {paymentModalOpen && selectedBill && (
        <div className="fixed overflow-hidden inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity h-full" >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full  mx-4 transform transition-all duration-300 ease-in-out">
            <div className="relative">
              {/* Header */}
              <div className="px-6 py-4 border-b dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  ชำระค่าบริการ
                </h3>
                <button
                  onClick={() => setPaymentModalOpen(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                  aria-label="ปิด"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {/* ส่วนสรุปรายการ */}
              <div className="px-6 pt-4 pb-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">หมายเลขบิล</span>
                  <span className="text-sm font-medium">INV-{selectedBill.bill.Bill_id || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">ยอดชำระ</span>
                  <span className="text-base font-bold text-gray-900 dark:text-gray-100">
                    ${selectedBill.bill.Balance.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Stripe Elements */}
              <div className="px-6 py-4">
                <Elements
                  stripe={stripePromise}
                  options={{
                    mode: "payment",
                    amount: Math.round(selectedBill.bill.Balance * 100),
                    currency: "usd",
                  }}
                >
                  <CheckoutPage amount={Math.round(selectedBill.bill.Balance * 100)} usersession={session!} selectedbill={selectedBill} />
                </Elements>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t dark:border-gray-700">
                <button
                  onClick={() => setPaymentModalOpen(false)}
                  className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingList;