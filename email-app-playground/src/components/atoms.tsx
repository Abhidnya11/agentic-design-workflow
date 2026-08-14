'use client';

import type { ReactNode } from 'react';
import s from './atoms.module.css';
import { Icon, type IconName } from './Icon';
import type { TagType } from '@/tokens/tokens';

/* ------------------------------------------------------------------ Text */

const TEXT_CLASS = {
  title: s.title,
  'body-strong': s.bodyStrong,
  body: s.body,
  label: s.label,
} as const;

export type TextVariant = keyof typeof TEXT_CLASS;

export function Text({
  variant,
  children,
  color,
  truncate,
  title,
  className,
  as: Tag = 'span',
}: {
  variant: TextVariant;
  children: ReactNode;
  /**
   * A colour token, e.g. 'var(--ds-content-primary)'. Leave it off when the
   * colour depends on a parent's state — an inline style would beat the CSS.
   */
  color?: string;
  truncate?: boolean;
  title?: string;
  /** Layout and stateful colour from the owning component's stylesheet. */
  className?: string;
  /** The element to render. Style never changes — only the semantics do. */
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3';
}) {
  return (
    <Tag
      className={className ? `${TEXT_CLASS[variant]} ${className}` : TEXT_CLASS[variant]}
      title={title}
      style={{
        color,
        ...(truncate
          ? { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }
          : { whiteSpace: 'nowrap' }),
      }}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------- TagButton */

const TAG_CLASS: Record<TagType, string> = {
  neutral: s.tagNeutral,
  yellow: s.tagYellow,
  green: s.tagGreen,
  blue: s.tagBlue,
  brown: s.tagBrown,
};

export function TagButton({ type = 'neutral', label }: { type?: TagType; label: string }) {
  return (
    <span className={`${s.tag} ${TAG_CLASS[type]}`}>
      <span className={s.label}>{label}</span>
    </span>
  );
}

/* ------------------------------------------------------------ IconButton */

export function IconButton({ icon, label }: { icon: IconName; label: string }) {
  return (
    <button
      type="button"
      className={s.iconButton}
      aria-label={label}
      // Never let a control click bubble into the row's select handler.
      onClick={(e) => e.stopPropagation()}
    >
      <Icon name={icon} size="var(--ds-size-icon-xs)" />
    </button>
  );
}

/* ---------------------------------------------------------- ActionButton */

export function ActionButton({ icon, label }: { icon: IconName; label: string }) {
  return (
    <button
      type="button"
      className={s.actionButton}
      aria-label={label}
      onClick={(e) => e.stopPropagation()}
    >
      <Icon name={icon} size="var(--ds-size-icon-xs)" />
    </button>
  );
}

/* ------------------------------------------------------------- ActionBar */

/** The five row actions, matching the Figma Action Bar slot. */
export const ROW_ACTIONS: { icon: IconName; label: string }[] = [
  { icon: 'star', label: 'Star' },
  { icon: 'archive', label: 'Archive' },
  { icon: 'trash', label: 'Delete' },
  { icon: 'check', label: 'Mark as read' },
  { icon: 'clock', label: 'Snooze' },
];

export function ActionBar({ actions = ROW_ACTIONS }: { actions?: { icon: IconName; label: string }[] }) {
  return (
    <div className={s.actionBar}>
      {actions.map((a) => (
        <ActionButton key={a.label} icon={a.icon} label={a.label} />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------- Checkbox */

export function Checkbox({
  checked,
  label,
  onToggle,
}: {
  checked: boolean;
  label: string;
  onToggle?: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      className={`${s.checkbox} ${checked ? s.checkboxOn : s.checkboxOff}`}
      onClick={(e) => {
        // The row also toggles selection — don't do it twice.
        e.stopPropagation();
        onToggle?.(!checked);
      }}
    >
      <Icon name={checked ? 'checkboxOn' : 'checkboxOff'} size="var(--ds-size-icon-sm)" />
    </button>
  );
}

/* ------------------------------------------------------------- UnreadDot */

/** Keeps the row's horizontal rhythm identical whether or not the dot shows. */
export function UnreadDot({ show }: { show: boolean }) {
  return (
    <span className={s.dotContainer}>
      <span className={show ? s.dot : s.dotSpacer} />
    </span>
  );
}
