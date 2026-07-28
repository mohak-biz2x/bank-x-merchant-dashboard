# Requirements Document

## Introduction

This feature adds a Help/Support Contact option to the Merchant Dashboard application, enabling users to reach out to the MAL bank support team or their assigned banker via email. The help option will be accessible from both the Customer Portal (main dashboard area) and the Customer Journey (onboarding wizard). The contact routing depends on the nature of the issue — general platform queries go to the bank support team, while relationship-specific queries go to the assigned banker.

## Glossary

- **Help_Widget**: A floating action button or accessible UI element that opens the help/support contact interface
- **Contact_Form**: A modal or panel that collects the user's issue category, subject, and message before composing an email
- **Support_Team**: The MAL bank's general support team reachable via a shared support email address
- **Assigned_Banker**: The relationship manager or banker assigned to the merchant's account
- **Issue_Category**: A classification of the user's query that determines whether the email is routed to the Support_Team or the Assigned_Banker. Each category is tagged to one or more contexts where it is relevant.
- **Category_Context_Tag**: A metadata tag on each Issue_Category that specifies which portal pages or journey steps the category is relevant to. Categories only appear in contexts matching their tags.
- **Customer_Portal**: The main dashboard area of the application (post-onboarding), including Dashboard, Suppliers, Receivable Invoices, Payable Invoices, and Applications pages
- **Customer_Journey**: The 8-step onboarding wizard where merchants complete their application (Profile Creation, KYB Verification, AECB Credit Consent, Product Selection, Loan Product, Business Documents, Bank Account Details, Review & Submit)

## Requirements

### Requirement 1: Help Widget Visibility in Customer Portal

**User Story:** As a merchant user, I want to see a help/support option in the Customer Portal, so that I can easily access support when I need assistance with the platform.

#### Acceptance Criteria

1. THE Help_Widget SHALL be visible on all pages within the Customer_Portal regardless of the user's role
2. THE Help_Widget SHALL be rendered as a floating action button positioned in the bottom-right area of the viewport
3. THE Help_Widget SHALL use a recognizable help icon (e.g., HelpCircle or LifeBuoy from lucide-react)
4. WHEN the user clicks the Help_Widget, THE Contact_Form SHALL open as a modal overlay

### Requirement 2: Help Widget Visibility in Customer Journey

**User Story:** As a merchant completing onboarding, I want to access help during any step of the Customer Journey, so that I can get assistance without leaving the onboarding flow.

#### Acceptance Criteria

1. THE Help_Widget SHALL be visible on all steps of the Customer_Journey
2. THE Help_Widget SHALL not interfere with the navigation controls (Back/Next buttons) of the Customer_Journey
3. WHEN the user clicks the Help_Widget during the Customer_Journey, THE Contact_Form SHALL open as a modal overlay
4. WHEN the Contact_Form is closed, THE Customer_Journey SHALL remain on the same step the user was on before opening the form

### Requirement 3: Context-Aware Issue Category Selection

**User Story:** As a merchant user, I want to select the nature of my issue from categories that are relevant to what I am currently doing, so that my query is routed to the appropriate contact and I am not overwhelmed by irrelevant options.

#### Acceptance Criteria

1. THE Contact_Form SHALL display a filtered list of Issue_Category options based on the user's current context (portal page or journey step)
2. THE system SHALL define the following Issue_Category options using plain, user-friendly language:
   - "I have a question about my account or profile" (tagged: all portal pages, Profile Creation step)
   - "I need help uploading or managing documents" (tagged: KYB Verification, Business Documents, Review & Submit steps)
   - "I need help with my application" (tagged: Applications page, all Customer_Journey steps)
   - "I have a question about my invoices" (tagged: Receivable Invoices page, Payable Invoices page)
   - "I need help with suppliers" (tagged: Suppliers page)
   - "I have a question about financing or credit" (tagged: Dashboard page, Product Selection step, Loan Product step, AECB Credit Consent step)
   - "I'm experiencing a technical issue" (tagged: all portal pages, all Customer_Journey steps)
   - "I'd like to speak with my relationship manager" (tagged: all portal pages, all Customer_Journey steps)
   - "Other / General inquiry" (tagged: all portal pages, all Customer_Journey steps)
3. WHEN the Contact_Form is opened, THE system SHALL display only the Issue_Category options whose Category_Context_Tag matches the user's current page or journey step
4. THE Contact_Form SHALL always display the categories tagged to all contexts ("I'm experiencing a technical issue", "I'd like to speak with my relationship manager", "Other / General inquiry") regardless of the current page or step
5. WHEN the user selects "I'd like to speak with my relationship manager", THE Contact_Form SHALL route the email to the Assigned_Banker
6. WHEN the user selects any category other than "I'd like to speak with my relationship manager", THE Contact_Form SHALL route the email to the Support_Team
7. THE Contact_Form SHALL require the user to select exactly one Issue_Category before allowing submission

### Requirement 4: Contact Form Fields

**User Story:** As a merchant user, I want to provide details about my issue, so that the support team or banker can understand and address my query efficiently.

#### Acceptance Criteria

1. THE Contact_Form SHALL include the following fields: Issue_Category (dropdown), Subject (text input), and Message (textarea)
2. THE Contact_Form SHALL pre-populate the user's name and email from the logged-in session data stored in localStorage
3. THE Contact_Form SHALL require all fields (Issue_Category, Subject, Message) to be filled before enabling the submit action
4. THE Contact_Form SHALL limit the Subject field to 150 characters
5. THE Contact_Form SHALL limit the Message field to 2000 characters
6. WHEN the Contact_Form is opened, THE system SHALL pre-select the most contextually relevant Issue_Category from the filtered list based on the user's current page or journey step (e.g., "I need help uploading or managing documents" when on the KYB Verification step, "I have a question about my invoices" when on the Receivable Invoices page)

### Requirement 5: In-App Message Submission

**User Story:** As a merchant user, I want to type my message directly in the app and have the system send it on my behalf, so that I don't need to switch to an external email client.

#### Acceptance Criteria

1. WHEN the user submits the Contact_Form, THE system SHALL send the message on the user's behalf to the appropriate recipient (Support_Team or Assigned_Banker) based on the selected Issue_Category
2. THE system SHALL construct the email with the "From" field set to the user's email address, the "To" field set to the recipient, the "Subject" prefixed with the Issue_Category in brackets (e.g., "[Technical Issue] My subject"), and the "Body" containing the user's name, selected Issue_Category, and Message content in a structured format
3. WHILE the message is being sent, THE Contact_Form SHALL display a loading/sending state and disable the submit button to prevent duplicate submissions
4. IF the Assigned_Banker email is not available, THEN THE Contact_Form SHALL fall back to routing the message to the Support_Team and display an informational note to the user
5. NOTE: Since this is a UI prototype, the email send SHALL be simulated with a brief delay (1-2 seconds) followed by a success response. The UI design SHALL assume a real backend email service will be integrated in production.

### Requirement 6: Support Contact Information Display

**User Story:** As a merchant user, I want to see the support team's contact details, so that I can reach out directly if I prefer not to use the form.

#### Acceptance Criteria

1. THE Contact_Form SHALL display the Support_Team email address visibly within the form
2. THE Contact_Form SHALL display the Assigned_Banker name and email address when available
3. WHEN the Assigned_Banker information is not available, THE Contact_Form SHALL display only the Support_Team contact information
4. THE Contact_Form SHALL allow the user to copy the displayed email addresses to clipboard by clicking on them

### Requirement 7: Confirmation Feedback

**User Story:** As a merchant user, I want to receive confirmation after submitting my support request, so that I know my message was sent successfully.

#### Acceptance Criteria

1. WHEN the message is successfully sent (or simulated), THE system SHALL display a success toast notification confirming that the message has been delivered
2. THE success toast SHALL include a message such as "Your message has been sent to [recipient]. We'll get back to you shortly."
3. WHEN the success toast is displayed, THE Contact_Form SHALL close automatically and reset all fields
4. IF the message fails to send, THEN THE system SHALL display an error toast with the support email address for manual contact and keep the Contact_Form open so the user does not lose their message

### Requirement 8: Responsive Design

**User Story:** As a merchant user, I want the help feature to work well on different screen sizes, so that I can access support regardless of my device.

#### Acceptance Criteria

1. THE Help_Widget SHALL be positioned to avoid overlapping with other floating elements (e.g., the Demo Panel toggle button)
2. THE Contact_Form modal SHALL be responsive and display correctly on viewports 320px wide and above
3. WHILE the viewport width is below 640px, THE Contact_Form SHALL occupy the full width of the screen with appropriate padding
4. THE Help_Widget SHALL maintain a minimum tap target size of 44x44 pixels for accessibility
