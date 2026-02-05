
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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const finalTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === 'all' || t.type === filterType;
      const matchCat = filterCategory === 'all' || t.category === filterCategory;
      return matchSearch && matchType && matchCat;
    });
  }, [transactions, search, filterType, filterCategory]);

  const stats = useMemo(() => {
    const income = finalTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = finalTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [finalTransactions]);

  const exportDetailedExcel = () => {
    const headers = ["Date", "Description", "Type", "Category", "Amount (INR)", "Impact", "Notes"];
    const rows = allTransactions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(t => [
      new Date(t.date).toISOString().split('T')[0],
      t.title.replace(/,/g, ' '),
      t.type.toUpperCase(),
      t.category,
      t.amount,
      t.type === 'income' ? `+${t.amount}` : `-${t.amount}`,
      t.notes || ''
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `RupeeFlow_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-indigo-600 p-6 rounded-[2rem] text-white shadow-xl shadow-indigo-100">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Period Balance</p>
          <p className="text-3xl font-black">{INR_FORMATTER.format(stats.balance)}</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">Total Income</p>
          <p className="text-2xl font-black text-gray-900">{INR_FORMATTER.format(stats.income)}</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-1">Total Expense</p>
          <p className="text-2xl font-black text-gray-900">{INR_FORMATTER.format(stats.expense)}</p>
        </div>
      </div>

      {/* Filter & Action Bar */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4">
        <div className="flex-1 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input 
              type="text"
              placeholder="Search description..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all outline-none text-sm font-medium"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2.5 bg-gray-50 border-transparent rounded-xl text-sm font-bold text-gray-600 outline-none"
            value={filterType}
            onChange={e => setFilterType(e.target.value as any)}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select 
            className="px-4 py-2.5 bg-gray-50 border-transparent rounded-xl text-sm font-bold text-gray-600 outline-none"
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {CATEGORIES_CONFIG.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={exportDetailedExcel}
            className="px-5 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-black hover:bg-emerald-100 transition-colors flex items-center gap-2"
          >
            📥 Excel
          </button>
          <button 
            onClick={() => { setEditingTransaction(null); setIsFormOpen(true); }}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
          >
            + Add Entry
          </button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Transaction</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Amount</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {finalTransactions.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-8 py-20 text-center text-gray-400 font-medium italic">
                    No entries match your search/filters in this period.
                  </td>
                </tr>
              ) : (
                finalTransactions.map(t => {
                  const cat = CATEGORIES_CONFIG.find(c => c.name === t.category);
                  return (
                    <tr key={t.id} className="group hover:bg-indigo-50/20 transition-all">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm" style={{ backgroundColor: `${cat?.color}15` }}>
                            {cat?.icon}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{t.title}</p>
                            <p className="text-[10px] font-black text-gray-400 uppercase mt-0.5">{t.category} • {new Date(t.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <p className={`text-lg font-black ${t.type === 'income' ? 'text-emerald-600' : 'text-gray-900'}`}>
                          {t.type === 'income' ? '+' : '-'}{INR_FORMATTER.format(t.amount)}
                        </p>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setEditingTransaction(t); setIsFormOpen(true); }} className="p-2 text-indigo-500 bg-indigo-50 rounded-lg hover:bg-indigo-100">✏️</button>
                          <button onClick={() => onDelete(t.id)} className="p-2 text-rose-500 bg-rose-50 rounded-lg hover:bg-rose-100">🗑️</button>
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
