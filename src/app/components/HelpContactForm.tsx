import { useState, useEffect } from "react";
import { X, Info } from "lucide-react";
import { showToast } from "./Toast";

export interface HelpContactFormProps {
  isOpen: boolean;
  onClose: () => void;
  currentContext: string;
}

// All portal page contexts
const PORTAL_PAGES = ["dashboard", "suppliers", "receivable-invoices", "payable-invoices", "applications"] as const;

// All journey step contexts
const JOURNEY_STEPS = ["profile-creation", "kyb-verification", "aecb-credit-consent", "product-selection", "loan-product", "business-documents", "bank-account-details", "review-submit"] as const;

export interface IssueCategory {
  label: string;
  contexts: string[];
}

/**
 * All 9 issue categories with their context tags.
 * Categories tagged with "all-portal" appear on all portal pages.
 * Categories tagged with "all-journey" appear on all journey steps.
 * Categories tagged with both appear everywhere (universal).
 */
export const ISSUE_CATEGORIES: IssueCategory[] = [
  {
    label: "I have a question about my account or profile",
    contexts: [...PORTAL_PAGES, "profile-creation"],
  },
  {
    label: "I need help uploading or managing documents",
    contexts: ["kyb-verification", "business-documents", "review-submit"],
  },
  {
    label: "I need help with my application",
    contexts: ["applications", ...JOURNEY_STEPS],
  },
  {
    label: "I have a question about my invoices",
    contexts: ["receivable-invoices", "payable-invoices"],
  },
  {
    label: "I need help with suppliers",
    contexts: ["suppliers"],
  },
  {
    label: "I have a question about financing or credit",
    contexts: ["dashboard", "product-selection", "loan-product", "aecb-credit-consent"],
  },
  {
    label: "I'm experiencing a technical issue",
    contexts: [...PORTAL_PAGES, ...JOURNEY_STEPS],
  },
  {
    label: "I'd like to speak with my relationship manager",
    contexts: [...PORTAL_PAGES, ...JOURNEY_STEPS],
  },
  {
    label: "Other / General inquiry",
    contexts: [...PORTAL_PAGES, ...JOURNEY_STEPS],
  },
];

// Universal categories that always appear regardless of context
const UNIVERSAL_CATEGORIES = [
  "I'm experiencing a technical issue",
  "I'd like to speak with my relationship manager",
  "Other / General inquiry",
];

/**
 * Returns only categories matching the current context.
 * Universal categories are always included.
 */
export function getFilteredCategories(context: string): IssueCategory[] {
  return ISSUE_CATEGORIES.filter(
    (cat) => cat.contexts.includes(context) || UNIVERSAL_CATEGORIES.includes(cat.label)
  );
}

/**
 * Returns the most contextually relevant category label for pre-selection.
 * Returns empty string if no specific pre-selection applies.
 */
export function getPreselectedCategory(context: string): string {
  const contextToCategory: Record<string, string> = {
    // Portal pages
    "dashboard": "I have a question about financing or credit",
    "suppliers": "I need help with suppliers",
    "receivable-invoices": "I have a question about my invoices",
    "payable-invoices": "I have a question about my invoices",
    "applications": "I need help with my application",
    // Journey steps
    "profile-creation": "I have a question about my account or profile",
    "kyb-verification": "I need help uploading or managing documents",
    "aecb-credit-consent": "I have a question about financing or credit",
    "product-selection": "I have a question about financing or credit",
    "loan-product": "I have a question about financing or credit",
    "business-documents": "I need help uploading or managing documents",
    "bank-account-details": "I need help with my application",
    "review-submit": "I need help with my application",
  };
  return contextToCategory[context] || "";
}

const SUPPORT_EMAIL = "support@malbank.ae";

export function HelpContactForm({ isOpen, onClose, currentContext }: HelpContactFormProps) {
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [bankerName, setBankerName] = useState("");
  const [bankerEmail, setBankerEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get filtered categories based on current context
  const filteredCategories = getFilteredCategories(currentContext);

  useEffect(() => {
    if (isOpen) {
      // Pre-populate user info from localStorage with fallback defaults
      setUserName(localStorage.getItem("merchant_user_name") || "Merchant User");
      setUserEmail(localStorage.getItem("merchant_user_email") || "user@company.ae");
      setBankerName(localStorage.getItem("banker_name") || "");
      setBankerEmail(localStorage.getItem("banker_email") || "");

      // Pre-select the most contextually relevant category when form opens
      const preselected = getPreselectedCategory(currentContext);
      const filtered = getFilteredCategories(currentContext);
      const isInFiltered = filtered.some((cat) => cat.label === preselected);
      setCategory(isInFiltered ? preselected : "");
    }
  }, [isOpen, currentContext]);

  const isFormValid = category !== "" && message.trim() !== "";

  // Determine email recipient based on selected category
  const getRecipient = (): { email: string; label: string; isFallback: boolean } => {
    const isRelationshipManager = category === "I'd like to speak with my relationship manager";
    if (isRelationshipManager && bankerEmail) {
      return { email: bankerEmail, label: bankerName || "your relationship manager", isFallback: false };
    }
    if (isRelationshipManager && !bankerEmail) {
      return { email: SUPPORT_EMAIL, label: "Support Team", isFallback: true };
    }
    return { email: SUPPORT_EMAIL, label: "Support Team", isFallback: false };
  };

  // Map category to a short bracket prefix for the email subject
  const getCategoryPrefix = (): string => {
    const prefixMap: Record<string, string> = {
      "I have a question about my account or profile": "Account/Profile",
      "I need help uploading or managing documents": "Documents",
      "I need help with my application": "Application",
      "I have a question about my invoices": "Invoices",
      "I need help with suppliers": "Suppliers",
      "I have a question about financing or credit": "Financing/Credit",
      "I'm experiencing a technical issue": "Technical Issue",
      "I'd like to speak with my relationship manager": "Relationship Manager",
      "Other / General inquiry": "General Inquiry",
    };
    return prefixMap[category] || "General Inquiry";
  };

  const showFallbackNote = category === "I'd like to speak with my relationship manager" && !bankerEmail;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    const recipient = getRecipient();

    // Construct email payload (simulated) — subject auto-populated from category
    const _emailPayload = {
      from: userEmail,
      to: recipient.email,
      subject: `[${getCategoryPrefix()}] Support Request`,
      body: `Name: ${userName}\nEmail: ${userEmail}\nCategory: ${category}\n\nMessage:\n${message}`,
    };

    setIsSubmitting(true);

    // Simulate 1.5s email send delay
    setTimeout(() => {
      // Simulate success (with optional random failure for edge case testing)
      const simulateFailure = false; // Set to true to test error path
      if (simulateFailure) {
        setIsSubmitting(false);
        showToast("error", `Failed to send message. Please try again or contact us directly at ${SUPPORT_EMAIL}`);
        return;
      }

      // Success path
      showToast("success", `Your message has been sent to ${recipient.label}. We'll get back to you shortly.`);
      // Reset all fields
      setCategory("");
      setMessage("");
      setIsSubmitting(false);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-[#CBD2DD]/[.72] p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-5 py-3 flex items-center justify-between bg-[#C3D2E7] text-gray-900 rounded-t">
          <h3 className="text-base font-semibold text-gray-900">Contact Support</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Issue Category */}
          <div>
            <label htmlFor="help-category" className="block text-sm font-medium text-gray-700 mb-1.5">
              Issue Category
            </label>
            <select
              id="help-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
              disabled={isSubmitting}
            >
              <option value="">Select a category...</option>
              {filteredCategories.map((cat) => (
                <option key={cat.label} value={cat.label}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Fallback info note when banker email is unavailable */}
          {showFallbackNote && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-800">
                Your assigned relationship manager's email is not available. Your message will be sent to the Support Team instead.
              </p>
            </div>
          )}

          {/* Message */}
          <div>
            <label htmlFor="help-message" className="block text-sm font-medium text-gray-700 mb-1.5">
              Message
            </label>
            <textarea
              id="help-message"
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 2000))}
              maxLength={2000}
              rows={5}
              placeholder="Describe your issue in detail..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{message.length}/2000</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="w-full py-2.5 bg-[#4F8DFF] text-white rounded-lg hover:bg-[#3A7AE8] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Sending...
              </span>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
