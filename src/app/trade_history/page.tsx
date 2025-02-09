"use client";
import { useEffect, useState } from "react";

interface Order {
    ticket: number;
    symbol: string;
    volume: number;
    price: number;
    profit: number;
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

export default function TradeHistory() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [deals, setDeals] = useState<Deal[]>([]);

    useEffect(() => {
        const fetchTrades = async () => {
            try {
                const response = await fetch("/api/get-history");
                const data = await response.json();

                if (data.length > 0) {
                    setOrders(data[0].orders || []);
                    setDeals(data[0].deals || []);
                }
            } catch (error) {
                console.error("❌ Error fetching trade history:", error);
            }
        };

        fetchTrades();
        // ล้าง interval เมื่อ component ถูก unmount
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Trade History</h1>

            <h2 className="text-xl mt-4">Orders</h2>
            <table className="w-full border-collapse border border-gray-200 mt-2">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">Ticket</th>
                        <th className="border p-2">Symbol</th>
                        <th className="border p-2">Volume</th>
                        <th className="border p-2">Price</th>
                        <th className="border p-2">Profit</th>
                        <th className="border p-2">Time</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.ticket}>
                            <td className="border p-2">{order.ticket}</td>
                            <td className="border p-2">{order.symbol}</td>
                            <td className="border p-2">{order.volume}</td>
                            <td className="border p-2">{order.price.toFixed(2)}</td>
                            <td className="border p-2">{order.profit.toFixed(2)}</td>
                            <td className="border p-2">{new Date(order.time * 1000).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2 className="text-xl mt-6">Deals</h2>
            <table className="w-full border-collapse border border-gray-200 mt-2">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">Deal Ticket</th>
                        <th className="border p-2">Symbol</th>
                        <th className="border p-2">Volume</th>
                        <th className="border p-2">Price</th>
                        <th className="border p-2">Profit</th>
                        <th className="border p-2">Time</th>
                    </tr>
                </thead>
                <tbody>
                    {deals.map((deal) => (
                        <tr key={deal.dealTicket}>
                            <td className="border p-2">{deal.dealTicket}</td>
                            <td className="border p-2">{deal.symbol}</td>
                            <td className="border p-2">{deal.volume}</td>
                            <td className="border p-2">{deal.price.toFixed(2)}</td>
                            <td className="border p-2">{deal.profit.toFixed(2)}</td>
                            <td className="border p-2">{new Date(deal.time * 1000).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
