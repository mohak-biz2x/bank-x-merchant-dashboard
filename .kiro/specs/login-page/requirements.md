# Requirements Document

## Introduction

The Login Page is the entry point for the Bank X Merchant Dashboard, a supply chain financing platform. It provides merchant users with a branded authentication experience featuring a split-layout design: a left branding panel showcasing Bank X's identity and value proposition, and a right panel containing the login form. Since this is a frontend-only prototype with no backend, authentication is simulated — the form navigates directly to the dashboard on submission. The page also serves as a gateway to the Customer Journey onboarding flow.

## Glossary

- **Login_Page**: The full-screen view at `/login` containing the branding panel and login form, serving as the application entry point.
- **Branding_Panel**: The left half of the Login_Page (visible on desktop only) displaying the Bank X logo, tagline, trust badges, and a "Get Started" call-to-action.
- **Login_Form**: The right-side card containing email and password inputs, "Remember me" checkbox, "Forgot password?" link, and the submit button.
- **Dashboard**: The main application view at `/` that the user navigates to after successful login.
- **Customer_Journey**: The onboarding wizard at `/custjour` accessible via the "Get Started" button on the Branding_Panel.
- **Demo_Credentials**: Pre-filled email (`ahmed@almasraf.ae`) and password (`Demo@2026`) values used for prototype demonstration purposes.
- **Trust_Badges**: Visual indicators (Private, Trusted, Secure) displayed on the Branding_Panel to communicate platform security.

## Requirements

### Requirement 1: Display Split-Layout Login Page

**User Story:** As a merchant user, I want to see a professional branded login page, so that I feel confident about the platform's credibility before signing in.

#### Acceptance Criteria

1. THE Login_Page SHALL render a two-column split layout with the Branding_Panel occupying the left half and the Login_Form occupying the right half on viewports 1024px and wider.
2. THE Branding_Panel SHALL display the Bank X logo (Wallet icon with white background), the "Bank X" name, a tagline describing supply chain financing, a descriptive paragraph, and a "Get Started" button.
3. THE Branding_Panel SHALL display three Trust_Badges labeled "Private", "Trusted", and "Secure" with corresponding icons (Lock, CheckCircle, Shield).
4. THE Branding_Panel SHALL display a security notice stating that information is secured with 256-bit encryption.
5. THE Login_Form SHALL be contained within a white card with a border, rounded corners, and a shadow, following the project card pattern (`bg-white border border-gray-200 rounded-lg`).

### Requirement 2: Provide Email and Password Login Form

**User Story:** As a merchant user, I want to enter my email and password to log in, so that I can access the Merchant Dashboard.

#### Acceptance Criteria

1. THE Login_Form SHALL contain a labeled email input field of type "email" with placeholder text "admin@company.com".
2. THE Login_Form SHALL contain a labeled password input field of type "password" with placeholder text "Enter your password".
3. THE Login_Form SHALL pre-fill the email field with the Demo_Credentials email value and the password field with the Demo_Credentials password value on initial render.
4. THE Login_Form SHALL mark both the email and password fields as required, preventing form submission when either field is empty.
5. THE Login_Form SHALL contain a "Log in" submit button styled with the blue accent theme (`bg-blue-600 hover:bg-blue-700`).
6. THE Login_Form SHALL include a "Remember me" checkbox and a "Forgot password?" button between the password field and the submit button.

### Requirement 3: Navigate to Dashboard on Form Submission

**User Story:** As a merchant user, I want to be taken to the dashboard after logging in, so that I can start using the platform immediately.

#### Acceptance Criteria

1. WHEN the user submits the Login_Form, THE Login_Page SHALL navigate to the Dashboard at route `/`.
2. WHEN the user submits the Login_Form, THE Login_Page SHALL prevent the default browser form submission behavior.
3. WHEN the user submits the Login_Form, THE Login_Page SHALL log the form data to the browser console for debugging purposes.

### Requirement 4: Navigate to Customer Journey from Branding Panel

**User Story:** As a new merchant, I want to access the onboarding journey from the login page, so that I can begin the registration process without needing to log in first.

#### Acceptance Criteria

1. WHEN the user clicks the "Get Started" button on the Branding_Panel, THE Login_Page SHALL navigate to the Customer_Journey at route `/custjour`.
2. THE "Get Started" button SHALL be styled with a white background and blue text (`bg-white text-blue-900`) to contrast with the Branding_Panel gradient.

### Requirement 5: Support Mobile-Responsive Layout

**User Story:** As a merchant user on a mobile device, I want the login page to adapt to my screen size, so that I can log in comfortably on any device.

#### Acceptance Criteria

1. WHILE the viewport width is below 1024px, THE Login_Page SHALL hide the Branding_Panel entirely.
2. WHILE the viewport width is below 1024px, THE Login_Page SHALL display a mobile logo header showing the Bank X logo (Wallet icon with blue background) and "Bank X" name above the Login_Form.
3. WHILE the viewport width is 1024px or wider, THE Login_Page SHALL hide the mobile logo header.
4. THE Login_Form SHALL occupy the full available width on all viewport sizes, centered with a maximum width constraint.

### Requirement 6: Display Footer Links

**User Story:** As a merchant user, I want to access privacy and terms information from the login page, so that I can review the platform's legal policies.

#### Acceptance Criteria

1. THE Login_Page SHALL display a footer below the Login_Form containing "Privacy policy" and "Terms & conditions" links separated by a dot divider.
2. THE footer links SHALL be centered, styled in small gray text (`text-xs text-gray-500`), and change to a darker gray on hover.

### Requirement 7: Apply Consistent Input Styling

**User Story:** As a merchant user, I want form inputs to look consistent with the rest of the application, so that the experience feels cohesive.

#### Acceptance Criteria

1. THE Login_Form input fields SHALL follow the project input pattern: full width, horizontal padding of 1rem, vertical padding of 0.625rem, gray-300 border, rounded-lg corners, and a blue focus ring (`focus:ring-2 focus:ring-blue-500`).
2. THE Login_Form labels SHALL be displayed as block elements above their respective inputs with small medium-weight text (`text-sm font-medium text-gray-700`).
