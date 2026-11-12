import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { APP_CONFIG } from '../../config/appConfig';
import {
  Wallet,
  ShieldCheck,
  TrendingUp,
  Lock,
  Sparkles,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { signInWithGoogle } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const { error } = await signInWithGoogle();
    if (error) {
      setIsSubmitting(false);
      // Tampilkan pesan error ramah pengguna tanpa membocorkan kredensial internal
      const friendlyMessage =
        error.message?.includes('Konfigurasi Supabase')
          ? error.message
          : 'Terjadi kendala saat menghubungkan ke akun Google. Silakan periksa koneksi internet atau coba beberapa saat lagi.';
      setErrorMessage(friendlyMessage);
    }
    // Jika tidak ada error, browser akan diarahkan ke laman OAuth Google oleh Supabase
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 p-4 sm:p-6 lg:p-8 text-slate-100">
      {/* Container utama: 2 kolom di desktop, 1 kolom di mobile */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden border border-emerald-900/40 bg-slate-900/70 shadow-2xl backdrop-blur-xl">
        {/* Kolom Kiri: Pengenalan Brand & Value Proposition (Desktop 7 cols, Tablet/Mobile 1 col) */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-gradient-to-b from-emerald-900/30 via-emerald-950/20 to-transparent border-b lg:border-b-0 lg:border-r border-emerald-900/30">
          <div>
            {/* Header Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30 ring-1 ring-emerald-400/40">
                <Wallet className="w-5 h-5" />
              </div>
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                {APP_CONFIG.brandName}
              </span>
            </div>

            {/* Headline & Tagline */}
            <div className="mt-8 sm:mt-12">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Manajemen Finansial Personal
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {APP_CONFIG.tagline}
              </h1>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-lg">
                {APP_CONFIG.description}
              </p>
            </div>

            {/* Poin Keamanan & Keunggulan Produk (Tidak menggunakan data palsu) */}
            <div className="mt-8 sm:mt-10 space-y-3.5 sm:space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5 border border-emerald-500/20">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-white">
                    Autentikasi Aman & Otomatis
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Masuk langsung tanpa repot mengingat kata sandi baru. Akun dibuat otomatis saat login pertama.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5 border border-emerald-500/20">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-white">
                    Data Pribadi Terlindungi
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Hanya membutuhkan identitas dasar Google Anda untuk masuk, tanpa akses ke file atau email Anda.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5 border border-emerald-500/20">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-white">
                    Fokus pada Tujuan Finansial
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Mulai catat setiap rupiah, analisis kebiasaan belanja, dan kelola anggaran dengan jernih.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Kolom Kiri */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Terhubung aman melalui infrastruktur Supabase Auth.</span>
          </div>
        </div>

        {/* Kolom Kanan: Kartu Login (Desktop 5 cols, Tablet/Mobile 1 col) */}
        <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-slate-900/90">
          <div className="w-full max-w-sm mx-auto">
            {/* Header Form */}
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Selamat Datang
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
                Masuk ke akun Anda atau mulai akun baru dalam satu ketukan.
              </p>
            </div>

            {/* Alert Error jika login gagal */}
            {errorMessage && (
              <div
                role="alert"
                className="mt-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {/* Tombol Utama Google Sign-In */}
            <div className="mt-6 sm:mt-8 space-y-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-900 font-semibold text-sm transition-all shadow-lg hover:shadow-xl hover:shadow-white/5 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                    <span>Menghubungkan...</span>
                  </>
                ) : (
                  <>
                    {/* Official Google 'G' Icon */}
                    <svg
                      className="w-5 h-5 shrink-0"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                    <span>Lanjutkan dengan Google</span>
                  </>
                )}
              </button>

              {/* Keterangan Akun Baru & Kebijakan Privasi */}
              <div className="space-y-2 text-center text-xs text-slate-400 pt-2">
                <p>
                  Login pertama kali akan membuat akun pengguna Anda secara otomatis.
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Dengan melanjutkan, Anda menyetujui penggunaan autentikasi yang aman. Kami tidak meminta hak akses ke email maupun berkas Google Drive Anda.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
