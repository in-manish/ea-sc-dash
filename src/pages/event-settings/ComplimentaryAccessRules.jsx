import React from 'react';
import { Plus, Trash2, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';
import { FormField, getInputClass } from './components/SharedComponents';

const ComplimentaryAccessRules = ({
    eventData,
    addInviteeInfo,
    removeInviteeInfo,
    handleInviteeInfoChange,
    togglePreview,
    moveInviteeInfo,
    previewStates,
}) => {
    const rules = eventData.company_complimentary_invitee_info || [];

    const getInviteeInputClass = (index, fieldName) => {
        const isModified =
            !eventData.originalData?.company_complimentary_invitee_info?.[index] ||
            eventData.company_complimentary_invitee_info[index][fieldName] !==
                eventData.originalData.company_complimentary_invitee_info[index][fieldName];
        return getInputClass(fieldName, isModified);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <button className="btn btn-sm btn-secondary flex items-center gap-1" onClick={addInviteeInfo} type="button">
                    <Plus size={14} />
                    Add Block
                </button>
            </div>

            {rules.map((info, index) => (
                <div key={index} className="bg-bg-secondary border border-border rounded-lg p-5">
                    <div className="flex justify-between items-center mb-5">
                        <span className="px-2 py-0.5 bg-bg-tertiary rounded text-[10px] font-bold text-text-tertiary uppercase tracking-tighter">
                            Rule Block #{index + 1}
                        </span>
                        <div className="flex gap-2">
                            <div className="flex rounded border border-border overflow-hidden">
                                <button
                                    className="w-8 h-8 flex items-center justify-center bg-bg-primary text-text-secondary hover:bg-bg-tertiary disabled:opacity-30"
                                    onClick={() => moveInviteeInfo(index, -1)}
                                    disabled={index === 0}
                                    type="button"
                                >
                                    <ArrowUp size={14} />
                                </button>
                                <button
                                    className="w-8 h-8 flex items-center justify-center bg-bg-primary text-text-secondary border-l border-border hover:bg-bg-tertiary disabled:opacity-30"
                                    onClick={() => moveInviteeInfo(index, 1)}
                                    disabled={index === rules.length - 1}
                                    type="button"
                                >
                                    <ArrowDown size={14} />
                                </button>
                            </div>
                            <button
                                className={`w-8 h-8 flex items-center justify-center rounded border transition-all ${
                                    previewStates[index]
                                        ? 'bg-accent text-white border-accent'
                                        : 'border-border bg-bg-primary text-text-secondary hover:bg-bg-tertiary'
                                }`}
                                onClick={() => togglePreview(index)}
                                type="button"
                            >
                                {previewStates[index] ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                            <button
                                className="w-8 h-8 flex items-center justify-center rounded border border-border bg-bg-primary text-danger hover:bg-red-50"
                                onClick={() => removeInviteeInfo(index)}
                                type="button"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <FormField label="Title">
                            <input
                                type="text"
                                value={info.title || ''}
                                onChange={(e) => handleInviteeInfoChange(index, 'title', e.target.value)}
                                className={getInviteeInputClass(index, 'title')}
                                placeholder="Eligibility, Quota, etc."
                            />
                        </FormField>
                        <FormField label="Description (HTML Support)">
                            {previewStates[index] ? (
                                <div
                                    className="bg-bg-primary border border-border rounded-md p-4 min-h-[140px] text-sm leading-relaxed prose prose-sm max-w-none shadow-inner"
                                    dangerouslySetInnerHTML={{ __html: info.description }}
                                />
                            ) : (
                                <textarea
                                    value={info.description || ''}
                                    onChange={(e) => handleInviteeInfoChange(index, 'description', e.target.value)}
                                    className={getInviteeInputClass(index, 'description')}
                                    rows={5}
                                    placeholder="<p>Enter rules here...</p>"
                                />
                            )}
                        </FormField>
                    </div>
                </div>
            ))}

            {rules.length === 0 && (
                <div className="text-center p-12 bg-bg-secondary rounded-lg border border-dashed border-border text-text-tertiary">
                    <p className="mb-4">No complimentary invitee information added yet.</p>
                    <button className="btn btn-sm btn-secondary" onClick={addInviteeInfo} type="button">
                        Add First Block
                    </button>
                </div>
            )}
        </div>
    );
};

export default ComplimentaryAccessRules;
