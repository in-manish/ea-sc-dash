import React from 'react';
import { Building2, MapPin, Users, Plus, Trash2, Eye, EyeOff, ArrowUp, ArrowDown, Save } from 'lucide-react';
import { SectionHeader, FormField, ToggleSwitch, getInputClass } from './components/SharedComponents';

const CompanySettings = ({ 
    eventData, 
    handleInputChange, 
    isFieldModified,
    addInviteeInfo,
    removeInviteeInfo,
    handleInviteeInfoChange,
    togglePreview,
    moveInviteeInfo,
    previewStates
}) => {
    const getInviteeInputClass = (index, fieldName) => {
        const isModified = !eventData.originalData?.company_complimentary_invitee_info?.[index] || 
                          eventData.company_complimentary_invitee_info[index][fieldName] !== eventData.originalData.company_complimentary_invitee_info[index][fieldName];
        return getInputClass(fieldName, isModified);
    };

    return (
        <div className="animate-fade-in space-y-6">
            {/* Section 1: Access Controls */}
            <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
                <SectionHeader icon={Building2} title="Platform Access & Controls" colorClass="text-amber-500" borderClass="bg-amber-500" />
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-bg-secondary rounded-lg border border-border text-sm">
                        <div>
                            <p className="font-semibold text-text-primary m-0">Company Lock Display</p>
                            <p className="text-xs text-text-tertiary mt-0.5">Restrict display of companies based on specific criteria.</p>
                        </div>
                        <ToggleSwitch
                            name="is_company_lock_display_enabled"
                            checked={eventData.is_company_lock_display_enabled || false}
                            isModified={isFieldModified('is_company_lock_display_enabled')}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="p-4 bg-bg-secondary rounded-lg border border-border">
                        <div className="flex justify-between items-center text-sm mb-4">
                            <div>
                                <p className="font-semibold text-text-primary m-0">Meeting Diary Portal</p>
                                <p className="text-xs text-text-tertiary mt-0.5">Enable the dedicated B2B meeting diary for exhibitors.</p>
                            </div>
                            <ToggleSwitch
                                name="meeting_diary_enabled"
                                checked={!!eventData.meeting_diary_enabled}
                                isModified={isFieldModified('meeting_diary_enabled')}
                                onChange={handleInputChange}
                            />
                        </div>
                        {eventData.meeting_diary_enabled && (
                            <div className="animate-fade-in pt-4 border-t border-dashed border-border">
                                <FormField label="Diary Sub-Domain">
                                    <input
                                        type="text"
                                        name="meetingdiary_domain"
                                        value={eventData.meetingdiary_domain || ''}
                                        onChange={handleInputChange}
                                        className={getInputClass('meetingdiary_domain', isFieldModified('meetingdiary_domain'))}
                                        placeholder="example.meetingdiary.com"
                                    />
                                </FormField>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Section 2: Allocation Limits */}
            <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
                <SectionHeader icon={Users} title="Allocation & Limits" colorClass="text-blue-500" borderClass="bg-blue-500" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Default Badge Limit" description="Base maximum badge limit per exhibitor">
                        <input
                            type="number"
                            name="badge_limit_default"
                            value={eventData.badge_limit_default || ''}
                            onChange={handleInputChange}
                            className={getInputClass('badge_limit_default', isFieldModified('badge_limit_default'))}
                            placeholder="5"
                        />
                    </FormField>
                    <FormField label="Badge Formula Divisor" description="Derived from space // divisor">
                        <input
                            type="number"
                            name="badge_limit_default_formula"
                            value={eventData.badge_limit_default_formula || ''}
                            onChange={handleInputChange}
                            className={getInputClass('badge_limit_default_formula', isFieldModified('badge_limit_default_formula'))}
                            placeholder="2"
                        />
                    </FormField>
                    <FormField label="Default Meeting Limit" description="Base meeting diary access count">
                        <input
                            type="number"
                            name="meeting_diary_limit_default"
                            value={eventData.meeting_diary_limit_default || ''}
                            onChange={handleInputChange}
                            className={getInputClass('meeting_diary_limit_default', isFieldModified('meeting_diary_limit_default'))}
                            placeholder="2"
                        />
                    </FormField>
                    <FormField label="Meeting Formula Divisor" description="Derived from space // divisor">
                        <input
                            type="number"
                            name="meeting_diary_limit_default_formula"
                            value={eventData.meeting_diary_limit_default_formula || ''}
                            onChange={handleInputChange}
                            className={getInputClass('meeting_diary_limit_default_formula', isFieldModified('meeting_diary_limit_default_formula'))}
                            placeholder="2"
                        />
                    </FormField>
                </div>
            </div>

            {/* Section 3: Resources */}
            <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
                <SectionHeader icon={MapPin} title="Exhibitor Resources" colorClass="text-blue-500" borderClass="bg-blue-500" />
                <div className="space-y-4">
                    <FormField label="Floor Plan URL">
                        <div className="relative flex items-center">
                            <Save size={16} className="absolute left-2.5 text-text-tertiary pointer-events-none" />
                            <input
                                type="url"
                                name="floor_plan_link"
                                value={eventData.floor_plan_link || ''}
                                onChange={handleInputChange}
                                className={getInputClass('floor_plan_link', isFieldModified('floor_plan_link'), true)}
                                placeholder="https://example.com/floor-plan.pdf"
                            />
                        </div>
                    </FormField>
                    <FormField label="Complimentary Invitee Base Link" description="Base URL used to generate complimentary invitee links">
                        <input
                            type="url"
                            name="complimentary_invitee_base_link"
                            value={eventData.complimentary_invitee_base_link || ''}
                            onChange={handleInputChange}
                            className={getInputClass('complimentary_invitee_base_link', isFieldModified('complimentary_invitee_base_link'))}
                            placeholder="https://tickets.fairfest.in/e/..."
                        />
                    </FormField>
                </div>
            </div>

            {/* Section 4: Complimentary Invitee Info */}
            <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6 pb-2 border-b border-border">
                    <h3 className="text-base font-semibold text-text-primary m-0 flex items-center gap-2">
                        <Users size={18} className="text-purple-500" />
                        Complimentary Access Rules
                    </h3>
                    <button className="btn btn-sm btn-secondary flex items-center gap-1" onClick={addInviteeInfo} type="button">
                        <Plus size={14} />
                        Add Block
                    </button>
                </div>

                <div className="space-y-4">
                    {(eventData.company_complimentary_invitee_info || []).map((info, index) => (
                        <div key={index} className="bg-bg-secondary border border-border rounded-lg p-5">
                            <div className="flex justify-between items-center mb-5">
                                <span className="px-2 py-0.5 bg-bg-tertiary rounded text-[10px] font-bold text-text-tertiary uppercase tracking-tighter">Rule Block #{index + 1}</span>
                                <div className="flex gap-2">
                                    <div className="flex rounded border border-border overflow-hidden">
                                        <button
                                            className="w-8 h-8 flex items-center justify-center bg-bg-primary text-text-secondary hover:bg-bg-tertiary disabled:opacity-30"
                                            onClick={() => moveInviteeInfo(index, -1)}
                                            disabled={index === 0}
                                            type="button"
                                        ><ArrowUp size={14} /></button>
                                        <button
                                            className="w-8 h-8 flex items-center justify-center bg-bg-primary text-text-secondary border-l border-border hover:bg-bg-tertiary disabled:opacity-30"
                                            onClick={() => moveInviteeInfo(index, 1)}
                                            disabled={index === (eventData.company_complimentary_invitee_info || []).length - 1}
                                            type="button"
                                        ><ArrowDown size={14} /></button>
                                    </div>
                                    <button
                                        className={`w-8 h-8 flex items-center justify-center rounded border transition-all ${previewStates[index] ? 'bg-accent text-white border-accent' : 'border-border bg-bg-primary text-text-secondary hover:bg-bg-tertiary'}`}
                                        onClick={() => togglePreview(index)}
                                        type="button"
                                    >
                                        {previewStates[index] ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                    <button
                                        className="w-8 h-8 flex items-center justify-center rounded border border-border bg-bg-primary text-danger hover:bg-red-50"
                                        onClick={() => removeInviteeInfo(index)}
                                        type="button"
                                    ><Trash2 size={14} /></button>
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

                    {(!eventData.company_complimentary_invitee_info || eventData.company_complimentary_invitee_info.length === 0) && (
                        <div className="text-center p-12 bg-bg-secondary rounded-lg border border-dashed border-border text-text-tertiary">
                            <p className="mb-4">No complimentary invitee information added yet.</p>
                            <button className="btn btn-sm btn-secondary" onClick={addInviteeInfo} type="button">Add First Block</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompanySettings;
