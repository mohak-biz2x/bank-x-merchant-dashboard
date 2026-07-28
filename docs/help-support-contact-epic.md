# Epic: In-App Help & Support Contact

## Summary

Enable merchants to contact the MAL bank support team or their assigned relationship manager directly from within the Merchant Dashboard. A floating help widget opens a context-aware contact form that routes messages to the appropriate recipient based on the nature of the issue.

## Business Value

- Reduces support friction — merchants don't need to leave the app or search for contact details
- Context-aware categories reduce mis-routed queries and improve first-response resolution
- Relationship manager routing strengthens the banker-merchant relationship

## Scope

- Floating help widget visible on all Customer Portal pages and customer-facing Customer Journey steps
- Contact form with context-filtered issue categories, message field, and email routing
- Backend email service integration (send on behalf of the merchant)

---

## Story 1: Help Widget & Contact Form UI

**As a** merchant user  
**I want** a floating help button that opens a contact form  
**So that** I can quickly reach support without leaving my current workflow

### Acceptance Criteria

1. A floating circular button (help icon) is rendered at a fixed position in the bottom-right corner of the viewport.
2. Clicking the button opens a modal contact form; clicking again or the X closes it.
3. The modal follows the portal's standard modal pattern (overlay, header bar, rounded card).
4. The form contains:
   - **Issue Category** — dropdown/select (required)
   - **Message** — textarea, max 2000 characters with character counter (required)
5. Submit button is disabled until both fields are filled.
6. While submitting, the button shows a loading spinner and all fields are disabled.
7. On success, a toast confirms delivery and the form closes with fields reset.
8. On failure, a toast shows an error with a fallback support email; the form stays open so the user doesn't lose their message.
9. The widget has a minimum tap target of 44×44px and is accessible (aria-label).
10. The modal is responsive — full-width with padding on viewports below 640px.

### Technical Notes

- No subject field — the email subject is auto-generated from the selected issue category (e.g., `[Technical Issue] Support Request`).
- Backend API: `POST /api/support/contact` — accepts `{ category, message }`, resolves user identity and routing server-side.

### Email Template

The backend composes the email using the following template:

```
Subject: [<Category Prefix>] Support Request — <App ID>

──────────────────────────────────────
SUPPORT REQUEST
──────────────────────────────────────

Application ID:   <app_id>  (e.g., APP-2025-00412)
Submitted At:     <timestamp in ISO 8601>

───── User Details ─────
Name:             <merchant_user_name>
Email:            <merchant_user_email>
Mobile:           <merchant_mobile_number>
Company:          <company_legal_name>

───── Context ─────
Current Page:     <page or journey step label>  (e.g., "Receivable Invoices" or "Business Documents — Step 6")
Issue Category:   <selected category label>

───── Message ─────
<user's message text>

──────────────────────────────────────
This message was sent from the MAL Merchant Dashboard on behalf of the user above.
```

**Field definitions:**

| Field | Source |
|-------|--------|
| App ID | The merchant's active application ID from the system |
| Name / Email / Mobile / Company | Authenticated user's profile |
| Current Page | Derived from the `currentContext` value passed by the frontend (mapped to a human-readable label) |
| Issue Category | The category label selected by the user |
| Category Prefix | Short form used in subject line (e.g., "Technical Issue", "Invoices", "Financing/Credit") |
| Message | Free-text message entered by the user (max 2000 chars) |

---

## Story 2: Context-Aware Issue Category Filtering & Routing

**As a** merchant user  
**I want** the issue categories shown to be relevant to what I'm currently doing  
**So that** I can quickly classify my issue and it reaches the right person

### Acceptance Criteria

1. The system defines 9 issue categories, each tagged to specific portal pages and/or journey steps where they are relevant:

   | Category | Relevant Contexts |
   |----------|-------------------|
   | I have a question about my account or profile | All portal pages, Profile Creation step |
   | I need help uploading or managing documents | KYB Verification, Business Documents, Review & Submit |
   | I need help with my application | Applications page, all journey steps |
   | I have a question about my invoices | Receivable Invoices, Payable Invoices |
   | I need help with suppliers | Suppliers page |
   | I have a question about financing or credit | Dashboard, Product Selection, Loan Product, AECB Credit Consent |
   | I'm experiencing a technical issue | All (universal) |
   | I'd like to speak with my relationship manager | All (universal) |
   | Other / General inquiry | All (universal) |

2. When the form opens, only categories matching the user's current page/step are shown. The 3 universal categories always appear.
3. The most contextually relevant category is pre-selected when the form opens (e.g., "invoices" on the Invoices page, "documents" on KYB step).
4. **Routing rules:**
   - "I'd like to speak with my relationship manager" → routes to the merchant's assigned banker email.
   - All other categories → routes to the shared support team email.
   - If the assigned banker email is unavailable, fall back to the support team and display an info note explaining the fallback.

### Technical Notes

- Context is derived from the current route (portal) or current step index (journey).
- Portal context mapping: `/` → dashboard, `/suppliers` → suppliers, `/receivable-invoices` → receivable-invoices, `/payable-invoices` → payable-invoices, `/applications` → applications.
- Journey context mapping: Step 5 → loan-product, Step 6 → business-documents, Step 7 → bank-account-details, Step 8 → review-submit.
- Routing logic should live server-side in production; the frontend sends the selected category and the backend resolves the recipient.

---

## Story 3: Widget Placement & Visibility Rules

**As a** merchant user  
**I want** the help widget to appear only where it's relevant and not interfere with my workflow  
**So that** I can access help when I need it without UI clutter during internal bank steps

### Acceptance Criteria

1. The help widget is visible on **all Customer Portal pages** (Dashboard, Suppliers, Receivable Invoices, Payable Invoices, Applications) regardless of user role.
2. The help widget is visible on **customer-facing journey steps only** (steps 5–8: Loan Product, Business Documents, Bank Account Details, Review & Submit).
3. The help widget is **NOT visible** on MAL-internal journey steps (steps 1–4: Profile Creation, KYB Verification, AECB Credit Consent, Product Selection).
4. The widget does not overlap or interfere with navigation controls (Back/Next buttons in the journey).
5. Closing the contact form during the journey returns the user to the same step — no state is lost.
6. The widget's z-index layers correctly: above page content, below the modal overlay.

### Technical Notes

- In the journey, conditionally render the widget based on the current step index (`currentStep >= 5`).
- The widget is a standalone component that manages its own open/close state — it doesn't affect parent component state.

---

## Out of Scope (Future Enhancements)

- Chat/live support integration
- Ticket tracking and history
- File attachment support in the contact form
- Notification when support responds
- Analytics on category usage and resolution times
