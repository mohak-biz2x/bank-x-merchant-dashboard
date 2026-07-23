import { ApplicationsModule } from "./ApplicationsModule";
import { useEffect } from "react";

/**
 * Standalone page at /agreements that ensures the Agreement Signing modal
 * is always shown on load by setting the required localStorage state.
 */
export function AgreementsPage() {
  useEffect(() => {
    // Force conditions so the agreement modal auto-opens:
    // 1. Non-STP path (modal only shows for non-STP)
    localStorage.setItem("demo_stp_eligibility", "rejected");
    // 2. Ensure underwriting status triggers the pending_agreements_signing state
    localStorage.setItem("merchant_underwriting_status", "approved");
    // 3. Single dataset so we get one application row
    localStorage.setItem("demo_app_dataset", "single");
    // Fire event so components re-read data
    window.dispatchEvent(new Event("demo-role-change"));
  }, []);

  return <ApplicationsModule />;
}
