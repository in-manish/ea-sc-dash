import { ChevronDown } from 'lucide-react';

const sideLabel = (value) => {
    if (Array.isArray(value)) return value.map(String).join(', ') || '—';
    return value ? String(value) : '—';
};

export default function MappingGroupCard({ group, open, onToggle }) {
    const surveyQuestions = Array.isArray(group.survey_questions) ? group.survey_questions : [];
    const mappings = Array.isArray(group.mappings) ? group.mappings : [];
    const mapCount = group.mapping_count ?? mappings.length;

    return (
        <div className="rounded-lg border border-border bg-bg-secondary overflow-hidden">
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                className="w-full text-left p-4 flex flex-wrap items-start justify-between gap-2 bg-transparent border-none cursor-pointer hover:bg-bg-tertiary/40 transition-colors"
            >
                <div className="min-w-0 flex gap-2">
                    <ChevronDown
                        size={16}
                        className={`mt-0.5 shrink-0 text-text-tertiary transition-transform ${open ? '' : '-rotate-90'}`}
                    />
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-text-primary">
                            Q{group.question_id}: {group.question_title || 'Untitled'}
                        </p>
                        <p className="text-xs text-text-tertiary mt-1">
                            {(group.field_type || 'field').replace('_', ' ')}
                            {' · '}
                            {sideLabel(group.answer_for)}
                            {' · '}
                            {mapCount} option map{mapCount === 1 ? '' : 's'}
                        </p>
                    </div>
                </div>
                {Array.isArray(group.forms) && group.forms.length > 0 && (
                    <span className="text-[11px] text-text-tertiary break-all">{group.forms.join(', ')}</span>
                )}
            </button>

            {open && (
                <div className="px-4 pb-4 space-y-3 border-t border-border">
                    {surveyQuestions.length > 0 && (
                        <div className="space-y-1 pt-3">
                            <p className="text-[11px] font-bold uppercase tracking-wide text-text-tertiary">
                                Survey questions
                            </p>
                            {surveyQuestions.map((sq) => (
                                <p
                                    key={`${sq.form_value}-${sq.survey_question}`}
                                    className="text-xs text-text-secondary"
                                >
                                    <code className="font-mono bg-bg-primary px-1 py-0.5 rounded border border-border">
                                        {sq.survey_question}
                                    </code>
                                    {' '}
                                    {sq.survey_question_title || '—'}
                                    {sq.answer_for ? ` · ${sq.answer_for}` : ''}
                                </p>
                            ))}
                        </div>
                    )}

                    {mappings.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead>
                                    <tr className="text-text-tertiary border-b border-border">
                                        <th className="py-1.5 pr-2 font-semibold">Survey option</th>
                                        <th className="py-1.5 pr-2 font-semibold">EA option</th>
                                        <th className="py-1.5 font-semibold">Side</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mappings.map((row) => (
                                        <tr
                                            key={row.id ?? `${row.survey_option}-${row.option_id}`}
                                            className="border-b border-border/60 last:border-0"
                                        >
                                            <td className="py-1.5 pr-2 text-text-secondary align-top">
                                                {row.survey_option || '—'}
                                            </td>
                                            <td className="py-1.5 pr-2 text-text-primary align-top">
                                                {row.option_name || '—'}
                                                {row.option_id != null && (
                                                    <span className="text-text-tertiary"> (#{row.option_id})</span>
                                                )}
                                            </td>
                                            <td className="py-1.5 text-text-tertiary align-top">
                                                {row.answer_for || '—'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
