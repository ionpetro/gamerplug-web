# AGENTS.md

## Cursor Cloud specific instructions

### Overview

GamerPlug is a Next.js 15 gaming social platform (single app, no monorepo). All data comes from a remote Supabase instance — there is no local database or Docker setup.

### Running the app

- **Dev server:** `npm run dev` (runs on port 3000 with Turbopack)
- **Build:** `npm run build`
- **Lint:** `npm run lint`
- **No test suite** — there are no automated tests configured in this repo.

### Environment variables

A `.env.local` file is needed with at minimum:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Without real Supabase credentials, pages that query the database will show empty states but the app still starts and renders static pages (homepage, blog, team, contact, etc.) correctly.

### Gotchas

- **Dual lockfiles:** Both `package-lock.json` (npm) and `pnpm-lock.yaml` (pnpm) exist. Always use **npm** as the package manager — `next lint` auto-detects pnpm from the lockfile and will corrupt `node_modules` if it tries to install ESLint deps via pnpm. The `eslint.config.mjs` and ESLint devDependencies are already committed to avoid this.
- **ESLint config:** Uses ESLint v9 flat config (`eslint.config.mjs`). The `@typescript-eslint/no-explicit-any` and `react/no-unescaped-entities` rules are set to `warn` (not `error`) because the existing codebase has many pre-existing violations. This allows `npm run build` to succeed.
- **Locale middleware:** All non-API/auth routes redirect to `/{locale}/...` (e.g., `/en/`). The root `/` returns a 307 redirect to `/en/`.
