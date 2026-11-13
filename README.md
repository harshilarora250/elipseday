# Minimal Monochrome Portfolio

A single-page, monochrome portfolio built with Next.js and static local content. The visual system and brand colors are documented in [`design.md`](design.md).

## Edit the portfolio

Update the copy, projects, milestones, and links in [`src/lib/portfolio.ts`](src/lib/portfolio.ts), then commit and push the changes. The site has no admin portal, API backend, database, or image upload service.

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Build and deploy

```bash
npm run build
```

Next.js exports a static site to `out/`. Deploy that directory to a static host such as Vercel or GitHub Pages.

The portfolio starts with generic placeholder copy, example social and project URLs, and a sample email address. Replace these values in `src/lib/portfolio.ts` before publishing.
