# Story: IBAN-Only Bank Account Details with IPID Verification

---

## Overview

This story covers two surfaces:
1. **Customer Journey** — Replace the current 4-field bank account form with a single IBAN field
2. **Banker Portal** — Display IPID verification results in Beneficiary Account Details and allow manual resolution when the match is not strong

---

## Story A: Customer Journey — IBAN-Only Bank Account Details

**As a** customer completing the Bank Account Details step,
**I want to** enter only my IBAN,
**So that** the process is simpler and my bank account can be verified automatically on submission.

### Current State
The Bank Account Details step (Step 7) currently shows 4 manual input fields:
- Bank Name
- Account Name
- IBAN
- SWIFT/BIC Code

### Changes Required

**Replace all 4 fields with a single IBAN input field.**

- Label: `IBAN`
- Placeholder: e.g. `AE070331234567890123456`
- The field accepts the IBAN as entered by the customer — no real-time API call at this stage
- Basic client-side format validation only (UAE IBAN: 23 characters, starts with `AE`)
- "Continue" button enabled once a valid-format IBAN is entered
- No auto-population of bank name, account name, or SWIFT at this stage

**On application submission**, the system calls the IPID API with the submitted IBAN. The IPID verification result is stored against the application and surfaced in the banker portal.

### Acceptance Criteria

- [ ] Bank Account Details step shows only one input field: IBAN
- [ ] Bank Name, Account Name, and SWIFT/BIC Code fields are removed
- [ ] Client-side validation enforces UAE IBAN format (23 characters, `AE` prefix)
- [ ] "Continue" button is disabled until IBAN passes format validation
- [ ] IBAN value is submitted as part of the application payload
- [ ] Review & Submit step (Step 8) displays the IBAN value only (no bank name / SWIFT)
- [ ] IPID API is called on application submission, not on the customer journey step itself

---

## Story B: Banker Portal — Beneficiary Account Details with IPID / IBAN Status

**As a** banker reviewing an application,
**I want to** see the customer's IBAN, their Account Name, and the IPID verification status,
**So that** I can assess whether the bank account details are trustworthy before approving disbursement.

### Beneficiary Account Details Section

Display the following fields in the banker portal application detail view:

| Field | Source |
|---|---|
| IBAN | Submitted by customer |
| Account Name | Borrower name from the application |
| IBAN Status | IPID verification result (see below) |

### IBAN Status Values

| Status | Display | Meaning |
|---|---|---|
| Strong Match | Green badge | IPID confirmed account name matches borrower name — no further action required |
| Any other status | Amber/red badge | IPID result was not a strong match — banker must take a resolution action |
| Manually Verified | Blue/neutral badge | Banker has uploaded a cancelled cheque — one-way, cannot be undone |

### Resolution Options (shown when IBAN Status ≠ Strong Match)

When the IBAN status is anything other than Strong Match, the banker sees two resolution options within the Beneficiary Account Details section:

**Option 1 — Upload Cancelled Cheque**
- Banker uploads a cancelled cheque document
- On successful upload, IBAN Status updates to **Manually Verified**
- This is a one-way transition — once set to Manually Verified it cannot be changed
- The uploaded document is stored against the application

**Option 2 — Select Account from BSA**
- Banker selects a bank account from accounts parsed through Bank Statement Analysis (BSA)
- The selected account replaces the IBAN details for disbursement purposes
- On selection, IBAN Status updates to **Manually Verified**
- This is also a one-way transition

> Only one of the two options needs to be actioned. Once either is completed, both options are hidden and the Manually Verified status badge is shown.

### Acceptance Criteria

- [ ] Beneficiary Account Details section displays IBAN, Account Name (borrower name), and IBAN Status
- [ ] IBAN Status shows the IPID result label returned from the API
- [ ] Strong Match status displays with a green badge; no resolution UI is shown
- [ ] Any non-Strong Match status displays with an amber/red badge
- [ ] When status is not Strong Match, two resolution options are presented: Upload Cancelled Cheque and Select Account from BSA
- [ ] Upload Cancelled Cheque: file upload is available, document stored against the application
- [ ] On successful cheque upload, IBAN Status updates to Manually Verified
- [ ] Select Account from BSA: banker can choose from BSA-parsed accounts
- [ ] On BSA account selection, IBAN Status updates to Manually Verified
- [ ] Manually Verified is a one-way transition — resolution options are hidden once set
- [ ] Manually Verified status displays with a neutral/blue badge
- [ ] Resolution UI is standalone within the Beneficiary Account Details section (not part of the document list)

---

## Dependencies

- IPID API must be called on application submission and result stored against the application record
- BSA parsing must produce a list of accounts accessible to the banker portal at the point of review
- Cancelled cheque document storage must be linked to the application

---

## Out of Scope

- Real-time IBAN verification during the customer journey (IPID is called on submission only)
- Auto-population of Bank Name or SWIFT in the customer journey
- Ability to reverse a Manually Verified status
