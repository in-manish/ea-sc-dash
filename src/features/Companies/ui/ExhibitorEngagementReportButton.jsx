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
        className="btn btn-secondary"
        onClick={() => setOpen(true)}
        disabled={!eventId || !token}
        title="Download or email portal matchmaking CSV"
      >
        <FileSpreadsheet size={16} style={{ marginRight: '0.5rem' }} />
        Matchmaking CSV
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
