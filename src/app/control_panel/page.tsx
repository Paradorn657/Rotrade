'use client'
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import { ToggleSwitch, Table } from "flowbite-react";
import { Card, Progress } from "flowbite-react";
import { useSession } from "next-auth/react";

const overallStats = {
    totalTodayPnl: "$100",
    totalCumulativePnl: "$100",
    totalUnrealizedPnl: "$100",
};

export default function ControlPanel() {
    const [robotStatus, setRobotStatus] = useState();
    const { data: session, status } = useSession();

    console.log(session?.user.id)
    const fetchRobots = () => {
        if (session?.user?.id) {
            // ทำการร้องขอ API ถ้า session มี user.id
            fetch(`/api/getcontrolbot?user_id=${session.user.id}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log("Fetched robots from DB:", data);
                    setRobotStatus(data.map((account: { MT5_id: any; MT5_name: any; MT5_accountid: any; status: string;balance:number ;signal_status: string ;model:any;name:string}) => ({
                        id: account.MT5_id,
                        name: account.model.name,
                        mt5Id: account.MT5_accountid,
                        balance:account.balance,
                        todayPnl: "$0", // ใส่ข้อมูล PnL จริงจากฐานข้อมูลหรือ API
                        cumulativePnl: "$0",
                        unrealizedPnl: "$0",
                        status: account.status === "Connected",
                        signalStatus: account.signal_status,
                    })));
                })
                .catch((error) => {
                    console.error("Error fetching MT5 accounts:", error);
                });
        } else {
            console.log("User ID is undefined or session is not available.");
        }
    }

    useEffect(() => {
        fetchRobots();
    }, [session]);

    const toggleSignalStatus = async (id: number, currentStatus: string) => {
        try {
            // สลับค่า ON/OFF
            const newStatus = currentStatus === "ON" ? "OFF" : "ON";
    
            // อัปเดต UI ทันที
            setRobotStatus((prev) =>
                prev.map((robot) =>
                    robot.id === id ? { ...robot, signal_status: newStatus } : robot
                )
            );
    
            // ส่งคำขอไปยัง API เพื่อบันทึกลงฐานข้อมูล
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

            console.log("Signal status updated successfully");
        } catch (error) {
            console.error("Error updating signal_status:", error);
            // หากเกิดข้อผิดพลาด ให้ย้อนค่ากลับ
            setRobotStatus((prev) =>
                prev.map((robot) =>
                    robot.id === id ? { ...robot, signal_status: currentStatus } : robot
                )
            );
        }
    };

    return (
        <div className="p-9 bg-gradient-to-r from-gray-100 to-gray-200 min-h-screen flex flex-col items-center">

            <div className="w-full max-w-7xl flex justify-start"> {/* Wrap h1 in a div */}
                <h1 className="mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-xl dark:text-white">
                    Control & Monitor your Robot
                </h1>
            </div>

            <div className="w-full max-w-7xl mb-8 mt-10">
                <div className="bg-white rounded-lg shadow-lg p-6 flex justify-around">
                    <div className="text-center">
                        <p className="text-lg font-semibold text-gray-600">Total Today PnL</p>
                        <h2 className="text-2xl font-bold text-gray-800">{overallStats.totalTodayPnl}</h2>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-semibold text-gray-600">Total Cumulative PnL</p>
                        <h2 className="text-2xl font-bold text-gray-800">{overallStats.totalCumulativePnl}</h2>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-semibold text-gray-600">Total Unrealized PnL</p>
                        <h2 className="text-2xl font-bold text-gray-800">{overallStats.totalUnrealizedPnl}</h2>
                    </div>
                </div>
            </div>

            {/* Control Bots Table */}
            <div className="w-full max-w-7xl">
                <Card className="bg-white rounded-lg shadow-lg p-6">
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>Bot Name</Table.HeadCell>
                            <Table.HeadCell>MT5 ID</Table.HeadCell>
                            <Table.HeadCell>Balance</Table.HeadCell>
                            <Table.HeadCell>Today PnL</Table.HeadCell>
                            <Table.HeadCell>Cumulative PnL</Table.HeadCell>
                            <Table.HeadCell>Unrealized PnL</Table.HeadCell>
                            <Table.HeadCell>Status</Table.HeadCell>
                            <Table.HeadCell>Actions</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y">
                            {robotStatus?.map((robot) => (
                                <motion.tr
                                    key={robot.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600"
                                >
                                    <Table.Cell>{robot.name}</Table.Cell>
                                    <Table.Cell>{robot.mt5Id}</Table.Cell>
                                    <Table.Cell>{robot.balance}</Table.Cell>
                                    <Table.Cell>{robot.todayPnl}</Table.Cell>
                                    <Table.Cell>{robot.cumulativePnl}</Table.Cell>
                                    <Table.Cell>{robot.unrealizedPnl}</Table.Cell>
                                    <Table.Cell className="flex items-center gap-2">
                                        {robot.status ? (
                                            <CheckCircle className="text-green-500" size={16} />
                                        ) : (
                                            <XCircle className="text-red-500" size={16} />
                                        )}
                                        <span>{robot.status ? "Running" : "Stopped"}</span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <ToggleSwitch
                                            checked={robot.signalStatus === "ON"}
                                            onChange={() => toggleSignalStatus(robot.id,robot.signalStatus)}
                                            color="blue"
                                        />
                                    </Table.Cell>
                                </motion.tr>
                            ))}
                        </Table.Body>

                    </Table>
                </Card>
            </div>
        </div>
    );
}