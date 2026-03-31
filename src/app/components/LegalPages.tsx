import React from "react";

import { MalLogo } from "./MalLogo";

function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-[#C3D2E7] px-6 py-3">
        <div className="flex items-center gap-2">
          <MalLogo height={28} className="text-gray-900" />
        </div>
      </header>
      <div className="flex-1 p-6 max-w-3xl mx-auto w-full">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
        <div className="bg-white border border-gray-200 rounded p-6 text-sm text-gray-600 leading-relaxed space-y-3">{children}</div>
      </div>
      <footer className="bg-white border-t border-gray-200 px-6 py-5">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <a href="#/privacy" target="_blank" className="text-xs text-gray-500 hover:text-gray-700">Privacy policy</a>
            <a href="#/disclaimer" target="_blank" className="text-xs text-gray-500 hover:text-gray-700">Disclaimer</a>
            <a href="#/tnc" target="_blank" className="text-xs text-gray-500 hover:text-gray-700">Terms & conditions</a>
          </div>
          <p className="text-xs text-gray-400">&copy; Biz2X 2026. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>Mal is committed to protecting your privacy. We collect and process your business information solely for the purpose of evaluating your supply chain financing application.</p>
      <p>Your data is stored securely using industry-standard encryption and is shared only with authorized verification partners as required for KYB, KYC, and credit assessment processes.</p>
      <p>We do not sell or share your personal or business information with third parties for marketing purposes. You have the right to request access to, correction of, or deletion of your data at any time.</p>
      <p>For any privacy-related inquiries, please contact our Data Protection Officer at privacy@mal.ae.</p>
    </LegalPage>
  );
}

export function DisclaimerPage() {
  return (
    <LegalPage title="Disclaimer">
      <p>The information provided on this platform is for general informational purposes only. All financing products are subject to credit approval and verification of information provided.</p>
      <p>Mal reserves the right to modify terms, conditions, and product offerings at any time without prior notice. Past performance or approval does not guarantee future results.</p>
      <p>This platform is intended for business use only. Financing for personal, family, or household purposes is not available through this service.</p>
      <p>Users are advised to seek independent financial and legal advice before entering into any financing arrangements.</p>
    </LegalPage>
  );
}

export function TncPage() {
  return (
    <LegalPage title="Terms & Conditions">
      <p>By using the Mal Supply Chain Finance platform, you agree to be bound by these Terms and Conditions. These terms govern your access to and use of the platform and all related services.</p>
      <p>You agree to provide accurate, current, and complete information during the registration and application process. Any false or misleading information may result in the rejection of your application or termination of services.</p>
      <p>All financing arrangements are subject to Mal's credit policies and approval processes. Approved credit limits, rates, and terms may vary based on the assessment of your business profile.</p>
      <p>Mal may update these Terms and Conditions from time to time. Continued use of the platform constitutes acceptance of any modifications.</p>
    </LegalPage>
  );
}
