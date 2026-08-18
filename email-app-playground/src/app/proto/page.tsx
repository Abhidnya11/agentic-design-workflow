import type { Metadata } from 'next';
import Link from 'next/link';
import { Text } from '@/components/atoms';
import { DESIGNERS } from './designers';

/**
 * Index of prototype folders, one per designer. This page and everything
 * under src/app/proto/ is scaffolding, not part of the design system —
 * see CONTRIBUTING.md.
 */
export const metadata: Metadata = {
  title: 'Prototypes — Design System Playground',
};

export default function ProtoIndexPage() {
  return (
    <main style={{ padding: 'var(--ds-spacing-32)', maxWidth: '480px' }}>
      <Link
        href="/"
        className="hover:underline"
        style={{ color: 'var(--ds-content-secondary)', fontSize: 'var(--ds-font-size-sm)' }}
      >
        ← Inbox
      </Link>

      <div style={{ marginTop: 'var(--ds-spacing-16)', marginBottom: 'var(--ds-spacing-24)' }}>
        <Text as="h1" variant="title" color="var(--ds-content-primary)">
          Prototypes
        </Text>
        <p
          style={{
            marginTop: 'var(--ds-spacing-4)',
            color: 'var(--ds-content-secondary)',
            fontSize: 'var(--ds-font-size-md)',
          }}
        >
          One folder per designer. Nothing here affects the Inbox or Promotion routes.
        </p>
      </div>

      <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-spacing-8)' }}>
        {DESIGNERS.map((d) => (
          <li key={d.id}>
            <Link
              href={d.href}
              className="block hover:opacity-70"
              style={{
                padding: 'var(--ds-spacing-12)',
                border: 'var(--ds-border-width-thin) solid var(--ds-border-default)',
                borderRadius: 'var(--ds-radius-8)',
                background: 'var(--ds-surface-elevated)',
              }}
            >
              <Text variant="body-strong" color="var(--ds-content-primary)">
                {d.name}
              </Text>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
