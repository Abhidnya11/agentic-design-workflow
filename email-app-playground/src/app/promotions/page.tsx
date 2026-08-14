import type { Metadata } from 'next';
import { PROMOTION_EMAILS } from '../demo-data';
import { Mailbox } from '../mailbox';

export const metadata: Metadata = {
  title: 'Promotion — Design System Playground',
};

export default function PromotionsPage() {
  return <Mailbox navId="promotion" emails={PROMOTION_EMAILS} />;
}
