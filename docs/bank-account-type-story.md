# Story: Add Bank Name & Account Type to Bank Account Details

---

## Overview

Add **Bank Name** (text input) and **Account Type** (Current Account / Savings Account dropdown) fields to the Bank Account Details step (Step 7) in the Customer Journey. The captured data should also flow through to the Banker Portal's beneficiary account details page.

---

## User Story

**As a** merchant completing the financing application,  
**I want to** provide my bank name and account type alongside the IBAN,  
**So that** the bank has complete beneficiary account information for disbursements and repayments.

---

## Scope

### Customer Journey (Step 7 — Bank Account Details)

**File**: `src/app/components/CustomerJourneyPage.tsx`

**Current field:**
- IBAN (text input)

**New fields to add:**
- **Bank Name** (text input) — Free-text entry for the name of the bank
- **Account Type** (dropdown/select) — Options: `Current Account`, `Savings Account`

**Changes required:**

1. **State update** — Add `bankName` and `accountType` to the `bankAccountData` state:
   ```ts
   const [bankAccountData, setBankAccountData] = useState({
     bankName: "",      // NEW
     accountType: "",   // NEW — "current" | "savings"
     iban: "",
   });
   ```

2. **Form fields** — Add inputs in the `renderBankAccountDetails()` function:
   - **Bank Name**: Text input, label "Bank Name *", placeholder "e.g. Emirates NBD"
   - **Account Type**: Select dropdown, label "Account Type *", options: "Select Account Type" (placeholder), "Current Account", "Savings Account"
   - **Field order**: Bank Name → Account Type → IBAN (existing)

3. **Validation** — Update the step 7 validation check to require all three fields:
   ```ts
   if (currentStep === 7 && (!bankAccountData.bankName || !bankAccountData.accountType || !bankAccountData.iban)) return;
   ```

4. **Review & Submit summary** — Display Bank Name and Account Type in the Bank Account Details summary card (Step 8):
   ```
   Bank Name: Emirates NBD
   Account Type: Current Account
   IBAN: AE070331234567890123456
   ```

5. **localStorage persistence** — Save `bankAccountData` (including new fields) to localStorage on submission so it flows to the banker portal:
   ```ts
   localStorage.setItem("bank_account_data", JSON.stringify(bankAccountData));
   ```

---

### Banker Portal — Beneficiary Account Details

**Context**: The banker portal is referenced as a separate epic/dependency (see `docs/post-submission-epics.md`). When it is built, the beneficiary account details page must display the new fields.

**For now (UI prototype):**
- Store bank account data in localStorage on customer journey submission
- Any future banker portal component should read from `localStorage.getItem("bank_account_data")` and display all fields including Bank Name and Account Type

**Expected display on banker portal:**

| Field | Value |
|-------|-------|
| Bank Name | [from customer journey] |
| Account Type | Current Account / Savings Account |
| IBAN | [from customer journey] |

---

## Acceptance Criteria

- [ ] Bank Name text input added to Step 7 (Bank Account Details) in Customer Journey
- [ ] Account Type dropdown added to Step 7 with options: "Current Account" and "Savings Account"
- [ ] Both new fields are required — user cannot proceed to Step 8 without filling them
- [ ] Field order: Bank Name → Account Type → IBAN
- [ ] Bank Name and Account Type displayed in the Review & Submit summary (Step 8)
- [ ] Bank account data (including Bank Name and Account Type) persisted to localStorage on submission
- [ ] Fields use consistent styling with existing form inputs
- [ ] Placeholder text for Account Type: "Select Account Type"
- [ ] Placeholder text for Bank Name: "e.g. Emirates NBD"

---

## Related Files

| File | Change |
|------|--------|
| `src/app/components/CustomerJourneyPage.tsx` | Add `bankName` and `accountType` to state, form, validation, and review summary |
| Future: Banker Portal component | Read and display `bankName` and `accountType` from stored bank account data |

---

## Design Notes

- Bank Name: Standard text input matching existing input styling (`w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`)
- Account Type: Native `<select>` element with same border/padding styling
- Layout (2-column grid):
  - Row 1: Bank Name | Account Type
  - Row 2: IBAN (full width or left column)

---

## Out of Scope

- Building the banker portal (separate epic)
- Backend API integration (prototype is localStorage only)
- Adding these fields to the Supplier Journey (`SupplierJourneyPage.tsx`) or Add Supplier form (`BuyerSuppliersModule.tsx`) — can be separate stories if needed
- SWIFT/BIC Code, Account Name, or other banking fields beyond Bank Name, Account Type, and IBAN
