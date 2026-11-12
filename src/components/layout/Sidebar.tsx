import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  Receipt,
  BarChart2,
  Target,
  FileText,
  Settings,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatIDR } from '../../utils/currency';

export type NavTab = 'dashboard' | 'record' | 'history' | 'analysis' | 'budget' | 'report' | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  isMobileOpen,
  onCloseMobile
}) => {
  const { selectedPeriod, getPeriodSummary } = useFinance();
  const summary = getPeriodSummary(selectedPeriod);

  const navItems: Array<{ id: NavTab; label: string; icon: React.ElementType; badge?: string }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'record', label: 'Catat Transaksi', icon: PlusCircle },
    { id: 'history', label: 'Riwayat Transaksi', icon: Receipt },
    { id: 'analysis', label: 'Analisis Keuangan', icon: BarChart2 },
    { id: 'budget', label: 'Anggaran Bulanan', icon: Target },
    { id: 'report', label: 'Laporan Bulanan', icon: FileText },
    { id: 'settings', label: 'Pengaturan', icon: Settings }
  ];

  const handleSelect = (tab: NavTab) => {
    onTabChange(tab);
    onCloseMobile();
  };

  const content = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-colors">
      {/* Navigation List */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Menu Utama
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Mini Financial Pill in Sidebar Footer */}
      <div className="p-3 m-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>Saldo Tersedia</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">Aktif</span>
        </div>
        <div className="font-mono text-sm font-bold text-slate-900 dark:text-white mt-1 tabular-nums">
          {formatIDR(summary.endingBalance)}
        </div>
        <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-indigo-500" />
          <span>Investasi: {formatIDR(summary.investment, { compact: true })}</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (lg:block) and Tablet Icon/Rail Sidebar (md:block lg:hidden) */}
      <aside className="hidden md:block md:w-16 lg:w-64 shrink-0 h-[calc(100vh-61px)] sticky top-[61px] transition-all duration-200">
        <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-colors">
          {/* Navigation List */}
          <div className="flex-1 px-2 lg:px-3 py-4 space-y-1.5 overflow-y-auto">
            <div className="hidden lg:block px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Menu Utama
            </div>

            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  title={item.label}
                  className={`w-full flex items-center md:justify-center lg:justify-between px-2.5 lg:px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    />
                    <span className="hidden lg:inline">{item.label}</span>
                  </div>
                  {isActive && (
                    <div className="hidden lg:block w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Mini Financial Pill in Sidebar Footer (expanded on lg, collapsed tooltip-style on md) */}
          <div className="hidden lg:block p-3 m-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Saldo Tersedia</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Aktif</span>
            </div>
            <div className="font-mono text-sm font-bold text-slate-900 dark:text-white mt-1 tabular-nums">
              {formatIDR(summary.endingBalance)}
            </div>
            <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-indigo-500 shrink-0" />
              <span className="truncate">Investasi: {formatIDR(summary.investment, { compact: true })}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[80vw] bg-white dark:bg-slate-900 shadow-2xl z-50 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
