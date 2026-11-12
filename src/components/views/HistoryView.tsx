import React, { useState, useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Transaction, TransactionType } from '../../types/finance';
import { formatIDR, formatDateIndonesian, formatPeriodIndonesian } from '../../utils/currency';
import {
  Search,
  Filter,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Edit2,
  Trash2,
  Calendar,
  Tag,
  PlusCircle,
  FileSpreadsheet
} from 'lucide-react';

interface HistoryViewProps {
  initialFilterType?: 'income' | 'outcome' | 'all';
  initialCategoryId?: string;
  onOpenRecordModal: () => void;
  onEditTransaction: (tx: Transaction) => void;
  onSelectTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (tx: Transaction) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  initialFilterType = 'all',
  initialCategoryId,
  onOpenRecordModal,
  onEditTransaction,
  onSelectTransaction,
  onDeleteTransaction
}) => {
  const { transactions, categories, selectedPeriod, availablePeriods, getCategoryById } = useFinance();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterPeriod, setFilterPeriod] = useState<string>(selectedPeriod);
  const [filterType, setFilterType] = useState<string>(initialFilterType);
  const [filterCategory, setFilterCategory] = useState<string>(initialCategoryId || 'all');
  const [sortOrder, setSortOrder] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');

  // Filtered and sorted transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      // Period filter
      if (filterPeriod !== 'all') {
        const txPeriod = tx.date ? tx.date.substring(0, 7) : '';
        if (txPeriod !== filterPeriod) return false;
      }

      // Type filter
      if (filterType !== 'all') {
        if (tx.type !== filterType) return false;
      }

      // Category filter
      if (filterCategory !== 'all') {
        if (tx.categoryId !== filterCategory) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const cat = getCategoryById(tx.categoryId);
        const catName = cat ? cat.name.toLowerCase() : '';
        const notes = (tx.notes || '').toLowerCase();
        const sub = (tx.subCategory || '').toLowerCase();
        const amountStr = tx.amount.toString();
        if (!catName.includes(query) && !notes.includes(query) && !sub.includes(query) && !amountStr.includes(query)) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortOrder === 'date-desc') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortOrder === 'date-asc') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (sortOrder === 'amount-desc') {
        return b.amount - a.amount;
      }
      if (sortOrder === 'amount-asc') {
        return a.amount - b.amount;
      }
      return 0;
    });
  }, [transactions, filterPeriod, filterType, filterCategory, searchQuery, sortOrder, getCategoryById]);

  // Aggregate stats of filtered transactions
  const totals = useMemo(() => {
    let income = 0;
    let outcome = 0;
    let investment = 0;

    for (const tx of filteredTransactions) {
      if (tx.type === 'income') income += tx.amount;
      else if (tx.type === 'outcome') outcome += tx.amount;
      else if (tx.type === 'investment') investment += tx.amount;
    }

    return { income, outcome, investment, count: filteredTransactions.length };
  }, [filteredTransactions]);

  const getTypeBadge = (type: TransactionType, subCategory?: string) => {
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
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Riwayat Transaksi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Daftar lengkap transaksi mutasi kas dengan pencarian dan filter lanjutan
          </p>
        </div>
        <button
          onClick={onOpenRecordModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-xs active:scale-95 sm:self-auto self-start"
        >
          <PlusCircle className="w-4 h-4" />
          Catat Transaksi
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari transaksi, catatan, nominal..."
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
            />
          </div>

          {/* Period Filter */}
          <div>
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              <option value="all">Semua Periode</option>
              {availablePeriods.map(p => (
                <option key={p} value={p}>
                  {formatPeriodIndonesian(p)}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              <option value="all">Semua Jenis</option>
              <option value="outcome">Pengeluaran (Outcome)</option>
              <option value="income">Pemasukan (Income)</option>
              <option value="investment">Investasi (Investment)</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              <option value="all">Semua Kategori</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.type === 'income' ? 'Masuk' : cat.type === 'outcome' ? 'Keluar' : 'Investasi'})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Secondary Strip: Sort & Filter Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-slate-500 dark:text-slate-400">
            <span>Menampilkan <strong>{totals.count}</strong> transaksi</span>
            {totals.count > 0 && (
              <>
                <span aria-hidden="true" className="hidden sm:inline">·</span>
                {filterType === 'all' ? (
                  <span className="flex flex-wrap gap-1.5 sm:gap-2">
                    <span>Masuk: <strong className="text-emerald-600">{formatIDR(totals.income, { compact: true })}</strong></span>
                    <span aria-hidden="true">·</span>
                    <span>Keluar: <strong className="text-rose-600">{formatIDR(totals.outcome, { compact: true })}</strong></span>
                    <span aria-hidden="true">·</span>
                    <span>Inv: <strong className="text-indigo-600">{formatIDR(totals.investment, { compact: true })}</strong></span>
                  </span>
                ) : filterType === 'income' ? (
                  <span>Total Masuk: <strong className="text-emerald-600">{formatIDR(totals.income)}</strong></span>
                ) : filterType === 'outcome' ? (
                  <span>Total Keluar: <strong className="text-rose-600">{formatIDR(totals.outcome)}</strong></span>
                ) : (
                  <span>Total Investasi: <strong className="text-indigo-600">{formatIDR(totals.investment)}</strong></span>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto pt-1 sm:pt-0">
            <span className="text-slate-400 flex items-center gap-1 shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5" />
              Urutkan:
            </span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 w-full sm:w-auto"
            >
              <option value="date-desc">Tanggal Terkini</option>
              <option value="date-asc">Tanggal Terlama</option>
              <option value="amount-desc">Nominal Terbesar</option>
              <option value="amount-asc">Nominal Terkecil</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transaction List Table / Mobile Cards */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs">
        {filteredTransactions.length === 0 ? (
          <div className="py-16 text-center">
            <FileSpreadsheet className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Tidak Ada Transaksi yang Cocok
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Coba sesuaikan kata kunci pencarian atau bersihkan filter periode dan kategori.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterPeriod('all');
                setFilterType('all');
                setFilterCategory('all');
              }}
              className="mt-4 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          <>
            {/* Mobile Card List (< 640px) */}
            <div className="sm:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTransactions.map(tx => {
                const badge = getTypeBadge(tx.type, tx.subCategory);
                const Icon = badge.icon;
                const category = getCategoryById(tx.categoryId);

                return (
                  <div
                    key={tx.id}
                    onClick={() => onSelectTransaction(tx)}
                    className="p-3.5 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer flex items-center justify-between gap-3 active:bg-slate-100 dark:active:bg-slate-800/60"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-xl shrink-0 ${badge.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">
                            {category?.name || 'Tanpa Kategori'}
                          </span>
                          {tx.type === 'investment' && tx.subCategory && (
                            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium shrink-0">
                              · {tx.subCategory}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                          <span>{formatDateIndonesian(tx.date)}</span>
                          {tx.notes && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="truncate max-w-[120px]">{tx.notes}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`font-mono text-xs font-bold tabular-nums ${
                          tx.type === 'income'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : tx.type === 'outcome'
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-indigo-600 dark:text-indigo-400'
                        }`}
                      >
                        {badge.sign}{formatIDR(tx.amount)}
                      </span>
                      <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onEditTransaction(tx)}
                          title="Edit transaksi"
                          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteTransaction(tx)}
                          title="Hapus transaksi"
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop & Tablet Table (>= 640px) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Tanggal</th>
                    <th className="py-3 px-4">Jenis & Kategori</th>
                    <th className="py-3 px-4">Catatan</th>
                    <th className="py-3 px-4 text-right">Nominal</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredTransactions.map(tx => {
                    const badge = getTypeBadge(tx.type, tx.subCategory);
                    const Icon = badge.icon;
                    const category = getCategoryById(tx.categoryId);

                    return (
                      <tr
                        key={tx.id}
                        onClick={() => onSelectTransaction(tx)}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                      >
                        <td className="py-3 px-4 whitespace-nowrap text-slate-600 dark:text-slate-400 font-medium">
                          {formatDateIndonesian(tx.date)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className={`p-1.5 rounded-lg shrink-0 ${badge.color}`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                                {category?.name || 'Tanpa Kategori'}
                              </span>
                              {tx.type === 'investment' && tx.subCategory && (
                                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                                  Sub: {tx.subCategory}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 max-w-xs truncate text-slate-600 dark:text-slate-400">
                          {tx.notes || <span className="text-slate-300 dark:text-slate-600">—</span>}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <span
                            className={`font-mono text-xs sm:text-sm font-bold tabular-nums ${
                              tx.type === 'income'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : tx.type === 'outcome'
                                ? 'text-rose-600 dark:text-rose-400'
                                : 'text-indigo-600 dark:text-indigo-400'
                            }`}
                          >
                            {badge.sign}{formatIDR(tx.amount)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => onEditTransaction(tx)}
                              title="Edit transaksi"
                              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteTransaction(tx)}
                              title="Hapus transaksi"
                              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
