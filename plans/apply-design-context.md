# Apply PRODUCT.md and DESIGN.md to Frontend

## Preflight

IMPECCABLE_PREFLIGHT: context=pass product=pass command_reference=pass shape=not_required image_gate=skipped:no new feature or visual mock requested, applying existing approved PRODUCT.md/DESIGN.md system mutation=open

Additional non-negotiable: always build through existing shadcn/Radix primitives and the project theme system. Every change must preserve both light and dark modes, using CSS variables/theme tokens instead of one-off hardcoded theme styles.

## Context

Rusuh frontend currently has the right product shell, but still leans louder than the newly documented direction:

- Soft purple/pink radial backgrounds across the body.
- Glassy/translucent dashboard surfaces.
- Large ambient shadows on panels, heroes, and primary buttons.
- Page entrance choreography on main layout and page sections.
- Saturated active navigation/button treatment.

`PRODUCT.md` and `DESIGN.md` define the target:

- Register: `product`.
- North Star: **The Quiet Control Room**.
- Users: small team operators managing shared LLM proxy infrastructure.
- Personality: minimal, quiet, precise.
- Visual direction: neutral surfaces first, sparse orchid/violet accents, tonal layering before shadows.
- Accessibility: WCAG AA preferred, visible focus, reduced motion, non-color-only status cues.

## Approach

Apply a restrained design-system pass rather than redesigning every screen individually. Start with global tokens/classes so existing pages inherit the quieter visual language, then touch shared primitives and layout components only where global class changes are not enough.

This keeps the UI familiar while aligning it with the new product/design docs.

Hard requirements:

- Use existing shadcn/Radix primitives for controls and interaction patterns.
- Use the existing theme system and CSS variables for all color/surface changes.
- Preserve both light and dark modes in every touched component.
- No new UI library.
- No compatibility wrappers.
- Avoid decorative glass, loud shadows, page-load choreography.
- Keep reduced-motion support.

## Files to Modify

Primary:

- `frontend/src/index.css`
- `frontend/src/components/shared/ui_tokens.ts`
- `frontend/src/components/ui/Button.tsx`
- `frontend/src/components/ui/Card.tsx`
- `frontend/src/components/ui/Badge.tsx`
- `frontend/src/components/ui/Input.tsx`
- `frontend/src/components/layout/DashboardLayout.tsx`
- `frontend/src/components/layout/PageShell.tsx`

Possible follow-up if needed after global pass:

- `frontend/src/features/overview/OverviewPage.tsx`
- `frontend/src/features/accounts/AccountsPage.tsx`
- `frontend/src/features/api-keys/ApiKeysPage.tsx`
- `frontend/src/features/config/ConfigPage.tsx`
- `frontend/src/features/auth/components/ManagementAuthForm.tsx`

## Reuse

Existing implementation to preserve:

- Theme store in `frontend/src/app/theme.ts`.
- CSS custom properties in `frontend/src/index.css`, including light and dark theme variables.
- shadcn/Radix primitives in `frontend/src/components/ui/*`, always preferred over custom controls.
- Shared utility tokens in `frontend/src/components/shared/ui_tokens.ts`.
- Existing layout shell in `frontend/src/components/layout/DashboardLayout.tsx`.
- Existing page hero abstraction in `frontend/src/components/layout/PageShell.tsx`.
- Existing reduced-motion media query in `frontend/src/index.css`.

## Design Decisions

### Color

Use restrained product color strategy:

- Keep Rusuh identity through orchid primary.
- Reduce pink/violet decorative gradients.
- Use tinted neutrals for background, sidebar, panels, table rows, filters.
- Keep semantic colors readable and explicit.
- Do not introduce pure `#000` or pure `#fff` in new styles.

### Theme

Physical scene: small team operator checks auth/provider health on a laptop or external monitor during normal work hours, with occasional fatigue or incident pressure. Light mode should feel calm by default; dark mode remains available for comfort, not as the main identity.

### Elevation

Use tonal layering first:

- Static panels: border + subtle fill, no heavy shadow.
- Hover: slight tonal shift, minimal transform.
- Overlays/popovers/dialogs: allowed shadow.
- Remove decorative glass/backdrop blur where not required for layering.

### Motion

- Shorten most transitions to 150 to 250ms.
- Remove orchestrated page-load feel from app shell where practical.
- Keep reduced-motion handling.
- Preserve motion only for state feedback and progressive disclosure.

### Typography

- Keep Geist.
- Reduce oversized hero/title feel where pages are operational.
- Keep hierarchy via weight and spacing, not drama.
- Keep body/prose readable at 65 to 75ch where relevant.

## Steps

1. [ ] Update `frontend/src/index.css` tokens and dashboard utility classes.
   - Make body background mostly neutral.
   - Reduce radial gradient intensity or remove decorative gradients.
   - Make `.dashboard-panel` and `.dashboard-surface` border/tonal-first.
   - Reduce `.dashboard-card` hover lift.
   - Remove decorative `.page-hero::before` glow or make it nearly invisible.
   - Shorten motion timings.

2. [ ] Update shared UI token helpers in `frontend/src/components/shared/ui_tokens.ts`.
   - Use neutral backgrounds and borders.
   - Avoid accent hover fills for ghost buttons.
   - Keep danger style text + tint, not saturated fill.

3. [ ] Update core UI primitives.
   - `Button.tsx`: keep shadcn variant API, remove heavy default shadow, keep visible focus, reduce inactive saturation.
   - `Card.tsx`: keep shadcn structure, strengthen border/tonal semantics, avoid translucent/glassy feel.
   - `Badge.tsx`: keep shadcn variant API, keep outline badges calm and text-first.
   - `Input.tsx`: keep shadcn field primitive, keep focus clear, neutral field background.
   - Verify each primitive in both light and dark themes through CSS variables.

4. [ ] Update layout shell.
   - `DashboardLayout.tsx`: remove active-nav heavy shadow, make sidebar more neutral, remove unnecessary mobile backdrop blur.
   - Ensure active route is visible through fill + font weight + contrast, not color alone.

5. [ ] Update page shell.
   - `PageShell.tsx`: reduce hero size/visual drama for operational pages.
   - Keep title/description/actions hierarchy clear.

6. [ ] Sweep feature pages only where global changes leave loud artifacts.
   - Remove remaining heavy shadows/glassy classes.
   - Keep tables and filters dense but humane.
   - Preserve existing flows and copy unless design docs require clarification.

7. [ ] Verify.
   - Run `cd frontend && bun run typecheck`.
   - Run `cd frontend && bun run lint` if typecheck passes.
   - Optionally run `cd frontend && bun run test` for existing frontend tests.
   - Manually inspect light and dark themes if dev server/browser available.

## Verification Checklist

- [ ] UI reads as product dashboard, not marketing/hero page.
- [ ] Accent color is sparse and meaningful.
- [ ] Static surfaces use borders/tonal layers before shadows.
- [ ] No decorative glassmorphism remains as default styling.
- [ ] No side-stripe borders or gradient text added.
- [ ] Focus states remain visible.
- [ ] Reduced-motion media query still works.
- [ ] shadcn/Radix primitives remain the source of truth for UI controls.
- [ ] Light and dark modes both use theme variables and remain readable.
- [ ] Existing routes compile.

## Out of Scope

- New features or route changes.
- Backend changes.
- Redesigning auth/API flows.
- Replacing shadcn/Radix primitives.
- Bypassing the light/dark theme token system with one-off hardcoded component themes.
- Adding dependencies.
