import { CheckCircle, XCircle, FileText, Download, Eye, Clock, Building2, Calendar, DollarSign, AlertCircle } from "lucide-react";
import { useState } from "react";

interface InvoiceForApproval {
  id: string;
  sellerId: string;
  sellerName: string;
  invoiceNumbers: string[];
  totalAmount: number;
  bankFeeCoveredBy: "buyer" | "seller";
  submittedDate: string;
  invoiceFiles: number;
  supportingDocs: number;
  status: "pending_buyer_approval" | "approved" | "rejected";
  approvedDate?: string;
  rejectedDate?: string;
  rejectionReason?: string;
}

export function BuyerApprovalsModule() {
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceForApproval | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Mock data - Invoices pending buyer approval
  const [pendingInvoices, setPendingInvoices] = useState<InvoiceForApproval[]>([
    {
      id: "INV-2024-0145",
      sellerId: "SEL001",
      sellerName: "Dubai Steel Trading LLC",
      invoiceNumbers: ["DST-INV-2024-003", "DST-INV-2024-004"],
      totalAmount: 85000,
      bankFeeCoveredBy: "seller",
      submittedDate: "2024-03-15",
      invoiceFiles: 2,
      supportingDocs: 3,
      status: "pending_buyer_approval",
    },
    {
      id: "INV-2024-0146",
      sellerId: "SEL002",
      sellerName: "Emirates Equipment Supplies",
      invoiceNumbers: ["EES-INV-2024-012"],
      totalAmount: 42500,
      bankFeeCoveredBy: "buyer",
      submittedDate: "2024-03-16",
      invoiceFiles: 1,
      supportingDocs: 2,
      status: "pending_buyer_approval",
    },
    {
      id: "INV-2024-0147",
      sellerId: "SEL003",
      sellerName: "Sharjah Industrial Parts",
      invoiceNumbers: ["SIP-INV-2024-008"],
      totalAmount: 67800,
      bankFeeCoveredBy: "seller",
      submittedDate: "2024-03-17",
      invoiceFiles: 1,
      supportingDocs: 1,
      status: "pending_buyer_approval",
    },
  ]);

  // Mock data - Historical invoices (approved and rejected)
  const [historicalInvoices] = useState<InvoiceForApproval[]>([
    {
      id: "INV-2024-0142",
      sellerId: "SEL001",
      sellerName: "Dubai Steel Trading LLC",
      invoiceNumbers: ["DST-INV-2024-001", "DST-INV-2024-002"],
      totalAmount: 125000,
      bankFeeCoveredBy: "seller",
      submittedDate: "2024-03-10",
      approvedDate: "2024-03-11",
      invoiceFiles: 2,
      supportingDocs: 4,
      status: "approved",
    },
    {
      id: "INV-2024-0141",
      sellerId: "SEL004",
      sellerName: "Abu Dhabi Construction Materials",
      invoiceNumbers: ["ADCM-INV-2024-005"],
      totalAmount: 95500,
      bankFeeCoveredBy: "buyer",
      submittedDate: "2024-03-08",
      approvedDate: "2024-03-09",
      invoiceFiles: 1,
      supportingDocs: 2,
      status: "approved",
    },
    {
      id: "INV-2024-0140",
      sellerId: "SEL002",
      sellerName: "Emirates Equipment Supplies",
      invoiceNumbers: ["EES-INV-2024-010"],
      totalAmount: 38000,
      bankFeeCoveredBy: "seller",
      submittedDate: "2024-03-05",
      rejectedDate: "2024-03-06",
      rejectionReason: "Invoice amounts do not match purchase order values. Please verify and resubmit.",
      invoiceFiles: 1,
      supportingDocs: 1,
      status: "rejected",
    },
    {
      id: "INV-2024-0138",
      sellerId: "SEL005",
      sellerName: "Fujairah Metal Works LLC",
      invoiceNumbers: ["FMW-INV-2024-003"],
      totalAmount: 72300,
      bankFeeCoveredBy: "seller",
      submittedDate: "2024-03-01",
      approvedDate: "2024-03-02",
      invoiceFiles: 1,
      supportingDocs: 3,
      status: "approved",
    },
    {
      id: "INV-2024-0135",
      sellerId: "SEL003",
      sellerName: "Sharjah Industrial Parts",
      invoiceNumbers: ["SIP-INV-2024-006", "SIP-INV-2024-007"],
      totalAmount: 54200,
      bankFeeCoveredBy: "buyer",
      submittedDate: "2024-02-26",
      rejectedDate: "2024-02-27",
      rejectionReason: "Incomplete supporting documentation. Missing delivery receipts.",
      invoiceFiles: 2,
      supportingDocs: 1,
      status: "rejected",
    },
  ]);

  const handleApprove = (invoice: InvoiceForApproval) => {
    // Remove from pending list
    setPendingInvoices(pendingInvoices.filter((inv) => inv.id !== invoice.id));
    setShowDetailModal(false);
    setSelectedInvoice(null);
    // In real app, this would call an API to approve the invoice
  };

  const handleReject = () => {
    if (!selectedInvoice || !rejectionReason.trim()) return;
    
    // Remove from pending list
    setPendingInvoices(pendingInvoices.filter((inv) => inv.id !== selectedInvoice.id));
    setShowRejectModal(false);
    setShowDetailModal(false);
    setSelectedInvoice(null);
    setRejectionReason("");
    // In real app, this would call an API to reject the invoice with reason
  };

  const openDetailModal = (invoice: InvoiceForApproval) => {
    setSelectedInvoice(invoice);
    setShowDetailModal(true);
  };

  const openRejectModal = (invoice: InvoiceForApproval) => {
    setSelectedInvoice(invoice);
    setShowRejectModal(true);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Invoice Approvals</h1>
        <p className="text-sm text-gray-600">
          Review and approve invoices submitted by your suppliers for financing
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Approvals</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{pendingInvoices.length}</p>
            </div>
            <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Pending Amount</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {pendingInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0).toLocaleString()} AED
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {historicalInvoices.filter((inv) => inv.status === "approved").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab("pending")}
              className={`pb-3 px-1 border-b-2 text-sm font-medium transition-colors ${
                activeTab === "pending"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              Pending Invoices
              {pendingInvoices.length > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">
                  {pendingInvoices.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`pb-3 px-1 border-b-2 text-sm font-medium transition-colors ${
                activeTab === "history"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              History
            </button>
          </nav>
        </div>
      </div>

      {/* Pending Invoices List */}
      {activeTab === "pending" && (
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Pending Invoices</h2>
          </div>

          {pendingInvoices.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">All Caught Up!</h3>
              <p className="text-sm text-gray-600">No invoices pending your approval at the moment.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#E6F0FF] border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Supplier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice Numbers
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount (AED)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bank Fees
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">{invoice.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{invoice.sellerName}</div>
                        <div className="text-xs text-gray-500">{invoice.sellerId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {invoice.invoiceNumbers.map((num, idx) => (
                            <div key={idx}>{num}</div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          {invoice.totalAmount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          invoice.bankFeeCoveredBy === "buyer"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-green-100 text-green-800"
                        }`}>
                          {invoice.bankFeeCoveredBy === "buyer" ? "Paid by You" : "Paid by Supplier"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(invoice.submittedDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openDetailModal(invoice)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            Review
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Historical Invoices List */}
      {activeTab === "history" && (
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Invoice History</h2>
          </div>

          {historicalInvoices.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No History</h3>
              <p className="text-sm text-gray-600">No historical invoice approvals found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#E6F0FF] border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Supplier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice Numbers
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount (AED)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Decision Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {historicalInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">{invoice.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{invoice.sellerName}</div>
                        <div className="text-xs text-gray-500">{invoice.sellerId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {invoice.invoiceNumbers.map((num, idx) => (
                            <div key={idx}>{num}</div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          {invoice.totalAmount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {invoice.status === "approved" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3" />
                            Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <XCircle className="w-3 h-3" />
                            Rejected
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {invoice.status === "approved" && invoice.approvedDate
                            ? new Date(invoice.approvedDate).toLocaleDateString()
                            : invoice.rejectedDate
                            ? new Date(invoice.rejectedDate).toLocaleDateString()
                            : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => openDetailModal(invoice)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedInvoice && (
        <div className="fixed inset-0 bg-[#CBD2DD]/[.72] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Invoice Details</h2>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedInvoice(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Invoice Information */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Invoice Information</h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                  <div>
                    <p className="text-xs text-gray-600">Invoice Request ID</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">{selectedInvoice.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Submitted Date</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {new Date(selectedInvoice.submittedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Supplier</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">{selectedInvoice.sellerName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{selectedInvoice.sellerId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Total Amount</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {selectedInvoice.totalAmount.toLocaleString()} AED
                    </p>
                  </div>
                </div>
              </div>

              {/* Invoice Numbers */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Invoice Numbers</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  {selectedInvoice.invoiceNumbers.map((num, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{num}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financing Terms */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Financing Terms</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Bank Fees</p>
                      <p className="text-sm text-gray-600 mt-1">
                        The bank processing fees for this financing request will be covered by{" "}
                        <span className="font-semibold">
                          {selectedInvoice.bankFeeCoveredBy === "buyer" ? "you (buyer)" : "the supplier"}
                        </span>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Attached Documents</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Invoice Files</p>
                        <p className="text-xs text-gray-500">{selectedInvoice.invoiceFiles} file(s)</p>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                        <FileText className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Supporting Documents</p>
                        <p className="text-xs text-gray-500">{selectedInvoice.supportingDocs} file(s)</p>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
              </div>

              {/* Rejection Reason (for rejected invoices) */}
              {selectedInvoice.status === "rejected" && selectedInvoice.rejectionReason && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Rejection Reason</h3>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-red-900">{selectedInvoice.rejectionReason}</p>
                        {selectedInvoice.rejectedDate && (
                          <p className="text-xs text-red-700 mt-2">
                            Rejected on {new Date(selectedInvoice.rejectedDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Info (for historical invoices) */}
              {selectedInvoice.status === "approved" && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Approval Status</h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-900">Invoice Approved</p>
                        {selectedInvoice.approvedDate && (
                          <p className="text-xs text-green-700 mt-1">
                            Approved on {new Date(selectedInvoice.approvedDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {selectedInvoice.status === "pending_buyer_approval" && (
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleApprove(selectedInvoice)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve Invoice
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      openRejectModal(selectedInvoice);
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject Invoice
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedInvoice && (
        <div className="fixed inset-0 bg-[#CBD2DD]/[.72] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Reject Invoice</h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-900">Are you sure?</p>
                    <p className="text-sm text-red-700 mt-1">
                      You are about to reject invoice request <strong>{selectedInvoice.id}</strong> from{" "}
                      <strong>{selectedInvoice.sellerName}</strong>.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Reason for Rejection <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a reason for rejecting this invoice..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason("");
                    setShowDetailModal(true);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={!rejectionReason.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
