import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Building2, X, CheckCircle, Check, Info, Mail, Loader2, ShieldCheck, LogOut, Settings, UserCheck, FileText } from "lucide-react";

export function PremiumBuyerJourney() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  // Profile state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [emailOtp, setEmailOtp] = useState(["", "", "", "", "", ""]);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [emailResendTimer, setEmailResendTimer] = useState(30);
  const [profileCreated, setProfileCreated] = useState(false);
  const [profileRedirectTimer, setProfileRedirectTimer] = useState(5);
  const [profileData, setProfileData] = useState({
    companyLegalName: "Gulf Trading Enterprises LLC",
    contactFullName: "Sarah Al-Mansouri",
    email: "sarah.almansouri@gulftrading.ae",
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
    countryOfIncorporation: "",
    registeredAddress: "",
    city: "",
    emirate: "",
  });

  // T&C state
  const [acceptedTnc, setAcceptedTnc] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  // Success state
  const [showSuccess, setShowSuccess] = useState(false);
  const [successTimer, setSuccessTimer] = useState(5);

  const steps = [
    { id: 1, name: "Profile Creation", hidden: true },
    { id: 2, name: "Lite KYB" },
    { id: 3, name: "Terms & Conditions" },
  ];
  const visibleSteps = steps.filter(s => !s.hidden);

  // KYB mock
  const startKybVerification = () => {
    setKybStatus("verifying");
    setKybProgress(0);
    const interval = setInterval(() => {
      setKybProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setKybStatus("verified");
          setCompanyInfo({
            legalBusinessName: profileData.companyLegalName,
            tradeLicenseNumber: tlNumber,
            businessType: "Limited Liability Company (LLC)",
            industrySector: "Trading - General",
            countryOfIncorporation: "United Arab Emirates",
            registeredAddress: "Office 502, Business Bay Tower",
            city: "Dubai",
            emirate: "Dubai",
          });
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  // OTP
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const arr = [...emailOtp];
    arr[index] = value;
    setEmailOtp(arr);
    if (value && index < 5) document.getElementById(`pb-otp-${index + 1}`)?.focus();
  };
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !emailOtp[index] && index > 0) document.getElementById(`pb-otp-${index - 1}`)?.focus();
  };
  const verifyEmailOtp = () => { setVerifyingEmail(true); setTimeout(() => { setVerifyingEmail(false); setEmailVerified(true); }, 1200); };
  const resendEmailOtp = () => { setEmailOtp(["", "", "", "", "", ""]); setEmailResendTimer(30); };
  const handleOtpComplete = () => { setProfileCreated(true); setProfileRedirectTimer(5); };
  const handleProfileContinue = () => { setShowOtpModal(false); setProfileCreated(false); setCurrentStep(2); };

  useEffect(() => { if (emailResendTimer > 0 && !emailVerified) { const t = setTimeout(() => setEmailResendTimer(p => p - 1), 1000); return () => clearTimeout(t); } }, [emailResendTimer, emailVerified]);
  useEffect(() => { if (profileCreated && profileRedirectTimer > 0) { const t = setTimeout(() => setProfileRedirectTimer(p => p - 1), 1000); return () => clearTimeout(t); } if (profileCreated && profileRedirectTimer === 0) handleProfileContinue(); }, [profileCreated, profileRedirectTimer]);
  useEffect(() => { const h = (e: MouseEvent) => { if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) setShowProfileMenu(false); }; document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h); }, []);

  // Success redirect
  useEffect(() => {
    if (!showSuccess) return;
    if (successTimer <= 0) {
      localStorage.setItem("demo_merchant_role", "payable");
      localStorage.setItem("merchant_underwriting_status", "none");
      localStorage.setItem("selected_product", "payable");
      window.dispatchEvent(new Event("demo-role-change"));
      navigate("/pb");
      return;
    }
    const t = setTimeout(() => setSuccessTimer(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [showSuccess, successTimer, navigate]);

  const handleNext = () => {
    if (currentStep === 1) { setShowOtpModal(true); return; }
    if (currentStep === 3 && acceptedTnc && acceptedPrivacy) { setShowSuccess(true); return; }
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };
  const handleBack = () => { if (currentStep > 2) setCurrentStep(currentStep - 1); };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return (
        <div>
          <div className="flex items-center gap-3 mb-1"><div className="w-1 h-7 bg-[#0066B8] rounded-full"></div><h2 className="text-lg font-semibold text-gray-900">Create Your Profile</h2></div>
          <p className="text-sm text-gray-500 mb-6 ml-4">Verify your identity to get started with your pre-approved facility</p>
          <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
            <div className="flex gap-3"><Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" /><p className="text-sm text-blue-800">You have been invited by Bank X as a Premium Buyer. Your business <span className="font-semibold">{profileData.companyLegalName}</span> has been pre-qualified for supply chain financing.</p></div>
          </div>
          <div className="bg-white border border-gray-200 rounded p-5 space-y-4 mb-4">
            <h3 className="text-sm font-medium text-gray-900">Company</h3>
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Company Legal Name</label><input type="text" value={profileData.companyLegalName} readOnly className="w-full px-4 py-2 border border-gray-200 rounded bg-gray-50 text-gray-700 text-sm cursor-not-allowed" /></div>
          </div>
          <div className="bg-white border border-gray-200 rounded p-5 space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Full Name</label><input type="text" value={profileData.contactFullName} onChange={e => setProfileData({ ...profileData, contactFullName: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Enter your full name" /></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Email Address</label><input type="email" value={profileData.email} onChange={e => setProfileData({ ...profileData, email: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Enter your email" /></div>
            </div>
          </div>
        </div>
      );
      case 2: return (
        <div>
          <div className="flex items-center gap-3 mb-1"><div className="w-1 h-7 bg-[#0066B8] rounded-full"></div><h2 className="text-lg font-semibold text-gray-900">Lite KYB Verification</h2></div>
          <p className="text-sm text-gray-500 mb-6 ml-4">Verify your business via Oscilar using your Trade License number</p>
          {kybStatus === "idle" && (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6"><div className="flex gap-3"><Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" /><p className="text-sm text-blue-800">Enter your Trade License number to verify your business details through Oscilar's KYB workflow.</p></div></div>
              <div className="bg-white border border-gray-200 rounded p-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Trade License Number</label>
                <div className="flex gap-3">
                  <input type="text" value={tlNumber} onChange={e => setTlNumber(e.target.value)} placeholder="e.g. TL-345678" className="flex-1 px-4 py-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm" />
                  <button onClick={startKybVerification} disabled={!tlNumber.trim()} className="px-5 py-2.5 bg-[#0066B8] text-white rounded hover:bg-[#005299] disabled:opacity-50 text-sm font-medium flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Verify</button>
                </div>
              </div>
            </>
          )}
          {kybStatus === "verifying" && (
            <div className="bg-white border border-gray-200 rounded p-8 text-center">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
              <h3 className="text-base font-semibold text-gray-900 mb-1">Oscilar KYB Verification</h3>
              <p className="text-sm text-gray-500 mb-4">Verifying TL: {tlNumber}</p>
              <div className="max-w-sm mx-auto">
                <div className="flex justify-between text-xs text-gray-500 mb-1"><span>Verifying...</span><span>{kybProgress}%</span></div>
                <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-[#0066B8] rounded-full transition-all" style={{ width: `${kybProgress}%` }} /></div>
              </div>
            </div>
          )}
          {kybStatus === "verified" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded px-4 py-3"><CheckCircle className="w-5 h-5 text-green-600" /><span className="text-sm text-green-700 font-medium">KYB Verified — Business details confirmed by Oscilar</span></div>
              <div className="bg-white border border-gray-200 rounded p-5">
                <div className="flex items-center gap-2 mb-3"><Building2 className="w-4 h-4 text-blue-600" /><h3 className="text-sm font-medium text-gray-900">Company Information</h3><span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Verified</span></div>
                <div className="grid grid-cols-2 gap-3">
                  {[["Business Name", companyInfo.legalBusinessName], ["TL Number", companyInfo.tradeLicenseNumber], ["Business Type", companyInfo.businessType], ["Industry", companyInfo.industrySector], ["Country", companyInfo.countryOfIncorporation], ["Address", `${companyInfo.registeredAddress}, ${companyInfo.city}`]].map(([l, v]) => (
                    <div key={l}><label className="block text-xs text-gray-500 mb-0.5">{l}</label><p className="text-sm text-gray-900">{v}</p></div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      );
      case 3: return (
        <div>
          <div className="flex items-center gap-3 mb-1"><div className="w-1 h-7 bg-[#0066B8] rounded-full"></div><h2 className="text-lg font-semibold text-gray-900">Terms & Conditions</h2></div>
          <p className="text-sm text-gray-500 mb-6 ml-4">Review and accept the terms to complete your onboarding</p>
          <div className="bg-white border border-gray-200 rounded p-5 space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={acceptedTnc} onChange={e => setAcceptedTnc(e.target.checked)} className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <span className="text-sm text-gray-700">I have read and agree to the <a href="#/tnc" target="_blank" className="text-blue-600 hover:underline">Terms and Conditions</a> of Bank X Supply Chain Finance platform.</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={acceptedPrivacy} onChange={e => setAcceptedPrivacy(e.target.checked)} className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <span className="text-sm text-gray-700">I have read and agree to the <a href="#/privacy" target="_blank" className="text-blue-600 hover:underline">Privacy Policy</a> and consent to the processing of my business data.</span>
            </label>
          </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <header className="bg-[#312B6B] px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <h1 className="text-xl font-bold text-white tracking-tight">BANK<span className="text-blue-400">X</span></h1>
            {currentStep > 1 && (<><div className="h-6 w-px bg-white/20"></div><div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-white/60" /><p className="text-sm text-white/90">{profileData.companyLegalName}</p></div></>)}
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm text-white/90">{currentStep > 1 ? (profileData.contactFullName || "Sarah Al-Mansouri") : "New Merchant"}</p>
            <div className="relative" ref={profileMenuRef}>
              <button 
                onClick={() => currentStep > 1 && setShowProfileMenu(!showProfileMenu)} 
                disabled={currentStep === 1}
                className={`w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center text-white font-medium transition-colors ${
                  currentStep === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-teal-600'
                }`}
              >
                {currentStep > 1 ? "SA" : "N"}
              </button>
              {showProfileMenu && currentStep > 1 && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <button onClick={() => { setShowProfileMenu(false); navigate('/login'); }} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"><LogOut className="w-4 h-4" /> Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {currentStep > 1 && (
          <div className="w-72 bg-white border-r border-gray-200 p-5 overflow-y-auto">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Onboarding Steps</h3>
            <div className="space-y-3">
              {visibleSteps.map((step, index) => {
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                return (
                  <div key={step.id} className={`flex items-center gap-3 px-3 py-2.5 rounded transition-colors ${isActive ? 'bg-blue-50 border-l-2 border-blue-600 text-blue-700' : isCompleted ? 'text-gray-700' : 'text-gray-400'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${isActive ? 'bg-[#0066B8] text-white' : isCompleted ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                      {isCompleted ? <Check className="w-3 h-3" /> : index + 1}
                    </div>
                    <span className="text-sm">{step.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-3xl mx-auto">{renderStep()}</div>
          </div>
          <div className="bg-white border-t border-gray-200 px-8 py-4 flex items-center justify-between">
            <button onClick={handleBack} disabled={currentStep <= 2} className={`px-5 py-2 rounded text-sm transition-colors ${currentStep <= 2 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100 border border-gray-300'}`}>Back</button>
            <div className="text-xs text-gray-400">{currentStep === 1 ? '' : `Step ${visibleSteps.findIndex(s => s.id === currentStep) + 1} of ${visibleSteps.length}`}</div>
            <button onClick={handleNext} disabled={currentStep === 3 && !(acceptedTnc && acceptedPrivacy)}
              className={`px-6 py-2 rounded text-sm font-medium transition-colors ${currentStep === 3 ? (acceptedTnc && acceptedPrivacy) ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#0066B8] text-white hover:bg-[#005299]'}`}>
              {currentStep === 3 ? 'Submit' : currentStep === 1 ? 'Create Profile' : 'Continue'}
            </button>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded max-w-lg w-full">
            {!profileCreated ? (
              <>
                <div className="px-5 py-3 flex items-center justify-between bg-[#312B6B] text-white rounded-t">
                  <h3 className="text-base font-semibold text-white">Verify Your Email</h3>
                  <button onClick={() => setShowOtpModal(false)} className="text-white/60 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3"><Mail className="w-4 h-4 text-blue-600" /><span className="text-sm font-medium text-gray-700">Email Verification</span>{emailVerified && <CheckCircle className="w-4 h-4 text-green-500" />}</div>
                  <p className="text-xs text-gray-500 mb-3">Enter the 6-digit code sent to {profileData.email || "your email"}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      {emailOtp.map((d, i) => (
                        <input key={i} id={`pb-otp-${i}`} type="text" maxLength={1} value={d} onChange={e => handleOtpChange(i, e.target.value)} onKeyDown={e => handleOtpKeyDown(i, e)}
                          className={`w-10 h-10 text-center border rounded text-sm font-medium focus:ring-2 focus:ring-blue-500 ${emailVerified ? 'border-green-300 bg-green-50 text-green-700' : 'border-gray-300'}`} disabled={emailVerified} />
                      ))}
                    </div>
                    {!emailVerified && <button onClick={verifyEmailOtp} disabled={verifyingEmail} className="px-4 py-2 bg-[#0066B8] text-white rounded text-sm disabled:opacity-50 flex items-center gap-2">{verifyingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : null}{verifyingEmail ? 'Verifying...' : 'Verify'}</button>}
                  </div>
                  {!emailVerified && <div className="mt-2">{emailResendTimer > 0 ? <p className="text-xs text-gray-400">Resend in {emailResendTimer}s</p> : <button onClick={resendEmailOtp} className="text-xs text-blue-600 font-medium">Resend Code</button>}</div>}
                  <button onClick={handleOtpComplete} disabled={!emailVerified} className="w-full mt-4 py-2.5 bg-[#0066B8] text-white rounded text-sm font-medium disabled:opacity-50 transition-colors">Complete Verification</button>
                </div>
              </>
            ) : (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-green-600" /></div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Profile Created</h3>
                <p className="text-sm text-gray-500 mb-4">Your identity has been verified.</p>
                <button onClick={handleProfileContinue} className="px-6 py-2 bg-[#0066B8] text-white rounded text-sm font-medium">Continue</button>
                <p className="text-xs text-gray-400 mt-2">Auto-redirecting in {profileRedirectTimer}s</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded max-w-lg w-full p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5"><CheckCircle className="w-8 h-8 text-green-600" /></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Onboarding Completed</h3>
            <p className="text-sm text-gray-600 mb-4">Your application is pre-approved for <span className="font-semibold text-gray-900">AED 500,000,000</span>.</p>
            <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
              <p className="text-sm text-blue-800">Redirecting to dashboard in <span className="font-semibold">{successTimer}</span> seconds...</p>
            </div>
            <div className="flex items-center justify-center gap-2 text-green-600"><Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm font-medium">Activating your account...</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
