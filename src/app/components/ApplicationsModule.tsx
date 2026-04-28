import { useState, Fragment, useEffect } from "react";
import { useNavigate } from "react-router";
import { FileText, ChevronDown, ChevronUp, Upload, CheckCircle, Clock, AlertCircle, MoreVertical, X, ShieldCheck, ArrowLeft, PenTool, Loader2, Zap } from "lucide-react";
import { showToast } from "./Toast";
import { DocuSignModal } from "./DocuSignModal";

type AppStatus = "under_review" | "in_progress" | "kyc_verification" | "analysis" | "credit_decisioning" | "invoice_processing" | "security_onboarding" | "security_verification" | "limit_approved" | "rejected";

interface DocumentRequest {
  id: string;
  name: string;
  uploaded: boolean;
  fileName?: string;
}

interface Application {
  id: string;
  product: string;
  businessName: string;
  financeAmount: string;
  relationshipManager: string;
  status: AppStatus;
  limitExpiry?: string;
  documents: DocumentRequest[];
}

const STATUS_CONFIG: Record<AppStatus, { label: string; color: string; icon: typeof Clock }> = {
  under_review: { label: "Under Review", color: "bg-blue-100 text-blue-700", icon: Clock },
  in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-700", icon: Clock },
  kyc_verification: { label: "KYC Verification", color: "bg-purple-100 text-purple-700", icon: Clock },
  analysis: { label: "Analysis", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  credit_decisioning: { label: "Credit Decisioning", color: "bg-orange-100 text-orange-700", icon: Clock },
  invoice_processing: { label: "Invoice Processing", color: "bg-cyan-100 text-cyan-700", icon: Clock },
  security_onboarding: { label: "Security Onboarding", color: "bg-amber-100 text-amber-700", icon: ShieldCheck },
  security_verification: { label: "Security Verification", color: "bg-indigo-100 text-indigo-700", icon: Clock },
  limit_approved: { label: "Limit Approved", color: "bg-green-100 text-green-700", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700", icon: AlertCircle },
};

function getSingleDataset(): Application[] {
  const product = localStorage.getItem("selected_product") || "receivable";
  const productLabel = product === "payable" ? "Payable Invoice Financing" : "Receivable Invoice Financing";
  const uwStatus = localStorage.getItem("merchant_underwriting_status") || "pending";
  const appStatus: AppStatus = uwStatus === "none" ? "limit_approved" : uwStatus === "approved" ? "security_onboarding" : uwStatus === "security-pending" ? "security_verification" : "under_review";
  return [{
    id: "APP-2025-001",
    product: productLabel,
    businessName: "Al Masraf Industries LLC",
    financeAmount: "AED 5,000,000",
    relationshipManager: "Sarah Al Maktoum",
    status: appStatus,
    limitExpiry: "2028-03-26",
    documents: [
      { id: "d1", name: "Audited Financial Statements (FY23, FY24)", uploaded: false },
      { id: "d2", name: "Bank Account Statements (Last 6 months)", uploaded: false },
      { id: "d3", name: "Debt Profile / Schedule of Borrowings", uploaded: false },
      { id: "d4", name: "Receivables Aging Report", uploaded: false },
    ],
  }];
}

function getMultiDataset(): Application[] {
  const product = localStorage.getItem("selected_product") || "receivable";
  const productLabel = product === "payable" ? "Payable Invoice Financing" : "Receivable Invoice Financing";
  return [
    {
      id: "APP-2025-001",
      product: productLabel,
      businessName: "Al Masraf Industries LLC",
      financeAmount: "AED 5,000,000",
      relationshipManager: "Sarah Al Maktoum",
      status: "limit_approved",
      limitExpiry: "2026-03-15",
      documents: [],
    },
    {
      id: "APP-2025-002",
      product: productLabel,
      businessName: "Al Masraf Industries LLC",
      financeAmount: "AED 2,500,000",
      relationshipManager: "Sarah Al Maktoum",
      status: "security_onboarding",
      limitExpiry: "2026-06-30",
      documents: [
        { id: "d5", name: "Audited Financial Statements (FY24, FY25)", uploaded: true, fileName: "AuditedFS-2024-2025.pdf" },
        { id: "d6", name: "Updated Bank Statements", uploaded: false },
      ],
    },
    {
      id: "APP-2024-008",
      product: productLabel,
      businessName: "Al Masraf Industries LLC",
      financeAmount: "AED 3,000,000",
      relationshipManager: "Omar Al Farsi",
      status: "credit_decisioning",
      limitExpiry: "2026-09-30",
      documents: [
        { id: "d7", name: "Revised Financial Projections", uploaded: false },
        { id: "d8", name: "Board Resolution for Limit Enhancement", uploaded: false },
      ],
    },
    {
      id: "APP-2024-005",
      product: productLabel,
      businessName: "Al Masraf Industries LLC",
      financeAmount: "AED 1,500,000",
      relationshipManager: "Sarah Al Maktoum",
      status: "limit_approved",
      limitExpiry: "2025-12-31",
      documents: [],
    },
  ];
}

function getDataset(): Application[] {
  const ds = localStorage.getItem("demo_app_dataset") || "single";
  return ds === "multi" ? getMultiDataset() : getSingleDataset();
}

interface ApplicationsModuleProps {
  onSecurityOnboarding?: (appId: string) => void;
  embedded?: boolean;
}

export function ApplicationsModule({ onSecurityOnboarding, embedded }: ApplicationsModuleProps) {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>(getDataset);
  const [expandedDocs, setExpandedDocs] = useState<string | null>(null);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  // Security onboarding modal state
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [securityStep, setSecurityStep] = useState(1); // 1=agreements, 2=security
  const [signedAgreements, setSignedAgreements] = useState<Record<string, boolean>>({ financing: false, assignmentReceivables: false, directDebit: false });
  const [securityChequeFile, setSecurityChequeFile] = useState<File | null>(null);
  const [showStpSuccess, setShowStpSuccess] = useState(false);
  const [stpTimer, setStpTimer] = useState(10);
  const [docuSignDoc, setDocuSignDoc] = useState<{ key: string; label: string } | null>(null);
  const isStp = (localStorage.getItem("demo_stp_eligibility") || "approved") === "approved";

  useEffect(() => {
    const onDataChange = () => setApplications(getDataset());
    window.addEventListener("demo-role-change", onDataChange);
    return () => window.removeEventListener("demo-role-change", onDataChange);
  }, []);

  // STP auto-redirect countdown
  useEffect(() => {
    if (!showStpSuccess) return;
    if (stpTimer <= 0) {
      const product = localStorage.getItem("selected_product") || "receivable";
      localStorage.setItem("demo_merchant_role", product);
      localStorage.setItem("merchant_underwriting_status", "none");
      localStorage.removeItem("pending_financing_choice");
      window.dispatchEvent(new Event("demo-role-change"));
      setShowSecurityModal(false);
      setShowStpSuccess(false);
      navigate('/');
      return;
    }
    const t = setTimeout(() => setStpTimer(prev => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [showStpSuccess, stpTimer, navigate]);

  const toggleDocs = (appId: string) => {
    setExpandedDocs(expandedDocs === appId ? null : appId);
    setActionMenuOpen(null);
  };

  const toggleActionMenu = (appId: string) => {
    setActionMenuOpen(actionMenuOpen === appId ? null : appId);
  };

  const handleDocUpload = (appId: string, docId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setApplications(prev => prev.map(app =>
      app.id === appId ? { ...app, documents: app.documents.map(d => d.id === docId ? { ...d, uploaded: true, fileName: file.name } : d) } : app
    ));
    showToast("success", `Document "${file.name}" uploaded successfully.`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {((localStorage.getItem("demo_app_dataset") || "single") !== "single" || (localStorage.getItem("merchant_underwriting_status") || "pending") === "none") && (
        <button onClick={() => { if (embedded) { localStorage.setItem("merchant_underwriting_status", "none"); window.dispatchEvent(new Event("demo-role-change")); } navigate('/'); }} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Go to Dashboard
        </button>
      )}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Your Loan Applications</h2>
          <p className="text-sm text-gray-500 mt-1">Track and manage your financing applications</p>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div>
          <table className="w-full text-xs">
            <thead className="bg-[#E6F0FF]">
              <tr>
                <th className="text-left px-3 py-2.5 font-medium">Application ID</th>
                <th className="text-left px-3 py-2.5 font-medium">Product</th>
                <th className="text-left px-3 py-2.5 font-medium">Business Name</th>
                <th className="text-left px-3 py-2.5 font-medium">Approved Limit</th>
                <th className="text-left px-3 py-2.5 font-medium">Limit Expiry</th>
                <th className="text-left px-3 py-2.5 font-medium">RM</th>
                <th className="text-left px-3 py-2.5 font-medium">Status</th>
                <th className="text-left px-3 py-2.5 font-medium">Documents</th>
                <th className="text-center px-3 py-2.5 font-medium w-16">Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => {
                const statusCfg = STATUS_CONFIG[app.status];
                const pendingDocs = app.documents.filter(d => !d.uploaded).length;
                const isExpanded = expandedDocs === app.id;
                return (
                  <Fragment key={app.id}>
                    <tr className={`border-t border-gray-100 hover:bg-gray-50 transition-colors ${isExpanded ? 'bg-blue-50/40' : ''}`}>
                      <td className="px-3 py-2.5 font-medium text-gray-900">{app.id}</td>
                      <td className="px-3 py-2.5 text-gray-700">{app.product}</td>
                      <td className="px-3 py-2.5 text-gray-700">{app.businessName}</td>
                      <td className="px-3 py-2.5 text-gray-900 font-medium">{app.financeAmount}</td>
                      <td className="px-3 py-2.5 text-gray-600">{app.limitExpiry || "—"}</td>
                      <td className="px-3 py-2.5 text-gray-700">{app.relationshipManager}</td>
                      <td className="px-3 py-2.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${statusCfg.color}`}>
                          <statusCfg.icon className="w-3 h-3" /> {statusCfg.label}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        {app.documents.length > 0 ? (
                          <button onClick={() => toggleDocs(app.id)} className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
                            Docs {pendingDocs > 0 && <span className="bg-red-100 text-red-700 px-1 py-0.5 rounded-full text-[10px] leading-none">{pendingDocs}</span>}
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-center relative">
                        <button onClick={() => toggleActionMenu(app.id)} className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100">
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                        {actionMenuOpen === app.id && (
                          <div className="absolute right-3 top-8 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                            {app.status === "security_onboarding" && (
                              <button onClick={() => {
                                setShowSecurityModal(true);
                                setSecurityStep(1);
                                setSignedAgreements({ financing: false, assignmentReceivables: false, directDebit: false });
                                setSecurityChequeFile(null);
                                setActionMenuOpen(null);
                              }} className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Complete Security
                              </button>
                            )}
                            {app.status !== "security_onboarding" && (
                              <p className="px-3 py-2 text-xs text-gray-400">No actions accessible</p>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                    {isExpanded && app.documents.length > 0 && (
                      <tr>
                        <td colSpan={9} className="px-0 py-0">
                          <div className="bg-gray-50 border-t border-b border-gray-200 px-6 py-3">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-xs font-medium text-gray-700">Documents — {app.id}</p>
                              <button onClick={() => setExpandedDocs(null)} className="text-gray-400 hover:text-gray-600"><X className="w-3.5 h-3.5" /></button>
                            </div>
                            <div className="space-y-2">
                              {app.documents.map(doc => (
                                <div key={doc.id} className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-2">
                                  <div className="flex items-center gap-2 flex-1">
                                    <FileText className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                    <span className="text-xs text-gray-700">{doc.name}</span>
                                  </div>
                                  {doc.uploaded ? (
                                    <div className="flex items-center gap-1.5">
                                      <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                                      <span className="text-[11px] text-green-700">{doc.fileName}</span>
                                    </div>
                                  ) : (
                                    <label className="flex items-center gap-1 px-2.5 py-1 bg-[#4F8DFF] text-white rounded hover:bg-[#3A7AE8] cursor-pointer text-[11px] font-medium">
                                      <Upload className="w-3 h-3" /> Upload
                                      <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={e => handleDocUpload(app.id, doc.id, e)} />
                                    </label>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Onboarding Modal */}
      {showSecurityModal && (
        <div className="fixed inset-0 bg-[#CBD2DD]/[.72] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded max-w-2xl w-full max-h-[85vh] overflow-y-auto">
            <div className="px-5 py-3 flex items-center justify-between bg-[#C3D2E7] text-gray-900 rounded-t">
              <h3 className="text-base font-semibold text-gray-900">{isStp ? "E-sign Agreements" : "Security Onboarding"}</h3>
              <button onClick={() => setShowSecurityModal(false)} className="text-gray-500 hover:text-gray-900"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5">

            {/* Step indicators */}
            {!isStp && (
              <div className="flex items-center justify-center gap-2 mb-6">
                {[{ id: 1, name: "Digital Agreements" }, { id: 2, name: "Upload Cheque" }].map((s, i) => (
                  <div key={s.id} className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${securityStep > s.id ? "bg-green-600 text-white" : securityStep === s.id ? "bg-[#4F8DFF] text-white" : "bg-gray-200 text-gray-500"}`}>
                      {securityStep > s.id ? <CheckCircle className="w-3.5 h-3.5" /> : s.id}
                    </div>
                    <span className={`text-xs ${securityStep === s.id ? "font-medium text-gray-900" : "text-gray-500"}`}>{s.name}</span>
                    {i === 0 && <div className="w-10 h-px bg-gray-300 mx-1" />}
                  </div>
                ))}
              </div>
            )}

            {/* Step 1: Agreements */}
            {securityStep === 1 && !showStpSuccess && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">Sign Digital Agreements</h4>
                <p className="text-xs text-gray-500 mb-4">Review and e-sign the following agreements to proceed.</p>
                <div className="space-y-3">
                  {[
                    { key: "financing", label: "Financing Agreement", desc: "Master financing agreement covering terms, rates, and conditions" },
                    { key: "assignmentReceivables", label: "Assignment of Receivables", desc: "Agreement to assign eligible receivables as collateral" },
                    { key: "directDebit", label: "Direct Debit Agreement", desc: "Authorization for automatic debit of repayment amounts from your account" },
                  ].map(ag => (
                    <div key={ag.key} className={`border rounded-lg p-4 ${signedAgreements[ag.key] ? "border-green-300 bg-green-50" : "border-gray-200"}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{ag.label}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{ag.desc}</p>
                        </div>
                        {signedAgreements[ag.key] ? (
                          <span className="flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium"><CheckCircle className="w-3.5 h-3.5" /> Signed</span>
                        ) : (
                          <button onClick={() => setDocuSignDoc({ key: ag.key, label: ag.label })} className="flex items-center gap-1 px-3 py-1.5 bg-[#4F8DFF] text-white rounded-lg hover:bg-[#3A7AE8] text-xs"><PenTool className="w-3.5 h-3.5" /> Sign</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {signedAgreements.financing && signedAgreements.assignmentReceivables && signedAgreements.directDebit && isStp && (
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
                    <Zap className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-green-800">STP Eligible — Security step will be skipped and your account activated immediately.</p>
                  </div>
                )}
                <div className="mt-5 flex justify-end">
                  <button
                    onClick={() => {
                      if (isStp) { setShowStpSuccess(true); setStpTimer(5); }
                      else { setSecurityStep(2); }
                    }}
                    disabled={!signedAgreements.financing || !signedAgreements.assignmentReceivables || !signedAgreements.directDebit}
                    className={`px-5 py-2 rounded-lg text-sm font-medium ${signedAgreements.financing && signedAgreements.assignmentReceivables && signedAgreements.directDebit ? "bg-[#4F8DFF] text-white hover:bg-[#3A7AE8]" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                  >{isStp ? "Submit" : "Continue"}</button>
                </div>
              </div>
            )}

            {/* Step 2: Upload Cheque (non-STP only) */}
            {securityStep === 2 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">Upload Security Cheque</h4>
                <p className="text-xs text-gray-500 mb-4">Upload a scanned security cheque to complete the security requirement.</p>
                <div className="border border-gray-200 rounded-lg p-4 mb-4">
                  {securityChequeFile ? (
                    <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /><span className="text-sm text-green-700">{securityChequeFile.name}</span><button onClick={() => setSecurityChequeFile(null)} className="text-gray-400 hover:text-red-500 ml-auto"><X className="w-4 h-4" /></button></div>
                  ) : (
                    <label className="flex flex-col items-center gap-2 py-4 cursor-pointer">
                      <Upload className="w-6 h-6 text-gray-400" />
                      <span className="text-sm text-blue-600 font-medium">Upload Security Cheque</span>
                      <span className="text-xs text-gray-400">PDF, JPG, or PNG</span>
                      <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={e => { if (e.target.files?.[0]) setSecurityChequeFile(e.target.files[0]); }} />
                    </label>
                  )}
                </div>
                <div className="flex justify-between">
                  <button onClick={() => setSecurityStep(1)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">Back</button>
                  <button
                    onClick={() => {
                      const product = localStorage.getItem("selected_product") || "receivable";
                      localStorage.setItem("pending_financing_choice", product);
                      localStorage.setItem("merchant_underwriting_status", "security-pending");
                      window.dispatchEvent(new Event("demo-role-change"));
                      setShowSecurityModal(false);
                      showToast("success", "Security cheque submitted successfully. Verification in progress.");
                    }}
                    disabled={!securityChequeFile}
                    className={`px-5 py-2 rounded-lg text-sm font-medium ${securityChequeFile ? "bg-[#4F8DFF] text-white hover:bg-[#3A7AE8]" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                  >Submit</button>
                </div>
              </div>
            )}

            {/* STP Success */}
            {showStpSuccess && (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><Zap className="w-8 h-8 text-green-600" /></div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">STP Auto-Approved</h4>
                <p className="text-sm text-gray-600 mb-4">You're auto-approved for security. Enabling dashboard...</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-blue-800">Redirecting in <span className="font-semibold">{stpTimer}</span> seconds...</p>
                </div>
                <div className="flex items-center justify-center gap-2 text-green-600"><Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm font-medium">Activating...</span></div>
              </div>
            )}
          </div>
          </div>
        </div>
      )}

      {/* DocuSign Simulation Modal */}
      {docuSignDoc && (
        <DocuSignModal
          documentTitle={docuSignDoc.label}
          entityName="Al Masraf Industries LLC"
          referenceId="APP-2025-001"
          onSign={() => {
            setSignedAgreements(prev => ({ ...prev, [docuSignDoc.key]: true }));
            showToast("success", `${docuSignDoc.label} signed successfully via DocuSign.`);
            setDocuSignDoc(null);
          }}
          onClose={() => setDocuSignDoc(null)}
        />
      )}
    </div>
  );
}
