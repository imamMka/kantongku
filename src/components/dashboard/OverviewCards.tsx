import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatIDR } from '../../utils/currency';
import { Wallet, TrendingUp, TrendingDown, Layers, ArrowUpRight, ChevronRight } from 'lucide-react';
import { BalanceBreakdownModal } from './BalanceBreakdownModal';

interface OverviewCardsProps {
  onNavigateToHistory: (filterType?: 'income' | 'outcome' | 'all') => void;
  onNavigateToSettings: () => void;
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({
  onNavigateToHistory,
  onNavigateToSettings
}) => {
  const { selectedPeriod, getPeriodSummary } = useFinance();
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);

  const summary = getPeriodSummary(selectedPeriod);
  const netSavings = summary.income - summary.outcome;

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Saldo */}
        <button
          type="button"
          onClick={() => setIsBalanceModalOpen(true)}
          className="group text-left p-3.5 sm:p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 hover:shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">
              Saldo Akhir
            </span>
            <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform shrink-0">
              <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3">
            <div className="font-mono text-base sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums truncate">
              {formatIDR(summary.endingBalance)}
            </div>
            <div className="mt-1.5 sm:mt-2 flex items-center justify-between text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              <span className="truncate">Awal: {formatIDR(summary.startingBalance, { compact: true })}</span>
              <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-medium shrink-0 ml-1">
                Rincian
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>
        </button>

        {/* Card 2: Income */}
        <button
          type="button"
          onClick={() => onNavigateToHistory('income')}
          className="group text-left p-3.5 sm:p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 hover:shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
              Pemasukan
            </span>
            <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform shrink-0">
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3">
            <div className="font-mono text-base sm:text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums truncate">
              +{formatIDR(summary.income)}
            </div>
            <div className="mt-1.5 sm:mt-2 flex items-center justify-between text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              <span className="truncate">Arus masuk</span>
              <span className="inline-flex items-center gap-0.5 text-slate-600 dark:text-slate-300 font-medium shrink-0 ml-1">
                Lihat
                <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>
        </button>

        {/* Card 3: Outcome */}
        <button
          type="button"
          onClick={() => onNavigateToHistory('outcome')}
          className="group text-left p-3.5 sm:p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-rose-500/50 dark:hover:border-rose-500/50 hover:shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
              Pengeluaran
            </span>
            <div className="p-1.5 sm:p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 group-hover:scale-105 transition-transform shrink-0">
              <TrendingDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3">
            <div className="font-mono text-base sm:text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400 tabular-nums truncate">
              −{formatIDR(summary.outcome)}
            </div>
            <div className="mt-1.5 sm:mt-2 flex items-center justify-between text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              <span className="truncate">Konsumsi</span>
              <span className="inline-flex items-center gap-0.5 text-slate-600 dark:text-slate-300 font-medium shrink-0 ml-1">
                Lihat
                <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>
        </button>

        {/* Card 4: Jumlah Transaksi */}
        <button
          type="button"
          onClick={() => onNavigateToHistory('all')}
          className="group text-left p-3.5 sm:p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
              Jumlah Transaksi
            </span>
            <div className="p-1.5 sm:p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:scale-105 transition-transform shrink-0">
              <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3">
            <div className="font-mono text-base sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
              {summary.transactionCount}
              <span className="text-xs sm:text-sm font-normal text-slate-500 dark:text-slate-400 ml-1.5">
                catatan
              </span>
            </div>
            <div className="mt-1.5 sm:mt-2 flex items-center justify-between text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              <span className="truncate">Sisa: {formatIDR(netSavings, { compact: true })}</span>
              <span className="inline-flex items-center gap-0.5 text-slate-600 dark:text-slate-300 font-medium shrink-0 ml-1">
                Riwayat
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>
        </button>
      </div>

      <BalanceBreakdownModal
        isOpen={isBalanceModalOpen}
        onClose={() => setIsBalanceModalOpen(false)}
        onNavigateToSettings={onNavigateToSettings}
      />
    </>
  );
};
