import { useState } from "react";
import { FileText, X, PenTool, Loader2, CheckCircle } from "lucide-react";

interface DocuSignModalProps {
  documentTitle: string;
  entityName: string;
  referenceId: string;
  additionalDetails?: { label: string; value: string }[];
  onSign: () => void;
  onClose: () => void;
}

export function DocuSignModal({ documentTitle, entityName, referenceId, additionalDetails, onSign, onClose }: DocuSignModalProps) {
  const [signed, setSigned] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [docId] = useState(() => `DOC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      onSign();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full shadow-2xl max-h-[90vh] flex flex-col">
        {/* DocuSign Header */}
        <div className="bg-[#1A1A2E] px-5 py-3 rounded-t-lg flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-400 rounded flex items-center justify-center text-[10px] font-bold text-[#1A1A2E]">DS</div>
            <span className="text-white text-sm font-medium">DocuSign</span>
            <span className="text-gray-400 text-xs ml-2">Electronic Signature</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
        </div>

        {/* Scrollable Document Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Document Header */}
          <div className="border-b-2 border-gray-800 pb-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{documentTitle}</h2>
                <p className="text-xs text-gray-500 mt-1">Document ID: {docId}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm font-medium text-gray-900">{today}</p>
              </div>
            </div>
          </div>

          {/* Parties Section */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-2 uppercase tracking-wide">Parties</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Lender / Financier</span>
                <span className="font-medium text-gray-900">Mal Finance LLC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Borrower / Client</span>
                <span className="font-medium text-gray-900">{entityName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Reference</span>
                <span className="font-medium text-gray-900">{referenceId}</span>
              </div>
              {additionalDetails?.map((d, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-gray-500">{d.label}</span>
                  <span className="font-medium text-gray-900">{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-2 uppercase tracking-wide">Terms & Conditions</h3>
            <div className="text-xs text-gray-600 space-y-3 leading-relaxed">
              <p><span className="font-semibold text-gray-800">1. Scope of Agreement.</span> This agreement governs the terms under which the Financier shall provide financing facilities to the Borrower as outlined herein. The Borrower acknowledges and agrees to all terms set forth in this document.</p>
              <p><span className="font-semibold text-gray-800">2. Financing Terms.</span> The financing facility shall be subject to the approved limit, tenor, and repayment structure as communicated to the Borrower. Interest rates and fees shall be as per the prevailing schedule of charges.</p>
              <p><span className="font-semibold text-gray-800">3. Obligations of the Borrower.</span> The Borrower shall ensure timely repayment of all amounts due under this agreement. The Borrower shall maintain accurate records and provide any documentation requested by the Financier.</p>
              <p><span className="font-semibold text-gray-800">4. Representations & Warranties.</span> The Borrower represents that all information provided is true, accurate, and complete. The Borrower warrants that it has the legal authority to enter into this agreement.</p>
              <p><span className="font-semibold text-gray-800">5. Default & Remedies.</span> In the event of default, the Financier reserves the right to demand immediate repayment of all outstanding amounts and exercise any remedies available under applicable law.</p>
              <p><span className="font-semibold text-gray-800">6. Governing Law.</span> This agreement shall be governed by and construed in accordance with the laws of the United Arab Emirates. Any disputes shall be resolved through the courts of Dubai.</p>
              <p><span className="font-semibold text-gray-800">7. Confidentiality.</span> Both parties agree to maintain the confidentiality of all information exchanged under this agreement and shall not disclose such information to third parties without prior written consent.</p>
            </div>
          </div>

          {/* Signature Section */}
          <div className="border-t-2 border-gray-300 pt-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wide">Signature</h3>
            <div className="grid grid-cols-2 gap-6">
              {/* Financier signature (pre-signed) */}
              <div>
                <p className="text-xs text-gray-500 mb-2">For and on behalf of Mal Finance LLC</p>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 h-24 flex flex-col justify-between">
                  <p className="text-blue-700 font-serif italic text-lg">Sarah Al Maktoum</p>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <CheckCircle className="w-3 h-3" />
                    <span>Signed on {today}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Authorized Signatory</p>
              </div>

              {/* Client signature (clickable) */}
              <div>
                <p className="text-xs text-gray-500 mb-2">For and on behalf of {entityName}</p>
                {signed ? (
                  <div className="border-2 border-green-300 rounded-lg p-4 bg-green-50 h-24 flex flex-col justify-between">
                    <p className="text-green-700 font-serif italic text-lg">Ahmed Al Mansouri</p>
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle className="w-3 h-3" />
                      <span>Signed on {today}</span>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setSigned(true)}
                    className="border-2 border-dashed border-yellow-400 rounded-lg p-4 bg-yellow-50 h-24 w-full flex flex-col items-center justify-center gap-2 hover:bg-yellow-100 hover:border-yellow-500 transition-colors cursor-pointer group"
                  >
                    <PenTool className="w-5 h-5 text-yellow-600 group-hover:text-yellow-700" />
                    <span className="text-xs font-medium text-yellow-700">Click here to sign</span>
                  </button>
                )}
                <p className="text-xs text-gray-500 mt-1">Authorized Signatory</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Submit */}
        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0 bg-gray-50 rounded-b-lg">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <PenTool className="w-3.5 h-3.5" />
            <span>By submitting, you agree this electronic signature is legally binding.</span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!signed || submitting}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${signed && !submitting ? "bg-[#4F8DFF] text-white hover:bg-[#3A7AE8]" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
          >
            {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
