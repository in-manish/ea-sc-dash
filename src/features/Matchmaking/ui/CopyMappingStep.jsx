import React from 'react';
import { Plus, Trash2, Loader2, AlertCircle } from 'lucide-react';

const CopyMappingStep = ({
    types, setTypes, sourceTypes, destTypes, error, loading, onBack, onSubmit,
}) => {
    const updateRow = (index, field, value) => {
        const next = [...types];
        next[index] = { ...next[index], [field]: value };
        setTypes(next);
    };

    return (
        <div className="flex flex-col gap-5">
            {error && (
                <div className="p-3 bg-status-danger/5 border border-status-danger/20 rounded-lg flex items-start gap-3 text-status-danger text-sm">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}
            <div className="flex justify-between items-center">
                <label className="input-label mb-0">Attendee type map</label>
                <button
                    type="button"
                    onClick={() => setTypes([...types, { from: '', to: '' }])}
                    className="text-xs font-bold text-accent flex items-center gap-1"
                >
                    <Plus size={14} /> Add mapping
                </button>
            </div>
            <p className="text-xs text-text-secondary">
                Unmapped source types copy the question with no destination attendee types.
            </p>
            <datalist id="mm-copy-source-types">{sourceTypes.map((t) => <option key={t.id} value={t.name} />)}</datalist>
            <datalist id="mm-copy-dest-types">{destTypes.map((t) => <option key={t.id} value={t.name} />)}</datalist>
            <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto pr-2">
                {(types.length ? types : [{ from: '', to: '' }]).map((row, i) => (
                    <div key={i} className="flex gap-2 items-center">
                        <input list="mm-copy-source-types" className="input-field py-2 text-sm" placeholder="Source type" value={row.from} onChange={(e) => updateRow(i, 'from', e.target.value)} />
                        <span className="text-text-tertiary">→</span>
                        <input list="mm-copy-dest-types" className="input-field py-2 text-sm" placeholder="Dest type (optional)" value={row.to} onChange={(e) => updateRow(i, 'to', e.target.value)} />
                        <button type="button" onClick={() => setTypes(types.filter((_, idx) => idx !== i))} className="text-text-tertiary hover:text-status-danger p-1" disabled={types.length <= 1}>
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>
            <div className="flex gap-3">
                <button type="button" onClick={onBack} className="btn btn-secondary flex-1">Back</button>
                <button type="button" disabled={loading} onClick={onSubmit} className="btn btn-primary flex-1 gap-2">
                    {loading ? <Loader2 size={16} className="animate-spin" /> : 'Copy questions'}
                </button>
            </div>
        </div>
    );
};

export default CopyMappingStep;
