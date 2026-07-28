# Implementation Plan: Help/Support Contact

## Overview

Add a floating Help Widget and Contact Form to the Merchant Dashboard, accessible from both the Customer Portal (Layout.tsx) and Customer Journey (CustomerJourneyPage.tsx). The widget opens a modal with context-aware issue categories, collects subject/message, and simulates sending an email to either the MAL bank support team or the assigned banker. All data is localStorage-based; email sending is simulated with a delay.

## Tasks

- [x] 1. Create HelpContactForm component with modal structure and form fields
  - [x] 1.1 Create `src/app/components/HelpContactForm.tsx` with props interface, modal overlay, and form layout
    - Define `HelpContactFormProps` interface (`isOpen`, `onClose`, `currentContext`)
    - Render fixed overlay (`bg-gray-500/30`) with centered white card (`shadow-xl`, responsive)
    - Add modal header with title "Contact Support" and close button (X icon)
    - Add form fields: Issue Category (dropdown/select), Subject (text input, max 150 chars), Message (textarea, max 2000 chars)
    - Pre-populate user name and email from localStorage (`merchant_user_name`, `merchant_user_email`) with fallback defaults
    - Display Support Team email (`support@malbank.ae`) and Assigned Banker info (`banker_name`, `banker_email` from localStorage) when available
    - Add click-to-copy on displayed email addresses using `navigator.clipboard.writeText` with toast feedback
    - Disable Submit button until all fields are filled (category selected, subject non-empty, message non-empty)
    - On viewports below 640px, modal occupies full width with padding
    - _Requirements: 1.4, 2.3, 3.7, 4.1, 4.2, 4.3, 4.4, 4.5, 6.1, 6.2, 6.3, 6.4, 8.2, 8.3_

  - [x] 1.2 Implement context-aware issue category filtering logic
    - Define all 9 issue categories with their context tags as a constant array
    - Implement `getFilteredCategories(context: string)` function that returns only categories matching the current context
    - Context values: `"dashboard"`, `"suppliers"`, `"receivable-invoices"`, `"payable-invoices"`, `"applications"` for portal pages; `"profile-creation"`, `"kyb-verification"`, `"aecb-credit-consent"`, `"product-selection"`, `"loan-product"`, `"business-documents"`, `"bank-account-details"`, `"review-submit"` for journey steps
    - Always include universal categories: "I'm experiencing a technical issue", "I'd like to speak with my relationship manager", "Other / General inquiry"
    - Pre-select the most contextually relevant category when form opens (e.g., invoice category on invoice pages, document category on KYB step)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 4.6_

  - [x] 1.3 Implement email routing and simulated submission logic
    - When "I'd like to speak with my relationship manager" is selected, route to Assigned Banker email
    - For all other categories, route to Support Team email
    - If Assigned Banker email is unavailable, fall back to Support Team and show info note
    - On submit: show loading state, disable submit button, simulate 1.5s delay
    - Construct email payload with "From" (user email), "To" (routed recipient), "Subject" prefixed with category in brackets (e.g., `[Technical Issue] My subject`), "Body" with structured format (user name, category, message)
    - On success: show success toast "Your message has been sent to [recipient]. We'll get back to you shortly.", close modal, reset all fields
    - On simulated failure (optional edge case): show error toast with support email for manual contact, keep form open
    - _Requirements: 3.5, 3.6, 5.1, 5.2, 5.3, 5.4, 5.5, 7.1, 7.2, 7.3, 7.4_

- [x] 2. Checkpoint - Verify HelpContactForm component renders correctly in isolation
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Create HelpWidget floating button component
  - [x] 3.1 Create `src/app/components/HelpWidget.tsx` with floating action button and modal integration
    - Render a fixed-position floating button in the bottom-right area of the viewport
    - Use a recognizable help icon (HelpCircle or LifeBuoy from lucide-react)
    - Position to avoid overlapping with the existing Demo Panel toggle (FlaskConical button) — offset vertically (e.g., `bottom-20 right-4` vs demo panel's `bottom-4 right-4`)
    - Minimum tap target size of 44x44 pixels for accessibility
    - Style with `bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg` (accent style)
    - On click, toggle `isOpen` state and render `<HelpContactForm>` modal
    - Accept `currentContext` prop to pass through to HelpContactForm
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 8.1, 8.4_

- [x] 4. Integrate HelpWidget into Customer Portal (Layout.tsx)
  - [x] 4.1 Add HelpWidget to `src/app/components/Layout.tsx`
    - Import and render `<HelpWidget>` inside the Layout component, after the demo panel
    - Determine `currentContext` from the current route path using `useLocation()`:
      - `/` → `"dashboard"`
      - `/suppliers` → `"suppliers"`
      - `/receivable-invoices` → `"receivable-invoices"`
      - `/payable-invoices` → `"payable-invoices"`
      - `/applications` → `"applications"`
    - Ensure widget is visible on all portal pages regardless of user role
    - _Requirements: 1.1, 1.2, 3.3_

- [x] 5. Integrate HelpWidget into Customer Journey (CustomerJourneyPage.tsx)
  - [x] 5.1 Add HelpWidget to `src/app/components/CustomerJourneyPage.tsx`
    - Import and render `<HelpWidget>` inside the CustomerJourneyPage component
    - Determine `currentContext` from the current step index, mapping to journey step context values
    - Ensure widget does not interfere with Back/Next navigation buttons (z-index and positioning)
    - Verify that closing the Contact Form returns user to the same journey step (no state reset)
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 6. Checkpoint - Verify end-to-end flow in both Portal and Journey
  - Ensure all tests pass, ask the user if questions arise.

- [ ]* 7. Write unit tests for HelpContactForm
  - [ ]* 7.1 Write unit tests for context-aware category filtering
    - Test that dashboard context returns correct subset of categories
    - Test that KYB Verification step returns document-related categories plus universal ones
    - Test that universal categories always appear regardless of context
    - Test that pre-selection logic picks the right default category per context
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.6_

  - [ ]* 7.2 Write unit tests for email routing logic
    - Test that "relationship manager" category routes to banker email
    - Test that other categories route to support team email
    - Test fallback to support team when banker email is unavailable
    - _Requirements: 3.5, 3.6, 5.4_

  - [ ]* 7.3 Write unit tests for form validation
    - Test submit button disabled when any field is empty
    - Test subject field respects 150 character limit
    - Test message field respects 2000 character limit
    - Test email subject prefix formatting with category bracket
    - _Requirements: 4.3, 4.4, 4.5, 5.2_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- No design.md exists — tasks derived directly from requirements
- Implementation language is TypeScript/React (matching existing codebase)
- Email sending is simulated (UI prototype, no backend) per Requirement 5.5
- The existing Toast system (`showToast` from `Toast.tsx`) is reused for success/error feedback
- The Demo Panel (FlaskConical) occupies bottom-right; HelpWidget should be offset above it

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3"] },
    { "id": 2, "tasks": ["3.1"] },
    { "id": 3, "tasks": ["4.1", "5.1"] },
    { "id": 4, "tasks": ["7.1", "7.2", "7.3"] }
  ]
}
```
