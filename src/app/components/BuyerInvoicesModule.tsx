import { FileText, Plus, Upload, X, CheckCircle, Clock, AlertCircle, DollarSign, Eye, Download, MoreVertical, ArrowLeft, ChevronLeft, ChevronRight, Loader2, PenTool } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { showToast } from "./Toast";

type GroupStatus = "verification_in_progress" | "manual_verification_required" | "verification_complete" | "contract_generated" | "executing_contract" | "sent_to_lms" | "disbursed";
type InvoiceStatus = "pending" | "refer" | "approved" | "rejected";

interface InvoiceItem {
  id: string;
  invoiceDate: string;
  invoiceAmount: number;
  paymentDueDate: string;
  supplierName: string;
  supplierTLN: string;
  status: InvoiceStatus;
}

interface InvoiceGroup {
  id: string;
  invoices: InvoiceItem[];
  uploadedOn: string;
  uploadedBy: string;
  totalInvoiceAmount: number;
  status: GroupStatus;
  supplierName: string;
  supplierTLN: string;
  financingTenor: number;
  repaymentStructure: "bullet" | "installments";
  pricing: GroupPricing | null;
}

interface GroupPricing {
  flatFeePercent: number;
  flatFeeAmount: number;
  vatAmount: number;
  totalFeeWithVat: number;
  multiple: number;
  roi: number;
  borrowerCategory: "A" | "B" | "C";
}

// Pricing Rule Engine
type BorrowerCategory = "A" | "B" | "C";

const PRICING_MATRIX: Record<BorrowerCategory, Record<"bullet" | "installments", Record<number, number>>> = {
  A: {
    installments: { 30: 0.008, 60: 0.016, 90: 0.024, 120: 0.032, 150: 0.04, 180: 0.048 },
    bullet: { 60: 0.01, 90: 0.015, 120: 0.02, 150: 0.025, 180: 0.03 },
  },
  B: {
    installments: { 30: 0.015, 60: 0.03, 90: 0.045, 120: 0.06, 150: 0.075, 180: 0.09 },
    bullet: { 60: 0.02, 90: 0.03, 120: 0.04, 150: 0.05, 180: 0.06 },
  },
  C: {
    installments: { 30: 0.02, 60: 0.04, 90: 0.06, 120: 0.08, 150: 0.1, 180: 0.12 },
    bullet: { 60: 0.03, 90: 0.045, 120: 0.06, 150: 0.075, 180: 0.09 },
  },
};

const VAT_RATE = 0.05;

function getBorrowerCategory(): BorrowerCategory {
  const cat = localStorage.getItem("demo_borrower_category");
  if (cat === "A" || cat === "B" || cat === "C") return cat;
  return "B";
}

function calculatePricing(repaymentStructure: "bullet" | "installments", tenure: number, totalAmount: number): GroupPricing {
  const category = getBorrowerCategory();
  const flatFeePercent = PRICING_MATRIX[category]?.[repaymentStructure]?.[tenure] || 0;
  const flatFeeAmount = totalAmount * flatFeePercent;
  const vatAmount = flatFeeAmount * VAT_RATE;
  const totalFeeWithVat = flatFeeAmount + vatAmount;
  const multiple = 360 / tenure;
  const roi = flatFeePercent * multiple;
  return { flatFeePercent, flatFeeAmount, vatAmount, totalFeeWithVat, multiple, roi, borrowerCategory: category };
}

const TENURE_OPTIONS: Record<"bullet" | "installments", number[]> = {
  installments: [30, 60, 90, 120, 150, 180],
  bullet: [60, 90, 120, 150, 180],
};

interface LineItem {
  invoiceNumber: string;
  invoiceDate: string;
  invoiceAmount: string;
  paymentDueDate: string;
  invoiceCopy: File | null;
  deliveryNote: File | null;
  parsed: boolean;
  parsingFailed: boolean;
  expanded: boolean;
}

type AddInvoicePhase = "upload" | "parsing" | "review" | "validating";

interface Supplier {
  id: string;
  name: string;
  tln: string;
  status: string;
}

const ITEMS_PER_PAGE = 10;

const approvedSuppliers: Supplier[] = [
  { id: "SUP-001", name: "Tech Suppliers LLC", tln: "TLN-100234", status: "active" },
  { id: "SUP-002", name: "Industrial Parts Co.", tln: "TLN-100567", status: "active" },
  { id: "SUP-003", name: "Gulf Materials Trading", tln: "TLN-100891", status: "active" },
  { id: "SUP-006", name: "Newly Added Supplier", tln: "TLN-NEW001", status: "active" },
];

const initialGroups: InvoiceGroup[] = [
  {
    id: "GRP-P001", uploadedOn: "2024-03-05", uploadedBy: "Ahmed Al Mansouri", status: "verification_complete",
    supplierName: "Tech Suppliers LLC", supplierTLN: "TLN-100234", financingTenor: 60, repaymentStructure: "bullet",
    totalInvoiceAmount: 325000, pricing: calculatePricing("bullet", 60, 325000),
    invoices: [
      { id: "INV-P001-01", invoiceDate: "2024-03-01", invoiceAmount: 120000, paymentDueDate: "2024-06-01", supplierName: "Tech Suppliers LLC", supplierTLN: "TLN-100234", status: "approved" },
      { id: "INV-P001-02", invoiceDate: "2024-03-02", invoiceAmount: 95000, paymentDueDate: "2024-06-02", supplierName: "Tech Suppliers LLC", supplierTLN: "TLN-100234", status: "approved" },
      { id: "INV-P001-03", invoiceDate: "2024-03-03", invoiceAmount: 110000, paymentDueDate: "2024-06-03", supplierName: "Tech Suppliers LLC", supplierTLN: "TLN-100234", status: "refer" },
    ],
  },
  {
    id: "GRP-P002", uploadedOn: "2024-03-10", uploadedBy: "Ahmed Al Mansouri", status: "verification_in_progress",
    supplierName: "Industrial Parts Co.", supplierTLN: "TLN-100567", financingTenor: 90, repaymentStructure: "installments",
    totalInvoiceAmount: 278000, pricing: calculatePricing("installments", 90, 278000),
    invoices: [
      { id: "INV-P002-01", invoiceDate: "2024-03-08", invoiceAmount: 156000, paymentDueDate: "2024-06-08", supplierName: "Industrial Parts Co.", supplierTLN: "TLN-100567", status: "pending" },
      { id: "INV-P002-02", invoiceDate: "2024-03-09", invoiceAmount: 122000, paymentDueDate: "2024-06-09", supplierName: "Industrial Parts Co.", supplierTLN: "TLN-100567", status: "pending" },
    ],
  },
  {
    id: "GRP-P003", uploadedOn: "2024-02-28", uploadedBy: "Ahmed Al Mansouri", status: "contract_generated",
    supplierName: "Gulf Materials Trading", supplierTLN: "TLN-100891", financingTenor: 90, repaymentStructure: "bullet",
    totalInvoiceAmount: 512000, pricing: calculatePricing("bullet", 90, 512000),
    invoices: [
      { id: "INV-P003-01", invoiceDate: "2024-02-25", invoiceAmount: 134000, paymentDueDate: "2024-05-25", supplierName: "Gulf Materials Trading", supplierTLN: "TLN-100891", status: "approved" },
      { id: "INV-P003-02", invoiceDate: "2024-02-26", invoiceAmount: 98000, paymentDueDate: "2024-05-26", supplierName: "Gulf Materials Trading", supplierTLN: "TLN-100891", status: "approved" },
      { id: "INV-P003-03", invoiceDate: "2024-02-27", invoiceAmount: 167000, paymentDueDate: "2024-05-27", supplierName: "Gulf Materials Trading", supplierTLN: "TLN-100891", status: "refer" },
      { id: "INV-P003-04", invoiceDate: "2024-02-28", invoiceAmount: 113000, paymentDueDate: "2024-05-28", supplierName: "Gulf Materials Trading", supplierTLN: "TLN-100891", status: "approved" },
    ],
  },
  {
    id: "GRP-P004", uploadedOn: "2024-03-12", uploadedBy: "Ahmed Al Mansouri", status: "manual_verification_required",
    supplierName: "Tech Suppliers LLC", supplierTLN: "TLN-100234", financingTenor: 120, repaymentStructure: "bullet",
    totalInvoiceAmount: 410000, pricing: calculatePricing("bullet", 120, 410000),
    invoices: [
      { id: "INV-P004-01", invoiceDate: "2024-03-10", invoiceAmount: 410000, paymentDueDate: "2024-07-10", supplierName: "Tech Suppliers LLC", supplierTLN: "TLN-100234", status: "pending" },
    ],
  },
  {
    id: "GRP-P005", uploadedOn: "2024-02-15", uploadedBy: "Ahmed Al Mansouri", status: "disbursed",
    supplierName: "Industrial Parts Co.", supplierTLN: "TLN-100567", financingTenor: 60, repaymentStructure: "installments",
    totalInvoiceAmount: 645000, pricing: calculatePricing("installments", 60, 645000),
    invoices: [
      { id: "INV-P005-01", invoiceDate: "2024-02-10", invoiceAmount: 215000, paymentDueDate: "2024-05-10", supplierName: "Industrial Parts Co.", supplierTLN: "TLN-100567", status: "approved" },
      { id: "INV-P005-02", invoiceDate: "2024-02-11", invoiceAmount: 198000, paymentDueDate: "2024-05-11", supplierName: "Industrial Parts Co.", supplierTLN: "TLN-100567", status: "approved" },
      { id: "INV-P005-03", invoiceDate: "2024-02-12", invoiceAmount: 232000, paymentDueDate: "2024-05-12", supplierName: "Industrial Parts Co.", supplierTLN: "TLN-100567", status: "approved" },
    ],
  },
  {
    id: "GRP-P006", uploadedOn: "2024-03-01", uploadedBy: "Ahmed Al Mansouri", status: "sent_to_lms",
    supplierName: "Gulf Materials Trading", supplierTLN: "TLN-100891", financingTenor: 90, repaymentStructure: "bullet",
    totalInvoiceAmount: 287000, pricing: calculatePricing("bullet", 90, 287000),
    invoices: [
      { id: "INV-P006-01", invoiceDate: "2024-02-28", invoiceAmount: 165000, paymentDueDate: "2024-05-28", supplierName: "Gulf Materials Trading", supplierTLN: "TLN-100891", status: "approved" },
      { id: "INV-P006-02", invoiceDate: "2024-02-28", invoiceAmount: 122000, paymentDueDate: "2024-05-28", supplierName: "Gulf Materials Trading", supplierTLN: "TLN-100891", status: "approved" },
    ],
  },
];


export function BuyerInvoicesModule() {
  const [searchParams] = useSearchParams();
  const [groups, setGroups] = useState<InvoiceGroup[]>(initialGroups);
  const [viewingGroup, setViewingGroup] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addToExistingGroup, setAddToExistingGroup] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [financingTenor, setFinancingTenor] = useState("60");
  const [repaymentStructure, setRepaymentStructure] = useState<"bullet" | "installments">("bullet");
  const [addPhase, setAddPhase] = useState<AddInvoicePhase>("upload");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [showCommodityExchange, setShowCommodityExchange] = useState(false);

  useEffect(() => {
    if (searchParams.get("add") === "true") setShowAddForm(true);
    const supplierParam = searchParams.get("supplier");
    if (supplierParam) setSelectedSupplier(supplierParam);
  }, [searchParams]);

  // Auto-update group status based on invoice statuses
  useEffect(() => {
    setGroups(prev => prev.map(g => {
      if (g.invoices.length === 0 || g.status === "executing_contract" || g.status === "sent_to_lms" || g.status === "disbursed") return g;
      const allApproved = g.invoices.every(inv => inv.status === "approved");
      const hasReferOrRejected = g.invoices.some(inv => inv.status === "refer" || inv.status === "rejected");
      if (allApproved && g.status !== "executing_contract") {
        return { ...g, status: "executing_contract" };
      }
      if (hasReferOrRejected && g.status !== "manual_verification_required") {
        return { ...g, status: "manual_verification_required" };
      }
      return g;
    }));
  }, [groups]);

  // Auto-trigger Murabaha contract execution and send to LMS when group becomes executing_contract
  useEffect(() => {
    const executingGroup = groups.find(g => g.status === "executing_contract" && g.id === viewingGroup);
    if (executingGroup && !showCommodityExchange) {
      setShowCommodityExchange(true);
      setTimeout(() => {
        setGroups(prev => prev.map(g => g.id === executingGroup.id ? { ...g, status: "sent_to_lms" as GroupStatus } : g));
        showToast("success", "Murabaha contract executed. Details sent to LMS.");
        setShowCommodityExchange(false);
      }, 10000);
    }
  }, [groups, viewingGroup]);

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
      executing_contract: { color: "bg-amber-100 text-amber-700", label: "Executing Contract" },
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

  const handleBulkUpload = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 10);
    setUploadedFiles(newFiles);
    // Auto-start parsing
    setAddPhase("parsing");
    setTimeout(() => {
      const parsed: LineItem[] = newFiles.map((file) => {
        const isFailed = Math.random() < 0.15;
        const num = String(Math.floor(Math.random() * 9000) + 1000);
        const today = new Date().toISOString().split("T")[0];
        const due = new Date(Date.now() + 90 * 86400000).toISOString().split("T")[0];
        if (isFailed) {
          return { invoiceNumber: "", invoiceDate: "", invoiceAmount: "", paymentDueDate: "", invoiceCopy: file, deliveryNote: null, parsed: true, parsingFailed: true, expanded: true };
        }
        const amount = String(Math.floor(Math.random() * 250000) + 50000);
        return { invoiceNumber: `INV-2024-${num}`, invoiceDate: today, invoiceAmount: amount, paymentDueDate: due, invoiceCopy: file, deliveryNote: null, parsed: true, parsingFailed: false, expanded: true };
      });
      setLineItems(parsed);
      setAddPhase("review");
    }, 10000);
  };

  const handleLineItemChange = (idx: number, field: keyof LineItem, value: string) => {
    setLineItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const toggleExpand = (idx: number) => {
    setLineItems(prev => prev.map((item, i) => i === idx ? { ...item, expanded: !item.expanded } : item));
  };

  const handleRemoveLineItem = (idx: number) => {
    if (lineItems.length > 1) setLineItems(prev => prev.filter((_, i) => i !== idx));
  };

  const handleDeliveryNoteUpload = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const file = e.target.files?.[0] || null;
    setLineItems(prev => prev.map((item, i) => i === idx ? { ...item, deliveryNote: file } : item));
  };

  const totalAmount = lineItems.reduce((sum, item) => sum + (Number(item.invoiceAmount) || 0), 0);
  const selectedSupplierData = approvedSuppliers.find(s => s.id === selectedSupplier);

  const getInvoiceStatuses = (count: number): InvoiceStatus[] => {
    const outcome = localStorage.getItem("demo_invoice_outcome") || "all_approved";
    if (outcome === "all_approved") return Array(count).fill("approved");
    if (outcome === "all_rejected") return Array(count).fill("rejected");
    if (outcome === "one_rejected") {
      const statuses: InvoiceStatus[] = Array(count).fill("approved");
      statuses[Math.floor(Math.random() * count)] = "rejected";
      return statuses;
    }
    // one_refer
    const statuses: InvoiceStatus[] = Array(count).fill("approved");
    statuses[Math.floor(Math.random() * count)] = "refer";
    return statuses;
  };

  const handleSubmit = () => {
    setAddPhase("validating");
    setSubmitting(true);
    const validItems = lineItems.filter(item => item.invoiceNumber.trim());
    if (addToExistingGroup) {
      const existingGroup = groups.find(g => g.id === addToExistingGroup);
      const newInvoices: InvoiceItem[] = validItems.map((item, i) => ({
        id: `${addToExistingGroup}-NEW-${String(i + 1).padStart(2, "0")}`,
        invoiceDate: item.invoiceDate,
        invoiceAmount: Number(item.invoiceAmount) || 0,
        paymentDueDate: item.paymentDueDate,
        supplierName: existingGroup?.supplierName || "",
        supplierTLN: existingGroup?.supplierTLN || "",
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
          return { ...g, invoices: g.invoices.map((inv, idx) => {
            if (inv.status !== "pending") return inv;
            const pendingInvs = g.invoices.filter(i => i.status === "pending");
            const pendingIdx = pendingInvs.indexOf(inv);
            const statuses = getInvoiceStatuses(pendingInvs.length);
            return { ...inv, status: statuses[pendingIdx] };
          }) };
        }));
        showToast("success", "Invoice(s) submitted and validated successfully.");
        setShowAddForm(false);
        setAddToExistingGroup(null);
        setSubmitting(false);
        setAddPhase("upload");
        setUploadedFiles([]);
        setLineItems([]);
        setViewingGroup(addToExistingGroup);
        setSearchTerm("");
        setCurrentPage(1);
      }, 5000);
    } else {
      if (!selectedSupplierData) return;
      const groupNum = String(groups.length + 1).padStart(3, "0");
      const groupId = `GRP-P${groupNum}`;
      const newInvoices: InvoiceItem[] = validItems.map((item, i) => ({
        id: `INV-P${groupNum}-${String(i + 1).padStart(2, "0")}`,
        invoiceDate: item.invoiceDate,
        invoiceAmount: Number(item.invoiceAmount) || 0,
        paymentDueDate: item.paymentDueDate,
        supplierName: selectedSupplierData.name,
        supplierTLN: selectedSupplierData.tln,
        status: "pending" as InvoiceStatus,
      }));
      const newGroup: InvoiceGroup = {
        id: groupId,
        invoices: newInvoices,
        uploadedOn: new Date().toISOString().split("T")[0],
        uploadedBy: "Ahmed Al Mansouri",
        totalInvoiceAmount: totalAmount,
        status: "verification_in_progress",
        supplierName: selectedSupplierData.name,
        supplierTLN: selectedSupplierData.tln,
        financingTenor: Number(financingTenor),
        repaymentStructure,
        pricing: calculatePricing(repaymentStructure, Number(financingTenor), totalAmount),
      };
      setGroups(prev => [newGroup, ...prev]);
      setTimeout(() => {
        setSubmitting(false);
        setGroups(prev => prev.map(g => {
          if (g.id !== groupId) return g;
          return { ...g, invoices: (() => {
            const statuses = getInvoiceStatuses(g.invoices.length);
            return g.invoices.map((inv, idx) => ({ ...inv, status: statuses[idx] }));
          })() };
        }));
        showToast("success", "Invoice(s) submitted and validated successfully.");
        setShowAddForm(false);
        setAddToExistingGroup(null);
        setSubmitting(false);
        setSelectedSupplier("");
        setFinancingTenor("60");
        setRepaymentStructure("bullet");
        setAddPhase("upload");
        setUploadedFiles([]);
        setLineItems([]);
        setViewingGroup(groupId);
        setSearchTerm("");
        setCurrentPage(1);
      }, 5000);
    }
  };

  const resetForm = () => {
    setShowAddForm(false);
    setAddToExistingGroup(null);
    setShowSuccess(false);
    setSubmitting(false);
    setSelectedSupplier("");
    setFinancingTenor("60");
    setRepaymentStructure("bullet");
    setAddPhase("upload");
    setUploadedFiles([]);
    setLineItems([]);
  };

  const stats = [
    { label: "Total Requests", value: groups.length, icon: FileText, color: "bg-blue-100 text-blue-600" },
    { label: "Under Validation", value: groups.filter(g => g.status === "verification_in_progress" || g.status === "manual_verification_required").length, icon: AlertCircle, color: "bg-yellow-100 text-yellow-600" },
    { label: "Approved", value: groups.filter(g => ["verification_complete", "contract_generated", "executing_contract"].includes(g.status)).length, icon: CheckCircle, color: "bg-green-100 text-green-600" },
    { label: "Disbursed", value: groups.filter(g => g.status === "disbursed").length, icon: DollarSign, color: "bg-emerald-100 text-emerald-600" },
  ];

  const activeGroup = viewingGroup ? groups.find(g => g.id === viewingGroup) : null;

  const filteredGroups = groups.filter(g =>
    g.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredInvoices = activeGroup
    ? activeGroup.invoices.filter(inv =>
        inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.supplierTLN.toLowerCase().includes(searchTerm.toLowerCase())
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

  const failedCount = lineItems.filter(i => i.parsingFailed).length;

  /* ───── Inline Add Invoice Form ───── */
  const renderAddInvoiceContent = () => {
    if (addPhase === "upload") {
      return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-1">Upload Invoices</h3>
          <p className="text-xs text-gray-500 mb-5">Upload up to 10 invoice documents. Parsing will start automatically.</p>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-colors cursor-pointer" onClick={() => { const inp = document.createElement("input"); inp.type = "file"; inp.accept = ".pdf,.jpg,.jpeg,.png"; inp.multiple = true; inp.onchange = () => handleBulkUpload(inp.files); inp.click(); }}>
            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-700">Click to upload invoice documents</p>
            <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG accepted · Up to 10 files</p>
          </div>
        </div>
      );
    }

    if (addPhase === "parsing") {
      return (
        <div className="bg-white rounded-lg border border-gray-200 p-10 flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 w-16 h-16 bg-blue-100 rounded-full animate-ping opacity-30" style={{ animationDuration: "2s" }} />
            <Loader2 className="relative w-16 h-16 text-[#4F8DFF] animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Parsing Invoices</h3>
          <p className="text-sm text-gray-500 max-w-sm">Your {uploadedFiles.length} invoice{uploadedFiles.length !== 1 ? "s are" : " is"} being parsed. Please wait, this may take a few moments.</p>
        </div>
      );
    }

    if (addPhase === "validating") {
      return (
        <div className="bg-white rounded-lg border border-gray-200 p-10 flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 w-16 h-16 bg-green-100 rounded-full animate-ping opacity-30" style={{ animationDuration: "2s" }} />
            <Loader2 className="relative w-16 h-16 text-green-600 animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Validating Invoices</h3>
          <p className="text-sm text-gray-500 max-w-sm">Running invoice validation rules in the rule engine. Please wait...</p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Review Invoices</h3>
            <p className="text-xs text-gray-500 mt-0.5">{lineItems.length} invoice{lineItems.length !== 1 ? "s" : ""} parsed{failedCount > 0 ? ` · ${failedCount} failed — please fill in details manually` : ""}</p>
          </div>
        </div>
        {failedCount > 0 && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{failedCount} invoice{failedCount !== 1 ? "s" : ""} could not be parsed. The document{failedCount !== 1 ? "s have" : " has"} been uploaded but details need to be entered manually.</span>
          </div>
        )}
        <div className="space-y-3">
          {lineItems.map((item, index) => (
            <div key={index} className={`border rounded-lg ${item.parsingFailed ? "border-amber-300 bg-amber-50/30" : "border-gray-200"}`}>
              <div className="flex items-center justify-between px-5 py-3 cursor-pointer" onClick={() => toggleExpand(index)}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${item.parsingFailed ? "bg-amber-100 text-amber-700" : item.invoiceNumber ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {item.parsingFailed ? "!" : index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.invoiceNumber || `Invoice ${index + 1}`}{item.parsingFailed ? " — Parse Failed" : ""}</p>
                    <p className="text-xs text-gray-500">{item.invoiceCopy?.name || "No file"}{item.invoiceAmount ? ` · AED ${Number(item.invoiceAmount).toLocaleString()}` : ""}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.parsingFailed && <span className="text-xs text-amber-600 font-medium">Manual entry required</span>}
                  {!item.parsingFailed && item.invoiceNumber && <CheckCircle className="w-4 h-4 text-green-500" />}
                  {lineItems.length > 1 && <button onClick={(e) => { e.stopPropagation(); handleRemoveLineItem(index); }} className="text-red-400 hover:text-red-600 p-1"><X className="w-3.5 h-3.5" /></button>}
                  <svg className={`w-4 h-4 text-gray-400 transition-transform ${item.expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
              {item.expanded && (
                <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Invoice Copy</label>
                      <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                        <FileText className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-xs text-green-700 truncate flex-1">{item.invoiceCopy?.name || "Uploaded"}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Delivery Note</label>
                      {item.deliveryNote ? (
                        <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                          <FileText className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-xs text-green-700 truncate flex-1">{item.deliveryNote.name}</span>
                          <button onClick={() => setLineItems(prev => prev.map((it, i) => i === index ? { ...it, deliveryNote: null } : it))} className="text-red-500 hover:text-red-700"><X className="w-3.5 h-3.5" /></button>
                        </div>
                      ) : (
                        <>
                          <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => handleDeliveryNoteUpload(e, index)} className="hidden" id={`p-del-note-${index}`} />
                          <label htmlFor={`p-del-note-${index}`} className="flex items-center justify-center gap-2 w-full px-3 py-3 border-2 border-dashed border-gray-300 rounded-lg text-xs text-gray-500 hover:border-blue-400 hover:text-blue-600 cursor-pointer transition-colors">
                            <Upload className="w-3.5 h-3.5" /> Upload Delivery Note
                          </label>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Invoice Number *</label>
                      <input type="text" value={item.invoiceNumber} onChange={e => handleLineItemChange(index, "invoiceNumber", e.target.value)} placeholder="Invoice Number" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
                </div>
              )}
            </div>
          ))}
        </div>
        {lineItems.some(i => i.invoiceAmount) && (
          <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center mt-4">
            <span className="text-sm text-gray-600">Total Amount ({lineItems.filter(i => i.invoiceAmount).length} invoice{lineItems.filter(i => i.invoiceAmount).length !== 1 ? "s" : ""})</span>
            <span className="text-sm font-semibold text-gray-900">{formatCurrency(totalAmount)}</span>
          </div>
        )}
      </div>
    );
  };

  /* ───── Inline Add Form Page ───── */
  if (showAddForm) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <button onClick={resetForm} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <h2 className="text-2xl font-semibold text-gray-900 mb-1">{addToExistingGroup ? `Add Invoices to ${addToExistingGroup}` : "Add Invoice"}</h2>
        <p className="text-sm text-gray-500 mb-6">{addToExistingGroup ? "Add new invoices to the existing group" : "Create a new payable invoice financing request"}</p>

        <div className="space-y-6">
          {/* Group Details Section */}
          {addToExistingGroup && existingGroupForForm ? (
            <div className="bg-gray-50 rounded-lg border border-gray-200 px-4 py-2.5 flex items-center gap-3 text-sm flex-wrap">
              <span className="font-semibold text-gray-900">{existingGroupForForm.id}</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-500">Supplier:</span> <span className="font-medium text-gray-900">{existingGroupForForm.supplierName}</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-500">Tenor:</span> <span className="font-medium text-gray-900">{existingGroupForForm.financingTenor} days</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-500">Repayment:</span> <span className="font-medium text-gray-900 capitalize">{existingGroupForForm.repaymentStructure}</span>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 px-4 py-3">
              <div className="flex items-end gap-4 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Supplier *</label>
                  <select value={selectedSupplier} onChange={e => setSelectedSupplier(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                    <option value="">Choose a supplier...</option>
                    {approvedSuppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.tln})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Repayment *</label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => { setRepaymentStructure("bullet"); setFinancingTenor("60"); }} className={`px-4 py-2 border-2 rounded-lg text-sm font-medium transition-colors ${repaymentStructure === "bullet" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-700 hover:border-gray-300"}`}>Bullet</button>
                    <button type="button" onClick={() => { setRepaymentStructure("installments"); setFinancingTenor("30"); }} className={`px-4 py-2 border-2 rounded-lg text-sm font-medium transition-colors ${repaymentStructure === "installments" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-700 hover:border-gray-300"}`}>Installments</button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Tenor *</label>
                  <div className="flex gap-1.5">
                    {TENURE_OPTIONS[repaymentStructure].map(t => (
                      <button key={t} type="button" onClick={() => setFinancingTenor(String(t))} className={`px-3 py-2 border-2 rounded-lg text-sm font-medium transition-colors ${financingTenor === String(t) ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-700 hover:border-gray-300"}`}>
                        {t}d
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {/* Real-time Pricing Preview */}
              {financingTenor && totalAmount > 0 && (() => {
                const preview = calculatePricing(repaymentStructure, Number(financingTenor), totalAmount);
                return (
                  <div className="mt-3 border border-blue-200 rounded-lg overflow-hidden">
                    <div className="bg-blue-50 px-4 py-2 flex items-center gap-2 border-b border-blue-200">
                      <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-xs font-semibold text-blue-800">Pricing</span>
                    </div>
                    <div className="bg-white px-4 py-3">
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">Fee %</p>
                          <p className="text-lg font-bold text-gray-900">{(preview.flatFeePercent * 100).toFixed(2)}%</p>
                        </div>
                        <div className="h-8 w-px bg-gray-200" />
                        <div className="flex items-center gap-2 text-sm">
                          <div className="text-center">
                            <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">Fee</p>
                            <p className="font-medium text-gray-900">{formatCurrency(preview.flatFeeAmount)}</p>
                          </div>
                          <span className="text-gray-300 text-lg">+</span>
                          <div className="text-center">
                            <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">VAT (5%)</p>
                            <p className="font-medium text-gray-900">{formatCurrency(preview.vatAmount)}</p>
                          </div>
                          <span className="text-gray-300 text-lg">=</span>
                          <div className="text-center">
                            <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">Total Fee</p>
                            <p className="font-bold text-green-700">{formatCurrency(preview.totalFeeWithVat)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Invoices Section */}
          {renderAddInvoiceContent()}

          {/* Submit — only show in review phase */}
          {addPhase === "review" && (
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={submitting || !lineItems.some(i => i.invoiceNumber.trim()) || (!addToExistingGroup && !selectedSupplier)}
              className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Submit
            </button>
          </div>
          )}
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
            <h2 className="text-2xl font-semibold text-gray-900">Payable Invoice Financing</h2>
            <p className="text-sm text-gray-500 mt-1">Create and manage your invoice financing requests</p>
          </div>
          {/* FIX 3 & 4: Add Invoice button always in header for both views */}
          {!viewingGroup && (
            <button onClick={() => { setAddToExistingGroup(null); setShowAddForm(true); }} className="flex items-center gap-2 bg-[#4F8DFF] text-white px-4 py-2 rounded-lg hover:bg-[#3A7AE8] transition-colors font-medium">
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
          <div className="bg-white rounded-lg border border-gray-200 mb-5 overflow-hidden">
            {/* Header — GRP ID + Status */}
            <div className="px-5 py-3 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-base font-bold text-gray-900 tracking-tight">{activeGroup.id}</span>
                {getGroupStatusBadge(activeGroup.status)}
              </div>
            </div>

            {/* Two-column layout: Details left, Fee breakdown right */}
            <div className="flex border-b border-gray-100">
              {/* Left — Key Details */}
              <div className="flex-1 px-5 py-4 border-r border-gray-100">
                <div className="grid grid-cols-4 gap-x-6 gap-y-3">
                  <div>
                    <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-0.5">Supplier</p>
                    <p className="text-sm font-medium text-gray-900">{activeGroup.supplierName}</p>
                    <p className="text-[11px] text-gray-400">{activeGroup.supplierTLN}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-0.5">Financed Amount</p>
                    <p className="text-lg font-bold text-gray-900 tabular-nums">{formatCurrency(activeGroup.totalInvoiceAmount)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-0.5">Repayment Period</p>
                    <p className="text-sm font-medium text-gray-900">{activeGroup.financingTenor} days</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-0.5">Payment Type</p>
                    <p className="text-sm font-medium text-gray-900 capitalize">{activeGroup.repaymentStructure}</p>
                  </div>
                </div>
              </div>

              {/* Right — Fee Breakdown */}
              {activeGroup.pricing && (
                <div className="w-[340px] px-5 py-4 bg-gray-50/60">
                  <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-2">Processing Fee</p>
                  <div className="flex items-stretch gap-3">
                    <div className="bg-white rounded border border-gray-100 px-3 py-2 flex-1">
                      <p className="text-[10px] text-gray-400 uppercase">Fee ({(activeGroup.pricing.flatFeePercent * 100).toFixed(2)}%)</p>
                      <p className="text-sm font-semibold text-gray-900 tabular-nums">{formatCurrency(activeGroup.pricing.flatFeeAmount)}</p>
                    </div>
                    <div className="bg-white rounded border border-gray-100 px-3 py-2 flex-1">
                      <p className="text-[10px] text-gray-400 uppercase">VAT</p>
                      <p className="text-sm font-semibold text-gray-900 tabular-nums">{formatCurrency(activeGroup.pricing.vatAmount)}</p>
                    </div>
                    <div className="bg-green-50 rounded border border-green-200 px-3 py-2 flex-1">
                      <p className="text-[10px] text-green-600 uppercase">Total</p>
                      <p className="text-sm font-bold text-green-700 tabular-nums">{formatCurrency(activeGroup.pricing.totalFeeWithVat)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Status message */}
            {(activeGroup.status === "sent_to_lms" || activeGroup.status === "disbursed") && (
              <div className="px-5 py-2.5 bg-green-50 flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-800">{activeGroup.status === "disbursed" ? <span>Funds have been disbursed to <span className="font-semibold">{activeGroup.supplierName}</span>. Both you and the supplier have been notified.</span> : <span>Funds will be disbursed shortly to <span className="font-semibold">{activeGroup.supplierName}</span>. Both you and the supplier will be notified.</span>}</p>
              </div>
            )}
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier TLN</th>
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
                      <td className="px-6 py-4 text-sm text-gray-900">{inv.supplierName}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{inv.supplierTLN}</td>
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
                    <tr><td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">No invoices found.</td></tr>
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
                    <tr><td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">No invoice groups found.</td></tr>
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

      {/* Commodity Exchange & Contract Execution Loader */}
      {showCommodityExchange && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-10 flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 w-16 h-16 bg-amber-100 rounded-full animate-ping opacity-30" style={{ animationDuration: "2s" }} />
              <Loader2 className="relative w-16 h-16 text-amber-500 animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Murabaha Contract Execution in Progress</h3>
            <p className="text-sm text-gray-500 max-w-sm mb-4">Executing Murabaha contract and sending details to LMS. This may take a few moments.</p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              <span>Processing Murabaha transaction...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}