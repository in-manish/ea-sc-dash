export const getGroupedFields = (attendee) => {
    if (!attendee) return {};

    const isExhibitor =
        attendee.attendee_type === 'Exhibitor' || attendee.attendee_type_sort === 'exhibitor';

    const professionalFields = [
        { label: 'Company', value: attendee.company },
        { label: 'Designation', value: attendee.designation },
        { label: 'Website', value: attendee.website },
        { label: 'Company Address', value: attendee.company_address },
        { label: 'City', value: attendee.city },
        { label: 'State', value: attendee.state },
        { label: 'Country', value: attendee.country },
    ];

    if (isExhibitor) {
        professionalFields.push(
            { label: 'Exhibitor ID', value: attendee.exhibitor_id },
            { label: 'Parent Exhibitor ID', value: attendee.parent_exhibitor_id },
            { label: 'Is POC', value: attendee.is_poc ? 'Yes' : 'No' }
        );
    }

    const registrationFields = [
        { label: 'Reg ID', value: attendee.reg_id },
        { label: 'Reg Type', value: attendee.reg_type },
        { label: 'Attendee Type', value: attendee.attendee_type },
        { label: 'Attendee Type ID', value: attendee.attendee_type_id },
        { label: 'Attendee Type Sort', value: attendee.attendee_type_sort },
        { label: 'Login Code', value: attendee.event_login_code },
    ];

    if (isExhibitor) {
        registrationFields.push({ label: 'OBF Number', value: attendee.obf_number });
    }

    registrationFields.push(
        { label: 'Upload ID', value: attendee.upload_id },
        { label: 'EVC ID', value: attendee.evc_id }
    );

    return {
        Identity: [
            { label: 'Full Name', value: attendee.name },
            { label: 'Email', value: attendee.email },
            {
                label: 'Phone',
                value: `+${attendee.country_code || ''} ${attendee.phone_number || ''}`,
            },
            { label: 'ID', value: attendee.id },
            { label: 'UUID', value: attendee.uuid },
            { label: 'Tracking UUID', value: attendee.tracking_uuid },
        ],
        Professional: professionalFields,
        Registration: registrationFields,
        Status: [
            { label: 'Email Sent', value: attendee.email_sent ? 'Yes' : 'No' },
            { label: 'SMS Sent', value: attendee.sms_sent ? 'Yes' : 'No' },
            { label: 'WhatsApp Sent', value: attendee.wa_sent ? 'Yes' : 'No' },
            { label: 'Checked In', value: attendee.check_in ? 'Yes' : 'No' },
            { label: 'Meeting Enabled', value: attendee.is_meeting_enabled ? 'Yes' : 'No' },
        ],
        System: [
            { label: 'Event ID', value: attendee.event_id },
            { label: 'Event Name', value: attendee.event_name },
            { label: 'Schema', value: attendee.schema },
            {
                label: 'Created At',
                value: attendee.created_at ? new Date(attendee.created_at).toLocaleString() : '-',
            },
            {
                label: 'Modified At',
                value: attendee.modified_at ? new Date(attendee.modified_at).toLocaleString() : '-',
            },
        ],
    };
};

export const needsScSync = (attendee) => !attendee?.evc_id;
