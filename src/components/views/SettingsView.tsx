import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Category, TransactionType } from '../../types/finance';
import { formatIDR, parseIDR, formatPeriodIndonesian } from '../../utils/currency';
import {
  Settings,
  Wallet,
  Tags,
  Database,
  Plus,
  Trash2,
  Edit2,
  Check,
  AlertCircle,
  RefreshCw,
  Download,
  Upload,
  ShieldCheck,
  Info
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    balanceSettings,
    updateBalanceSettings,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    resetToDefaultData,
    clearAllData,
    exportJSON,
    importJSON
  } = useFinance();

  // Balance Settings Form
  const [initialBalanceInput, setInitialBalanceInput] = useState<string>(
    balanceSettings.initialBalance.toString()
  );
  const [startDateInput, setStartDateInput] = useState<string>(balanceSettings.startDate);
  const [balanceSavedMsg, setBalanceSavedMsg] = useState(false);

  // Category Management Form
  const [activeCategoryType, setActiveCategoryType] = useState<TransactionType>('outcome');
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#10B981');
  const [categoryError, setCategoryError] = useState('');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editCatName, setEditCatName] = useState('');

  // Backup & Import
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleSaveInitialBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = parseIDR(initialBalanceInput);
      await updateBalanceSettings({
        initialBalance: parsed,
        startDate: startDateInput
      });
      setBalanceSavedMsg(true);
      setTimeout(() => setBalanceSavedMsg(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan saldo awal.');
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      setCategoryError('Nama kategori tidak boleh kosong.');
      return;
    }
    try {
      await addCategory({
        name: newCatName.trim(),
        type: activeCategoryType,
        color: newCatColor
      });
      setNewCatName('');
      setCategoryError('');
    } catch (err: any) {
      setCategoryError(err.message || 'Gagal menambahkan kategori.');
    }
  };

  const handleStartEditCategory = (cat: Category) => {
    setEditingCatId(cat.id);
    setEditCatName(cat.name);
  };

  const handleSaveEditCategory = async (id: string) => {
    if (!editCatName.trim()) return;
    try {
      await updateCategory(id, { name: editCatName.trim() });
      setEditingCatId(null);
      setEditCatName('');
    } catch (err: any) {
      alert(err.message || 'Gagal mengubah nama kategori.');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const res = await deleteCategory(id);
    if (!res.success) {
      alert(res.message);
    }
  };

  const handleDownloadBackup = () => {
    const jsonStr = exportJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `DompetKu_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = await importJSON(content);
        setImportStatus(result);
        setTimeout(() => setImportStatus(null), 5000);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // reset input
  };

  const handleConfirmReset = async () => {
    if (window.confirm('Muat ulang kategori bawaan Indonesia dan bersihkan transaksi? Tindakan ini akan mengosongkan data transaksi dan anggaran.')) {
      await resetToDefaultData();
      alert('Kategori awal berhasil dimuat ulang!');
    }
  };

  const handleConfirmClearAll = async () => {
    if (window.confirm('PERINGATAN: Apakah Anda yakin ingin mengosongkan seluruh data transaksi dan anggaran di cloud? Tindakan ini tidak dapat dibatalkan.')) {
      await clearAllData();
      alert('Seluruh data transaksi telah dikosongkan.');
    }
  };

  const filteredCategories = categories.filter(c => c.type === activeCategoryType);

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Top Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Pengaturan Aplikasi
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Kelola saldo awal bergulir, kategori transaksi, mata uang, dan pencadangan data
        </p>
      </div>

      {/* 1. Pengaturan Saldo Awal */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Pengaturan Saldo Awal Bergulir
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Menjadi acuan dasar untuk menghitung saldo berjalan di setiap bulan
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveInitialBalance} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Nominal Saldo Awal (IDR)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-xs text-slate-400">
                  Rp
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={initialBalanceInput ? parseIDR(initialBalanceInput).toLocaleString('id-ID') : ''}
                  onChange={(e) => setInitialBalanceInput(parseIDR(e.target.value).toString())}
                  className="w-full pl-10 pr-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Mulai Berlaku Sejak Bulan
              </label>
              <input
                type="month"
                value={startDateInput}
                onChange={(e) => setStartDateInput(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              Mata uang aktif: <strong>Rupiah (IDR)</strong>
            </span>
            <div className="flex items-center gap-2">
              {balanceSavedMsg && (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  Saldo awal tersimpan!
                </span>
              )}
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 rounded-xl transition-colors"
              >
                Simpan Saldo Awal
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 2. Pengelolaan Kategori */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              <Tags className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Pengelolaan Kategori Transaksi
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Atur label pengelompokan untuk Pemasukan, Pengeluaran, dan Investasi
              </p>
            </div>
          </div>
        </div>

        {/* Type Filter Tabs */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl max-w-sm">
          <button
            onClick={() => setActiveCategoryType('outcome')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeCategoryType === 'outcome'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Pengeluaran
          </button>
          <button
            onClick={() => setActiveCategoryType('income')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeCategoryType === 'income'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Pemasukan
          </button>
          <button
            onClick={() => setActiveCategoryType('investment')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeCategoryType === 'investment'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Investasi
          </button>
        </div>

        {/* Add Category Form */}
        <form onSubmit={handleAddCategory} className="flex gap-2 items-center">
          <input
            type="text"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder={`Tambah kategori ${activeCategoryType}...`}
            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
          <button
            type="submit"
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors inline-flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Kategori
          </button>
        </form>
        {categoryError && (
          <p className="text-xs text-rose-600 dark:text-rose-400">{categoryError}</p>
        )}

        {/* Category List */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredCategories.map(cat => {
            const isEditing = editingCatId === cat.id;
            return (
              <div key={cat.id} className="py-2.5 flex items-center justify-between text-xs">
                {isEditing ? (
                  <div className="flex items-center gap-2 flex-1 mr-3">
                    <input
                      type="text"
                      value={editCatName}
                      onChange={(e) => setEditCatName(e.target.value)}
                      className="px-2.5 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 flex-1"
                    />
                    <button
                      onClick={() => handleSaveEditCategory(cat.id)}
                      className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 rounded"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={() => setEditingCatId(null)}
                      className="px-2 py-1 text-xs text-slate-500"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: cat.color || '#10B981' }}
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {cat.name}
                    </span>
                    {cat.isDefault && (
                      <span className="text-[10px] text-slate-400">(Bawaan)</span>
                    )}
                  </div>
                )}

                {!isEditing && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStartEditCategory(cat)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Pencadangan & Pemulihan Data (Backup & Reset) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Pencadangan, Ekspor, & Pemulihan Data
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Data tersimpan aman di browser lokal Anda tanpa bergantung ke pihak ketiga
            </p>
          </div>
        </div>

        {importStatus && (
          <div
            className={`p-3 rounded-xl text-xs font-medium ${
              importStatus.success
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
            }`}
          >
            {importStatus.message}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleDownloadBackup}
            className="flex items-center justify-center gap-2 p-3 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            Unduh Cadangan (Backup JSON)
          </button>

          <label className="flex items-center justify-center gap-2 p-3 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-indigo-600" />
            Pulihkan dari Berkas JSON
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Reset Actions */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleConfirmReset}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Muat Ulang Sampel Bawaan Indonesia
          </button>

          <button
            onClick={handleConfirmClearAll}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Kosongkan Seluruh Data Transaksi
          </button>
        </div>
      </div>
    </div>
  );
};
