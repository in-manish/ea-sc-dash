import { RefreshCw } from 'lucide-react';
import useCardEmailLog from '../hooks/useCardEmailLog';
import CardEmailBatchList from './CardEmailBatchList';
import CardEmailDeliveries from './CardEmailDeliveries';
import CardEmailLogSearch from './CardEmailLogSearch';

const resultText = (count, search) => `${count} send${count === 1 ? '' : 's'} with an email matching “${search}”`;

/** Attendees → "Card email log" tab: every business card email send and the status of each email. */
export default function CardEmailLogPanel({ eventId, token, searchParams, setSearchParams }) {
    const log = useCardEmailLog({ eventId, token, searchParams, setSearchParams });
    const loading = log.batches.loading || log.deliveries.loading;
    return (
        <div className="card p-5 flex flex-col gap-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h2 className="text-lg font-bold text-text-primary">Business card emails</h2>
                    <p className="text-sm text-text-secondary">
                        Every email sent from Business cards → Email. Open a send to see each email and its status.
                    </p>
                    {log.active && <p className="text-xs text-accent mt-1">Sending… this list refreshes every 5 seconds.</p>}
                </div>
                <button type="button" className="btn btn-secondary gap-2" onClick={log.refresh} disabled={loading}>
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>
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
