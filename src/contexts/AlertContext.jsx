/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useRef } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

const AlertContext = createContext(null);

export const AlertProvider = ({ children }) => {
    const [alertState, setAlertState] = useState({
        isOpen: false,
        message: '',
        type: 'info', // 'info' | 'success' | 'error' | 'confirm'
        title: '',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        onConfirm: null,
        onCancel: null
    });

    const promiseRef = useRef(null);

    const showAlert = (message, type = 'info', title = '') => {
        const defaultTitles = {
            info: 'Notice',
            success: 'Success',
            error: 'Error',
            confirm: 'Confirmation'
        };
        
        return new Promise((resolve) => {
            promiseRef.current = resolve;
            setAlertState({
                isOpen: true,
                message,
                type,
                title: title || defaultTitles[type] || 'Alert',
                confirmText: 'OK',
                cancelText: '',
                onConfirm: () => {
                    setAlertState(prev => ({ ...prev, isOpen: false }));
                    resolve(true);
                },
                onCancel: null
            });
        });
    };

    const showConfirm = (message, options = {}) => {
        const { title = 'Confirm Action', confirmText = 'Confirm', cancelText = 'Cancel' } = options;
        return new Promise((resolve) => {
            promiseRef.current = resolve;
            setAlertState({
                isOpen: true,
                message,
                type: 'confirm',
                title,
                confirmText,
                cancelText,
                onConfirm: () => {
                    setAlertState(prev => ({ ...prev, isOpen: false }));
                    resolve(true);
                },
                onCancel: () => {
                    setAlertState(prev => ({ ...prev, isOpen: false }));
                    resolve(false);
                }
            });
        });
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            if (alertState.type === 'confirm') {
                if (alertState.onCancel) alertState.onCancel();
            } else {
                if (alertState.onConfirm) alertState.onConfirm();
            }
        }
    };

    return (
        <AlertContext.Provider value={{ showAlert, showConfirm }}>
            {children}
            {alertState.isOpen && (
                <div 
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in"
                    onClick={handleBackdropClick}
                >
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl max-w-md w-full overflow-hidden p-6 md:p-8 flex flex-col items-center text-center space-y-6 relative max-h-[90vh]">
                        {/* Header/Icon */}
                        <div className="flex flex-col items-center space-y-4">
                            <div className={`p-4 rounded-2xl ${
                                alertState.type === 'success' ? 'bg-emerald-50 text-emerald-500' :
                                alertState.type === 'error' ? 'bg-rose-50 text-rose-500' :
                                alertState.type === 'confirm' ? 'bg-amber-50 text-amber-500' :
                                'bg-sky-50 text-sky-500'
                            }`}>
                                {alertState.type === 'success' && <CheckCircle2 size={32} />}
                                {alertState.type === 'error' && <AlertCircle size={32} />}
                                {alertState.type === 'confirm' && <AlertCircle size={32} />}
                                {alertState.type === 'info' && <Info size={32} />}
                            </div>
                            
                            <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">
                                {alertState.title}
                            </h3>
                        </div>

                        {/* Content */}
                        <div className="text-sm font-medium text-slate-500 leading-relaxed max-w-xs break-words">
                            {alertState.message}
                        </div>

                        {/* Actions */}
                        <div className="flex w-full gap-4 pt-2">
                            {alertState.cancelText && (
                                <button
                                    onClick={alertState.onCancel}
                                    className="flex-1 px-6 py-3.5 border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-700 font-bold uppercase tracking-widest text-[10px] rounded-2xl transition-all active:scale-95 shadow-sm"
                                >
                                    {alertState.cancelText}
                                </button>
                            )}
                            <button
                                onClick={alertState.onConfirm}
                                className={`flex-1 px-6 py-3.5 text-white font-bold uppercase tracking-widest text-[10px] rounded-2xl transition-all active:scale-95 shadow-md ${
                                    alertState.type === 'error' ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-200' :
                                    alertState.type === 'confirm' ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200' :
                                    alertState.type === 'success' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200' :
                                    'bg-slate-900 hover:bg-slate-800 shadow-slate-200'
                                }`}
                            >
                                {alertState.confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AlertContext.Provider>
    );
};

export const useAlert = () => useContext(AlertContext);
