'use client';

import { useState, createContext, useContext, useCallback } from 'react';
import type { ReactNode } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
    success: (message: string) => void;
    error: (message: string) => void;
    warning: (message: string) => void;
}

const ToastContext = createContext<ToastContextType>({
    showToast: () => { },
    success: () => { },
    error: () => { },
    warning: () => { },
});

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).slice(2);
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    }, []);

    const success = useCallback((msg: string) => showToast(msg, 'success'), [showToast]);
    const error = useCallback((msg: string) => showToast(msg, 'error'), [showToast]);
    const warning = useCallback((msg: string) => showToast(msg, 'warning'), [showToast]);

    const icons = {
        success: <CheckCircle2 size={20} className="text-green-500 shrink-0" />,
        error: <XCircle size={20} className="text-red-500 shrink-0" />,
        warning: <AlertTriangle size={20} className="text-amber-500 shrink-0" />,
        info: <Info size={20} className="text-blue-500 shrink-0" />,
    };

    const styles = {
        success: 'bg-surface-light dark:bg-surface-dark border-green-500/20 shadow-green-500/5',
        error: 'bg-surface-light dark:bg-surface-dark border-red-500/20 shadow-red-500/5',
        warning: 'bg-surface-light dark:bg-surface-dark border-amber-500/20 shadow-amber-500/5',
        info: 'bg-surface-light dark:bg-surface-dark border-blue-500/20 shadow-blue-500/5',
    };

    return (
        <ToastContext.Provider value={{ showToast, success, error, warning }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[100] space-y-3 max-w-sm w-full px-4 sm:px-0 pointer-events-none">
                <AnimatePresence>
                    {toasts.map(toast => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 20, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            className={`pointer-events-auto flex items-start gap-4 p-5 rounded-[1.25rem] border shadow-2xl backdrop-blur-md ${styles[toast.type]}`}
                        >
                            {icons[toast.type]}
                            <p className="text-sm font-bold text-fg flex-1 leading-relaxed">{toast.message}</p>
                            <button 
                                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                                className="shrink-0 text-muted hover:text-fg transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    return useContext(ToastContext);
}