import { ArrowLeft, Building2, Star, Pencil, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { hasHandoverSignature } from '../domain/parseHandoverDetails';

export default function CompanyDetailsHeader({
  company,
  eventId,
  companyId,
  showSetupAction = false,
  onOpenSetup,
}) {
  const navigate = useNavigate();
  const parentExhibitor = company.parent_exhibitor;
  const isCoExhibitor = Boolean(
    parentExhibitor?.id
    || company.parent_exhibitor_id
    || (typeof parentExhibitor === 'number' && parentExhibitor)
  );
  const parentExhibitorId =
    parentExhibitor?.id
    || company.parent_exhibitor_id
    || (typeof parentExhibitor === 'number' ? parentExhibitor : null);
  const parentExhibitorName = parentExhibitor?.company_name;
  const handoverDone = hasHandoverSignature(company.handover_details);

  return (
    <div className="mb-4">
      <button
        type="button"
        className="flex items-center gap-2 text-sm text-text-tertiary hover:text-text-primary transition-colors bg-transparent border-none cursor-pointer p-0 mb-3"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={16} /> Back to List
      </button>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end border-b border-border pb-4 gap-3">
        <div className="flex items-center gap-4">
          {company.company_logo ? (
            <img
              src={company.company_logo}
              alt={company.company_name}
              className="w-14 h-14 object-contain bg-white rounded-md shadow-sm border border-border shrink-0"
            />
          ) : (
            <div className="w-14 h-14 bg-bg-tertiary rounded-md flex items-center justify-center text-text-secondary shrink-0">
              <Building2 size={24} />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold mb-1.5 text-text-primary flex items-center gap-2 flex-wrap">
              {company.company_name}
              {company.is_featured && (
                <Star size={20} className="text-yellow-500 fill-yellow-500" title="Featured Company" />
              )}
              {company.apply_title_case && (
                <span
                  className="inline-flex py-0.5 px-2 rounded-full text-[11px] font-medium tracking-wide bg-emerald-100 text-emerald-800"
                  title="Company name is formatted as Title Case"
                >
                  Title Case formatting
                </span>
              )}
            </h1>
            <div className="flex flex-wrap gap-2 items-center">
              {handoverDone && (
                <span
                  className="inline-flex py-0.5 px-2 rounded-full text-[11px] font-semibold tracking-wide bg-green-100 text-green-800 border border-green-200"
                  title="Handover signature on file"
                >
                  Handover done
                </span>
              )}
              {isCoExhibitor && (
                <span className="inline-flex py-0.5 px-2 rounded-full text-[11px] font-medium tracking-wide bg-indigo-100 text-indigo-800">
                  Co-exhibitor
                </span>
              )}
              {company.category && (
                <span className="inline-flex py-0.5 px-2 rounded-full text-[11px] font-medium tracking-wide bg-purple-100 text-purple-800">
                  {company.category}
                </span>
              )}
              {company.stall_number && (
                <span className="inline-flex py-0.5 px-2 rounded-full text-[11px] font-semibold tracking-wide bg-bg-tertiary text-text-primary font-mono border border-border">
                  Stall: {company.stall_number}
                </span>
              )}
              {isCoExhibitor && parentExhibitorId && (
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs text-accent hover:underline bg-transparent border-none p-0 cursor-pointer font-medium"
                  title="Open parent exhibitor"
                  onClick={() => navigate(`/event/${eventId}/companies/${parentExhibitorId}`)}
                >
                  Parent: {parentExhibitorName || `#${parentExhibitorId}`}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
          <button
            type="button"
            className="btn btn-primary inline-flex items-center gap-2"
            onClick={() => navigate(`/event/${eventId}/companies/${companyId}/edit`)}
          >
            <Pencil size={16} />
            Edit
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() =>
              navigate(
                `/event/${eventId}/companies?tab=additional_requirements&company_ids=${company.id}`
              )
            }
          >
            View Orders
          </button>
          {showSetupAction && (
            <button
              type="button"
              className="btn btn-secondary inline-flex items-center gap-2"
              onClick={onOpenSetup}
              title="Expand exhibitor portal checklist"
            >
              <ClipboardList size={16} />
              Exhibitor portal checklist
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
