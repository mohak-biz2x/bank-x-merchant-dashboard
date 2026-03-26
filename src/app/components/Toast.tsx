import { useState, useEffect, useCallback } from "react";
import { CheckCircle, X, AlertCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
}

const ICONS = { success: CheckCircle, error: AlertCircle, info: Info };
const COLORS = {
  success: "bg-green-50 border-green-300 text-green-800",
  error: "bg-red-50 border-red-300 text-red-800",
  info: "bg-blue-50 border-blue-300 text-blue-800",
};
const ICON_COLORS = { success: "text-green-600", error: "text-red-600", info: "text-blue-600" };

let addToastGlobal: ((type: ToastType, message: string) => void) | null = null;

export function showToast(type: ToastType, message: string) {
  if (addToastGlobal) addToastGlobal(type, message);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  useEffect(() => { addToastGlobal = addToast; return () => { addToastGlobal = null; }; }, [addToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2">
      {toasts.map(toast => {
        const Icon = ICONS[toast.type];
        return (
          <div key={toast.id} className={`flex items-center gap-3 px-4 py-3 border rounded shadow-lg min-w-[300px] max-w-[420px] animate-slide-in ${COLORS[toast.type]}`}>
            <Icon className={`w-5 h-5 flex-shrink-0 ${ICON_COLORS[toast.type]}`} />
            <p className="text-sm flex-1">{toast.message}</p>
            <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
          </div>
        );
      })}
    </div>
  );
}
