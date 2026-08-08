import React from 'react';
import { Link2, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { FormField, ToggleSwitch, getInputClass } from './components/SharedComponents';

const LIMIT_MODES = [
    { value: '', label: 'No limit' },
    { value: 'fixed', label: 'Fixed' },
    { value: 'formula', label: 'Formula' },
];

const ComplimentaryInviteeLinks = ({
    eventData,
    addInviteeLink,
    removeInviteeLink,
    handleInviteeLinkChange,
    moveInviteeLink,
    isInviteeLinkModified,
}) => {
    const links = eventData.complimentary_invitee_links || [];

    const getLinkInputClass = (index, fieldName) =>
        getInputClass(fieldName, isInviteeLinkModified(index, fieldName));

    return (
        <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6 pb-2 border-b border-border">
                <div>
                    <h3 className="text-base font-semibold text-text-primary m-0 flex items-center gap-2">
                        <Link2 size={18} className="text-violet-500" />
                        Complimentary Invitee Links
                    </h3>
                    <p className="text-xs text-text-tertiary mt-1">
                        Map form values to ticket links with optional invitee limits.
                    </p>
                </div>
                <button className="btn btn-sm btn-secondary flex items-center gap-1" onClick={addInviteeLink} type="button">
                    <Plus size={14} />
                    Add Link
                </button>
            </div>

            <div className="space-y-4">
                {links.map((item, index) => (
                    <div key={index} className="bg-bg-secondary border border-border rounded-lg p-5">
                        <div className="flex justify-between items-center mb-5">
                            <span className="px-2 py-0.5 bg-bg-tertiary rounded text-[10px] font-bold text-text-tertiary uppercase tracking-tighter">
                                Link #{index + 1}
                            </span>
                            <div className="flex gap-2">
                                <div className="flex rounded border border-border overflow-hidden">
                                    <button
                                        className="w-8 h-8 flex items-center justify-center bg-bg-primary text-text-secondary hover:bg-bg-tertiary disabled:opacity-30"
                                        onClick={() => moveInviteeLink(index, -1)}
                                        disabled={index === 0}
                                        type="button"
                                    >
                                        <ArrowUp size={14} />
                                    </button>
                                    <button
                                        className="w-8 h-8 flex items-center justify-center bg-bg-primary text-text-secondary border-l border-border hover:bg-bg-tertiary disabled:opacity-30"
                                        onClick={() => moveInviteeLink(index, 1)}
                                        disabled={index === links.length - 1}
                                        type="button"
                                    >
                                        <ArrowDown size={14} />
                                    </button>
                                </div>
                                <button
                                    className="w-8 h-8 flex items-center justify-center rounded border border-border bg-bg-primary text-danger hover:bg-red-50"
                                    onClick={() => removeInviteeLink(index)}
                                    type="button"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <FormField label="Title *">
                                <input
                                    type="text"
                                    value={item.title || ''}
                                    onChange={(e) => handleInviteeLinkChange(index, 'title', e.target.value)}
                                    className={getLinkInputClass(index, 'title')}
                                    placeholder="e.g. VIP Invitee Access"
                                    required
                                />
                            </FormField>
                            <FormField label="Description">
                                <textarea
                                    value={item.description || ''}
                                    onChange={(e) => handleInviteeLinkChange(index, 'description', e.target.value)}
                                    className={getLinkInputClass(index, 'description')}
                                    rows={3}
                                    placeholder="Short description for this invitee link..."
                                />
                            </FormField>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <FormField label="Form Value" description="Value matched from the exhibitor form">
                                <input
                                    type="text"
                                    value={item.form_value || ''}
                                    onChange={(e) => handleInviteeLinkChange(index, 'form_value', e.target.value)}
                                    className={getLinkInputClass(index, 'form_value')}
                                    placeholder="e.g. otm-vip-invitee"
                                />
                            </FormField>
                            <FormField
                                label="Link"
                                description="Auto-fills from form value; you can edit manually anytime"
                            >
                                <input
                                    type="url"
                                    value={item.link || ''}
                                    onChange={(e) => handleInviteeLinkChange(index, 'link', e.target.value)}
                                    className={getLinkInputClass(index, 'link')}
                                    placeholder={`https://tickets.fairfest.com/e/reconnect_${eventData.id || ''}?r=`}
                                />
                            </FormField>
                        </div>

                        <div className="mt-4 flex justify-between items-center p-4 bg-bg-primary rounded-lg border border-border text-sm">
                            <div>
                                <p className="font-semibold text-text-primary m-0">Complementary</p>
                                <p className="text-xs text-text-tertiary mt-0.5">Mark this link as complementary access.</p>
                            </div>
                            <ToggleSwitch
                                name={`is_complementary_${index}`}
                                checked={!!item.is_complementary}
                                isModified={isInviteeLinkModified(index, 'is_complementary')}
                                onChange={(e) => handleInviteeLinkChange(index, 'is_complementary', e.target.checked)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <FormField label="Limit Mode" description="How invitee limits are calculated">
                                <select
                                    value={item.limit_mode || ''}
                                    onChange={(e) => handleInviteeLinkChange(index, 'limit_mode', e.target.value)}
                                    className={getLinkInputClass(index, 'limit_mode')}
                                >
                                    {LIMIT_MODES.map(({ value, label }) => (
                                        <option key={value || 'none'} value={value}>{label}</option>
                                    ))}
                                </select>
                            </FormField>

                            {item.limit_mode === 'fixed' && (
                                <FormField label="Invitee Limit" description="Fixed maximum invitees">
                                    <input
                                        type="number"
                                        value={item.invitee_limit ?? ''}
                                        onChange={(e) => handleInviteeLinkChange(index, 'invitee_limit', e.target.value === '' ? '' : Number(e.target.value))}
                                        className={getLinkInputClass(index, 'invitee_limit')}
                                        placeholder="5"
                                        min={0}
                                    />
                                </FormField>
                            )}

                            {item.limit_mode === 'formula' && (
                                <FormField label="Invitee Limit Formula" description="Formula divisor / multiplier for invitee quota">
                                    <input
                                        type="number"
                                        value={item.invitee_limit_formula ?? ''}
                                        onChange={(e) => handleInviteeLinkChange(index, 'invitee_limit_formula', e.target.value === '' ? '' : Number(e.target.value))}
                                        className={getLinkInputClass(index, 'invitee_limit_formula')}
                                        placeholder="10"
                                        min={0}
                                    />
                                </FormField>
                            )}
                        </div>
                    </div>
                ))}

                {links.length === 0 && (
                    <div className="text-center p-12 bg-bg-secondary rounded-lg border border-dashed border-border text-text-tertiary">
                        <p className="mb-4">No complimentary invitee links configured yet.</p>
                        <button className="btn btn-sm btn-secondary" onClick={addInviteeLink} type="button">
                            Add First Link
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComplimentaryInviteeLinks;
