'use client';

/**
 * One mailbox view — the Inbox Template filled with a list of mail.
 *
 * Both routes render this; only the nav id and the mail differ. Demo scaffolding,
 * not part of the design system.
 */
import { useState } from 'react';
import { Chrome } from './chrome';
import { ACCOUNT, NAV_GROUPS, type DemoEmail } from './demo-data';
import { EmailRow } from '@/components/EmailRow';
import { Filter } from '@/components/Filter';
import { InboxTemplate } from '@/components/InboxTemplate';

/** Wraps a row so it owns its own hover and selection, like a real list. */
function ListRow({ email }: { email: DemoEmail }) {
  const [hovered, setHovered] = useState(false);
  const [selected, setSelected] = useState(false);
  return (
    <EmailRow
      {...email}
      interactive
      hovered={hovered}
      selected={selected}
      onHoverChange={setHovered}
      onSelectedChange={setSelected}
    />
  );
}

const LABEL_BY_ID = new Map(NAV_GROUPS.flatMap((g) => g.items.map((i) => [i.id, i.label] as const)));

export interface MailboxProps {
  /** Nav item this route belongs to — seeds the Selected?=Yes state. */
  navId: string;
  emails: DemoEmail[];
  /** Overrides the Page Header title, which otherwise follows the nav label. */
  title?: string;
}

export function Mailbox({ navId, emails, title }: MailboxProps) {
  /* Items with an href navigate and the next page seeds its own selection;
     the rest only have somewhere to go once those routes exist. */
  const [selectedNav, setSelectedNav] = useState(navId);
  /* The Figma Filter has no menu, so there is nothing to open yet — this only
     tracks which control is pressed, and flips its chevron. Replace it with
     real popover state when you build the menu on your branch. */
  const [openFilter, setOpenFilter] = useState<string | null>(null);

  const toggleFilter = (id: string) => setOpenFilter((current) => (current === id ? null : id));

  return (
    <>
      <InboxTemplate
        title={title ?? LABEL_BY_ID.get(selectedNav) ?? 'Inbox'}
        account={ACCOUNT}
        groups={NAV_GROUPS}
        selectedId={selectedNav}
        onSelect={setSelectedNav}
        filters={
          <>
            <Filter
              label="Categories"
              open={openFilter === 'categories'}
              onClick={() => toggleFilter('categories')}
            />
            <Filter
              label="Labels"
              open={openFilter === 'labels'}
              onClick={() => toggleFilter('labels')}
            />
          </>
        }
      >
        {emails.map((email) => (
          <ListRow key={email.id} email={email} />
        ))}
      </InboxTemplate>

      <Chrome altHref="/playground" altLabel="Component playground" />
    </>
  );
}
