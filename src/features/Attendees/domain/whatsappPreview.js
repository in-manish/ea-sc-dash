export const getTemplatePreview = (template) => {
    if (!template?.msg_text) return 'No message preview available.';
    return template.msg_text
        .replace(/\\n/g, '\n')
        .replace(/\{\{([^}]+)\}\}/g, (_, key) => `[${key}]`);
};

export const getPreviewAttendeeValue = (attendee, key) => {
    if (!attendee) return `[${key}]`;

    const normalizedKey = String(key).trim().toLowerCase();
    const phone = attendee.phone_number
        ? `+${attendee.country_code || ''} ${attendee.phone_number}`.trim()
        : '';

    const orderedValues = {
        '1': attendee.name,
        '2': attendee.attendee_type,
        '3': attendee.event_name,
        '4': attendee.company,
        '5': attendee.reg_id,
        '6': attendee.email,
        '7': phone,
        '8': attendee.city,
        '9': attendee.country,
    };

    const keyMap = {
        name: attendee.name,
        attendee_name: attendee.name,
        full_name: attendee.name,
        first_name: attendee.name,
        email: attendee.email,
        phone,
        phone_number: phone,
        company: attendee.company,
        organization: attendee.company,
        attendee_type: attendee.attendee_type,
        reg_id: attendee.reg_id,
        registration_id: attendee.reg_id,
        city: attendee.city,
        country: attendee.country,
        event_name: attendee.event_name,
        designation: attendee.designation,
    };

    return orderedValues[normalizedKey] || keyMap[normalizedKey] || `[${key}]`;
};

export const renderWhatsAppPreview = (template, attendee) => {
    if (!template?.msg_text) return 'No preview available.';

    return template.msg_text
        .replace(/\\n/g, '\n')
        .replace(/\{\{([^}]+)\}\}/g, (_, key) => getPreviewAttendeeValue(attendee, key))
        .replace(/\*([^*]+)\*/g, '$1');
};
