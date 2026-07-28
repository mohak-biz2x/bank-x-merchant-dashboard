# Release Notes — IBAN Integration

**Tickets:** MB-938, MB-638

---

| Feature | Description | Status |
|---------|-------------|--------|
| **IBAN Validation & Formatting** | Auto-uppercase and strip spaces/dashes on IBAN input. IBAN field in Customer Journey Step 7 (Bank Account Details). | ✅ Done |
| **Bank Name Field** | New required text input added to Step 7. Placeholder: "e.g. Emirates NBD". Persisted to localStorage and displayed in Review & Submit summary. | ✅ Done |
| **Account Type Field** | New required dropdown added to Step 7. Options: "Current Account", "Savings Account". Persisted to localStorage and displayed in Review & Submit summary. | ✅ Done |
| **Field Order & Layout** | Bank Name → Account Type → IBAN. 2-column grid layout (Row 1: Bank Name \| Account Type, Row 2: IBAN full width). | ✅ Done |
| **Step 7 Validation** | User cannot proceed to Step 8 without completing Bank Name, Account Type, and IBAN. Next button disabled until all fields populated. | ✅ Done |
| **Review & Submit Display** | Bank Name, Account Type, and IBAN shown in Bank Account Details summary card on Step 8. | ✅ Done |
| **localStorage Persistence** | Full bank account data (bankName, accountType, iban) saved to `bank_account_data` key on submission for downstream consumption by Banker Portal. | ✅ Done |
| **Banker Portal Readiness** | Beneficiary Account Details page reads from localStorage and displays Bank Name, Account Type, and IBAN. | 🔲 Pending (Banker Portal epic) |

---

## Summary

IBAN Integration enriches the Bank Account Details step in the Customer Journey with Bank Name and Account Type fields alongside the existing IBAN input. All fields are required, validated before progression, displayed in the review summary, and persisted for downstream use by the Banker Portal's beneficiary account details view.
