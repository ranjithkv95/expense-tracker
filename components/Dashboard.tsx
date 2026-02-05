
import React, { useMemo, useState } from 'react';
import { Transaction, Category, TransactionType } from '../types';
import { INR_FORMATTER, CATEGORIES_CONFIG } from '../constants';
import TransactionForm from './TransactionForm';

interface Props {
  transactions: Transaction[]; 
  allTransactions: Transaction[]; 
  onAdd: (t: any) => void;
  onUpdate: (t: any) => void;
  onDelete: (id: string) => void;
}

const Dashboard: React.FC<Props> = ({ transactions, allTransactions, onAdd, onUpdate, onDelete }) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | TransactionType>('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const sourceData = useMemo(() => {
    return (dateRange.start || dateRange.end) ? allTransactions : transactions;
  }, [allTransactions, transactions, dateRange]);

  const filteredTransactions = useMemo(() => {
    return sourceData.filter(t => {
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === 'all' || t.type === filterType;
      const matchCat = filterCategory === 'all' || t.category === filterCategory;
      
      let matchDate = true;
      if (dateRange.start || dateRange.end) {
        const d = new Date(t.date);
        d.setHours(0, 0, 0, 0);
        if (dateRange.start) {
          const start = new Date(dateRange.start);
          start.setHours(0, 0, 0, 0);
          if (d < start) matchDate = false;
        }
        if (dateRange.end) {
          const end = new Date(dateRange.end);
          end.setHours(23, 59, 59, 999);
          if (d > end) matchDate = false;
        }
      }
      
      return matchSearch && matchType && matchCat && matchDate;
    });
  }, [sourceData, search, filterType, filterCategory, dateRange]);

  const stats = useMemo(() => {
    const income = filteredTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = filteredTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [filteredTransactions]);

  const resetFilters = () => {
    setSearch('');
    setFilterType('all');
    setFilterCategory('all');
    setDateRange({ start: '', end: '' });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 flex flex-col justify-between transform transition-transform hover:scale-[1.02]">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Balance Amount</p>
          <p className="text-4xl font-black">{INR_FORMATTER.format(stats.balance)}</p>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold opacity-80">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            <span>{filteredTransactions.length} entries clubbed</span>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-between transition-all hover:border-emerald-200">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-1">Income</p>
          <p className="text-3xl font-black text-gray-900">{INR_FORMATTER.format(stats.income)}</p>
          <div className="mt-4 h-1.5 w-full bg-emerald-50 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500" style={{ width: stats.income > 0 ? '100%' : '0%' }}></div>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-between transition-all hover:border-rose-200">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 mb-1">Expense</p>
          <p className="text-3xl font-black text-gray-900">{INR_FORMATTER.format(stats.expense)}</p>
          <div className="mt-4 h-1.5 w-full bg-rose-50 rounded-full overflow-hidden">
            <div className="h-full bg-rose-500" style={{ width: stats.expense > 0 ? '100%' : '0%' }}></div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-col xl:flex-row gap-4">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
              <input 
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all outline-none text-sm font-bold text-gray-700"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select 
              className="px-4 py-3 bg-gray-50 border-transparent rounded-2xl text-sm font-bold text-gray-600 outline-none hover:bg-gray-100 cursor-pointer"
              value={filterType}
              onChange={e => setFilterType(e.target.value as any)}
            >
              <option value="all">All Cashflow</option>
              <option value="income">Incomes</option>
              <option value="expense">Expenses</option>
            </select>
            <select 
              className="px-4 py-3 bg-gray-50 border-transparent rounded-2xl text-sm font-bold text-gray-600 outline-none hover:bg-gray-100 cursor-pointer"
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {CATEGORIES_CONFIG.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
            <div className="flex gap-2 items-center bg-gray-50 px-3 rounded-2xl border border-transparent focus-within:border-indigo-100">
              <span className="text-[10px] font-black text-gray-400 uppercase">Range</span>
              <input 
                type="date"
                className="flex-1 bg-transparent border-none text-[10px] font-bold text-gray-600 outline-none py-2"
                value={dateRange.start}
                onChange={e => setDateRange(p => ({ ...p, start: e.target.value }))}
              />
              <span className="text-gray-300">→</span>
              <input 
                type="date"
                className="flex-1 bg-transparent border-none text-[10px] font-bold text-gray-600 outline-none py-2"
                value={dateRange.end}
                onChange={e => setDateRange(p => ({ ...p, end: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            {(search || filterType !== 'all' || filterCategory !== 'all' || dateRange.start || dateRange.end) && (
              <button 
                onClick={resetFilters}
                className="px-4 py-3 text-rose-500 text-xs font-black hover:bg-rose-50 rounded-2xl transition-all"
              >
                Reset Filters
              </button>
            )}
            <button 
              onClick={() => { setEditingTransaction(null); setIsFormOpen(true); }}
              className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95"
            >
              + Create Entry
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Transaction</th>
                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Amount</th>
                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-10 py-24 text-center text-gray-400 font-medium italic">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">🍃</span>
                      <span>No entries matched your selection.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map(t => {
                  const cat = CATEGORIES_CONFIG.find(c => c.name === t.category);
                  return (
                    <tr key={t.id} className="group hover:bg-indigo-50/10 transition-all">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-[1.25rem] flex items-center justify-center text-2xl shadow-sm border border-transparent group-hover:border-white transition-all" style={{ backgroundColor: `${cat?.color}15` }}>
                            {cat?.icon}
                          </div>
                          <div>
                            <p className="font-black text-gray-900 text-lg group-hover:text-indigo-600 transition-colors">{t.title}</p>
                            <p className="text-[10px] font-black text-gray-400 uppercase mt-1 tracking-widest">{t.category} • {new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <p className={`text-xl font-black ${t.type === 'income' ? 'text-emerald-600' : 'text-gray-900'}`}>
                          {t.type === 'income' ? '+' : '-'}{INR_FORMATTER.format(t.amount)}
                        </p>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={() => { setEditingTransaction(t); setIsFormOpen(true); }} className="p-2.5 text-indigo-500 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors">✏️</button>
                          <button onClick={() => onDelete(t.id)} className="p-2.5 text-rose-500 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TransactionForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={(data) => data.id ? onUpdate(data) : onAdd(data)}
        initialData={editingTransaction}
      />
    </div>
  );
};

export default Dashboard;
