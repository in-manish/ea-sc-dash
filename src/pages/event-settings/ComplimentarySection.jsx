import React, { useState } from 'react';
import { Gift } from 'lucide-react';
import { SectionHeader } from './components/SharedComponents';
import ComplimentaryInviteeLinks from './ComplimentaryInviteeLinks';
import ComplimentaryAccessRules from './ComplimentaryAccessRules';

const TABS = [
    { id: 'invitee', label: 'Complimentary Invitee' },
    { id: 'rule', label: 'Complimentary Rule' },
];

const ComplimentarySection = ({
    eventData,
    handleInputChange,
    isFieldModified,
    addInviteeInfo,
    removeInviteeInfo,
    handleInviteeInfoChange,
    togglePreview,
    moveInviteeInfo,
    previewStates,
    addInviteeLink,
    removeInviteeLink,
    handleInviteeLinkChange,
    moveInviteeLink,
    isInviteeLinkModified,
}) => {
    const [activeTab, setActiveTab] = useState('invitee');

    return (
        <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
            <SectionHeader icon={Gift} title="Complimentary" colorClass="text-violet-500" borderClass="bg-violet-500" />

            <div className="relative mb-6 border-b border-border">
                <div className="flex items-center gap-1">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            className={`bg-transparent border-none py-2.5 px-4 text-[13px] font-medium cursor-pointer border-b-2 transition-all duration-200 ${
                                activeTab === tab.id
                                    ? 'text-accent border-accent font-semibold'
                                    : 'text-text-secondary border-transparent hover:text-text-primary hover:border-border-hover'
                            }`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === 'invitee' && (
                <ComplimentaryInviteeLinks
                    eventData={eventData}
                    handleInputChange={handleInputChange}
                    isFieldModified={isFieldModified}
                    addInviteeLink={addInviteeLink}
                    removeInviteeLink={removeInviteeLink}
                    handleInviteeLinkChange={handleInviteeLinkChange}
                    moveInviteeLink={moveInviteeLink}
                    isInviteeLinkModified={isInviteeLinkModified}
                />
            )}

            {activeTab === 'rule' && (
                <ComplimentaryAccessRules
                    eventData={eventData}
                    addInviteeInfo={addInviteeInfo}
                    removeInviteeInfo={removeInviteeInfo}
                    handleInviteeInfoChange={handleInviteeInfoChange}
                    togglePreview={togglePreview}
                    moveInviteeInfo={moveInviteeInfo}
                    previewStates={previewStates}
                />
            )}
        </div>
    );
};

export default ComplimentarySection;
