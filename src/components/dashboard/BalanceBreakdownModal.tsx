import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatIDR, formatPeriodIndonesian } from '../../utils/currency';
import { X, ArrowRight, Wallet, TrendingUp, TrendingDown, ShieldCheck, Settings } from 'lucide-react';

interface BalanceBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToSettings: () => void;
}

export const BalanceBreakdownModal: React.FC<BalanceBreakdownModalProps> = ({
  isOpen,
  onClose,
  onNavigateToSettings
}) => {
  const { selectedPeriod, getPeriodSummary } = useFinance();

  if (!isOpen) return null;

  const summary = getPeriodSummary(selectedPeriod);
  const netFlow = summary.income - summary.outcome - summary.investment;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col my-0 sm:my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Rincian Komponen Saldo
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Periode {formatPeriodIndonesian(selectedPeriod)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Rumus Perhitungan Saldo
            </div>
            <div className="text-xs font-mono text-emerald-700 dark:text-emerald-400 mt-1">
              Saldo Akhir = Saldo Awal + Income − Outcome − Investment
            </div>
          </div>

          {/* Breakdown Steps */}
          <div className="space-y-3">
            {/* Saldo Awal */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Saldo Awal Periode
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500">
                    Akumulasi bergulir dari bulan sebelumnya
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm font-semibold text-slate-900 dark:text-white tabular-nums">
                  {formatIDR(summary.startingBalance)}
                </div>
              </div>
            </div>

            {/* Income */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-emerald-900 dark:text-emerald-300">
                    (+) Total Pemasukan (Income)
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500">
                    Gaji, proyek, bonus, dan imbal hasil
                  </div>
                </div>
              </div>
              <div className="text-right font-mono text-sm font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                +{formatIDR(summary.income)}
              </div>
            </div>

            {/* Outcome */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-rose-900 dark:text-rose-300">
                    (−) Total Pengeluaran (Outcome)
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500">
                    Konsumsi, tagihan, makanan, dan lifestyle
                  </div>
                </div>
              </div>
              <div className="text-right font-mono text-sm font-semibold text-rose-600 dark:text-rose-400 tabular-nums">
                −{formatIDR(summary.outcome)}
              </div>
            </div>

            {/* Investment */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-indigo-900 dark:text-indigo-300">
                    (−) Alokasi Investasi (Investment)
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500">
                    Emergency Fund, RDPU, SBN (mengurangi saldo kas)
                  </div>
                </div>
              </div>
              <div className="text-right font-mono text-sm font-semibold text-indigo-600 dark:text-indigo-400 tabular-nums">
                −{formatIDR(summary.investment)}
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="mt-4 p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-emerald-800 dark:text-emerald-300">
                Saldo Akhir Periode Ini
              </div>
              <div className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">
                Perubahan kas bersih: {netFlow >= 0 ? '+' : ''}{formatIDR(netFlow)}
              </div>
            </div>
            <div className="font-mono text-xl font-bold text-emerald-700 dark:text-emerald-300 tabular-nums">
              {formatIDR(summary.endingBalance)}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => {
              onClose();
              onNavigateToSettings();
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            Atur Saldo Awal di Pengaturan
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
