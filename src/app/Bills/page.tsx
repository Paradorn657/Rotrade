"use client";
import React, { useState, useEffect } from 'react';
import { getSession } from "next-auth/react";
import { toast, Toaster } from 'react-hot-toast';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";

import { FileText,  DollarSign, AlertCircle } from "lucide-react";

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
  Billing_startdate: string;
  Billing_enddate: string;
  status: string;
  Balance: number;
}

interface BillData {
  bill: Bill;
  deals: Deal[];
  totalProfit: string;
  serviceFee: string;
}

const BillingList = () => {
  const [billData, setBillData] = useState<BillData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedBill, setSelectedBill] = useState<BillData | null>(null);  // New state to manage selected bill for dialog
  const [dialogOpen, setDialogOpen] = useState(false);  // New state to control dialog visibility

  useEffect(() => {
    const fetchBillDetails = async () => {
      try {
        const session = await getSession();
        if (!session?.user?.id) {
          console.error("User not found in session");
          return;
        }

        const response = await fetch(`/api/get-bills?userId=${session.user.id}`);
        const data = await response.json();
        
        setBillData(
          Array.isArray(data)
            ? data.map(item => ({
                bill: {
                  Bill_id: item.Bill_id,
                  User_id: item.User_id,
                  Billing_startdate: item.Billing_startdate,
                  Billing_enddate: item.Billing_enddate,
                  status: item.status,
                  Balance: item.Balance
                },
                deals: item.deals || [],
                totalProfit: item.totalProfit,
                serviceFee: item.serviceFee
              }))
            : []
        );
      } catch (error) {
        console.error("Error fetching bill details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBillDetails();
  }, []);

  const handleViewDetails = (billItem: BillData) => {
    setSelectedBill(billItem); // Set the selected bill for the dialog
    setDialogOpen(true); // Open the dialog
  };

  const closeDialog = () => {
    setDialogOpen(false); // Close the dialog
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!billData || billData.length === 0) {
    return (
      <Card className="max-w-4xl mx-auto p-12 text-center">
        <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500 text-lg">ไม่พบบิล</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <Card className="max-w-4xl mx-auto p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Billing & Invoices</h1>
            <p className="text-sm text-gray-500 mt-1">จัดการและดูรายละเอียดบิลทั้งหมดของคุณ</p>
          </div>
          <div className="flex space-x-2 w-full sm:w-auto">
            <Button 
              variant="outline"
              className={`flex-1 sm:flex-none ${activeTab === 'open' ? 'bg-purple-50 text-purple-600 border-purple-200' : ''}`}
              onClick={() => setActiveTab('open')}
            >
              Open
            </Button>
            <Button 
              variant="outline"
              className={`flex-1 sm:flex-none ${activeTab === 'past' ? 'bg-purple-50 text-purple-600 border-purple-200' : ''}`}
              onClick={() => setActiveTab('past')}
            >
              Past
            </Button>
            <Button 
              variant="outline"
              className={`flex-1 sm:flex-none ${activeTab === 'all' ? 'bg-purple-50 text-purple-600 border-purple-200' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice ID</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shifts</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {billData.map((billItem) => (
                <tr key={billItem.bill.Bill_id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <span className="text-sm font-medium text-gray-900">#{billItem.bill.Bill_id}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-900">{new Date(billItem.bill.Billing_startdate).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-500">to {new Date(billItem.bill.Billing_enddate).toLocaleDateString()}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-900">{billItem.deals.length} shifts</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-medium text-gray-900">${billItem.serviceFee}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      billItem.bill.status === 'PAID' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {billItem.bill.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-gray-700 hover:text-purple-600 hover:border-purple-600"
                        onClick={() => handleViewDetails(billItem)}
                      >
                        View Details
                      </Button>
                      {billItem.bill.status !== 'PAID' && (
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          Pay Now
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Dialog for viewing bill details */}
      {selectedBill && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-[80vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-100 rounded-full p-2">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-lg font-medium text-gray-900">
                      รายละเอียดบิล #{selectedBill.bill.Bill_id}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(selectedBill.bill.Billing_startdate).toLocaleDateString()} - {new Date(selectedBill.bill.Billing_enddate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </DialogTitle>
              
            </DialogHeader>

            {/* Content */}
            <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center text-sm text-gray-600">
                <AlertCircle className="h-4 w-4 mr-2" />
                <p className="text-gray-500">จำนวนดีล </p>
                <p className="ml-1 font-medium text-gray-900">{selectedBill.deals.length} ดีล</p>
              </div>
              <div className="flex items-center text-sm text-green-600 font-medium">
                <DollarSign className="h-4 w-4 mr-2" />
                <p className="text-gray-500">กำไรรวม</p>
                <p className="ml-1 font-medium text-green-600">${selectedBill.totalProfit}</p>
              </div>
              <div className="flex items-center text-sm text-purple-600 font-medium">
              <DollarSign className="h-4 w-4 mr-2" />
                <p className="text-gray-500">ค่าบริการ</p>
                <p className="ml-1 font-medium text-purple-600">${selectedBill.serviceFee}</p>
              </div>
            </div>

            {/* Deals Table */}
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">รายการดีลที่ใช้คำนวณ</p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">ลำดับ</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Symbol</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Volume</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Price</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Profit</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedBill.deals.map((deal, index) => (
                      <tr key={deal.dealTicket} className="text-sm">
                        <td className="px-3 py-2 text-gray-900">{index + 1}</td>
                        <td className="px-3 py-2 font-medium text-gray-900">{deal.symbol}</td>
                        <td className="px-3 py-2 text-gray-900">{deal.volume}</td>
                        <td className="px-3 py-2 text-gray-900">${deal.price.toFixed(2)}</td>
                        <td className="px-3 py-2 text-green-600">${deal.profit.toFixed(2)}</td>
                        <td className="px-3 py-2 text-gray-500">{new Date(deal.time * 1000).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default BillingList;
