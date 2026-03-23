import { Wallet, Lock, CheckCircle, Shield } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

export function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "ahmed@almasraf.ae",
    password: "Demo@2026",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an authentication API
    console.log("Login data:", formData);
    // Navigate to dashboard after login
    navigate("/");
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 px-28 py-12 flex-col justify-between text-white">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <Wallet className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Bank X</h1>
          </div>
        </div>

        {/* Main Message */}
        <div className="space-y-6">
          <h2 className="text-3xl font-semibold leading-tight">
            Streamline your supply chain financing with Bank X
          </h2>
          <p className="text-lg text-blue-100 leading-relaxed">
            Access powerful financing tools, manage invoices seamlessly, and grow your business with trusted payment solutions.
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => navigate("/custjour")}
              className="mt-4 w-3/4 px-8 py-3 bg-white text-blue-900 rounded-lg text-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Trust Badges + Security Notice */}
        <div className="space-y-4">
          <div className="flex gap-8">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-blue-700/50 rounded-lg flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <p className="text-xs uppercase tracking-wide">Private</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-blue-700/50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <p className="text-xs uppercase tracking-wide">Trusted</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-blue-700/50 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <p className="text-xs uppercase tracking-wide">Secure</p>
            </div>
          </div>
          <div className="text-sm text-blue-200">
            Your information is secured with 256-bit encryption across systems.
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Bank X</h1>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Log in</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="admin@company.com"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors mt-6"
              >
                Log in
              </button>
            </form>


          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <a href="#" className="hover:text-gray-700">Privacy policy</a>
              <span>•</span>
              <a href="#" className="hover:text-gray-700">Terms & conditions</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
