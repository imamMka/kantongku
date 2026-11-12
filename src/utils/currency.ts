/**
 * Currency and date formatting utilities for DompetKu (IDR)
 */

export function formatIDR(amount: number, options?: { compact?: boolean; showSymbol?: boolean }): string {
  const showSymbol = options?.showSymbol !== false;
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  if (options?.compact && absAmount >= 1_000_000) {
    if (absAmount >= 1_000_000_000) {
      const formatted = (absAmount / 1_000_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 });
      return `${isNegative ? '-' : ''}${showSymbol ? 'Rp ' : ''}${formatted} M`;
    }
    const formatted = (absAmount / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 });
    return `${isNegative ? '-' : ''}${showSymbol ? 'Rp ' : ''}${formatted} jt`;
  }

  const formattedNumber = Math.round(absAmount).toLocaleString('id-ID');
  return `${isNegative ? '-' : ''}${showSymbol ? 'Rp ' : ''}${formattedNumber}`;
}

export function parseIDR(input: string | number): number {
  if (typeof input === 'number') return isNaN(input) ? 0 : input;
  if (!input) return 0;
  // Clean all non-digit characters except minus sign
  const cleaned = input.replace(/[^0-9-]/g, '');
  const parsed = parseInt(cleaned, 10);
  return isNaN(parsed) ? 0 : parsed;
}

const INDONESIAN_MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const INDONESIAN_MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'
];

export function formatPeriodIndonesian(period: string, short = false): string {
  // Expected format: YYYY-MM
  if (!period || !period.includes('-')) return period || '';
  const [yearStr, monthStr] = period.split('-');
  const monthIndex = parseInt(monthStr, 10) - 1;
  const monthName = short
    ? (INDONESIAN_MONTHS_SHORT[monthIndex] || monthStr)
    : (INDONESIAN_MONTHS[monthIndex] || monthStr);
  return `${monthName} ${yearStr}`;
}

export function formatDateIndonesian(dateStr: string, options?: { showDay?: boolean; shortMonth?: boolean }): string {
  // Expected format: YYYY-MM-DD
  if (!dateStr || !dateStr.includes('-')) return dateStr || '';
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const monthIndex = parseInt(monthStr, 10) - 1;
  const day = parseInt(dayStr, 10);
  const monthName = options?.shortMonth
    ? (INDONESIAN_MONTHS_SHORT[monthIndex] || monthStr)
    : (INDONESIAN_MONTHS[monthIndex] || monthStr);

  if (options?.showDay) {
    const d = new Date(dateStr);
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const dayName = isNaN(d.getDay()) ? '' : `${dayNames[d.getDay()]}, `;
    return `${dayName}${day} ${monthName} ${yearStr}`;
  }

  return `${day} ${monthName} ${yearStr}`;
}

export function getCurrentPeriod(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function getTodayDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
