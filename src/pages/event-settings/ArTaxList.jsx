import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { getInputClass } from './components/SharedComponents';
import { taxListCombinedRate } from './exhibitorPortalDefaults';

const ArTaxList = ({ taxes, onChange, onAdd, onRemove, isModified }) => {
    const items = Array.isArray(taxes) ? taxes : [];
    const combined = taxListCombinedRate(items);

    const handleRateChange = (index, raw) => {
        if (raw === '') {
            onChange(index, 'rate', '');
            return;
        }
        const next = Math.min(100, Math.max(0, Number(raw)));
        onChange(index, 'rate', Number.isNaN(next) ? '' : next);
    };

    return (
        <div className="space-y-4 max-w-2xl">
            {items.length === 0 ? (
                <div className="text-center py-8 px-4 border border-dashed border-border rounded-lg bg-bg-secondary">
                    <p className="text-sm font-medium text-text-secondary mb-1">No tax applied</p>
                    <p className="text-xs text-text-tertiary mb-4">
                        An empty list means orders are not taxed. Saving replaces the whole list.
                    </p>
                    <button type="button" className="btn btn-sm btn-secondary inline-flex items-center gap-1.5" onClick={onAdd}>
                        <Plus size={14} />
                        Add tax
                    </button>
                </div>
            ) : (
                <>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 pr-12">
                            <span className="flex-1 text-[10px] font-bold text-text-secondary uppercase tracking-wider">Name</span>
                            <span className="w-24 text-[10px] font-bold text-text-secondary uppercase tracking-wider">Rate (%)</span>
                        </div>
                        {items.map((item, index) => (
                            <TaxRow
                                key={index}
                                item={item}
                                index={index}
                                onChange={onChange}
                                onRemove={onRemove}
                                onRateChange={handleRateChange}
                                isModified={isModified}
                            />
                        ))}
                    </div>
                    {items.length > 1 && (
                        <p className="text-xs text-text-tertiary">
                            Combined rate: <span className="font-medium text-text-secondary tabular-nums">{combined}%</span>
                        </p>
                    )}
                    <button type="button" className="btn btn-sm btn-secondary inline-flex items-center gap-1.5" onClick={onAdd}>
                        <Plus size={14} />
                        Add tax
                    </button>
                </>
            )}
        </div>
    );
};

const TaxRow = ({ item, index, onChange, onRemove, onRateChange, isModified }) => (
    <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
            <input
                type="text"
                value={item.name}
                onChange={(e) => onChange(index, 'name', e.target.value)}
                className={getInputClass(`tax.${index}.name`, isModified?.(index, 'name'))}
                placeholder="GST"
                aria-label={`Tax ${index + 1} name`}
            />
        </div>
        <div className="w-24 shrink-0">
            <input
                type="number"
                min={0}
                max={100}
                step="any"
                value={item.rate}
                onChange={(e) => onRateChange(index, e.target.value)}
                className={getInputClass(`tax.${index}.rate`, isModified?.(index, 'rate'))}
                placeholder="18"
                aria-label={`Tax ${index + 1} rate`}
            />
        </div>
        <button
            type="button"
            onClick={() => onRemove(index)}
            className="w-9 h-9 shrink-0 flex items-center justify-center rounded-md border border-border bg-bg-primary text-danger hover:bg-red-50"
            aria-label={`Remove tax ${index + 1}`}
        >
            <Trash2 size={14} />
        </button>
    </div>
);

export default ArTaxList;
