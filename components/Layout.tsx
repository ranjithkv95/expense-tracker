
import React, { useState } from 'react';
import { User } from '../types';

interface Props {
  children: React.ReactNode;
  currentDate: Date;
  onDateChange: (date: Date) => void;
  user: User | null;
  onLogout: () => void;
}

const Layout: React.FC<Props> = ({ children, currentDate, onDateChange, user, onLogout }) => {
  const [showMenu, setShowMenu] = useState(false);

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

          {/* User Profile */}
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center space-x-3 p-1 pr-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-xs uppercase">
                {user?.name.substring(0, 2)}
              </div>
              <span className="text-sm font-bold text-gray-700 hidden sm:block">{user?.name.split(' ')[0]}</span>
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-3 border-b border-gray-50 mb-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Account</p>
                  <p className="text-xs font-bold text-gray-700 truncate">{user?.email}</p>
                </div>
                <button 
                  onClick={onLogout}
                  className="w-full text-left px-4 py-3 text-red-500 text-sm font-bold hover:bg-red-50 rounded-xl transition-colors flex items-center space-x-2"
                >
                  <span>👋</span>
                  <span>Logout</span>
                </button>
              </div>
            )}
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
