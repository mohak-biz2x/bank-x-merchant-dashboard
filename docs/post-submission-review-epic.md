ci# Epic: Post-Submission Application Review & Status Management

## Epic Summary

After a merchant submits their application through the Customer Journey, the system should inform them that their application is being reviewed (document extraction + automated eligibility checks). The cu?



'12stomer should be able to track their application status in real-time, and the system should handle transitions to Manual Review or Agreement Signing flows seamlessly.

## Business Context

Once an application is submitted, the bank runs automated STP (Straight-Through Processing) rules against the extracted document data. This process can take up to 5 minutes. During this time, the customer needs clear feedback about what's happening. Based on the outcome, the application either proceeds to agreement signing (STP approved) or enters manual review (STP not approved).

## Design Reference

- **HTML Prototype**: `docs/post-submission-processing-screen.html`
- **Loader Asset**: `src/assets/Group 2147260758.svg`

---

## User Story 1: In Review Modal (Post-Submission Processing Screen)

### Title
As a merchant, I want to see a processing modal after submitting my application so that I know my application is being reviewed and can track its progress.

### Description
When a merchant accesses the customer portal after their application has been submitted and the application status is "In Review", they should be presented with a modal overlay informing them that the bank is extracting information from their documents and running eligibility checks. The modal should allow them to refresh the status, and based on the result, transition to the appropriate next screen.

### Acceptance Criteria

| # | Criteria | Details |
|---|---------|---------|
| AC-1 | Modal appears on portal access | The "In Review" modal MUST appear every time the customer portal link is accessed after the application is submitted and the application status is "In Review". |
| AC-2 | Modal content | The modal MUST display: (a) animated loader icon (Group 2147260758.svg with slow rotate + float effect), (b) title "We're reviewing your application", (c) description about document extraction and eligibility checks, (d) estimated time (~5 minutes), (e) info text that user can wait or come back later, (f) application reference number, (g) current status badge "In Review" (Blue). |
| AC-2 | Status refresh on modal | The customer MUST be able to refresh the status on the modal via a refresh icon next to the status badge. On click, the refresh icon should animate (spin) and call the status API. |
| AC-4 | Transition to Manual Review | If the status updates to "In Manual Review" after refresh, the In Review modal MUST close and the Manual Review Required modal MUST be displayed. |
| AC-5 | Transition to Agreements | If the status updates to "Pending Agreements Signing" after refresh, the In Review modal MUST close and the Agreement Signing flow MUST be launched directly. |
| AC-6 | Close modal behavior | If the customer closes the modal (X icon), they MUST be shown the My Applications page with the current application status visible in the table. |
| AC-7 | Background page | The My Applications page (Your Loan Applications table) MUST be visible behind the modal overlay with a dark blurred backdrop. |
| AC-8 | Status remains In Review | If the status has not changed after refresh, the modal MUST remain displayed with the same content and the status badge should still show "In Review". |

### Manual Review Required Modal

When the status transitions to "In Manual Review", a secondary modal is displayed:

| # | Criteria | Details |
|---|---------|---------|
| AC-9 | Manual Review modal content | MUST display: (a) loader icon (same SVG with slow bounce effect), (b) title "Manual Review Required", (c) "In Manual Review" badge (Blue), (d) message: "As per our policy, your application requires a manual review by our team. Once the review is complete, you will be notified via email with the next steps.", (e) "Understood" button (white pill style), (f) application reference number. |
| AC-10 | Understood button behavior | On clicking "Understood", the modal MUST close and the customer MUST be shown the My Applications page. |
| AC-11 | Close button behavior | The X close button on the Manual Review modal MUST behave the same as the "Understood" button — navigate to My Applications page. |

### Technical Notes

- The In Review modal should be triggered based on application status returned from the status API, not just on submission completion.
- The modal should be a route-level overlay (not tied to a specific page component) so it appears regardless of which portal URL the customer accesses.
- The loader animation should use CSS keyframes (float + slow rotate for In Review, bounce for Manual Review).

---

## User Story 2: Application Status Display & Refresh on My Applications Page

### Title
As a merchant, I want to see the current status of my application on the My Applications page with a refresh option so that I can track my application progress at any time.

### Description
The My Applications page ("Your Loan Applications" table) should display the current application status using color-coded badges. A refresh icon should be available next to the status to allow the customer to manually check for status updates without reloading the page.

### Acceptance Criteria

| # | Criteria | Details |
|---|---------|---------|
| AC-1 | Status badges | Application status MUST be displayed as a color-coded badge in the Status column, strictly following the status table below. |
| AC-2 | Status refresh icon | A refresh icon MUST be displayed next to the status badge in the My Applications table. On click, it MUST animate (spin) and call the status API to fetch the latest status. |
| AC-\
| Badge update on refresh | After a successful status  refresh, the badge MUST update to reflect the new status with the correct color as per the status table. |22222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222 AC-4 | Status-triggered actions | When a status refresh results in a specific actionable status, the appropriate flow MUST be triggered: "In Review" → show In Review modal; "In Manual Review" → show Manual Review modal; "Pending Agreements Signing" → launch Agreement Signing flow. |\
| AC-5 | Non-actionable statuses | For terminal or 
\

]\]
\
\











\
\
\-actionable statuses (Drawdown Enabled, Application Declined, Offer Declined, Application Withdrawn), the refresh icon may be hidden or disabled. |
| AC-6 | Error handling | If the status API call fails, display a subtle error toast/notification and retain the last known status. Do not change the badge on failure. |

### Customer-Facing Application Status Table

| Customer Status | Badge Color | Description |
|----------------|-------------|-------------|
| In Progress | Amber | Application in progress |
| Application Submitted | Blue | Application submitted, awaiting banker to begin review |
| In Review | Blue | Application is being reviewed by the bank (covers multiple internal stages) |
| In Manual Review | Blue | Application is under STP evaluation |
| Pending Agreements Signing | Amber | Agreements generated, awaiting customer e-signature via DocuSign |
| Pending Security Cheque | Amber | Agreements signed, awaiting security cheque upload and approval (non-STP only) |
| Drawdown Enabled | Green | Credit limit is active, supply chain dashboard unlocked |
| Application Declined | Red | Application has been declined |
| Offer Declined | Red | Offer was declined after approval |
| Application Withdrawn | Gray | Application has been withdrawn |

### Banker-to-Customer Status Mapping

The following table shows how each banker portal status maps to the customer-facing status. This mapping is implemented on the backend — the customer portal only consumes the mapped customer status.

| Banker Status | Stage | POC (Banker) | Customer Status |
|--------------|-------|--------------|-----------------|
| STP In Progress | Operations | Fulfillment Ops | In Review |
| Requesting Document | Operations | Fulfillment Ops | In Manual Review |
| In Review - Cred Ops | Operations | Cred Ops | In Manual Review |
| Compliance Screening | Compliance | CVV | In Manual Review |
| In Review - UW | Underwriting | UW | In Manual Review |
| In Review - SW | Underwriting | SUW | In Manual Review |
| In Review - CRO | Underwriting | CRO | In Manual Review |
| CRO Approved | Underwriting | Fraud Manager | In Manual Review |
| Fin. Agreement Signing Pending | Approvals | Loan Ops | Pending Agreements Signing |
| Fin. Agreement Signing Done | Approvals | Loan Ops | Pending Agreements Signing |
| Loan Agreement Signing Pending | Approvals | Loan Ops | Pending Agreements Signing |
| Loan Agreement Signing Done | Approvals | Loan Ops | Pending Agreements Signing |
| DDF Signing Pending | Approvals | Loan Ops | Pending Agreements Signing |
| DDF Signing Done | Approvals | Loan Ops | Pending Agreements Signing |
| Pending Security Cheque | Drawdown Approvals | Loan Ops | Pending Security Cheque |
| Drawdown Enabled | Drawdown Approvals | Loan Ops | Drawdown Enabled |
| Additional Info Requested | Operations | UW | In Review |
| On Hold | Other Dispositions | — | In Review |
| Application Withdrawn | Other Dispositions | — | Application Withdrawn |
| Credit Modification - Loan Ops | Operations | Loan Ops | In Review |
| Credit Modification - UW | Underwriting | UW | In Review |
| UW Declined | Rejections | SUW | Application Declined |
| Declined | Rejections | — | Application Declined |
| SME Declined | Rejections | Loan Ops | Offer Declined |
| Compliance EDD Declined | Rejections | Loan Ops | Application Declined |
| Fraud Declined | Rejections | Loan Ops | Application Declined |
| Sent to Servicing | Servicing | — | (not displayed to customer) |

### Technical Notes

- The backend API should return the mapped customer-facing status (not the internal banker status).
- Badge color logic should be implemented as a utility/mapping function that takes a status string and returns the corresponding color class.
- The refresh mechanism (polling vs. manual vs. WebSocket) is at the developer's discretion.
- Status transitions that trigger modals/flows should reuse the same modal components from Story 1.

---

## Out of Scope

- Agreement Signing flow (covered in separate epic)
- Backend banker portal status management
- Push notifications / email notifications (backend responsibility)
- Security Cheque upload flow

## Dependencies

- Status API endpoint (backend team)
- Agreement Signing flow epic (for "Pending Agreements Signing" transition)
- Application submission flow (prerequisite — application must be submitted first)

## Definition of Done

- [ ] In Review modal displays correctly on portal access when status is "In Review"
- [ ] Status refresh works on both the modal and the My Applications table
- [ ] Manual Review modal displays when status transitions to "In Manual Review"
- [ ] Agreement Signing flow launches when status transitions to "Pending Agreements Signing"
- [ ] All status badges use correct colors per the status table
- [ ] Close/Understood actions navigate to My Applications page
- [ ] Status mapping from banker statuses is correctly implemented on backend
- [ ] Error handling for failed status API calls
- [ ] Responsive design (mobile and desktop)
- [ ] Accessibility (screen reader support, keyboard navigation for modals)
