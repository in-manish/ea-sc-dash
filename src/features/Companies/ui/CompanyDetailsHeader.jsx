import { ArrowLeft, Building2, Star, Pencil, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

  return (
    <div className="mb-8">
      <button
        type="button"
        className="flex items-center gap-2 text-sm text-text-tertiary hover:text-text-primary transition-colors bg-transparent border-none cursor-pointer p-0 mb-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={16} /> Back to List
      </button>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end border-b border-border pb-6 gap-4">
        <div className="flex items-center gap-6">
          {company.company_logo ? (
            <img
              src={company.company_logo}
              alt={company.company_name}
              className="w-20 h-20 object-contain bg-white rounded-md shadow-sm border border-border shrink-0"
            />
          ) : (
            <div className="w-20 h-20 bg-bg-tertiary rounded-md flex items-center justify-center text-text-secondary shrink-0">
              <Building2 size={32} />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold mb-2 text-text-primary flex items-center gap-3">
              {company.company_name}
              {company.is_featured && (
                <Star size={24} className="text-yellow-500 fill-yellow-500" title="Featured Company" />
              )}
            </h1>
            <div className="flex flex-wrap gap-3 items-center">
              {isCoExhibitor && (
                <span className="inline-flex py-1 px-2.5 rounded-full text-xs font-medium tracking-wide bg-indigo-100 text-indigo-800">
                  Co-exhibitor
                </span>
              )}
              <span className="inline-flex py-1 px-2.5 rounded-full text-xs font-medium tracking-wide bg-purple-100 text-purple-800">
                {company.category}
              </span>
              {company.stall_number && (
                <span className="inline-flex py-1 px-2.5 rounded-full text-xs font-semibold tracking-wide bg-bg-tertiary text-text-primary font-mono border border-border">
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
