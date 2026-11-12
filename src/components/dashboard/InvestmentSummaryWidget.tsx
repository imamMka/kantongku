import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatIDR } from '../../utils/currency';
import { ShieldCheck, PiggyBank, Landmark, TrendingUp, Info } from 'lucide-react';

interface InvestmentSummaryWidgetProps {
  onRecordInvestment: () => void;
  onViewInvestmentHistory: () => void;
}

export const InvestmentSummaryWidget: React.FC<InvestmentSummaryWidgetProps> = ({
  onRecordInvestment,
  onViewInvestmentHistory
}) => {
  const { selectedPeriod, getPeriodSummary, getInvestmentSubcategoryBreakdown } = useFinance();
  const summary = getPeriodSummary(selectedPeriod);
  const breakdowns = getInvestmentSubcategoryBreakdown(selectedPeriod);

  const getSubcategoryIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('darurat') || lower.includes('emergency')) return ShieldCheck;
    if (lower.includes('rdpu') || lower.includes('pasar uang') || lower.includes('reksa')) return PiggyBank;
    if (lower.includes('sbn') || lower.includes('obligasi')) return Landmark;
    return TrendingUp;
  };

  return (
    <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Alokasi Investasi (Investment)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Dipisahkan dari Outcome agar belanja konsumsi tetap objektif
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11px] font-medium text-slate-400">
            Total Alokasi
          </div>
          <div className="font-mono text-base font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
            {formatIDR(summary.investment)}
          </div>
        </div>
      </div>

      {/* Info Callout */}
      <div className="mt-3.5 p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/60 dark:border-indigo-900/40 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <p className="text-xs text-indigo-950/80 dark:text-indigo-200/80 leading-relaxed">
          Dana dialokasikan ke <strong>Emergency Fund</strong> dan <strong>RDPU</strong> dicatat sebagai tabungan investasi (tidak dihitung sebagai biaya konsumsi Outcome).
        </p>
      </div>

      {/* Subcategory List */}
      {/* Subcategory List */}
      <div className="mt-4">
        {breakdowns.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Belum ada setoran investasi pada periode ini.
            </p>
            <button
              onClick={onRecordInvestment}
              className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              Catat Alokasi Investasi
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {breakdowns.map((item) => {
              const IconComponent = getSubcategoryIcon(item.subCategory);

              return (
                <div
                  key={item.subCategory}
                  className="p-3 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-2xs shrink-0">
                      <IconComponent className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {item.subCategory}
                      </div>
                      <div className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 truncate">
                        Porsi {item.percentage}% dari total investasi bulan ini
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono text-xs sm:text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                      {formatIDR(item.amount)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer link */}
      {breakdowns.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
          <button
            onClick={onViewInvestmentHistory}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Lihat Semua Transaksi Investasi →
          </button>
          <button
            onClick={onRecordInvestment}
            className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          >
            + Tambah Alokasi
          </button>
        </div>
      )}
    </div>
  );
};
