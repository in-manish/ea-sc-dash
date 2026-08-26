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
    desc: 'Target emails based on attendee categories.',
    button: 'Create Draft',
  },
  [EMAIL_TABS.TEMPLATES]: {
    title: 'Email Templates',
    desc: 'Reusable email designs for standard communications.',
    button: 'Create Template',
  },
  [EMAIL_TABS.HISTORY_SCHEDULED]: {
    title: 'History/Scheduled',
    desc: 'Sent, in-progress, and scheduled email campaigns.',
    button: null,
  },
};

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
