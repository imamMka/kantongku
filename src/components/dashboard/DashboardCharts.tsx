import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatIDR } from '../../utils/currency';
import { BarChart3, PieChart, Table, Eye, ArrowUpRight } from 'lucide-react';

interface DashboardChartsProps {
  onCategoryClick?: (categoryId: string) => void;
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({ onCategoryClick }) => {
  const { selectedPeriod, getPeriodSummary, categories } = useFinance();
  const [activeTab, setActiveTab] = useState<'outcome_category' | 'cashflow_comparison'>('outcome_category');
  const [viewMode, setViewMode] = useState<'visual' | 'table'>('visual');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const summary = getPeriodSummary(selectedPeriod);

  // Outcome category data
  const outcomeCategories = categories.filter(c => c.type === 'outcome');
  const categoryData = outcomeCategories
    .map(c => {
      const amount = summary.categoryRealizations[c.id] || 0;
      const percentage = summary.outcome > 0 ? Math.round((amount / summary.outcome) * 100) : 0;
      return {
        id: c.id,
        name: c.name,
        amount,
        percentage,
        color: c.color || '#10B981'
      };
    })
    .filter(c => c.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  // Cashflow comparison data
  const comparisonData = [
    { label: 'Pemasukan (Income)', amount: summary.income, color: '#10B981', textColor: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Pengeluaran (Outcome)', amount: summary.outcome, color: '#F43F5E', textColor: 'text-rose-600 dark:text-rose-400' },
    { label: 'Investasi (Investment)', amount: summary.investment, color: '#6366F1', textColor: 'text-indigo-600 dark:text-indigo-400' }
  ];
  const maxComparison = Math.max(...comparisonData.map(d => d.amount), 1);

  return (
    <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
      {/* Chart Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
          <button
            onClick={() => setActiveTab('outcome_category')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'outcome_category'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Outcome per Kategori
          </button>
          <button
            onClick={() => setActiveTab('cashflow_comparison')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'cashflow_comparison'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Perbandingan Kas
          </button>
        </div>

        {/* View Mode Toggle: Visual vs Table */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800 self-end sm:self-auto">
          <button
            onClick={() => setViewMode('visual')}
            title="Tampilan Grafik"
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'visual'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            title="Tampilan Daftar / Tabel Aksesibel"
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'table'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Table className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chart Body */}
      <div className="mt-5">
        {activeTab === 'outcome_category' && (
          <>
            {categoryData.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 dark:text-slate-500">
                Belum ada data pengeluaran (Outcome) pada periode ini untuk ditampilkan dalam grafik.
              </div>
            ) : viewMode === 'visual' ? (
              <div className="space-y-3.5">
                {/* Horizontal Segment Bars */}
                {categoryData.map((cat, idx) => (
                  <div
                    key={cat.id}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => onCategoryClick && onCategoryClick(cat.id)}
                    className="group cursor-pointer p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-xs shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {cat.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-mono tabular-nums text-xs">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {formatIDR(cat.amount)}
                        </span>
                        <span className="text-slate-400 dark:text-slate-500 text-[11px]">
                          ({cat.percentage}%)
                        </span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.max(cat.percentage, 2)}%`,
                          backgroundColor: cat.color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Accessible Table View */
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Kategori</th>
                      <th className="py-2.5 px-3 text-right">Nominal</th>
                      <th className="py-2.5 px-3 text-right">Proporsi</th>
                      <th className="py-2.5 px-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {categoryData.map(cat => (
                      <tr key={cat.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-xs shrink-0" style={{ backgroundColor: cat.color }} />
                          {cat.name}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900 dark:text-white tabular-nums">
                          {formatIDR(cat.amount)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                          {cat.percentage}%
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => onCategoryClick && onCategoryClick(cat.id)}
                            className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                          >
                            Lihat
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {activeTab === 'cashflow_comparison' && (
          <div className="space-y-5">
            {viewMode === 'visual' ? (
              <div className="space-y-4 pt-2">
                {comparisonData.map(item => {
                  const percentOfMax = maxComparison > 0 ? Math.round((item.amount / maxComparison) * 100) : 0;
                  return (
                    <div key={item.label} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {item.label}
                        </span>
                        <span className={`font-mono text-sm font-bold tabular-nums ${item.textColor}`}>
                          {formatIDR(item.amount)}
                        </span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-200/70 dark:bg-slate-700/60 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.max(percentOfMax, 2)}%`,
                            backgroundColor: item.color
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Komponen Arus Kas</th>
                      <th className="py-2.5 px-3 text-right">Nominal Periode</th>
                      <th className="py-2.5 px-3 text-right">Peran dalam Saldo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-2.5 px-3 font-medium text-emerald-600 dark:text-emerald-400">
                        Pemasukan (Income)
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                        +{formatIDR(summary.income)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-500">
                        Menambah saldo kas
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-2.5 px-3 font-medium text-rose-600 dark:text-rose-400">
                        Pengeluaran (Outcome)
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-rose-600 dark:text-rose-400 tabular-nums">
                        −{formatIDR(summary.outcome)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-500">
                        Mengurangi saldo kas (biaya konsumsi)
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-2.5 px-3 font-medium text-indigo-600 dark:text-indigo-400">
                        Investasi (Investment)
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-indigo-600 dark:text-indigo-400 tabular-nums">
                        −{formatIDR(summary.investment)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-500">
                        Mengurangi kas (dialokasikan ke aset)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
