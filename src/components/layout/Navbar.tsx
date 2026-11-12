import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
import { APP_CONFIG } from '../../config/appConfig';
import { formatPeriodIndonesian } from '../../utils/currency';
import {
  Wallet,
  Calendar,
  PlusCircle,
  Sun,
  Moon,
  Menu,
  ChevronDown,
  LogOut,
  User as UserIcon,
} from 'lucide-react';

interface NavbarProps {
  onOpenRecordModal: () => void;
  onToggleMobileMenu: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenRecordModal,
  onToggleMobileMenu,
  isDarkMode,
  onToggleTheme
}) => {
  const { selectedPeriod, setSelectedPeriod, availablePeriods } = useFinance();
  const { user, signOut } = useAuth();
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 sm:px-6 py-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      {/* Zone 1: Brand Wordmark (Single text element) */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-1.5 -ml-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <a
          href="/"
          onClick={(e) => e.preventDefault()}
          className="flex items-center gap-2 sm:gap-2.5 text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 group"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <Wallet className="w-4 h-4" />
          </div>
          <span>
            {APP_CONFIG.brandName}
          </span>
        </a>
      </div>

      {/* Zone 2: Period Selector dropdown & controls */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-xl transition-all whitespace-nowrap shrink-0 border border-transparent dark:border-slate-700"
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="hidden sm:inline">Periode: </span>
            <span className="font-bold">{formatPeriodIndonesian(selectedPeriod)}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {showPeriodDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowPeriodDropdown(false)}
              />
              <div className="absolute right-0 mt-2 w-48 py-1.5 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Pilih Bulan
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {availablePeriods.map(p => (
                    <button
                      key={p}
                      onClick={() => {
                        setSelectedPeriod(p);
                        setShowPeriodDropdown(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs transition-colors flex items-center justify-between ${
                        selectedPeriod === p
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 font-medium'
                      }`}
                    >
                      <span>{formatPeriodIndonesian(p)}</span>
                      {selectedPeriod === p && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Zone 3: Primary Action (+ Catat Transaksi) & Theme Switcher */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          onClick={onToggleTheme}
          title={isDarkMode ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
          className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        <button
          onClick={onOpenRecordModal}
          className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-xs hover:shadow-sm whitespace-nowrap shrink-0 active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Catat Transaksi</span>
          <span className="sm:hidden">Catat</span>
        </button>

        {/* User Avatar & Logout Dropdown */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              title={user.email || 'Pengguna'}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
            >
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt={user.user_metadata?.full_name || 'Avatar'}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full ring-2 ring-emerald-500/30 object-cover"
                />
              ) : (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                  {(user.email?.[0] || 'U').toUpperCase()}
                </div>
              )}
            </button>

            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 py-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-700/60">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {user.user_metadata?.full_name || 'Pengguna'}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {user.email}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      signOut();
                    }}
                    className="w-full mt-1 px-3.5 py-2 text-left text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar Akun</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
