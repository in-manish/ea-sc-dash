import { Mail } from 'lucide-react';

export default function MeetingAttendeesSelectionBar({ selection, total, pageCount, onSendEmail }) {
  const { selectedUuids, selectAll, setSelectAll, clear } = selection;
  const chosen = selectAll ? total : selectedUuids.length;
  if (chosen === 0) return null;
  const canSelectAll = !selectAll && total > selectedUuids.length && selectedUuids.length >= pageCount;

  return (
    <div className="flex flex-wrap items-center gap-3 p-3 bg-accent/5 border border-accent/20 rounded-lg">
      <span className="text-sm text-text-primary">
        {selectAll ? `All ${total} attendees matching the filter selected` : `${chosen} selected`}
      </span>
      {canSelectAll && (
        <button type="button" className="text-sm text-accent bg-transparent border-none cursor-pointer p-0 underline" onClick={() => setSelectAll(true)}>
          Select all {total} matching the filter
        </button>
      )}
      <button type="button" className="text-sm text-text-secondary bg-transparent border-none cursor-pointer p-0 underline" onClick={clear}>
        Clear
      </button>
      <button type="button" className="btn btn-primary ml-auto inline-flex items-center gap-1.5" onClick={onSendEmail}>
        <Mail size={14} /> Send email
      </button>
    </div>
  );
}
