import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Transaction, TransactionType } from '../../types/finance';
import { INVESTMENT_SUBCATEGORIES } from '../../data/defaultData';
import { formatIDR, parseIDR, getTodayDate } from '../../utils/currency';
import { X, Check, AlertCircle, TrendingUp, TrendingDown, ShieldCheck, Plus, Sparkles } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editTransaction?: Transaction | null;
  onSaved?: (tx: Transaction) => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  editTransaction,
  onSaved
}) => {
  const { categories, addTransaction, updateTransaction, addCategory } = useFinance();

  const [type, setType] = useState<TransactionType>('outcome');
  const [amountStr, setAmountStr] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [subCategory, setSubCategory] = useState<string>('Emergency Fund');
  const [date, setDate] = useState<string>(getTodayDate());
  const [notes, setNotes] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQuickAddCategory, setShowQuickAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Filter categories by chosen transaction type
  const availableCategories = categories.filter(c => c.type === type);

  // Sync state when editing or opening
  useEffect(() => {
    if (editTransaction) {
      setType(editTransaction.type);
      setAmountStr(editTransaction.amount.toString());
      setCategoryId(editTransaction.categoryId);
      setSubCategory(editTransaction.subCategory || 'Emergency Fund');
      setDate(editTransaction.date);
      setNotes(editTransaction.notes || '');
    } else {
      setType('outcome');
      setAmountStr('');
      setCategoryId('');
      setSubCategory('Emergency Fund');
      setDate(getTodayDate());
      setNotes('');
    }
    setErrors({});
    setShowQuickAddCategory(false);
  }, [editTransaction, isOpen]);

  // Set default category when type changes if current category is invalid
  useEffect(() => {
    if (availableCategories.length > 0) {
      const match = availableCategories.find(c => c.id === categoryId);
      if (!match) {
        setCategoryId(availableCategories[0].id);
      }
    } else {
      setCategoryId('');
    }
  }, [type, availableCategories, categoryId]);

  if (!isOpen) return null;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const numeric = parseIDR(raw);
    setAmountStr(numeric === 0 && raw === '' ? '' : numeric.toString());
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: '' }));
    }
  };

  const handleQuickAddAmount = (addAmount: number) => {
    const current = parseIDR(amountStr);
    const newAmount = current + addAmount;
    setAmountStr(newAmount.toString());
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: '' }));
    }
  };

  const handleQuickCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const created = await addCategory({
        name: newCategoryName.trim(),
        type: type,
        color: type === 'income' ? '#10B981' : type === 'outcome' ? '#F43F5E' : '#6366F1'
      });
      setCategoryId(created.id);
      setNewCategoryName('');
      setShowQuickAddCategory(false);
    } catch (err: any) {
      alert(err.message || 'Gagal menambahkan kategori');
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const parsedAmount = parseIDR(amountStr);

    if (!amountStr || parsedAmount <= 0) {
      newErrors.amount = 'Nominal harus diisi dan bernilai lebih dari nol.';
    }

    if (!categoryId) {
      newErrors.categoryId = 'Silakan pilih kategori transaksi.';
    }

    if (!date) {
      newErrors.date = 'Tanggal transaksi wajib diisi.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validate()) return;

    setIsSubmitting(true);
    const numericAmount = parseIDR(amountStr);

    try {
      if (editTransaction) {
        await updateTransaction(editTransaction.id, {
          type,
          amount: numericAmount,
          categoryId,
          subCategory: type === 'investment' ? subCategory : undefined,
          date,
          notes: notes.trim() || undefined
        });
        if (onSaved) {
          onSaved({
            ...editTransaction,
            type,
            amount: numericAmount,
            categoryId,
            subCategory: type === 'investment' ? subCategory : undefined,
            date,
            notes: notes.trim() || undefined
          });
        }
      } else {
        const created = await addTransaction({
          type,
          amount: numericAmount,
          categoryId,
          subCategory: type === 'investment' ? subCategory : undefined,
          date,
          notes: notes.trim() || undefined
        });
        if (onSaved) {
          onSaved(created);
        }
      }
      onClose();
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan saat menyimpan transaksi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const parsedAmount = parseIDR(amountStr);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-0 sm:my-8 max-h-[92vh] sm:max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {editTransaction ? 'Ubah Transaksi' : 'Catat Transaksi Baru'}
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Masukkan rincian transaksi dengan teliti
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
          {/* Type Selector Tabs */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Jenis Transaksi <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80">
              <button
                type="button"
                onClick={() => setType('outcome')}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
                  type === 'outcome'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <TrendingDown className="w-3.5 h-3.5" />
                Pengeluaran
              </button>
              <button
                type="button"
                onClick={() => setType('income')}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
                  type === 'income'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                Pemasukan
              </button>
              <button
                type="button"
                onClick={() => setType('investment')}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
                  type === 'investment'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Investasi
              </button>
            </div>
            {type === 'investment' && (
              <p className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-1.5">
                Investasi dipisahkan dari konsumsi Outcome namun tetap mengurangi saldo kas.
              </p>
            )}
          </div>

          {/* Amount Input with Live Preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Nominal (IDR) <span className="text-rose-500">*</span>
              </label>
              {parsedAmount > 0 && (
                <span className="font-mono text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                  Terbaca: {formatIDR(parsedAmount)}
                </span>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-sm font-bold text-slate-400 dark:text-slate-500 pointer-events-none">
                Rp
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={amountStr ? parseIDR(amountStr).toLocaleString('id-ID') : ''}
                onChange={handleAmountChange}
                placeholder="0"
                className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-lg font-bold tabular-nums focus:outline-none focus:ring-2 transition-all ${
                  errors.amount
                    ? 'border-rose-500 focus:ring-rose-500/30'
                    : 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500/30 focus:border-emerald-500'
                }`}
              />
            </div>
            {errors.amount && (
              <p className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.amount}
              </p>
            )}

            {/* Quick Amount Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[11px] text-slate-400 mr-1">Cepat:</span>
              {[50000, 100000, 500000, 1000000].map(addVal => (
                <button
                  key={addVal}
                  type="button"
                  onClick={() => handleQuickAddAmount(addVal)}
                  className="px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
                >
                  +{formatIDR(addVal, { compact: true })}
                </button>
              ))}
              {parsedAmount > 0 && (
                <button
                  type="button"
                  onClick={() => setAmountStr('')}
                  className="px-2 py-1 text-[11px] font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors ml-auto"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Category Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Kategori <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowQuickAddCategory(!showQuickAddCategory)}
                className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Kategori Baru
              </button>
            </div>

            {showQuickAddCategory ? (
              <div className="p-3 mb-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Tambah Kategori {type === 'income' ? 'Pemasukan' : type === 'outcome' ? 'Pengeluaran' : 'Investasi'}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Contoh: Belanja Online"
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleQuickCreateCategory}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowQuickAddCategory(false)}
                    className="px-2 py-1.5 text-xs text-slate-500 hover:text-slate-700"
                  >
                    Batal
                  </button>
                </div>
              </div>
            ) : null}

            <select
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                if (errors.categoryId) {
                  setErrors(prev => ({ ...prev, categoryId: '' }));
                }
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 transition-all ${
                errors.categoryId
                  ? 'border-rose-500 focus:ring-rose-500/30'
                  : 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500/30 focus:border-emerald-500'
              }`}
            >
              {availableCategories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.categoryId}
              </p>
            )}
          </div>

          {/* Subcategory for Investment */}
          {type === 'investment' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Subkategori Investasi <span className="text-indigo-500">*</span>
              </label>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
              >
                {INVESTMENT_SUBCATEGORIES.map(sub => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Date Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Tanggal Transaksi <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (errors.date) {
                  setErrors(prev => ({ ...prev, date: '' }));
                }
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
            />
            {errors.date && (
              <p className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.date}
              </p>
            )}
          </div>

          {/* Notes (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Catatan Transaksi <span className="text-slate-400 font-normal">(opsional)</span>
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Belanja mingguan di pasar, makan siang kantor..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-xl transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              {editTransaction ? 'Perbarui Transaksi' : 'Simpan Transaksi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
