import React, { createContext, useContext } from 'react';
import { useToast, Toast } from './use-toast';

const ToastContext = createContext<ReturnType<typeof useToast> | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const toast = useToast();

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-0 right-0 p-4 space-y-4 z-50">
        {toast.toasts.map((t) => (
          <div
            key={t.id}
            className={`p-4 rounded-lg shadow-lg ${
              t.variant === 'destructive' ? 'bg-red-100 text-red-900' : 'bg-white text-gray-900'
            }`}
          >
            {t.title && <div className="font-semibold">{t.title}</div>}
            <div>{t.description}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
}; 