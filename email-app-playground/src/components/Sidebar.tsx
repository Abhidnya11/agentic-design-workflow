'use client';

import s from './Sidebar.module.css';
import { Text } from './atoms';

/* Transcribed from the Figma Inbox Template sidebar (node 17:5725), which is
   built from the Nav Subheader and Nav Menu Item masters. Nav Menu Item has
   one variant axis — Selected? = No | Yes — and one boolean property, Count. */

export interface NavItem {
  /** Stable key; also what onSelect reports back. */
  id: string;
  label: string;
  /** Count#21:21 — a string so "99+" is as valid as "13". */
  count?: string;
  /** Where the item navigates. Renders an anchor instead of a button. */
  href?: string;
}

export interface NavGroup {
  id: string;
  /** Nav Subheader. Omit it for an unlabelled group, like the footer. */
  title?: string;
  items: NavItem[];
}

export interface Account {
  name: string;
  email: string;
  /** A photo. Falls back to initials on a neutral circle. */
  avatarSrc?: string;
}

export interface SidebarProps {
  account: Account;
  groups: NavGroup[];
  /** id of the NavItem in the Selected?=Yes state. */
  selectedId?: string;
  onSelect?: (id: string) => void;
}

/* ------------------------------------------------------------- NavMenuItem */

export function NavMenuItem({
  label,
  count,
  href,
  selected = false,
  onSelect,
}: Omit<NavItem, 'id'> & { selected?: boolean; onSelect?: () => void }) {
  const inner = (
    <>
      <Text variant="body-strong" className={s.label} truncate title={label}>
        {label}
      </Text>
      {count !== undefined && (
        <Text variant="label" className={s.count}>
          {count}
        </Text>
      )}
    </>
  );

  return (
    <li className={s.item}>
      {href ? (
        <a
          className={s.wrapper}
          href={href}
          data-selected={selected}
          aria-current={selected ? 'page' : undefined}
          onClick={onSelect}
        >
          {inner}
        </a>
      ) : (
        <button
          type="button"
          className={s.wrapper}
          data-selected={selected}
          aria-current={selected ? 'page' : undefined}
          onClick={onSelect}
        >
          {inner}
        </button>
      )}
    </li>
  );
}

/* ------------------------------------------------------------ NavSubheader */

export function NavSubheader({ children }: { children: React.ReactNode }) {
  return (
    <div className={s.subheader}>
      <Text variant="label" color="var(--ds-content-secondary)">
        {children}
      </Text>
    </div>
  );
}

/* ---------------------------------------------------------- AccountHeader */

/** First letters of the first and last word — "Abhidnya Patil" -> "AP". */
function initialsOf(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : '';
  return `${first}${last}`;
}

export function AccountHeader({ name, email, avatarSrc }: Account) {
  return (
    <div className={s.account}>
      {avatarSrc ? (
        /* A 20px avatar from an arbitrary source: next/image buys nothing at
           this size, and the box is fixed in CSS so nothing lays out late. */
        // eslint-disable-next-line @next/next/no-img-element
        <img className={s.avatar} src={avatarSrc} alt="" />
      ) : (
        <span className={`${s.avatar} ${s.initials}`} aria-hidden="true">
          {initialsOf(name)}
        </span>
      )}
      <div className={s.accountText}>
        <Text variant="body-strong" color="var(--ds-content-primary)" truncate title={name}>
          {name}
        </Text>
        <Text variant="label" color="var(--ds-content-secondary)" truncate title={email}>
          {email}
        </Text>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- Sidebar */

export function Sidebar({ account, groups, selectedId, onSelect }: SidebarProps) {
  return (
    <nav className={s.sidebar} aria-label="Sidebar">
      <AccountHeader {...account} />

      {groups.map((group) => (
        <div key={group.id} className={s.group}>
          {group.title && <NavSubheader>{group.title}</NavSubheader>}
          <ul className={s.list} aria-label={group.title}>
            {group.items.map((item) => (
              <NavMenuItem
                key={item.id}
                label={item.label}
                count={item.count}
                href={item.href}
                selected={item.id === selectedId}
                onSelect={onSelect && (() => onSelect(item.id))}
              />
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
