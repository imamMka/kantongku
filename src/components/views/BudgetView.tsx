import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatIDR, parseIDR, formatPeriodIndonesian } from '../../utils/currency';
import {
  Target,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  X,
  Check,
  Info
} from 'lucide-react';

export const BudgetView: React.FC = () => {
  const {
    categories,
    budgets,
    selectedPeriod,
    availablePeriods,
    setSelectedPeriod,
    setBudget,
    removeBudget,
    getCategoryBudgetsWithRealization
  } = useFinance();

  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [budgetAmountInput, setBudgetAmountInput] = useState<string>('');

  const budgetsWithRealization = getCategoryBudgetsWithRealization(selectedPeriod);

  const handleStartEdit = (categoryId: string, currentAmount: number) => {
    setEditingCategoryId(categoryId);
    setBudgetAmountInput(currentAmount > 0 ? currentAmount.toString() : '');
  };

  const handleSaveBudget = async (categoryId: string) => {
    const numeric = parseIDR(budgetAmountInput);
    try {
      if (numeric > 0) {
        await setBudget(categoryId, selectedPeriod, numeric);
      } else {
        // If 0, delete budget entry
        const existing = budgets.find(b => b.categoryId === categoryId && b.period === selectedPeriod);
        if (existing) await removeBudget(existing.id);
      }
      setEditingCategoryId(null);
      setBudgetAmountInput('');
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan anggaran.');
    }
  };

  const handleDeleteBudget = async (categoryId: string) => {
    const existing = budgets.find(b => b.categoryId === categoryId && b.period === selectedPeriod);
    if (existing) {
      try {
        await removeBudget(existing.id);
      } catch (err: any) {
        alert(err.message || 'Gagal menghapus anggaran.');
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Pengelolaan Anggaran (Budget)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Atur batas rencana belanja per kategori untuk periode{' '}
            <strong className="text-slate-700 dark:text-slate-200">
              {formatPeriodIndonesian(selectedPeriod)}
            </strong>
          </p>
        </div>

        {/* Period Selector within Budget */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Periode Anggaran:</span>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          >
            {availablePeriods.map(p => (
              <option key={p} value={p}>
                {formatPeriodIndonesian(p)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Info Callout */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
        <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <strong>Prinsip Anggaran DompetKu:</strong> Nominal anggaran tidak dipaksakan oleh sistem, melainkan ditentukan sendiri oleh Anda. Jika transaksi pengeluaran melampaui batas anggaran, transaksi tetap dicatat dengan aman dan sistem memberikan peringatan informatif.
        </p>
      </div>

      {/* Budget Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgetsWithRealization.map(item => {
          const isEditing = editingCategoryId === item.category.id;
          const isExceeded = item.isOverBudget;
          const isWarning = !isExceeded && item.percentage >= 80;

          let statusBadge = (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3 h-3" />
              Terkendali ({item.percentage}%)
            </span>
          );
          if (isExceeded) {
            statusBadge = (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                <AlertTriangle className="w-3 h-3" />
                Melebihi Batas ({item.percentage}%)
              </span>
            );
          } else if (isWarning) {
            statusBadge = (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-3 h-3" />
                Mendekati Batas ({item.percentage}%)
              </span>
            );
          }

          return (
            <div
              key={item.category.id}
              className={`p-5 rounded-xl border transition-all ${
                isExceeded
                  ? 'bg-rose-50/20 dark:bg-rose-950/10 border-rose-200 dark:border-rose-900/50'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-xs shrink-0"
                    style={{ backgroundColor: item.category.color || '#F43F5E' }}
                  />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.category.name}
                  </h3>
                </div>

                {item.hasBudget && !isEditing && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStartEdit(item.category.id, item.budgetAmount)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title="Ubah nominal anggaran"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteBudget(item.category.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                      title="Hapus anggaran untuk kategori ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Editing Form */}
              {isEditing ? (
                <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Tentukan Nominal Anggaran Bulanan (IDR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-slate-400">
                      Rp
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={budgetAmountInput ? parseIDR(budgetAmountInput).toLocaleString('id-ID') : ''}
                      onChange={(e) => setBudgetAmountInput(parseIDR(e.target.value).toString())}
                      placeholder="Contoh: 1.500.000"
                      className="w-full pl-9 pr-3 py-2 text-xs font-mono font-bold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setEditingCategoryId(null)}
                      className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => handleSaveBudget(item.category.id)}
                      className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors inline-flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Simpan Anggaran
                    </button>
                  </div>
                </div>
              ) : item.hasBudget ? (
                /* Budgeted State */
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">
                      Realisasi Belanja
                    </span>
                    <span className="font-mono text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                      {formatIDR(item.realization)}
                      <span className="text-xs text-slate-400 font-normal ml-1">
                        / {formatIDR(item.budgetAmount)}
                      </span>
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isExceeded
                          ? 'bg-rose-500'
                          : isWarning
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(item.percentage, 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    {statusBadge}
                    <span className="font-mono text-xs tabular-nums text-slate-600 dark:text-slate-400">
                      {isExceeded ? (
                        <span className="text-rose-600 font-semibold">
                          Lebih +{formatIDR(Math.abs(item.remaining))}
                        </span>
                      ) : (
                        <span>Sisa: {formatIDR(item.remaining)}</span>
                      )}
                    </span>
                  </div>
                </div>
              ) : (
                /* Unbudgeted State */
                <div className="mt-4 py-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-500">
                      Realisasi saat ini: <strong className="font-mono text-slate-800 dark:text-slate-200">{formatIDR(item.realization)}</strong>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Belum ada batasan nominal yang ditetapkan.
                    </div>
                  </div>
                  <button
                    onClick={() => handleStartEdit(item.category.id, 0)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 rounded-lg transition-colors shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Pasang Anggaran
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
