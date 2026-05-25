# Invoice Lifecycle Changes — Summary of Required Updates

**Date:** May 22, 2026  
**Epic:** MB-218 — Invoice Module — Add Invoice, Lifecycle & Auto-Approve (Receivable & Payable)  
**Related Stories:** MB-42, MB-43, MB-44, MB-45, MB-52, MB-53, MB-54

---

## Overview of Changes

Three major changes to the invoice lifecycle:

1. **Murabaha Agreement signing moved to application level** — No DocuSign signing at invoice group level. The `Contract E-Sign Pending` status is removed entirely.
2. **Pricing rule engine added** — Real-time fee calculation based on Payment Type, Tenure, and Borrower Category. Applies to both Receivable and Payable.
3. **Tenure added to Receivable flow** — Previously only Payable had tenor. Now both flows require tenure selection.

---

## 1. Changes to Invoice Group Status Lifecycle

### Current Flow (in MB-218 / MB-45):
```
Verification In Progress → Contract E-Sign Pending → Executing Contract → Sent to LMS → Disbursed
```

### Updated Flow:
```
Verification In Progress → Executing Contract → Sent to LMS → Disbursed
```

### Status Changes

| Status | Current Behavior | Updated Behavior |
|--------|-----------------|------------------|
| `Contract E-Sign Pending` | Contract generated, sent for merchant e-sign via DocuSign | **REMOVED** — No e-sign at invoice group level |
| `Executing Contract` | Triggered after DocuSign completion callback | Triggered **automatically** when all invoices are approved (no e-sign step) |
| `Sent to LMS` | After commodity exchange execution completes | No change |
| `Disbursed` | After LMS processes | No change — only set by LMS callback |

### Updated Invoice Group Statuses (for MB-42, MB-45)

| Status | Color | Description |
|--------|-------|-------------|
| Verification In Progress | Blue | OCR + rule engine running |
| Manual Verification Required | Amber | 1+ invoices flagged/rejected — awaiting banker review |
| Executing Contract | Amber | Murabaha contract being executed on commodity exchange (automatic) |
| Sent to LMS | Green | Contract executed, details sent to LMS |
| Disbursed | Emerald | Funds released (confirmed by LMS) |
| Rejected | Red | All invoices rejected by banker — terminal |

### Removed Status
- ~~`Contract E-Sign Pending`~~ — No longer needed. Murabaha Agreement is signed once at application level.

### Updated Auto-Approve Flow (MB-45)

**Current:**
1. All invoices pass → Contract auto-generated → DocuSign e-sign sent to merchant
2. Merchant signs → `Executing Contract`
3. Commodity exchange → `Sent to LMS`
4. LMS processes → `Disbursed`

**Updated:**
1. All invoices pass → `Executing Contract` (automatic, no merchant action)
2. Commodity exchange + send to LMS → `Sent to LMS`
3. LMS confirms disbursement → `Disbursed`

---

## 2. Changes to Existing Stories

### MB-42: Invoice Group List & Status Display

**Changes:**
- Remove `Contract E-Sign Pending` from status list and color coding
- Remove `Total Disbursement Amount` column from the group list table
- Update status badge colors: `Executing Contract` should be Amber (not Blue as currently documented)
- Add `Tenure` column to the group list (for both Receivable and Payable)

### MB-43: Add Invoice — Upload, Parse & Review

**Changes:**
- **Receivable:** Add Tenure field (currently documented as "N/A" for Receivable)
  - Tenure options for Installments: 30, 60, 90, 120, 150, 180 days
  - Tenure options for Bullet: 60, 90, 120, 150, 180 days
- **Payable:** Update Tenor options from `30/60/90/120` to match payment type:
  - Installments: 30, 60, 90, 120, 150, 180 days
  - Bullet: 60, 90, 120, 150, 180 days
- Add real-time pricing preview below form fields (see new story below)

**Updated Deviations Table:**

| Aspect | Receivable Financing | Payable Financing |
|--------|---------------------|-------------------|
| Counterparty | Buyer Name (free text) | Supplier (from supplier list) |
| Tenure | **Required** — options based on payment type | **Required** — options based on payment type |
| Repayment Structure | Required (Bullet / Installments) | Required (Bullet / Installments) |

### MB-44: Add Invoice — Submission & Rule Engine Validation

**Changes:**
- Update post-validation group status:
  - **Current:** ALL approved → `Contract E-Sign Pending`
  - **Updated:** ALL approved → `Executing Contract` (automatic, no e-sign step)
- Add pricing data to submission payload (Fee %, Fee Amount, VAT, Total Fee, ROI, Multiple)

### MB-45: Invoice Lifecycle — Status Transitions & Auto-Approve Flow

**Changes:**
- Remove `Contract E-Sign Pending` from the lifecycle entirely
- Remove DocuSign e-sign step from auto-approve flow
- Update auto-approve flow:
  1. All invoices pass → `Executing Contract` (automatic)
  2. Commodity exchange → `Sent to LMS`
  3. LMS callback → `Disbursed`
- Update manual verification flow:
  - After banker marks verification complete with at least 1 approved → `Executing Contract` (not `Contract E-Sign Pending`)
- Remove DocuSign completion callback as trigger for `Executing Contract`
- Update dashboard metric triggers:
  - Remove `Contract E-Sign Pending` metric event
  - `Executing Contract` now triggered directly after verification passes

### MB-52: Invoice Detail View — Individual Invoices Within a Group

**Changes:**
- Add Pricing section to group header (Processing Fee breakdown: Fee, VAT, Total)
- Add Tenure to group header for Receivable (currently only Payable shows it)
- Add Payment Type to group header
- Remove `Total Disbursement Amount` from header

### MB-53: Email Notifications — Invoice Status Changes

**Changes:**
- Remove `Contract E-Sign Pending` email trigger
- Remove DocuSign reference from email templates
- Update `Executing Contract` email:
  - **Current:** "Your Murabaha financing contract has been signed successfully. The contract is now being executed..."
  - **Updated:** "All invoices in your request have been verified and approved. The Murabaha contract is now being executed on the commodity exchange."
- Add pricing details to email templates (Fee %, Total Fee)

### MB-54: Murabaha Contract Execution on Commodity Exchange

**Changes:**
- Update trigger:
  - **Current:** "Merchant completes e-sign (DocuSign callback received)"
  - **Updated:** "All invoices approved by rule engine (or banker marks verification complete with at least 1 approved)"
- Remove DocuSign dependency from this story
- Execution is now fully automatic — no merchant action at invoice group level
- Add pricing data (ROI, Multiple) to the data sent to LMS during execution

---

## 3. Changes to Application-Level Agreement Signing

### Affected Stories (from post-submission-epics.md):

**Epic 2, Story 2.2: Sign Agreements — Embedded DocuSign (STP Path)**
- Add **Murabaha Agreement** as the 2nd agreement (between Financing and Direct Debit)
- Total agreements: Financing Agreement → Murabaha Agreement → Direct Debit Agreement
- All 3 must be signed before redirect

**Epic 3, Story 3.1: Security Onboarding Modal — Step 1: Sign Digital Agreements**
- Add **Murabaha Agreement** as the 2nd agreement (between Financing and Direct Debit)
- "Continue" enabled only after all 3 signed

---

## 4. New Stories Required

### New Story: Invoice Group Pricing — Real-Time Fee Calculation

**As a** customer creating an invoice financing request,  
**I want** the pricing (flat fee, VAT, total fee) to be calculated and displayed in real-time as I select payment type and tenure,  
**So that** I can see the cost of financing before submitting my request.

#### Pricing Rule Engine

**Inputs:** Payment Type × Tenure × Borrower Category  
**Output:** Flat Fee %, Fee Amount, VAT (5%), Total Fee  
**Internal (sent to LMS, not shown on UI):** Multiple (360/Tenure), ROI (Fee% × Multiple)

**Borrower Categories:**

| Category | Annual Revenue |
|----------|---------------|
| A (Anchor) | Above AED 250m |
| B (Standard) | AED 50m – 250m |
| C (Spot) | Below AED 50m |

**Pricing Matrix — Category A:**

| Tenure | Installments | Bullet |
|--------|-------------|--------|
| 30d | 0.80% | — |
| 60d | 1.60% | 1.00% |
| 90d | 2.40% | 1.50% |
| 120d | 3.20% | 2.00% |
| 150d | 4.00% | 2.50% |
| 180d | 4.80% | 3.00% |

**Pricing Matrix — Category B:**

| Tenure | Installments | Bullet |
|--------|-------------|--------|
| 30d | 1.50% | — |
| 60d | 3.00% | 2.00% |
| 90d | 4.50% | 3.00% |
| 120d | 6.00% | 4.00% |
| 150d | 7.50% | 5.00% |
| 180d | 9.00% | 6.00% |

**Pricing Matrix — Category C:**

| Tenure | Installments | Bullet |
|--------|-------------|--------|
| 30d | 2.00% | — |
| 60d | 4.00% | 3.00% |
| 90d | 6.00% | 4.50% |
| 120d | 8.00% | 6.00% |
| 150d | 10.00% | 7.50% |
| 180d | 12.00% | 9.00% |

#### Acceptance Criteria
- [ ] Pricing calculated in real-time when payment type + tenure selected and invoice amounts entered
- [ ] Fee % determined by rule engine based on Payment Type × Tenure × Borrower Category
- [ ] Fee Amount = Total Invoice Amount × Fee %
- [ ] VAT = Fee Amount × 5%
- [ ] Total Fee = Fee Amount + VAT
- [ ] Multiple = 360 / Tenure (internal, not shown on UI)
- [ ] ROI = Fee % × Multiple (internal, sent to LMS)
- [ ] Pricing displayed on Add Invoice form as real-time preview
- [ ] Pricing displayed on Invoice Group Detail view after submission
- [ ] Borrower Category not shown on UI
- [ ] ROI not shown on UI
- [ ] Applies to both Receivable and Payable flows
- [ ] Islamic financing product — flat fee only (no interest terminology)

---

### New Story: Invoice Group Detail — Improved Information Card

**As a** customer viewing an invoice group,  
**I want** the group details and pricing displayed in a clear, scannable card layout,  
**So that** I can quickly understand the key information about my financing request.

#### Card Layout (3 zones):
1. **Header:** Group ID + Status badge
2. **Body (two-column):**
   - Left: Supplier/Buyer (with TLN below), Financed Amount (large bold), Repayment Period, Payment Type
   - Right (gray bg): Processing Fee chips — Fee (with %), VAT, Total (green highlight)
3. **Footer (conditional):** Green status message for Sent to LMS / Disbursed states

#### Acceptance Criteria
- [ ] Group ID and status badge as clear header
- [ ] Supplier/Buyer name with TLN in smaller text below (not as separate field)
- [ ] Financed Amount displayed larger and bolder
- [ ] Repayment Period and Payment Type as separate fields
- [ ] Processing Fee breakdown in 3 equal-height chips (Fee with %, VAT, Total)
- [ ] Total Fee chip highlighted in green
- [ ] Status message integrated as card footer
- [ ] Applies to both Receivable and Payable flows

---

## 5. Summary of All Changes by Story

| Story | Change Type | Summary |
|-------|-------------|---------|
| **MB-218** (Epic) | Modified | Remove `Contract E-Sign Pending` from lifecycle diagram. Add pricing scope. Add tenure to Receivable. |
| **MB-42** | Modified | Remove `Contract E-Sign Pending` status. Remove `Total Disbursement` column. Add Tenure column. Update `Executing Contract` color to Amber. |
| **MB-43** | Modified | Add Tenure to Receivable. Update tenure options (30–180d based on payment type). Add pricing preview. |
| **MB-44** | Modified | Change post-validation status from `Contract E-Sign Pending` to `Executing Contract`. Add pricing to submission payload. |
| **MB-45** | Modified | Remove `Contract E-Sign Pending` from lifecycle. Remove DocuSign e-sign step. Auto-approve goes directly to `Executing Contract`. |
| **MB-52** | Modified | Add Pricing section. Add Tenure + Payment Type to header. Improved card UI. |
| **MB-53** | Modified | Remove `Contract E-Sign Pending` email. Update `Executing Contract` email copy. Add pricing to templates. |
| **MB-54** | Modified | Remove DocuSign trigger. Execution triggered automatically after all invoices approved. Add ROI/pricing data to LMS payload. |
| **Epic 2, Story 2.2** | Modified | Add Murabaha Agreement (3 agreements total). |
| **Epic 3, Story 3.1** | Modified | Add Murabaha Agreement (3 agreements total). |
| **New** | New Story | Invoice Group Pricing — Real-Time Fee Calculation |
| **New** | New Story | Invoice Group Detail — Improved Information Card |
