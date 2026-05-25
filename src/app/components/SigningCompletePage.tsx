import { useEffect } from "react";
import { CheckCircle } from "lucide-react";

/**
 * Landing page for DocuSign iframe redirect after signing is complete.
 * This page is loaded inside the iframe when DocuSign redirects back.
 * The parent DocuSignModal detects this URL and triggers the onSign callback.
 */
export function SigningCompletePage() {
  useEffect(() => {
    // Notify parent window that signing is complete
    if (window.parent !== window) {
      window.parent.postMessage("signing_complete", "*");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Document Signed Successfully</h1>
        <p className="text-sm text-gray-500">This window will close automatically...</p>
      </div>
    </div>
  );
}
