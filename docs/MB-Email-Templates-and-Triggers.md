# MAL Bank (MB) — Customer-Facing Email Templates & Triggers

This document lists all email templates sent to customers (merchants/suppliers) along with their respective triggers, as defined across the MB Jira board.

---

## 1. Application Submitted Confirmation

| Field | Details |
|-------|---------|
| **Jira Story** | MB-31, MB-258 |
| **Trigger** | Customer submits application (before automations start) |
| **Recipient** | Customer (merchant) |
| **Subject** | `Mal - Your Financing Application Has Been Submitted` |
| **Key Content** | Application ID, Product, Company Name, Submission Date, next steps, portal login URL |

---

## 2. Application Status Update — In Review

| Field | Details |
|-------|---------|
| **Jira Story** | MB-55, MB-258 |
| **Trigger** | Decision is reject/refer — application assigned to banker pool |
| **Recipient** | Customer |
| **Subject** | `Mal - Application [Application ID] Status Update: In Review` |
| **Key Content** | Application details, previous/new status, "Your application is now being reviewed by our team" |

---

## 3. Application Status Update — Approved / Drawdown

| Field | Details |
|-------|---------|
| **Jira Story** | MB-55, MB-258 |
| **Trigger** | STP approved (auto) or banker manually approves and moves to Drawdown |
| **Recipient** | Customer |
| **Subject** | `Mal - Application [Application ID] Approved — Limit Activated` |
| **Key Content** | Approved Limit, Limit Expiry, portal login URL to sign agreements |

---

## 4. Application Status Update — Generic Status Change

| Field | Details |
|-------|---------|
| **Jira Story** | MB-55 |
| **Trigger** | Any customer-facing application status change (In Review, Approved, Pending Agreements Signing, Pending Security Cheque, Drawdown, Declined, Offer Declined, Withdrawn) |
| **Recipient** | Customer |
| **Subject** | `Mal - Application [Application ID] Status Update: [New Status]` |
| **Key Content** | Previous/New status, conditional body per new status, portal URL, support email |

---

## 5. Agreements Ready for Signing (Customer Notification)

| Field | Details |
|-------|---------|
| **Jira Story** | MB-736 (STP), MB-261 (Non-STP) |
| **Trigger** | Agreements successfully generated and ready for e-signing (both STP and Non-STP flows) |
| **Recipient** | Primary Borrower (Customer) |
| **Subject** | `Action Required: Your Financing Agreements Are Ready to Sign — [application_id]` |
| **Key Content** | Instructions to log in, agreement signing wizard auto-opens, how to re-open wizard if closed |

---

## 6. Agreement Generation Failure (Banker Notification)

| Field | Details |
|-------|---------|
| **Jira Story** | MB-736 |
| **Trigger** | Agreement auto-generation fails after 2 retry attempts (STP flow) |
| **Recipient** | Assigned LoanOps banker |
| **Subject** | `Action Required: Agreement Generation Failed — [application_id]` |
| **Key Content** | Application ID, customer name, product type, failure reason, last attempt timestamp, request to manually retry |

---

## 7. Daily Reminder — Pending Agreement Signatures

| Field | Details |
|-------|---------|
| **Jira Story** | MB-738 |
| **Trigger** | Agreements pending e-sign for more than 24 hours (sent daily until all signed) |
| **Recipient** | Assigned LoanOps banker |
| **Subject** | `Reminder: Agreements Pending Customer Signature — [application_id]` |
| **Key Content** | Application ID, customer name, product type, agreements sent date, hours elapsed, list of pending/signed agreements |

---

## 8. Security Cheque Submission Required

| Field | Details |
|-------|---------|
| **Jira Story** | MB-37 |
| **Trigger** | Application status transitions to "Pending Agreements Signing" (both STP and Non-STP) |
| **Recipient** | Customer (primary borrower) |
| **Subject** | `Mal - Security Cheque Submission Required — [application_id]` |
| **Key Content** | Cheque Amount (Approved Limit × 1.10), Mal Bank address, two submission options (post/courier or collection), 10-day deadline |

---

## 9. Additional Documents Requested

| Field | Details |
|-------|---------|
| **Jira Story** | MB-36 |
| **Trigger** | Banker requests additional documents from the Banker Portal |
| **Recipient** | Customer |
| **Subject** | `Mal - Additional Documents Required for Application [Application ID]` |
| **Key Content** | List of requested document names, secure upload link (valid 48 hours) |

---

## 10. Invoice Request Status Update — Executing Contract

| Field | Details |
|-------|---------|
| **Jira Story** | MB-53 |
| **Trigger** | All invoices in a request approved — Murabaha contract executing on commodity exchange |
| **Recipient** | Customer (merchant) |
| **Subject** | `Mal - Invoice Request [Request ID] Status Update: Executing Contract` |
| **Key Content** | Request details (counterparty, amount, count, tenure, fees), approved invoice count and amount |

---

## 11. Invoice Request Status Update — Sent to LMS

| Field | Details |
|-------|---------|
| **Jira Story** | MB-53 |
| **Trigger** | Murabaha contract executed, sent to Loan Management System |
| **Recipient** | Customer |
| **Subject** | `Mal - Invoice Request [Request ID] Status Update: Sent to LMS` |
| **Key Content** | Contract executed successfully, disbursement processing notification |

---

## 12. Invoice Request Status Update — Disbursed

| Field | Details |
|-------|---------|
| **Jira Story** | MB-53 |
| **Trigger** | Funds disbursed for invoice request |
| **Recipient** | Customer |
| **Subject** | `Mal - Invoice Request [Request ID] Status Update: Disbursed` |
| **Key Content** | Disbursement Amount, Disbursement Date, bank account credited |

---

## 13. Invoice Request Status Update — All Invoices Rejected

| Field | Details |
|-------|---------|
| **Jira Story** | MB-53 |
| **Trigger** | All invoices in a request rejected after banker verification |
| **Recipient** | Customer |
| **Subject** | `Mal - Invoice Request [Request ID] Status Update: All Rejected` |
| **Key Content** | Rejection notice, instructions to resubmit with valid invoices |

---

## 14. Supplier Onboarding Link (New Supplier)

| Field | Details |
|-------|---------|
| **Jira Story** | MB-49, MB-48 |
| **Trigger** | Buyer adds a new supplier (TL number not found in system) — also used for Resend |
| **Recipient** | Supplier (email entered in Add Supplier form) |
| **Subject** | `Mal - Complete Your Supplier Onboarding` |
| **Key Content** | Secure onboarding hash URL, expiry hours, onboarding steps overview, buyer company name |

---

## 15. New Buyer Notification (Existing Supplier)

| Field | Details |
|-------|---------|
| **Jira Story** | MB-49 |
| **Trigger** | Existing supplier (onboarding already completed) added by a new buyer |
| **Recipient** | Supplier |
| **Subject** | `Mal - New Buyer [Buyer Company Name] Has Added You` |
| **Key Content** | Buyer company details, account auto-activated, no action required |

---

## 16. Supplier Active Notification to Buyer

| Field | Details |
|-------|---------|
| **Jira Story** | MB-50 |
| **Trigger** | Supplier completes self-onboarding journey (status → Active) |
| **Recipient** | All buyers who have added this supplier |
| **Subject** | `Mal - Supplier [Supplier Name] is Now Active` |
| **Key Content** | Supplier name, contact, email, TL number; instructions to create invoice requests |

---

## 17. New Buyer Relationship Request (Active Supplier, Same Contact)

| Field | Details |
|-------|---------|
| **Jira Story** | MB-65 |
| **Trigger** | Buyer adds an already-active supplier (same contact person) |
| **Recipient** | Supplier |
| **Subject** | `Mal - New Buyer Relationship Request` |
| **Key Content** | Buyer company name, portal URL to confirm relationship, option to decline |

---

## 18. Borrower Added as Supplier

| Field | Details |
|-------|---------|
| **Jira Story** | MB-67 |
| **Trigger** | Buyer adds an existing borrower (same contact) as supplier |
| **Recipient** | Borrower/Supplier contact person |
| **Subject** | `Mal - You've Been Added as a Supplier` |
| **Key Content** | Supplier dashboard info, portal URL, instructions to switch between portals |

---

## 19. Help Widget / Contact Form Support Request

| Field | Details |
|-------|---------|
| **Jira Story** | MB-708 |
| **Trigger** | Customer submits contact form from help widget |
| **Recipient** | Support team (internal) |
| **Subject** | `[<Category Prefix>] Support Request — <App ID>` |
| **Key Content** | Application ID, user details (name, email, mobile, company), current page context, issue category, user message |

---

## 20. Owner/Guarantor Credit Bureau Consent Request

| Field | Details |
|-------|---------|
| **Jira Story** | MB-474 (bug reference) |
| **Trigger** | Banker adds/edits owner in banker journey — consent request sent to owner/guarantor |
| **Recipient** | Owner/Guarantor |
| **Subject** | `Consent Request to Pull Credit Bureau Report for Loan Application [App ID]` |
| **Key Content** | Consent link (hash URL), owner details, Emirates ID, expiry |

---

## Summary Table

| # | Email Template | Trigger | Recipient |
|---|---------------|---------|-----------|
| 1 | Application Submitted | Customer submits application | Customer |
| 2 | Status: In Review | Decision = reject/refer | Customer |
| 3 | Status: Approved/Drawdown | STP auto-approve or banker approves | Customer |
| 4 | Generic Status Update | Any customer-facing status change | Customer |
| 5 | Agreements Ready for Signing | Agreements generated (STP & Non-STP) | Customer |
| 6 | Agreement Generation Failure | Auto-generation fails 2x (STP) | Banker |
| 7 | Pending Signatures Reminder | Unsigned > 24hrs (daily) | Banker |
| 8 | Security Cheque Required | Status → Pending Agreements Signing | Customer |
| 9 | Additional Documents Requested | Banker requests docs | Customer |
| 10 | Invoice: Executing Contract | All invoices approved | Customer |
| 11 | Invoice: Sent to LMS | Contract executed | Customer |
| 12 | Invoice: Disbursed | Funds released | Customer |
| 13 | Invoice: All Rejected | All invoices rejected | Customer |
| 14 | Supplier Onboarding Link | Buyer adds new supplier / resend | Supplier |
| 15 | New Buyer Added (Existing Supplier) | Existing supplier added by new buyer | Supplier |
| 16 | Supplier Now Active | Supplier completes onboarding | Buyer(s) |
| 17 | New Buyer Relationship Request | Active supplier added by new buyer (same contact) | Supplier |
| 18 | Borrower Added as Supplier | Borrower entity added as supplier | Borrower |
| 19 | Help Widget Support Request | Customer submits help form | Support Team |
| 20 | Credit Bureau Consent Request | Owner added/edited by banker | Owner/Guarantor |
