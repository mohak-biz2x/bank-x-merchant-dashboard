import { useState } from "react";
import { HelpCircle } from "lucide-react";
import { HelpContactForm } from "./HelpContactForm";

interface HelpWidgetProps {
  currentContext: string;
}

export function HelpWidget({ currentContext }: HelpWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 z-[80] w-12 h-12 bg-[#4F8DFF] hover:bg-[#3A7AE8] text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
        aria-label="Help & Support"
      >
        <HelpCircle className="w-6 h-6" />
      </button>

      <HelpContactForm
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        currentContext={currentContext}
      />
    </>
  );
}
