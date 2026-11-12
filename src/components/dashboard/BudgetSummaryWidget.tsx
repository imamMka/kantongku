import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatIDR } from '../../utils/currency';
import { Target, AlertTriangle, CheckCircle2, ChevronRight, Plus } from 'lucide-react';

interface BudgetSummaryWidgetProps {
  onNavigateToBudgets: () => void;
  onSetBudgetForCategory: (categoryId: string) => void;
}

export const BudgetSummaryWidget: React.FC<BudgetSummaryWidgetProps> = ({
  onNavigateToBudgets,
  onSetBudgetForCategory
}) => {
  const { selectedPeriod, getCategoryBudgetsWithRealization } = useFinance();
  const budgetsWithRealization = getCategoryBudgetsWithRealization(selectedPeriod);

  // Categories with budgets first, then categories without budgets
  const budgeted = budgetsWithRealization.filter(b => b.hasBudget);
  const unbudgeted = budgetsWithRealization.filter(b => !b.hasBudget && b.realization > 0);

  return (
    <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Ringkasan Anggaran Bulanan
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pantau batas pengeluaran per kategori konsumsi
            </p>
          </div>
        </div>
        <button
          onClick={onNavigateToBudgets}
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 transition-colors"
        >
          Kelola Anggaran
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="mt-4 space-y-4">
        {budgeted.length === 0 && unbudgeted.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Belum ada anggaran yang diatur untuk periode ini.
            </p>
            <button
              onClick={onNavigateToBudgets}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Atur Anggaran Sekarang
            </button>
          </div>
        ) : (
          budgeted.map(item => {
            const isExceeded = item.isOverBudget;
            const isWarning = !isExceeded && item.percentage >= 80;

            // Bar color
            let barColor = 'bg-emerald-500';
            if (isExceeded) barColor = 'bg-rose-500';
            else if (isWarning) barColor = 'bg-amber-500';

            return (
              <div key={item.category.id} className="group">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {item.category.name}
                    </span>
                    {isExceeded && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                        <AlertTriangle className="w-3 h-3" />
                        Melebihi Anggaran (+{formatIDR(Math.abs(item.remaining))})
                      </span>
                    )}
                    {isWarning && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                        Hampir Habis ({item.percentage}%)
                      </span>
                    )}
                    {!isExceeded && !isWarning && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                        Sisa {formatIDR(item.remaining)}
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-slate-600 dark:text-slate-400 tabular-nums">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {formatIDR(item.realization)}
                    </span>
                    <span className="text-slate-400 mx-1">/</span>
                    <span>{formatIDR(item.budgetAmount)}</span>
                  </div>
                </div>

                {/* Progress track */}
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                    style={{ width: `${Math.min(item.percentage, 100)}%` }}
                  />
                </div>
              </div>
            );
          })
        )}

        {/* Categories without budgets but having realization */}
        {unbudgeted.length > 0 && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <div className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mb-2">
              Kategori Pengeluaran Tanpa Batas Anggaran:
            </div>
            <div className="space-y-2">
              {unbudgeted.map(item => (
                <div
                  key={item.category.id}
                  className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40"
                >
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {item.category.name}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-600 dark:text-slate-400 tabular-nums">
                      Realisasi: {formatIDR(item.realization)}
                    </span>
                    <button
                      onClick={() => onSetBudgetForCategory(item.category.id)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      <Plus className="w-3 h-3" />
                      Pasang Batas
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
