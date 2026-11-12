import React from 'react';
import { Transaction } from '../../types/finance';
import { useFinance } from '../../context/FinanceContext';
import { formatIDR, formatDateIndonesian } from '../../utils/currency';
import { X, Edit2, Trash2, TrendingUp, TrendingDown, ShieldCheck, Calendar, Tag, FileText, Clock } from 'lucide-react';

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onEdit: (tx: Transaction) => void;
  onDelete: (tx: Transaction) => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  isOpen,
  onClose,
  transaction,
  onEdit,
  onDelete
}) => {
  const { getCategoryById } = useFinance();

  if (!isOpen || !transaction) return null;

  const category = getCategoryById(transaction.categoryId);

  const getTypeInfo = () => {
    switch (transaction.type) {
      case 'income':
        return {
          icon: TrendingUp,
          color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40',
          title: 'Pemasukan (Income)',
          sign: '+'
        };
      case 'outcome':
        return {
          icon: TrendingDown,
          color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40',
          title: 'Pengeluaran (Outcome)',
          sign: '−'
        };
      case 'investment':
        return {
          icon: ShieldCheck,
          color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40',
          title: 'Alokasi Investasi (Investment)',
          sign: '−'
        };
    }
  };

  const typeInfo = getTypeInfo();
  const Icon = typeInfo.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${typeInfo.color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Detail Transaksi
            </h3>
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
          {/* Amount Spotlight */}
          <div className="text-center py-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-400 font-medium">{typeInfo.title}</span>
            <div
              className={`font-mono text-2xl sm:text-3xl font-bold mt-1 tabular-nums ${
                transaction.type === 'income'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : transaction.type === 'outcome'
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-indigo-600 dark:text-indigo-400'
              }`}
            >
              {typeInfo.sign}{formatIDR(transaction.amount)}
            </div>
          </div>

          {/* Details list */}
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                Kategori
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {category?.name || 'Tanpa Kategori'}
              </span>
            </div>

            {transaction.type === 'investment' && transaction.subCategory && (
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                  Subkategori Investasi
                </span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {transaction.subCategory}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Tanggal Transaksi
              </span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {formatDateIndonesian(transaction.date, { showDay: true })}
              </span>
            </div>

            {transaction.notes && (
              <div className="py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 flex items-center gap-1.5 mb-1">
                  <FileText className="w-3.5 h-3.5" />
                  Catatan
                </span>
                <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-lg leading-relaxed">
                  {transaction.notes}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between py-2 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Dibuat
              </span>
              <span>
                {new Date(transaction.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => {
              onClose();
              onDelete(transaction);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Hapus
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 transition-colors"
            >
              Tutup
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit(transaction);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 rounded-xl transition-colors shadow-2xs"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit Transaksi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
