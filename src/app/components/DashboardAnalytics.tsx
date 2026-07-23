import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  ReferenceLine,
} from "recharts";
import type { MerchantRole } from "./MerchantDashboard";

type TimePeriod = "3M" | "6M" | "12M" | "ALL";

// --- Mock Data Generation (deterministic) ---

function generateMonthLabels(count: number): string[] {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  // Current date is June 2026
  const now = new Date(2026, 5, 30); // June 30, 2026
  const labels: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(`${months[d.getMonth()]} ${String(d.getFullYear()).slice(-2)}`);
  }
  return labels;
}

// Deterministic variance based on index
function variance(base: number, index: number, pct: number): number {
  const seed = Math.sin(index * 9.1 + 3.7) * 0.5 + 0.5; // 0-1
  const factor = 1 + (seed - 0.5) * 2 * (pct / 100);
  return Math.round(base * factor);
}

function generateInvoiceVolumeData(months: number) {
  const labels = generateMonthLabels(months);
  return labels.map((month, i) => {
    // Start from ~15 invoices and grow to ~40 by the end of the period
    const progress = i / (months - 1 || 1);
    const baseReceivable = Math.round(15 + progress * 25);
    const basePayable = Math.round(10 + progress * 18);
    return {
      month,
      receivable: variance(baseReceivable, i, 15),
      payable: variance(basePayable, i + 50, 15),
    };
  });
}

function generateCreditUtilisationData(months: number) {
  const labels = generateMonthLabels(months);
  const approvedLimit = 8000000;
  return labels.map((month, i) => {
    // Start at ~35% utilisation and grow to ~65% by the end of the period
    const progress = i / (months - 1 || 1);
    const totalBase = approvedLimit * (0.35 + progress * 0.30);
    const total = Math.min(variance(Math.round(totalBase), i + 10, 10), approvedLimit * 0.95);
    const receivable = Math.round(total * 0.6);
    const payable = total - receivable;
    return {
      month,
      receivable,
      payable,
      total,
      limit: approvedLimit,
    };
  });
}

function generatePaymentTermsData() {
  return [
    { name: "30 days", value: 18, color: "#3b82f6" },
    { name: "60 days", value: 28, color: "#8b5cf6" },
    { name: "90 days", value: 32, color: "#f59e0b" },
    { name: "120 days", value: 12, color: "#10b981" },
  ];
}

function generateCounterpartyData(role: MerchantRole) {
  if (role === "payable" || role === "both") {
    return [
      { name: "Al Futtaim Group", value: 1450000, color: "#3b82f6" },
      { name: "Emirates Trading", value: 980000, color: "#8b5cf6" },
      { name: "Dubai Industrial", value: 870000, color: "#f59e0b" },
      { name: "Gulf Supplies Co", value: 650000, color: "#10b981" },
      { name: "National Steel", value: 520000, color: "#ef4444" },
      { name: "Others", value: 430000, color: "#6b7280" },
    ];
  }
  // receivable role — buyers
  return [
    { name: "Emaar Properties", value: 1200000, color: "#3b82f6" },
    { name: "DEWA", value: 950000, color: "#8b5cf6" },
    { name: "Etisalat", value: 780000, color: "#f59e0b" },
    { name: "Dubai Municipality", value: 600000, color: "#10b981" },
    { name: "Others", value: 470000, color: "#6b7280" },
  ];
}

// --- Time Period Selector Component ---

function TimePeriodSelector({
  value,
  onChange,
}: {
  value: TimePeriod;
  onChange: (v: TimePeriod) => void;
}) {
  const options: TimePeriod[] = ["3M", "6M", "12M", "ALL"];
  return (
    <div className="flex rounded-lg border border-gray-200 overflow-hidden">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-3 py-1 text-xs font-medium transition-colors ${
            value === opt
              ? "bg-gray-800 text-white"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// --- Chart Card Wrapper ---

function ChartCard({
  title,
  subtitle,
  children,
  timePeriod,
  onTimePeriodChange,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  timePeriod?: TimePeriod;
  onTimePeriodChange?: (v: TimePeriod) => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow min-h-[280px] flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-base font-semibold text-gray-900">{title}</h4>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {timePeriod && onTimePeriodChange && (
          <TimePeriodSelector value={timePeriod} onChange={onTimePeriodChange} />
        )}
      </div>
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}

// --- Tooltip Formatters ---

function formatAED(value: number): string {
  if (value >= 1000000) return `AED ${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `AED ${(value / 1000).toFixed(0)}K`;
  return `AED ${value}`;
}

function formatFullAED(value: number): string {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// --- Main Analytics Component ---

export function DashboardAnalytics({ role }: { role: MerchantRole }) {
  const [invoicePeriod, setInvoicePeriod] = useState<TimePeriod>("6M");
  const [utilisationPeriod, setUtilisationPeriod] = useState<TimePeriod>("6M");
  const [termsPeriod, setTermsPeriod] = useState<TimePeriod>("6M");
  const [counterpartyPeriod, setCounterpartyPeriod] = useState<TimePeriod>("6M");

  // Don't render for excluded roles
  if (role === "supplier-only" || role === "premium-buyer" || role === "premium-buyer-supplier") {
    return null;
  }

  const getMonthCount = (period: TimePeriod) => {
    switch (period) {
      case "3M": return 3;
      case "6M": return 6;
      case "12M": return 12;
      case "ALL": return 36;
    }
  };

  const invoiceData = generateInvoiceVolumeData(getMonthCount(invoicePeriod));
  const utilisationData = generateCreditUtilisationData(getMonthCount(utilisationPeriod));
  const paymentTermsData = generatePaymentTermsData();
  const counterpartyData = generateCounterpartyData(role);
  const totalCounterpartyAmount = counterpartyData.reduce((sum, d) => sum + d.value, 0);
  const totalInvoices = paymentTermsData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights & Analytics</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Credit Utilisation Chart */}
        <ChartCard
          title="Credit Utilisation"
          subtitle="Monthly credit limit usage over time"
          timePeriod={utilisationPeriod}
          onTimePeriodChange={setUtilisationPeriod}
        >
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={utilisationData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => v.split(" ")[0]}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => formatAED(v)}
              />
              <Tooltip
                formatter={(value: number, name: string) => [formatFullAED(value), name === "receivable" ? "Receivable" : "Payable"]}
                labelFormatter={(label) => label}
              />
              <ReferenceLine
                y={8000000}
                stroke="#ef4444"
                strokeDasharray="5 5"
                label={{ value: "Approved Limit", position: "right", fontSize: 10, fill: "#ef4444" }}
              />
              {(role === "receivable" || role === "both") && (
                <Area
                  type="monotone"
                  dataKey="receivable"
                  stackId="1"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.3}
                  name="receivable"
                />
              )}
              {(role === "payable" || role === "both") && (
                <Area
                  type="monotone"
                  dataKey="payable"
                  stackId="1"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.3}
                  name="payable"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 2. Invoice Count Trend */}
        <ChartCard
          title="Invoice Count Trend"
          subtitle="Monthly invoice submissions"
          timePeriod={invoicePeriod}
          onTimePeriodChange={setInvoicePeriod}
        >
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={invoiceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => v.split(" ")[0]}
              />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(value: number, name: string) => [value, name === "receivable" ? "Receivable" : "Payable"]}
                labelFormatter={(label) => label}
              />
              {(role === "receivable" || role === "both") && (
                <Line
                  type="monotone"
                  dataKey="receivable"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="receivable"
                />
              )}
              {(role === "payable" || role === "both") && (
                <Line
                  type="monotone"
                  dataKey="payable"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="payable"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 3. Payment Terms Distribution */}
        <ChartCard
          title="Payment Terms Distribution"
          subtitle="Breakdown by payment tenor"
          timePeriod={termsPeriod}
          onTimePeriodChange={setTermsPeriod}
        >
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={paymentTermsData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={false}
              >
                {paymentTermsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [`${value} invoices (${((value / totalInvoices) * 100).toFixed(1)}%)`, name]}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
              />
              {/* Center label */}
              <text x="50%" y="48%" textAnchor="middle" className="text-lg font-bold fill-gray-900">
                {totalInvoices}
              </text>
              <text x="50%" y="56%" textAnchor="middle" className="text-xs fill-gray-500">
                Invoices
              </text>
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 4. Supplier / Buyer Distribution */}
        <ChartCard
          title={role === "receivable" ? "Buyer Distribution" : "Supplier Distribution"}
          subtitle={role === "receivable" ? "Invoice volume by buyer" : "Invoice volume by supplier"}
          timePeriod={counterpartyPeriod}
          onTimePeriodChange={setCounterpartyPeriod}
        >
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={counterpartyData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name.length > 10 ? name.slice(0, 10) + "…" : name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={false}
              >
                {counterpartyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [formatFullAED(value) + ` (${((value / totalCounterpartyAmount) * 100).toFixed(1)}%)`, name]}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
              />
              {/* Center label */}
              <text x="50%" y="48%" textAnchor="middle" className="text-lg font-bold fill-gray-900">
                {formatAED(totalCounterpartyAmount)}
              </text>
              <text x="50%" y="56%" textAnchor="middle" className="text-xs fill-gray-500">
                Total
              </text>
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
