
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
// Correctly import Transaction instead of non-existent Expense
import { Transaction, Budget } from '../types';

interface Props {
  // Updated type to use Transaction interface
  expenses: Transaction[];
  budgets: Budget[];
}

const AIFeedback: React.FC<Props> = ({ expenses, budgets }) => {
  const [advice, setAdvice] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const getAdvice = async () => {
    setLoading(true);
    const feedback = await geminiService.getFinancialAdvice(expenses, budgets);
    setAdvice(feedback);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold mb-2">AI Financial Navigator</h2>
            <p className="text-indigo-100 opacity-90">
              Get personalized spending feedback and smart savings strategies based on your INR transaction patterns.
            </p>
          </div>
          <button 
            onClick={getAdvice}
            disabled={loading}
            className="whitespace-nowrap px-8 py-3 bg-white text-indigo-600 rounded-xl font-bold shadow-lg hover:bg-indigo-50 transition-all disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Generate New Insights'}
          </button>
        </div>

        {/* Decorative Circles */}
        <div className="absolute top-[-20px] right-[-20px] w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-50px] left-[-20px] w-48 h-48 bg-purple-500/20 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 min-h-[300px] flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 animate-pulse">Our AI is crunching the numbers for you...</p>
          </div>
        ) : advice ? (
          <div className="prose prose-indigo max-w-none">
            <div className="flex items-start space-x-4">
              <div className="bg-indigo-100 p-3 rounded-2xl text-2xl">💡</div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800">Your Tailored Insights</h3>
                <div className="text-gray-600 whitespace-pre-wrap leading-relaxed bg-indigo-50/30 p-6 rounded-2xl border border-indigo-50">
                  {advice}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 space-y-4">
            <div className="text-6xl">✨</div>
            <div>
              <p className="text-lg font-medium text-gray-500">Ready to optimize your wealth?</p>
              <p className="text-sm">Click the button above to get smart INR-based advice.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIFeedback;
