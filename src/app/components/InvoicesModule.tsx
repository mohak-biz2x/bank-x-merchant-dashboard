import { FileText, Plus, Upload, X, CheckCircle, Clock, AlertCircle, DollarSign, Eye, Download, MoreVertical, ArrowLeft, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { showToast } from "./Toast";

type GroupStatus = "verification_in_progress" | "manual_verification_required" | "verification_complete" | "contract_generated" | "contract_esign_pending" | "contract_esign_complete" | "sent_to_lms" | "disbursed";
type InvoiceStatus = "pending" | "refer" | "approved" | "rejected";

interface InvoiceItem {
  id: string;
  invoiceDate: string;
  invoiceAmount: number;
  paymentDueDate: string;
  buyerName: string;
  status: InvoiceStatus;
}

interface InvoiceGroup {
  id: string;
  invoices: InvoiceItem[];
  uploadedOn: string;
  uploadedBy: string;
  totalInvoiceAmount: number;
  totalDisbursementAmount: number | null;
  status: GroupStatus;
  buyerName: string;
  repaymentStructure: "bullet" | "installments";
}

interface LineItem {
  invoiceNumber: string;
  invoiceDate: string;
  invoiceAmount: string;
  paymentDueDate: string;
  invoiceCopy: File | null;
  deliveryNote: File | null;
  parsed: boolean;
  parsingFailed: boolean;
}

const ITEMS_PER_PAGE = 10;

const initialGroups: InvoiceGroup[] = [
  {
    id: "GRP-R001", uploadedOn: "2024-03-05", uploadedBy: "Ahmed Al Mansouri", status: "verification_complete",
    buyerName: "Dubai Retail Group", repaymentStructure: "bullet", totalInvoiceAmount: 310000, totalDisbursementAmount: null,
    invoices: [
      { id: "INV-R001-01", invoiceDate: "2024-03-01", invoiceAmount: 145000, paymentDueDate: "2024-06-01", buyerName: "Dubai Retail Group", status: "approved" },
      { id: "INV-R001-02", invoiceDate: "2024-03-02", invoiceAmount: 98000, paymentDueDate: "2024-06-02", buyerName: "Dubai Retail Group", status: "approved" },
      { id: "INV-R001-03", invoiceDate: "2024-03-03", invoiceAmount: 67000, paymentDueDate: "2024-06-03", buyerName: "Dubai Retail Group", status: "refer" },
    ],
  },
  {
    id: "GRP-R002", uploadedOn: "2024-03-10", uploadedBy: "Ahmed Al Mansouri", status: "verification_in_progress",
    buyerName: "Al Futtaim Group", repaymentStructure: "bullet", totalInvoiceAmount: 385000, totalDisbursementAmount: null,
    invoices: [
      { id: "INV-R002-01", invoiceDate: "2024-03-08", invoiceAmount: 210000, paymentDueDate: "2024-06-08", buyerName: "Al Futtaim Group", status: "pending" },
      { id: "INV-R002-02", invoiceDate: "2024-03-09", invoiceAmount: 175000, paymentDueDate: "2024-06-09", buyerName: "Al Futtaim Group", status: "pending" },
    ],
  },
  {
    id: "GRP-R003", uploadedOn: "2024-02-28", uploadedBy: "Ahmed Al Mansouri", status: "contract_esign_pending",
    buyerName: "Emirates Trading LLC", repaymentStructure: "installments", totalInvoiceAmount: 469000, totalDisbursementAmount: null,
    invoices: [
      { id: "INV-R003-01", invoiceDate: "2024-02-25", invoiceAmount: 89000, paymentDueDate: "2024-05-25", buyerName: "Emirates Trading LLC", status: "approved" },
      { id: "INV-R003-02", invoiceDate: "2024-02-26", invoiceAmount: 134000, paymentDueDate: "2024-05-26", buyerName: "Emirates Trading LLC", status: "approved" },
      { id: "INV-R003-03", invoiceDate: "2024-02-27", invoiceAmount: 56000, paymentDueDate: "2024-05-27", buyerName: "Emirates Trading LLC", status: "approved" },
      { id: "INV-R003-04", invoiceDate: "2024-02-27", invoiceAmount: 78000, paymentDueDate: "2024-05-27", buyerName: "Emirates Trading LLC", status: "refer" },
      { id: "INV-R003-05", invoiceDate: "2024-02-28", invoiceAmount: 112000, paymentDueDate: "2024-05-28", buyerName: "Emirates Trading LLC", status: "approved" },
    ],
  },
  {
    id: "GRP-R004", uploadedOn: "2024-03-12", uploadedBy: "Ahmed Al Mansouri", status: "manual_verification_required",
    buyerName: "Sharjah Construction Co.", repaymentStructure: "bullet", totalInvoiceAmount: 320000, totalDisbursementAmount: null,
    invoices: [
      { id: "INV-R004-01", invoiceDate: "2024-03-10", invoiceAmount: 320000, paymentDueDate: "2024-06-10", buyerName: "Sharjah Construction Co.", status: "pending" },
    ],
  },
  {
    id: "GRP-R005", uploadedOn: "2024-02-15", uploadedBy: "Ahmed Al Mansouri", status: "disbursed",
    buyerName: "Abu Dhabi Logistics", repaymentStructure: "bullet", totalInvoiceAmount: 890000, totalDisbursementAmount: 890000,
    invoices: [
      { id: "INV-R005-01", invoiceDate: "2024-02-10", invoiceAmount: 245000, paymentDueDate: "2024-05-10", buyerName: "Abu Dhabi Logistics", status: "approved" },
      { id: "INV-R005-02", invoiceDate: "2024-02-11", invoiceAmount: 198000, paymentDueDate: "2024-05-11", buyerName: "Abu Dhabi Logistics", status: "approved" },
      { id: "INV-R005-03", invoiceDate: "2024-02-12", invoiceAmount: 267000, paymentDueDate: "2024-05-12", buyerName: "Abu Dhabi Logistics", status: "approved" },
      { id: "INV-R005-04", invoiceDate: "2024-02-13", invoiceAmount: 180000, paymentDueDate: "2024-05-13", buyerName: "Abu Dhabi Logistics", status: "approved" },
    ],
  },
  {
    id: "GRP-R006", uploadedOn: "2024-03-01", uploadedBy: "Ahmed Al Mansouri", status: "sent_to_lms",
    buyerName: "RAK Metals Trading", repaymentStructure: "installments", totalInvoiceAmount: 299000, totalDisbursementAmount: null,
    invoices: [
      { id: "INV-R006-01", invoiceDate: "2024-02-28", invoiceAmount: 156000, paymentDueDate: "2024-05-28", buyerName: "RAK Metals Trading", status: "approved" },
      { id: "INV-R006-02", invoiceDate: "2024-02-28", invoiceAmount: 143000, paymentDueDate: "2024-05-28", buyerName: "RAK Metals Trading", status: "approved" },
    ],
  },
];


export function InvoicesModule() {
  const [searchParams] = useSearchParams();
  const [groups, setGroups] = useState<InvoiceGroup[]>(initialGroups);
  const [viewingGroup, setViewingGroup] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addToExistingGroup, setAddToExistingGroup] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [buyerName, setBuyerName] = useState("");
  const [repaymentStructure, setRepaymentStructure] = useState<"bullet" | "installments">("bullet");
  const [parsingIndex, setParsingIndex] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { invoiceNumber: "", invoiceDate: "", invoiceAmount: "", paymentDueDate: "", invoiceCopy: null, deliveryNote: null, parsed: false, parsingFailed: false },
  ]);

  useEffect(() => {
    if (searchParams.get("add") === "true") setShowAddForm(true);
  }, [searchParams]);

  useEffect(() => {
    if (openMenuId) {
      const handler = () => setOpenMenuId(null);
      document.addEventListener("click", handler);
      return () => document.removeEventListener("click", handler);
    }
  }, [openMenuId]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

  const getGroupStatusBadge = (status: GroupStatus) => {
    const map: Record<GroupStatus, { color: string; label: string }> = {
      verification_in_progress: { color: "bg-blue-100 text-blue-700", label: "Verification In Progress" },
      manual_verification_required: { color: "bg-amber-100 text-amber-700", label: "Manual Verification Required" },
      verification_complete: { color: "bg-green-100 text-green-700", label: "Verification Complete" },
      contract_generated: { color: "bg-gray-100 text-gray-700", label: "Contract Generated" },
      contract_esign_pending: { color: "bg-amber-100 text-amber-700", label: "Contract E-Sign Pending" },
      contract_esign_complete: { color: "bg-green-100 text-green-700", label: "Contract E-Sign Complete" },
      sent_to_lms: { color: "bg-green-100 text-green-700", label: "Sent to LMS" },
      disbursed: { color: "bg-emerald-100 text-emerald-700", label: "Disbursed" },
    };
    const c = map[status];
    return <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${c.color}`}>{c.label}</span>;
  };

  const getInvoiceStatusBadge = (status: InvoiceStatus) => {
    const map: Record<InvoiceStatus, { color: string; label: string }> = {
      pending: { color: "bg-amber-100 text-amber-700", label: "Pending" },
      refer: { color: "bg-blue-100 text-blue-700", label: "Refer" },
      approved: { color: "bg-green-100 text-green-700", label: "Approved" },
      rejected: { color: "bg-red-100 text-red-700", label: "Rejected" },
    };
    const c = map[status];
    return <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${c.color}`}>{c.label}</span>;
  };

  const getGroupMenuActions = (_group: InvoiceGroup) => {
    const actions: { label: string; action: () => void }[] = [];
    return actions;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, idx: number, type: "invoiceCopy" | "deliveryNote") => {
    const file = e.target.files?.[0] || null;
    setLineItems(prev => {
      const updated = prev.map((item, i) => i === idx ? { ...item, [type]: file } : item);
      const item = updated[idx];
      if (type === "invoiceCopy" && file && !item.parsed && parsingIndex === null) {
        setTimeout(() => handleParseInvoice(idx), 300);
      }
      return updated;
    });
  };

  const removeFile = (idx: number, type: "invoiceCopy" | "deliveryNote") => {
    setLineItems(prev => prev.map((item, i) => i === idx ? { ...item, [type]: null } : item));
  };

  const handleParseInvoice = (idx: number) => {
    setParsingIndex(idx);
    setTimeout(() => {
      const isPartialFailure = Math.random() < 0.2;
      setLineItems(prev => prev.map((item, i) => {
        if (i !== idx) return item;
        const num = String(Math.floor(Math.random() * 9000) + 1000);
        const today = new Date().toISOString().split("T")[0];
        const due = new Date(Date.now() + 90 * 86400000).toISOString().split("T")[0];
        if (isPartialFailure) {
          return { ...item, invoiceNumber: `INV-2024-${num}`, invoiceDate: today, invoiceAmount: "", paymentDueDate: "", parsed: true, parsingFailed: true };
        }
        const amount = String(Math.floor(Math.random() * 250000) + 50000);
        return { ...item, invoiceNumber: `INV-2024-${num}`, invoiceDate: today, invoiceAmount: amount, paymentDueDate: due, parsed: true, parsingFailed: false };
      }));
      setParsingIndex(null);
    }, 2000);
  };

  const handleAddLineItem = () => {
    if (lineItems.length < 10) {
      setLineItems(prev => [...prev, { invoiceNumber: "", invoiceDate: "", invoiceAmount: "", paymentDueDate: "", invoiceCopy: null, deliveryNote: null, parsed: false, parsingFailed: false }]);
    }
  };

  const handleRemoveLineItem = (idx: number) => {
    if (lineItems.length > 1) setLineItems(prev => prev.filter((_, i) => i !== idx));
  };

  const handleLineItemChange = (idx: number, field: keyof LineItem, value: string) => {
    setLineItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const totalAmount = lineItems.reduce((sum, item) => sum + (Number(item.invoiceAmount) || 0), 0);

  const handleSubmit = () => {
    setSubmitting(true);
    const validItems = lineItems.filter(item => item.invoiceNumber.trim());
    if (addToExistingGroup) {
      const newInvoices: InvoiceItem[] = validItems.map((item, i) => ({
        id: `${addToExistingGroup}-NEW-${String(i + 1).padStart(2, "0")}`,
        invoiceDate: item.invoiceDate,
        invoiceAmount: Number(item.invoiceAmount) || 0,
        paymentDueDate: item.paymentDueDate,
        buyerName: groups.find(g => g.id === addToExistingGroup)?.buyerName || "",
        status: "pending" as InvoiceStatus,
      }));
      setGroups(prev => prev.map(g => {
        if (g.id !== addToExistingGroup) return g;
        const updatedInvoices = [...g.invoices, ...newInvoices];
        return { ...g, invoices: updatedInvoices, totalInvoiceAmount: updatedInvoices.reduce((s, inv) => s + inv.invoiceAmount, 0) };
      }));
      setTimeout(() => {
        setSubmitting(false);
        setGroups(prev => prev.map(g => {
          if (g.id !== addToExistingGroup) return g;
          return { ...g, invoices: g.invoices.map(inv => {
            if (inv.status !== "pending") return inv;
            const r = Math.random();
            return { ...inv, status: (r < 0.7 ? "approved" : r < 0.9 ? "refer" : "rejected") as InvoiceStatus };
          }) };
        }));
        showToast("success", "Invoice(s) submitted successfully.");
        resetForm();
      }, 3000);
    } else {
      const groupNum = String(groups.length + 1).padStart(3, "0");
      const groupId = `GRP-R${groupNum}`;
      const newInvoices: InvoiceItem[] = validItems.map((item, i) => ({
        id: `INV-R${groupNum}-${String(i + 1).padStart(2, "0")}`,
        invoiceDate: item.invoiceDate,
        invoiceAmount: Number(item.invoiceAmount) || 0,
        paymentDueDate: item.paymentDueDate,
        buyerName: buyerName.trim(),
        status: "pending" as InvoiceStatus,
      }));
      const newGroup: InvoiceGroup = {
        id: groupId,
        invoices: newInvoices,
        uploadedOn: new Date().toISOString().split("T")[0],
        uploadedBy: "Ahmed Al Mansouri",
        totalInvoiceAmount: totalAmount,
        totalDisbursementAmount: null,
        status: "verification_in_progress",
        buyerName: buyerName.trim(),
        repaymentStructure,
      };
      setGroups(prev => [newGroup, ...prev]);
      setTimeout(() => {
        setSubmitting(false);
        setGroups(prev => prev.map(g => {
          if (g.id !== groupId) return g;
          return { ...g, invoices: g.invoices.map(inv => {
            const r = Math.random();
            return { ...inv, status: (r < 0.7 ? "approved" : r < 0.9 ? "refer" : "rejected") as InvoiceStatus };
          }) };
        }));
        showToast("success", "Invoice(s) submitted successfully.");
        resetForm();
      }, 3000);
    }
  };

  const resetForm = () => {
    setShowAddForm(false);
    setAddToExistingGroup(null);
    setShowSuccess(false);
    setSubmitting(false);
    setBuyerName("");
    setRepaymentStructure("bullet");
    setParsingIndex(null);
    setLineItems([{ invoiceNumber: "", invoiceDate: "", invoiceAmount: "", paymentDueDate: "", invoiceCopy: null, deliveryNote: null, parsed: false, parsingFailed: false }]);
  };

  const stats = [
    { label: "Total Requests", value: groups.length, icon: FileText, color: "bg-blue-100 text-blue-600" },
    { label: "Under Validation", value: groups.filter(g => g.status === "verification_in_progress" || g.status === "manual_verification_required").length, icon: AlertCircle, color: "bg-yellow-100 text-yellow-600" },
    { label: "Approved", value: groups.filter(g => ["verification_complete", "contract_generated", "contract_esign_pending", "contract_esign_complete"].includes(g.status)).length, icon: CheckCircle, color: "bg-green-100 text-green-600" },
    { label: "Disbursed", value: groups.filter(g => g.status === "disbursed").length, icon: DollarSign, color: "bg-emerald-100 text-emerald-600" },
  ];

  const activeGroup = viewingGroup ? groups.find(g => g.id === viewingGroup) : null;

  const filteredGroups = groups.filter(g =>
    g.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredInvoices = activeGroup
    ? activeGroup.invoices.filter(inv =>
        inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.buyerName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const dataForPagination = viewingGroup ? filteredInvoices : filteredGroups;
  const totalPages = Math.max(1, Math.ceil(dataForPagination.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedData = dataForPagination.slice((safeCurrentPage - 1) * ITEMS_PER_PAGE, safeCurrentPage * ITEMS_PER_PAGE);
  const showingFrom = dataForPagination.length === 0 ? 0 : (safeCurrentPage - 1) * ITEMS_PER_PAGE + 1;
  const showingTo = Math.min(safeCurrentPage * ITEMS_PER_PAGE, dataForPagination.length);

  const canAddToGroup = activeGroup && (activeGroup.status === "verification_in_progress" || activeGroup.status === "manual_verification_required");

  const existingGroupForForm = addToExistingGroup ? groups.find(g => g.id === addToExistingGroup) : null;

  /* ───── Inline Add Invoice Form ───── */
  const renderInvoiceLineItems = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-5">Invoices</h3>
      <div className="space-y-6">
        {lineItems.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-900">Invoice {index + 1}</h4>
              {lineItems.length > 1 && (
                <button onClick={() => handleRemoveLineItem(index)} className="text-red-500 hover:text-red-700 text-xs font-medium flex items-center gap-1"><X className="w-3.5 h-3.5" /> Remove</button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => handleFileUpload(e, index, "invoiceCopy")} className="hidden" id={`r-inv-copy-${index}`} />
                    <label htmlFor={`r-inv-copy-${index}`} className="flex items-center justify-center gap-2 w-full px-3 py-3 border-2 border-dashed border-gray-300 rounded-lg text-xs text-gray-500 hover:border-blue-400 hover:text-blue-600 cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" /> Upload Invoice Copy
                    </label>
                  </>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Delivery Note</label>
                {item.deliveryNote ? (
                  <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                    <FileText className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-xs text-green-700 truncate flex-1">{item.deliveryNote.name}</span>
                    <button onClick={() => removeFile(index, "deliveryNote")} className="text-red-500 hover:text-red-700"><X className="w-3.5 h-3.5" /></button>
                  </div>
                ) : (
                  <>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => handleFileUpload(e, index, "deliveryNote")} className="hidden" id={`r-del-note-${index}`} />
                    <label htmlFor={`r-del-note-${index}`} className="flex items-center justify-center gap-2 w-full px-3 py-3 border-2 border-dashed border-gray-300 rounded-lg text-xs text-gray-500 hover:border-blue-400 hover:text-blue-600 cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" /> Upload Delivery Note
                    </label>
                  </>
                )}
              </div>
            </div>
            {item.invoiceCopy && !item.parsed && parsingIndex !== index && (
              <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">Preparing to parse invoice...</div>
            )}
            {parsingIndex === index && (
              <div className="flex items-center gap-2 mb-4 text-sm text-blue-600"><Loader2 className="w-4 h-4 animate-spin" /> Parsing invoice...</div>
            )}
            {item.parsed && item.parsingFailed && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">Some fields could not be parsed. Please enter the missing details manually.</div>
            )}
            {(item.parsed || item.invoiceNumber) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Invoice Number *</label>
                  <input type="text" value={item.invoiceNumber} onChange={e => handleLineItemChange(index, "invoiceNumber", e.target.value)} placeholder="e.g. INV-2024-001" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Invoice Date *</label>
                  <input type="date" value={item.invoiceDate} onChange={e => handleLineItemChange(index, "invoiceDate", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Invoice Amount (AED) *</label>
                  <input type="number" value={item.invoiceAmount} onChange={e => handleLineItemChange(index, "invoiceAmount", e.target.value)} placeholder="0" min="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Payment Due Date *</label>
                  <input type="date" value={item.paymentDueDate} onChange={e => handleLineItemChange(index, "paymentDueDate", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            )}
          </div>
        ))}
        {lineItems.some(i => i.invoiceNumber.trim()) && lineItems.length < 10 && (
          <button type="button" onClick={handleAddLineItem} className="text-sm text-blue-600 hover:text-blue-700 font-medium">+ Add Another Invoice</button>
        )}
        {lineItems.some(i => i.invoiceAmount) && (
          <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Amount ({lineItems.filter(i => i.invoiceAmount).length} invoice{lineItems.filter(i => i.invoiceAmount).length !== 1 ? "s" : ""})</span>
            <span className="text-sm font-semibold text-gray-900">{formatCurrency(totalAmount)}</span>
          </div>
        )}
      </div>
    </div>
  );

  /* ───── Inline Add Form Page ───── */
  if (showAddForm) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <button onClick={resetForm} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <h2 className="text-2xl font-semibold text-gray-900 mb-1">{addToExistingGroup ? `Add Invoices to ${addToExistingGroup}` : "Add Invoice"}</h2>
        <p className="text-sm text-gray-500 mb-6">{addToExistingGroup ? "Add new invoices to the existing group" : "Create a new invoice financing request"}</p>

        <div className="space-y-6">
          {/* Group Details Section */}
          {addToExistingGroup && existingGroupForForm ? (
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-5">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Group Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div><span className="text-gray-500">Group ID:</span> <span className="font-medium text-gray-900">{existingGroupForForm.id}</span></div>
                <div><span className="text-gray-500">Buyer:</span> <span className="font-medium text-gray-900">{existingGroupForForm.buyerName}</span></div>
                <div><span className="text-gray-500">Repayment:</span> <span className="font-medium text-gray-900 capitalize">{existingGroupForForm.repaymentStructure}</span></div>
                <div><span className="text-gray-500">Current Total:</span> <span className="font-medium text-gray-900">{formatCurrency(existingGroupForForm.totalInvoiceAmount)}</span></div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-5">Group Details</h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Buyer Name *</label>
                  <input type="text" value={buyerName} onChange={e => setBuyerName(e.target.value)} placeholder="Enter buyer company name" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Repayment Structure *</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button type="button" onClick={() => setRepaymentStructure("bullet")} className={`p-4 border-2 rounded-lg text-left transition-colors ${repaymentStructure === "bullet" ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${repaymentStructure === "bullet" ? "border-blue-600" : "border-gray-300"}`}>
                          {repaymentStructure === "bullet" && <div className="w-3 h-3 bg-blue-600 rounded-full" />}
                        </div>
                        <DollarSign className="w-5 h-5 text-gray-600" />
                      </div>
                      <p className="font-medium text-gray-900">Bullet Payment</p>
                      <p className="text-xs text-gray-500 mt-1">Full repayment at maturity date</p>
                    </button>
                    <button type="button" onClick={() => setRepaymentStructure("installments")} className={`p-4 border-2 rounded-lg text-left transition-colors ${repaymentStructure === "installments" ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${repaymentStructure === "installments" ? "border-blue-600" : "border-gray-300"}`}>
                          {repaymentStructure === "installments" && <div className="w-3 h-3 bg-blue-600 rounded-full" />}
                        </div>
                        <Clock className="w-5 h-5 text-gray-600" />
                      </div>
                      <p className="font-medium text-gray-900">Installments</p>
                      <p className="text-xs text-gray-500 mt-1">Repayment in scheduled installments</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Invoices Section */}
          {renderInvoiceLineItems()}

          {/* Submit */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={submitting || !lineItems.some(i => i.invoiceNumber.trim()) || (!addToExistingGroup && !buyerName.trim())}
              className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ───── Main View ───── */
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Receivable Invoice Financing</h2>
            <p className="text-sm text-gray-500 mt-1">Submit and track invoice financing requests</p>
          </div>
          {/* FIX 3 & 4: Add Invoice button always in header for both views */}
          {!viewingGroup && (
            <button onClick={() => { setAddToExistingGroup(null); setShowAddForm(true); }} className="flex items-center gap-2 bg-[#4F8DFF] text-white px-4 py-2 rounded-lg hover:bg-[#3A7AE8] transition-colors font-medium">
              <Plus className="w-4 h-4" /> Add Invoice
            </button>
          )}
          {viewingGroup && activeGroup && (
            <button onClick={() => { setAddToExistingGroup(activeGroup.id); setShowAddForm(true); }} className="flex items-center gap-2 bg-[#4F8DFF] text-white px-4 py-2 rounded-lg hover:bg-[#3A7AE8] transition-colors font-medium">
              <Plus className="w-4 h-4" /> Add Invoice
            </button>
          )}
        </div>
      </div>

      {/* FIX 1: Stats only on group level view */}
      {!viewingGroup && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg p-5 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}><Icon className="w-5 h-5" /></div>
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Invoice Level View */}
      {viewingGroup && activeGroup ? (
        <div>
          <button onClick={() => { setViewingGroup(null); setSearchTerm(""); setCurrentPage(1); }} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Invoice Groups
          </button>
          <div className="bg-white rounded-lg border border-gray-200 p-5 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-gray-500">Group ID</p>
                  <p className="text-lg font-semibold text-gray-900">{activeGroup.id}</p>
                </div>
                <div>{getGroupStatusBadge(activeGroup.status)}</div>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div><span className="text-gray-500">Buyer:</span> <span className="font-medium text-gray-900">{activeGroup.buyerName}</span></div>
                <div><span className="text-gray-500">Total:</span> <span className="font-medium text-gray-900">{formatCurrency(activeGroup.totalInvoiceAmount)}</span></div>
                <div><span className="text-gray-500">Repayment:</span> <span className="font-medium text-gray-900 capitalize">{activeGroup.repaymentStructure}</span></div>
              </div>
            </div>
          </div>

          {/* FIX 2 & 3: Search only, no button row (button moved to header) */}
          <div className="flex items-center mb-4">
            <input type="text" placeholder="Search invoices..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#E6F0FF] border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(paginatedData as InvoiceItem[]).map(inv => (
                    <tr key={inv.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{inv.id}</div>
                        <div className="text-xs text-gray-500">{inv.invoiceDate}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(inv.invoiceAmount)}</div>
                        <div className="text-xs text-gray-500">Maturity: {inv.paymentDueDate}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{inv.buyerName}</td>
                      <td className="px-6 py-4">{getInvoiceStatusBadge(inv.status)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 relative">
                          <button onClick={() => alert("Invoice download simulated.")} className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"><Download className="w-4 h-4" /></button>
                          <button onClick={e => { e.stopPropagation(); setOpenMenuId(openMenuId === inv.id ? null : inv.id); }} className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"><MoreVertical className="w-4 h-4" /></button>
                          {openMenuId === inv.id && (
                            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 min-w-[200px]">
                              <button onClick={() => { alert("Supporting document download simulated."); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Download Supporting Document</button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredInvoices.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">No invoices found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (

        /* Group Table */
        <div>
          <div className="flex items-center justify-between mb-4">
            <input type="text" placeholder="Search groups..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />
          </div>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#E6F0FF] border-b border-gray-200">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group ID</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. of Invoices</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded On</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded By</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Invoice Amount</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Disbursement</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(paginatedData as InvoiceGroup[]).map(group => {
                    const menuActions = getGroupMenuActions(group);
                    return (
                      <tr key={group.id} className="hover:bg-gray-50">
                        <td className="px-5 py-4 text-sm font-medium text-gray-900">{group.id}</td>
                        <td className="px-5 py-4 text-sm text-gray-900">{group.invoices.length}</td>
                        <td className="px-5 py-4 text-sm text-gray-900">{group.uploadedOn}</td>
                        <td className="px-5 py-4 text-sm text-gray-900">{group.uploadedBy}</td>
                        <td className="px-5 py-4 text-sm font-medium text-gray-900">{formatCurrency(group.totalInvoiceAmount)}</td>
                        <td className="px-5 py-4 text-sm text-gray-900">{group.status === "disbursed" && group.totalDisbursementAmount ? formatCurrency(group.totalDisbursementAmount) : "-"}</td>
                        <td className="px-5 py-4">{getGroupStatusBadge(group.status)}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1 relative">
                            <button onClick={() => { setViewingGroup(group.id); setSearchTerm(""); setCurrentPage(1); }} className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded" title="View"><Eye className="w-4 h-4" /></button>
                            <button onClick={() => alert("CSV download simulated for " + group.id)} className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded" title="Download CSV"><Download className="w-4 h-4" /></button>
                            {menuActions.length > 0 && (
                              <>
                                <button onClick={e => { e.stopPropagation(); setOpenMenuId(openMenuId === group.id ? null : group.id); }} className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"><MoreVertical className="w-4 h-4" /></button>
                                {openMenuId === group.id && (
                                  <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 min-w-[180px]">
                                    {menuActions.map((ma, i) => (
                                      <button key={i} onClick={e => { e.stopPropagation(); ma.action(); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">{ma.label}</button>
                                    ))}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredGroups.length === 0 && (
                    <tr><td colSpan={8} className="px-6 py-8 text-center text-sm text-gray-500">No invoice groups found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {dataForPagination.length > 0 && (
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <span>Showing {showingFrom} to {showingTo} of {dataForPagination.length} entries</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={safeCurrentPage <= 1} className="p-1.5 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"><ChevronLeft className="w-4 h-4" /></button>
            <span className="px-3 py-1 text-sm font-medium">Page {safeCurrentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={safeCurrentPage >= totalPages} className="p-1.5 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
}