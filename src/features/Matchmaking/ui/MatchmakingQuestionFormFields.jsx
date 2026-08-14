import React from 'react';
import FormSelect from '../../../components/common/FormSelect';
import StandardOptionsSection from './StandardOptionsSection';
import GroupedOptionsSection from './GroupedOptionsSection';
import { ATTENDEE_QUESTION_TYPE_OPTIONS, EXHIBITOR_QUESTION_TYPE_OPTIONS, questionTypesMatch } from '../constants/questionTypes';

const FIELD_TYPE_OPTIONS = [
    { value: 'text', label: 'Text Input' },
    { value: 'number', label: 'Number Input' },
    { value: 'radio', label: 'Single Selection' },
    { value: 'array', label: 'Multiple Selection' },
    { value: 'grouped_array', label: 'Grouped List' },
];

const DESIGN_TYPE_OPTIONS = [
    { value: 'vertical', label: 'Vertical List' },
    { value: 'grid', label: 'Multi-Column Grid' },
    { value: 'select', label: 'Native Dropdown' },
];

const QUESTION_TYPE_SELECT_OPTIONS = [
    { value: '', label: 'None' },
    ...ATTENDEE_QUESTION_TYPE_OPTIONS,
    ...EXHIBITOR_QUESTION_TYPE_OPTIONS.map((opt, i) => ({ ...opt, dividerBefore: i === 0 })),
];

const ToggleRow = ({ on, title, hint, onClick }) => (
    <div className="flex items-center gap-4 p-5 bg-bg-secondary/30 rounded-2xl border border-border/40 cursor-pointer hover:border-accent/30" onClick={onClick}>
        <div className={`w-10 h-6 rounded-full p-1 relative ${on ? 'bg-accent' : 'bg-bg-tertiary'}`}>
            <div className={`w-4 h-4 bg-white rounded-full shadow-md ${on ? 'translate-x-4' : 'translate-x-0'} transition-transform`} />
        </div>
        <div>
            <p className="text-sm font-bold text-text-primary">{title}</p>
            <p className="text-xs text-text-tertiary mt-0.5">{hint}</p>
        </div>
    </div>
);

const MatchmakingQuestionFormFields = ({ formData, setFormData, attendeeTypes, editOpt, editGValue }) => (
    <div className="max-w-4xl mx-auto py-12 px-8 space-y-12">
        <section className="space-y-12">
            <h3 className="text-xs uppercase tracking-wider text-text-tertiary font-bold border-b border-border/60 pb-2">1. Core Identity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="md:col-span-2 flex flex-col gap-2">
                    <label className="text-[10px] font-medium text-text-tertiary uppercase tracking-wider ml-1">Question Title</label>
                    <input required type="text" className="input-field py-3 px-5 text-lg font-semibold bg-white border border-border/60 rounded-xl" placeholder="e.g. Which regions do you serve?" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-medium text-text-tertiary uppercase tracking-wider ml-1">Field Type</label>
                    <FormSelect value={formData.type} onChange={(val) => setFormData({ ...formData, type: val })} options={FIELD_TYPE_OPTIONS} />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-medium text-text-tertiary uppercase tracking-wider ml-1">Question Type</label>
                    <FormSelect value={formData.question_type} onChange={(val) => setFormData({ ...formData, question_type: val })} options={QUESTION_TYPE_SELECT_OPTIONS} placeholder="None" matchOption={questionTypesMatch} />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-medium text-text-tertiary uppercase tracking-wider ml-1">Display Layout</label>
                    <FormSelect value={formData.design_type} onChange={(val) => setFormData({ ...formData, design_type: val })} options={DESIGN_TYPE_OPTIONS} />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-medium text-text-tertiary uppercase tracking-wider ml-1">Row Number</label>
                    <input type="number" min={1} className="input-field py-2.5 px-5 text-sm font-semibold bg-white border border-border/60 rounded-xl" value={formData.row_no ?? ''} onChange={(e) => setFormData({ ...formData, row_no: e.target.value === '' ? null : Number(e.target.value) })} />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-medium text-text-tertiary uppercase tracking-wider ml-1">Sort Key</label>
                    <input type="number" min={1} className="input-field py-2.5 px-5 text-sm font-semibold bg-white border border-border/60 rounded-xl" value={formData.sort_key ?? ''} onChange={(e) => setFormData({ ...formData, sort_key: e.target.value === '' ? null : Number(e.target.value) })} />
                </div>
            </div>
        </section>
        <section className="space-y-8">
            <h3 className="text-xs uppercase tracking-wider text-text-tertiary font-bold border-b border-border/60 pb-2">2. Visibility & Logic</h3>
            <div className="bg-white p-8 rounded-xl border border-border/50 space-y-8">
                <div className="space-y-4">
                    <label className="block text-[10px] font-medium text-text-tertiary uppercase tracking-wider ml-1">Visible to Attendee Types</label>
                    <div className="flex flex-wrap gap-2">
                        {attendeeTypes.map((t) => (
                            <button key={t.id} type="button" onClick={() => setFormData((p) => ({ ...p, attendee_types: p.attendee_types.includes(t.id) ? p.attendee_types.filter((x) => x !== t.id) : [...p.attendee_types, t.id] }))} className={`px-4 py-2 rounded-full text-[11px] font-bold border ${formData.attendee_types.includes(t.id) ? 'bg-accent text-white border-accent' : 'bg-bg-secondary text-text-secondary border-border'}`}>
                                {t.name}
                            </button>
                        ))}
                    </div>
                </div>
                <ToggleRow on={formData.is_mandatory} title="Mandatory Question" hint="Required for registration" onClick={() => setFormData({ ...formData, is_mandatory: !formData.is_mandatory })} />
                <ToggleRow on={formData.is_filter} title="Use as Filter" hint="Allow attendees to filter by this question" onClick={() => setFormData({ ...formData, is_filter: !formData.is_filter })} />
                <ToggleRow on={formData.can_support_exhibitor_portal} title="Exhibitor Portal" hint="Show this question on the exhibitor portal matchmaking form" onClick={() => setFormData({ ...formData, can_support_exhibitor_portal: !formData.can_support_exhibitor_portal })} />
            </div>
        </section>
        {['radio', 'array', 'grouped_array'].includes(formData.type) && (
            <section className="space-y-8">
                <h3 className="text-xs uppercase tracking-wider text-text-tertiary font-bold border-b border-border/60 pb-2">3. Available Options</h3>
                <div className="bg-white p-8 rounded-xl border border-border/50">
                    {['radio', 'array'].includes(formData.type) && (
                        <StandardOptionsSection options={formData.options} onAdd={() => setFormData((p) => ({ ...p, options: [...p.options, { name: '' }] }))} onRemove={(i) => setFormData((p) => ({ ...p, options: p.options.filter((_, idx) => idx !== i) }))} onUpdate={editOpt} />
                    )}
                    {formData.type === 'grouped_array' && (
                        <GroupedOptionsSection
                            options={formData.options}
                            onAddGroup={() => setFormData((p) => ({ ...p, options: [...p.options, { name: '', values: [{ name: '' }] }] }))}
                            onRemoveGroup={(i) => setFormData((p) => ({ ...p, options: p.options.filter((_, idx) => idx !== i) }))}
                            onUpdateGroup={editOpt}
                            onAddValue={(gi) => { const n = [...formData.options]; n[gi].values.push({ name: '' }); setFormData({ ...formData, options: n }); }}
                            onRemoveValue={(gi, vi) => { const n = [...formData.options]; n[gi].values.splice(vi, 1); setFormData({ ...formData, options: n }); }}
                            onUpdateValue={editGValue}
                        />
                    )}
                </div>
            </section>
        )}
    </div>
);

export default MatchmakingQuestionFormFields;
