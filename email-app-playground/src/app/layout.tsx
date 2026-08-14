import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Inbox — Design System Playground',
  description: 'Token-driven components and page templates, mirrored from Figma.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
