'use client';

import type { FocusEvent, KeyboardEvent } from 'react';
import s from './EmailRow.module.css';
import { ActionBar, Checkbox, IconButton, TagButton, Text, UnreadDot } from './atoms';
import type { TrailingIcon } from './Icon';
import type { TagType } from '@/tokens/tokens';

/** Constraints transcribed from the Figma annotations on section 3:2398. */
export const MAX_LABELS = 2;

export type Tag = { label: string; type?: TagType };

export interface EmailRowProps {
  /** Read?=Yes drops the unread indicator and lightens the sender. */
  read?: boolean;
  /** Hover?=Yes reveals the checkbox and swaps the date for the action bar. */
  hovered?: boolean;
  /** Selected?=Yes tints the row and checks the checkbox. */
  selected?: boolean;
  /** One entry per message in the thread. A counter appears when there's more than one. */
  senders: string[];
  /** "Only 1 tag button to show the category of the email." */
  category?: Tag;
  title: string;
  description: string;
  /** "Can have only up to 2 labels." Extras are dropped. */
  labels?: Tag[];
  /** "Icon button can only be a paperclip or a calendar icon." */
  trailingIcon?: TrailingIcon;
  date: string;
  /**
   * Responds to real pointer and keyboard input. Leave off for static
   * variant grids, where the states are forced via props instead.
   */
  interactive?: boolean;
  /** Fires on pointer enter/leave and focus in/out. */
  onHoverChange?: (hovered: boolean) => void;
  /** Fires on row click, checkbox click, or Enter/Space. */
  onSelectedChange?: (selected: boolean) => void;
}

export function EmailRow({
  read = false,
  hovered = false,
  selected = false,
  senders,
  category,
  title,
  description,
  labels = [],
  trailingIcon,
  date,
  interactive = false,
  onHoverChange,
  onSelectedChange,
}: EmailRowProps) {
  // Enforced at runtime, not just in the types — the design rule is the contract.
  const shownLabels = labels.slice(0, MAX_LABELS);
  const threadCount = senders.length;

  const toggleSelected = () => onSelectedChange?.(!selected);

  const rowHandlers = interactive
    ? {
        tabIndex: 0,
        role: 'button' as const,
        'aria-pressed': selected,
        onMouseEnter: () => onHoverChange?.(true),
        onMouseLeave: () => onHoverChange?.(false),
        // Keyboard users need the checkbox and action bar revealed too.
        onFocus: () => onHoverChange?.(true),
        onBlur: (e: FocusEvent<HTMLDivElement>) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) onHoverChange?.(false);
        },
        onClick: toggleSelected,
        onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleSelected();
          }
        },
      }
    : {};

  return (
    <div className={s.row}>
      <div
        className={s.container}
        data-hovered={hovered}
        data-selected={selected}
        data-interactive={interactive}
        {...rowHandlers}
      >
        <span className={s.checkboxSlot}>
          {/* The Figma master reveals the checkbox on hover/select only. An
              interactive row keeps it mounted so focus and tab order survive
              the reveal — the CSS is what hides it at rest. */}
          {(interactive || hovered || selected) && (
            <Checkbox
              checked={selected}
              label={`Select email from ${senders[0]}`}
              onToggle={interactive ? (next) => onSelectedChange?.(next) : undefined}
            />
          )}
        </span>

        <div className={s.content}>
          <UnreadDot show={!read} />

          <div className={s.messageDetails}>
            <div className={s.senderInfo}>
              {category && <TagButton type={category.type} label={category.label} />}
              <Text
                variant={read ? 'body' : 'body-strong'}
                color="var(--ds-content-primary)"
                truncate
                title={senders.join(', ')}
              >
                {senders.join(', ')}
              </Text>
              {threadCount > 1 && (
                <Text variant="body" color="var(--ds-content-secondary)">
                  {threadCount}
                </Text>
              )}
            </div>

            <div className={s.messageInfo}>
              <Text variant="body-strong" color="var(--ds-content-primary)" truncate title={title}>
                {title}
              </Text>
              <Text variant="body" color="var(--ds-content-secondary)" truncate title={description}>
                {description}
              </Text>
            </div>
          </div>
        </div>

        <div className={s.dateInfo}>
          {hovered ? (
            <ActionBar />
          ) : (
            <>
              {(shownLabels.length > 0 || trailingIcon) && (
                <span className={s.trailing}>
                  {shownLabels.map((l, i) => (
                    <TagButton key={`${l.label}-${i}`} type={l.type} label={l.label} />
                  ))}
                  {trailingIcon && <IconButton icon={trailingIcon} label={trailingIcon} />}
                </span>
              )}
              <span className={s.date}>
                <Text variant="body" color="var(--ds-content-secondary)">
                  {date}
                </Text>
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
