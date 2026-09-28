/** Primitives only. Objects and arrays must not be rendered as React children. */
export const formatDetailValue = (value) => {
    if (value == null || value === '') return null;
    const kind = typeof value;
    if (kind === 'string' || kind === 'number' || kind === 'boolean') return value;
    if (Array.isArray(value)) {
        const parts = value
            .map((item) => formatDetailValue(item))
            .filter((item) => item != null && item !== '');
        return parts.length ? parts.join(', ') : null;
    }
    if (kind === 'object') {
        const label = value.name ?? value.title ?? value.label;
        if (label != null && typeof label !== 'object') return String(label);
        const parts = Object.entries(value)
            .map(([key, item]) => {
                const shown = formatDetailValue(item);
                return shown == null || shown === '' ? '' : `${key}: ${shown}`;
            })
            .filter(Boolean);
        return parts.length ? parts.join(', ') : null;
    }
    return String(value);
};

const field = (label, value) => ({ label, value: formatDetailValue(value) });

export const getGroupedFields = (attendee) => {
    if (!attendee) return {};

    const typeName = typeof attendee.attendee_type === 'string'
        ? attendee.attendee_type
        : attendee.attendee_type?.name || '';
    const isExhibitor = typeName === 'Exhibitor' || attendee.attendee_type_sort === 'exhibitor';

    const professionalFields = [
        field('Company', attendee.company),
        field('Designation', attendee.designation),
        field('Website', attendee.website),
        field('Company Address', attendee.company_address),
        field('City', attendee.city),
        field('State', attendee.state),
        field('Country', attendee.country),
    ];

    if (isExhibitor) {
        professionalFields.push(
            field('Exhibitor ID', attendee.exhibitor_id),
            field('Parent Exhibitor ID', attendee.parent_exhibitor_id),
            field('Is POC', attendee.is_poc ? 'Yes' : 'No')
        );
    }

    const registrationFields = [
        field('Reg ID', attendee.reg_id),
        field('Reg Type', attendee.reg_type),
        field('Attendee Type', attendee.attendee_type),
        field('Attendee Type ID', attendee.attendee_type_id),
        field('Attendee Type Sort', attendee.attendee_type_sort),
        field('Login Code', attendee.event_login_code),
        field('Permission 1', attendee.permission1),
    ];

    if (isExhibitor) {
        registrationFields.push(field('OBF Number', attendee.obf_number));
    }

    registrationFields.push(
        field('Upload ID', attendee.upload_id),
        field('EVC ID', attendee.evc_id)
    );

    return {
        Identity: [
            field('Full Name', attendee.name),
            field('Email', attendee.email),
            field('Phone', `+${attendee.country_code || ''} ${attendee.phone_number || ''}`),
            field('ID', attendee.id),
            field('UUID', attendee.uuid),
            field('Tracking UUID', attendee.tracking_uuid),
        ],
        Professional: professionalFields,
        Registration: registrationFields,
        Status: [
            field('Email Sent', attendee.email_sent ? 'Yes' : 'No'),
            field('SMS Sent', attendee.sms_sent ? 'Yes' : 'No'),
            field('WhatsApp Sent', attendee.wa_sent ? 'Yes' : 'No'),
            field('Checked In', attendee.check_in ? 'Yes' : 'No'),
            field('Meeting Enabled', attendee.is_meeting_enabled ? 'Yes' : 'No'),
        ],
        System: [
            field('Event ID', attendee.event_id),
            field('Event Name', attendee.event_name),
            field('Schema', attendee.schema),
            field('Created At', attendee.created_at ? new Date(attendee.created_at).toLocaleString() : '-'),
            field('Modified At', attendee.modified_at ? new Date(attendee.modified_at).toLocaleString() : '-'),
        ],
    };
};

export const needsScSync = (attendee) => !attendee?.evc_id;
