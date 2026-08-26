import { Loader2, X } from 'lucide-react';
import { campaignBodySrcDoc, formatCampaignDate } from '../domain/campaignHelpers';
import CampaignStatusBadge from './CampaignStatusBadge';

function Meta({ label, children }) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary mb-1">{label}</div>
      <div className="text-sm font-medium text-text-primary break-words">{children}</div>
    </div>
  );
}

export default function CampaignDetailModal({ campaign, loading, error, onClose }) {
  if (!campaign && !loading) return null;

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-bg-primary rounded-2xl shadow-2xl border border-border w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        <header className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0">
          <h3 className="text-lg font-semibold text-text-primary truncate pr-4">
            {campaign?.name || 'Campaign details'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-text-tertiary hover:text-text-primary hover:bg-bg-secondary rounded-lg border-none bg-transparent cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {loading && (
            <div className="flex justify-center py-12 text-text-tertiary">
              <Loader2 className="animate-spin" size={24} />
            </div>
          )}
          {error && (
            <div className="text-sm text-danger bg-danger/5 border border-danger/20 rounded-xl px-4 py-3">
              {error}
            </div>
          )}
          {!loading && campaign?.created_at && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Meta label="Subject">{campaign.subject || '—'}</Meta>
                <Meta label="Status"><CampaignStatusBadge status={campaign.status} /></Meta>
                <Meta label="Recipients">{campaign.number_recipients ?? 0}</Meta>
                <Meta label="Scheduled">{formatCampaignDate(campaign.scheduled_time)}</Meta>
                <Meta label="Created">{formatCampaignDate(campaign.created_at)}</Meta>
                <Meta label="Event">{campaign.event_name || '—'}</Meta>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary mb-2">
                  Body
                </div>
                <iframe
                  title="Campaign body"
                  srcDoc={campaignBodySrcDoc(campaign.body)}
                  sandbox="allow-same-origin allow-popups"
                  className="w-full min-h-[360px] h-[50vh] bg-white rounded-xl border border-border"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
