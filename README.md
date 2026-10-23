# MARGIN — The Dreamer's Archive

A Next.js App Router foundation for a cosmic-lofi digital library. It includes the responsive visual shell, mood-filter and motion-preview components, a PDF.js reader shell with a Social Margin sidebar, Prisma schema, Supabase session helpers, and a protected signed-URL endpoint for private PDFs.

> **Honest implementation status:** the landing page and discover route are runnable UI. The reusable mood and trailer components are implemented. The PDF reader loads a signed URL and renders PDF pages when the environment and storage are configured. The annotation form currently adds a local preview only; it does not persist or publish notes. Full sign-up/login UI, admin uploads, quest writes, live catalog queries, and community moderation are next-phase work, not represented as completed features.

## Stack
- Next.js App Router + TypeScript + React
- Tailwind CSS v3 theme tokens + Motion for React
- PostgreSQL + Prisma
- Supabase Auth (`@supabase/ssr`)
- S3-compatible private object storage + short-lived signed URLs
- PDF.js

## Requirements
- Node.js 20.9+
- PostgreSQL database
- Supabase project for authentication
- S3-compatible bucket for PDFs (or adapt `src/lib/storage/s3.ts` to Supabase Storage)

## Local setup

```bash
npm install
cp .env.example .env.local
# Fill in DATABASE_URL, DIRECT_URL, Supabase and S3 values
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Open http://localhost:3000. The home page can render without the external services configured, but auth, database and PDF access require valid environment variables and records.

## Database notes
- Supabase Auth owns passwords and identity; never add a plaintext password column.
- `User.authUserId` maps the Supabase auth UUID to the application profile.
- Create a `User` row after a verified auth signup (via a trusted server-side workflow or Supabase database trigger). Do not trust a client-provided auth ID.
- `Book.visibility` distinguishes public-domain, licensed and private material. Store license metadata for public files. The private PDF endpoint checks the signed-in identity against `Book.ownerId`.
- Public annotations should be returned only where `visibility = PUBLIC`; a note's owner should be able to see their own private annotations.
- Use an upload endpoint with server-side MIME sniffing, file-size limits, PDF signature validation, malware scanning where feasible, and an allowlist of authorized admins/owners. Do not allow arbitrary clients to choose storage keys.

## Important production hardening
1. The `pdf-url` endpoint issues five-minute signed URLs. Signed URLs are bearer tokens until they expire; avoid logging them and do not cache them publicly.
2. Configure the object store CORS policy for your app domain and allow range requests. Confirm the provider's signed URL supports HTTP Range requests for PDF.js.
3. Use a separate migration/direct database URL if required by your provider; use pooled connections at runtime when appropriate.
4. Add rate limiting to auth-sensitive, annotation and search endpoints; validate all input with Zod.
5. Enforce permissions in every server-side data-access operation. Prisma queries do not automatically inherit Supabase RLS policies.
6. Add CSRF/origin protections where applicable, CSP and security headers, audit logs for admin actions, backups, and retention policies.
7. Seed only books you are licensed to distribute or works in the public domain in your jurisdiction.
8. Add tests for private-file denial, annotation privacy, book deletion cascades, and progress updates before deployment.

## Folder architecture

```text
src/
  app/
    (library)/discover/page.tsx      # Discovery route
    api/books/[bookId]/pdf-url/route.ts # Authorization + signed URL
    globals.css
    layout.tsx
    page.tsx                         # Cosmic landing page
  components/
    moods/mood-filter.tsx            # Accessible mood filter
    previews/bite-sized-preview.tsx  # Animated preview carousel
    reader/social-margin-reader.tsx  # PDF canvas + annotation sidebar
    ui/                               # Shared buttons, inputs, dialogs
  hooks/                              # Reader and UI hooks as they are extracted
  lib/
    auth/supabase-server.ts           # Server-side auth client
    db/prisma.ts                      # Prisma singleton
    storage/s3.ts                     # Signed URL service
    validation/annotation.ts          # Zod validation schema
    utils.ts
prisma/schema.prisma
public/pdf.worker.min.mjs             # Copied by postinstall
scripts/copy-pdf-worker.mjs
middleware.ts
```

## Suggested implementation roadmap
1. **Foundation:** env validation, Prisma migration, seed genres/moods and one public-domain book with a verified PDF.
2. **Identity:** signup, email verification, login, logout, password recovery, profile creation and account deletion.
3. **Catalog:** Prisma-backed search, filters, pagination, book detail route and licensed/public-domain labels.
4. **Reader:** refresh signed URL before expiry, persist progress, add bookmarks and keyboard navigation, improve text-layer support.
5. **Social Margin:** authenticated POST endpoint, public/private visibility, moderation/reporting, pagination and spoiler-safe thread rules.
6. **Constellations and quests:** derive progress from server records; make quest updates idempotent and avoid client-trusted reward totals.
7. **Admin:** role-based access, validated upload pipeline, metadata editor and audit trail.
8. **Quality:** Vitest, Playwright, accessibility checks, performance profiling and dependency/security review.
9. **Deploy:** provision managed PostgreSQL and private object storage; set production secrets; run `prisma migrate deploy`; configure domains, auth redirects, CORS, CSP and monitoring.

## Commands

```bash
npm run dev
npm run typecheck
npm test
npm run db:generate
npm run db:migrate
npm run db:deploy
```
