import { Calendar, Loader2, X } from 'lucide-react';
import { formatCampaignDate } from '../domain/campaignHelpers';

export default function RescheduleCampaignModal({
  campaign,
  saving,
  onClose,
  onConfirm,
}) {
  if (!campaign) return null;

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <form
        className="bg-bg-primary rounded-2xl shadow-2xl border border-border w-full max-w-md overflow-hidden"
        onSubmit={(e) => {
          e.preventDefault();
          const value = new FormData(e.currentTarget).get('datetime');
          onConfirm(value);
        }}
      >
        <header className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-text-primary flex items-center gap-2">
            <Calendar size={18} className="text-accent" />
            Reschedule campaign
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-text-tertiary hover:text-text-primary border-none bg-transparent cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </header>
        <div className="p-6">
          <p className="text-sm text-text-secondary mb-2">
            New date and time for <strong className="text-text-primary">{campaign.name}</strong>.
          </p>
          <p className="text-xs text-accent bg-accent/5 border border-accent/20 rounded-lg px-3 py-2 mb-4">
            Current: {formatCampaignDate(campaign.scheduled_time)}
          </p>
          <label className="block text-sm font-medium text-text-primary mb-2" htmlFor="campaign-reschedule">
            New date & time
          </label>
          <input
            id="campaign-reschedule"
            name="datetime"
            type="datetime-local"
            required
            className="w-full border border-border rounded-lg px-4 py-2.5 bg-bg-primary text-text-primary outline-none focus:ring-2 focus:ring-accent mb-6"
          />
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn btn-secondary btn-sm">
              Close
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary btn-sm inline-flex items-center gap-2">
              {saving && <Loader2 size={16} className="animate-spin" />}
              Confirm reschedule
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
