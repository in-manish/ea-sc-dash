import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import {
  COMPANY_REMIND_STATUS_LABELS,
  companiesFromAddlData,
  companySteps,
  formatStepId,
} from '../domain/checklistReminderHelpers';

/** Per-company dump from reminder log addl_data (steps[] shape). */
export default function ChecklistReminderCompanies({ eventId, companies }) {
  if (!companies?.length) {
    return (
      <p className="m-0 text-xs text-text-tertiary px-4 py-3">
        No per-company detail for this log.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto border-t border-border bg-bg-secondary/40">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-border text-[10px] uppercase tracking-wide text-text-tertiary">
            <th className="px-4 py-2 font-semibold">Company</th>
            <th className="px-4 py-2 font-semibold">Steps</th>
            <th className="px-4 py-2 font-semibold">Recipient</th>
            <th className="px-4 py-2 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((c, i) => (
            <tr
              key={`${c.company_id}-${i}`}
              className="border-b border-border/60 last:border-0 align-top"
            >
              <td className="px-4 py-2 text-text-primary">
                <CompanyLink eventId={eventId} company={c} />
              </td>
              <td className="px-4 py-2 text-text-primary">
                <StepsList steps={companySteps(c)} />
              </td>
              <td className="px-4 py-2 text-text-primary">
                <RecipientLink eventId={eventId} company={c} />
              </td>
              <td className="px-4 py-2">
                <CompanyStatusChip status={c.status} error={c.error} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function logCompanies(row) {
  return companiesFromAddlData(row);
}

function StepsList({ steps }) {
  if (!steps.length) return <span className="text-text-tertiary">—</span>;
  return (
    <ul className="m-0 p-0 list-none flex flex-col gap-1.5">
      {steps.map((s, i) => {
        const title = s.step_title || (s.step_id ? formatStepId(s.step_id) : '—');
        return (
          <li key={`${s.step_id || title}-${i}`} className="flex flex-col gap-0.5">
            <span className="capitalize">
              {s.cta_url ? (
                <a
                  href={s.cta_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-accent hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {title}
                  <ExternalLink size={11} />
                </a>
              ) : (
                title
              )}
            </span>
            {s.deadline && (
              <span className="text-[10px] text-text-tertiary">Due {s.deadline}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function CompanyLink({ eventId, company }) {
  const id = company.company_id;
  const name = company.company_name || (id != null ? `Company #${id}` : '—');
  if (eventId == null || id == null) {
    return (
      <span>
        {name}
        {company.company_name && id != null && (
          <span className="text-text-tertiary ml-1">#{id}</span>
        )}
      </span>
    );
  }
  return (
    <Link
      to={`/event/${eventId}/companies/${id}`}
      className="text-accent hover:underline font-medium"
      onClick={(e) => e.stopPropagation()}
    >
      {company.company_name || `Company #${id}`}
      {company.company_name && (
        <span className="text-text-tertiary ml-1 font-normal">#{id}</span>
      )}
    </Link>
  );
}

function RecipientLink({ eventId, company }) {
  const name = company.badge_name;
  const email = company.badge_email;
  const badgeId = company.badge_id;
  if (!name && !email) return <span>—</span>;

  const q = email || (badgeId != null ? String(badgeId) : '');
  const to =
    eventId != null && q
      ? `/event/${eventId}/attendees?q=${encodeURIComponent(q)}`
      : null;

  const body = (
    <div className="flex flex-col gap-0.5">
      <span className={to ? 'font-medium' : undefined}>{name || '—'}</span>
      {email && <span className="text-text-tertiary">{email}</span>}
    </div>
  );

  if (!to) return body;

  return (
    <Link
      to={to}
      className="text-accent hover:underline block"
      onClick={(e) => e.stopPropagation()}
      title="Open in Attendees"
    >
      {body}
    </Link>
  );
}

function CompanyStatusChip({ status, error }) {
  const label = COMPANY_REMIND_STATUS_LABELS[status] || status || '—';
  const tone =
    status === 'sent'
      ? 'bg-green-50 text-green-800 border-green-200'
      : status === 'error'
        ? 'bg-red-50 text-red-800 border-red-200'
        : status === 'skipped'
          ? 'bg-amber-50 text-amber-900 border-amber-200'
          : 'bg-bg-tertiary text-text-primary border-border';

  return (
    <span
      className={`inline-flex flex-col gap-0.5 py-0.5 px-2 rounded text-[11px] font-medium border ${tone}`}
      title={error || undefined}
    >
      {label}
      {error && (
        <span className="font-normal opacity-80 max-w-[160px] truncate">{error}</span>
      )}
    </span>
  );
}
