# Personal Portfolio — a living brand page

A playful, bold, hand-crafted personal portfolio with a **fully working
admin** (`/admin`) so the owner can change every piece of content
without touching code. Built with **Next.js (App Router) + TypeScript +
SQLite**, hand-written CSS that matches the reference design language
(cream / dark / yellow / coral / mint / lavender, sticker UI, hard
shadows, grain overlay, kinetic typography, marquees, doodle accents).

## Features

- **Public site** — sticky nav, oversized hero with a rotating word box,
  animated stickers, two marquees, About (with count-up stats + a
  "right now" tape card), Projects (modular cards + a `/projects/[slug]`
  detail page), Wins/Achievements (rotated grid), Content rows, a Contact
  section with a copy-email button, and a footer. Fully responsive
  (mobile-first) and respects `prefers-reduced-motion`.
- **Data-driven** — every section is rendered from a SQLite database.
  No content is hard-coded in the UI.
- **Working `/admin`** — tabbed sidebar, form-driven editing, add /
  edit / delete, drag-free up·down reordering, per-entry and per-section
  visibility toggles, image **URLs or uploads**, live in-iframe preview,
  validation, empty states, and a clear **Save** action that writes
  straight to the database. The public site reads the same DB, so changes
  go live immediately.
- **Simple secure auth** — `/admin` is gated behind a username +
  password login. The session is an HTTP-only, signed, expiring cookie
  (HMAC over a timestamp with `SESSION_SECRET`). API routes are all
  server-guarded.
- **SEO** — per-page metadata, Open Graph, and proper heading order.
  The preview iframe is excluded from indexing.

## Stack

| Concern        | Choice                                            |
| -------------- | ------------------------------------------------- |
| Framework     | Next.js 15 (App Router), React 19, TypeScript |
| Styling       | Hand-written CSS (`src/app/globals.css`)        |
| Database      | SQLite via `better-sqlite3` (file: `data/portfolio.db`) |
| Auth          | Signed cookie session (Node `crypto`)          |
| Image upload  | Local `/public/uploads` via `/api/upload`       |

## Quick start

```bash
# 1. install dependencies
npm install

# 2. (optional) create a local env — sensible defaults are baked in
cp .env.example .env.local
#   edit ADMIN_USERNAME / ADMIN_PASSWORD / SESSION_SECRET

# 3. run the dev server (auto-seeds demo content on first launch)
npm run dev
# open http://localhost:3000
# open http://localhost:3000/admin
```

**Default admin login** (from `.env.local`):

- Username: `admin`
- Password: `changeme123`

> Change these in `.env.local` (and set a long random `SESSION_SECRET`)
> before deploying. The database is created and **seeded with demo
> content automatically** on the first request.

### Production build

```bash
npm run build
npm run start
```

## Project structure

```
src/
  app/
    layout.tsx              # fonts, <head>, SEO metadata
    page.tsx                # home (composes all sections)
    projects/[slug]/page.tsx  # project detail page
    preview/page.tsx         # saved-state preview used inside /admin iframe
    admin/page.tsx          # admin shell (auth-guarded)
    admin/login/page.tsx    # login screen
    api/
      auth/{login,logout,me}  # session
      hero|about|contact|site|marquee   # singleton updates (PUT)
      stats|currently|projects|achievements|content-items|contact-links  # collections (POST/PUT/DELETE)
      projects/[id]|achievements/[id]|content-items/[id]|contact-links/[id]
      reorder                # reorder a collection
      upload                 # image upload -> /public/uploads
  components/
    Nav.tsx, Reveal.tsx, StatCounters.tsx, CopyEmail.tsx,
    Marquee.tsx, Decor.tsx     # public UI + decorative SVGs
    sections/                   # Hero, About, Projects, Achievements, Content, Contact, Footer
    admin/                      # AdminApp + form primitives + api helper
  lib/
    db.ts, seed-data.mjs       # SQLite connection + schema + demo seed
    content.ts                 # typed data-access layer (read + write)
    auth.ts, api.ts           # session + route guards
    types.ts, highlight.tsx    # types + [[highlight]] parser
data/                        # SQLite database (gitignored, auto-created)
public/uploads/             # uploaded images (gitignored)
scripts/seed.mjs            # optional: `npm run seed` / `npm run seed -- reset`
```

## Using the admin

1. Go to `/admin` → log in.
2. Pick a tab (Site, Hero, Marquees, About, Stats, Currently,
   Projects, Wins, Content, Contact Links).
3. Edit text inline; add / remove / reorder items; toggle the eye to
   hide or show a single entry or an entire section.
4. For images, paste a URL **or** click **Upload image** (saved to
   `/public/uploads`, max 4 MB).
5. Hit **Save changes** (top-right). The button is disabled until you
   have unsaved edits, and a banner confirms the save.
6. Use **Show preview** to see the saved site inside the dashboard,
   or open **View live site** in a new tab.

Reordering: every editable list has ↑ / ↓ arrows. Drag isn't used so
it stays reliable on touch devices. Visibility: the eye toggle on each
card hides just that entry on the public site; hidden entries stay
editable in the admin.

## Notes & tradeoffs

- **Local-first SQLite** was chosen over a heavier backend: zero external
  services, trivial to back up (one file), and easy to extend by adding
  a table in `src/lib/seed-data.mjs` + a few CRUD routes. To move to
  Postgres later, only `src/lib/db.ts` and the SQL in `seed-data.mjs`
  need to change.
- **Save = publish.** Edits write straight to the DB on Save, so the
  public site is always in sync. If you want a draft/publish split,
  add a `published` column and gate the public queries on it.
- The hero's rotating word box and the About `[[highlight]]` markup are
  the only "mini-syntaxes" — both are explained inline in the admin.
```
