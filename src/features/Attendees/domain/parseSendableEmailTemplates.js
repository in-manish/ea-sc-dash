import { formatTemplateTypeLabel, isKnownEmailTemplateType } from '../../../components/email/templates/constants/emailTemplateTypes';

/** Templates you create yourself (and meeting_ ones). System templates (badge, exhibitor, password) are left out. */
function isSendableType(templateType) {
    return !isKnownEmailTemplateType(templateType) || String(templateType).startsWith('meeting_');
}

/** Template list rows in the same shape as category emails, so the dialog can show both the same way. */
export function parseSendableEmailTemplates(data) {
    const rows = Array.isArray(data?.results) ? data.results : [];
    return rows
        .filter((row) => row && row.id != null && row.is_active !== false && isSendableType(row.template_type))
        .map((row) => ({
            id: row.id,
            categoryName: formatTemplateTypeLabel(row.template_type),
            emailName: row.email_name || 'Untitled template',
            email: row.email_content || '',
            subject: row.subject ?? null,
        }));
}
