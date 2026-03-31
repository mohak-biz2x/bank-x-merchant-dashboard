import { Users, Plus, CheckCircle, Clock, Send, X, Upload, FileText } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
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
  const [addStep, setAddStep] = useState(1);
  const [showAddSuccess, setShowAddSuccess] = useState(false);

  useEffect(() => { if (searchParams.get("add") === "true") setShowAddModal(true); }, [searchParams]);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [formData, setFormData] = useState({
    name: "Falcon Steel Industries LLC",
    email: "procurement@falconsteel.ae",
    phone: "+971 4 567 8901",
    address: "Dubai Investment Park, Dubai, UAE",
    tradeLicenseNumber: "TL-112233",
    contactPerson: "Omar Al Hashimi",
  });
  const [tradeLicenseFile, setTradeLicenseFile] = useState<File[]>([
    new File([new ArrayBuffer(524288)], "TradeLicense-FalconSteel-2024.pdf", { type: "application/pdf" }),
  ]);
  const [supportingDocs, setSupportingDocs] = useState<File[]>([
    new File([new ArrayBuffer(312320)], "VAT-Certificate-FalconSteel.pdf", { type: "application/pdf" }),
    new File([new ArrayBuffer(198656)], "Chamber-of-Commerce-Cert.pdf", { type: "application/pdf" }),
  ]);

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
    showToast("success", "Supplier submitted for verification successfully.");
  };

  const resetAddForm = () => {
    setShowAddModal(false);
    setAddStep(1);
    setShowAddSuccess(false);
    setFormData({
      name: "Falcon Steel Industries LLC",
      email: "procurement@falconsteel.ae",
      phone: "+971 4 567 8901",
      address: "Dubai Investment Park, Dubai, UAE",
      tradeLicenseNumber: "TL-112233",
      contactPerson: "Omar Al Hashimi",
    });
    setTradeLicenseFile([
      new File([new ArrayBuffer(524288)], "TradeLicense-FalconSteel-2024.pdf", { type: "application/pdf" }),
    ]);
    setSupportingDocs([
      new File([new ArrayBuffer(312320)], "VAT-Certificate-FalconSteel.pdf", { type: "application/pdf" }),
      new File([new ArrayBuffer(198656)], "Chamber-of-Commerce-Cert.pdf", { type: "application/pdf" }),
    ]);

  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "license" | "supporting") => {
    const files = Array.from(e.target.files || []);
    if (type === "license") {
      setTradeLicenseFile(prev => [...prev, ...files]);
    } else {
      setSupportingDocs(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number, type: "license" | "supporting") => {
    if (type === "license") {
      setTradeLicenseFile(prev => prev.filter((_, i) => i !== index));
    } else {
      setSupportingDocs(prev => prev.filter((_, i) => i !== index));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const canProceedStep1 = formData.name.trim() && formData.tradeLicenseNumber.trim() && formData.email.trim() && formData.phone.trim();
  const canProceedStep2 = tradeLicenseFile.length > 0;


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
                    {supplier.status === "onboarding_pending" && supplier.onboardingLink && (
                      <button
                        onClick={() => { setGeneratedLink(supplier.onboardingLink!); setShowOnboardingModal(true); }}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View Link
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
          <div className="bg-white rounded max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="px-5 py-3 flex items-center justify-between sticky top-0 bg-[#C3D2E7] text-gray-900 rounded-t">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Add Supplier</h3>
                {!showAddSuccess && <p className="text-xs text-gray-500 mt-0.5">Step {addStep} of 3</p>}
              </div>
              <button onClick={resetAddForm} className="text-gray-500 hover:text-gray-900"><X className="w-5 h-5" /></button>
            </div>

            {showAddSuccess ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Supplier Submitted for Verification</h3>
                <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
                  The supplier details have been submitted to the bank for verification. Once verified, the supplier will receive an onboarding link via email.
                </p>
                <button onClick={() => resetAddForm()} className="px-6 py-2 bg-[#4F8DFF] text-white rounded-lg hover:bg-[#3A7AE8] transition-colors font-medium">
                  Done
                </button>
              </div>
            ) : (
            <>
            {/* Progress Steps */}
            <div className="px-6 pt-4">
              <div className="flex items-center justify-between mb-6">
                {[
                  { step: 1, label: "Supplier Details" },
                  { step: 2, label: "Upload Documents" },
                  { step: 3, label: "Review & Submit" },
                ].map((item, index) => (
                  <div key={item.step} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        addStep >= item.step ? "bg-[#4F8DFF] text-white" : "bg-gray-200 text-gray-600"
                      }`}>
                        {item.step}
                      </div>
                      <p className="text-xs text-gray-600 mt-2 text-center">{item.label}</p>
                    </div>
                    {index < 2 && (
                      <div className={`h-0.5 flex-1 mx-2 mb-6 ${addStep > item.step ? "bg-blue-600" : "bg-gray-200"}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6">
              {/* Step 1: Supplier Details */}
              {addStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                      <input type="text" required value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter company name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Trade License Number *</label>
                      <input type="text" required value={formData.tradeLicenseNumber}
                        onChange={(e) => setFormData({ ...formData, tradeLicenseNumber: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter trade license number" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <input type="email" required value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="supplier@example.ae" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                      <input type="tel" required value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+971 X XXXX XXXX" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person *</label>
                      <input type="text" required value={formData.contactPerson}
                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter contact person name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                      <input type="text" required value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter full address" />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Upload Documents */}
              {addStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trade License Copy *</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500 mb-3">PDF, JPG, PNG up to 10MB</p>
                      <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileUpload(e, "license")} className="hidden" id="license-upload" />
                      <label htmlFor="license-upload" className="inline-block px-4 py-2 bg-[#4F8DFF] text-white rounded-lg hover:bg-[#3A7AE8] cursor-pointer">Choose Files</label>
                    </div>
                    {tradeLicenseFile.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {tradeLicenseFile.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-blue-600" />
                              <span className="text-sm text-gray-700">{file.name}</span>
                              <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(0)} KB)</span>
                            </div>
                            <button onClick={() => removeFile(index, "license")} className="text-red-600 hover:text-red-700"><X className="w-4 h-4" /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Supporting Documents</label>
                    <p className="text-xs text-gray-500 mb-3">VAT certificate, chamber of commerce certificate, etc.</p>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500 mb-3">PDF, JPG, PNG up to 10MB each</p>
                      <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileUpload(e, "supporting")} className="hidden" id="supplier-supporting-upload" />
                      <label htmlFor="supplier-supporting-upload" className="inline-block px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 cursor-pointer">Choose Files</label>
                    </div>
                    {supportingDocs.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {supportingDocs.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-gray-600" />
                              <span className="text-sm text-gray-700">{file.name}</span>
                              <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(0)} KB)</span>
                            </div>
                            <button onClick={() => removeFile(index, "supporting")} className="text-red-600 hover:text-red-700"><X className="w-4 h-4" /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Review & Submit */}
              {addStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Supplier Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Company Name:</span>
                        <span className="font-medium text-gray-900">{formData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Trade License:</span>
                        <span className="font-medium text-gray-900">{formData.tradeLicenseNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium text-gray-900">{formData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium text-gray-900">{formData.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Contact Person:</span>
                        <span className="font-medium text-gray-900">{formData.contactPerson}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Address:</span>
                        <span className="font-medium text-gray-900">{formData.address}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Trade License File:</span>
                        <span className="font-medium text-gray-900">{tradeLicenseFile.length} file(s)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Supporting Docs:</span>
                        <span className="font-medium text-gray-900">{supportingDocs.length} file(s)</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2 text-sm">Verification Process:</h4>
                    <ol className="space-y-1 text-xs text-blue-700 list-decimal list-inside">
                      <li>Supplier details will be sent to the bank for verification</li>
                      <li>Upon approval, the supplier will receive an onboarding link via email</li>
                      <li>Once onboarded, the supplier will be activated and ready for transactions</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-200 flex gap-3">
              {addStep > 1 && (
                <button onClick={() => setAddStep(addStep - 1)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Back
                </button>
              )}
              {addStep < 3 ? (
                <button onClick={() => setAddStep(addStep + 1)}
                  disabled={
                    (addStep === 1 && !canProceedStep1) ||
                    (addStep === 2 && !canProceedStep2)
                  }
                  className="flex-1 px-4 py-2 bg-[#4F8DFF] text-white rounded-lg hover:bg-[#3A7AE8] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                  Continue
                </button>
              ) : (
                <button onClick={handleAddSupplier}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  Submit for Verification
                </button>
              )}
            </div>
            </>
            )}
          </div>
        </div>
      )}

      {/* Onboarding Link Modal */}
      {showOnboardingModal && (
        <div className="fixed inset-0 bg-[#CBD2DD]/[.72] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Onboarding Link</h3>
              <p className="text-sm text-gray-500 mt-2">Share this link with the supplier to complete their onboarding</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-xs text-gray-500 mb-2">Onboarding Link</p>
              <p className="text-sm text-gray-900 font-mono break-all">{generatedLink}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => copyToClipboard(generatedLink)} className="flex-1 px-4 py-2 bg-[#4F8DFF] text-white rounded-lg hover:bg-[#3A7AE8] font-medium">Copy Link</button>
              <button onClick={() => setShowOnboardingModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
