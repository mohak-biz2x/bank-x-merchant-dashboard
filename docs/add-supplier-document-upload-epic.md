# Epic: Smart Supplier Onboarding via Document Upload

## Epic Summary

Enable buyers to onboard suppliers faster by uploading a Trade License or Supplier Invoice, automatically extracting supplier details to pre-fill the Add Supplier form — reducing manual data entry and improving data accuracy.

---

## Business Context

Currently, buyers must manually enter all 11 fields when adding a new supplier. This is time-consuming, error-prone, and creates friction in the onboarding process. By allowing document-based extraction, we can auto-fill up to 100% of fields depending on the document type, significantly improving the onboarding experience.

---

## Epic Acceptance Criteria

- Buyer can choose to upload a Trade License, Supplier Invoice, or skip to manual entry
- Uploaded documents trigger OCR extraction that pre-fills relevant form fields
- Auto-filled fields from documents are editable (user can correct extraction errors)
- Dedupe match (existing supplier) takes priority over document extraction and locks fields
- The existing TL-number-based dedupe check continues to work as before
- No new backend dependencies required for the prototype (simulated OCR)

---

## User Stories

### US-1: Document Upload & Auto-Fill

**As a** buyer adding a new supplier  
**I want to** upload a Trade License or Supplier Invoice and have supplier details extracted automatically  
**So that** I can onboard suppliers faster with minimal manual data entry

**Acceptance Criteria:**

- When I click "Add Supplier", I see a document choice screen with three options:
  - **Trade License** (~30% auto-fill): extracts Company Name, TL Number, Country of Incorporation, Contact Person
  - **Supplier Invoice** (~85–100% auto-fill, marked "Recommended"): extracts Company Name, TRN, Country, Contact Person, Email, Phone, Bank Name, Account Name, IBAN, SWIFT Code
  - **Skip — Fill all fields manually**: opens an empty form (existing behavior)
- Each upload option clearly indicates which fields will be auto-filled
- Accepted file formats: PDF, PNG, JPG, JPEG
- After file selection, a processing screen appears with spinner and uploaded file name
- Processing completes within a reasonable time (< 3 seconds)
- After extraction, the form opens with extracted fields pre-populated
- All document-extracted fields are fully editable (user can correct OCR errors)
- A summary banner at the top indicates: "X of 11 fields extracted from [Trade License/Invoice] — please review and complete the remaining fields."
- For manual entry, a banner guides: "Fill in all supplier details below. Enter the Trade License Number first to check for existing records."

---

### US-2: Dedupe Match Takes Priority Over Document Extraction

**As a** buyer adding a supplier whose Trade License Number already exists in the system  
**I want** the system to recognize the existing supplier, override any document-extracted data, and lock all fields  
**So that** duplicate suppliers are not created and data integrity is maintained

**Acceptance Criteria:**

- When the TL Number (whether typed manually or extracted from a document) matches an existing supplier on blur, the dedupe match takes priority
- All fields are populated from the existing supplier record, overriding any document-extracted values
- All fields become non-editable (disabled/locked) when a dedupe match is found
- A banner message indicates: "Existing supplier matched — all fields populated from your records. Fields are locked to maintain data integrity."
- The user can still change the TL Number to trigger a new lookup
- Submitting with a dedupe match activates the existing supplier for the buyer's account
- Only one banner is shown at a time — dedupe banner takes priority over document extraction banner

---

## Technical Notes

- **OCR Integration:** In production, integrate with an OCR/document intelligence service (e.g., AWS Textract, Azure Document Intelligence) for actual extraction
- **Dedupe Logic:** Existing TL-number-based lookup remains unchanged — fires on blur of the TL Number field
- **File Handling:** For the prototype, any uploaded file triggers simulated extraction with hardcoded demo data
- **No Backend Required:** All logic is client-side for the prototype phase

---

## Dependencies

| Dependency | Status | Notes |
|-----------|--------|-------|
| OCR/Document Intelligence Service | Future | Needed for production; prototype uses simulated data |
| Existing Dedupe API | Available | TL Number lookup already implemented |
| File Upload UI | Implemented | Using native file input with styled labels |

---

## Out of Scope

- Actual OCR processing (prototype uses simulated extraction)
- Multiple document uploads in a single session
- Document storage/retention
- Oscilar KYB integration (separate initiative)
- Bulk supplier upload via CSV (already exists as separate feature)
