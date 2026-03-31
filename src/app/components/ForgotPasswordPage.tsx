import { Lock, CheckCircle, Shield } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { MalLogo } from "./MalLogo";
import biz2xLogo from "@/assets/biz2X-m-logo.svg";

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#C3D2E7] px-28 py-12 flex-col justify-between text-gray-900">
          <div>
            <MalLogo height={40} />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold leading-tight">
              Streamline your supply chain financing with Mal
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Access powerful financing tools, manage invoices seamlessly, and grow your business with trusted payment solutions.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex gap-8">
              <div className="flex flex-col items-center gap-2">
                <Lock className="w-6 h-6 text-gray-700" />
                <p className="text-xs uppercase tracking-wide text-gray-600">Private</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <CheckCircle className="w-6 h-6 text-gray-700" />
                <p className="text-xs uppercase tracking-wide text-gray-600">Trusted</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Shield className="w-6 h-6 text-gray-700" />
                <p className="text-xs uppercase tracking-wide text-gray-600">Secure</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Your information is protected using advanced security protocols.
            </div>
          </div>
        </div>

        {/* Right Side - Forgot Password Form */}
        <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
          <div className="w-full max-w-sm">
            <div className="lg:hidden mb-8">
              <MalLogo height={36} />
            </div>

            {!submitted ? (
              <>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Forgot Password</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@company.com"
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>

                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="w-1/2 bg-[#4F8DFF] text-white py-3 rounded-lg font-medium hover:bg-[#3A7AE8] transition-colors uppercase tracking-wide text-sm"
                    >
                      Submit
                    </button>
                  </div>
                </form>

                <div className="mt-4 text-center">
                  <button
                    onClick={() => navigate("/login")}
                    className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                  >
                    Sign In
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Check Your Email</h2>
                <p className="text-sm text-gray-500 mb-6">
                  We've sent a password reset link to <span className="font-medium text-gray-700">{email}</span>
                </p>
                <button
                  onClick={() => navigate("/login")}
                  className="text-sm text-[#4F8DFF] hover:text-[#3A7AE8] font-medium"
                >
                  Back to Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
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
    </div>
  );
}
