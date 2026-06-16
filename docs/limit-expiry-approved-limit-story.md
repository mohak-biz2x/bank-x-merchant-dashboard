# User Story: Add Approved Limit & Limit Expiry Columns to My Applications Table

## Story

**As a** merchant using the customer portal,  
**I want to** see the Approved Limit and Limit Expiry columns in the My Applications table,  
**So that** I can quickly view my approved credit limit and its expiry date without navigating to application details.

## Background

These columns were previously removed from the My Applications table due to mapping issues. They need to be re-added with the correct data mapping from the CAM (Credit Assessment Memo) system.

## Design Reference

- **HTML Prototype (Applications Table)**: `docs/applications.html`
- **HTML Prototype (Processing Screen)**: `docs/post-submission-processing-screen.html`

### GitHub Preview URLs

- **Applications Table**: https://htmlpreview.github.io/?https://github.com/mohak-biz2x/bank-x-merchant-dashboard/blob/feature/limit-expiry-approved-limit/docs/applications.html
- **Processing Screen**: https://htmlpreview.github.io/?https://github.com/mohak-biz2x/bank-x-merchant-dashboard/blob/feature/limit-expiry-approved-limit/docs/post-submission-processing-screen.html

---

## Data Mapping

### Approved Limit

| Field | Source |
|-------|--------|
| **Column Header** | Approved Limit |
| **Value** | `CAM → Facility Information → Approved Limit` |
| **Format** | Currency with thousands separator (e.g., "AED 500,000") |
| **Fallback** | Display "-" when CAM is not yet submitted |

### Limit Expiry

| Field | Source |
|-------|--------|
| **Column Header** | Limit Expiry |
| **Value** | `Latest Decision Date` + `CAM → Facility Information → Tenure (in days)` |
| **Calculation** | `limitExpiryDate = latestDecisionDate + tenure (days)` |
| **Format** | Date format (e.g., "15 Sep 2026") |
| **Fallback** | Display "-" when CAM is not yet submitted |

---

## Acceptance Criteria

| # | Criteria | Details |
|---|---------|---------|
| AC-1 | Approved Limit column added | The "Approved Limit" column MUST be displayed in the My Applications table after the "Status" column. |
| AC-2 | Limit Expiry column added | The "Limit Expiry" column MUST be displayed in the My Applications table after the "Approved Limit" column. |
| AC-3 | Correct Approved Limit mapping | Value MUST be sourced from `CAM → Facility Information → Approved Limit` and displayed as formatted currency (e.g., "AED 500,000"). |
| AC-4 | Correct Limit Expiry mapping | Value MUST be calculated as `Latest Decision Date + CAM → Facility Information → Tenure (in days)` and displayed as a formatted date (e.g., "15 Sep 2026"). |
| AC-5 | Pre-CAM fallback | When the CAM has NOT been submitted (CAM data unavailable), both columns MUST display "-" (dash). |
| AC-6 | Column width auto-adjustable | Column widths MUST auto-adjust based on their content. No fixed widths — columns should expand or contract naturally to fit the data they contain. |
| AC-7 | Status badge no-break | The status badge text MUST NOT break or wrap to multiple lines. The badge MUST use `white-space: nowrap` to ensure the full status label stays on a single line regardless of table width. |
| AC-8 | Final column order | Application Id → Product → Business Name → Status → Approved Limit → Limit Expiry → Documents → Dashboard → Action. |
| AC-9 | Table responsive | If the combined column content exceeds the available table width, the table MUST allow horizontal scroll rather than breaking column layouts. |

---

## When to Show "-" (Dash)

Both "Approved Limit" and "Limit Expiry" display "-" when ANY of the following conditions are true:

- Application status is before CAM submission (e.g., In Progress, Application Submitted, In Review, In Manual Review)
- CAM data object is null/undefined
- Facility Information section is missing from CAM
- Approved Limit field is not populated (for Approved Limit column)
- Tenure field is not populated (for Limit Expiry column)
- Latest Decision Date is not available (for Limit Expiry column)

---

## UI Specifications

| Property | Value |
|----------|-------|
| Table border | `0.5px solid #373A56` |
| Table border radius | `12px` |
| Table header background | `#36394F` |
| Table content background | `#2D304A` |
| Column width strategy | Auto-adjust (no fixed widths) |
| Status badge | `white-space: nowrap` (no line break) |
| Currency format | AED with thousands separator |
| Date format | DD MMM YYYY (e.g., "15 Sep 2026") |

---

## Technical Notes

- Column widths should use CSS `width: auto` or no explicit width — the browser's table layout algorithm handles distribution based on content.
- The status badge must have `white-space: nowrap` applied to prevent the badge label from wrapping when the table is narrow.
- Currency formatting should use locale-aware formatting with AED prefix and thousands separators.
- Date calculation: add tenure (integer days) to the latest decision date to compute the expiry date.
- Handle edge cases gracefully — if any source field is missing or malformed, default to "-".

---

## Definition of Done

- [ ] "Approved Limit" column added to My Applications table with correct mapping
- [ ] "Limit Expiry" column added to My Applications table with correct calculation
- [ ] Both columns display "-" when CAM is not submitted
- [ ] Column widths auto-adjust based on content (no fixed widths)
- [ ] Status badge never breaks to multiple lines
- [ ] Currency displayed as "AED X,XXX" format
- [ ] Date displayed as "DD MMM YYYY" format
- [ ] Table remains usable and readable across different viewport sizes
- [ ] HTML prototypes updated and verified (`applications.html`, `post-submission-processing-screen.html`)
