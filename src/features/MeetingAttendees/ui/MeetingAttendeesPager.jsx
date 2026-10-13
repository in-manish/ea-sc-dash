import { PAGE_SIZE } from '../constants';

export default function MeetingAttendeesPager({ page, total, onPage, disabled }) {
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  return (
    <div className="flex items-center justify-between text-sm text-text-secondary">
      <span>{total} attendees</span>
      <div className="flex items-center gap-2">
        <button type="button" className="btn btn-secondary" disabled={disabled || page <= 1} onClick={() => onPage(page - 1)}>Previous</button>
        <span>Page {page} of {pages}</span>
        <button type="button" className="btn btn-secondary" disabled={disabled || page >= pages} onClick={() => onPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}
