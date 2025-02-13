"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { CheckCircle, XCircle, TrendingUp, Wallet, LineChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";

const overallStats = {
    totalTodayPnl: "$100",
    totalCumulativePnl: "$100",
    totalUnrealizedPnl: "$100",
};

export default function ControlPanel() {
    const [robotStatus, setRobotStatus] = useState();
    const { data: session } = useSession();

    const fetchRobots = () => {
        if (session?.user?.id) {
            fetch(`/api/getcontrolbot?user_id=${session.user.id}`)
                .then((response) => response.json())
                .then((data) => {
                    setRobotStatus(data.map((account) => ({
                        id: account.MT5_id,
                        name: account.model.name,
                        mt5Id: account.MT5_accountid,
                        balance: account.balance,
                        todayPnl: "$0",
                        cumulativePnl: "$0",
                        unrealizedPnl: "$0",
                        status: account.status === "Connected",
                        signalStatus: account.signal_status,
                    })));
                })
                .catch((error) => {
                    console.error("Error fetching MT5 accounts:", error);
                });
        }
    };

    useEffect(() => {
        fetchRobots();
    }, [session]);

    const toggleSignalStatus = async (id:any, currentStatus:any) => {
        try {
            const newStatus = currentStatus === "ON" ? "OFF" : "ON";
            setRobotStatus((prev:any) =>
                prev.map((robot:any) =>
                    robot.id === id ? { ...robot, signalStatus: newStatus } : robot
                )
            );

            const response = await fetch("/api/updateRobotsignalstatus", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: id,
                    signal_status: newStatus,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update signal_status in DB");
            }

            fetchRobots();
        } catch (error) {
            console.error("Error updating signal_status:", error);
            setRobotStatus((prev) =>
                prev.map((robot) =>
                    robot.id === id ? { ...robot, signalStatus: currentStatus } : robot
                )
            );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Control & Monitor Panel
                    </h1>
                    
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-none shadow-md">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                Total Today PnL
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-800">
                                {overallStats.totalTodayPnl}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-none shadow-md">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                <LineChart className="w-4 h-4" />
                                Total Cumulative PnL
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-800">
                                {overallStats.totalCumulativePnl}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-none shadow-md">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                <Wallet className="w-4 h-4" />
                                Total Unrealized PnL
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-800">
                                {overallStats.totalUnrealizedPnl}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-none shadow-lg">
                    <CardHeader>
                        <CardTitle>Active Bots</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead>Bot Name</TableHead>
                                    <TableHead>MT5 ID</TableHead>
                                    <TableHead>Balance</TableHead>
                                    <TableHead>Today PnL</TableHead>
                                    <TableHead>Cumulative PnL</TableHead>
                                    <TableHead>Unrealized PnL</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {robotStatus && robotStatus.length > 0 ? (
                                    robotStatus.map((robot) => (
                                        <TableRow key={robot.id} className="hover:bg-gray-50/50 transition-colors">
                                            <TableCell className="font-medium">{robot.name}</TableCell>
                                            <TableCell>{robot.mt5Id}</TableCell>
                                            <TableCell>{robot.balance}</TableCell>
                                            <TableCell>{robot.todayPnl}</TableCell>
                                            <TableCell>{robot.cumulativePnl}</TableCell>
                                            <TableCell>{robot.unrealizedPnl}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {robot.signalStatus === "ON" ? (
                                                        <div className="flex items-center gap-1.5 text-green-600">
                                                            <CheckCircle className="w-4 h-4" />
                                                            <span className="text-sm font-medium">Running</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1.5 text-red-600">
                                                            <XCircle className="w-4 h-4" />
                                                            <span className="text-sm font-medium">Stopped</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Switch
                                                    checked={robot.signalStatus === "ON"}
                                                    onCheckedChange={() => toggleSignalStatus(robot.id, robot.signalStatus)}
                                                    className="data-[state=checked]:bg-blue-600"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-24 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-500">
                                                <div className="mb-2">No bots found</div>
                                                <div className="text-sm">
                                                    Get started by adding a new bot from the robot selection page
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}