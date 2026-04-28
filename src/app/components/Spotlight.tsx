import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

interface SpotlightProps {
  targetRef: React.RefObject<HTMLElement | null>;
  message: string;
  onDismiss: () => void;
}

export function Spotlight({ targetRef, message, onDismiss }: SpotlightProps) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const update = () => {
      if (targetRef.current) {
        setRect(targetRef.current.getBoundingClientRect());
      }
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [targetRef]);

  if (!rect) return null;

  const pad = 6;

  return (
    <div className="fixed inset-0 z-[55]" onClick={onDismiss}>
      {/* Overlay with cutout */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <mask id="spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <rect
              x={rect.left - pad}
              y={rect.top - pad}
              width={rect.width + pad * 2}
              height={rect.height + pad * 2}
              rx="10"
              fill="black"
            />
          </mask>
        </defs>
        <rect
          x="0" y="0" width="100%" height="100%"
          fill="rgba(0,0,0,0.5)"
          mask="url(#spotlight-mask)"
        />
      </svg>

      {/* Callout */}
      <div
        className="absolute bg-white rounded-lg shadow-xl border border-gray-200 px-4 py-3 max-w-xs"
        style={{
          left: Math.min(rect.left, window.innerWidth - 300),
          top: rect.bottom + 12,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-2">
          <p className="text-sm text-gray-700 flex-1">{message}</p>
          <button onClick={onDismiss} className="text-gray-400 hover:text-gray-600 flex-shrink-0 mt-0.5">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="absolute -top-2 left-6 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45" />
      </div>
    </div>
  );
}
