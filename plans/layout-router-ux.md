# Improve Dashboard Layout UX and Replace Link Navigation

## Preflight

IMPECCABLE_PREFLIGHT: context=pass product=pass command_reference=pass shape=not_required image_gate=skipped:target is existing dashboard UX/layout and router cleanup, no new visual mock requested mutation=open

## Goal

Improve dashboard layout so it feels better to use and view, while keeping the quiet product direction from `PRODUCT.md` and `DESIGN.md`.

Also replace remaining TanStack `<Link to>` and anchor-like navigation usage in app UI with programmatic navigation via TanStack Router hooks (`useNavigate` / router state), where appropriate.

## Context

Current dashboard works, but UX can be smoother:

- Sidebar takes a large fixed width and the main content sits inside a visually busy frame.
- Page hero pattern still feels a bit like marketing chrome for operational screens.
- Navigation uses `<Link to>` in layout and feature pages.
- CTA links visually duplicate button behavior instead of using shadcn `Button` + router navigation.

Target direction:

- Product dashboard, not marketing page.
- More usable, calm, balanced layout.
- shadcn/Radix primitives remain source of truth.
- Theme variables only, light/dark preserved.
- No decorative glass, loud shadows, gradient text, or side-stripe borders.

## Files to Modify

Primary:

- `frontend/src/components/layout/DashboardLayout.tsx`
- `frontend/src/components/layout/PageShell.tsx`
- `frontend/src/features/overview/OverviewPage.tsx`
- `frontend/src/features/accounts/AccountsPage.tsx`

Possible if grep finds more navigation links:

- `frontend/src/features/**/*.tsx`
- `frontend/src/routes/**/*.tsx`

## Reuse

- TanStack Router hooks: `useNavigate`, `useRouterState`.
- shadcn `Button`, `Badge`, `Card`, existing primitives.
- Existing theme CSS variables and dashboard utility classes.
- Existing route paths: `/`, `/accounts`, `/accounts/add`, `/api-keys`, `/config`.

## Layout Decisions

1. App shell should feel like an operator console:
   - slimmer sidebar
   - clearer top section
   - less oversized title chrome
   - more usable main content width and spacing

2. Navigation should use programmatic route changes:
   - replace `<Link to>` in app UI with `<button>` or shadcn `Button` plus `navigate({ to })`
   - keep route state from `useRouterState` for active styles
   - keep keyboard accessible button semantics

3. CTAs should be real shadcn buttons:
   - Add Account buttons become `Button` with `onClick={() => navigate({ to: '/accounts/add' })}`
   - no link-styled CTA classes duplicated across pages

4. Keep operational readability:
   - page shell smaller and tighter
   - panels and filters remain dense but humane
   - no decorative layout effects

## Steps

1. [ ] Refactor `DashboardLayout.tsx` navigation.
   - Replace imported `Link` with `useNavigate`.
   - Render nav items as accessible buttons.
   - Preserve active state via `useRouterState`.
   - Keep mobile nav close-on-select behavior.
   - Make sidebar slimmer and quieter.

2. [ ] Refine app layout spacing.
   - Reduce sidebar width modestly.
   - Make main content padding more balanced.
   - Avoid a marketing-like hero frame feeling.

3. [ ] Refactor page CTAs away from `<Link to>`.
   - `OverviewPage.tsx`: Add Account CTA uses shadcn `Button` + `useNavigate`.
   - `AccountsPage.tsx`: Add Account CTA and empty state CTA use shadcn `Button` + `useNavigate`.

4. [ ] Check for remaining `<Link to>` / `href` app navigation.
   - Keep true external links if any.
   - Replace internal navigation links with router hook/button pattern.

5. [ ] Verify.
   - Run `cd frontend && bun run typecheck`.
   - Run `cd frontend && bun run lint`.
   - Run `cd frontend && bun run test`.

## Verification Checklist

- [ ] UI reads as product dashboard, not marketing/hero page.
- [ ] Layout feels calmer and easier to scan.
- [ ] Internal navigation no longer uses `<Link to>` in app UI.
- [ ] CTAs use shadcn Button primitives.
- [ ] Accent color remains sparse and meaningful.
- [ ] Static surfaces use borders/tonal layers before shadows.
- [ ] Focus states remain visible.
- [ ] Light and dark modes use theme variables and remain readable.
- [ ] Existing routes compile.
