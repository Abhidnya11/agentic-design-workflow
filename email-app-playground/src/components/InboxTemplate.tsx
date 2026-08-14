'use client';

import type { ReactNode } from 'react';
import s from './InboxTemplate.module.css';
import { Sidebar, type SidebarProps } from './Sidebar';
import { Text } from './atoms';

/* The Figma Inbox Template (node 17:5724): sidebar, page header, filter bar,
   and a Slot. Everything below the filter bar is yours — drop Email Rows,
   section headers, an empty state, whatever the prototype needs, into
   `children`. */

export interface InboxTemplateProps extends SidebarProps {
  /** The Page Header title — "Inbox" in the master. */
  title: string;
  /**
   * The filter bar. Pass Filter components. Omitted entirely when absent, so
   * the content starts 46px higher — matching a page header with no filters.
   */
  filters?: ReactNode;
  /** The Slot (node 17:5759). */
  children?: ReactNode;
}

export function InboxTemplate({
  title,
  filters,
  children,
  account,
  groups,
  selectedId,
  onSelect,
}: InboxTemplateProps) {
  return (
    <div className={s.template}>
      <Sidebar account={account} groups={groups} selectedId={selectedId} onSelect={onSelect} />

      <div className={s.main}>
        <div className={s.topSection}>
          <header className={s.pageHeader}>
            <Text variant="title" as="h1" color="var(--ds-content-primary)">
              {title}
            </Text>
          </header>

          {filters && (
            <div className={s.filterBar} role="group" aria-label="Filters">
              {filters}
            </div>
          )}
        </div>

        <div className={s.slot}>{children}</div>
      </div>
    </div>
  );
}
