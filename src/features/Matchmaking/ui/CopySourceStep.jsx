import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

const CopySourceStep = ({ fromId, setFromId, toEventId, error, loading, onContinue }) => (
    <div className="flex flex-col gap-6">
        {error && (
            <div className="p-3 bg-status-danger/5 border border-status-danger/20 rounded-lg flex items-start gap-3 text-status-danger text-sm">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
            </div>
        )}
        <div className="grid grid-cols-2 gap-4">
            <div className="input-group mb-0">
                <label className="input-label">Source event ID</label>
                <input
                    type="number"
                    required
                    className="input-field"
                    placeholder="e.g. 10"
                    value={fromId}
                    onChange={(e) => setFromId(e.target.value)}
                />
            </div>
            <div className="input-group mb-0">
                <label className="input-label">Current event (destination)</label>
                <input type="number" disabled className="input-field bg-bg-tertiary opacity-70" value={toEventId} />
            </div>
        </div>
        <p className="text-xs text-text-secondary">
            Source questions are previewed read-only. Nothing is posted to the source event.
        </p>
        <button
            type="button"
            disabled={loading || !fromId}
            onClick={onContinue}
            className="btn btn-primary w-full gap-2"
        >
            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Continue'}
        </button>
    </div>
);

export default CopySourceStep;
