import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { CheckCircle, Loader2, FileText, Info, ArrowRight, DollarSign, Calendar, Building2 } from "lucide-react";
import { MalLogo } from "./MalLogo";
import { DocuSignModal } from "./DocuSignModal";

type Phase = "processing" | "approved" | "signing";

interface Agreement {
  id: string;
  title: string;
  description: string;
  signed: boolean;
}

export function StpFlowPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("processing");
  const [progress, setProgress] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const [agreements, setAgreements] = useState<Agreement[]>([
    { id: "financing", title: "Financing Agreement", description: "Master financing agreement covering terms, rates, and conditions", signed: false },
    { id: "debit", title: "Direct Debit Agreement", description: "Authorization for automatic debit of repayment amounts from your account", signed: false },
  ]);
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const [docuSignDoc, setDocuSignDoc] = useState<{ id: string; title: string } | null>(null);

  const allSigned = agreements.every((a) => a.signed);

  // Phase transitions with fade
  const transitionTo = (nextPhase: Phase) => {
    setFadeIn(false);
    setTimeout(() => {
      setPhase(nextPhase);
      setFadeIn(true);
    }, 300);
  };

  // Phase 1: progress fills over 8 seconds
  useEffect(() => {
    if (phase !== "processing") return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        return prev + 1;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [phase]);

  // Auto-advance from processing to approved
  useEffect(() => {
    if (phase === "processing" && progress >= 100) {
      const timeout = setTimeout(() => transitionTo("approved"), 800);
      return () => clearTimeout(timeout);
    }
  }, [phase, progress]);

  // Phase 3: redirect countdown
  useEffect(() => {
    if (phase !== "signing" || !allSigned) return;
    const interval = setInterval(() => {
      setRedirectCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          localStorage.setItem("merchant_underwriting_status", "none");
          localStorage.setItem("demo_merchant_role", localStorage.getItem("selected_product") || "receivable");
          localStorage.setItem("stp_just_completed", "true");
          window.dispatchEvent(new Event("demo-role-change"));
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, allSigned, navigate]);

  const handleSign = (id: string) => {
    setAgreements((prev) => prev.map((a) => (a.id === id ? { ...a, signed: true } : a)));
  };

  const selectedProductKey = localStorage.getItem("selected_product") || "receivable";
  const selectedProduct = selectedProductKey === "payable" ? "Payable Invoice Financing" : "Receivable Invoice Financing";

  // Circular countdown SVG
  const CountdownCircle = ({ seconds }: { seconds: number }) => {
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (seconds / 5) * circumference;
    return (
      <div className="relative w-20 h-20 mx-auto">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="4" />
          <circle cx="32" cy="32" r={radius} fill="none" stroke="#10B981" strokeWidth="4" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-linear" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-green-600">{seconds}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-[#C3D2E7] px-6 py-3">
        <div className="flex items-center gap-5">
          <MalLogo height={32} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className={`max-w-2xl mx-auto py-12 px-4 transition-opacity duration-300 ${fadeIn ? "opacity-100" : "opacity-0"}`}>

          {/* ─── Phase 1: Processing ─── */}
          {phase === "processing" && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10 flex flex-col items-center text-center">
              {/* Pulsing glow behind spinner */}
              <div className="relative mb-8">
                <div className="absolute inset-0 w-20 h-20 bg-blue-100 rounded-full animate-ping opacity-30" style={{ animationDuration: "2s" }} />
                <div className="absolute inset-0 w-20 h-20 bg-blue-50 rounded-full animate-pulse opacity-50" />
                <Loader2 className="relative w-20 h-20 text-[#4F8DFF] animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">Please wait</h1>
              <p className="text-gray-500 max-w-sm leading-relaxed">
                Mal is running credit underwriting rules in the background for you. This may take up to a few minutes.
              </p>
            </div>
          )}

          {/* ─── Phase 2: Approved ─── */}
          {phase === "approved" && (
            <div>
              {/* Celebratory gradient banner */}
              <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border border-green-200 rounded-2xl p-8 mb-6 text-center relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-green-100 rounded-full opacity-40" />
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-emerald-100 rounded-full opacity-40" />
                <div className="relative">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-12 h-12 text-green-500" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">Application Approved!</h1>
                  <p className="text-gray-500 text-sm">Your financing application has been approved</p>
                </div>
              </div>

              {/* Approval details card with icons */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-6">
                <div className="divide-y divide-gray-100">
                  <div className="flex items-center gap-4 px-6 py-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Business Name</p>
                      <p className="text-sm font-semibold text-gray-900">Al Masraf Industries LLC</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 px-6 py-4">
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Approved Limit</p>
                      <p className="text-sm font-semibold text-gray-900">AED 5,000,000</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 px-6 py-4">
                    <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Limit Expiry</p>
                      <p className="text-sm font-semibold text-gray-900">26 March 2028</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 px-6 py-4">
                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Product</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedProduct}</p>
                    </div>
                  </div>
                </div>

                {/* Info + CTA inside card */}
                <div className="bg-blue-50 border-t border-blue-100 px-6 py-4">
                  <div className="flex items-start gap-3 mb-4">
                    <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-700">Please sign the required agreements to activate your financing facility.</p>
                  </div>
                  <button
                    onClick={() => transitionTo("signing")}
                    className="w-full bg-[#4F8DFF] text-white py-3 rounded-lg hover:bg-[#3A7AE8] transition-colors flex items-center justify-center gap-2 font-semibold text-sm"
                  >
                    Proceed to Agreements
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── Phase 3: Agreement Signing ─── */}
          {phase === "signing" && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-8 pt-8 pb-2">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-1 h-7 bg-[#4F8DFF] rounded-full" />
                  <h1 className="text-xl font-bold text-gray-900">Sign Agreements</h1>
                </div>
                <p className="text-gray-500 mb-6 ml-4 text-sm">
                  Please review and sign the following agreements to activate your financing facility
                </p>

                <div className="space-y-3">
                  {agreements.map((agreement) => (
                    <div
                      key={agreement.id}
                      className={`border rounded-xl p-5 flex items-center justify-between transition-all duration-300 ${
                        agreement.signed ? "border-green-200 bg-green-50/30" : "border-gray-200 bg-gray-50/50"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                          agreement.signed ? "bg-green-100" : "bg-blue-50"
                        }`}>
                          {agreement.signed
                            ? <CheckCircle className="w-5 h-5 text-green-600" />
                            : <FileText className="w-5 h-5 text-[#4F8DFF]" />
                          }
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">{agreement.title}</h3>
                          <p className="text-sm text-gray-500 mt-0.5">{agreement.description}</p>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        {agreement.signed ? (
                          <span className="inline-flex items-center gap-1.5 text-green-600 text-sm font-medium">
                            <CheckCircle className="w-4 h-4" /> Signed
                          </span>
                        ) : (
                          <button
                            onClick={() => setDocuSignDoc({ id: agreement.id, title: agreement.title })}
                            className="bg-[#4F8DFF] text-white px-5 py-2 rounded-lg hover:bg-[#3A7AE8] transition-colors text-sm font-medium"
                          >
                            Sign
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Success + circular countdown */}
              {allSigned && (
                <div className="px-8 pb-8 pt-4 flex flex-col items-center text-center">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 w-full flex items-center gap-3 mb-6">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <p className="text-sm text-green-800 font-medium">All agreements signed successfully!</p>
                  </div>
                  <CountdownCircle seconds={redirectCountdown} />
                  <p className="text-sm text-gray-500 mt-3">Redirecting to your dashboard...</p>
                </div>
              )}

              {!allSigned && <div className="pb-6" />}
            </div>
          )}
        </div>
      </main>

      {/* DocuSign Simulation Modal */}
      {docuSignDoc && (
        <DocuSignModal
          documentTitle={docuSignDoc.title}
          entityName="Al Masraf Industries LLC"
          referenceId="STP-APP-2025"
          onSign={() => {
            handleSign(docuSignDoc.id);
            setDocuSignDoc(null);
          }}
          onClose={() => setDocuSignDoc(null)}
        />
      )}
    </div>
  );
}
