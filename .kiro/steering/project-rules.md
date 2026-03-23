---
inclusion: always
---

# Bank X Merchant Dashboard

React 18 + TypeScript SPA, supply chain financing platform. UI prototype only — no backend, all data in useState/localStorage.

## Stack
React 18, Vite 6, Tailwind CSS 4, React Router 7, shadcn/ui (Radix), lucide-react, recharts.

## Structure
- `src/app/components/` — pages & features (PascalCase files)
- `src/app/components/ui/` — shadcn/ui primitives
- `src/app/routes.tsx` — routes (`/login`, `/onboarding`, `/custjour`, `/` with nested dashboard routes)
- `src/styles/` — CSS/Tailwind/theme
- `src/imports/` — Figma-generated (DO NOT MODIFY)
- Path alias: `@` → `src/`

## Conventions
- Functional components + hooks only, useState for state, no global state libs
- Tailwind utilities only (no CSS modules/inline styles/CSS-in-JS)
- lucide-react icons, shadcn/ui primitives from `ui/` folder
- No backend/API calls, no new UI libs, no Redux/Zustand

## UI Patterns
- Buttons: `bg-gray-800 hover:bg-gray-900` primary, `bg-blue-600` accent, `bg-green-600` success
- Cards: `bg-white border border-gray-200 rounded-lg p-5`
- Info: `bg-blue-50 border-blue-200`, Warning: `bg-amber-50 border-amber-200`
- Inputs: `w-full px-4 py-2.5 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500`
- Modals: fixed overlay `bg-gray-500/30`, centered white card `shadow-xl`
- Wizards: numbered sidebar steps + content area + Back/Next footer

## Customer Journey (8 steps)
1. Credit Check Consent → 2. Shareholding → 3. KYB Docs → 4. KYC Docs → 5. Bank Statements → 6. Financial Documents → 7. Receivable Invoices (optional) → 8. Review & Submit
When modifying: update `steps` array, `handleNext`, `renderStepContent`, Review summary.

## Roles & STP
Roles via `demo_merchant_role` localStorage: `both`, `receivable`, `payable`, `supplier-only`. Demo panel (FlaskConical, bottom-right) toggles roles.

STP via `demo_stp_eligibility` ("approved"/"rejected"):
- Approved: Agreements → Financing → dashboard (skips Security)
- Rejected: Agreements → Security → Financing → security-pending → approve → dashboard

Key localStorage: `merchant_underwriting_status`, `demo_merchant_role`, `pending_financing_choice`, `demo_stp_eligibility`
