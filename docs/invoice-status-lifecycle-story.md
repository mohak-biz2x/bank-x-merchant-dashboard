# User Story: Invoice Group Status Lifecycle

**Epic:** MB-218 — Invoice Module  
**Story ID:** MB-XX

---

**As a** customer or banker managing invoice financing requests,  
**I want** invoice groups to progress through a defined set of statuses with appropriate actions at each stage,  
**So that** the financing lifecycle is transparent and each party knows what action (if any) is required.

---

## Status Lifecycle

```
Draft
  └─► Verification In Progress
        ├─► Manual Verification Pending  (≥1 invoice flagged or rejected)
        │     ├─► Executing Murabaha Contract  (≥1 approved, none pending/refer)
        │     └─► Rejected  (all invoices rejected)
        └─► Executing Murabaha Contract  (all invoices auto-approved)
              └─► Sent to LMS
                    └─► Pending Disbursal
                          └─► Disbursed
```

`Rejected` and `Disbursed` are terminal statuses.

---

## Status Reference

| Status | Badge | Triggered By | Customer Action | Banker Action |
|--------|-------|-------------|-----------------|---------------|
| Draft | Gray | Customer creates group | **Delete** (confirmation modal) | — |
| Verification In Progress | Blue | Customer submits group | — | — |
| Manual Verification Pending | Amber | Rule engine flags/rejects ≥1 invoice | — | **Mark Verification Complete** (3-dot menu) |
| Executing Murabaha Contract | Amber | Auto — all approved, or banker marks complete with ≥1 approved | — | — |
| Sent to LMS | Green | DMCC execution completes | — | — |
| Pending Disbursal | Green | LMS maker action | — | — |
| Disbursed | Emerald | LMS disbursal callback | — | — |
| Rejected | Red | Banker marks complete with all invoices rejected | — | — |

---

## Behaviour Details

### Draft — Delete
- Customer portal shows a **Delete** action on Draft groups.
- Clicking Delete opens a confirmation modal: *"Are you sure you want to delete this invoice group? This action cannot be undone."* with **Cancel** and **Delete** (destructive) buttons.
- Confirmed deletion permanently removes the group.

### Manual Verification Pending — Mark Verification Complete
- Banker action available in the **3-dot menu** only for this status.
- On click, the system evaluates all invoices in the group:

| Invoice State | Outcome |
|---------------|---------|
| Any invoice still `Refer` or `Pending` | ❌ Toaster error: *"Please complete verification for all invoices before proceeding."* Status unchanged. |
| All reviewed — all `Rejected` | Group → `Rejected` |
| All reviewed — ≥1 `Approved`, none `Refer`/`Pending` | Murabaha contract executed for approved invoices → Group → `Executing Murabaha Contract` → auto-sent to LMS |

- Toaster auto-dismisses after 5 seconds.
- Rejected invoices are excluded from contract execution.

### Executing Murabaha Contract
- Fully automated — DMCC APIs execute the contract and trigger LMS send.
- No customer or banker action required.

### Sent to LMS → Pending Disbursal → Disbursed
- All automated transitions driven by LMS callbacks.
- No customer or banker action at any of these stages.

---

## Acceptance Criteria

- [ ] **Draft:** Delete action visible only for `Draft` groups; confirmation modal shown before deletion
- [ ] **Verification In Progress:** Status set on submission; no actions available; auto-transitions on rule engine completion
- [ ] **Manual Verification Pending:** "Mark Verification Complete" in banker 3-dot menu only for this status
- [ ] **Mark Verification Complete — incomplete:** Toaster error shown; status unchanged
- [ ] **Mark Verification Complete — all rejected:** Group transitions to `Rejected`
- [ ] **Mark Verification Complete — ≥1 approved:** Murabaha contract executed for approved invoices; group transitions to `Executing Murabaha Contract`; auto-sent to LMS
- [ ] **Executing Murabaha Contract:** Fully automated; transitions to `Sent to LMS` on DMCC completion
- [ ] **Sent to LMS → Pending Disbursal → Disbursed:** All driven by LMS callbacks; no manual actions
- [ ] `Rejected` and `Disbursed` are terminal — no further transitions
- [ ] Badge colours match the Status Reference table above

---

## Out of Scope
- Email notifications for status transitions (MB-53)
- Individual invoice-level status management (MB-44, MB-52)
- Pricing and fee calculation (separate story)
- No prototype changes required
