export const pillColors = {
    attendee_type: 'bg-blue-50 text-blue-800 border-blue-200',
    reg_type: 'bg-red-50 text-red-800 border-red-200',
    city: 'bg-green-50 text-green-800 border-green-200',
    country: 'bg-green-50 text-green-800 border-green-200',
    is_poc: 'bg-amber-50 text-amber-900 border-amber-200',
    check_in: 'bg-purple-50 text-purple-800 border-purple-200',
    email_sent: 'bg-pink-50 text-pink-800 border-pink-200',
    whatsapp_sent: 'bg-pink-50 text-pink-800 border-pink-200',
    created_at_start: 'bg-slate-50 text-slate-700 border-slate-200',
    created_at_end: 'bg-slate-50 text-slate-700 border-slate-200',
    exhibitor_id: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    parent_exhibitor_id: 'bg-indigo-50 text-indigo-800 border-indigo-200',
};

/** Shared size for Create Attendee + Filter so they always match. */
export const ACTION_BTN_STYLE = {
    height: 48,
    minHeight: 48,
    minWidth: 176,
    paddingLeft: 20,
    paddingRight: 20,
    boxSizing: 'border-box',
};

export const FILTER_PARAM_KEYS = [
    'attendee_type',
    'reg_type',
    'city',
    'state',
    'country',
    'is_poc',
    'email_sent',
    'sms_sent',
    'check_in',
    'whatsapp_sent',
    'created_at_start',
    'created_at_end',
    'modified_at_start',
    'modified_at_end',
    'exhibitor_id',
    'parent_exhibitor_id',
];

export const ATTENDEE_TYPE_OPTIONS = [
    'Exhibitor',
    'Visitor',
    'VIP',
    'Speaker',
    'Media',
    'Contractor',
];
