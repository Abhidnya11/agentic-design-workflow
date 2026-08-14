'use client';

import { useState } from 'react';
import { Chrome } from '../chrome';
import { EmailRow, MAX_LABELS, type EmailRowProps, type Tag } from '@/components/EmailRow';
import { TRAILING_ICONS, type TrailingIcon } from '@/components/Icon';
import { TAG_TYPES, type TagType } from '@/tokens/tokens';

/* Realistic seed data — the annotations describe thread counts and long names,
   so the controls need believable content to stress. */
const SENDERS = ['Priya Raghunathan', 'Marcus Bell', 'Yuki Tanaka', 'Elena Duarte', 'Sam Okonkwo'];
const LONG_SENDER = 'Bartholomew Fitzgerald-Wellington III';
const SUBJECTS = [
  { title: 'Q3 design review', description: "Sharing the deck ahead of Thursday so everyone has time to read" },
  { title: 'Invoice #4821', description: 'Payment received — no action needed, filing for records' },
  { title: 'Offsite logistics', description: 'Final headcount and dietary requirements by end of week please' },
];
const LABEL_POOL: Tag[] = [
  { label: 'Finance', type: 'green' },
  { label: 'Urgent', type: 'yellow' },
];

/* Two standalone rows so the list behaves like a real inbox — each tracks its
   own hover and selection, independently of the panel-driven row above. */
const EXTRA_ROWS: Omit<EmailRowProps, 'interactive' | 'hovered' | 'selected'>[] = [
  {
    read: true,
    senders: ['Marcus Bell'],
    title: 'Invoice #4821',
    description: 'Payment received — no action needed, filing for records',
    labels: [{ label: 'Finance', type: 'green' }],
    date: 'Aug 10',
  },
  {
    senders: ['Yuki Tanaka', 'Elena Duarte'],
    category: { label: 'Team', type: 'blue' },
    title: 'Offsite logistics',
    description: 'Final headcount and dietary requirements by end of week please',
    trailingIcon: 'calendar',
    date: 'Aug 8',
  },
];

/** Wraps a row so it owns its own interaction state. */
function InteractiveRow(props: Omit<EmailRowProps, 'interactive' | 'hovered' | 'selected'>) {
  const [hovered, setHovered] = useState(false);
  const [selected, setSelected] = useState(false);
  return (
    <EmailRow
      {...props}
      interactive
      hovered={hovered}
      selected={selected}
      onHoverChange={setHovered}
      onSelectedChange={setSelected}
    />
  );
}

type Panel = {
  read: boolean;
  hovered: boolean;
  selected: boolean;
  senderCount: number;
  longName: boolean;
  category: TagType | 'none';
  labelCount: number;
  trailingIcon: TrailingIcon | 'none';
  subject: number;
};

const INITIAL: Panel = {
  read: false,
  hovered: false,
  selected: false,
  senderCount: 1,
  longName: false,
  category: 'none',
  labelCount: 0,
  trailingIcon: 'none',
  subject: 0,
};

export default function Playground() {
  const [p, setP] = useState<Panel>(INITIAL);

  const set = <K extends keyof Panel>(k: K, v: Panel[K]) => setP((prev) => ({ ...prev, [k]: v }));

  const senders = p.longName
    ? [LONG_SENDER, ...SENDERS.slice(1, p.senderCount)]
    : SENDERS.slice(0, p.senderCount);

  const props = {
    read: p.read,
    hovered: p.hovered,
    selected: p.selected,
    senders,
    category: p.category === 'none' ? undefined : { label: 'Newsletter', type: p.category },
    title: SUBJECTS[p.subject].title,
    description: SUBJECTS[p.subject].description,
    labels: LABEL_POOL.slice(0, p.labelCount),
    trailingIcon: p.trailingIcon === 'none' ? undefined : p.trailingIcon,
    date: 'Aug 11',
  };

  return (
    <main className="mx-auto flex max-w-[1800px] flex-col gap-8 p-8">
      <Chrome altHref="/" altLabel="Inbox template" />

      <header>
        <h1 style={{ font: 'inherit', fontSize: 'var(--ds-font-size-lg)', fontWeight: 600 }}>
          Email Row
        </h1>
        <p style={{ color: 'var(--ds-content-tertiary)', fontSize: 'var(--ds-font-size-sm)' }}>
          Every value resolves to a Figma token. No hardcoded colours, spacing or sizes.
        </p>
      </header>

      {/* ------------------------------------------------------------ live */}
      <Section title="Live component — hover it, click to select">
        <Surface>
          {/* Row 1 is wired to the control panel below; rows 2 and 3 are independent. */}
          <EmailRow
            {...props}
            interactive
            onHoverChange={(v) => set('hovered', v)}
            onSelectedChange={(v) => set('selected', v)}
          />
          {EXTRA_ROWS.map((row) => (
            <InteractiveRow key={row.title} {...row} />
          ))}
        </Surface>
      </Section>

      {/* -------------------------------------------------------- controls */}
      <Section title="Controls">
        <div
          className="grid grid-cols-2 gap-x-10 gap-y-5 rounded-xl p-6 lg:grid-cols-4"
          style={{
            background: 'var(--ds-surface-base)',
            border: 'var(--ds-border-width-thin) solid var(--ds-border-default)',
          }}
        >
          <Field label="State">
            <Check label="Read" checked={p.read} onChange={(v) => set('read', v)} />
            <Check label="Hovered" checked={p.hovered} onChange={(v) => set('hovered', v)} />
            <Check label="Selected" checked={p.selected} onChange={(v) => set('selected', v)} />
            <Hint>Hover and Selected mirror the live row — drive them here or with the mouse.</Hint>
          </Field>

          <Field label={`Thread — ${p.senderCount} message${p.senderCount > 1 ? 's' : ''}`}>
            <input
              type="range"
              min={1}
              max={SENDERS.length}
              value={p.senderCount}
              onChange={(e) => set('senderCount', Number(e.target.value))}
              className="w-full"
            />
            <Check label="Very long sender name" checked={p.longName} onChange={(v) => set('longName', v)} />
            <Hint>Counter appears only above 1 message.</Hint>
          </Field>

          <Field label="Category (max 1)">
            <Select
              value={p.category}
              options={['none', ...TAG_TYPES]}
              onChange={(v) => set('category', v as TagType | 'none')}
            />
          </Field>

          <Field label={`Labels — ${p.labelCount} of ${MAX_LABELS}`}>
            <input
              type="range"
              min={0}
              max={MAX_LABELS}
              value={p.labelCount}
              onChange={(e) => set('labelCount', Number(e.target.value))}
              className="w-full"
            />
            <Hint>Capped at {MAX_LABELS} in types and at runtime.</Hint>
          </Field>

          <Field label="Trailing icon">
            <Select
              value={p.trailingIcon}
              options={['none', ...TRAILING_ICONS]}
              onChange={(v) => set('trailingIcon', v as TrailingIcon | 'none')}
            />
            <Hint>Paperclip or calendar only.</Hint>
          </Field>

          <Field label="Content">
            <Select
              value={String(p.subject)}
              options={SUBJECTS.map((_, i) => String(i))}
              labels={SUBJECTS.map((s) => s.title)}
              onChange={(v) => set('subject', Number(v))}
            />
          </Field>
        </div>
      </Section>

      {/* --------------------------------------------------- variant matrix */}
      <Section title="All 8 variants — compare against Figma">
        <Surface>
          {[false, true].map((read) =>
            [false, true].map((selected) =>
              [false, true].map((hovered) => (
                <EmailRow
                  key={`${read}-${hovered}-${selected}`}
                  {...props}
                  read={read}
                  hovered={hovered}
                  selected={selected}
                />
              ))
            )
          )}
        </Surface>
      </Section>
    </main>
  );
}

/* --------------------------------------------------------- playground chrome */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2
        style={{
          fontSize: 'var(--ds-font-size-sm)',
          color: 'var(--ds-content-tertiary)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function Surface({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="overflow-hidden rounded-xl"
      style={{
        background: 'var(--ds-surface-base)',
        border: 'var(--ds-border-width-thin) solid var(--ds-border-default)',
      }}
    >
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span style={{ fontSize: 'var(--ds-font-size-sm)', color: 'var(--ds-content-primary)', fontWeight: 500 }}>
        {label}
      </span>
      {children}
    </div>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontSize: 'var(--ds-font-size-sm)', color: 'var(--ds-content-tertiary)' }}>{children}</span>
  );
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2" style={{ fontSize: 'var(--ds-font-size-sm)' }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

function Select({
  value,
  options,
  labels,
  onChange,
}: {
  value: string;
  options: readonly string[];
  labels?: string[];
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="cursor-pointer rounded-md px-2 py-1"
      style={{
        background: 'var(--ds-surface-base)',
        border: 'var(--ds-border-width-thin) solid var(--ds-border-default)',
        color: 'var(--ds-content-primary)',
        fontSize: 'var(--ds-font-size-sm)',
      }}
    >
      {options.map((o, i) => (
        <option key={o} value={o}>
          {labels ? labels[i] : o}
        </option>
      ))}
    </select>
  );
}
