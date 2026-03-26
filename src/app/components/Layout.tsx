import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { LayoutDashboard, FileText, Wallet, Settings, LogOut, Building2, FlaskConical, X, Zap } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { getMerchantRole, getUnderwritingStatus, getStpEligibility } from "./MerchantDashboard";
import type { MerchantRole } from "./MerchantDashboard";

const allNavItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard, roles: ["both", "receivable", "payable"] as MerchantRole[] },
  { name: "Suppliers", path: "/suppliers", icon: Building2, roles: ["both", "payable"] as MerchantRole[] },
  { name: "Receivable Invoices", path: "/receivable-invoices", icon: FileText, roles: ["both", "receivable"] as MerchantRole[] },
  { name: "Payable Invoices", path: "/payable-invoices", icon: FileText, roles: ["both", "payable"] as MerchantRole[] },
];

const roleOptions: { key: MerchantRole; label: string }[] = [
  { key: "both", label: "Both" },
  { key: "receivable", label: "Receivable Financing Only" },
  { key: "payable", label: "Buyer / Payable Only" },
  { key: "supplier-only", label: "Supplier Only (No Financing)" },
];

export function Layout() {
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
    if (newRole === "supplier-only") {
      navigate("/");
    }
  };


  const navItems = (uwStatus === "pending" || uwStatus === "approved" || uwStatus === "security-pending")
    ? []
    : allNavItems.filter((item) => item.roles.includes(role));
  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) setShowProfileMenu(false);
      if (demoPanelRef.current && !demoPanelRef.current.contains(event.target as Node)) setShowDemoPanel(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">Bank X</h1>
                  <p className="text-xs text-gray-500">Merchant Dashboard</p>
                </div>
              </div>
              <div className="h-8 w-px bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-500" />
                <p className="text-sm font-medium text-gray-900">{role === "supplier-only" ? "Falcon Steel Industries LLC" : "Al Masraf Industries LLC"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{role === "supplier-only" ? "Rashid Al Farsi" : "Ahmed Al Mansouri"}</p>
              </div>
              <div className="relative" ref={profileMenuRef}>
                <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium hover:bg-blue-700 transition-colors">{role === "supplier-only" ? "R" : "A"}</button>
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button onClick={() => { setShowProfileMenu(false); }} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"><Settings className="w-4 h-4 text-gray-500" />Account Settings</button>
                    <button onClick={() => { setShowProfileMenu(false); navigate('/applications'); }} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"><FileText className="w-4 h-4 text-blue-500" />My Applications</button>
                    <div className="border-t border-gray-200 my-2"></div>
                    <button onClick={() => { setShowProfileMenu(false); navigate('/login'); }} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"><LogOut className="w-4 h-4" />Logout</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {navItems.length > 0 && (
        <div className="px-6 py-2">
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (<Link key={item.path} to={item.path} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${active ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}><Icon className="w-4 h-4" /><span className="text-sm">{item.name}</span></Link>);
            })}
          </nav>
        </div>
        )}
      </header>

      <main><Outlet /></main>
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
            <p className="text-xs text-gray-500 mb-3">Switch merchant profile role</p>
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
