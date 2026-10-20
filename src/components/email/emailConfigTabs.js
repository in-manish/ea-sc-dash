import { FileText, History, Layers } from 'lucide-react';

export const EMAIL_TABS = {
  CATEGORIES: 'categories',
  TEMPLATES: 'templates',
  HISTORY_SCHEDULED: 'history_scheduled',
};

export const EMAIL_TAB_ITEMS = [
  { id: EMAIL_TABS.CATEGORIES, label: 'Category Emails', icon: Layers },
  { id: EMAIL_TABS.TEMPLATES, label: 'Templates', icon: FileText },
  { id: EMAIL_TABS.HISTORY_SCHEDULED, label: 'History/Scheduled', icon: History },
];

const TAB_COPY = {
  [EMAIL_TABS.CATEGORIES]: {
    title: 'Category Type Emails',
    desc: 'One-time mailings for a group of attendees, written and sent by you.',
    button: 'Create Draft',
  },
  [EMAIL_TABS.TEMPLATES]: {
    title: 'Email Templates',
    desc: 'Saved emails with {{variables}} that EA fills in for each person.',
    button: 'Create Template',
  },
  [EMAIL_TABS.HISTORY_SCHEDULED]: {
    title: 'History/Scheduled',
    desc: 'Sent, in-progress, and scheduled email campaigns.',
    button: null,
  },
};

// Plain-words guide shown above the Category Emails and Templates tabs.
export const EMAIL_TAB_GUIDE = [
  {
    id: EMAIL_TABS.CATEGORIES,
    title: 'Category Emails: a message you send to a group',
    use: 'You write the message, choose an attendee category (for example Trade Visitors) and send it as a bulk mailing.',
    example: 'Example: "Gates open at 9 AM" to all Trade Visitors.',
  },
  {
    id: EMAIL_TABS.TEMPLATES,
    title: 'Templates: a saved email EA fills in for each person',
    use: 'Has {{variables}} such as {{user_name}} and {{company_name}}. EA or an action (like Meetings → Meeting Attendees) picks it and fills the values for every attendee. One template per type for each event.',
    example: 'Example: "Hi {{user_name}}, you have {{pending_requests_count}} meeting requests."',
  },
];

const CAMPAIGN_TAB_ALIASES = new Set(['history', 'scheduled', 'campaigns', 'history_scheduled']);

export function getEmailTabCopy(tab) {
  return TAB_COPY[tab] || { title: 'Email', desc: 'Manage your email communications.', button: null };
}

export function parseEmailTab(value) {
  if (CAMPAIGN_TAB_ALIASES.has(value)) return EMAIL_TABS.HISTORY_SCHEDULED;
  return EMAIL_TAB_ITEMS.some((item) => item.id === value) ? value : EMAIL_TABS.CATEGORIES;
}

export function isCampaignEmailTab(tab) {
  return tab === EMAIL_TABS.HISTORY_SCHEDULED;
}
