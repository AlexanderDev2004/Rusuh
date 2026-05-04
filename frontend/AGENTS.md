# Frontend Agent Guide

React/Vite dashboard for Rusuh management APIs. Uses Bun, TanStack Router/Query/Form, shadcn/Radix primitives, Tailwind CSS v4, Oxc tooling, Vitest.

## Commands

Run from `frontend/` unless noted.

```bash
bun install                 # install deps
bun run dev                 # Vite dev server
bun run build               # typecheck + production build
bun run preview             # preview built app
bun run typecheck           # tsc -b
bun run lint                # oxlint .
bun run lint:fix            # oxlint . --fix
bun run format              # oxfmt --config .oxfmt.json .
bun run format:check        # oxfmt --config .oxfmt.json --check .
bun run check               # typecheck + lint + format:check
bun run test                # vitest run tests
bun vitest run tests/path.test.ts       # single test file
bun vitest run -t 'test name' tests     # single/named test
```

Pre-commit hook runs format check, lint, and typecheck.

## Project Layout

```text
src/
├── apis/          # HTTP clients, DTOs, TanStack Query hooks
├── app/           # app-level stores/client setup
├── components/    # reusable layout/shared/ui primitives
├── features/      # page-level feature implementations
├── routes/        # TanStack Router route definitions
├── index.css      # theme tokens, Tailwind v4, motion
└── main.tsx       # app bootstrap

tests/             # Vitest tests mirroring feature/api areas
```

- Route files only compose route objects and import feature pages.
- Feature folders own page UI, local components, hooks, libs, and types.
- API folders own request/response types and network/query functions.
- Shared UI primitives live in `src/components/ui` and are shadcn/Radix-based.

## Imports

- Prefer `@/` imports for cross-folder imports.
- Use relative imports only inside the same feature/module folder.
- Import order: external packages, then `@/` imports, then relative imports/types.
- Keep type-only imports as `import type`.
- Do not add barrel re-exports for convenience.

## TypeScript / React

- Strict TypeScript. Avoid `any`; model API data with explicit types.
- Prefer discriminated/string literal unions for UI modes/statuses.
- Keep page components small enough to scan; extract local components when sections grow.
- Use TanStack Query for server state and Zustand only for app/client state.
- Use TanStack Router hooks (`useNavigate`, `useRouterState`) for internal navigation.
- Do not use internal `<Link to>`/`href` for app navigation unless explicitly requested.
- Do not test what the type system already guarantees.

## API / Data

- Put raw fetch wrappers under `src/apis/**/api.ts`.
- Put TanStack Query hooks/query keys under `src/apis/**/queries.ts` where shared.
- Keep auth/management concerns in `src/apis/auth/**` and `src/features/auth/**`.
- Surface mutation success/failure with toast for create, update, delete, clear, import, upload.
- Destructive mutations need confirmation via shadcn `AlertDialog`.

## UI / Design

Follow `../PRODUCT.md`, `../DESIGN.md`, and `../.impeccable/design.json`.

- Product register: quiet control room, minimal, precise, neutral.
- Preserve light and dark modes.
- Use existing shadcn/Radix primitives; do not replace root primitives.
- Use CSS variables/theme tokens from `src/index.css`.
- Prefer tonal surfaces and borders over heavy shadows.
- Avoid hardcoded light/dark utility pairs when theme tokens can express intent.
- Avoid glassmorphism, loud gradients, gradient text, heavy shadows, side-stripe borders.
- Avoid pure `#000`/`#fff` in new theme styles.
- Keep motion subtle, short, and respect `prefers-reduced-motion`.
- Use lucide icons for icon-only actions and include `sr-only` text/title.
- Destructive icon buttons should still have clear accessible labels.

## Components

- shadcn/Radix components in `src/components/ui` should remain generic.
- Feature-specific layout belongs in feature files, not ui primitives.
- Use `cn()` from `@/components/shared/utils` for conditional classes.
- Shared visual helpers belong in `src/components/shared/*`.
- Prefer `Button` variants over hand-rolled clickable divs.
- Dialogs/modals should use existing `Dialog`/`AlertDialog` wrappers.

## Forms / UX

- Label inputs clearly; avoid vague placeholders like `Optional label` without helper text.
- Place copy/reveal actions near secrets and keep secrets masked by default.
- Clipboard actions should toast on success.
- Reset/Clear controls should only appear when they do something.
- Keep filters compact and readable; avoid nested borders unless they clarify grouping.

## Tests

- Tests live under `frontend/tests`.
- Prefer unit tests for pure helpers and API request/response behavior.
- Run a single file with `bun vitest run tests/path.test.ts`.
- Run one named test with `bun vitest run -t 'name' tests`.
- Do not add tests for simple prop/type plumbing.

## Formatting / Linting

- Oxc-native tooling only: oxlint + oxfmt.
- Use `frontend/.oxfmt.json`; do not add ESLint or Prettier.
- Before committing, run `bun run check` and relevant `bun run test`.

## Git

- Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`.
- Split unrelated changes into separate commits.
- Do not include generated/cache/local agent files unless explicitly requested.
