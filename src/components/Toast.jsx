import React, { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeConfig = {
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-200 dark:border-emerald-800/60',
      text: 'text-emerald-800 dark:text-emerald-200',
      iconText: 'text-emerald-500',
      Icon: CheckCircle
    },
    error: {
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      border: 'border-rose-200 dark:border-rose-800/60',
      text: 'text-rose-800 dark:text-rose-200',
      iconText: 'text-rose-500',
      Icon: AlertCircle
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-200 dark:border-amber-800/60',
      text: 'text-amber-800 dark:text-amber-200',
      iconText: 'text-amber-500',
      Icon: AlertTriangle
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      border: 'border-blue-200 dark:border-blue-800/60',
      text: 'text-blue-800 dark:text-blue-200',
      iconText: 'text-blue-500',
      Icon: Info
    }
  };

  const current = typeConfig[type] || typeConfig.success;
  const { Icon } = current;

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center justify-between space-x-3 rounded-2xl border ${current.bg} ${current.border} p-4 shadow-xl backdrop-blur-md animate-slide-up max-w-sm w-full md:w-auto`}>
      <div className="flex items-center space-x-3">
        <Icon className={`h-5 w-5 ${current.iconText}`} />
        <span className={`text-sm font-medium ${current.text}`}>{message}</span>
      </div>
      <button 
        onClick={onClose} 
        className="rounded-lg p-1 text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-800/50 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
