# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server with Turbopack
pnpm build        # Production build (standalone output)
pnpm start        # Start production server
pnpm lint         # Run ESLint with auto-fix
pnpm format       # Run Prettier on all files
```

No test suite is configured.

## Architecture

This is a **Next.js 16 App Router** marketing site for JCT's three colleges (Engineering, Arts & Science, Polytechnic). The stack is React 19, TypeScript (strict), Tailwind CSS v4, and Framer Motion.

### Routing & Page Structure

Pages live in `src/app/` under `/institutions/engineering`, `/institutions/arts-science`, and `/institutions/polytechnic`. Each page file is intentionally thin — it only imports and renders module components. All page composition logic lives in `src/modules/<institution>/`.

### Component Layers

| Layer | Location | Purpose |
|---|---|---|
| Pages | `src/app/` | Thin wrappers — import and render modules only |
| Modules | `src/modules/<feature>/` | Feature sections (Hero, Programs, CampusLife, etc.) |
| Layout | `src/components/layout/` | Navbar, Footer, sticky buttons, chatbot |
| UI | `src/components/ui/` | Generic reusable primitives (Button, DragScroll, etc.) |
| Data | `src/data/` | All hardcoded content — site config, institution data, nav |
| Contexts | `src/contexts/` | `InstitutionContext` for multi-college state |

### Multi-Institution Theming

`InstitutionContext` detects the current institution from `window.location.pathname` and exposes it via `useInstitution()`. Components conditionally apply institution accent colors:

- Engineering: Gold `#d4a024`
- Arts & Science: Burgundy `#780e42`
- Polytechnic: Slate `#3a4354`

The context persists to `sessionStorage` across navigations.

### Styling

Tailwind CSS v4 with custom design tokens defined as CSS variables in `src/styles/globals.css`. Use the `cn()` utility from `src/lib/` for all conditional class merging. Prettier auto-sorts Tailwind classes via `prettier-plugin-tailwindcss` — run `pnpm format` after editing class lists.

Established utility classes: `.glass-panel`, `.gradient-text`, `.card-hover-lift`, `.section-padding`.

### Server vs Client Components

Default to Server Components. Add `"use client"` only for:
- Components using hooks or browser APIs (Navbar, Footer, InstitutionContext consumers)
- Framer Motion animations (scroll-triggered parallax, entrance effects)
- Interactive UI (menus, forms)

### Data Layer

All content is hardcoded in `src/data/`:
- `site.ts` — global config (contact, address, social links, stats)
- `engineering.ts`, `arts-science.tsx`, `polytechnic.tsx` — institution content
- `*-departments.ts` — department-specific data
- `all-navigations.ts` — navigation structure for all institutions

### Path Aliases

`@/*` maps to `./src/*` — use this for all imports.

### Image Optimization

Use `next/image` for all images. Remote images are allowed from `companieslogo.com`, `upload.wikimedia.org`, `images.unsplash.com`, and `i.pravatar.cc`. Local assets live in `public/` and should use `.webp` format.

### Fonts

Playfair Display (serif, headings) and Inter (sans-serif, body) are loaded via `next/font` in `src/app/layout.tsx` and applied as CSS variables.
