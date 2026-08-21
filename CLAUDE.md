# CLAUDE.md — Big Hit Barbershop Digital Signage

## What this is

A digital menu board for Big Hit Barbershop. Two wall-mounted TVs display the
service price list.

The screens are not running signage software. Each TV has a Fire TV Stick
running Fully Kiosk Browser locked to a URL from this app. The app is the
entire system.

## Ship v1 first

**Phase 1 (now): prices live in a local data file. No backend. No auth.**

The goal is a menu on the wall this week. Edit prices in the repo, push,
Vercel redeploys, screens pick it up. That is the entire update loop for v1
and it is good enough to launch.

**Phase 2 (later): move the same data into Supabase** so the owner edits from
his phone without a deploy, and so a future booking system reads the same
source.

Everything in phase 1 must be built so phase 2 is a data-source swap, not a
rewrite. See "Data" below — this is the one thing worth being disciplined
about now.

## Stack

- **Next.js** (App Router) on **Vercel**
- **Supabase** later, not now
- No CSS framework assumptions; keep styling self-contained

## Data

### Phase 1 shape

A single file — `data/services.ts` — exporting a typed array. This is the file
that gets edited to add or change haircuts. Keep it obvious and comment it so
it is editable without reading any other code.

Each service:

- `id` — stable string slug
- `name` — e.g. "Regular Cut"
- `price` — number
- `description` — optional. Explanatory note shown smaller under the name.
- `isStartingPrice` — optional boolean. Renders "starting at $X".
- `active` — boolean. Hide seasonally without deleting.
- `sortOrder` — number
- `screens` — array, e.g. `[1]`, `[2]`, or `[1, 2]`

### The one rule that matters

**All data access goes through a single module** — `lib/services.ts` —
exporting something like `getServices()`. The display components never import
the data file directly.

In phase 1 that function returns the local array. In phase 2 it queries
Supabase. Nothing else in the app changes.

Do not scatter data imports through components. Do not shape the data around
what looks convenient to render. The field names above are chosen to map
cleanly to Postgres columns later.

### Seed data

Current price list as posted in the shop:

| Service                 | Price | Note                                               |
| ----------------------- | ----- | -------------------------------------------------- |
| Regular Cut             | 35    |                                                    |
| Special Cut             | 40    | long hair style, Afros, cuts that demand more time |
| Senior Cut              | 28    |                                                    |
| Kids Cut                | 33    |                                                    |
| Beard Trim w/Cut        | 46    |                                                    |
| Specialty Cut           | 52    |                                                    |
| Beard Trim              | 30    |                                                    |
| Line Up                 | 25    |                                                    |
| Line Up w/Beard Trim    | 40    |                                                    |
| Head Shave              | 25    | foil shaver                                        |
| Head Shave w/Beard Trim | 40    |                                                    |
| Design                  | 7     | starting price                                     |
| Big Hit Skip the Line   | 100   |                                                    |

Note the two shape requirements this creates: "Special Cut" needs a
`description`, "Design" needs `isStartingPrice`.

## Hardware constraints — READ BEFORE WRITING ANY CODE

Not hypothetical. This is the actual deployment target.

### The browser is old

Display devices are **Fire TV Stick 4K (1st gen, 2018)** on **Fire OS 6** —
Android 7.1. Fully Kiosk wraps the Android System WebView, which here is old
Chromium.

- Set a legacy `browserslist` target in the Next config so the build
  transpiles down and polyfills. Do not assume evergreen browser support.
- Avoid bleeding-edge JS/CSS on display-facing code.
- **A blank white screen on the TV means a JS parse error.** That is the
  failure mode to design against.

### The panels are 1080p LCD

- Design at **1920x1080**. Not 4K.
- LCD, not OLED. **Burn-in is not a concern.** Do not build pixel-shifting or
  layout rotation.

### Overscan

- Keep all text inside a **5% safe margin** on every side.

### Viewing distance

Read from a barber chair, 10–15 feet.

- Font sizes must be far larger than they look right on a desktop monitor.
- Legible at a glance, not scanned.

### No input device

- No cursor, no touch, no keyboard.
- **No hover states, no click handlers, no interactive elements** on the
  display route.

## Design direction

**Black and gold. High-end, luxury barbershop.** Think letterpress stationery
or a hotel bar menu, not a sports bar TV.

### The glare constraint shapes the palette

The shop has bright hexagonal LED ceiling strips and the TV panels are glossy.
Reflections are severe — the ceiling lights are clearly visible in the panel
even with the TV off.

**Do not use a black background.** A dark field on a glossy panel means the
backlight is off across most of the screen and the viewer sees a mirror of the
ceiling. Gold text survives; the black field becomes reflections.

**Invert it instead:**

- **Background** — warm ivory / bone / soft cream. Not pure white; warm reads
  as expensive, pure white reads as a spreadsheet.
- **Primary text** — near-black, not pure black. Service names and prices.
- **Gold** — the accent, used with restraint. Hairline rules between
  services, the crest/logo, leader dots, the price column, a border frame.
- Gold on a light background needs to be a deeper antique or old gold, not a
  bright yellow — bright gold on cream has no contrast.

This keeps the black-and-gold identity in the type and ornament while the
bright field fights the reflections instead of hosting them.

### Type

- A serif with real character for service names — this is where the luxury
  lives. Something with contrast and history, not a system serif.
- Prices can be the same family, tabular figures so the column aligns.
- Generous letter spacing on the header/crest.
- Leader dots between name and price, echoing the existing painted sign.

### Restraint

- No gradients, no drop shadows, no glow effects.
- No animations or transitions on the display route. Old WebView, unattended,
  12 hours a day. Motion is risk with no upside.
- Whitespace is the luxury signal. Do not fill the screen.

### If the owner insists on dark

Test before building. Load a mockup on a phone, hold it flat against the wall
at the mounting angle, mid-day with the lights on. If it holds up on his
specific panels, fine. Do not skip this test.

**Decision (tested, approved):** the owner tested a dark mockup on the actual
panels under shop lighting and it held up. The site now runs **black
background, gold text** instead of the ivory/gold inversion above — near-black
(`#131110`), not pure black; warm ivory (`#f1e6cf`) for primary text; brighter
gold (`#d1a537`) for prices, rules, and accents. Keep this in mind if the
panels or lighting ever change — the ivory-first reasoning above still holds
for a glare-prone setup, this is a hardware-specific override, not a reversal
of the general default.

## Routes

### `/display`

TV-facing. Accepts `?screen=1` or `?screen=2`.

- **Screen 1** — full service menu.
- **Screen 2** — abbreviated menu plus a secondary panel for promos,
  Instagram, and a booking QR code.

Requirements:

- Full bleed, no chrome, no scrollbars, no navigation.
- **Poll for fresh data every 60 seconds.** Even in phase 1 with static data,
  build the refresh loop — it costs nothing now and it is what makes phase 2
  work without touching the display code.
- On network loss, keep showing the last known good data. Never render an
  error state or an empty board on the wall.

### `/admin`

**Phase 2 only. Do not build this yet.** Noted here so the data module is
designed with it in mind.

## Build order

Do not jump ahead to polish.

1. **Static smoke test.** One page, hardcoded, deployed. Confirm it renders on
   the actual Fire Stick before anything else. This is the real risk.
2. **`data/services.ts` + `lib/services.ts`** with the seed data.
3. **`/display?screen=1`** rendering the full menu, correct type scale, safe
   margins.
4. **60-second refresh loop.**
5. **Design pass** — ivory and gold, once it is confirmed rendering on device.
6. **Screen 2 variant** and secondary panel.
7. **Ship it.** Hang it on the wall. Stop.
8. Phase 2: Supabase behind `getServices()`, then `/admin`.

## Things not to do

- Do not build a CMS, content scheduling, or playlist system. Prices in a
  list, rendered on a screen.
- Do not use `localStorage` or `sessionStorage`.
- Do not build offline-first. Poll and degrade gracefully.
- Do not add Supabase, auth, or a database in phase 1. The whole point is to
  launch.
- Do not let admin-side dependencies into the display bundle when phase 2
  lands. Keep `/display` as light as possible.

## Operating context

- Runs roughly **12 hours a day**, devices sleep on a schedule matching shop
  hours.
- Two screens today. A third should not be painful, but do not build for
  scale that is not there.
- The owner is not technical. Phase 2 `/admin` must be obvious without
  instruction.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
