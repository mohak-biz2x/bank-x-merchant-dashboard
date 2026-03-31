import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Plus, CheckCircle, Clock, Send, X, Upload, FileText } from "lucide-react";
import { showToast } from "./Toast";

interface Supplier { id: string; name: string; email: string; tradeLicenseNumber: string; status: "onboarding_pending" | "active"; addedDate: string; }

export function PremiumBuyerSuppliers() {
  const [searchParams] = useSearchParams();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({ name: "", tradeLicenseNumber: "", email: "" });
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: "SUP-001", name: "Tech Suppliers LLC", email: "contact@techsuppliers.ae", tradeLicenseNumber: "TL-789456", status: "active", addedDate: "2024-01-15" },
    { id: "SUP-002", name: "Industrial Parts Co.", email: "info@industrialparts.ae", tradeLicenseNumber: "TL-456789", status: "active", addedDate: "2024-01-20" },
    { id: "SUP-003", name: "Global Trading House", email: "sales@globaltrading.ae", tradeLicenseNumber: "TL-321654", status: "onboarding_pending", addedDate: "2024-02-10" },
    { id: "SUP-004", name: "Emirates Supply Chain", email: "contact@emiratessupply.ae", tradeLicenseNumber: "TL-987321", status: "active", addedDate: "2024-03-05" },
  ]);

  useEffect(() => { if (searchParams.get("add") === "true") setShowAddModal(true); }, [searchParams]);

  const handleAdd = () => {
    const s: Supplier = { id: `SUP-${String(suppliers.length + 1).padStart(3, '0')}`, ...formData, status: "onboarding_pending", addedDate: new Date().toISOString().split('T')[0] };
    setSuppliers([...suppliers, s]);
    setAddSuccess(true);
    showToast("success", "Supplier added. Onboarding link sent to their email.");
  };

  const resetForm = () => { setShowAddModal(false); setAddSuccess(false); setFormData({ name: "", tradeLicenseNumber: "", email: "" }); };

  const handleBulkUpload = () => {
    if (!bulkFile) return;
    const newSuppliers: Supplier[] = [
      { id: `SUP-${suppliers.length + 1}`, name: "Bulk Supplier A", email: "a@bulk.ae", tradeLicenseNumber: "TL-BULK-001", status: "onboarding_pending", addedDate: new Date().toISOString().split('T')[0] },
      { id: `SUP-${suppliers.length + 2}`, name: "Bulk Supplier B", email: "b@bulk.ae", tradeLicenseNumber: "TL-BULK-002", status: "onboarding_pending", addedDate: new Date().toISOString().split('T')[0] },
    ];
    setSuppliers([...suppliers, ...newSuppliers]);
    showToast("success", `${newSuppliers.length} suppliers added from CSV. Onboarding links sent.`);
    setShowBulkModal(false);
    setBulkFile(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div><h2 className="text-xl font-semibold text-gray-900">Supplier Management</h2><p className="text-sm text-gray-500 mt-1">Manage your supplier relationships</p></div>
        <div className="flex gap-3">
          <button onClick={() => setShowBulkModal(true)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm font-medium"><Upload className="w-4 h-4" /> Bulk Add (CSV)</button>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-[#4F8DFF] text-white rounded hover:bg-[#3A7AE8] text-sm font-medium"><Plus className="w-4 h-4" /> Add Supplier</button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded">
        <table className="w-full">
          <thead className="bg-[#E6F0FF]"><tr>
            <th className="text-left px-4 py-3">Supplier ID</th><th className="text-left px-4 py-3">Company Name</th><th className="text-left px-4 py-3">Email</th><th className="text-left px-4 py-3">TL Number</th><th className="text-left px-4 py-3">Status</th><th className="text-left px-4 py-3">Added</th>
          </tr></thead>
          <tbody>
            {suppliers.map(s => (
              <tr key={s.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{s.id}</td>
                <td className="px-4 py-3 text-gray-700">{s.name}</td>
                <td className="px-4 py-3 text-gray-500">{s.email}</td>
                <td className="px-4 py-3 text-gray-700">{s.tradeLicenseNumber}</td>
                <td className="px-4 py-3">
                  {s.status === "active" ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700"><CheckCircle className="w-3 h-3" /> Active</span>
                  : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700"><Send className="w-3 h-3" /> Onboarding Pending</span>}
                </td>
                <td className="px-4 py-3 text-gray-500">{s.addedDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Supplier Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#CBD2DD]/[.72] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded max-w-md w-full">
            <div className="px-5 py-3 flex items-center justify-between bg-[#C3D2E7] text-gray-900 rounded-t">
              <h3 className="text-base font-semibold text-gray-900">Add Supplier</h3>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-900"><X className="w-5 h-5" /></button>
            </div>
            {addSuccess ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-green-600" /></div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Supplier Added</h3>
                <p className="text-sm text-gray-500 mb-4">An onboarding link has been sent to the supplier's email. They will complete the remaining details.</p>
                <button onClick={resetForm} className="px-6 py-2 bg-[#4F8DFF] text-white rounded text-sm font-medium">Done</button>
              </div>
            ) : (
              <div className="p-5 space-y-4">
                <p className="text-xs text-gray-500">Enter basic supplier details. The supplier will complete the rest via the onboarding link.</p>
                <div><label className="block text-xs font-medium text-gray-500 mb-1">Company Name *</label><input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded text-sm" placeholder="Enter company name" /></div>
                <div><label className="block text-xs font-medium text-gray-500 mb-1">Trade License Number *</label><input type="text" value={formData.tradeLicenseNumber} onChange={e => setFormData({ ...formData, tradeLicenseNumber: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded text-sm" placeholder="Enter TL number" /></div>
                <div><label className="block text-xs font-medium text-gray-500 mb-1">Email Address *</label><input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded text-sm" placeholder="supplier@example.ae" /></div>
                <button onClick={handleAdd} disabled={!formData.name.trim() || !formData.email.trim() || !formData.tradeLicenseNumber.trim()} className="w-full py-2 bg-[#4F8DFF] text-white rounded text-sm font-medium disabled:opacity-50 hover:bg-[#3A7AE8]">Add Supplier</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-[#CBD2DD]/[.72] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded max-w-md w-full">
            <div className="px-5 py-3 flex items-center justify-between bg-[#C3D2E7] text-gray-900 rounded-t">
              <h3 className="text-base font-semibold text-gray-900">Bulk Add Suppliers</h3>
              <button onClick={() => { setShowBulkModal(false); setBulkFile(null); }} className="text-gray-500 hover:text-gray-900"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-xs text-gray-500">Upload a CSV file with columns: Company Name, Trade License Number, Email Address</p>
              {bulkFile ? (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded px-3 py-2">
                  <FileText className="w-4 h-4 text-green-600" /><span className="text-sm text-green-700 flex-1">{bulkFile.name}</span>
                  <button onClick={() => setBulkFile(null)} className="text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                </div>
              ) : (
                <label className="flex flex-col items-center gap-2 py-6 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-blue-400 hover:bg-blue-50/30">
                  <Upload className="w-6 h-6 text-gray-400" /><span className="text-sm text-blue-600 font-medium">Choose CSV file</span><span className="text-xs text-gray-400">or drag and drop</span>
                  <input type="file" className="hidden" accept=".csv" onChange={e => { if (e.target.files?.[0]) setBulkFile(e.target.files[0]); }} />
                </label>
              )}
              <button onClick={handleBulkUpload} disabled={!bulkFile} className="w-full py-2 bg-[#4F8DFF] text-white rounded text-sm font-medium disabled:opacity-50 hover:bg-[#3A7AE8]">Upload & Add Suppliers</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
