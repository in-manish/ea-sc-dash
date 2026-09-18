import {
  ArrowUpFromLine,
  BarChart2,
  Building2,
  Calendar,
  CreditCard,
  Layout,
  MessageSquare,
  Radio,
  ShieldCheck,
  Sparkles,
  Tag,
  UserCog,
  Users,
  Video,
  Wrench,
} from 'lucide-react';

export const EVENT_MAIN_NAV = [
  { kind: 'link', title: 'Attendees', path: '/attendees', icon: Users },
  { kind: 'link', title: 'Uploads', path: '/uploads', icon: ArrowUpFromLine },
  { kind: 'link', title: 'Agenda', path: '/agenda', icon: Calendar },
  {
    kind: 'group',
    title: 'Companies',
    pathPart: '/companies',
    defaultSearch: '?tab=exhibitors',
    icon: Building2,
    children: [
      { title: 'Exhibitors', tab: 'exhibitors', isDefault: true },
      {
        title: 'Product Matchmaking',
        tab: ['product_matchmaking', 'company_products'],
        hrefTab: 'product_matchmaking',
      },
      { title: 'Additional Requirements', tab: 'additional_requirements' },
      { title: 'Exhibitor Engagement', tab: 'exhibitor_engagement' },
    ],
  },
  {
    kind: 'group',
    title: 'Communication',
    pathPart: '/communication',
    defaultSearch: '?tab=whatsapp',
    icon: MessageSquare,
    children: [
      { title: 'WhatsApp', tab: 'whatsapp', isDefault: true },
      { title: 'Email', tab: 'email' },
    ],
  },
  {
    kind: 'group',
    title: 'Reports',
    pathPart: '/reports',
    defaultSearch: '?tab=scan',
    icon: BarChart2,
    children: [
      { title: 'Scan Reports', tab: 'scan', isDefault: true },
      { title: 'Print Reports', tab: 'print' },
      { title: 'Meeting Reports', tab: 'meeting' },
    ],
  },
  { kind: 'link', title: 'AI', path: '/ai', icon: Sparkles },
  { kind: 'link', title: 'Matchmaking', path: '/matchmaking', icon: Layout },
  {
    kind: 'group',
    title: 'Meetings',
    pathPart: '/meetings',
    defaultSearch: '',
    icon: Video,
    children: [
      { title: 'List Meetings', tab: 'list', isDefault: true },
      { title: 'Restore Meeting', tab: 'restore' },
      { title: 'Meeting Stats Report', tab: 'stats' },
    ],
  },
  {
    kind: 'group',
    title: 'Visiq',
    pathPart: '/visiq',
    defaultSearch: '?tab=subscribers',
    icon: Radio,
    children: [
      { title: 'Subscribers', tab: 'subscribers', isDefault: true },
      { title: 'Imports', tab: 'imports' },
    ],
  },
];

export const EVENT_ADMIN_NAV = [
  {
    kind: 'group',
    title: 'Utils Config',
    pathPart: '/utils-config',
    defaultSearch: '?tab=exhibitor_portal',
    icon: Wrench,
    children: [
      { title: 'Exhibitor Portal Setup', tab: 'exhibitor_portal', isDefault: true },
      { title: 'Exhibitor Certificate', tab: 'exhibitor_certificate' },
      { title: 'Celery Manage', tab: 'celery' },
      { title: 'Email Kill Switch', tab: 'email_kill_switch' },
    ],
  },
  {
    kind: 'group',
    title: 'Staff Management',
    pathPart: '/staff',
    defaultSearch: '?tab=print',
    icon: ShieldCheck,
    children: [
      { title: 'Printing', tab: 'print', isDefault: true },
      { title: 'Scanning', tab: 'scan' },
      { title: 'Kiosk', tab: 'kiosk' },
    ],
  },
  { kind: 'link', title: 'Manage Users', path: '/manage-users', icon: UserCog },
  { kind: 'link', title: 'Brand Manage', path: '/brand-manage', icon: Tag },
  { kind: 'link', title: 'Payments', path: '/payments', icon: CreditCard },
];
