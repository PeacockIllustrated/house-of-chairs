# House of Chairs, design brief for Claude Design

A self-contained springboard. Everything below is extracted from the live
repository, not inferred: colour, type, shape and spacing values come from
`app/globals.css`; intent comes from `CLAUDE.md`; component anatomy comes from
the components as built. Read this instead of deriving the system from source.

Values are exact. Where the spec, the internal notes and the code disagree, the
disagreement is recorded in "Open questions and known drift" rather than
silently resolved.

---

## 1. What this is and who it is for

House of Chairs is an online store selling vintage designer furniture, chairs
above all. Every piece is one of one: photographed, priced or offered on
request, and sold through a fast enquiry flow rather than a checkout.

The **piece page is the landing unit**. Most traffic arrives on it directly from
a social post, on a phone, cold. Its first viewport must carry the photograph,
the title, the attribution line, the price or "Price on request", the
availability, and the enquiry call to action. A sticky enquiry bar takes over on
mobile once the buy area scrolls away.

The audience is a buyer spending real money on a single object they cannot
touch. They want to know what it is, who it is attributed to, what condition it
is in, what it costs and how it arrives. Design decisions serve that, in this
order: clarity, speed, trust, atmosphere.

This is a commercial store, not a museum. An earlier museum-gallery concept and
a restoration-workshop narrative were both retired. Do not romanticise the
workbench and do not sell restoration. Condition is buyer information, stated
plainly.

Secondary job: earn outside traffic through clean structure, honest content and
strong technical SEO.

---

## 2. Voice

Quietly confident and commercial. Short sentences that state facts a buyer cares
about. Warmth without theatre. Humour is dry and rare.

**Hard rules, applied to every word in the interface including nav, buttons,
placeholders, error states and empty states:**

| Rule | Detail |
| --- | --- |
| British spelling | colour, organise, recognise, jewellery, centred |
| No em-dashes | anywhere; use commas, semicolons or full stops |
| No exclamation marks | none, in any state, including success confirmations |
| No emoji | none, anywhere |
| Sentence case | all headings, nav items, buttons, labels, eyebrows |
| No urgency theatre | "only one left" is true of everything sold here and goes without saying. No countdowns, no "selling fast", no scarcity badges |
| No invented trust marks | no star ratings, no review scores, no badges the business did not earn |

Real strings in use, as a register guide: "Send an enquiry", "Arrange a
viewing", "Register interest", "Price on request", "Being prepared",
"Photography to follow", "Delivered nationwide, placed in the room", "Fourteen
day returns", "The collection changes weekly and the best pieces rarely reach
the website."

### Attribution honesty, legally load-bearing

Never state a real designer or maker as fact without the owner's confirmation.
This is not a style preference; it is a legal exposure.

Approved hedges, and the only ones: **"attributed to"**, **"school of"**,
**"in the manner of"**, **"maker unconfirmed"**.

Era and style descriptors are always safe ("Bauhaus and modernist", "Danish
modern", "space age"). Never write "after [designer]" marketing copy that
implies authentication. Unconfirmed content is flagged `placeholder: true` in
data and cleared with the owner before launch; the piece page renders a quiet
"Placeholder listing, details to be confirmed" line when that flag is set.

Design consequence: **the attribution line is a long, hedged sentence, not a
name**. Any card, tile or header holding an attribution must survive two lines
of text. The product card already clamps it to two lines with
`-webkit-line-clamp: 2` precisely for this reason. Never design an attribution
slot that only fits "Eames".

---

## 3. Colour

All tokens are plain CSS custom properties declared once on `:root` in
`app/globals.css`. There is no Tailwind theme layer: Tailwind v4 is loaded via
`@import "tailwindcss"` with no config file and no `@theme` block, so these
tokens are **not** available as Tailwind utility colours. Tailwind carries
layout and spacing only.

The site is light only. `app/layout.tsx` sets `colorScheme: "light"` and
`themeColor: "#f5f3ef"`. There is no dark mode and no dark-mode token set.

### Palette

| Token | Value | Role |
| --- | --- | --- |
| `--paper` | `#f5f3ef` | Page ground, the default surface |
| `--panel` | `#eae7e1` | Panel tone: tonal blocks, cards, figure backgrounds |
| `--ink` | `#1e211e` | Text on light; also solid button fills and pressed chips |
| `--basalt` | `#151c18` | Dark bands, the buying band, the dashboard top bar, collector-words card |
| `--bone` | `#ddd9cc` | Text on basalt |
| `--amber` | `#c97b3d` | The single brand accent, and the "being prepared" status |
| `--stone` | `var(--paper)` | Legacy alias, still referenced widely; do not use in new work |
| `--stone-deep` | `var(--panel)` | Legacy alias, still referenced widely; do not use in new work |

Plain white `#fff` appears as a deliberate literal, not a token, in three
places: behind contained photography (`object-fit: contain` on a white ground),
on the "what comes with the piece" cards, on the questions card, and on the
dashboard stat tiles and job rows. Treat white as the photography ground and as
the brightest card in a stack of panels.

### Status colours: data, not decoration

These three carry meaning. Never use them as ornament, never use them for a
mood, and never introduce a fourth.

| Token | Value | Means |
| --- | --- | --- |
| `--sea` | `#5e7a6b` | Available. Also the "ok" tone on form notes, the provenance-verified seal, and the dashboard's "all clear" rail |
| `--rose` | `#b4685e` | Reserved and sold. Also the "error" tone on form notes and the destructive-confirmation note |
| `--amber` | `#c97b3d` | Being prepared. Doubles as the brand accent because it is the only status that is also a positive signal |

Status is never conveyed by colour alone. Every status treatment pairs the
colour with a text label and, where space allows, a dot: `.pc-status`,
`.acquire-status` and `.admin-status` all render
`<dot> + statusLabel(status)`. The product-card flag (`.pc-flag`) appears
**only** when a piece is not simply available, so a browsing grid stays quiet
and the exceptions read at a glance.

Status labels, exactly: "Available", "Reserved", "Sold", "Being prepared",
"Draft".

### Lines and shadow

| Token | Value | Use |
| --- | --- | --- |
| `--hair-colour` | `rgba(30, 33, 30, 0.16)` | The hairline colour on light |
| `--hair` | `1px solid var(--hair-colour)` | Every structural rule on a light ground |
| `--hair-bone` | `1px solid rgba(221, 217, 204, 0.28)` | Hairline on a basalt ground |
| `--shadow-float` | `0 8px 24px rgba(30, 33, 30, 0.12)` | The only shadow in the system |

Two hover-state colours are written as literals rather than tokens and should be
matched if you extend the system: product card hover border
`rgba(30, 33, 30, 0.34)`, dashboard nav hover `rgba(30, 33, 30, 0.06)`.

---

## 4. Type

Two faces. The pairing is the mark's own: the lockup sets HOUSE and CHAIRS in
the sans and the "of" between them in the calligraphic hand.

| Token | Resolves to |
| --- | --- |
| `--font-display` | `var(--font-montserrat), system-ui, sans-serif` |
| `--font-body` | `var(--font-montserrat), system-ui, sans-serif` |
| `--font-mono` | `var(--font-montserrat), system-ui, sans-serif` |
| `--font-accent` | `var(--font-anaktoria), Georgia, serif` |

`--font-montserrat` and `--font-anaktoria` are injected on `<html>` by
`next/font` from `app/fonts.ts`. Display, body and label are the same family;
they differ only by weight, size and tracking.

`--font-mono` is a misnomer kept because roughly a hundred call sites use the
`.mono` class. Its role is **labels**, not monospace.

### Montserrat states

Loaded as the **variable file**: `Montserrat({ subsets: ["latin"], display:
"swap", variable: "--font-montserrat" })` with **no weight list**, so the whole
`wght` axis costs one request and any value on it is available. Do not
reintroduce a weight array; the highlight pattern below depends on continuous
interpolation.

**Weight answers to size**, so the scale keeps one apparent colour. Big type
takes less weight; small type takes more.

| Tier | Weight | Examples and exact sizes |
| --- | --- | --- |
| Largest display | 280 | Home h1 `clamp(2.3rem, 4.6vw, 4.4rem)` / lh 1.02 / ls -0.02em / max 14ch; inner page h1 `clamp(2.6rem, 6vw, 5rem)` / lh 1 / ls -0.015em; closing h2 `clamp(2.4rem, 6vw, 5.2rem)` |
| Band headings | 320 | Piece title `clamp(2.2rem, 4.4vw, 3.6rem)`; "New in" `clamp(2rem, 4.6vw, 3.4rem)`; rooms and words bands `clamp(2rem, 4.4vw, 3.2rem)`; buying band `clamp(1.9rem, 3.2vw, 2.9rem)` / lh 1.08 / max 18ch; story band h2 `clamp(1.7rem, 3.4vw, 2.7rem)`; footer h2 `clamp(1.7rem, 3vw, 2.4rem)`; dashboard stat value `2.4rem` |
| Sub-headings | 380 | Section head `.store-head` `clamp(1.6rem, 3vw, 2.3rem)` / lh 1.06 / ls -0.01em; price figure `clamp(1.6rem, 3vw, 2.2rem)` / lh 1; era tile h3 `clamp(1.25rem, 1.8vw, 1.6rem)`; dashboard h `clamp(1.5rem, 2.6vw, 1.9rem)` |
| Card titles, small heads | 500 | Product card h3 `1.2rem` / lh 1.15 / ls -0.01em; starred rail h2 `clamp(1.25rem, 1.7vw, 1.55rem)`; included-item label `1.15rem`; sticky bar title `1.05rem` |
| Body | 400 | `16px` / lh 1.55 on `body`, antialiased, `text-rendering: optimizeLegibility` |
| Labels (`.mono`) | 500 | `0.72rem` / letter-spacing `0.1em` |

One deliberate exception exists in the code: the lead card of the starred hero
rail sets weight **300** at `clamp(1.5rem, 2.3vw, 2rem)`. It is the only 300 in
the system.

Mobile heading overrides worth knowing: the home h1 becomes
`clamp(2.1rem, 7.7vw, 3.2rem)` at 860px; the product card h3 drops to `0.98rem`
at 560px; the dashboard stat value drops to `1.9rem` at 860px.

### Anaktoria is the voice

`Anaktoria-latin.woff2`, served from our own origin, loaded via `localFont` at
`weight: "400"`, `style: "normal"`, `adjustFontFallback: false`, fallback
Georgia. It is George Douros's face from Unicode Fonts for Ancient Scripts,
free for any use including redistribution. It is subset to Latin by
`npm run font:accent`, taking 184KB of OpenType down to 18KB.

It takes the places where the shop **speaks** rather than **names** something:

- the manifesto,
- collector words and quotes,
- the hedge in an attribution,
- the aside under a section label,
- the footer strapline.

**Constraint, absolute: it ships one weight and no separate italic. Never
embolden it and never slant it.** A synthesised weight smears a calligraphic
face and a synthesised slant double-slants a hand whose lowercase is already
cursive. Every rule that sets it also pins `font-weight: 400`. Where you want
emphasis inside accent text, change the face, do not change the weight.

Second constraint: **never at small-print sizes**. A cursive hand at 12px is
decoration rather than information. The `.accent` class runs at `1.08em` with
`letter-spacing: 0.005em`, because the hand runs small beside Montserrat at a
shared size. A highlight inside an accent passage drops to `0.9em`, because the
hand runs large beside Montserrat at a shared size; both facts are true and the
two rules are not in conflict.

Accent-set text as built: manifesto `clamp(1.5rem, 3.4vw, 2.9rem)` / lh 1.28 /
max-width 24em / centred; piece-page collector quote
`clamp(1.15rem, 2vw, 1.4rem)` / lh 1.35; home collector quote
`clamp(1.15rem, 1.9vw, 1.45rem)` / lh 1.42; product card attribution `0.84rem`
(`0.78rem` under 560px); footer strapline `0.86rem`.

### The highlighted word

The house emphasis pattern. `components/typography/Em.tsx` exports
`emphasise(text)`, which splits a plain string on complete asterisk pairs and
wraps odd segments in `<em>`. It is server-safe: no state, no effects, just
markup. A lone asterisk never matches, so it renders literally rather than
swallowing the line.

```tsx
export function emphasise(text: string): ReactNode {
  const parts = text.split(/\*([^*]+)\*/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) => (i % 2 === 1 ? <em key={i}>{part}</em> : part));
}
```

So the owner types `Live with a piece of *history*` in the dashboard and the
site needs no rich-text editor. `emphasise()` is applied to the hero headline
and to story-band titles.

The `em` element is styled once, globally:

```css
em {
  font-family: var(--font-body);
  font-style: normal;
  font-weight: 500;
  font-variation-settings: "wght" 500;
  transition: font-variation-settings 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}
em:hover {
  font-weight: 600;
  font-variation-settings: "wght" 600;
}
@media (prefers-reduced-motion: reduce) {
  em { transition: none; }
}
```

Four things that matter and are easy to break:

1. **The highlight stays in Montserrat.** It names `--font-body` explicitly
   rather than inheriting, because inside an accent passage the parent is the
   hand, and asking the hand for 500 would have the browser fake a bold and
   smear it. Naming the body face keeps the gesture identical everywhere and
   keeps the hand safe.
2. **It is a weight step, never an italic.** `font-style: normal` is set
   deliberately, overriding the browser default for `em`.
3. **The hover is driven through `font-variation-settings`**, not
   `font-weight`, because that is what interpolates continuously; `font-weight`
   alone jumps between named instances. `font-weight` is set alongside so a
   fallback face with no `wght` axis still lands somewhere sensible.
4. The word widens very slightly as it thickens. That is the honest cost of
   interpolating a weight inline and reads as intent.

### The label idiom

```css
.mono {
  font-family: var(--font-mono);
  font-weight: 500;
  font-size: 0.72rem;
  letter-spacing: 0.1em;
}
```

`.mono` is the workhorse: eyebrows, breadcrumbs, nav, status text, meta lines,
form labels, button text, captions, catalogue numbers. There is **no** separate
`.eyebrow` base rule; an eyebrow is `class="mono eyebrow"` where `.eyebrow` only
carries `display: block`, a margin and an opacity in each context (usually
`opacity: 0.6`, sometimes `0.7`).

Smaller label sizes in use, all still `.mono`-derived: `0.58rem` (gallery
thumbnail kind), `0.6rem` (product card flag), `0.62rem` (dashboard nav badge),
`0.64rem` (mobile header, mobile card price), `0.66rem` (seal, price label),
`0.68rem` (announcement, chips, ghost buttons, tile counts), `0.7rem`
(definition terms), `0.74rem` (buttons).

---

## 5. Shape, depth and structure

| Token | Value | Applies to |
| --- | --- | --- |
| `--radius-s` | `6px` | Inputs, selects, textareas, small elements, admin thumbnails, era figures, the condition panel, the empty-state panel |
| `--radius-m` | `12px` | Cards and figures that hold images or canvases, tonal blocks, panels, the dashboard shell |
| pill | `999px` | Every button and chip |

Radius rules as built:

- **Pill buttons everywhere.** `.enquire`, `.btn`, `.btn-solid`, `.btn-line`,
  `.highlight-all`, `.interest-open`, `.shop-chip`, `.dash-ghost`, `.pc-flag`,
  `.dash-nav-badge` and form submits all take `border-radius: 999px`.
- `--radius-m` always travels with `overflow: hidden` on anything holding an
  image or a canvas: `.pc`, `.pc-figure`, `.piece-figure`, `.room-tile-figure`,
  `.story-band-figure`, `.hero-lede`, `.star-card`, `.condition-img`,
  `.gallery-thumb-img`, `.enquire-panel`, `.enquire-aside`, `.block`,
  `.acquire`, `.record`, `.dash`.
- **Full-bleed bands stay square.** `.category-band`, `.feature`, `.buying`,
  `.announcement`, `.trust-strip` and the footer take no radius. Rounding
  belongs to elements sitting inside a ground, not to the grounds themselves.

**Depth.** `--shadow-float` is the only shadow in the system and it is for
floating elements only: the mobile sticky enquiry bar (`.sticky-bar`) and the
dashboard's sticky save bar (`.admin-actions`). One further use exists as a
hover affordance on the product card (`.pc:hover`), paired with a 3px lift.
Everything else is flat. Do not add a second shadow token, do not soften cards
with shadows, and do not use shadow to imply hierarchy; hairlines and grounds do
that work.

**Hairlines** are the primary structural device. `border-top: var(--hair)` opens
almost every band; `border-bottom` closes the header; `border-left` divides the
trust strip and the words band into columns; `.record-row` rules separate table
rows; `.condition-notes` and `.shop-empty` carry a `2px solid var(--amber)` left
edge, and `.dash-clear` a `2px solid var(--sea)` one, as the one accented-rule
pattern.

**The one brand accent gesture.** `.store-head`, the section heading used across
the whole piece page, draws a short amber tick above itself:

```css
.store-head::before {
  content: "";
  display: block;
  width: 2.2rem;
  height: 2px;
  border-radius: 1px;
  background: var(--amber);
  margin-bottom: 0.9rem;
}
```

That tick is the section wayfinding, which is why the grounds below can vary
without shouting.

### Ground rhythm

Whitespace is generous, sections breathe, one idea per band. Alternate paper and
panel grounds with an occasional basalt band for rhythm.

| Ground | Where |
| --- | --- |
| `--paper` | The default. Page body, most bands, the product card surface, the dashboard main column |
| `--panel` | Tonal blocks and cards inside a paper ground: `.block`, `.acquire`, `.record`, `.care-cell`, `.condition-notes`, `.hero-lede`, `.enquire-panel`, `.dash`, `.dash-block`, figure backgrounds before photography lands |
| `--basalt` + `--bone` | Sparingly, for rhythm: the announcement strip, the buying band, `.feature` closers, the piece page's collector-words card (described in the code as "the one basalt moment on the page"), the dashboard top bar, the hero photo backdrop while the image streams in |
| `#fff` | Photography grounds, the included-items cards, the questions card, dashboard stat tiles and job rows |

Era tiles and figures carry a `data-ground="dark"` attribute that swaps the
figure to basalt and bone, alternating down a row.

---

## 6. Layout and spacing

### Container

```css
--shell: 1200px;
--gutter: clamp(1.25rem, 4vw, 3.25rem);
--edge-pad: max(var(--gutter), calc((100vw - var(--shell)) / 2));
```

Content is capped at 1200px and centred; **backgrounds run full bleed and only
content is inset**, via `--edge-pad` as horizontal padding. A band that must
break out of `.page`'s padding uses `margin: 0 calc(-1 * var(--edge-pad))`.

`--canvas-edge: clamp(0.75rem, 2vw, 1.5rem)` holds generative visuals in from
their panel's side edges rather than bleeding them; vertical stays flush.

`.page`, the inner-page shell, is `padding: 7.5rem var(--edge-pad) 6rem`,
tightening to `5.5rem` top and `4rem` bottom under 860px. The top padding clears
the fixed header. A page carrying a sticky bar gets `padding-bottom: 7rem` via
`.page:has(.sticky-bar)`.

### Breakpoints, exactly as they appear

There are no named breakpoint tokens; these are the literal queries in the CSS.

| Query | Count | What it does |
| --- | --- | --- |
| `max-width: 1080px` | 1 | Dashboard's two working columns stack |
| `max-width: 860px` | 9 | **The main stack breakpoint.** Every two-column grid collapses to one: piece page, hero, story bands, provenance, care grid, included list, condition pair, collector words, enquire layout, footer columns to two, trust strip to two, rooms grid to two, dashboard sidebar becomes a scrolling chip row |
| `min-width: 861px` | 2 | Desktop-only behaviour: the piece gallery pins with `position: sticky; top: 6rem`, and the sticky enquiry bar is hidden |
| `max-width: 600px` | 2 | The header wraps to two rows, the announcement grows its top padding to clear it, the newsletter button takes a full row |
| `max-width: 560px` | 2 | Product grid becomes exactly two columns with an `0.8rem` gap; admin era rows narrow |
| `max-width: 480px` | 3 | Narrow phone: the sticky bar drops its price so the title keeps the room, the rooms grid goes single file, starred-rail thumbnails narrow |
| `prefers-reduced-motion: reduce` | 7 | See section 8 |

Design against 390px, 768px and 1440px, and check that nothing important
disappears at 480px other than the sticky bar's price.

### Spacing

**Be aware: there is no spacing token scale.** Spacing is expressed as literal
rem values, and vertical band rhythm is expressed in `vh`. If you introduce a
scale, do it as an addition that reproduces the values below, not as a
replacement that shifts them.

The recurring values, in practice:

- Micro gaps: `0.35rem`, `0.4rem`, `0.45rem`, `0.5rem`, `0.55rem`, `0.6rem`
- Component gaps: `0.8rem`, `0.9rem`, `1rem`, `1.2rem`, `1.4rem`, `1.6rem`
- Section gaps: `2rem`, `2.4rem`, `2.5rem`, `2.6rem`, `3rem`
- Card padding: `1rem 1.1rem 1.15rem` (product card), `1.4rem 1.6rem 1.5rem`
  (care cell), `1.7rem 1.9rem` (block and acquire), `2rem 2.1rem` (enquire panel)
- Band vertical rhythm, home: `.highlight` and `.rooms` at `9vh`, `.words-band`
  at `10vh` top and `11vh` bottom, `.closing` at `15vh` (`12vh` on mobile),
  `.manifesto` at `16vh` (`14vh` on mobile)
- Band vertical rhythm, inner pages: `.feature` at `6rem` (`4rem` on mobile),
  `.trust-strip` at `3rem` top and `3.4rem` bottom

### Grid patterns as built

| Pattern | Desktop | Mobile |
| --- | --- | --- |
| Product grid `.pc-grid` | `repeat(auto-fill, minmax(16rem, 1fr))`, gap `1.4rem` | 2 columns, gap `0.8rem`, at 560px |
| Piece page `.piece` | `7fr / 5fr`, gap `3rem` | 1 column, gap `1.25rem`, at 860px |
| Hero `.hero-store` | `1.12fr / 1fr`, gap `1.5rem` | 1 column, gap `0.9rem` |
| Story band | `6fr / 6fr`, gap `clamp(1.5rem, 3vw, 3rem)` | 1 column |
| Era row `.rooms-grid` | 4 columns, gap `1.6rem` | 2 at 860px, 1 at 480px |
| Trust strip | 4 columns, gap `2rem` | 2 at 860px |
| Words bands | 3 columns | 1 at 860px |
| Footer columns | 3 columns | 2 at 860px |
| Specimen record row | `minmax(9rem, 13rem) / 1fr` | 1 column, gap `0.2rem` |
| Dashboard body | `15rem / 1fr` | Sidebar becomes a scrolling chip row |
| Dashboard stats | `repeat(auto-fit, minmax(13rem, 1fr))` | 2 columns at 860px |

**Measure.** Text is capped by `ch` almost everywhere. The values in use:
`14ch` and `18ch` for large headings, `24em` for the manifesto, `34ch` to `40ch`
for supporting copy, `44ch` to `46ch` for band bodies and form notes, `52ch` to
`56ch` for notes and answers, `60ch` for the page-head lede and the condition
report.

---

## 7. Component patterns

Photography leads. **Every card, hero and band is designed around an image slot
managed from the dashboard.** The generative line drawings survive only as quiet
placeholders until photography exists, and as small brand accents. **Never
design a section that only works with the drawing**, and never design one that
breaks when the drawing is all there is.

Two photography rules that hold everywhere:

- **Product photography is contained, never cropped**, on a white ground
  (`object-fit: contain; background: #fff`). The whole piece shows inside the
  card's fixed frame. This holds on the piece figure, the product card, the
  starred rail, the gallery thumbnails, the condition shots and the admin
  thumbnails.
- **Scene photography is covered**: story bands, the buying band and the hero
  backdrop use `object-fit: cover`.

### Product card, `.pc`

The single card idiom for the whole store: the "New in" row, the shop grid, an
era's pieces and the neighbours at the foot of a piece page all render it. The
card is a **closed object**, figure and text inside one bordered surface, so the
words never float loose on the page ground.

Anatomy, top to bottom, as one `<Link>`:

1. `.pc-figure`, `aspect-ratio: 4 / 5`, bottom hairline, `data-ground` of
   `photo` (white), `dark` (basalt) or default panel.
2. Inside it: the photograph contained on white, or the era's generative study
   plus a `Plinth`.
3. `.pc-flag`, a pill in the top left, **only when the status is not
   available**; `--ink` by default, `--rose` for reserved and sold, `--amber`
   for being prepared.
4. `.pc-body`: catalogue number in `.mono` at 50% opacity, `h3` title at
   weight 500, `.pc-attr` attribution in the accent hand clamped to two lines.
5. `.pc-meta`, pushed to the bottom with `margin-top: auto`: status dot plus
   label on the left, price on the right.

Hover: 3px lift, border to `rgba(30, 33, 30, 0.34)`, `--shadow-float`, title
underlined at `text-underline-offset: 4px`. The lift is removed under reduced
motion.

### Era tile, `.room-tile`

The collection compressed to one shopping row. Figure at `height: 30vh` with
`min-height: 200px`, hairline, `--radius-m`, alternating light and dark grounds
down the row. Below the figure, on the page ground: `h3` at weight 380, a count
line ("4 pieces") that disappears rather than reading zero, and a "View pieces"
link with a `1px` underline. Text sits outside the frame here, unlike the
product card.

### Hero, `.hero-store`

Two states, one composition. Without a hero photograph: a `--panel` headline
panel on the left with the animated logo, the h1 through `emphasise()`, a
subline and two pill CTAs, over a faint falling-chairs canvas; the owner's three
starred pieces run as a rail on the right, the lead card large with its
photograph, the two behind it slim rows. With a hero photograph: the same
composition over a full-bleed `object-fit: cover` backdrop, the headline panel
turning opaque `--paper`. **No gradients and no scrims**; the type never fights
the picture because it sits on its own opaque panel.

### Story band, `.story-band`

The piece, in detail: one feature per band, a media panel and a short passage,
alternating sides. `6fr / 6fr`, `align-items: center`. `data-layout="right"`
puts the figure second via `order: 2`; `data-layout="full"` goes single column
with the figure at `min-height: 52vh` and the text capped at `60ch`. The figure
is `min-height: 44vh`, hairline, `--radius-m`. Titles run through `emphasise()`.
Without photography the band renders the era's study at `opacity: 0.55` over a
plinth, so the template reads complete on day one.

### Buy box and buy panel

The label grown into the store's counter, and the most important object on the
site. Order in the markup is deliberate: catalogue number, attribution, `h1`,
optional provenance seal, then `.buy-panel` immediately, so price, availability
and the enquiry actions land in the first phone screen. The story and the
condensed record follow **beneath** the panel's closing hairline.

`.buy-panel` is bounded top and bottom by hairlines, not by a card. Inside:
`.acquire-head` with the price label and figure on the left and the status dot
and label on the right; `.buy-ctas` with two pill actions ("Send an enquiry",
"Arrange a viewing"), both anchoring to `#enquire`; the interest control; a
status-dependent note; and `.buy-trust`, two quiet mono lines. On mobile every
margin in this block tightens (eyebrow, attribution and seal all drop to
`0.7rem` bottom margin) so the whole set clears the fold.

### Specimen record, `.record`

A `--panel` card holding the piece's registered facts, then the owner's own
specification rows grouped as the dashboard arranged them. Rows are
`.record-row` wrappers carrying the grid rather than the `dl` itself:
`minmax(9rem, 13rem) / 1fr` with a top hairline, first row excepted because the
card edge already draws that line. Group headings are `.mono` in `--amber` at
weight 400. On mobile the row becomes a single column with a `0.2rem` gap, so
term and detail stack.

### Sticky enquiry bar, `.sticky-bar`

Mobile only, hidden outright at `min-width: 861px`. A `1px` sentinel sits where
the buy box scrolls away; an IntersectionObserver shows the bar only on the
**upward** exit, because while the sentinel is still below the fold the buy box
is ahead of the reader and the bar would only intrude. Fixed to the bottom,
`z-index: 30`, `--paper` ground, top hairline, `--shadow-float`, fading via
`opacity` with `pointer-events: none` when hidden. Contents: the title
ellipsised, the price, and an "Enquire" pill. Under 480px the price is dropped.
Focus is managed: the link takes `tabIndex={-1}` while hidden.

### Buttons

Two families, both pills, both with palette-inversion hover, both at
`min-height: 44px`.

| Class | Base | Hover |
| --- | --- | --- |
| `.btn.btn-solid` | `--ink` ground, `--stone` text, `0.9rem 1.9rem` padding, `0.74rem` / `0.1em` label | `--amber` ground and border, `--basalt` text |
| `.btn.btn-line` | transparent, `--ink` text, `1px solid var(--ink)` | `--ink` ground, `--stone` text |
| `.enquire` | transparent, `1px solid currentColor`, `0.75rem 1.6rem`, `0.74rem` / `0.1em` | `--ink` ground, `--stone` text; on a basalt ground it inverts to `--bone` ground, `--basalt` text |
| `.shop-chip` | transparent, hairline border, `0.68rem` / `0.08em`, with a count at 55% opacity | border to `--ink`; `aria-pressed="true"` fills `--ink` with `--paper` text |
| `.dash-ghost` | transparent on basalt, `rgba(221, 217, 204, 0.3)` border | `--bone` ground, `--basalt` text |

`.enquire` is the universal action and appears as both `<a>` and `<button>`.
Transitions are `0.25s ease` on background, colour and border-colour.

### Form fields, `.field`

Column flex with a `0.5rem` gap. Label in `.mono` at `0.72rem` / `0.08em` /
70% opacity. Input, textarea and select share: body face, `1rem`,
`color: inherit`, **transparent background**, `border: var(--hair)`,
`--radius-s`, `0.8rem 0.9rem` padding. Textareas are `min-height: 8rem`,
`resize: vertical`. Focus is always `outline: 2px solid var(--ink)` with
`outline-offset: 2px`, declared explicitly on every field type rather than
relying on the global rule. Field bottom margin is `1.6rem`.

Confirmation and error both use `.form-note` with `data-tone="ok"` (`--sea`) or
`data-tone="error"` (`--rose`), at full opacity, with `role="status"`. The
enquiry form always offers a mailto fallback beneath itself, so an enquiry is
never lost if the database is unreachable.

### Questions accordion, `.faq-list`

Native `<details>` in one white card. The affordance is a **rotating hairline
plus, never a chevron**: two 1px pseudo-element bars, the upright one rotating
90 degrees on open so the plus reads as a minus. The unfold is a measured
`0.25s` on `block-size` using `interpolate-size: allow-keywords` and
`::details-content`; a browser that cannot interpolate simply opens at once,
which is also the reduced-motion behaviour. Summary rows are `min-height: 44px`
with the native marker removed. The same plus device is reused for the
dashboard's collapsible sections.

### Trust strip and collector words

`.trust-strip`: four assurances in four columns divided by left hairlines, the
first column dropping its border. Numbered `01` to `04` in `.mono` at 55%
opacity,
each body capped at `26ch`. Facts only, no icons.

Collector words: staff-curated quotes typeset as exhibition wall labels, quote
in the accent hand, attribution in `.mono` at 60 to 65% opacity. **No stars, no
scores.** On the piece page the three sit in a single basalt card with
`--hair-bone` rules; on the home page they sit on the paper ground divided by
left hairlines.

### The utilitarian side: `/admin`

The storefront sells; the dashboard oversees. It is denser and plainer, but
built from the same tokens so it reads as the same company: paper ground, panel
cards, hairlines, the sea, rose and amber status trio, `.mono` for labels only.

- **Shell.** `.dash` is a `--radius-m` panel card with `overflow: hidden`. A
  basalt `.dash-top` bar carries an amber dot, the name, and three ghost pill
  buttons. `.dash-body` is `15rem / 1fr`: a sticky grouped nav beside one panel
  at a time. The storefront header, announcement and footer are hidden on this
  route via `body:has(.page-dash)`.
- **Nav items** are buttons, not links, with `aria-current="page"` filling
  `--ink` with `--paper` text, a label, a hint line, and a count badge only on
  the sections that fill up on their own (enquiries, interest, mailing list).
- **Stat tiles.** White cards with a `2px` top border tinted by `data-tone`
  (`sea`, `rose`, `amber`, otherwise `rgba(30, 33, 30, 0.25)`), a label, a
  weight-320 value at `2.4rem`, and a note. Hover lifts 2px, removed under
  reduced motion.
- **Sticky save bar.** `.admin-actions` hugs the bottom of the viewport with a
  panel ground, a top hairline and `--shadow-float`, so saving a long form never
  means scrolling to the end. It carries an unsaved-changes hint.
- **Selection without colour alone.** `.admin-visual[aria-pressed="true"]`
  thickens to an amber border plus an inset amber ring, **and** the name carries
  "in use" in text.
- Every interactive row element carries an explicit `min-height: 44px`.

---

## 8. Motion

Light touch. Motion must never cost conversion or Lighthouse.

- **Section reveal.** `.reveal` starts at `opacity: 0; translateY(26px)` and
  transitions over `0.9s ease` to `.reveal.in`, added by an
  IntersectionObserver at `rootMargin: "0px 0px -12% 0px"` with `threshold: 0`,
  so sections taller than the viewport still reveal. A `<noscript>` block in the
  layout forces `.reveal` visible when JavaScript does not run.
- **Smooth scroll.** Lenis, driven by the GSAP ticker with ScrollTrigger kept in
  sync, `duration: 1.1`, `smoothWheel: true`, `syncTouch: false`,
  `autoRaf: false`. Under reduced motion the provider remounts with smoothing
  off and native scrolling returns.
- **Canvases.** Every generative visual runs through one shared hook,
  `useCanvasScene`, and inherits the whole contract: `devicePixelRatio` capped
  at **2**, the loop paused whenever the canvas is off-screen (via
  IntersectionObserver at `threshold: 0.05`), the loop deferred until the page
  has loaded and gone idle so it never competes with first render, a repaint
  when web fonts are ready, and pointer input mapped from the window each frame.
  Canvases that take pointer input carry `touch-action: pan-y` so they never
  trap the scroll. On devices without hover, page scroll drives a virtual cursor
  across the panel.
- **Micro-transitions** are `0.2s` to `0.28s ease`: buttons, chips, card hover,
  the accordion plus, the sticky bar fade, the emphasis weight.
- **The splash** is a first-visit curtain on the home page only, never on a
  piece page. It always leaves (a CSS failsafe clears it after five seconds
  whatever happens), never repeats in a session, is skipped by any input, is
  hidden from assistive technology, and does not run at all under reduced
  motion.

### The reduced-motion contract

**`prefers-reduced-motion: reduce` renders everything at rest with nothing
missing.** This is a hard requirement, not a graceful degradation. Concretely,
in the seven reduced-motion blocks: `scroll-behavior` returns to auto, `.reveal`
renders visible and untransitioned, the emphasis transition is dropped (the
weight step itself stays), the accordion opens instantly, the sticky bar appears
without a fade, card and stat hover lifts are removed, and the splash is
`display: none`. Canvases paint one meaningful still frame instead of a loop.

If you design a new motion, you must be able to describe what it looks like at
rest, and nothing may be conveyed by the motion alone.

---

## 9. Accessibility and performance constraints that bear on design

- **Tap targets are 44px minimum.** This is declared explicitly on buttons,
  chips, search fields, selects, accordion summaries, gallery thumbnails, footer
  links, admin rows, upload controls and nav items. Small `.mono` links enlarge
  their hit area with padding plus matching negative margin so the visual
  position does not shift.
- **Keyboard focus is always visible.** The global rule is
  `outline: 2px solid currentColor; outline-offset: 3px` on `a`, `button` and
  `[tabindex]`; form fields override to `2px solid var(--ink)` at
  `outline-offset: 2px`. On a basalt ground `currentColor` is already `--bone`,
  and the buying band declares `outline-color: var(--bone)` explicitly for its
  links; do the same for any new dark band. Never remove an outline without
  replacing it with something at least as visible.
- **One `h1` per page**, semantic headings throughout. Where a visible h1 would
  duplicate a design element (the dashboard), it is hidden with
  `.visually-hidden` rather than dropped.
- **Lighthouse 90+ on mobile** for home, a category page and a piece page, to be
  checked before shipping any structural change. No canvas work on the piece
  page's mobile critical path.
- **`next/image` for all photography with real `sizes`.** The values in use, as
  a guide for anything new: piece figure
  `(max-width: 860px) 100vw, 58vw`; product card
  `(max-width: 560px) 100vw, (max-width: 900px) 50vw, 30vw`; story band
  `(max-width: 860px) 100vw, 50vw`; condition shot
  `(max-width: 860px) 100vw, 45vw`; hero backdrop `100vw`; thumbnails a fixed
  `88px`. Never ship `sizes="100vw"` on a component that is not full width.
- **JSON-LD** on every piece page (`Product` with price, availability and
  condition) and `Organization` sitewide. Availability is only asserted where
  schema.org has an honest term: available maps to `InStock`, sold to
  `OutOfStock`, and reserved or being-prepared pieces **omit** the field rather
  than claim either. Design must not create a state the structured data cannot
  honestly express.
- **Per-piece Open Graph cards** at 1200x630 are the social share surface and
  are generated, not authored, so they cannot drift behind a rebrand.
- Decorative canvases and asides are `aria-hidden`; the generative studies carry
  descriptive labels built from the era name plus a description of what is
  actually drawn.

---

## 10. Do and do not

**Do**

- Put the price, the availability and the enquiry action in the first mobile
  viewport of a piece page, every time.
- End every page in a next action: home routes to the collection and to featured
  pieces, a category routes to pieces, a sold piece routes to registering
  interest and to similar pieces.
- Design every image slot with its no-photography state drawn as well: the era's
  generative study over a plinth, or a quiet "Photography to follow" note.
- Use hairlines and ground changes to structure a page; use the amber tick to
  mark a section.
- Pair every status colour with its text label.
- Let the attribution wrap to two lines.
- Keep the enquiry and interest forms short, fast and plainly confirmed.
- Sentence case everything, including buttons and nav.

**Do not**

- Do not design a section that only works with the generative drawing, and do
  not design one that breaks without a photograph.
- Do not embolden or slant Anaktoria, and do not set it below about 14px.
- Do not put a weight list back into the Montserrat loader; the highlight
  interpolation depends on the variable file.
- Do not use italics for emphasis anywhere; emphasis is the weight step on `em`.
- Do not add a second shadow, and do not put a shadow on a flat surface.
- Do not round a full-bleed band.
- Do not use `--sea`, `--rose` or `--amber` decoratively; they are status data.
- Do not introduce a fourth status colour or a colour-only state.
- Do not add urgency, scarcity, countdowns, star ratings or badges.
- Do not name a designer as fact; use an approved hedge.
- Do not crop product photography; contain it on white.
- Do not put a gradient or a scrim over a hero photograph; float an opaque panel
  instead.
- Do not add motion that leaves a gap when it is switched off.
- Do not reach for `--stone` or `--stone-deep` in new work; they are legacy
  aliases.

---

## 11. Open questions and known drift

Recorded rather than resolved. Each of these is a real disagreement between
`CLAUDE.md`, `DESIGN.md` and the built code, found while writing this brief.
Ask before designing over any of them.

### Contradictions in the documentation

1. **`Em.tsx`'s comment contradicts its own CSS.** The file's docstring says the
   emphasised span is "set in the accent hand, the same one the mark uses for
   its 'of'". The `em` rule in `app/globals.css` deliberately does the opposite:
   `font-family: var(--font-body)`, and `DESIGN.md` explains at length why. The
   CSS and `DESIGN.md` agree, so this brief follows them and treats the comment
   as stale, but somebody should fix the comment.
2. **`CONTENT.md` records an italic in the wordmark treatment**, "Modern / Life
   *furniture* (italic on furniture)", which contradicts both the never-italic
   rule and the current brand name. That whole line appears to predate the
   rename to House of Chairs.
3. **`DESIGN.md` lists a weight scale of 280 / 320 / 380 / 500 / 400 / 500**,
   but the code also contains a single weight **300** on the lead starred hero
   card. Either the scale gains a tier or that card should move to 320.
4. **`DESIGN.md`'s token block omits five tokens that exist**: `--hair-bone`,
   `--canvas-edge`, `--shell`, `--gutter` and `--edge-pad`, plus the four font
   variables. This brief documents the full 24.

### Documentation naming classes that no longer exist

5. `DESIGN.md` lists `.featured-figure`, `.promo-figure`, `.cat-row-figure` and
   `.featured-cta` as part of the radius and pill rules. **None of the four
   exists in the CSS.** `.featured-figure` survives only as a comment explaining
   that its removal orphaned a canvas sizing rule.
6. `DESIGN.md` says "the photo hero panel rounds only its free corner". The
   photographic hero now reuses `.hero-lede`, which takes a full `--radius-m` on
   all four corners. The only surviving `.photo-hero-panel` rule is a mobile
   override at `max-width: 860px` with **no base rule anywhere**, so it is dead
   CSS.

### Code that has drifted from the system

7. **The hero starred rail renders three classes that have no CSS at all**:
   `.featured-status`, `.featured-dot` and `.featured-price`, in
   `components/gallery/Hero.tsx`. The consequence is visible, not cosmetic: on
   the home page's starred rail the status dot renders as a zero-size invisible
   span and the status text carries no colour, so the sea, rose and amber
   convention silently fails in the one place the home page shows availability.
   The equivalent `.pc-status` / `.pc-dot` and `.acquire-status` /
   `.acquire-dot` rules are complete. This looks like a rename that missed a
   file.
8. **The piece page renders its attribution in the accent hand at
   `0.72rem`.** The markup is `class="mono attribution"`; `.mono` supplies
   `font-size: 0.72rem` and `letter-spacing: 0.1em`, while the more specific
   `.piece-body .attribution` swaps the family to Anaktoria. The computed result
   is a calligraphic hand at roughly 11.5px with wide tracking, which is exactly
   the "cursive hand at 12px is decoration rather than information" case that
   `DESIGN.md` forbids. The product card gets this right at `0.84rem` with no
   `.mono`. Worth deciding whether the attribution should be the hand at a
   readable size or the label face.
9. **The canvas renderers still paint the retired v1 ground.**
   `BallChair.tsx`, `Silhouette.tsx`, `ProvenanceRings.tsx` and `Strata.tsx` all
   hardcode `const STONE = "#E4E2DB"`, which is neither `--paper` nor `--panel`.
   `DESIGN.md` already flags this and judges it acceptable inside framed
   figures. It also affects the **per-piece Open Graph card**, which grounds
   itself in `#e4e2db` while the sitewide card uses `#f5f3ef`, so the two social
   cards do not match. Both OG cards also use a `0.18` hairline rather than the
   token's `0.16`.
10. **Dead CSS from the retired concept is still in the file**: the v1
    full-viewport `.hero` block with its `100svh`, `clamp(2.8rem, 11vw, 8rem)`
    h1, `.hero-sub` and `.scroll-cue`; `.shop-by`; and the `.specimen` /
    `.label` / `.plinth` museum-room set. `Room.tsx`, `SpecimenLabel.tsx` and
    `ServiceBand.tsx` are orphaned components that nothing imports. Do not treat
    these rules as live patterns.

### Spec versus implementation

11. **"Chairs lead" is not implemented as the spec describes.** `CLAUDE.md`
    says "the nav's first link is Chairs" and "the collection orders chairs
    first". The header's first nav link is **"Shop"**, pointing at
    `/collection`. The collection is organised by **era**, not by furniture
    type: Bauhaus and modernist, Danish modern, Space age, Italian and
    sculptural, Modern classics. There is no chairs category to lead with. The
    chairs-first idea currently lives in the copy ("See the chairs", "chairs
    above all") rather than in the information architecture. This is the largest
    open question in the brief: either the nav and taxonomy need a chairs entry
    point, or the spec sentence needs rewriting.
12. **`CONTENT.md` and the built home page disagree on the era row.**
    `CONTENT.md` specifies eyebrow "Browse the collection" and heading "Shop by
    category"; `RoomsRow.tsx` renders "The collection, era by era" and "Shop by
    era". The code reads better; the content file is stale.
13. **There is no spacing scale**, only recurring literal values and `vh`-based
    band rhythm. If a scale is wanted, it should be added as a token set that
    reproduces the existing values rather than one that shifts them.
14. **The tokens are invisible to Tailwind.** Tailwind v4 is installed with no
    config and no `@theme` block, so `bg-paper` and similar do not exist. Any
    new component must reach for `var(--paper)` in CSS. If Claude Design emits
    Tailwind colour utilities they will silently produce the wrong colours.

---

## 12. Coverage

Read in full for this brief: `CLAUDE.md`, `DESIGN.md`, `CONTENT.md`,
`app/globals.css` (all 3,864 lines), `app/fonts.ts`, `app/layout.tsx`,
`app/page.tsx`, `app/piece/[slug]/page.tsx`, `lib/format.ts`,
`components/typography/Em.tsx`, `components/collection/PieceCard.tsx`,
`components/collection/ShopGrid.tsx`, `components/gallery/RoomsRow.tsx`,
`components/gallery/Hero.tsx`, `components/gallery/PhotoHero.tsx`,
`components/gallery/Highlighted.tsx`, `components/chrome/Header.tsx`,
`components/chrome/Footer.tsx`, `components/forms/EnquiryForm.tsx`,
`components/scroll/LenisProvider.tsx`, `components/scroll/RevealObserver.tsx`,
`components/canvas/useCanvasScene.ts`, `components/admin/AdminDashboard.tsx`,
and the piece sections `PieceGallery`, `PieceStickyBar`, `StoryBands`,
`SpecRecord`, `IncludedList`, `ConditionSection`, `CareDelivery`,
`FaqAccordion`, `CollectorWords`, `InterestButton`.

Skimmed or checked only for specific facts: `app/collection/page.tsx`,
`app/enquire/page.tsx`, `content/landing.ts`, `app/opengraph-image.tsx`,
`app/piece/[slug]/opengraph-image.tsx`, `package.json`, `postcss.config.mjs`.

**Not read**, so nothing here describes them: `ARCHITECTURE.md`, `ROADMAP.md`,
the Supabase migrations under `supabase/`, the API routes under `app/api/`, the
individual canvas renderers beyond their ground constants, the splash and
physics code beyond the notes in `DESIGN.md`, the logo and chair-extraction
build scripts, `components/admin/PieceEditor.tsx` and the other individual admin
panels beyond the shell, and `reference/concept-v5.html`, which is retired
history and not a source of truth.
