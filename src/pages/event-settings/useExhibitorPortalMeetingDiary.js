import { DEFAULT_MEETING_DIARY } from './exhibitorPortalDefaults';

export function useExhibitorPortalMeetingDiary(eventData, originalEventData, setEventData) {
    const handleMeetingOptionActiveChange = (isActive) => {
        setEventData((prev) => ({
            ...prev,
            exhibitor_portal_data: {
                ...(prev.exhibitor_portal_data || {}),
                meeting_diary: {
                    ...(prev.exhibitor_portal_data?.meeting_diary || DEFAULT_MEETING_DIARY),
                    is_meeting_option_active: !!isActive,
                },
            },
        }));
    };

    const isMeetingOptionActiveModified = () => {
        if (!originalEventData) return false;
        const current = !!eventData.exhibitor_portal_data?.meeting_diary?.is_meeting_option_active;
        const original = !!originalEventData.exhibitor_portal_data?.meeting_diary?.is_meeting_option_active;
        return current !== original;
    };

    return { handleMeetingOptionActiveChange, isMeetingOptionActiveModified };
}
