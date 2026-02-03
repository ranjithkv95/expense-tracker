
import { Category } from './types';

export const CATEGORIES_CONFIG = [
  { name: Category.FOOD, color: '#f87171', icon: '🍔', type: 'expense' },
  { name: Category.TRANSPORT, color: '#60a5fa', icon: '🚗', type: 'expense' },
  { name: Category.RENT, color: '#fbbf24', icon: '🏠', type: 'expense' },
  { name: Category.SHOPPING, color: '#818cf8', icon: '🛍️', type: 'expense' },
  { name: Category.HEALTH, color: '#34d399', icon: '💊', type: 'expense' },
  { name: Category.ENTERTAINMENT, color: '#f472b6', icon: '🎬', type: 'expense' },
  { name: Category.INVESTMENT, color: '#a78bfa', icon: '📈', type: 'expense' },
  { name: Category.SALARY, color: '#10b981', icon: '💰', type: 'income' },
  { name: Category.FREELANCE, color: '#3b82f6', icon: '💻', type: 'income' },
  { name: Category.OTHERS, color: '#94a3b8', icon: '📦', type: 'both' },
];

export const INR_FORMATTER = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export const INITIAL_TRANSACTIONS: any[] = [
  { id: '1', title: 'Monthly Salary', amount: 85000, category: Category.SALARY, type: 'income', date: new Date().toISOString() },
  { id: '2', title: 'Apartment Rent', amount: 18000, category: Category.RENT, type: 'expense', date: new Date().toISOString() },
  { id: '3', title: 'Zomato Dinner', amount: 850, category: Category.FOOD, type: 'expense', date: new Date().toISOString() },
];
