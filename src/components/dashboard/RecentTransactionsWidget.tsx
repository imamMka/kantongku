import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Transaction } from '../../types/finance';
import { formatIDR, formatDateIndonesian } from '../../utils/currency';
import { Clock, TrendingUp, TrendingDown, ShieldCheck, ArrowRight, Edit2 } from 'lucide-react';

interface RecentTransactionsWidgetProps {
  onViewAll: () => void;
  onEditTransaction: (tx: Transaction) => void;
  onSelectTransaction: (tx: Transaction) => void;
}

export const RecentTransactionsWidget: React.FC<RecentTransactionsWidgetProps> = ({
  onViewAll,
  onEditTransaction,
  onSelectTransaction
}) => {
  const { transactions, selectedPeriod, getCategoryById } = useFinance();

  // Filter by selected period first, take top 6 latest
  const periodTransactions = transactions
    .filter(t => t.date && t.date.substring(0, 7) === selectedPeriod)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  const getTypeBadge = (type: Transaction['type'], subCategory?: string) => {
    switch (type) {
      case 'income':
        return {
          icon: TrendingUp,
          color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40',
          sign: '+',
          label: 'Pemasukan'
        };
      case 'outcome':
        return {
          icon: TrendingDown,
          color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40',
          sign: '−',
          label: 'Pengeluaran'
        };
      case 'investment':
        return {
          icon: ShieldCheck,
          color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40',
          sign: '−',
          label: subCategory ? `Investasi (${subCategory})` : 'Investasi'
        };
    }
  };

  return (
    <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Aktivitas Transaksi Terbaru
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Transaksi yang tercatat pada periode ini
            </p>
          </div>
        </div>
        <button
          onClick={onViewAll}
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 transition-colors"
        >
          Lihat Riwayat Lengkap
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800/80">
        {periodTransactions.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
            Belum ada transaksi tercatat pada periode ini.
          </div>
        ) : (
          periodTransactions.map(tx => {
            const badge = getTypeBadge(tx.type, tx.subCategory);
            const Icon = badge.icon;
            const category = getCategoryById(tx.categoryId);

            return (
              <div
                key={tx.id}
                className="py-3 flex items-center justify-between gap-3 group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 -mx-2 px-2 rounded-lg transition-colors cursor-pointer"
                onClick={() => onSelectTransaction(tx)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2 rounded-lg shrink-0 ${badge.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {category ? category.name : 'Tanpa Kategori'}
                      </span>
                      {tx.type === 'investment' && tx.subCategory && (
                        <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium shrink-0">
                          · {tx.subCategory}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                      <span>{formatDateIndonesian(tx.date)}</span>
                      {tx.notes && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="truncate max-w-[180px] sm:max-w-xs">{tx.notes}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div
                      className={`font-mono text-xs sm:text-sm font-bold tabular-nums ${
                        tx.type === 'income'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : tx.type === 'outcome'
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-indigo-600 dark:text-indigo-400'
                      }`}
                    >
                      {badge.sign}{formatIDR(tx.amount)}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditTransaction(tx);
                    }}
                    title="Edit transaksi"
                    className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
