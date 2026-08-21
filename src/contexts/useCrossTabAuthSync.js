import { useEffect, useRef } from 'react';
import { clearStoredSession, getStorageKeys, readSession } from './authSession';

const AUTH_CHANNEL = 'ea-sc-dash-auth';

export const broadcastAuthLogout = (mode, env) => {
  try {
    const channel = new BroadcastChannel(AUTH_CHANNEL);
    channel.postMessage({ type: 'logout', mode, env });
    channel.close();
  } catch {
    /* unsupported */
  }
};

/** Keep this tab logged out when another tab of the same project+env logs out. */
export const useCrossTabAuthSync = (mode, env, isAuthenticated, onLoggedOut) => {
  const onLoggedOutRef = useRef(onLoggedOut);
  const isAuthenticatedRef = useRef(isAuthenticated);
  onLoggedOutRef.current = onLoggedOut;
  isAuthenticatedRef.current = isAuthenticated;

  useEffect(() => {
    const tokenKey = getStorageKeys(mode, env).token;

    const syncFromStorage = () => {
      if (!isAuthenticatedRef.current) return;
      if (readSession(mode, env)) return;
      clearStoredSession(mode, env);
      onLoggedOutRef.current();
    };

    const onStorage = (event) => {
      if (event.key === tokenKey && event.newValue) return;
      if (event.key != null && event.key !== tokenKey) return;
      syncFromStorage();
    };

    const onVisible = () => {
      if (document.visibilityState === 'visible') syncFromStorage();
    };

    const onChannelMessage = (event) => {
      const msg = event.data;
      if (msg?.type !== 'logout') return;
      if (msg.mode !== mode || msg.env !== env) return;
      syncFromStorage();
    };

    let channel;
    try {
      channel = new BroadcastChannel(AUTH_CHANNEL);
      channel.addEventListener('message', onChannelMessage);
    } catch {
      channel = null;
    }

    window.addEventListener('storage', onStorage);
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('pageshow', onVisible);
    return () => {
      channel?.removeEventListener('message', onChannelMessage);
      channel?.close();
      window.removeEventListener('storage', onStorage);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('pageshow', onVisible);
    };
  }, [mode, env]);
};
