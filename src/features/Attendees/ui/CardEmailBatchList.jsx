import { ChevronDown, ChevronRight, Loader2, Mail, Users } from 'lucide-react';
import {
    BATCH_STATUS,
    describeRange,
    formatLogTime,
    summarizeCounts,
} from '../domain/emailLogStatus';

export const Chip = ({ meta, children, title }) => (
    <span
        title={title}
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${meta?.className || 'bg-bg-secondary text-text-secondary'}`}
    >
        {children || meta?.label}
    </span>
);

const Field = ({ label, children }) => (
    <div className="min-w-0">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-text-tertiary mb-1">{label}</div>
        <div className="flex flex-wrap items-center gap-1.5 text-sm text-text-primary">{children}</div>
    </div>
);

const Recipients = ({ options = {} }) => (
    <>
        {options.send_to_attendee && <Chip meta={{ className: 'bg-blue-50 text-blue-800' }}>Each attendee</Chip>}
        {(options.emails || []).map((email) => (
            <Chip key={email} meta={{ className: 'bg-bg-secondary text-text-primary font-medium' }}>{email}</Chip>
        ))}
        {!options.send_to_attendee && !options.emails?.length && <span className="text-text-tertiary">—</span>}
    </>
);

const Counts = ({ batch }) => {
    const { ok, failed, waiting } = summarizeCounts(batch.status_counts);
    const noCards = batch.counts?.no_cards || 0;
    return (
        <>
            <Chip meta={{ className: 'bg-green-100 text-green-800' }}>{ok} sent</Chip>
            {failed > 0 && <Chip meta={{ className: 'bg-red-100 text-red-800' }}>{failed} failed</Chip>}
            {waiting > 0 && <Chip meta={{ className: 'bg-amber-100 text-amber-800' }}>{waiting} waiting</Chip>}
            {noCards > 0 && <Chip title="Attendees with no cards in the date range get no email">{noCards} without cards</Chip>}
        </>
    );
};

const BatchCard = ({ batch, open, onToggle, children }) => {
    const Arrow = open ? ChevronDown : ChevronRight;
    return (
        <div className={`rounded-lg border transition-colors ${open ? 'border-accent shadow-sm' : 'border-border hover:border-border-hover'}`}>
            <button type="button" onClick={onToggle} className="w-full text-left p-4 flex flex-col gap-3" aria-expanded={open}>
                <div className="flex flex-wrap items-center gap-2">
                    <Arrow size={18} className="text-text-tertiary shrink-0" />
                    <span className="font-semibold text-text-primary">Send #{batch.id}</span>
                    <span className="text-sm text-text-secondary">{formatLogTime(batch.created_at)}</span>
                    {batch.match_count != null && (
                        <Chip meta={{ className: 'bg-accent text-accent-text' }}>
                            {batch.match_count} match{batch.match_count === 1 ? '' : 'es'}
                        </Chip>
                    )}
                    <span className="ml-auto"><Chip meta={BATCH_STATUS[batch.status]} /></span>
                </div>
                <div className="grid gap-4 pl-6 sm:grid-cols-2 lg:grid-cols-[2fr_1.4fr_0.6fr_2fr]">
                    <Field label="Sent to"><Recipients options={batch.options} /></Field>
                    <Field label="Files">
                        <Chip>{(batch.options?.formats || []).join(' + ').toUpperCase() || '—'}</Chip>
                        <span className="text-text-secondary">{describeRange(batch.options)}</span>
                    </Field>
                    <Field label="Attendees">
                        <Users size={14} className="text-text-tertiary" />{batch.attendee_count}
                    </Field>
                    <Field label="Emails"><Counts batch={batch} /></Field>
                </div>
                <div className="pl-6 text-xs text-text-tertiary">by {batch.created_by_email || '—'}</div>
                {batch.error && <div className="pl-6 text-sm text-red-700">{batch.error}</div>}
            </button>
            {open && <div className="border-t border-border">{children}</div>}
        </div>
    );
};

const Empty = ({ search }) => (
    <div className="flex flex-col items-center gap-2 text-sm text-text-secondary py-12 text-center">
        <Mail size={28} className="text-text-tertiary" />
        {search
            ? <>No business card email matches <b className="text-text-primary">“{search}”</b>.</>
            : <>No business card emails sent for this event yet.<br />Use <b>Business cards → Email</b> on the Attendee List.</>}
    </div>
);

/** Business card email sends (newest first). Click a send to open its emails right below it. */
export default function CardEmailBatchList({ batches, selectedId, onOpen, search, renderDetails }) {
    const { rows, loading, error, count, page, setPage, pageSize } = batches;
    if (loading && !rows.length) {
        return <div className="flex items-center gap-2 text-sm text-text-secondary py-10 justify-center"><Loader2 size={16} className="animate-spin" />Loading sends…</div>;
    }
    if (error) return <div className="text-sm text-red-700 p-4">{error}</div>;
    if (!rows.length) return <Empty search={search} />;
    const pages = Math.max(1, Math.ceil(count / pageSize));
    return (
        <div className="flex flex-col gap-3">
            {rows.map((batch) => {
                const open = String(batch.id) === selectedId;
                return (
                    <BatchCard key={batch.id} batch={batch} open={open} onToggle={() => onOpen(open ? '' : batch.id)}>
                        {open && renderDetails()}
                    </BatchCard>
                );
            })}
            {pages > 1 && (
                <div className="flex items-center justify-end gap-2 pt-1 text-sm">
                    <button className="btn btn-secondary" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
                    <span className="text-text-secondary">Page {page} of {pages}</span>
                    <button className="btn btn-secondary" disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</button>
                </div>
            )}
        </div>
    );
}
