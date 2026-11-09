# MASTER PROMPT: ChurchCore Ecosystem UI/UX Unification & Full-Surface Visual Overhaul (`ADR-0026` / `COUNCIL-2026-014`)

You are performing a complete UI/UX unification and visual overhaul of this repository so that every screen, header, navigation shell, card, table, badge, and standalone utility page looks and feels like a native part of the flagship **ChurchCore** platform (`/Users/rjulia/ChurchCore`).

Do NOT stop at passing unit tests or static CSS checks. Static tests miss visual defects like unstyled "WordDoc" stacked headings, collapsed-by-default navigation drawers, hardcoded `rgba(255,255,255,0.96)` gradients that turn into blinding white boxes in dark mode, tiny KPI numbers, and truncated table badges. You must execute all 6 phases below, including capturing and visually inspecting real browser screenshots of every screen before opening a PR.

---

## Phase 1: Reference Flagship Source of Truth First

Before editing any UI code, read the flagship ChurchCore design system files to ground your implementation:
1. `/Users/rjulia/ChurchCore/components/theme-provider.tsx` — Canonical Mantine theme, `dark`/`slate`/`indigo`/`brand` 10-step palettes, `filledColorResolver`, `autoContrast: true`, and `cssVariablesResolver`.
2. `/Users/rjulia/ChurchCore/components/application/app-shell.tsx` — Canonical `AppShell` layout (`header={{ height: 64 }}`, persistent `272px` desktop sidebar with `breakpoint="md"`, top brand card, icon-annotated `NavLink` items, and bottom user identity card).
3. `/Users/rjulia/ChurchCore/app/globals.css` — Canonical Dark-First CSS variables, glassmorphic surfaces, and typography rules.
4. `docs/council/COUNCIL-2026-014.md` (if present) — Self-hosted variable typography (`Inter`, `Fraunces`, `Geist Mono`), 6-step `rem` scale, `2.75rem` (`44px`) touch targets, and WCAG AAA (`>= 7.0:1`) secondary text contrast.

---

## Phase 2: Unify Theme, CSS Variables & Typography Foundation

1. **Self-Hosted Variable Fonts (`REQ-014-01`)**:
   - Ensure `inter-latin-var.woff2` (`--font-inter` / `--font-sans`), `fraunces-latin-var.woff2` (`--font-fraunces` / `--font-serif`), and `geist-mono-latin-var.woff2` (`--font-geist-mono` / `--font-mono`) are bundled locally with zero runtime requests to `fonts.googleapis.com`.
   - Use `Inter` (`font-weight: 700–800`, `letter-spacing: -0.025em`) for UI headings, `Fraunces` only for editorial/pastoral callouts, and `Geist Mono` (`font-variant-numeric: tabular-nums`) for KPI numbers, IDs, timestamps, and license/billing codes.

2. **Dark-First Surface Hierarchy (`REQ-014-02`)**:
   - Default color scheme MUST be `"dark"`.
   - Enforce the canonical Slate/Indigo Dark-First surface tokens:
     - **Canvas / Body (`--bg-canvas` / `--mantine-color-body`)**: `#020617` (`Slate-950`) with a subtle radial top glow:
       `radial-gradient(1200px 640px at 15% -10%, rgba(79, 70, 229, 0.14), transparent 60%), radial-gradient(900px 520px at 88% 0%, rgba(14, 165, 233, 0.08), transparent 55%), #020617`
     - **Card / Surface (`--bg-surface` / `--mantine-color-default`)**: `#0f172a` (`Slate-900`)
     - **Elevated / Muted Surface (`--bg-muted`)**: `#1e293b` (`Slate-800`)
     - **Border (`--border-subtle` / `--mantine-color-default-border`)**: `rgba(148, 163, 184, 0.14)` (`#1e293b`)
     - **Primary Accent (`--accent-primary`)**: `#4f46e5` (`Indigo-600`) / `#6366f1` (`Indigo-500`)
     - **Warm Accent (`--accent-warm`)**: `#f59e0b` (`Amber-500`)
     - **Primary Text (`--text-primary`)**: `#f8fafc` (`Slate-50`)
     - **Secondary / Dimmed Text (`--text-secondary` / `--mantine-color-dimmed`)**: `#cbd5e1` (`Slate-300` — guarantees `>= 10.9:1` WCAG AAA contrast on `#0f172a` and `>= 13.5:1` on `#020617`)

3. **Eliminate Competing CSS Overrides**:
   - Audit all `.css` files (`index.css`, `App.css`, module CSS) for competing `:root` or `[data-mantine-color-scheme='dark']` blocks. Consolidate into a single source of truth so legacy stylesheets do not override Mantine's `cssVariablesResolver`.
   - If using Mantine, pass both `theme={appTheme}` AND `cssVariablesResolver={cssVariablesResolver}` to `<MantineProvider defaultColorScheme="dark">`.

---

## Phase 3: Overhaul the Application Shell (`AppShell`, `TopBar`, `Sidebar`)

1. **Persistent Desktop Sidebar (`272px`)**:
   - Never hide the primary navigation behind a hamburger drawer on desktop. Configure `navbar={{ width: 272, breakpoint: 'md', collapsed: { mobile: !navOpened, desktop: false } }}`.
   - **Top Brand Card**: Render a bordered glassmorphic card at the top of the sidebar (`rgba(15, 23, 42, 0.72)`) with a `36x36` Indigo gradient icon (`ThemeIcon` / `HeartHandshake` or app icon), bold app name (`ChurchCore <App>`), and subtitle.
   - **Icon-Annotated Navigation Links**: Every `NavLink` must have a `16px` Lucide icon in `leftSection`, `border-radius: 10px`, `font-weight: 600`, and an active pill state (`background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)`, `#ffffff` text, `box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35)`).
   - **Bottom Identity Footer**: Pin a structured user card at the bottom of the sidebar with an `Avatar` initial/icon, user name + role badge, connection status pill (`API CONNECTED`), full-width red `Sign out` button, and the `<PoweredByChurchCore />` trust badge.

2. **Crisp `64px` Glassmorphic TopBar (No "WordDoc" Stacked Headlines)**:
   - Never stack 3 lines of unstyled text in the top bar.
   - Left side: Mobile burger toggle (`hiddenFrom="md"`), bold tight-tracked screen title (`1.05rem`, `font-weight: 700`, `letter-spacing: -0.02em`), a subtle `CHURCHCORE <APP>` Indigo pill badge (`visibleFrom="sm"`), and a single-line truncated muted subtitle (`0.78rem`, `color: #94a3b8`).
   - Right side: Compact `Group` (`gap="xs"`, `wrap="nowrap"`) containing `<AppSwitcher />`, a `36x36` `Sun`/`Moon` `ActionIcon` theme toggle, compact locale `Select` (`w={136}`, `size="xs"`), and a subtle `Sign out` button with `LogOut` icon.

---

## Phase 4: Standardize Page Headers & Purge Dark-Mode Visual Anti-Patterns Across Every Screen

Audit **every** page, tab, modal, and standalone `.html` file in the repository for these exact anti-patterns:

1. **Replace Unstyled `<Title>` + `<Text>` Page Headers with `.page-hero-card`**:
   - Every workspace screen must open with a `.page-hero-card` (`Paper` with `radius="xl"`, `p="lg"`, `background: linear-gradient(135deg, rgba(30, 41, 59, 0.82) 0%, rgba(15, 23, 42, 0.94) 60%, rgba(30, 27, 75, 0.55) 100%)`, `border: 1px solid rgba(99, 102, 241, 0.22)`).
   - Inside `.page-hero-card`, render an uppercase Indigo eyebrow label (`size="xs" fw={700} tt="uppercase" c="indigo.4"`), the `<Title order={2}>` (`1.35rem`, `fw={800}`), a muted description (`c="dimmed" size="sm"`), and primary action buttons aligned to the right.
   - Ensure the screen's outer `<Stack>` has `p="lg" gap="lg"` so content never collides with the `AppShell` edges.

2. **Purge Hidden Light-Mode Gradients & `-0` / `-1` Pastel Backgrounds**:
   - Search the entire codebase (`grep -rn`) for:
     - `rgba(255, 255, 255` or `rgba(244, 247, 255` or `rgba(248, 250, 252`
     - `#fff`, `#ffffff`, `#f8fafc`, `#f1f5f9`, `#eef2ff`
     - `var(--mantine-color-*-0)` and `var(--mantine-color-*-1)` (including dynamic template literals like ``var(--mantine-color-${color}-0)``!)
   - Why this matters: `rgba(255,255,255,0.96)` and dynamic ``var(--mantine-color-${color}-0)`` bypass simple hex regex checks and render **blinding white cards with invisible white text** in dark mode.
   - Replace them with `.surface-elevated-card`, `var(--mantine-color-default)`, or dark-aware translucent tokens (`var(--mantine-color-${color}-light)` and `var(--mantine-color-${color}-outline)`).

3. **KPI Cards & Tabular Metrics**:
   - Ensure all KPI / stat cards render their numeric value at `1.75rem–2rem`, `font-weight: 800`, `font-family: var(--font-geist-mono), monospace`, `font-variant-numeric: tabular-nums`, with uppercase `0.75rem` tracked labels (`letter-spacing: 0.06em`).

4. **Table & Badge Legibility**:
   - Add `whiteSpace: 'nowrap'` on table cells containing `<Badge>` or status pills, and `styles={{ label: { overflow: 'visible' } }}` on compact badges so role/status badges never truncate to `C...` or `ACT...` when action columns are wide.

5. **Standalone HTML Pages (`/monitor.html`, `/operations.html`, demo banners)**:
   - Do not forget standalone static HTML/JS files in `public/`! Update their `@font-face` declarations to use `/fonts/inter-latin-var.woff2` and `/fonts/geist-mono-latin-var.woff2`, and ensure their `[data-theme="dark"]` rules override every `.card`, `.kpi-card`, `.vital-card`, `.db-metric-group`, `.db-table-pill`, `.logo-mark`, and floating banner with `#020617` / `#0f172a` / `#1e293b` dark-slate surfaces.

---

## Phase 5: Automated Screenshot Capture & Visual Inspection Loop (MANDATORY)

Never declare a UI overhaul finished without looking at the rendered pixels of every screen:
1. Build the production web bundle and start the local server against the online database.
2. Run the automated Playwright screenshot script (e.g., `node ops/capture-screenshots.mjs`) to capture all screens (`00` through `15+`, including Sign-In, Dashboard, AI Workflows, Staff & Access, Counselors, Clients, Client Detail tabs, Scheduling, Clinical Chart/Notes, Setup/Studio, Offerings/Financials, Time Tracking, Monitoring, and Client Portal).
3. **Visually inspect every single captured PNG image** using your file/image viewer tool.
4. Check every screenshot for:
   - Any white or light-pastel card/row backgrounds in dark mode (especially selected list rows, timeline headers, or floating banners).
   - Cramped margins or elements touching the `AppShell` border.
   - Truncated badges (`C...`, `ACT...`) or overlapping text.
   - Unstyled headings or tiny metric numbers.
5. If any screenshot has even a minor visual flaw, fix the component, rebuild, re-capture, and re-inspect the screenshot until 100% of screens look cohesive, modern, and production-grade.

---

## Phase 6: Governance, Tests, Documentation & PR Delivery

1. Preserve all required DOM IDs, `data-testid` attributes, and monitoring hooks (`#loginEmail`, `#loginPassword`, `#authGate`, `#userBadge`, `.workspace-topbar`, `[data-nav-key]`).
2. Run `pnpm build`, `pnpm lint`, unit tests, contrast ratchet tests, and Council directive enforcement (`python3 scripts/pull-and-enforce-directives.py` and `python3 scripts/report-telemetry.py`).
3. Update `README.md`, `docs/change-log.md`, and commit the refreshed `ScreenShots/*.png` gallery on a feature branch with a signed commit (`git commit -S`) and open a PR into `main`.
