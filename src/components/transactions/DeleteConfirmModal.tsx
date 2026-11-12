import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Transaction } from '../../types/finance';
import { formatIDR, formatDateIndonesian } from '../../utils/currency';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  transaction: Transaction | null;
  categoryName?: string;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  transaction,
  categoryName
}) => {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 overflow-hidden">
        <div className="flex items-center gap-3.5 mb-4">
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Hapus Transaksi?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 mb-5 text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-500">Nominal:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
              {formatIDR(transaction.amount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Kategori:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {categoryName || 'Tanpa Kategori'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Tanggal:</span>
            <span className="text-slate-700 dark:text-slate-300">
              {formatDateIndonesian(transaction.date)}
            </span>
          </div>
          {transaction.notes && (
            <div className="flex justify-between">
              <span className="text-slate-500">Catatan:</span>
              <span className="text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                {transaction.notes}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors inline-flex items-center gap-1.5 shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
};
