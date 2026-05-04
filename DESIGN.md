---
name: Rusuh
description: A quiet operator dashboard for shared LLM proxy infrastructure.
colors:
  background-mist: "#f6f1ff"
  foreground-plum: "#2a2148"
  card-white: "#ffffff"
  primary-orchid: "#c062a8"
  secondary-violet: "#b184ff"
  accent-rose: "#f09bd5"
  muted-lavender: "#efe7ff"
  muted-foreground-lavender: "#766a98"
  border-lavender: "#e2d7fb"
  destructive-rose: "#f26b8a"
  success-mint: "#7bdcb5"
  warning-amber: "#ffc782"
  dark-background-plum: "#151225"
  dark-card-plum: "#1e1a33"
  dark-foreground-mist: "#f4efff"
typography:
  display:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.045em"
  title:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.35
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.7rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.34em"
rounded:
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
  xl: "1.25rem"
  panel: "1.5rem"
  hero: "2.8rem"
  pill: "999px"
spacing:
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.primary-orchid}"
    textColor: "{colors.card-white}"
    rounded: "{rounded.xl}"
    padding: "0 1rem"
    height: "2.75rem"
  button-outline:
    backgroundColor: "{colors.background-mist}"
    textColor: "{colors.foreground-plum}"
    rounded: "{rounded.xl}"
    padding: "0 1rem"
    height: "2.75rem"
  input-default:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.foreground-plum}"
    rounded: "{rounded.xl}"
    padding: "0.5rem 1rem"
    height: "2.75rem"
  badge-outline:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.foreground-plum}"
    rounded: "{rounded.pill}"
    padding: "0.25rem 0.75rem"
---

# Design System: Rusuh

## 1. Overview

**Creative North Star: "The Quiet Control Room"**

Rusuh's interface is an operator surface, not a performance. It should feel like a calm control room for shared proxy infrastructure: clear state, measured controls, and exact consequences. The design earns trust through restraint, consistent structure, and a low-noise reading environment.

The current visual system has a distinct purple and rose identity, large rounded surfaces, Geist typography, soft panels, and gentle motion. Future work should preserve that identity while making it more neutral: reduce decorative gradients, avoid glass as a default, and let color mark meaning, focus, or primary action.

The system explicitly rejects the terminal-only hacker UI named in PRODUCT.md: no green-on-black intimidation, no faux-console density, no cyberpunk neon. Operational confidence should feel accessible, not obscure.

**Key Characteristics:**
- Neutral, readable surfaces with sparse orchid/violet brand accents.
- Familiar product patterns: sidebar navigation, filters, tables, forms, dialogs only when necessary.
- Precise labels, compact actions, and clear status vocabulary.
- Gentle state motion that never delays the operator.

## 2. Colors

The palette is restrained lavender infrastructure: tinted neutrals carry the surface, orchid and violet identify the product, rose and semantic tones appear only when they clarify state.

### Primary
- **Quiet Orchid**: The primary action and selection color. Use for the active navigation item, primary buttons, focus emphasis, and rare brand moments.

### Secondary
- **Routing Violet**: A supporting brand accent. Use sparingly for secondary emphasis or provider/routing identity, never as broad decoration.
- **Soft Rose Signal**: A warm accent for gentle emphasis and decorative background remnants. Keep it subtle; it should not compete with status colors.

### Tertiary
- **Mint Success**: Connected, active, and healthy states.
- **Amber Caution**: Warning and pending states.
- **Rose Destructive**: Delete, revoke, failed, or risky states.

### Neutral
- **Mist Background**: The light app canvas. It is tinted toward the brand so the UI avoids sterile white.
- **Plum Ink**: Main text. Use it for readable, quiet contrast rather than pure black.
- **White Panel**: Card and popover surfaces. Use with borders before shadows.
- **Lavender Wash**: Muted backgrounds, selected low-emphasis states, and empty-state panels.
- **Lavender Border**: Dividers, panel outlines, input borders, and table rows.
- **Dark Plum Canvas**: Dark-mode canvas and sidebars. Use dark mode as an operator comfort option, not as the default brand expression.

### Named Rules
**The Accent Ration Rule.** Accent color should cover less than 10% of a normal product screen. If the page reads purple before it reads operational state, it is too loud.

**The No Pure Extremes Rule.** Never use pure black or pure white as a new design decision. Neutrals must stay slightly tinted toward the Rusuh palette.

## 3. Typography

**Display Font:** Geist (with ui-sans-serif and system fallback)
**Body Font:** Geist (with ui-sans-serif and system fallback)
**Label/Mono Font:** Geist for labels; JetBrains Mono or system mono only for code and secrets.

**Character:** Geist gives the dashboard a modern technical voice without becoming terminal-like. The scale should be tight and product-native, with hierarchy from weight, spacing, and exact labels rather than oversized drama.

### Hierarchy
- **Display** (600, 3rem, 1.05): Page hero titles only. Keep line length short and avoid fluid scaling for routine product screens.
- **Headline** (600, 2rem, 1.1): App shell title, major section headings, and empty-state headers.
- **Title** (600, 1.125rem, 1.35): Panel titles, table group headings, dialog titles.
- **Body** (400, 0.875rem, 1.5): Primary interface text. Cap prose around 65 to 75 characters where possible.
- **Label** (500, 0.7rem, 0.34em letter spacing, uppercase): Eyebrows and compact metadata. Use sparingly; too many uppercase labels create noise.

### Named Rules
**The Operator Type Rule.** Product text must stay readable at work speed. Do not introduce display fonts, ornamental headings, or oversized metric typography for routine dashboard information.

## 4. Elevation

Rusuh should use tonal layering first. Borders, tinted surfaces, and spacing define structure at rest. Shadows are allowed for popovers, dialogs, sticky mobile headers, and hover feedback, but they should be softer and rarer than the current glassy dashboard language.

### Shadow Vocabulary
- **Panel Rest** (`0 10px 26px rgba(66, 45, 132, 0.16)`): Existing dashboard-panel shadow. Use only while migrating; prefer a border and tonal fill for new static panels.
- **Surface Lift** (`0 24px 60px rgba(66, 45, 132, 0.22)`): Existing large surface shadow. Reserve for page hero shells or significant overlays, not nested content.
- **Action Lift** (`0 16px 40px rgba(12, 16, 40, 0.55)`): Existing primary button shadow. Reduce or omit when the surrounding screen is dense.

### Named Rules
**The Tonal First Rule.** If a border and a slight surface shift can separate content, do not add a shadow.

**The No Decorative Glass Rule.** Backdrop blur and translucent panels must solve a layering problem. They are forbidden as default decoration.

## 5. Components

Rusuh components should feel measured and predictable: familiar controls, consistent geometry, clear state changes, and no invented affordances.

### Buttons
- **Shape:** Soft rounded controls (`1rem` to `1.25rem`), with pills (`999px`) for compact route/action links.
- **Primary:** Quiet Orchid background with light text, minimum height `2.75rem`, medium weight, used for one main action per region.
- **Hover / Focus:** Hover can slightly brighten or tint. Focus must use a visible ring tied to the ring token. Active states may move `1px` only.
- **Secondary / Ghost / Tertiary:** Outline and ghost buttons should rely on border, muted fill, and text color. Do not make inactive controls saturated.

### Chips
- **Style:** Rounded pills with border and low-contrast background. Use badges for provider counts, filter summaries, and status tags.
- **State:** Status chips must pair color with text, icon, or label. Never communicate active/error/disabled with color alone.

### Cards / Containers
- **Corner Style:** Large but consistent radii (`1rem`, `1.5rem`, `2.8rem` for hero shells).
- **Background:** Prefer neutral card or muted lavender fills over translucent glass.
- **Shadow Strategy:** Tonal layering first, shadow only for meaningful lift or interaction.
- **Border:** Use Lavender Border for most static separation.
- **Internal Padding:** Default panels use `1rem` to `1.5rem`; hero shells use `1.5rem` to `2rem`.

### Inputs / Fields
- **Style:** Full-width rounded fields, border-first, neutral background, readable text.
- **Focus:** Visible ring and border shift. Focus must be clear in both light and dark themes.
- **Error / Disabled:** Error uses destructive tone plus text. Disabled reduces opacity and blocks pointer interaction.

### Navigation
- **Style:** Sidebar navigation is the primary orientation pattern. Active route uses the primary accent and stronger weight; inactive routes stay muted and readable.
- **Mobile:** Collapse navigation into a sticky header with menu disclosure. Keep theme and lock actions reachable.
- **State:** Current route must be visible without relying only on color.

### Tables
- **Style:** Dense but humane rows with subtle borders and hover tint. Use tables for API keys, auth records, and config lists when comparison matters.
- **Behavior:** Preserve horizontal scrolling on small screens rather than compressing critical values into unreadable cards.

## 6. Do's and Don'ts

### Do:
- **Do** keep the product register visible: dashboard UI should serve workflows, not market itself.
- **Do** use neutral tinted surfaces as the default, with Quiet Orchid reserved for primary actions, active navigation, focus, and rare identity moments.
- **Do** pair every status color with text, labels, or icons so WCAG AA and color-blind use remain practical.
- **Do** reuse existing shadcn/Radix primitives, Geist typography, CSS variables, and UI token helpers before creating new component vocabulary.
- **Do** prefer inline/progressive management flows over modals unless focus trapping is necessary for safety.

### Don't:
- **Don't** make Rusuh look like a terminal-only hacker UI: no green-on-black intimidation, no dense faux-console chrome, no cyberpunk neon.
- **Don't** use glow-heavy glassmorphism as default decoration. Glass is allowed only for real overlay layering.
- **Don't** add side-stripe borders, gradient text, hero-metric templates, or identical card grids.
- **Don't** flood inactive states with saturated purple, violet, or rose.
- **Don't** use em dashes in interface copy or design documentation. Use commas, periods, colons, or parentheses.
