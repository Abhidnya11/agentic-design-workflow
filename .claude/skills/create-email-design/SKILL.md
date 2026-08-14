---
name: create-email-design
description: Create email UI in Figma from published masters — either a single Email Row, or a full inbox screen (Inbox Template + Section Headers + rows in the slot). Use when the user asks to create, generate, add or mock up an email row, an email list, an inbox screen, or an email app screen in Figma — e.g. "add an unread email row with two labels", "build me an inbox screen with 12 emails", "make a mailbox mockup".
---

# Create Email Design

Two modes, one set of rules. Everything is built by **instantiating published masters** and
setting their properties. Never draw by hand, never detach, never hardcode a colour or
dimension — the masters carry every token binding already.

| Mode | Produces | Trigger |
|---|---|---|
| **ROW** | exactly one Email Row on the canvas | "an email row", "a list item", a single-row request |
| **SCREEN** | an Inbox Template instance with Section Headers + Email Rows filled into its slot | "inbox", "screen", "mockup", "a list of emails", any count > 1 |

**Routing:** if the user names a count above one, or says inbox / screen / list / mockup →
SCREEN. A bare "add an email row" → ROW. If genuinely ambiguous, ask once — do not build
both.

## Non-negotiables

- **The code is the contract.** `email-app-playground/src/components/EmailRow.tsx` defines the
  row's real behaviour. Check it before inventing rules — with the grep in §0, not a full read.
  Never conclude "the component doesn't support X" without checking the code first.
- **Instantiate, never redraw.** The Inbox Template is instantiated too — never rebuild the
  sidebar or filter bar by hand, and never code the screen. Only the slot gets filled.
- **Default everything, ask only for overrides** (§1).
- **Confirm before writing.** Show the summary, wait for a yes.
- **Place it where they'll find it.** Stack below existing content, never on top of it — and
  always hand back the deep link (§4). Work the user can't locate may as well not exist.
- **One write call per run.** Resolve, place, build every row and header, and verify in a
  *single* `figma_execute` — pass `timeout: 60000` for SCREEN. Chatty round-trips are the
  main source of wasted tokens.
- **Resolve by key, not node ID.** Node IDs go stale between sessions.
- **Resolve property IDs dynamically.** IDs carry a `#suffix` (`Sender name#16:0`) that
  changes if a property is recreated. Match on the part before `#`.

---

## Checklist — create it, then keep it updated

Create it as the first action of every run; mark each item complete **the moment that step
finishes**, not in a batch at the end. Prefer `TaskCreate` / `TaskUpdate` so it updates live;
otherwise re-print it after each step.

```
- [ ] 0. Grep the code contract (EmailRow.tsx + Icon.tsx)
- [ ] 1. Pick mode; confirm content (defaults shown, user overrides only)
- [ ] 2. Summary + user confirmation
- [ ] 3. Build + verify in one figma_execute
- [ ] 4. Screenshot review (max 3 passes)
- [ ] 5. Lint + report
```

Never mark a step complete before it has actually succeeded. If a step fails, leave it
unchecked, say what went wrong, and stop rather than pressing on.

---

## §0 — The code contract (check this first, every run)

The React implementation is the source of truth for the row's *semantics*. The Figma masters
are the source of truth for *tokens and structure*. When they disagree, the code wins on
behaviour — and the disagreement is a bug worth flagging.

| File | What it settles |
|---|---|
| `email-app-playground/src/components/EmailRow.tsx` | senders/count semantics, `MAX_LABELS`, prop meanings |
| `email-app-playground/src/components/Icon.tsx` | `TRAILING_ICONS` — the only legal trailing icons |

**Grep, don't read.** Every rule those files encode is already transcribed below, so the only
job is *drift detection* — and a targeted grep detects drift exactly as well as a full read:

```bash
grep -nE "MAX_LABELS *=|TRAILING_ICONS *=|senders: string|threadCount *=|slice\(0, MAX" \
  email-app-playground/src/components/EmailRow.tsx \
  email-app-playground/src/components/Icon.tsx
```

Eight lines back instead of 224. If every line matches what's transcribed below, the contract
is intact — proceed. Only if a line is missing or has changed do you open the file properly,
and then update this section.

> `Icon.tsx` is **12.9KB and ~95% SVG path data**. Reading it whole costs ~3.5k tokens to learn
> one line you already have. Measured on a verified run; don't pay it again.

### Rules currently encoded there — enforce all of them

**Senders are an array, not a name.** `EmailRow.tsx`:

```tsx
senders: string[];                       // one entry per message in the thread
const threadCount = senders.length;      // the counter IS the array length
{senders.join(', ')}                     // ALL names, comma-joined, into one text field
{threadCount > 1 && <Text>{threadCount}</Text>}
```

A thread of 4 renders as all four names joined, clipped by the fixed-width sender column,
with `4` in the muted counter beside it:

```
Yuki Tanaka, Elena Duarte, Sam Okonkwo, Ann…  4
```

That appearance is **not** a `slice(0, 3)` anywhere — it is the natural result of joining
every name and letting the 320px column truncate. Reproduce it by supplying real names,
never by faking the string.

> **The failure to avoid:** setting `Sender name` to one name while `Thread count` says `12`.
> The count is *defined* as the number of senders. If you have a count of N, supply N names.

**Trailing icon is paperclip or calendar. Nothing else.** `Icon.tsx`:

```ts
export const TRAILING_ICONS = ['paperclip', 'calendar'] as const;
```

`Star`, `Archive`, `Trash`, `Check`, `Clock` belong to the **Action Bar** (hover state), *not*
the trailing button. Validate before swapping.

**Labels: max 2.** `export const MAX_LABELS = 2` — extras are dropped, never shrunk.

**Category: max 1** tag, sender-side.

**Hover replaces the date with the Action Bar** — never set both.

---

## §1 — Content: defaults first

**Do not interrogate the user.** Show the defaults and ask only what they'd change.

### ROW defaults

| Field | Default |
|---|---|
| Senders | `['Priya Raghunathan']` (1 → no counter) |
| Title | `Q3 design review` |
| Description | `Sharing the deck ahead of Thursday so everyone has time to read` |
| Date | `Aug 11` |
| Read | No (unread — shows the indicator) |
| Hover / Selected | No |
| Category tag | none |
| Labels | none |
| Trailing icon | none |

### SCREEN defaults

| Field | Default |
|---|---|
| Email count | 14 (fills the slot to ~80% without overflowing) |
| Theme | Light |
| Grouping | Derived from dates — see §2 |
| Mix | ~3 unread near the top, 2–3 with labels, 1–2 with a category, 2 with a trailing icon, 2–3 multi-sender threads |
| Sidebar / filter bar | Template defaults — leave alone unless asked |
| Page title | `Inbox` (template default) |

Mock senders: `Marcus Bell`, `Yuki Tanaka`, `Elena Duarte`, `Sam Okonkwo`, `Anna Kowalski`,
`Priya Patel`, `David Kim`, `Rachel Morrison`, `Tom Fletcher`, `Nina Alvarez`, `Raj Mehta`,
`Clara Bennett`.
Subjects: `Invoice #4821`, `Offsite logistics`, `Design tokens sync`, `Hiring loop feedback`,
`Q4 roadmap draft`, `Accessibility audit results`, `Component library migration`.

**If the user gives a thread count above 1, generate that many real names** from the pool — do
not ask them to supply twelve names, and do not fake it with one.

Only ask a follow-up when the request is genuinely ambiguous — e.g. labels are enabled but
their text is unspecified, or paperclip vs calendar is unclear. Ask everything in **one**
`AskUserQuestion`. Never invent a real person's details or a real brand.

## §2 — Grouping rules (SCREEN only)

**Straight from the annotation on the Section Header master** (`17:6235`) — this is the
designer's spec, follow it exactly:

```
Copy variants
1. Don't show for Today
2. Yesterday
3. Last 7 days
4. Last 30 days
5. Month - Anything before the last 30 days.
```

Which means, with **today taken from the real current date** (never hardcoded):

| Age of the email | Header | Date column reads |
|---|---|---|
| Today | **none — no header at all** | a clock time, `9:12 AM` |
| Yesterday | `Yesterday` | `Aug 12` |
| 2–7 days ago | `Last 7 days` | `Aug 8` |
| 8–30 days ago | `Last 30 days` | `Jul 22` |
| Older | the **month name**, e.g. `March` | `Mar 14` |

### Never hand-compute this table — derive it in the sandbox

Authoring dates and buckets by hand is the most error-prone step in the whole skill: it is easy
to miscount which bucket a date falls in, and a long run can straddle midnight, so a date
reasoned about at the start of the turn is stale by the time it's written (observed — a build
generated for Aug 13 landed after the date rolled to Aug 14, leaving `Yesterday` reading
`Aug 12`).

**So give each row a `daysAgo` integer and let the Figma sandbox derive both the date string
and the group.** Then the header and the date column are computed from the same number and
*cannot* disagree, ordering is mechanical, and the whole thing is evaluated at write time
against the real clock:

```javascript
const TODAY = new Date();
const M    = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const FULL = ['January','February','March','April','May','June',
              'July','August','September','October','November','December'];
const dayOf = n => { const d = new Date(TODAY); d.setDate(d.getDate() - n); return d; };

const dateFor = (n, time) =>                       // clock time today, MMM D otherwise
  n === 0 ? time : `${M[dayOf(n).getMonth()]} ${dayOf(n).getDate()}`;

const bucketFor = n =>                             // null === the today group (no header)
  n === 0 ? null : n === 1 ? 'Yesterday'
  : n <= 7 ? 'Last 7 days' : n <= 30 ? 'Last 30 days'
  : FULL[dayOf(n).getMonth()];

// rows: [{ daysAgo: 0, time: '10:42 AM', senders: [...], title, desc, ... }, { daysAgo: 12, ... }]
// Sort by daysAgo ascending, then fold into ordered groups — headers fall out, never repeat,
// and an empty group is unrepresentable.
const groups = [];
for (const r of rows.slice().sort((a, b) => a.daysAgo - b.daysAgo)) {
  const header = bucketFor(r.daysAgo);
  if (!groups.length || groups[groups.length - 1].header !== header) groups.push({ header, rows: [] });
  groups[groups.length - 1].rows.push({ ...r, date: dateFor(r.daysAgo, r.time) });
}
```

Author rows as a flat list with `daysAgo`; never write a `date` string or a `header` by hand.

What this buys you, all of which were previously manual rules to remember:

- **Today's rows sit at the very top with no header above them** — `bucketFor(0)` is `null`.
- **No header for an empty group, and no empty group** — groups are created only by a row.
- **Newest first**, between and within groups, from the one sort.
- **One header per month** for the older tail — consecutive rows in the same month collapse
  into a single `March`, never `March 2026`, never repeated per row.
- The date column always corroborates the group instead of contradicting it.

> **Expected oddity, not a bug:** buckets are by *age*, not by calendar month, so the same month
> can appear both inside `Last 30 days` and again as its own header. Verified on Aug 14 2026:
> `daysAgo: 30` → `Jul 15` under `Last 30 days`, while `daysAgo: 31` → `Jul 14` under `July`.
> That is exactly what the designer's spec says ("Month — anything before the last 30 days").
> Don't "fix" it during review.

### Capacity — the slot clips, so budget before you build

The slot is **1680 × 984, fixed, `clipsContent: true`**. Anything past 984px is silently cut
off. Rows are 40px, headers 78px:

```
budget = 984
used   = rows * 40 + headers * 78
```

24 rows with no headers, or ~18 rows across 3 groups, is the ceiling. Compute `used` **before**
building, and if it exceeds 984, drop rows from the oldest group and tell the user what you
dropped. Never let content overflow silently, and never shrink a row to make it fit.

## §3 — Summary and confirmation

Show a compact summary of **what will be built** — mode, content, groups and their row counts,
states, extras, theme, and anything defaulted. **Wait for explicit confirmation before touching
Figma.**

> Do not work out placement yet, and do not mention it here. Where it goes is irrelevant until
> the user has agreed to what it *is*. Placement is computed at write time in §4 so it reflects
> the canvas as it stands *then*.

## §4 — Build it: one call, one round-trip

Only after confirmation. Everything below goes in **one** `figma_execute` (`timeout: 60000`
for SCREEN). Resolving masters, finding free space, instantiating, setting properties,
configuring tags, swapping icons, and verifying are one atomic operation — splitting them
across calls re-imports the masters each time and burns tokens for nothing.

> **Load every tool schema in one `ToolSearch`, at the top of the run.** The Figma Console
> tools usually arrive *deferred* — name only, no schema — and calling one before its schema
> is loaded fails. Fetch all four together, and put that call in the **same message** as the
> §0 grep and `figma_get_status`, which are independent of it:
>
> ```
> select:mcp__figma-console__figma_execute,mcp__figma-console__figma_get_status,mcp__figma-console__figma_capture_screenshot,mcp__figma-console__figma_lint_design
> ```
>
> One message covers the entire pre-build phase. Loading schemas one at a time, or serialising
> the grep behind the status check, wastes a round-trip each.

### Placement — findable beats empty

Empty canvas is necessary but not sufficient: work the user can't *find* is as good as not
built. Viewport centre is the worst default on both counts — it lands on top of whatever
they're looking at, and when their viewport happens to be over blank canvas it strands the
screen thousands of units from everything else. (Observed: a screen placed at viewport centre
landed at `(-4178, 9342)` and the user reported they couldn't locate it, costing a recovery
round-trip.)

**Default to stacking below all existing content.** It is deterministic, it puts each new
screen directly beneath the last one, and it never collides:

```javascript
function findFreeSpot(gap = 80) {                  // size-independent: always below everything
  const kids = figma.currentPage.children;
  if (!kids.length) return { x: 0, y: 0, how: 'empty-page' };

  const maxY = Math.max(...kids.map(n => n.y + n.height));
  const minX = Math.min(...kids.map(n => n.x));
  return { x: Math.round(minX), y: Math.round(maxY + gap), how: 'below-all-content' };
}
```

Whatever the placement, the build **must** return the coordinates and a deep link (below) —
selecting the node and calling `scrollAndZoomIntoView` is not on its own enough to get the
user's eyes onto it.

If the user has a container **selected**, honour it instead (ROW mode only; a screen always
goes on the canvas):

```javascript
const sel = figma.currentPage.selection;
const intoContainer = sel.length === 1 && ['FRAME','SECTION','GROUP','COMPONENT'].includes(sel[0].type);
```

### Shared preamble — both modes

```javascript
const ROW_KEY  = '94e02a512b61a08acaea9c12ab7f63a80ccca261';   // Email Row set
const TAG_KEY  = '6c97d2c4e72dfc9c7c13bd27ca2d895f0bc3ab33';   // Tag Button set
const HDR_KEY  = '2963064086f48b6690c10251de045459272b7cd3';   // Section Header component
const TMPL_KEY = '473af07fd4eb5210762a59738fa412c5d1fd35e2';   // Inbox Template component
const ICON_SECTION = '3:2163';                                  // "Components and Icons"
const SENDER_W = 320;                                           // --ds-size-column-sm

for (const style of ['Regular','Medium','SemiBold'])
  await figma.loadFontAsync({ family: 'Momo Trust Sans', style });   // or text writes fail silently

const rowSet = await figma.importComponentSetByKeyAsync(ROW_KEY);
const tagSet = await figma.importComponentSetByKeyAsync(TAG_KEY);
if (Object.keys(rowSet.componentPropertyDefinitions).length !== 14)
  throw new Error('Email Row API changed — stop and tell the user.');

const defs = rowSet.componentPropertyDefinitions;
const P = b => Object.keys(defs).find(k => k.split('#')[0] === b);
const L = Object.keys(tagSet.componentPropertyDefinitions).find(k => k.split('#')[0] === 'Label');
const under = (n, name) => { let p = n.parent; while (p) { if (p.name === name) return true; p = p.parent; } return false; };

// icons: resolve from the section, never by key (see Efficiency)
const iconSec = await figma.getNodeByIdAsync(ICON_SECTION);
const iconMain = {};
for (const n of ['Paperclip','Calendar']) {
  const src = iconSec.findOne(x => x.type === 'INSTANCE' && x.name === n);
  iconMain[n] = src && await src.getMainComponentAsync();
}

// ALWAYS spread into the return — the user has to be able to find what you built.
// figma.fileKey is readable from this plugin (verified), so the link costs nothing.
const locate = n => ({
  id: n.id, page: figma.currentPage.name,
  x: Math.round(n.x), y: Math.round(n.y),
  link: `https://www.figma.com/design/${figma.fileKey}/?node-id=${n.id.replace(':','-')}`,
});

// Programmatic defect checks — these run in the sandbox for zero context tokens and catch
// the top defects BEFORE the screenshot. Spread into the return; assert on them in §5.
const audit = insts => ({
  senderColW: [...new Set(insts.map(r => Math.round(r.findOne(n => n.name === 'Sender info').width)))],
  strayLabelTags: insts.reduce((s, r) => s + r.findAll(n =>
    n.type === 'INSTANCE' && n.name === 'Tag Button' && n.visible &&
    n.componentProperties[L] && n.componentProperties[L].value === 'Label').length, 0),
});
```

### `buildRow` — the shared row builder

Used verbatim by both modes. In ROW mode `parent` is the page or the selected container; in
SCREEN mode it is the wrapper inside the slot.

```javascript
function buildRow(parent, r, fill) {
  const labels = r.labels || [];
  if (labels.length > 2) throw new Error('MAX_LABELS is 2');
  if (r.icon && !['Paperclip','Calendar'].includes(r.icon))
    throw new Error(`Illegal trailing icon: ${r.icon}`);

  const inst = (rowSet.defaultVariant || rowSet.children[0]).createInstance();
  parent.appendChild(inst);
  if (fill) inst.layoutSizingHorizontal = 'FILL';        // inside the slot wrapper

  const hasTrailing = labels.length > 0 || !!r.icon;
  inst.setProperties({
    'Read?': r.read ? 'Yes' : 'No', 'Hover?': 'No', 'Selected?': 'No',
    [P('Sender name')]:  r.senders.join(', '),           // ALL names — see §0
    [P('Thread count')]: String(r.senders.length),
    [P('Count')]:        r.senders.length > 1,           // counter only above 1
    [P('Title')]:        r.title,
    [P('Description')]:  r.desc,
    [P('Date')]:         r.date,
    [P('Category')]:        !!r.category,
    [P('Trailing Assets')]: hasTrailing,                 // gates the WHOLE trailing area
    [P('-> Labels')]:          labels.length > 0,
    [P('-> Trailing Button')]: !!r.icon,
  });

  // clamp the sender column (master bug workaround — see §5)
  const si = inst.findOne(n => n.name === 'Sender info');
  const sn = inst.findOne(n => n.type === 'TEXT' && n.name === 'Sender name');
  si.layoutSizingHorizontal = 'FIXED';
  si.resize(SENDER_W, si.height);
  sn.layoutSizingHorizontal = 'FILL';                    // lets ENDING truncation fire

  // tags
  const tags = inst.findAll(n => n.type === 'INSTANCE' && n.name === 'Tag Button');
  if (r.category) tags.find(t => under(t,'Sender info'))?.setProperties({ [L]: r.category.text, 'Type': r.category.type });
  const slots = tags.filter(t => under(t,'-> Labels Slot'));
  if (labels.length > slots.length)
    throw new Error(`Need ${labels.length} label slots, master provides ${slots.length}`);
  labels.forEach((l, i) => slots[i].setProperties({ [L]: l.text, 'Type': l.type }));

  // MANDATORY: hide the slots you didn't use, or a stray tag reading "Label" ships in the row
  slots.slice(labels.length).forEach(t => { t.visible = false; });

  if (r.icon && iconMain[r.icon]) {
    const ph = inst.findOne(n => n.type === 'INSTANCE' && n.name === 'Placeholder');
    if (ph) ph.swapComponent(iconMain[r.icon]);
  }
  return inst;
}
```

> **`slots.slice(labels.length).forEach(t => t.visible = false)` is not optional.** The master
> ships two Tag Buttons in the labels slot. Set one label and the second still renders, reading
> `Label`. This is the single most common visual defect in a generated row — it was observed on
> a verified run.

### Mode ROW

```javascript
const sel = figma.currentPage.selection;
const intoContainer = sel.length === 1 && ['FRAME','SECTION','GROUP','COMPONENT'].includes(sel[0].type);
const spot = intoContainer ? null : findFreeSpot();
const parent = intoContainer ? sel[0] : figma.currentPage;

const inst = buildRow(parent, { senders: ['Priya Raghunathan'], title: '…', desc: '…',
                                date: 'Aug 11', read: false, labels: [], icon: null }, false);
if (!intoContainer) { inst.x = spot.x; inst.y = spot.y; }

figma.currentPage.selection = [inst];
figma.viewport.scrollAndZoomIntoView([inst]);
return { ...locate(inst), ...audit([inst]),
         isInstance: inst.type === 'INSTANCE',
         w: Math.round(inst.width), h: Math.round(inst.height),
         placement: spot?.how ?? 'inside-selection' };
```

**Expected:** `isInstance: true`, `1680×40`, `senderColW: [320]`, `strayLabelTags: 0`.

### Mode SCREEN

Author a **flat `rows` array** where each row carries `daysAgo` (plus `time` when `daysAgo`
is 0) — never a hand-written `date` or `header`. Paste the `dateFor` / `bucketFor` / fold
helpers from §2 above this; they produce the ordered `groups`, with `header: null` for today.

```javascript
const rows = [
  { daysAgo: 0,  time: '10:42 AM', senders: ['…'], title: '…', desc: '…', read: false,
    labels: [{ text: 'Design review', type: 'Blue' }] },
  { daysAgo: 1,  senders: ['…','…'], title: '…', desc: '…', read: true },
  { daysAgo: 47, senders: ['…'], title: '…', desc: '…', read: true, icon: 'Paperclip' },
];
// …§2 fold → `groups`

// capacity gate — the slot clips at 984 (§2)
const used = groups.reduce((s,g) => s + g.rows.length*40 + (g.header ? 78 : 0), 0);
if (used > 984) throw new Error(`Content is ${used}px, slot budget is 984px — drop rows first.`);
if (groups.some(g => g.rows.length === 0)) throw new Error('Empty group — never emit a bare header.');

const hdrCmp = await figma.importComponentByKeyAsync(HDR_KEY);
const tmpl   = await figma.importComponentByKeyAsync(TMPL_KEY);

const spot = findFreeSpot();
const screen = tmpl.createInstance();
figma.currentPage.appendChild(screen);
screen.x = spot.x; screen.y = spot.y;
screen.name = 'Inbox Screen';

// the slot is the ONLY thing you touch inside the template
const slot = screen.findOne(n => n.type === 'SLOT');
if (!slot) throw new Error('No SLOT in the template instance — master changed.');

// one wrapper frame, so the content hugs and its height can be measured
const wrap = figma.createFrame();
wrap.name = 'Slot Content — Inbox';
wrap.layoutMode = 'VERTICAL'; wrap.itemSpacing = 0; wrap.fills = [];
slot.appendChild(wrap);
wrap.layoutSizingHorizontal = 'FILL';    // set AFTER appending, never before
wrap.layoutSizingVertical   = 'HUG';

for (const g of groups) {
  if (g.header) {
    const h = hdrCmp.createInstance();
    wrap.appendChild(h);
    h.layoutSizingHorizontal = 'FILL';
    // Section Header has NO component properties — write the text node directly
    h.findOne(n => n.type === 'TEXT' && n.name === 'Title').characters = g.header;
  }
  for (const r of g.rows) buildRow(wrap, r, true);
}

figma.currentPage.selection = [screen];
figma.viewport.scrollAndZoomIntoView([screen]);

const rowInsts = wrap.children.filter(c => c.name !== 'Section Header');
return { ...locate(screen), ...audit(rowInsts),
         isInstance: screen.type === 'INSTANCE',
         w: screen.width, h: screen.height, placement: spot.how, budget: used,
         slotH: Math.round(slot.height), contentH: Math.round(wrap.height),
         overflow: Math.round(wrap.height) > Math.round(slot.height),
         children: wrap.children.length,
         // header ↔ date agreement: each header with the dates that landed under it
         layout: wrap.children.reduce((acc, c) => {
           if (c.name === 'Section Header') acc.push({ header: c.findOne(n => n.type === 'TEXT').characters, dates: [] });
           else {
             if (!acc.length) acc.push({ header: null, dates: [] });
             acc[acc.length - 1].dates.push(c.componentProperties[P('Date')].value);
           }
           return acc;
         }, []) };
```

**Expected:** `isInstance: true`, `1920×1080`, `overflow: false`, `contentH ≤ 984`,
`senderColW: [320]` (one entry only), `strayLabelTags: 0`, and a `layout` whose first entry has
`header: null` and whose every date sits in the bucket its header claims.

### Theme (SCREEN and ROW)

Dark is a **variable mode**, not a variant. Two collections carry Light/Dark — the local
`🎨 Colors` and its published remote twin — and **both** must be switched or the screen comes
out half-dark. Set it on the instance after building:

```javascript
async function setTheme(node, theme) {                    // theme: 'Light' | 'Dark'
  const done = new Set();
  for (const c of await figma.variables.getLocalVariableCollectionsAsync()) {
    const m = c.modes.find(m => m.name === theme);
    if (m) { node.setExplicitVariableModeForCollection(c, m.modeId); done.add(c.id); }
  }
  for (const n of node.findAll(x => x.boundVariables && Object.keys(x.boundVariables).length).slice(0, 40)) {
    for (const arr of Object.values(n.boundVariables)) {
      for (const b of (Array.isArray(arr) ? arr : [arr])) {
        if (!b?.id) continue;
        const v = await figma.variables.getVariableByIdAsync(b.id);
        if (!v || done.has(v.variableCollectionId)) continue;
        done.add(v.variableCollectionId);
        const col = await figma.variables.getVariableCollectionByIdAsync(v.variableCollectionId);
        const m = col?.modes.find(m => m.name === theme);
        if (m) node.setExplicitVariableModeForCollection(col, m.modeId);
      }
    }
  }
}
```

Light is the default and needs no call at all. To go back to light, clear the modes rather
than setting them: `node.clearExplicitVariableModeForCollection(col)`.

### Optional template overrides — only when asked

The sidebar and filter bar are part of the master and are correct as shipped. **Leave them
alone by default.** If the user asks:

| What | How |
|---|---|
| Page title | `screen.findOne(n => n.type === 'TEXT' && n.parent.name === 'Page Header').characters = '…'` |
| Selected nav item | `Nav Menu Item` instances take `Selected?` (`Yes`/`No`) — set exactly one to `Yes`, all others to `No` |
| Nav item count badge | same instances take `Count` (BOOLEAN); the number is a plain text child |

Never restructure, reorder, or delete anything else in the template instance.

### Component API

| Property | Type | Values |
|---|---|---|
| `Read?` `Hover?` `Selected?` | VARIANT | `Yes` / `No` |
| `Sender name` | TEXT | **all** sender names, `', '`-joined |
| `Thread count` | TEXT | `String(senders.length)` |
| `Title` `Description` `Date` | TEXT | any string |
| `Count` | BOOLEAN | show the counter — `senders.length > 1` |
| `Category` | BOOLEAN | show the sender-side tag |
| `Trailing Assets` | BOOLEAN | **master gate for the whole trailing area** |
| `-> Labels` | BOOLEAN | show trailing labels |
| `-> Trailing Button` | BOOLEAN | show the trailing icon |
| `-> Labels Slot` | SLOT | holds the label Tag Buttons |

Tag Button: `Label` (TEXT), `Type` (VARIANT: `Neutral` `Yellow` `Green` `Blue` `Brown`).
Inbox Template: `Slot#20:20` (SLOT) — the only property.
Section Header: **no properties at all** — the title is a plain `Title` text node.

> **`Trailing Assets` gates everything trailing.** It defaults to `false`, and while false the
> `Date info/Container` stays hidden — so `-> Labels` and `-> Trailing Button` appear to do
> nothing however you set them. Set it whenever you want labels **or** an icon.

## §5 — Verify: assert first, then screenshot once

**Read the build's return object before you capture anything.** Four of the six checks below
are already answered there, for free, with more certainty than pixels can give:

| Check | Assert on the return |
|---|---|
| Stray `Label` tags — the most common defect | `strayLabelTags === 0` |
| Sender column clamp | `senderColW` is exactly `[320]` — more than one entry means a row escaped |
| Slot overflow | `overflow === false` and `contentH <= 984` |
| Grouping and header ↔ date agreement | `layout[0].header === null`, and every date sits in its header's bucket |

If any of those fail, fix and re-run the build — a screenshot adds nothing to a defect you can
already name.

Then capture **once**, to confirm what the return can't express:

1. `figma_capture_screenshot` on the instance (a 1920×1080 screen downsamples to ~0.8x — still
   legible; `scale: 0.6` is enough when the asserts have already passed and you only need to
   eyeball layout and colour).
2. Look for:
   - **Trailing icon** — paperclip or calendar only. A star/archive/trash/clock is the wrong
     icon (or you're looking at the Action Bar hover state).
   - **Tag colours** read correctly in the current theme.
   - **Truncation** — long threads read `Name, Name, Name…` with the counter beside them, and
     titles/descriptions clip cleanly rather than colliding.
   - Anything that simply looks wrong.
3. Fix and re-capture. Stop after 3 passes and report what's unresolved.

Use the official Figma MCP `get_metadata` when you need structure a screenshot can't show.

## §6 — Lint, known gaps, and report

Run `figma_lint_design` on the created node with `rules: ["design-system"]`. Expect **0
hardcoded colours and 0 hardcoded spacings** — instances inherit the masters' bindings, so any
such finding means something was detached or manually restyled. The wrapper frame is the one
legitimate local node; it has `fills: []` and no spacing of its own, so it should not produce
findings.

> **A SCREEN scan reports `9 + one-per-Section-Header` `default-name` warnings. They are not
> yours.** Every one is inherited from inside the masters — a fixed **9** from the Inbox
> Template's sidebar (`Frame 3`, `Frame 5`–`Frame 11`, `Ellipse 2`) plus one `Frame 2` per
> Section Header instance. So a 3-group screen reports 12 and a 4-group screen reports 13;
> both are clean. Verified: 498 nodes scanned, 0 critical, 13 warnings across 4 headers, all
> inherited. Report them as a master hygiene issue once and move on; do **not** rename nodes
> inside an instance to silence them, and do **not** read a higher count as a regression
> without first checking it against the header count.

### Known master gaps — apply the workaround, flag once, don't rediscover

| Gap | Effect | Workaround |
|---|---|---|
| `Sender info` has `minWidth: 320` but **no `maxWidth`** (code has both) | Long joined sender strings grow the column to ~1060px and blow out the row instead of truncating | The `FIXED` + `resize(320)` + child `FILL` block in `buildRow`. The master itself still needs fixing. |
| Email Row ships **2** label Tag Buttons, both visible | A row with one label renders a second tag reading `Label` | Hide unused slots in `buildRow`. Verified defect, not a theory. |
| Section Header exposes **no `Title` property** | The title can only be set by writing the text node, which is a local override rather than a clean instance property | Write `.characters` directly (legitimate here — there is no property to use). Worth adding a TEXT property to the master. |
| Inbox Template slot is a **fixed 984px with `clipsContent: true`** | Extra rows vanish silently instead of scrolling or growing | Budget in §2 before building. |
| Default layer names inside both masters (`Frame 2`, `Frame 3`, `Frame 5`–`Frame 11`, `Ellipse 2`) | Every screen lints with `9 + headers` `default-name` warnings that no instance-level fix can clear | Ignore them in instances; rename in the masters when someone next edits them. |

### Slot labels: why a rename appears to do nothing

`setProperties` on a slot Tag Button **works**. When a rename looks like it failed it is one of
these, none of which raise an error:

| Failure mode | What actually happens | Fix |
|---|---|---|
| **Silent no-op on a missing slot** | The master provides exactly **2** Tag Buttons. `slots[2]` is `undefined`, and `slots[i]?.setProperties(...)` swallows it. | Assert `labels.length <= slots.length`. Never use `?.` here. |
| **Gate is off** | `findAll` still returns both tags when `-> Labels` or `Trailing Assets` is `false`, so the rename *succeeds* and stays invisible. | Set `Trailing Assets: true` **and** `-> Labels: true`, then read the text back. |
| **Direct text edit** | Writing `textNode.characters` inside the Tag Button applies, but creates an override the next `setProperties` clobbers — the value flips back later. | Always go through `setProperties`. (The Section Header is the opposite case: no property exists, so direct write is correct.) |

The slot is genuinely composable — `slot.appendChild(tagInstance)` works and accepts a third
tag. But `MAX_LABELS = 2` is the design rule, so adding one is a rule violation, not a
workaround. Drop extras instead.

If you hit a *new* divergence between a master and `EmailRow.tsx`, apply an instance-level
workaround, flag it as a master bug, and add a row here. Do not silently absorb it, and do not
report it as "the component can't do this" — check the code first (§0).

Report: what was created, **where it landed — page, coordinates and the `link` from the return,
always, in the first line or two** — the groups and content used, anything defaulted or dropped
(especially rows dropped for capacity), workarounds applied, and the lint result. Assume the
user cannot find the node unless you hand them the link; selecting it is not enough.

---

## Tool split — Figma Console *and* official Figma MCP

**Decision rule: instances → Figma Console. Masters → official Figma MCP.**

This skill only ever creates *instances* and sets their properties, so Figma Console is the
right default for the whole happy path. It executes arbitrary Plugin API JS, which means the
entire build is one round-trip and every intermediate computation happens inside the sandbox
for free.

That flips the moment you touch a **master**: editing a component set, adding properties or
variants, restructuring slots, or authoring tokens. Switch, and load `/figma-use` first.

| Task | Tool |
|---|---|
| Confirm target file / connection | Figma Console `figma_get_status` |
| The whole build (resolve, place, rows, headers, verify) | Figma Console `figma_execute` — one call, `timeout: 60000` |
| Read designer specs attached to a master | Figma Console `figma_get_annotations` |
| Find components by name | Figma Console `figma_search_components` |
| Screenshot for review | Figma Console `figma_capture_screenshot` |
| Quality gate | Figma Console `figma_lint_design` |
| Inspect structure a screenshot can't show | Official Figma MCP `get_metadata` |
| Read the design system's variables/tokens | Official Figma MCP `get_variable_defs` |
| Component/variant authoring, adding the missing `Title` property | Official Figma MCP `use_figma` — **load `/figma-use` first, it is a mandatory prerequisite** |

## Efficiency — spend tokens on the design, not on rediscovery

The constants below are verified. **Never probe Figma to rediscover them.**

```
Email Row set     94e02a512b61a08acaea9c12ab7f63a80ccca261   (node 3:2206, 14 props)
Tag Button set    6c97d2c4e72dfc9c7c13bd27ca2d895f0bc3ab33   (props: Label#17:45, Type)
Section Header    2963064086f48b6690c10251de045459272b7cd3   (node 17:6235, 1680×78, NO props)
Inbox Template    473af07fd4eb5210762a59738fa412c5d1fd35e2   (node 17:5724, 1920×1080, Slot#20:20)
Icon section      3:2163   — resolve icons from HERE, not by key (see below)
Row size          1680 × 40      Header 1680 × 78      Screen 1920 × 1080
Slot              1680 × 984, VERTICAL, itemSpacing 0, FIXED, clipsContent: true
Sender column     320  (--ds-size-column-sm)
Font              Momo Trust Sans — Regular, Medium, SemiBold
Colors collection Light / Dark modes — local + published remote twin, switch BOTH
Anatomy docs      "Email Row Anatomy (v2)" frame, Page 1
```

Property IDs, as of the last verified run. The `P()` helper resolves these dynamically and that
is still the right default — the lookup runs *inside* the Figma sandbox, so it costs **zero
context tokens**. Reference for reading, not for hardcoding:

```
Sender name#16:0   Thread count#16:9   Title#16:18   Description#16:27   Date#16:36
Count#3:2   Category#3:3   -> Labels Slot#3:4   -> Labels#3:5
-> Trailing Button#3:6   Trailing Assets#15:11
Read?   Hover?   Selected?          (variants — no suffix)
```

### Icons: published, but still resolve them from the section

```
Paperclip  eba49d21be02ff4f3888d86d9968a8aa83f44f96
Calendar   08aba8e1b61b1a5e9cf04ddc0e2a16a7280892dd
```

> **Publishing did *not* fix the hang.** `importComponentByKeyAsync` on an **icon** key hangs
> rather than throwing, so `try/catch` won't save you and the timeout kills the run. Keep
> resolving icons from section `3:2163` via `getMainComponentAsync()` (~5ms). Published
> **component sets and components** — Email Row, Tag Button, Section Header (36ms), Inbox
> Template (2ms) — import by key fine. The restriction is specific to the icon components.

Rules that keep a run cheap:

- **One `figma_execute` for the whole build**, both modes. A 14-row screen in one call is
  verified and fast; 14 calls is not.
- **Grep the code, don't read it — and don't interrogate the canvas.** `EmailRow.tsx` answers
  senders/labels/icon questions definitively, and §0's grep gets the answer for ~5% of a full
  read. Never open `Icon.tsx` whole: 12.9KB of SVG paths for one line.
- **Compute in the sandbox, not in your head.** Dates, buckets, group folding, capacity, the
  deep link, and the defect audit all run inside `figma_execute` for zero context tokens — and
  a value derived there can't drift from the one that gets written.
- **Load all deferred tool schemas in one `ToolSearch`**, batched with the grep and the status
  check (§4).
- **Read annotations once** (`figma_get_annotations`) if you need a spec that isn't in this
  file — §2 already captures the Section Header's.
- **Don't re-read a file you just wrote**, and don't screenshot twice to confirm the same thing.
- **Batch independent reads** into a single call.
- **Ask once, in one `AskUserQuestion`**, with every open decision as a separate question.
- Only fall back to discovery when something above is genuinely stale — and when it is,
  **update this file** so the next run doesn't pay for it again.

## Troubleshooting

| Symptom | Cause |
|---|---|
| A tag reading literally `Label` in a row | Unused label slots not hidden — `slots.slice(labels.length)` in `buildRow` |
| Rows cut off at the bottom of the screen | Content exceeded the slot's 984px, which clips — budget in §2 |
| A header sits above today's emails | §2 rule 1: today gets **no** header. The §2 fold makes this impossible — you hand-wrote `groups` instead of deriving them from `daysAgo` |
| A header with nothing under it | Empty group — never emit one. Also impossible via the §2 fold |
| `Yesterday` shows a date two days back | Dates were reasoned about in-context and the run crossed midnight. Derive them from `daysAgo` at write time (§2) |
| The user says they can't find what you built | You reported an id but no link. Always return and quote `link` + page + coordinates (§4); `scrollAndZoomIntoView` alone doesn't move their eyes |
| Rows sit at 1680 inside a 1680 slot but look misaligned | `layoutSizingHorizontal = 'FILL'` was set *before* `appendChild` — set it after |
| Section Header title won't change | It has no component property; write the `Title` text node, and load Momo Trust Sans Medium first |
| Screen comes out half dark | Only one Colors collection was switched — the local **and** remote twin both need it |
| One name shown but the counter says 12 | `Sender name` takes **all** names joined — §0 |
| Sender column stretches past 320px | The clamp in `buildRow` was skipped — §6 |
| Labels or trailing icon don't appear | `Trailing Assets` still `false` — it gates the whole trailing area |
| Trailing icon is a star/archive/clock | Only `Paperclip`/`Calendar` are legal. A star is normally the **Action Bar** (hover), not the trailing slot |
| Run stalls, then `Execution timed out` | Either `importComponentByKeyAsync` on an **icon** key (hangs — use section `3:2163`), or a SCREEN build left at the default 5s timeout — pass `timeout: 60000` |
| Text doesn't change | Font not loaded, or property ID resolved with a stale `#suffix` |
| `setProperties` throws | Variant values must be the strings `'Yes'`/`'No'`; booleans must be real booleans |
| Lint reports hardcoded values | Something was detached or manually restyled — rebuild it as an instance |

On any failure, delete partial artifacts before retrying — a half-built screen instance left on
the canvas is worse than none.
