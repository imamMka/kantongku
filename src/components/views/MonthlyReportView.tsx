import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatIDR, formatDateIndonesian, formatPeriodIndonesian } from '../../utils/currency';
import {
  FileText,
  Printer,
  Download,
  Calendar,
  Wallet,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const MonthlyReportView: React.FC = () => {
  const {
    selectedPeriod,
    setSelectedPeriod,
    availablePeriods,
    getPeriodSummary,
    getCategoryBudgetsWithRealization,
    getInvestmentSubcategoryBreakdown,
    transactions,
    getCategoryById
  } = useFinance();

  const summary = getPeriodSummary(selectedPeriod);
  const budgetsWithRealization = getCategoryBudgetsWithRealization(selectedPeriod);
  const investmentBreakdowns = getInvestmentSubcategoryBreakdown(selectedPeriod);

  // Period transactions sorted by date
  const periodTransactions = transactions
    .filter(t => t.date && t.date.substring(0, 7) === selectedPeriod)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Tanggal', 'Jenis', 'Kategori', 'Subkategori', 'Nominal (IDR)', 'Catatan'];
    const rows = periodTransactions.map(t => {
      const cat = getCategoryById(t.categoryId);
      return [
        t.id,
        t.date,
        t.type,
        `"${cat?.name || ''}"`,
        `"${t.subCategory || ''}"`,
        t.amount,
        `"${(t.notes || '').replace(/"/g, '""')}"`
      ];
    });

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `DompetKu_Laporan_${selectedPeriod}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12 print-page">
      {/* Top Header Controls (Hidden on Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Laporan Keuangan Bulanan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Laporan eksekutif mutasi kas, anggaran konsumsi, dan investasi untuk periode terpilih
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs"
          >
            {availablePeriods.map(p => (
              <option key={p} value={p}>
                {formatPeriodIndonesian(p)}
              </option>
            ))}
          </select>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors shadow-2xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Ekspor CSV
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-xl transition-colors shadow-2xs"
          >
            <Printer className="w-4 h-4" />
            Cetak / Simpan PDF
          </button>
        </div>
      </div>

      {/* Main Printable Document Sheet */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-6">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
          <div>
            <div className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Dompet<span className="text-emerald-600">Ku</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Laporan Posisi Keuangan & Anggaran Pribadi
            </div>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Periode Pembukuan
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">
              {formatPeriodIndonesian(selectedPeriod)}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Dicetak pada {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}
            </div>
          </div>
        </div>

        {/* 1. Ringkasan Eksekutif Mutasi Kas */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            1. Ringkasan Eksekutif Mutasi Kas
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 font-medium">Saldo Awal</span>
              <div className="font-mono text-base font-bold text-slate-900 dark:text-white mt-1 tabular-nums">
                {formatIDR(summary.startingBalance)}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">(+) Total Income</span>
              <div className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
                +{formatIDR(summary.income)}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40">
              <span className="text-[11px] text-rose-700 dark:text-rose-400 font-medium">(−) Total Outcome</span>
              <div className="font-mono text-base font-bold text-rose-600 dark:text-rose-400 mt-1 tabular-nums">
                −{formatIDR(summary.outcome)}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40">
              <span className="text-[11px] text-indigo-700 dark:text-indigo-400 font-medium">(−) Total Investment</span>
              <div className="font-mono text-base font-bold text-indigo-600 dark:text-indigo-400 mt-1 tabular-nums">
                −{formatIDR(summary.investment)}
              </div>
            </div>
          </div>

          <div className="mt-3 p-4 rounded-xl bg-slate-100/70 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Saldo Akhir Periode
              </span>
              <div className="text-[11px] text-slate-500">
                Rumus: Saldo Awal ({formatIDR(summary.startingBalance, { compact: true })}) + Income ({formatIDR(summary.income, { compact: true })}) − Outcome ({formatIDR(summary.outcome, { compact: true })}) − Investment ({formatIDR(summary.investment, { compact: true })})
              </div>
            </div>
            <div className="font-mono text-xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {formatIDR(summary.endingBalance)}
            </div>
          </div>
        </div>

        {/* 2. Rincian Outcome per Kategori & Kategori Terbesar */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              2. Kinerja Anggaran & Pengeluaran Konsumsi (Outcome)
            </h3>
            {summary.topOutcomeCategory && (
              <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
                Kategori Terbesar: {summary.topOutcomeCategory.category.name} ({formatIDR(summary.topOutcomeCategory.amount)} / {summary.topOutcomeCategory.percentage}%)
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-100 dark:border-slate-800 rounded-lg overflow-hidden">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Kategori</th>
                  <th className="py-2.5 px-3 text-right">Anggaran</th>
                  <th className="py-2.5 px-3 text-right">Realisasi</th>
                  <th className="py-2.5 px-3 text-right">Sisa / Kelebihan</th>
                  <th className="py-2.5 px-3 text-center">Pemakaian</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {budgetsWithRealization.map(item => (
                  <tr key={item.category.id}>
                    <td className="py-2 px-3 font-semibold text-slate-800 dark:text-slate-200">
                      {item.category.name}
                    </td>
                    <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-600 dark:text-slate-400">
                      {item.hasBudget ? formatIDR(item.budgetAmount) : '—'}
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                      {formatIDR(item.realization)}
                    </td>
                    <td className="py-2 px-3 text-right font-mono tabular-nums">
                      {item.hasBudget ? (
                        item.isOverBudget ? (
                          <span className="text-rose-600 font-semibold">
                            +{formatIDR(Math.abs(item.remaining))} (Lebih)
                          </span>
                        ) : (
                          <span className="text-emerald-600">
                            {formatIDR(item.remaining)}
                          </span>
                        )
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-2 px-3 text-center font-mono tabular-nums">
                      {item.hasBudget ? `${item.percentage}%` : '—'}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {!item.hasBudget ? (
                        <span className="text-[11px] text-slate-400">Tanpa Batas</span>
                      ) : item.isOverBudget ? (
                        <span className="text-[11px] font-bold text-rose-600">Terlampaui</span>
                      ) : item.percentage >= 80 ? (
                        <span className="text-[11px] font-bold text-amber-600">Waspada</span>
                      ) : (
                        <span className="text-[11px] font-bold text-emerald-600">Aman</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Rincian Alokasi Investasi */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            3. Rincian Alokasi Investasi (Dipisahkan dari Outcome)
          </h3>
          {investmentBreakdowns.length === 0 ? (
            <p className="text-xs text-slate-400 italic">Tidak ada transaksi investasi tercatat pada periode ini.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {investmentBreakdowns.map(inv => (
                <div key={inv.subCategory} className="p-3 rounded-lg bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40">
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {inv.subCategory}
                  </div>
                  <div className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-1 tabular-nums">
                    {formatIDR(inv.amount)}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Proporsi: {inv.percentage}%
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. Daftar Transaksi Terinci */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            4. Itemized Daftar Transaksi Periode ({periodTransactions.length} Rekaman)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-100 dark:border-slate-800 rounded-lg overflow-hidden">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Tanggal</th>
                  <th className="py-2.5 px-3">Jenis</th>
                  <th className="py-2.5 px-3">Kategori</th>
                  <th className="py-2.5 px-3">Catatan</th>
                  <th className="py-2.5 px-3 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {periodTransactions.map(t => {
                  const cat = getCategoryById(t.categoryId);
                  return (
                    <tr key={t.id}>
                      <td className="py-2 px-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {formatDateIndonesian(t.date)}
                      </td>
                      <td className="py-2 px-3 font-semibold capitalize text-slate-800 dark:text-slate-200">
                        {t.type}
                      </td>
                      <td className="py-2 px-3 text-slate-800 dark:text-slate-200">
                        {cat?.name || '—'} {t.subCategory ? `(${t.subCategory})` : ''}
                      </td>
                      <td className="py-2 px-3 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                        {t.notes || '—'}
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-bold tabular-nums">
                        <span
                          className={
                            t.type === 'income'
                              ? 'text-emerald-600'
                              : t.type === 'outcome'
                              ? 'text-rose-600'
                              : 'text-indigo-600'
                          }
                        >
                          {t.type === 'income' ? '+' : '−'}{formatIDR(t.amount)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Signature Box */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-between text-[11px] text-slate-400">
          <span>DompetKu Personal Finance System · Dokumen Resmi Pribadi</span>
          <span>Halaman 1 dari 1</span>
        </div>
      </div>
    </div>
  );
};
