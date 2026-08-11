import { Building2, Globe, Phone, Ticket, LayoutDashboard, Users, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CompanyHandoverDetails from './CompanyHandoverDetails';
import { hasHandoverSignature } from '../domain/parseHandoverDetails';

/** Existing 4 cards — company detail API only (not Overview API). */
export default function CompanyDetailsInfoGrid({ company, eventId }) {
  const navigate = useNavigate();
  const handoverDone = hasHandoverSignature(company.handover_details);
  const handedOver = Boolean(company.all_badges_handed_over) || handoverDone;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-bg-primary border border-border rounded-lg p-4 shadow-sm">
        <h3 className="text-xs font-semibold uppercase text-text-tertiary mb-3 flex items-center gap-2 border-b border-border pb-2">
          <Building2 size={16} /> Overview
        </h3>
        <div className="flex flex-col gap-2.5">
          <Field label="OBF Number" value={company.obf_number} />
          <Field label="Location" value={company.location || '-'} />
          <div className="flex flex-col gap-0.5">
            <label className="text-[11px] text-text-secondary font-medium">Website</label>
            {company.website ? (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-fit items-center gap-1.5 text-sm text-text-primary break-words underline decoration-border underline-offset-[3px] hover:text-text-link hover:decoration-current transition-colors"
              >
                {company.website} <Globe size={12} />
              </a>
            ) : (
              <span className="text-sm text-text-primary">-</span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-bg-primary border border-border rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3 border-b border-border pb-2">
          <h3 className="text-xs font-semibold uppercase text-text-tertiary flex items-center gap-2 m-0">
            <Ticket size={16} /> Badge Statistics
          </h3>
          <button
            type="button"
            className="btn btn-secondary btn-sm inline-flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => navigate(`/event/${eventId}/attendees?exhibitor_id=${company.id}`)}
            disabled={!company.badge_count}
            title={
              company.badge_count
                ? 'View attendees under this exhibitor'
                : 'No badges registered for this exhibitor'
            }
          >
            <Users size={14} />
            View Attendees
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Stat label="Total Limit" value={company.badge_limit} />
          <Stat label="Issued" value={company.badge_issued} />
          <Stat label="Badge Count" value={company.badge_count ?? 0} />
          <Stat label="Remaining" value={company.remain_badge_limit_count} />
          <div
            className={`p-2.5 rounded-md flex flex-col items-center justify-center text-center col-span-2 sm:col-span-1 ${
              handedOver ? 'bg-green-50 border border-green-200' : 'bg-bg-secondary'
            }`}
          >
            <span className="text-[11px] text-text-secondary mb-0.5">Handed Over?</span>
            <span
              className={`text-lg font-bold ${
                handedOver ? 'text-green-600' : 'text-yellow-600'
              }`}
            >
              {handedOver ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>

      <div
        className={`bg-bg-primary border rounded-lg p-4 shadow-sm ${
          handoverDone ? 'border-green-300 ring-1 ring-green-100' : 'border-border'
        }`}
      >
        <h3 className="text-xs font-semibold uppercase text-text-tertiary mb-3 flex items-center gap-2 border-b border-border pb-2">
          <Phone size={16} className={handoverDone ? 'text-green-600' : undefined} />
          Contact & Handover
          {handoverDone && (
            <span className="ml-auto inline-flex items-center gap-1 normal-case tracking-normal font-semibold text-[11px] text-green-700 bg-green-100 px-2 py-0.5 rounded-full border border-green-200">
              <CheckCircle2 size={12} />
              Handover done
            </span>
          )}
        </h3>
        <div className="flex flex-col gap-2.5">
          <Field label="Sales Person" value={company.sales_person || '-'} />
          <CompanyHandoverDetails handoverDetails={company.handover_details} />
        </div>
      </div>

      <div className="bg-bg-primary border border-border rounded-lg p-4 shadow-sm">
        <h3 className="text-xs font-semibold uppercase text-text-tertiary mb-3 flex items-center gap-2 border-b border-border pb-2">
          <LayoutDashboard size={16} /> System Info
        </h3>
        <div className="flex flex-col gap-2.5">
          <Field label="Exhibitor UID" value={company.uid} mono />
          <Field label="Payment Made" value={company.is_payment_made ? 'Yes' : 'No'} />
          <Field label="Locked" value={company.is_company_submit_locked ? 'Yes' : 'No'} />
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, mono }) {
  return (
    <div className="flex flex-col gap-0.5">
      <label className="text-[11px] text-text-secondary font-medium">{label}</label>
      <span
        className={`text-sm text-text-primary break-words ${
          mono ? 'font-mono text-xs' : ''
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-bg-secondary p-2.5 rounded-md flex flex-col items-center justify-center text-center">
      <span className="text-[11px] text-text-secondary mb-0.5">{label}</span>
      <span className="text-lg font-bold text-text-primary">{value}</span>
    </div>
  );
}
