# Personal Portfolio — a living brand page

A playful, bold, hand-crafted personal portfolio with a **fully working
admin** (`/admin`) so the owner can change every piece of content
without touching code. Built with **Next.js (App Router) + TypeScript
deployed on Vercel**, with **Supabase (Postgres)** as the backend, and
hand-written CSS that matches the reference design language (cream / dark
/ yellow / coral / mint / lavender, sticker UI, hard shadows, grain
overlay, kinetic typography, marquees, doodle accents).

## Features

- **Public site** — sticky nav, oversized hero with a rotating word box,
  animated stickers, two marquees, About (with count-up stats + a
  "right now" tape card), Projects (modular cards + a `/projects/[slug]`
  detail page), Wins/Achievements (rotated grid), Content rows, a Contact
  section with a copy-email button, and a footer. Fully responsive
  (mobile-first) and respects `prefers-reduced-motion`.
- **Data-driven** — every section is rendered from a Supabase (Postgres)
  database. No content is hard-coded in the UI.
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
| Framework     | Next.js 16 (App Router), React 19, TypeScript  |
| Hosting       | Vercel (front-end + API routes, Node.js runtime) |
| Database      | Supabase Postgres (via `@supabase/supabase-js`) |
| Auth          | Signed cookie session (Node `crypto`)          |
| Image upload  | Supabase Storage bucket via `/api/upload`       |

## Quick start

```bash
# 1. install dependencies
npm install

# 2. create a local env and set your Supabase credentials
cp .env.example .env.local
#   set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (see "Backend setup" below)
#   edit ADMIN_USERNAME / ADMIN_PASSWORD / SESSION_SECRET

# 3. run the dev server
npm run dev
# open http://localhost:3000
# open http://localhost:3000/admin
```

**Default admin login** (from `.env.local`):

- Username: `admin`
- Password: `changeme123`

> Change these in `.env.local` (and set a long random `SESSION_SECRET`)
> before deploying.

### Backend setup (Supabase)

1. Create a Supabase project.
2. Open **SQL Editor**, paste the contents of [`supabase/schema.sql`](supabase/schema.sql),
   and click **Run**. This creates the tables **and seeds demo content**.
3. Create a **public** Storage bucket named `uploads` (or set
   `SUPABASE_STORAGE_BUCKET` to your bucket name) so admin image uploads work.
4. Copy the project URL and the **service_role** key from
   **Project Settings → API** into `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

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
    db.ts                     # Supabase server client (service role)
    content.ts                # typed data-access layer (read + write)
    auth.ts, api.ts           # session + route guards
    types.ts, highlight.tsx    # types + [[highlight]] parser
supabase/schema.sql         # CREATE TABLE + demo seed for the SQL Editor
```

## Using the admin

1. Go to `/admin` → log in.
2. Pick a tab (Site, Hero, Marquees, About, Stats, Currently,
   Projects, Wins, Content, Contact Links).
3. Edit text inline; add / remove / reorder items; toggle the eye to
   hide or show a single entry or an entire section.
4. For images, paste a URL **or** click **Upload image** (saved to your
   Supabase Storage bucket, max 4 MB).
5. Hit **Save changes** (top-right). The button is disabled until you
   have unsaved edits, and a banner confirms the save.
6. Use **Show preview** to see the saved site inside the dashboard,
   or open **View live site** in a new tab.

Reordering: every editable list has ↑ / ↓ arrows. Drag isn't used so
it stays reliable on touch devices. Visibility: the eye toggle on each
card hides just that entry on the public site; hidden entries stay
editable in the admin.

## Deploy to Vercel + Supabase

1. **Supabase** — create the tables and seed content by running
   [`supabase/schema.sql`](supabase/schema.sql) in the SQL Editor (see
   "Backend setup" above). Create the public `uploads` Storage bucket.
2. **Vercel** — import the repo. Vercel auto-detects Next.js; no config
   file is needed.
3. **Environment variables** (Project Settings → Environment Variables,
   apply to Production + Preview + Development):
   - `SUPABASE_URL` — your project URL.
   - `SUPABASE_SERVICE_ROLE_KEY` — **server-only** secret (the service_role
     key, never the anon key). All data access happens on the server, so
     this key never reaches the browser.
   - `SUPABASE_STORAGE_BUCKET` — optional, defaults to `uploads`.
   - `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `SESSION_SECRET` — admin login +
     cookie signing.
   - `NEXT_PUBLIC_SITE_URL` — your production URL (for Open Graph).
4. **Deploy.** After the build, open `/admin`, log in, and replace the
   demo content.

## Notes & tradeoffs

- **Vercel is stateless**, so the database lives in Supabase Postgres and
  image uploads go to Supabase Storage — nothing is written to the local
  filesystem. (On the old SQLite/Render setup, uploaded images on the
  ephemeral FS were lost on redeploy; that problem is gone here.)
- **Save = publish.** Edits write straight to Supabase on Save, so the
  public site is always in sync. If you want a draft/publish split, add a
  `published` column and gate the public queries on it.
- Supabase access uses the **service_role** key server-side, which bypasses
  Row Level Security. That's fine here because every query is run on the
  server (route handlers + server components); the browser only ever talks
  to your Next.js API.
- The hero's rotating word box and the About `[[highlight]]` markup are
  the only "mini-syntaxes" — both are explained inline in the admin.

