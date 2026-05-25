import { useState } from "react";
import { Upload, CheckCircle, FileText, AlertCircle, X, Loader2 } from "lucide-react";
import { MalLogo } from "./MalLogo";

interface DocumentRequest {
  id: string;
  category: "additional" | "underwriting";
  name: string;
  description?: string;
  status: "new" | "uploaded" | "approved" | "rejected";
  file?: File;
  rejectionReason?: string;
}

const MOCK_DOCUMENTS: DocumentRequest[] = [
  {
    id: "doc-1",
    category: "additional",
    name: "Audited Financial Statements (FY24)",
    description: "Most recent audited financial statements including balance sheet and P&L",
    status: "new",
  },
  {
    id: "doc-2",
    category: "additional",
    name: "Updated Bank Statements (Last 3 months)",
    description: "Bank statements from your primary business account",
    status: "new",
  },
  {
    id: "doc-3",
    category: "additional",
    name: "Receivables Aging Report",
    description: "Current receivables aging report showing outstanding invoices",
    status: "new",
  },
  {
    id: "doc-4",
    category: "underwriting",
    name: "Debt Schedule / Borrowings Statement",
    description: "Complete schedule of all existing borrowings and repayment terms",
    status: "new",
  },
  {
    id: "doc-5",
    category: "underwriting",
    name: "Management Accounts (Q1 2025)",
    description: "Quarterly management accounts with commentary",
    status: "new",
  },
];

export function AdditionalDocRequestPage() {
  const [documents, setDocuments] = useState<DocumentRequest[]>(MOCK_DOCUMENTS);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const additionalDocs = documents.filter((d) => d.category === "additional");
  const underwritingDocs = documents.filter((d) => d.category === "underwriting");
  const newDocs = documents.filter((d) => d.status === "new" && !d.file);
  const uploadedDocs = documents.filter((d) => d.file || d.status === "uploaded");
  const allUploaded = documents.every((d) => d.file || d.status === "uploaded" || d.status === "approved");

  const handleFileUpload = (docId: string, file: File) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, file, status: "uploaded" as const } : d))
    );
  };

  const handleRemoveFile = (docId: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, file: undefined, status: "new" as const } : d))
    );
  };

  const handleDrop = (docId: string, e: React.DragEvent) => {
    e.preventDefault();
    setDragOverId(null);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(docId, file);
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0f1623] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-semibold text-white mb-3">Documents Submitted</h2>
          <p className="text-gray-400 mb-6">
            Your documents have been submitted successfully. Our team will review them and update your application status.
          </p>
          <p className="text-sm text-gray-500">
            You will receive an email confirmation shortly. You may close this window.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1623]">
      {/* Header */}
      <header className="border-b border-gray-700/50 bg-[#141d2e]">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <MalLogo height={28} className="brightness-0 invert" />
          <span className="text-xs text-gray-500 uppercase tracking-wider">Secure Document Portal</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white mb-2">Upload Supporting Documents</h1>
          <p className="text-gray-400 text-sm">
            Name: <span className="text-gray-200 font-medium">Al Masraf Industries LLC</span>
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Application: <span className="text-gray-200 font-medium">APP-2025-001</span> · Receivable Invoice Financing
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-8 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-200 font-medium">Action Required</p>
            <p className="text-sm text-blue-300/80 mt-1">
              Please upload the documents marked below. These are required to proceed with your finance eligibility assessment.
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-2 bg-gray-700/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${(uploadedDocs.length / documents.length) * 100}%` }}
            />
          </div>
          <span className="text-sm text-gray-400 whitespace-nowrap">
            {uploadedDocs.length} of {documents.length} uploaded
          </span>
        </div>

        {/* Additional Documents Section */}
        <DocumentSection
          title="Additional Documents"
          count={additionalDocs.filter((d) => d.status === "new" && !d.file).length}
          documents={additionalDocs}
          onFileUpload={handleFileUpload}
          onRemoveFile={handleRemoveFile}
          onDrop={handleDrop}
          dragOverId={dragOverId}
          setDragOverId={setDragOverId}
        />

        {/* Underwriting Documents Section */}
        <DocumentSection
          title="Underwriting"
          count={underwritingDocs.filter((d) => d.status === "new" && !d.file).length}
          documents={underwritingDocs}
          onFileUpload={handleFileUpload}
          onRemoveFile={handleRemoveFile}
          onDrop={handleDrop}
          dragOverId={dragOverId}
          setDragOverId={setDragOverId}
        />

        {/* Submit Button */}
        <div className="mt-10 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!allUploaded || submitting}
            className={`px-8 py-3 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
              allUploaded && !submitting
                ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25"
                : "bg-gray-700/50 text-gray-500 cursor-not-allowed"
            }`}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Documents"
            )}
          </button>
        </div>

        {/* Help Text */}
        <p className="text-center text-xs text-gray-600 mt-6">
          Need help? Contact your relationship manager or email{" "}
          <span className="text-blue-400">support@mal.ae</span>
        </p>
      </main>
    </div>
  );
}

/* ─── Document Section Component ─── */

interface DocumentSectionProps {
  title: string;
  count: number;
  documents: DocumentRequest[];
  onFileUpload: (docId: string, file: File) => void;
  onRemoveFile: (docId: string) => void;
  onDrop: (docId: string, e: React.DragEvent) => void;
  dragOverId: string | null;
  setDragOverId: (id: string | null) => void;
}

function DocumentSection({
  title,
  count,
  documents,
  onFileUpload,
  onRemoveFile,
  onDrop,
  dragOverId,
  setDragOverId,
}: DocumentSectionProps) {
  return (
    <div className="mb-8">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-base font-medium text-white">{title}</h2>
        {count > 0 && (
          <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">
            {count} pending
          </span>
        )}
        {count === 0 && (
          <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
            Complete
          </span>
        )}
      </div>

      {/* Document Cards */}
      <div className="space-y-3">
        {documents.map((doc) => (
          <DocumentCard
            key={doc.id}
            doc={doc}
            onFileUpload={onFileUpload}
            onRemoveFile={onRemoveFile}
            onDrop={onDrop}
            isDragOver={dragOverId === doc.id}
            setDragOverId={setDragOverId}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Document Card Component ─── */

interface DocumentCardProps {
  doc: DocumentRequest;
  onFileUpload: (docId: string, file: File) => void;
  onRemoveFile: (docId: string) => void;
  onDrop: (docId: string, e: React.DragEvent) => void;
  isDragOver: boolean;
  setDragOverId: (id: string | null) => void;
}

function DocumentCard({ doc, onFileUpload, onRemoveFile, onDrop, isDragOver, setDragOverId }: DocumentCardProps) {
  const hasFile = doc.file || doc.status === "uploaded";

  return (
    <div
      className={`rounded-lg border transition-all ${
        isDragOver
          ? "border-blue-400/60 bg-blue-500/10"
          : hasFile
          ? "border-emerald-500/30 bg-emerald-500/5"
          : "border-gray-700/50 bg-[#1a2435]"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOverId(doc.id);
      }}
      onDragLeave={() => setDragOverId(null)}
      onDrop={(e) => onDrop(doc.id, e)}
    >
      <div className="p-4 flex items-start gap-4">
        {/* Icon */}
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
            hasFile ? "bg-emerald-500/20" : "bg-gray-700/50"
          }`}
        >
          {hasFile ? (
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          ) : (
            <FileText className="w-5 h-5 text-gray-400" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-white truncate">{doc.name}</p>
            {!hasFile && (
              <span className="text-[10px] uppercase tracking-wider bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-medium shrink-0">
                New
              </span>
            )}
          </div>
          {doc.description && (
            <p className="text-xs text-gray-500 mt-1">{doc.description}</p>
          )}

          {/* Uploaded file info */}
          {doc.file && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-emerald-400 truncate">{doc.file.name}</span>
              <span className="text-xs text-gray-600">
                ({(doc.file.size / 1024).toFixed(0)} KB)
              </span>
              <button
                onClick={() => onRemoveFile(doc.id)}
                className="text-gray-500 hover:text-red-400 transition-colors ml-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Upload Button */}
        {!hasFile && (
          <label className="shrink-0 cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onFileUpload(doc.id, file);
              }}
            />
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 hover:border-blue-400/50 transition-all text-sm font-medium">
              <Upload className="w-4 h-4" />
              Upload
            </div>
          </label>
        )}
      </div>
    </div>
  );
}
