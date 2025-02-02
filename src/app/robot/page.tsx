"use client"
import React, { useState } from 'react';

const BotPresets = () => {
  const [bots, setBots] = useState([
    { name: 'Orilla Trade Federation Battleship Bot #693', strategy: 'DCA Long Strategy', profit: '+17.06%', coin: 'Coin X', exchange: 'Binance' },
    { name: 'Ravyn Newberry Bot #126', strategy: 'DLA Long Strategy', profit: '+8.57%', coin: 'CoinsX', exchange: 'Binance' },
    // ... บอทอื่นๆ
  ]);

  const [filters, setFilters] = useState({
    exchange: 'All',
    strategy: 'All', // เพิ่มตัวกรอง strategy
  });

  const handleFilterChange = (event) => {
    setFilters({ ...filters, [event.target.name]: event.target.value });
  };

  const filteredBots = bots.filter((bot) => {
    return (
      (filters.exchange === 'All' || bot.exchange === filters.exchange) &&
      (filters.strategy === 'All' || bot.strategy === filters.strategy) // เพิ่มเงื่อนไขการกรอง strategy
    );
  });

  return (
    <div className="mx-auto p-10  bg-gray-100 min-h-screen"> {/* เพิ่ม bg-gray-100 และ min-h-screen */}
      <div className="header mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Signal Forex Robot</h1> {/* ปรับขนาดและสีของ heading */}
        <p className="text-lg text-gray-600">Choose your robot</p>
      </div>

      <div className="filters mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Filters</h2> {/* ปรับขนาดและสีของ heading */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"> {/* ปรับ grid ให้ responsive มากขึ้น */}
          <div>
            <label htmlFor="exchange" className="block font-medium text-gray-700">Forex Model:</label> {/* ปรับสี label */}
            <select name="exchange" id="exchange" value={filters.exchange} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"> {/* เพิ่ม focus style */}
              <option value="All">All</option>
              <option value="Binance">XAUUSD 15M</option>
              <option value="Binance">EURUSD 1H</option>
              {/* เพิ่มตัวเลือก exchange อื่นๆ */}
            </select>
          </div>
        </div>
      </div>

      <div className="bot-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"> {/* ปรับ grid ให้ responsive มากขึ้น */}
        {filteredBots.map((bot, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300"> {/* เพิ่ม background, shadow, hover effect */}
            <h3 className="text-xl font-medium text-gray-800 mb-3">{bot.name}</h3> {/* ปรับสี heading */}
            <div className="text-gray-600"> {/* รวมข้อมูล strategy, profit, coin, exchange ไว้ใน div เดียวกัน */}
              <p className="mb-1">Strategy: {bot.strategy}</p>
              <p className="mb-1">Profit (last month): {bot.profit}</p>
              <p className="mb-1">Coin: {bot.coin}</p>
              <p>Exchange: {bot.exchange}</p>
            </div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mt-4 transition duration-300"> {/* เปลี่ยนสีปุ่ม */}
              Copy Bot
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BotPresets;