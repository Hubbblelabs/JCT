# 🚀 Copilot Instructions for JCT (Enhanced with Modular Structure)

## 🧠 Project Overview

This repository is a **marketing, institution, and admissions website for JCT Institutions** built with:

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion

The codebase is **content-heavy and design-led**, focused on **high-conversion admissions UX**.

This is a **modern redesign** of:

- https://jct.ac.in
- https://jct.ac.in/engineering
- https://jct.ac.in/cas
- https://jct.ac.in/polytechnic

These sites are the **primary source of truth**.

---

# 📦 0. Core Rule — Modular Architecture (STRICT)

🚫 **DO NOT build large pages in a single file**

✅ ALWAYS follow a **modular, scalable structure**

### 🔥 Golden Rule:

> If a file exceeds ~more lines or has multiple responsibilities → **Split it into smaller components** and organize by feature.

---

## 🧩 Module-Based Structure

### 📁 Page Level (Routing Layer)

```
src/app/*
```

- Keep **VERY THIN**
- Only:
  - Metadata
  - Route params
  - Import + render module

```tsx
// ❌ Bad
export default function Page() {
  return <HugePageWithEverything />;
}

// ✅ Good
import { EngineeringPage } from "@/modules/engineering";

export default function Page() {
  return <EngineeringPage />;
}
```

---

### 📁 Modules (Feature-Based Pages)

```
src/modules/<feature>/
```

Each major page must be split into:

```
modules/
  engineering/
    EngineeringPage.tsx
    sections/
      Hero.tsx
      Programs.tsx
      Departments.tsx
      Facilities.tsx
      Placements.tsx
      CTA.tsx
```

👉 Each section = separate component
👉 No huge monolithic files

---

### 📁 Components

#### Layout Components

```
src/components/layout/*
```

- Navbar
- Footer
- Section wrappers
- Containers

#### UI Components

```
src/components/ui/*
```

- Button
- Card
- Badge
- Tabs
- Modal

👉 Must be reusable, generic, and clean

---

### 📁 Data Layer (VERY IMPORTANT)

```
src/data/*
```

- Store ALL content here
- Never hardcode in components

Example:

```ts
export const engineeringPrograms = [
  {
    name: "Computer Science Engineering",
    duration: "4 Years",
  },
];
```

---

### 📁 Types

```
src/types/*
```

- Define shared interfaces

```ts
export interface Program {
  name: string;
  duration: string;
}
```

---

## 🧠 Separation of Concerns

| Layer      | Responsibility   |
| ---------- | ---------------- |
| app        | Routing only     |
| modules    | Page composition |
| components | Reusable UI      |
| data       | Content          |
| types      | Contracts        |

---

# 📚 Content Sourcing Guidelines

- Always refer:
  - https://jct.ac.in
  - https://jct.ac.in/engineering
  - https://jct.ac.in/cas
  - https://jct.ac.in/polytechnic

### Rules:

- This is a **redesign, not rewrite**
- Extract:
  - Programs
  - Departments
  - Admissions
  - Facilities
  - Placements
  - Contact info

### ❌ Avoid:

- Fake content
- Random placeholders (unless necessary)

### ✅ Improve:

- Grammar
- Structure
- SEO hierarchy

---

# ⚙️ Coding Conventions

- Use **strict TypeScript**
- Use `@/` imports
- Prefer **Server Components**
- Use `"use client"` only when needed

### Reuse:

- `cn()` utility
- Existing UI components
- Shared layouts

---

# 🎨 Styling & UX

- Tailwind-first approach

Maintain design system:

- Dark blue + yellow theme
- Serif headings
- Clean spacing
- Strong CTA focus

### UX Rules:

- Always guide user → **Apply Now**

Maintain:

- Sticky navbar
- WhatsApp CTA
- Admission funnel

---

# ⚡ Component Design Rules

## 🧩 Section Components

Each section must:

- Be **self-contained**
- Accept props
- Avoid internal hardcoding

```tsx
type Props = {
  title: string;
  items: Program[];
};
```

---

## 🔁 Reusability Rule

Before creating new component:

1. Check `components/ui`
2. Check `components/layout`
3. Reuse → don’t duplicate

---

## 🧱 Composition Pattern

```tsx
export function EngineeringPage() {
  return (
    <>
      <Hero />
      <Programs />
      <Departments />
      <Placements />
      <CTA />
    </>
  );
}
```

---

# 📱 Responsive Rules

- Mobile-first
- Stack sections
- Full-width buttons
- Sticky bottom CTA

---

# 🔐 Accessibility

- Contrast ≥ 4.5:1
- Focus states
- Button height ≥ 44px

---

# 🚀 Performance

- Use WebP images
- Lazy load sections
- Avoid heavy animations

---

# 🧪 Workflow

- Package manager: `pnpm`

### Commands:

- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm format`

---

# 💡 Final Development Philosophy

### ✅ Build like:

- Scalable SaaS frontend
- Modular design system
- High-performance landing page

### ❌ Avoid:

- Single-file pages
- Hardcoded content
- Repeated UI blocks

---

# 🎯 Final Goal

The system should be:

- Modular
- Maintainable
- Scalable
- SEO-optimized
- Conversion-focused
