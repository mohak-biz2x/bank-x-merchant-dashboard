import { useState, Fragment, useEffect } from "react";
import { useNavigate } from "react-router";
import { FileText, ChevronDown, ChevronUp, Upload, CheckCircle, Clock, AlertCircle, MoreVertical, X, ShieldCheck, ArrowLeft, XCircle, MinusCircle } from "lucide-react";
import { showToast } from "./Toast";
import { AgreementSigningModal } from "./AgreementSigningModal";

type AppStatus = "in_review" | "approved" | "offer_accepted" | "pending_agreements_signing" | "pending_security_cheque" | "drawdown" | "application_declined" | "offer_declined" | "application_withdrawn";

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
  in_review: { label: "In Review", color: "bg-blue-100 text-blue-700", icon: Clock },
  approved: { label: "Approved", color: "bg-green-100 text-green-700", icon: CheckCircle },
  offer_accepted: { label: "Offer Accepted", color: "bg-green-100 text-green-700", icon: CheckCircle },
  pending_agreements_signing: { label: "Pending Agreements Signing", color: "bg-amber-100 text-amber-700", icon: ShieldCheck },
  pending_security_cheque: { label: "Pending Security Cheque", color: "bg-amber-100 text-amber-700", icon: Clock },
  drawdown: { label: "Drawdown", color: "bg-green-100 text-green-700", icon: CheckCircle },
  application_declined: { label: "Application Declined", color: "bg-red-100 text-red-700", icon: XCircle },
  offer_declined: { label: "Offer Declined", color: "bg-red-100 text-red-700", icon: AlertCircle },
  application_withdrawn: { label: "Application Withdrawn", color: "bg-gray-100 text-gray-700", icon: MinusCircle },
};

function getSingleDataset(): Application[] {
  const product = localStorage.getItem("selected_product") || "receivable";
  const productLabel = product === "payable" ? "Payable Invoice Financing" : "Receivable Invoice Financing";
  const uwStatus = localStorage.getItem("merchant_underwriting_status") || "pending";
  const appStatus: AppStatus = uwStatus === "none" ? "drawdown" : uwStatus === "approved" ? "pending_agreements_signing" : uwStatus === "security-pending" ? "pending_security_cheque" : "in_review";
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
      status: "drawdown",
      limitExpiry: "2026-03-15",
      documents: [],
    },
    {
      id: "APP-2025-002",
      product: productLabel,
      businessName: "Al Masraf Industries LLC",
      financeAmount: "AED 2,500,000",
      relationshipManager: "Sarah Al Maktoum",
      status: "pending_agreements_signing",
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
      status: "in_review",
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
      status: "drawdown",
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

  // Agreement signing modal state (non-STP path only)
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const isStp = (localStorage.getItem("demo_stp_eligibility") || "approved") === "approved";

  useEffect(() => {
    const onDataChange = () => setApplications(getDataset());
    window.addEventListener("demo-role-change", onDataChange);
    return () => window.removeEventListener("demo-role-change", onDataChange);
  }, []);

  // Auto-open agreement signing modal when an application is in pending_agreements_signing status (non-STP only)
  useEffect(() => {
    const secApp = applications.find(a => a.status === "pending_agreements_signing");
    if (secApp && !isStp && !showAgreementModal) {
      setShowAgreementModal(true);
    }
  }, [applications]);


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
                            {app.status === "pending_agreements_signing" && (
                              <button onClick={() => {
                                setShowAgreementModal(true);
                                setActionMenuOpen(null);
                              }} className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Sign Agreements
                              </button>
                            )}
                            {app.status !== "pending_agreements_signing" && (
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

      {/* Agreement Signing Modal (non-STP path) */}
      <AgreementSigningModal
        isOpen={showAgreementModal}
        onClose={() => setShowAgreementModal(false)}
        onComplete={() => setShowAgreementModal(false)}
        approvedLimit={5000000}
        entityName="Al Masraf Industries LLC"
        applicationId="APP-2025-001"
      />
    </div>
  );
}
