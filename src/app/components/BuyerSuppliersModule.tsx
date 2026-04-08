import { Users, Plus, CheckCircle, Send, X, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { showToast } from "./Toast";

type SupplierStatus = "onboarding_pending" | "active";

interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  tradeLicenseNumber: string;
  contactPerson: string;
  status: SupplierStatus;
  addedDate: string;
  onboardingLink?: string;
}

export function BuyerSuppliersModule() {
  const [searchParams] = useSearchParams();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddSuccess, setShowAddSuccess] = useState(false);

  useEffect(() => { if (searchParams.get("add") === "true") setShowAddModal(true); }, [searchParams]);
  const [formData, setFormData] = useState({
    name: "Falcon Steel Industries LLC",
    email: "procurement@falconsteel.ae",
    phone: "+971 4 567 8901",
    address: "Dubai Investment Park, Dubai, UAE",
    tradeLicenseNumber: "TL-112233",
    contactPerson: "Omar Al Hashimi",
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: "SUP-001",
      name: "Tech Suppliers LLC",
      email: "contact@techsuppliers.ae",
      phone: "+971 4 123 4567",
      address: "Dubai Silicon Oasis, Dubai, UAE",
      tradeLicenseNumber: "TL-789456",
      contactPerson: "Mohammed Hassan",
      status: "active",
      addedDate: "2024-01-15",
    },
    {
      id: "SUP-002",
      name: "Industrial Parts Co.",
      email: "info@industrialparts.ae",
      phone: "+971 2 987 6543",
      address: "Mussafah, Abu Dhabi, UAE",
      tradeLicenseNumber: "TL-456789",
      contactPerson: "Fatima Al Zaabi",
      status: "active",
      addedDate: "2024-01-20",
    },
    {
      id: "SUP-003",
      name: "Global Trading House",
      email: "sales@globaltrading.ae",
      phone: "+971 6 234 5678",
      address: "Sharjah Industrial Area, Sharjah, UAE",
      tradeLicenseNumber: "TL-321654",
      contactPerson: "Ahmed Ibrahim",
      status: "active",
      addedDate: "2024-02-10",
    },
    {
      id: "SUP-004",
      name: "Emirates Supply Chain",
      email: "contact@emiratessupply.ae",
      phone: "+971 4 876 5432",
      address: "Jebel Ali, Dubai, UAE",
      tradeLicenseNumber: "TL-987321",
      contactPerson: "Sara Al Mansoori",
      status: "onboarding_pending",
      addedDate: "2024-03-05",
      onboardingLink: "https://mal.ae/onboard/xyz789abc",
    },
    {
      id: "SUP-005",
      name: "Advanced Materials Ltd",
      email: "info@advancedmaterials.ae",
      phone: "+971 3 345 6789",
      address: "Al Ain Industrial City, Al Ain, UAE",
      tradeLicenseNumber: "TL-654987",
      contactPerson: "Khalid Rahman",
      status: "active",
      addedDate: "2024-03-15",
    },
  ]);

  const getStatusBadge = (status: SupplierStatus) => {
    switch (status) {
      case "onboarding_pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            <Send className="w-3 h-3" />
            Onboarding Pending
          </span>
        );
      case "active":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3" />
            Active
          </span>
        );
    }
  };

  const handleAddSupplier = () => {
    const newSupplier: Supplier = {
      id: `SUP-${String(suppliers.length + 1).padStart(3, '0')}`,
      ...formData,
      status: "onboarding_pending",
      addedDate: new Date().toISOString().split('T')[0],
    };
    setSuppliers([...suppliers, newSupplier]);
    setShowAddSuccess(true);
    showToast("success", "Supplier added successfully. Login credentials sent via email.");
  };

  const resetAddForm = () => {
    setShowAddModal(false);
    setShowAddSuccess(false);
    setFormData({
      name: "Falcon Steel Industries LLC",
      email: "procurement@falconsteel.ae",
      phone: "+971 4 567 8901",
      address: "Dubai Investment Park, Dubai, UAE",
      tradeLicenseNumber: "TL-112233",
      contactPerson: "Omar Al Hashimi",
    });
  };

  const canSubmit = formData.name.trim() && formData.tradeLicenseNumber.trim() && formData.email.trim() && formData.contactPerson.trim();


  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Supplier Management</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your supplier relationships</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#4F8DFF] text-white rounded-lg hover:bg-[#3A7AE8]"
        >
          <Plus className="w-4 h-4" />
          Add Supplier
        </button>
      </div>

      {/* Suppliers Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#E6F0FF] border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Person</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {suppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{supplier.id}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{supplier.name}</p>
                      <p className="text-xs text-gray-500">{supplier.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-900">{supplier.contactPerson}</p>
                    <p className="text-xs text-gray-500">{supplier.phone}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(supplier.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(supplier.addedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {supplier.status === "onboarding_pending" && (
                      <button
                        onClick={() => {
                          showToast("success", `Credentials email resent to ${supplier.email}`);
                        }}
                        className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Resend Credentials
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {suppliers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No suppliers found</p>
          </div>
        )}
      </div>

      {/* Add Supplier Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#CBD2DD]/[.72] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="px-5 py-3 flex items-center justify-between sticky top-0 bg-[#C3D2E7] text-gray-900 rounded-t">
              <h3 className="text-base font-semibold text-gray-900">Add Supplier</h3>
              <button onClick={resetAddForm} className="text-gray-500 hover:text-gray-900"><X className="w-5 h-5" /></button>
            </div>

            {showAddSuccess ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Supplier Added Successfully</h3>
                <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
                  An email with temporary login credentials has been sent to the supplier. On first login, they will verify the details, complete their profile, upload documents, and submit for activation.
                </p>
                <button onClick={() => resetAddForm()} className="px-6 py-2 bg-[#4F8DFF] text-white rounded-lg hover:bg-[#3A7AE8] transition-colors font-medium">
                  Done
                </button>
              </div>
            ) : (
            <>
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                    <input type="text" value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter company name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trade License Number *</label>
                    <input type="text" value={formData.tradeLicenseNumber}
                      onChange={(e) => setFormData({ ...formData, tradeLicenseNumber: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter trade license number" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input type="email" value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="supplier@example.ae" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input type="tel" value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+971 X XXXX XXXX" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person Name *</label>
                    <input type="text" value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter contact person name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input type="text" value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter full address" />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button onClick={resetAddForm}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                Cancel
              </button>
              <button onClick={handleAddSupplier}
                disabled={!canSubmit}
                className="flex-1 px-4 py-2 bg-[#4F8DFF] text-white rounded-lg hover:bg-[#3A7AE8] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                Add Supplier
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
