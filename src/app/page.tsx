'use client';

import { getServerSession } from 'next-auth';
import { signIn, useSession } from 'next-auth/react';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { authOptions } from '../../lib/authOptions';
import Foot from '@/components/footter';
import { ArrowRight, BarChart2, Lock, Zap, DollarSign, Clock } from 'lucide-react';
import TradingViewTicker from '@/components/tradingViewticker';

import { TradingViewEURUSDMiniChart, TradingViewUSDJPYMiniChart } from '@/components/tradingViewXAUmini';


export default function Home() {
  // Client-side session handling
  const { data: session } = useSession();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      <Head>
        <title>RoTrade | Automated Forex Trading Models</title>
        <meta name="description" content="Rent powerful automated Forex trading models with RoTrade. Start maximizing your profits today with our AI-powered trading solutions." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      {/* Hero Section */}
      <div className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        {/* Logo Only (No Menu) */}
        <div className="relative z-10 px-6 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-3xl font-bold text-white">RoTrade</span>
            </div>
            <div>
              {isLoaded && session ? (
                <div className="flex items-center space-x-3">
                  <a href="/dashboard" className="bg-white text-blue-900 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition">Dashboard</a>
                </div>
              ) : (
                <button
                  onClick={() => signIn()}
                  className="bg-white text-blue-900 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 px-6 pt-12 pb-24 md:pt-20 md:pb-32 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              {isLoaded && session ? (
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                  Hello, <span className="text-green-400">ภราดร จันทร์เจริญ</span>
                </h2>
              ) : null}
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                Automate Your <span className="text-green-400">Forex Trading</span> With Powerful AI
              </h1>
              <p className="mt-6 text-xl text-gray-300">
                Rent professional trading models and algorithms designed to maximize profits and minimize risk in the Forex market.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <a
                  href="#explore"
                  className="px-8 py-4 text-center bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition shadow-lg shadow-green-500/30"
                >
                  Explore Models
                </a>
                <a
                  href="#how-it-works"
                  className="px-8 py-4 text-center bg-transparent border-2 border-white text-white rounded-lg font-medium hover:bg-white/10 transition"
                >
                  How It Works
                </a>
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="text-white text-2xl font-bold mb-4">Market Prices</h1>
              <TradingViewTicker />
              <h1 className="text-white text-2xl font-bold mb-4">Gold Price Chart</h1>
              <TradingViewEURUSDMiniChart />
              <TradingViewUSDJPYMiniChart />
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative z-10 px-6 py-8 bg-blue-900/50 backdrop-blur-lg border-t border-b border-blue-800">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">24/7</p>
              <p className="text-gray-300 mt-1">Automated Trading</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">95+</p>
              <p className="text-gray-300 mt-1">Trading Models</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">5,000+</p>
              <p className="text-gray-300 mt-1">Active Users</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">24%</p>
              <p className="text-gray-300 mt-1">Avg. Annual Return</p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Why Choose RoTrade?</h2>
            <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
              Our platform offers powerful tools and models to help you succeed in the forex market
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-blue-800/30 backdrop-blur-sm p-8 rounded-xl border border-blue-700/50">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                <Zap size={24} className="text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Advanced Algorithms</h3>
              <p className="text-gray-300">
                Access cutting-edge trading algorithms developed by professional quants and data scientists.
              </p>
            </div>

            <div className="bg-blue-800/30 backdrop-blur-sm p-8 rounded-xl border border-blue-700/50">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                <Lock size={24} className="text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Secure & Reliable</h3>
              <p className="text-gray-300">
                Our platform uses enterprise-grade security protocols to keep your investments safe at all times.
              </p>
            </div>

            <div className="bg-blue-800/30 backdrop-blur-sm p-8 rounded-xl border border-blue-700/50">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                <DollarSign size={24} className="text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Cost Effective</h3>
              <p className="text-gray-300">
                Rent models for a fraction of the cost of developing your own trading systems and algorithms.
              </p>
            </div>

            <div className="bg-blue-800/30 backdrop-blur-sm p-8 rounded-xl border border-blue-700/50">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                <Clock size={24} className="text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">24/7 Trading</h3>
              <p className="text-gray-300">
                Our models work around the clock, analyzing and executing trades even while you sleep.
              </p>
            </div>

            <div className="bg-blue-800/30 backdrop-blur-sm p-8 rounded-xl border border-blue-700/50">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                <BarChart2 size={24} className="text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Performance Tracking</h3>
              <p className="text-gray-300">
                Track the performance of your trading models with detailed analytics and reports.
              </p>
            </div>

            <div className="bg-blue-800/30 backdrop-blur-sm p-8 rounded-xl border border-blue-700/50">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                <Zap size={24} className="text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Easy Integration</h3>
              <p className="text-gray-300">
                Seamlessly connect our models to your existing trading accounts and platforms.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div id="how-it-works" className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white">How RoTrade Works</h2>
            <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
              Start automating your forex trading in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-blue-800/30 backdrop-blur-sm p-8 rounded-xl border border-blue-700/50 relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 pt-6">Choose Your Model</h3>
              <p className="text-gray-300">
                Browse our marketplace of professional trading models and select the one that matches your strategy and risk profile.
              </p>
            </div>

            <div className="bg-blue-800/30 backdrop-blur-sm p-8 rounded-xl border border-blue-700/50 relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 pt-6">Connect Your Account</h3>
              <p className="text-gray-300">
                Securely link your brokerage account to our platform using our simple integration process.
              </p>
            </div>

            <div className="bg-blue-800/30 backdrop-blur-sm p-8 rounded-xl border border-blue-700/50 relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 pt-6">Start Trading</h3>
              <p className="text-gray-300">
                Activate your model and watch as it automatically analyzes the market and executes trades on your behalf.
              </p>
            </div>
          </div>
        </div>

        {/* Available Models Section */}
        <div id="models" className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Our Trading Models</h2>
            <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
              Choose from our selection of high-performance trading models
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-blue-800/30 backdrop-blur-sm p-8 rounded-xl border border-blue-700/50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">XAUUSD Trader</h3>
                <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm">Gold</span>
              </div>
              <div className="space-y-4">
                <p className="text-gray-300">
                  Specialized gold trading model optimized for 15-minute timeframes with advanced price action analysis.
                </p>
                <div className="pt-4 border-t border-blue-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Timeframe</span>
                    <span className="text-white">15m</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-400">Win Rate</span>
                    <span className="text-green-400">68.5%</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-400">Monthly Return</span>
                    <span className="text-green-400">+8.2%</span>
                  </div>
                </div>
                <a href="/models/xauusd" className="mt-6 block w-full py-3 text-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                  View Details
                </a>
              </div>
            </div>

            <div className="bg-blue-800/30 backdrop-blur-sm p-8 rounded-xl border border-blue-700/50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">EURUSD Trader</h3>
                <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">Major Pair</span>
              </div>
              <div className="space-y-4">
                <p className="text-gray-300">
                  Trend-following model for the most liquid forex pair, with advanced indicator analysis on 1-hour charts.
                </p>
                <div className="pt-4 border-t border-blue-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Timeframe</span>
                    <span className="text-white">1H</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-400">Win Rate</span>
                    <span className="text-green-400">72.3%</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-400">Monthly Return</span>
                    <span className="text-green-400">+6.8%</span>
                  </div>
                </div>
                <a href="/models/eurusd" className="mt-6 block w-full py-3 text-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                  View Details
                </a>
              </div>
            </div>

            <div className="bg-blue-800/30 backdrop-blur-sm p-8 rounded-xl border border-blue-700/50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">USD/JPY Trader</h3>
                <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm">Swing</span>
              </div>
              <div className="space-y-4">
                <p className="text-gray-300">
                  Medium-term swing trading model specialized for USD/JPY pairs with volatility-based entry and exit rules.
                </p>
                <div className="pt-4 border-t border-blue-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Timeframe</span>
                    <span className="text-white">4H</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-400">Win Rate</span>
                    <span className="text-green-400">64.1%</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-400">Monthly Return</span>
                    <span className="text-green-400">+7.5%</span>
                  </div>
                </div>
                <a href="/models/usdjpy" className="mt-6 block w-full py-3 text-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                  View Details
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div id="explore" className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to Start Automated Trading?</h2>
                <p className="mt-4 text-lg text-white/90">
                  Join thousands of traders who are already using RoTrade to maximize their forex trading profits.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <a
                    href="/signup"
                    className="px-8 py-4 text-center bg-white text-blue-900 rounded-lg font-medium hover:bg-blue-50 transition shadow-lg"
                  >
                    Get Started Now
                  </a>
                  <a
                    href="/demo"
                    className="px-8 py-4 text-center bg-transparent border-2 border-white text-white rounded-lg font-medium hover:bg-white/10 transition"
                  >
                    Request Demo
                  </a>
                </div>
              </div>
              <div className="hidden md:block text-right">
                <div className="inline-block bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
                  <p className="text-5xl font-bold text-white">24%</p>
                  <p className="text-xl text-white mt-2">Average Annual Return</p>
                  <p className="text-white/70 text-sm mt-2">Based on our top 10 models</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Foot />
    </>
  );
}