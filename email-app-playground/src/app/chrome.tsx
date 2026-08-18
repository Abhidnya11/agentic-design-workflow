'use client';

/**
 * Playground chrome — the theme switch and the link between routes.
 *
 * Deliberately NOT part of the design system: it floats above whatever page
 * it is on so the template underneath stays exactly as designed. Delete it
 * from your branch if it gets in the way.
 */
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  return { theme, toggle: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')) };
}

export function Chrome({ altHref, altLabel }: { altHref: string; altLabel: string }) {
  const { theme, toggle } = useTheme();

  const style: React.CSSProperties = {
    background: 'var(--ds-surface-elevated)',
    border: 'var(--ds-border-width-thin) solid var(--ds-border-default)',
    color: 'var(--ds-content-tertiary)',
    fontSize: 'var(--ds-font-size-sm)',
  };

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex items-center gap-1 rounded-full p-1 shadow-sm"
      style={style}
    >
      <Link href={altHref} className="rounded-full px-3 py-1 hover:underline">
        {altLabel}
      </Link>
      <Link href="/proto" className="rounded-full px-3 py-1 hover:underline">
        Prototypes
      </Link>
      <button type="button" onClick={toggle} className="cursor-pointer rounded-full px-3 py-1">
        {theme === 'light' ? 'Dark' : 'Light'}
      </button>
    </div>
  );
}
