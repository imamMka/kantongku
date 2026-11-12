import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Transaction,
  Category,
  Budget,
  BalanceSettings,
  PeriodSummary,
  CategoryBudgetStatus,
  MonthlyTrendData
} from '../types/finance';
import {
  DEFAULT_CATEGORIES
} from '../data/defaultData';
import { getCurrentPeriod, formatPeriodIndonesian } from '../utils/currency';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import {
  CategoryRow,
  TransactionRow,
  BudgetRow,
  BalanceSettingsRow,
  mapCategoryRowToFrontend,
  mapCategoryFrontendToRow,
  mapTransactionRowToFrontend,
  mapTransactionFrontendToRow,
  mapBudgetRowToFrontend,
  mapBudgetFrontendToRow,
  mapBalanceSettingsRowToFrontend,
  mapBalanceSettingsFrontendToRow
} from '../lib/supabaseMappers';

interface FinanceContextType {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  balanceSettings: BalanceSettings;
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  availablePeriods: string[];
  isLoadingData: boolean;
  dataError: string | null;
  refreshData: () => Promise<void>;
  
  // Transaction CRUD (Async ke Supabase)
  addTransaction: (data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Transaction>;
  updateTransaction: (id: string, data: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  
  // Budget CRUD (Async ke Supabase)
  setBudget: (categoryId: string, period: string, amount: number) => Promise<void>;
  removeBudget: (id: string) => Promise<void>;

  // Category CRUD (Async ke Supabase)
  addCategory: (category: Omit<Category, 'id'>) => Promise<Category>;
  updateCategory: (id: string, data: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<{ success: boolean; message?: string }>;

  // Settings
  updateBalanceSettings: (settings: Partial<BalanceSettings>) => Promise<void>;
  resetToDefaultData: () => Promise<void>;
  clearAllData: () => Promise<void>;
  exportJSON: () => string;
  importJSON: (jsonString: string) => Promise<{ success: boolean; message: string }>;

  // Analytical & Summaries
  getPeriodSummary: (period: string) => PeriodSummary;
  getCategoryBudgetsWithRealization: (period: string) => CategoryBudgetStatus[];
  getInvestmentSubcategoryBreakdown: (period: string) => Array<{ subCategory: string; amount: number; percentage: number }>;
  getMonthlyCashflowTrends: (monthsCount?: number) => MonthlyTrendData[];
  getCategoryById: (id: string) => Category | undefined;
}

const STORAGE_KEYS = {
  ACTIVE_PERIOD: 'dompetku_active_period_v1'
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  // State keuangan akun yang aktif
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [balanceSettings, setBalanceSettings] = useState<BalanceSettings>({
    initialBalance: 0,
    startDate: getCurrentPeriod()
  });

  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [dataError, setDataError] = useState<string | null>(null);

  // LocalStorage hanya untuk preferensi tampilan (active period)
  const [selectedPeriod, setSelectedPeriodState] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_PERIOD);
      return stored || getCurrentPeriod();
    } catch {
      return getCurrentPeriod();
    }
  });

  const setSelectedPeriod = useCallback((period: string) => {
    setSelectedPeriodState(period);
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PERIOD, period);
    } catch {
      // ignore
    }
  }, []);

  // ==========================================
  // Fetch data dari Supabase saat User Login
  // ==========================================
  const loadUserData = useCallback(async (userId: string) => {
    setIsLoadingData(true);
    setDataError(null);

    try {
      // 1. Ambil categories
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (catError) throw new Error(`Gagal memuat kategori: ${catError.message}`);

      let userCategories: Category[] = (catData || []).map((row: CategoryRow) =>
        mapCategoryRowToFrontend(row)
      );

      // Jika user baru belum punya kategori, buatkan kategori awal (DEFAULT_CATEGORIES)
      // tanpa nominal transaksi atau budget bawaan
      if (userCategories.length === 0) {
        const rowsToInsert = DEFAULT_CATEGORIES.map(c => mapCategoryFrontendToRow(c, userId));
        const { data: insertedCats, error: insertError } = await supabase
          .from('categories')
          .insert(rowsToInsert)
          .select();

        if (!insertError && insertedCats) {
          userCategories = insertedCats.map((row: CategoryRow) => mapCategoryRowToFrontend(row));
        } else {
          // Fallback memori jika insert batch gagal
          userCategories = [...DEFAULT_CATEGORIES];
        }
      }

      setCategories(userCategories);

      // 2. Ambil transactions
      const { data: txData, error: txError } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (txError) throw new Error(`Gagal memuat transaksi: ${txError.message}`);
      const userTransactions: Transaction[] = (txData || []).map((row: TransactionRow) =>
        mapTransactionRowToFrontend(row)
      );
      setTransactions(userTransactions);

      // 3. Ambil budgets
      const { data: bgData, error: bgError } = await supabase
        .from('budgets')
        .select('*');

      if (bgError) throw new Error(`Gagal memuat anggaran: ${bgError.message}`);
      const userBudgets: Budget[] = (bgData || []).map((row: BudgetRow) =>
        mapBudgetRowToFrontend(row)
      );
      setBudgets(userBudgets);

      // 4. Ambil balance_settings
      const { data: bsData, error: bsError } = await supabase
        .from('balance_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (bsError) throw new Error(`Gagal memuat pengaturan saldo: ${bsError.message}`);

      if (bsData) {
        setBalanceSettings(mapBalanceSettingsRowToFrontend(bsData as BalanceSettingsRow));
      } else {
        // Default akun baru: initialBalance 0, periode saat ini
        const defaultSettings: BalanceSettings = {
          initialBalance: 0,
          startDate: getCurrentPeriod()
        };
        setBalanceSettings(defaultSettings);
        // Simpan baseline awal ke Supabase
        await supabase
          .from('balance_settings')
          .insert([mapBalanceSettingsFrontendToRow(defaultSettings, userId)]);
      }
    } catch (err: any) {
      console.error('Error saat load data Supabase:', err);
      setDataError(err.message || 'Gagal memuat data dari Supabase.');
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  // Saat user berubah (login / logout / ganti akun)
  useEffect(() => {
    if (user?.id) {
      loadUserData(user.id);
    } else {
      // Logout: Kosongkan seluruh state agar data pengguna sebelumnya tidak tertinggal
      setCategories([]);
      setTransactions([]);
      setBudgets([]);
      setBalanceSettings({ initialBalance: 0, startDate: getCurrentPeriod() });
      setIsLoadingData(false);
      setDataError(null);
    }
  }, [user?.id, loadUserData]);

  const refreshData = useCallback(async () => {
    if (user?.id) {
      await loadUserData(user.id);
    }
  }, [user?.id, loadUserData]);

  // Dynamic available periods (sorted latest first)
  const availablePeriods = useMemo(() => {
    const periodsSet = new Set<string>();
    const current = getCurrentPeriod();
    periodsSet.add(current);

    transactions.forEach(t => {
      if (t.date && t.date.length >= 7) {
        periodsSet.add(t.date.substring(0, 7));
      }
    });

    budgets.forEach(b => {
      if (b.period) {
        periodsSet.add(b.period);
      }
    });

    return Array.from(periodsSet).sort().reverse();
  }, [transactions, budgets]);

  const getCategoryById = useCallback((id: string): Category | undefined => {
    return categories.find(c => c.id === id);
  }, [categories]);

  // Rolling Balance Calculation
  const calculateStartingBalance = useCallback((targetPeriod: string): number => {
    const baseline = balanceSettings.initialBalance || 0;

    let priorNetFlow = 0;
    for (const tx of transactions) {
      const txPeriod = tx.date ? tx.date.substring(0, 7) : '';
      if (txPeriod && txPeriod < targetPeriod) {
        if (tx.type === 'income') {
          priorNetFlow += tx.amount;
        } else if (tx.type === 'outcome' || tx.type === 'investment') {
          priorNetFlow -= tx.amount;
        }
      }
    }

    return baseline + priorNetFlow;
  }, [balanceSettings.initialBalance, transactions]);

  // Get Summary for Period
  const getPeriodSummary = useCallback((period: string): PeriodSummary => {
    const startingBalance = calculateStartingBalance(period);

    let periodIncome = 0;
    let periodOutcome = 0;
    let periodInvestment = 0;
    let count = 0;

    const categoryRealizations: Record<string, number> = {};
    const investmentBreakdown: Record<string, number> = {};

    for (const tx of transactions) {
      const txPeriod = tx.date ? tx.date.substring(0, 7) : '';
      if (txPeriod === period) {
        count++;
        if (tx.type === 'income') {
          periodIncome += tx.amount;
        } else if (tx.type === 'outcome') {
          periodOutcome += tx.amount;
          categoryRealizations[tx.categoryId] = (categoryRealizations[tx.categoryId] || 0) + tx.amount;
        } else if (tx.type === 'investment') {
          periodInvestment += tx.amount;
          const sub = tx.subCategory || 'Lainnya';
          investmentBreakdown[sub] = (investmentBreakdown[sub] || 0) + tx.amount;
        }
      }
    }

    const endingBalance = startingBalance + periodIncome - periodOutcome - periodInvestment;

    let topOutcomeCategory: { category: Category; amount: number; percentage: number } | undefined = undefined;
    if (periodOutcome > 0) {
      let maxAmount = 0;
      let topCatId = '';
      for (const [catId, amount] of Object.entries(categoryRealizations)) {
        if (amount > maxAmount) {
          maxAmount = amount;
          topCatId = catId;
        }
      }
      if (topCatId) {
        const cat = getCategoryById(topCatId);
        if (cat) {
          topOutcomeCategory = {
            category: cat,
            amount: maxAmount,
            percentage: Math.round((maxAmount / periodOutcome) * 100)
          };
        }
      }
    }

    return {
      period,
      startingBalance,
      income: periodIncome,
      outcome: periodOutcome,
      investment: periodInvestment,
      endingBalance,
      transactionCount: count,
      topOutcomeCategory,
      categoryRealizations,
      investmentBreakdown
    };
  }, [calculateStartingBalance, transactions, getCategoryById]);

  // Category Budgets & Realizations
  const getCategoryBudgetsWithRealization = useCallback((period: string): CategoryBudgetStatus[] => {
    const outcomeCategories = categories.filter(c => c.type === 'outcome');
    const periodBudgets = budgets.filter(b => b.period === period);
    const summary = getPeriodSummary(period);

    return outcomeCategories.map(cat => {
      const budgetEntry = periodBudgets.find(b => b.categoryId === cat.id);
      const budgetAmount = budgetEntry ? budgetEntry.amount : 0;
      const realization = summary.categoryRealizations[cat.id] || 0;
      const hasBudget = budgetAmount > 0;
      const remaining = hasBudget ? budgetAmount - realization : 0;
      const percentage = hasBudget ? Math.round((realization / budgetAmount) * 100) : 0;
      const isOverBudget = hasBudget && realization > budgetAmount;

      return {
        category: cat,
        budgetAmount,
        hasBudget,
        realization,
        remaining,
        percentage,
        isOverBudget
      };
    });
  }, [categories, budgets, getPeriodSummary]);

  // Investment subcategory breakdown
  const getInvestmentSubcategoryBreakdown = useCallback((period: string): Array<{ subCategory: string; amount: number; percentage: number }> => {
    const summary = getPeriodSummary(period);
    const total = summary.investment;
    if (total <= 0) return [];

    return Object.entries(summary.investmentBreakdown)
      .map(([subCategory, amount]) => ({
        subCategory,
        amount,
        percentage: Math.round((amount / total) * 100)
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [getPeriodSummary]);

  // Monthly trends for analysis
  const getMonthlyCashflowTrends = useCallback((monthsCount = 6): MonthlyTrendData[] => {
    const all = [...availablePeriods].reverse();
    const slicePeriods = all.slice(-monthsCount);

    return slicePeriods.map(p => {
      const summary = getPeriodSummary(p);
      return {
        period: p,
        label: formatPeriodIndonesian(p, true),
        income: summary.income,
        outcome: summary.outcome,
        investment: summary.investment,
        netSavings: summary.income - summary.outcome,
        endingBalance: summary.endingBalance
      };
    });
  }, [availablePeriods, getPeriodSummary]);

  // ==========================================
  // Transaction CRUD handlers (Supabase + State)
  // ==========================================
  const addTransaction = useCallback(async (
    data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Transaction> => {
    if (!user) throw new Error('Pengguna belum login.');

    const row = mapTransactionFrontendToRow(data, user.id);
    const { data: inserted, error } = await supabase
      .from('transactions')
      .insert([row])
      .select()
      .single();

    if (error) {
      console.error('Gagal menambah transaksi ke Supabase:', error);
      throw new Error(`Gagal menyimpan transaksi: ${error.message}`);
    }

    const createdTx = mapTransactionRowToFrontend(inserted as TransactionRow);
    setTransactions(prev => [createdTx, ...prev]);
    return createdTx;
  }, [user]);

  const updateTransaction = useCallback(async (id: string, data: Partial<Transaction>): Promise<void> => {
    if (!user) throw new Error('Pengguna belum login.');

    const updatePayload: Partial<TransactionRow> = {};
    if (data.type !== undefined) updatePayload.type = data.type;
    if (data.amount !== undefined) updatePayload.amount = Number(data.amount);
    if (data.categoryId !== undefined) updatePayload.category_id = data.categoryId;
    if (data.subCategory !== undefined) updatePayload.sub_category = data.subCategory || null;
    if (data.date !== undefined) updatePayload.date = data.date;
    if (data.notes !== undefined) updatePayload.notes = data.notes || null;
    updatePayload.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('transactions')
      .update(updatePayload)
      .eq('id', id);

    if (error) {
      console.error('Gagal update transaksi ke Supabase:', error);
      throw new Error(`Gagal memperbarui transaksi: ${error.message}`);
    }

    const now = new Date().toISOString();
    setTransactions(prev =>
      prev.map(tx => (tx.id === id ? { ...tx, ...data, updatedAt: now } : tx))
    );
  }, [user]);

  const deleteTransaction = useCallback(async (id: string): Promise<void> => {
    if (!user) throw new Error('Pengguna belum login.');

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Gagal hapus transaksi di Supabase:', error);
      throw new Error(`Gagal menghapus transaksi: ${error.message}`);
    }

    setTransactions(prev => prev.filter(tx => tx.id !== id));
  }, [user]);

  // ==========================================
  // Budget CRUD handlers (Supabase + State)
  // ==========================================
  const setBudget = useCallback(async (categoryId: string, period: string, amount: number): Promise<void> => {
    if (!user) throw new Error('Pengguna belum login.');

    const existing = budgets.find(b => b.categoryId === categoryId && b.period === period);

    if (existing) {
      const { error } = await supabase
        .from('budgets')
        .update({
          amount: Number(amount),
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);

      if (error) {
        console.error('Gagal update anggaran ke Supabase:', error);
        throw new Error(`Gagal menyimpan anggaran: ${error.message}`);
      }

      setBudgets(prev =>
        prev.map(b => (b.id === existing.id ? { ...b, amount, updatedAt: new Date().toISOString() } : b))
      );
    } else {
      const newBudgetRow = mapBudgetFrontendToRow(
        { categoryId, period, amount },
        user.id
      );

      const { data: inserted, error } = await supabase
        .from('budgets')
        .insert([newBudgetRow])
        .select()
        .single();

      if (error) {
        console.error('Gagal tambah anggaran ke Supabase:', error);
        throw new Error(`Gagal membuat anggaran: ${error.message}`);
      }

      const createdBudget = mapBudgetRowToFrontend(inserted as BudgetRow);
      setBudgets(prev => [...prev, createdBudget]);
    }
  }, [user, budgets]);

  const removeBudget = useCallback(async (id: string): Promise<void> => {
    if (!user) throw new Error('Pengguna belum login.');

    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Gagal hapus anggaran di Supabase:', error);
      throw new Error(`Gagal menghapus anggaran: ${error.message}`);
    }

    setBudgets(prev => prev.filter(b => b.id !== id));
  }, [user]);

  // ==========================================
  // Category CRUD handlers (Supabase + State)
  // ==========================================
  const addCategory = useCallback(async (categoryData: Omit<Category, 'id'>): Promise<Category> => {
    if (!user) throw new Error('Pengguna belum login.');

    const row = mapCategoryFrontendToRow(categoryData, user.id);
    const { data: inserted, error } = await supabase
      .from('categories')
      .insert([row])
      .select()
      .single();

    if (error) {
      console.error('Gagal tambah kategori ke Supabase:', error);
      throw new Error(`Gagal membuat kategori: ${error.message}`);
    }

    const createdCat = mapCategoryRowToFrontend(inserted as CategoryRow);
    setCategories(prev => [...prev, createdCat]);
    return createdCat;
  }, [user]);

  const updateCategory = useCallback(async (id: string, data: Partial<Category>): Promise<void> => {
    if (!user) throw new Error('Pengguna belum login.');

    const updatePayload: Partial<CategoryRow> = {};
    if (data.name !== undefined) updatePayload.name = data.name;
    if (data.color !== undefined) updatePayload.color = data.color || null;
    if (data.iconName !== undefined) updatePayload.icon_name = data.iconName || null;

    const { error } = await supabase
      .from('categories')
      .update(updatePayload)
      .eq('id', id);

    if (error) {
      console.error('Gagal update kategori di Supabase:', error);
      throw new Error(`Gagal memperbarui kategori: ${error.message}`);
    }

    setCategories(prev =>
      prev.map(c => (c.id === id ? { ...c, ...data } : c))
    );
  }, [user]);

  const deleteCategory = useCallback(async (id: string): Promise<{ success: boolean; message?: string }> => {
    if (!user) throw new Error('Pengguna belum login.');

    const inUse = transactions.some(t => t.categoryId === id);
    if (inUse) {
      return {
        success: false,
        message: 'Kategori tidak dapat dihapus karena sudah memiliki catatan transaksi.'
      };
    }

    // Hapus juga budget terkait kategori ini jika ada
    await supabase.from('budgets').delete().eq('category_id', id);

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Gagal hapus kategori di Supabase:', error);
      return {
        success: false,
        message: `Gagal menghapus kategori: ${error.message}`
      };
    }

    setCategories(prev => prev.filter(c => c.id !== id));
    setBudgets(prev => prev.filter(b => b.categoryId !== id));
    return { success: true };
  }, [user, transactions]);

  // ==========================================
  // Settings & Reset
  // ==========================================
  const updateBalanceSettings = useCallback(async (settings: Partial<BalanceSettings>): Promise<void> => {
    if (!user) throw new Error('Pengguna belum login.');

    const newSettings: BalanceSettings = {
      ...balanceSettings,
      ...settings
    };

    // Upsert balance_settings untuk user saat ini
    const row = mapBalanceSettingsFrontendToRow(newSettings, user.id);
    const { error } = await supabase
      .from('balance_settings')
      .upsert([row], { onConflict: 'user_id' });

    if (error) {
      console.error('Gagal update saldo awal di Supabase:', error);
      throw new Error(`Gagal menyimpan saldo awal: ${error.message}`);
    }

    setBalanceSettings(newSettings);
  }, [user, balanceSettings]);

  const resetToDefaultData = useCallback(async (): Promise<void> => {
    if (!user) throw new Error('Pengguna belum login.');

    // Reset kategori ke default categories
    const rowsToInsert = DEFAULT_CATEGORIES.map(c => mapCategoryFrontendToRow(c, user.id));
    await supabase.from('categories').delete().eq('user_id', user.id);
    await supabase.from('categories').insert(rowsToInsert);

    // Kosongkan transaksi & anggaran
    await supabase.from('transactions').delete().eq('user_id', user.id);
    await supabase.from('budgets').delete().eq('user_id', user.id);

    const newBalance: BalanceSettings = { initialBalance: 0, startDate: getCurrentPeriod() };
    await updateBalanceSettings(newBalance);

    await loadUserData(user.id);
  }, [user, updateBalanceSettings, loadUserData]);

  const clearAllData = useCallback(async (): Promise<void> => {
    if (!user) throw new Error('Pengguna belum login.');

    await supabase.from('transactions').delete().eq('user_id', user.id);
    await supabase.from('budgets').delete().eq('user_id', user.id);

    const newBalance: BalanceSettings = { initialBalance: 0, startDate: getCurrentPeriod() };
    await updateBalanceSettings(newBalance);

    setTransactions([]);
    setBudgets([]);
    setBalanceSettings(newBalance);
  }, [user, updateBalanceSettings]);

  // ==========================================
  // Backup & Import
  // ==========================================
  const exportJSON = useCallback((): string => {
    const exportObject = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      userId: user?.id || null,
      userEmail: user?.email || null,
      balanceSettings,
      categories,
      budgets,
      transactions
    };
    return JSON.stringify(exportObject, null, 2);
  }, [user, balanceSettings, categories, budgets, transactions]);

  const importJSON = useCallback(async (jsonString: string): Promise<{ success: boolean; message: string }> => {
    if (!user) {
      return { success: false, message: 'Anda harus login untuk mengimpor data ke cloud.' };
    }

    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed.transactions) || !Array.isArray(parsed.categories)) {
        return { success: false, message: 'Format berkas JSON tidak sesuai spesifikasi DompetKu.' };
      }

      // Validasi awal selesai, simpan ke Supabase tanpa menghapus state sebelum berhasil
      // 1. Kategorisasi: Masukkan kategori baru yang belum ada di database
      const existingCatIds = new Set(categories.map(c => c.id));
      const existingCatNames = new Set(categories.map(c => `${c.name.toLowerCase()}_${c.type}`));
      const newCategoryRows: CategoryRow[] = [];
      const categoryIdMap: Record<string, string> = {}; // map oldId -> newId

      for (const cat of parsed.categories) {
        const key = `${cat.name.toLowerCase()}_${cat.type}`;
        const match = categories.find(c => `${c.name.toLowerCase()}_${c.type}` === key);
        if (match) {
          categoryIdMap[cat.id] = match.id;
        } else {
          const row = mapCategoryFrontendToRow(cat, user.id);
          categoryIdMap[cat.id] = row.id;
          newCategoryRows.push(row);
        }
      }

      if (newCategoryRows.length > 0) {
        const { error: catErr } = await supabase.from('categories').insert(newCategoryRows);
        if (catErr) throw new Error(`Gagal mengimpor kategori: ${catErr.message}`);
      }

      // 2. Transaksi: Hindari duplikasi jika id transaksi sudah ada
      const existingTxIds = new Set(transactions.map(t => t.id));
      const newTxRows: TransactionRow[] = [];

      for (const tx of parsed.transactions) {
        if (!existingTxIds.has(tx.id)) {
          const mappedCatId = categoryIdMap[tx.categoryId] || tx.categoryId;
          const txRow = mapTransactionFrontendToRow(
            { ...tx, categoryId: mappedCatId },
            user.id
          );
          newTxRows.push(txRow);
        }
      }

      if (newTxRows.length > 0) {
        const { error: txErr } = await supabase.from('transactions').insert(newTxRows);
        if (txErr) throw new Error(`Gagal mengimpor transaksi: ${txErr.message}`);
      }

      // 3. Budgets: Masukkan atau update
      if (Array.isArray(parsed.budgets)) {
        const newBudgetRows: BudgetRow[] = [];
        for (const b of parsed.budgets) {
          const mappedCatId = categoryIdMap[b.categoryId] || b.categoryId;
          newBudgetRows.push(mapBudgetFrontendToRow({ ...b, categoryId: mappedCatId }, user.id));
        }
        if (newBudgetRows.length > 0) {
          await supabase.from('budgets').upsert(newBudgetRows, { onConflict: 'user_id, category_id, period' });
        }
      }

      // 4. Balance Settings
      if (parsed.balanceSettings) {
        await updateBalanceSettings(parsed.balanceSettings);
      }

      // Refresh seluruh data terbaru dari cloud setelah impor tuntas
      await loadUserData(user.id);

      return {
        success: true,
        message: `Data berhasil diimpor ke Supabase: ${newTxRows.length} transaksi baru, ${newCategoryRows.length} kategori baru.`
      };
    } catch (err: any) {
      console.error('Gagal importJSON:', err);
      return { success: false, message: `Gagal membaca atau menyimpan data JSON: ${err.message}` };
    }
  }, [user, categories, transactions, updateBalanceSettings, loadUserData]);

  const value = useMemo(() => ({
    transactions,
    categories,
    budgets,
    balanceSettings,
    selectedPeriod,
    setSelectedPeriod,
    availablePeriods,
    isLoadingData,
    dataError,
    refreshData,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setBudget,
    removeBudget,
    addCategory,
    updateCategory,
    deleteCategory,
    updateBalanceSettings,
    resetToDefaultData,
    clearAllData,
    exportJSON,
    importJSON,
    getPeriodSummary,
    getCategoryBudgetsWithRealization,
    getInvestmentSubcategoryBreakdown,
    getMonthlyCashflowTrends,
    getCategoryById
  }), [
    transactions,
    categories,
    budgets,
    balanceSettings,
    selectedPeriod,
    setSelectedPeriod,
    availablePeriods,
    isLoadingData,
    dataError,
    refreshData,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setBudget,
    removeBudget,
    addCategory,
    updateCategory,
    deleteCategory,
    updateBalanceSettings,
    resetToDefaultData,
    clearAllData,
    exportJSON,
    importJSON,
    getPeriodSummary,
    getCategoryBudgetsWithRealization,
    getInvestmentSubcategoryBreakdown,
    getMonthlyCashflowTrends,
    getCategoryById
  ]);

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
