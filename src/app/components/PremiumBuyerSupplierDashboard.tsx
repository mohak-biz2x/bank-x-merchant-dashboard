import { useState } from "react";
import { Building2, FileText, Clock, CheckCircle, Plus, X, Upload, DollarSign, Eye } from "lucide-react";

interface InvoiceLineItem {
  invoiceNumber: string;
  invoiceDate: string;
  invoiceAmount: string;
  paymentDueDate: string;
  invoiceCopy: File | null;
  deliveryNote: File | null;
}

interface InvoiceRequest {
  id: string;
  invoiceNumbers: string[];
  totalAmount: number;
  status: "submitted" | "approved" | "rejected" | "disbursed";
  submittedDate: string;
  createdDate: string;
  approvedDate?: string;
  disbursedDate?: string;
  invoiceFiles: number;
  deliveryNotes: number;
}

const mockInvoiceRequests: InvoiceRequest[] = [
  {
    id: "INV-REQ-001",
    invoiceNumbers: ["FS-INV-2024-101", "FS-INV-2024-102"],
    totalAmount: 125000,
    status: "approved",
    submittedDate: "2024-03-05",
    createdDate: "2024-03-04",
    invoiceFiles: 2,
    deliveryNotes: 2,
  },
  {
    id: "INV-REQ-002",
    invoiceNumbers: ["FS-INV-2024-103"],
    totalAmount: 78000,
    status: "submitted",
    submittedDate: "2024-03-10",
    createdDate: "2024-03-09",
    invoiceFiles: 1,
    deliveryNotes: 1,
  },
  {
    id: "INV-REQ-003",
    invoiceNumbers: ["FS-INV-2024-104"],
    totalAmount: 156000,
    status: "submitted",
    submittedDate: "2024-03-14",
    createdDate: "2024-03-14",
    invoiceFiles: 1,
    deliveryNotes: 1,
  },
  {
    id: "INV-REQ-004",
    invoiceNumbers: ["FS-INV-2024-097", "FS-INV-2024-098"],
    totalAmount: 234000,
    status: "approved",
    submittedDate: "2024-02-28",
    createdDate: "2024-02-27",
    invoiceFiles: 2,
    deliveryNotes: 2,
  },
  {
    id: "INV-REQ-005",
    invoiceNumbers: ["FS-INV-2024-099"],
    totalAmount: 189000,
    status: "approved",
    submittedDate: "2024-03-01",
    createdDate: "2024-02-29",
    invoiceFiles: 1,
    deliveryNotes: 1,
  },
  {
    id: "INV-REQ-006",
    invoiceNumbers: ["FS-INV-2024-100"],
    totalAmount: 145000,
    status: "approved",
    submittedDate: "2024-03-03",
    createdDate: "2024-03-02",
    invoiceFiles: 1,
    deliveryNotes: 1,
  },
  {
    id: "INV-REQ-007",
    invoiceNumbers: ["FS-INV-2024-095", "FS-INV-2024-096"],
    totalAmount: 312000,
    status: "disbursed",
    submittedDate: "2024-02-20",
    createdDate: "2024-02-19",
    approvedDate: "2024-02-21",
    disbursedDate: "2024-02-22",
    invoiceFiles: 2,
    deliveryNotes: 2,
  },
  {
    id: "INV-REQ-008",
    invoiceNumbers: ["FS-INV-2024-093"],
    totalAmount: 178000,
    status: "disbursed",
    submittedDate: "2024-02-15",
    createdDate: "2024-02-14",
    approvedDate: "2024-02-16",
    disbursedDate: "2024-02-17",
    invoiceFiles: 1,
    deliveryNotes: 1,
  },
  {
    id: "INV-REQ-009",
    invoiceNumbers: ["FS-INV-2024-094"],
    totalAmount: 245000,
    status: "disbursed",
    submittedDate: "2024-02-18",
    createdDate: "2024-02-17",
    approvedDate: "2024-02-19",
    disbursedDate: "2024-02-20",
    invoiceFiles: 1,
    deliveryNotes: 1,
  },
];

export function PremiumBuyerSupplierDashboard() {
  const [invoiceRequests, setInvoiceRequests] = useState<InvoiceRequest[]>(mockInvoiceRequests);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [viewRequest, setViewRequest] = useState<InvoiceRequest | null>(null);
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([
    { 
      invoiceNumber: "FS-INV-2024-105", 
      invoiceDate: "2024-03-20", 
      invoiceAmount: "89000", 
      paymentDueDate: "2024-06-20", 
      invoiceCopy: new File([new ArrayBuffer(198656)], "FS-INV-2024-105.pdf", { type: "application/pdf" }), 
      deliveryNote: new File([new ArrayBuffer(134144)], "DN-FS-105.pdf", { type: "application/pdf" }) 
    },
    { 
      invoiceNumber: "FS-INV-2024-106", 
      invoiceDate: "2024-03-22", 
      invoiceAmount: "76000", 
      paymentDueDate: "2024-06-22", 
      invoiceCopy: new File([new ArrayBuffer(167936)], "FS-INV-2024-106.pdf", { type: "application/pdf" }), 
      deliveryNote: new File([new ArrayBuffer(112640)], "DN-FS-106.pdf", { type: "application/pdf" }) 
    },
  ]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED", minimumFractionDigits: 0 }).format(n);

  const getStatusConfig = (status: InvoiceRequest["status"]) => {
    const map = {
      submitted: { color: "bg-yellow-100 text-yellow-700", icon: Clock, label: "Pending Verification" },
      approved: { color: "bg-green-100 text-green-700", icon: CheckCircle, label: "Approved" },
      rejected: { color: "bg-red-100 text-red-700", icon: X, label: "Rejected" },
      disbursed: { color: "bg-emerald-100 text-emerald-700", icon: DollarSign, label: "Disbursed" },
    };
    return map[status];
  };

  const renderStatusBadge = (status: InvoiceRequest["status"]) => {
    const config = getStatusConfig(status);
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, lineIndex: number, type: "invoiceCopy" | "deliveryNote") => {
    const file = e.target.files?.[0] || null;
    setLineItems(prev => prev.map((item, i) => i === lineIndex ? { ...item, [type]: file } : item));
  };

  const removeFile = (lineIndex: number, type: "invoiceCopy" | "deliveryNote") => {
    setLineItems(prev => prev.map((item, i) => i === lineIndex ? { ...item, [type]: null } : item));
  };

  const handleAddLineItem = () => {
    setLineItems(prev => [...prev, { invoiceNumber: "", invoiceDate: "", invoiceAmount: "", paymentDueDate: "", invoiceCopy: null, deliveryNote: null }]);
  };

  const handleRemoveLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleLineItemChange = (index: number, field: keyof InvoiceLineItem, value: string) => {
    setLineItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const totalAmount = lineItems.reduce((sum, item) => sum + (Number(item.invoiceAmount) || 0), 0);
  const totalInvoiceFiles = lineItems.filter(item => item.invoiceCopy).length;
  const totalDeliveryNotes = lineItems.filter(item => item.deliveryNote).length;

  const handleSubmitRequest = () => {
    const validItems = lineItems.filter(item => item.invoiceNumber.trim());
    const newId = `INV-REQ-${String(invoiceRequests.length + 1).padStart(3, "0")}`;
    const request: InvoiceRequest = {
      id: newId,
      invoiceNumbers: validItems.map(item => item.invoiceNumber),
      totalAmount: totalAmount,
      status: "submitted",
      submittedDate: new Date().toISOString().split("T")[0],
      createdDate: new Date().toISOString().split("T")[0],
      invoiceFiles: totalInvoiceFiles,
      deliveryNotes: totalDeliveryNotes,
    };
    setInvoiceRequests([request, ...invoiceRequests]);
    setShowSuccess(true);
  };

  const resetForm = () => {
    setShowAddModal(false);
    setShowSuccess(false);
    setLineItems([{ invoiceNumber: "", invoiceDate: "", invoiceAmount: "", paymentDueDate: "", invoiceCopy: null, deliveryNote: null }]);
  };

  const stats = [
    { label: "Total Requests", value: String(invoiceRequests.length), icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Submitted", value: String(invoiceRequests.filter((r) => r.status === "submitted").length), icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
    { label: "Approved", value: String(invoiceRequests.filter((r) => r.status === "approved").length), icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
    { label: "Disbursed", value: String(invoiceRequests.filter((r) => r.status === "disbursed").length), icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  const isFormValid = lineItems.some(i => i.invoiceNumber.trim() && i.invoiceAmount && i.invoiceCopy && i.deliveryNote);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Supplier Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Linked to: Gulf Trading Co.</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#4F8DFF] text-white rounded-lg hover:bg-[#3A7AE8] transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" /> New Invoice Request
            </button>
          </div>
        </div>

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
            <p className="text-sm text-gray-500 mt-0.5">Submit invoices to your buyer for verification and financing</p>
          </div>
          <div className="p-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#E6F0FF]">
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">Request ID</th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">Invoice Numbers</th>
                  <th className="text-right py-3 px-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">Files</th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">Created</th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoiceRequests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500 text-sm">
                      No invoice requests yet. Click "New Invoice Request" to get started.
                    </td>
                  </tr>
                ) : (
                  invoiceRequests.map((req) => (
                    <tr key={req.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-3 font-medium text-gray-900">{req.id}</td>
                      <td className="py-3 px-3 text-gray-600">{req.invoiceNumbers.join(", ")}</td>
                      <td className="py-3 px-3 text-right font-medium text-gray-900">{formatCurrency(req.totalAmount)}</td>
                      <td className="py-3 px-3 text-gray-600 text-xs">{req.invoiceFiles} invoice(s), {req.deliveryNotes} doc(s)</td>
                      <td className="py-3 px-3 text-gray-600">{req.createdDate}</td>
                      <td className="py-3 px-3">{renderStatusBadge(req.status)}</td>
                      <td className="py-3 px-3">
                        <button 
                          onClick={() => setViewRequest(req)} 
                          className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 text-sm"
                        >
                          <Eye className="w-4 h-4" /> View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Invoice Request Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-[#CBD2DD]/[.72] flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="px-5 py-3 flex items-center justify-between sticky top-0 bg-[#C3D2E7] text-gray-900 rounded-t">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">New Invoice Request</h3>
                </div>
                <button onClick={resetForm} className="text-gray-500 hover:text-gray-900">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {showSuccess ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Invoice Request Submitted</h3>
                  <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
                    Your invoice request has been submitted to Gulf Trading Co. for verification. You will be notified once the verification is complete.
                  </p>
                  <button
                    onClick={resetForm}
                    className="px-6 py-2 bg-[#4F8DFF] text-white rounded-lg hover:bg-[#3A7AE8] transition-colors font-medium"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  {/* Buyer Info */}
                  <div className="p-6 pb-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        <p className="text-sm font-medium text-blue-900">Buyer</p>
                      </div>
                      <p className="text-sm text-blue-700">Gulf Trading Co.</p>
                    </div>
                  </div>

                  {/* Invoice Details (per-invoice) */}
                  <div className="px-6 pb-6 space-y-6">
                    {lineItems.map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-5">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-semibold text-gray-900">Invoice {index + 1}</h4>
                          {lineItems.length > 1 && (
                            <button
                              onClick={() => handleRemoveLineItem(index)}
                              className="text-red-500 hover:text-red-700 text-xs font-medium flex items-center gap-1"
                            >
                              <X className="w-3.5 h-3.5" /> Remove
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Invoice Number *</label>
                            <input
                              type="text"
                              value={item.invoiceNumber}
                              onChange={(e) => handleLineItemChange(index, "invoiceNumber", e.target.value)}
                              placeholder="e.g. INV-2024-001"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Invoice Date *</label>
                            <input
                              type="date"
                              value={item.invoiceDate}
                              onChange={(e) => handleLineItemChange(index, "invoiceDate", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Invoice Amount (AED) *</label>
                            <input
                              type="number"
                              value={item.invoiceAmount}
                              onChange={(e) => handleLineItemChange(index, "invoiceAmount", e.target.value)}
                              placeholder="0"
                              min="0"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Payment Due Date *</label>
                            <input
                              type="date"
                              value={item.paymentDueDate}
                              onChange={(e) => handleLineItemChange(index, "paymentDueDate", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Invoice Copy *</label>
                            {item.invoiceCopy ? (
                              <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                                <FileText className="w-4 h-4 text-green-600 flex-shrink-0" />
                                <span className="text-xs text-green-700 truncate flex-1">{item.invoiceCopy.name}</span>
                                <button onClick={() => removeFile(index, "invoiceCopy")} className="text-red-500 hover:text-red-700">
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <>
                                <input
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={(e) => handleFileUpload(e, index, "invoiceCopy")}
                                  className="hidden"
                                  id={`pb-inv-copy-${index}`}
                                />
                                <label
                                  htmlFor={`pb-inv-copy-${index}`}
                                  className="flex items-center justify-center gap-2 w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-xs text-gray-500 hover:border-blue-400 hover:text-blue-600 cursor-pointer transition-colors"
                                >
                                  <Upload className="w-3.5 h-3.5" /> Upload Invoice Copy
                                </label>
                              </>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Delivery Note / Proof of Service *</label>
                            {item.deliveryNote ? (
                              <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                                <FileText className="w-4 h-4 text-green-600 flex-shrink-0" />
                                <span className="text-xs text-green-700 truncate flex-1">{item.deliveryNote.name}</span>
                                <button onClick={() => removeFile(index, "deliveryNote")} className="text-red-500 hover:text-red-700">
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <>
                                <input
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={(e) => handleFileUpload(e, index, "deliveryNote")}
                                  className="hidden"
                                  id={`pb-del-note-${index}`}
                                />
                                <label
                                  htmlFor={`pb-del-note-${index}`}
                                  className="flex items-center justify-center gap-2 w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-xs text-gray-500 hover:border-blue-400 hover:text-blue-600 cursor-pointer transition-colors"
                                >
                                  <Upload className="w-3.5 h-3.5" /> Upload Delivery Note
                                </label>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <button type="button" onClick={handleAddLineItem} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      + Add Another Invoice
                    </button>
                    {lineItems.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Total Amount ({lineItems.filter((i) => i.invoiceAmount).length} invoice
                          {lineItems.filter((i) => i.invoiceAmount).length !== 1 ? "s" : ""})
                        </span>
                        <span className="text-sm font-semibold text-gray-900">{formatCurrency(totalAmount)}</span>
                      </div>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="p-6 border-t border-gray-200 flex gap-3">
                    <button
                      onClick={resetForm}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitRequest}
                      disabled={!isFormValid}
                      className={`flex-1 px-4 py-2 rounded-lg transition-colors font-medium ${
                        isFormValid
                          ? "bg-[#4F8DFF] text-white hover:bg-[#3A7AE8]"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Submit Invoice Request
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* View Invoice Request Modal */}
      {viewRequest && (
        <div className="fixed inset-0 bg-[#CBD2DD]/[.72] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="px-5 py-3 flex items-center justify-between bg-[#C3D2E7] text-gray-900 rounded-t">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Invoice Request Details</h3>
                <p className="text-xs text-gray-500 mt-0.5">{viewRequest.id}</p>
              </div>
              <button onClick={() => setViewRequest(null)} className="text-gray-500 hover:text-gray-900">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-2 mb-2">{renderStatusBadge(viewRequest.status)}</div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-gray-500">Buyer</p>
                  <p className="font-medium text-gray-900">Gulf Trading Co.</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Amount</p>
                  <p className="font-medium text-gray-900">{formatCurrency(viewRequest.totalAmount)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Invoice Numbers</p>
                  <p className="font-medium text-gray-900">{viewRequest.invoiceNumbers.join(", ")}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="font-medium text-gray-900">{viewRequest.createdDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Submitted</p>
                  <p className="font-medium text-gray-900">{viewRequest.submittedDate}</p>
                </div>
                {viewRequest.approvedDate && (
                  <div>
                    <p className="text-xs text-gray-500">Approved</p>
                    <p className="font-medium text-gray-900">{viewRequest.approvedDate}</p>
                  </div>
                )}
                {viewRequest.disbursedDate && (
                  <div>
                    <p className="text-xs text-gray-500">Disbursed</p>
                    <p className="font-medium text-gray-900">{viewRequest.disbursedDate}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500">Invoice Files</p>
                  <p className="font-medium text-gray-900">{viewRequest.invoiceFiles} file(s)</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Delivery Notes</p>
                  <p className="font-medium text-gray-900">{viewRequest.deliveryNotes} doc(s)</p>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 border-t border-gray-200">
              <button 
                onClick={() => setViewRequest(null)} 
                className="w-full py-2 bg-[#4F8DFF] text-white rounded hover:bg-[#3A7AE8] text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
