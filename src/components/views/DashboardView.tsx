import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { OverviewCards } from '../dashboard/OverviewCards';
import { TopOutcomeCard } from '../dashboard/TopOutcomeCard';
import { BudgetSummaryWidget } from '../dashboard/BudgetSummaryWidget';
import { InvestmentSummaryWidget } from '../dashboard/InvestmentSummaryWidget';
import { DashboardCharts } from '../dashboard/DashboardCharts';
import { RecentTransactionsWidget } from '../dashboard/RecentTransactionsWidget';
import { Transaction } from '../../types/finance';
import { formatPeriodIndonesian } from '../../utils/currency';
import { PlusCircle, Sparkles } from 'lucide-react';

interface DashboardViewProps {
  onOpenRecordModal: () => void;
  onNavigateToHistory: (filterType?: 'income' | 'outcome' | 'all', categoryId?: string) => void;
  onNavigateToBudgets: () => void;
  onNavigateToSettings: () => void;
  onEditTransaction: (tx: Transaction) => void;
  onSelectTransaction: (tx: Transaction) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenRecordModal,
  onNavigateToHistory,
  onNavigateToBudgets,
  onNavigateToSettings,
  onEditTransaction,
  onSelectTransaction
}) => {
  const { selectedPeriod } = useFinance();

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Dashboard Keuangan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Ringkasan mutasi kas, anggaran konsumsi, dan alokasi investasi periode{' '}
            <strong className="text-slate-700 dark:text-slate-200">
              {formatPeriodIndonesian(selectedPeriod)}
            </strong>
          </p>
        </div>

        <button
          onClick={onOpenRecordModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-xs active:scale-95 sm:self-auto self-start"
        >
          <PlusCircle className="w-4 h-4" />
          Tambah Transaksi Baru
        </button>
      </div>

      {/* 4 Overview Cards */}
      <OverviewCards
        onNavigateToHistory={(filterType) => onNavigateToHistory(filterType)}
        onNavigateToSettings={onNavigateToSettings}
      />

      {/* Top Outcome Category Spotlight */}
      <TopOutcomeCard
        onRecordTransaction={onOpenRecordModal}
        onViewCategoryHistory={(catId) => onNavigateToHistory('outcome', catId)}
      />

      {/* Main Grid: Charts & Budget Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <DashboardCharts
            onCategoryClick={(catId) => onNavigateToHistory('outcome', catId)}
          />
        </div>
        <div className="lg:col-span-5">
          <BudgetSummaryWidget
            onNavigateToBudgets={onNavigateToBudgets}
            onSetBudgetForCategory={() => onNavigateToBudgets()}
          />
        </div>
      </div>

      {/* Investment Allocation Row */}
      <InvestmentSummaryWidget
        onRecordInvestment={onOpenRecordModal}
        onViewInvestmentHistory={() => onNavigateToHistory('all')}
      />

      {/* Recent Activity List */}
      <RecentTransactionsWidget
        onViewAll={() => onNavigateToHistory('all')}
        onEditTransaction={onEditTransaction}
        onSelectTransaction={onSelectTransaction}
      />
    </div>
  );
};
