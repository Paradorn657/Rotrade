import React from 'react';

const SimpleSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="relative w-16 h-16">
        {/* Outer spinning ring */}
        <div className="absolute inset-0 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        
        {/* Inner spinning ring */}
        <div className="absolute inset-2 border-4 border-t-transparent border-r-blue-400 border-b-transparent border-l-transparent rounded-full animate-spin-reverse"></div>
      </div>
    </div>
  );
};

export default SimpleSpinner;