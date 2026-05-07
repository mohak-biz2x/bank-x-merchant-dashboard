import { Wallet, FileText, TrendingUp, Clock, CheckCircle, Building2, Loader2, ShieldCheck, PenTool, Upload, X, CreditCard, Landmark, Zap, DollarSign, Eye, Package, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import { ApplicationsModule } from "./ApplicationsModule";
import { PremiumBuyerSupplierDashboard } from "./PremiumBuyerSupplierDashboard";
import { Spotlight } from "./Spotlight";

export type MerchantRole = "both" | "receivable" | "payable" | "supplier-only" | "premium-buyer" | "premium-buyer-supplier";

export function getMerchantRole(): MerchantRole {
  return (localStorage.getItem("demo_merchant_role") as MerchantRole) || "receivable";
}

export function getUnderwritingStatus(): string {
  return localStorage.getItem("merchant_underwriting_status") || "none";
}

export function getStpEligibility(): string {
  return localStorage.getItem("demo_stp_eligibility") || "rejected";
}

export function MerchantDashboard() {
  // Always force Limit Approved state when dashboard loads
  let needsEvent = false;
  if (localStorage.getItem("merchant_underwriting_status") !== "none") {
    localStorage.setItem("merchant_underwriting_status", "none");
    needsEvent = true;
  }
  if (!localStorage.getItem("demo_merchant_role") || localStorage.getItem("demo_merchant_role") === "both") {
    localStorage.setItem("demo_merchant_role", "receivable");
    needsEvent = true;
  }
  if (needsEvent) {
    // Defer so Layout can re-read updated localStorage
    setTimeout(() => window.dispatchEvent(new Event("demo-role-change")), 0);
  }

  const [role, setRole] = useState<MerchantRole>(getMerchantRole);
  const [uwStatus, setUwStatus] = useState<string>("none");

  // STP state
  const [stpEligibility, setStpEligibility] = useState(getStpEligibility);
  const [showStpBanner, setShowStpBanner] = useState(false);
  const [stpRedirectTimer, setStpRedirectTimer] = useState(10);
  const isStp = stpEligibility === "approved";

  // Post-approval multi-step state
  const [postApprovalStep, setPostApprovalStep] = useState(1); // 1=eSign, 2=security
  const [signedAgreements, setSignedAgreements] = useState<Record<string, boolean>>({
    financing: false,
  });
  const [securityMethod, setSecurityMethod] = useState<"cheque" | "mandate" | null>(null);
  const [securityChequeFile, setSecurityChequeFile] = useState<File | null>(null);
  const [mandateConfirmed, setMandateConfirmed] = useState(false);
  const [docuSignDoc, setDocuSignDoc] = useState<{ key: string; label: string } | null>(null);
  const [docuSignStep, setDocuSignStep] = useState<"review" | "signing" | "complete">("review");
  const [docuSignChecked, setDocuSignChecked] = useState(false);

  // Mandate DocuSign modal state
  const [showMandateModal, setShowMandateModal] = useState(false);
  const [mandateStep, setMandateStep] = useState<"review" | "signing" | "complete">("review");
  const [mandateSignChecked, setMandateSignChecked] = useState(false);

  const approvedLimit = 8000000;
  const securityAmount = approvedLimit * 1.1;

  useEffect(() => {
    const onRoleChange = () => {
      setRole(getMerchantRole());
      setUwStatus(getUnderwritingStatus());
      setStpEligibility(getStpEligibility());
    };
    window.addEventListener("demo-role-change", onRoleChange);
    return () => window.removeEventListener("demo-role-change", onRoleChange);
  }, []);

  useEffect(() => {
    const onCompleteEsign = () => {
      setSignedAgreements({ financing: true });
      setDocuSignDoc(null);
    };
    window.addEventListener("demo-complete-esign", onCompleteEsign);
    return () => window.removeEventListener("demo-complete-esign", onCompleteEsign);
  }, []);

  // STP auto-redirect countdown
  const navigate = useNavigate();
  useEffect(() => {
    if (!showStpBanner) return;
    if (stpRedirectTimer <= 0) {
      const product = localStorage.getItem("selected_product") || "receivable";
      localStorage.setItem("demo_merchant_role", product);
      localStorage.setItem("merchant_underwriting_status", "none");
      localStorage.removeItem("pending_financing_choice");
      window.dispatchEvent(new Event("demo-role-change"));
      setShowStpBanner(false);
      return;
    }
    const t = setTimeout(() => setStpRedirectTimer(prev => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [showStpBanner, stpRedirectTimer]);

  // Credit limit
  const utilised = 5100000;
  const receivableUtilised = 3200000;
  const payableUtilised = 1900000;
  const available = approvedLimit - utilised;
  const utilisationPct = (utilised / approvedLimit) * 100;
  const receivablePct = (receivableUtilised / approvedLimit) * 100;
  const payablePct = (payableUtilised / approvedLimit) * 100;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  const stats = [
    { title: "Pending Invoices", value: "17", icon: Clock, color: "text-orange-600", bgColor: "bg-orange-50", roles: ["both", "receivable", "payable"] as MerchantRole[] },
    { title: "Approved Invoices", value: "66", icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-50", roles: ["both", "receivable", "payable"] as MerchantRole[] },
    { title: "Suppliers", value: "6", icon: Building2, color: "text-indigo-600", bgColor: "bg-indigo-50", roles: ["both", "payable"] as MerchantRole[] },
    { title: "Monthly Growth", value: "+23%", icon: TrendingUp, color: "text-purple-600", bgColor: "bg-purple-50", roles: ["both", "receivable", "payable"] as MerchantRole[] },
  ];

  const filteredStats = stats.filter((s) => s.roles.includes(role));

  const modules = [
    {
      title: "Suppliers",
      description: "Manage supplier relationships",
      path: "/suppliers",
      icon: Building2,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      btnBg: "bg-[#4F8DFF] hover:bg-[#3A7AE8]",
      roles: ["both", "payable"] as MerchantRole[],
      rows: [
        { label: "Total Suppliers", value: "6" },
        { label: "KYB Verified", value: "6" },
      ],
    },
    {
      title: "Receivable Invoices",
      description: "Submit invoices for early financing against your receivables",
      path: "/receivable-invoices",
      icon: FileText,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      btnBg: "bg-[#4F8DFF] hover:bg-[#3A7AE8]",
      roles: ["both", "receivable"] as MerchantRole[],
      rows: [
        { label: "Total Invoices", value: "50" },
        { label: "Pending", value: "12", valueColor: "text-orange-600" },
        { label: "Approved", value: "38", valueColor: "text-green-600" },
      ],
    },
    {
      title: "Payable Invoices",
      description: "Manage and approve invoices submitted by your suppliers",
      path: "/payable-invoices",
      icon: FileText,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      btnBg: "bg-[#4F8DFF] hover:bg-[#3A7AE8]",
      roles: ["both", "payable"] as MerchantRole[],
      rows: [
        { label: "Total Invoices", value: "33" },
        { label: "Pending Approval", value: "5", valueColor: "text-orange-600" },
        { label: "Approved", value: "28", valueColor: "text-green-600" },
      ],
    },
  ];

  const filteredModules = modules.filter((mod) => mod.roles.includes(role));

  const [showStpSpotlight, setShowStpSpotlight] = useState(false);
  const stpTargetRef = useRef<HTMLAnchorElement>(null);

  // Determine which path to spotlight based on role
  const stpSpotlightPath = role === "payable" ? "/suppliers" : "/receivable-invoices";

  useEffect(() => {
    const stpDone = localStorage.getItem("stp_just_completed");
    if (stpDone === "true") {
      setShowStpSpotlight(true);
      localStorage.removeItem("stp_just_completed");
    }
  }, []);

  // Premium buyer - redirect to premium buyer dashboard
  if (role === "premium-buyer") {
    navigate("/pb");
    return null;
  }

  // Premium buyer supplier dashboard
  if (role === "premium-buyer-supplier") {
    return <PremiumBuyerSupplierDashboard />;
  }

  // Supplier-only dashboard (no financing)
  if (role === "supplier-only") {
    return <SupplierOnlyDashboard />;
  }

  // Pending underwriting screen — show Applications module
  if (uwStatus === "pending") {
    return (
      <div className="min-h-screen bg-gray-50">
        <ApplicationsModule embedded />
      </div>
    );
  }

  // Security verification pending screen — show Applications module
  if (uwStatus === "security-pending") {
    return (
      <div className="min-h-screen bg-gray-50">
        <ApplicationsModule embedded onSecurityOnboarding={(appId) => {
          localStorage.setItem("merchant_underwriting_status", "approved");
          window.dispatchEvent(new Event("demo-role-change"));
        }} />
      </div>
    );
  }

  // Financing choice screen (after underwriting approved) — multi-step
  if (uwStatus === "approved") {
    const allSigned = signedAgreements.financing;
    const securityComplete = securityMethod === "cheque" ? !!securityChequeFile : securityMethod === "mandate" ? mandateConfirmed : false;

    const openMandateFlow = () => {
      setShowMandateModal(true);
      setMandateStep("review");
      setMandateSignChecked(false);
    };

    const formatCurrencyLocal = (amount: number) =>
      new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

    const postSteps = isStp
      ? [
          { id: 1, name: "Digital Agreements" },
        ]
      : [
          { id: 1, name: "Digital Agreements" },
          { id: 2, name: "Security" },
        ];

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-6 max-w-3xl mx-auto pt-12">
          {/* Approved banner */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-1">Application Approved</h2>
            <p className="text-gray-600 text-sm">Approved Credit Limit: <span className="font-semibold text-gray-900">{formatCurrencyLocal(approvedLimit)}</span></p>
          </div>

          {/* Step progress — hide for STP since there's only one step */}
          {!isStp && (
            <div className="flex items-center justify-center gap-2 mb-8">
              {postSteps.map((s, i) => (
                <div key={s.id} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${postApprovalStep > s.id ? "bg-green-600 text-white" : postApprovalStep === s.id ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}>
                    {postApprovalStep > s.id ? <CheckCircle className="w-4 h-4" /> : s.id}
                  </div>
                  <span className={`text-sm ${postApprovalStep === s.id ? "font-medium text-gray-900" : "text-gray-500"}`}>{s.name}</span>
                  {i < postSteps.length - 1 && <div className="w-12 h-px bg-gray-300 mx-1" />}
                </div>
              ))}
            </div>
          )}

          {/* Step 1: E-Sign Digital Agreements */}
          {postApprovalStep === 1 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sign Digital Agreements</h3>
              <p className="text-gray-600 text-sm mb-6">Please review and e-sign the following agreements to proceed.</p>
              <div className="space-y-4">
                {[
                  { key: "financing", label: "Financing Agreement", desc: "Master financing agreement covering terms, rates, and conditions of the credit facility" },
                ].map((agreement) => (
                  <div key={agreement.key} className={`border rounded-lg p-5 transition-all ${signedAgreements[agreement.key] ? "border-green-300 bg-green-50" : "border-gray-200"}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{agreement.label}</h4>
                        <p className="text-sm text-gray-500 mt-1">{agreement.desc}</p>
                      </div>
                      <div className="ml-4">
                        {signedAgreements[agreement.key] ? (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                            <CheckCircle className="w-4 h-4" /> Signed
                          </div>
                        ) : (
                          <button
                            onClick={() => { setDocuSignDoc({ key: agreement.key, label: agreement.label }); setDocuSignStep("review"); setDocuSignChecked(false); }}
                            className="flex items-center gap-1.5 px-4 py-2 bg-[#4F8DFF] text-white rounded-lg hover:bg-[#3A7AE8] transition-colors text-sm"
                          >
                            <PenTool className="w-4 h-4" /> Sign
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    if (isStp) {
                      const product = localStorage.getItem("selected_product") || "receivable";
                      setShowStpBanner(true);
                      setStpRedirectTimer(10);
                    } else {
                      setPostApprovalStep(2);
                    }
                  }}
                  disabled={!allSigned}
                  className={`px-6 py-2.5 rounded-lg transition-colors text-sm font-medium ${allSigned ? "bg-[#4F8DFF] text-white hover:bg-[#3A7AE8]" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                >
                  Continue
                </button>
              </div>

              {/* STP Eligibility Banner after signing */}
              {allSigned && isStp && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                  <Zap className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800">STP Eligible — Fast-Track Approved</p>
                    <p className="text-xs text-green-600 mt-1">Your application qualifies for Straight Through Processing. The security step will be skipped and your account will be activated immediately after selecting your financing services.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Security Cheque or Direct Debit Mandate */}
          {postApprovalStep === 2 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Security Requirement</h3>
              <p className="text-gray-600 text-sm mb-1">Please provide security for the approved amount + 10%.</p>
              <p className="text-lg font-semibold text-gray-900 mb-6">Security Amount: {formatCurrencyLocal(securityAmount)}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => { setSecurityMethod("cheque"); setMandateConfirmed(false); }}
                  className={`border-2 rounded-xl p-6 text-left transition-all ${securityMethod === "cheque" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Upload Security Cheque</h4>
                  <p className="text-xs text-gray-500">Upload a scanned copy of a security cheque for {formatCurrencyLocal(securityAmount)}</p>
                </button>
                <button
                  onClick={() => { setSecurityMethod("mandate"); setSecurityChequeFile(null); }}
                  className={`border-2 rounded-xl p-6 text-left transition-all ${securityMethod === "mandate" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                    <Landmark className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">E-Sign Direct Debit Mandate</h4>
                  <p className="text-xs text-gray-500">E-sign a direct debit mandate via DocuSign for {formatCurrencyLocal(securityAmount)}</p>
                </button>
              </div>

              {securityMethod === "cheque" && (
                <div className="border border-gray-200 rounded-lg p-5 mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Upload Security Cheque</h4>
                  {securityChequeFile ? (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg flex-1 min-w-0">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-green-700 truncate">{securityChequeFile.name}</span>
                      </div>
                      <button onClick={() => setSecurityChequeFile(null)} className="p-1 text-gray-400 hover:text-red-600 transition-colors"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <>
                      <input type="file" id="security-cheque" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => { if (e.target.files?.[0]) setSecurityChequeFile(e.target.files[0]); }} />
                      <button onClick={() => document.getElementById("security-cheque")?.click()} className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2">
                        <Upload className="w-4 h-4" /> Upload Cheque (PDF, JPG, PNG)
                      </button>
                    </>
                  )}
                </div>
              )}

              {securityMethod === "mandate" && (
                <div className="border border-gray-200 rounded-lg p-5 mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Direct Debit Mandate</h4>
                  {mandateConfirmed ? (
                    <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-green-800">Direct Debit Mandate Signed via DocuSign</p>
                        <p className="text-xs text-green-600 mt-0.5">Mandate for {formatCurrencyLocal(securityAmount)} e-signed on {new Date().toLocaleDateString()}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-600 mb-4">E-sign a direct debit mandate for <span className="font-semibold text-gray-900">{formatCurrencyLocal(securityAmount)}</span> as security for your credit facility via DocuSign.</p>
                      <button onClick={openMandateFlow} className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center gap-2 mx-auto">
                        <PenTool className="w-4 h-4" /> E-Sign Mandate via DocuSign
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between">
                <button onClick={() => setPostApprovalStep(1)} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">Back</button>
                <button
                  onClick={() => {
                    const product = localStorage.getItem("selected_product") || "receivable";
                    localStorage.setItem("pending_financing_choice", product);
                    localStorage.setItem("merchant_underwriting_status", "security-pending");
                    window.dispatchEvent(new Event("demo-role-change"));
                    navigate('/applications');
                  }}
                  disabled={!securityComplete}
                  className={`px-6 py-2.5 rounded-lg transition-colors text-sm font-medium ${securityComplete ? "bg-[#4F8DFF] text-white hover:bg-[#3A7AE8]" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                >
                  Continue
                </button>
              </div>
            </div>
          )}



          {/* STP Auto-Approval Overlay */}
          {showStpBanner && (
            <div className="fixed inset-0 bg-[#CBD2DD]/[.72] flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-2xl p-10 text-center max-w-md mx-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">STP Auto-Approved</h2>
                <p className="text-gray-600 text-sm mb-4">You're auto-approved for security. Your dashboard is being enabled.</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800">Enabling dashboard in <span className="font-semibold">{stpRedirectTimer}</span> seconds...</p>
                </div>
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm font-medium">Activating your account...</span>
                </div>
              </div>
            </div>
          )}

          {/* Mock DocuSign Modal */}
          {docuSignDoc && (
            <div className="fixed inset-0 bg-[#CBD2DD]/[.72] flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] flex flex-col">
                {/* DocuSign Header */}
                <div className="bg-[#1a1a2e] px-6 py-3 rounded-t-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-7 h-7 bg-yellow-400 rounded flex items-center justify-center">
                        <PenTool className="w-4 h-4 text-[#1a1a2e]" />
                      </div>
                      <span className="text-white font-semibold text-sm">DocuSign</span>
                    </div>
                    <div className="h-5 w-px bg-gray-600" />
                    <span className="text-gray-300 text-xs">E-Signature</span>
                  </div>
                  <button onClick={() => setDocuSignDoc(null)} className="text-gray-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                </div>

                {/* DocuSign Body */}
                <div className="flex-1 overflow-y-auto p-6">
                  {docuSignStep === "review" && (
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Please review and sign</h3>
                        <p className="text-sm text-gray-500 mt-1">{docuSignDoc.label}</p>
                      </div>

                      {/* Mock document preview */}
                      <div className="border border-gray-200 rounded-lg bg-gray-50 p-8 space-y-6">
                        <div className="text-center border-b border-gray-300 pb-4">
                          <p className="text-xs text-gray-400 uppercase tracking-wider">Mal - Confidential</p>
                          <h4 className="text-xl font-bold text-gray-900 mt-2">{docuSignDoc.label}</h4>
                          <p className="text-xs text-gray-500 mt-1">Document ID: DOC-{Math.random().toString(36).substr(2, 8).toUpperCase()}</p>
                        </div>

                        <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                          <p>This agreement ("Agreement") is entered into between Mal ("the Bank") and Al Masraf Industries LLC ("the Client") on this date.</p>

                          <div>
                            <h5 className="font-semibold text-gray-900 mb-1">1. Definitions</h5>
                            <p>"Facility" means the credit facility granted by the Bank to the Client under the terms of this Agreement. "Effective Date" means the date on which all parties have executed this Agreement.</p>
                          </div>

                          <div>
                            <h5 className="font-semibold text-gray-900 mb-1">2. Terms and Conditions</h5>
                            <p>The Client agrees to comply with all terms and conditions set forth in this Agreement. The Bank reserves the right to modify terms with 30 days written notice.</p>
                          </div>

                          <div>
                            <h5 className="font-semibold text-gray-900 mb-1">3. Obligations</h5>
                            <p>The Client shall maintain accurate records and provide financial statements as requested. The Client shall notify the Bank of any material changes to its business operations.</p>
                          </div>

                          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-4">
                            <p className="text-xs text-yellow-800 font-medium">This is a mock document for demonstration purposes only.</p>
                          </div>
                        </div>

                        {/* Signature area */}
                        <div className="border-t border-gray-300 pt-4 mt-6">
                          <div className="grid grid-cols-2 gap-8">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Mal Representative</p>
                              <div className="border-b-2 border-gray-400 pb-1 italic text-gray-400 text-sm">Mal Authorized Signatory</div>
                              <p className="text-xs text-gray-400 mt-1">Date: {new Date().toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Client Signature</p>
                              <div className="border-2 border-dashed border-blue-400 bg-blue-50 rounded p-3 text-center cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => setDocuSignStep("signing")}>
                                <PenTool className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                                <p className="text-xs text-blue-600 font-medium">Click to sign here</p>
                              </div>
                              <p className="text-xs text-gray-400 mt-1">Ahmed Al Mansouri</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <button onClick={() => setDocuSignDoc(null)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">Cancel</button>
                        <button onClick={() => setDocuSignStep("signing")} className="px-6 py-2.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium flex items-center gap-2">
                          <PenTool className="w-4 h-4" /> Sign Document
                        </button>
                      </div>
                    </div>
                  )}

                  {docuSignStep === "signing" && (
                    <div className="space-y-6 text-center py-4">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                        <PenTool className="w-10 h-10 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Apply Your Signature</h3>
                        <p className="text-sm text-gray-500 mt-1">{docuSignDoc.label}</p>
                      </div>

                      {/* Mock signature pad */}
                      <div className="border-2 border-gray-300 rounded-lg bg-white p-8 max-w-md mx-auto">
                        <div className="border-b-2 border-gray-800 pb-2 mb-2">
                          <p className="text-2xl font-serif italic text-gray-800">Ahmed Al Mansouri</p>
                        </div>
                        <p className="text-xs text-gray-400">Digital Signature</p>
                      </div>

                      <label className="flex items-center gap-3 justify-center cursor-pointer">
                        <input type="checkbox" checked={docuSignChecked} onChange={(e) => setDocuSignChecked(e.target.checked)} className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500" />
                        <span className="text-sm text-gray-700">I agree to use electronic signatures and acknowledge this is legally binding</span>
                      </label>

                      <div className="flex justify-center gap-3">
                        <button onClick={() => setDocuSignStep("review")} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">Back</button>
                        <button
                          onClick={() => setDocuSignStep("complete")}
                          disabled={!docuSignChecked}
                          className={`px-6 py-2.5 rounded-lg transition-colors text-sm font-medium ${docuSignChecked ? "bg-yellow-500 text-white hover:bg-yellow-600" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                        >
                          Confirm Signature
                        </button>
                      </div>
                    </div>
                  )}

                  {docuSignStep === "complete" && (
                    <div className="space-y-6 text-center py-8">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Document Signed Successfully</h3>
                        <p className="text-sm text-gray-500 mt-1">{docuSignDoc.label}</p>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-sm mx-auto text-sm text-green-800">
                        <p>Signed by: Ahmed Al Mansouri</p>
                        <p>Date: {new Date().toLocaleString()}</p>
                        <p>IP: 192.168.x.x</p>
                      </div>
                      <button
                        onClick={() => {
                          setSignedAgreements({ ...signedAgreements, [docuSignDoc.key]: true });
                          setDocuSignDoc(null);
                        }}
                        className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        Done
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Mock Direct Debit Mandate — DocuSign E-Signing Modal */}
          {showMandateModal && (
            <div className="fixed inset-0 bg-[#CBD2DD]/[.72] flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] flex flex-col">
                {/* DocuSign Header */}
                <div className="bg-[#1a1a2e] px-6 py-3 rounded-t-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-7 h-7 bg-yellow-400 rounded flex items-center justify-center">
                        <PenTool className="w-4 h-4 text-[#1a1a2e]" />
                      </div>
                      <span className="text-white font-semibold text-sm">DocuSign</span>
                    </div>
                    <div className="h-5 w-px bg-gray-600" />
                    <span className="text-gray-300 text-xs">Direct Debit Mandate — E-Signature</span>
                  </div>
                  <button onClick={() => setShowMandateModal(false)} className="text-gray-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                </div>

                {/* DocuSign Body */}
                <div className="flex-1 overflow-y-auto p-6">
                  {mandateStep === "review" && (
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Please review and sign</h3>
                        <p className="text-sm text-gray-500 mt-1">Direct Debit Mandate Form</p>
                      </div>

                      {/* Mock mandate document preview */}
                      <div className="border border-gray-200 rounded-lg bg-gray-50 p-8 space-y-6">
                        <div className="text-center border-b border-gray-300 pb-4">
                          <p className="text-xs text-gray-400 uppercase tracking-wider">Mal - Direct Debit Authorization</p>
                          <h4 className="text-xl font-bold text-gray-900 mt-2">Direct Debit Mandate</h4>
                          <p className="text-xs text-gray-500 mt-1">Mandate Reference: DDM-{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                        </div>

                        <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-gray-500 text-xs">Creditor</p>
                              <p className="font-medium text-gray-900">Mal</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs">Debtor</p>
                              <p className="font-medium text-gray-900">Al Masraf Industries LLC</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs">Mandate Amount</p>
                              <p className="font-semibold text-gray-900 text-lg">{formatCurrencyLocal(securityAmount)}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs">Mandate Type</p>
                              <p className="font-medium text-gray-900">Security / Collateral</p>
                            </div>
                          </div>

                          <div>
                            <h5 className="font-semibold text-gray-900 mb-1">1. Authorization</h5>
                            <p>I/We hereby authorize Mal to debit my/our account for the amount specified above. This mandate serves as security for the credit facility and will only be executed in case of default on the financing agreement.</p>
                          </div>

                          <div>
                            <h5 className="font-semibold text-gray-900 mb-1">2. Terms</h5>
                            <p>This mandate shall remain in force until the credit facility is fully repaid or until cancelled by written notice from both parties. The Bank shall provide 5 business days notice before executing this mandate.</p>
                          </div>

                          <div>
                            <h5 className="font-semibold text-gray-900 mb-1">3. Account Details</h5>
                            <p>Bank: Emirates NBD · Account: ****2345 · IBAN: AE07 ****890</p>
                          </div>

                          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-4">
                            <p className="text-xs text-yellow-800 font-medium">This is a mock mandate for demonstration purposes only.</p>
                          </div>
                        </div>

                        {/* Signature area */}
                        <div className="border-t border-gray-300 pt-4 mt-6">
                          <div className="grid grid-cols-2 gap-8">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Mal Representative</p>
                              <div className="border-b-2 border-gray-400 pb-1 italic text-gray-400 text-sm">Mal Authorized Signatory</div>
                              <p className="text-xs text-gray-400 mt-1">Date: {new Date().toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Client Signature</p>
                              <div className="border-2 border-dashed border-blue-400 bg-blue-50 rounded p-3 text-center cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => setMandateStep("signing")}>
                                <PenTool className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                                <p className="text-xs text-blue-600 font-medium">Click to sign here</p>
                              </div>
                              <p className="text-xs text-gray-400 mt-1">Ahmed Al Mansouri</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <button onClick={() => setShowMandateModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">Cancel</button>
                        <button onClick={() => setMandateStep("signing")} className="px-6 py-2.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium flex items-center gap-2">
                          <PenTool className="w-4 h-4" /> Sign Mandate
                        </button>
                      </div>
                    </div>
                  )}

                  {mandateStep === "signing" && (
                    <div className="space-y-6 text-center py-4">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                        <PenTool className="w-10 h-10 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Apply Your Signature</h3>
                        <p className="text-sm text-gray-500 mt-1">Direct Debit Mandate — {formatCurrencyLocal(securityAmount)}</p>
                      </div>

                      {/* Mock signature pad */}
                      <div className="border-2 border-gray-300 rounded-lg bg-white p-8 max-w-md mx-auto">
                        <div className="border-b-2 border-gray-800 pb-2 mb-2">
                          <p className="text-2xl font-serif italic text-gray-800">Ahmed Al Mansouri</p>
                        </div>
                        <p className="text-xs text-gray-400">Digital Signature</p>
                      </div>

                      <label className="flex items-center gap-3 justify-center cursor-pointer">
                        <input type="checkbox" checked={mandateSignChecked} onChange={(e) => setMandateSignChecked(e.target.checked)} className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500" />
                        <span className="text-sm text-gray-700">I authorize this direct debit mandate and acknowledge this e-signature is legally binding</span>
                      </label>

                      <div className="flex justify-center gap-3">
                        <button onClick={() => setMandateStep("review")} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">Back</button>
                        <button
                          onClick={() => setMandateStep("complete")}
                          disabled={!mandateSignChecked}
                          className={`px-6 py-2.5 rounded-lg transition-colors text-sm font-medium ${mandateSignChecked ? "bg-yellow-500 text-white hover:bg-yellow-600" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                        >
                          Confirm Signature
                        </button>
                      </div>
                    </div>
                  )}

                  {mandateStep === "complete" && (
                    <div className="space-y-6 text-center py-8">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Mandate Signed Successfully</h3>
                        <p className="text-sm text-gray-500 mt-1">Your direct debit mandate has been e-signed via DocuSign</p>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-sm mx-auto text-sm text-green-800">
                        <p>Signed by: Ahmed Al Mansouri</p>
                        <p>Amount: {formatCurrencyLocal(securityAmount)}</p>
                        <p>Date: {new Date().toLocaleString()}</p>
                        <p>IP: 192.168.x.x</p>
                      </div>
                      <button
                        onClick={() => {
                          setMandateConfirmed(true);
                          setShowMandateModal(false);
                        }}
                        className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        Done
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Credit Limit Card */}
        <div className="mb-6">
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Wallet className="w-4 h-4 text-blue-600" />
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Credit Limit</p>
                  <span className="text-xs text-gray-400">·</span>
                  <span className="text-xs text-blue-600 font-medium">APP-2025-001</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{formatCurrency(approvedLimit)}</h2>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-xs">Available</p>
                <p className="text-lg font-semibold text-green-600">{formatCurrency(available)}</p>
              </div>
            </div>
            {role === "both" ? (
              <>
                <div className="w-full bg-gray-100 rounded-full h-3 flex overflow-hidden">
                  <div className="bg-green-500 h-3" style={{ width: `${receivablePct}%` }} />
                  <div className="bg-amber-500 h-3" style={{ width: `${payablePct}%` }} />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-xs text-gray-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
                      Receivable: {formatCurrency(receivableUtilised)}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-gray-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                      Payable: {formatCurrency(payableUtilised)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">{utilisationPct.toFixed(1)}% utilised</span>
                </div>
              </>
            ) : (
              <>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className={`${role === "receivable" ? "bg-green-500" : "bg-amber-500"} rounded-full h-2.5`} style={{ width: `${utilisationPct}%` }} />
                </div>
                <div className="flex justify-between text-xs mt-1.5">
                  <span className="text-gray-600">Utilised: {formatCurrency(utilised)}</span>
                  <span className="text-gray-400">{utilisationPct.toFixed(1)}%</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className={`grid grid-cols-2 ${filteredStats.length <= 3 ? "md:grid-cols-3" : "md:grid-cols-4"} gap-4 mb-6`}>
          {filteredStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} ${stat.color} p-2 rounded-lg`}>
                  <stat.icon className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Module Cards */}
        <div className={`grid grid-cols-1 ${filteredModules.length === 1 ? "md:grid-cols-1 max-w-lg" : filteredModules.length === 2 ? "md:grid-cols-2 max-w-3xl" : "md:grid-cols-2 lg:grid-cols-3"} gap-6 mb-6`}>
          {filteredModules.map((mod) => (
            <div key={mod.path} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 ${mod.iconBg} rounded-lg flex items-center justify-center`}>
                    <mod.icon className={`w-6 h-6 ${mod.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{mod.title}</h3>
                    <p className="text-sm text-gray-500">{mod.description}</p>
                  </div>
                </div>
                <div className="space-y-3 flex-1">
                  {mod.rows.map((row, idx) => (
                    <div key={idx} className={`flex items-center justify-between py-2 ${idx < mod.rows.length - 1 ? "border-b border-gray-100" : ""}`}>
                      <span className="text-sm text-gray-600">{row.label}</span>
                      <span className={`text-sm font-medium ${row.valueColor || "text-gray-900"}`}>{row.value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Link to={mod.path} className={`${mod.btnBg} text-white py-2 px-4 rounded-lg transition-colors font-medium text-sm text-center flex items-center justify-center gap-1.5`}>
                    <Eye className="w-4 h-4" /> View
                  </Link>
                  <Link to={`${mod.path}?add=true`} ref={mod.path === stpSpotlightPath ? stpTargetRef : undefined} onClick={() => setShowStpSpotlight(false)} className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm text-center flex items-center justify-center gap-1.5">
                    <Plus className="w-4 h-4" /> Add New
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* STP Spotlight */}
        {showStpSpotlight && stpTargetRef.current && (
          <Spotlight
            targetRef={stpTargetRef}
            message={role === "payable" ? "Start by adding your first supplier to begin payable financing." : "Start by adding your first invoice to begin financing."}
            onDismiss={() => setShowStpSpotlight(false)}
          />
        )}
      </div>
    </div>
  );
}


// --- Supplier-Only Dashboard (no financing) ---

type SupplierInvoiceStatus = "pending_risk_validation" | "approved" | "pending_disbursement" | "disbursed" | "rejected";

interface SupplierInvoiceRequest {
  id: string;
  buyerName: string;
  invoiceNumbers: string[];
  totalAmount: number;
  financingTenor: number;
  repaymentStructure: "bullet" | "installment";
  status: SupplierInvoiceStatus;
  submittedDate: string;
  approvedDate?: string;
  disbursedDate?: string;
  rejectionReason?: string;
  invoiceFiles: number;
}

const supplierInvoiceRequests: SupplierInvoiceRequest[] = [
  {
    id: "INV-REQ-001",
    buyerName: "Al Masraf Industries LLC",
    invoiceNumbers: ["FS-INV-2024-101", "FS-INV-2024-102"],
    totalAmount: 125000,
    financingTenor: 30,
    repaymentStructure: "bullet",
    status: "disbursed",
    submittedDate: "2024-03-05",
    approvedDate: "2024-03-06",
    disbursedDate: "2024-03-07",
    invoiceFiles: 2,
  },
  {
    id: "INV-REQ-002",
    buyerName: "Al Masraf Industries LLC",
    invoiceNumbers: ["FS-INV-2024-103", "FS-INV-2024-104"],
    totalAmount: 289500,
    financingTenor: 60,
    repaymentStructure: "installment",
    status: "disbursed",
    submittedDate: "2024-03-08",
    approvedDate: "2024-03-09",
    disbursedDate: "2024-03-10",
    invoiceFiles: 2,
  },
  {
    id: "INV-REQ-003",
    buyerName: "Al Masraf Industries LLC",
    invoiceNumbers: ["FS-INV-2024-105"],
    totalAmount: 78000,
    financingTenor: 90,
    repaymentStructure: "bullet",
    status: "disbursed",
    submittedDate: "2024-03-10",
    approvedDate: "2024-03-11",
    disbursedDate: "2024-03-12",
    invoiceFiles: 1,
  },
  {
    id: "INV-REQ-004",
    buyerName: "Al Masraf Industries LLC",
    invoiceNumbers: ["FS-INV-2024-106"],
    totalAmount: 156000,
    financingTenor: 45,
    repaymentStructure: "installment",
    status: "approved",
    submittedDate: "2024-03-14",
    approvedDate: "2024-03-15",
    invoiceFiles: 1,
  },
  {
    id: "INV-REQ-005",
    buyerName: "Al Masraf Industries LLC",
    invoiceNumbers: ["FS-INV-2024-107", "FS-INV-2024-108"],
    totalAmount: 234000,
    financingTenor: 60,
    repaymentStructure: "bullet",
    status: "pending_disbursement",
    submittedDate: "2024-03-16",
    approvedDate: "2024-03-17",
    invoiceFiles: 2,
  },
  {
    id: "INV-REQ-006",
    buyerName: "Al Masraf Industries LLC",
    invoiceNumbers: ["FS-INV-2024-109"],
    totalAmount: 412000,
    financingTenor: 120,
    repaymentStructure: "installment",
    status: "pending_risk_validation",
    submittedDate: "2024-03-18",
    invoiceFiles: 1,
  },
  {
    id: "INV-REQ-007",
    buyerName: "Al Masraf Industries LLC",
    invoiceNumbers: ["FS-INV-2024-110"],
    totalAmount: 95000,
    financingTenor: 30,
    repaymentStructure: "bullet",
    status: "pending_risk_validation",
    submittedDate: "2024-03-19",
    invoiceFiles: 1,
  },
  {
    id: "INV-REQ-008",
    buyerName: "Al Masraf Industries LLC",
    invoiceNumbers: ["FS-INV-2024-111", "FS-INV-2024-112"],
    totalAmount: 178000,
    financingTenor: 60,
    repaymentStructure: "installment",
    status: "rejected",
    submittedDate: "2024-03-12",
    rejectionReason: "Buyer credit limit exceeded",
    invoiceFiles: 2,
  },
];

function SupplierOnlyDashboard() {
  const [selectedRequest, setSelectedRequest] = useState<SupplierInvoiceRequest | null>(null);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

  const getStatusConfig = (status: SupplierInvoiceStatus) => {
    const map: Record<SupplierInvoiceStatus, { color: string; icon: typeof Clock; label: string }> = {
      pending_risk_validation: { color: "bg-yellow-100 text-yellow-700", icon: Clock, label: "Risk Validation" },
      approved: { color: "bg-green-100 text-green-700", icon: CheckCircle, label: "Approved" },
      pending_disbursement: { color: "bg-amber-100 text-amber-700", icon: Clock, label: "Pending Disbursement" },
      disbursed: { color: "bg-emerald-100 text-emerald-700", icon: DollarSign, label: "Disbursed" },
      rejected: { color: "bg-red-100 text-red-700", icon: X, label: "Rejected" },
    };
    return map[status];
  };

  const renderStatusBadge = (status: SupplierInvoiceStatus) => {
    const config = getStatusConfig(status);
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const approvedValue = supplierInvoiceRequests.filter(r => r.status === "approved" || r.status === "pending_disbursement" || r.status === "disbursed").reduce((s, r) => s + r.totalAmount, 0);
  const disbursedValue = supplierInvoiceRequests.filter(r => r.status === "disbursed").reduce((s, r) => s + r.totalAmount, 0);
  const pendingValue = supplierInvoiceRequests.filter(r => r.status === "pending_risk_validation" || r.status === "pending_disbursement").reduce((s, r) => s + r.totalAmount, 0);

  const stats = [
    { label: "Total Requests", value: String(supplierInvoiceRequests.length), icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Approved", value: formatCurrency(approvedValue), icon: DollarSign, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Disbursed", value: formatCurrency(disbursedValue), icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
    { label: "Pending", value: formatCurrency(pendingValue), icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">{s.label}</p>
                  <p className="text-lg font-semibold text-gray-900">{s.value}</p>
                </div>
                <div className={`${s.bg} ${s.color} p-2 rounded-lg`}>
                  <s.icon className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Invoice Requests Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Invoice Requests</h2>
            <p className="text-sm text-gray-500 mt-0.5">Invoices submitted by your associated buyer for financing</p>
          </div>
          <div className="p-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#E6F0FF]">
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">Request ID</th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">Buyer</th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">Invoice Numbers</th>
                  <th className="text-right py-3 px-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">Tenor</th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">Repayment</th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">Submitted</th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {supplierInvoiceRequests.map((req) => (
                  <tr key={req.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-3 font-medium text-gray-900">{req.id}</td>
                    <td className="py-3 px-3 text-gray-600">{req.buyerName}</td>
                    <td className="py-3 px-3 text-gray-600">{req.invoiceNumbers.join(", ")}</td>
                    <td className="py-3 px-3 text-right font-medium text-gray-900">{formatCurrency(req.totalAmount)}</td>
                    <td className="py-3 px-3 text-gray-600">{req.financingTenor} days</td>
                    <td className="py-3 px-3 text-gray-600 capitalize">{req.repaymentStructure}</td>
                    <td className="py-3 px-3 text-gray-600">{req.submittedDate}</td>
                    <td className="py-3 px-3">{renderStatusBadge(req.status)}</td>
                    <td className="py-3 px-3">
                      <button 
                        onClick={() => setSelectedRequest(req)} 
                        className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 text-sm"
                      >
                        <Eye className="w-4 h-4" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-[#CBD2DD]/[.72] flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="px-5 py-3 flex items-center justify-between bg-[#C3D2E7] text-gray-900 rounded-t">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Invoice Request Details</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{selectedRequest.id}</p>
                </div>
                <button onClick={() => setSelectedRequest(null)} className="text-gray-500 hover:text-gray-900">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-2 mb-2">{renderStatusBadge(selectedRequest.status)}</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-500">Buyer</p>
                    <p className="font-medium text-gray-900">{selectedRequest.buyerName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Amount</p>
                    <p className="font-medium text-gray-900">{formatCurrency(selectedRequest.totalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Invoice Numbers</p>
                    <p className="font-medium text-gray-900">{selectedRequest.invoiceNumbers.join(", ")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Financing Tenor</p>
                    <p className="font-medium text-gray-900">{selectedRequest.financingTenor} days</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Repayment Structure</p>
                    <p className="font-medium text-gray-900 capitalize">{selectedRequest.repaymentStructure}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Submitted</p>
                    <p className="font-medium text-gray-900">{selectedRequest.submittedDate}</p>
                  </div>
                  {selectedRequest.approvedDate && (
                    <div>
                      <p className="text-xs text-gray-500">Approved</p>
                      <p className="font-medium text-gray-900">{selectedRequest.approvedDate}</p>
                    </div>
                  )}
                  {selectedRequest.disbursedDate && (
                    <div>
                      <p className="text-xs text-gray-500">Disbursed</p>
                      <p className="font-medium text-gray-900">{selectedRequest.disbursedDate}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-500">Invoice Files</p>
                    <p className="font-medium text-gray-900">{selectedRequest.invoiceFiles} file(s)</p>
                  </div>
                  {selectedRequest.rejectionReason && (
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500">Rejection Reason</p>
                      <p className="font-medium text-red-600">{selectedRequest.rejectionReason}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="px-5 py-3 border-t border-gray-200">
                <button 
                  onClick={() => setSelectedRequest(null)} 
                  className="w-full py-2 bg-[#4F8DFF] text-white rounded hover:bg-[#3A7AE8] text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
