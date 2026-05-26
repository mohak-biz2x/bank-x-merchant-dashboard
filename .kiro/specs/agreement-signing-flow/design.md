# Design Document: Agreement Signing Flow

## Overview

This feature replaces the existing 2-step security onboarding modal in `ApplicationsModule.tsx` with a new 4-step `AgreementSigningModal` component. The modal handles DocuSign-based agreement signing (Steps 1 & 2), UAE Pass DDS signing simulation (Step 3), and bank account selection with security cheque upload (Step 4). All data is managed via React state and localStorage — no backend integration. The STP flow (`StpFlowPage.tsx`) remains completely untouched.

## Architecture

The new modal is extracted into its own component file for separation of concerns. It integrates with the existing `DocuSignModal` for Steps 1 & 2, and implements inline widgets for Steps 3 & 4.

### Component Architecture

```
ApplicationsModule.tsx
├── AgreementSigningModal.tsx (NEW - extracted modal component)
│   ├── Step 1: Financing Agreement → DocuSignModal.tsx (reused)
│   ├── Step 2: Murabaha Agreement → DocuSignModal.tsx (reused)
│   ├── Step 3: DDS Agreement → UAEPassWidget (inline)
│   └── Step 4: Bank Account + Security Cheque Upload
├── DocuSignModal.tsx (UNCHANGED)
└── PremiumBuyerLayout.tsx (MODIFIED - Demo Panel addition)

StpFlowPage.tsx (UNCHANGED)
```

## Components and Interfaces

### AgreementSigningModal

**File:** `src/app/components/AgreementSigningModal.tsx`

A self-contained modal component that manages the 4-step agreement signing flow. Extracted from `ApplicationsModule.tsx` for cleanliness.

```typescript
interface AgreementSigningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  approvedLimit: number;       // e.g., 5000000
  entityName: string;          // e.g., "Al Masraf Industries LLC"
  applicationId: string;       // e.g., "APP-2025-001"
}

interface StepState {
  currentStep: number;         // 1-4
  completedSteps: Set<number>; // tracks which steps are done
}

interface BankAccount {
  id: string;
  label: string;              // e.g., "ADCB - AE12 3456 7890 1234"
}
```

**State Management:**
- `currentStep: number` — which step is active (1–4)
- `completedSteps: Set<number>` — which steps have been completed
- `showDocuSign: { title: string; step: number } | null` — controls DocuSign modal overlay
- `selectedAccount: string | null` — selected bank account ID
- `uploadedFile: File | null` — uploaded security cheque file
- `isSubmitting: boolean` — submission loading state

**Persistence:** Completed steps are stored in localStorage key `agreement_signing_progress` as a JSON array (e.g., `[1, 2]`). On modal open, progress is restored from localStorage. On submission (Step 4 complete), progress is cleared.

### Step Indicator Component

Inline within `AgreementSigningModal`. Renders a horizontal 4-step progress bar.

```typescript
// Steps are dynamically determined based on product type
function getSteps() {
  const productType = localStorage.getItem("selected_product") || "receivable";
  const secondAgreement = productType === "payable" ? "Murabaha Agreement" : "Master Purchase Agreement";
  return [
    { id: 1, label: "On-sale Agreement" },
    { id: 2, label: secondAgreement },
    { id: 3, label: "DDS Agreement" },
    { id: 4, label: "Bank Account & Security Cheque" },
  ];
}
```

Visual states:
- **Completed:** Green circle with checkmark, green text
- **Active:** Blue circle with step number, bold text
- **Upcoming:** Gray circle with step number, muted text
- Connecting lines between steps: green if prior step complete, gray otherwise

### UAE Pass Widget (Step 3)

Inline within `AgreementSigningModal`, rendered when `currentStep === 3`.

```typescript
// Mock URL generation
const uaePassUrl = `https://uaepass.ae/sign/dds-${applicationId}-${Date.now()}`;
```

**UI Elements:**
- Generated URL displayed in a readonly input field
- "Copy URL" button (uses `navigator.clipboard.writeText`)
- "Open in new tab" icon button (uses `window.open`)
- Instruction text: "Open the URL above and e-sign using UAE Pass"
- UAE Pass logo placeholder (styled div with "UAE PASS" text)
- "Simulate Completion" button (primary action)

### Bank Account & Security Cheque (Step 4)

Inline within `AgreementSigningModal`, rendered when `currentStep === 4`.

**Mock Bank Accounts:**
```typescript
const MOCK_ACCOUNTS: BankAccount[] = [
  { id: "adcb-1", label: "ADCB - AE12 3456 7890 1234" },
  { id: "enbd-1", label: "Emirates NBD - AE98 7654 3210 9876" },
];
```

**Cheque Amount Calculation:**
```typescript
const chequeAmount = approvedLimit * 1.1;
// Display: formatCurrency(chequeAmount) → "AED 5,500,000"
```

**File Upload:**
- Accepts: `.pdf, .jpg, .jpeg, .png`
- Shows file name after upload with remove button
- Validates file type on selection

**Submit Button Disabled When:**
- `selectedAccount === null` OR `uploadedFile === null`

### Modified: ApplicationsModule.tsx

**Changes:**
1. Remove the existing inline security onboarding modal code (the `showSecurityModal` state and associated JSX)
2. Replace with `<AgreementSigningModal>` component usage
3. Keep the STP detection logic (`isStp` check) — when STP is approved, the existing STP flow in `StpFlowPage.tsx` handles everything
4. The modal only activates when `demo_stp_eligibility` is `"rejected"` or unset

**Preserved behavior:**
- Auto-open when application status is `security_onboarding`
- `demo-role-change` event listener for data refresh
- DocuSign modal integration (now delegated to `AgreementSigningModal`)

### Modified: PremiumBuyerLayout.tsx (Demo Panel)

**Changes:**
- Rename the existing `uwStatus === "security-pending"` button from "Approve Security Onboarding" to "Approve Security Cheque"
- Update the button's onClick handler to:
  1. Set `merchant_underwriting_status` to `"none"`
  2. Set `demo_merchant_role` to value of `selected_product` (fallback: `"receivable"`)
  3. Remove `pending_financing_choice` from localStorage
  4. Dispatch `demo-role-change` event
  5. Show toast: "Security cheque approved. Customer account activated."
  6. Close demo panel

**Note:** The existing button already does most of this. The change is primarily the label rename and adding a toast notification.

## Data Models

### Agreement Step Model

```typescript
const STEPS = [
  { id: 1, label: "Financing Agreement" },
  { id: 2, label: "Murabaha Agreement" },
  { id: 3, label: "DDS Agreement" },
  { id: 4, label: "Bank Account & Security Cheque" },
];
```

### Bank Account Model

```typescript
interface BankAccount {
  id: string;
  label: string;  // e.g., "ADCB - AE12 3456 7890 1234"
}

const MOCK_ACCOUNTS: BankAccount[] = [
  { id: "adcb-1", label: "ADCB - AE12 3456 7890 1234" },
  { id: "enbd-1", label: "Emirates NBD - AE98 7654 3210 9876" },
];
```

### localStorage Schema

| Key | Values | Purpose |
|-----|--------|---------|
| `merchant_underwriting_status` | `"pending"`, `"approved"`, `"security-pending"`, `"none"` | Application lifecycle state |
| `demo_merchant_role` | `"both"`, `"receivable"`, `"payable"`, `"supplier-only"` | Active dashboard role |
| `demo_stp_eligibility` | `"approved"`, `"rejected"` | STP path toggle |
| `selected_product` | `"receivable"`, `"payable"` | Chosen financing product |
| `pending_financing_choice` | `"receivable"`, `"payable"` | Preserved during security-pending |
| `agreement_signing_progress` | JSON array e.g. `[1,2]` | Completed steps persistence |

### Events

| Event Name | Dispatched When | Listeners |
|------------|----------------|-----------|
| `demo-role-change` | Status changes, role changes | `ApplicationsModule`, `PremiumBuyerLayout`, `Layout` |

## Data Flow

### Agreement Generation (on approval)

```
localStorage "merchant_underwriting_status" → "approved"
    ↓
ApplicationsModule detects status change via event listener
    ↓
Computes appStatus = "security_onboarding"
    ↓
AgreementSigningModal auto-opens (agreements are implicit, not stored separately)
    ↓
Toast: "Agreements ready for signing"
```

The three agreements are not stored as separate records — they are implicit in the modal's step structure. The "generation" is the modal becoming available.

### Signing Flow (Steps 1–3)

```
Step 1 active → User clicks "Sign" → DocuSignModal opens (title: "Financing Agreement")
    → User signs → DocuSignModal calls onSign → Step 1 marked complete → Advance to Step 2

Step 2 active → User clicks "Sign" → DocuSignModal opens (title: "Murabaha Agreement")
    → User signs → DocuSignModal calls onSign → Step 2 marked complete → Advance to Step 3

Step 3 active → User clicks "Simulate Completion"
    → Step 3 marked complete → localStorage updated (DD execution simulation) → Advance to Step 4
```

### Submission Flow (Step 4)

```
User selects bank account + uploads cheque file → Submit enabled
    ↓
User clicks Submit
    ↓
1. localStorage.setItem("merchant_underwriting_status", "security-pending")
2. localStorage.setItem("pending_financing_choice", selected_product)
3. window.dispatchEvent(new Event("demo-role-change"))
4. Toast: "Security documents submitted successfully"
5. Toast: "Email sent to Sarah Al Maktoum for verification"
6. Clear agreement_signing_progress from localStorage
7. Modal closes
```

### Banker Approval (Demo Panel)

```
Demo Panel shows "Approve Security Cheque" (when status = "security-pending")
    ↓
Banker clicks button
    ↓
1. localStorage.setItem("merchant_underwriting_status", "none")
2. localStorage.setItem("demo_merchant_role", selected_product || "receivable")
3. localStorage.removeItem("pending_financing_choice")
4. window.dispatchEvent(new Event("demo-role-change"))
5. Toast: "Security cheque approved. Customer account activated."
6. Demo panel closes
```

## Interfaces

### AgreementSigningModal Props

```typescript
interface AgreementSigningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  approvedLimit: number;
  entityName: string;
  applicationId: string;
}
```

### DocuSignModal Props (existing, unchanged)

```typescript
interface DocuSignModalProps {
  documentTitle: string;
  entityName: string;
  referenceId: string;
  additionalDetails?: { label: string; value: string }[];
  onSign: () => void;
  onClose: () => void;
}
```

### localStorage Keys

Progress is stored in `agreement_signing_progress` — see Data Models section for full schema.

### Events

See Data Models section for event table.

## Error Handling

- **DocuSign backend unavailable:** `DocuSignModal` already handles this with simulated fallback — no changes needed.
- **Clipboard API unavailable (Step 3):** Wrap `navigator.clipboard.writeText` in try/catch, show toast error "Could not copy to clipboard" on failure.
- **File upload invalid type:** The `<input accept=".pdf,.jpg,.jpeg,.png">` attribute handles browser-level filtering. Additionally validate on change handler and show toast if somehow an invalid file is selected.
- **localStorage unavailable:** Graceful degradation — progress won't persist across modal close/reopen but flow still works within a session using component state.

## Testing Strategy

This is a UI prototype with no backend. Testing focuses on:

- **Unit tests (example-based):** Verify specific UI interactions — modal opens on correct status, steps render correct content, DocuSign modal receives correct props, submit updates localStorage, demo panel button appears at correct status.
- **Property tests:** Verify universal properties — cheque calculation correctness, file type validation, sequential step enforcement, progress persistence, and submit button enablement logic.
- **Integration tests:** Verify end-to-end flow from approval → modal open → sign all agreements → submit → banker approve → dashboard transition.

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Cheque amount calculation

*For any* approved limit value greater than zero, the displayed security cheque amount SHALL equal exactly 110% of that approved limit (i.e., `approvedLimit * 1.1`).

**Validates: Requirements 6.5**

### Property 2: File type acceptance

*For any* file selected for upload, the system SHALL accept it if and only if its extension is one of `pdf`, `jpg`, `jpeg`, or `png` (case-insensitive).

**Validates: Requirements 6.6**

### Property 3: Sequential step enforcement

*For any* step N (where N > 1), step N SHALL be inaccessible (not navigable to) unless all steps 1 through N-1 are marked as complete.

**Validates: Requirements 10.3**

### Property 4: Progress persistence across modal close/reopen

*For any* set of completed steps S, if the modal is closed and reopened without a full submission having occurred, the set of completed steps SHALL still equal S.

**Validates: Requirements 10.4**

### Property 5: Submit button enablement

*For any* state of Step 4, the Submit button SHALL be enabled if and only if both a bank account is selected AND a security cheque file is uploaded.

**Validates: Requirements 6.7, 6.8**
