
import { useState, useEffect, useCallback } from 'react';
import { Transaction, Category, Budget } from '../types';
import { INITIAL_TRANSACTIONS } from '../constants';

export const useStore = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('rf_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem('rf_budgets');
    return saved ? JSON.parse(saved) : [{ category: 'Total', limit: 50000 }];
  });

  useEffect(() => {
    localStorage.setItem('rf_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('rf_budgets', JSON.stringify(budgets));
  }, [budgets]);

  const addTransaction = useCallback((t: Omit<Transaction, 'id'>) => {
    const newEntry = { ...t, id: crypto.randomUUID() };
    setTransactions(prev => [newEntry, ...prev]);
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const updateTransaction = useCallback((updated: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === updated.id ? updated : t));
  }, []);

  const updateBudget = useCallback((category: Category | 'Total', limit: number) => {
    setBudgets(prev => {
      const existing = prev.find(b => b.category === category);
      if (existing) {
        return prev.map(b => b.category === category ? { ...b, limit } : b);
      }
      return [...prev, { category, limit }];
    });
  }, []);

  return {
    transactions,
    budgets,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    updateBudget
  };
};
