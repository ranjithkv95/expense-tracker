
import React from 'react';

interface Props {
  children: React.ReactNode;
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

const Layout: React.FC<Props> = ({ children, currentDate, onDateChange }) => {
  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    onDateChange(newDate);
  };

  const periodLabel = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-10">
      {/* Top Navigation Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-18 flex items-center justify-between py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-100">₹</div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight hidden sm:block">RupeeFlow</h1>
          </div>

          {/* Period Navigator */}
          <div className="flex items-center bg-gray-50 rounded-2xl p-1 border border-gray-100">
            <button 
              onClick={() => changeMonth(-1)}
              className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-gray-500"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <span className="px-4 text-sm font-bold text-gray-700 min-w-[140px] text-center">
              {periodLabel}
            </span>
            <button 
              onClick={() => changeMonth(1)}
              className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-gray-500"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] font-bold text-emerald-500 uppercase">System Active</span>
              <span className="text-xs font-medium text-gray-400">AI V2.0</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;
