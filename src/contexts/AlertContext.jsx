/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import AlertModal from '../components/alert/AlertModal';
import { ALERT_DEFAULT_TITLES } from '../components/alert/alertTypes';
import useNativeAlertBridge from '../components/alert/useNativeAlertBridge';

const AlertContext = createContext(null);

const closeDialog = (currentRef, queueRef, setDialog, value) => {
    currentRef.current?.resolve(value);
    const next = queueRef.current.shift() || null;
    currentRef.current = next;
    setDialog(next);
};

export const AlertProvider = ({ children }) => {
    const [dialog, setDialog] = useState(null);
    const currentRef = useRef(null);
    const queueRef = useRef([]);

    const present = useCallback((spec) => {
        return new Promise((resolve) => {
            const item = { ...spec, resolve };
            if (currentRef.current) {
                queueRef.current.push(item);
                return;
            }
            currentRef.current = item;
            setDialog(item);
        });
    }, []);

    const showAlert = useCallback((message, type = 'info', title = '') => {
        return present({
            type,
            title: title || ALERT_DEFAULT_TITLES[type] || ALERT_DEFAULT_TITLES.info,
            message: message == null ? '' : String(message),
            confirmText: 'OK',
            cancelText: '',
            variant: type === 'error' ? 'danger' : 'primary',
        });
    }, [present]);

    const showConfirm = useCallback((message, options = {}) => {
        const {
            title = ALERT_DEFAULT_TITLES.confirm,
            confirmText = 'Confirm',
            cancelText = 'Cancel',
            variant = 'primary',
        } = options;
        return present({
            type: 'confirm',
            title,
            message: message == null ? '' : String(message),
            confirmText,
            cancelText,
            variant,
        });
    }, [present]);

    const resolve = useCallback((value) => {
        closeDialog(currentRef, queueRef, setDialog, value);
    }, []);

    useNativeAlertBridge(showAlert);

    return (
        <AlertContext.Provider value={{ showAlert, showConfirm }}>
            {children}
            {dialog ? (
                <AlertModal
                    type={dialog.type}
                    title={dialog.title}
                    message={dialog.message}
                    confirmText={dialog.confirmText}
                    cancelText={dialog.cancelText}
                    variant={dialog.variant}
                    onConfirm={() => resolve(true)}
                    onCancel={dialog.type === 'confirm' ? () => resolve(false) : null}
                />
            ) : null}
        </AlertContext.Provider>
    );
};

export const useAlert = () => {
    const ctx = useContext(AlertContext);
    if (!ctx) {
        throw new Error('useAlert must be used within AlertProvider');
    }
    return ctx;
};
