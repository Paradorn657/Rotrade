"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BadgeDollarSign, Clock, TrendingUp } from "lucide-react";

interface Order {
    ticket: number;
    symbol: string;
    volume: number;
    priceOpen: number;
    priceCurrent: number;
    time: number;
}

interface Deal {
    dealTicket: number;
    symbol: string;
    volume: number;
    price: number;
    profit: number;
    time: number;
}

const TradeHistory = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [deals, setDeals] = useState<Deal[]>([]);
    const [totalProfit, setTotalProfit] = useState(0);

    useEffect(() => {
        const fetchTrades = async () => {
            try {
                const response = await fetch("/api/get-history");
                const data = await response.json();

                const allOrders = data.flatMap(item => item.orders || []);
                const allDeals = data.flatMap(item => item.deals || []);

                setOrders(allOrders);
                setDeals(allDeals);
                
                // คำนวณกำไรรวม
                const total = allDeals.reduce((sum, deal) => sum + (deal.profit || 0), 0);
                setTotalProfit(total);
            } catch (error) {
                console.error("❌ Error fetching trade history:", error);
            }
        };

        fetchTrades();
    }, []);

    const StatsCard = ({ title, value, icon: Icon }) => (
        <Card className="bg-white">
            <CardContent className="flex items-center p-6">
                <div className="rounded-full p-3 bg-blue-100">
                    <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                </div>
            </CardContent>
        </Card>
    );

    const TradeTable = ({ data, type }) => (
        <div className="rounded-lg border bg-white">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-gray-50">
                            <th className="p-4 text-left text-sm font-medium text-gray-500">
                                {type === 'orders' ? 'Ticket' : 'Deal Ticket'}
                            </th>
                            <th className="p-4 text-left text-sm font-medium text-gray-500">Symbol</th>
                            <th className="p-4 text-left text-sm font-medium text-gray-500">Volume</th>
                            {type === 'orders' ?(<th className="p-4 text-left text-sm font-medium text-gray-500">Price Open</th>):(<th className="p-4 text-left text-sm font-medium text-gray-500">Price</th>)}
                            
                            {type === 'orders' ?(<th className="p-4 text-left text-sm font-medium text-gray-500">Price Current</th>):(<th className="p-4 text-left text-sm font-medium text-gray-500">Profit</th>)}
                            <th className="p-4 text-left text-sm font-medium text-gray-500">Time</th>
                        </tr>
                    </thead>

                    
                    <tbody>
                        
                        {data.map((item) => (
                            <tr 
                                key={type === 'orders' ? item.ticket : item.dealTicket}
                                className="border-b hover:bg-gray-50"
                            >
                                <td className="p-4 text-sm">
                                    {type === 'orders' ? item.ticket : item.dealTicket}
                                </td>
                                <td className="p-4 text-sm font-medium">{item.symbol}</td>
                                <td className="p-4 text-sm">{item.volume}</td>

                                {/* ถ้า item ไม่มี price แสดงว่ามันคือ active order ที่มี่ open กับ current */}
                                <td className="p-4 text-sm">{item.price?.toFixed(2) || item.priceOpen.toFixed(2)}</td>  
                                <td className={`p-4 text-sm font-medium ${
                                    item.profit > 0 ? 'text-green-600' : 
                                    item.profit < 0 ? 'text-red-600' : ''
                                }`}>
                                    {item.profit?.toFixed(2) || item.priceCurrent.toFixed(2)}
                                </td>
                                <td className="p-4 text-sm text-gray-500">
                                    {item.time ? new Date(item.time * 1000).toLocaleString() : 'N/A'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Trade History</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard 
                    title="Total Trades" 
                    value={deals.length} 
                    icon={TrendingUp}
                />
                <StatsCard 
                    title="Active Orders" 
                    value={orders.length} 
                    icon={Clock}
                />
                <StatsCard 
                    title="Total Profit" 
                    value={`$${totalProfit.toFixed(2)}`} 
                    icon={BadgeDollarSign}
                />
            </div>

            <Tabs defaultValue="orders" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="orders">Active Orders</TabsTrigger>
                    <TabsTrigger value="deals">Completed Trades</TabsTrigger>
                    
                </TabsList>
                
                <TabsContent value="deals">
                    <TradeTable data={deals} type="deals" />
                </TabsContent>
                
                <TabsContent value="orders">
                    <TradeTable data={orders} type="orders" />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default TradeHistory;