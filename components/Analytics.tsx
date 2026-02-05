
import React, { useMemo, useState } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts';
import { Transaction } from '../types';
import { CATEGORIES_CONFIG, INR_FORMATTER } from '../constants';

interface Props {
  transactions: Transaction[]; 
  fullHistory: Transaction[]; 
  viewingYear: number;
}

const Analytics: React.FC<Props> = ({ transactions, fullHistory, viewingYear }) => {
  const [reportType, setReportType] = useState<'category' | 'time' | 'annual'>('category');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState('all');

  // Logic to determine which dataset to use based on report level
  const baseData = useMemo(() => {
    if (reportType === 'annual') {
      return fullHistory.filter(t => new Date(t.date).getFullYear() === viewingYear);
    }
    return transactions;
  }, [reportType, fullHistory, transactions, viewingYear]);

  const filteredTransactions = useMemo(() => {
    return baseData.filter(t => {
      const matchType = filterType === 'all' || t.type === filterType;
      const matchCat = filterCategory === 'all' || t.category === filterCategory;
      return matchType && matchCat;
    });
  }, [baseData, filterType, filterCategory]);

  const weeklyData = useMemo(() => {
    const weeks: Record<string, number> = { 'Week 1': 0, 'Week 2': 0, 'Week 3': 0, 'Week 4': 0, 'Week 5+': 0 };
    filteredTransactions.forEach(t => {
      const day = new Date(t.date).getDate();
      if (day <= 7) weeks['Week 1'] += t.amount;
      else if (day <= 14) weeks['Week 2'] += t.amount;
      else if (day <= 21) weeks['Week 3'] += t.amount;
      else if (day <= 28) weeks['Week 4'] += t.amount;
      else weeks['Week 5+'] += t.amount;
    });
    return Object.entries(weeks).map(([name, amount]) => ({ name, amount }));
  }, [filteredTransactions]);

  const categoryData = useMemo(() => {
    const grouped = filteredTransactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    return (Object.entries(grouped) as [string, number][]).map(([name, value]): { name: string; value: number; color: string } => ({
      name,
      value,
      color: CATEGORIES_CONFIG.find(c => c.name === name)?.color || '#ccc'
    })).sort((a, b) => b.value - a.value);
  }, [filteredTransactions]);

  const annualTrends = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months.map((month, idx) => {
      const monthData = fullHistory.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === idx && d.getFullYear() === viewingYear;
      });

      return {
        name: month,
        income: monthData.filter(t => t.type === 'income').reduce((s,t) => s+t.amount, 0),
        expense: monthData.filter(t => t.type === 'expense').reduce((s,t) => s+t.amount, 0),
      };
    });
  }, [fullHistory, viewingYear]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex bg-gray-50 p-1.5 rounded-2xl">
          {['category', 'time', 'annual'].map((type) => (
            <button 
              key={type}
              onClick={() => setReportType(type as any)}
              className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                reportType === type ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-2 bg-gray-50 rounded-xl text-xs font-bold text-gray-500 outline-none hover:bg-gray-100 transition-colors"
          >
            <option value="all">All Flow Types</option>
            <option value="income">Income Only</option>
            <option value="expense">Expenses Only</option>
          </select>
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 bg-gray-50 rounded-xl text-xs font-bold text-gray-500 outline-none hover:bg-gray-100 transition-colors"
          >
            <option value="all">All Categories</option>
            {CATEGORIES_CONFIG.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm min-h-[500px] flex flex-col">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-2xl font-black text-gray-900 capitalize">
                {reportType === 'category' ? 'Categorical Contribution' : reportType === 'time' ? 'Monthly Velocity' : 'Yearly Financial Trend'}
              </h3>
              <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-[0.2em]">
                {reportType === 'annual' ? `Full visibility of ${viewingYear}` : 'Drill-down insights for the selected period'}
              </p>
            </div>
          </div>

          <div className="flex-1 min-h-0">
            {reportType === 'category' && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={100}
                    outerRadius={140}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                    formatter={(v: number) => [INR_FORMATTER.format(v), 'Total']}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            )}

            {reportType === 'time' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: '700'}} dy={10} />
                  <YAxis hide />
                  <Tooltip cursor={{fill: '#f8fafc'}} formatter={(v: number) => INR_FORMATTER.format(v)} />
                  <Bar dataKey="amount" fill="#6366f1" radius={[12, 12, 4, 4]} barSize={50} />
                </BarChart>
              </ResponsiveContainer>
            )}

            {reportType === 'annual' && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={annualTrends}>
                  <defs>
                    <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: '700'}} />
                  <YAxis hide />
                  <Tooltip formatter={(v: number) => INR_FORMATTER.format(v)} />
                  <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="transparent" strokeWidth={4} />
                  <Area type="monotone" dataKey="expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorTrend)" strokeWidth={4} />
                  <Legend verticalAlign="top" align="right" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-xl font-black text-gray-900 mb-2">Detailed Ledger</h3>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8">Raw contribution breakdown</p>
          <div className="flex-1 overflow-y-auto pr-2 space-y-6">
            {categoryData.length === 0 ? (
              <div className="text-center py-20 text-gray-300 text-sm italic font-medium">No split data found</div>
            ) : (
              categoryData.map(item => {
                const total = categoryData.reduce((s,i) => s+i.value, 0);
                const percent = total > 0 ? Math.round((item.value / total) * 100) : 0;
                return (
                  <div key={item.name} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="font-black text-gray-700 text-sm">{item.name}</span>
                      </div>
                      <span className="font-black text-gray-900">{INR_FORMATTER.format(item.value)}</span>
                    </div>
                    <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full transition-all duration-1000" 
                        style={{ 
                          backgroundColor: item.color, 
                          width: `${percent}%` 
                        }} 
                      />
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {percent}% share
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
