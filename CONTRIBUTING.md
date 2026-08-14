# Prototyping on a branch

`main` holds the design system: the token layer and the components that match
Figma. Prototypes live on branches. Nothing you build on a branch has to be
merged — the branch **is** the deliverable, and it stays linkable and runnable.

## Start

```bash
git checkout main && git pull
git checkout -b proto/<your-name>-<what-it-is>
cd email-app-playground && npm install && npm run dev
```

Then open `src/app/page.tsx`. That file is a demo composition, not part of the
design system — rewrite it freely.

## Building the thing

The template takes everything as props, so a prototype is usually one file:

```tsx
<InboxTemplate
  title="Inbox"
  account={ACCOUNT}
  groups={NAV_GROUPS}
  selectedId={selectedNav}
  onSelect={setSelectedNav}
  filters={<Filter label="Categories" open={open} onClick={toggle} />}
>
  {emails.map((e) => <EmailRow key={e.id} {...e} />)}
</InboxTemplate>
```

- **Sidebar content** is data: edit `NAV_GROUPS` in `src/app/demo-data.ts`, or
  pass your own array. Groups without a `title` render with no subheader.
- **Emails** are data too, in the same file.
- **New screens** go in `src/app/<your-route>/page.tsx` and get a URL for free.

## The two rules

**1. Don't hardcode values in `src/components`.** Use a token:

```css
padding: var(--ds-spacing-8);      /* yes */
padding: 8px;                      /* no — lint:tokens will fail */
```

`npm run lint:tokens` enforces it. Prose in comments is exempt, so explain
yourself freely.

**2. Don't edit `tokens.css` or `tokens.ts`.** They're generated. Change
`src/tokens/figma-tokens.json` and run `npm run tokens`.

Your own prototype code in `src/app/` is exempt from rule 1 — sketch however you
like there. The rules exist to keep `src/components` a faithful mirror of Figma.

## Before you share it

```bash
npm run lint:tokens && npm run lint && npm run build
git push -u origin proto/<your-branch>
```

## Changing a component

If a prototype needs a real change to a shared component — a new variant, a new
state — change it in Figma first, then bring it across and open a PR to `main`.
Keeping the drift in one direction is the whole point.

If a prototype needs something Figma has no opinion on yet (the Filter dropdown
is the obvious one), build it on your branch and treat the branch as the
proposal. Bring it to `main` once the design lands in Figma.
