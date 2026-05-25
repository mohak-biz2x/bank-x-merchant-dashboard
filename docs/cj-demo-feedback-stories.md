# CJ Demo Feedback — User Stories

---

## Story 1: Improve Loan Applications Table UI

**As a** customer viewing the "Your Loan Applications" page,
**I want** the table to have a cleaner, more polished look and feel,
**So that** the information is easy to scan and the page feels professional.

---

### Issues Identified (from current screenshot)

* Table header row has inconsistent text alignment and capitalization (e.g., "APPLICATION ID" vs "BUSINESS NAME")
* Column widths are not optimized — some columns (RM, Limit Expiry) have too much space while others (Status, Product) are cramped
* Pagination controls styling doesn't match the Mal dark theme
* "Documents" dropdown trigger looks like plain text rather than an actionable element

### Changes Required

* Standardize header text to sentence case with consistent font weight
* Optimize column widths proportionally based on content
* Style pagination controls to match Mal dark theme
* Make "Documents" dropdown visually distinct as a clickable element (icon + underline or chip style)

### Acceptance Criteria

- [ ] Table headers use consistent casing and font weight
- [ ] Column widths are proportional to content
- [ ] Pagination controls match dark theme
- [ ] "Documents" element is clearly interactive
- [ ] Table is responsive and doesn't overflow on standard screen widths

---

## Story 2: "Go to Dashboard" Button — Enable Only for Drawdown Status

**As a** customer on the My Applications page,
**I want** the "Go to Dashboard" button to only be enabled when my application is in Drawdown status,
**So that** I don't get confused by a clickable button that leads nowhere for in-progress applications.

---

### Behavior

* "Go to Dashboard" button/link is **enabled** (clickable, full opacity) only when application status = "Drawdown"
* For all other statuses (Application Submitted, In Review, Pending Security Cheque, etc.), the button should be **disabled** (grayed out, not clickable)
* Disabled state should show a tooltip on hover: "Dashboard available after approval"

### Acceptance Criteria

- [ ] "Go to Dashboard" enabled only for applications with status "Drawdown"
- [ ] Disabled state is visually distinct (grayed out / reduced opacity)
- [ ] Disabled button is not clickable
- [ ] Tooltip shown on hover of disabled button explaining why it's unavailable
- [ ] Clicking enabled button navigates to the correct dashboard (Receivable/Payable)

---

## Story 3: Remove "Powered by Biz2X" from Footer

**As a** product owner,
**I want** the "Powered by Biz2X" branding removed from the footer across all customer-facing pages,
**So that** the platform appears fully white-labeled under the Mal brand.

---

### Scope

* Remove from all pages: Login, Customer Journey, My Applications, Dashboard (Receivable & Payable), Suppliers, Invoices
* Footer should only show: "Privacy policy | Disclaimer | Terms & conditions" on the left and "© Mal 2026. All rights reserved" on the right

### Acceptance Criteria

- [ ] "Powered by Biz2X" logo and text removed from all customer-facing pages
- [ ] Footer layout adjusted to fill the space cleanly
- [ ] No broken layout or empty gaps where the branding was

---

## Story 4: Make `required_loan_amount` and `tenure` Non-Required in Application API

**As a** developer integrating with the application API,
**I want** `required_loan_amount` and `tenure` to be optional fields in the API request,
**So that** applications can be submitted without these values when they are not yet determined.

---

### API Endpoint

`POST https://api-middleware-malbank-los-stage.b2cdev.com/api/v1/application`

### Changes Required

* Remove `required_loan_amount` from required field validation
* Remove `tenure` from required field validation
* Both fields should still be accepted if provided (optional, not removed)
* API should not return 400/422 if these fields are missing from the payload

### Acceptance Criteria

- [ ] API accepts application creation without `required_loan_amount`
- [ ] API accepts application creation without `tenure`
- [ ] Both fields still work correctly when provided
- [ ] No regression in existing flows that do provide these fields
- [ ] API documentation/swagger updated to reflect optional status

---

## Story 5: Load Customer Journey Images via CDN

**As a** customer going through the customer journey,
**I want** images to load quickly,
**So that** the experience feels smooth and professional without long loading delays.

---

### Context

Currently, images in the customer journey are loaded directly which causes slow load times. All images should be served through a CDN for faster delivery.

### Changes Required

* Identify all images used in the customer journey screens
* Upload images to CDN (e.g., CloudFront, or existing CDN infrastructure)
* Update image references in the codebase to use CDN URLs
* Ensure proper caching headers are set for optimal performance
* Consider using WebP format with fallbacks for better compression

### Acceptance Criteria

- [ ] All customer journey images served from CDN
- [ ] Image load time reduced significantly (target: < 500ms on standard connection)
- [ ] No broken images after migration
- [ ] Proper cache-control headers set on CDN assets
- [ ] Fallback handling if CDN is unavailable

---

## Story 6: Document Loading Skeleton Tiles — Reduce Count & Match Mal Theme

**As a** customer viewing the Business Documents screen or My Applications documents,
**I want** the loading skeleton tiles to be minimal and match the Mal dark theme,
**So that** the loading state looks clean and consistent with the rest of the UI.

---

### Issues

* Currently too many skeleton tiles are shown during loading (looks cluttered)
* Skeleton tile colors/style don't match the Mal dark theme

### Changes Required

* Reduce the number of skeleton tiles shown during loading to a reasonable count (2-3 max per section)
* Update skeleton tile colors to match Mal dark theme (dark background with subtle shimmer animation using theme-appropriate colors)
* Apply to both:
  * Business Documents screen (customer journey step)
  * My Applications screen (documents column/dropdown)

### Acceptance Criteria

- [ ] Maximum 2-3 skeleton tiles shown per document section during loading
- [ ] Skeleton tile background color matches Mal dark theme
- [ ] Shimmer/pulse animation uses theme-appropriate colors (not default gray)
- [ ] Applied consistently on Business Documents screen and My Applications documents
- [ ] Smooth transition from skeleton to actual content

---

## Story 7: IBAN Verification & Auto-Population via IPID in Bank Account Details

**As a** customer on the Bank Account Details step,
**I want to** enter only my IBAN and have the Bank Name, Account Name, and SWIFT Code auto-populated,
**So that** I don't have to manually look up and enter bank details.

---

### Behavior

* User enters IBAN only (23 characters, UAE format starting with AE)
* User clicks "Verify IBAN" → system calls IPID API to fetch bank details
* Loading state shown: "Fetching bank details..." with spinner
* On success: Bank Name, Account Name, and SWIFT/BIC Code are auto-populated and displayed as read-only
* Green success banner: "IBAN verified — Bank details populated successfully"
* User can click "Change IBAN" to reset all fields and re-enter a different IBAN
* "Continue" button is disabled until IBAN is verified successfully
* On "Continue" click: Account Name is validated against `business_info → business_name`
* If Account Name does not match business name → red toaster error: "Account Name does not match the registered business name. Please verify your IBAN or contact your bank."
* Toaster auto-dismisses after 6 seconds or can be manually closed

### Error Scenarios

| Scenario | Message | Behavior |
|----------|---------|----------|
| IBAN not found in IPID | "We could not find any bank account matching this IBAN. Please check and enter the correct IBAN." | IBAN field remains editable, user can correct and retry |
| IBAN too short (< 23 chars) | "Verify IBAN" button stays disabled | Helper text shown: "Enter your UAE IBAN (23 characters starting with AE) and click Verify to auto-populate bank details" |
| Account Name mismatch on Continue | "Account Name does not match the registered business name. Please verify your IBAN or contact your bank." | Red toaster error, user blocked from proceeding |
| IPID API unavailable | "Unable to verify IBAN at this time. Please try again." | Show retry option |

### UI States

1. **Initial** — Only IBAN input field visible with "Verify IBAN" button (disabled until 23+ chars entered)
2. **Verifying** — Spinner with "Fetching bank details..." message, IBAN field disabled
3. **Verified** — Green banner, Bank Name / Account Name / SWIFT shown as read-only, "Change IBAN" button replaces "Verify IBAN"
4. **Error (not found)** — Red error banner shown above the form, IBAN field remains editable for correction
5. **Validation Error (name mismatch)** — Red toaster shown at top of step, user cannot proceed

### Acceptance Criteria

- [ ] Only IBAN field is editable initially (Bank Name, Account Name, SWIFT hidden until verified)
- [ ] "Verify IBAN" button disabled until IBAN is 23+ characters
- [ ] Loading state shown during verification with spinner
- [ ] On success: Bank Name, Account Name, SWIFT auto-populated as read-only
- [ ] Green success banner displayed after successful verification
- [ ] "Change IBAN" option available to reset and re-verify
- [ ] "Continue" button disabled until IBAN is verified
- [ ] On Continue: Account Name validated against business name from business_info
- [ ] Red toaster error shown if Account Name doesn't match business name (auto-dismiss 6s)
- [ ] Error message shown if IBAN not found in IPID — field remains editable for retry
- [ ] Helper text shown below IBAN field explaining format requirements

---

## Story 8: Match Dashboard UI with Mal Shared Designs

**As a** customer using the financing dashboard,
**I want** the dashboard design elements to match the Mal shared designs,
**So that** the UI looks polished and consistent with the approved visual direction.

---

### Context

The current dashboard (Receivable/Payable) needs visual refinement to match the Mal shared design style. This is a **design-only** update — no new metrics, charts, or features are being added. The top navigation layout stays as-is.

### Changes Required (Visual refinement of existing elements only)

* **Stat cards** (Pending Invoices, Approved Invoices, Suppliers): Add colored accent icons (e.g., orange for pending, green for approved, blue for suppliers) matching Mal design style
* **Credit Limit card**: Update progress bar to use gradient style (green → orange based on utilization), show utilization percentage with color coding
* **Suppliers & Invoices cards**: Refine card styling — rounded corners, subtle border glow, consistent padding and spacing to match Mal design
* **Typography**: Adjust font sizes and weights to match Mal design (card titles, metric values, labels)
* **Navigation**: Keep existing top navigation — do NOT switch to left sidebar

### Out of Scope

* No new metrics or data points (e.g., no Monthly Growth sparkline, no Invoice Aging Analysis chart, no Volume Growth Trend)
* No new navigation structure (keep top nav)
* No new sections (e.g., no Quick Insights, no Top Suppliers list)
* No functional changes — only visual presentation updates

### Acceptance Criteria

- [ ] Stat cards updated with colored accent icons matching Mal design
- [ ] Credit Limit card uses gradient progress bar
- [ ] Utilization percentage displayed with appropriate color coding
- [ ] Card styling refined (rounded corners, subtle borders, consistent padding)
- [ ] Typography matches Mal design (font sizes, weights)
- [ ] Top navigation remains unchanged
- [ ] No new metrics, charts, or features added
- [ ] Responsive layout maintained

---

## Story 9: Review & Submit Screen — Font Size, Document Download, Spacing & Checkbox Fixes

**As a** customer on the Review & Submit page,
**I want** the page to have appropriate font sizes, working document downloads, tighter spacing, and smooth checkbox behavior,
**So that** the page is easy to read and interactions feel responsive.

---

### Issues Identified

1. **Font sizes too large** in summary cards (Business Documents, Bank Account Details sections)
2. **Document names not downloadable** — clicking on document name should trigger download
3. **Excessive spacing** between section header and sub-header text
4. **Checkbox lag** — noticeable delay when clicking the confirmation checkbox
5. **Checkbox unchecks briefly on submit** — visual glitch where checkbox appears to uncheck momentarily during submission

### Changes Required

1. Reduce font sizes inside summary cards (document names, field labels, field values) by ~1-2 steps
2. Make document file names clickable — clicking should download/open the file
3. Reduce vertical spacing between section headers (e.g., "Business document") and their content
4. Optimize checkbox state handling to eliminate lag (likely a re-render issue)
5. Fix the checkbox visual glitch on submit — ensure checkbox state remains checked throughout the submission flow

### Acceptance Criteria

- [ ] Font sizes in summary cards reduced to appropriate size (readable but not oversized)
- [ ] Clicking on a document name triggers file download
- [ ] Spacing between headers and content reduced (tighter layout)
- [ ] Checkbox responds immediately on click with no perceptible lag
- [ ] Checkbox does not visually uncheck during or after submission
- [ ] Overall page layout remains balanced after spacing changes

---

## Story 10: Customer Journey Verbiage Updates — Rebrand Loan/Product Terminology

**As a** customer going through the customer journey,
**I want** the language to use updated product names and a friendlier tone,
**So that** the terminology matches the official product branding and feels approachable.

---

### Changes Required

| # | Current Text | Updated Text | Location |
|---|---|---|---|
| 1 | "You're rockstar. KYB and KYC is done!" | "Awesome! KYB and KYC is done." | KYB/KYC completion confirmation |
| 2 | "Select a Loan Product" | "Select a Financing Product" | Loan/Financing product selection step heading |
| 3 | "Select loan options without commitment. Our specialists will follow up after application submission." | "Select financing options without commitment. Our specialists will follow up after application submission." | Product selection step subheading |
| 4 | "You're applying for Receivable Invoice Financing" | "You're applying for Cash My Invoice" | Product selection — Receivable product label |
| 5 | "Want to apply for Payable Invoice Financing? Click here" | "Want to apply for Pay My Invoice? Click here" | Product selection — cross-sell link (on Receivable view) |
| 6 | "You're applying for Payable Invoice Financing" | "You're applying for Pay My Invoice" | Product selection — Payable product label |
| 7 | "Want to apply for Receivable Invoice Financing? Click here" | "Want to apply for Cash My Invoice? Click here" | Product selection — cross-sell link (on Payable view) |

### Context

* "Cash My Invoice" = new brand name for Receivable Invoice Financing
* "Pay My Invoice" = new brand name for Payable Invoice Financing
* "Loan" terminology replaced with "Financing" throughout the product selection step
* Tone change: "You're rockstar" → "Awesome!" for a cleaner, friendlier feel

### Acceptance Criteria

- [ ] "You're rockstar" replaced with "Awesome!" on KYB/KYC completion screen
- [ ] "Select a Loan Product" heading changed to "Select a Financing Product"
- [ ] "Select loan options..." subheading changed to "Select financing options..."
- [ ] "Receivable Invoice Financing" replaced with "Cash My Invoice" in product selection
- [ ] "Payable Invoice Financing" replaced with "Pay My Invoice" in product selection
- [ ] Cross-sell links updated to use new product names
- [ ] No other text on the page is affected
- [ ] Changes apply only to the customer journey flow (not dashboard or other pages)
