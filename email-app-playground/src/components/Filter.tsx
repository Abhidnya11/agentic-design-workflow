'use client';

import s from './Filter.module.css';
import { Text } from './atoms';
import { Icon, type IconName } from './Icon';

/* The Figma Filter master (node 1:267) is a leading icon, a label and a
   chevron — no variants and no menu. The menu is deliberately left to the
   branch that needs one; this component only owns the control and its states,
   and reports clicks. Wire `open`/`controls` to whatever popover you build. */

export interface FilterProps {
  label: string;
  /** Figma uses the bookmark glyph. Any design-system icon is allowed. */
  icon?: IconName;
  /** The menu this control owns is expanded — flips the chevron. */
  open?: boolean;
  /** A value is applied, so the control reads as primary rather than tertiary. */
  active?: boolean;
  /** id of the popover element, for aria-controls. */
  controls?: string;
  onClick?: () => void;
}

export function Filter({
  label,
  icon = 'bookmark',
  open,
  active = false,
  controls,
  onClick,
}: FilterProps) {
  return (
    <button
      type="button"
      className={s.filter}
      data-open={open ?? false}
      data-active={active}
      // Only claim a popup once a branch has actually attached one.
      aria-haspopup={controls ? 'listbox' : undefined}
      aria-expanded={open === undefined ? undefined : open}
      aria-controls={controls}
      onClick={onClick}
    >
      <span className={s.wrapper}>
        <Icon name={icon} size="var(--ds-size-icon-xs)" />
        <Text variant="body-strong" className={s.label}>
          {label}
        </Text>
      </span>
      <span className={s.chevron}>
        <Icon name="chevronDown" size="var(--ds-size-icon-2xs)" />
      </span>
    </button>
  );
}
