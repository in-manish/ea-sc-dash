import { useEffect } from 'react';

/** Route native window.alert through the themed AlertModal. */
export default function useNativeAlertBridge(showAlert) {
    useEffect(() => {
        const nativeAlert = window.alert.bind(window);
        window.alert = (message) => {
            void showAlert(message == null ? '' : String(message));
        };
        return () => {
            window.alert = nativeAlert;
        };
    }, [showAlert]);
}
