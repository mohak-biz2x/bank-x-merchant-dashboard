import { useState } from "react";
import { FileText, CheckCircle, Clock, X, Eye, DollarSign, PenLine, ExternalLink, ShieldCheck } from "lucide-react";
import { showToast } from "./Toast";

type InvStatus = "pending_approval" | "approved" | "disbursed" | "rejected";

interface InvoiceLineItem {
  invoiceNumber: string;
  invoiceDate: string;
  invoiceAmount: number;
  paymentDueDate: string;
  invoiceCopyName: string;
  deliveryNoteName: string;
}

interface Invoice {
  id: string;
  supplierName: string;
  totalAmount: number;
  submittedDate: string;
  createdDate: string;
  status: InvStatus;
  approvedDate?: string;
  disbursedDate?: string;
  noaSigned?: boolean;
  lineItems: InvoiceLineItem[];
}

const STATUS: Record<InvStatus, { label: string; color: string; icon: typeof Clock }> = {
  pending_approval: { label: "Pending Approval", color: "bg-orange-100 text-orange-700", icon: Clock },
  approved: { label: "Approved", color: "bg-green-100 text-green-700", icon: CheckCircle },
  disbursed: { label: "Disbursed", color: "bg-emerald-100 text-emerald-700", icon: DollarSign },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700", icon: X },
};

const INIT: Invoice[] = [
  {
    id: "INV-REQ-001", supplierName: "Tech Suppliers LLC", totalAmount: 125000,
    submittedDate: "2025-03-20", createdDate: "2025-03-19", status: "pending_approval",
    lineItems: [
      { invoiceNumber: "TS-INV-2025-101", invoiceDate: "2025-03-18", invoiceAmount: 75000, paymentDueDate: "2025-06-18", invoiceCopyName: "TS-INV-2025-101.pdf", deliveryNoteName: "DN-TS-101.pdf" },
      { invoiceNumber: "TS-INV-2025-102", invoiceDate: "2025-03-19", invoiceAmount: 50000, paymentDueDate: "2025-06-19", invoiceCopyName: "TS-INV-2025-102.pdf", deliveryNoteName: "DN-TS-102.pdf" },
    ],
  },
  {
    id: "INV-REQ-002", supplierName: "Industrial Parts Co.", totalAmount: 289500,
    submittedDate: "2025-03-18", createdDate: "2025-03-17", status: "pending_approval",
    lineItems: [
      { invoiceNumber: "IP-INV-2025-205", invoiceDate: "2025-03-16", invoiceAmount: 289500, paymentDueDate: "2025-06-16", invoiceCopyName: "IP-INV-2025-205.pdf", deliveryNoteName: "DN-IP-205.pdf" },
    ],
  },
  {
    id: "INV-REQ-003", supplierName: "Tech Suppliers LLC", totalAmount: 78000,
    submittedDate: "2025-03-15", createdDate: "2025-03-14", status: "approved", approvedDate: "2025-03-16",
    lineItems: [
      { invoiceNumber: "TS-INV-2025-103", invoiceDate: "2025-03-13", invoiceAmount: 78000, paymentDueDate: "2025-06-13", invoiceCopyName: "TS-INV-2025-103.pdf", deliveryNoteName: "DN-TS-103.pdf" },
    ],
  },
  {
    id: "INV-REQ-004", supplierName: "Emirates Supply Chain", totalAmount: 456000,
    submittedDate: "2025-03-10", createdDate: "2025-03-09", status: "disbursed", approvedDate: "2025-03-11", disbursedDate: "2025-03-12",
    lineItems: [
      { invoiceNumber: "ES-INV-2025-042", invoiceDate: "2025-03-08", invoiceAmount: 256000, paymentDueDate: "2025-06-08", invoiceCopyName: "ES-INV-2025-042.pdf", deliveryNoteName: "DN-ES-042.pdf" },
      { invoiceNumber: "ES-INV-2025-043", invoiceDate: "2025-03-09", invoiceAmount: 200000, paymentDueDate: "2025-06-09", invoiceCopyName: "ES-INV-2025-043.pdf", deliveryNoteName: "DN-ES-043.pdf" },
    ],
  },
  {
    id: "INV-REQ-005", supplierName: "Global Trading House", totalAmount: 92000,
    submittedDate: "2025-03-08", createdDate: "2025-03-07", status: "pending_approval",
    lineItems: [
      { invoiceNumber: "GT-INV-2025-018", invoiceDate: "2025-03-06", invoiceAmount: 92000, paymentDueDate: "2025-06-06", invoiceCopyName: "GT-INV-2025-018.pdf", deliveryNoteName: "DN-GT-018.pdf" },
    ],
  },
  {
    id: "INV-REQ-006", supplierName: "Industrial Parts Co.", totalAmount: 156000,
    submittedDate: "2025-03-05", createdDate: "2025-03-04", status: "approved", approvedDate: "2025-03-06",
    lineItems: [
      { invoiceNumber: "IP-INV-2025-207", invoiceDate: "2025-03-03", invoiceAmount: 156000, paymentDueDate: "2025-06-03", invoiceCopyName: "IP-INV-2025-207.pdf", deliveryNoteName: "DN-IP-207.pdf" },
    ],
  },
];

export function PremiumBuyerInvoices() {
  const [invoices, setInvoices] = useState(INIT);
  const [viewInv, setViewInv] = useState<Invoice | null>(null);
  const [confirmApprove, setConfirmApprove] = useState<Invoice | null>(null);
  const [noaInv, setNoaInv] = useState<Invoice | null>(null);
  const [noaStep, setNoaStep] = useState<"review" | "signing" | "signed">("review");

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED", minimumFractionDigits: 0 }).format(n);

  const doApprove = (id: string) => {
    setInvoices((p) =>
      p.map((i) =>
        i.id === id
          ? { ...i, status: "approved" as InvStatus, approvedDate: new Date().toISOString().split("T")[0], noaSigned: true }
          : i
      )
    );
    showToast("success", "Invoice approved and NOA signed.");
    setNoaInv(null);
    setNoaStep("review");
    setConfirmApprove(null);
    setViewInv(null);
  };

  const handleConfirmApprove = (inv: Invoice) => {
    setConfirmApprove(null);
    setNoaInv(inv);
    setNoaStep("review");
  };

  const doReject = (id: string) => {
    setInvoices((p) => p.map((i) => i.id === id ? { ...i, status: "rejected" as InvStatus } : i));
    showToast("info", "Invoice rejected.");
    setViewInv(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Payable Invoices</h2>
        <p className="text-sm text-gray-500 mt-1">Review and approve supplier invoices</p>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Request ID</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Supplier</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Invoices</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Submitted</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => {
              const st = STATUS[inv.status];
              return (
                <tr key={inv.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{inv.id}</td>
                  <td className="px-4 py-3 text-gray-700">{inv.supplierName}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{inv.lineItems.map((l) => l.invoiceNumber).join(", ")}</td>
                  <td className="px-4 py-3 font-medium">{fmt(inv.totalAmount)}</td>
                  <td className="px-4 py-3 text-gray-500">{inv.submittedDate}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${st.color}`}>
                      <st.icon className="w-3 h-3" /> {st.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setViewInv(inv)} className="text-blue-600 text-xs font-medium flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                      {inv.status === "pending_approval" && (
                        <button onClick={() => setConfirmApprove(inv)} className="text-green-600 text-xs font-medium flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Approve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* View Invoice Modal */}
      {viewInv && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="px-5 py-3 flex items-center justify-between bg-[#312B6B] text-white rounded-t sticky top-0">
              <div>
                <h3 className="text-base font-semibold text-white">Invoice Request Details</h3>
                <p className="text-xs text-white/60 mt-0.5">{viewInv.id}</p>
              </div>
              <button onClick={() => setViewInv(null)} className="text-white/60 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${STATUS[viewInv.status].color}`}>
                  {(() => { const Icon = STATUS[viewInv.status].icon; return <Icon className="w-3 h-3" />; })()}
                  {STATUS[viewInv.status].label}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-gray-500">Supplier</p><p className="font-medium text-gray-900">{viewInv.supplierName}</p></div>
                <div><p className="text-xs text-gray-500">Total Amount</p><p className="font-medium text-gray-900">{fmt(viewInv.totalAmount)}</p></div>
                <div><p className="text-xs text-gray-500">Created</p><p className="font-medium text-gray-900">{viewInv.createdDate}</p></div>
                <div><p className="text-xs text-gray-500">Submitted</p><p className="font-medium text-gray-900">{viewInv.submittedDate}</p></div>
                {viewInv.approvedDate && (<div><p className="text-xs text-gray-500">Approved</p><p className="font-medium text-gray-900">{viewInv.approvedDate}</p></div>)}
                {viewInv.disbursedDate && (<div><p className="text-xs text-gray-500">Disbursed</p><p className="font-medium text-gray-900">{viewInv.disbursedDate}</p></div>)}
              </div>
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Invoice Line Items ({viewInv.lineItems.length})</h4>
                <div className="space-y-3">
                  {viewInv.lineItems.map((item, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-gray-900">Invoice {idx + 1}</p>
                        <p className="text-xs font-medium text-gray-700">{fmt(item.invoiceAmount)}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div><p className="text-gray-500">Invoice Number</p><p className="font-medium text-gray-900">{item.invoiceNumber}</p></div>
                        <div><p className="text-gray-500">Invoice Date</p><p className="font-medium text-gray-900">{item.invoiceDate}</p></div>
                        <div><p className="text-gray-500">Payment Due Date</p><p className="font-medium text-gray-900">{item.paymentDueDate}</p></div>
                        <div><p className="text-gray-500">Amount</p><p className="font-medium text-gray-900">{fmt(item.invoiceAmount)}</p></div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                        <div className="flex items-center gap-1.5 p-1.5 bg-green-50 border border-green-200 rounded">
                          <FileText className="w-3 h-3 text-green-600 flex-shrink-0" />
                          <span className="text-green-700 truncate">{item.invoiceCopyName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 p-1.5 bg-green-50 border border-green-200 rounded">
                          <FileText className="w-3 h-3 text-green-600 flex-shrink-0" />
                          <span className="text-green-700 truncate">{item.deliveryNoteName}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                <span className="text-sm text-gray-600">Total ({viewInv.lineItems.length} invoice{viewInv.lineItems.length !== 1 ? "s" : ""})</span>
                <span className="text-sm font-semibold text-gray-900">{fmt(viewInv.totalAmount)}</span>
              </div>
              {viewInv.status === "pending_approval" ? (
                <div className="flex gap-3 pt-3 border-t border-gray-200">
                  <button onClick={() => doReject(viewInv.id)} className="flex-1 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50">Reject</button>
                  <button onClick={() => setConfirmApprove(viewInv)} className="flex-1 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700">Approve</button>
                </div>
              ) : (
                <button onClick={() => setViewInv(null)} className="w-full py-2 bg-[#0066B8] text-white rounded text-sm font-medium">Close</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirm Approval Modal */}
      {confirmApprove && (
        <div className="fixed inset-0 bg-gray-500/30 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Approval</h3>
              <p className="text-sm text-gray-600 mb-1">Are you sure you want to approve this invoice request?</p>
              <div className="bg-gray-50 rounded-lg p-3 my-4 text-left text-sm">
                <div className="flex justify-between mb-1"><span className="text-gray-500">Request ID</span><span className="font-medium text-gray-900">{confirmApprove.id}</span></div>
                <div className="flex justify-between mb-1"><span className="text-gray-500">Supplier</span><span className="font-medium text-gray-900">{confirmApprove.supplierName}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-medium text-gray-900">{fmt(confirmApprove.totalAmount)}</span></div>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setConfirmApprove(null)} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleConfirmApprove(confirmApprove)} className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">Yes, Approve</button>
            </div>
          </div>
        </div>
      )}

      {/* NOA DocuSign Modal */}
      {noaInv && (
        <div className="fixed inset-0 bg-gray-500/30 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            {/* DocuSign-style header */}
            <div className="bg-[#FFCC00] px-5 py-3 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#1A1A1A] rounded flex items-center justify-center">
                  <PenLine className="w-4 h-4 text-[#FFCC00]" />
                </div>
                <span className="font-bold text-[#1A1A1A] text-sm">DocuSign</span>
              </div>
              <span className="text-xs text-[#1A1A1A]/70 font-medium">Secure Electronic Signature</span>
            </div>

            <div className="p-6">
              {noaStep === "review" && (
                <>
                  <div className="flex items-start gap-3 mb-5">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">Sign Notice of Assignment (NOA)</h3>
                      <p className="text-sm text-gray-500 mt-0.5">Please review and e-sign the NOA for this invoice request before approval is finalised.</p>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Document</p>
                      <span className="text-xs text-blue-600 flex items-center gap-1 cursor-pointer hover:underline">
                        <ExternalLink className="w-3 h-3" />Preview
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded">
                      <FileText className="w-8 h-8 text-red-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">NOA-{noaInv.id}.pdf</p>
                        <p className="text-xs text-gray-500">Notice of Assignment · {noaInv.supplierName}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-5 text-sm">
                    <div className="flex justify-between mb-1"><span className="text-gray-500">Invoice Request</span><span className="font-medium text-gray-900">{noaInv.id}</span></div>
                    <div className="flex justify-between mb-1"><span className="text-gray-500">Supplier</span><span className="font-medium text-gray-900">{noaInv.supplierName}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-medium text-gray-900">{fmt(noaInv.totalAmount)}</span></div>
                  </div>

                  <p className="text-xs text-gray-400 mb-4">By clicking "Sign & Approve" you agree to sign this document electronically. This is legally binding.</p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => { setNoaInv(null); setNoaStep("review"); }}
                      className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setNoaStep("signing");
                        setTimeout(() => setNoaStep("signed"), 2000);
                      }}
                      className="flex-1 py-2.5 bg-[#FFCC00] text-[#1A1A1A] rounded-lg text-sm font-semibold hover:bg-yellow-400 flex items-center justify-center gap-2"
                    >
                      <PenLine className="w-4 h-4" />
                      Sign & Approve
                    </button>
                  </div>
                </>
              )}

              {noaStep === "signing" && (
                <div className="py-8 text-center">
                  <div className="w-14 h-14 border-4 border-[#FFCC00] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-base font-semibold text-gray-900">Applying your signature...</p>
                  <p className="text-sm text-gray-500 mt-1">Please wait while DocuSign processes your signature.</p>
                </div>
              )}

              {noaStep === "signed" && (
                <div className="py-6 text-center">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">NOA Signed Successfully</h3>
                  <p className="text-sm text-gray-500 mb-4">Your electronic signature has been applied. The invoice request will now be approved.</p>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-left mb-5">
                    <div className="flex justify-between mb-1"><span className="text-gray-500">Document</span><span className="font-medium text-gray-900">NOA-{noaInv.id}.pdf</span></div>
                    <div className="flex justify-between mb-1"><span className="text-gray-500">Signed by</span><span className="font-medium text-gray-900">Sarah Al-Mansouri</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Timestamp</span><span className="font-medium text-gray-900">{new Date().toLocaleString("en-AE")}</span></div>
                  </div>
                  <button
                    onClick={() => doApprove(noaInv.id)}
                    className="w-full py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Complete Approval
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
