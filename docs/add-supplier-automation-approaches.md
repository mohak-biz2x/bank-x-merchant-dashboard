# Add Supplier — Automation Approaches

## Overview

This document outlines the extent of automation possible for the Add Supplier form using different data sources, and how combining them achieves maximum coverage with minimal manual input.

---

## Current Form Fields

| # | Field | Section | Required |
|---|-------|---------|----------|
| 1 | Trade License Number | Gating Field | Yes |
| 2 | Company Name | Basic Details | Yes |
| 3 | TRN Number | Basic Details | Yes |
| 4 | Country of Incorporation | Basic Details | Yes |
| 5 | Contact Person Name | Contact Details | Yes |
| 6 | Email Address | Contact Details | Yes |
| 7 | Phone Number | Contact Details | Yes |
| 8 | Bank Name | Bank Details | Yes |
| 9 | Account Name | Bank Details | Yes |
| 10 | IBAN | Bank Details | Yes |
| 11 | SWIFT/BIC Code | Bank Details | Yes |

---

## Approach 1: Trade License Document Upload (OCR)

**Trigger:** User uploads a scanned/PDF Trade License document.

| # | Field | Auto-Filled? | Notes |
|---|-------|:---:|-------|
| 1 | Trade License Number | ✅ | Extracted from the document |
| 2 | Company Name | ✅ | Legal entity name on the license |
| 3 | TRN Number | ❌ | Not present on Trade License |
| 4 | Country of Incorporation | ✅ | Inferred from issuing authority (e.g., DED = UAE) |
| 5 | Contact Person Name | ⚠️ | Owner/partner name available, not necessarily contact person |
| 6 | Email Address | ❌ | Not on the document |
| 7 | Phone Number | ❌ | Not on the document |
| 8 | Bank Name | ❌ | Not on the document |
| 9 | Account Name | ❌ | Not on the document |
| 10 | IBAN | ❌ | Not on the document |
| 11 | SWIFT/BIC Code | ❌ | Not on the document |

**Coverage: 3–4 / 11 fields (~30%)**

**Pros:** Simple, user likely has this document readily available.  
**Cons:** Very limited coverage; bank details and TRN still fully manual.

---

## Approach 2: Supplier Invoice Upload (OCR)

**Trigger:** User uploads any existing invoice received from the supplier.

| # | Field | Auto-Filled? | Notes |
|---|-------|:---:|-------|
| 1 | Trade License Number | ⚠️ | Sometimes present in invoice header/footer |
| 2 | Company Name | ✅ | Always present (supplier/seller name) |
| 3 | TRN Number | ✅ | Mandatory on UAE tax invoices (VAT law) |
| 4 | Country of Incorporation | ✅ | Inferred from supplier address |
| 5 | Contact Person Name | ⚠️ | Sometimes present as signatory or contact line |
| 6 | Email Address | ✅ | Commonly in invoice header/footer |
| 7 | Phone Number | ✅ | Commonly in invoice header/footer |
| 8 | Bank Name | ✅ | Almost always in payment details section |
| 9 | Account Name | ✅ | Usually listed with bank details |
| 10 | IBAN | ✅ | Standard on UAE invoices |
| 11 | SWIFT/BIC Code | ✅ | Typically alongside IBAN |

**Coverage: 9–11 / 11 fields (~85–100%)**

**Pros:** Highest single-source coverage; bank details reliably present; TRN guaranteed.  
**Cons:** User must have an invoice on hand; OCR accuracy varies with invoice formats.

---

## Approach 3: Oscilar KYB Lookup (API)

**Trigger:** User enters Trade License Number → system calls Oscilar KYB API.

| # | Field | Auto-Filled? | Notes |
|---|-------|:---:|-------|
| 1 | Trade License Number | ✅ | Input by user (lookup key) |
| 2 | Company Name | ✅ | From commercial registry |
| 3 | TRN Number | ✅ | From FTA registry linkage (if integrated) |
| 4 | Country of Incorporation | ✅ | From registry data |
| 5 | Contact Person Name | ✅ | Select from owners/authorized signatories list |
| 6 | Email Address | ❌ | Not in registry data |
| 7 | Phone Number | ❌ | Not reliably available |
| 8 | Bank Name | ❌ | Not available via KYB |
| 9 | Account Name | ❌ | Not available via KYB |
| 10 | IBAN | ❌ | Not available via KYB |
| 11 | SWIFT/BIC Code | ❌ | Not available via KYB |

**Coverage: 5 / 11 fields (~45%)**

**Additional value beyond form fields:**
- Lite KYB pass/fail result (sanctions, PEP, adverse media)
- Ownership structure and UBO identification
- License status (active/expired/cancelled)
- Licensed business activities
- Credit score/rating (if credit bureau linked)

**Pros:** Instant API response; provides KYB verification as a byproduct; returns authorized signatories list for contact person selection.  
**Cons:** Cannot provide bank details or direct contact info (email/phone).

---

## Approach 4: Oscilar KYB + Invoice Upload (Recommended Combination)

**Trigger:** User enters Trade License Number (KYB fires automatically) + uploads an invoice for bank details.

| # | Field | Auto-Filled? | Source |
|---|-------|:---:|--------|
| 1 | Trade License Number | ✅ | User input (KYB lookup key) |
| 2 | Company Name | ✅ | Oscilar KYB (registry) |
| 3 | TRN Number | ✅ | Oscilar KYB (FTA) or Invoice |
| 4 | Country of Incorporation | ✅ | Oscilar KYB (registry) |
| 5 | Contact Person Name | ✅ | Selected from Oscilar signatories list OR manual |
| 6 | Email Address | ✅ | Invoice OCR OR manual entry |
| 7 | Phone Number | ✅ | Invoice OCR OR manual entry |
| 8 | Bank Name | ✅ | Invoice OCR |
| 9 | Account Name | ✅ | Invoice OCR |
| 10 | IBAN | ✅ | Invoice OCR |
| 11 | SWIFT/BIC Code | ✅ | Invoice OCR |

**Coverage: 11 / 11 fields (100%)**

**User flow:**
1. User enters Trade License Number
2. Oscilar KYB fires → auto-fills Company Name, TRN, Country + returns Lite KYB result
3. System presents authorized signatories/owners list → user selects contact person OR fills manually
4. User uploads a supplier invoice → auto-fills Bank Details, Email, Phone
5. User reviews all fields, corrects if needed, submits

**Pros:** Full automation; built-in KYB verification; contact person selected from verified registry data.  
**Cons:** Requires both API integration and OCR capability; user needs an invoice.

---

## Approach 5: Oscilar KYB + Manual Entry (No Document Upload)

**Trigger:** User enters Trade License Number (KYB fires) + manually fills remaining fields.

| # | Field | Auto-Filled? | Source |
|---|-------|:---:|--------|
| 1 | Trade License Number | ✅ | User input |
| 2 | Company Name | ✅ | Oscilar KYB |
| 3 | TRN Number | ✅ | Oscilar KYB |
| 4 | Country of Incorporation | ✅ | Oscilar KYB |
| 5 | Contact Person Name | ✅ | Selected from Oscilar signatories list OR manual |
| 6 | Email Address | ❌ | Manual entry |
| 7 | Phone Number | ❌ | Manual entry |
| 8 | Bank Name | ❌ | Manual entry |
| 9 | Account Name | ❌ | Manual entry |
| 10 | IBAN | ❌ | Manual entry |
| 11 | SWIFT/BIC Code | ❌ | Manual entry |

**Coverage: 5 / 11 auto-filled (~45%) + 6 manual**

**Pros:** No document upload needed; fast for users who know supplier bank details.  
**Cons:** Bank details and contact info require manual entry.

---

## Comparison Summary

| Approach | Auto-Filled Fields | Coverage | KYB Included | Documents Needed |
|----------|:-:|:-:|:-:|---|
| Trade License Upload | 3–4 | ~30% | No | Trade License |
| Invoice Upload | 9–11 | ~85–100% | No | Supplier Invoice |
| Oscilar KYB Only | 5 | ~45% | Yes | None |
| **Oscilar KYB + Invoice** | **11** | **100%** | **Yes** | Supplier Invoice |
| Oscilar KYB + Manual | 5 | ~45% | Yes | None |

---

## Contact Person Handling

For all approaches involving Oscilar KYB, the **Contact Person** field can be populated in two ways:

1. **Select from list** — Oscilar returns authorized signatories and owners from the commercial registry. The user picks the relevant person from a dropdown.
2. **Manual entry** — If the desired contact is not in the registry list (e.g., a procurement manager), the user can type the name manually.

This provides flexibility while leveraging verified registry data when available.

---

## Recommendation

**Approach 4 (Oscilar KYB + Invoice Upload)** is the recommended path because:

- Achieves 100% field coverage with minimal manual input
- KYB verification happens as a natural byproduct (no separate step)
- Bank details are reliably extracted from invoices
- Contact person selection from verified signatories adds trust
- The buyer already has supplier invoices (it's the basis of the financing relationship)

For cases where the user doesn't have an invoice handy, **Approach 5 (Oscilar KYB + Manual)** serves as a fallback with the remaining fields entered by hand.
