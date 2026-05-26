import { useState, useEffect, useCallback } from "react";
import { Check, X, FileText, Upload, Copy, ExternalLink, RefreshCw, Clock, CheckCircle2 } from "lucide-react";
import { DocuSignModal } from "./DocuSignModal";
import { showToast } from "./Toast";

export interface AgreementSigningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  approvedLimit: number;
  entityName: string;
  applicationId: string;
}

function getSteps() {
  const productType = localStorage.getItem("selected_product") || "receivable";
  const secondAgreement = productType === "payable" ? "Murabaha Agreement" : "Master Purchase Agreement";
  return [
    { id: 1, label: "On-sale Agreement" },
    { id: 2, label: secondAgreement },
    { id: 3, label: "DDS Agreement" },
    { id: 4, label: "Bank Account & Security Cheque" },
  ];
}

const STEPS = getSteps();

const STORAGE_KEY = "agreement_signing_progress";

interface BankAccount {
  id: string;
  label: string;
}

const MOCK_ACCOUNTS: BankAccount[] = [
  { id: "adcb-1", label: "ADCB - AE12 3456 7890 1234" },
  { id: "enbd-1", label: "Emirates NBD - AE98 7654 3210 9876" },
];

/**
 * Check if step N is accessible: all steps 1..N-1 must be complete.
 */
function isStepAccessible(stepId: number, completedSteps: Set<number>): boolean {
  for (let i = 1; i < stepId; i++) {
    if (!completedSteps.has(i)) return false;
  }
  return true;
}

// --- DDS Step sub-component with status + refresh ---
function DdsStep({ uaePassUrl, handleCopyUrl, handleOpenInNewTab, onComplete }: {
  uaePassUrl: string;
  handleCopyUrl: () => void;
  handleOpenInNewTab: () => void;
  onComplete: () => void;
}) {
  const [status, setStatus] = useState<"pending" | "complete">("pending");
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (status !== "complete") return;
    if (countdown <= 0) {
      onComplete();
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [status, countdown, onComplete]);

  return (
    <div className="space-y-4">
      {/* DDS Agreement card with view/download */}
      <div className="border border-gray-200 rounded-lg p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-900">DDS Agreement</h4>
            <p className="text-xs text-gray-500 mt-1">
              Direct Debit Service agreement authorizing automatic debit of repayment amounts from your account.
            </p>
            <button
              onClick={() => window.open("#", "_blank")}
              className="mt-3 flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View / Download Unsigned Agreement
            </button>
          </div>
        </div>
      </div>

      {/* E-Sign URL — prominent segment */}
      <div className="border border-blue-200 bg-blue-50/50 rounded-lg p-5">
        <label className="block text-sm font-semibold text-gray-900 mb-1">
          E-Sign URL
        </label>
        <p className="text-xs text-gray-600 mb-3">Open the URL below and e-sign the DDS Agreement to proceed</p>
        <div className="flex items-center border border-gray-300 bg-white rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
          <input
            type="text"
            readOnly
            value={uaePassUrl}
            className="flex-1 px-3 py-2.5 text-sm bg-white text-gray-700 border-none outline-none"
          />
          <button
            onClick={handleCopyUrl}
            className="px-3 py-2.5 border-l border-gray-300 hover:bg-gray-100 text-gray-600 transition-colors"
            title="Copy URL"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenInNewTab}
            className="px-3 py-2.5 border-l border-gray-300 hover:bg-blue-50 text-blue-600 transition-colors"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Contract Status + Refresh */}
      <div className={`border rounded-lg px-4 py-3 ${status === "complete" ? "border-green-300 bg-green-50" : "border-amber-200 bg-amber-50"}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              {status === "pending" ? (
                <>
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">Contract e-sign pending</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Contract e-sign complete</span>
                </>
              )}
            </div>
            {status === "pending" && (
              <p className="text-xs text-amber-700 mt-1 ml-6">Once you have completed the e-sign, click Refresh to continue.</p>
            )}
          </div>
          {status === "pending" ? (
            <button
              onClick={() => setStatus("complete")}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          ) : (
            <span className="text-xs text-green-700 flex-shrink-0">Proceeding in {countdown}s...</span>
          )}
        </div>
      </div>
    </div>
  );
}

export function AgreementSigningModal({
  isOpen,
  onClose,
  onComplete,
  approvedLimit,
  entityName,
  applicationId,
}: AgreementSigningModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showDocuSign, setShowDocuSign] = useState<{ title: string; step: number } | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(
    MOCK_ACCOUNTS.length === 1 ? MOCK_ACCOUNTS[0].id : null
  );
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Restore progress from localStorage on open
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed: number[] = JSON.parse(saved);
          const restored = new Set(parsed);
          setCompletedSteps(restored);
          // Resume at the first incomplete step
          const nextStep = STEPS.find((s) => !restored.has(s.id));
          setCurrentStep(nextStep ? nextStep.id : STEPS[STEPS.length - 1].id);
        } catch {
          setCompletedSteps(new Set());
          setCurrentStep(1);
        }
      } else {
        setCompletedSteps(new Set());
        setCurrentStep(1);
      }
    }
  }, [isOpen]);

  /**
   * Mark a step as complete, persist to localStorage, and advance to the next step.
   * If the final step (4) is completed, clear progress from localStorage.
   */
  const markStepComplete = useCallback(
    (stepId: number) => {
      setCompletedSteps((prev) => {
        const updated = new Set(prev);
        updated.add(stepId);

        // Persist to localStorage
        if (stepId === STEPS[STEPS.length - 1].id) {
          // Final step — clear progress
          localStorage.removeItem(STORAGE_KEY);
        } else {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(updated)));
        }

        return updated;
      });

      // Advance to next step if not the last
      const nextStepId = stepId + 1;
      if (nextStepId <= STEPS.length) {
        setCurrentStep(nextStepId);
      }
    },
    []
  );

  /**
   * Navigate to a step — enforces sequential access.
   * Step N is only accessible if steps 1 through N-1 are all complete.
   */
  const goToStep = useCallback(
    (stepId: number) => {
      if (isStepAccessible(stepId, completedSteps)) {
        setCurrentStep(stepId);
      }
    },
    [completedSteps]
  );

  // Generate UAE Pass mock URL (stable per modal open via applicationId + session)
  const [uaePassUrl] = useState(
    () => `https://uaepass.ae/sign/dds-${applicationId}-${Date.now()}`
  );

  const handleCopyUrl = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(uaePassUrl);
    } catch {
      alert("Could not copy to clipboard");
    }
  }, [uaePassUrl]);

  const handleOpenInNewTab = useCallback(() => {
    window.open(uaePassUrl, "_blank");
  }, [uaePassUrl]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#CBD2DD]/[.72] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded max-w-2xl w-full max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="px-5 py-3 flex items-center justify-between bg-[#C3D2E7] text-gray-900 rounded-t">
          <h3 className="text-base font-semibold text-gray-900">
            Agreement Signing
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          {/* 4-Step Progress Indicator */}
          <div className="flex items-center justify-center mb-6">
            {STEPS.map((step, index) => {
              const isCompleted = completedSteps.has(step.id);
              const isActive = currentStep === step.id;

              return (
                <div key={step.id} className="flex items-center">
                  {/* Step circle + label */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                        isCompleted
                          ? "bg-green-600 text-white"
                          : isActive
                          ? "bg-[#4F8DFF] text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <span
                      className={`text-[10px] mt-1 text-center max-w-[80px] leading-tight ${
                        isCompleted
                          ? "text-green-700 font-medium"
                          : isActive
                          ? "font-medium text-gray-900"
                          : "text-gray-500"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>

                  {/* Connecting line between steps */}
                  {index < STEPS.length - 1 && (
                    <div
                      className={`w-10 h-px mx-1 mb-4 ${
                        completedSteps.has(step.id)
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step content */}
          {currentStep === 1 && (
            <div className="border border-gray-200 rounded-lg p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900">On-sale Agreement</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Review and sign the On-sale Agreement between your entity and Mal Finance LLC. This agreement governs the sale and assignment of invoices.
                  </p>
                  <button
                    onClick={() => setShowDocuSign({ title: "On-sale Agreement", step: 1 })}
                    className="mt-4 px-5 py-2 bg-[#4F8DFF] text-white text-sm font-medium rounded-lg hover:bg-[#3A7AE8] transition-colors"
                  >
                    Sign
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (() => {
            const productType = localStorage.getItem("selected_product") || "receivable";
            const isPayable = productType === "payable";
            const title = isPayable ? "Murabaha Agreement" : "Master Purchase Agreement";
            const description = isPayable
              ? "Review and sign the Murabaha Agreement between your entity and Mal Finance LLC. This agreement outlines the cost-plus financing structure and repayment terms."
              : "Review and sign the Master Purchase Agreement between your entity and Mal Finance LLC. This agreement governs the purchase of receivables.";
            return (
              <div className="border border-gray-200 rounded-lg p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{description}</p>
                    <button
                      onClick={() => setShowDocuSign({ title, step: 2 })}
                      className="mt-4 px-5 py-2 bg-[#4F8DFF] text-white text-sm font-medium rounded-lg hover:bg-[#3A7AE8] transition-colors"
                    >
                      Sign
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          {currentStep === 3 && (() => {
            return <DdsStep uaePassUrl={uaePassUrl} handleCopyUrl={handleCopyUrl} handleOpenInNewTab={handleOpenInNewTab} onComplete={() => markStepComplete(3)} />;
          })()}

          {currentStep === 4 && (
            <div className="space-y-5">
              {/* Required Cheque Amount */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Required Security Cheque Amount:</span>{" "}
                  AED {(approvedLimit * 1.1).toLocaleString()}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  This is 110% of your approved limit (AED {approvedLimit.toLocaleString()})
                </p>
              </div>

              {/* Bank Account Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Select Bank Account
                </label>
                <select
                  value={selectedAccount ?? ""}
                  onChange={(e) => setSelectedAccount(e.target.value || null)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  data-testid="step4-bank-account-select"
                >
                  <option value="">-- Select an account --</option>
                  {MOCK_ACCOUNTS.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* File Upload Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Upload Security Cheque
                </label>
                {!uploadedFile ? (
                  <label
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
                    data-testid="step4-file-upload-area"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">
                      Click to upload cheque document
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      PDF, JPG, JPEG, or PNG
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        setUploadedFile(file);
                      }}
                      data-testid="step4-file-input"
                    />
                  </label>
                ) : (
                  <div className="flex items-center justify-between border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-gray-700">{uploadedFile.name}</span>
                    </div>
                    <button
                      onClick={() => setUploadedFile(null)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      data-testid="step4-remove-file-btn"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  disabled={!selectedAccount || !uploadedFile}
                  onClick={() => {
                    // 1. Set merchant_underwriting_status to "security-pending"
                    localStorage.setItem("merchant_underwriting_status", "security-pending");
                    // 2. Set pending_financing_choice to value of selected_product
                    const selectedProduct = localStorage.getItem("selected_product") || "receivable";
                    localStorage.setItem("pending_financing_choice", selectedProduct);
                    // 3. Dispatch demo-role-change event
                    window.dispatchEvent(new Event("demo-role-change"));
                    // 4. Show toast: "Security documents submitted successfully"
                    showToast("success", "Security documents submitted successfully");
                    // 5. Show toast: "Email sent to Sarah Al Maktoum for verification"
                    showToast("info", "Email sent to Sarah Al Maktoum for verification");
                    // 6. Clear agreement_signing_progress from localStorage
                    localStorage.removeItem(STORAGE_KEY);
                    // 7. Close modal via onComplete() callback
                    onComplete();
                  }}
                  className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedAccount && uploadedFile
                      ? "bg-[#4F8DFF] hover:bg-[#3A7AE8] text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  data-testid="step4-submit-btn"
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>

        {/* DocuSign Modal overlay */}
        {showDocuSign && (
          <DocuSignModal
            documentTitle={showDocuSign.title}
            entityName={entityName}
            referenceId={applicationId}
            onSign={() => {
              markStepComplete(showDocuSign.step);
              setShowDocuSign(null);
            }}
            onClose={() => setShowDocuSign(null)}
          />
        )}
      </div>
    </div>
  );
}

// Export helpers and constants for use by step content components
export { STEPS, STORAGE_KEY, isStepAccessible, MOCK_ACCOUNTS };
