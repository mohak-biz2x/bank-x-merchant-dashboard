# Implementation Plan: Agreement Signing Flow

## Overview

Replace the existing 2-step inline security onboarding modal in `ApplicationsModule.tsx` with a new extracted 4-step `AgreementSigningModal` component. The modal handles DocuSign-based agreement signing (Steps 1 & 2), UAE Pass DDS signing simulation (Step 3), and bank account selection with security cheque upload (Step 4). All state is localStorage-based. The STP flow remains untouched.

## Tasks

- [x] 1. Create AgreementSigningModal component with step indicator and navigation
  - [x] 1.1 Create `src/app/components/AgreementSigningModal.tsx` with props interface, step state management, and 4-step progress indicator
    - Define `AgreementSigningModalProps` interface (`isOpen`, `onClose`, `onComplete`, `approvedLimit`, `entityName`, `applicationId`)
    - Implement `currentStep` and `completedSteps` state
    - Render horizontal 4-step progress bar with completed (green checkmark), active (blue), and upcoming (gray) visual states
    - Implement connecting lines between steps (green if prior step complete, gray otherwise)
    - Add modal overlay and container structure matching existing modal styling (`bg-[#CBD2DD]/[.72]`, white card, header with `bg-[#C3D2E7]`)
    - Add close button in header
    - _Requirements: 2.2, 2.3, 10.1, 10.2_

  - [x] 1.2 Implement sequential step enforcement and localStorage progress persistence
    - Enforce that step N is only accessible if steps 1 through N-1 are complete
    - On modal open, restore completed steps from `agreement_signing_progress` localStorage key (JSON array)
    - On each step completion, update `agreement_signing_progress` in localStorage
    - On final submission, clear `agreement_signing_progress` from localStorage
    - _Requirements: 10.3, 10.4_

- [x] 2. Implement Step 1 - Financing Agreement (DocuSign)
  - [x] 2.1 Implement Step 1 content within AgreementSigningModal
    - When `currentStep === 1`, render Financing Agreement card with title, description, and "Sign" button
    - On "Sign" click, set `showDocuSign` state to `{ title: "Financing Agreement", step: 1 }`
    - Render `DocuSignModal` when `showDocuSign` is set, passing `documentTitle`, `entityName`, `referenceId` (applicationId), `onSign`, `onClose`
    - On `onSign` callback: mark step 1 complete, advance to step 2, clear `showDocuSign`
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 3. Implement Step 2 - Murabaha Agreement (DocuSign)
  - [x] 3.1 Implement Step 2 content within AgreementSigningModal
    - When `currentStep === 2`, render Murabaha Agreement card with title, description, and "Sign" button
    - On "Sign" click, set `showDocuSign` state to `{ title: "Murabaha Agreement", step: 2 }`
    - On `onSign` callback: mark step 2 complete, advance to step 3, clear `showDocuSign`
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 4. Implement Step 3 - DDS Agreement (UAE Pass widget)
  - [x] 4.1 Implement Step 3 UAE Pass widget content
    - When `currentStep === 3`, generate mock URL: `https://uaepass.ae/sign/dds-${applicationId}-${Date.now()}`
    - Display URL in a readonly input field
    - Add "Copy URL" button using `navigator.clipboard.writeText` (wrap in try/catch, show toast on failure)
    - Add "Open in new tab" icon button using `window.open(url, '_blank')`
    - Display instruction text: "Open the URL above and e-sign using UAE Pass"
    - Display UAE Pass logo placeholder (styled div with "UAE PASS" text)
    - Add "Simulate Completion" primary button
    - On "Simulate Completion" click: mark step 3 complete, advance to step 4
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

- [x] 5. Implement Step 4 - Bank Account & Security Cheque Upload
  - [x] 5.1 Implement Step 4 bank account dropdown and cheque upload
    - When `currentStep === 4`, render bank account dropdown with mock accounts: `ADCB - AE12 3456 7890 1234`, `Emirates NBD - AE98 7654 3210 9876`
    - If only one account exists, auto-select it by default
    - Calculate and display required cheque amount as `approvedLimit * 1.1` formatted as currency (e.g., "AED 5,500,000")
    - Render file upload area accepting `.pdf, .jpg, .jpeg, .png`
    - Show uploaded file name with remove button after upload
    - Disable Submit button when `selectedAccount === null` OR `uploadedFile === null`
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8_

- [x] 6. Implement post-submission logic
  - [x] 6.1 Implement Submit handler and post-submission behavior
    - On Submit click:
      1. Set `merchant_underwriting_status` to `"security-pending"` in localStorage
      2. Set `pending_financing_choice` to value of `selected_product` in localStorage
      3. Dispatch `demo-role-change` event
      4. Show toast: "Security documents submitted successfully"
      5. Show toast: "Email sent to Sarah Al Maktoum for verification"
      6. Clear `agreement_signing_progress` from localStorage
      7. Close modal via `onComplete()` callback
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 7. Checkpoint - Verify modal component works end-to-end
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Modify ApplicationsModule.tsx to use AgreementSigningModal
  - [x] 8.1 Replace inline security modal with AgreementSigningModal component
    - Remove existing inline security onboarding modal state (`showSecurityModal`, `securityStep`, `signedAgreements`, `securityChequeFile`, `showStpSuccess`, `stpTimer`, `docuSignDoc`)
    - Remove existing inline security modal JSX (the `{showSecurityModal && ...}` block and `{docuSignDoc && ...}` block)
    - Remove the STP auto-redirect countdown `useEffect`
    - Add `<AgreementSigningModal>` component with props: `isOpen`, `onClose`, `onComplete`, `approvedLimit={5000000}`, `entityName="Al Masraf Industries LLC"`, `applicationId="APP-2025-001"`
    - The modal should only activate when `demo_stp_eligibility` is `"rejected"` or unset (preserve existing `isStp` check — when STP approved, the existing STP flow handles everything)
    - Keep the auto-open behavior: when application status is `security_onboarding` and not STP, open the modal
    - Keep the `demo-role-change` event listener for data refresh
    - _Requirements: 2.1, 9.2, 9.3_

- [x] 9. Modify Demo Panel to update "Approve Security Cheque" action
  - [x] 9.1 Update the security-pending button in `Layout.tsx` and `PremiumBuyerLayout.tsx`
    - Rename button label from "Approve Security Onboarding" to "Approve Security Cheque"
    - Add toast notification on click: "Security cheque approved. Customer account activated."
    - Ensure existing onClick logic is preserved (set `merchant_underwriting_status` to `"none"`, set `demo_merchant_role`, remove `pending_financing_choice`, dispatch event, close panel)
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 10. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ]* 11. Write property tests for correctness properties
  - [ ]* 11.1 Write property test for cheque amount calculation
    - **Property 1: Cheque amount calculation**
    - For any approved limit > 0, verify displayed cheque amount equals exactly `approvedLimit * 1.1`
    - **Validates: Requirements 6.5**

  - [ ]* 11.2 Write property test for file type acceptance
    - **Property 2: File type acceptance**
    - For any file, verify acceptance if and only if extension is pdf, jpg, jpeg, or png (case-insensitive)
    - **Validates: Requirements 6.6**

  - [ ]* 11.3 Write property test for sequential step enforcement
    - **Property 3: Sequential step enforcement**
    - For any step N > 1, verify step N is inaccessible unless steps 1 through N-1 are complete
    - **Validates: Requirements 10.3**

  - [ ]* 11.4 Write property test for progress persistence
    - **Property 4: Progress persistence across modal close/reopen**
    - For any set of completed steps, verify persistence across modal close/reopen (without full submission)
    - **Validates: Requirements 10.4**

  - [ ]* 11.5 Write property test for submit button enablement
    - **Property 5: Submit button enablement**
    - For any state of Step 4, verify Submit is enabled iff both bank account selected AND file uploaded
    - **Validates: Requirements 6.7, 6.8**

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- The STP flow (`StpFlowPage.tsx`) is completely untouched per Requirement 9.1
- Property tests validate universal correctness properties from the design document
- The implementation language is TypeScript/React (matching the existing codebase)

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2"] },
    { "id": 2, "tasks": ["2.1", "3.1", "4.1", "5.1"] },
    { "id": 3, "tasks": ["6.1"] },
    { "id": 4, "tasks": ["8.1", "9.1"] },
    { "id": 5, "tasks": ["11.1", "11.2", "11.3", "11.4", "11.5"] }
  ]
}
```
