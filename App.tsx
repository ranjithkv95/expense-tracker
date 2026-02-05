
import React, { useState, useMemo } from 'react';
import Layout from './components/Layout';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import BudgetPanel from './components/BudgetPanel';
import AIFeedback from './components/AIFeedback';
import Analytics from './components/Analytics';
import { useStore } from './store/useStore';

type Tab = 'transactions' | 'analytics' | 'budgets' | 'insights';

const App: React.FC = () => {
  const { 
    currentUser,
    loading,
    login,
    signup,
    logout,
    requestPasswordReset,
    loginWithGoogle,
    transactions, 
    budgets, 
    addTransaction, 
    deleteTransaction, 
    updateTransaction,
    updateBudget 
  } = useStore();

  const [activeTab, setActiveTab] = useState<Tab>('transactions');
  const [currentDate, setCurrentDate] = useState(new Date());

  const filteredData = useMemo(() => {
    return transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
    });
  }, [transactions, currentDate]);

  const tabs = [
    { id: 'transactions', label: 'Journal', icon: '📝' },
    { id: 'analytics', label: 'Reports', icon: '📈' },
    { id: 'budgets', label: 'Limits', icon: '🛡️' },
    { id: 'insights', label: 'AI Advisor', icon: '🤖' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-bold animate-pulse">Syncing RupeeFlow...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <Auth 
        onLogin={login} 
        onSignup={signup} 
        onForgotPass={requestPasswordReset}
        onGoogleLogin={loginWithGoogle}
      />
    );
  }

  return (
    <Layout 
      currentDate={currentDate} 
      onDateChange={setCurrentDate}
      user={currentUser}
      onLogout={logout}
    >
      <div className="space-y-6">
        <div className="flex items-center space-x-1 bg-gray-100 p-1.5 rounded-2xl w-fit mx-auto sm:mx-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="animate-in fade-in slide-in-from-top-2 duration-500">
          {activeTab === 'transactions' && (
            <Dashboard 
              transactions={filteredData} 
              allTransactions={transactions} 
              onAdd={addTransaction} 
              onUpdate={updateTransaction}
              onDelete={deleteTransaction}
            />
          )}
          {activeTab === 'analytics' && (
            <Analytics transactions={filteredData} fullHistory={transactions} />
          )}
          {activeTab === 'budgets' && (
            <BudgetPanel 
              budgets={budgets} 
              expenses={filteredData} 
              onUpdateBudget={updateBudget} 
            />
          )}
          {activeTab === 'insights' && (
            <AIFeedback 
              expenses={filteredData} 
              budgets={budgets} 
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default App;
