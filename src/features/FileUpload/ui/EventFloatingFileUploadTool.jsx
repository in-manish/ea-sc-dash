import { useLocation } from 'react-router-dom';
import FloatingFileUploadTool from './FloatingFileUploadTool';

/** Hide the generic upload FAB on Companies — that page already has Upload CSV. */
export default function EventFloatingFileUploadTool() {
  const { pathname } = useLocation();
  if (pathname.includes('/companies')) return null;
  return <FloatingFileUploadTool />;
}
