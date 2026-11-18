/**
 * Who gets a report email (Business cards / Meeting report dialogs), as explicit choices, and the plain-language
 * plan shown before sending. The EA API is unchanged:
 *   send_to_attendee → each attendee gets only their own files
 *   emails           → these addresses get everyone's files
 *   neither          → EA sends to the organizer's login email
 */
import { MAX_CUSTOM_EMAILS, parseEmailList } from './cardExportRequest';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const DEFAULT_RECIPIENTS = { sendToAttendee: false, sendToMe: true, sendToOthers: false, emailsText: '' };

/** The organizer's own address if we know it (EA login: username is the email). '' when unknown. */
export function myAddress(user) {
  const candidates = [user?.email, user?.username].map((value) => String(value || '').trim().toLowerCase());
  return candidates.find((value) => EMAIL_RE.test(value)) || '';
}

const otherEmails = (form) => (form.sendToOthers ? parseEmailList(form.emailsText) : []);

/** Body fields for EA: { send_to_attendee, emails } (emails left out when empty). */
export function recipientFields(form, me) {
  const emails = otherEmails(form);
  if (form.sendToMe && me && !emails.includes(me)) emails.push(me);
  const fields = { send_to_attendee: Boolean(form.sendToAttendee) };
  if (emails.length) fields.emails = emails;
  return fields;
}

/** First problem with the recipient choice, or ''. */
export function validateRecipients(form, me) {
  if (!form.sendToAttendee && !form.sendToMe && !form.sendToOthers) return 'Choose who should get the email.';
  if (form.sendToOthers) {
    const emails = parseEmailList(form.emailsText);
    if (!emails.length) return 'Add at least one email address under "Other people", or untick it.';
    const bad = emails.find((email) => !EMAIL_RE.test(email));
    if (bad) return `"${bad}" is not a valid email address.`;
    if (emails.length > MAX_CUSTOM_EMAILS) return `Add at most ${MAX_CUSTOM_EMAILS} other email addresses.`;
  }
  if (form.sendToMe && !me && (form.sendToAttendee || form.sendToOthers)) {
    return 'Your email address is not known here, so "Me" can only be used on its own. Add yourself under "Other people" instead.';
  }
  return '';
}

/** "Asha Rao", "Asha Rao and Ben Lee", "Asha Rao, Ben Lee and 3 others"; null when the names are unknown. */
export function nameList(attendees) {
  const names = (attendees || []).map((a) => a.name || a.reg_id).filter(Boolean);
  if (!names.length) return null;
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names[0]}, ${names[1]} and ${names.length - 2} other${names.length - 2 === 1 ? '' : 's'}`;
}

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

/**
 * Plain sentences for "What will happen", e.g.
 *   ['Asha Rao gets 1 email with only their own meeting report (PDF).',
 *    'You (me@x.com) get 1 email with all 3 meeting reports in one combined PDF.']
 * `attendees` = the selected rows (null when "all attendees" is picked: names unknown).
 */
export function emailPlan({ form, me, count, attendees, report, bundle }) {
  const lines = [];
  if (form.sendToAttendee) {
    const names = count === 1 ? nameList(attendees) : null;
    const noEmail = (attendees || []).filter((a) => !String(a.email || '').trim()).length;
    lines.push(names
      ? `${names} gets 1 email with only their own ${report.one}.`
      : `Each of the ${count} attendees gets their own email with only their own ${report.one}.`);
    if (noEmail) lines.push(`${plural(noEmail, 'selected attendee')} ha${noEmail === 1 ? 's' : 've'} no email address and will be skipped.`);
  }
  const everyone = count === 1 ? `the ${report.one}` : `all ${count} ${report.many} ${bundle}`;
  if (form.sendToMe) lines.push(`You (${me || 'your login email'}) get 1 email with ${everyone}.`);
  const others = otherEmails(form).filter((email) => email !== me);
  if (others.length) lines.push(`${others.join(', ')} ${others.length === 1 ? 'gets' : 'each get'} 1 email with ${everyone}.`);
  return lines;
}

/** Emails that will go out (attendees counted as 1 each; some may be skipped). */
export function emailCount(form, me, count) {
  const others = otherEmails(form).filter((email) => email !== me).length;
  return (form.sendToAttendee ? count : 0) + (form.sendToMe ? 1 : 0) + others;
}
