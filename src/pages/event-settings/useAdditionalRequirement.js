import {
    DEFAULT_ADDITIONAL_REQUIREMENT,
    EMPTY_AR_TAX_ITEM,
    normalizeTaxList,
} from './exhibitorPortalDefaults';

function copyAr(current) {
    return {
        tax: normalizeTaxList(current?.tax),
        page: { ...(current?.page || DEFAULT_ADDITIONAL_REQUIREMENT.page) },
    };
}

function patchAdditionalRequirement(setEventData, updater) {
    setEventData((prev) => {
        const current = copyAr(prev.exhibitor_portal_data?.additional_requirement);
        return {
            ...prev,
            exhibitor_portal_data: {
                ...(prev.exhibitor_portal_data || {}),
                additional_requirement: updater(current),
            },
        };
    });
}

export function useAdditionalRequirement(eventData, originalEventData, setEventData) {
    const handleAdditionalRequirementChange = (section, field, value) => {
        patchAdditionalRequirement(setEventData, (current) => {
            if (section !== 'page') return current;
            return {
                ...current,
                page: { ...current.page, [field]: value },
            };
        });
    };

    const handleTaxChange = (index, field, value) => {
        patchAdditionalRequirement(setEventData, (current) => {
            const tax = [...current.tax];
            tax[index] = { ...tax[index], [field]: value };
            return { ...current, tax };
        });
    };

    const addTax = () => {
        patchAdditionalRequirement(setEventData, (current) => ({
            ...current,
            tax: [...current.tax, { ...EMPTY_AR_TAX_ITEM }],
        }));
    };

    const removeTax = (index) => {
        patchAdditionalRequirement(setEventData, (current) => ({
            ...current,
            tax: current.tax.filter((_, i) => i !== index),
        }));
    };

    const isAdditionalRequirementModified = (section, field) => {
        if (!originalEventData) return false;
        const current = eventData.exhibitor_portal_data?.additional_requirement?.[section]?.[field];
        const original = originalEventData.exhibitor_portal_data?.additional_requirement?.[section]?.[field];
        return current !== original;
    };

    const isTaxModified = (index, field) => {
        if (!originalEventData) return false;
        const currentList = eventData.exhibitor_portal_data?.additional_requirement?.tax;
        const originalList = originalEventData.exhibitor_portal_data?.additional_requirement?.tax;
        const current = Array.isArray(currentList) ? currentList[index] : null;
        const original = Array.isArray(originalList) ? originalList[index] : null;
        if (!current) return false;
        if (!original) return true;
        return current[field] !== original[field];
    };

    return {
        handleAdditionalRequirementChange,
        handleTaxChange,
        addTax,
        removeTax,
        isAdditionalRequirementModified,
        isTaxModified,
    };
}
