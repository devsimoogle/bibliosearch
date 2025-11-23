
import React, { useEffect } from 'react';
import { CheckCircleIcon, XIcon, SparklesIcon } from './Icons';
import { ToastMessage } from '../types';

interface ToastProps {
  toast: ToastMessage;
  onClose: () => void;
}

export const Toast = ({ toast, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto dismiss after 3s

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const bgColors = {
    success: 'bg-library-900 border-library-700',
    error: 'bg-red-900 border-red-700',
    info: 'bg-blue-900 border-blue-700'
  };

  const icons = {
    success: <CheckCircleIcon className="w-5 h-5 text-green-400" />,
    error: <XIcon className="w-5 h-5 text-red-400" />,
    info: <SparklesIcon className="w-5 h-5 text-blue-400" />
  };

  return (
    <div className={`fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border ${bgColors[toast.type]} text-white animate-slide-up max-w-sm`}>
      <div className="shrink-0">
        {icons[toast.type]}
      </div>
      <div className="flex-1">
        <p className="font-medium text-sm">{toast.message}</p>
      </div>
      <button onClick={onClose} className="opacity-60 hover:opacity-100 transition-opacity">
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  );
};
