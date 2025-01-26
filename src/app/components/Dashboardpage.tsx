"use client";

import { useState } from "react";

const MT5Dashboard = ({ email }: { email: string }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [token, setToken] = useState("");
  const [mt5InstanceId, setMt5InstanceId] = useState("");

  const handleGenerateToken = async () => {
    if (!email) {
      alert("User session is invalid or email is missing!");
      return;
    }
  
    try {
      const response = await fetch("/api/generate-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }), // ส่ง email จาก session
      });
  
      if (!response.ok) {
        throw new Error("Failed to generate token");
      }
  
      const data = await response.json();
      setToken(data.token);
      setMt5InstanceId(data.mt5InstanceId);
    } catch (error) {
      console.error(error);
      alert("Error generating token");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Top Section (60%) */}
      <div className="flex-1 bg-gray-200 flex items-center justify-center">
        <p className="text-xl text-gray-500">Graph Area (60%)</p>
      </div>

      {/* Bottom Section (40%) */}
      <div className="h-[40%] bg-white relative">
        {/* Button to open the sidebar */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Add MT5 Account
          </button>
        </div>
      </div>

      {/* Right Sidebar */}
      {isSidebarOpen && (
        <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 flex flex-col p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Generate Token</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              ✕
            </button>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-700">
              Token will be generated for: <b>{email}</b>
            </p>
            <button
              onClick={handleGenerateToken}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Generate Token
            </button>
          </div>

          {token && (
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Generated Token:</h3>
              <p className="text-xs break-words">
                <b>Token:</b> {token}
              </p>
              <p className="text-xs mt-2">
                <b>MT5 Instance ID:</b> {mt5InstanceId}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MT5Dashboard;
