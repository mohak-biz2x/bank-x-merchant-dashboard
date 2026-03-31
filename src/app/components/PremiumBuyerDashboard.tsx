import { Link } from "react-router";
import { Building2, FileText, Eye, Plus, Wallet, CheckCircle, Clock } from "lucide-react";

export function PremiumBuyerDashboard() {
  const formatCurrency = (n: number) => new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED", minimumFractionDigits: 0 }).format(n);
  const limit = 500000000;
  const utilised = 125000000;
  const available = limit - utilised;
  const pending = 3;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Wallet className="w-4 h-4 text-blue-600" />
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Pre-Approved Credit Limit</p>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{formatCurrency(limit)}</h2>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-xs">Available</p>
                <p className="text-lg font-semibold text-green-600">{formatCurrency(available)}</p>
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(utilised / limit) * 100}%` }} />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Utilised: {formatCurrency(utilised)}</span>
              <span>Available: {formatCurrency(available)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Suppliers", value: "12", icon: Building2, color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Active Suppliers", value: "10", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
            { label: "Pending Invoices", value: String(pending), icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
            { label: "Total Invoices", value: "45", icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${s.bg} rounded-lg flex items-center justify-center`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
                <div><p className="text-xs text-gray-500">{s.label}</p><p className="text-lg font-bold text-gray-900">{s.value}</p></div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center"><Building2 className="w-6 h-6 text-indigo-600" /></div>
              <div><h3 className="text-lg font-semibold text-gray-900">Suppliers</h3><p className="text-sm text-gray-500">Manage supplier relationships</p></div>
            </div>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-sm text-gray-600">Total Suppliers</span><span className="text-sm font-medium">12</span></div>
              <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-sm text-gray-600">Active</span><span className="text-sm font-medium text-green-600">10</span></div>
              <div className="flex justify-between py-2"><span className="text-sm text-gray-600">Onboarding Pending</span><span className="text-sm font-medium text-orange-600">2</span></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/pb/suppliers" className="bg-[#0066B8] text-white py-2 px-4 rounded text-sm text-center font-medium hover:bg-[#005299] flex items-center justify-center gap-1.5"><Eye className="w-4 h-4" /> View</Link>
              <Link to="/pb/suppliers?add=true" className="border border-gray-300 text-gray-700 py-2 px-4 rounded text-sm text-center font-medium hover:bg-gray-50 flex items-center justify-center gap-1.5"><Plus className="w-4 h-4" /> Add New</Link>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center"><FileText className="w-6 h-6 text-amber-600" /></div>
              <div><h3 className="text-lg font-semibold text-gray-900">Payable Invoices</h3><p className="text-sm text-gray-500">Review and approve supplier invoices</p></div>
            </div>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-sm text-gray-600">Total Invoices</span><span className="text-sm font-medium">45</span></div>
              <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-sm text-gray-600">Pending Approval</span><span className="text-sm font-medium text-orange-600">3</span></div>
              <div className="flex justify-between py-2"><span className="text-sm text-gray-600">Approved</span><span className="text-sm font-medium text-green-600">42</span></div>
            </div>
            <Link to="/pb/invoices" className="w-full bg-[#0066B8] text-white py-2 px-4 rounded text-sm text-center font-medium hover:bg-[#005299] flex items-center justify-center gap-1.5"><Eye className="w-4 h-4" /> View Invoices</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
