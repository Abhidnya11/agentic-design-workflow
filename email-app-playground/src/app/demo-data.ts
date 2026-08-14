/**
 * The content the Figma Inbox Template (node 17:5724) ships with, plus enough
 * mail to make the Slot scroll.
 *
 * This is demo data, not part of the design system. Replace it wholesale on
 * your branch — the components take everything here as props.
 */
import type { EmailRowProps } from '@/components/EmailRow';
import type { Account, NavGroup } from '@/components/Sidebar';

export const ACCOUNT: Account = {
  name: 'Abhidnya Patil',
  email: 'abhidnya8@gmail.com',
  avatarSrc: '/avatar-demo.png',
};

export const NAV_GROUPS: NavGroup[] = [
  {
    id: 'views',
    title: 'Views',
    items: [
      { id: 'inbox', label: 'Inbox', count: '99+' },
      { id: 'promotion', label: 'Promotion', count: '13' },
      { id: 'labels', label: 'Labels' },
      { id: 'social', label: 'Social', count: '83' },
    ],
  },
  {
    id: 'mail',
    title: 'Mail',
    items: [
      { id: 'all-mail', label: 'All mail' },
      { id: 'sent', label: 'Sent' },
      { id: 'drafts', label: 'Drafts' },
      { id: 'spam', label: 'Spam' },
      { id: 'trash', label: 'Trash' },
    ],
  },
  {
    id: 'notion-apps',
    title: 'Notion apps',
    items: [
      { id: 'notion', label: 'Notion' },
      { id: 'notion-calendar', label: 'Notion Calendar' },
    ],
  },
  // The footer group carries no Nav Subheader in the master.
  {
    id: 'utility',
    items: [
      { id: 'settings', label: 'Settings' },
      { id: 'support', label: 'Support & feedback' },
      { id: 'macos-app', label: 'Get macOS app' },
    ],
  },
];

export type DemoEmail = Omit<EmailRowProps, 'interactive' | 'hovered' | 'selected'> & { id: string };

export const EMAILS: DemoEmail[] = [
  {
    id: 'q3-review',
    senders: ['Priya Raghunathan'],
    title: 'Q3 design review',
    description: 'Sharing the deck ahead of Thursday so everyone has time to read',
    labels: [{ label: 'Urgent', type: 'yellow' }],
    trailingIcon: 'paperclip',
    date: 'Aug 11',
  },
  {
    id: 'offsite',
    senders: ['Yuki Tanaka', 'Elena Duarte'],
    category: { label: 'Team', type: 'blue' },
    title: 'Offsite logistics',
    description: 'Final headcount and dietary requirements by end of week please',
    trailingIcon: 'calendar',
    date: 'Aug 11',
  },
  {
    id: 'invoice-4821',
    read: true,
    senders: ['Marcus Bell'],
    title: 'Invoice #4821',
    description: 'Payment received — no action needed, filing for records',
    labels: [{ label: 'Finance', type: 'green' }],
    date: 'Aug 10',
  },
  {
    id: 'token-audit',
    senders: ['Sam Okonkwo', 'Priya Raghunathan', 'Marcus Bell'],
    title: 'Token audit results',
    description: 'Sixteen hardcoded values left, all in the marketing site',
    labels: [{ label: 'Design system', type: 'brown' }],
    date: 'Aug 10',
  },
  {
    id: 'welcome',
    read: true,
    senders: ['Notion Calendar'],
    category: { label: 'Product', type: 'neutral' },
    title: 'Your week ahead',
    description: 'Four meetings Monday, and a clear afternoon on Wednesday',
    date: 'Aug 9',
  },
  {
    id: 'contract',
    senders: ['Bartholomew Fitzgerald-Wellington III'],
    title: 'Contract renewal — action required by Friday',
    description: 'Countersigned copy attached, please return the initialled pages',
    trailingIcon: 'paperclip',
    labels: [{ label: 'Legal', type: 'neutral' }],
    date: 'Aug 9',
  },
  {
    id: 'standup',
    read: true,
    senders: ['Elena Duarte'],
    title: 'Notes from standup',
    description: 'Blocked on the icon export until the library republishes',
    date: 'Aug 8',
  },
  {
    id: 'newsletter',
    read: true,
    senders: ['Figma'],
    category: { label: 'Newsletter', type: 'neutral' },
    title: 'What shipped this month',
    description: 'Variables in more places, and a faster canvas on large files',
    date: 'Aug 8',
  },
  {
    id: 'handoff',
    senders: ['Sam Okonkwo', 'Yuki Tanaka'],
    title: 'Inbox template handoff',
    description: 'Sidebar and filters are in code now — branch off main to prototype',
    labels: [
      { label: 'Design system', type: 'brown' },
      { label: 'Urgent', type: 'yellow' },
    ],
    date: 'Aug 7',
  },
  {
    id: 'recruiting',
    read: true,
    senders: ['Marcus Bell'],
    title: 'Portfolio review scheduled',
    description: 'Thursday 2pm, panel of three, forty minutes plus questions',
    trailingIcon: 'calendar',
    date: 'Aug 7',
  },
  {
    id: 'receipt',
    read: true,
    senders: ['Vercel'],
    category: { label: 'Receipt', type: 'green' },
    title: 'Your July invoice',
    description: 'Charged to the card ending 4402 — nothing owing',
    date: 'Aug 6',
  },
  {
    id: 'a11y',
    senders: ['Priya Raghunathan'],
    title: 'Contrast check on the tertiary token',
    description: 'Content/tertiary on Surface/sunken passes, but only just',
    labels: [{ label: 'Accessibility', type: 'blue' }],
    date: 'Aug 6',
  },
  {
    id: 'offsite-photos',
    read: true,
    senders: ['Elena Duarte', 'Sam Okonkwo', 'Yuki Tanaka', 'Marcus Bell'],
    title: 'Offsite photos',
    description: 'Dropped everything in the shared album, tag yourselves',
    trailingIcon: 'paperclip',
    date: 'Aug 5',
  },
  {
    id: 'survey',
    read: true,
    senders: ['People Ops'],
    category: { label: 'Internal', type: 'neutral' },
    title: 'Engagement survey closes Friday',
    description: 'Ten minutes, anonymous, and genuinely read by the leads',
    date: 'Aug 5',
  },
];
