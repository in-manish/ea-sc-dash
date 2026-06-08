import React from 'react';
import { Calendar, Users, Settings, ExternalLink } from 'lucide-react';
import { SectionHeader, FormField, ToggleSwitch, getInputClass } from './components/SharedComponents';

const MeetingDiarySettings = ({ 
    eventData, 
    handleInputChange, 
    isFieldModified,
    handleMeetingDiaryChange,
    isMeetingDiaryModified
}) => {
    return (
        <div className="animate-fade-in space-y-6">
            {/* Section 1: Access */}
            <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
                <SectionHeader icon={Calendar} title="Meeting Diary Access" colorClass="text-amber-500" borderClass="bg-amber-500" />
                <div className="space-y-4">
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
                                    <div className="relative flex items-center gap-2">
                                        <input
                                            type="text"
                                            name="meetingdiary_domain"
                                            value={eventData.meetingdiary_domain || ''}
                                            onChange={handleInputChange}
                                            className={getInputClass('meetingdiary_domain', isFieldModified('meetingdiary_domain'))}
                                            placeholder="example.meetingdiary.com"
                                        />
                                        {eventData.meetingdiary_domain && (
                                            <a 
                                                href={eventData.meetingdiary_domain.startsWith('http') ? eventData.meetingdiary_domain : `https://${eventData.meetingdiary_domain}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="btn btn-secondary p-2 flex items-center justify-center shrink-0"
                                                title="Open in new tab"
                                            >
                                                <ExternalLink size={16} />
                                            </a>
                                        )}
                                    </div>
                                </FormField>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Section 2: Config */}
            <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
                <SectionHeader icon={Settings} title="Meeting Diary Config" colorClass="text-indigo-500" borderClass="bg-indigo-500" />
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                        <FormField label="Active Login Text Display" description="Text to display when login is active">
                            <textarea
                                name="active_login_text_display"
                                value={eventData.meeting_diary?.active_login_text_display || ''}
                                onChange={(e) => handleMeetingDiaryChange('active_login_text_display', e.target.value)}
                                className={getInputClass('active_login_text_display', isMeetingDiaryModified('active_login_text_display'))}
                                placeholder="Enter active login text"
                                rows={4}
                            />
                        </FormField>
                        <FormField label="Inactive Login Text Display" description="Text to display when login is inactive">
                            <textarea
                                name="inactive_login_text_display"
                                value={eventData.meeting_diary?.inactive_login_text_display || ''}
                                onChange={(e) => handleMeetingDiaryChange('inactive_login_text_display', e.target.value)}
                                className={getInputClass('inactive_login_text_display', isMeetingDiaryModified('inactive_login_text_display'))}
                                placeholder="Enter inactive login text"
                                rows={4}
                            />
                        </FormField>
                    </div>
                </div>
            </div>

            {/* Section 3: Allocation */}
            <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
                <SectionHeader icon={Users} title="Meeting Allocation & Limits" colorClass="text-blue-500" borderClass="bg-blue-500" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>
    );
};

export default MeetingDiarySettings;
