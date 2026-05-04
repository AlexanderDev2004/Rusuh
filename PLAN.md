# Frontend Routing, Feature Pages, and Pre-commit Hook Cleanup Plan

## Context

The frontend currently keeps all TanStack route definitions in a single `frontend/src/routes.tsx` file and page components under `frontend/src/ui/pages`. The requested cleanup is to mirror a more organized structure like DualCam Studio: persist routes in a dedicated `src/routes/` folder, move page-level feature code into `src/features/`, and remove page ownership from the generic `ui` area. A Husky pre-commit hook should also be added so checks run before commits.

## Current findings

- `frontend/src/routes.tsx` defines the root route and all child routes inline.
- `frontend/src/main.tsx` imports `router` from `./routes`; once `frontend/src/routes/index.tsx` exists, this import can stay as `./routes` because TypeScript/Vite can resolve the folder index.
- `frontend/src/ui/root-route.tsx` owns the root route component and wraps pages with `ManagementAuthGate` and `DashboardLayout`.
- Page files currently live in `frontend/src/ui/pages/`:
  - `overview-page.tsx`
  - `accounts-page.tsx`
  - `add-account-page.tsx`
  - `api-keys-page.tsx`
  - `config-page.tsx`
  - associated `.type.ts`, OAuth helper, and tests
- Existing page files already use the `@/*` alias for many component imports, but still use relative imports for `lib` and shared `ui`; moving them to `features` should convert those to stable alias imports where useful.
- Generic/reusable UI files currently live in `frontend/src/ui/` and should remain there:
  - `dashboard-layout.tsx`
  - `page-shell.tsx`
  - `query-state.tsx`
  - `status-tone.ts`
  - `ui-tokens.ts`
- Package manager appears to be Bun (`frontend/bun.lock`, scripts use `bun run ...`).
- No existing Husky setup was found.

## Approach

Refactor by moving routing into a `frontend/src/routes/` directory and feature pages into grouped folders under `frontend/src/features/`, while keeping shared layout and reusable UI primitives in `frontend/src/ui/` and `frontend/src/components/ui/`. Preserve current route paths and behavior.

Use the DualCam Studio convention as inspiration:

- route files live under `src/routes/`, with an `index.tsx` route for `/` and separated files/folders for other paths;
- feature implementation lives under `src/features/<feature-name>/` and routes import feature components from there.

Because this app currently uses code-based TanStack routes (`createRootRoute`, `createRoute`, `createRouter`) rather than generated file routes, the implementation should keep the current code-based router unless a broader migration is explicitly requested. The cleanup goal is folder separation and import clarity, not route behavior changes.

Add Husky as frontend tooling and configure pre-commit to explicitly run `oxfmt`, `oxlint`, and `tsc` via the existing scripts.

## Files to modify

Likely changes:

- `frontend/src/routes.tsx` -> remove in favor of `frontend/src/routes/index.tsx`, or keep only temporarily as a compatibility shim if needed.
- `frontend/src/routes/index.tsx` — new central router composition file that exports `router`.
- `frontend/src/routes/root-route.tsx` — root route component/definition extracted from `ui`.
- `frontend/src/routes/overview-route.tsx`, `accounts-route.tsx`, `add-account-route.tsx`, `api-keys-route.tsx`, `config-route.tsx` — separated child route definitions, or an equivalent concise routes-folder split.
- `frontend/src/main.tsx` — update router import if needed.
- `frontend/src/ui/root-route.tsx` — likely move to routes or keep as reusable root layout component.
- `frontend/src/ui/pages/*` — move page code into `frontend/src/features/*`.
- Imports inside moved page files — update relative paths to shared UI/lib/components.
- `frontend/package.json` — add Husky scripts/dev dependency.
- `frontend/bun.lock` — update after adding Husky.
- repo-root `.husky/pre-commit` — add pre-commit command that enters `frontend/` and runs format check, lint, and typecheck.

## Reuse

- Reuse existing TanStack React Router setup from `frontend/src/routes.tsx`.
- Reuse existing `RootRouteComponent` behavior from `frontend/src/ui/root-route.tsx`.
- Reuse existing frontend scripts from `frontend/package.json`:
  - `bun run format:check` (`oxfmt --config .oxfmt.json --check .`)
  - `bun run lint` (`oxlint .`)
  - `bun run typecheck` (`tsc -b`)
- Reuse shared UI utilities after page moves:
  - `frontend/src/ui/page-shell.tsx`
  - `frontend/src/ui/query-state.tsx`
  - `frontend/src/ui/ui-tokens.ts`
  - `frontend/src/components/ui/*`
  - `frontend/src/lib/*`

## Steps

- [x] Decide the Husky pre-commit command: it must run `oxfmt`, `oxlint`, and `tsc`.
- [ ] Decide whether to keep a `frontend/src/routes.tsx` compatibility shim or fully remove it.
- [ ] Create `frontend/src/routes/` and split the route tree out of the single `routes.tsx` file.
- [ ] Move page-level files from `frontend/src/ui/pages/` into grouped `frontend/src/features/<feature-name>/` folders.
- [ ] Update moved page imports, preferably replacing fragile relative imports like `../../lib/...` and `../page-shell` with alias imports like `@/lib/...` and `@/ui/page-shell`.
- [ ] Keep route paths unchanged: `/`, `/accounts`, `/accounts/add`, `/api-keys`, `/config`.
- [ ] Add Husky to frontend tooling (`devDependencies` plus `prepare` script if using standard Husky install flow).
- [ ] Add a repo-root pre-commit hook that runs:
  - `cd frontend`
  - `bun run format:check`
  - `bun run lint`
  - `bun run typecheck`
- [ ] Run verification and fix type/lint/format issues.

## Verification

- [ ] From `frontend/`, run `bun run typecheck`.
- [ ] From `frontend/`, run `bun run lint`.
- [ ] From `frontend/`, run `bun run format:check`.
- [ ] From `frontend/`, run `bun run check` as an aggregate verification after the explicit checks pass.
- [ ] Start the app with `bun run dev` and manually verify all existing routes still render.
- [ ] Make a test commit or run the hook directly to confirm Husky pre-commit executes.

## Open questions

1. Should `frontend/src/routes.tsx` be deleted entirely, or kept as a compatibility re-export that imports from `frontend/src/routes/index.tsx`?
2. For the feature grouping, is this mapping OK?
   - `features/overview/overview-page.tsx`
   - `features/accounts/accounts-page.tsx`
   - `features/accounts/add-account-page.tsx`
   - `features/api-keys/api-keys-page.tsx`
   - `features/config/config-page.tsx`
3. Should pre-commit use the existing script names (`bun run format:check && bun run lint && bun run typecheck`) or call the binaries directly (`bunx oxfmt ... && bunx oxlint . && bunx tsc -b`)?
