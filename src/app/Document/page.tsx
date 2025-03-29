import React from 'react';
import { ChevronRight, Book, Code, Terminal, Download, ArrowLeft, ExternalLink, Copy } from 'lucide-react';

const MT5Documentation = () => {
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
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4" />
            Download API
          </button>
          <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
            <ExternalLink className="h-4 w-4" />
            MT5 Website
          </button>
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
                  <a href="#authentication" className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100">
                    Authentication
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </li>
                <li>
                  <a href="#api-reference" className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100">
                    API Reference
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </li>
                <li>
                  <a href="#examples" className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100">
                    Examples
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </li>
                <li>
                  <a href="#troubleshooting" className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100">
                    Troubleshooting
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </li>
                <li>
                  <a href="#faq" className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100">
                    FAQ
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
                <li>Extract the contents to a temporary folder</li>
                <li>Open your MT5 platform</li>
                <li>Navigate to File &gt; Open Data Folder</li>
                <li>Open the MQL5 folder, then the Libraries folder</li>
                <li>Copy the extracted library files to this folder</li>
                <li>Restart your MT5 platform</li>
              </ol>
            </section>

            {/* Code Example */}
            <section id="api-reference" className="bg-white border border-gray-200 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Code className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-bold">API Reference</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Here's a sample of how to initialize the API connection:
              </p>
              <div className="relative bg-gray-900 text-gray-100 p-4 rounded-md mb-3">
                <button className="absolute top-2 right-2 bg-gray-700 p-1 rounded hover:bg-gray-600">
                  <Copy className="h-4 w-4" />
                </button>
                <pre className="text-sm overflow-x-auto">
                  <code>
{`// Initialize the MT5 API connection
#include <MT5Api.mqh>

int OnInit()
{
    string token = "YOUR_GENERATED_TOKEN";
    bool connected = MT5Api::Initialize(token);
    
    if(connected)
    {
        Print("Successfully connected to API service");
        return(INIT_SUCCEEDED);
    }
    else
    {
        Print("Failed to connect to API service");
        return(INIT_FAILED);
    }
}`}
                  </code>
                </pre>
              </div>
              <p className="text-sm text-gray-500">
                Replace YOUR_GENERATED_TOKEN with the token generated from your account dashboard.
              </p>
            </section>

            {/* Authentication */}
            <section id="authentication" className="bg-white border border-gray-200 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Authentication</h2>
              <p className="text-gray-600 mb-4">
                To authenticate your API connection, you'll need to generate a token from your account dashboard.
                Follow these steps:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Log in to your account</li>
                <li>Navigate to the MT5 Accounts section</li>
                <li>Click "Add MT5 Account"</li>
                <li>Enter your MT5 ID and Name</li>
                <li>Click "Generate Token"</li>
                <li>Use this token in your API initialization code</li>
              </ul>
              <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r">
                <p className="text-sm text-yellow-800">
                  <strong>Security Note:</strong> Keep your token secure. Do not share it with others
                  or expose it in public repositories.
                </p>
              </div>
            </section>

            {/* Add more sections as needed */}
            <section id="examples" className="bg-white border border-gray-200 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Examples</h2>
              <p className="text-gray-600">
                Add your examples here...
              </p>
            </section>

            <section id="troubleshooting" className="bg-white border border-gray-200 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Troubleshooting</h2>
              <p className="text-gray-600">
                Add your troubleshooting guide here...
              </p>
            </section>

            <section id="faq" className="bg-white border border-gray-200 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-600">
                Add your FAQ content here...
              </p>
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