import { Loader2, Play, RefreshCw } from 'lucide-react';

export default function BackfillRunPanel({ run, onStartPoll }) {
    const handleRun = async () => {
        await run.run();
        onStartPoll?.();
    };

    return (
        <section className="p-5 bg-bg-primary rounded-lg border border-border space-y-4">
            <div>
                <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                    <Play size={18} className="text-accent" />
                    3. Run backfill
                </h3>
                <p className="text-xs text-text-tertiary mt-1 leading-relaxed">
                    Queues a background job. Leave form blank to backfill every mapped form for this event.
                    There is no job-status endpoint — poll the log below after queuing.
                </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-[1fr_auto] items-end">
                <label className="block text-sm">
                    <span className="text-xs font-semibold text-text-secondary">Form value (optional)</span>
                    <input
                        type="text"
                        value={run.formValue}
                        onChange={(e) => run.setFormValue(e.target.value)}
                        placeholder="e.g. municipalika-trade_visitor"
                        className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-lg bg-bg-secondary"
                    />
                </label>
                <label className="flex items-center gap-2 text-sm text-text-secondary pb-2">
                    <input
                        type="checkbox"
                        checked={run.force}
                        onChange={(e) => run.setForce(e.target.checked)}
                        className="rounded border-border"
                    />
                    Force reprocess
                </label>
            </div>

            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={handleRun}
                    disabled={run.busy}
                    className="btn btn-primary btn-sm gap-2"
                >
                    {run.busy ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                    Queue backfill
                </button>
                <button
                    type="button"
                    onClick={onStartPoll}
                    className="btn btn-secondary btn-sm gap-2"
                >
                    <RefreshCw size={14} />
                    Poll logs
                </button>
            </div>
        </section>
    );
}
