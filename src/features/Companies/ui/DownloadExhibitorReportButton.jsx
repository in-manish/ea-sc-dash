import { useState } from 'react';
import { FileSpreadsheet } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import ExhibitorReportModal from './ExhibitorReportModal';

/** Header "Reports" button — opens the exhibitor report modal. */
export default function DownloadExhibitorReportButton({
  eventId,
  token,
  companies = [],
  selectedIds = new Set(),
}) {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => setOpen(true)}
        disabled={!eventId || !token}
        title="Download or email exhibitor report"
      >
        <FileSpreadsheet size={16} style={{ marginRight: '0.5rem' }} />
        Reports
      </button>
      {open && (
        <ExhibitorReportModal
          eventId={eventId}
          token={token}
          companies={companies}
          selectedIds={selectedIds}
          onUnauthorized={logout}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
