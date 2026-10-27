import { Check } from 'lucide-react';
import { ALL_EXPORT_FIELD_KEYS, EXPORT_FIELD_GROUPS, EXPORT_PRESETS } from '../domain/exportFields';

const sameSet = (a, b) => a.length === b.length && a.every((key) => b.includes(key));

const FieldChip = ({ label, checked, onToggle }) => (
    <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={onToggle}
        className={`flex items-center gap-2 px-3 py-2 rounded-md border text-sm text-left transition-colors ${
            checked
                ? 'border-accent bg-bg-secondary text-text-primary font-medium'
                : 'border-border text-text-secondary hover:border-text-tertiary'
        }`}
    >
        <span
            className={`w-4 h-4 shrink-0 rounded border flex items-center justify-center ${
                checked ? 'bg-accent border-accent text-accent-text' : 'border-border'
            }`}
        >
            {checked && <Check size={12} strokeWidth={3} />}
        </span>
        {label}
    </button>
);

const FieldGroup = ({ group, fields, onToggle, onSetFields }) => {
    const keys = group.fields.map((f) => f.key);
    const allOn = keys.every((key) => fields.includes(key));
    const toggleGroup = () =>
        onSetFields(allOn ? fields.filter((k) => !keys.includes(k)) : [...new Set([...fields, ...keys])]);

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">{group.title}</span>
                <button type="button" className="text-xs text-accent hover:underline" onClick={toggleGroup}>
                    {allOn ? 'Clear' : 'Select all'}
                </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
                {group.fields.map((f) => (
                    <FieldChip
                        key={f.key}
                        label={f.label}
                        checked={fields.includes(f.key)}
                        onToggle={() => onToggle(f.key)}
                    />
                ))}
            </div>
        </div>
    );
};

/** Grouped field checklist with quick presets. */
export default function AttendeeExportFieldPicker({ fields, onToggle, onSetFields }) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                    {EXPORT_PRESETS.map((preset) => {
                        const active = sameSet(fields, preset.fields) && preset.id !== 'none';
                        return (
                            <button
                                key={preset.id}
                                type="button"
                                onClick={() => onSetFields(preset.fields)}
                                className={`px-3 py-1 rounded-full border text-xs font-medium transition-colors ${
                                    active
                                        ? 'border-accent bg-accent text-accent-text'
                                        : 'border-border text-text-secondary hover:border-text-tertiary'
                                }`}
                            >
                                {preset.label}
                            </button>
                        );
                    })}
                </div>
                <span className="text-xs text-text-tertiary">
                    {fields.length} of {ALL_EXPORT_FIELD_KEYS.length} fields
                </span>
            </div>
            {EXPORT_FIELD_GROUPS.map((group) => (
                <FieldGroup key={group.title} group={group} fields={fields} onToggle={onToggle} onSetFields={onSetFields} />
            ))}
        </div>
    );
}
