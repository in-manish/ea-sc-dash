import { AtSign, FileText, Loader2, UserRound } from 'lucide-react';
import {
    DELIVERY_FILTERS,
    DELIVERY_STATUS,
    countForFilter,
    describeDeliveryAttendees,
    formatLogTime,
} from '../domain/emailLogStatus';
import { Chip } from './CardEmailBatchList';

const lastTime = (d) => d.delivered_at || d.failed_at || d.sent_at || d.created_at;

const Recipient = ({ delivery }) => {
    const custom = delivery.recipient_type === 'custom';
    const Icon = custom ? AtSign : UserRound;
    const redirected = delivery.sent_to && delivery.to_address && delivery.sent_to !== delivery.to_address;
    return (
        <div className="flex items-start gap-2 min-w-0">
            <Icon size={16} className="text-text-tertiary mt-0.5 shrink-0" />
            <div className="min-w-0">
                <div className="text-text-primary break-all">
                    {delivery.to_address || <span className="text-text-tertiary italic">no email address</span>}
                </div>
                <div className="text-xs text-text-tertiary">{custom ? 'Custom address' : 'Attendee'}</div>
                {redirected && <div className="text-xs text-amber-700">actually sent to {delivery.sent_to}</div>}
            </div>
        </div>
    );
};

const Files = ({ attachments = [] }) => (
    <div className="flex flex-col gap-0.5">
        {attachments.length ? attachments.map((file) => (
            <span key={file.name} className="inline-flex items-center gap-1 text-xs text-text-secondary">
                <FileText size={12} className="shrink-0" />{file.name}
            </span>
        )) : <span className="text-xs text-text-tertiary">—</span>}
    </div>
);

const FilterPills = ({ status, onStatus, statusCounts }) => (
    <div className="flex flex-wrap gap-2">
        {DELIVERY_FILTERS.map((filter) => {
            const active = status === filter.value;
            return (
                <button
                    key={filter.label}
                    type="button"
                    onClick={() => onStatus(filter.value)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${active ? 'border-accent bg-accent text-accent-text' : 'border-border text-text-secondary hover:border-border-hover hover:text-text-primary'}`}
                >
                    {filter.label}
                    <span className={active ? 'opacity-80' : 'text-text-tertiary'}>{countForFilter(statusCounts, filter.value)}</span>
                </button>
            );
        })}
    </div>
);

/** Emails of one send (shown inside its card), with status filter pills. */
export default function CardEmailDeliveries({ deliveries, status, onStatus, search }) {
    const { batch, rows, count, loading, error } = deliveries;
    return (
        <div className="p-4 bg-bg-secondary">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <FilterPills status={status} onStatus={onStatus} statusCounts={batch?.status_counts} />
                {search && <span className="text-xs text-text-secondary">{count} email{count === 1 ? '' : 's'} matching “{search}”</span>}
            </div>
            {loading && !rows.length && (
                <div className="flex items-center gap-2 text-sm text-text-secondary py-4"><Loader2 size={16} className="animate-spin" />Loading emails…</div>
            )}
            {error && <div className="text-sm text-red-700 py-2">{error}</div>}
            {!loading && !error && !rows.length && <div className="text-sm text-text-secondary py-4">No emails match this filter.</div>}
            {rows.length > 0 && (
                <div className="overflow-x-auto rounded-md border border-border bg-bg-primary">
                    <table className="w-full text-sm">
                        <thead className="text-left text-[11px] uppercase tracking-wide text-text-tertiary bg-bg-secondary">
                            <tr>
                                <th className="px-3 py-2 font-semibold">Recipient</th>
                                <th className="px-3 py-2 font-semibold">Report of</th>
                                <th className="px-3 py-2 font-semibold">Files</th>
                                <th className="px-3 py-2 font-semibold">Status</th>
                                <th className="px-3 py-2 font-semibold">Updated</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((d) => (
                                <tr key={d.id} className="border-t border-border align-top hover:bg-bg-secondary">
                                    <td className="px-3 py-2.5"><Recipient delivery={d} /></td>
                                    <td className="px-3 py-2.5 text-text-primary">{describeDeliveryAttendees(d)}</td>
                                    <td className="px-3 py-2.5"><Files attachments={d.attachments} /></td>
                                    <td className="px-3 py-2.5">
                                        <Chip meta={DELIVERY_STATUS[d.status]} />
                                        {d.status_reason && <div className="text-xs text-text-secondary mt-1 max-w-[220px]">{d.status_reason}</div>}
                                    </td>
                                    <td className="px-3 py-2.5 text-xs text-text-secondary whitespace-nowrap">{formatLogTime(lastTime(d))}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
