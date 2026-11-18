import { RefreshCw } from 'lucide-react';
import useCardEmailLog from '../hooks/useCardEmailLog';
import { LOG_TYPES } from '../domain/emailLogStatus';
import CardEmailBatchList from './CardEmailBatchList';
import CardEmailDeliveries from './CardEmailDeliveries';
import CardEmailLogSearch from './CardEmailLogSearch';

const resultText = (count, search) => `${count} send${count === 1 ? '' : 's'} with an email matching “${search}”`;

const TypeSwitch = ({ value, onChange }) => (
    <div className="inline-flex rounded-md border border-border p-0.5 bg-bg-secondary self-start" role="tablist">
        {Object.entries(LOG_TYPES).map(([key, type]) => (
            <button
                key={key}
                type="button"
                role="tab"
                aria-selected={value === key}
                onClick={() => onChange(key)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${value === key ? 'bg-bg-primary text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
            >
                {type.label}
            </button>
        ))}
    </div>
);

/** Attendees → "Email log" tab: every business card / meeting report email send and the status of each email. */
export default function CardEmailLogPanel({ eventId, token, searchParams, setSearchParams }) {
    const log = useCardEmailLog({ eventId, token, searchParams, setSearchParams });
    const type = LOG_TYPES[log.logType];
    const loading = log.batches.loading || log.deliveries.loading;
    return (
        <div className="card p-5 flex flex-col gap-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h2 className="text-lg font-bold text-text-primary">{type.label} emails</h2>
                    <p className="text-sm text-text-secondary">
                        Every email sent from {type.source}. Open a send to see each email and its status.
                    </p>
                    {log.active && <p className="text-xs text-accent mt-1">Sending… this list refreshes every 5 seconds.</p>}
                </div>
                <button type="button" className="btn btn-secondary gap-2" onClick={log.refresh} disabled={loading}>
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>
            <TypeSwitch value={log.logType} onChange={log.setLogType} />
            <CardEmailLogSearch
                value={log.query}
                onChange={log.setQuery}
                resultText={log.search && !log.batches.loading ? resultText(log.batches.count, log.search) : ''}
            />
            <CardEmailBatchList
                batches={log.batches}
                selectedId={log.batchId}
                onOpen={log.openBatch}
                search={log.search}
                source={type.source}
                renderDetails={() => (
                    <CardEmailDeliveries
                        deliveries={log.deliveries}
                        status={log.status}
                        onStatus={log.setStatus}
                        search={log.search}
                    />
                )}
            />
        </div>
    );
}
