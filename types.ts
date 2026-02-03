
export enum Category {
  FOOD = 'Food & Drinks',
  TRANSPORT = 'Transport',
  RENT = 'Rent & Bills',
  SHOPPING = 'Shopping',
  HEALTH = 'Healthcare',
  ENTERTAINMENT = 'Entertainment',
  INVESTMENT = 'Investment',
  SALARY = 'Salary',
  FREELANCE = 'Freelance',
  OTHERS = 'Others'
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: Category;
  type: TransactionType;
  date: string; // ISO string
  notes?: string;
}

export interface Budget {
  category: Category | 'Total';
  limit: number;
}
