import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatIDR, formatPeriodIndonesian } from '../../utils/currency';
import {
  BarChart2,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Wallet,
  PiggyBank,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface AnalysisViewProps {
  onNavigateToHistory: (filterType?: 'income' | 'outcome' | 'all', categoryId?: string) => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ onNavigateToHistory }) => {
  const {
    selectedPeriod,
    getPeriodSummary,
    getMonthlyCashflowTrends,
    getCategoryBudgetsWithRealization,
    categories
  } = useFinance();

  const summary = getPeriodSummary(selectedPeriod);
  const trends = getMonthlyCashflowTrends(6);
  const budgetsWithRealization = getCategoryBudgetsWithRealization(selectedPeriod);

  // Savings / Wealth Accumulation Rate: (Income - Outcome) / Income
  const savingsRate = summary.income > 0
    ? Math.max(0, Math.round(((summary.income - summary.outcome) / summary.income) * 100))
    : 0;

  // Investment Allocation Rate: Investment / Income
  const investmentRate = summary.income > 0
    ? Math.min(100, Math.round((summary.investment / summary.income) * 100))
    : 0;

  const maxTrendValue = Math.max(
    ...trends.map(t => Math.max(t.income, t.outcome, t.investment)),
    1000000
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Analisis Keuangan
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Tren arus kas bulanan, rasio tabungan, dan efisiensi anggaran periode{' '}
          <strong className="text-slate-700 dark:text-slate-200">
            {formatPeriodIndonesian(selectedPeriod)}
          </strong>
        </p>
      </div>

      {/* KPI Highlight Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Savings Rate */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Tingkat Tabungan (Savings Rate)</span>
            <PiggyBank className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {savingsRate}%
            </span>
            <span className="text-xs text-slate-500">dari pemasukan</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Sisa surplus: <strong>{formatIDR(summary.income - summary.outcome, { compact: true })}</strong>
          </div>
        </div>

        {/* Investment Rate */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Rasio Investasi</span>
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">
              {investmentRate}%
            </span>
            <span className="text-xs text-slate-500">ke aset produktif</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Total investasi: <strong>{formatIDR(summary.investment, { compact: true })}</strong>
          </div>
        </div>

        {/* Outcome Realization */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Rasio Konsumsi / Belanja</span>
            <TrendingDown className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-extrabold text-rose-600 dark:text-rose-400 tabular-nums">
              {summary.income > 0 ? Math.round((summary.outcome / summary.income) * 100) : 0}%
            </span>
            <span className="text-xs text-slate-500">dari penghasilan</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Biaya hidup: <strong>{formatIDR(summary.outcome, { compact: true })}</strong>
          </div>
        </div>

        {/* Ending Balance */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Posisi Kas Akhir Periode</span>
            <Wallet className="w-4 h-4 text-slate-700 dark:text-slate-300" />
          </div>
          <div className="mt-3">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {formatIDR(summary.endingBalance, { compact: true })}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Saldo awal: {formatIDR(summary.startingBalance, { compact: true })}
          </div>
        </div>
      </div>

      {/* Multi-Period Cashflow Trend (Last 6 Months) */}
      <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Tren Arus Kas Multi-Periode (6 Bulan Terakhir)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Perbandingan pemasukan, pengeluaran konsumsi, dan akumulasi investasi
            </p>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Pemasukan
            </span>
            <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              Pengeluaran
            </span>
            <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              Investasi
            </span>
          </div>
        </div>

        {/* Visual Bar Columns */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {trends.map(t => {
            const isCurrent = t.period === selectedPeriod;
            const incH = Math.max(Math.round((t.income / maxTrendValue) * 120), 4);
            const outH = Math.max(Math.round((t.outcome / maxTrendValue) * 120), 4);
            const invH = Math.max(Math.round((t.investment / maxTrendValue) * 120), 4);

            return (
              <div
                key={t.period}
                className={`p-3 rounded-xl border transition-all text-center ${
                  isCurrent
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 shadow-2xs'
                    : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800'
                }`}
              >
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                  {t.label}
                  {isCurrent && (
                    <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      (Dipilih)
                    </span>
                  )}
                </div>

                {/* Bars group */}
                <div className="h-32 flex items-end justify-center gap-1.5 pt-2">
                  {/* Income bar */}
                  <div
                    title={`Pemasukan: ${formatIDR(t.income)}`}
                    style={{ height: `${incH}px` }}
                    className="w-3.5 bg-emerald-500 rounded-t-sm transition-all hover:opacity-80"
                  />
                  {/* Outcome bar */}
                  <div
                    title={`Pengeluaran: ${formatIDR(t.outcome)}`}
                    style={{ height: `${outH}px` }}
                    className="w-3.5 bg-rose-500 rounded-t-sm transition-all hover:opacity-80"
                  />
                  {/* Investment bar */}
                  <div
                    title={`Investasi: ${formatIDR(t.investment)}`}
                    style={{ height: `${invH}px` }}
                    className="w-3.5 bg-indigo-500 rounded-t-sm transition-all hover:opacity-80"
                  />
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 text-[11px] font-mono tabular-nums">
                  <div className="text-slate-400 text-[10px]">Saldo Akhir</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    {formatIDR(t.endingBalance, { compact: true })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Budget vs Realization Breakdown */}
      <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
        <div className="pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Evaluasi Anggaran vs Realisasi Pengeluaran
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Status kepatuhan batas belanja per kategori pada periode {formatPeriodIndonesian(selectedPeriod)}
            </p>
          </div>
        </div>

        <div className="mt-4">
          {/* Mobile Card List (< 640px) */}
          <div className="sm:hidden space-y-3">
            {budgetsWithRealization.map(item => (
              <div
                key={item.category.id}
                className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-100">
                    {item.category.name}
                  </span>
                  {!item.hasBudget ? (
                    <span className="text-[11px] text-slate-400">Tanpa Batas</span>
                  ) : item.isOverBudget ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                      <AlertTriangle className="w-3 h-3" />
                      Terlampaui ({item.percentage}%)
                    </span>
                  ) : item.percentage >= 80 ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                      Mendekati Batas ({item.percentage}%)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" />
                      Aman ({item.percentage}%)
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Realisasi Belanja</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {formatIDR(item.realization)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Batas Anggaran</span>
                    <span className="font-mono text-slate-600 dark:text-slate-400">
                      {item.hasBudget ? formatIDR(item.budgetAmount) : '—'}
                    </span>
                  </div>
                </div>

                {item.hasBudget && (
                  <div className="text-[11px] pt-1">
                    <span className="text-slate-400">Sisa: </span>
                    {item.isOverBudget ? (
                      <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                        +{formatIDR(Math.abs(item.remaining))} (Kelebihan)
                      </span>
                    ) : (
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {formatIDR(item.remaining)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Table (>= 640px) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Kategori</th>
                  <th className="py-2.5 px-3 text-right">Batas Anggaran</th>
                  <th className="py-2.5 px-3 text-right">Realisasi Belanja</th>
                  <th className="py-2.5 px-3 text-right">Sisa / Kelebihan</th>
                  <th className="py-2.5 px-3 text-center">Pemakaian</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {budgetsWithRealization.map(item => {
                  return (
                    <tr key={item.category.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                        {item.category.name}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-600 dark:text-slate-400">
                        {item.hasBudget ? formatIDR(item.budgetAmount) : <span className="text-slate-400 italic">Belum diatur</span>}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                        {formatIDR(item.realization)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold tabular-nums">
                        {item.hasBudget ? (
                          item.isOverBudget ? (
                            <span className="text-rose-600 dark:text-rose-400">
                              +{formatIDR(Math.abs(item.remaining))} (Lebih)
                            </span>
                          ) : (
                            <span className="text-emerald-600 dark:text-emerald-400">
                              {formatIDR(item.remaining)}
                            </span>
                          )
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono tabular-nums">
                        {item.hasBudget ? `${item.percentage}%` : '—'}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {!item.hasBudget ? (
                          <span className="text-[11px] text-slate-400">Tanpa Batas</span>
                        ) : item.isOverBudget ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                            <AlertTriangle className="w-3 h-3" />
                            Terlampaui
                          </span>
                        ) : item.percentage >= 80 ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                            Mendekati Batas
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" />
                            Aman
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
