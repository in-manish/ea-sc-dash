import { useState } from 'react';
import { FileSpreadsheet } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import ExhibitorEngagementReportModal from './ExhibitorEngagementReportModal';

export default function ExhibitorEngagementReportButton({ eventId, token }) {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="btn btn-secondary inline-flex items-center"
        onClick={() => setOpen(true)}
        disabled={!eventId || !token}
        title="Download or email exhibitor engagement CSV"
      >
        <FileSpreadsheet size={16} className="mr-2" />
        Engagement report
      </button>
      {open && (
        <ExhibitorEngagementReportModal
          eventId={eventId}
          token={token}
          onUnauthorized={logout}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
