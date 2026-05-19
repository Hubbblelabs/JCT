# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**JCT Institutions** is a Next.js 16 admin + public website for three colleges (Engineering, Arts & Science, Polytechnic) in Coimbatore. The application has two distinct sections:

- **Public Site**: Institution pages, program listings, department info, campus life, research sections
- **Admin Dashboard**: Content management system for managing departments, programs, users, images, testimonials, recruiters, and site configuration

The system uses **MongoDB Atlas** for persistence, **NextAuth.js** for authentication, **Cloudflare R2** for image storage, and **Server-Side Rendering** with caching strategies.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript 6
- **Database**: MongoDB 9.6 (Mongoose)
- **Auth**: NextAuth.js 5.0 (beta) with bcrypt for password hashing
- **Validation**: Zod 4.4
- **UI/Styling**: Tailwind CSS 4.3, Framer Motion, Lucide React, React Icons
- **Image Storage**: AWS S3 API (Cloudflare R2 compatible)
- **Forms**: React Hook Form with Zod schema validation
- **Package Manager**: pnpm 11.1.2

## Development Scripts

```bash
pnpm dev          # Start dev server with Turbopack on http://localhost:3000
pnpm build        # Build for production (standalone output)
pnpm start        # Start production server
pnpm lint --fix   # Run ESLint with auto-fix
pnpm format       # Format code with Prettier
```

## Architecture & Data Flow

### Project Structure

```
src/
├── app/
│   ├── admin/                  # Admin routes (protected + public auth)
│   │   ├── (protected)/        # Route group requiring authentication
│   │   │   ├── dashboard/
│   │   │   ├── departments/    # Department content editor
│   │   │   ├── programs/       # Program CRUD
│   │   │   ├── users/          # User management (super_admin only)
│   │   │   ├── images/         # Image asset library
│   │   │   ├── testimonials/
│   │   │   ├── recruiters/
│   │   │   ├── site-config/    # Site-wide config editor
│   │   │   ├── page-content/   # Hero, announcements, etc.
│   │   │   └── audit/          # Activity log viewer
│   │   ├── login/              # Public login page
│   │   └── layout.tsx          # Wrapper with auth check
│   ├── api/
│   │   ├── auth/[...nextauth]/ # NextAuth handlers
│   │   ├── admin/              # Protected endpoints (GET/POST/PATCH)
│   │   │   ├── departments/
│   │   │   ├── programs/
│   │   │   ├── users/
│   │   │   ├── images/         # Upload & serve
│   │   │   ├── site-config/
│   │   │   └── [other admin routes]
│   │   ├── public/             # Public API (cached, no auth)
│   │   │   ├── programs/
│   │   │   ├── site-config/
│   │   │   └── [other public routes]
│   │   └── chat/               # Meritto chatbot integration
│   ├── institutions/           # Public pages
│   │   ├── engineering/        # Department pages + dynamic course pages
│   │   ├── arts-science/
│   │   └── polytechnic/
│   ├── campus-life/
│   ├── research/
│   └── layout.tsx              # Root layout with InstitutionProvider
├── components/
│   ├── admin/                  # Admin UI components
│   │   ├── PageContentForms.tsx # Hero, announcement, section editors
│   │   ├── DepartmentTabsEditor.tsx # Department content with tabs
│   │   ├── inputs.tsx          # Form field wrappers
│   │   └── [others]
│   ├── layout/                 # Global nav, footer, etc.
│   ├── shared/                 # Reusable UI (cards, modals, etc.)
│   └── ui/                     # Base UI components (buttons, inputs)
├── lib/
│   ├── mongodb.ts              # Mongoose connection with caching
│   ├── api-helpers.ts          # JSON/validation/auth response helpers
│   ├── permissions.ts          # Role-based access control
│   ├── r2.ts                   # Cloudflare R2 (S3) upload/delete/get
│   ├── revalidate.ts           # Next.js ISR cache invalidation
│   ├── audit.ts                # Audit log recording
│   ├── models/                 # Mongoose schemas
│   │   ├── User.ts             # Users with roles & institutions
│   │   ├── Department.ts       # Department pages with draft/published
│   │   ├── Program.ts          # Degree programs
│   │   ├── ImageAsset.ts       # Image metadata + storage location
│   │   ├── SiteConfig.ts       # Global site settings
│   │   ├── Testimonial.ts      # Alumni/student/industry quotes
│   │   ├── Recruiter.ts        # Company logos
│   │   └── AuditLog.ts         # Activity tracking
│   └── validation/             # ~1164 lines of Zod schemas
│       ├── _primitives.ts      # Base validators (email, url, slug, color)
│       ├── hero.ts             # Hero section schemas
│       ├── departments.ts      # Department content with tabs
│       ├── users.ts
│       ├── siteConfig.ts       # Known config keys with validators
│       └── [others]
├── data/
│   ├── site.ts                 # Static site config (name, contact, social, stats)
│   └── chatbot/                # Meritto chatbot data
├── contexts/
│   └── InstitutionContext.tsx   # Tracks current institution (main/eng/arts/poly)
├── styles/
│   └── globals.css             # Tailwind + custom CSS
├── types/
└── auth.ts                     # NextAuth config + callbacks

public/                          # Static assets (logos, favicons)
```

### Key Patterns

#### Authentication & Authorization

- **NextAuth.js Credentials Provider**: Email + password authentication
- **Password Hashing**: bcryptjs (async, cost 12)
- **Session Strategy**: JWT with 24-hour max age
- **Role Hierarchy**: `viewer` (0) → `editor` (1) → `admin` (2) → `super_admin` (3)
- **Scope Enforcement**: 
  - **super_admin**: All users, can manage all users
  - **admin**: Can publish, access all departments
  - **editor**: Can edit only assigned institution/departments
  - **viewer**: Read-only access
- **Protected Routes**: Layout redirects to `/admin/login` if `!session.user`

#### API Design

- All admin endpoints require role authorization via `requireRole(req, "editor")`
- Public endpoints (no auth) are cached with `revalidate = 3600` (1 hour)
- Validation: `validateBody(req, ZodSchema)` returns `{ ok, data | response }`
- Error responses: `badRequest(msg, 400)`, `validationError(zodIssues, 422)`, `forbidden()`, `unauthorized()`, `serverError()`
- Audit logging: `logAudit(entityType, action, email, summary)` (non-fatal)

#### Database & Caching

- MongoDB connection: Cached globally via `mongoose.connection.readyState` check with 10s timeout
- Mongoose models: Singleton pattern (`mongoose.models.X ?? mongoose.model()`)
- Public API routes: `revalidate = 3600` for 1-hour ISR caching
- Manual cache invalidation: `revalidateTargets()` and `revalidateForConfigKey()` in `src/lib/revalidate.ts`
  - When a site config key changes, automatically invalidates relevant public pages
  - Department/program updates trigger revalidation of institution pages

#### Content Management

- **Draft/Publish Model**: Departments and SiteConfig use `status: "draft" | "published"` with separate `content` and `published_content` fields
- **Versioning**: All content entities have `version` field for tracking changes
- **Department Tabs**: Departments store content as JSON object with tab structure (can have multiple tabs per department)
- **Image Upload**: 
  - Images stored in Cloudflare R2 via AWS SDK
  - Metadata (url, alt_text, category, institution) stored in MongoDB
  - Categories: department, faculty, hero, campus, program, recruiter, testimonial, other
  - Fallback to `/api/public/images/[...path]` if R2 not configured
- **Institution Filtering**: Programs, testimonials, recruiters all support institution filtering

#### Frontend State & Rendering

- **InstitutionContext**: React context tracking which institution section user is viewing (main/engineering/arts-science/polytechnic)
  - Synced to sessionStorage for persistence across navigations
  - Auto-detects from pathname
- **Server Components by Default**: Admin pages are server components with session checks
- **Client Components**: Only where needed (forms, interactive UI, client-side hooks)
- **Image Optimization**: Next.js `next/image` with remote patterns configured for external sources (unsplash, pravatar, wikimedia, companieslogo)

### Database Schema Notes

- **User**: Unique email index, stores role + institution + department access list
- **Department**: Unique slug, indexes on college + status, published_content is snapshot at publish time
- **Program**: Unique slug, indexes on institution + is_active
- **ImageAsset**: Unique storage_key, indexes on category + institution
- **SiteConfig**: Unique config_key (global site settings, stored as documents, not key-value)
- **AuditLog**: No unique constraints, indexes on entity_type + created_at for efficient querying

## Environment Configuration

Required environment variables (see `.env.example`):

```
MONGODB_URI              # MongoDB Atlas connection string
NEXTAUTH_SECRET          # 32-char random secret for JWT (openssl rand -base64 32)
NEXTAUTH_URL             # http://localhost:3000 (dev) or https://jct.ac.in (prod)

# Optional (images fallback to local if not set)
R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET_NAME
NEXT_PUBLIC_R2_PUBLIC_URL
```

## Validation & Forms

Zod schemas define all entity shapes. Key locations:

- `src/lib/validation/index.ts`: Barrel export of all schemas + LIMITS constants
- Every schema has associated `LIMITS` object (max string lengths, array sizes, etc.)
- Primitives in `_primitives.ts`: `zEmail`, `zSlug`, `zUrl`, `zClampedString()`, `zPasswordMin8`
- Form validation on admin pages uses React Hook Form + Zod resolver
- API routes validate incoming JSON with `validateBody()` returning structured 422 errors

Example validation error response:
```json
{
  "error": "Validation failed",
  "message": "name: String must contain at least 1 character",
  "details": [
    { "path": ["name"], "message": "...", "code": "too_small" }
  ]
}
```

## Common Development Workflows

### Adding a New Content Type

1. Create MongoDB schema in `src/lib/models/NewType.ts`
2. Export from `src/lib/models/index.ts`
3. Create Zod validators in `src/lib/validation/newtype.ts` with LIMITS
4. Add to barrel export in `src/lib/validation/index.ts`
5. Create API routes: `src/app/api/admin/newtype/route.ts` (GET, POST) and `[id]/route.ts` (PATCH, DELETE)
6. Create admin UI page in `src/app/admin/(protected)/newtype/page.tsx`
7. Add public API at `src/app/api/public/newtype/route.ts` if needed
8. Update revalidation map in `src/lib/revalidate.ts` if ISR caching is needed

### Publishing Draft Content

Department and SiteConfig use publish workflow:

- POST to `/api/admin/departments/[id]/publish` (or similar) to copy `content` → `published_content` and set `status: "published"`
- Published content is what's served to public API / rendered on frontend
- Drafts visible only in admin

### Image Upload Flow

1. Admin selects image via file input
2. Frontend POST to `/api/admin/images/upload` with FormData
3. Backend: Validate mime type/size → Upload to R2 → Create ImageAsset doc → Return URL
4. Admin stores returned URL in content field
5. Public API uses `getImageUrl()` helper to build full CDN URL

### Cache Invalidation

After content changes, call revalidation helpers in API route:

```typescript
import { revalidateTargets, revalidateForConfigKey } from "@/lib/revalidate";

// Invalidate specific institution pages
revalidateTargets("engineering", "arts-science");

// Or, if site config changes
revalidateForConfigKey("engineeringHero");
```

## Code Quality & Conventions

- **ESLint + Prettier**: Config in `eslint.config.mjs` + `.prettierrc`
- **TypeScript Strict Mode**: Enabled, with `noImplicitAny: true`
- **No Unused Variables**: Enforced (except those starting with `_`)
- **Formatting**: Prettier plugin for Tailwind CSS class sorting
- **Logging**: Use `console.log/error` with `[context]` prefix (see `src/auth.ts` for examples)
- **Error Handling**: API routes catch and log errors, return 500 responses. Audit logging is non-fatal.

## Important Notes

- **Mongoose Connection Caching**: Global `_mongooseConn` is cached; connection state checked via `readyState === 1` (ready)
- **Credentials Provider Only**: No OAuth (GitHub, Google, etc.) - only local admin accounts
- **Admin-Only by Default**: All admin routes redirect to login if not authenticated; public routes have no auth
- **Standalone Build**: Next.js configured with `output: "standalone"` for Docker deployments
- **Image CSP**: Strict CSP for images (inline SVG sandboxed, no external script sources)
- **Turbopack**: Dev server uses Turbopack for faster builds (see `package.json` dev script)

## Agent Instructions (from AGENTS.md)

- Prefer local Next.js documentation in `node_modules/next/dist/docs` over training data
- Follow App Router conventions
- Use Server Components by default; only client components when interaction is required
- Prefer async/await data fetching with caching
