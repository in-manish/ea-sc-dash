import { AlertCircle } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useExhibitorEngagement } from '../hooks/useExhibitorEngagement';
import ExhibitorEngagementSummary from './ExhibitorEngagementSummary';
import ExhibitorEngagementSkeleton from './ExhibitorEngagementSkeleton';
import ExhibitorEngagementReportButton from './ExhibitorEngagementReportButton';
import ActivationFunnel from './ActivationFunnel';
import InviteTypeBreakdown from './InviteTypeBreakdown';

export default function ExhibitorEngagementTab({ eventId, token }) {
  const { logout } = useAuth();
  const { data, loading, refreshing, error, reload, refresh } = useExhibitorEngagement({
    eventId,
    token,
    onUnauthorized: logout,
  });

  if (loading) return <ExhibitorEngagementSkeleton />;

  if (error && !data) {
    return (
      <div className="bg-bg-primary border border-border rounded-xl p-8 text-center shadow-sm">
        <AlertCircle size={28} className="mx-auto text-rose-500 mb-3" />
        <p className="m-0 text-sm text-text-primary">{error}</p>
        <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
          <button type="button" className="btn btn-secondary" onClick={reload}>
            Try again
          </button>
          <ExhibitorEngagementReportButton eventId={eventId} token={token} />
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="animate-fade-in">
      <ExhibitorEngagementSummary
        data={data}
        refreshing={refreshing}
        onRefresh={refresh}
        eventId={eventId}
        token={token}
      />
      {error && (
        <p className="mb-4 text-sm text-rose-600" role="alert">
          {error}
        </p>
      )}
      <ActivationFunnel
        title={data.funnelTitle}
        steps={data.steps}
        totalExhibitors={data.totalExhibitors}
      />
      <InviteTypeBreakdown types={data.inviteTypes} />
    </div>
  );
}
