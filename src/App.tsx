import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { LoginPage } from './components/auth/LoginPage';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { DashboardView } from './components/views/DashboardView';
import { HistoryView } from './components/views/HistoryView';
import { AnalysisView } from './components/views/AnalysisView';
import { BudgetView } from './components/views/BudgetView';
import { MonthlyReportView } from './components/views/MonthlyReportView';
import { SettingsView } from './components/views/SettingsView';
import { TransactionModal } from './components/transactions/TransactionModal';
import { TransactionDetailModal } from './components/transactions/TransactionDetailModal';
import { DeleteConfirmModal } from './components/transactions/DeleteConfirmModal';
import { Transaction } from './types/finance';
import { CheckCircle2, X, LayoutDashboard, Receipt, BarChart2, Target, Settings as SettingsIcon, Loader2 } from 'lucide-react';
import { formatIDR } from './utils/currency';

function MainApp() {
  const { deleteTransaction, getCategoryById } = useFinance();

  // Navigation State
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Theme State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('dompetku_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Apply dark mode class to root HTML
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('dompetku_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('dompetku_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  // Modals & Inspection State
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [inspectingTransaction, setInspectingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);

  // History filtering props when navigating from cards
  const [historyFilterType, setHistoryFilterType] = useState<'income' | 'outcome' | 'all'>('all');
  const [historyCategoryId, setHistoryCategoryId] = useState<string | undefined>(undefined);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 4000);
  };

  const handleOpenRecordModal = () => {
    setEditingTransaction(null);
    setIsRecordModalOpen(true);
  };

  const handleEditTransaction = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsRecordModalOpen(true);
  };

  const handleTransactionSaved = (tx: Transaction) => {
    const isEdit = !!editingTransaction;
    showToast(
      isEdit
        ? `Transaksi senilai ${formatIDR(tx.amount)} berhasil diperbarui.`
        : `Transaksi baru senilai ${formatIDR(tx.amount)} berhasil dicatat!`
    );
  };

  const handleConfirmDelete = async () => {
    if (deletingTransaction) {
      try {
        await deleteTransaction(deletingTransaction.id);
        showToast('Transaksi berhasil dihapus.');
        setDeletingTransaction(null);
        if (inspectingTransaction?.id === deletingTransaction.id) {
          setInspectingTransaction(null);
        }
      } catch (err: any) {
        showToast(err.message || 'Gagal menghapus transaksi.');
      }
    }
  };

  const handleNavigateToHistory = (filterType: 'income' | 'outcome' | 'all' = 'all', categoryId?: string) => {
    setHistoryFilterType(filterType);
    setHistoryCategoryId(categoryId);
    setActiveTab('history');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navbar */}
      <Navbar
        onOpenRecordModal={handleOpenRecordModal}
        onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />

      {/* Main Shell */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            if (tab === 'record') {
              handleOpenRecordModal();
            } else {
              if (tab === 'history') {
                setHistoryFilterType('all');
                setHistoryCategoryId(undefined);
              }
              setActiveTab(tab);
            }
          }}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Content Viewport */}
        <main className="flex-1 min-w-0 p-3.5 sm:p-5 lg:p-8 pb-20 md:pb-8">
          <ContentRenderer
            activeTab={activeTab}
            handleOpenRecordModal={handleOpenRecordModal}
            handleNavigateToHistory={handleNavigateToHistory}
            handleEditTransaction={handleEditTransaction}
            setInspectingTransaction={setInspectingTransaction}
            setDeletingTransaction={setDeletingTransaction}
            setActiveTab={setActiveTab}
            historyFilterType={historyFilterType}
            historyCategoryId={historyCategoryId}
          />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Phone only: < 768px) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-lg">
        {[
          { id: 'dashboard' as NavTab, label: 'Beranda', icon: LayoutDashboard },
          { id: 'history' as NavTab, label: 'Riwayat', icon: Receipt },
          { id: 'analysis' as NavTab, label: 'Analisis', icon: BarChart2 },
          { id: 'budget' as NavTab, label: 'Anggaran', icon: Target },
          { id: 'settings' as NavTab, label: 'Setelan', icon: SettingsIcon },
        ].map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'history') {
                  setHistoryFilterType('all');
                  setHistoryCategoryId(undefined);
                }
                setActiveTab(item.id);
              }}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-semibold transition-all ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.75px]'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-16 md:bottom-5 right-4 sm:right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xl border border-slate-700 dark:border-slate-300 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 duration-200 max-w-[calc(100vw-2rem)]">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="truncate">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 p-1 hover:opacity-75 transition-opacity shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Record / Edit Transaction Modal */}
      <TransactionModal
        isOpen={isRecordModalOpen}
        onClose={() => {
          setIsRecordModalOpen(false);
          setEditingTransaction(null);
        }}
        editTransaction={editingTransaction}
        onSaved={handleTransactionSaved}
      />

      {/* Transaction Detail Modal */}
      <TransactionDetailModal
        isOpen={!!inspectingTransaction}
        onClose={() => setInspectingTransaction(null)}
        transaction={inspectingTransaction}
        onEdit={(tx) => {
          setInspectingTransaction(null);
          handleEditTransaction(tx);
        }}
        onDelete={(tx) => {
          setInspectingTransaction(null);
          setDeletingTransaction(tx);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingTransaction}
        onClose={() => setDeletingTransaction(null)}
        onConfirm={handleConfirmDelete}
        transaction={deletingTransaction}
        categoryName={
          deletingTransaction
            ? getCategoryById(deletingTransaction.categoryId)?.name
            : undefined
        }
      />
    </div>
  );
}

interface ContentRendererProps {
  activeTab: NavTab;
  handleOpenRecordModal: () => void;
  handleNavigateToHistory: (filterType?: 'income' | 'outcome' | 'all', categoryId?: string) => void;
  handleEditTransaction: (tx: Transaction) => void;
  setInspectingTransaction: (tx: Transaction | null) => void;
  setDeletingTransaction: (tx: Transaction | null) => void;
  setActiveTab: (tab: NavTab) => void;
  historyFilterType: 'income' | 'outcome' | 'all';
  historyCategoryId?: string;
}

function ContentRenderer({
  activeTab,
  handleOpenRecordModal,
  handleNavigateToHistory,
  handleEditTransaction,
  setInspectingTransaction,
  setDeletingTransaction,
  setActiveTab,
  historyFilterType,
  historyCategoryId
}: ContentRendererProps) {
  const { isLoadingData, dataError, refreshData } = useFinance();

  if (isLoadingData) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-3" />
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Memuat data dari cloud Supabase...
        </p>
      </div>
    );
  }

  if (dataError) {
    return (
      <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-center max-w-lg mx-auto my-12">
        <p className="text-sm font-bold text-rose-700 dark:text-rose-300">
          Gagal Memuat Data
        </p>
        <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
          {dataError}
        </p>
        <button
          onClick={() => refreshData()}
          className="mt-4 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-all shadow-xs"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <>
      {activeTab === 'dashboard' && (
        <DashboardView
          onOpenRecordModal={handleOpenRecordModal}
          onNavigateToHistory={handleNavigateToHistory}
          onNavigateToBudgets={() => setActiveTab('budget')}
          onNavigateToSettings={() => setActiveTab('settings')}
          onEditTransaction={handleEditTransaction}
          onSelectTransaction={(tx) => setInspectingTransaction(tx)}
        />
      )}

      {activeTab === 'history' && (
        <HistoryView
          initialFilterType={historyFilterType}
          initialCategoryId={historyCategoryId}
          onOpenRecordModal={handleOpenRecordModal}
          onEditTransaction={handleEditTransaction}
          onSelectTransaction={(tx) => setInspectingTransaction(tx)}
          onDeleteTransaction={(tx) => setDeletingTransaction(tx)}
        />
      )}

      {activeTab === 'analysis' && (
        <AnalysisView
          onNavigateToHistory={handleNavigateToHistory}
        />
      )}

      {activeTab === 'budget' && (
        <BudgetView />
      )}

      {activeTab === 'report' && (
        <MonthlyReportView />
      )}

      {activeTab === 'settings' && (
        <SettingsView />
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user, isLoading } = useAuth();

  // Layar loading awal saat Supabase mengecek sesi aktif
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-slate-100">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-3" />
        <p className="text-xs font-semibold text-slate-400">Memuat sesi pengguna...</p>
      </div>
    );
  }

  // Jika belum login, tampilkan LoginPage (halaman autentikasi Google)
  if (!user) {
    return <LoginPage />;
  }

  // Jika sudah memiliki sesi login aktif, arahkan langsung ke dashboard
  return (
    <FinanceProvider>
      <MainApp />
    </FinanceProvider>
  );
}
