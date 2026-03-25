import { FileText, Plus, Upload, X, Building2, CheckCircle, Clock, DollarSign, Eye, Calendar, Loader2 } from "lucide-react";
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

interface InvoiceRequest {
  id: string;
  supplierId: string;
  supplierName: string;
  invoiceNumbers: string[];
  totalAmount: number;
  financingTenor: number;
  repaymentStructure: "bullet" | "installment";
  status: "pending_risk_validation" | "approved" | "pending_disbursement" | "disbursed" | "rejected";
  submittedDate: string;
  approvedDate?: string;
  disbursedDate?: string;
  rejectionReason?: string;
  invoiceFiles: number;
  deliveryNotes?: number;
}

interface Supplier {
  id: string;
  name: string;
  status: string;
  assignedLimit?: number;
}

export function BuyerInvoicesModule() {
  const [searchParams] = useSearchParams();
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => { if (searchParams.get("add") === "true") setShowAddForm(true); }, [searchParams]);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<"pending_disbursement" | "pending_risk_validation" | null>(null);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [selectedInvoiceForTerms, setSelectedInvoiceForTerms] = useState<InvoiceRequest | null>(null);
  const [showTermsAccepted, setShowTermsAccepted] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState("SUP-001");
  const [financingTenor, setFinancingTenor] = useState("60");
  const [repaymentStructure, setRepaymentStructure] = useState<"bullet" | "installment">("bullet");
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([
    { invoiceNumber: "TS-INV-2024-107", invoiceDate: "2024-03-20", invoiceAmount: "98000", paymentDueDate: "2024-06-20", invoiceCopy: new File([new ArrayBuffer(198656)], "TS-INV-2024-107.pdf", { type: "application/pdf" }), deliveryNote: new File([new ArrayBuffer(134144)], "DN-TS-107.pdf", { type: "application/pdf" }) },
    { invoiceNumber: "TS-INV-2024-108", invoiceDate: "2024-03-22", invoiceAmount: "87000", paymentDueDate: "2024-06-22", invoiceCopy: new File([new ArrayBuffer(167936)], "TS-INV-2024-108.pdf", { type: "application/pdf" }), deliveryNote: new File([new ArrayBuffer(112640)], "DN-TS-108.pdf", { type: "application/pdf" }) },
  ]);

  const approvedSuppliers: Supplier[] = [
    { id: "SUP-001", name: "Tech Suppliers LLC", status: "limit_assigned", assignedLimit: 500000 },
    { id: "SUP-002", name: "Industrial Parts Co.", status: "limit_assigned", assignedLimit: 750000 },
  ];

  const [invoiceRequests, setInvoiceRequests] = useState<InvoiceRequest[]>([
    {
      id: "INV-REQ-001",
      supplierId: "SUP-001",
      supplierName: "Tech Suppliers LLC",
      invoiceNumbers: ["TS-INV-2024-101", "TS-INV-2024-102"],
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
      supplierId: "SUP-002",
      supplierName: "Industrial Parts Co.",
      invoiceNumbers: ["IP-INV-2024-205", "IP-INV-2024-206"],
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
      supplierId: "SUP-001",
      supplierName: "Tech Suppliers LLC",
      invoiceNumbers: ["TS-INV-2024-103"],
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
      supplierId: "SUP-002",
      supplierName: "Industrial Parts Co.",
      invoiceNumbers: ["IP-INV-2024-207"],
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
      supplierId: "SUP-001",
      supplierName: "Tech Suppliers LLC",
      invoiceNumbers: ["TS-INV-2024-104", "TS-INV-2024-105"],
      totalAmount: 234000,
      financingTenor: 60,
      repaymentStructure: "bullet",
      status: "approved",
      submittedDate: "2024-03-16",
      approvedDate: "2024-03-17",
      invoiceFiles: 2,
    },
    {
      id: "INV-REQ-006",
      supplierId: "SUP-002",
      supplierName: "Industrial Parts Co.",
      invoiceNumbers: ["IP-INV-2024-208"],
      totalAmount: 412000,
      financingTenor: 120,
      repaymentStructure: "installment",
      status: "pending_risk_validation",
      submittedDate: "2024-03-18",
      invoiceFiles: 1,
    },
    {
      id: "INV-REQ-007",
      supplierId: "SUP-001",
      supplierName: "Tech Suppliers LLC",
      invoiceNumbers: ["TS-INV-2024-106"],
      totalAmount: 95000,
      financingTenor: 30,
      repaymentStructure: "bullet",
      status: "pending_risk_validation",
      submittedDate: "2024-03-19",
      invoiceFiles: 1,
    },
    {
      id: "INV-REQ-008",
      supplierId: "SUP-002",
      supplierName: "Industrial Parts Co.",
      invoiceNumbers: ["IP-INV-2024-209", "IP-INV-2024-210"],
      totalAmount: 178000,
      financingTenor: 60,
      repaymentStructure: "installment",
      status: "rejected",
      submittedDate: "2024-03-12",
      rejectionReason: "Supplier credit limit exceeded",
      invoiceFiles: 2,
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

  const getStatusBadge = (status: InvoiceRequest["status"]) => {
    const statusConfig = {
      pending_risk_validation: { color: "bg-yellow-100 text-yellow-700", icon: Clock, label: "Risk Validation" },
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

  const selectedSupplierData = approvedSuppliers.find(s => s.id === selectedSupplier);
  const usedLimit = invoiceRequests
    .filter(r => r.supplierId === selectedSupplier && r.status !== "rejected")
    .reduce((sum, r) => sum + r.totalAmount, 0);
  const remainingLimit = (selectedSupplierData?.assignedLimit || 0) - usedLimit;
  const approvedAmount = Math.min(totalAmount, Math.max(0, remainingLimit));
  const financingRate = 3.5;
  const processingFeeRate = 1;

  const handleSubmit = () => {
    if (!selectedSupplierData) return;

    const flowType = localStorage.getItem("demo_payable_invoice_flow") || "normal";
    const validItems = lineItems.filter(item => item.invoiceNumber.trim());

    setVerifying(true);
    setVerificationResult(null);

    setTimeout(() => {
      const isNormal = flowType !== "exception";
      const status: InvoiceRequest["status"] = isNormal ? "pending_disbursement" : "pending_risk_validation";

      const newInvoiceRequest: InvoiceRequest = {
        id: `INV-REQ-${String(4 + invoiceRequests.length).padStart(3, '0')}`,
        supplierId: selectedSupplier,
        supplierName: selectedSupplierData.name,
        invoiceNumbers: validItems.map(item => item.invoiceNumber),
        totalAmount: isNormal ? approvedAmount : totalAmount,
        financingTenor: Number(financingTenor),
        repaymentStructure: repaymentStructure,
        status: status,
        submittedDate: new Date().toISOString().split('T')[0],
        ...(isNormal ? { approvedDate: new Date().toISOString().split('T')[0] } : {}),
        invoiceFiles: totalInvoiceFiles,
        deliveryNotes: totalDeliveryNotes,
      };

      setInvoiceRequests(prev => [newInvoiceRequest, ...prev]);
      setVerificationResult(status);
    }, 5000);
  };

  const resetForm = () => {
    setShowAddForm(false);
    setCurrentStep(1);
    setShowSuccess(false);
    setVerifying(false);
    setVerificationResult(null);
    setSelectedSupplier("");
    setFinancingTenor("");
    setRepaymentStructure("bullet");
    setLineItems([{ invoiceNumber: "", invoiceDate: "", invoiceAmount: "", paymentDueDate: "", invoiceCopy: null, deliveryNote: null }]);
  };

  const stats = [
    {
      label: "Total Requests",
      value: invoiceRequests.length,
      icon: FileText,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Under Validation",
      value: invoiceRequests.filter(i => i.status === "pending_risk_validation").length,
      icon: Clock,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      label: "Approved",
      value: invoiceRequests.filter(i => i.status === "approved" || i.status === "pending_disbursement").length,
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Disbursed",
      value: invoiceRequests.filter(i => i.status === "disbursed").length,
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
            <h2 className="text-2xl font-semibold text-gray-900">Payable Invoice Financing</h2>
            <p className="text-sm text-gray-500 mt-1">Create and manage your invoice financing requests</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            New Invoice Request
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

      {/* Invoice Requests Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice Numbers</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoiceRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{request.id}</div>
                    <div className="text-xs text-gray-500">Submitted {request.submittedDate}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{request.supplierName}</div>
                        <div className="text-xs text-gray-500">{request.supplierId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {request.invoiceNumbers.slice(0, 2).join(", ")}
                      {request.invoiceNumbers.length > 2 && (
                        <span className="text-gray-500"> +{request.invoiceNumbers.length - 2} more</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{request.invoiceFiles} invoice(s), {request.deliveryNotes || 0} doc(s)</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(request.totalAmount)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{request.financingTenor} days</div>
                    <div className="text-xs text-gray-500 capitalize">{request.repaymentStructure}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(request.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => {
                        if (request.status === "approved") {
                          setSelectedInvoiceForTerms(request);
                          setShowTermsAccepted(false);
                          setShowTermsModal(true);
                        }
                      }}
                      className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      {request.status === "approved" ? "View Terms" : "View"}
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
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">New Invoice Request</h3>
                {!showSuccess && !verifying && <p className="text-sm text-gray-500 mt-1">Step {currentStep} of 4</p>}
              </div>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {verifying ? (
              <div className="p-8 text-center">
                {!verificationResult ? (
                  <>
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Auto Verification in Progress</h3>
                    <p className="text-sm text-gray-600 max-w-md mx-auto">
                      Please wait while we verify your invoice request...
                    </p>
                  </>
                ) : verificationResult === "pending_disbursement" ? (
                  <>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Invoice Approved</h3>
                    <p className="text-sm text-gray-600 mb-2 max-w-md mx-auto">
                      Your invoice financing request has been automatically approved and is now pending disbursement.
                    </p>
                    <p className="text-sm font-medium text-green-700 mb-6">
                      Approved Amount: {formatCurrency(approvedAmount)}
                    </p>
                    <button
                      onClick={resetForm}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Done
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-8 h-8 text-amber-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Pending Bank Verification</h3>
                    <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
                      Your invoice request has been submitted for bank verification. You will be notified once the review is complete.
                    </p>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                      <p className="text-xs text-amber-700">
                        The bank's risk team will review your invoice request and notify you of the outcome. This typically takes 1-2 business days.
                      </p>
                    </div>
                    <button
                      onClick={resetForm}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Done
                    </button>
                  </>
                )}
              </div>
            ) : showSuccess ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Invoice Request Submitted</h3>
                <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
                  Your invoice financing request has been submitted for risk validation. Once approved by the bank, you can review and accept the financing terms, and the amount will be disbursed to the supplier.
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
                  { step: 1, label: "Select Supplier" },
                  { step: 2, label: "Invoice Details" },
                  { step: 3, label: "Financing Terms" },
                  { step: 4, label: "Review & Submit" },
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
                    {index < 3 && (
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
              {/* Step 1: Select Supplier */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Supplier *</label>
                    <p className="text-xs text-gray-500 mb-3">Choose an approved supplier with assigned credit limit</p>
                  </div>
                  <div className="space-y-3">
                    {approvedSuppliers.map((supplier) => (
                      <label
                        key={supplier.id}
                        className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedSupplier === supplier.id
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="supplier"
                            value={supplier.id}
                            checked={selectedSupplier === supplier.id}
                            onChange={(e) => setSelectedSupplier(e.target.value)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900">{supplier.name}</p>
                              <p className="text-xs text-gray-500">ID: {supplier.id}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Credit Limit</p>
                          <p className="font-semibold text-gray-900">{formatCurrency(supplier.assignedLimit || 0)}</p>
                        </div>
                      </label>
                    ))}
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
                              <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileUpload(e, index, "invoiceCopy")} className="hidden" id={`pay-inv-copy-${index}`} />
                              <label htmlFor={`pay-inv-copy-${index}`} className="flex items-center justify-center gap-2 w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-xs text-gray-500 hover:border-blue-400 hover:text-blue-600 cursor-pointer transition-colors">
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
                              <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileUpload(e, index, "deliveryNote")} className="hidden" id={`pay-del-note-${index}`} />
                              <label htmlFor={`pay-del-note-${index}`} className="flex items-center justify-center gap-2 w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-xs text-gray-500 hover:border-blue-400 hover:text-blue-600 cursor-pointer transition-colors">
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

              {/* Step 3: Financing Terms */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Financing Tenor (Days) *</label>
                    <div className="grid grid-cols-4 gap-3">
                      {[30, 60, 90, 120].map((days) => (
                        <button
                          key={days}
                          type="button"
                          onClick={() => setFinancingTenor(String(days))}
                          className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-colors ${
                            financingTenor === String(days)
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <Calendar className="w-5 h-5 text-gray-600 mb-1" />
                          <span className="text-lg font-semibold text-gray-900">{days}</span>
                          <span className="text-xs text-gray-500">days</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Repayment Structure *</label>
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
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${repaymentStructure === "bullet" ? "border-blue-600" : "border-gray-300"}`}>
                            {repaymentStructure === "bullet" && <div className="w-3 h-3 bg-blue-600 rounded-full" />}
                          </div>
                          <DollarSign className="w-5 h-5 text-gray-600" />
                        </div>
                        <p className="font-medium text-gray-900">Bullet Payment</p>
                        <p className="text-xs text-gray-500 mt-1">Single payment at the end of tenor period</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRepaymentStructure("installment")}
                        className={`p-4 border-2 rounded-lg text-left transition-colors ${
                          repaymentStructure === "installment"
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${repaymentStructure === "installment" ? "border-blue-600" : "border-gray-300"}`}>
                            {repaymentStructure === "installment" && <div className="w-3 h-3 bg-blue-600 rounded-full" />}
                          </div>
                          <FileText className="w-5 h-5 text-gray-600" />
                        </div>
                        <p className="font-medium text-gray-900">Installments</p>
                        <p className="text-xs text-gray-500 mt-1">Multiple payments spread over tenor period</p>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Review & Submit */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Request Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Supplier:</span>
                        <span className="font-medium text-gray-900">
                          {approvedSuppliers.find(s => s.id === selectedSupplier)?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Invoices:</span>
                        <span className="font-medium text-gray-900">{lineItems.filter(i => i.invoiceNumber.trim()).length} invoice(s)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Invoice Amount:</span>
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
                        <span className="text-gray-600">Financing Tenor:</span>
                        <span className="font-medium text-gray-900">{financingTenor} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Repayment Structure:</span>
                        <span className="font-medium text-gray-900 capitalize">{repaymentStructure === "bullet" ? "Bullet Payment" : "Installments"}</span>
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

                  {/* Financing Terms */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Indicative Financing Terms</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Advance Rate:</span>
                        <span className="font-medium text-green-700">100%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Remaining Credit Limit:</span>
                        <span className="font-medium text-gray-900">{formatCurrency(Math.max(0, remainingLimit))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Approved Amount (estimated):</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(approvedAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Financing Rate:</span>
                        <span className="font-medium text-gray-900">{financingRate}% flat</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Processing Fee ({processingFeeRate}%):</span>
                        <span className="font-medium text-gray-900">{formatCurrency(Math.round(approvedAmount * processingFeeRate / 100))}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-2 flex justify-between">
                        <span className="text-gray-600 font-medium">Est. Disbursement Amount:</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(Math.round(approvedAmount * (1 - financingRate / 100 - processingFeeRate / 100)))}</span>
                      </div>
                    </div>
                    {totalAmount > remainingLimit && remainingLimit > 0 && (
                      <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-xs text-amber-700">
                          The total invoice amount ({formatCurrency(totalAmount)}) exceeds the remaining credit limit. The approved amount will be capped at {formatCurrency(Math.max(0, remainingLimit))}.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2 text-sm">Next Steps:</h4>
                    <ol className="space-y-1 text-xs text-blue-700 list-decimal list-inside">
                      <li>Your invoices will undergo automatic verification</li>
                      <li>If approved, the amount will be pending disbursement to the supplier</li>
                      <li>If further review is needed, the bank will verify and notify you</li>
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
              {currentStep < 4 ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={
                    (currentStep === 1 && !selectedSupplier) ||
                    (currentStep === 2 && (lineItems.every(i => !i.invoiceNumber.trim() || !i.invoiceAmount) || lineItems.every(i => !i.invoiceCopy || !i.deliveryNote))) ||
                    (currentStep === 3 && !financingTenor)
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
                <p className="text-sm text-gray-500 mt-1">{selectedInvoiceForTerms.id} — {selectedInvoiceForTerms.supplierName}</p>
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
                  Your invoice is now pending disbursement. The funds will be disbursed to the supplier and you will be notified.
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
                        <span className="font-medium text-gray-900">{selectedInvoiceForTerms.financingTenor} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Repayment Date</span>
                        <span className="font-medium text-gray-900">
                          {new Date(Date.now() + selectedInvoiceForTerms.financingTenor * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
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
                      By accepting these terms, you agree to the financing arrangement. The disbursement amount will be credited to the supplier's registered bank account within 1-2 business days.
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
                      setInvoiceRequests(prev => prev.map(inv =>
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
