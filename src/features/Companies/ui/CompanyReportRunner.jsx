import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import CompanyReportModal from './CompanyReportModal';
import ExhibitorReportModal from './ExhibitorReportModal';
import ExhibitorEngagementReportModal from './ExhibitorEngagementReportModal';
import CompanyQuickReportModal from './CompanyQuickReportModal';

/**
 * Opens the run dialog for one catalog report. Existing reports reuse their own modals;
 * the newly wired ones use CompanyQuickReportModal.
 */
export default function CompanyReportRunner({ report, eventId, token, onClose }) {
  const { logout } = useAuth();
  const [parentId, setParentId] = useState('');

  if (report.id === 'company_metrics') {
    return (
      <CompanyReportModal
        eventId={eventId}
        token={token}
        parentExhibitorId={parentId}
        onParentChange={setParentId}
        onClose={onClose}
      />
    );
  }
  if (report.id === 'exhibitor_csv') {
    return (
      <ExhibitorReportModal eventId={eventId} token={token} onUnauthorized={logout} onClose={onClose} />
    );
  }
  if (report.id === 'engagement_csv') {
    return (
      <ExhibitorEngagementReportModal
        eventId={eventId}
        token={token}
        onUnauthorized={logout}
        onClose={onClose}
      />
    );
  }
  return <CompanyQuickReportModal report={report} eventId={eventId} token={token} onClose={onClose} />;
}
