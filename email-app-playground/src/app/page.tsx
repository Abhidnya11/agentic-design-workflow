import { EMAILS } from './demo-data';
import { Mailbox } from './mailbox';

export default function InboxPage() {
  return <Mailbox navId="inbox" emails={EMAILS} />;
}
