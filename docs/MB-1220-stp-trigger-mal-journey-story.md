# Story: STP Trigger via Mal Internal Journey Submission (Biz2x Create Application API)

## Epic: MB-1220

## Story Summary

**As a** system,
**I want to** trigger the STP process (BSA, FSA, System Recommendation rules, STP rules, and STP decision) upon application submission through the Mal Internal journey via the Biz2x Create Application API,
**So that** the STP pipeline is initiated from the Mal-owned submission flow instead of the Biz2x journey submission, enabling full control over the STP trigger point and immediate status visibility on the Banker Portal.

---

## Business Context

Currently, the STP process (BSA, FSA, System Recommendation, STP rules evaluation) is triggered when an application is submitted through the Biz2x customer journey. With the migration to the Mal Internal journey, the trigger point for these automations needs to shift to the Mal journey's submission call to the Biz2x Create Application API.

Upon successful application creation via the API, the Banker Portal application status should immediately update to **"STP In Progress"**, and the following automated steps should begin executing:

1. **BSA (Bank Statement Analysis)** — Parse and analyse uploaded bank statements
2. **FSA (Financial Statement Analysis)** — Analyse uploaded financial documents
3. **System Recommendation Rules** — Evaluate combined BSA + FSA results to produce a system recommendation (Approve / Reject / Refer)
4. **STP Rules** — If System Recommendation = Approve, evaluate product-specific STP thresholds
5. **STP Process** — Route application based on STP rules outcome (STP Approved → auto-approval flow; STP Not Approved → manual review flow)

---

## Current Behaviour (Biz2x Journey)

- Customer completes and submits application via Biz2x customer journey
- Biz2x triggers BSA, FSA, System Recommendation, and STP as part of its internal post-submission pipeline
- Banker Portal status updates to "STP In Progress" after Biz2x triggers the process
- The Mal platform has no control over when or how these automations are initiated

## Target Behaviour (Mal Internal Journey)

- Customer completes and submits application via the Mal Internal journey
- Mal backend calls the **Biz2x Create Application API** to create the application record
- Immediately upon successful API response, Mal triggers the STP pipeline:
  - Application status on Banker Portal updates to **"STP In Progress"**
  - BSA is triggered
  - FSA is triggered
  - System Recommendation rules are queued to execute after BSA + FSA complete
  - STP rules are queued to execute after System Recommendation completes (if recommendation = Approve)
  - STP process routes the application based on STP rules outcome
- Mal retains full ownership of the trigger lifecycle

---

## Acceptance Criteria

| # | Criteria | Details |
|---|---------|---------|
| AC-1 | STP triggered from Mal journey | On successful application submission via the Mal Internal journey (Biz2x Create Application API call), the STP pipeline MUST be initiated by the Mal backend — NOT by Biz2x's internal post-submission hooks. |
| AC-2 | Immediate status update | The Banker Portal application status MUST update to **"STP In Progress"** immediately upon the Mal backend triggering the STP pipeline (within seconds of API response). |
| AC-3 | BSA triggered | Bank Statement Analysis MUST be triggered as part of the STP pipeline initiation. Uploaded bank statements from the Mal journey are passed to the BSA engine. |
| AC-4 | FSA triggered | Financial Statement Analysis MUST be triggered as part of the STP pipeline initiation. Uploaded financial documents from the Mal journey are passed to the FSA engine. |
| AC-5 | System Recommendation rules execution | System Recommendation rules engine MUST execute after both BSA and FSA complete. The engine evaluates combined results and produces a recommendation (Approve / Reject / Refer). |
| AC-6 | STP rules execution | If System Recommendation = "Approve", the STP rules engine MUST be triggered automatically. STP rules evaluate against product-specific thresholds (Receivable or Payable financing). |
| AC-7 | STP process routing | Based on STP rules outcome: (a) STP Approved → application proceeds to auto-approval flow (CRO Approved, agreement generation, etc.); (b) STP Not Approved → application assigned to Document Ops / manual review. |
| AC-8 | Biz2x trigger disabled | The existing Biz2x-triggered STP pipeline (triggered on Biz2x journey submission) MUST be disabled/bypassed for applications submitted through the Mal Internal journey. Biz2x should only act as the application data store via its Create Application API. |
| AC-9 | Customer-facing status | Customer-facing status should show **"In Review"** while STP is in progress (per existing banker-to-customer status mapping: "STP In Progress" → "In Review"). |
| AC-10 | Error handling | If the STP pipeline trigger fails after successful application creation, the system MUST retry once. On second failure, the application should be assigned to Fulfillment Ops for manual processing, and an alert/notification should be raised. |
| AC-11 | Audit logging | All STP pipeline trigger events (initiation, step completions, failures) MUST be logged with timestamps for traceability. |
| AC-12 | No impact on Biz2x-only applications | Applications submitted directly through the Biz2x journey (if any remain active) MUST continue to use the existing Biz2x-triggered STP flow without disruption. |

---

## Technical Notes

- **API Integration**: The Mal backend calls the Biz2x Create Application API to create the application. After receiving a successful response (application ID created), the Mal backend independently triggers the STP pipeline.
- **Decoupling**: The STP trigger is decoupled from Biz2x's internal submission events. Biz2x serves only as the application data layer; orchestration is owned by Mal.
- **Parallel Execution**: BSA and FSA should be triggered in parallel to minimise processing time.
- **Sequential Dependency**: System Recommendation → STP Rules → STP Process must execute sequentially (each depends on the prior step's output).
- **Status Mapping**: "STP In Progress" is an internal banker status. Customer-facing status maps to "In Review" as per the existing status mapping table (ref: MB-35).
- **Idempotency**: The STP trigger mechanism should be idempotent — re-triggering for the same application should not create duplicate BSA/FSA runs.

---

## Process Flow

```
Mal Internal Journey (Customer Submits)
    |
    v
Mal Backend → Biz2x Create Application API
    |
    | (success response)
    v
Mal Backend triggers STP Pipeline
    |
    ├── Banker Portal Status → "STP In Progress"
    |
    ├── BSA (Bank Statement Analysis) ─────────┐
    |                                           |
    ├── FSA (Financial Statement Analysis) ────┤
    |                                           |
    v                                           v
    [Wait for both BSA + FSA to complete]
    |
    v
System Recommendation Rules Engine
    |
    ├── Recommendation = "Approve"
    |       |
    |       v
    |   STP Rules Engine (product-specific thresholds)
    |       |
    |       ├── STP Pass → Auto-Approval Flow (CRO Approved)
    |       └── STP Fail → Assign to Document Ops (Manual Review)
    |
    ├── Recommendation = "Reject" → Assign to Fulfillment Ops
    └── Recommendation = "Refer"  → Assign to Fulfillment Ops
```

---

## Dependencies

| Dependency | Owner | Status |
|-----------|-------|--------|
| Biz2x Create Application API availability | Biz2x / Integration Team | Required |
| BSA engine API / trigger mechanism | Data & Analytics Team | Required |
| FSA engine API / trigger mechanism | Data & Analytics Team | Required |
| System Recommendation rules engine | Rules / Underwriting Team | Required |
| STP rules engine (product-specific thresholds) | Rules / Underwriting Team | Required |
| Mal Internal journey submission flow | Mal Frontend Team | Required |
| Banker Portal status update mechanism | Banker Portal Team | Required |
| Disable Biz2x-triggered STP for Mal applications | Biz2x / Integration Team | Required |

---

## Out of Scope

- STP threshold parameter changes (covered in separate STP configuration stories)
- Agreement generation and e-signing post-STP approval (covered in existing STP module stories)
- Biz2x customer journey decommissioning (separate initiative)
- BSA/FSA engine logic changes (engines remain unchanged; only the trigger point changes)
- Pricing automation (runs separately, not part of this trigger change)

---

## Definition of Done

- [ ] Mal backend triggers STP pipeline on successful Biz2x Create Application API call
- [ ] Banker Portal immediately shows "STP In Progress" status
- [ ] BSA and FSA are triggered in parallel from Mal backend
- [ ] System Recommendation rules execute after BSA + FSA complete
- [ ] STP rules execute after System Recommendation = Approve
- [ ] Application is routed correctly based on STP outcome
- [ ] Biz2x internal STP trigger is disabled for Mal-submitted applications
- [ ] Error handling and retry logic implemented
- [ ] Audit logs capture all STP pipeline events with timestamps
- [ ] Existing Biz2x-only applications are unaffected
- [ ] End-to-end tested with Mal Internal journey submission
