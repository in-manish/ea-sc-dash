export const DEFAULT_AR_TAX_ITEM = {
    name: 'GST',
    rate: 18,
};

/** Backend default when tax was never set. Empty array means no tax. */
export const DEFAULT_AR_TAX = [{ ...DEFAULT_AR_TAX_ITEM }];

export const EMPTY_AR_TAX_ITEM = {
    name: '',
    rate: 0,
};

export const DEFAULT_AR_PAGE = {
    footer: '',
};

export const DEFAULT_ADDITIONAL_REQUIREMENT = {
    tax: DEFAULT_AR_TAX.map((item) => ({ ...item })),
    page: { ...DEFAULT_AR_PAGE },
};

function clampRate(value, fallback = 0) {
    const rate = Number(value);
    if (Number.isNaN(rate)) return fallback;
    return Math.min(100, Math.max(0, rate));
}

/** Drop `type`. Old single objects become a one-item list. */
export function normalizeTaxItem(raw, fallback = EMPTY_AR_TAX_ITEM) {
    const name = typeof raw?.name === 'string' ? raw.name : fallback.name;
    return {
        name,
        rate: clampRate(raw?.rate, fallback.rate),
    };
}

export function normalizeTaxList(raw) {
    if (raw == null) {
        return DEFAULT_AR_TAX.map((item) => ({ ...item }));
    }
    if (Array.isArray(raw)) {
        return raw.map((item) => normalizeTaxItem(item));
    }
    if (typeof raw === 'object') {
        return [normalizeTaxItem(raw, DEFAULT_AR_TAX_ITEM)];
    }
    return DEFAULT_AR_TAX.map((item) => ({ ...item }));
}

export function serializeTaxList(tax) {
    if (Array.isArray(tax)) {
        return tax.map((item) => ({
            name: (item.name || '').trim(),
            rate: Number(item.rate),
        }));
    }
    if (tax && typeof tax === 'object') {
        return [{
            name: (tax.name || '').trim() || DEFAULT_AR_TAX_ITEM.name,
            rate: Number(tax.rate),
        }];
    }
    return DEFAULT_AR_TAX.map((item) => ({ ...item }));
}

export function validateTaxList(tax) {
    const list = Array.isArray(tax) ? tax : tax ? [tax] : [];
    for (let i = 0; i < list.length; i += 1) {
        if (!(list[i].name || '').trim()) {
            return `Tax #${i + 1}: Name is required.`;
        }
        const rate = Number(list[i].rate);
        if (Number.isNaN(rate) || rate < 0 || rate > 100) {
            return `Tax #${i + 1}: Rate must be a number between 0 and 100.`;
        }
    }
    return null;
}

export function taxListCombinedRate(tax) {
    const list = Array.isArray(tax) ? tax : [];
    return list.reduce((sum, item) => sum + (Number(item.rate) || 0), 0);
}

/** Normalize exhibitor_portal_data.additional_requirement with safe defaults. */
export function normalizeAdditionalRequirement(raw) {
    const page = raw?.page || {};
    return {
        tax: normalizeTaxList(raw?.tax),
        page: {
            footer: typeof page.footer === 'string' ? page.footer : DEFAULT_AR_PAGE.footer,
        },
    };
}

export function buildAdditionalRequirementPayload(ar) {
    const src = ar || DEFAULT_ADDITIONAL_REQUIREMENT;
    return {
        tax: serializeTaxList(src.tax),
        page: {
            footer: typeof src.page?.footer === 'string' ? src.page.footer : '',
        },
    };
}

export const DEFAULT_MEETING_DIARY = {
    is_meeting_option_active: false,
};

export function normalizeMeetingDiary(raw) {
    return {
        is_meeting_option_active: !!raw?.is_meeting_option_active,
    };
}

export function buildMeetingDiaryPayload(raw) {
    return normalizeMeetingDiary(raw);
}

export function normalizeExhibitorPortalData(portalData) {
    return {
        ...(portalData && typeof portalData === 'object' ? portalData : {}),
        additional_requirement: normalizeAdditionalRequirement(portalData?.additional_requirement),
        meeting_diary: normalizeMeetingDiary(portalData?.meeting_diary),
    };
}

export function buildExhibitorPortalPayload(portalData) {
    return {
        additional_requirement: buildAdditionalRequirementPayload(
            portalData?.additional_requirement
        ),
        meeting_diary: buildMeetingDiaryPayload(portalData?.meeting_diary),
    };
}

export function getAdditionalRequirement(eventData) {
    return normalizeAdditionalRequirement(eventData?.exhibitor_portal_data?.additional_requirement);
}

export function formatTaxLabel(tax, gstRate) {
    const items = Array.isArray(tax) ? tax : tax ? [tax] : [];
    const names = items
        .map((item) => (item?.name || '').trim() || DEFAULT_AR_TAX_ITEM.name)
        .join(' + ');
    const label = names || 'Tax';
    const rate = gstRate != null ? gstRate : taxListCombinedRate(items);
    return `${label} (${rate}%)`;
}
