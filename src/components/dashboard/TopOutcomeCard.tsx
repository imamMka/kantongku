import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatIDR } from '../../utils/currency';
import { Flame, PlusCircle, ArrowRight, AlertCircle } from 'lucide-react';

interface TopOutcomeCardProps {
  onRecordTransaction: () => void;
  onViewCategoryHistory: (categoryId: string) => void;
}

export const TopOutcomeCard: React.FC<TopOutcomeCardProps> = ({
  onRecordTransaction,
  onViewCategoryHistory
}) => {
  const { selectedPeriod, getPeriodSummary } = useFinance();
  const summary = getPeriodSummary(selectedPeriod);

  const topCategory = summary.topOutcomeCategory;

  if (!topCategory || summary.outcome <= 0) {
    return (
      <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Belum Ada Pengeluaran (Outcome)
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Catat pengeluaran pertama Anda pada periode ini untuk memantau kategori terbesar.
            </p>
          </div>
        </div>
        <button
          onClick={onRecordTransaction}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-colors whitespace-nowrap shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Catat Pengeluaran
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4">
      <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto">
        <div className="p-2.5 sm:p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 shrink-0">
          <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[10px] sm:text-[11px] text-rose-600 dark:text-rose-400">
              Pengeluaran Terbesar
            </span>
            <span aria-hidden="true" className="hidden xs:inline">·</span>
            <span className="truncate">Porsi {topCategory.percentage}% dari konsumsi</span>
          </div>
          <div className="mt-0.5 sm:mt-1 flex flex-wrap items-baseline gap-2 sm:gap-3">
            <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
              {topCategory.category.name}
            </span>
            <span className="font-mono text-sm sm:text-base font-bold text-rose-600 dark:text-rose-400 tabular-nums">
              {formatIDR(topCategory.amount)}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
        <div className="text-left md:text-right">
          <div className="text-[10px] sm:text-[11px] text-slate-400">
            Total Outcome Periode
          </div>
          <div className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
            {formatIDR(summary.outcome)}
          </div>
        </div>
        <button
          onClick={() => onViewCategoryHistory(topCategory.category.id)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[36px]"
        >
          Lihat Transaksi
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
