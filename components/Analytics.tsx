
import React, { useMemo, useState } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts';
import { Transaction } from '../types';
import { CATEGORIES_CONFIG, INR_FORMATTER } from '../constants';

interface Props {
  transactions: Transaction[]; // Filtered to current month
  fullHistory: Transaction[]; // Complete list
}

const Analytics: React.FC<Props> = ({ transactions, fullHistory }) => {
  const [reportType, setReportType] = useState<'category' | 'time' | 'annual'>('category');

  // 1. Weekly Breakdown for current month
  const weeklyData = useMemo(() => {
    const weeks: Record<string, number> = { 'Week 1': 0, 'Week 2': 0, 'Week 3': 0, 'Week 4': 0, 'Week 5+': 0 };
    transactions.forEach(t => {
      const day = new Date(t.date).getDate();
      if (t.type === 'expense') {
        if (day <= 7) weeks['Week 1'] += t.amount;
        else if (day <= 14) weeks['Week 2'] += t.amount;
        else if (day <= 21) weeks['Week 3'] += t.amount;
        else if (day <= 28) weeks['Week 4'] += t.amount;
        else weeks['Week 5+'] += t.amount;
      }
    });
    return Object.entries(weeks).map(([name, amount]) => ({ name, amount }));
  }, [transactions]);

  // 2. Category Share
  const categoryData = useMemo(() => {
    const grouped = transactions.filter(t => t.type === 'expense').reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    // Fix: Explicitly cast Object.entries to [string, number][] to resolve 'unknown' type error on line 43
    return (Object.entries(grouped) as [string, number][]).map(([name, value]): { name: string; value: number; color: string } => ({
      name,
      value,
      color: CATEGORIES_CONFIG.find(c => c.name === name)?.color || '#ccc'
    })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  // 3. Annual Comparison (Last 12 Months)
  const annualTrends = useMemo(() => {
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthKey = d.toLocaleString('default', { month: 'short' });
      const year = d.getFullYear();
      
      const monthData = fullHistory.filter(t => {
        const td = new Date(t.date);
        return td.getMonth() === d.getMonth() && td.getFullYear() === d.getFullYear();
      });

      months.push({
        name: monthKey,
        income: monthData.filter(t => t.type === 'income').reduce((s,t) => s+t.amount, 0),
        expense: monthData.filter(t => t.type === 'expense').reduce((s,t) => s+t.amount, 0),
      });
    }
    return months;
  }, [fullHistory]);

  return (
    <div className="space-y-6">
      {/* Sub-Tabs for Reports */}
      <div className="flex bg-white p-1 rounded-2xl border border-gray-100 w-fit">
        {['category', 'time', 'annual'].map((type) => (
          <button 
            key={type}
            onClick={() => setReportType(type as any)}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              reportType === type ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dynamic Chart Container */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm min-h-[450px] flex flex-col">
          <h3 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2">
            <span>{reportType === 'category' ? 'Spending Share' : reportType === 'time' ? 'Weekly Pulse' : 'Annual Cash Flow'}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
          </h3>

          <div className="flex-1 min-h-0">
            {reportType === 'category' && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={90}
                    outerRadius={125}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => INR_FORMATTER.format(v)} />
                  <Legend verticalAlign="bottom" align="center" iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            )}

            {reportType === 'time' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis hide />
                  <Tooltip cursor={{fill: '#f8fafc'}} formatter={(v: number) => INR_FORMATTER.format(v)} />
                  <Bar dataKey="amount" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}

            {reportType === 'annual' && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={annualTrends}>
                  <defs>
                    <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                  <YAxis hide />
                  <Tooltip formatter={(v: number) => INR_FORMATTER.format(v)} />
                  <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorInc)" strokeWidth={3} />
                  <Area type="monotone" dataKey="expense" stroke="#ef4444" fill="transparent" strokeWidth={3} strokeDasharray="5 5" />
                  <Legend verticalAlign="top" align="right" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Breakdown Table */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <h3 className="text-lg font-black text-gray-800 mb-6">Detailed Bifurcation</h3>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <tr>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-right">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {categoryData.map(item => (
                  <tr key={item.name}>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="font-bold text-gray-700">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right font-black text-gray-900">{INR_FORMATTER.format(item.value)}</td>
                    <td className="px-4 py-4 text-right">
                      <span className="text-xs font-bold text-gray-400">
                        {Math.round((item.value / categoryData.reduce((s,i) => s+i.value, 0)) * 100)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
