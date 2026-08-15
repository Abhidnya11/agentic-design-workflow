# Agentic Design Workflow — Design System

Code counterpart to the **Agentic Design Workflow** Figma file. Components here
are transcribed from Figma masters and driven entirely by tokens exported from
Figma variables, so a change in the design file has exactly one place to land in
code.

The point of this repo is that designers can branch it and build **real,
interactive prototypes** on top of components that already match the design —
without rebuilding the inbox from scratch every time.

**Figma source of truth:** [Agentic Design Workflow](https://www.figma.com/design/bBtnBaKCvMRYylxj0Ghp2q/Agentic-Design-Workflow)
(file key `bBtnBaKCvMRYylxj0Ghp2q`)

---

## What's in here

| Path                    | What it is                                                                                           |
| ----------------------- | ------------------------------------------------------------------------------------------------------ |
| `email-app-playground/` | **The live work.** Next.js app: the token layer, the components, and the Inbox Template. Start here. |

Everything below refers to `email-app-playground/`.

## Running it

```bash
cd email-app-playground && npm install && npm run dev
```

| Route         | What it shows                                                                    |
| ------------- | -------------------------------------------------------------------------------- |
| `/`           | The **Inbox Template** — sidebar, page header, filter bar, and a slot of Email Rows |
| `/playground` | The **Email Row** on its own, with controls for every variant axis                 |

A floating pill in the bottom-right switches themes and jumps between the two.

## What's built

### Tokens

`src/tokens/figma-tokens.json` is the hand-checked export of the Figma variable
collections. It is the **only** file you edit by hand; everything else is
generated:

```bash
npm run tokens        # -> src/tokens/tokens.css (CSS custom properties, light + dark)
                      # -> src/tokens/tokens.ts  (typed constants + text styles)
```

Primitives are deliberately **not** emitted as CSS variables, so component code
can only reach semantic tokens. That constraint is enforced:

```bash
npm run lint:tokens   # fails on any hex, px literal or rgb() in src/components
```

### Components

Each one mirrors a Figma master, and the Figma node id is in the file header.

| Component                                  | Figma node | Notes                                                                       |
| ------------------------------------------ | ---------- | --------------------------------------------------------------------------- |
| `Text`, `TagButton`, `Checkbox`, `ActionBar`… (`atoms.tsx`) | `3:2169`, `3:2182` | The shared primitives.                                       |
| `Icon` (`Icon.tsx`)                        | `3:2163`   | Paths exported verbatim from Figma, recoloured with `currentColor`.          |
| `EmailRow`                                 | `3:2206`   | 8 variants: `Read?` × `Hover?` × `Selected?`. Max 2 labels, 1 category.      |
| `NavSubheader`, `NavMenuItem`, `Sidebar`   | `3:2197`   | `NavMenuItem` has `Selected?` and an optional count.                        |
| `Filter`                                   | `1:267`    | Icon + label + chevron. **No menu** — see below.                            |
| `InboxTemplate`                            | `17:5724`  | Sidebar + page header + filter bar + slot.                                  |

### Deliberate gaps

Two things are intentionally unfinished, because Figma doesn't define them:

- **`Filter` has no dropdown.** The master is the control only, with no menu and
  no variants. `Filter` therefore renders the control, tracks `open`/`active`,
  and calls `onClick` — the popover is yours to build on your branch.
- **Six sizes aren't Figma variables yet** (`sidebar`, `nav-subheader`,
  `page-header`, `filter-bar`, `page-gutter`, `icon-2xs`). The template lays them
  out as raw numbers on the frames. They're listed under
  `$meta.notYetInFigma` in `figma-tokens.json` — promote them to the Size
  collection when convenient and the flag can go.

## Prototyping on a branch

See [CONTRIBUTING.md](CONTRIBUTING.md).
