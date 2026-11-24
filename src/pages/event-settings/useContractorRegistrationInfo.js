import { CONTRACTOR_REGISTRATION_INFO_KEY } from './exhibitorPortalDefaults';

/** State helpers for exhibitor_portal_data.contractor_registration_information (HTML string). */
export function useContractorRegistrationInfo(eventData, originalEventData, setEventData) {
    const handleContractorRegistrationInfoChange = (value) => {
        setEventData((prev) => ({
            ...prev,
            exhibitor_portal_data: {
                ...(prev.exhibitor_portal_data || {}),
                [CONTRACTOR_REGISTRATION_INFO_KEY]: value ?? '',
            },
        }));
    };

    const isContractorRegistrationInfoModified = () => {
        if (!originalEventData) return false;
        const current = eventData.exhibitor_portal_data?.[CONTRACTOR_REGISTRATION_INFO_KEY] || '';
        const original = originalEventData.exhibitor_portal_data?.[CONTRACTOR_REGISTRATION_INFO_KEY] || '';
        return current !== original;
    };

    return { handleContractorRegistrationInfoChange, isContractorRegistrationInfoModified };
}
