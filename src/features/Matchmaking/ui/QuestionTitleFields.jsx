import React from 'react';
import MatchSideBadge from './MatchSideBadge';

/**
 * All question titles at the top of the editor, in this order:
 * title (offering) → title_seeking → short_title_offering → short_title_seeking → title_filter.
 * Everything except the title is optional; blank = backend default.
 */
const TITLE_FIELDS = [
    {
        key: 'title',
        label: 'Title',
        side: 'offering',
        placeholder: 'e.g. Which regions do you serve?',
        required: true,
        wide: true,
        large: true,
    },
    {
        key: 'title_seeking',
        label: 'Seeking Title',
        side: 'seeking',
        placeholder: 'e.g. Which regions are you looking for?',
        hint: 'Blank uses the title.',
        wide: true,
    },
    {
        key: 'short_title_offering',
        label: 'Short Title (Offering)',
        side: 'offering',
        placeholder: 'e.g. Regions served',
        hint: 'Short label for lists. Blank uses the title.',
    },
    {
        key: 'short_title_seeking',
        label: 'Short Title (Seeking)',
        side: 'seeking',
        placeholder: 'e.g. Target regions',
        hint: 'Short seeking label. Blank uses the offering short title.',
    },
    {
        key: 'title_filter',
        label: 'Filter Title',
        placeholder: 'e.g. Regions',
        hint: 'Shown when used as a filter. Blank uses the title.',
        wide: true,
    },
];

const TitleInput = ({ field, value, onChange }) => {
    const { key, label, side, placeholder, hint, required, wide, large } = field;
    const size = large ? 'py-3 text-lg' : 'py-2.5 text-sm';
    return (
        <div className={`flex flex-col gap-2 ${wide ? 'md:col-span-2' : ''}`}>
            <label htmlFor={`mm-${key}`} className="flex items-center gap-2 text-[10px] font-medium text-text-tertiary uppercase tracking-wider ml-1">
                {label}
                {side && <MatchSideBadge side={side} />}
            </label>
            <input
                id={`mm-${key}`}
                type="text"
                required={required}
                className={`input-field px-5 font-semibold bg-white border border-border/60 rounded-xl ${size}`}
                placeholder={placeholder}
                value={value ?? ''}
                onChange={(e) => onChange(key, e.target.value)}
            />
            {hint && <p className="text-xs text-text-tertiary ml-1">{hint}</p>}
        </div>
    );
};

const QuestionTitleFields = ({ formData, setFormData }) => {
    const handleChange = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));
    return (
        <>
            {TITLE_FIELDS.map((field) => (
                <TitleInput key={field.key} field={field} value={formData[field.key]} onChange={handleChange} />
            ))}
        </>
    );
};

export default QuestionTitleFields;
