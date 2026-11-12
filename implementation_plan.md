# DompetKu — Personal Finance Dashboard

A production-grade, human-centered personal finance web application built in Indonesian Rupiah (IDR) to record transactions, monitor spending against category budgets, track distinct investment allocations (Emergency Fund, RDPU, etc.), and provide interactive monthly analytical insights.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following product decisions were confirmed during the planning clarification phase and form the foundational blueprint for development:
>
> - **Product Identity & Theme**: Named **DompetKu**, adopting a modern fintech aesthetic with an emerald (`#059669` / `#10B981`) accent, deep slate/neutral canvas, high typographic clarity (`Plus Jakarta Sans` + `tabular-nums`), and crisp contrast.
> - **Balance Calculation & Multi-Period Carry-Over**: Configurable baseline starting balance with automated month-over-month rolling continuity:
>   $$\text{Current Period Starting Balance} = \text{Initial Baseline} + \sum_{\text{prior months}}(\text{Income} - \text{Outcome} - \text{Investment})$$
>   $$\text{Ending Period Balance} = \text{Period Starting Balance} + \text{Period Income} - \text{Period Outcome} - \text{Period Investment}$$
> - **Out-of-the-Box Experience**: Pre-seeded with realistic Indonesian transactions, standard expense categories (Makanan & Minuman, Transportasi, Tagihan & Utilitas, Belanja, Hiburan, Kesehatan), investment subcategories (Emergency Fund, RDPU, SBN), and monthly budgets for instant exploration, with 1-click reset or clear data in Settings.
> - **Investment Separation Principle**: Transactions classified as `Investment` (Dana Darurat, RDPU, Saham/Reksa Dana) reduce available cash balance but are strictly quarantined from `Outcome` (consumption spending) and do not count against consumption budgets.

---

## 1. Overview & Core Concept

### What It Does
DompetKu is a dedicated personal finance command center designed for structured transaction logging and transparent financial tracking without chat interfaces or complex accounting overhead. It gives users immediate clarity on current month cash flow, top spending drivers, budget utilization with gentle overflow alerts, and investment growth.

### Target Audience & Persona
Individual professionals, freelancers, and family money managers (specifically in Indonesia) who need a responsive web app (mobile and desktop) to log daily spending, keep consumption separate from long-term savings/investments, and review monthly progress.

### Key Value Delivered
- **Structured Frictionless Input**: Intuitive custom modal/page form with real-time numeric formatting (`Rp 150.000`), dynamic category dropdowns based on transaction type, and zero duplicate submissions.
- **Traceable Numbers**: Every overview card, chart segment, and budget progress bar links directly into a pre-filtered transaction view.
- **Non-blocking Budget Discipline**: Warns visibly when spending nears or exceeds category thresholds while never rejecting valid real-world transactions.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Dashboard Overview & Deep Dive**:
   - The user opens the dashboard and immediately sees the active period filter (e.g., `Maret 2026`) and 4 core summary cards: **Saldo**, **Pemasukan (Income)**, **Pengeluaran (Outcome)**, and **Total Transaksi**.
   - Clicking **Saldo** opens a breakdown drawer showing Starting Balance + Income − Outcome − Investment = Ending Balance.
   - Clicking **Outcome** or **Income** filters and navigates directly to Transaction History for that period and type.
   - Directly below, the **Kategori Pengeluaran Terbesar** spotlight showcases the #1 consumption drain with nominal value and percentage of total Outcome.
   - Below the spotlight sits an interactive spending distribution bar/donut, monthly cash flow trend chart, category budget progress tracker, investment breakdown widget, and recent transaction stream.

2. **Catat Transaksi (Record Transaction)**:
   - Floating quick-action or sidebar button opens a clean, focused form.
   - User toggles type: `Pemasukan` (Income), `Pengeluaran` (Outcome), or `Investasi` (Investment).
   - Category selection dynamically updates (e.g., Selecting `Investasi` restricts categories to `Emergency Fund`, `RDPU`, `SBN/Obligasi`, `Saham`).
   - Nominal input features clear live Rupiah formatting with quick-amount chips (+50k, +100k, +500k, +1jt).
   - Instant review banner displays before commit; upon submission, toast confirmation appears with an immediate "Undo" / "Edit" affordance.

3. **Riwayat & Filter Transaksi**:
   - Comprehensive ledger table with search by notes/merchant, filter by month/year, transaction type, and specific category.
   - Inline edit and deletion with modal confirmation.
   - Full keyboard accessibility, pagination/infinite scroll, and responsive card transformation on mobile screens.

4. **Anggaran (Budget Management)**:
   - Dedicated management view where users define monthly budget limits for consumption categories.
   - Visual progress gauges: Normal (Emerald $\le 75\%$), Warning (Amber $75\%-99\%$), Exceeded (Rose $\ge 100\%$).
   - Displays real-time realization, remaining allowance, and overflow amount.

5. **Laporan Bulanan (Monthly Statements)**:
   - Printable and clean executive summary for any selected month: Starting Balance, Total Inflow, Total Outflow, Investment Accumulation, Category Breakdown, Budget Performance, and full transaction record.
   - One-click PDF print styling and CSV data export.

6. **Pengaturan (Settings & Categories)**:
   - Manage custom expense categories and investment subcategories.
   - Configure global baseline starting balance and effective start date.
   - Reset data to sample defaults or clear all records with double confirmation.

### Visual Identity & Theme
- **Theme Name**: Slate & Emerald Modern Fintech
- **Aesthetic Direction**: Structured, minimal, utilitarian, clean hairline borders (`border-slate-200` / `dark:border-slate-800`), zero-pill discipline for metadata, single-elevation depth.
- **Color Palette**:
  - Neutral Canvas (60%): `#F8FAFC` (Slate-50) in light mode, `#0F172A` (Slate-900) in dark mode.
  - Structural Surfaces (30%): Pure white `#FFFFFF` / Dark Slate `#1E293B`, subtle hairlines `rgba(0,0,0,0.08)`.
  - Accent Budget (10%):
    - Primary Brand & Positive Flow: Emerald `#059669` / `#10B981`
    - Outcome & Critical Alert: Rose/Crimson `#E11D48` / `#F43F5E`
    - Investment Allocation: Indigo/Violet `#6366F1` / `#818CF8`
    - Budget Warnings: Amber `#D97706` / `#F59E0B`
- **Typography**:
  - Primary UI & Display: `Plus Jakarta Sans` for clean, professional modern weight.
  - Numerical Figures & Data: Monospace tabular numerals (`font-mono tabular-nums`) for currency values and percentages to guarantee vertical alignment.
- **Mobile & Desktop Layout**:
  - Desktop: Permanent 260px collapsible sidebar navigation, top bar with period picker, breadcrumb, and quick `+ Transaksi` CTA.
  - Mobile: Bottom bar or off-canvas drawer with thumb-friendly touch targets ($\ge 44\text{px}$) and sticky cap under 15%.

---

## 3. Key Product Decisions & Trade-Offs

### 1. Data Storage & Local Persistence
- **Chosen Approach**: Browser `localStorage` with reactive state synchronization and an automated schema migration engine.
- **Why**: Zero authentication friction, instantaneous zero-latency operations, complete privacy, works offline as a PWA-ready web app, and fulfills the single-user scope defined in PRD Section 3 & 17.
- **Alternatives Considered**: Firebase Cloud Firestore was evaluated; however, the PRD explicitly notes that multi-user accounts and login are out of scope for v1, and local persistence ensures zero sign-in friction and complete user data custody. An export/import JSON backup feature will be provided in Settings to safeguard user records.

### 2. Investment vs. Outcome Ledger Isolation
- **Chosen Approach**: Three distinct transaction types at the root data level: `'income' | 'outcome' | 'investment'`.
- **Why**: Many generic trackers treat investments as generic expenses, distorting actual living costs. Isolating `investment` preserves an accurate picture of monthly consumption while correctly decrementing liquid cash reserves.

### 3. Non-blocking Budget Alerts
- **Chosen Approach**: Soft visual warnings and informational badges when budget thresholds are breached; the transaction form never blocks or aborts saving.
- **Why**: Adheres strictly to Principle 4 of the PRD: "Transaksi nyata tetap dicatat." Financial apps must reflect reality first.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                          DompetKu Single-Page App                      │
├────────────────────────────────────────────────────────────────────────┤
│  Top Bar / Header Contract                                             │
│  [ DompetKu ]  [ Period Selector: Maret 2026 ▾ ]  [ + Catat Transaksi ]│
├───────────────────┬────────────────────────────────────────────────────┤
│  Sidebar Nav      │  Main Content Viewport (Active Tab)                │
│  • Dashboard      │  ┌──────────────────────────────────────────────┐  │
│  • Catat          │  │ 4 Overview Cards (Saldo, In, Out, Count)     │  │
│  • Riwayat        │  ├──────────────────────────────────────────────┤  │
│  • Analisis       │  │ Top Outcome Spotlight & Budget Summary       │  │
│  • Anggaran       │  ├──────────────────────────────────────────────┤  │
│  • Laporan        │  │ Charts: In/Out/Inv Breakdown & Monthly Trend │  │
│  • Pengaturan     │  ├──────────────────────────────────────────────┤  │
│                   │  │ Investment Allocation Drawer (RDPU, Darurat) │  │
│                   │  ├──────────────────────────────────────────────┤  │
│                   │  │ Recent Activity Table with Filter & Edit     │  │
│                   │  └──────────────────────────────────────────────┘  │
└───────────────────┴────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│             Central State Manager (React Context + Hooks)              │
│  - transactionsStore (CRUD, search, date filtering)                    │
│  - categoriesStore (default & custom categories with type validation)  │
│  - budgetsStore (category monthly caps & alert states)                 │
│  - balanceStore (baseline initial balance + rolling ledger logic)      │
└────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  Local Persistence & Export Engine                     │
│  - localStorage with versioned schema & initial Indonesian mock data   │
│  - JSON Backup Export / Import & CSV Transaction Export                │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Model Entities

```typescript
export type TransactionType = 'income' | 'outcome' | 'investment';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  iconName?: string;
  isDefault?: boolean;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  subCategory?: string; // e.g. 'Emergency Fund', 'RDPU' for investment
  date: string; // YYYY-MM-DD
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  period: string; // YYYY-MM
  amount: number;
}

export interface BalanceSettings {
  initialBalance: number;
  startDate: string; // YYYY-MM
}
```

### Key UI Components & Interactions

- `DashboardView`: Overview cards with click-through drilldown drawers; Top Outcome Spotlight card; interactive Chart components (SVG/Canvas based with accessible tabular alternative); Budget summary gauge; Recent transactions table.
- `TransactionFormModal`: Fast keyboard-navigable dialog with Rupiah auto-formatting (`formatIDR`), transaction type switcher, dynamic category select, and clear validation messages.
- `HistoryView`: Search bar, date range picker, category dropdown, multi-sort, batch operations, transaction details drawer, edit modal, delete confirmation.
- `AnalysisView`: Cashflow trends, expense breakdown by category, budget vs realization comparison, month-over-month percentage changes.
- `BudgetView`: Manage monthly category allowances, visually alerts on $\ge 80\%$ and $\ge 100\%$ thresholds.
- `MonthlyReportView`: Clean printable monthly financial statement with print stylesheet (`@media print`) and CSV download.
- `SettingsView`: Initial balance manager, custom category CRUD, sample data loader, and reset tools.

---

## Execution Steps

1. **Setup Theme & Typography**: Configure Tailwind tokens for emerald fintech aesthetic, dark mode support (`@custom-variant dark`), and `tabular-nums` formatting.
2. **Core State & Mock Data Engine**: Implement models, storage adapter, rolling balance calculator, and rich Indonesian preloaded sample dataset.
3. **App Shell & Navigation**: Construct responsive layout (Desktop sidebar + Mobile bottom bar/drawer, top bar contract with period switcher).
4. **Interactive Dashboard View**: Build 4 overview cards with deep-dive drawers, Top Outcome Spotlight, budget progress indicators, and interactive charts.
5. **Transaction Form & Validation**: Build custom input form with dynamic category mapping, Rupiah formatting, and post-save review/edit flow.
6. **Transaction History & Ledger**: Implement search, filters, sorting, detail view, edit/delete actions.
7. **Budget & Analysis Pages**: Build monthly budget planning table and analytical trend visualizer.
8. **Monthly Report & Print Export**: Create formatted financial statements with CSV and print export.
9. **Settings & Category Management**: Provide initial balance controls, category customization, and data reset tools.
10. **Build & Lint Verification**: Co-execute `compile_applet` and `lint_applet` to ensure pristine code quality.
