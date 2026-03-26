import { useState, Fragment } from "react";
import { useNavigate } from "react-router";
import { FileText, ChevronDown, ChevronUp, Upload, CheckCircle, Clock, AlertCircle, MoreVertical, X, ShieldCheck, ArrowLeft } from "lucide-react";

type AppStatus = "in_progress" | "kyc_verification" | "analysis" | "credit_decisioning" | "invoice_processing" | "security_onboarding" | "limit_approved" | "rejected";

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
  documents: DocumentRequest[];
}

const STATUS_CONFIG: Record<AppStatus, { label: string; color: string; icon: typeof Clock }> = {
  in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-700", icon: Clock },
  kyc_verification: { label: "KYC Verification", color: "bg-purple-100 text-purple-700", icon: Clock },
  analysis: { label: "Analysis", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  credit_decisioning: { label: "Credit Decisioning", color: "bg-orange-100 text-orange-700", icon: Clock },
  invoice_processing: { label: "Invoice Processing", color: "bg-cyan-100 text-cyan-700", icon: Clock },
  security_onboarding: { label: "Security Onboarding", color: "bg-amber-100 text-amber-700", icon: ShieldCheck },
  limit_approved: { label: "Limit Approved", color: "bg-green-100 text-green-700", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700", icon: AlertCircle },
};

const MOCK_APPLICATIONS: Application[] = [
  {
    id: "APP-2025-001",
    product: "Receivable Invoice Financing",
    businessName: "Al Masraf Industries LLC",
    financeAmount: "AED 5,000,000",
    relationshipManager: "Sarah Al Maktoum",
    status: "security_onboarding",
    documents: [
      { id: "d1", name: "Audited Financial Statements (FY23, FY24)", uploaded: true, fileName: "AuditedFS-2023-2024.pdf" },
      { id: "d2", name: "Bank Account Statements (Last 6 months)", uploaded: true, fileName: "BankStatements-6M.pdf" },
      { id: "d3", name: "Debt Profile / Schedule of Borrowings", uploaded: false },
      { id: "d4", name: "Receivables Aging Report", uploaded: false },
    ],
  },
  {
    id: "APP-2025-002",
    product: "Payable Invoice Financing",
    businessName: "Al Masraf Industries LLC",
    financeAmount: "AED 2,500,000",
    relationshipManager: "Sarah Al Maktoum",
    status: "credit_decisioning",
    documents: [
      { id: "d5", name: "Audited Financial Statements (FY23, FY24)", uploaded: true, fileName: "AuditedFS-PIF.pdf" },
      { id: "d6", name: "Supplier Agreements", uploaded: true, fileName: "SupplierAgreements.pdf" },
      { id: "d7", name: "Purchase Orders (Last 12 months)", uploaded: false },
    ],
  },
  {
    id: "APP-2025-003",
    product: "Receivable Invoice Financing",
    businessName: "Al Masraf Industries LLC",
    financeAmount: "AED 1,000,000",
    relationshipManager: "Omar Al Farsi",
    status: "kyc_verification",
    documents: [
      { id: "d8", name: "Updated Trade License", uploaded: false },
      { id: "d9", name: "Board Resolution", uploaded: false },
    ],
  },
  {
    id: "APP-2024-010",
    product: "Receivable Invoice Financing",
    businessName: "Al Masraf Industries LLC",
    financeAmount: "AED 3,000,000",
    relationshipManager: "Sarah Al Maktoum",
    status: "limit_approved",
    documents: [],
  },
];

interface ApplicationsModuleProps {
  onSecurityOnboarding?: (appId: string) => void;
  embedded?: boolean;
}

export function ApplicationsModule({ onSecurityOnboarding, embedded }: ApplicationsModuleProps) {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>(MOCK_APPLICATIONS);
  const [expandedDocs, setExpandedDocs] = useState<string | null>(null);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

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
  };

  return (
    <div className={embedded ? "" : "min-h-screen bg-gray-50"}>
      <div className="p-6 max-w-7xl mx-auto">
      <button onClick={() => { if (embedded) { localStorage.setItem("merchant_underwriting_status", "none"); window.dispatchEvent(new Event("demo-role-change")); } navigate('/'); }} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Your Loan Applications</h2>
          <p className="text-sm text-gray-500 mt-1">Track and manage your financing applications</p>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="text-left px-3 py-2.5 font-medium">Application ID</th>
                <th className="text-left px-3 py-2.5 font-medium">Product</th>
                <th className="text-left px-3 py-2.5 font-medium">Business Name</th>
                <th className="text-left px-3 py-2.5 font-medium">Amount</th>
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
                            {app.status === "security_onboarding" && onSecurityOnboarding && (
                              <button onClick={() => { onSecurityOnboarding(app.id); setActionMenuOpen(null); }} className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Complete Security
                              </button>
                            )}
                            <button onClick={() => setActionMenuOpen(null)} className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                              <FileText className="w-3.5 h-3.5 text-blue-600" /> View Details
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                    {isExpanded && app.documents.length > 0 && (
                      <tr>
                        <td colSpan={8} className="px-0 py-0">
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
                                    <label className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer text-[11px] font-medium">
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
    </div>
    </div>
  );
}
