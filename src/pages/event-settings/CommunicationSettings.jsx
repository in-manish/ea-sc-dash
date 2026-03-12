import React from 'react';
import { Mail, MessageSquare, User, Image as ImageIcon } from 'lucide-react';
import { SectionHeader, FormField, getInputClass } from './components/SharedComponents';

const CommunicationSettings = ({ eventData, handleInputChange, isFieldModified }) => {
    return (
        <div className="animate-fade-in space-y-6">
            <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
                <SectionHeader icon={Mail} title="Meeting Communications" colorClass="text-blue-600" borderClass="bg-blue-600" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <FormField label="Meeting Email Banner URL" description="Banner image used in meeting-related emails. Falls back to event banner logo if not set.">
                            <div className="relative flex items-center">
                                <ImageIcon size={16} className="absolute left-2.5 text-text-tertiary pointer-events-none" />
                                <input
                                    type="url"
                                    name="meeting_email_banner_link"
                                    value={eventData.meeting_email_banner_link || ''}
                                    onChange={handleInputChange}
                                    className={getInputClass('meeting_email_banner_link', isFieldModified('meeting_email_banner_link'), true)}
                                    placeholder="https://example.com/media/banner.jpg"
                                />
                            </div>
                        </FormField>
                    </div>
                    <div>
                        <FormField label="Meeting Link Label" description="Label/text used when showing the meeting link. Default: 'Meeting Link'">
                            <div className="relative flex items-center">
                                <MessageSquare size={16} className="absolute left-2.5 text-text-tertiary pointer-events-none" />
                                <input
                                    type="text"
                                    name="meeting_link_message"
                                    value={eventData.meeting_link_message || ''}
                                    onChange={handleInputChange}
                                    className={getInputClass('meeting_link_message', isFieldModified('meeting_link_message'), true)}
                                    placeholder="Join Meeting"
                                />
                            </div>
                        </FormField>
                    </div>
                    <div>
                        <FormField label="Footer Regards" description="Footer 'regards' text for emails/SMS. Falls back to event name (OTM/BLTM/TTF).">
                            <input
                                type="text"
                                name="footer_regards"
                                value={eventData.footer_regards || ''}
                                onChange={handleInputChange}
                                className={getInputClass('footer_regards', isFieldModified('footer_regards'))}
                                placeholder="OTM"
                            />
                        </FormField>
                    </div>
                    <div className="md:col-span-2">
                        <FormField label="Default Sender Profile Pic URL" description="Default sender profile picture URL for meeting communications.">
                            <div className="relative flex items-center">
                                <User size={16} className="absolute left-2.5 text-text-tertiary pointer-events-none" />
                                <input
                                    type="url"
                                    name="sender_default_profile_pic"
                                    value={eventData.sender_default_profile_pic || ''}
                                    onChange={handleInputChange}
                                    className={getInputClass('sender_default_profile_pic', isFieldModified('sender_default_profile_pic'), true)}
                                    placeholder="https://example.com/media/sender.jpg"
                                />
                            </div>
                        </FormField>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunicationSettings;
