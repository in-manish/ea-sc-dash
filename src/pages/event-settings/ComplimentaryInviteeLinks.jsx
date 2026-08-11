import React from 'react';
import { Plus } from 'lucide-react';
import { FormField, getInputClass } from './components/SharedComponents';
import ComplimentaryInviteeLinkItem from './ComplimentaryInviteeLinkItem';

const ComplimentaryInviteeLinks = ({
    eventData,
    handleInputChange,
    isFieldModified,
    addInviteeLink,
    removeInviteeLink,
    handleInviteeLinkChange,
    moveInviteeLink,
    isInviteeLinkModified,
}) => {
    const links = eventData.complimentary_invitee_links || [];

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <button className="btn btn-sm btn-secondary flex items-center gap-1" onClick={addInviteeLink} type="button">
                    <Plus size={14} />
                    Add Link
                </button>
            </div>

            <FormField
                label="Trade Visitor Invite base link"
                description="Base URL used to generate complimentary invitee links"
            >
                <input
                    type="url"
                    name="complimentary_invitee_base_link"
                    value={eventData.complimentary_invitee_base_link || ''}
                    onChange={handleInputChange}
                    className={getInputClass(
                        'complimentary_invitee_base_link',
                        isFieldModified('complimentary_invitee_base_link')
                    )}
                    placeholder="https://tickets.fairfest.in/e/..."
                />
            </FormField>

            {links.map((item, index) => (
                <ComplimentaryInviteeLinkItem
                    key={index}
                    item={item}
                    index={index}
                    eventId={eventData.id}
                    linksLength={links.length}
                    handleInviteeLinkChange={handleInviteeLinkChange}
                    moveInviteeLink={moveInviteeLink}
                    removeInviteeLink={removeInviteeLink}
                    isInviteeLinkModified={isInviteeLinkModified}
                />
            ))}

            {links.length === 0 && (
                <div className="text-center p-12 bg-bg-secondary rounded-lg border border-dashed border-border text-text-tertiary">
                    <p className="mb-4">No complimentary invitee links configured yet.</p>
                    <button className="btn btn-sm btn-secondary" onClick={addInviteeLink} type="button">
                        Add Invitee Link
                    </button>
                </div>
            )}
        </div>
    );
};

export default ComplimentaryInviteeLinks;
