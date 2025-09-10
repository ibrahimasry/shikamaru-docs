# shikamaru CLI — Documentation Website (Gatsby)

This repository contains the documentation website for the shikamaru CLI: multi-repo dev environments with env management, port allocation, Docker/Hybrid orchestration, and web logs.

- Live site: [shikamaru CLI Docs](https://shikamaru.ibrahimasry.com)
- Tech: Gatsby 5, React 18, MDX v2, Tailwind CSS, Prism, remark-gfm

## Prerequisites

- Node 18+ (LTS)
- npm (v10+) or yarn

## Quick Start (Development)

```bash
npm install
npm run develop
# open http://localhost:8000
```

## Production Build & Preview

```bash
npm run build
npm run serve
# open http://localhost:9000
```

Or one-shot:

```bash
npm run start:prod
```

## Writing Docs (MDX)

- Location: place docs under `src/docs/` as `.mdx` files. Nested folders are supported.
- Routing: each doc is available at `/docs/<slug>`. Slugs are derived from file/folder names or can be set explicitly via frontmatter.
- Frontmatter (optional):

```mdx
---
title: Getting Started
slug: getting-started
order: 1
---

# Welcome

Your content here...
```

- Features: GitHub-flavored Markdown (tables, task lists), smart punctuation, and autolinked headings are enabled. Use fenced code blocks (e.g., `ts, `bash) for syntax highlighting.

## Sidebar Navigation

The left sidebar is defined in `src/components/docsNav.ts`. Add, remove, or reorder items there to control the visible navigation. Frontmatter `order` is available for future use but the sidebar list is the source of truth.

## Site Structure

- `src/templates/DocPage.tsx`: template used to render individual docs.
- `src/components/DocsLayout.tsx`: docs layout, header/sidebar, content area.
- `src/components/SEO.tsx`: per-page SEO tags via `react-helmet`.
- `src/pages/`: landing and 404 pages.

## Configuration

- `gatsby-config.ts` contains site metadata and plugin configuration. Update `siteUrl`, `title`, and `description` as needed.
- Tailwind/PostCSS: configured via `tailwind.config.cjs` and `postcss.config.cjs`.
- Sitemap is generated via `gatsby-plugin-sitemap` during build.
- Optional: Replace `static/icon.png` (512×512) and enable `gatsby-plugin-manifest` if you want PWA metadata.

## Static Assets

- Put public assets in `static/` (they will be served at the site root). Example: `static/0.png` is available at `/0.png`.
- Do not edit `public/` (it is the build output and will be overwritten).

## Scripts

From `package.json`:

```bash
npm run develop  # Gatsby dev server
npm run build    # Build to ./public
npm run serve    # Serve the production build locally
npm run clean    # Clear Gatsby cache and public output
npm run format   # Prettier formatting
```
