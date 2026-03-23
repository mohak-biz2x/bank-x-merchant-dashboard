import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Building2, X, FileText, Upload, CheckCircle, ArrowLeft, Check, Info, Pencil, Trash2, Plus, UserCheck, ReceiptText, Mail, Phone, Loader2, Search, LogOut, Settings } from "lucide-react";

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
    countryOfIncorporation: "United Arab Emirates",
    sector: "Manufacturing",
    industry: "Industrial Equipment",
    contactFullName: "Ahmed Al Mansouri",
    email: "ahmed@almasraf.ae",
    mobileNumber: "+971 50 987 6543",
  });

  // Step 2: Company Information state
  const [crNumber, setCrNumber] = useState("CR-2024-78432");
  const [crLookupDone, setCrLookupDone] = useState(false);
  const [crLoading, setCrLoading] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({
    legalBusinessName: "",
    tradeLicenseNumber: "",
    businessType: "",
    industrySector: "",
    activityType: "",
    registeredAddress: "",
    city: "",
    emirate: "",
    pincode: "",
    monthlyRevenue: "",
  });
  const [showCrTooltip, setShowCrTooltip] = useState(false);
  const [manualEntry, setManualEntry] = useState(false);

  // Step 4: Credit Check Consent state
  const [trnNumber, setTrnNumber] = useState("");
  const [creditCheckConsent, setCreditCheckConsent] = useState(false);

  // Step 3: Shareholding state
  const [shareholders, setShareholders] = useState([
    { id: 1, name: "Ahmed Al Mansouri", nationality: "UAE", emiratesId: "784-1990-1234567-1", ownershipPercent: "60", type: "direct" as "direct" | "ubo", residency: "resident" as "resident" | "non-resident", gender: "male" as "male" | "female", emiratesIdIssueDate: "2022-03-15", passportNumber: "" },
    { id: 2, name: "Fatima Al Hashimi", nationality: "UAE", emiratesId: "784-1985-9876543-2", ownershipPercent: "25", type: "direct" as "direct" | "ubo", residency: "resident" as "resident" | "non-resident", gender: "female" as "male" | "female", emiratesIdIssueDate: "2021-07-20", passportNumber: "" },
    { id: 3, name: "Omar Al Suwaidi", nationality: "UAE", emiratesId: "784-1992-3344556-3", ownershipPercent: "15", type: "direct" as "direct" | "ubo", residency: "resident" as "resident" | "non-resident", gender: "male" as "male" | "female", emiratesIdIssueDate: "2023-01-10", passportNumber: "" },
    { id: 4, name: "Khalid Al Maktoum", nationality: "UAE", emiratesId: "784-1978-5551234-0", ownershipPercent: "15", type: "ubo" as "direct" | "ubo", residency: "non-resident" as "resident" | "non-resident", gender: "male" as "male" | "female", emiratesIdIssueDate: "", passportNumber: "P1234567" },
  ]);
  const [selectedDirectorIds, setSelectedDirectorIds] = useState<string[]>(["sh-1", "sh-4"]);
  const [additionalDirectors, setAdditionalDirectors] = useState([
    { id: 1, name: "Sara Al Nuaimi", nationality: "UAE", emiratesId: "784-1982-3334567-5" },
  ]);
  const [selectedSignatoryId, setSelectedSignatoryId] = useState<string>("sh-1");
  const [showAddDirector, setShowAddDirector] = useState(false);
  const [newDirector, setNewDirector] = useState({ name: "", nationality: "UAE", emiratesId: "" });
  const [showAddSignatory, setShowAddSignatory] = useState(false);
  const [customSignatory, setCustomSignatory] = useState({ name: "", nationality: "UAE", emiratesId: "", designation: "" });

  // Shareholding edit state
  const [editingShareholderId, setEditingShareholderId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: "", nationality: "", emiratesId: "", ownershipPercent: "", type: "direct" as "direct" | "ubo", residency: "resident" as "resident" | "non-resident", gender: "male" as "male" | "female", emiratesIdIssueDate: "", passportNumber: "" });
  const [showAddShareholder, setShowAddShareholder] = useState(false);
  const [newShareholder, setNewShareholder] = useState({ name: "", nationality: "UAE", emiratesId: "", ownershipPercent: "", type: "direct" as "direct" | "ubo", residency: "resident" as "resident" | "non-resident", gender: "male" as "male" | "female", emiratesIdIssueDate: "", passportNumber: "" });
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [primaryOwnerId, setPrimaryOwnerId] = useState<number | null>(1);

  // Business Documents state
  const [kybDocs, setKybDocs] = useState<{ tradeLicense: File | null; moaAoa: File | null; trnCertificate: File | null; lastSixInvoices: File | null; auditedPnl: File | null }>({ tradeLicense: null, moaAoa: null, trnCertificate: null, lastSixInvoices: null, auditedPnl: null });

  // KYC Documents state
  const [kycDocs, setKycDocs] = useState<Record<string, { emiratesId: File | null; passport: File | null }>>({});

  // Bank Statements state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [uploadedStatements, setUploadedStatements] = useState<BankStatement[]>([
    { id: 'bs1', fileName: 'Emirates_NBD_Statement_Jan2025.pdf', bankName: 'Emirates NBD', accountNumber: '****5678', period: 'Jan 2025 - Feb 2025', uploadDate: new Date('2025-02-15'), fileSize: '2.4 MB' },
    { id: 'bs2', fileName: 'ADCB_Statement_Nov2024.pdf', bankName: 'ADCB', accountNumber: '****9012', period: 'Nov 2024 - Dec 2024', uploadDate: new Date('2025-01-10'), fileSize: '3.1 MB' },
  ]);
  const [connectStep, setConnectStep] = useState<'bank-select' | 'auth' | 'success'>('bank-select');
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);

  // Review & Submit state
  const [acceptedAgreements, setAcceptedAgreements] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<"receivable" | "payable" | null>(null);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const otpModalRef = useRef<HTMLDivElement>(null);

  const steps = [
    { id: 1, name: "Profile Creation" },
    { id: 2, name: "Loan Product" },
    { id: 3, name: "Company Information" },
    { id: 4, name: "Business Documents" },
    { id: 5, name: "Bank Statements" },
    { id: 6, name: "Shareholding" },
    { id: 7, name: "Directors & Signatories" },
    { id: 8, name: "KYC Documents" },
    { id: 9, name: "Review & Submit" },
  ];

  const getEffectiveType = (s: { ownershipPercent: string; type: "direct" | "ubo" }) => {
    if (s.type === "direct" && parseFloat(s.ownershipPercent) >= 25) return "Direct & UBO";
    return s.type === "direct" ? "Direct" : "UBO";
  };

  // CR Number lookup
  const lookupCrNumber = () => {
    setCrLoading(true);
    setTimeout(() => {
      setCompanyInfo({
        legalBusinessName: "Al Masraf Industries LLC",
        tradeLicenseNumber: "TL-345678",
        businessType: "Limited Liability Company (LLC)",
        industrySector: "Manufacturing - Industrial Equipment",
        activityType: "Manufacturing & Trading of Industrial Machinery",
        registeredAddress: "Office 1204, Al Shafar Tower, Tecom",
        city: "Dubai",
        emirate: "Dubai",
        pincode: "500001",
        monthlyRevenue: "2,450,000",
      });
      setCrLookupDone(true);
      setCrLoading(false);
    }, 1500);
  };

  // OTP handlers
  const handleOtpChange = (type: "email" | "mobile", index: number, value: string) => {
    if (value.length > 1) return;
    const arr = type === "email" ? [...emailOtp] : [...mobileOtp];
    arr[index] = value;
    if (type === "email") setEmailOtp(arr);
    else setMobileOtp(arr);
    if (value && index < 5) {
      const next = document.getElementById(`${type}-otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleOtpKeyDown = (type: "email" | "mobile", index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      const arr = type === "email" ? [...emailOtp] : [...mobileOtp];
      if (!arr[index] && index > 0) {
        const prev = document.getElementById(`${type}-otp-${index - 1}`);
        prev?.focus();
      }
    }
  };

  const verifyEmailOtp = () => {
    setVerifyingEmail(true);
    setTimeout(() => { setVerifyingEmail(false); setEmailVerified(true); }, 1200);
  };

  const resendEmailOtp = () => {
    setEmailOtp(["", "", "", "", "", ""]);
    setEmailResendTimer(30);
  };

  const verifyMobileOtp = () => {
    setVerifyingMobile(true);
    setTimeout(() => { setVerifyingMobile(false); setMobileVerified(true); }, 1200);
  };

  const resendMobileOtp = () => {
    setMobileOtp(["", "", "", "", "", ""]);
    setMobileResendTimer(30);
  };

  const handleOtpComplete = () => { setProfileCreated(true); setProfileRedirectTimer(10); };

  // Resend OTP countdown timers
  useEffect(() => {
    if (emailResendTimer > 0 && !emailVerified) {
      const t = setTimeout(() => setEmailResendTimer(emailResendTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [emailResendTimer, emailVerified]);

  useEffect(() => {
    if (mobileResendTimer > 0 && !mobileVerified) {
      const t = setTimeout(() => setMobileResendTimer(mobileResendTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [mobileResendTimer, mobileVerified]);

  // Auto-redirect after profile creation
  useEffect(() => {
    if (profileCreated && profileRedirectTimer > 0) {
      const t = setTimeout(() => setProfileRedirectTimer(profileRedirectTimer - 1), 1000);
      return () => clearTimeout(t);
    }
    if (profileCreated && profileRedirectTimer === 0) {
      handleProfileSuccessContinue();
    }
  }, [profileCreated, profileRedirectTimer]);

  // Close profile menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileSuccessContinue = () => {
    setShowOtpModal(false);
    setProfileCreated(false);
    setCurrentStep(2);
  };

  const handleNext = () => {
    if (currentStep === 1) { setShowOtpModal(true); return; }
    if (currentStep === 2 && !selectedProduct) return;
    if (currentStep === 9) { if (acceptedAgreements && creditCheckConsent) { localStorage.setItem("merchant_underwriting_status", "pending"); localStorage.setItem("selected_product", selectedProduct || "receivable"); window.dispatchEvent(new Event("demo-role-change")); navigate('/'); return; } }
    else if (currentStep < steps.length) { setCurrentStep(currentStep + 1); }
  };

  const handleBack = () => {
    if (currentStep > 2) setCurrentStep(currentStep - 1);
  };

  // Bank Statement handlers
  const handleBankStatementUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newStatements: BankStatement[] = Array.from(files).map((f, i) => ({
      id: `bs-${Date.now()}-${i}`,
      fileName: f.name,
      fileSize: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadDate: new Date(),
    }));
    setUploadedStatements([...uploadedStatements, ...newStatements]);
    setShowUploadModal(false);
  };

  const removeBankStatement = (id: string) => {
    setUploadedStatements(uploadedStatements.filter(s => s.id !== id));
  };

  const handleBankSelect = (bank: string) => { setSelectedBank(bank); };

  const handleConnectBank = () => { setConnectStep('auth'); };

  const handleAuthenticate = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setConnectStep('success');
      const newStatement: BankStatement = {
        id: `bs-${Date.now()}`,
        fileName: `${selectedBank}_Connected_Statement.pdf`,
        bankName: selectedBank,
        accountNumber: '****' + Math.floor(1000 + Math.random() * 9000),
        period: 'Auto-fetched',
        uploadDate: new Date(),
        fileSize: 'Connected',
      };
      setUploadedStatements([...uploadedStatements, newStatement]);
    }, 2000);
  };

  const closeConnectModal = () => {
    setShowConnectModal(false);
    setConnectStep('bank-select');
    setSelectedBank('');
  };

  // Shareholding handlers
  const startEdit = (sh: typeof shareholders[0]) => {
    setEditingShareholderId(sh.id);
    setEditForm({ name: sh.name, nationality: sh.nationality, emiratesId: sh.emiratesId, ownershipPercent: sh.ownershipPercent, type: sh.type, residency: sh.residency, gender: sh.gender, emiratesIdIssueDate: sh.emiratesIdIssueDate, passportNumber: sh.passportNumber });
    setDeleteConfirmId(null);
  };

  const saveEdit = () => {
    if (!editForm.name.trim() || editingShareholderId === null) return;
    setShareholders(shareholders.map(s => s.id === editingShareholderId ? { ...s, ...editForm } : s));
    setEditingShareholderId(null);
  };

  const confirmDelete = (id: number) => { setDeleteConfirmId(deleteConfirmId === id ? null : id); };

  const doDelete = (id: number) => {
    setShareholders(shareholders.filter(s => s.id !== id));
    setDeleteConfirmId(null);
  };

  const addShareholder = () => {
    if (!newShareholder.name.trim()) return;
    setShareholders([...shareholders, { ...newShareholder, id: Date.now() }]);
    setNewShareholder({ name: "", nationality: "UAE", emiratesId: "", ownershipPercent: "", type: "direct" as "direct" | "ubo", residency: "resident" as "resident" | "non-resident", gender: "male" as "male" | "female", emiratesIdIssueDate: "", passportNumber: "" });
    setShowAddShareholder(false);
  };

  // Directors & Signatories helpers
  const directorPool = [...shareholders.map(s => ({ id: `sh-${s.id}`, name: s.name, nationality: s.nationality, emiratesId: s.emiratesId })), ...additionalDirectors.map(d => ({ id: `ad-${d.id}`, name: d.name, nationality: d.nationality, emiratesId: d.emiratesId }))];
  const signatoryPool = [...shareholders.map(s => ({ id: `sh-${s.id}`, name: s.name, nationality: s.nationality, emiratesId: s.emiratesId, designation: getEffectiveType(s) })), ...additionalDirectors.map(d => ({ id: `ad-${d.id}`, name: d.name, nationality: d.nationality, emiratesId: d.emiratesId, designation: "Director" }))];

  const toggleDirector = (id: string) => {
    setSelectedDirectorIds(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);
  };

  const addAdditionalDirector = () => {
    if (!newDirector.name.trim()) return;
    setAdditionalDirectors([...additionalDirectors, { ...newDirector, id: Date.now() }]);
    setNewDirector({ name: "", nationality: "UAE", emiratesId: "" });
    setShowAddDirector(false);
  };

  const removeAdditionalDirector = (id: number) => {
    const dirId = `ad-${id}`;
    setAdditionalDirectors(additionalDirectors.filter(d => d.id !== id));
    setSelectedDirectorIds(prev => prev.filter(d => d !== dirId));
    if (selectedSignatoryId === dirId) setSelectedSignatoryId("");
  };

  const addCustomSignatory = () => {
    if (!customSignatory.name.trim()) return;
    const newId = Date.now();
    setAdditionalDirectors([...additionalDirectors, { id: newId, name: customSignatory.name, nationality: customSignatory.nationality, emiratesId: customSignatory.emiratesId }]);
    setSelectedSignatoryId(`ad-${newId}`);
    setCustomSignatory({ name: "", nationality: "UAE", emiratesId: "", designation: "" });
    setShowAddSignatory(false);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return renderProfileCreation();
      case 2: return renderLoanProduct();
      case 3: return renderCompanyInformation();
      case 4: return renderBusinessDocuments();
      case 5: return renderBankStatements();
      case 6: return renderShareholding();
      case 7: return renderDirectorsSignatories();
      case 8: return renderKycDocuments();
      case 9: return renderReviewSubmit();
      default: return null;
    }
  };

  const renderProfileCreation = () => (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <span className="w-1 h-7 bg-blue-600 rounded-full inline-block"></span>
        <h2 className="text-3xl font-semibold text-gray-900">Profile Creation</h2>
      </div>
      <p className="text-sm text-gray-500 mb-6 ml-4">Enter your company details to get started</p>

      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Company Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Company Legal Name</label>
              <input type="text" value={profileData.companyLegalName} onChange={(e) => setProfileData({ ...profileData, companyLegalName: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Country of Incorporation</label>
              <select value={profileData.countryOfIncorporation} onChange={(e) => setProfileData({ ...profileData, countryOfIncorporation: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm">
                <option value="United Arab Emirates">United Arab Emirates</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="Bahrain">Bahrain</option>
                <option value="Qatar">Qatar</option>
                <option value="Oman">Oman</option>
                <option value="Kuwait">Kuwait</option>
                <option value="India">India</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="United States">United States</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Contact Details</h3>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Contact Full Name</label>
            <input type="text" value={profileData.contactFullName} onChange={(e) => setProfileData({ ...profileData, contactFullName: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
              <input type="email" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Mobile Number</label>
              <input type="tel" value={profileData.mobileNumber} onChange={(e) => setProfileData({ ...profileData, mobileNumber: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLoanProduct = () => (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <div className="w-1 h-7 bg-blue-600 rounded-full"></div>
        <h2 className="text-3xl font-semibold text-gray-900">Select a Loan Product</h2>
      </div>
      <p className="text-sm text-gray-500 mb-8 ml-4">Select loan options without commitment. Our specialists will follow up after application submission.</p>

      <div className="flex justify-center">
        <div className="grid grid-cols-2 gap-6 max-w-lg w-full">
          {/* Receivable Invoice Financing */}
          <button
            onClick={() => setSelectedProduct("receivable")}
            className={`relative bg-white border rounded-xl px-5 pt-6 pb-5 transition-all text-center ${
              selectedProduct === "receivable"
                ? "border-blue-600 ring-2 ring-blue-100"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="absolute top-3 right-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedProduct === "receivable" ? "border-blue-600" : "border-gray-300"
              }`}>
                {selectedProduct === "receivable" && <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>}
              </div>
            </div>
            <div className="flex justify-center mb-4">
              <svg width="80" height="64" viewBox="0 0 80 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="12" width="40" height="44" rx="3" fill="#E8F0FE" stroke="#93B4F5" strokeWidth="1.5"/>
                <rect x="14" y="20" width="20" height="2" rx="1" fill="#93B4F5"/>
                <rect x="14" y="26" width="28" height="2" rx="1" fill="#C4D7F9"/>
                <rect x="14" y="32" width="24" height="2" rx="1" fill="#C4D7F9"/>
                <rect x="14" y="38" width="16" height="2" rx="1" fill="#C4D7F9"/>
                <rect x="14" y="44" width="20" height="2" rx="1" fill="#C4D7F9"/>
                <circle cx="58" cy="20" r="14" fill="#D1FAE5" stroke="#6EE7B7" strokeWidth="1.5"/>
                <path d="M52 20h12M58 14v12" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
                <path d="M54 17l2-2 2 2" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="48" y="38" width="24" height="14" rx="3" fill="#FEF3C7" stroke="#FCD34D" strokeWidth="1.5"/>
                <rect x="52" y="42" width="10" height="2" rx="1" fill="#F59E0B"/>
                <rect x="52" y="46" width="16" height="2" rx="1" fill="#FCD34D"/>
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">Receivable Invoice Financing</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Get early payment on your outstanding invoices to improve cash flow.
            </p>
          </button>

          {/* Payable Invoice Financing */}
          <button
            onClick={() => setSelectedProduct("payable")}
            className={`relative bg-white border rounded-xl px-5 pt-6 pb-5 transition-all text-center ${
              selectedProduct === "payable"
                ? "border-blue-600 ring-2 ring-blue-100"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="absolute top-3 right-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedProduct === "payable" ? "border-blue-600" : "border-gray-300"
              }`}>
                {selectedProduct === "payable" && <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>}
              </div>
            </div>
            <div className="flex justify-center mb-4">
              <svg width="80" height="64" viewBox="0 0 80 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="16" y="8" width="48" height="32" rx="4" fill="#E0F2FE" stroke="#7DD3FC" strokeWidth="1.5"/>
                <rect x="22" y="16" width="20" height="3" rx="1.5" fill="#7DD3FC"/>
                <rect x="22" y="22" width="14" height="2" rx="1" fill="#BAE6FD"/>
                <rect x="22" y="28" width="18" height="2" rx="1" fill="#BAE6FD"/>
                <circle cx="54" cy="22" r="8" fill="#D1FAE5" stroke="#6EE7B7" strokeWidth="1.5"/>
                <text x="54" y="26" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#10B981">$</text>
                <rect x="12" y="44" width="56" height="14" rx="3" fill="#F3E8FF" stroke="#C4B5FD" strokeWidth="1.5"/>
                <rect x="18" y="48" width="24" height="2" rx="1" fill="#A78BFA"/>
                <rect x="18" y="52" width="16" height="2" rx="1" fill="#C4B5FD"/>
                <path d="M56 44v-4M56 40l-3 3M56 40l3 3" stroke="#7DD3FC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">Payable Invoice Financing</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Extend payment terms with suppliers while they get paid early.
            </p>
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-10 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-400 leading-relaxed">
          This financing application is for business purposes only. Financing for personal, family, and/or household purposes is prohibited under business credit lines.
        </p>
        <p className="text-xs text-gray-400 leading-relaxed mt-1 uppercase font-medium">
          Credit approval is subject to verification of information and may require receipt of additional documentation at the sole discretion of Bank X.
        </p>
      </div>
    </div>
  );

  const renderCompanyInformation = () => (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <span className="w-1 h-7 bg-blue-600 rounded-full inline-block"></span>
        <h2 className="text-3xl font-semibold text-gray-900">Company Information</h2>
      </div>
      <p className="text-sm text-gray-500 mb-6 ml-4">Verify your company details by looking up your commercial register number</p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            {manualEntry ? "Enter your company details manually in the fields below." : "We will fetch your company details from the official commercial register. The fields below will be auto-populated once verified."}
          </p>
        </div>
      </div>

      {!manualEntry ? (
        <>
          <div className="bg-white border border-gray-200 rounded-lg p-5 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <label className="text-sm font-medium text-gray-700">Commercial Register Serial Number (CR Number / License Number)</label>
              <div className="relative">
                <button onMouseEnter={() => setShowCrTooltip(true)} onMouseLeave={() => setShowCrTooltip(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Info className="w-4 h-4" />
                </button>
                {showCrTooltip && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-10">
                    <p className="mb-1 font-medium">Where to find your CR Number:</p>
                    <ul className="space-y-1 text-gray-300">
                      <li>- On your Trade License issued by DED</li>
                      <li>- On the Ministry of Economy portal</li>
                      <li>- On your Commercial Registration certificate</li>
                      <li>- Format: CR-YYYY-XXXXX or numeric</li>
                    </ul>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-gray-900"></div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <input type="text" value={crNumber} onChange={(e) => { setCrNumber(e.target.value); setCrLookupDone(false); }} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm" placeholder="e.g. CR-2024-78432" />
              <button onClick={lookupCrNumber} disabled={!crNumber.trim() || crLoading} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap flex items-center gap-2">
                {crLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                {crLoading ? "Fetching..." : "Fetch Details"}
              </button>
            </div>
          </div>
          <div className="mb-6">
            {!crLookupDone && (
              <button onClick={() => setManualEntry(true)} className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                Can't find CR Number? Enter details manually
              </button>
            )}
          </div>
          {crLookupDone && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700 font-medium">Company details verified and populated from commercial register</span>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Business Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-medium text-gray-500 mb-1">Legal Business Name</label><input type="text" value={companyInfo.legalBusinessName} readOnly className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 text-sm" /></div>
                  <div><label className="block text-xs font-medium text-gray-500 mb-1">Trade License Number</label><input type="text" value={companyInfo.tradeLicenseNumber} readOnly className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 text-sm" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-medium text-gray-500 mb-1">Business Type</label><input type="text" value={companyInfo.businessType} readOnly className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 text-sm" /></div>
                  <div><label className="block text-xs font-medium text-gray-500 mb-1">Industry / Sector</label><input type="text" value={companyInfo.industrySector} readOnly className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 text-sm" /></div>
                </div>
                <div><label className="block text-xs font-medium text-gray-500 mb-1">Activity Type</label><input type="text" value={companyInfo.activityType} readOnly className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 text-sm" /></div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Registered Address</h3>
                <div><label className="block text-xs font-medium text-gray-500 mb-1">Registered Business Address</label><input type="text" value={companyInfo.registeredAddress} readOnly className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 text-sm" /></div>
                <div className="grid grid-cols-3 gap-4">
                  <div><label className="block text-xs font-medium text-gray-500 mb-1">City</label><input type="text" value={companyInfo.city} readOnly className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 text-sm" /></div>
                  <div><label className="block text-xs font-medium text-gray-500 mb-1">Emirate</label><input type="text" value={companyInfo.emirate} readOnly className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 text-sm" /></div>
                  <div><label className="block text-xs font-medium text-gray-500 mb-1">Pincode</label><input type="text" value={companyInfo.pincode} readOnly className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 text-sm" /></div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Financial Information</h3>
                <div><label className="block text-xs font-medium text-gray-500 mb-1">Monthly Revenue (AED)</label><input type="text" value={companyInfo.monthlyRevenue} readOnly className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 text-sm" /></div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Tax Information</h3>
                <div><label className="block text-xs font-medium text-gray-500 mb-1">TRN Number (Tax Registration Number)</label><input type="text" value={trnNumber} onChange={(e) => setTrnNumber(e.target.value)} placeholder="Enter TRN Number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm" /></div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="mb-4">
            <button onClick={() => setManualEntry(false)} className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors">← Back to CR Number lookup</button>
          </div>
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Business Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-gray-500 mb-1">Legal Business Name</label><input type="text" value={companyInfo.legalBusinessName} onChange={(e) => setCompanyInfo({ ...companyInfo, legalBusinessName: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm" /></div>
                <div><label className="block text-xs font-medium text-gray-500 mb-1">Trade License Number</label><input type="text" value={companyInfo.tradeLicenseNumber} onChange={(e) => setCompanyInfo({ ...companyInfo, tradeLicenseNumber: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-gray-500 mb-1">Business Type</label>
                  <select value={companyInfo.businessType} onChange={(e) => setCompanyInfo({ ...companyInfo, businessType: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm">
                    <option value="">Select Business Type</option><option value="Limited Liability Company (LLC)">Limited Liability Company (LLC)</option><option value="Sole Proprietorship">Sole Proprietorship</option><option value="Partnership">Partnership</option><option value="Free Zone Company">Free Zone Company</option><option value="Branch of Foreign Company">Branch of Foreign Company</option>
                  </select>
                </div>
                <div><label className="block text-xs font-medium text-gray-500 mb-1">Industry / Sector</label>
                  <select value={companyInfo.industrySector} onChange={(e) => setCompanyInfo({ ...companyInfo, industrySector: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm">
                    <option value="">Select Industry / Sector</option><option value="Manufacturing - Industrial Equipment">Manufacturing - Industrial Equipment</option><option value="Manufacturing - Textiles">Manufacturing - Textiles</option><option value="Trading - General">Trading - General</option><option value="Services - IT & Technology">Services - IT & Technology</option><option value="Construction">Construction</option><option value="Retail">Retail</option><option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Activity Type</label><input type="text" value={companyInfo.activityType} onChange={(e) => setCompanyInfo({ ...companyInfo, activityType: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm" /></div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Registered Address</h3>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Registered Business Address</label><input type="text" value={companyInfo.registeredAddress} onChange={(e) => setCompanyInfo({ ...companyInfo, registeredAddress: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm" /></div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="block text-xs font-medium text-gray-500 mb-1">City</label><input type="text" value={companyInfo.city} onChange={(e) => setCompanyInfo({ ...companyInfo, city: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm" /></div>
                <div><label className="block text-xs font-medium text-gray-500 mb-1">Emirate</label><input type="text" value={companyInfo.emirate} onChange={(e) => setCompanyInfo({ ...companyInfo, emirate: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm" /></div>
                <div><label className="block text-xs font-medium text-gray-500 mb-1">Pincode</label><input type="text" value={companyInfo.pincode} onChange={(e) => setCompanyInfo({ ...companyInfo, pincode: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm" /></div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Financial Information</h3>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Monthly Revenue (AED)</label><input type="text" value={companyInfo.monthlyRevenue} onChange={(e) => setCompanyInfo({ ...companyInfo, monthlyRevenue: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm" /></div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Tax Information</h3>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">TRN Number (Tax Registration Number)</label><input type="text" value={trnNumber} onChange={(e) => setTrnNumber(e.target.value)} placeholder="Enter TRN Number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm" /></div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderShareholding = () => (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <span className="w-1 h-7 bg-blue-600 rounded-full inline-block"></span>
        <h2 className="text-3xl font-semibold text-gray-900">Shareholding</h2>
      </div>
      <p className="text-sm text-gray-500 mb-6 ml-4">Add all direct shareholders and Ultimate Beneficial Owners (UBOs)</p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">Include all natural persons who are UBOs — even if they are not direct shareholders (e.g. they own shares through a holding company listed above).</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          Total Direct: {shareholders.filter(s => s.type === "direct").reduce((sum, s) => sum + (Number(s.ownershipPercent) || 0), 0)}%
        </span>
      </div>

      <div className="space-y-3 mb-3">
        {shareholders.map((sh) => {
          const effectiveType = getEffectiveType(sh);
          if (editingShareholderId === sh.id) {
            return (
              <div key={sh.id} className="bg-white border-2 border-blue-300 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label><input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" /></div>
                  <div><label className="block text-xs font-medium text-gray-600 mb-1">Gender</label>
                    <select value={editForm.gender} onChange={e => setEditForm({...editForm, gender: e.target.value as "male" | "female"})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"><option value="male">Male</option><option value="female">Female</option></select>
                  </div>
                  <div><label className="block text-xs font-medium text-gray-600 mb-1">Residency</label>
                    <select value={editForm.residency} onChange={e => { const r = e.target.value as "resident" | "non-resident"; setEditForm({...editForm, residency: r, nationality: r === "resident" ? "UAE" : editForm.nationality, emiratesId: r === "non-resident" ? "" : editForm.emiratesId, emiratesIdIssueDate: r === "non-resident" ? "" : editForm.emiratesIdIssueDate, passportNumber: r === "resident" ? "" : editForm.passportNumber}); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"><option value="resident">Resident</option><option value="non-resident">Non-Resident</option></select>
                  </div>
                  <div><label className="block text-xs font-medium text-gray-600 mb-1">Nationality</label><input value={editForm.nationality} disabled={editForm.residency === "resident"} onChange={e => setEditForm({...editForm, nationality: e.target.value})} className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 ${editForm.residency === "resident" ? "bg-gray-100 text-gray-500" : ""}`} /></div>
                  {editForm.residency === "resident" ? (
                    <>
                      <div><label className="block text-xs font-medium text-gray-600 mb-1">Emirates ID</label><input value={editForm.emiratesId} onChange={e => setEditForm({...editForm, emiratesId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" /></div>
                      <div><label className="block text-xs font-medium text-gray-600 mb-1">Emirates ID Issue Date</label><input type="date" value={editForm.emiratesIdIssueDate} onChange={e => setEditForm({...editForm, emiratesIdIssueDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" /></div>
                    </>
                  ) : (
                    <div><label className="block text-xs font-medium text-gray-600 mb-1">Passport Number</label><input value={editForm.passportNumber} onChange={e => setEditForm({...editForm, passportNumber: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" /></div>
                  )}
                  <div><label className="block text-xs font-medium text-gray-600 mb-1">Ownership %</label><input type="number" value={editForm.ownershipPercent} onChange={e => setEditForm({...editForm, ownershipPercent: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" /></div>
                </div>
                <div><label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                  <select value={editForm.type} onChange={e => setEditForm({...editForm, type: e.target.value as "direct" | "ubo"})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"><option value="direct">Direct Shareholder</option><option value="ubo">UBO</option></select>
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setEditingShareholderId(null)} className="px-4 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
                  <button onClick={saveEdit} className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">Save</button>
                </div>
              </div>
            );
          }
          return (
            <div key={sh.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-medium text-sm ${effectiveType === "Direct & UBO" ? "bg-purple-100 text-purple-700" : effectiveType === "UBO" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>
                  {sh.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{sh.name}</p>
                  <p className="text-xs text-gray-500">{sh.gender === "male" ? "Male" : "Female"} &middot; {sh.residency === "resident" ? "Resident" : "Non-Resident"} &middot; {sh.nationality} &middot; {sh.residency === "resident" ? sh.emiratesId : `Passport: ${sh.passportNumber || "—"}`}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${effectiveType === "Direct & UBO" ? "bg-purple-100 text-purple-700" : effectiveType === "UBO" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>{effectiveType}</span>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">{sh.ownershipPercent}%</span>
                <button onClick={() => startEdit(sh)} className="text-gray-400 hover:text-blue-500 transition-colors"><Pencil className="w-4 h-4" /></button>
                <div className="relative">
                  <button onClick={() => confirmDelete(sh.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  {deleteConfirmId === sh.id && (
                    <div className="absolute right-0 top-8 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-64">
                      <p className="text-sm text-gray-700 mb-3">Are you sure you want to remove <span className="font-medium">{sh.name}</span>?</p>
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => setDeleteConfirmId(null)} className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">Cancel</button>
                        <button onClick={() => doDelete(sh.id)} className="px-3 py-1.5 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors">Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!showAddShareholder ? (
        <button onClick={() => setShowAddShareholder(true)} className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors">
          <Plus className="w-4 h-4" /> Add Shareholder / UBO
        </button>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
          <h4 className="text-sm font-medium text-gray-900">New Shareholder / UBO</h4>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Full Name / Entity Name</label><input type="text" value={newShareholder.name} onChange={(e) => setNewShareholder({ ...newShareholder, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm" placeholder="Enter name" /></div>
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
              <select value={newShareholder.type} onChange={(e) => setNewShareholder({ ...newShareholder, type: e.target.value as "direct" | "ubo" })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"><option value="direct">Direct Shareholder</option><option value="ubo">UBO</option></select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Gender</label><select value={newShareholder.gender} onChange={(e) => setNewShareholder({ ...newShareholder, gender: e.target.value as "male" | "female" })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"><option value="male">Male</option><option value="female">Female</option></select></div>
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Residency</label><select value={newShareholder.residency} onChange={(e) => { const r = e.target.value as "resident" | "non-resident"; setNewShareholder({ ...newShareholder, residency: r, nationality: r === "resident" ? "UAE" : "", emiratesId: r === "non-resident" ? "" : newShareholder.emiratesId, emiratesIdIssueDate: r === "non-resident" ? "" : newShareholder.emiratesIdIssueDate, passportNumber: r === "resident" ? "" : newShareholder.passportNumber }); }} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"><option value="resident">Resident</option><option value="non-resident">Non-Resident</option></select></div>
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Ownership %</label><input type="text" value={newShareholder.ownershipPercent} onChange={(e) => setNewShareholder({ ...newShareholder, ownershipPercent: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm" placeholder="e.g. 25" /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Nationality / Country</label>
              {newShareholder.residency === "resident" ? <input type="text" value="UAE" disabled className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-500" /> : <select value={newShareholder.nationality} onChange={(e) => setNewShareholder({ ...newShareholder, nationality: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"><option value="">Select country</option><option value="Saudi Arabia">Saudi Arabia</option><option value="India">India</option><option value="United Kingdom">United Kingdom</option><option value="United States">United States</option><option value="Other">Other</option></select>}
            </div>
            {newShareholder.residency === "resident" ? (
              <>
                <div><label className="block text-xs font-medium text-gray-500 mb-1">Emirates ID</label><input type="text" value={newShareholder.emiratesId} onChange={(e) => setNewShareholder({ ...newShareholder, emiratesId: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm" placeholder="Enter Emirates ID" /></div>
                <div><label className="block text-xs font-medium text-gray-500 mb-1">Emirates ID Issue Date</label><input type="date" value={newShareholder.emiratesIdIssueDate} onChange={(e) => setNewShareholder({ ...newShareholder, emiratesIdIssueDate: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm" /></div>
              </>
            ) : (
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Passport Number</label><input type="text" value={newShareholder.passportNumber} onChange={(e) => setNewShareholder({ ...newShareholder, passportNumber: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm" placeholder="Enter passport number" /></div>
            )}
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={addShareholder} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">Add</button>
            <button onClick={() => { setShowAddShareholder(false); setNewShareholder({ name: "", nationality: "UAE", emiratesId: "", ownershipPercent: "", type: "direct" as "direct" | "ubo", residency: "resident" as "resident" | "non-resident", gender: "male" as "male" | "female", emiratesIdIssueDate: "", passportNumber: "" }); }} className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );

  const renderDirectorsSignatories = () => (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <span className="w-1 h-7 bg-blue-600 rounded-full inline-block"></span>
        <h2 className="text-3xl font-semibold text-gray-900">Directors & Authorized Signatories</h2>
      </div>
      <p className="text-sm text-gray-500 mb-6 ml-4">Select directors from existing shareholders and UBOs, and designate an authorized signatory</p>

      {/* Section 1: Directors */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Directors</h3>
        <p className="text-xs text-gray-500 mb-3">Select from shareholders and UBOs, or add a new director</p>

        <div className="space-y-2 mb-3">
          {shareholders.map((s) => {
            const key = `sh-${s.id}`;
            const checked = selectedDirectorIds.includes(key);
            const effectiveType = getEffectiveType(s);
            return (
              <label key={key} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${checked ? effectiveType === "Direct & UBO" ? "bg-purple-50 border-purple-300" : effectiveType === "UBO" ? "bg-amber-50 border-amber-300" : "bg-blue-50 border-blue-300" : "bg-white border-gray-200 hover:bg-gray-50"}`}>
                <input type="checkbox" checked={checked} onChange={() => toggleDirector(key)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-xs ${
                  effectiveType === "Direct & UBO" ? "bg-purple-100 text-purple-700" : effectiveType === "UBO" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                }`}>{s.name.charAt(0)}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{s.name}</p>
                  <p className="text-xs text-gray-500">{s.nationality} &middot; {s.ownershipPercent}% ownership</p>
                </div>
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  effectiveType === "Direct & UBO" ? "bg-purple-100 text-purple-700" : effectiveType === "UBO" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                }`}>{effectiveType === "Direct" ? "Shareholder" : effectiveType}</span>
              </label>
            );
          })}

          {additionalDirectors.map((d) => {
            const key = `ad-${d.id}`;
            const checked = selectedDirectorIds.includes(key);
            return (
              <div key={key} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${checked ? "bg-green-50 border-green-300" : "bg-white border-gray-200"}`}>
                <input type="checkbox" checked={checked} onChange={() => toggleDirector(key)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-medium text-xs">{d.name.charAt(0)}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{d.name}</p>
                  <p className="text-xs text-gray-500">{d.nationality} &middot; {d.emiratesId}</p>
                </div>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Added</span>
                <button onClick={() => removeAdditionalDirector(d.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {!showAddDirector ? (
          <button onClick={() => setShowAddDirector(true)} className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors">
            <Plus className="w-4 h-4" />
            Add New Director
          </button>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
            <h4 className="text-sm font-medium text-gray-900">New Director</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
                <input type="text" value={newDirector.name} onChange={(e) => setNewDirector({ ...newDirector, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm" placeholder="Enter name" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Nationality</label>
                <select value={newDirector.nationality} onChange={(e) => setNewDirector({ ...newDirector, nationality: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm">
                  <option value="UAE">UAE</option>
                  <option value="Saudi Arabia">Saudi Arabia</option>
                  <option value="India">India</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States">United States</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Emirates ID</label>
                <input type="text" value={newDirector.emiratesId} onChange={(e) => setNewDirector({ ...newDirector, emiratesId: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm" placeholder="Enter Emirates ID" />
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={addAdditionalDirector} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">Add</button>
              <button onClick={() => { setShowAddDirector(false); setNewDirector({ name: "", nationality: "UAE", emiratesId: "" }); }} className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* Section 2: Authorized Signatory */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Authorized Signatory</h3>
        <p className="text-xs text-gray-500 mb-3">Select the person authorized to sign on behalf of the company</p>

        <div className="space-y-2 mb-3">
          {signatoryPool.map((p) => (
            <label key={p.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${selectedSignatoryId === p.id ? "bg-purple-50 border-purple-300" : "bg-white border-gray-200 hover:bg-gray-50"}`}>
              <input type="radio" name="signatory" checked={selectedSignatoryId === p.id} onChange={() => { setSelectedSignatoryId(p.id); setShowAddSignatory(false); }} className="w-4 h-4 border-gray-300 text-purple-600 focus:ring-purple-500" />
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-medium text-xs">{p.name.charAt(0)}</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{p.name}</p>
              </div>
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{p.designation}</span>
              {selectedSignatoryId === p.id && <UserCheck className="w-4 h-4 text-purple-600" />}
            </label>
          ))}
        </div>

        {!showAddSignatory ? (
          <button onClick={() => { setShowAddSignatory(true); setSelectedSignatoryId(""); }} className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors">
            <Plus className="w-4 h-4" />
            Add Different Signatory
          </button>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
            <h4 className="text-sm font-medium text-gray-900">New Authorized Signatory</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
                <input type="text" value={customSignatory.name} onChange={(e) => setCustomSignatory({ ...customSignatory, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm" placeholder="Enter name" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Designation</label>
                <input type="text" value={customSignatory.designation} onChange={(e) => setCustomSignatory({ ...customSignatory, designation: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm" placeholder="e.g. CEO, CFO, Manager" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Nationality</label>
                <select value={customSignatory.nationality} onChange={(e) => setCustomSignatory({ ...customSignatory, nationality: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm">
                  <option value="UAE">UAE</option>
                  <option value="Saudi Arabia">Saudi Arabia</option>
                  <option value="India">India</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States">United States</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Emirates ID</label>
                <input type="text" value={customSignatory.emiratesId} onChange={(e) => setCustomSignatory({ ...customSignatory, emiratesId: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm" placeholder="Enter Emirates ID" />
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={addCustomSignatory} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">Add & Select</button>
              <button onClick={() => { setShowAddSignatory(false); if (!selectedSignatoryId) setSelectedSignatoryId("sh-1"); setCustomSignatory({ name: "", nationality: "UAE", emiratesId: "", designation: "" }); }} className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderBusinessDocuments = () => (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <span className="w-1 h-7 bg-blue-600 rounded-full inline-block"></span>
        <h2 className="text-3xl font-semibold text-gray-900">Business Documents</h2>
      </div>
      <p className="text-sm text-gray-500 mb-6 ml-4">Upload your company's business documents for verification</p>

      <div className="space-y-4">
        {[
          { key: 'tradeLicense' as const, label: 'Trade License', desc: 'Upload a valid copy of your trade license issued by DED', icon: FileText },
          { key: 'moaAoa' as const, label: 'MOA / AOA', desc: 'Memorandum and Articles of Association', icon: FileText },
          { key: 'trnCertificate' as const, label: 'TRN Certificate', desc: 'Tax Registration Number certificate from FTA', icon: ReceiptText },
          { key: 'lastSixInvoices' as const, label: 'Last 6 Invoices', desc: 'Upload your most recent 6 invoices for assessment', icon: ReceiptText },
        ].map(doc => (
          <div key={doc.key} className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <doc.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{doc.label}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{doc.desc}</p>
                </div>
              </div>
              {kybDocs[doc.key] ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-green-700 font-medium">{kybDocs[doc.key]!.name}</span>
                  <button onClick={() => setKybDocs({ ...kybDocs, [doc.key]: null })} className="text-gray-400 hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button>
                </div>
              ) : (
                <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm">
                  <Upload className="w-4 h-4" /> Upload
                  <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => { if (e.target.files?.[0]) setKybDocs({ ...kybDocs, [doc.key]: e.target.files[0] }); }} />
                </label>
              )}
            </div>
          </div>
        ))}

        {selectedProduct === "payable" && (
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Audited P&L Statement</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Required for Payable Invoice Financing applicants</p>
                </div>
              </div>
              {kybDocs.auditedPnl ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-green-700 font-medium">{kybDocs.auditedPnl.name}</span>
                  <button onClick={() => setKybDocs({ ...kybDocs, auditedPnl: null })} className="text-gray-400 hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button>
                </div>
              ) : (
                <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm">
                  <Upload className="w-4 h-4" /> Upload
                  <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => { if (e.target.files?.[0]) setKybDocs({ ...kybDocs, auditedPnl: e.target.files[0] }); }} />
                </label>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">Accepted formats: PDF, JPG, PNG. Maximum file size: 10MB per document.</p>
        </div>
      </div>
    </div>
  );

  const renderBankStatements = () => (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <span className="w-1 h-7 bg-blue-600 rounded-full inline-block"></span>
        <h2 className="text-3xl font-semibold text-gray-900">Bank Statements</h2>
      </div>
      <p className="text-sm text-gray-500 mb-6 ml-4">Upload or connect your bank statements for the last 6 months</p>

      {uploadedStatements.length > 0 && (
        <div className="space-y-3 mb-6">
          {uploadedStatements.map(stmt => (
            <div key={stmt.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{stmt.fileName}</p>
                  <p className="text-xs text-gray-500">
                    {stmt.bankName && `${stmt.bankName} · `}{stmt.period && `${stmt.period} · `}{stmt.fileSize}
                  </p>
                </div>
              </div>
              <button onClick={() => removeBankStatement(stmt.id)} className="text-gray-400 hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => setShowUploadModal(true)} className="flex flex-col items-center gap-3 p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
          <Upload className="w-8 h-8 text-gray-400" />
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">Upload Statements</p>
            <p className="text-xs text-gray-500 mt-1">PDF or CSV format</p>
          </div>
        </button>
        <button onClick={() => setShowConnectModal(true)} className="flex flex-col items-center gap-3 p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
          <Building2 className="w-8 h-8 text-gray-400" />
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">Connect Bank</p>
            <p className="text-xs text-gray-500 mt-1">Auto-fetch via Open Banking</p>
          </div>
        </button>
      </div>
    </div>
  );

  const renderKycDocuments = () => (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <span className="w-1 h-7 bg-blue-600 rounded-full inline-block"></span>
        <h2 className="text-3xl font-semibold text-gray-900">KYC Documents</h2>
      </div>
      <p className="text-sm text-gray-500 mb-6 ml-4">Upload identity documents for each shareholder</p>

      <div className="space-y-4">
        {shareholders.map((sh) => (
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
                      <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => { const f = e.target.files?.[0]; if (f) setKycDocs(prev => ({ ...prev, [`sh-${sh.id}`]: { ...prev[`sh-${sh.id}`] || { emiratesId: null, passport: null }, emiratesId: f } })); }} />
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
                      <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => { const f = e.target.files?.[0]; if (f) setKycDocs(prev => ({ ...prev, [`sh-${sh.id}`]: { ...prev[`sh-${sh.id}`] || { emiratesId: null, passport: null }, passport: f } })); }} />
                    </label>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReviewSubmit = () => (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <span className="w-1 h-7 bg-blue-600 rounded-full inline-block"></span>
        <h2 className="text-3xl font-semibold text-gray-900">Review & Submit</h2>
      </div>
      <p className="text-sm text-gray-500 mb-6 ml-4">Review all information before submitting your application</p>

      <div className="space-y-4">
        {/* Profile Creation Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Profile Creation</h3>
            <button onClick={() => setCurrentStep(1)} className="text-xs text-blue-600 hover:text-blue-800">Edit</button>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <div><span className="text-gray-500">Company Legal Name:</span> <span className="text-gray-900 ml-1">{profileData.companyLegalName}</span></div>
            <div><span className="text-gray-500">Country:</span> <span className="text-gray-900 ml-1">{profileData.countryOfIncorporation}</span></div>
            <div><span className="text-gray-500">Contact Name:</span> <span className="text-gray-900 ml-1">{profileData.contactFullName}</span></div>
            <div><span className="text-gray-500">Email:</span> <span className="text-gray-900 ml-1">{profileData.email}</span></div>
            <div><span className="text-gray-500">Mobile:</span> <span className="text-gray-900 ml-1">{profileData.mobileNumber}</span></div>
          </div>
        </div>

        {/* Company Information Summary */}
        {/* Loan Product */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Loan Product</h3>
            <button onClick={() => setCurrentStep(2)} className="text-xs text-blue-600 hover:text-blue-800">Edit</button>
          </div>
          <p className="text-sm text-gray-700">{selectedProduct === "receivable" ? "Receivable Invoice Financing" : selectedProduct === "payable" ? "Payable Invoice Financing" : "Not selected"}</p>
        </div>

        {/* Company Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Company Information</h3>
            <button onClick={() => setCurrentStep(3)} className="text-xs text-blue-600 hover:text-blue-800">Edit</button>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <div><span className="text-gray-500">CR Number:</span> <span className="text-gray-900 ml-1">{crNumber}</span></div>
            <div><span className="text-gray-500">Legal Business Name:</span> <span className="text-gray-900 ml-1">{companyInfo.legalBusinessName || "—"}</span></div>
            <div><span className="text-gray-500">Trade License:</span> <span className="text-gray-900 ml-1">{companyInfo.tradeLicenseNumber || "—"}</span></div>
            <div><span className="text-gray-500">Business Type:</span> <span className="text-gray-900 ml-1">{companyInfo.businessType || "—"}</span></div>
            <div><span className="text-gray-500">Industry:</span> <span className="text-gray-900 ml-1">{companyInfo.industrySector || "—"}</span></div>
            <div><span className="text-gray-500">City:</span> <span className="text-gray-900 ml-1">{companyInfo.city || "—"}, {companyInfo.emirate || "—"}</span></div>
            <div><span className="text-gray-500">TRN Number:</span> <span className="text-gray-900 ml-1">{trnNumber || "—"}</span></div>
          </div>
        </div>

        {/* Shareholding Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Shareholding</h3>
            <button onClick={() => setCurrentStep(6)} className="text-xs text-blue-600 hover:text-blue-800">Edit</button>
          </div>
          <div className="space-y-2">
            {shareholders.map(sh => (
              <div key={sh.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-900">{sh.name}</span>
                <span className="text-gray-500">{getEffectiveType(sh)} · {sh.ownershipPercent}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Directors & Signatories Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Directors & Signatories</h3>
            <button onClick={() => setCurrentStep(7)} className="text-xs text-blue-600 hover:text-blue-800">Edit</button>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-gray-500">Directors:</span>
              <span className="text-gray-900 ml-1">
                {directorPool.filter(d => selectedDirectorIds.includes(d.id)).map(d => d.name).join(", ") || "None selected"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Authorized Signatory:</span>
              <span className="text-gray-900 ml-1">
                {signatoryPool.find(p => p.id === selectedSignatoryId)?.name || "Not selected"}
              </span>
            </div>
          </div>
        </div>

        {/* KYC Documents Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">KYC Documents</h3>
            <button onClick={() => setCurrentStep(8)} className="text-xs text-blue-600 hover:text-blue-800">Edit</button>
          </div>
          <div className="space-y-2 text-sm">
            {shareholders.map((sh) => (
              <div key={sh.id} className="flex items-center justify-between">
                <span className="text-gray-700">{sh.name}</span>
                <div className="flex items-center gap-3">
                  {sh.residency === "resident" && (
                    <span className="flex items-center gap-1 text-xs">
                      {kycDocs[`sh-${sh.id}`]?.emiratesId ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <X className="w-3.5 h-3.5 text-gray-300" />}
                      EID
                    </span>
                  )}
                  {sh.residency === "non-resident" && (
                    <span className="flex items-center gap-1 text-xs">
                      {kycDocs[`sh-${sh.id}`]?.passport ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <X className="w-3.5 h-3.5 text-gray-300" />}
                      Passport
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Business Documents Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Business Documents</h3>
            <button onClick={() => setCurrentStep(4)} className="text-xs text-blue-600 hover:text-blue-800">Edit</button>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              {kybDocs.tradeLicense ? <CheckCircle className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-gray-300" />}
              <span className={kybDocs.tradeLicense ? 'text-gray-900' : 'text-gray-400'}>Trade License</span>
            </div>
            <div className="flex items-center gap-2">
              {kybDocs.moaAoa ? <CheckCircle className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-gray-300" />}
              <span className={kybDocs.moaAoa ? 'text-gray-900' : 'text-gray-400'}>MOA / AOA</span>
            </div>
            <div className="flex items-center gap-2">
              {kybDocs.trnCertificate ? <CheckCircle className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-gray-300" />}
              <span className={kybDocs.trnCertificate ? 'text-gray-900' : 'text-gray-400'}>TRN Certificate</span>
            </div>
            <div className="flex items-center gap-2">
              {kybDocs.lastSixInvoices ? <CheckCircle className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-gray-300" />}
              <span className={kybDocs.lastSixInvoices ? 'text-gray-900' : 'text-gray-400'}>Last 6 Invoices</span>
            </div>
            {selectedProduct === "payable" && (
              <div className="flex items-center gap-2">
                {kybDocs.auditedPnl ? <CheckCircle className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-gray-300" />}
                <span className={kybDocs.auditedPnl ? 'text-gray-900' : 'text-gray-400'}>Audited P&L Statement</span>
              </div>
            )}
          </div>
        </div>

        {/* Bank Statements Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Bank Statements</h3>
            <button onClick={() => setCurrentStep(5)} className="text-xs text-blue-600 hover:text-blue-800">Edit</button>
          </div>
          <p className="text-sm text-gray-700">{uploadedStatements.length} statement(s) uploaded</p>
        </div>

        {/* Agreements & Consents */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={creditCheckConsent} onChange={(e) => setCreditCheckConsent(e.target.checked)} className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <span className="text-sm text-gray-700">
              I hereby authorize <span className="font-medium">Bank X</span> to perform a credit check on my company using the Trade License / TRN number (<span className="font-medium">{trnNumber}</span>) provided. I understand that this check is necessary for the evaluation of my supply chain financing application and consent to the retrieval of my company's credit information from relevant credit bureaus in the UAE.
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={acceptedAgreements} onChange={(e) => setAcceptedAgreements(e.target.checked)} className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <span className="text-sm text-gray-700">
              I confirm that all information provided is accurate and complete. I agree to the{' '}
              <button onClick={() => setShowTermsModal(true)} className="text-blue-600 hover:underline">Terms and Conditions</button>{' '}and{' '}
              <button onClick={() => setShowPrivacyModal(true)} className="text-blue-600 hover:underline">Privacy Policy</button>.
            </span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b-2 border-blue-600 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Bank X</h1>
                <p className="text-xs text-gray-500">Supply Chain Finance</p>
              </div>
            </div>
            {currentStep > 1 && (
              <>
                <div className="h-8 w-px bg-gray-300"></div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-500" />
                  <p className="text-sm font-medium text-gray-900">{profileData.companyLegalName}</p>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{currentStep > 1 ? profileData.contactFullName : "New Merchant"}</p>
            </div>
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-medium transition-colors ${
                  currentStep > 1 ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 hover:bg-gray-500"
                }`}
              >
                {currentStep > 1 ? profileData.contactFullName.charAt(0) : "N"}
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <button
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                  >
                    <Settings className="w-4 h-4 text-gray-500" />
                    Account Settings
                  </button>
                  <div className="border-t border-gray-200 my-2"></div>
                  <button
                    onClick={() => { setShowProfileMenu(false); navigate('/login'); }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - hidden on Profile Creation (step 1) */}
        {currentStep > 1 && (
        <div className="w-72 bg-white border-r border-gray-200 p-6 overflow-y-auto">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Application Steps</h3>
          <div className="space-y-1">
            {steps.filter(s => s.id > 1).map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              const isClickable = step.id <= currentStep;
              const displayNumber = index + 1;
              return (
                <button
                  key={step.id}
                  onClick={() => { if (isClickable) setCurrentStep(step.id); }}
                  disabled={!isClickable}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                    isActive ? 'bg-blue-50 border-l-2 border-blue-600 text-blue-700' :
                    isCompleted ? 'text-gray-700 hover:bg-gray-50' :
                    'text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                    isActive ? 'bg-blue-600 text-white' :
                    isCompleted ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {isCompleted ? <Check className="w-3 h-3" /> : displayNumber}
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
            <div className="max-w-3xl mx-auto">
              {renderStepContent()}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-white border-t border-gray-200 px-8 py-4 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep <= 2}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm transition-colors ${
                currentStep <= 2 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="text-xs text-gray-400">{currentStep === 1 ? '' : `Step ${currentStep - 1} of ${steps.length - 1}`}</div>
            <button
              onClick={handleNext}
              disabled={(currentStep === 9 && !(acceptedAgreements && creditCheckConsent)) || (currentStep === 2 && !selectedProduct)}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentStep === 9
                  ? (acceptedAgreements && creditCheckConsent) ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : (currentStep === 2 && !selectedProduct) ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {currentStep === 9 ? 'Submit Application' : currentStep === 1 ? 'Create Profile' : 'Continue'}
            </button>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-gray-500/30 flex items-center justify-center z-50">
          <div ref={otpModalRef} className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            {!profileCreated ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Verify Your Identity</h3>
                  <button onClick={() => setShowOtpModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                </div>

                {/* Email OTP */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Email Verification</span>
                    {emailVerified && <CheckCircle className="w-4 h-4 text-green-500" />}
                  </div>
                  <p className="text-xs text-gray-500 mb-3">Enter the 6-digit code sent to {profileData.email}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      {emailOtp.map((digit, i) => (
                        <input key={i} id={`email-otp-${i}`} type="text" maxLength={1} value={digit}
                          onChange={(e) => handleOtpChange("email", i, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown("email", i, e)}
                          className={`w-10 h-10 text-center border rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent ${emailVerified ? 'border-green-300 bg-green-50 text-green-700' : 'border-gray-300'}`}
                          disabled={emailVerified}
                        />
                      ))}
                    </div>
                    {!emailVerified && (
                      <button onClick={verifyEmailOtp} disabled={verifyingEmail} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm disabled:opacity-50 flex items-center gap-2">
                        {verifyingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        {verifyingEmail ? 'Verifying...' : 'Verify'}
                      </button>
                    )}
                  </div>
                  {!emailVerified && (
                    <div className="mt-2">
                      {emailResendTimer > 0 ? (
                        <p className="text-xs text-gray-400">Resend code in {emailResendTimer}s</p>
                      ) : (
                        <button onClick={resendEmailOtp} className="text-xs text-blue-600 hover:text-blue-700 font-medium">Resend Code</button>
                      )}
                    </div>
                  )}
                </div>

                {/* Mobile OTP */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Mobile Verification</span>
                    {mobileVerified && <CheckCircle className="w-4 h-4 text-green-500" />}
                  </div>
                  <p className="text-xs text-gray-500 mb-3">Enter the 6-digit code sent to {profileData.mobileNumber}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      {mobileOtp.map((digit, i) => (
                        <input key={i} id={`mobile-otp-${i}`} type="text" maxLength={1} value={digit}
                          onChange={(e) => handleOtpChange("mobile", i, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown("mobile", i, e)}
                          className={`w-10 h-10 text-center border rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent ${mobileVerified ? 'border-green-300 bg-green-50 text-green-700' : 'border-gray-300'}`}
                          disabled={mobileVerified}
                        />
                      ))}
                    </div>
                    {!mobileVerified && (
                      <button onClick={verifyMobileOtp} disabled={verifyingMobile} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm disabled:opacity-50 flex items-center gap-2">
                        {verifyingMobile ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        {verifyingMobile ? 'Verifying...' : 'Verify'}
                      </button>
                    )}
                  </div>
                  {!mobileVerified && (
                    <div className="mt-2">
                      {mobileResendTimer > 0 ? (
                        <p className="text-xs text-gray-400">Resend code in {mobileResendTimer}s</p>
                      ) : (
                        <button onClick={resendMobileOtp} className="text-xs text-blue-600 hover:text-blue-700 font-medium">Resend Code</button>
                      )}
                    </div>
                  )}
                </div>

                <button onClick={handleOtpComplete} disabled={!emailVerified || !mobileVerified} className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  Complete Verification
                </button>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Created Successfully</h3>
                <p className="text-sm text-gray-500 mb-4">Your identity has been verified and your profile has been created.</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                  <div className="flex items-start gap-2">
                    <Mail className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-800">We have sent you a welcome email at <span className="font-medium">{profileData.email}</span> with a temporary password to access your account.</p>
                  </div>
                </div>
                <button onClick={handleProfileSuccessContinue} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors">
                  Continue
                </button>
                <p className="text-xs text-gray-400 mt-3">Auto-redirecting in {profileRedirectTimer}s</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Bank Statements Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-500/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Upload Bank Statements</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-1">Drag and drop your bank statements here</p>
              <p className="text-xs text-gray-400 mb-4">PDF or CSV format, max 10MB per file</p>
              <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer text-sm">
                <Upload className="w-4 h-4" /> Browse Files
                <input type="file" className="hidden" accept=".pdf,.csv" multiple onChange={handleBankStatementUpload} />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Connect Bank Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-gray-500/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {connectStep === 'bank-select' ? 'Select Your Bank' : connectStep === 'auth' ? 'Authenticate' : 'Connected'}
              </h3>
              <button onClick={closeConnectModal} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>

            {connectStep === 'bank-select' && (
              <div className="space-y-2">
                {['Emirates NBD', 'ADCB', 'FAB', 'Mashreq', 'DIB', 'RAKBANK'].map(bank => (
                  <button key={bank} onClick={() => handleBankSelect(bank)}
                    className={`w-full flex items-center gap-3 px-4 py-3 border rounded-lg text-left transition-colors ${selectedBank === bank ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{bank}</span>
                    {selectedBank === bank && <CheckCircle className="w-4 h-4 text-blue-600 ml-auto" />}
                  </button>
                ))}
                <button onClick={handleConnectBank} disabled={!selectedBank} className="w-full mt-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50 transition-colors">
                  Connect to {selectedBank || 'Bank'}
                </button>
              </div>
            )}

            {connectStep === 'auth' && (
              <div className="text-center py-6">
                {isConnecting ? (
                  <>
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-sm text-gray-600">Connecting to {selectedBank}...</p>
                    <p className="text-xs text-gray-400 mt-1">This may take a few moments</p>
                  </>
                ) : (
                  <>
                    <Building2 className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-4">You will be redirected to {selectedBank}'s secure portal to authenticate.</p>
                    <button onClick={handleAuthenticate} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors">
                      Authenticate with {selectedBank}
                    </button>
                  </>
                )}
              </div>
            )}

            {connectStep === 'success' && (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Bank Connected</h4>
                <p className="text-sm text-gray-500 mb-4">Your {selectedBank} statements have been fetched successfully.</p>
                <button onClick={closeConnectModal} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors">
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Terms Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-gray-500/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Terms and Conditions</h3>
              <button onClick={() => setShowTermsModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="text-sm text-gray-600 space-y-3">
              <p>These Terms and Conditions govern your use of Bank X's Supply Chain Financing platform.</p>
              <p><span className="font-medium text-gray-900">1. Eligibility:</span> You must be a registered business entity in the UAE to apply for financing through this platform.</p>
              <p><span className="font-medium text-gray-900">2. Information Accuracy:</span> All information provided must be accurate and complete. Providing false information may result in application rejection.</p>
              <p><span className="font-medium text-gray-900">3. Credit Assessment:</span> Bank X reserves the right to perform credit checks and request additional documentation as part of the assessment process.</p>
              <p><span className="font-medium text-gray-900">4. Data Protection:</span> Your data will be processed in accordance with UAE data protection regulations and our Privacy Policy.</p>
              <p><span className="font-medium text-gray-900">5. Financing Terms:</span> Specific financing terms, rates, and conditions will be communicated upon approval of your application.</p>
            </div>
            <button onClick={() => setShowTermsModal(false)} className="w-full mt-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-gray-500/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Privacy Policy</h3>
              <button onClick={() => setShowPrivacyModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="text-sm text-gray-600 space-y-3">
              <p>Bank X is committed to protecting your privacy and personal data.</p>
              <p><span className="font-medium text-gray-900">Data Collection:</span> We collect business information, financial data, and identity documents as part of the application process.</p>
              <p><span className="font-medium text-gray-900">Data Usage:</span> Your data is used solely for processing your financing application and providing our services.</p>
              <p><span className="font-medium text-gray-900">Data Sharing:</span> We may share your data with credit bureaus and regulatory authorities as required by law.</p>
              <p><span className="font-medium text-gray-900">Data Security:</span> We employ industry-standard security measures to protect your data.</p>
              <p><span className="font-medium text-gray-900">Your Rights:</span> You have the right to access, correct, or delete your personal data at any time.</p>
            </div>
            <button onClick={() => setShowPrivacyModal(false)} className="w-full mt-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}