# Insights Module — Delta from Standard to Mal Prototype

## Overview

This document captures all changes made from the standard Insights/Analytics module (as seen in the reference screenshots) to produce the Mal Bank prototype (`docs/insights.html`). Use this as the basis for user stories to enable the module for Mal with the required delta.

---

## 1. Global / Structural Changes

| Area | Standard Module | Mal Prototype | Rationale |
|------|----------------|---------------|-----------|
| Theme | Light/white background | Dark theme (matches Mal dashboard) | Brand consistency |
| Currency | INR (₹) | AED | UAE market |
| Products | 4 products (Purchase Invoice Discounting, Domestic Factoring, Short Term Business Loan, Export Factoring) | 2 products (Payable Invoice Financing, Receivable Invoice Financing) | Mal's product scope |
| Navigation | Standalone page | 4th tab "Insights" in main dashboard nav | Integrated into existing Mal dashboard |
| Locale identifiers | PAN, GSTIN, CIN, State | Trade License Number, Emirate | UAE regulatory context |
| Company names | Indian companies (Myntra, Flipkart, Meesho, Amazon) | UAE companies (Al Habtoor, Emirates Steel, Dubai Steel Fabricators, etc.) | Regional realism |
| Payment mode | NEFT | Wire Transfer | UAE banking standard |

---

## 2. Entity Header Section

| Field | Standard | Mal Prototype | Change Type |
|-------|----------|---------------|-------------|
| User ID | Present | Kept | No change |
| PAN | Present | **Removed** | Replaced by Trade License |
| GSTIN | Present | **Removed** | Replaced by Trade License |
| Trade License Number | Not present | **Added** | UAE identifier |
| CIN | Present | **Removed** | Not applicable in UAE |
| Industry | Present | Kept | No change |
| Entity Type | Present | Kept | No change |
| Incorporated | Present | Kept | No change |
| State | Present | **Renamed → Emirate** | UAE context |
| Years in Industry | Present | Kept | No change |
| Registered Address | Present | Kept (UAE address format) | No change |
| Relationship Tenure | Present | Kept | No change |
| Sync button | Not visible | **Added** (spinning icon, updates timestamp) | UX enhancement |
| Alert: Unsecured Exposure | Present | **Removed** | Not applicable |
| Alert: Overdue Repayments | Present | Kept (AED values) | Value adaptation |

---

## 3. KPI Metrics Row

| Metric | Standard | Mal Prototype | Change Type |
|--------|----------|---------------|-------------|
| Entity Sanctioned | Present | **Renamed → Total Limit** | Terminology |
| Outstanding | Present | Kept | No change |
| Headroom | Present | **Renamed → Available Limit** | Terminology |
| On-Time Repayment | Present | Kept | No change |
| Group Exposure | Present | **Removed** | Not applicable |
| KYC Status | Present | Kept | No change |
| Growth vs Stable | Present | Kept | No change |
| Counterparties | Present | Kept | No change |
| Decision Status | Present | **Removed** | Not applicable |

**Net result**: 7 KPI cards (from original 9)

---

## 4. All Products · At a Glance

| Aspect | Standard | Mal Prototype | Change Type |
|--------|----------|---------------|-------------|
| Number of product cards | 4 | 2 | Scope reduction |
| Product names | PID, Domestic Factoring, STBL, Export Factoring | Payable Invoice Financing, Receivable Invoice Financing | Product naming |
| Card content | Combined Sanctioned, Combined Utilized, Available, Utilization, Counterparties, Status pills | Same structure | No change |
| "Details →" link | Present (navigates externally) | **Enhanced** — switches to Products tab and scrolls to applications | UX improvement |

---

## 5. Product Exposure Mix

| Aspect | Standard | Mal Prototype | Change Type |
|--------|----------|---------------|-------------|
| Chart type | Donut chart with center text | Donut chart **without** center text | Simplified |
| Width | Full width | **50% width** | Layout decision |
| Legends | Separate card to the right | **Inline** within same card, right of chart | Compact layout |
| Products shown | 4 slices | 2 slices | Scope |

---

## 6. Tabs Menu

| Aspect | Standard | Mal Prototype | Change Type |
|--------|----------|---------------|-------------|
| Total tabs | 9 | 6 | Reduced |
| Removed tabs | — | Financials & Bureau, Compliance, Group & Contingent | Not applicable for Mal |
| Renamed tabs | Products & CAM → **Products**, Compliance & GST → (removed), Conduct & Collateral → **Conduct** | Simplified naming |
| Scroll behavior | Horizontal scroll | **No scroll** (flex-wrap) | UX improvement |

**Final tabs**: Decision Overview, Products, Repayments & Disbursements, Counterparties, Conduct, Transactions

---

## 7. Tab 1: Decision Overview

### 7.1 Entity Profile
- PAN/GSTIN → Trade License Number
- State → Emirate
- CIN → Removed
- Address format → UAE format with PO Box

### 7.2 Decision Cockpit (Six-Lens Framework)
| Aspect | Standard | Mal Prototype | Change Type |
|--------|----------|---------------|-------------|
| Six lenses | Need, Capacity, Control, Conduct, Concentration, Compliance | Same 6 lenses | No change |
| Values | INR amounts, 408 overdue, 77 counterparties | AED amounts, 3 overdue, 14 counterparties | Data adaptation |
| Decision questions | 6 questions with INR values | Same 6 questions with AED values | Value adaptation |

### 7.3 Red Flags
| Item | Standard | Mal Prototype | Change Type |
|------|----------|---------------|-------------|
| Overdue repayments | Present (CRITICAL) | Kept (AED values) | Value adaptation |
| Unsecured exposure | Present (REVIEW) | **Removed** | Not applicable |

### 7.4 Removed Sections (from Decision Overview)
| Section | Description | Reason for Removal |
|---------|-------------|-------------------|
| Exposure Hierarchy | Entity → Product → Application → Counterparty tree view with utilized vs sanctioned breakdown | Not required for Mal's simpler 2-product structure |
| Limit Increase Simulator | Interactive % increase calculator showing proposed limit, post-increase utilization, entity/group headroom, collateral cover, and threshold table (Single-name cap, Sector cap) | Not applicable — Mal does not support self-service limit increase simulation |
| New Facility vs Limit Increase | Dual-column assessment matrix comparing readiness indicators (Credit assessment, Utilisation evidence, Repayment conduct, Counterparty ecosystem, Collateral & security, Compliance & KYC) for new facility vs limit increase scenarios | Not applicable — decision framework not exposed to Mal merchant users |

### 7.5 Relationship Metrics
| Metric | Standard | Mal Prototype | Change Type |
|--------|----------|---------------|-------------|
| Program Utilization | Present | Kept | No change |
| Collection Rate | Present | Kept | No change |
| Avg Processing Time | Present | Kept | No change |
| Avg Tenor | Present | Kept | No change |
| Factored This Month | Present | **Renamed → Financed This Month** | Product naming |
| Top-5 Concentration | Present | Kept | No change |
| Overdue Instalments | Present | Kept | No change |
| Foreclosure Amount | Present | **Removed** | Not applicable |
| Invoices Processed | Present | Kept | No change |
| Eligible Invoices Financed | Present | Kept | No change |

**Net result**: 9 metrics (from original 10)

---

## 8. Tab 2: Products

| Aspect | Standard | Mal Prototype | Change Type |
|--------|----------|---------------|-------------|
| Product sub-tabs | 4 pills (PID-18, DF-67, STBL-12, Export-2) | 2 pills (Payable-3, Receivable-2) | Scope |
| Combined KPIs | Sanctioned, Utilized, Available, Applications | Sanctioned, Utilized, Available (3 cards) | Removed Applications count card |
| Applications table columns | Auto ID, Status, Applied, Sanctioned, Utilized, Util%, Deviations, Links | Application ID, Status, Applied, Sanctioned, Utilized, Util%, Links | Removed Deviations column |
| Expanded app — CAM Limit | Present | **Removed** | Not applicable |
| Expanded app — CAM vs Current | Present (full detail table) | **Removed** | Not applicable |
| Expanded app — Loan Terms & Pricing | Present (Interest Rate, APR, Tenure, etc.) | **Removed** | Not applicable |
| Expanded app — Deviations from CAM | Present | Kept (simplified) | No change |
| Expanded app — Charges & Dues | Total Charged, Total Outstanding, Principal O/s, Interest O/s, Charge Count | Total Charged, Total Outstanding, Charge Count | **Removed** Principal O/s, Interest O/s |
| Expanded app — Linked Counterparties | Name, Role, GSTIN, Exposure, Invoice Vol, Invoices, Overdue, Verify | Name, Role, Trade License, Exposure, Invoice Vol, Invoices, Overdue | **Removed** Verify, replaced GSTIN with Trade License |
| Expanded app — Invoice Pipeline | Invoice, Buyer, Buyer GSTIN, Goods, Seller Address, Amount, Invoice Date, Due Date, Status | Invoice, Supplier/Buyer, Amount, Invoice Date, Due Date, Status | Simplified columns |
| Expanded app — Repayment Schedule | #, Due Date, Amount, Principal, Interest, Opening, Balance, Paid On, Status, Days Late | #, Due Date, Amount, Opening, Balance, Paid On, Status, Days Late | **Removed** Principal, Interest columns |
| Expanded app — Disbursement Schedule | Reference, Scheduled, Value Date, Disbursed, Planned, Pending, Remaining, Counterparty, Mode (NEFT), Status | Same structure with Mode = Wire Transfer | Mode adaptation |

---

## 9. Tab 3: Repayments & Disbursements

| Aspect | Standard | Mal Prototype | Change Type |
|--------|----------|---------------|-------------|
| Client-level KPIs | On-time, Missed Dates, Max Delay, Overdue Amount | Same 4 KPIs | No change (AED values) |
| Overdue Aging (DPD) | Present | Kept | No change |
| Foreclosure Quote | Present (Principal, Interest, Penalty, Total Payable) | **Removed** | Not applicable |
| Product-level sections | Single product shown | **Two sections**: Payable Invoice Financing · Repayment, Receivable Invoice Financing · Repayment | Product split |
| Expandable applications | Present | Kept (3 for Payable, 2 for Receivable) | No change |
| Missed EMIs | Present as separate section | Kept | No change |
| Tenure Remaining | Present as separate section | Kept | No change |

---

## 10. Tab 4: Counterparties

| Aspect | Standard | Mal Prototype | Change Type |
|--------|----------|---------------|-------------|
| Top KPI cards | Invited, Applied, Approved, Active (4 cards) | **Total, Active** (2 cards, 50% width) | Simplified |
| Trade Integrity Alerts | Present | Kept (UAE company names) | No change |
| Top Counterparties | Counterparty, Exposure, % of Total, Verification | Counterparty, Exposure, % of Total | **Removed** Verification column |
| Concentration Heatmap | Present | Kept | No change |
| Top-5 Loan Concentration | "Top-5 Loan Concentration" | **Renamed → "Top-5 Financing Concentration"** | Product naming |
| Product counterparties table | Single table "Domestic Factoring Counterparties" with GSTIN, Verify columns | **Split into two**: Payable Invoice Financing Counterparties (Suppliers), Receivable Invoice Financing Counterparties (Buyers) | Product split + removed Verify, replaced GSTIN with Trade License |

---

## 11. Tab 5: Conduct

| Aspect | Standard | Mal Prototype | Change Type |
|--------|----------|---------------|-------------|
| Metrics shown | Timely Repayment, Avg DPD, Overdue Events, Ad-hoc Arrangements, Rollovers, Restructurings, Covenant Waivers (7 cards) | Same minus Covenant Waivers (6 cards) | **Removed** Covenant Waivers |
| Values | 5.6% timely, 408 overdue events | 91.2% timely, 3 overdue events | Data adapted to Mal context |

---

## 12. Tab 6: Transactions

| Aspect | Standard | Mal Prototype | Change Type |
|--------|----------|---------------|-------------|
| Table columns | Date, Type, Product, Amount, Ref | Same | No change |
| Product names in rows | Short Term Business Loan, Domestic Factoring | Payable Invoice Financing, Receivable Invoice Financing | Product naming |
| Transaction types | repayment, drawdown | Same | No change |

---

## Summary of Removals

The following features/sections from the standard module are **not needed** for Mal:

1. PAN / GSTIN identifiers
2. Group Exposure KPI
3. Decision Status KPI
4. Unsecured Exposure alert/red flag
5. Foreclosure Quote section
6. Foreclosure Amount metric
7. Covenant Waivers metric
8. CAM Limit KPI (in application detail)
9. CAM vs Current section
10. Loan Terms & Pricing section
11. Principal O/s and Interest O/s in Charges & Dues
12. Verification column in counterparties
13. Financials & Bureau tab
14. Compliance tab
15. Group & Contingent tab
16. GSTIN column in counterparty tables
17. Principal/Interest columns in Repayment Schedule
18. Exposure Hierarchy section (Entity → Product → Application → Counterparty tree view)
19. Limit Increase Simulator (% increase calculator with proposed limits, headroom, thresholds)
20. New Facility vs Limit Increase assessment matrix (Credit assessment, Utilisation evidence, Repayment conduct, Counterparty ecosystem, Collateral & security, Compliance & KYC)

---

## Summary of Additions/Enhancements

1. Trade License Number (UAE identifier)
2. Emirate field (replaces State)
3. Sync button with spinning animation and timestamp update
4. "Details →" link navigates to Products tab with scroll-to behavior
5. Product sub-tab pills for switching between Payable/Receivable
6. Split counterparty tables by product (Suppliers vs Buyers)
7. Dark theme throughout
8. Wire Transfer as disbursement mode
9. No-scroll tab menu (flex-wrap)

---

## Summary of Renames

| Standard Term | Mal Term |
|---------------|----------|
| Entity Sanctioned | Total Limit |
| Headroom | Available Limit |
| Factored This Month | Financed This Month |
| Top-5 Loan Concentration | Top-5 Financing Concentration |
| Products & CAM | Products |
| Compliance & GST | (removed) |
| Conduct & Collateral | Conduct |
| State | Emirate |
| NEFT | Wire Transfer |
| PAN/GSTIN | Trade License Number |

---

## Prototype Reference

- **File**: `docs/insights.html`
- **Branch**: `feature/dashboard-insights-prototypes`
- **View online**: https://htmlpreview.github.io/?https://github.com/mohak-biz2x/bank-x-merchant-dashboard/blob/feature/dashboard-insights-prototypes/docs/insights.html
