
import React, { useState } from 'react';
// Correctly import Transaction instead of non-existent Expense
import { Budget, Category, Transaction } from '../types';
import { CATEGORIES_CONFIG, INR_FORMATTER } from '../constants';

interface Props {
  budgets: Budget[];
  // Updated type to use Transaction interface
  expenses: Transaction[];
  onUpdateBudget: (category: Category | 'Total', limit: number) => void;
}

const BudgetPanel: React.FC<Props> = ({ budgets, expenses, onUpdateBudget }) => {
  const [editing, setEditing] = useState<string | null>(null);
  const [value, setValue] = useState('');

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const getSpent = (catName: string) => {
    if (catName === 'Total') return monthlyExpenses.reduce((s, e) => s + e.amount, 0);
    return monthlyExpenses.filter(e => e.category === catName).reduce((s, e) => s + e.amount, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Budgets & Limits</h2>
        <div className="text-sm text-gray-500">Managing limits for current month</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Budget Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-semibold text-gray-800">Global Budget</span>
              <button 
                onClick={() => {
                  setEditing('Total');
                  setValue(budgets.find(b => b.category === 'Total')?.limit.toString() || '');
                }}
                className="text-indigo-600 text-sm hover:underline"
              >
                Edit Limit
              </button>
            </div>
            {editing === 'Total' ? (
              <div className="flex space-x-2">
                <input 
                  autoFocus
                  className="flex-1 border p-2 rounded-lg"
                  type="number"
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  onBlur={() => {
                    if (value) onUpdateBudget('Total', parseFloat(value));
                    setEditing(null);
                  }}
                  onKeyDown={e => e.key === 'Enter' && e.currentTarget.blur()}
                />
              </div>
            ) : (
              <div className="text-3xl font-bold text-indigo-600">
                {INR_FORMATTER.format(budgets.find(b => b.category === 'Total')?.limit || 0)}
              </div>
            )}
          </div>
          <div className="mt-6">
             <div className="flex justify-between text-xs text-gray-400 mb-1">
               <span>Used: {INR_FORMATTER.format(getSpent('Total'))}</span>
               <span>{Math.round((getSpent('Total') / (budgets.find(b => b.category === 'Total')?.limit || 1)) * 100)}%</span>
             </div>
             <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
               <div 
                 className={`h-full transition-all duration-700 ${getSpent('Total') / (budgets.find(b => b.category === 'Total')?.limit || 1) > 0.9 ? 'bg-red-500' : 'bg-indigo-500'}`}
                 style={{ width: `${Math.min(100, (getSpent('Total') / (budgets.find(b => b.category === 'Total')?.limit || 1)) * 100)}%` }}
               />
             </div>
          </div>
        </div>

        {/* Category Limits */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-50 font-semibold text-gray-700">Category Caps</div>
          <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
            {CATEGORIES_CONFIG.map(cat => {
              const budget = budgets.find(b => b.category === cat.name);
              const spent = getSpent(cat.name);
              const limit = budget?.limit || 0;
              const percent = limit > 0 ? (spent / limit) * 100 : 0;

              return (
                <div key={cat.name} className="p-4 flex items-center justify-between group">
                  <div className="flex-1 mr-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{cat.icon} {cat.name}</span>
                      <span className="text-xs text-gray-400">₹{spent} / ₹{limit}</span>
                    </div>
                    <div className="w-full bg-gray-50 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${percent > 90 ? 'bg-orange-500' : 'bg-gray-400'}`}
                        style={{ width: `${Math.min(100, percent)}%`, backgroundColor: percent > 90 ? '#f97316' : cat.color }}
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setEditing(cat.name);
                      setValue(limit.toString());
                    }}
                    className="opacity-0 group-hover:opacity-100 text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded transition-opacity"
                  >
                    Set
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {editing && editing !== 'Total' && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4">Set Limit for {editing}</h3>
            <input 
              autoFocus
              className="w-full border border-gray-200 p-3 rounded-xl mb-4 text-xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
              type="number"
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder="Enter limit in ₹"
            />
            <div className="flex space-x-3">
              <button 
                onClick={() => setEditing(null)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg font-medium text-gray-600"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (value) onUpdateBudget(editing as Category, parseFloat(value));
                  setEditing(null);
                }}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetPanel;
