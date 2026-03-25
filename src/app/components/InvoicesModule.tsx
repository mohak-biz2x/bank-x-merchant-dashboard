import { FileText, Plus, Upload, X, Building2, CheckCircle, Clock, AlertCircle, DollarSign, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";

interface InvoiceLineItem {
  invoiceNumber: string;
  invoiceDate: string;
  invoiceAmount: string;
  paymentDueDate: string;
  invoiceCopy: File | null;
  deliveryNote: File | null;
}

interface Invoice {
  id: string;
  buyerId: string;
  buyerName: string;
  invoiceNumbers: string[];
  totalAmount: number;
  bankFeeCoveredBy: "buyer" | "seller";
  status: "draft" | "pending_risk_validation" | "approved" | "pending_disbursement" | "disbursed" | "rejected";
  submittedDate: string;
  approvedDate?: string;
  disbursedDate?: string;
  rejectionReason?: string;
  invoiceFiles: number;
  supportingDocs: number;
}

export function InvoicesModule() {
  const [searchParams] = useSearchParams();
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => { if (searchParams.get("add") === "true") setShowAddForm(true); }, [searchParams]);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [selectedInvoiceForTerms, setSelectedInvoiceForTerms] = useState<Invoice | null>(null);
  const [showTermsAccepted, setShowTermsAccepted] = useState(false);
  const [buyerName, setBuyerName] = useState("Gulf Trading Enterprises LLC");
  const [repaymentStructure, setRepaymentStructure] = useState<"installments" | "bullet">("bullet");
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([
    { invoiceNumber: "GTE-INV-2024-031", invoiceDate: "2024-03-15", invoiceAmount: "145000", paymentDueDate: "2024-06-15", invoiceCopy: new File([new ArrayBuffer(245760)], "INV-GTE-2024-031.pdf", { type: "application/pdf" }), deliveryNote: new File([new ArrayBuffer(156672)], "DN-GTE-031.pdf", { type: "application/pdf" }) },
    { invoiceNumber: "GTE-INV-2024-032", invoiceDate: "2024-03-18", invoiceAmount: "130000", paymentDueDate: "2024-06-18", invoiceCopy: new File([new ArrayBuffer(189440)], "INV-GTE-2024-032.pdf", { type: "application/pdf" }), deliveryNote: new File([new ArrayBuffer(312320)], "DN-GTE-032.pdf", { type: "application/pdf" }) },
  ]);

  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "INV-2024-0138",
      buyerId: "BYR003",
      buyerName: "Dubai Retail Group",
      invoiceNumbers: ["DRG-INV-2024-088", "DRG-INV-2024-089"],
      totalAmount: 312000,
      bankFeeCoveredBy: "seller",
      status: "disbursed",
      submittedDate: "2024-03-05",
      approvedDate: "2024-03-06",
      disbursedDate: "2024-03-08",
      invoiceFiles: 2,
      supportingDocs: 3,
    },
    {
      id: "INV-2024-0139",
      buyerId: "BYR004",
      buyerName: "Sharjah Construction Co.",
      invoiceNumbers: ["SCC-INV-2024-015"],
      totalAmount: 478000,
      bankFeeCoveredBy: "seller",
      status: "disbursed",
      submittedDate: "2024-03-08",
      approvedDate: "2024-03-09",
      disbursedDate: "2024-03-11",
      invoiceFiles: 1,
      supportingDocs: 2,
    },
    {
      id: "INV-2024-0140",
      buyerId: "BYR001",
      buyerName: "Al Futtaim Group",
      invoiceNumbers: ["AF-INV-2024-001", "AF-INV-2024-002"],
      totalAmount: 125000,
      bankFeeCoveredBy: "seller",
      status: "disbursed",
      submittedDate: "2024-03-10",
      approvedDate: "2024-03-11",
      disbursedDate: "2024-03-13",
      invoiceFiles: 2,
      supportingDocs: 3,
    },
    {
      id: "INV-2024-0141",
      buyerId: "BYR005",
      buyerName: "Abu Dhabi Logistics",
      invoiceNumbers: ["ADL-INV-2024-201", "ADL-INV-2024-202", "ADL-INV-2024-203"],
      totalAmount: 567000,
      bankFeeCoveredBy: "seller",
      status: "disbursed",
      submittedDate: "2024-03-11",
      approvedDate: "2024-03-12",
      disbursedDate: "2024-03-14",
      invoiceFiles: 3,
      supportingDocs: 4,
    },
    {
      id: "INV-2024-0142",
      buyerId: "BYR002",
      buyerName: "Emirates Trading LLC",
      invoiceNumbers: ["ET-INV-2024-045"],
      totalAmount: 89500,
      bankFeeCoveredBy: "seller",
      status: "approved",
      submittedDate: "2024-03-14",
      approvedDate: "2024-03-15",
      invoiceFiles: 1,
      supportingDocs: 2,
    },
    {
      id: "INV-2024-0143",
      buyerId: "BYR003",
      buyerName: "Dubai Retail Group",
      invoiceNumbers: ["DRG-INV-2024-090"],
      totalAmount: 198000,
      bankFeeCoveredBy: "seller",
      status: "approved",
      submittedDate: "2024-03-15",
      approvedDate: "2024-03-16",
      invoiceFiles: 1,
      supportingDocs: 3,
    },
    {
      id: "INV-2024-0144",
      buyerId: "BYR001",
      buyerName: "Al Futtaim Group",
      invoiceNumbers: ["AF-INV-2024-003"],
      totalAmount: 156000,
      bankFeeCoveredBy: "seller",
      status: "pending_risk_validation",
      submittedDate: "2024-03-17",
      invoiceFiles: 1,
      supportingDocs: 4,
    },
    {
      id: "INV-2024-0145",
      buyerId: "BYR002",
      buyerName: "Emirates Trading LLC",
      invoiceNumbers: ["ET-INV-2024-046", "ET-INV-2024-047"],
      totalAmount: 234000,
      bankFeeCoveredBy: "seller",
      status: "pending_risk_validation",
      submittedDate: "2024-03-18",
      invoiceFiles: 2,
      supportingDocs: 5,
    },
    {
      id: "INV-2024-0146",
      buyerId: "BYR006",
      buyerName: "RAK Metals Trading",
      invoiceNumbers: ["RMT-INV-2024-077"],
      totalAmount: 145000,
      bankFeeCoveredBy: "seller",
      status: "pending_risk_validation",
      submittedDate: "2024-03-19",
      invoiceFiles: 1,
      supportingDocs: 2,
    },
    {
      id: "INV-2024-0147",
      buyerId: "BYR004",
      buyerName: "Sharjah Construction Co.",
      invoiceNumbers: ["SCC-INV-2024-016", "SCC-INV-2024-017"],
      totalAmount: 389000,
      bankFeeCoveredBy: "seller",
      status: "rejected",
      submittedDate: "2024-03-12",
      rejectionReason: "Insufficient supporting documentation",
      invoiceFiles: 2,
      supportingDocs: 1,
    },
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: Invoice["status"]) => {
    const statusConfig = {
      draft: { color: "bg-gray-100 text-gray-700", icon: Clock, label: "Draft" },
      pending_risk_validation: { color: "bg-blue-100 text-blue-700", icon: AlertCircle, label: "Risk Validation" },
      approved: { color: "bg-green-100 text-green-700", icon: CheckCircle, label: "Approved" },
      pending_disbursement: { color: "bg-amber-100 text-amber-700", icon: Clock, label: "Pending Disbursement" },
      disbursed: { color: "bg-emerald-100 text-emerald-700", icon: DollarSign, label: "Disbursed" },
      rejected: { color: "bg-red-100 text-red-700", icon: X, label: "Rejected" },
    };

    const config = statusConfig[status];
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

  const handleSubmit = () => {
    if (!buyerName.trim()) return;

    const validItems = lineItems.filter(item => item.invoiceNumber.trim());
    const newInvoice: Invoice = {
      id: `INV-2024-${String(146 + invoices.length).padStart(4, '0')}`,
      buyerId: "",
      buyerName: buyerName.trim(),
      invoiceNumbers: validItems.map(item => item.invoiceNumber),
      totalAmount: totalAmount,
      bankFeeCoveredBy: "seller",
      status: "pending_risk_validation",
      submittedDate: new Date().toISOString().split('T')[0],
      invoiceFiles: totalInvoiceFiles,
      supportingDocs: totalDeliveryNotes,
    };

    setInvoices(prev => [newInvoice, ...prev]);
    setShowSuccess(true);
  };

  const resetForm = () => {
    setShowAddForm(false);
    setCurrentStep(1);
    setShowSuccess(false);
    setBuyerName("");
    setRepaymentStructure("bullet");
    setLineItems([{ invoiceNumber: "", invoiceDate: "", invoiceAmount: "", paymentDueDate: "", invoiceCopy: null, deliveryNote: null }]);
  };

  const stats = [
    {
      label: "Total Invoices",
      value: invoices.length,
      icon: FileText,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Under Validation",
      value: invoices.filter(i => i.status === "pending_risk_validation").length,
      icon: AlertCircle,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      label: "Approved",
      value: invoices.filter(i => i.status === "approved" || i.status === "pending_disbursement").length,
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Disbursed",
      value: invoices.filter(i => i.status === "disbursed").length,
      icon: DollarSign,
      color: "bg-emerald-100 text-emerald-600",
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Receivable Invoice Financing</h2>
            <p className="text-sm text-gray-500 mt-1">Submit and track invoice financing requests</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Invoice Request
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg p-5 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Buyer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice Numbers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bank Fees
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{invoice.id}</div>
                    <div className="text-xs text-gray-500">
                      Submitted {invoice.submittedDate}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{invoice.buyerName}</div>
                        <div className="text-xs text-gray-500">{invoice.buyerId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {invoice.invoiceNumbers.slice(0, 2).join(", ")}
                      {invoice.invoiceNumbers.length > 2 && (
                        <span className="text-gray-500"> +{invoice.invoiceNumbers.length - 2} more</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {invoice.invoiceFiles} invoice(s), {invoice.supportingDocs} doc(s)
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(invoice.totalAmount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">
                      {invoice.bankFeeCoveredBy}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(invoice.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => {
                        if (invoice.status === "approved") {
                          setSelectedInvoiceForTerms(invoice);
                          setShowTermsAccepted(false);
                          setShowTermsModal(true);
                        }
                      }}
                      className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      {invoice.status === "approved" ? "View Terms" : "View"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Invoice Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Add Invoice Request</h3>
                {!showSuccess && <p className="text-sm text-gray-500 mt-1">Step {currentStep} of 3</p>}
              </div>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {showSuccess ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Invoice Submitted Successfully</h3>
                <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
                  Your invoice(s) have been submitted to the Underwriting team for risk validation. After the validation, your funds will be disbursed and you will be notified.
                </p>
                <button
                  onClick={resetForm}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Done
                </button>
              </div>
            ) : (
            <>
            {/* Progress Steps */}
            <div className="px-6 pt-4">
              <div className="flex items-center justify-between mb-6">
                {[
                  { step: 1, label: "Buyer Details" },
                  { step: 2, label: "Invoice Details" },
                  { step: 3, label: "Repayment & Review" },
                ].map((item, index) => (
                  <div key={item.step} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          currentStep >= item.step
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {item.step}
                      </div>
                      <p className="text-xs text-gray-600 mt-2 text-center">{item.label}</p>
                    </div>
                    {index < 2 && (
                      <div
                        className={`h-0.5 flex-1 mx-2 mb-6 ${
                          currentStep > item.step ? "bg-blue-600" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="p-6">
              {/* Step 1: Buyer Details */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Buyer Name *
                    </label>
                    <input
                      type="text"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="Enter buyer company name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the name of the buyer company
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Invoice Details (per-invoice) */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  {lineItems.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-semibold text-gray-900">Invoice {index + 1}</h4>
                        {lineItems.length > 1 && (
                          <button onClick={() => handleRemoveLineItem(index)} className="text-red-500 hover:text-red-700 text-xs font-medium flex items-center gap-1">
                            <X className="w-3.5 h-3.5" /> Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Invoice Number *</label>
                          <input type="text" value={item.invoiceNumber} onChange={(e) => handleLineItemChange(index, "invoiceNumber", e.target.value)} placeholder="e.g. INV-2024-001" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Invoice Date *</label>
                          <input type="date" value={item.invoiceDate} onChange={(e) => handleLineItemChange(index, "invoiceDate", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Invoice Amount (AED) *</label>
                          <input type="number" value={item.invoiceAmount} onChange={(e) => handleLineItemChange(index, "invoiceAmount", e.target.value)} placeholder="0" min="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Payment Due Date *</label>
                          <input type="date" value={item.paymentDueDate} onChange={(e) => handleLineItemChange(index, "paymentDueDate", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Invoice Copy *</label>
                          {item.invoiceCopy ? (
                            <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                              <FileText className="w-4 h-4 text-green-600 flex-shrink-0" />
                              <span className="text-xs text-green-700 truncate flex-1">{item.invoiceCopy.name}</span>
                              <button onClick={() => removeFile(index, "invoiceCopy")} className="text-red-500 hover:text-red-700"><X className="w-3.5 h-3.5" /></button>
                            </div>
                          ) : (
                            <>
                              <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileUpload(e, index, "invoiceCopy")} className="hidden" id={`inv-copy-${index}`} />
                              <label htmlFor={`inv-copy-${index}`} className="flex items-center justify-center gap-2 w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-xs text-gray-500 hover:border-blue-400 hover:text-blue-600 cursor-pointer transition-colors">
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
                              <button onClick={() => removeFile(index, "deliveryNote")} className="text-red-500 hover:text-red-700"><X className="w-3.5 h-3.5" /></button>
                            </div>
                          ) : (
                            <>
                              <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileUpload(e, index, "deliveryNote")} className="hidden" id={`del-note-${index}`} />
                              <label htmlFor={`del-note-${index}`} className="flex items-center justify-center gap-2 w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-xs text-gray-500 hover:border-blue-400 hover:text-blue-600 cursor-pointer transition-colors">
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
                      <span className="text-sm text-gray-600">Total Amount ({lineItems.filter(i => i.invoiceAmount).length} invoice{lineItems.filter(i => i.invoiceAmount).length !== 1 ? "s" : ""})</span>
                      <span className="text-sm font-semibold text-gray-900">{formatCurrency(totalAmount)}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Repayment & Review */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Repayment Structure *
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setRepaymentStructure("bullet")}
                        className={`p-4 border-2 rounded-lg text-left transition-colors ${
                          repaymentStructure === "bullet"
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              repaymentStructure === "bullet"
                                ? "border-blue-600"
                                : "border-gray-300"
                            }`}
                          >
                            {repaymentStructure === "bullet" && (
                              <div className="w-3 h-3 bg-blue-600 rounded-full" />
                            )}
                          </div>
                          <DollarSign className="w-5 h-5 text-gray-600" />
                        </div>
                        <p className="font-medium text-gray-900">Bullet Payment</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Full repayment at maturity date in a single payment
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRepaymentStructure("installments")}
                        className={`p-4 border-2 rounded-lg text-left transition-colors ${
                          repaymentStructure === "installments"
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              repaymentStructure === "installments"
                                ? "border-blue-600"
                                : "border-gray-300"
                            }`}
                          >
                            {repaymentStructure === "installments" && (
                              <div className="w-3 h-3 bg-blue-600 rounded-full" />
                            )}
                          </div>
                          <FileText className="w-5 h-5 text-gray-600" />
                        </div>
                        <p className="font-medium text-gray-900">Installments</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Repayment split into multiple scheduled installments
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Review Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Request Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Buyer:</span>
                        <span className="font-medium text-gray-900">{buyerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Invoices:</span>
                        <span className="font-medium text-gray-900">{lineItems.filter(i => i.invoiceNumber.trim()).length} invoice(s)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-medium text-gray-900">{formatCurrency(totalAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Invoice Copies:</span>
                        <span className="font-medium text-gray-900">{totalInvoiceFiles} file(s)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivery Notes:</span>
                        <span className="font-medium text-gray-900">{totalDeliveryNotes} file(s)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Repayment Structure:</span>
                        <span className="font-medium text-gray-900 capitalize">{repaymentStructure === "bullet" ? "Bullet Payment" : "Installments"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bank Fees:</span>
                        <span className="font-medium text-gray-900">Borne by Seller</span>
                      </div>
                    </div>
                    {/* Per-invoice breakdown */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs font-medium text-gray-700 mb-2">Invoice Breakdown:</p>
                      <div className="space-y-1.5">
                        {lineItems.filter(i => i.invoiceNumber.trim()).map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs text-gray-600">
                            <span>{item.invoiceNumber} — {item.invoiceDate || "No date"}</span>
                            <span className="font-medium text-gray-900">{formatCurrency(Number(item.invoiceAmount) || 0)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Workflow Info */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2 text-sm">Next Steps:</h4>
                    <ol className="space-y-1 text-xs text-blue-700 list-decimal list-inside">
                      <li>Invoice request will be submitted for Invoice Risk Validation by underwriters</li>
                      <li>Once validated and approved, the amount will be disbursed to your account</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-200 flex gap-3">
              {currentStep > 1 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Back
                </button>
              )}
              {currentStep < 3 ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={
                    (currentStep === 1 && !buyerName.trim()) ||
                    (currentStep === 2 && (lineItems.every(i => !i.invoiceNumber.trim() || !i.invoiceAmount) || lineItems.every(i => !i.invoiceCopy || !i.deliveryNote)))
                  }
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Submit Invoice Request
                </button>
              )}
            </div>
            </>
            )}
          </div>
        </div>
      )}

      {/* Terms Modal */}
      {showTermsModal && selectedInvoiceForTerms && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Approval Terms</h3>
                <p className="text-sm text-gray-500 mt-1">{selectedInvoiceForTerms.id} — {selectedInvoiceForTerms.buyerName}</p>
              </div>
              <button onClick={() => setShowTermsModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {showTermsAccepted ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Terms Accepted</h3>
                <p className="text-sm text-gray-600 mb-6 max-w-sm mx-auto">
                  Your invoice is now pending disbursement. You will be notified once the funds have been disbursed to your account.
                </p>
                <button
                  onClick={() => { setShowTermsModal(false); setSelectedInvoiceForTerms(null); setShowTermsAccepted(false); }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="p-6 space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-green-800 mb-1">Financing Approved</p>
                    <p className="text-xs text-green-700">Your invoice financing request has been approved by the underwriting team. Please review the terms below.</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <h4 className="font-medium text-gray-900 text-sm">Financing Terms</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Invoice Amount</span>
                        <span className="font-medium text-gray-900">{formatCurrency(selectedInvoiceForTerms.totalAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Advance Ratio</span>
                        <span className="font-medium text-gray-900">85%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Advance Amount</span>
                        <span className="font-medium text-gray-900">{formatCurrency(Math.round(selectedInvoiceForTerms.totalAmount * 0.85))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Financing Rate</span>
                        <span className="font-medium text-gray-900">3.5% flat</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Processing Fee</span>
                        <span className="font-medium text-gray-900">{formatCurrency(Math.round(selectedInvoiceForTerms.totalAmount * 0.85 * 0.01))}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-2 flex justify-between">
                        <span className="text-gray-600 font-medium">Disbursement Amount</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(Math.round(selectedInvoiceForTerms.totalAmount * 0.85 * 0.955))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tenure</span>
                        <span className="font-medium text-gray-900">90 days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Repayment Date</span>
                        <span className="font-medium text-gray-900">
                          {new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Repayment</span>
                        <span className="font-medium text-gray-900">{formatCurrency(Math.round(selectedInvoiceForTerms.totalAmount * 0.85))}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-xs text-blue-700">
                      By accepting these terms, you agree to the financing arrangement. The disbursement amount will be credited to your registered bank account within 1-2 business days.
                    </p>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-200 flex gap-3">
                  <button
                    onClick={() => setShowTermsModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setInvoices(prev => prev.map(inv =>
                        inv.id === selectedInvoiceForTerms.id ? { ...inv, status: "pending_disbursement" as const } : inv
                      ));
                      setShowTermsAccepted(true);
                    }}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Accept Terms
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}