import { useNavigate } from 'react-router-dom';
import { ExternalLink, Bell } from 'lucide-react';
import {
  completionStatusClasses,
  formatDeadlineLabel,
  resolvePortalRoute,
  statusTypeClasses,
  urgencyClasses,
} from '../domain/setupChecklistHelpers';

export default function SetupProgressStep({
  step,
  isRecommended,
  eventId,
  companyId,
  onRemind,
  reminding,
}) {
  const navigate = useNavigate();
  const openPath = resolvePortalRoute(step.portal_route, { eventId, companyId });
  const deadlineLabel = formatDeadlineLabel(step.deadline, step.deadline_urgency);
  const isComplete = String(step.completion_status || '').toLowerCase() === 'completed';

  return (
    <div
      className={`rounded-md border p-4 transition-colors ${
        isRecommended
          ? 'border-accent bg-bg-tertiary/60 ring-1 ring-accent/30'
          : 'border-border bg-bg-secondary'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            {isRecommended && (
              <span className="inline-flex py-0.5 px-2 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-accent text-white">
                Next
              </span>
            )}
            <h4 className="text-sm font-semibold text-text-primary m-0">{step.title}</h4>
          </div>
          {step.description && (
            <p className="text-xs text-text-secondary m-0 mb-2">{step.description}</p>
          )}
          <div className="flex flex-wrap gap-1.5 items-center">
            {step.status_type && (
              <span
                className={`inline-flex py-0.5 px-2 rounded text-[10px] font-medium border capitalize ${statusTypeClasses(step.status_type)}`}
              >
                {step.status_type}
              </span>
            )}
            {step.completion_status && (
              <span
                className={`inline-flex py-0.5 px-2 rounded text-[10px] font-medium border ${completionStatusClasses(step.completion_status)}`}
              >
                {step.completion_status}
              </span>
            )}
            {deadlineLabel && (
              <span
                className={`inline-flex py-0.5 px-2 rounded text-[10px] font-medium border ${urgencyClasses(step.deadline_urgency)}`}
              >
                {deadlineLabel}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!isComplete && onRemind && (
            <button
              type="button"
              className="btn btn-secondary btn-sm inline-flex items-center gap-1.5 disabled:opacity-50"
              disabled={reminding}
              onClick={() => onRemind(step)}
              title="Send setup reminder"
            >
              <Bell size={14} />
              Remind
            </button>
          )}
          {openPath && (
            <button
              type="button"
              className="btn btn-primary btn-sm inline-flex items-center gap-1.5"
              onClick={() => navigate(openPath)}
            >
              Open
              <ExternalLink size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
