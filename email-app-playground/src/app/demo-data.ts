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
      { id: 'inbox', label: 'Inbox', count: '99+', href: '/' },
      { id: 'promotion', label: 'Promotion', count: '13', href: '/promotions' },
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

/**
 * The Promotion view. Thirteen unread, matching the Nav Menu Item count in the
 * master — keep the two in step if you add or remove mail here.
 */
export const PROMOTION_EMAILS: DemoEmail[] = [
  {
    id: 'framer-pro',
    senders: ['Framer'],
    category: { label: 'Deal', type: 'green' },
    title: '50% off Framer Pro — 48 hours only',
    description: 'Annual plans included, and the discount holds for the first year',
    labels: [{ label: 'Expires soon', type: 'yellow' }],
    date: 'Aug 13',
  },
  {
    id: 'config-tickets',
    senders: ['Config'],
    category: { label: 'Event', type: 'blue' },
    title: 'Early-bird tickets are open',
    description: 'Three days in San Francisco, workshops on the Thursday',
    trailingIcon: 'calendar',
    date: 'Aug 13',
  },
  {
    id: 'adobe-renewal',
    senders: ['Adobe Creative Cloud'],
    category: { label: 'Offer', type: 'yellow' },
    title: 'Renew before Sept 3 and keep this year’s price',
    description: 'Your All Apps plan goes up 12% after the renewal window closes',
    date: 'Aug 12',
  },
  {
    id: 'idf-course',
    senders: ['Interaction Design Foundation'],
    category: { label: 'Course', type: 'brown' },
    title: 'New course: Design Leadership for individual contributors',
    description: 'Eight weeks, self-paced, included in your membership',
    date: 'Aug 12',
  },
  {
    id: 'herman-miller',
    senders: ['Herman Miller'],
    category: { label: 'Deal', type: 'green' },
    title: 'Aeron and Embody, 20% off through Sunday',
    description: 'Free delivery on chairs over $800, twelve-year warranty as standard',
    labels: [{ label: 'Ends Sunday', type: 'yellow' }],
    date: 'Aug 12',
  },
  {
    id: 'notion-ai',
    senders: ['Notion'],
    category: { label: 'Product', type: 'neutral' },
    title: 'Notion AI is free on your workspace this quarter',
    description: 'No card needed — it switches on for everyone you’ve invited',
    date: 'Aug 11',
  },
  {
    id: 'awwwards-conf',
    senders: ['Awwwards'],
    category: { label: 'Event', type: 'blue' },
    title: 'Amsterdam lineup announced',
    description: 'Speakers from Linear, Vercel and Pentagram, October 9–10',
    trailingIcon: 'calendar',
    date: 'Aug 11',
  },
  {
    id: 'dribbble-pro',
    read: true,
    senders: ['Dribbble'],
    category: { label: 'Offer', type: 'yellow' },
    title: 'Your Pro trial ends in three days',
    description: 'Keep the analytics and the job board for $5 a month',
    date: 'Aug 10',
  },
  {
    id: 'apple-tradein',
    senders: ['Apple Store'],
    category: { label: 'Offer', type: 'yellow' },
    title: 'Trade in your iPad Pro, get up to $520 credit',
    description: 'Estimate takes two minutes and the credit applies at checkout',
    date: 'Aug 10',
  },
  {
    id: 'dense-discovery',
    senders: ['Dense Discovery'],
    category: { label: 'Newsletter', type: 'neutral' },
    title: 'Issue 312 — tools, books, and one very good chair',
    description: 'Plus a reader discount on the Kinopio lifetime plan',
    date: 'Aug 10',
  },
  {
    id: 'webflow-summit',
    read: true,
    senders: ['Webflow'],
    category: { label: 'Event', type: 'blue' },
    title: 'Webflow Conf goes online this year',
    description: 'Free to attend, recordings up the following week',
    date: 'Aug 9',
  },
  {
    id: 'blue-bottle',
    senders: ['Blue Bottle Coffee'],
    category: { label: 'Deal', type: 'green' },
    title: 'First bag on us with any subscription',
    description: 'Pause or cancel whenever — most people land on every three weeks',
    date: 'Aug 9',
  },
  {
    id: 'linear-upgrade',
    senders: ['Linear', 'Linear'],
    category: { label: 'Product', type: 'neutral' },
    title: 'Business plan, two months free',
    description: 'Reminder: the offer on your workspace runs out this weekend',
    labels: [{ label: 'Expires soon', type: 'yellow' }],
    date: 'Aug 8',
  },
  {
    id: 'nn-group',
    senders: ['Nielsen Norman Group'],
    category: { label: 'Course', type: 'brown' },
    title: 'UX Conference — London, November',
    description: 'Early registration saves $400 across a three-day pass',
    trailingIcon: 'calendar',
    date: 'Aug 8',
  },
  {
    id: 'maze-webinar',
    read: true,
    senders: ['Maze'],
    category: { label: 'Event', type: 'blue' },
    title: 'Webinar: research ops for teams of one',
    description: 'Thursday 11am PT, forty minutes, replay sent to everyone',
    date: 'Aug 7',
  },
  {
    id: 'kickstarter-desk',
    senders: ['Kickstarter'],
    category: { label: 'Deal', type: 'green' },
    title: 'The standing desk you backed ships early',
    description: 'Add the cable tray now and it goes in the same box',
    date: 'Aug 7',
  },
  {
    id: 'superhuman',
    read: true,
    senders: ['Superhuman'],
    category: { label: 'Offer', type: 'yellow' },
    title: 'A month free when a teammate joins',
    description: 'Send them your link and you both get the credit',
    date: 'Aug 6',
  },
];
