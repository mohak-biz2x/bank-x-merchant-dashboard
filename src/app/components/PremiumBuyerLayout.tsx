import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { LayoutDashboard, FileText, Building2, LogOut, FlaskConical, X, Zap } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { getMerchantRole, getUnderwritingStatus, getStpEligibility } from "./MerchantDashboard";
import type { MerchantRole } from "./MerchantDashboard";

import { MalLogo } from "./MalLogo";
import biz2xLogo from "@/assets/biz2X-m-logo.svg";

const navItems = [
  { name: "Dashboard", path: "/pb", icon: LayoutDashboard },
  { name: "Suppliers", path: "/pb/suppliers", icon: Building2 },
  { name: "Payable Invoices", path: "/pb/invoices", icon: FileText },
];

const roleOptions: { key: MerchantRole; label: string }[] = [
  { key: "receivable", label: "Receivable Financing Only" },
  { key: "payable", label: "Buyer / Payable Only" },
  { key: "supplier-only", label: "Supplier Only (No Financing)" },
  { key: "premium-buyer", label: "Premium Buyer" },
  { key: "premium-buyer-supplier", label: "Supplier of Premium Buyer" },
];

export function PremiumBuyerLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showDemoPanel, setShowDemoPanel] = useState(false);
  const [role, setRole] = useState<MerchantRole>(getMerchantRole);
  const [uwStatus, setUwStatus] = useState(getUnderwritingStatus);
  const [stpEligibility, setStpEligibility] = useState(getStpEligibility);
  const [payableFlow, setPayableFlow] = useState(() => localStorage.getItem("demo_payable_invoice_flow") || "normal");
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const demoPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onRoleChange = () => {
      setRole(getMerchantRole());
      setUwStatus(getUnderwritingStatus());
      setStpEligibility(getStpEligibility());
      setPayableFlow(localStorage.getItem("demo_payable_invoice_flow") || "normal");
    };
    window.addEventListener("demo-role-change", onRoleChange);
    return () => window.removeEventListener("demo-role-change", onRoleChange);
  }, []);

  const handleRoleChange = (newRole: MerchantRole) => {
    setRole(newRole);
    localStorage.setItem("demo_merchant_role", newRole);
    window.dispatchEvent(new Event("demo-role-change"));
    setShowDemoPanel(false);
    // Navigate away from premium buyer layout for all non-premium-buyer roles
    if (newRole !== "premium-buyer") {
      navigate("/");
    }
  };

  const ref = profileMenuRef;
  const isActive = (p: string) => p === "/pb" ? location.pathname === "/pb" : location.pathname.startsWith(p);
  
  useEffect(() => { 
    const h = (e: MouseEvent) => { 
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) setShowProfileMenu(false); 
      if (demoPanelRef.current && !demoPanelRef.current.contains(e.target as Node)) setShowDemoPanel(false);
    }; 
    document.addEventListener("mousedown", h); 
    return () => document.removeEventListener("mousedown", h); 
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="sticky top-0 z-50">
        <div className="bg-[#C3D2E7] px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <MalLogo height={28} className="text-gray-900" />
              <div className="h-6 w-px bg-gray-400" />
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-500" />
                <p className="text-sm text-gray-700">Gulf Trading Enterprises LLC</p>
              </div>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-medium rounded border border-amber-300">Premium Buyer</span>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-sm text-gray-700">Sarah Al-Mansouri</p>
              <div className="relative" ref={ref}>
                <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center text-white font-medium hover:bg-teal-600">SA</button>
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button onClick={() => { setShowProfileMenu(false); navigate('/login'); }} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"><LogOut className="w-4 h-4" /> Logout</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white border-b border-gray-200 px-6">
          <nav className="flex items-center gap-0">
            {navItems.map(item => {
              const Icon = item.icon;
              return <Link key={item.path} to={item.path} className={`flex items-center gap-2 px-4 py-3 text-sm border-b-2 transition-colors ${isActive(item.path) ? "border-blue-600 text-blue-600 font-medium" : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"}`}><Icon className="w-4 h-4" />{item.name}</Link>;
            })}
          </nav>
        </div>
      </header>
      <main className="flex-1"><Outlet /></main>
      <footer className="bg-white border-t border-gray-200 px-6 py-5">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <a href="#/privacy" target="_blank" className="text-xs text-gray-500 hover:text-gray-700">Privacy policy</a>
            <a href="#/disclaimer" target="_blank" className="text-xs text-gray-500 hover:text-gray-700">Disclaimer</a>
            <a href="#/tnc" target="_blank" className="text-xs text-gray-500 hover:text-gray-700">Terms & conditions</a>
          </div>
          <p className="text-xs text-gray-400 flex items-center gap-1">&copy; Mal 2026. All rights reserved. <span className="mx-1">|</span> Powered by <img src={biz2xLogo} alt="Biz2X" className="inline-block h-4 ml-1" /></p>
        </div>
      </footer>

      {/* Demo Panel */}
      <div className="fixed bottom-5 right-5 z-50" ref={demoPanelRef}>
        {showDemoPanel && (
          <div className="absolute bottom-14 right-0 w-72 bg-white rounded-lg shadow-xl border border-gray-200 p-4 mb-2">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Demo Only</span>
              </div>
              <button onClick={() => setShowDemoPanel(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-xs text-gray-500 mb-3">Demo controls</p>
            <div className="flex flex-col gap-1.5">
              {(uwStatus === "pending" || uwStatus === "approved" || uwStatus === "security-pending") && (
                <>
                  {uwStatus === "pending" && (
                    <button onClick={() => { localStorage.setItem("merchant_underwriting_status", "approved"); window.dispatchEvent(new Event("demo-role-change")); setShowDemoPanel(false); }} className="px-3 py-2 rounded-md text-xs font-medium text-left bg-green-50 text-green-800 border border-green-300 hover:bg-green-100 transition-colors">Complete Underwriting (Approve)</button>
                  )}
                  {uwStatus === "approved" && (
                    <button onClick={() => { window.dispatchEvent(new Event("demo-complete-esign")); setShowDemoPanel(false); }} className="px-3 py-2 rounded-md text-xs font-medium text-left bg-blue-50 text-blue-800 border border-blue-300 hover:bg-blue-100 transition-colors">Complete E-Signing</button>
                  )}
                  {uwStatus === "security-pending" && (
                    <button onClick={() => { const choice = localStorage.getItem("pending_financing_choice") || "both"; localStorage.setItem("demo_merchant_role", choice); localStorage.setItem("merchant_underwriting_status", "none"); localStorage.removeItem("pending_financing_choice"); window.dispatchEvent(new Event("demo-role-change")); setShowDemoPanel(false); }} className="px-3 py-2 rounded-md text-xs font-medium text-left bg-green-50 text-green-800 border border-green-300 hover:bg-green-100 transition-colors">Approve Security Onboarding</button>
                  )}
                  <button onClick={() => { localStorage.setItem("merchant_underwriting_status", "none"); window.dispatchEvent(new Event("demo-role-change")); setShowDemoPanel(false); }} className="px-3 py-2 rounded-md text-xs font-medium text-left bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors">Skip Underwriting (Reset)</button>
                  <div className="border-t border-gray-200 my-1"></div>
                </>
              )}
              {/* STP Eligibility Toggle */}
              <div className="mb-1">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Zap className="w-3 h-3 text-green-600" />
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">STP Eligibility</span>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => { localStorage.setItem("demo_stp_eligibility", "approved"); window.dispatchEvent(new Event("demo-role-change")); }}
                    className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium text-center transition-colors ${stpEligibility === "approved" ? "bg-green-100 text-green-800 border border-green-300" : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"}`}
                  >
                    STP Approved
                  </button>
                  <button
                    onClick={() => { localStorage.setItem("demo_stp_eligibility", "rejected"); window.dispatchEvent(new Event("demo-role-change")); }}
                    className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium text-center transition-colors ${stpEligibility === "rejected" ? "bg-red-100 text-red-700 border border-red-300" : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"}`}
                  >
                    STP Rejected
                  </button>
                </div>
              </div>
              {/* Applications Dataset Toggle */}
              <div className="mb-1">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <FileText className="w-3 h-3 text-blue-600" />
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Applications Data</span>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => { localStorage.setItem("demo_app_dataset", "single"); window.dispatchEvent(new Event("demo-role-change")); }}
                    className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium text-center transition-colors ${(localStorage.getItem("demo_app_dataset") || "single") === "single" ? "bg-blue-100 text-blue-800 border border-blue-300" : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"}`}
                  >
                    Single App
                  </button>
                  <button
                    onClick={() => { localStorage.setItem("demo_app_dataset", "multi"); window.dispatchEvent(new Event("demo-role-change")); }}
                    className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium text-center transition-colors ${localStorage.getItem("demo_app_dataset") === "multi" ? "bg-purple-100 text-purple-800 border border-purple-300" : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"}`}
                  >
                    Multi (4 Apps)
                  </button>
                </div>
              </div>
              {/* Payable Invoice Flow Toggle */}
              <div className="mb-1">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <FileText className="w-3 h-3 text-amber-600" />
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Payable Invoice Flow</span>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => { localStorage.setItem("demo_payable_invoice_flow", "normal"); window.dispatchEvent(new Event("demo-role-change")); }}
                    className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium text-center transition-colors ${payableFlow === "normal" ? "bg-green-100 text-green-800 border border-green-300" : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"}`}
                  >
                    Normal
                  </button>
                  <button
                    onClick={() => { localStorage.setItem("demo_payable_invoice_flow", "exception"); window.dispatchEvent(new Event("demo-role-change")); }}
                    className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium text-center transition-colors ${payableFlow === "exception" ? "bg-red-100 text-red-700 border border-red-300" : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"}`}
                  >
                    Exception
                  </button>
                </div>
              </div>
              <div className="border-t border-gray-200 my-1"></div>
              <p className="text-xs text-gray-500 mb-1">Switch merchant profile role</p>
              {roleOptions.map((opt) => (
                <button key={opt.key} onClick={() => handleRoleChange(opt.key)} className={`px-3 py-2 rounded-md text-xs font-medium text-left transition-colors ${role === opt.key ? "bg-amber-100 text-amber-800 border border-amber-300" : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"}`}>{opt.label}</button>
              ))}
            </div>
          </div>
        )}
        <button onClick={() => setShowDemoPanel(!showDemoPanel)} className="w-10 h-10 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors" title="Demo: Switch merchant role"><FlaskConical className="w-5 h-5" /></button>
      </div>
    </div>
  );
}
