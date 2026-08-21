import { AlertCircle } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useExhibitorEngagement } from '../hooks/useExhibitorEngagement';
import ExhibitorEngagementSummary from './ExhibitorEngagementSummary';
import ExhibitorEngagementSkeleton from './ExhibitorEngagementSkeleton';
import ActivationFunnel from './ActivationFunnel';

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
        <button type="button" className="btn btn-secondary mt-4" onClick={reload}>
          Try again
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="animate-fade-in">
      <ExhibitorEngagementSummary data={data} refreshing={refreshing} onRefresh={refresh} />
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
    </div>
  );
}
