import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Building2, X, FileText, Upload, CheckCircle, ArrowLeft, Check, Info, Plus, UserCheck, ReceiptText, Mail, Phone, Loader2, LogOut, Settings, ShieldCheck } from "lucide-react";
import { MalLogo } from "./MalLogo";

interface BankStatement {
  id: string;
  fileName: string;
  bankName?: string;
  accountNumber?: string;
  period?: string;
  fileSize?: string;
  uploadDate: Date;
}

export function CustomerJourneyPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Profile Creation state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [emailOtp, setEmailOtp] = useState(["", "", "", "", "", ""]);
  const [mobileOtp, setMobileOtp] = useState(["", "", "", "", "", ""]);
  const [emailVerified, setEmailVerified] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [verifyingMobile, setVerifyingMobile] = useState(false);
  const [emailResendTimer, setEmailResendTimer] = useState(30);
  const [mobileResendTimer, setMobileResendTimer] = useState(30);
  const [profileCreated, setProfileCreated] = useState(false);
  const [profileRedirectTimer, setProfileRedirectTimer] = useState(10);
  const [profileData, setProfileData] = useState({
    companyLegalName: "Al Masraf Industries LLC",
    contactFullName: "Ahmed Al Mansouri",
    email: "ahmed@almasraf.ae",
    mobileNumber: "+971 50 987 6543",
  });

  // KYB state
  const [tlNumber, setTlNumber] = useState("");
  const [kybStatus, setKybStatus] = useState<"idle" | "verifying" | "verified">("idle");
  const [kybProgress, setKybProgress] = useState(0);
  const [companyInfo, setCompanyInfo] = useState({
    legalBusinessName: "",
    tradeLicenseNumber: "",
    businessType: "",
    industrySector: "",
    activityType: "",
    countryOfIncorporation: "",
    registeredAddress: "",
    city: "",
    emirate: "",
    pincode: "",
    monthlyRevenue: "",
    trnNumber: "",
  });
  const [shareholders, setShareholders] = useState<{ id: number; name: string; nationality: string; emiratesId: string; ownershipPercent: string; type: "direct" | "ubo"; residency: "resident" | "non-resident"; gender: "male" | "female"; emiratesIdIssueDate: string; passportNumber: string }[]>([]);
  const [kybDocs, setKybDocs] = useState<{ tradeLicense: string | null; moaAoa: string | null; trnCertificate: string | null }>({ tradeLicense: null, moaAoa: null, trnCertificate: null });

  // AECB Credit Consent state
  const [aecbConsent, setAecbConsent] = useState(false);
  const [aecbTrnNumber, setAecbTrnNumber] = useState("");

  // Authorized Signatory state
  const [selectedSignatoryId, setSelectedSignatoryId] = useState<string>("");
  const [showAddSignatory, setShowAddSignatory] = useState(false);
  const [customSignatory, setCustomSignatory] = useState({ name: "", designation: "", emiratesId: "" });

  // Loan Product state
  const [selectedProduct, setSelectedProduct] = useState<"receivable" | "payable" | null>(null);

  // Business Documents state
  const [businessDocs, setBusinessDocs] = useState<{ bankStatements: File[]; lastSixInvoices: File | null; auditedPnl: File | null }>({ bankStatements: [], lastSixInvoices: null, auditedPnl: null });
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectStep, setConnectStep] = useState<'bank-select' | 'auth' | 'success'>('bank-select');
  const [selectedBank, setSelectedBank] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [leanConnectedStatements, setLeanConnectedStatements] = useState<BankStatement[]>([]);

  // KYC Documents state
  const [kycDocs, setKycDocs] = useState<Record<string, { emiratesId: File | null; passport: File | null }>>({});

  // Review & Submit state
  const [acceptedAgreements, setAcceptedAgreements] = useState(false);
  const [creditCheckConsent, setCreditCheckConsent] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showSubmitSuccess, setShowSubmitSuccess] = useState(false);
  const [submitRedirectTimer, setSubmitRedirectTimer] = useState(10);

  const otpModalRef = useRef<HTMLDivElement>(null);

  // Profile Creation does NOT appear in sidebar steps
  const steps = [
    { id: 1, name: "Profile Creation", hidden: true },
    { id: 2, name: "KYB Verification" },
    { id: 3, name: "AECB Credit Consent" },
    { id: 4, name: "Loan Product" },
    { id: 5, name: "Business Documents" },
    { id: 6, name: "KYC Documents" },
    { id: 7, name: "Authorized Signatory" },
    { id: 8, name: "Review & Submit" },
  ];

  const visibleSteps = steps.filter(s => !s.hidden);

  const getEffectiveType = (s: { ownershipPercent: string; type: "direct" | "ubo" }) => {
    if (s.type === "direct" && parseFloat(s.ownershipPercent) >= 25) return "Direct & UBO";
    return s.type === "direct" ? "Direct" : "UBO";
  };

  // KYB Oscilar verification mock
  const startKybVerification = () => {
    setKybStatus("verifying");
    setKybProgress(0);
    const interval = setInterval(() => {
      setKybProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setKybStatus("verified");
          // Populate company info from Oscilar
          setCompanyInfo({
            legalBusinessName: "Al Masraf Industries LLC",
            tradeLicenseNumber: tlNumber,
            businessType: "Limited Liability Company (LLC)",
            industrySector: "Manufacturing - Industrial Equipment",
            activityType: "Manufacturing & Trading of Industrial Machinery",
            countryOfIncorporation: "United Arab Emirates",
            registeredAddress: "Office 1204, Al Shafar Tower, Tecom",
            city: "Dubai",
            emirate: "Dubai",
            pincode: "500001",
            monthlyRevenue: "2,450,000",
            trnNumber: "TRN-100234567890003",
          });
          // Populate shareholders, directors & UBOs
          setShareholders([
            { id: 1, name: "Ahmed Al Mansouri", nationality: "UAE", emiratesId: "784-1990-1234567-1", ownershipPercent: "60", type: "direct", residency: "resident", gender: "male", emiratesIdIssueDate: "2022-03-15", passportNumber: "" },
            { id: 2, name: "Fatima Al Hashimi", nationality: "UAE", emiratesId: "784-1985-9876543-2", ownershipPercent: "25", type: "direct", residency: "resident", gender: "female", emiratesIdIssueDate: "2021-07-20", passportNumber: "" },
            { id: 3, name: "Omar Al Suwaidi", nationality: "UAE", emiratesId: "784-1992-3344556-3", ownershipPercent: "15", type: "direct", residency: "non-resident", gender: "male", emiratesIdIssueDate: "", passportNumber: "P1234567" },
            { id: 4, name: "Khalid Al Maktoum", nationality: "UAE", emiratesId: "784-1978-5551234-0", ownershipPercent: "15", type: "ubo", residency: "non-resident", gender: "male", emiratesIdIssueDate: "", passportNumber: "P9876543" },
          ]);
          // Populate KYB docs (verified from Oscilar)
          setKybDocs({ tradeLicense: "TradeLicense-AlMasraf-2024.pdf", moaAoa: "MoA-AoA-AlMasraf.pdf", trnCertificate: "TRN-Certificate-AlMasraf.pdf" });
          return 100;
        }
        return prev + 4;
      });
    }, 120);
  };

  // OTP handlers
  const handleOtpChange = (type: "email" | "mobile", index: number, value: string) => {
    if (value.length > 1) return;
    const arr = type === "email" ? [...emailOtp] : [...mobileOtp];
    arr[index] = value;
    if (type === "email") setEmailOtp(arr); else setMobileOtp(arr);
    if (value && index < 5) { document.getElementById(`${type}-otp-${index + 1}`)?.focus(); }
  };

  const handleOtpKeyDown = (type: "email" | "mobile", index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      const arr = type === "email" ? [...emailOtp] : [...mobileOtp];
      if (!arr[index] && index > 0) { document.getElementById(`${type}-otp-${index - 1}`)?.focus(); }
    }
  };

  const verifyEmailOtp = () => { setVerifyingEmail(true); setTimeout(() => { setVerifyingEmail(false); setEmailVerified(true); }, 1200); };
  const resendEmailOtp = () => { setEmailOtp(["", "", "", "", "", ""]); setEmailResendTimer(30); };
  const verifyMobileOtp = () => { setVerifyingMobile(true); setTimeout(() => { setVerifyingMobile(false); setMobileVerified(true); }, 1200); };
  const resendMobileOtp = () => { setMobileOtp(["", "", "", "", "", ""]); setMobileResendTimer(30); };
  const handleOtpComplete = () => { setProfileCreated(true); setProfileRedirectTimer(10); };

  useEffect(() => { if (emailResendTimer > 0 && !emailVerified) { const t = setTimeout(() => setEmailResendTimer(emailResendTimer - 1), 1000); return () => clearTimeout(t); } }, [emailResendTimer, emailVerified]);
  useEffect(() => { if (mobileResendTimer > 0 && !mobileVerified) { const t = setTimeout(() => setMobileResendTimer(mobileResendTimer - 1), 1000); return () => clearTimeout(t); } }, [mobileResendTimer, mobileVerified]);
  useEffect(() => { if (profileCreated && profileRedirectTimer > 0) { const t = setTimeout(() => setProfileRedirectTimer(profileRedirectTimer - 1), 1000); return () => clearTimeout(t); } if (profileCreated && profileRedirectTimer === 0) { handleProfileSuccessContinue(); } }, [profileCreated, profileRedirectTimer]);
  useEffect(() => { const h = (e: MouseEvent) => { if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) setShowProfileMenu(false); }; document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h); }, []);

  // Submit success countdown
  useEffect(() => {
    if (!showSubmitSuccess) return;
    if (submitRedirectTimer <= 0) { navigate('/applications'); return; }
    const t = setTimeout(() => setSubmitRedirectTimer(prev => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [showSubmitSuccess, submitRedirectTimer, navigate]);

  const handleProfileSuccessContinue = () => { setShowOtpModal(false); setProfileCreated(false); setCurrentStep(2); };

  const handleNext = () => {
    if (currentStep === 1) { setShowOtpModal(true); return; }
    if (currentStep === 3 && !aecbConsent) return;
    if (currentStep === 4 && !selectedProduct) return;
    if (currentStep === 8) {
      if (acceptedAgreements) {
        localStorage.setItem("merchant_underwriting_status", "pending");
        localStorage.setItem("selected_product", selectedProduct || "receivable");
        localStorage.setItem("demo_merchant_role", selectedProduct || "receivable");
        localStorage.setItem("demo_app_dataset", "single");
        window.dispatchEvent(new Event("demo-role-change"));
        setShowSubmitSuccess(true);
        setSubmitRedirectTimer(10);
        return;
      }
    } else if (currentStep < steps.length) { setCurrentStep(currentStep + 1); }
  };

  const handleBack = () => { if (currentStep > 2) setCurrentStep(currentStep - 1); };

  // Bank statement handlers
  const handleBankStatementUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) setBusinessDocs(prev => ({ ...prev, bankStatements: [...prev.bankStatements, ...Array.from(files)] }));
  };

  const removeBankStatement = (index: number) => {
    setBusinessDocs(prev => ({ ...prev, bankStatements: prev.bankStatements.filter((_, i) => i !== index) }));
  };

  const handleBankSelect = (bank: string) => setSelectedBank(bank);
  const handleConnectBank = () => setConnectStep('auth');
  const handleAuthenticate = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setConnectStep('success');
      setLeanConnectedStatements(prev => [...prev, {
        id: `lean-${Date.now()}`,
        fileName: `${selectedBank}_Connected_Statement.pdf`,
        bankName: selectedBank,
        accountNumber: '****' + Math.floor(1000 + Math.random() * 9000),
        period: 'Auto-fetched via Lean',
        uploadDate: new Date(),
        fileSize: 'Connected',
      }]);
    }, 2000);
  };
  const closeConnectModal = () => { setShowConnectModal(false); setConnectStep('bank-select'); setSelectedBank(''); };

  // Signatory pool from shareholders + custom
  const [customSignatories, setCustomSignatories] = useState<{ id: string; name: string; designation: string; emiratesId: string }[]>([]);
  const signatoryPool = [
    ...shareholders.map(s => ({ id: `sh-${s.id}`, name: s.name, designation: getEffectiveType(s), emiratesId: s.emiratesId })),
    ...customSignatories,
  ];

  const addCustomSignatory = () => {
    if (!customSignatory.name.trim()) return;
    const newEntry = { id: `cs-${Date.now()}`, name: customSignatory.name, designation: customSignatory.designation || "Authorized Signatory", emiratesId: customSignatory.emiratesId };
    setCustomSignatories(prev => [...prev, newEntry]);
    setSelectedSignatoryId(newEntry.id);
    setCustomSignatory({ name: "", designation: "", emiratesId: "" });
    setShowAddSignatory(false);
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return renderProfileCreation();
      case 2: return renderKybVerification();
      case 3: return renderAecbConsent();
      case 4: return renderLoanProduct();
      case 5: return renderBusinessDocuments();
      case 6: return renderKycDocuments();
      case 7: return renderAuthorizedSignatory();
      case 8: return renderReviewSubmit();
      default: return null;
    }
  };

  const renderProfileCreation = () => (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <div className="w-1 h-7 bg-blue-600 rounded-full"></div>
        <h2 className="text-lg font-semibold text-gray-900">Create Your Profile</h2>
      </div>
      <p className="text-sm text-gray-500 mb-8 ml-4">Tell us about your company and verify your identity to get started</p>
      
      {/* Demo Message */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-purple-900 mb-1">Demo Only</p>
            <p className="text-sm text-purple-800">This step will be implemented on the MAL Bank system. The data collected here will be passed to Biz2X at the Loan Product step.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
          <h3 className="text-sm font-medium text-gray-900">Company Details</h3>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Company Legal Name</label>
            <input type="text" value={profileData.companyLegalName} onChange={e => setProfileData({ ...profileData, companyLegalName: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
          <h3 className="text-sm font-medium text-gray-900">Contact Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Full Name</label><input type="text" value={profileData.contactFullName} onChange={e => setProfileData({ ...profileData, contactFullName: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" /></div>
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Email Address</label><input type="email" value={profileData.email} onChange={e => setProfileData({ ...profileData, email: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" /></div>
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Mobile Number</label><input type="tel" value={profileData.mobileNumber} onChange={e => setProfileData({ ...profileData, mobileNumber: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" /></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderKybVerification = () => (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <div className="w-1 h-7 bg-blue-600 rounded-full"></div>
        <h2 className="text-lg font-semibold text-gray-900">KYB Verification</h2>
      </div>
      <p className="text-sm text-gray-500 mb-6 ml-4">Enter your Trade License number to verify your business via Oscilar</p>

      {/* Demo Message */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-purple-900 mb-1">Demo Only</p>
            <p className="text-sm text-purple-800">This step will be implemented on the MAL Bank system. The data collected here will be passed to Biz2X at the Loan Product step.</p>
          </div>
        </div>
      </div>

      {kybStatus === "idle" && (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800">We will verify your business details through Oscilar's KYB workflow. Company information, shareholders, directors, and documents will be automatically retrieved and verified.</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Trade License Number</label>
            <div className="flex gap-3">
              <input type="text" value={tlNumber} onChange={e => setTlNumber(e.target.value)} placeholder="e.g. TL-345678" className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
              <button onClick={startKybVerification} disabled={!tlNumber.trim()} className="px-5 py-2.5 bg-[#4F8DFF] text-white rounded-lg hover:bg-[#3A7AE8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Verify Business
              </button>
            </div>
          </div>
        </>
      )}

      {kybStatus === "verifying" && (
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <div className="text-center mb-6">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Oscilar KYB Verification in Progress</h3>
            <p className="text-sm text-gray-500">Verifying business details for TL: {tlNumber}</p>
          </div>
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>Verifying...</span>
              <span>{kybProgress}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full transition-all duration-150" style={{ width: `${kybProgress}%` }} />
            </div>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">{kybProgress >= 20 ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Loader2 className="w-4 h-4 text-gray-300 animate-spin" />} Validating Trade License</div>
              <div className="flex items-center gap-2">{kybProgress >= 45 ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Loader2 className="w-4 h-4 text-gray-300 animate-spin" />} Fetching Company Information</div>
              <div className="flex items-center gap-2">{kybProgress >= 65 ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Loader2 className="w-4 h-4 text-gray-300 animate-spin" />} Retrieving Shareholders & Directors</div>
              <div className="flex items-center gap-2">{kybProgress >= 85 ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Loader2 className="w-4 h-4 text-gray-300 animate-spin" />} Verifying Documents</div>
              <div className="flex items-center gap-2">{kybProgress >= 100 ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Loader2 className="w-4 h-4 text-gray-300 animate-spin" />} Completing Verification</div>
            </div>
          </div>
        </div>
      )}

      {kybStatus === "verified" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm text-green-700 font-medium">KYB Verification Complete — All data verified by Oscilar</span>
          </div>

          {/* Company Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
            <div className="flex items-center gap-2"><Building2 className="w-5 h-5 text-blue-600" /><h3 className="text-sm font-medium text-gray-900">Company Information</h3><span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Verified</span></div>
            <div className="grid grid-cols-2 gap-4">
              {[
                ["Legal Business Name", companyInfo.legalBusinessName],
                ["Trade License Number", companyInfo.tradeLicenseNumber],
                ["Business Type", companyInfo.businessType],
                ["Industry / Sector", companyInfo.industrySector],
                ["Activity Type", companyInfo.activityType],
                ["Country of Incorporation", companyInfo.countryOfIncorporation],
                ["Registered Address", companyInfo.registeredAddress],
                ["City", companyInfo.city],
                ["Emirate", companyInfo.emirate],
                ["Monthly Revenue (AED)", companyInfo.monthlyRevenue],
                ["TRN Number", companyInfo.trnNumber],
              ].map(([label, value]) => (
                <div key={label}><label className="block text-xs font-medium text-gray-500 mb-1">{label}</label><input type="text" value={value} readOnly className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 text-sm" /></div>
              ))}
            </div>
          </div>

          {/* Shareholders, Directors & UBOs */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
            <div className="flex items-center gap-2"><UserCheck className="w-5 h-5 text-blue-600" /><h3 className="text-sm font-medium text-gray-900">Shareholders, Directors & UBOs</h3><span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Verified</span></div>
            <div className="space-y-3">
              {shareholders.map(sh => (
                <div key={sh.id} className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{sh.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sh.type === "ubo" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>{getEffectiveType(sh)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{sh.ownershipPercent}% · {sh.nationality} · {sh.residency === "resident" ? "Resident" : "Non-Resident"} · {sh.residency === "resident" ? `EID: ${sh.emiratesId}` : `Passport: ${sh.passportNumber}`}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Documents */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-3">
            <div className="flex items-center gap-2"><FileText className="w-5 h-5 text-blue-600" /><h3 className="text-sm font-medium text-gray-900">Verified Documents</h3><span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Verified</span></div>
            {[
              { label: "Trade License", file: kybDocs.tradeLicense },
              { label: "MoA / AoA", file: kybDocs.moaAoa },
              { label: "TRN Certificate", file: kybDocs.trnCertificate },
            ].map(doc => (
              <div key={doc.label} className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-900 flex-1">{doc.label}</span>
                <span className="text-xs text-gray-500">{doc.file}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderAecbConsent = () => (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <div className="w-1 h-7 bg-blue-600 rounded-full"></div>
        <h2 className="text-lg font-semibold text-gray-900">AECB Credit Consent</h2>
      </div>
      <p className="text-sm text-gray-500 mb-6 ml-4">Authorize a credit check through the Al Etihad Credit Bureau (AECB)</p>

      {/* Demo Message */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-purple-900 mb-1">Demo Only</p>
            <p className="text-sm text-purple-800">This step will be implemented on the MAL Bank system. The data collected here will be passed to Biz2X at the Loan Product step.</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">A credit check is required to assess your company's creditworthiness. This is a standard part of the financing application process in the UAE.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">TRN Number (Tax Registration Number)</label>
          <input type="text" value={aecbTrnNumber || companyInfo.trnNumber} readOnly className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 text-sm cursor-not-allowed" />
        </div>

        <div className="border-t border-gray-200 pt-5">
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={aecbConsent} onChange={e => setAecbConsent(e.target.checked)} className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <div className="text-sm text-gray-700">
              <p className="font-medium text-gray-900 mb-1">I authorize AECB Credit Check</p>
              <p>I hereby authorize Mal to perform a credit check on my company ({companyInfo.legalBusinessName || profileData.companyLegalName}) using the TRN number ({aecbTrnNumber || companyInfo.trnNumber}) provided. I understand that this check is necessary for the evaluation of my supply chain financing application and consent to the retrieval of my company's credit information from the Al Etihad Credit Bureau (AECB).</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderLoanProduct = () => (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <div className="w-1 h-7 bg-blue-600 rounded-full"></div>
        <h2 className="text-lg font-semibold text-gray-900">Select a Loan Product</h2>
      </div>
      <p className="text-sm text-gray-500 mb-8 ml-4">Select loan options without commitment. Our specialists will follow up after application submission.</p>
      <div className="flex justify-center">
        <div className="grid grid-cols-2 gap-6 max-w-xl w-full">
          <button onClick={() => setSelectedProduct("receivable")} className={`relative bg-white border rounded-xl px-6 pt-8 pb-8 transition-all text-center ${selectedProduct === "receivable" ? "border-blue-600 ring-2 ring-blue-100" : "border-gray-200 hover:border-gray-300"}`}>
            <div className="absolute top-3 right-3"><div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedProduct === "receivable" ? "border-blue-600" : "border-gray-300"}`}>{selectedProduct === "receivable" && <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>}</div></div>
            <div className="flex justify-center mb-5"><ReceiptText className="w-14 h-14 text-blue-400" /></div>
            <h3 className="text-base font-semibold text-gray-900 mb-3">Receivable Invoice Financing</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Get early payment on your outstanding invoices to improve cash flow.</p>
          </button>
          <button onClick={() => setSelectedProduct("payable")} className={`relative bg-white border rounded-xl px-6 pt-8 pb-8 transition-all text-center ${selectedProduct === "payable" ? "border-blue-600 ring-2 ring-blue-100" : "border-gray-200 hover:border-gray-300"}`}>
            <div className="absolute top-3 right-3"><div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedProduct === "payable" ? "border-blue-600" : "border-gray-300"}`}>{selectedProduct === "payable" && <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>}</div></div>
            <div className="flex justify-center mb-5"><Building2 className="w-14 h-14 text-purple-400" /></div>
            <h3 className="text-base font-semibold text-gray-900 mb-3">Payable Invoice Financing</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Extend payment terms with suppliers while they get paid early.</p>
          </button>
        </div>
      </div>
      <div className="mt-10 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-400 leading-relaxed">This financing application is for business purposes only. Financing for personal, family, and/or household purposes is prohibited under business credit lines.</p>
        <p className="text-sm text-gray-400 leading-relaxed mt-2 uppercase font-medium">Credit approval is subject to verification of information and may require receipt of additional documentation at the sole discretion of Mal.</p>
      </div>
    </div>
  );

  const renderBusinessDocuments = () => (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <div className="w-1 h-7 bg-blue-600 rounded-full"></div>
        <h2 className="text-lg font-semibold text-gray-900">Business Documents</h2>
      </div>
      <p className="text-sm text-gray-500 mb-6 ml-4">Upload your business financial documents for assessment</p>

      <div className="space-y-4">
        {/* Bank Statements */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
          <div className="flex items-center gap-2"><FileText className="w-5 h-5 text-blue-600" /><h3 className="text-sm font-medium text-gray-900">Business Bank Statements</h3></div>
          <p className="text-xs text-gray-500">Upload bank statements for the last 6 months or connect via Lean</p>

          {(businessDocs.bankStatements.length > 0 || leanConnectedStatements.length > 0) && (
            <div className="space-y-2">
              {businessDocs.bankStatements.map((f, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700 flex-1 truncate">{f.name}</span>
                  <span className="text-xs text-gray-400">{(f.size / (1024 * 1024)).toFixed(1)} MB</span>
                  <button onClick={() => removeBankStatement(i)} className="p-1 text-gray-400 hover:text-red-600"><X className="w-4 h-4" /></button>
                </div>
              ))}
              {leanConnectedStatements.map(stmt => (
                <div key={stmt.id} className="flex items-center gap-3 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-700 flex-1 truncate">{stmt.bankName} — {stmt.period}</span>
                  <span className="text-xs text-green-600">Connected</span>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50/30 transition-colors cursor-pointer">
              <Upload className="w-6 h-6 text-gray-400" />
              <span className="text-sm text-gray-700 font-medium">Upload Manually</span>
              <span className="text-xs text-gray-400">PDF or CSV</span>
              <input type="file" className="hidden" accept=".pdf,.csv" multiple onChange={handleBankStatementUpload} />
            </label>
            <button onClick={() => setShowConnectModal(true)} className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50/30 transition-colors">
              <Building2 className="w-6 h-6 text-gray-400" />
              <span className="text-sm text-gray-700 font-medium">Connect via Lean</span>
              <span className="text-xs text-gray-400">Auto-fetch statements</span>
            </button>
          </div>
        </div>

        {/* Last 6 Invoices */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0"><ReceiptText className="w-5 h-5 text-blue-600" /></div>
              <div><h3 className="text-sm font-medium text-gray-900">Last 6 Invoices</h3><p className="text-xs text-gray-500 mt-0.5">Upload your most recent 6 invoices for assessment</p></div>
            </div>
            {businessDocs.lastSixInvoices ? (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-xs text-green-700 font-medium">{businessDocs.lastSixInvoices.name}</span>
                <button onClick={() => setBusinessDocs(prev => ({ ...prev, lastSixInvoices: null }))} className="text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>
              </div>
            ) : (
              <label className="flex items-center gap-2 px-4 py-2 bg-[#4F8DFF] text-white rounded-lg hover:bg-[#3A7AE8] cursor-pointer text-sm">
                <Upload className="w-4 h-4" /> Upload
                <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.zip" onChange={e => { if (e.target.files?.[0]) setBusinessDocs(prev => ({ ...prev, lastSixInvoices: e.target.files![0] })); }} />
              </label>
            )}
          </div>
        </div>

        {/* Audited P&L - only for Payable */}
        {selectedProduct === "payable" && (
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0"><FileText className="w-5 h-5 text-amber-600" /></div>
                <div><h3 className="text-sm font-medium text-gray-900">Audited P&L Statement</h3><p className="text-xs text-gray-500 mt-0.5">Required for Payable Invoice Financing applicants</p></div>
              </div>
              {businessDocs.auditedPnl ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-green-700 font-medium">{businessDocs.auditedPnl.name}</span>
                  <button onClick={() => setBusinessDocs(prev => ({ ...prev, auditedPnl: null }))} className="text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                </div>
              ) : (
                <label className="flex items-center gap-2 px-4 py-2 bg-[#4F8DFF] text-white rounded-lg hover:bg-[#3A7AE8] cursor-pointer text-sm">
                  <Upload className="w-4 h-4" /> Upload
                  <input type="file" className="hidden" accept=".pdf" onChange={e => { if (e.target.files?.[0]) setBusinessDocs(prev => ({ ...prev, auditedPnl: e.target.files![0] })); }} />
                </label>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex gap-3"><Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" /><p className="text-sm text-amber-800">Accepted formats: PDF, JPG, PNG, CSV. Maximum file size: 10MB per document.</p></div>
      </div>
    </div>
  );

  const renderKycDocuments = () => (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <div className="w-1 h-7 bg-blue-600 rounded-full"></div>
        <h2 className="text-lg font-semibold text-gray-900">KYC Documents</h2>
      </div>
      <p className="text-sm text-gray-500 mb-6 ml-4">Upload identity documents for each shareholder</p>
      <div className="space-y-4">
        {shareholders.map(sh => (
          <div key={sh.id} className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">{sh.name}</h3>
                <p className="text-xs text-gray-500">{getEffectiveType(sh)} &middot; {sh.ownershipPercent}% ownership &middot; {sh.residency === "resident" ? "Resident" : "Non-Resident"}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {sh.residency === "resident" && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Emirates ID</label>
                  {kycDocs[`sh-${sh.id}`]?.emiratesId ? (
                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-green-700 truncate flex-1">{kycDocs[`sh-${sh.id}`].emiratesId!.name}</span>
                      <button onClick={() => setKycDocs(prev => ({ ...prev, [`sh-${sh.id}`]: { ...prev[`sh-${sh.id}`], emiratesId: null } }))} className="text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <label className="flex items-center gap-2 border border-dashed border-gray-300 rounded-lg px-3 py-2 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                      <Upload className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">Upload Emirates ID</span>
                      <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={e => { const f = e.target.files?.[0]; if (f) setKycDocs(prev => ({ ...prev, [`sh-${sh.id}`]: { ...prev[`sh-${sh.id}`] || { emiratesId: null, passport: null }, emiratesId: f } })); }} />
                    </label>
                  )}
                </div>
              )}
              {sh.residency === "non-resident" && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Passport</label>
                  {kycDocs[`sh-${sh.id}`]?.passport ? (
                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-green-700 truncate flex-1">{kycDocs[`sh-${sh.id}`].passport!.name}</span>
                      <button onClick={() => setKycDocs(prev => ({ ...prev, [`sh-${sh.id}`]: { ...prev[`sh-${sh.id}`], passport: null } }))} className="text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <label className="flex items-center gap-2 border border-dashed border-gray-300 rounded-lg px-3 py-2 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                      <Upload className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">Upload Passport</span>
                      <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={e => { const f = e.target.files?.[0]; if (f) setKycDocs(prev => ({ ...prev, [`sh-${sh.id}`]: { ...prev[`sh-${sh.id}`] || { emiratesId: null, passport: null }, passport: f } })); }} />
                    </label>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {shareholders.length === 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex gap-3"><Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" /><p className="text-sm text-amber-800">Complete KYB Verification first to populate shareholders for KYC document upload.</p></div>
          </div>
        )}
      </div>
    </div>
  );

  const renderAuthorizedSignatory = () => (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <div className="w-1 h-7 bg-blue-600 rounded-full"></div>
        <h2 className="text-lg font-semibold text-gray-900">Authorized Signatory</h2>
      </div>
      <p className="text-sm text-gray-500 mb-6 ml-4">Select the person authorized to sign on behalf of the company</p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">The authorized signatory will be responsible for signing all financing agreements and legal documents on behalf of the company.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-3">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Select Authorized Signatory</h3>
        {signatoryPool.length > 0 ? (
          <div className="space-y-2">
            {signatoryPool.map(person => (
              <button key={person.id} onClick={() => setSelectedSignatoryId(person.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 border rounded-lg text-left transition-colors ${selectedSignatoryId === person.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedSignatoryId === person.id ? 'border-blue-600' : 'border-gray-300'}`}>
                  {selectedSignatoryId === person.id && <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{person.name}</p>
                  <p className="text-xs text-gray-500">{person.designation}</p>
                </div>
                {selectedSignatoryId === person.id && <CheckCircle className="w-4 h-4 text-blue-600" />}
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex gap-3"><Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" /><p className="text-sm text-amber-800">Complete KYB Verification first to populate the list of eligible signatories.</p></div>
          </div>
        )}

        {/* Add another signatory */}
        {showAddSignatory ? (
          <div className="border border-gray-200 rounded-lg p-4 space-y-3 mt-3">
            <h4 className="text-sm font-medium text-gray-900">Add Another Signatory</h4>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Full Name</label><input type="text" value={customSignatory.name} onChange={e => setCustomSignatory({ ...customSignatory, name: e.target.value })} placeholder="Full name" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" /></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Designation</label><input type="text" value={customSignatory.designation} onChange={e => setCustomSignatory({ ...customSignatory, designation: e.target.value })} placeholder="e.g. CEO, CFO, Director" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" /></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Emirates ID</label><input type="text" value={customSignatory.emiratesId} onChange={e => setCustomSignatory({ ...customSignatory, emiratesId: e.target.value })} placeholder="784-XXXX-XXXXXXX-X" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" /></div>
            </div>
            <div className="flex gap-2">
              <button onClick={addCustomSignatory} disabled={!customSignatory.name.trim()} className="px-4 py-1.5 bg-[#4F8DFF] text-white rounded-lg text-sm hover:bg-[#3A7AE8] disabled:opacity-50">Add</button>
              <button onClick={() => setShowAddSignatory(false)} className="px-4 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowAddSignatory(true)} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 mt-3"><Plus className="w-4 h-4" /> Add another signatory</button>
        )}
      </div>
    </div>
  );

  const renderReviewSubmit = () => (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <div className="w-1 h-7 bg-blue-600 rounded-full"></div>
        <h2 className="text-lg font-semibold text-gray-900">Review & Submit</h2>
      </div>
      <p className="text-sm text-gray-500 mb-6 ml-4">Review all information before submitting your application</p>
      <div className="space-y-4">
        {/* KYB Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">KYB Verification</h3>
            <button onClick={() => setCurrentStep(2)} className="text-xs text-blue-600 hover:text-blue-800">Edit</button>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <div><span className="text-gray-500">Company:</span> <span className="text-gray-900 ml-1">{companyInfo.legalBusinessName || "—"}</span></div>
            <div><span className="text-gray-500">TL Number:</span> <span className="text-gray-900 ml-1">{companyInfo.tradeLicenseNumber || "—"}</span></div>
            <div><span className="text-gray-500">Business Type:</span> <span className="text-gray-900 ml-1">{companyInfo.businessType || "—"}</span></div>
            <div><span className="text-gray-500">Industry:</span> <span className="text-gray-900 ml-1">{companyInfo.industrySector || "—"}</span></div>
            <div><span className="text-gray-500">TRN:</span> <span className="text-gray-900 ml-1">{companyInfo.trnNumber || "—"}</span></div>
            <div><span className="text-gray-500">Status:</span> <span className="text-green-700 ml-1 font-medium">{kybStatus === "verified" ? "Verified" : "Pending"}</span></div>
          </div>
        </div>

        {/* Loan Product */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Loan Product</h3>
            <button onClick={() => setCurrentStep(4)} className="text-xs text-blue-600 hover:text-blue-800">Edit</button>
          </div>
          <p className="text-sm text-gray-700">{selectedProduct === "receivable" ? "Receivable Invoice Financing" : selectedProduct === "payable" ? "Payable Invoice Financing" : "Not selected"}</p>
        </div>

        {/* AECB Credit Consent Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">AECB Credit Consent</h3>
            <button onClick={() => setCurrentStep(3)} className="text-xs text-blue-600 hover:text-blue-800">Edit</button>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {aecbConsent ? <CheckCircle className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-gray-300" />}
            <span className={aecbConsent ? "text-green-700" : "text-gray-400"}>{aecbConsent ? "Consent provided" : "Consent not provided"}</span>
          </div>
        </div>

        {/* Business Documents Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Business Documents</h3>
            <button onClick={() => setCurrentStep(5)} className="text-xs text-blue-600 hover:text-blue-800">Edit</button>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              {(businessDocs.bankStatements.length > 0 || leanConnectedStatements.length > 0) ? <CheckCircle className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-gray-300" />}
              <span className={businessDocs.bankStatements.length > 0 || leanConnectedStatements.length > 0 ? "text-gray-900" : "text-gray-400"}>Bank Statements ({businessDocs.bankStatements.length + leanConnectedStatements.length})</span>
            </div>
            <div className="flex items-center gap-2">
              {businessDocs.lastSixInvoices ? <CheckCircle className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-gray-300" />}
              <span className={businessDocs.lastSixInvoices ? "text-gray-900" : "text-gray-400"}>Last 6 Invoices</span>
            </div>
            {selectedProduct === "payable" && (
              <div className="flex items-center gap-2">
                {businessDocs.auditedPnl ? <CheckCircle className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-gray-300" />}
                <span className={businessDocs.auditedPnl ? "text-gray-900" : "text-gray-400"}>Audited P&L Statement</span>
              </div>
            )}
          </div>
        </div>

        {/* KYC Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">KYC Documents</h3>
            <button onClick={() => setCurrentStep(6)} className="text-xs text-blue-600 hover:text-blue-800">Edit</button>
          </div>
          <div className="space-y-2 text-sm">
            {shareholders.map(sh => (
              <div key={sh.id} className="flex items-center justify-between">
                <span className="text-gray-700">{sh.name}</span>
                <div className="flex items-center gap-3">
                  {sh.residency === "resident" && <span className="flex items-center gap-1 text-xs">{kycDocs[`sh-${sh.id}`]?.emiratesId ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <X className="w-3.5 h-3.5 text-gray-300" />} EID</span>}
                  {sh.residency === "non-resident" && <span className="flex items-center gap-1 text-xs">{kycDocs[`sh-${sh.id}`]?.passport ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <X className="w-3.5 h-3.5 text-gray-300" />} Passport</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verified KYB Documents */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Verified Documents (KYB)</h3>
          </div>
          <div className="space-y-1 text-sm">
            {[{ label: "Trade License", file: kybDocs.tradeLicense }, { label: "MoA / AoA", file: kybDocs.moaAoa }, { label: "TRN Certificate", file: kybDocs.trnCertificate }].map(d => (
              <div key={d.label} className="flex items-center gap-2">
                {d.file ? <CheckCircle className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-gray-300" />}
                <span className={d.file ? "text-gray-900" : "text-gray-400"}>{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Authorized Signatory Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Authorized Signatory</h3>
            <button onClick={() => setCurrentStep(7)} className="text-xs text-blue-600 hover:text-blue-800">Edit</button>
          </div>
          <p className="text-sm text-gray-700">{signatoryPool.find(p => p.id === selectedSignatoryId)?.name || "Not selected"}</p>
        </div>

        {/* Agreements */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={acceptedAgreements} onChange={e => setAcceptedAgreements(e.target.checked)} className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <span className="text-sm text-gray-700">I confirm that all information provided is accurate and complete. I agree to the <button onClick={() => setShowTermsModal(true)} className="text-blue-600 hover:underline">Terms and Conditions</button> and <button onClick={() => setShowPrivacyModal(true)} className="text-blue-600 hover:underline">Privacy Policy</button>.</span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-[#C3D2E7] px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <MalLogo height={28} className="text-gray-900" />
            {currentStep > 1 && (<><div className="h-6 w-px bg-gray-300"></div><div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-gray-500" /><p className="text-sm text-gray-700">{profileData.companyLegalName}</p></div></>)}
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-700">{currentStep > 1 ? profileData.contactFullName : "New Merchant"}</p>
            <div className="relative" ref={profileMenuRef}>
              <button 
                onClick={() => currentStep > 1 && setShowProfileMenu(!showProfileMenu)} 
                disabled={currentStep === 1}
                className={`w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center text-white font-medium transition-colors ${
                  currentStep === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-teal-600'
                }`}
              >
                {currentStep > 1 ? profileData.contactFullName.charAt(0) : "N"}
              </button>
              {showProfileMenu && currentStep > 1 && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <button onClick={() => setShowProfileMenu(false)} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"><Settings className="w-4 h-4 text-gray-500" /> Account Settings</button>
                  <div className="border-t border-gray-200 my-2"></div>
                  <button onClick={() => { setShowProfileMenu(false); navigate('/login'); }} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"><LogOut className="w-4 h-4" /> Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Left, hidden on Profile Creation */}
        {currentStep > 1 && (
          <div className="w-80 bg-white border-r border-gray-200 p-5 overflow-y-auto">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Application Steps</h3>
            <div className="space-y-3">
              {visibleSteps.map((step, index) => {
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                const isClickable = step.id <= currentStep;
                return (
                  <button key={step.id} onClick={() => { if (isClickable) setCurrentStep(step.id); }} disabled={!isClickable}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${isActive ? 'bg-blue-50 border-l-2 border-blue-600 text-blue-700' : isCompleted ? 'text-gray-700 hover:bg-gray-50' : 'text-gray-400 cursor-not-allowed'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${isActive ? 'bg-[#4F8DFF] text-white' : isCompleted ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                      {isCompleted ? <Check className="w-3 h-3" /> : index + 1}
                    </div>
                    <span className="text-sm">{step.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-3xl mx-auto">{renderStepContent()}</div>
          </div>

          {/* Footer */}
          <div className="bg-white border-t border-gray-200 px-8 py-4 flex items-center justify-between">
            <button onClick={handleBack} disabled={currentStep <= 2} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm transition-colors ${currentStep <= 2 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100 border border-gray-300'}`}>
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="text-xs text-gray-400">{currentStep === 1 ? '' : `Step ${visibleSteps.findIndex(s => s.id === currentStep) + 1} of ${visibleSteps.length}`}</div>
            <button onClick={handleNext}
              disabled={(currentStep === 8 && !acceptedAgreements) || (currentStep === 4 && !selectedProduct) || (currentStep === 3 && !aecbConsent)}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentStep === 8 ? acceptedAgreements ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : (currentStep === 4 && !selectedProduct) ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : (currentStep === 3 && !aecbConsent) ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#4F8DFF] text-white hover:bg-[#3A7AE8]'
              }`}>
              {currentStep === 8 ? 'Submit Application' : currentStep === 1 ? 'Create Profile' : 'Continue'}
            </button>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-[#CBD2DD]/[.72] flex items-center justify-center z-50">
          <div ref={otpModalRef} className="bg-white rounded shadow-xl w-full max-w-lg">
            {!profileCreated ? (
              <>
                <div className="px-5 py-3 flex items-center justify-between bg-[#C3D2E7] text-gray-900 rounded-t">
                  <h3 className="text-base font-semibold text-gray-900">Verify Your Identity</h3>
                  <button onClick={() => setShowOtpModal(false)} className="text-gray-500 hover:text-gray-900"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-5">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3"><Mail className="w-4 h-4 text-blue-600" /><span className="text-sm font-medium text-gray-700">Email Verification</span>{emailVerified && <CheckCircle className="w-4 h-4 text-green-500" />}</div>
                  <p className="text-xs text-gray-500 mb-3">Enter the 6-digit code sent to {profileData.email}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      {emailOtp.map((digit, i) => (
                        <input key={i} id={`email-otp-${i}`} type="text" maxLength={1} value={digit} onChange={e => handleOtpChange("email", i, e.target.value)} onKeyDown={e => handleOtpKeyDown("email", i, e)}
                          className={`w-10 h-10 text-center border rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 ${emailVerified ? 'border-green-300 bg-green-50 text-green-700' : 'border-gray-300'}`} disabled={emailVerified} />
                      ))}
                    </div>
                    {!emailVerified && <button onClick={verifyEmailOtp} disabled={verifyingEmail} className="px-4 py-2 bg-[#4F8DFF] text-white rounded-lg hover:bg-[#3A7AE8] text-sm disabled:opacity-50 flex items-center gap-2">{verifyingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : null}{verifyingEmail ? 'Verifying...' : 'Verify'}</button>}
                  </div>
                  {!emailVerified && <div className="mt-2">{emailResendTimer > 0 ? <p className="text-xs text-gray-400">Resend code in {emailResendTimer}s</p> : <button onClick={resendEmailOtp} className="text-xs text-blue-600 hover:text-blue-700 font-medium">Resend Code</button>}</div>}
                </div>
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3"><Phone className="w-4 h-4 text-blue-600" /><span className="text-sm font-medium text-gray-700">Mobile Verification</span>{mobileVerified && <CheckCircle className="w-4 h-4 text-green-500" />}</div>
                  <p className="text-xs text-gray-500 mb-3">Enter the 6-digit code sent to {profileData.mobileNumber}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      {mobileOtp.map((digit, i) => (
                        <input key={i} id={`mobile-otp-${i}`} type="text" maxLength={1} value={digit} onChange={e => handleOtpChange("mobile", i, e.target.value)} onKeyDown={e => handleOtpKeyDown("mobile", i, e)}
                          className={`w-10 h-10 text-center border rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 ${mobileVerified ? 'border-green-300 bg-green-50 text-green-700' : 'border-gray-300'}`} disabled={mobileVerified} />
                      ))}
                    </div>
                    {!mobileVerified && <button onClick={verifyMobileOtp} disabled={verifyingMobile} className="px-4 py-2 bg-[#4F8DFF] text-white rounded-lg hover:bg-[#3A7AE8] text-sm disabled:opacity-50 flex items-center gap-2">{verifyingMobile ? <Loader2 className="w-4 h-4 animate-spin" /> : null}{verifyingMobile ? 'Verifying...' : 'Verify'}</button>}
                  </div>
                  {!mobileVerified && <div className="mt-2">{mobileResendTimer > 0 ? <p className="text-xs text-gray-400">Resend code in {mobileResendTimer}s</p> : <button onClick={resendMobileOtp} className="text-xs text-blue-600 hover:text-blue-700 font-medium">Resend Code</button>}</div>}
                </div>
                <button onClick={handleOtpComplete} disabled={!emailVerified || !mobileVerified} className="w-full py-2.5 bg-[#4F8DFF] text-white rounded hover:bg-[#3A7AE8] text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Complete Verification</button>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-green-600" /></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Created Successfully</h3>
                <p className="text-sm text-gray-500 mb-4">Your identity has been verified and your profile has been created.</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                  <div className="flex items-start gap-2"><Mail className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" /><p className="text-sm text-blue-800">We have sent you a welcome email at <span className="font-medium">{profileData.email}</span> with a temporary password.</p></div>
                </div>
                <button onClick={handleProfileSuccessContinue} className="px-6 py-2.5 bg-[#4F8DFF] text-white rounded-lg hover:bg-[#3A7AE8] text-sm font-medium transition-colors">Continue</button>
                <p className="text-xs text-gray-400 mt-3">Auto-redirecting in {profileRedirectTimer}s</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Connect Bank (Lean) Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-[#CBD2DD]/[.72] flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-xl w-full max-w-md">
            <div className="px-5 py-3 flex items-center justify-between bg-[#C3D2E7] text-gray-900 rounded-t">
              <h3 className="text-base font-semibold text-gray-900">{connectStep === 'bank-select' ? 'Connect via Lean' : connectStep === 'auth' ? 'Authenticate' : 'Connected'}</h3>
              <button onClick={closeConnectModal} className="text-gray-500 hover:text-gray-900"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5">
            {connectStep === 'bank-select' && (
              <div className="space-y-2">
                {['Emirates NBD', 'ADCB', 'FAB', 'Mashreq', 'DIB', 'RAKBANK'].map(bank => (
                  <button key={bank} onClick={() => handleBankSelect(bank)} className={`w-full flex items-center gap-3 px-4 py-3 border rounded-lg text-left transition-colors ${selectedBank === bank ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <Building2 className="w-5 h-5 text-gray-400" /><span className="text-sm font-medium text-gray-900">{bank}</span>{selectedBank === bank && <CheckCircle className="w-4 h-4 text-blue-600 ml-auto" />}
                  </button>
                ))}
                <button onClick={handleConnectBank} disabled={!selectedBank} className="w-full mt-4 py-2.5 bg-[#4F8DFF] text-white rounded-lg hover:bg-[#3A7AE8] text-sm font-medium disabled:opacity-50 transition-colors">Connect to {selectedBank || 'Bank'}</button>
              </div>
            )}
            {connectStep === 'auth' && (
              <div className="text-center py-6">
                {isConnecting ? (<><Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" /><p className="text-sm text-gray-600">Connecting to {selectedBank}...</p></>) : (<><Building2 className="w-10 h-10 text-blue-600 mx-auto mb-4" /><p className="text-sm text-gray-600 mb-4">You will be redirected to {selectedBank}'s secure portal.</p><button onClick={handleAuthenticate} className="px-6 py-2.5 bg-[#4F8DFF] text-white rounded-lg hover:bg-[#3A7AE8] text-sm font-medium">Authenticate with {selectedBank}</button></>)}
              </div>
            )}
            {connectStep === 'success' && (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-green-600" /></div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Bank Connected</h4>
                <p className="text-sm text-gray-500 mb-4">Your {selectedBank} statements have been fetched successfully.</p>
                <button onClick={closeConnectModal} className="px-6 py-2.5 bg-[#4F8DFF] text-white rounded-lg hover:bg-[#3A7AE8] text-sm font-medium">Done</button>
              </div>
            )}
            </div>
          </div>
        </div>
      )}

      {/* Terms Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-[#CBD2DD]/[.72] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="px-5 py-3 flex items-center justify-between bg-[#C3D2E7] text-gray-900 rounded-t"><h3 className="text-base font-semibold text-gray-900">Terms and Conditions</h3><button onClick={() => setShowTermsModal(false)} className="text-gray-500 hover:text-gray-900"><X className="w-5 h-5" /></button></div>
            <div className="p-5">
            <p className="text-sm text-gray-600 leading-relaxed">These Terms and Conditions govern your use of the Mal Supply Chain Finance platform. By submitting your application, you agree to provide accurate information and authorize Mal to verify your business details through third-party services.</p>
            <button onClick={() => setShowTermsModal(false)} className="mt-6 w-full py-2.5 bg-[#4F8DFF] text-white rounded hover:bg-[#3A7AE8] text-sm font-medium">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-[#CBD2DD]/[.72] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="px-5 py-3 flex items-center justify-between bg-[#C3D2E7] text-gray-900 rounded-t"><h3 className="text-base font-semibold text-gray-900">Privacy Policy</h3><button onClick={() => setShowPrivacyModal(false)} className="text-gray-500 hover:text-gray-900"><X className="w-5 h-5" /></button></div>
            <div className="p-5">
            <p className="text-sm text-gray-600 leading-relaxed">Mal is committed to protecting your privacy. We collect and process your business information solely for the purpose of evaluating your supply chain financing application. Your data is stored securely and shared only with authorized verification partners.</p>
            <button onClick={() => setShowPrivacyModal(false)} className="mt-6 w-full py-2.5 bg-[#4F8DFF] text-white rounded hover:bg-[#3A7AE8] text-sm font-medium">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Application Submitted Success Modal */}
      {showSubmitSuccess && (
        <div className="fixed inset-0 bg-[#CBD2DD]/[.72] flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-xl w-full max-w-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Application Submitted Successfully</h3>
            <p className="text-sm text-gray-600 mb-6 max-w-sm mx-auto">
              Your application is submitted and is under review. You can check for the latest updates to your application from your Mal Merchant Portal.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">Redirecting you to portal in <span className="font-semibold">{submitRedirectTimer}</span> seconds...</p>
            </div>
            <button onClick={() => navigate('/applications')} className="px-6 py-2.5 bg-[#4F8DFF] text-white rounded-lg hover:bg-[#3A7AE8] text-sm font-medium transition-colors">
              Go to Portal Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
