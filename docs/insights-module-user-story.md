# User Story: Insights Module for Mal Customer Portal

**Epic:** Merchant Dashboard — Analytics & Insights  
**Priority:** High  
**Estimated Effort:** Large  

---

## User Story

**As a** Mal Bank merchant (customer portal user),  
**I want** an Insights tab in my dashboard that provides a consolidated view of my financing portfolio, repayment health, counterparty exposure, and conduct metrics,  
**So that** I can monitor my overall financial relationship with Mal Bank, identify risks early, and make informed decisions about my Payable and Receivable Invoice Financing products.

---

## Context

The standard Insights/Analytics module exists in the platform but requires adaptation for Mal Bank's customer portal. This story covers enabling the module with Mal-specific configuration (2 products, UAE locale, dark theme, simplified sections).

**Prototype Reference:** `docs/insights.html` on branch `feature/dashboard-insights-prototypes`

---

## Acceptance Criteria

### AC-1: Navigation & Access
- [ ] "Insights" tab appears as the 4th item in the main dashboard navigation
- [ ] Insights tab uses a chart-line icon consistent with analytics
- [ ] Clicking "Insights" renders the Insights page within the existing dashboard shell (not a separate page)
- [ ] Dark theme matches existing Mal dashboard styling

### AC-2: Entity Header
- [ ] Displays merchant's legal name, User ID, Trade License Number, and Industry
- [ ] Shows "Last Synced" timestamp with a Sync button
- [ ] Sync button shows a spinning refresh icon for 2 seconds, then updates the timestamp to current time
- [ ] Critical alert banner shows overdue repayment information when applicable

### AC-3: KPI Metrics Row (7 cards)
- [ ] **Total Limit** — Combined sanctioned amount across all products
- [ ] **Outstanding** — Current total utilized amount with % indicator
- [ ] **Available Limit** — Remaining available credit with % indicator
- [ ] **On-Time Repayment** — Percentage with missed count and max days late
- [ ] **KYC Status** — Current verification status (Clear/Pending/Expired)
- [ ] **Growth vs Stable** — Financial health trend assessment
- [ ] **Counterparties** — Total count split by suppliers/buyers

### AC-4: All Products · At a Glance
- [ ] Shows 2 product cards: Payable Invoice Financing, Receivable Invoice Financing
- [ ] Each card displays: Combined Sanctioned, Combined Utilized, Available, Utilization %, Counterparties count, application status pills
- [ ] "Details →" link navigates to the Products tab and scrolls to the applications table for that product

### AC-5: Product Exposure Mix
- [ ] Donut chart showing outstanding split between Payable and Receivable Invoice Financing
- [ ] Legends displayed inline to the right of the chart
- [ ] Chart width is 50% of the content area

### AC-6: Tab Menu
- [ ] 6 tabs: Decision Overview, Products, Repayments & Disbursements, Counterparties, Conduct, Transactions
- [ ] Tabs do not overflow/scroll — wrap to next line if needed
- [ ] Active tab is visually distinguished
- [ ] Clicking a tab switches content area without page reload

---

## Tab-Specific Acceptance Criteria

### AC-7: Decision Overview Tab

#### Entity Profile
- [ ] Grid displaying: Legal Name, Entity Type, Incorporated, Trade License Number, Industry, Years in Industry, Emirate, Registered Address, Relationship Tenure

#### Decision Cockpit (Six-Lens Framework)
- [ ] Overall readiness badge (ALERT/REVIEW/CLEAR)
- [ ] 6 lens cards: Need, Capacity, Control, Conduct, Concentration, Compliance
- [ ] Each card shows: title, status badge, description, bullet-point details
- [ ] Color-coded borders: green (CLEAR), amber (REVIEW), red (ALERT)
- [ ] 6 decision questions below with status badges and explanatory answers

#### Red Flags
- [ ] Only shows "Overdue repayments" alert when applicable
- [ ] Does NOT show "Unsecured exposure"

#### Relationship Metrics (9 cards)
- [ ] Program Utilization (with progress bar)
- [ ] Collection Rate (with ALERT badge when below threshold)
- [ ] Avg Processing Time
- [ ] Avg Tenor
- [ ] Financed This Month (amount + invoice count)
- [ ] Top-5 Concentration (with ALERT badge when above threshold)
- [ ] Overdue Instalments (with ALERT badge)
- [ ] Invoices Processed (total value)
- [ ] Eligible Invoices Financed (% with count)

### AC-8: Products Tab
- [ ] Product sub-tab pills to switch between Payable Invoice Financing and Receivable Invoice Financing
- [ ] Combined KPIs per product: Sanctioned, Utilized, Available
- [ ] Applications table with columns: Application ID, Status, Applied, Sanctioned, Utilized, Util%, Links
- [ ] Clicking "View" or a row expands to show application detail:
  - KPI cards (Sanctioned, Utilized, Available)
  - Deviations from CAM
  - Charges & Dues (Total Charged, Total Outstanding, Charge Count)
  - Linked Counterparties table (Name, Role, Trade License, Exposure, Invoice Vol, Invoices, Overdue)
  - Invoice Pipeline table (Invoice, Supplier/Buyer, Amount, Invoice Date, Due Date, Status)
  - Repayment & Disbursement Schedule (KPI summary + schedule table with #, Due Date, Amount, Opening, Balance, Paid On, Status, Days Late)
  - Disbursement Schedule (Reference, Scheduled, Value Date, Disbursed, Planned, Remaining, Counterparty, Mode, Status)

### AC-9: Repayments & Disbursements Tab
- [ ] Client-level KPIs: On-time Repayment, Missed Dates, Max Delay, Overdue Amount
- [ ] Overdue Aging (DPD) table bucketed by days past due (0-30, 31-60, 61-90, 90+, Total)
- [ ] Product-level repayment sections for both products with expandable application rows
- [ ] Expanded application shows KPIs + full repayment schedule
- [ ] Missed EMIs table (separate section)
- [ ] Tenure Remaining table with progress bars (separate section)

### AC-10: Counterparties Tab
- [ ] 2 KPI cards (50% width): Total Counterparties, Active
- [ ] Trade Integrity Alerts section with circular-trade check and overdue counterparty list
- [ ] Top Counterparties table (Counterparty, Exposure, % of Total) — no Verification column
- [ ] Concentration Heatmap table (Counterparty, Exposure, Invoice Vol, Risk)
- [ ] Top-5 Financing Concentration table (Application ID, Outstanding, % of Outstanding)
- [ ] Payable Invoice Financing Counterparties table (Name, Role, Trade License, Application, Exposure, Invoice Vol, Overdue)
- [ ] Receivable Invoice Financing Counterparties table (same columns, Role = Buyer)

### AC-11: Conduct Tab
- [ ] 6 KPI cards in 4+2 layout:
  - Row 1: Timely Repayment (with REVIEW badge), Avg DPD, Overdue Events, Ad-hoc Arrangements
  - Row 2: Rollovers (with CLEAR badge), Restructurings (with CLEAR badge)

### AC-12: Transactions Tab
- [ ] "Recent Transactions" table with columns: Date, Type, Product, Amount, Ref
- [ ] Shows mix of "repayment" and "drawdown" transaction types
- [ ] Product column shows "Payable Invoice Financing" or "Receivable Invoice Financing"

---

## Delta from Standard Module (Not Required for Mal)

The following standard module features are explicitly **out of scope**:

| # | Feature | Reason |
|---|---------|--------|
| 1 | PAN / GSTIN identifiers | Replaced by Trade License Number (UAE) |
| 2 | Group Exposure KPI | Not applicable for Mal's merchant structure |
| 3 | Decision Status KPI | Not exposed to merchant users |
| 4 | Unsecured Exposure alert/red flag | Not applicable |
| 5 | Foreclosure Quote section | Not applicable |
| 6 | Foreclosure Amount metric | Not applicable |
| 7 | Covenant Waivers metric | Not applicable |
| 8 | CAM Limit KPI (application detail) | Not exposed to merchants |
| 9 | CAM vs Current section | Not exposed to merchants |
| 10 | Loan Terms & Pricing section | Not applicable for invoice financing |
| 11 | Principal O/s and Interest O/s in Charges & Dues | Simplified for merchants |
| 12 | Verification column in counterparties | Not merchant-facing |
| 13 | Financials & Bureau tab | Not applicable |
| 14 | Compliance tab | Not applicable |
| 15 | Group & Contingent tab | Not applicable |
| 16 | GSTIN column in counterparty tables | Replaced by Trade License |
| 17 | Principal/Interest columns in Repayment Schedule | Simplified |
| 18 | Exposure Hierarchy (Entity→Product→Application→Counterparty tree) | Not required for 2-product structure |
| 19 | Limit Increase Simulator | Not applicable — no self-service limit increase |
| 20 | New Facility vs Limit Increase assessment matrix | Not exposed to merchant users |

---

## Renames from Standard

| Standard Term | Mal Term |
|---------------|----------|
| Entity Sanctioned | Total Limit |
| Headroom | Available Limit |
| Factored This Month | Financed This Month |
| Top-5 Loan Concentration | Top-5 Financing Concentration |
| Products & CAM | Products |
| Conduct & Collateral | Conduct |
| State | Emirate |
| NEFT | Wire Transfer |
| PAN/GSTIN | Trade License Number |

---

## Enhancements over Standard

| # | Enhancement | Description |
|---|-------------|-------------|
| 1 | Sync button | Spinning animation + timestamp update on click |
| 2 | Details → navigation | Switches to Products tab and scrolls to applications table |
| 3 | Product sub-tab pills | Toggle between Payable/Receivable within Products tab |
| 4 | Split counterparty tables | Separate tables per product (Suppliers vs Buyers) |
| 5 | Dark theme | Consistent with Mal Bank brand |
| 6 | No-scroll tab menu | Flex-wrap instead of horizontal overflow |
| 7 | Inline chart legends | Legends beside donut chart within same card |

---

## Data Sources

| Section | Data Source |
|---------|-------------|
| Entity Profile | Customer onboarding data / KYC system |
| KPI Metrics | LMS (Loan Management System) aggregations |
| Product cards | Application + facility data from LMS |
| Exposure chart | Outstanding balances per product from LMS |
| Decision Cockpit | Risk engine + LMS + KYC system |
| Red Flags | LMS overdue triggers |
| Relationship Metrics | LMS portfolio analytics |
| Repayment schedules | LMS repayment module |
| Counterparties | Counterparty registry + invoice module |
| Transactions | LMS transaction log |
| Invoice Pipeline | Invoice module (same data as Payable/Receivable invoice screens) |

---

## Dependencies

- LMS APIs must expose aggregated portfolio data per merchant
- Counterparty registry must be queryable by merchant
- Invoice module data must be accessible for Invoice Pipeline section
- Risk engine outputs needed for Decision Cockpit six-lens assessment

---

## Out of Scope

- Real-time data streaming (page loads snapshot data, Sync button refreshes)
- Export to PDF/Excel functionality
- Custom date range filters
- Configurable KPI thresholds by merchant
- Mobile responsive layout (desktop-first for initial release)

---

## Definition of Done

- [ ] All 6 tabs render correctly with data from APIs
- [ ] Tab switching works without page reload
- [ ] Sync button triggers data refresh with visual feedback
- [ ] "Details →" link navigates correctly to Products tab
- [ ] Application rows are expandable/collapsible
- [ ] Product sub-tab pills switch product views
- [ ] All values display in AED with proper formatting
- [ ] Dark theme consistent with existing dashboard
- [ ] No horizontal scroll on tab menu
- [ ] Page performs acceptably with production data volumes
