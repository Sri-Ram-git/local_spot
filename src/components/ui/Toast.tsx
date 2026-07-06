import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

type ToastVariant = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  addToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const iconMap: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle className="h-5 w-5 text-emerald-500" />,
  error: <XCircle className="h-5 w-5 text-red-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />,
};

const borderMap: Record<ToastVariant, string> = {
  success: 'border-l-emerald-500',
  error: 'border-l-red-500',
  info: 'border-l-blue-500',
};

const ToastItem: React.FC<{ toast: Toast; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className={`
        flex items-center gap-3 rounded-lg border border-zinc-200 dark:border-zinc-700
        bg-white dark:bg-zinc-900 px-4 py-3 shadow-lg shadow-zinc-900/10
        border-l-4 ${borderMap[toast.variant]}
        min-w-[300px] max-w-[420px]
      `}
    >
      <span className="shrink-0">{iconMap[toast.variant]}</span>
      <p className="flex-1 text-sm text-zinc-700 dark:text-zinc-300">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="shrink-0 rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
};

export const ToastContainer: React.FC = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) return null;
  const { removeToast, toasts } = ctx as unknown as {
    toasts: Toast[];
    removeToast: (id: string) => void;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onRemove={removeToast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, variant: ToastVariant = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setToasts((prev) => [...prev, { id, message, variant }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}

export { ToastContext };
export type { Toast, ToastVariant };
