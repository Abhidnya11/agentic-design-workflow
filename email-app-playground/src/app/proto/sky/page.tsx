import type { Metadata } from 'next';
import Link from 'next/link';
import { Text } from '@/components/atoms';

/**
 * Sky's prototype folder. Placeholder page so the route exists — replace this
 * file with whatever you're building. Add more routes as sibling files or
 * folders here (src/app/proto/sky/<name>/page.tsx), same as any Next.js app.
 * You can import from src/components freely; don't edit files there.
 */
export const metadata: Metadata = {
  title: 'Sky — Prototypes',
};

export default function SkyProtoPage() {
  return (
    <main style={{ padding: 'var(--ds-spacing-32)', maxWidth: '480px' }}>
      <Link
        href="/proto"
        className="hover:underline"
        style={{ color: 'var(--ds-content-secondary)', fontSize: 'var(--ds-font-size-sm)' }}
      >
        ← Prototypes
      </Link>

      <div style={{ marginTop: 'var(--ds-spacing-16)' }}>
        <Text as="h1" variant="title" color="var(--ds-content-primary)">
          Sky
        </Text>
        <p
          style={{
            marginTop: 'var(--ds-spacing-4)',
            color: 'var(--ds-content-secondary)',
            fontSize: 'var(--ds-font-size-md)',
          }}
        >
          Nothing here yet — this is your folder. Edit this file, or add new pages
          under src/app/proto/sky/.
        </p>
      </div>
    </main>
  );
}
