import { useEffect, useRef, useState } from 'react';
import { Loader2, X } from 'lucide-react';
import AttendeeColumnPicker from '../../Attendees/ui/AttendeeColumnPicker';
import { columnTone } from '../../Attendees/domain/tableColumns';
import ExhibitorListRow from './ExhibitorListRow';
import { isHeaderSortActive } from '../domain/companyListSort';
import {
  COMPANY_COLUMN_GROUPS,
  COMPANY_COLUMNS,
  loadCompanyColumns,
  saveCompanyColumns,
} from '../domain/companyTableColumns';

const DEFAULT_JUMPS = [
  { key: 'company', label: 'Company' },
  { key: 'details', label: 'Details' },
  { key: 'stall', label: 'Stall' },
  { key: 'category', label: 'Category' },
  { key: 'products', label: 'Products' },
  { key: 'badges', label: 'Badges' },
];

const thClass =
  'bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border';

function SortHeader({ column, label, sortBy, sortOrder, onSortChange, stickyClass = '', dataColumn }) {
  const active = isHeaderSortActive(column, sortBy);
  return (
    <th data-column={dataColumn || column} className={`${thClass} ${stickyClass}`}>
      <button
        type="button"
        className={`inline-flex items-center gap-1 bg-transparent border-none p-0 cursor-pointer uppercase tracking-wider font-semibold ${
          active ? 'text-accent' : 'text-text-secondary hover:text-text-primary'
        }`}
        onClick={() => onSortChange(column)}
      >
        {label}
        {active && <span aria-hidden="true">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
      </button>
    </th>
  );
}

export default function ExhibitorListTable({
  companies,
  loading,
  eventId,
  selectedIds,
  allPageSelected,
  somePageSelected,
  onToggle,
  onTogglePage,
  onCompanyClick,
  onNavigate,
  onRowAction,
  sortBy,
  sortOrder,
  onHeaderSort,
}) {
  const [extraKeys, setExtraKeys] = useState(loadCompanyColumns);
  const [activeKey, setActiveKey] = useState(null);
  const scrollerRef = useRef(null);
  const pendingScroll = useRef(null);
  const extraColumns = COMPANY_COLUMNS.filter((column) => extraKeys.includes(column.key));
  const columnCount = 8 + extraColumns.length;
  const pinIdentity = extraColumns.length > 0;
  const companySticky = pinIdentity
    ? 'sticky left-10 z-20 bg-bg-secondary shadow-[4px_0_8px_-4px_rgba(0,0,0,0.12)]'
    : '';

  const focusColumn = (key, align = 'center') => {
    pendingScroll.current = { key, align };
    setActiveKey(key);
  };
  const setColumns = (next) => {
    const added = next.find((key) => !extraKeys.includes(key));
    setExtraKeys(next);
    saveCompanyColumns(next);
    if (added) focusColumn(added);
    else if (activeKey && !next.includes(activeKey)) setActiveKey(null);
  };

  useEffect(() => {
    const pending = pendingScroll.current;
    if (!activeKey || !pending || pending.key !== activeKey) return undefined;
    pendingScroll.current = null;
    const header = scrollerRef.current?.querySelector(`[data-column="${activeKey}"]`);
    header?.scrollIntoView({ behavior: 'smooth', inline: pending.align, block: 'nearest' });
    return undefined;
  }, [activeKey, extraColumns.length]);

  return (
    <div>
    <div className="flex items-center justify-between gap-3 mb-2">
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex items-center gap-1.5 min-w-0 overflow-x-auto">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-text-tertiary shrink-0">Go to</span>
          {DEFAULT_JUMPS.map((column) => (
            <button
              key={column.key}
              type="button"
              onClick={() => focusColumn(column.key, 'start')}
              className={`shrink-0 px-2 py-1 rounded-md border text-xs font-medium bg-bg-primary text-text-secondary hover:text-text-primary ${
                column.key === activeKey ? 'border-accent text-accent ring-2 ring-offset-1 ring-accent' : 'border-border'
              }`}
            >
              {column.label}
            </button>
          ))}
          {extraColumns.length > 0 && <span className="w-px h-4 bg-border shrink-0" />}
          {extraColumns.map((column, index) => {
            const tone = columnTone(index);
            const active = column.key === activeKey;
            return (
              <span
                key={column.key}
                className={`shrink-0 inline-flex items-center rounded-md border text-xs font-medium ${tone.chip} ${active ? 'ring-2 ring-offset-1 ring-accent' : ''}`}
              >
                <button
                  type="button"
                  onClick={() => focusColumn(column.key)}
                  className="inline-flex items-center gap-1.5 pl-2 pr-1 py-1 bg-transparent border-none text-inherit cursor-pointer"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${tone.mark}`} />
                  {column.label}
                </button>
                <button
                  type="button"
                  aria-label={`Remove ${column.label} column`}
                  title={`Remove ${column.label}`}
                  onClick={() => setColumns(extraKeys.filter((key) => key !== column.key))}
                  className="inline-flex items-center justify-center mr-1 w-4 h-4 rounded-sm bg-transparent border-none text-inherit cursor-pointer opacity-70 hover:opacity-100"
                >
                  <X size={12} />
                </button>
              </span>
            );
          })}
        </div>
        {extraColumns.length > 0 && (
          <button
            type="button"
            onClick={() => setColumns([])}
            className="shrink-0 text-xs font-medium text-text-secondary bg-transparent border-none p-0 cursor-pointer hover:text-text-primary whitespace-nowrap"
          >
            Clear all
          </button>
        )}
      </div>
      <AttendeeColumnPicker
        selected={extraKeys}
        onChange={setColumns}
        groups={COMPANY_COLUMN_GROUPS}
        hint="Company, details, stall, category, products, and badges stay. Choose more fields to add as their own cells."
      />
    </div>
    <div ref={scrollerRef} className="bg-bg-primary border border-border rounded-lg overflow-x-auto shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className={`bg-bg-secondary py-3 pl-4 pr-2 border-b border-border w-10 ${pinIdentity ? 'sticky left-0 z-20' : ''}`}>
              <input
                type="checkbox"
                className="w-4 h-4 accent-accent cursor-pointer"
                checked={allPageSelected}
                ref={(el) => {
                  if (el) el.indeterminate = somePageSelected && !allPageSelected;
                }}
                onChange={onTogglePage}
                disabled={loading || companies.length === 0}
                aria-label="Select all on this page"
                title="Select all on this page"
              />
            </th>
            <SortHeader
              column="company"
              label="Company"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={onHeaderSort}
              stickyClass={companySticky}
            />
            <SortHeader
              column="obf"
              dataColumn="details"
              label="Details"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={onHeaderSort}
            />
            <SortHeader
              column="stall"
              label="Stall"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={onHeaderSort}
            />
            <th data-column="category" className={thClass}>Category</th>
            <th data-column="products" className={thClass}>Products</th>
            <th data-column="badges" className={thClass}>Badges</th>
            {extraColumns.map((column, index) => {
              const tone = columnTone(index);
              const active = column.key === activeKey;
              return (
                <th
                  key={column.key}
                  data-column={column.key}
                  className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b border-border whitespace-nowrap border-l-4 ${tone.header} ${tone.edge} ${active ? 'ring-2 ring-inset ring-accent' : ''}`}
                >
                  <span className={`mr-1.5 inline-block w-1.5 h-1.5 rounded-full align-middle ${tone.mark}`} />
                  {column.label}
                </th>
              );
            })}
            <th className={`${thClass} w-10 pr-4`} aria-label="Row actions" />
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columnCount} className="text-center p-12 text-text-secondary">
                <Loader2 className="animate-spin text-accent mx-auto" size={24} />
              </td>
            </tr>
          ) : companies.length === 0 ? (
            <tr>
              <td colSpan={columnCount} className="text-center p-12 text-text-secondary">
                No companies found.
              </td>
            </tr>
          ) : (
            companies.map((company) => (
              <ExhibitorListRow
                key={company.id}
                company={company}
                eventId={eventId}
                selected={selectedIds.has(company.id)}
                onToggle={onToggle}
                onCompanyClick={onCompanyClick}
                onNavigate={onNavigate}
                onRowAction={onRowAction}
                extraColumns={extraColumns}
                activeColumnKey={activeKey}
                pinIdentity={pinIdentity}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
    </div>
  );
}
