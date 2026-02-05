
import React, { useState, useEffect } from 'react';
import { Transaction, Category, TransactionType } from '../types';
import { CATEGORIES_CONFIG } from '../constants';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: Transaction | null;
}

const TransactionForm: React.FC<Props> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: Category.FOOD,
    type: 'expense' as TransactionType,
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        amount: initialData.amount.toString(),
        category: initialData.category,
        type: initialData.type,
        date: new Date(initialData.date).toISOString().split('T')[0]
      });
    } else {
      setFormData({
        title: '',
        amount: '',
        category: Category.FOOD,
        type: 'expense',
        date: new Date().toISOString().split('T')[0]
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create the base payload
    const payload: any = {
      title: formData.title,
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: formData.type,
      date: new Date(formData.date).toISOString()
    };

    // Only add ID if we are editing (prevents sending id: undefined to Firebase)
    if (initialData?.id) {
      payload.id = initialData.id;
    }

    onSubmit(payload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-xl font-bold text-gray-800">{initialData ? 'Edit Entry' : 'New Entry'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2">✕</button>
        </div>

        <form className="p-6 space-y-5" onSubmit={handleSubmit}>
          {/* Type Toggle */}
          <div className="flex p-1 bg-gray-100 rounded-xl">
            <button
              type="button"
              onClick={() => setFormData(p => ({ ...p, type: 'expense', category: Category.FOOD }))}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${formData.type === 'expense' ? 'bg-white text-red-500 shadow-sm' : 'text-gray-500'}`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setFormData(p => ({ ...p, type: 'income', category: Category.SALARY }))}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${formData.type === 'income' ? 'bg-white text-emerald-500 shadow-sm' : 'text-gray-500'}`}
            >
              Income
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Title</label>
              <input 
                required
                className="w-full p-3 bg-gray-50 border-transparent border focus:border-indigo-500 focus:bg-white rounded-xl outline-none transition-all"
                value={formData.title}
                onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                placeholder="Rent, Groceries, Salary..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Amount (₹)</label>
                <input 
                  required
                  type="number"
                  step="any"
                  className="w-full p-3 bg-gray-50 border-transparent border focus:border-indigo-500 focus:bg-white rounded-xl outline-none transition-all"
                  value={formData.amount}
                  onChange={e => setFormData(p => ({ ...p, amount: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Date</label>
                <input 
                  required
                  type="date"
                  className="w-full p-3 bg-gray-50 border-transparent border focus:border-indigo-500 focus:bg-white rounded-xl outline-none transition-all"
                  value={formData.date}
                  onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Category</label>
              <select 
                className="w-full p-3 bg-gray-50 border-transparent border focus:border-indigo-500 focus:bg-white rounded-xl outline-none transition-all"
                value={formData.category}
                onChange={e => setFormData(p => ({ ...p, category: e.target.value as Category }))}
              >
                {CATEGORIES_CONFIG
                  .filter(c => c.type === formData.type || c.type === 'both')
                  .map(c => <option key={c.name} value={c.name}>{c.icon} {c.name}</option>)
                }
              </select>
            </div>
          </div>

          <button 
            type="submit"
            className={`w-full py-4 rounded-2xl text-white font-bold shadow-lg transition-all transform active:scale-95 ${formData.type === 'expense' ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
          >
            {initialData ? 'Update Record' : 'Save Record'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
