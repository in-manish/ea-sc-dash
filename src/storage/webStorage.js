/** sessionStorage first; localStorage backup so a new tab can restore the same login. */

export const storageGet = (key) => {
  try {
    return sessionStorage.getItem(key) || localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const storageSet = (key, value) => {
  sessionStorage.setItem(key, value);
  try {
    localStorage.setItem(key, value);
  } catch {
    /* private mode / quota */
  }
};

export const storageRemove = (key) => {
  sessionStorage.removeItem(key);
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
};

/**
 * Logout can only clear this tab's sessionStorage. Other tabs still hold a copy.
 * If localStorage no longer has the token, drop this tab's session keys.
 */
export const discardTabSessionIfLoggedOut = (tokenKey, allKeys) => {
  try {
    if (localStorage.getItem(tokenKey) != null) return;
    if (sessionStorage.getItem(tokenKey) == null) return;
    allKeys.forEach((key) => sessionStorage.removeItem(key));
  } catch {
    /* localStorage blocked — keep this tab's sessionStorage */
  }
};
