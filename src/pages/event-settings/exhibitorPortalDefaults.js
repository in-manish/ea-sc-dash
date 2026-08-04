export const DEFAULT_AR_TAX = {
    name: 'GST',
    type: 'percentage',
    rate: 18,
};

export const DEFAULT_AR_PAGE = {
    footer: '',
};

export const DEFAULT_ADDITIONAL_REQUIREMENT = {
    tax: { ...DEFAULT_AR_TAX },
    page: { ...DEFAULT_AR_PAGE },
};

/** Normalize exhibitor_portal_data.additional_requirement with safe defaults. */
export function normalizeAdditionalRequirement(raw) {
    const tax = raw?.tax || {};
    const page = raw?.page || {};
    const type = tax.type === 'fixed' ? 'fixed' : 'percentage';
    let rate = Number(tax.rate);
    if (Number.isNaN(rate)) rate = DEFAULT_AR_TAX.rate;
    if (type === 'percentage') {
        rate = Math.min(100, Math.max(0, rate));
    }

    return {
        tax: {
            name: typeof tax.name === 'string' && tax.name.trim() ? tax.name : DEFAULT_AR_TAX.name,
            type,
            rate,
        },
        page: {
            footer: typeof page.footer === 'string' ? page.footer : DEFAULT_AR_PAGE.footer,
        },
    };
}

export function normalizeExhibitorPortalData(portalData) {
    return {
        ...(portalData && typeof portalData === 'object' ? portalData : {}),
        additional_requirement: normalizeAdditionalRequirement(portalData?.additional_requirement),
    };
}

export function getAdditionalRequirement(eventData) {
    return normalizeAdditionalRequirement(eventData?.exhibitor_portal_data?.additional_requirement);
}

export function formatTaxLabel(tax, gstRate) {
    const name = tax?.name || DEFAULT_AR_TAX.name;
    const rate = gstRate != null ? gstRate : tax?.rate;
    if (tax?.type === 'fixed') {
        return rate != null ? `${name} (${rate})` : name;
    }
    return rate != null ? `${name} (${rate}%)` : name;
}
