import React from 'react';
import { Building2 } from 'lucide-react';
import { SectionHeader, ToggleSwitch } from './components/SharedComponents';

const CompanyAccessControlsSection = ({
    eventData,
    handleInputChange,
    isFieldModified,
    handleMeetingOptionActiveChange,
    isMeetingOptionActiveModified,
}) => (
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
            <div className="flex justify-between items-center p-4 bg-bg-secondary rounded-lg border border-border text-sm">
                <div>
                    <p className="font-semibold text-text-primary m-0">Meeting diary option active</p>
                    <p className="text-xs text-text-tertiary mt-0.5">
                        Enable the meeting diary option on the exhibitor portal.
                    </p>
                </div>
                <ToggleSwitch
                    name="is_meeting_option_active"
                    checked={!!eventData.exhibitor_portal_data?.meeting_diary?.is_meeting_option_active}
                    isModified={isMeetingOptionActiveModified?.()}
                    onChange={(e) => handleMeetingOptionActiveChange?.(e.target.checked)}
                />
            </div>
        </div>
    </div>
);

export default CompanyAccessControlsSection;
