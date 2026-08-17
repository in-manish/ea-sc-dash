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
