"use client";
import { ArrowLeft, Book, ChevronRight, Download, ExternalLink, Terminal } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const MT5Documentation = () => {
  const downloadLink = "https://drive.google.com/uc?export=download&id=16iSk1ocePMMmAD8jopkIQcdRScUQ_4XH";
  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <button className="flex items-center text-sm text-blue-600 hover:text-blue-800 gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
        </div>
        <h1 className="text-3xl font-bold mb-2">MT5 API Documentation</h1>
        <p className="text-gray-600 mb-4">
          Complete guide to integrating and using the MT5 API with your account
        </p>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => window.open(downloadLink, "_blank")} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4"  />
            Download API
          </button>

          <Link href={"/Dashboard"}>
          <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
            <ExternalLink className="h-4 w-4"/>
            MT5 Website
          </button>
          </Link>
        </div>
      </div>

      {/* Content grid */}
      <div className="grid md:grid-cols-4 gap-6">
        {/* Side navigation */}
        <div className="md:col-span-1">
          <div className="sticky top-6 bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="font-medium">Documentation</h2>
            </div>
            <nav className="p-2">
              <ul className="space-y-1">
                <li>
                  <a href="#getting-started" className="flex items-center justify-between p-2 rounded-md bg-blue-50 text-blue-800">
                    Getting Started
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </li>
                <li>
                  <a href="#installation" className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100">
                    Installation
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </li>
                <li>
                  <a href="#Howtouse" className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100">
                    How to use
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </li>

              </ul>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="md:col-span-3">
          <div className="space-y-8">
            {/* Getting Started */}
            <section id="getting-started" className="bg-white border border-gray-200 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Book className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-bold">Getting Started</h2>
              </div>
              <p className="text-gray-600 mb-4">
                The MT5 API allows you to connect your trading platform with our service.
                This documentation will guide you through the installation and setup process.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md">
                <h3 className="font-medium text-blue-800 mb-1">Important Note</h3>
                <p className="text-sm text-blue-700">
                  This library is for communication purposes only. It does not modify your MT5 platform
                  in any way that would violate the terms of service.
                </p>
              </div>
            </section>

            {/* Installation */}
            <section id="installation" className="bg-white border border-gray-200 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-bold">Installation</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Follow these steps to install the MT5 API on your platform:
              </p>
              <ol className="list-decimal pl-5 space-y-3">
                <li>Download the API package from the button above</li>
                <li>Extract the contents and You will see 2 folder <Image className="mt-3" src="/Extract.jpg" alt="Extract Image" width={1000} height={2000} /></li>

                <li>Open your MT5 platform</li>
                <li>Navigate to File &gt; Open Data Folder<Image className="mt-3" src="/Opendata.jpg" alt="Opendata Image" width={200} height={500} /></li>
                <li>Open the MQL5 folder , then the Libraries folder</li>
                <li>Copy the extracted library files to this folder<Image className="mt-3" src="/copylibrary.jpg" alt="copylibrary Image" width={1000} height={2000} /></li>

                <li>Go Back Navigate to File &gt; Experts and put Expert Advisor (Rotrade_web.ex5) from extracted folder to Experts folder<Image className="mt-3" src="/Expert.jpg" alt="Expert advisor Image" width={1000} height={2000} />
                  <Image className="mt-3" src="/Expert2.jpg" alt="Expert advisor2 Image" width={1000} height={2000} />
                </li>

                <li>Restart your MT5 platform</li>
              </ol>
            </section>

            {/* Code Example */}
            <section id="api-reference" className="bg-white border border-gray-200 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-bold">Allow Permission</h2>
              </div>
              <p className="text-gray-600 mb-4">
                You need to allow the permission for the Expert Advisor to work properly.:
              </p>
              
              <p className="text-sm text-gray-500">
                Goto Tools {'->'} Options {'->'} Expert Advisor Tab.
              </p>
            </section>

            {/* Authentication */}
            <section id="Howtouse" className="bg-white border border-gray-200 p-6 rounded-lg scroll-mt-20">
              <h2 className="text-xl font-bold mb-4">How to Use</h2>
              <p className="text-gray-600 mb-4">
                To authenticate your API connection, you&apos;ll need to generate a token from your account dashboard.
                Follow these steps:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Log in to your account</li>
                <li>Navigate to the MT5 Accounts section</li>
                <li>Click &quot;Add MT5 Account&quot;</li>
                <li>Enter your MT5 ID and Name</li>
                <li>Click &quot;Generate Token&quot;</li>
                <li>Use this token in your API initialization code <Image className="mt-3" src="/token.jpg" alt="Token Image" width={1000} height={2000} /></li>
                <li>Click Check &quot;Allow DLL imports&quot; And Click &quot;OK&quot; to save changes<Image className="mt-3" src="/Dll.jpg" alt="Dll Image" width={1000} height={2000} /></li>
              </ul>
              <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r">
                <p className="text-sm text-yellow-800">
                  <strong>Security Note:</strong> Keep your token secure. Do not share it with others
                  or expose it in public repositories.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-500">
          © 2025 MT5 API Documentation. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default MT5Documentation;