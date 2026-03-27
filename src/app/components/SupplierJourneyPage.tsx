import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Building2, FileText, Upload, CheckCircle, X, Landmark, Info, Check, Mail, Phone, Loader2 } from "lucide-react";

interface SupplierData {
  name: string;
  tradeLicenseNumber: string;
  trnNumber: string;
  email: string;
  phone: string;
  contactPerson: string;
  address: string;
  bankName: string;
  accountName: string;
  iban: string;
  swiftCode: string;
}

export function SupplierJourneyPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  // Pre-populated supplier data (as entered by the buyer)
  const [supplierData, setSupplierData] = useState<SupplierData>({
    name: "Falcon Steel Industries LLC",
    tradeLicenseNumber: "TL-112233",
    trnNumber: "TRN-100234567890003",
    email: "procurement@falconsteel.ae",
    phone: "+971 4 567 8901",
    contactPerson: "Omar Al Hashimi",
    address: "Dubai Investment Park, Dubai, UAE",
    bankName: "",
    accountName: "",
    iban: "",
    swiftCode: "",
  });

  // Document state
  const [tradeLicenseFiles, setTradeLicenseFiles] = useState<File[]>([
    new File([new ArrayBuffer(524288)], "TradeLicense-FalconSteel-2024.pdf", { type: "application/pdf" }),
  ]);
  const [supportingDocs, setSupportingDocs] = useState<File[]>([
    new File([new ArrayBuffer(312320)], "VAT-Certificate-FalconSteel.pdf", { type: "application/pdf" }),
  ]);

  // Confirmation
  const [confirmed, setConfirmed] = useState(false);

  // OTP verification state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [emailOtp, setEmailOtp] = useState(["", "", "", "", "", ""]);
  const [phoneOtp, setPhoneOtp] = useState(["", "", "", "", "", ""]);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState(false);
  const [otpAutoSent, setOtpAutoSent] = useState(false);

  const steps = [
    { id: 1, name: "Review Details" },
    { id: 2, name: "Documents" },
    { id: 3, name: "Bank Account" },
    { id: 4, name: "Review & Submit" },
  ];

  const handleNext = () => {
    if (currentStep === 1 && !emailVerified && !phoneVerified) {
      setShowOtpModal(true);
      if (!otpAutoSent) {
        setOtpAutoSent(true);
      }
      return;
    }
    if (currentStep === 4) {
      if (confirmed) {
        localStorage.setItem("demo_merchant_role", "supplier-only");
        localStorage.setItem("merchant_underwriting_status", "none");
        window.dispatchEvent(new Event("demo-role-change"));
        setShowSuccessModal(true);
      }
    } else if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Countdown and redirect after success
  useEffect(() => {
    if (!showSuccessModal) return;
    if (redirectCountdown <= 0) {
      navigate("/");
      return;
    }
    const timer = setTimeout(() => setRedirectCountdown(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [showSuccessModal, redirectCountdown, navigate]);

  const updateField = (field: keyof SupplierData, value: string) => {
    setSupplierData(prev => ({ ...prev, [field]: value }));
  };

  const handleTradeLicenseUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setTradeLicenseFiles(prev => [...prev, ...Array.from(files)]);
    }
  };

  const handleSupportingDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setSupportingDocs(prev => [...prev, ...Array.from(files)]);
    }
  };

  // OTP helpers
  const handleOtpChange = (type: "email" | "phone", index: number, value: string) => {
    if (value.length > 1) return;
    const setter = type === "email" ? setEmailOtp : setPhoneOtp;
    const current = type === "email" ? emailOtp : phoneOtp;
    const updated = [...current];
    updated[index] = value;
    setter(updated);
    if (value && index < 5) {
      const next = document.getElementById(`${type}-otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleOtpKeyDown = (type: "email" | "phone", index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      const current = type === "email" ? emailOtp : phoneOtp;
      if (!current[index] && index > 0) {
        const prev = document.getElementById(`${type}-otp-${index - 1}`);
        prev?.focus();
      }
    }
  };

  const verifyEmailOtp = () => {
    setVerifyingEmail(true);
    setTimeout(() => { setVerifyingEmail(false); setEmailVerified(true); }, 1500);
  };

  const verifyPhoneOtp = () => {
    setVerifyingPhone(true);
    setTimeout(() => { setVerifyingPhone(false); setPhoneVerified(true); }, 1500);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      // Step 1: Review Details
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Review Your Details</h1>
              <p className="text-gray-600 mt-2">
                The following details were provided by the buyer. Please review and update any information that needs correction.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Pre-filled by Buyer</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Al Masraf Industries LLC has added you as a supplier. Please verify the information below and make any necessary corrections.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5">
              <h3 className="font-semibold text-gray-900">Company Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name</label>
                  <input
                    type="text"
                    value={supplierData.name}
                    onChange={e => updateField("name", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Trade License Number</label>
                  <input
                    type="text"
                    value={supplierData.tradeLicenseNumber}
                    onChange={e => updateField("tradeLicenseNumber", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">TRN Number</label>
                  <input
                    type="text"
                    value={supplierData.trnNumber}
                    onChange={e => updateField("trnNumber", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Person</label>
                  <input
                    type="text"
                    value={supplierData.contactPerson}
                    onChange={e => updateField("contactPerson", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={supplierData.email}
                    onChange={e => updateField("email", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={supplierData.phone}
                    onChange={e => updateField("phone", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
                  <input
                    type="text"
                    value={supplierData.address}
                    onChange={e => updateField("address", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      // Step 2: Documents
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Documents</h1>
              <p className="text-gray-600 mt-2">
                Review uploaded documents and add any additional documents required for verification.
              </p>
            </div>

            {/* Trade License */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">Trade License</h3>
                <p className="text-sm text-gray-500 mt-1">Your valid trade license issued by the Department of Economic Development</p>
              </div>
              {tradeLicenseFiles.length > 0 && (
                <div className="space-y-2">
                  {tradeLicenseFiles.map((doc, i) => (
                    <div key={i} className="flex items-center gap-3 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700 flex-1 truncate">{doc.name}</span>
                      <span className="text-xs text-gray-400">{(doc.size / 1024).toFixed(0)} KB</span>
                      <button onClick={() => setTradeLicenseFiles(prev => prev.filter((_, idx) => idx !== i))} className="p-1 text-gray-400 hover:text-red-600 transition-colors"><X className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              )}
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg py-5 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-colors cursor-pointer"
                onClick={() => document.getElementById("sup-trade-license")?.click()}
              >
                <input type="file" id="sup-trade-license" className="hidden" accept=".pdf,.jpg,.jpeg,.png" multiple onChange={handleTradeLicenseUpload} />
                <Upload className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                <p className="text-sm text-blue-600 font-medium">Click to upload</p>
                <p className="text-xs text-gray-400 mt-0.5">PDF, JPG, PNG (max 10MB per file)</p>
              </div>
            </div>

            {/* Supporting Documents */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">Supporting Documents</h3>
                <p className="text-sm text-gray-500 mt-1">VAT certificates, registration documents, and other supporting files</p>
              </div>
              {supportingDocs.length > 0 && (
                <div className="space-y-2">
                  {supportingDocs.map((doc, i) => (
                    <div key={i} className="flex items-center gap-3 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700 flex-1 truncate">{doc.name}</span>
                      <span className="text-xs text-gray-400">{(doc.size / 1024).toFixed(0)} KB</span>
                      <button onClick={() => setSupportingDocs(prev => prev.filter((_, idx) => idx !== i))} className="p-1 text-gray-400 hover:text-red-600 transition-colors"><X className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              )}
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg py-5 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-colors cursor-pointer"
                onClick={() => document.getElementById("sup-supporting-docs")?.click()}
              >
                <input type="file" id="sup-supporting-docs" className="hidden" accept=".pdf,.jpg,.jpeg,.png" multiple onChange={handleSupportingDocUpload} />
                <Upload className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                <p className="text-sm text-blue-600 font-medium">Click to upload</p>
                <p className="text-xs text-gray-400 mt-0.5">PDF, JPG, PNG (max 10MB per file)</p>
              </div>
            </div>
          </div>
        );

      // Step 3: Bank Account
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Bank Account Details</h1>
              <p className="text-gray-600 mt-2">
                Provide your bank account details for receiving payments.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700">
                  Please enter your bank details carefully. These will be used for processing payments.
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <Landmark className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Bank Information</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Bank Name *</label>
                  <input
                    type="text"
                    value={supplierData.bankName}
                    onChange={e => updateField("bankName", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Account Holder Name *</label>
                  <input
                    type="text"
                    value={supplierData.accountName}
                    onChange={e => updateField("accountName", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">IBAN *</label>
                  <input
                    type="text"
                    value={supplierData.iban}
                    onChange={e => updateField("iban", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">SWIFT/BIC Code *</label>
                  <input
                    type="text"
                    value={supplierData.swiftCode}
                    onChange={e => updateField("swiftCode", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

          </div>
        );

      // Step 4: Review & Approve
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Review & Submit</h1>
              <p className="text-gray-600 mt-2">
                Review all your information and submit your registration as a supplier.
              </p>
            </div>

            {/* Company Details Summary */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Company Details</h3>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Company Name</span>
                  <span className="text-gray-900 font-medium">{supplierData.name}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Trade License</span>
                  <span className="text-gray-900 font-medium">{supplierData.tradeLicenseNumber}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">TRN Number</span>
                  <span className="text-gray-900 font-medium">{supplierData.trnNumber}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Contact Person</span>
                  <span className="text-gray-900 font-medium">{supplierData.contactPerson}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Email</span>
                  <span className="text-gray-900 font-medium">{supplierData.email}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Phone</span>
                  <span className="text-gray-900 font-medium">{supplierData.phone}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Address</span>
                  <span className="text-gray-900 font-medium">{supplierData.address}</span>
                </div>
              </div>
            </div>

            {/* Documents Summary */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Documents</h3>
              </div>
              <div className="space-y-2">
                {tradeLicenseFiles.map((doc, i) => (
                  <div key={`tl-${i}`} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700">Trade License: {doc.name}</span>
                  </div>
                ))}
                {supportingDocs.map((doc, i) => (
                  <div key={`sd-${i}`} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700">Supporting: {doc.name}</span>
                  </div>
                ))}
                {tradeLicenseFiles.length === 0 && supportingDocs.length === 0 && (
                  <p className="text-sm text-amber-600">No documents uploaded</p>
                )}
              </div>
            </div>

            {/* Bank Details Summary */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <Landmark className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Bank Account</h3>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Bank</span>
                  <span className="text-gray-900 font-medium">{supplierData.bankName}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Account Holder</span>
                  <span className="text-gray-900 font-medium">{supplierData.accountName}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">IBAN</span>
                  <span className="text-gray-900 font-medium">{supplierData.iban}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">SWIFT/BIC</span>
                  <span className="text-gray-900 font-medium">{supplierData.swiftCode}</span>
                </div>
              </div>
            </div>

            {/* Confirmation */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={e => setConfirmed(e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-sm text-gray-700">
                  <p className="font-medium text-gray-900 mb-1">I confirm that all the information provided is accurate</p>
                  <p>I hereby approve my registration as a supplier on the Bank X Supply Chain Finance platform. I confirm that the company details, documents, and bank account information are correct and up to date.</p>
                </div>
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-[#312B6B] px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <h1 className="text-xl font-bold text-white tracking-tight">BANK<span className="text-blue-400">X</span></h1>
            <div className="h-6 w-px bg-white/20"></div>
            <p className="text-sm text-white/90">Supplier Verification</p>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-xs text-white/60">Invited by Al Masraf Industries LLC</p>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
      {/* Sidebar - Left */}
      <div className="w-80 bg-white border-r border-gray-200 p-5 flex flex-col">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Registration Steps</h3>
        <nav className="flex-1 space-y-3">
          {steps.map((step) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            return (
              <div key={step.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? "bg-blue-50 border border-blue-200" : isCompleted ? "text-green-700" : "text-gray-500"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${isCompleted ? "bg-green-100 text-green-700" : isActive ? "bg-[#0066B8] text-white" : "bg-gray-100 text-gray-400"}`}>
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.id}
                </div>
                <span className={`text-sm ${isActive ? "font-semibold text-blue-900" : isCompleted ? "font-medium" : ""}`}>{step.name}</span>
              </div>
            );
          })}
        </nav>
        <div className="mt-auto pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-400">Ref: SUP-REG-2025-001</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium text-gray-700">Supplier Registration</h2>
            <p className="text-xs text-gray-400 mt-0.5">Step {currentStep} of {steps.length}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#0066B8] rounded-full transition-all duration-300" style={{ width: `${(currentStep / steps.length) * 100}%` }} />
            </div>
            <span className="text-xs text-gray-500">{Math.round((currentStep / steps.length) * 100)}%</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="max-w-2xl mx-auto">
            {renderStepContent()}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 px-8 py-4 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              currentStep === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={(currentStep === 4 && !confirmed)}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              currentStep === 4
                ? confirmed
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[#0066B8] text-white hover:bg-[#005299]"
            }`}
          >
            {currentStep === 4 ? "Review & Submit" : "Next"}
          </button>
        </div>
      </div>
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-gray-500/30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-xl max-w-lg w-full mx-4">
            <div className="px-5 py-3 flex items-center justify-between bg-[#312B6B] text-white rounded-t">
              <h2 className="text-base font-semibold text-white">Verify Contact Information</h2>
              <button onClick={() => setShowOtpModal(false)} className="text-white/60 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5">
            <p className="text-sm text-gray-600 mb-5">OTPs have been sent to your email and phone number. Please enter them below to verify.</p>

            {/* Email OTP */}
            <div className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${emailVerified ? "bg-green-100" : "bg-blue-100"}`}>
                  {emailVerified ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Mail className="w-4 h-4 text-blue-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Email OTP</p>
                  <p className="text-xs text-gray-500">{supplierData.email}</p>
                </div>
                {emailVerified && <span className="px-2.5 py-0.5 bg-green-50 border border-green-200 rounded-full text-xs font-medium text-green-700">Verified</span>}
              </div>
              {!emailVerified ? (
                <div className="flex items-center gap-2">
                  {emailOtp.map((digit, i) => (
                    <input key={i} id={`email-otp-${i}`} type="text" inputMode="numeric" maxLength={1} value={digit}
                      onChange={e => handleOtpChange("email", i, e.target.value.replace(/\D/g, ""))}
                      onKeyDown={e => handleOtpKeyDown("email", i, e)}
                      className="w-10 h-10 text-center text-base font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  ))}
                  <button onClick={verifyEmailOtp} disabled={emailOtp.some(d => !d) || verifyingEmail}
                    className="ml-2 px-4 py-2 bg-[#0066B8] text-white rounded-lg text-sm font-medium hover:bg-[#005299] transition-colors disabled:opacity-50 flex items-center gap-2">
                    {verifyingEmail ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</> : "Verify"}
                  </button>
                </div>
              ) : (
                <p className="text-sm text-green-700 flex items-center gap-1.5"><CheckCircle className="w-4 h-4" /> Email verified successfully</p>
              )}
            </div>

            {/* Phone OTP */}
            <div className="border border-gray-200 rounded-lg p-4 mb-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${phoneVerified ? "bg-green-100" : "bg-blue-100"}`}>
                  {phoneVerified ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Phone className="w-4 h-4 text-blue-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Phone OTP</p>
                  <p className="text-xs text-gray-500">{supplierData.phone}</p>
                </div>
                {phoneVerified && <span className="px-2.5 py-0.5 bg-green-50 border border-green-200 rounded-full text-xs font-medium text-green-700">Verified</span>}
              </div>
              {!phoneVerified ? (
                <div className="flex items-center gap-2">
                  {phoneOtp.map((digit, i) => (
                    <input key={i} id={`phone-otp-${i}`} type="text" inputMode="numeric" maxLength={1} value={digit}
                      onChange={e => handleOtpChange("phone", i, e.target.value.replace(/\D/g, ""))}
                      onKeyDown={e => handleOtpKeyDown("phone", i, e)}
                      className="w-10 h-10 text-center text-base font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  ))}
                  <button onClick={verifyPhoneOtp} disabled={phoneOtp.some(d => !d) || verifyingPhone}
                    className="ml-2 px-4 py-2 bg-[#0066B8] text-white rounded-lg text-sm font-medium hover:bg-[#005299] transition-colors disabled:opacity-50 flex items-center gap-2">
                    {verifyingPhone ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</> : "Verify"}
                  </button>
                </div>
              ) : (
                <p className="text-sm text-green-700 flex items-center gap-1.5"><CheckCircle className="w-4 h-4" /> Phone verified successfully</p>
              )}
            </div>

            {emailVerified && phoneVerified ? (
              <button onClick={() => { setShowOtpModal(false); setCurrentStep(2); }}
                className="w-full px-5 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" /> Continue to Documents
              </button>
            ) : (
              <p className="text-xs text-gray-400 text-center">Verify both to continue</p>
            )}
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-gray-500/30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-xl max-w-md w-full mx-4 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Account Activated</h2>
            <p className="text-gray-600 mb-6">
              Your supplier account has been activated successfully. You will be redirected to your dashboard shortly.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Reference</span>
                <span className="text-gray-900 font-medium">SUP-REG-2025-001</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span className="text-green-600 font-medium">Account Active</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Account Type</span>
                <span className="text-gray-900 font-medium">Seller (Supply Chain)</span>
              </div>
            </div>
            <p className="text-sm text-gray-500">Redirecting to dashboard in {redirectCountdown}s...</p>
            <div className="mt-3">
              <button onClick={() => navigate("/")} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Go to Dashboard Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
