import { Category, Transaction, Budget, BalanceSettings } from '../types/finance';

// ==========================================
// Database row types (snake_case)
// ==========================================

export interface CategoryRow {
  id: string;
  user_id?: string;
  name: string;
  type: 'income' | 'outcome' | 'investment';
  color?: string | null;
  icon_name?: string | null;
  is_default?: boolean | null;
  created_at?: string | null;
}

export interface TransactionRow {
  id: string;
  user_id?: string;
  type: 'income' | 'outcome' | 'investment';
  amount: number | string;
  category_id: string;
  sub_category?: string | null;
  date: string;
  notes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface BudgetRow {
  id: string;
  user_id?: string;
  category_id: string;
  period: string;
  amount: number | string;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface BalanceSettingsRow {
  id?: string;
  user_id?: string;
  initial_balance: number | string;
  start_date: string;
  created_at?: string | null;
  updated_at?: string | null;
}

// ==========================================
// Mappers: Database (snake_case) <-> Frontend (camelCase)
// ==========================================

export const mapCategoryRowToFrontend = (row: CategoryRow): Category => ({
  id: String(row.id),
  name: row.name,
  type: row.type,
  color: row.color || undefined,
  iconName: row.icon_name || undefined,
  isDefault: !!row.is_default
});

export const mapCategoryFrontendToRow = (
  cat: Omit<Category, 'id'> & { id?: string },
  userId: string
): CategoryRow => {
  const row: CategoryRow = {
    id: cat.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `cat-${Date.now()}`),
    user_id: userId,
    name: cat.name,
    type: cat.type,
    color: cat.color || null,
    icon_name: cat.iconName || null,
    is_default: cat.isDefault ?? false
  };
  return row;
};

export const mapTransactionRowToFrontend = (row: TransactionRow): Transaction => ({
  id: String(row.id),
  type: row.type,
  amount: Number(row.amount) || 0,
  categoryId: String(row.category_id),
  subCategory: row.sub_category || undefined,
  date: row.date,
  notes: row.notes || undefined,
  createdAt: row.created_at || new Date().toISOString(),
  updatedAt: row.updated_at || row.created_at || new Date().toISOString()
});

export const mapTransactionFrontendToRow = (
  tx: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'> & { id?: string; createdAt?: string; updatedAt?: string },
  userId: string
): TransactionRow => ({
  id: tx.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `tx-${Date.now()}`),
  user_id: userId,
  type: tx.type,
  amount: Number(tx.amount) || 0,
  category_id: String(tx.categoryId),
  sub_category: tx.subCategory || null,
  date: tx.date,
  notes: tx.notes || null
});

export const mapBudgetRowToFrontend = (row: BudgetRow): Budget => ({
  id: String(row.id),
  categoryId: String(row.category_id),
  period: row.period,
  amount: Number(row.amount) || 0,
  createdAt: row.created_at || undefined,
  updatedAt: row.updated_at || undefined
});

export const mapBudgetFrontendToRow = (
  budget: Omit<Budget, 'id'> & { id?: string },
  userId: string
): BudgetRow => ({
  id: budget.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `b-${Date.now()}`),
  user_id: userId,
  category_id: String(budget.categoryId),
  period: budget.period,
  amount: Number(budget.amount) || 0
});

export const mapBalanceSettingsRowToFrontend = (row: BalanceSettingsRow): BalanceSettings => ({
  initialBalance: Number(row.initial_balance) || 0,
  startDate: row.start_date
});

export const mapBalanceSettingsFrontendToRow = (
  settings: BalanceSettings,
  userId: string
): BalanceSettingsRow => ({
  user_id: userId,
  initial_balance: Number(settings.initialBalance) || 0,
  start_date: settings.startDate
});

