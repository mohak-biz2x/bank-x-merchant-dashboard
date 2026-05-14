# Post Application Submission — Epics & User Stories

---

## Epic 1: Post-Submission Automations & Decision Engine

### Overview

After the customer submits their financing application, the system runs a series of automated checks in the background while the customer sees a "Please Wait" screen. The automations determine whether the application is auto-approved, rejected, or referred for manual review.

### Scope

- "Please Wait" screen with polling until automations complete
- Auto Bank Statement Parsing & BSA trigger
- Auto Financial Documents Analysis trigger
- Decision Automation (auto-approve / reject / refer)
- Pricing Automation
- STP Automation
- Routing logic based on decision + STP outcomes
- Assignment to banker pool for reject/refer cases
- Email notifications on status changes

### Flow

```
Submit → Please Wait (polling) → BSA → Financial Analysis → Decision
  ├── Auto-Approve → Pricing → STP
  │     ├── STP Approved → Status: Drawdown → Application Approved Screen
  │     └── STP Not Approved → Status: In Review → Applications List
  └── Reject/Refer → Assign to Banker → Pricing → STP → Results to Banker
        → Status: In Review → Applications List
```

### Dependencies (Banker Portal — separate epic)
- Banker reviews referred/rejected applications
- Banker manually approves and updates status to Drawdown

---

### Story 1.1: "Please Wait" Screen — Polling Until Automations Complete

**As a** customer who has just submitted an application,
**I want to** see a loading screen while the system processes my application,
**So that** I know the system is working and I don't need to take any action.

#### Screen Details
- Full-page dark-themed screen with Mal branding
- Animated spinner/loader
- Title: "Please wait"
- Subtitle: "Mal is running credit underwriting rules in the background for you. This may take up to a few minutes."
- Footer: Privacy policy, Disclaimer, Terms & conditions links

#### Behavior
- Screen displayed immediately after application submission
- Frontend polls backend for automation completion status
- Customer stays on this screen until ALL automations complete
- No timeout — waits until backend responds with final status
- On completion: routes customer based on decision + STP result

#### Acceptance Criteria
- [ ] Please Wait screen displayed immediately after submission
- [ ] Animated loader shown continuously
- [ ] Frontend polls backend at regular intervals (e.g., every 5 seconds)
- [ ] Screen remains until all automations complete
- [ ] On completion: customer routed to appropriate next screen
- [ ] If auto-approve + STP approved → route to Application Approved screen
- [ ] If auto-approve + STP not approved → route to Applications List (status: In Review)
- [ ] If reject/refer → route to Applications List (status: In Review)

---

### Story 1.2: Auto Bank Statement Parsing & BSA Trigger

**As a** system,
**I want to** automatically parse uploaded bank statements and trigger BSA (Bank Statement Analysis),
**So that** the financial health of the applicant is assessed without manual intervention.

#### Behavior
- Triggered automatically after application submission (first automation in sequence)
- Parses bank statements uploaded during the customer journey
- Triggers BSA engine for analysis
- Results stored against the application
- On completion: triggers next automation (Financial Documents Analysis)

#### Acceptance Criteria
- [ ] BSA triggered automatically after submission
- [ ] Bank statements parsed without manual intervention
- [ ] BSA results stored against the application
- [ ] On completion, Financial Documents Analysis is triggered next
- [ ] Errors handled gracefully (retry mechanism or escalation)

---

### Story 1.3: Auto Financial Documents Analysis Trigger

**As a** system,
**I want to** automatically analyze the uploaded financial documents,
**So that** the applicant's financial position is assessed for credit decisioning.

#### Behavior
- Triggered after BSA completes (second automation in sequence)
- Analyzes financial documents uploaded during the customer journey
- Results stored against the application
- On completion: triggers Decision Automation

#### Acceptance Criteria
- [ ] Financial Documents Analysis triggered after BSA completes
- [ ] Documents analyzed without manual intervention
- [ ] Results stored against the application
- [ ] On completion, Decision Automation is triggered next
- [ ] Errors handled gracefully

---

### Story 1.4: Decision Automation

**As a** system,
**I want to** automatically make a credit decision based on BSA and financial analysis results,
**So that** qualifying applications are approved instantly without banker involvement.

#### Outcomes
| Decision | Next Steps |
|----------|-----------|
| Auto-Approve | Run Pricing Automation → STP Automation |
| Reject | Assign to banker pool (Fulfillment Ops) → Run Pricing → STP → Show results to banker |
| Refer | Assign to banker pool (Fulfillment Ops) → Run Pricing → STP → Show results to banker |

#### Acceptance Criteria
- [ ] Decision made automatically based on BSA + financial analysis results
- [ ] Auto-Approve: triggers Pricing Automation next
- [ ] Reject: application assigned to banker pool, then Pricing + STP run
- [ ] Refer: application assigned to banker pool, then Pricing + STP run
- [ ] Decision result stored against the application
- [ ] No reject/refer status shown to customer at this stage

---

### Story 1.5: Pricing Automation

**As a** system,
**I want to** automatically calculate pricing (rates, limits, terms) for the application,
**So that** the approved limit and terms are determined without manual calculation.

#### Behavior
- Triggered after Decision Automation completes (for all outcomes)
- Calculates: approved limit, interest rate, limit expiry, terms
- Results stored against the application
- On completion: triggers STP Automation

#### Acceptance Criteria
- [ ] Pricing calculated automatically after decision
- [ ] Approved limit, rate, expiry determined
- [ ] Results stored and available to banker (for reject/refer) and system (for auto-approve)
- [ ] On completion, STP Automation triggered next

---

### Story 1.6: STP Automation

**As a** system,
**I want to** determine whether the application qualifies for Straight-Through Processing,
**So that** qualifying applications skip manual banker review and proceed directly to drawdown.

#### Outcomes
| STP Result | Previous Decision | Customer Experience |
|-----------|------------------|-------------------|
| STP Approved | Auto-Approve | Status → Drawdown. Customer sees Application Approved screen |
| STP Not Approved | Auto-Approve | Status → In Review. Customer sees Applications List |
| Any | Reject/Refer | Results shown to banker. Customer sees Applications List (In Review) |

#### Acceptance Criteria
- [ ] STP check runs after Pricing Automation
- [ ] STP Approved + Auto-Approve: application status updated to Drawdown
- [ ] STP Approved + Auto-Approve: customer routed to Application Approved screen
- [ ] STP Not Approved + Auto-Approve: application status set to In Review
- [ ] STP Not Approved: customer routed to Applications List
- [ ] For Reject/Refer: STP results displayed to banker in relevant tabs
- [ ] STP result stored against the application

---

### Story 1.7: Email Notifications — Application Status Updates

**As a** customer,
**I want to** receive email notifications when my application status changes,
**So that** I stay informed about my application progress.

#### Email 1: Application Submitted Successfully

**Trigger:** Customer submits application (before automations start)
**Recipient:** Customer

**Subject:** Mal - Application [Application ID] Submitted Successfully

```
Dear [Customer Name],

Your financing application has been submitted successfully.

Application Details:
- Application ID: [Application ID]
- Business Name: [Business Name]
- Product: [Product Name]
- Submitted On: [Date]

Your application is now being processed. Our automated credit underwriting system is reviewing your documents and financial information. This may take a few minutes.

You will be notified once the review is complete.

You can track your application status by logging in to your portal.

[Portal Login URL]

If you have any questions, please reach out to us at [Support Email].

Best regards,
Mal Team
```

#### Email 2: Application Moved to "In Review"

**Trigger:** Decision is reject/refer — application assigned to banker pool
**Recipient:** Customer

**Subject:** Mal - Application [Application ID] Under Review

```
Dear [Customer Name],

Your financing application is currently under review by our team.

Application Details:
- Application ID: [Application ID]
- Business Name: [Business Name]
- Product: [Product Name]
- Status: In Review

Our team is reviewing your application and may reach out if additional information is needed. You will be notified once a decision is made.

You can track your application status by logging in to your portal.

[Portal Login URL]

If you have any questions, please reach out to us at [Support Email].

Best regards,
Mal Team
```

#### Email 3: Application Moved to "Drawdown" (Approved)

**Trigger:** STP approved (auto) or banker manually approves and updates to Drawdown
**Recipient:** Customer

**Subject:** Mal - Application [Application ID] Approved — Limit Activated

```
Dear [Customer Name],

Congratulations! Your financing application has been approved.

Application Details:
- Application ID: [Application ID]
- Business Name: [Business Name]
- Product: [Product Name]
- Approved Limit: AED [Approved Limit]
- Limit Expiry: [Expiry Date]

Next Steps:
Please log in to your portal to sign the required agreements and activate your financing facility.

[Portal Login URL]

If you have any questions, please reach out to us at [Support Email].

Best regards,
Mal Team
```

#### Acceptance Criteria
- [ ] Email 1 sent immediately after application submission
- [ ] Email 2 sent when application moves to "In Review" (reject/refer)
- [ ] Email 3 sent when application moves to "Drawdown" (STP approved or banker approved)
- [ ] All emails include Application ID, Business Name, Product
- [ ] Portal login URL included in all emails
- [ ] Support email included in all emails

---

---

## Epic 2: STP-Approved Path — Agreements & Dashboard Activation

### Overview

When an application is STP-approved (auto-approve + STP pass), the customer sees the "Application Approved" screen with their limit details and proceeds to sign agreements via embedded DocuSign. After signing, they are redirected to their financing dashboard.

### Scope

- Application Approved screen (Drawdown status)
- "Proceed to Agreements" CTA
- Sign Agreements screen (embedded DocuSign)
- Agreements: Financing Agreement + Direct Debit Agreement
- Post-signing: "All agreements signed" confirmation + countdown redirect to dashboard
- Dashboard activation with financing limit

### Flow

```
Application Approved Screen → Proceed to Agreements → Sign (DocuSign embedded)
  → All Signed → Redirect (2s countdown) → Respective Dashboard
```

---

### Story 2.1: Application Approved Screen

**As a** customer whose application has been approved (Drawdown status),
**I want to** see my approval details and proceed to sign agreements,
**So that** I can activate my financing facility.

#### Screen Details (Dark-themed full page)
- Green checkmark icon
- Title: "Application Approved!"
- Subtitle: "Your financing application has been approved"
- Details card:
  - Business Name
  - Approved Limit (AED X,XXX,XXX)
  - Limit Expiry (DD Month YYYY)
  - Product (e.g., Receivable Invoice Financing)
- Info text: "Please sign the required agreements to activate your financing facility."
- CTA: "Proceed to Agreements >"

#### When Shown
- Immediately after STP Approved result (auto-flow)
- After banker manually approves and updates to Drawdown (manual flow)

#### Acceptance Criteria
- [ ] Screen shown when application status is Drawdown
- [ ] Displays correct business name, approved limit, expiry, product
- [ ] "Proceed to Agreements" button navigates to agreements screen
- [ ] Accessible from Applications List when status is Drawdown (via action menu)

---

### Story 2.2: Sign Agreements — Embedded DocuSign (STP Path)

**As a** customer on the STP-approved path,
**I want to** sign my financing agreements digitally,
**So that** my financing facility is activated without physical paperwork.

#### Screen Details (Dark-themed full page)
- Title: "Sign Agreements"
- Subtitle: "Please review and sign the following agreements to activate your financing facility."
- Agreement cards:
  - Financing Agreement — "Master financing agreement covering terms, rates, and conditions" — [Sign] button
  - Direct Debit Agreement — "Authorization for automatic debit of repayment amounts from your account" — [Sign] button
- Each agreement signed via embedded DocuSign flow
- After signing: button changes to "✓ Signed" (green)

#### Post-Signing
- Once ALL agreements signed: "All agreements signed successfully!" message
- Countdown: "Redirecting to your dashboard..." (5 second countdown)
- Auto-redirect to respective financing dashboard (Receivable or Payable based on product)
- Email notification sent confirming facility activation

#### Email: Agreements Signed — Facility Activated (STP Path)

**Trigger:** All agreements signed successfully (STP path)
**Recipient:** Customer

**Subject:** Mal - Financing Facility Activated — [Application ID]

```
Dear [Customer Name],

All agreements have been signed successfully. Your financing facility is now active.

Facility Details:
- Application ID: [Application ID]
- Business Name: [Business Name]
- Product: [Product Name]
- Approved Limit: AED [Approved Limit]
- Limit Expiry: [Expiry Date]

You can now start using your financing facility through your dashboard.

[Portal Login URL]

If you have any questions, please reach out to us at [Support Email].

Best regards,
Mal Team
```

#### Acceptance Criteria
- [ ] Two agreements displayed: Financing Agreement + Direct Debit Agreement
- [ ] Each "Sign" button opens embedded DocuSign signing flow
- [ ] After signing, button shows "Signed" with green checkmark
- [ ] Both agreements must be signed before redirect
- [ ] "All agreements signed successfully!" shown after both complete
- [ ] 5-second countdown then auto-redirect to dashboard
- [ ] Dashboard shows financing limit as active/available after redirect
- [ ] Email sent confirming facility activation after all agreements signed

---

---

## Epic 3: Non-STP Path — Security Onboarding

### Overview

When an application is NOT STP-approved (banker manually approves), the customer goes through a Security Onboarding flow: signing digital agreements and uploading a security cheque. The application then waits for banker approval of the cheque before the customer can access their dashboard.

### Scope

- Security Onboarding modal (2-step wizard)
- Step 1: Sign Digital Agreements (DocuSign embedded)
- Step 2: Upload Security Cheque
- Post-submission: Application status → "Pending Security Cheque"
- Banker approves cheque → status auto-updates to Drawdown
- Customer auto-redirected to dashboard + email notification

### Flow

```
Banker approves (Drawdown) → Application Approved Screen → Security Onboarding Modal
  → Step 1: Sign Agreements (DocuSign) → Step 2: Upload Cheque → Submit
  → Applications List (Pending Security Cheque)
  → Banker approves cheque → Status: Drawdown → Auto-redirect to Dashboard
```

---

### Story 3.1: Security Onboarding Modal — Step 1: Sign Digital Agreements

**As a** customer on the non-STP path,
**I want to** sign my financing agreements digitally as part of security onboarding,
**So that** I can proceed to complete the security requirements.

#### Screen Details (Dark-themed modal over Applications List)
- Modal title: "Security Onboarding"
- Step indicator: 1. Digital Agreements — 2. Upload Cheque
- Section title: "Sign Digital Agreements"
- Subtitle: "Review and e-sign the following agreements to proceed."
- Agreement cards:
  - Financing Agreement — "Master financing agreement covering terms, rates, and conditions" — [Sign] button
  - Direct Debit Agreement — "Authorization for automatic debit of repayment amounts from your account" — [Sign] button
- After signing both: [Continue] button enabled

#### Behavior
- Each "Sign" button opens embedded DocuSign flow
- After signing: shows "✓ Signed" (green)
- "Continue" button disabled until both agreements signed
- On Continue: moves to Step 2

#### Acceptance Criteria
- [ ] Modal opens from Applications List (action on application with Drawdown status, non-STP)
- [ ] Step indicator shows Step 1 active
- [ ] Two agreements displayed with Sign buttons
- [ ] DocuSign embedded signing for each
- [ ] "Continue" enabled only after both signed
- [ ] Continue navigates to Step 2

---

### Story 3.2: Security Onboarding Modal — Step 2: Upload Security Cheque

**As a** customer,
**I want to** upload a scanned security cheque,
**So that** the bank has the required security documentation to activate my facility.

#### Screen Details
- Step indicator: 1. Digital Agreements (✓) — 2. Upload Cheque (active)
- Section title: "Upload Security Cheque"
- Subtitle: "Upload a scanned security cheque to complete the security requirement."
- File upload area: "Upload Security Cheque" — PDF, JPG, or PNG
- After upload: file name shown with green checkmark + remove (X) option
- Footer: [Back] button, [Submit] button (enabled after file uploaded)

#### Behavior
- Back returns to Step 1 (agreements already signed, shown as completed)
- Submit uploads the cheque and closes the modal
- After submit: application status updates to "Pending Security Cheque"
- Customer returns to Applications List with updated status
- Email sent to customer confirming cheque submission
- Email sent to banker notifying cheque is ready for review

#### Email: Security Cheque Submitted (Customer)

**Trigger:** Customer submits security cheque
**Recipient:** Customer

**Subject:** Mal - Security Cheque Submitted — [Application ID]

```
Dear [Customer Name],

Your security cheque has been submitted successfully.

Application Details:
- Application ID: [Application ID]
- Business Name: [Business Name]
- Product: [Product Name]
- Status: Pending Security Cheque

Our team will review your security cheque. You will be notified once it is approved and your financing facility is activated.

You can track your application status by logging in to your portal.

[Portal Login URL]

If you have any questions, please reach out to us at [Support Email].

Best regards,
Mal Team
```

#### Email: Security Cheque Ready for Review (Banker)

**Trigger:** Customer submits security cheque
**Recipient:** Assigned Banker / Fulfillment Ops

**Subject:** Mal - Security Cheque Pending Review — [Application ID]

```
Dear [Banker Name],

A security cheque has been submitted and is pending your review.

Application Details:
- Application ID: [Application ID]
- Business Name: [Business Name]
- Customer: [Customer Name]
- Product: [Product Name]

Please review the uploaded security cheque and approve or reject it.

[Banker Portal URL]

Best regards,
Mal System
```

#### Acceptance Criteria
- [ ] Step 2 shown after agreements signed
- [ ] File upload accepts PDF, JPG, PNG
- [ ] File name displayed after upload with remove option
- [ ] Submit disabled until file uploaded
- [ ] On submit: cheque uploaded, modal closes
- [ ] Application status updates to "Pending Security Cheque"
- [ ] Customer sees updated status on Applications List
- [ ] Email sent to customer confirming cheque submission
- [ ] Email sent to banker notifying cheque is ready for review

---

### Story 3.3: Banker Cheque Approval → Auto-Redirect to Dashboard

**As a** customer whose security cheque has been approved by the banker,
**I want** my application status to automatically update to Drawdown and be redirected to my dashboard,
**So that** I can start using my financing facility immediately.

#### Behavior
- Banker approves the security cheque (Banker Portal — dependency)
- Application status automatically updates to Drawdown
- If customer is currently on the Applications List page: auto-redirect to respective dashboard
- Email notification sent to customer confirming activation

#### Email: Security Cheque Approved — Facility Activated

**Trigger:** Banker approves security cheque, status moves to Drawdown
**Recipient:** Customer

**Subject:** Mal - Financing Facility Activated — [Application ID]

```
Dear [Customer Name],

Your security cheque has been approved and your financing facility is now active.

Facility Details:
- Application ID: [Application ID]
- Business Name: [Business Name]
- Product: [Product Name]
- Approved Limit: AED [Approved Limit]
- Limit Expiry: [Expiry Date]

You can now start using your financing facility through your dashboard.

[Portal Login URL]

If you have any questions, please reach out to us at [Support Email].

Best regards,
Mal Team
```

#### Acceptance Criteria
- [ ] When banker approves cheque, application status moves to Drawdown
- [ ] Customer auto-redirected to respective dashboard (Receivable/Payable based on product)
- [ ] Email notification sent confirming facility activation
- [ ] Dashboard shows financing limit as active/available

---

### Dependencies (Banker Portal — separate epic)
- Banker reviews and approves/rejects security cheque
- Banker manually approves applications and updates to Drawdown
- Banker views Pricing and STP results in relevant tabs
