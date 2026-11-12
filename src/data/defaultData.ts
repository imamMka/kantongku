import { Category, Transaction, Budget, BalanceSettings } from '../types/finance';

export const DEFAULT_CATEGORIES: Category[] = [
  // Income
  { id: 'cat-in-1', name: 'Gaji Pokok', type: 'income', color: '#10B981', iconName: 'Briefcase', isDefault: true },
  { id: 'cat-in-2', name: 'Freelance & Proyek', type: 'income', color: '#059669', iconName: 'Laptop', isDefault: true },
  { id: 'cat-in-3', name: 'Bonus & Insentif', type: 'income', color: '#34D399', iconName: 'Award', isDefault: true },
  { id: 'cat-in-4', name: 'Dividen & Imbal Hasil', type: 'income', color: '#6EE7B7', iconName: 'TrendingUp', isDefault: true },
  { id: 'cat-in-5', name: 'Pemasukan Lainnya', type: 'income', color: '#A7F3D0', iconName: 'PlusCircle', isDefault: true },

  // Outcome
  { id: 'cat-out-1', name: 'Makanan & Minuman', type: 'outcome', color: '#F43F5E', iconName: 'Utensils', isDefault: true },
  { id: 'cat-out-2', name: 'Transportasi & Bensin', type: 'outcome', color: '#FB923C', iconName: 'Car', isDefault: true },
  { id: 'cat-out-3', name: 'Tagihan & Utilitas', type: 'outcome', color: '#E11D48', iconName: 'Zap', isDefault: true },
  { id: 'cat-out-4', name: 'Belanja Kebutuhan Rumah', type: 'outcome', color: '#F59E0B', iconName: 'ShoppingBag', isDefault: true },
  { id: 'cat-out-5', name: 'Hiburan & Lifestyle', type: 'outcome', color: '#EC4899', iconName: 'Film', isDefault: true },
  { id: 'cat-out-6', name: 'Kesehatan & Obat', type: 'outcome', color: '#06B6D4', iconName: 'HeartPulse', isDefault: true },
  { id: 'cat-out-7', name: 'Pendidikan & Kursus', type: 'outcome', color: '#8B5CF6', iconName: 'GraduationCap', isDefault: true },
  { id: 'cat-out-8', name: 'Sedekah & Donasi', type: 'outcome', color: '#14B8A6', iconName: 'HandHeart', isDefault: true },

  // Investment
  { id: 'cat-inv-1', name: 'Emergency Fund (Dana Darurat)', type: 'investment', color: '#6366F1', iconName: 'ShieldCheck', isDefault: true },
  { id: 'cat-inv-2', name: 'RDPU (Reksa Dana Pasar Uang)', type: 'investment', color: '#818CF8', iconName: 'PiggyBank', isDefault: true },
  { id: 'cat-inv-3', name: 'SBN / Obligasi Negara', type: 'investment', color: '#4F46E5', iconName: 'Landmark', isDefault: true },
  { id: 'cat-inv-4', name: 'Saham & ETF', type: 'investment', color: '#4338CA', iconName: 'BarChart3', isDefault: true },
  { id: 'cat-inv-5', name: 'Emas Fisik & Logam Mulia', type: 'investment', color: '#EAB308', iconName: 'Coins', isDefault: true }
];

export const INVESTMENT_SUBCATEGORIES = [
  'Emergency Fund',
  'RDPU',
  'SBN / Obligasi',
  'Saham / ETF',
  'Emas Fisik',
  'Crypto / Lainnya'
];

export const DEFAULT_BALANCE_SETTINGS: BalanceSettings = {
  initialBalance: 20000000, // Rp 20.000.000
  startDate: '2026-09'
};

export const DEFAULT_BUDGETS: Budget[] = [
  // 2026-11
  { id: 'b-11-1', categoryId: 'cat-out-1', period: '2026-11', amount: 3500000 }, // Makanan
  { id: 'b-11-2', categoryId: 'cat-out-2', period: '2026-11', amount: 1200000 }, // Transportasi
  { id: 'b-11-3', categoryId: 'cat-out-3', period: '2026-11', amount: 1800000 }, // Tagihan
  { id: 'b-11-4', categoryId: 'cat-out-4', period: '2026-11', amount: 1500000 }, // Belanja
  { id: 'b-11-5', categoryId: 'cat-out-5', period: '2026-11', amount: 800000 },  // Hiburan

  // 2026-10
  { id: 'b-10-1', categoryId: 'cat-out-1', period: '2026-10', amount: 3500000 },
  { id: 'b-10-2', categoryId: 'cat-out-2', period: '2026-10', amount: 1200000 },
  { id: 'b-10-3', categoryId: 'cat-out-3', period: '2026-10', amount: 1800000 },
  { id: 'b-10-4', categoryId: 'cat-out-4', period: '2026-10', amount: 1500000 }
];

export const DEFAULT_TRANSACTIONS: Transaction[] = [
  // November 2026 (Current Month)
  {
    id: 'tx-nov-01',
    type: 'income',
    amount: 14500000,
    categoryId: 'cat-in-1',
    date: '2026-11-01',
    notes: 'Gaji Pokok Bulanan PT Solusi Digital',
    createdAt: '2026-11-01T08:00:00Z',
    updatedAt: '2026-11-01T08:00:00Z'
  },
  {
    id: 'tx-nov-02',
    type: 'investment',
    amount: 2000000,
    categoryId: 'cat-inv-1',
    subCategory: 'Emergency Fund',
    date: '2026-11-02',
    notes: 'Top up Dana Darurat rekening tabungan terpisah',
    createdAt: '2026-11-02T09:15:00Z',
    updatedAt: '2026-11-02T09:15:00Z'
  },
  {
    id: 'tx-nov-03',
    type: 'investment',
    amount: 1500000,
    categoryId: 'cat-inv-2',
    subCategory: 'RDPU',
    date: '2026-11-02',
    notes: 'RDPU Bibit berkala awal bulan',
    createdAt: '2026-11-02T09:30:00Z',
    updatedAt: '2026-11-02T09:30:00Z'
  },
  {
    id: 'tx-nov-04',
    type: 'outcome',
    amount: 1450000,
    categoryId: 'cat-out-3',
    date: '2026-11-03',
    notes: 'Listrik PLN, WiFi Indihome & BPJS Kesehatan',
    createdAt: '2026-11-03T11:00:00Z',
    updatedAt: '2026-11-03T11:00:00Z'
  },
  {
    id: 'tx-nov-05',
    type: 'outcome',
    amount: 680000,
    categoryId: 'cat-out-4',
    date: '2026-11-04',
    notes: 'Belanja bulanan sembako Superindo',
    createdAt: '2026-11-04T16:20:00Z',
    updatedAt: '2026-11-04T16:20:00Z'
  },
  {
    id: 'tx-nov-06',
    type: 'outcome',
    amount: 350000,
    categoryId: 'cat-out-2',
    date: '2026-11-05',
    notes: 'Isi Pertamax mobil & E-Toll',
    createdAt: '2026-11-05T08:45:00Z',
    updatedAt: '2026-11-05T08:45:00Z'
  },
  {
    id: 'tx-nov-07',
    type: 'outcome',
    amount: 420000,
    categoryId: 'cat-out-1',
    date: '2026-11-06',
    notes: 'Makan malam bersama keluarga',
    createdAt: '2026-11-06T20:10:00Z',
    updatedAt: '2026-11-06T20:10:00Z'
  },
  {
    id: 'tx-nov-08',
    type: 'income',
    amount: 3200000,
    categoryId: 'cat-in-2',
    date: '2026-11-07',
    notes: 'Pelunasan proyek UI/UX Dashboard klien Bandung',
    createdAt: '2026-11-07T14:00:00Z',
    updatedAt: '2026-11-07T14:00:00Z'
  },
  {
    id: 'tx-nov-09',
    type: 'outcome',
    amount: 275000,
    categoryId: 'cat-out-1',
    date: '2026-11-08',
    notes: 'Kopi & makan siang kantor',
    createdAt: '2026-11-08T13:00:00Z',
    updatedAt: '2026-11-08T13:00:00Z'
  },
  {
    id: 'tx-nov-10',
    type: 'outcome',
    amount: 250000,
    categoryId: 'cat-out-5',
    date: '2026-11-09',
    notes: 'Nonton bioskop IMAX & cemilan',
    createdAt: '2026-11-09T19:30:00Z',
    updatedAt: '2026-11-09T19:30:00Z'
  },

  // October 2026 (Previous Month)
  {
    id: 'tx-oct-01',
    type: 'income',
    amount: 14500000,
    categoryId: 'cat-in-1',
    date: '2026-10-01',
    notes: 'Gaji Pokok Oktober',
    createdAt: '2026-10-01T08:00:00Z',
    updatedAt: '2026-10-01T08:00:00Z'
  },
  {
    id: 'tx-oct-02',
    type: 'investment',
    amount: 2000000,
    categoryId: 'cat-inv-1',
    subCategory: 'Emergency Fund',
    date: '2026-10-02',
    notes: 'Alokasi Dana Darurat',
    createdAt: '2026-10-02T09:00:00Z',
    updatedAt: '2026-10-02T09:00:00Z'
  },
  {
    id: 'tx-oct-03',
    type: 'investment',
    amount: 1500000,
    categoryId: 'cat-inv-2',
    subCategory: 'RDPU',
    date: '2026-10-02',
    notes: 'Investasi RDPU bulanan',
    createdAt: '2026-10-02T09:30:00Z',
    updatedAt: '2026-10-02T09:30:00Z'
  },
  {
    id: 'tx-oct-04',
    type: 'outcome',
    amount: 3100000,
    categoryId: 'cat-out-1',
    date: '2026-10-15',
    notes: 'Total makan & groceries Oktober',
    createdAt: '2026-10-15T12:00:00Z',
    updatedAt: '2026-10-15T12:00:00Z'
  },
  {
    id: 'tx-oct-05',
    type: 'outcome',
    amount: 1100000,
    categoryId: 'cat-out-2',
    date: '2026-10-20',
    notes: 'Bensin & servis berkala motor',
    createdAt: '2026-10-20T10:00:00Z',
    updatedAt: '2026-10-20T10:00:00Z'
  },
  {
    id: 'tx-oct-06',
    type: 'outcome',
    amount: 1750000,
    categoryId: 'cat-out-3',
    date: '2026-10-05',
    notes: 'Tagihan utilitas rumah',
    createdAt: '2026-10-05T11:00:00Z',
    updatedAt: '2026-10-05T11:00:00Z'
  },
  {
    id: 'tx-oct-07',
    type: 'outcome',
    amount: 1300000,
    categoryId: 'cat-out-4',
    date: '2026-10-25',
    notes: 'Belanja perlengkapan rumah',
    createdAt: '2026-10-25T14:00:00Z',
    updatedAt: '2026-10-25T14:00:00Z'
  },
  {
    id: 'tx-oct-08',
    type: 'income',
    amount: 4500000,
    categoryId: 'cat-in-2',
    date: '2026-10-28',
    notes: 'Fee Konsultasi Desain Web',
    createdAt: '2026-10-28T16:00:00Z',
    updatedAt: '2026-10-28T16:00:00Z'
  },

  // September 2026
  {
    id: 'tx-sep-01',
    type: 'income',
    amount: 14500000,
    categoryId: 'cat-in-1',
    date: '2026-09-01',
    notes: 'Gaji Pokok September',
    createdAt: '2026-09-01T08:00:00Z',
    updatedAt: '2026-09-01T08:00:00Z'
  },
  {
    id: 'tx-sep-02',
    type: 'investment',
    amount: 2500000,
    categoryId: 'cat-inv-1',
    subCategory: 'Emergency Fund',
    date: '2026-09-03',
    notes: 'Setoran Dana Darurat',
    createdAt: '2026-09-03T10:00:00Z',
    updatedAt: '2026-09-03T10:00:00Z'
  },
  {
    id: 'tx-sep-03',
    type: 'outcome',
    amount: 3400000,
    categoryId: 'cat-out-1',
    date: '2026-09-20',
    notes: 'Konsumsi dan katering September',
    createdAt: '2026-09-20T12:00:00Z',
    updatedAt: '2026-09-20T12:00:00Z'
  },
  {
    id: 'tx-sep-04',
    type: 'outcome',
    amount: 1650000,
    categoryId: 'cat-out-3',
    date: '2026-09-06',
    notes: 'Tagihan listrik & internet',
    createdAt: '2026-09-06T15:00:00Z',
    updatedAt: '2026-09-06T15:00:00Z'
  }
];
