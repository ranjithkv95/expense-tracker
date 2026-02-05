
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

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i);

  const handleMonthChange = (monthIdx: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(monthIdx);
    onDateChange(newDate);
  };

  const handleYearChange = (year: number) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    onDateChange(newDate);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-10">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-100 transition-transform hover:scale-105">₹</div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight hidden sm:block">RupeeFlow</h1>
          </div>

          <div className="flex items-center space-x-2">
            <select 
              value={currentDate.getMonth()}
              onChange={(e) => handleMonthChange(parseInt(e.target.value))}
              className="bg-gray-50 border-transparent rounded-xl text-sm font-bold text-gray-700 px-3 py-2 outline-none hover:bg-gray-100 transition-colors cursor-pointer"
            >
              {months.map((m, i) => <option key={m} value={i}>{m}</option>)}
            </select>
            <select 
              value={currentDate.getFullYear()}
              onChange={(e) => handleYearChange(parseInt(e.target.value))}
              className="bg-gray-50 border-transparent rounded-xl text-sm font-bold text-gray-700 px-3 py-2 outline-none hover:bg-gray-100 transition-colors cursor-pointer"
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center space-x-3 p-1.5 pr-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all border border-transparent hover:border-indigo-100"
            >
              <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-xs uppercase">
                {user?.name.substring(0, 2)}
              </div>
              <span className="text-sm font-bold text-gray-700 hidden sm:block truncate max-w-[100px]">{user?.name.split(' ')[0]}</span>
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-gray-50 mb-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Signed in as</p>
                  <p className="text-xs font-bold text-gray-700 truncate">{user?.email}</p>
                </div>
                <button 
                  onClick={onLogout}
                  className="w-full text-left px-4 py-3 text-red-500 text-sm font-bold hover:bg-red-50 rounded-xl transition-colors flex items-center space-x-3"
                >
                  <span className="text-lg">👋</span>
                  <span>Logout Account</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
