# Requirements Document

## Introduction

This feature replaces the existing 2-step non-STP security onboarding modal in `ApplicationsModule.tsx` with a new 4-step modal flow. The new flow covers agreement signing (Financing, Murabaha, and Direct Debit via DocuSign), DDS agreement signing via UAE Pass, and bank account selection with security cheque upload. The STP flow in `StpFlowPage.tsx` remains completely unchanged.

## Glossary

- **Agreement_Signing_Modal**: The 4-step modal dialog that guides the customer through signing agreements and uploading security cheque documents in the non-STP path.
- **Customer_Portal**: The React SPA merchant dashboard where the customer interacts with their applications.
- **Demo_Panel**: The developer/demo control panel (FlaskConical icon, bottom-right corner) used to simulate banker actions.
- **DocuSign_Modal**: The existing `DocuSignModal.tsx` component that provides embedded DocuSign signing or simulated fallback.
- **DDS_Agreement**: The Direct Debit Service agreement that requires signing via UAE Pass rather than DocuSign.
- **UAE_Pass_Widget**: A simulated widget displaying a UAE Pass URL, logo area, and a "Simulate Completion" button for prototype purposes.
- **Security_Cheque**: A physical cheque uploaded as a scanned document (PDF/JPG/PNG) for 110% of the approved financing limit.
- **Approved_Limit**: The financing amount approved for the application (e.g., AED 5,000,000).
- **Banker_Portal**: The simulated banker interface accessed via the Demo Panel for verification actions.

## Requirements

### Requirement 1: Agreement Auto-Generation on Approval

**User Story:** As a customer, I want my agreements to be generated automatically when my application is approved, so that I can proceed with signing without manual intervention.

#### Acceptance Criteria

1. WHEN the `merchant_underwriting_status` localStorage value changes to "approved", THE Agreement_Signing_Modal SHALL generate three agreement records: Financing Agreement, Murabaha Agreement, and Direct Debit Agreement.
2. WHEN all three agreement records have been generated, THE Customer_Portal SHALL display a toast notification indicating that agreements are ready for signing.
3. WHEN all three agreement records have been generated, THE Customer_Portal SHALL dispatch a simulated callback event via localStorage to signal readiness.

### Requirement 2: Auto-Open Modal on Agreement Readiness

**User Story:** As a customer, I want the signing modal to open automatically when my agreements are ready, so that I can begin the signing process immediately.

#### Acceptance Criteria

1. WHEN the application status is `security_onboarding` and agreements are ready, THE Agreement_Signing_Modal SHALL open automatically without requiring user action.
2. THE Agreement_Signing_Modal SHALL display a 4-step progress indicator showing: Financing Agreement, Murabaha Agreement, DDS Agreement, and Bank Account & Security Cheque.
3. WHEN the Agreement_Signing_Modal is open, THE Agreement_Signing_Modal SHALL start at Step 1.

### Requirement 3: Step 1 - Financing Agreement Signing

**User Story:** As a customer, I want to sign the Financing Agreement using DocuSign, so that I can complete the first agreement electronically.

#### Acceptance Criteria

1. WHEN Step 1 is active, THE Agreement_Signing_Modal SHALL display the Financing Agreement with a "Sign" button.
2. WHEN the customer clicks "Sign" on the Financing Agreement, THE Agreement_Signing_Modal SHALL open the DocuSign_Modal with the document title "Financing Agreement".
3. WHEN the customer completes signing in the DocuSign_Modal, THE Agreement_Signing_Modal SHALL mark Step 1 as complete and advance to Step 2.
4. THE Agreement_Signing_Modal SHALL reuse the existing `DocuSignModal` component without modification.

### Requirement 4: Step 2 - Murabaha Agreement Signing

**User Story:** As a customer, I want to sign the Murabaha Agreement using DocuSign, so that I can complete the second agreement electronically.

#### Acceptance Criteria

1. WHEN Step 2 is active, THE Agreement_Signing_Modal SHALL display the Murabaha Agreement with a "Sign" button.
2. WHEN the customer clicks "Sign" on the Murabaha Agreement, THE Agreement_Signing_Modal SHALL open the DocuSign_Modal with the document title "Murabaha Agreement".
3. WHEN the customer completes signing in the DocuSign_Modal, THE Agreement_Signing_Modal SHALL mark Step 2 as complete and advance to Step 3.
4. THE Agreement_Signing_Modal SHALL reuse the existing `DocuSignModal` component without modification.

### Requirement 5: Step 3 - DDS Agreement via UAE Pass

**User Story:** As a customer, I want to sign the Direct Debit Agreement using UAE Pass, so that I can complete the e-signing through the government identity platform.

#### Acceptance Criteria

1. WHEN Step 3 is active, THE Agreement_Signing_Modal SHALL display a generated URL for the DDS agreement signing.
2. THE Agreement_Signing_Modal SHALL display a "Copy URL" button that copies the URL to the clipboard.
3. THE Agreement_Signing_Modal SHALL display an "Open in new tab" icon button that opens the URL in a new browser tab.
4. THE Agreement_Signing_Modal SHALL display instructions directing the customer to open the URL and e-sign using UAE Pass.
5. THE Agreement_Signing_Modal SHALL display the UAE_Pass_Widget containing a mock URL (e.g., `https://uaepass.ae/sign/...`), a UAE Pass logo area, and a "Simulate Completion" button.
6. WHEN the customer clicks "Simulate Completion", THE Agreement_Signing_Modal SHALL mark Step 3 as complete and advance to Step 4.
7. WHEN the customer completes Step 3, THE Agreement_Signing_Modal SHALL simulate DD Execution starting in the background by updating localStorage state.

### Requirement 6: Step 4 - Bank Account Selection and Security Cheque Upload

**User Story:** As a customer, I want to select my bank account and upload a security cheque, so that I can complete the security onboarding requirements.

#### Acceptance Criteria

1. WHEN Step 4 is active, THE Agreement_Signing_Modal SHALL display a dropdown of bank accounts associated with the application.
2. THE Agreement_Signing_Modal SHALL populate the dropdown with mock account numbers (e.g., "ADCB - AE12 3456 7890 1234", "Emirates NBD - AE98 7654 3210 9876").
3. WHILE only one bank account exists in the dropdown, THE Agreement_Signing_Modal SHALL select that account by default.
4. WHEN a bank account is selected, THE Agreement_Signing_Modal SHALL display an upload area requesting a security cheque for 110% of the Approved_Limit.
5. THE Agreement_Signing_Modal SHALL calculate and display the required cheque amount as 110% of the Approved_Limit (e.g., AED 5,500,000 for a limit of AED 5,000,000).
6. THE Agreement_Signing_Modal SHALL accept PDF, JPG, and PNG file formats for the security cheque upload.
7. IF no bank account is selected, THEN THE Agreement_Signing_Modal SHALL disable the Submit button.
8. IF no security cheque file is uploaded, THEN THE Agreement_Signing_Modal SHALL disable the Submit button.

### Requirement 7: Post-Submission Behavior

**User Story:** As a customer, I want confirmation that my submission was received and is being processed, so that I know the next steps.

#### Acceptance Criteria

1. WHEN the customer clicks Submit on Step 4, THE Agreement_Signing_Modal SHALL update `merchant_underwriting_status` in localStorage to "security-pending".
2. WHEN the customer clicks Submit on Step 4, THE Customer_Portal SHALL display a toast notification confirming successful submission.
3. WHEN the customer clicks Submit on Step 4, THE Customer_Portal SHALL display a simulated email notification toast indicating the assigned banker has been notified.
4. WHEN the customer clicks Submit on Step 4, THE Agreement_Signing_Modal SHALL close.
5. WHEN the customer clicks Submit on Step 4, THE Customer_Portal SHALL dispatch a `demo-role-change` event to refresh the application status display.

### Requirement 8: Banker Security Cheque Verification via Demo Panel

**User Story:** As a banker (simulated via Demo Panel), I want to verify and approve the security cheque, so that the customer's onboarding can be completed.

#### Acceptance Criteria

1. WHILE the `merchant_underwriting_status` is "security-pending", THE Demo_Panel SHALL display an "Approve Security Cheque" action button.
2. WHEN the banker clicks "Approve Security Cheque" in the Demo_Panel, THE Demo_Panel SHALL update `merchant_underwriting_status` in localStorage to "none".
3. WHEN the banker clicks "Approve Security Cheque" in the Demo_Panel, THE Demo_Panel SHALL set `demo_merchant_role` in localStorage to the value of `selected_product`.
4. WHEN the banker clicks "Approve Security Cheque" in the Demo_Panel, THE Customer_Portal SHALL dispatch a `demo-role-change` event to transition the customer to the active dashboard.
5. WHEN the banker clicks "Approve Security Cheque" in the Demo_Panel, THE Customer_Portal SHALL display a toast notification confirming security cheque approval.

### Requirement 9: STP Flow Isolation

**User Story:** As a developer, I want the STP flow to remain unchanged, so that existing approved-path behavior is preserved.

#### Acceptance Criteria

1. THE Customer_Portal SHALL leave `StpFlowPage.tsx` completely unmodified.
2. WHILE `demo_stp_eligibility` is "approved", THE Customer_Portal SHALL route the customer through the existing STP flow without invoking the Agreement_Signing_Modal.
3. THE Agreement_Signing_Modal SHALL only activate in the non-STP path when `demo_stp_eligibility` is "rejected" or unset.

### Requirement 10: Step Navigation and Progress Tracking

**User Story:** As a customer, I want to see my progress through the signing steps, so that I know how much remains.

#### Acceptance Criteria

1. THE Agreement_Signing_Modal SHALL display a step indicator showing all 4 steps with their completion status.
2. THE Agreement_Signing_Modal SHALL visually distinguish completed steps, the current active step, and upcoming steps.
3. THE Agreement_Signing_Modal SHALL enforce sequential step completion — the customer cannot skip ahead to a later step.
4. THE Agreement_Signing_Modal SHALL allow the customer to close the modal at any point without losing progress on completed steps.
