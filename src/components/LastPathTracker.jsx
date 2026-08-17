import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getDashboardMode, getEnv } from '../config';
import { saveLastPath } from '../contexts/authSession';

/** Keep a resume URL so opening the host (no /ea|/sc) returns to this page. */
const LastPathTracker = () => {
  const location = useLocation();

  useEffect(() => {
    saveLastPath(getDashboardMode(), getEnv());
  }, [location.pathname, location.search]);

  return null;
};

export default LastPathTracker;
