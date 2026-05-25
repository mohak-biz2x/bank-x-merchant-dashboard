import { Users, Plus, CheckCircle, X, Loader2, FileText, Receipt, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { showToast } from "./Toast";

type ModalStep = "choose-document" | "processing" | "form";
type UploadSource = "trade-license" | "invoice" | "manual" | null;

type IbanStatus = "success" | "failed";
type KybStatus = "success" | "failed";

interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  tradeLicenseNumber: string;
  trnNumber: string;
  countryOfIncorporation: string;
  contactPerson: string;
  ibanVerification: IbanStatus;
  liteKyb: KybStatus;
  addedDate: string;
  bankName: string;
  accountName: string;
  iban: string;
  swiftCode: string;
}

const COUNTRIES = ["United Arab Emirates","Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo","Costa Rica","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"];

export function BuyerSuppliersModule() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // Document upload wizard state
  const [modalStep, setModalStep] = useState<ModalStep>("choose-document");
  const [uploadSource, setUploadSource] = useState<UploadSource>(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [autoFilledFields, setAutoFilledFields] = useState<Set<string>>(new Set());

  // TL Number lookup state
  const [tlLookupStatus, setTlLookupStatus] = useState<"idle" | "loading" | "found" | "not-found">("idle");
  const [tlFieldsDisabled, setTlFieldsDisabled] = useState(true);

  // TRN validation
  const [trnError, setTrnError] = useState("");

  // Form data (single form — no wizard)
  const [formData, setFormData] = useState({
    tradeLicenseNumber: "",
    name: "",
    email: "",
    phone: "",
    contactPerson: "",
    trnNumber: "",
    countryOfIncorporation: "United Arab Emirates",
  });

  // Bank details (same form)
  const [bankData, setBankData] = useState({
    bankName: "",
    accountName: "",
    iban: "",
    swiftCode: "",
  });

  useEffect(() => { if (searchParams.get("add") === "true") setShowAddModal(true); }, [searchParams]);

  // Handle document upload and simulate OCR extraction
  const handleDocumentUpload = (source: "trade-license" | "invoice", file: File) => {
    setUploadSource(source);
    setUploadedFileName(file.name);
    setModalStep("processing");

    setTimeout(() => {
      if (source === "trade-license") {
        // Trade License: fills ~30% of fields
        setFormData(prev => ({
          ...prev,
          tradeLicenseNumber: "789456",
          name: "Desert Steel Manufacturing LLC",
          countryOfIncorporation: "United Arab Emirates",
          contactPerson: "Khalid Al Rashid",
        }));
        setAutoFilledFields(new Set(["tradeLicenseNumber", "name", "countryOfIncorporation", "contactPerson"]));
        setTlLookupStatus("not-found");
        setTlFieldsDisabled(false);
      } else {
        // Invoice: fills ~85-100% of fields
        setFormData(prev => ({
          ...prev,
          tradeLicenseNumber: "654321",
          name: "Desert Steel Manufacturing LLC",
          trnNumber: "100876543210987",
          countryOfIncorporation: "United Arab Emirates",
          contactPerson: "Khalid Al Rashid",
          email: "accounts@desertsteel.ae",
          phone: "+971 4 321 9876",
        }));
        setBankData({
          bankName: "Abu Dhabi Commercial Bank",
          accountName: "Desert Steel Manufacturing LLC",
          iban: "AE460261234567890654321",
          swiftCode: "ADCBAEAAXXX",
        });
        setAutoFilledFields(new Set([
          "tradeLicenseNumber", "name", "trnNumber", "countryOfIncorporation",
          "contactPerson", "email", "phone", "bankName", "accountName", "iban", "swiftCode"
        ]));
        setTlLookupStatus("not-found");
        setTlFieldsDisabled(false);
      }
      setModalStep("form");
    }, 1800);
  };

  const handleSkipUpload = () => {
    setUploadSource("manual");
    setAutoFilledFields(new Set());
    setModalStep("form");
  };

  // TRN validation: 15 digits starting with 100
  const validateTrn = (trn: string): boolean => {
    if (!trn) return false;
    return /^100\d{12}$/.test(trn);
  };

  // TL Number blur handler
  const handleTlBlur = () => {
    const tl = formData.tradeLicenseNumber.trim();
    if (!tl || !/^\d+$/.test(tl)) {
      setTlLookupStatus("idle");
      setTlFieldsDisabled(true);
      setFormData(prev => ({ ...prev, name: "", email: "", phone: "", contactPerson: "", trnNumber: "", countryOfIncorporation: "United Arab Emirates" }));
      setBankData({ bankName: "", accountName: "", iban: "", swiftCode: "" });
      return;
    }

    setTlLookupStatus("loading");
    setTlFieldsDisabled(true);

    setTimeout(() => {
      if (tl === "12345") {
        setFormData(prev => ({
          ...prev,
          name: "Al Futtaim Trading LLC",
          email: "procurement@alfuttaim.ae",
          phone: "+971 4 555 1234",
          contactPerson: "Rashid Al Maktoum",
          trnNumber: "100234567890123",
          countryOfIncorporation: "United Arab Emirates",
        }));
        setBankData({
          bankName: "Emirates NBD",
          accountName: "Al Futtaim Trading LLC",
          iban: "AE070331234567890123456",
          swiftCode: "EABORAEADXXX",
        });
        setTlLookupStatus("found");
        setTlFieldsDisabled(true);
      } else {
        setFormData(prev => ({ ...prev, name: "", email: "", phone: "", contactPerson: "", trnNumber: "", countryOfIncorporation: "United Arab Emirates" }));
        setBankData({ bankName: "", accountName: "", iban: "", swiftCode: "" });
        setTlLookupStatus("not-found");
        setTlFieldsDisabled(false);
      }
    }, 1200);
  };

  const handleTlChange = (value: string) => {
    setFormData(prev => ({ ...prev, tradeLicenseNumber: value }));
    if (tlLookupStatus !== "idle") {
      setTlLookupStatus("idle");
      setTlFieldsDisabled(true);
      setFormData(prev => ({ ...prev, name: "", email: "", phone: "", contactPerson: "", trnNumber: "", countryOfIncorporation: "United Arab Emirates", tradeLicenseNumber: value }));
      setBankData({ bankName: "", accountName: "", iban: "", swiftCode: "" });
    }
  };

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: "SUP-001", name: "Tech Suppliers LLC", email: "contact@techsuppliers.ae", phone: "+971 4 123 4567", tradeLicenseNumber: "TL-789456", trnNumber: "100123456789012", countryOfIncorporation: "United Arab Emirates", contactPerson: "Mohammed Hassan", ibanVerification: "success", liteKyb: "success", addedDate: "2024-01-15", bankName: "Emirates NBD", accountName: "Tech Suppliers LLC", iban: "AE070331234567890123456", swiftCode: "EABORAEADXXX" },
    { id: "SUP-002", name: "Industrial Parts Co.", email: "info@industrialparts.ae", phone: "+971 2 987 6543", tradeLicenseNumber: "TL-456789", trnNumber: "100987654321098", countryOfIncorporation: "United Arab Emirates", contactPerson: "Fatima Al Zaabi", ibanVerification: "success", liteKyb: "success", addedDate: "2024-01-20", bankName: "ADCB", accountName: "Industrial Parts Co.", iban: "AE460261234567890123456", swiftCode: "ADCBAEAAXXX" },
    { id: "SUP-003", name: "Global Trading House", email: "sales@globaltrading.ae", phone: "+971 6 234 5678", tradeLicenseNumber: "TL-321654", trnNumber: "100111222333444", countryOfIncorporation: "United Arab Emirates", contactPerson: "Ahmed Ibrahim", ibanVerification: "success", liteKyb: "failed", addedDate: "2024-02-10", bankName: "Mashreq", accountName: "Global Trading House", iban: "AE350461234567890123456", swiftCode: "BOMABORAEADXXX" },
    { id: "SUP-004", name: "Emirates Supply Chain", email: "contact@emiratessupply.ae", phone: "+971 4 876 5432", tradeLicenseNumber: "TL-987321", trnNumber: "100555666777888", countryOfIncorporation: "United Arab Emirates", contactPerson: "Sara Al Mansoori", ibanVerification: "failed", liteKyb: "success", addedDate: "2024-03-05", bankName: "FAB", accountName: "Emirates Supply Chain", iban: "AE410401234567890123456", swiftCode: "NBABORAEADXXX" },
  ]);

  const getVerificationBadge = (status: "success" | "failed") => (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${status === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
      {status === "success" ? <CheckCircle className="w-3 h-3" /> : <X className="w-3 h-3" />}
      {status === "success" ? "Success" : "Failed"}
    </span>
  );

  const handleSubmitSupplier = () => {
    // Validate TRN for new suppliers
    if (tlLookupStatus === "not-found" && !validateTrn(formData.trnNumber)) {
      setTrnError("Invalid TRN. Must be 15 digits starting with 100.");
      return;
    }

    if (tlLookupStatus === "found") {
      const supplierId = `SUP-${String(suppliers.length + 1).padStart(3, '0')}`;
      const newSupplier: Supplier = { id: supplierId, ...formData, ...bankData, ibanVerification: "success", liteKyb: "success", addedDate: new Date().toISOString().split('T')[0] };
      setSuppliers(prev => [...prev, newSupplier]);
      showToast("success", "Supplier activated for your account.");
      resetAddForm();
      navigate(`/payable-invoices?add=true&supplier=${supplierId}`);
      return;
    }

    setVerifying(true);
    setTimeout(() => {
      const supplierId = `SUP-${String(suppliers.length + 1).padStart(3, '0')}`;
      const newSupplier: Supplier = { id: supplierId, ...formData, ...bankData, ibanVerification: "success", liteKyb: "success", addedDate: new Date().toISOString().split('T')[0] };
      setSuppliers(prev => [...prev, newSupplier]);
      showToast("success", "Supplier added and verified successfully.");
      setVerifying(false);
      resetAddForm();
      navigate(`/payable-invoices?add=true&supplier=${supplierId}`);
    }, 5000);
  };

  const resetAddForm = () => {
    setShowAddModal(false);
    setVerifying(false);
    setModalStep("choose-document");
    setUploadSource(null);
    setUploadedFileName("");
    setAutoFilledFields(new Set());
    setTlLookupStatus("idle");
    setTlFieldsDisabled(true);
    setTrnError("");
    setFormData({ tradeLicenseNumber: "", name: "", email: "", phone: "", contactPerson: "", trnNumber: "", countryOfIncorporation: "United Arab Emirates" });
    setBankData({ bankName: "", accountName: "", iban: "", swiftCode: "" });
  };

  const canSubmit =
    formData.name.trim() &&
    formData.tradeLicenseNumber.trim() &&
    formData.email.trim() &&
    formData.phone.trim() &&
    formData.contactPerson.trim() &&
    formData.trnNumber.trim() &&
    formData.countryOfIncorporation.trim() &&
    bankData.bankName.trim() &&
    bankData.accountName.trim() &&
    bankData.iban.trim() &&
    bankData.swiftCode.trim() &&
    (tlLookupStatus === "not-found");

  const canSubmitExisting = tlLookupStatus === "found";

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Supplier Management</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your supplier relationships</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-[#4F8DFF] text-white rounded-lg hover:bg-[#3A7AE8]">
          <Plus className="w-4 h-4" /> Add Supplier
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lite KYB</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IBAN Verification</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {suppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{supplier.id}</td>
                  <td className="px-6 py-4"><p className="text-sm font-medium text-gray-900">{supplier.name}</p><p className="text-xs text-gray-500">{supplier.email}</p></td>
                  <td className="px-6 py-4 whitespace-nowrap"><p className="text-sm text-gray-900">{supplier.contactPerson}</p><p className="text-xs text-gray-500">{supplier.phone}</p></td>
                  <td className="px-6 py-4 whitespace-nowrap">{getVerificationBadge(supplier.liteKyb)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getVerificationBadge(supplier.ibanVerification)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(supplier.addedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {suppliers.length === 0 && (
          <div className="text-center py-12"><Users className="w-12 h-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No suppliers found</p></div>
        )}
      </div>

      {/* Add Supplier Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#CBD2DD]/[.72] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded max-w-2xl w-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="px-5 py-3 flex items-center justify-between bg-[#C3D2E7] text-gray-900 rounded-t shrink-0">
              <h3 className="text-base font-semibold text-gray-900">Add Supplier</h3>
              <button onClick={resetAddForm} className="text-gray-500 hover:text-gray-900"><X className="w-5 h-5" /></button>
            </div>

            {/* Step 1: Document Choice */}
            {modalStep === "choose-document" && (
              <div className="flex-1 px-6 py-6">
                <p className="text-sm text-gray-600 mb-6">Upload a document to auto-fill supplier details, or skip to fill manually.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <label className="relative flex flex-col items-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors group">
                    <input type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleDocumentUpload("trade-license", f); }} />
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-3"><FileText className="w-6 h-6 text-amber-600" /></div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">Trade License</p>
                    <p className="text-xs text-gray-500 text-center mb-3">Auto-fills ~30% of fields</p>
                    <div className="text-xs text-gray-400 text-left w-full space-y-0.5">
                      <p>✓ Company Name</p><p>✓ Trade License Number</p><p>✓ Country of Incorporation</p><p>✓ Contact Person (owner)</p>
                    </div>
                    <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-blue-600 group-hover:text-blue-700"><Upload className="w-3.5 h-3.5" /> Upload PDF or Image</div>
                  </label>
                  <label className="relative flex flex-col items-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-green-400 hover:bg-green-50/30 transition-colors group">
                    <input type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleDocumentUpload("invoice", f); }} />
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">RECOMMENDED</div>
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3"><Receipt className="w-6 h-6 text-green-600" /></div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">Supplier Invoice</p>
                    <p className="text-xs text-gray-500 text-center mb-3">Auto-fills ~85–100% of fields</p>
                    <div className="text-xs text-gray-400 text-left w-full space-y-0.5">
                      <p>✓ Company Name & TRN</p><p>✓ Contact Info (email, phone)</p><p>✓ Bank Details (IBAN, SWIFT)</p><p>✓ Country of Incorporation</p>
                    </div>
                    <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-green-600 group-hover:text-green-700"><Upload className="w-3.5 h-3.5" /> Upload PDF or Image</div>
                  </label>
                </div>
                <div className="relative flex items-center justify-center my-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                  <span className="relative bg-white px-3 text-xs text-gray-400 uppercase">or</span>
                </div>
                <button onClick={handleSkipUpload} className="w-full py-2.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors">Skip — Fill all fields manually</button>
              </div>
            )}

            {/* Step 2: Processing */}
            {modalStep === "processing" && (
              <div className="flex-1 flex flex-col items-center justify-center p-12">
                <Loader2 className="w-12 h-12 text-[#4F8DFF] animate-spin mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Extracting supplier details...</h3>
                <p className="text-sm text-gray-500">Processing {uploadedFileName}</p>
              </div>
            )}
            {/* Verification loading state */}
            {modalStep === "form" && verifying && (
              <div className="flex-1 flex flex-col items-center justify-center p-12">
                <Loader2 className="w-12 h-12 text-[#4F8DFF] animate-spin mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Verifying supplier details...</h3>
                <p className="text-sm text-gray-500">Running Lite KYB &amp; IBAN Verification</p>
              </div>
            )}

            {/* Step 3: Form */}
            {modalStep === "form" && !verifying && (
              <>
                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  {/* Status banner */}
                  {tlLookupStatus === "found" && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs font-medium text-blue-800">
                        ✓ Existing supplier matched — all fields populated from your records. Fields are locked to maintain data integrity.
                      </p>
                    </div>
                  )}
                  {uploadSource && uploadSource !== "manual" && tlLookupStatus !== "found" && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-xs font-medium text-green-800">
                        ✓ {autoFilledFields.size} of 11 fields extracted from {uploadSource === "trade-license" ? "Trade License" : "Invoice"} — please review and complete the remaining fields.
                      </p>
                    </div>
                  )}
                  {uploadSource === "manual" && tlLookupStatus !== "found" && tlLookupStatus !== "loading" && (
                    <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-xs font-medium text-gray-600">
                        Fill in all supplier details below. Enter the Trade License Number first to check for existing records.
                      </p>
                    </div>
                  )}

                  {/* TL Number — gating field */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trade License Number *
                    </label>
                    <div className="relative">
                      <input type="text" value={formData.tradeLicenseNumber} onChange={(e) => handleTlChange(e.target.value)} onBlur={handleTlBlur} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300`} placeholder="Enter numeric TL number" />
                      {tlLookupStatus === "loading" && <div className="absolute right-3 top-1/2 -translate-y-1/2"><Loader2 className="w-4 h-4 text-[#4F8DFF] animate-spin" /></div>}
                      {tlLookupStatus === "found" && <div className="absolute right-3 top-1/2 -translate-y-1/2"><CheckCircle className="w-4 h-4 text-green-500" /></div>}
                    </div>
                  </div>

                  {/* Section: Basic Details */}
                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3">Basic Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Company Name *
                        </label>
                        <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} disabled={tlLookupStatus === "found" || (uploadSource === "manual" && tlFieldsDisabled)} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm border-gray-300`} placeholder="Enter company name" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          TRN Number *
                        </label>
                        <input type="text" value={formData.trnNumber} onChange={(e) => { setFormData({ ...formData, trnNumber: e.target.value }); setTrnError(""); }} onBlur={() => { if (formData.trnNumber && !validateTrn(formData.trnNumber)) setTrnError("Invalid TRN. Must be 15 digits starting with 100."); }} disabled={tlLookupStatus === "found" || (uploadSource === "manual" && tlFieldsDisabled)} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm ${trnError ? "border-red-400" : "border-gray-300"}`} placeholder="e.g. 100234567890123" maxLength={15} />
                        {trnError && <p className="text-xs text-red-500 mt-1">{trnError}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country of Incorporation *
                        </label>
                        <select value={formData.countryOfIncorporation} onChange={(e) => setFormData({ ...formData, countryOfIncorporation: e.target.value })} disabled={tlLookupStatus === "found" || (uploadSource === "manual" && tlFieldsDisabled)} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-gray-100 disabled:cursor-not-allowed border-gray-300`}>
                          {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section: Contact Details */}
                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3">Contact Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Contact Person Name *
                        </label>
                        <input type="text" value={formData.contactPerson} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} disabled={tlLookupStatus === "found" || (uploadSource === "manual" && tlFieldsDisabled)} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm border-gray-300`} placeholder="Enter contact person name" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} disabled={tlLookupStatus === "found" || (uploadSource === "manual" && tlFieldsDisabled)} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm border-gray-300`} placeholder="supplier@example.ae" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} disabled={tlLookupStatus === "found" || (uploadSource === "manual" && tlFieldsDisabled)} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm border-gray-300`} placeholder="+971 X XXXX XXXX" />
                      </div>
                    </div>
                  </div>

                  {/* Section: Bank Details */}
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3">Bank Account Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bank Name *
                        </label>
                        <input type="text" value={bankData.bankName} onChange={(e) => setBankData({ ...bankData, bankName: e.target.value })} disabled={tlLookupStatus === "found" || (uploadSource === "manual" && tlFieldsDisabled)} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm border-gray-300`} placeholder="Enter bank name" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Account Name *
                        </label>
                        <input type="text" value={bankData.accountName} onChange={(e) => setBankData({ ...bankData, accountName: e.target.value })} disabled={tlLookupStatus === "found" || (uploadSource === "manual" && tlFieldsDisabled)} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm border-gray-300`} placeholder="Enter account name" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          IBAN *
                        </label>
                        <input type="text" value={bankData.iban} onChange={(e) => setBankData({ ...bankData, iban: e.target.value.replace(/[\s-]/g, "").toUpperCase() })} disabled={tlLookupStatus === "found" || (uploadSource === "manual" && tlFieldsDisabled)} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm border-gray-300`} placeholder="e.g. AE070331234567890123456" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          SWIFT/BIC Code *
                        </label>
                        <input type="text" value={bankData.swiftCode} onChange={(e) => setBankData({ ...bankData, swiftCode: e.target.value.toUpperCase() })} disabled={tlLookupStatus === "found" || (uploadSource === "manual" && tlFieldsDisabled)} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm border-gray-300`} placeholder="e.g. EABORAEADXXX" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center gap-3 shrink-0">
                  <button onClick={resetAddForm} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">Cancel</button>
                  <div className="flex-1" />
                  <button onClick={handleSubmitSupplier} disabled={!canSubmit && !canSubmitExisting} className="px-6 py-2 bg-[#4F8DFF] text-white rounded-lg hover:bg-[#3A7AE8] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
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
