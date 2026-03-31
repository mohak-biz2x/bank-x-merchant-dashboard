import { useState } from "react";
import { FileText, CheckCircle, Clock, X, Eye, DollarSign } from "lucide-react";
import { showToast } from "./Toast";
type InvStatus = "pending_approval" | "approved" | "disbursed" | "rejected";
interface Invoice { id: string; supplierName: string; invoiceNumber: string; amount: number; submittedDate: string; status: InvStatus; }
const STATUS: Record<InvStatus, { label: string; color: string; icon: typeof Clock }> = { pending_approval: { label: "Pending Approval", color: "bg-orange-100 text-orange-700", icon: Clock }, approved: { label: "Approved", color: "bg-green-100 text-green-700", icon: CheckCircle }, disbursed: { label: "Disbursed", color: "bg-emerald-100 text-emerald-700", icon: DollarSign }, rejected: { label: "Rejected", color: "bg-red-100 text-red-700", icon: X } };
const INIT: Invoice[] = [
  { id: "INV-001", supplierName: "Tech Suppliers LLC", invoiceNumber: "TS-101", amount: 125000, submittedDate: "2025-03-20", status: "pending_approval" },
  { id: "INV-002", supplierName: "Industrial Parts Co.", invoiceNumber: "IP-205", amount: 289500, submittedDate: "2025-03-18", status: "pending_approval" },
  { id: "INV-003", supplierName: "Tech Suppliers LLC", invoiceNumber: "TS-103", amount: 78000, submittedDate: "2025-03-15", status: "approved" },
  { id: "INV-004", supplierName: "Emirates Supply Chain", invoiceNumber: "ES-042", amount: 456000, submittedDate: "2025-03-10", status: "disbursed" },
  { id: "INV-005", supplierName: "Global Trading House", invoiceNumber: "GT-018", amount: 92000, submittedDate: "2025-03-08", status: "pending_approval" },
  { id: "INV-006", supplierName: "Industrial Parts Co.", invoiceNumber: "IP-207", amount: 156000, submittedDate: "2025-03-05", status: "approved" },
];
export function PremiumBuyerInvoices() {
  const [invoices, setInvoices] = useState(INIT);
  const [viewInv, setViewInv] = useState<Invoice | null>(null);
  const fmt = (n: number) => "AED " + n.toLocaleString();
  const pending = invoices.filter(i => i.status === "pending_approval").length;
  const doApprove = (id: string) => { setInvoices(p => p.map(i => i.id === id ? { ...i, status: "approved" as InvStatus } : i)); showToast("success", "Invoice approved."); setViewInv(null); };
  const doReject = (id: string) => { setInvoices(p => p.map(i => i.id === id ? { ...i, status: "rejected" as InvStatus } : i)); showToast("info", "Invoice rejected."); setViewInv(null); };
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6"><h2 className="text-xl font-semibold text-gray-900">Payable Invoices</h2><p className="text-sm text-gray-500 mt-1">Review and approve supplier invoices</p></div>
      <div className="bg-white border border-gray-200 rounded">
        <table className="w-full">
          <thead><tr><th className="text-left px-4 py-3">ID</th><th className="text-left px-4 py-3">Supplier</th><th className="text-left px-4 py-3">Invoice</th><th className="text-left px-4 py-3">Amount</th><th className="text-left px-4 py-3">Date</th><th className="text-left px-4 py-3">Status</th><th className="text-left px-4 py-3">Actions</th></tr></thead>
          <tbody>{invoices.map(inv => { const st = STATUS[inv.status]; return (<tr key={inv.id} className="border-t border-gray-100 hover:bg-gray-50"><td className="px-4 py-3 font-medium text-gray-900">{inv.id}</td><td className="px-4 py-3 text-gray-700">{inv.supplierName}</td><td className="px-4 py-3 text-gray-700">{inv.invoiceNumber}</td><td className="px-4 py-3 font-medium">{fmt(inv.amount)}</td><td className="px-4 py-3 text-gray-500">{inv.submittedDate}</td><td className="px-4 py-3"><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${st.color}`}><st.icon className="w-3 h-3" /> {st.label}</span></td><td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => setViewInv(inv)} className="text-blue-600 text-xs font-medium flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> View</button>{inv.status === "pending_approval" && <button onClick={() => doApprove(inv.id)} className="text-green-600 text-xs font-medium flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Approve</button>}</div></td></tr>); })}</tbody>
        </table>
      </div>
      {viewInv && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded max-w-md w-full"><div className="px-5 py-3 flex items-center justify-between bg-[#312B6B] text-white rounded-t"><h3 className="text-base font-semibold">Invoice Details</h3><button onClick={() => setViewInv(null)} className="text-white/60 hover:text-white"><X className="w-5 h-5" /></button></div><div className="p-5 space-y-3"><div className="grid grid-cols-2 gap-3 text-sm"><div><p className="text-xs text-gray-500">Supplier</p><p className="font-medium">{viewInv.supplierName}</p></div><div><p className="text-xs text-gray-500">Invoice</p><p className="font-medium">{viewInv.invoiceNumber}</p></div><div><p className="text-xs text-gray-500">Amount</p><p className="font-medium">{fmt(viewInv.amount)}</p></div><div><p className="text-xs text-gray-500">Date</p><p className="font-medium">{viewInv.submittedDate}</p></div></div>{viewInv.status === "pending_approval" ? (<div className="flex gap-3 pt-3 border-t border-gray-200"><button onClick={() => doReject(viewInv.id)} className="flex-1 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50">Reject</button><button onClick={() => doApprove(viewInv.id)} className="flex-1 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700">Approve</button></div>) : (<button onClick={() => setViewInv(null)} className="w-full py-2 bg-[#0066B8] text-white rounded text-sm font-medium mt-3">Close</button>)}</div></div></div>)}
    </div>
  );
}
