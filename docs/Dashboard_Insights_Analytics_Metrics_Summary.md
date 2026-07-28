# Mal Business — Dashboard Insights & Analytics
## Metrics Summary & Definitions

**Document Version:** 1.0  
**Date:** June 29, 2026  
**Prepared for:** Mal Bank  
**Prototype Link:** https://mohak-biz2x.github.io/bank-x-merchant-dashboard/dashboard-prototypes-index.html

---

## 1. Overview

The Dashboard Insights & Analytics module adds visual data representations to the Merchant Dashboard, providing merchants with at-a-glance visibility into their financing activity, portfolio health, and counterparty risk. The module adapts to the merchant's financing product (Payable or Receivable) and activity level.

### Prototype Variants

| Variant | Description | Use Case |
|---------|-------------|----------|
| Payable Financing (Full Data) | Active merchant using payable invoice financing | 6 suppliers, 82 invoices, 64% utilised |
| Receivable Financing (Full Data) | Active merchant using receivable invoice financing | 5 buyers, 50 invoices, 64% utilised |
| Low Activity | Merchant who just started (1-2 months of data) | 1 supplier, 5 invoices, 6% utilised |
| No Activity (Empty State) | Merchant with limit just enabled, zero transactions | 0 invoices, 0% utilised |

---

## 2. Metrics & Definitions

### 2.1 Credit Utilisation

| Attribute | Details |
|-----------|---------|
| **Chart Type** | Area/Line chart with reference line |
| **Definition** | Shows how much of the approved credit limit has been drawn down over time |
| **Formula** | Utilised Amount ÷ Approved Limit × 100 |
| **Reference Line** | Dashed red line at Approved Limit (e.g., AED 8,000,000) |
| **Time Periods** | 3 months, 6 months, 12 months |
| **Role Visibility** | Payable: amber payable line only. Receivable: green receivable line only |
| **Business Value** | Helps merchant plan financing capacity and avoid hitting limit |

---

### 2.2 Invoice Count Trend

| Attribute | Details |
|-----------|---------|
| **Chart Type** | Line chart with area fill |
| **Definition** | Count of invoices submitted per month over the selected time period |
| **Formula** | Count of invoices submitted in each calendar month |
| **Time Periods** | 3 months, 6 months, 12 months |
| **Role Visibility** | Both Payable and Receivable roles |
| **Business Value** | Identifies growth trends, seasonality, and submission patterns |

---

### 2.3 Payment Terms Distribution

| Attribute | Details |
|-----------|---------|
| **Chart Type** | Donut chart |
| **Definition** | Breakdown of all invoices by their payment tenor (days until due) |
| **Segments** | 30 days, 60 days, 90 days, 120 days |
| **Center Value** | Total number of invoices |
| **Role Visibility** | Both Payable and Receivable roles |
| **Business Value** | Shows the tenor mix of the portfolio — helps assess cash flow timing and financing cost exposure |

---

### 2.4 Supplier / Buyer Distribution

| Attribute | Details |
|-----------|---------|
| **Chart Type** | Donut chart |
| **Definition** | Distribution of total financed amount across counterparties (suppliers for Payable, buyers for Receivable) |
| **Segments** | Top counterparties by invoice amount; remaining grouped as "Others" if >5 |
| **Center Value** | Total financed amount in AED |
| **Role Visibility** | Payable: "Supplier Distribution". Receivable: "Buyer Distribution" |
| **Business Value** | Visualizes counterparty concentration — identifies over-reliance on single entities |

---

### 2.5 Approval Ratio

| Attribute | Details |
|-----------|---------|
| **Chart Type** | Score metric with progress bar |
| **Definition** | Percentage of invoices approved out of all decisioned (approved + rejected) invoices |
| **Formula** | Approved Invoices ÷ (Approved + Rejected) × 100 |
| **Excludes** | Pending and Refer invoices (not yet decisioned) |
| **Thresholds** | ≥90% = Healthy (green), 70-89% = Average (amber), <70% = Low (red) |
| **Supporting Metrics** | Decisioned count, Approved count, Rejected count |
| **Role Visibility** | Both Payable and Receivable roles |
| **Business Value** | Single health metric showing invoice quality — high ratio means fewer rejections and smoother financing |

**Note:** This is a cumulative all-time ratio, not month-over-month. This design choice accounts for merchants who submit invoices at irregular intervals.

---

### 2.6 Concentration Risk Score

| Attribute | Details |
|-----------|---------|
| **Chart Type** | Score metric with gradient bar |
| **Definition** | Measures how dependent the merchant's portfolio is on a small number of counterparties |
| **Score Range** | 0 (perfectly diversified) to 100 (single counterparty) |
| **Thresholds** | 0-40 = Low (green), 41-65 = Moderate (amber), 66-100 = High (red) |
| **Supporting Metrics** | Top 1 counterparty %, Top 3 counterparties %, HHI Index |
| **Role Visibility** | Payable: supplier concentration. Receivable: buyer concentration |
| **Business Value** | Alerts merchant to portfolio concentration risk — over-reliance on one counterparty increases default exposure |

**HHI (Herfindahl-Hirschman Index):** Sum of squared market shares of each counterparty. Range: 0 to 10,000. Values above 2,500 indicate high concentration.

---

## 3. Role-Based Visibility Matrix

| Metric | Payable Role | Receivable Role | Both Role |
|--------|:---:|:---:|:---:|
| Credit Utilisation | ✓ (payable only) | ✓ (receivable only) | ✓ (both series) |
| Invoice Count Trend | ✓ | ✓ | ✓ |
| Payment Terms Distribution | ✓ | ✓ | ✓ |
| Supplier Distribution | ✓ | — | ✓ |
| Buyer Distribution | — | ✓ | — |
| Approval Ratio | ✓ | ✓ | ✓ |
| Concentration Risk | ✓ (supplier) | ✓ (buyer) | ✓ (supplier) |

**Excluded roles:** `supplier-only`, `premium-buyer`, `premium-buyer-supplier` do not see the analytics section.

---

## 4. Empty & Low-Activity States

| State | Behavior |
|-------|----------|
| **No Activity** | Charts are replaced with an empty state card: "No activity yet — Your insights will appear here once you start submitting invoices" |
| **Low Activity** (< 3 months data) | Charts render with available data points; 6M and 12M time selectors are disabled; info banner shown: "Your analytics will become more detailed as your financing activity grows" |

---

## 5. Interactive Features

| Feature | Behavior |
|---------|----------|
| **Time Period Selector** | Segmented buttons (3M / 6M / 12M) that re-render charts with the selected data range |
| **Tooltips** | Hover/tap on any data point shows detailed values (month, amount, percentage) |
| **Responsive Layout** | 2-column grid on desktop, single column on mobile (<1024px) |
| **Card Hover Effect** | Subtle indigo border glow on hover |

---

## 6. Data Source Notes (Prototype)

All data in the prototype is **mock/hardcoded** for demonstration purposes. In production:
- Credit utilisation data would come from the Loan Management System (LMS)
- Invoice counts and statuses from the Invoice Processing Engine
- Supplier/Buyer data from the KYB/Onboarding module
- Pricing/cost data from the Pricing Rule Engine

---

*End of Document*
