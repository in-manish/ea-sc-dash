import React from 'react';
import { Users, FileText } from 'lucide-react';
import { SectionHeader, ToggleSwitch } from './components/SharedComponents';
import EBadgeEditor from '../../components/common/EBadgeEditor';
import EBadgeTemplateInfo from '../../components/common/EBadgeTemplateInfo';

const AttendeeSettings = ({ eventData, handleInputChange, isFieldModified }) => {
    const handleEBadgeChange = (name, value) => {
        handleInputChange({ target: { name, value, type: 'text' } });
    };

    return (
        <div className="animate-fade-in space-y-6">
            {/* Section 1: Modules & Services */}
            <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
                <SectionHeader icon={Users} title="Active Modules & Services" colorClass="text-indigo-500" borderClass="bg-indigo-500" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between items-center p-4 bg-bg-secondary rounded-lg border border-border">
                        <div>
                            <p className="text-sm font-semibold text-text-primary m-0">Event Status</p>
                            <p className="text-[10px] text-text-tertiary mt-0.5 font-bold uppercase tracking-wider">{eventData.event_active ? 'Online' : 'Offline'}</p>
                        </div>
                        <ToggleSwitch
                            name="event_active"
                            checked={eventData.event_active || false}
                            isModified={isFieldModified('event_active')}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="flex justify-between items-center p-4 bg-bg-secondary rounded-lg border border-border">
                        <div>
                            <p className="text-sm font-semibold text-text-primary m-0">Print & SMS</p>
                            <p className="text-[10px] text-text-tertiary mt-0.5 font-bold uppercase tracking-wider">On-site registration tools</p>
                        </div>
                        <ToggleSwitch
                            name="print_sms_enabled"
                            checked={eventData.print_sms_enabled || false}
                            isModified={isFieldModified('print_sms_enabled')}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="flex justify-between items-center p-4 bg-bg-secondary rounded-lg border border-border">
                        <div>
                            <p className="text-sm font-semibold text-text-primary m-0">Twilio Communications</p>
                            <p className="text-[10px] text-text-tertiary mt-0.5 font-bold uppercase tracking-wider">Global SMS notifications</p>
                        </div>
                        <ToggleSwitch
                            name="twilio_on"
                            checked={eventData.twilio_on || false}
                            isModified={isFieldModified('twilio_on')}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </div>

            {/* Section 2: Global E-Badge Content */}
            <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm space-y-6">
                <SectionHeader icon={FileText} title="Global E-Badge Content" colorClass="text-accent" borderClass="bg-accent" />
                
                <EBadgeEditor
                    label="TV Display E-Badge Content"
                    description="Default content shown on e-badges for attendees registering via TV displays."
                    value={eventData.tv_ebadge_content || ''}
                    onChange={(val) => handleEBadgeChange('tv_ebadge_content', val)}
                />

                <EBadgeEditor
                    label="Standard E-Badge Content"
                    description="Default content shown on e-badges for attendees registering via standard methods (Mobile/Web)."
                    value={eventData.non_tv_ebadge_content || ''}
                    onChange={(val) => handleEBadgeChange('non_tv_ebadge_content', val)}
                />
                
                <EBadgeTemplateInfo />
            </div>

            {/* Section 3: Registration Policy */}
            <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
                <SectionHeader icon={Users} title="Attendee Categories" colorClass="text-teal-500" borderClass="bg-teal-500" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(eventData.attendee_types || []).map(type => (
                        <div key={type.id} className="flex justify-between items-center p-4 bg-bg-secondary rounded-lg border border-border transition-all hover:border-accent/40 group">
                            <span className="text-sm font-medium text-text-primary">{type.name}</span>
                            {type.email_saved && (
                                <span className="py-1 px-2 rounded-full font-bold text-[9px] bg-success/10 text-success uppercase tracking-widest border border-success/20">
                                    Email Active
                                </span>
                            )}
                        </div>
                    ))}
                    {(!eventData.attendee_types || eventData.attendee_types.length === 0) && (
                        <div className="col-span-full py-8 text-center text-text-tertiary italic text-sm">
                            No attendee types configured.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AttendeeSettings;
