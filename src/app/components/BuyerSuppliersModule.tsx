import { Users, Plus, CheckCircle, X, Upload, FileText, Loader2, ArrowLeft, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { showToast } from "./Toast";

type IbanStatus = "success" | "failed";
type KybStatus = "success" | "failed";

interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  emirate: string;
  postalCode: string;
  tradeLicenseNumber: string;
  contactPerson: string;
  ibanVerification: IbanStatus;
  liteKyb: KybStatus;
  addedDate: string;
}

const UAE_EMIRATES = ["Abu Dhabi", "Dubai", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah"];
const UAE_CITIES: Record<string, string[]> = {
  "Abu Dhabi": ["Abu Dhabi", "Al Ain", "Madinat Zayed", "Ruwais", "Liwa"],
  "Dubai": ["Dubai", "Jebel Ali", "Hatta"],
  "Sharjah": ["Sharjah", "Khor Fakkan", "Kalba", "Dibba Al-Hisn"],
  "Ajman": ["Ajman", "Masfout", "Manama"],
  "Umm Al Quwain": ["Umm Al Quwain", "Falaj Al Mualla"],
  "Ras Al Khaimah": ["Ras Al Khaimah", "Al Jazirah Al Hamra", "Digdaga"],
  "Fujairah": ["Fujairah", "Dibba Al-Fujairah", "Masafi"],
};

export function BuyerSuppliersModule() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);

  // Wizard state
  const [addStep, setAddStep] = useState<1 | 2 | 3>(1);
  const [verifying, setVerifying] = useState(false);

  // Step 1: Basic details
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    emirate: "",
    postalCode: "",
    tradeLicenseNumber: "",
    contactPerson: "",
  });

  // Step 2: Documents
  const [tradeLicenseFiles, setTradeLicenseFiles] = useState<File[]>([]);
  const [supportingDocs, setSupportingDocs] = useState<File[]>([]);

  // Step 3: Bank details
  const [bankData, setBankData] = useState({
    bankName: "",
    accountName: "",
    iban: "",
    swiftCode: "",
  });

  useEffect(() => { if (searchParams.get("add") === "true") setShowAddModal(true); }, [searchParams]);

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: "SUP-001",
      name: "Tech Suppliers LLC",
      email: "contact@techsuppliers.ae",
      phone: "+971 4 123 4567",
      address: "Dubai Silicon Oasis",
      city: "Dubai",
      emirate: "Dubai",
      postalCode: "341050",
      tradeLicenseNumber: "TL-789456",
      contactPerson: "Mohammed Hassan",
      ibanVerification: "success",
      liteKyb: "success",
      addedDate: "2024-01-15",
    },
    {
      id: "SUP-002",
      name: "Industrial Parts Co.",
      email: "info@industrialparts.ae",
      phone: "+971 2 987 6543",
      address: "Mussafah Industrial Area",
      city: "Abu Dhabi",
      emirate: "Abu Dhabi",
      postalCode: "412201",
      tradeLicenseNumber: "TL-456789",
      contactPerson: "Fatima Al Zaabi",
      ibanVerification: "success",
      liteKyb: "success",
      addedDate: "2024-01-20",
    },
    {
      id: "SUP-003",
      name: "Global Trading House",
      email: "sales@globaltrading.ae",
      phone: "+971 6 234 5678",
      address: "Sharjah Industrial Area",
      city: "Sharjah",
      emirate: "Sharjah",
      postalCode: "26547",
      tradeLicenseNumber: "TL-321654",
      contactPerson: "Ahmed Ibrahim",
      ibanVerification: "success",
      liteKyb: "failed",
      addedDate: "2024-02-10",
    },
    {
      id: "SUP-004",
      name: "Emirates Supply Chain",
      email: "contact@emiratessupply.ae",
      phone: "+971 4 876 5432",
      address: "Jebel Ali Free Zone",
      city: "Jebel Ali",
      emirate: "Dubai",
      postalCode: "17000",
      tradeLicenseNumber: "TL-987321",
      contactPerson: "Sara Al Mansoori",
      ibanVerification: "failed",
      liteKyb: "success",
      addedDate: "2024-03-05",
    },
    {
      id: "SUP-005",
      name: "Advanced Materials Ltd",
      email: "info@advancedmaterials.ae",
      phone: "+971 3 345 6789",
      address: "Al Ain Industrial City",
      city: "Al Ain",
      emirate: "Abu Dhabi",
      postalCode: "15258",
      tradeLicenseNumber: "TL-654987",
      contactPerson: "Khalid Rahman",
      ibanVerification: "success",
      liteKyb: "success",
      addedDate: "2024-03-15",
    },
  ]);

  const getVerificationBadge = (status: "success" | "failed") => (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${status === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
      {status === "success" ? <CheckCircle className="w-3 h-3" /> : <X className="w-3 h-3" />}
      {status === "success" ? "Success" : "Failed"}
    </span>
  );

  const handleSubmitSupplier = () => {
    setVerifying(true);
    setTimeout(() => {
      const supplierId = `SUP-${String(suppliers.length + 1).padStart(3, '0')}`;
      const newSupplier: Supplier = {
        id: supplierId,
        ...formData,
        ibanVerification: "success",
        liteKyb: "success",
        addedDate: new Date().toISOString().split('T')[0],
      };
      setSuppliers((prev) => [...prev, newSupplier]);
      showToast("success", "Supplier added and verified successfully.");
      setVerifying(false);
      resetAddForm();
      navigate(`/payable-invoices?add=true&supplier=${supplierId}`);
    }, 10000);
  };

  const resetAddForm = () => {
    setShowAddModal(false);
    setAddStep(1);
    setVerifying(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      emirate: "",
      postalCode: "",
      tradeLicenseNumber: "",
      contactPerson: "",
    });
    setTradeLicenseFiles([]);
    setSupportingDocs([]);
    setBankData({ bankName: "", accountName: "", iban: "", swiftCode: "" });
  };

  const canNextStep1 =
    formData.name.trim() &&
    formData.tradeLicenseNumber.trim() &&
    formData.email.trim() &&
    formData.contactPerson.trim();

  const canSubmitStep3 =
    bankData.bankName.trim() &&
    bankData.accountName.trim() &&
    bankData.iban.trim() &&
    bankData.swiftCode.trim();

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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IBAN Verification</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lite KYB</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added Date</th>
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
                  <td className="px-6 py-4 whitespace-nowrap">{getVerificationBadge(supplier.ibanVerification)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getVerificationBadge(supplier.liteKyb)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(supplier.addedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
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

      {/* Add Supplier Wizard Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#CBD2DD]/[.72] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded max-w-2xl w-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="px-5 py-3 flex items-center justify-between bg-[#C3D2E7] text-gray-900 rounded-t shrink-0">
              <h3 className="text-base font-semibold text-gray-900">
                Add Supplier
                {!verifying && (
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    — Step {addStep} of 3
                  </span>
                )}
              </h3>
              <button onClick={resetAddForm} className="text-gray-500 hover:text-gray-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Verification loading state */}
            {verifying ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12">
                <Loader2 className="w-12 h-12 text-[#4F8DFF] animate-spin mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  IBAN Verification &amp; Lite KYB in progress...
                </h3>
                <p className="text-sm text-gray-500">
                  Please wait while we verify the supplier details
                </p>
              </div>
            ) : (
              <>
                {/* Step indicator */}
                <div className="flex items-center justify-center gap-0 py-4 shrink-0">
                  {[1, 2, 3].map((step, idx) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors ${addStep >= step ? "bg-[#4F8DFF] border-[#4F8DFF] text-white" : "bg-white border-gray-300 text-gray-400"}`}>{step}</div>
                      {idx < 2 && <div className={`w-16 h-0.5 transition-colors ${addStep > step ? "bg-[#4F8DFF]" : "bg-gray-300"}`} />}
                    </div>
                  ))}
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto px-6 pb-4">
                  {/* Step 1: Basic Details */}
                  {addStep === 1 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter company name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Trade License Number *</label>
                          <input
                            type="text"
                            value={formData.tradeLicenseNumber}
                            onChange={(e) => setFormData({ ...formData, tradeLicenseNumber: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter trade license number"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="supplier@example.ae"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="+971 X XXXX XXXX"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person Name *</label>
                          <input
                            type="text"
                            value={formData.contactPerson}
                            onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter contact person name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                          <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Street address"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Emirate</label>
                          <select
                            value={formData.emirate}
                            onChange={(e) => setFormData({ ...formData, emirate: e.target.value, city: "" })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          >
                            <option value="">Select Emirate</option>
                            {UAE_EMIRATES.map(em => <option key={em} value={em}>{em}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                          <select
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            disabled={!formData.emirate}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                          >
                            <option value="">Select City</option>
                            {(formData.emirate ? UAE_CITIES[formData.emirate] || [] : []).map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                          <input
                            type="text"
                            value={formData.postalCode}
                            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Postal code"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Documents */}
                  {addStep === 2 && (
                    <div className="space-y-6">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Trade License</p>
                        <button type="button" onClick={() => { const inp = document.createElement("input"); inp.type = "file"; inp.accept = ".pdf,.jpg,.jpeg,.png"; inp.multiple = true; inp.onchange = () => { if (inp.files) setTradeLicenseFiles(prev => [...prev, ...Array.from(inp.files!)]); }; inp.click(); }} className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#4F8DFF] hover:bg-blue-50/30 transition-colors">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Click to upload files</p>
                          <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG accepted</p>
                        </button>
                        {tradeLicenseFiles.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {tradeLicenseFiles.map((file, idx) => (
                              <div key={`tl-${idx}`} className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                                  <FileText className="w-4 h-4 text-gray-500 shrink-0" />
                                  <span className="text-sm text-gray-700 truncate">{file.name}</span>
                                </div>
                                <button onClick={() => setTradeLicenseFiles(prev => prev.filter((_, i) => i !== idx))} className="text-gray-400 hover:text-red-500 shrink-0 ml-2"><X className="w-4 h-4" /></button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">VAT Registration Certificate</p>
                        <button type="button" onClick={() => { const inp = document.createElement("input"); inp.type = "file"; inp.accept = ".pdf,.jpg,.jpeg,.png"; inp.multiple = true; inp.onchange = () => { if (inp.files) setSupportingDocs(prev => [...prev, ...Array.from(inp.files!)]); }; inp.click(); }} className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#4F8DFF] hover:bg-blue-50/30 transition-colors">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Click to upload files</p>
                          <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG accepted</p>
                        </button>
                        {supportingDocs.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {supportingDocs.map((file, idx) => (
                              <div key={`sd-${idx}`} className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                                  <FileText className="w-4 h-4 text-gray-500 shrink-0" />
                                  <span className="text-sm text-gray-700 truncate">{file.name}</span>
                                </div>
                                <button onClick={() => setSupportingDocs(prev => prev.filter((_, i) => i !== idx))} className="text-gray-400 hover:text-red-500 shrink-0 ml-2"><X className="w-4 h-4" /></button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Bank Account Details */}
                  {addStep === 3 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name *</label>
                          <input
                            type="text"
                            value={bankData.bankName}
                            onChange={(e) => setBankData({ ...bankData, bankName: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter bank name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Account Name *</label>
                          <input
                            type="text"
                            value={bankData.accountName}
                            onChange={(e) => setBankData({ ...bankData, accountName: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter account name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">IBAN *</label>
                          <input
                            type="text"
                            value={bankData.iban}
                            onChange={(e) =>
                              setBankData({
                                ...bankData,
                                iban: e.target.value.replace(/[\s-]/g, "").toUpperCase(),
                              })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g. AE070331234567890123456"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">SWIFT/BIC Code *</label>
                          <input
                            type="text"
                            value={bankData.swiftCode}
                            onChange={(e) =>
                              setBankData({
                                ...bankData,
                                swiftCode: e.target.value.toUpperCase(),
                              })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g.ABORAEADXXX"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => addStep === 1 ? resetAddForm() : setAddStep((s) => (s - 1) as 1 | 2 | 3)}
                    className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>

                  <div className="flex-1" />

                  {addStep < 3 ? (
                    <button
                      onClick={() => setAddStep((s) => (s + 1) as 1 | 2 | 3)}
                      disabled={addStep === 1 && !canNextStep1}
                      className="px-6 py-2 bg-[#4F8DFF] text-white rounded-lg hover:bg-[#3A7AE8] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitSupplier}
                      disabled={!canSubmitStep3}
                      className="px-6 py-2 bg-[#4F8DFF] text-white rounded-lg hover:bg-[#3A7AE8] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Submit
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
