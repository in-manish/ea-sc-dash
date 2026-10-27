import { Building2, ExternalLink, IdCard, Lock, Printer, Star } from 'lucide-react';
import { isParentExhibitor } from '../domain/companyBulkActionPayload';
import { positiveSponsorRank } from '../domain/sponsorRank';
import { boostLabel } from '../domain/companyBoost';
import { columnTone } from '../../Attendees/domain/tableColumns';
import AttendeeExtraCell from '../../Attendees/ui/AttendeeExtraCell';
import { formatCompanyColumn } from '../domain/companyTableColumns';
import ExhibitorListRowMenu from './ExhibitorListRowMenu';

const MAX_PRODUCT_PILLS = 3;

export default function ExhibitorListRow({
  company,
  eventId,
  selected,
  onToggle,
  onCompanyClick,
  onNavigate,
  onRowAction,
  extraColumns = [],
  activeColumnKey = null,
  pinIdentity = false,
}) {
  const parentExhibitor = company.parent_exhibitor;
  const isCoExhibitor = Boolean(parentExhibitor?.id || parentExhibitor);
  const parentId = parentExhibitor?.id;
  const parentName = parentExhibitor?.company_name;
  const sponsorRank = positiveSponsorRank(company.sponsor_rank);
  const products = Array.isArray(company.product) ? company.product.filter(Boolean) : [];
  const boostText = boostLabel(company, positiveSponsorRank(company.boost_rank));
  const rowTone = sponsorRank
    ? 'bg-yellow-100 hover:bg-yellow-200'
    : isCoExhibitor
      ? 'bg-indigo-50/70 hover:bg-indigo-100/80'
      : 'bg-emerald-50/40 hover:bg-emerald-50';
  const stickyBg = sponsorRank
    ? 'bg-yellow-100 group-hover:bg-yellow-200'
    : isCoExhibitor
      ? 'bg-indigo-50 group-hover:bg-indigo-100'
      : 'bg-emerald-50 group-hover:bg-emerald-50';

  return (
    <tr
      className={`cursor-pointer transition-colors duration-200 [&>td]:border-b [&>td]:border-border group ${rowTone} ${
        selected ? 'ring-1 ring-inset ring-accent/30' : ''
      }`}
      onClick={() => onCompanyClick(company.id)}
    >
      <td
        className={`py-4 pl-4 pr-2 align-middle group-last:border-b-0 w-10 ${pinIdentity ? `sticky left-0 z-10 ${stickyBg}` : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="checkbox"
          className="w-4 h-4 accent-accent cursor-pointer"
          checked={selected}
          onChange={() => onToggle(company.id)}
          aria-label={`Select ${company.company_name}`}
        />
      </td>
      <td className={`py-4 px-6 align-middle group-last:border-b-0 ${pinIdentity ? `sticky left-10 z-10 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.12)] ${stickyBg}` : ''}`}>
        <div className="flex items-center gap-4">
          {company.company_logo ? (
            <img
              src={company.company_logo}
              alt={company.company_name}
              className="w-10 h-10 object-contain bg-white rounded-sm border border-border"
            />
          ) : (
            <div className="w-10 h-10 bg-bg-tertiary rounded-sm flex items-center justify-center text-text-secondary">
              <Building2 size={16} />
            </div>
          )}
          <div>
            <div className="font-semibold text-text-primary text-sm flex items-center gap-2 flex-wrap">
              {company.company_name}
              <span className="text-[10px] font-mono text-text-tertiary opacity-40">
                #{company.id}
              </span>
              <span
                className={`inline-flex py-0.5 px-1.5 rounded text-[10px] font-semibold tracking-wide ${
                  isCoExhibitor
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {isCoExhibitor ? 'Co-exhibitor' : 'Exhibitor'}
              </span>
              {company.is_badge_printed && (
                <Printer size={14} className="text-green-600" title="Badge Printed" />
              )}
              {sponsorRank != null && (
                <span
                  className="inline-flex py-0.5 px-1.5 rounded text-[10px] font-semibold tracking-wide bg-yellow-200 text-yellow-900"
                  title="Sponsor rank"
                >
                  Sponsor #{sponsorRank}
                </span>
              )}
              {boostText && (
                <span
                  className="inline-flex py-0.5 px-1.5 rounded text-[10px] font-semibold tracking-wide bg-blue-100 text-blue-800"
                  title="Boosted to the top of the exhibitor list"
                >
                  {boostText}
                </span>
              )}
              {company.is_featured && (
                <span className="inline-flex items-center gap-0.5" title="Featured Company">
                  <Star
                    size={14}
                    className="text-yellow-500 fill-yellow-500"
                  />
                  {Number(company.featured_rank) > 0 && (
                    <span className="text-[10px] font-semibold text-yellow-700">
                      #{company.featured_rank}
                    </span>
                  )}
                </span>
              )}
            </div>
            <div className="text-xs text-text-tertiary mt-0.5 flex items-center gap-1">
              <span>{company.company_slug}</span>
              {company.is_company_submit_locked && (
                <Lock
                  size={12}
                  className="text-red-500 shrink-0"
                  title="Company Submit Locked"
                />
              )}
            </div>
            {isCoExhibitor && parentId && (
              <button
                type="button"
                className="mt-1.5 inline-flex items-center gap-1 text-xs text-accent hover:underline bg-transparent border-none p-0 cursor-pointer font-medium"
                title={`Open parent exhibitor: ${parentName || `#${parentId}`}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(`/event/${eventId}/companies/${parentId}`);
                }}
              >
                <ExternalLink size={11} />
                {parentName || `Exhibitor #${parentId}`}
              </button>
            )}
          </div>
        </div>
      </td>
      <td className="py-4 px-6 align-middle group-last:border-b-0">
        <div className="flex flex-col gap-1 text-[0.8125rem] text-text-secondary">
          <div>OBF: {company.obf_number || '-'}</div>
          <div>Space: {company.space != null && company.space !== '' ? company.space : '-'}</div>
          {company.sales_person && <div>Sales: {company.sales_person}</div>}
        </div>
      </td>
      <td className="py-4 px-6 align-middle group-last:border-b-0">
        <div className="font-mono font-semibold bg-bg-tertiary py-1 px-2 rounded-sm inline-block text-[0.8125rem] text-text-primary">
          {company.stall_number || '-'}
        </div>
      </td>
      <td className="py-4 px-6 align-middle group-last:border-b-0">
        <span className="inline-flex py-1 px-2.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 tracking-wide">
          {company.category}
        </span>
      </td>
      <td className="py-4 px-6 align-middle group-last:border-b-0">
        {products.length > 0 ? (
          <div className="flex flex-wrap gap-1 max-w-[16rem]" title={products.join(', ')}>
            {products.slice(0, MAX_PRODUCT_PILLS).map((name) => (
              <span
                key={name}
                className="inline-flex py-0.5 px-2 rounded-full text-[11px] font-medium bg-bg-tertiary text-text-secondary border border-border"
              >
                {name}
              </span>
            ))}
            {products.length > MAX_PRODUCT_PILLS && (
              <span className="inline-flex py-0.5 px-2 rounded-full text-[11px] font-medium text-text-tertiary">
                +{products.length - MAX_PRODUCT_PILLS} more
              </span>
            )}
          </div>
        ) : (
          <span className="text-text-tertiary">-</span>
        )}
      </td>
      <td
        className="py-4 px-6 align-middle group-last:border-b-0"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="flex flex-col gap-1 text-xs text-text-secondary text-left rounded-md px-2 py-1 -mx-2 transition-colors hover:bg-accent/5 hover:text-accent cursor-pointer group/badges"
          onClick={() =>
            onNavigate(`/event/${eventId}/attendees?exhibitor_id=${company.id}`)
          }
          title="View attendees under this exhibitor"
        >
          <span>Limit: {company.badge_limit}</span>
          <span className="inline-flex items-center gap-1">
            Issued: {company.badge_issued}
            <IdCard
              size={12}
              className="opacity-0 group-hover/badges:opacity-100 transition-opacity"
            />
          </span>
        </button>
      </td>
      {extraColumns.map((column, index) => {
        const tone = columnTone(index);
        const active = column.key === activeColumnKey;
        return (
          <td
            key={column.key}
            className={`py-4 px-4 align-top group-last:border-b-0 border-l-4 ${tone.cell} ${tone.edge} ${active ? 'ring-2 ring-inset ring-accent' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <AttendeeExtraCell
              column={column}
              attendee={company}
              eventId={eventId}
              formatValue={formatCompanyColumn}
            />
          </td>
        );
      })}
      <td
        className="py-4 pr-4 pl-2 align-middle group-last:border-b-0 w-10"
        onClick={(e) => e.stopPropagation()}
      >
        <ExhibitorListRowMenu
          isParent={isParentExhibitor(company)}
          locked={Boolean(company.is_company_submit_locked)}
          onView={() => onCompanyClick(company.id)}
          onEdit={() => onNavigate(`/event/${eventId}/companies/${company.id}/edit`)}
          onReset={() => onRowAction?.('reset', company)}
          onToggleLock={() => onRowAction?.('lock', company)}
          onFeature={() => onRowAction?.('feature', company)}
        />
      </td>
    </tr>
  );
}
