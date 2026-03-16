# Copilot Instructions for JCT

## Project overview

This repository is a marketing and admissions website for JCT Institutions built with Next.js App Router, React 19, TypeScript, Tailwind CSS v4, and Framer Motion.

The codebase is content-heavy and design-led.

## Architecture

- Keep route files in `src/app` thin. They should usually export metadata and render a page module or shared layout.
- Put large page implementations in `src/modules/*` when they represent a full institution page such as Engineering, Arts and Science, or Polytechnic.
- Put reusable layout sections in `src/components/layout/*`.
- Put reusable primitives in `src/components/ui/*`.
- Keep institution and department content in `src/data/*` and type it from `src/types/*`.
- Reuse `DepartmentPageLayout` for department detail pages instead of duplicating section markup.

## Coding conventions

- Use TypeScript with strict typing. Prefer explicit types for shared data structures and public component props.
- Use the `@/` path alias for imports from `src`.
- Prefer server components by default. Add `"use client"` only when a component needs hooks, browser APIs, or Framer Motion interactivity.
- Follow the existing functional component style and named exports for shared components.
- Reuse helpers already in the repo, especially `cn` from `src/lib/utils.ts` and existing UI components like `Button` and `DragScroll`.
- When adding new department or program content, update the appropriate `src/data/*` file first and let pages render from data whenever possible.
- Keep metadata accurate for new top-level or detail pages. Use `generateMetadata` and `generateStaticParams` for slug-driven routes when appropriate.

## Styling and UX

- Use Tailwind utility classes first. Only add global CSS when the styling is truly shared across the app.
- Preserve the current visual language: serif headings, sans-serif body text, strong brand color palettes, layered gradients, and motion-rich sections.
- Maintain responsive behavior across mobile, tablet, and desktop. Existing pages are highly visual, so check spacing and overflow carefully.
- Keep navigation and global experience consistent. The sticky navbar, floating WhatsApp CTA, and admissions-focused calls to action are intentional project requirements.
- Use Framer Motion deliberately for reveal, hover, and scroll-based interactions, but do not add animation that fights readability or performance.

## Content expectations

- This is an institution website, so content should sound credible, clear, and admissions-focused.
- Keep accreditation, placement, intake, and contact information consistent with nearby content. If values are uncertain, prefer centralizing them in data rather than scattering literals.
- Favor SEO-friendly structure with descriptive headings, meaningful page titles, and useful metadata.

## Workflow

- Package manager: `pnpm`
- Useful commands:
  - `pnpm dev`
  - `pnpm build`
  - `pnpm lint`
  - `pnpm format`

There is no dedicated test suite yet, so validate changes with linting, build checks, and careful visual review.
