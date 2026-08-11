export const ATTENDEE_QUESTION_TYPE_OPTIONS = [
    { value: 'name', label: 'Name' },
    { value: 'email', label: 'Email' },
    { value: 'country_code', label: 'Country Code' },
    { value: 'phone_number', label: 'Phone Number' },
    { value: 'attendee_type', label: 'Attendee Type' },
    { value: 'reg_type', label: 'Reg Type' },
    { value: 'designation', label: 'Designation' },
    { value: 'company', label: 'Company' },
];

export const EXHIBITOR_QUESTION_TYPE_OPTIONS = [
    { value: 'product', label: 'Product' },
];

export const QUESTION_TYPE_OPTIONS = [
    ...ATTENDEE_QUESTION_TYPE_OPTIONS,
    ...EXHIBITOR_QUESTION_TYPE_OPTIONS,
];

const toMatchKey = (value) =>
    String(value ?? '').trim().toLowerCase().replace(/\s+/g, '_');

export const resolveQuestionType = (value) => {
    if (value == null || value === '') return null;
    const key = toMatchKey(value);
    return QUESTION_TYPE_OPTIONS.find(
        (opt) =>
            opt.value === value ||
            opt.value.toLowerCase() === key ||
            toMatchKey(opt.label) === key ||
            opt.label.toLowerCase() === String(value).trim().toLowerCase(),
    ) ?? null;
};

export const normalizeQuestionType = (value) => resolveQuestionType(value)?.value ?? '';

export const getQuestionTypeLabel = (value) => resolveQuestionType(value)?.label ?? null;

export const questionTypesMatch = (a, b) => {
    if (!a && !b) return true;
    if (!a || !b) return false;
    return normalizeQuestionType(a) === normalizeQuestionType(b);
};

export const isExhibitorQuestionType = (value) =>
    EXHIBITOR_QUESTION_TYPE_OPTIONS.some(opt => opt.value === normalizeQuestionType(value));
