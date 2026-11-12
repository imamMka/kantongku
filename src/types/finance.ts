export type TransactionType = 'income' | 'outcome' | 'investment';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color?: string;
  iconName?: string;
  isDefault?: boolean;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  subCategory?: string; // e.g., 'Emergency Fund', 'RDPU' for investment
  date: string; // YYYY-MM-DD
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  period: string; // YYYY-MM
  amount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BalanceSettings {
  initialBalance: number;
  startDate: string; // YYYY-MM
}

export interface PeriodSummary {
  period: string; // YYYY-MM
  startingBalance: number;
  income: number;
  outcome: number;
  investment: number;
  endingBalance: number;
  transactionCount: number;
  topOutcomeCategory?: {
    category: Category;
    amount: number;
    percentage: number;
  };
  categoryRealizations: Record<string, number>;
  investmentBreakdown: Record<string, number>;
}

export interface CategoryBudgetStatus {
  category: Category;
  budgetAmount: number;
  hasBudget: boolean;
  realization: number;
  remaining: number;
  percentage: number;
  isOverBudget: boolean;
}

export interface MonthlyTrendData {
  period: string;
  label: string;
  income: number;
  outcome: number;
  investment: number;
  netSavings: number;
  endingBalance: number;
}
