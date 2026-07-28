# Epic: STP (Straight-Through Processing) Module

## Epic Summary

Enable automated end-to-end processing of financing applications that meet predefined eligibility criteria, eliminating manual intervention from submission to drawdown. The system evaluates applications against System Recommendation rules and product-specific STP thresholds, and for qualifying applications, automatically approves, generates agreements, sends for e-signing, and activates the financing facility upon completion.

## Business Context

Currently, all applications go through manual review by Document Ops, Credit Ops, Underwriting, and Loan Ops teams. For low-risk applications that meet strict eligibility criteria, this manual process adds unnecessary turnaround time. STP enables instant approval and activation for qualifying merchants, reducing time-to-drawdown from days to minutes.

## Workflow Reference

- **FigJam Diagram**: [STP Module - Post-Submission Workflow](https://www.figma.com/online-whiteboard/create-diagram/42cc8621-5605-4e42-aaaf-13be3dbecf37?utm_source=other&utm_content=edit_in_figjam&oai_id=&request_id=94d2ccef-d307-4e72-b042-24700ef3ef97)

## STP Eligibility Thresholds

### Receivable Financing

| Parameter | STP Pass Threshold |
|---|---|
| AECB Bureau Score — Entity | ≥ 600 |
| AECB Bureau Score — Primary UBO | ≥ 700 |
| Operating History | ≥ 24 months |
| Annualised Revenue | ≥ AED 5,000,000 |
| Average Monthly Bank Balance (6M) | ≥ AED 75,000 |
| Invoice Amount (per transaction) | ≤ AED 100,000 |
| Invoice Age at Submission | ≤ 30 days from invoice date |
| Invoice Maturity Date | ≤ 90 days from upload |
| Industry Classification | Not in Sharia restricted or elevated-risk list |
| AML / Sanctions Screening | All parties clear (entity, UBOs, buyer) |
| Verified IBAN | Active UAE business bank account in entity's name |

### Payable Financing

| Parameter | STP Pass Threshold |
|---|---|
| Buyer AECB Bureau Score — Entity | ≥ 680 |
| Buyer Operating History | ≥ 36 months |
| Buyer Annualised Revenue | ≥ AED 10,000,000 |
| Buyer Average Monthly Balance (6M) | ≥ AED 75,000 |
| Buyer DSCR (proxy from bank statement) | ≥ 1.30x |
| Invoice Amount (per transaction) | ≤ AED 100,000 |
| Total Programme Facility Limit | ≤ AED 150,000 |
| Invoice Maturity Date | ≤ 90 days from invoice date |
| Supplier KYB Status | All enrolled suppliers verified |
| Direct Debit Mandate | Executed prior to first submission |
| AML / Sanctions Screening | All parties clear |
| Verified IBAN | Active UAE business bank account in entity's name |

---

## User Stories

---

### Story 1: System Recommendation & STP Rules Evaluation

**As a** system,
**I want to** automatically evaluate submitted applications against System Recommendation rules and (if passed) product-specific STP rules,
**So that** qualifying applications can be instantly approved without manual intervention.

#### Description

On application submission, the system triggers bank statement analysis, financial statement analysis, and automated credit pull in parallel. Once all three complete, the System Recommendation rules engine evaluates the combined results. If the System Recommendation result is "Approve," the STP rules engine runs with the applicable product-specific thresholds (Receivable or Payable financing).

#### Acceptance Criteria

- [ ] On application submission, bank statement analysis, financial statement analysis, and automated credit pull are triggered in parallel
- [ ] System Recommendation rules engine executes only after all three analyses complete
- [ ] If System Recommendation result is "Approve," STP rules engine is triggered automatically
- [ ] STP rules engine evaluates against Receivable Financing thresholds if product type is Receivable
- [ ] STP rules engine evaluates against Payable Financing thresholds if product type is Payable
- [ ] All STP threshold parameters must pass for the application to be STP-approved
- [ ] If any single STP parameter fails, the application is not STP-approved
- [ ] STP evaluation result (pass/fail with individual parameter results) is logged for audit

#### Technical Notes

- System Recommendation and STP are two distinct rule engines running sequentially
- A merchant cannot apply for both products simultaneously — only one product type per application
- STP rules are product-specific; the applicable rule set is determined by the `selected_product` on the application

---

### Story 2: STP Decision Routing & Auto-Approval

**As a** system,
**I want to** automatically route applications based on System Recommendation and STP results — approving qualifying applications with preset limit/expiry or assigning non-qualifying ones to Document Ops,
**So that** the correct workflow is triggered without manual triage.

#### Description

When System Recommendation result is not "Approve," or when STP rules fail, the application is assigned to Document Ops and follows the existing normal workflow. When STP rules pass, the application is automatically updated to "CRO Approved" status, assigned a fixed available limit of AED 100,000, limit expiry of 1 year from submission date, and assigned to LoanOps.

#### Acceptance Criteria

- [ ] If System Recommendation result is NOT "Approve" → application is assigned to Document Ops
- [ ] If STP rules result is NOT "Approve" → application is assigned to Document Ops
- [ ] Applications assigned to Document Ops follow the existing normal workflow (no STP-specific handling)
- [ ] If STP rules pass → application status is updated to "CRO Approved"
- [ ] If STP rules pass → available limit is set to AED 100,000 (fixed, regardless of product type)
- [ ] If STP rules pass → limit expiry is set to exactly 1 year from the application submission date
- [ ] If STP rules pass → application is assigned to LoanOps role
- [ ] Status transition from submission to CRO Approved happens without any manual intervention
- [ ] Customer-facing status transitions directly to "Pending Agreements Signing" (skips "In Review")

#### Technical Notes

- LoanOps is a preconfigured role in the system with existing permissions
- The AED 100,000 limit is fixed for all STP approvals regardless of product type
- Pricing is handled at invoice group level (not part of this story)
- An STP-approved application cannot be reversed/declined after CRO Approved status

---

### Story 3: Agreement Auto-Generation & Send for E-Sign

**As a** system,
**I want to** automatically generate the applicable agreements and send them to the customer for e-signing after STP approval,
**So that** the customer can sign agreements immediately without waiting for manual banker action.

#### Description

After STP approval (status = CRO Approved), the system auto-generates 3 agreements based on product type: On-sale Agreement, Master Purchase Agreement (Receivable) or Murabaha Agreement (Payable), and DDS Agreement. On successful generation, agreements are sent to the customer for e-signing on the customer portal in sequential order. If generation fails, the system retries once. On second failure, an email is sent to the assigned banker requesting manual retry.

#### Acceptance Criteria

- [ ] Agreement generation is triggered automatically when application status becomes "CRO Approved" via STP
- [ ] For Receivable Financing: On-sale Agreement, Master Purchase Agreement, and DDS Agreement are generated
- [ ] For Payable Financing: On-sale Agreement, Murabaha Agreement, and DDS Agreement are generated
- [ ] On successful generation, all 3 agreements are sent to the customer for e-signing
- [ ] Agreements are presented to the customer in sequential order (On-sale → Master Purchase/Murabaha → DDS)
- [ ] If agreement generation fails on first attempt, system automatically retries (attempt 2)
- [ ] If second attempt also fails, an email is sent to the assigned LoanOps banker with:
  - Application ID
  - Failure reason
  - Request to manually retry agreement generation
- [ ] No more than 2 automatic retry attempts are made
- [ ] Agreement generation setup/templates are handled by a separate epic (dependency)

#### Dependencies

- Agreement template setup and configuration (separate epic)

#### Technical Notes

- The signing mechanism is the same as non-STP flow (no difference)
- Agreement generation is triggered by a system event on status change, not a manual action

---

### Story 4: Customer Agreement Signing & Auto-Drawdown

**As a** customer (merchant),
**I want to** sign the 3 required agreements on the customer portal in sequence and have my financing facility automatically activated upon completion,
**So that** I can start using my financing facility immediately after signing.

#### Description

The customer is presented with 3 agreements in a fixed sequential order on the customer portal. Each agreement must be signed before the next becomes available. The signing mechanism is the same as the non-STP flow (3-step workflow without the security cheque step). Once all 3 agreements are signed, the application status is automatically updated to "Drawdown" and the customer is redirected to the supply chain dashboard with their active limit displayed.

#### Acceptance Criteria

- [ ] Customer portal shows 3 agreements in sequential order: On-sale → Master Purchase/Murabaha → DDS
- [ ] Agreement 2 is only available for signing after Agreement 1 is signed
- [ ] Agreement 3 is only available for signing after Agreement 2 is signed
- [ ] Signing mechanism is identical to non-STP agreement signing flow
- [ ] Once all 3 agreements are signed, application status is automatically updated to "Drawdown"
- [ ] Status transition to Drawdown happens immediately (skips intermediate banker statuses like "Offer Signing Done," "Murabaha Signing Done," "DDF Signing Done")
- [ ] After Drawdown status, customer is redirected to the supply chain dashboard
- [ ] Dashboard displays the approved limit (AED 100,000) and limit expiry date
- [ ] No security cheque step is required for STP flow

#### Technical Notes

- The 3-step signing workflow is similar to the existing security onboarding workflow minus the 4th step (security cheque)
- Customer-facing status remains "Pending Agreements Signing" throughout the signing process until Drawdown

---

### Story 5: Daily Reminder Emails for Pending Signatures

**As a** system,
**I want to** send daily reminder emails to the assigned banker when agreements remain unsigned for more than 24 hours,
**So that** the banker can follow up with the customer and ensure timely completion.

#### Description

If the customer has not completed signing all 3 agreements within 24 hours of the agreements being sent for e-sign, the system sends a daily reminder email to the assigned LoanOps banker. The reminder continues daily until the customer completes all signatures.

#### Acceptance Criteria

- [ ] No reminder is sent within the first 24 hours of agreements being sent for e-sign
- [ ] After 24 hours of agreements pending e-sign, a reminder email is sent to the assigned LoanOps banker
- [ ] Reminder email includes: Application ID, customer name, time elapsed since agreements were sent, which agreements are still pending
- [ ] Reminder emails are sent daily (every 24 hours) until all agreements are signed
- [ ] Once all agreements are signed, no further reminder emails are sent
- [ ] Reminder emails stop if the application is cancelled or withdrawn for any reason

---

### Story 6: Customer Status Mapping for STP Flow

**As a** customer (merchant),
**I want to** see accurate status updates on my application throughout the STP process,
**So that** I know exactly where my application stands at all times.

#### Description

For STP-approved applications, the customer-facing status should reflect the accelerated processing. Since no manual review occurs, the status should transition directly from "Application Submitted" to "Pending Agreements Signing" (skipping "In Review"). After all agreements are signed, status transitions to "Drawdown."

#### Acceptance Criteria

- [ ] On submission, customer-facing status shows "Application Submitted" (Blue badge)
- [ ] After STP approval and agreements sent, status transitions directly to "Pending Agreements Signing" (Amber badge)
- [ ] "In Review" status is never shown for STP-approved applications
- [ ] After all agreements signed, status transitions to "Drawdown" (Green badge)
- [ ] Status badge colors follow existing conventions: Blue (Submitted), Amber (Pending Agreements Signing), Green (Drawdown)
- [ ] The My Applications page displays the approved limit (AED 100,000) and expiry date after Drawdown status
- [ ] Status transitions are consistent with the banker-to-customer status mapping defined in MB-35

#### Reference

- MB-35: My Applications - Application List & Status Tracking (status mapping table)

---

## Story Dependencies

```
Story 1 (Rules Evaluation)
    ↓
Story 2 (Decision Routing & Auto-Approval)
    ↓
Story 3 (Agreement Generation & Send for E-Sign)  ← Depends on Agreement Setup Epic
    ↓
Story 4 (Customer Signing & Auto-Drawdown)
    ↓
Story 5 (Reminder Emails) — runs in parallel with Story 4
Story 6 (Status Mapping) — cross-cutting, applies to all stories
```

## Out of Scope

- Agreement template setup and configuration (separate epic)
- Document Ops manual review workflow (already exists in banker portal)
- Pricing/margin assignment (handled at invoice group level)
- LoanOps role permissions setup (already configured)
- Multiple applications per merchant (not supported in Phase 1)
