import { eventService } from '../../services/eventService';
import { stripPlaceholderMarks } from '../../components/email/shared/placeholderHighlight';
import { normalizeCalendarHrefs } from './domain/badgeEmailCalendarLinks';

export async function saveAttendeeTypeDrafts({ eventId, token, typeId, emailDraft, smsDraft }) {
    await eventService.saveEmailDraft(eventId, token, {
        attendee_types: [typeId],
        email: normalizeCalendarHrefs(stripPlaceholderMarks(emailDraft.email)),
        subject: emailDraft.subject,
    });

    try {
        await eventService.saveSMSDraft(eventId, token, {
            attendee_types: [typeId],
            sms_body: smsDraft.sms_body || '',
        });
    } catch (error) {
        console.error('Save SMS Draft Error:', error);
    }
}
