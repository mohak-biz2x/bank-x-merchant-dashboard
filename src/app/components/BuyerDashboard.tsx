import { Wallet, Users, FileText, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { Link } from "react-router";

export function BuyerDashboard() {
  // Mock data for the buyer
  const approvedLimit = 3000000; // AED 3,000,000
  const utilisedAmount = 1850000; // AED 1,850,000
  const availableCredit = approvedLimit - utilisedAmount;
  const utilisationPercentage = (utilisedAmount / approvedLimit) * 100;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const stats = [
    {
      title: "Pending Approvals",
      value: "5",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Approved Invoices",
      value: "28",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Active Suppliers",
      value: "6",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Monthly Savings",
      value: "+18%",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Approved Limit Card */}
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white mb-6 shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-5 h-5" />
                <p className="text-green-100 text-sm font-medium">Approved Credit Limit</p>
              </div>
              <h2 className="text-4xl font-bold mb-1">{formatCurrency(approvedLimit)}</h2>
              <p className="text-green-100 text-sm">United Arab Emirates Dirham</p>
            </div>
            <div className="text-right">
              <p className="text-green-100 text-sm mb-1">Available Credit</p>
              <p className="text-2xl font-semibold">{formatCurrency(availableCredit)}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-green-100">Credit Utilisation</span>
              <span className="font-medium">{utilisationPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-green-800 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${utilisationPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-green-100 mt-2">
              <span>Utilised: {formatCurrency(utilisedAmount)}</span>
              <span>Available: {formatCurrency(availableCredit)}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modules Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Suppliers Module */}
          <Link to="/buyer/suppliers" className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Suppliers</h3>
                  <p className="text-sm text-gray-500">Manage supplier relationships</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Total Suppliers</span>
                  <span className="text-sm font-medium text-gray-900">6</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">KYB Verified</span>
                  <span className="text-sm font-medium text-gray-900">6</span>
                </div>
              </div>
              <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
                View Suppliers
              </button>
            </div>
          </Link>

          {/* Invoices Module */}
          <Link to="/buyer/invoices" className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Invoices</h3>
                  <p className="text-sm text-gray-500">Review invoice approvals</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Total Invoices</span>
                  <span className="text-sm font-medium text-gray-900">33</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Pending Approval</span>
                  <span className="text-sm font-medium text-orange-600">5</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Approved</span>
                  <span className="text-sm font-medium text-green-600">28</span>
                </div>
              </div>
              <button className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm">
                View Invoices
              </button>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="mt-6 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 font-medium">New invoice approval request</p>
                <p className="text-xs text-gray-500 mt-1">Seller: Tech Suppliers LLC • Amount: AED 234,000</p>
                <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 font-medium">Invoice approved</p>
                <p className="text-xs text-gray-500 mt-1">Invoice #INV-2024-0143 • Seller: Industrial Parts Co.</p>
                <p className="text-xs text-gray-400 mt-1">3 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 font-medium">New seller onboarding completed</p>
                <p className="text-xs text-gray-500 mt-1">Seller: Global Trading House</p>
                <p className="text-xs text-gray-400 mt-1">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
