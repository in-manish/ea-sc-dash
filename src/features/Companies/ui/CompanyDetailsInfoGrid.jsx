import { Building2, Globe, Phone, Ticket, LayoutDashboard, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/** Existing 4 cards — company detail API only (not Overview API). */
export default function CompanyDetailsInfoGrid({ company, eventId }) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
        <h3 className="text-sm font-semibold uppercase text-text-tertiary mb-5 flex items-center gap-2 border-b border-border pb-3">
          <Building2 size={18} /> Overview
        </h3>
        <div className="flex flex-col gap-4">
          <Field label="OBF Number" value={company.obf_number} />
          <Field
            label="Space Details"
            value={`${company.space} sq.m (${company.stall_detail?.space_type})`}
          />
          <Field label="Location" value={company.location || '-'} />
          <div className="flex flex-col gap-1">
            <label className="text-xs text-text-secondary font-medium">Website</label>
            {company.website ? (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-fit items-center gap-2 text-[0.9375rem] text-text-primary break-words underline decoration-border underline-offset-[3px] hover:text-text-link hover:decoration-current transition-colors"
              >
                {company.website} <Globe size={12} />
              </a>
            ) : (
              <span className="text-[0.9375rem] text-text-primary">-</span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5 border-b border-border pb-3">
          <h3 className="text-sm font-semibold uppercase text-text-tertiary flex items-center gap-2 m-0">
            <Ticket size={18} /> Badge Statistics
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
        <div className="grid grid-cols-2 gap-4">
          <Stat label="Total Limit" value={company.badge_limit} />
          <Stat label="Issued" value={company.badge_issued} />
          <Stat label="Badge Count" value={company.badge_count ?? 0} />
          <Stat label="Remaining" value={company.remain_badge_limit_count} />
          <div className="bg-bg-secondary p-4 rounded-md flex flex-col items-center justify-center text-center">
            <span className="text-xs text-text-secondary mb-1">Handed Over?</span>
            <span
              className={`text-xl font-bold ${
                company.all_badges_handed_over ? 'text-green-600' : 'text-yellow-600'
              }`}
            >
              {company.all_badges_handed_over ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
        <h3 className="text-sm font-semibold uppercase text-text-tertiary mb-5 flex items-center gap-2 border-b border-border pb-3">
          <Phone size={18} /> Contact & Handover
        </h3>
        <div className="flex flex-col gap-4">
          <Field label="Sales Person" value={company.sales_person || '-'} />
          {company.handover_details && (
            <>
              <Field
                label="Handover Phone"
                value={company.handover_details.phone_number || '-'}
              />
              {company.handover_details.remarks?.length > 0 && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-text-secondary font-medium">Latest Remark</label>
                  <span className="text-[0.9375rem] text-text-primary break-words">
                    {company.handover_details.remarks[0].remarks}
                  </span>
                  <small className="text-xs text-text-tertiary mt-1">
                    {company.handover_details.remarks[0].date}
                  </small>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
        <h3 className="text-sm font-semibold uppercase text-text-tertiary mb-5 flex items-center gap-2 border-b border-border pb-3">
          <LayoutDashboard size={18} /> System Info
        </h3>
        <div className="flex flex-col gap-4">
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
    <div className="flex flex-col gap-1">
      <label className="text-xs text-text-secondary font-medium">{label}</label>
      <span
        className={`text-[0.9375rem] text-text-primary break-words ${
          mono ? 'font-mono text-sm' : ''
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-bg-secondary p-4 rounded-md flex flex-col items-center justify-center text-center">
      <span className="text-xs text-text-secondary mb-1">{label}</span>
      <span className="text-xl font-bold text-text-primary">{value}</span>
    </div>
  );
}
