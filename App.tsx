
import React, { useState, useMemo } from 'react';
import Layout from './components/Layout';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import AIFeedback from './components/AIFeedback';
import Analytics from './components/Analytics';
import { useStore } from './store/useStore';

type Tab = 'transactions' | 'analytics' | 'insights';

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
    addTransaction, 
    deleteTransaction, 
    updateTransaction
  } = useStore();

  const [activeTab, setActiveTab] = useState<Tab>('transactions');
  const [currentDate, setCurrentDate] = useState(new Date());

  const filteredByMonth = useMemo(() => {
    return transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
    });
  }, [transactions, currentDate]);

  const tabs = [
    { id: 'transactions', label: 'Cash flow', icon: '📝' },
    { id: 'analytics', label: 'Reports', icon: '📈' },
    { id: 'insights', label: 'AI Strategy', icon: '🤖' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-bold animate-pulse uppercase tracking-[0.2em] text-xs">Syncing RupeeFlow...</p>
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
        <div className="flex items-center space-x-1 bg-white p-1.5 rounded-2xl w-fit mx-auto sm:mx-0 shadow-sm border border-gray-100">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
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
              transactions={filteredByMonth} 
              allTransactions={transactions} 
              onAdd={addTransaction} 
              onUpdate={updateTransaction}
              onDelete={deleteTransaction}
            />
          )}
          {activeTab === 'analytics' && (
            <Analytics 
              transactions={filteredByMonth} 
              fullHistory={transactions} 
              viewingYear={currentDate.getFullYear()}
            />
          )}
          {activeTab === 'insights' && (
            <AIFeedback 
              expenses={filteredByMonth} 
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default App;
