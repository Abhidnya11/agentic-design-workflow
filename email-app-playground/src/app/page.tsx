'use client';

import { useState } from 'react';
import { Chrome } from './chrome';
import { ACCOUNT, EMAILS, NAV_GROUPS, type DemoEmail } from './demo-data';
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

export default function InboxPage() {
  const [selectedNav, setSelectedNav] = useState('inbox');
  /* The Figma Filter has no menu, so there is nothing to open yet — this only
     tracks which control is pressed, and flips its chevron. Replace it with
     real popover state when you build the menu on your branch. */
  const [openFilter, setOpenFilter] = useState<string | null>(null);

  const toggleFilter = (id: string) => setOpenFilter((current) => (current === id ? null : id));

  return (
    <>
      <InboxTemplate
        title={LABEL_BY_ID.get(selectedNav) ?? 'Inbox'}
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
        {EMAILS.map((email) => (
          <ListRow key={email.id} email={email} />
        ))}
      </InboxTemplate>

      <Chrome altHref="/playground" altLabel="Component playground" />
    </>
  );
}
