export const TEMPLATE_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    PAUSED: 'paused',
    DISABLED: 'disabled',
};

export const STATUS_CHOICES = [
    { value: TEMPLATE_STATUS.PENDING, label: 'Pending Review', hint: 'Awaiting provider or internal review' },
    { value: TEMPLATE_STATUS.APPROVED, label: 'Approved', hint: 'Ready to send to recipients' },
    { value: TEMPLATE_STATUS.REJECTED, label: 'Rejected', hint: 'Not approved — revise before use' },
    { value: TEMPLATE_STATUS.PAUSED, label: 'Paused', hint: 'Temporarily stop sending' },
    { value: TEMPLATE_STATUS.DISABLED, label: 'Disabled', hint: 'Permanently unavailable for sends' },
];

export const STATUS_FILTER_ALL = 'all';

export const CATEGORY_OPTIONS = [
    { value: 'attendee', label: 'Attendee' },
    { value: 'company', label: 'Company' },
];

export const PROVIDER_OPTIONS = [
    { value: 'TWILIO', label: 'Twilio' },
    { value: 'MSG91', label: 'MSG91' },
];

export const DEFAULT_FORM_DATA = {
    template_name: '',
    category: 'attendee',
    description: '',
    status: TEMPLATE_STATUS.PENDING,
    provider: 'TWILIO',
    msg_text: '',
    service_sid: '',
    content_sid: '',
    msg91_template_name: '',
    content_variables: {},
};

export const MSG91_VAR_TYPES = [
    'text',
    'document',
    'image',
    'video',
    'currency',
    'datetime',
];
