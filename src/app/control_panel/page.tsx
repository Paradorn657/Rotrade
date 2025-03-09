"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { 
  CheckCircle, 
  XCircle, 
  Bot, 
  RotateCw,
  AlertTriangle,
  Search,
  PlusCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LoginRedirect from "@/components/loginredirect";

import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { version } from "os";

export default function ControlPanel() {
    const router = useRouter();  
  const [robotStatus, setRobotStatus] = useState<{
    version: string; 
    id: string; 
    name: string; 
    mt5Id: string; 
    balance: number; 
    mt5name: string; 
    status: string; 
    signalStatus: string; 
  }[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { status, data: session } = useSession();

  const fetchRobots = () => {
    if (session?.user?.id) {
      setIsLoading(true);
      fetch(`/api/getcontrolbot?user_id=${session.user.id}`)
        .then((response) => response.json())
        .then((data) => {
          setRobotStatus(data.map((account) => ({
            id: account.MT5_id,
            name: account.model.name,
            version: account.model.version,
            mt5Id: account.MT5_accountid,
            balance: account.balance,
            mt5name: account.MT5_name,
            status: account.status,
            signalStatus: account.signal_status,
          })));
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching MT5 accounts:", error);
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchRobots();
  }, [session]);

  const toggleSignalStatus = async (id:any, currentStatus:string) => {
    try {
      const newStatus = currentStatus === "ON" ? "OFF" : "ON";
      setRobotStatus((prev) =>
        prev.map((robot) =>
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

      if (response.status === 403) {
        toast.error(
          <div className="flex flex-col gap-2 w-auto">
            <p>Your account has been suspended for overbilling. You can continue by paying the bill.</p>
            
          </div>,
          { duration: 10000 }
        );
        setRobotStatus((prev) =>
          prev.map((robot) =>
            robot.id === id ? { ...robot, signalStatus: currentStatus } : robot
          )
        );
        return;
      }

      setRobotStatus((prev) =>
        prev.map((robot) =>
          robot.id === id ? { ...robot, signalStatus: currentStatus } : robot
        )
      );

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

  const filteredRobots = robotStatus.filter(robot => 
    robot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    robot.mt5name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    robot.mt5Id.toString().includes(searchTerm)
  );

//   if (status === "loading") {
//     return <LoadingSpinner />;
//   }

  if (!session) {
    return <LoginRedirect />;
  } 

  return (
    
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto">
        <Card className="border border-gray-200 bg-white shadow-md">
          <CardHeader className="border-b border-gray-100 pb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Bot className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl md:text-2xl font-bold text-gray-800">
                  Trading Bot Control Center
                </CardTitle>
              </div>
              
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                    placeholder="Search bots..." 
                    className="pl-10 bg-white border-gray-200 text-gray-600 placeholder:text-gray-400 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={fetchRobots} 
                  variant="outline" 
                  className="border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                >
                  <RotateCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => router.push("/robot")}>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Bot
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                Loading...
              </div>
            ) : (
              <div className="rounded-lg overflow-hidden border border-gray-200">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="text-gray-600 font-medium">Bot Name</TableHead>
                      <TableHead className="text-gray-600 font-medium">Version</TableHead>
                      <TableHead className="text-gray-600 font-medium">MT5 ID</TableHead>
                      <TableHead className="text-gray-600 font-medium">MT5 Name</TableHead>
                      <TableHead className="text-gray-600 font-medium">Balance</TableHead>
                      <TableHead className="text-gray-600 font-medium">Connection</TableHead>
                      <TableHead className="text-gray-600 font-medium">Status</TableHead>
                      <TableHead className="text-gray-600 font-medium">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRobots.length > 0 ? (
                      filteredRobots.map((robot) => (
                        <TableRow 
                          key={robot.id} 
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <TableCell className="font-medium text-gray-800">{robot.name}</TableCell>
                          <TableCell className="font-medium text-gray-800">{robot.version}</TableCell>
                          <TableCell className="text-gray-600">{robot.mt5Id}</TableCell>
                          <TableCell className="text-gray-600">{robot.mt5name}</TableCell>
                          <TableCell className="font-medium text-gray-800">{robot.balance}</TableCell>
                          <TableCell>
                            {robot.status === "CONNECTED" ? (
                              <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-sm text-green-600">Connected</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                <span className="text-sm text-red-600">Disconnected</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {robot.signalStatus === "ON" ? (
                              <div className="flex items-center gap-1.5">
                                <div className="p-1 rounded-full bg-green-100">
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                </div>
                                <span className="text-sm font-medium text-green-600">Running</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <div className="p-1 rounded-full bg-red-100">
                                  <XCircle className="w-4 h-4 text-red-600" />
                                </div>
                                <span className="text-sm font-medium text-red-600">Stopped</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={robot.signalStatus === "ON"}
                                onCheckedChange={() => toggleSignalStatus(robot.id, robot.signalStatus)}
                                className="data-[state=checked]:bg-green-600"
                              />
                              {/* <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 px-2 border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                              >
                                Details
                              </Button> */}
                              
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow className="hover:bg-white">
                        <TableCell colSpan={7} className="h-32">
                          <div className="flex flex-col items-center justify-center">
                            <div className="p-3 rounded-full bg-gray-100 mb-4">
                              <AlertTriangle className="w-6 h-6 text-amber-500" />
                            </div>
                            <div className="text-lg font-medium text-gray-800 mb-2">No bots found</div>
                            <div className="text-sm text-gray-500 max-w-md text-center">
                              {searchTerm ? 
                                "No bots matched your search criteria. Try a different search term." : 
                                "Get started by adding a new bot from the robot selection page."}
                            </div>
                            {searchTerm && (
                              <Button 
                                className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-700"
                                onClick={() => setSearchTerm("")}
                              >
                                Clear Search
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}