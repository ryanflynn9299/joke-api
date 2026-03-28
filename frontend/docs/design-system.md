# Joke API — Design System

> Single source of truth. All UI decisions must comply with this document.

---

## 1. Philosophy

Guided by [Laws of UX](https://lawsofux.com) and a Vercel × Material Design 3 aesthetic.

| Principle               | Rule                                                                                          |
| ----------------------- | --------------------------------------------------------------------------------------------- |
| **Aesthetic-Usability** | Premium dark surfaces, tight typography, MD3 elevation. Visual quality = perceived usability. |
| **Doherty Threshold**   | All interactions < 240ms. No perceptible delay.                                               |
| **Jakob's Law**         | Standard patterns: pill buttons, OS-native share, keyboard shortcuts.                         |
| **Fitts's Law**         | Interactive elements ≥ 48px hit area. Primary CTAs span full width on mobile.                 |
| **Hick's Law**          | One primary action visible at a time. Secondary actions revealed post-interaction.            |
| **Von Restorff**        | Mint-leaf-600 isolates the primary CTA from the deep-space-blue palette.                      |
| **Peak-End Rule**       | The punchline reveal is the peak moment — it must feel premium.                               |

---

## 2. Design Tokens

All values are defined as CSS custom properties in `index.css`. Components MUST reference these tokens.

### Backgrounds

| Token           | Value                 | Usage                    |
| --------------- | --------------------- | ------------------------ |
| `--bg-base`     | `deep-space-blue-950` | Page canvas              |
| `--bg-surface`  | `rgba(15,27,36,0.50)` | Cards, panels            |
| `--bg-elevated` | `rgba(15,27,36,0.70)` | Modals, scrolled header  |
| `--bg-inset`    | `rgba(0,0,0,0.40)`    | Code blocks, inner wells |

### Text

| Token              | Value                 | Usage                     |
| ------------------ | --------------------- | ------------------------- |
| `--text-primary`   | `#ffffff`             | Headings, setup text      |
| `--text-secondary` | `deep-space-blue-100` | Body copy                 |
| `--text-muted`     | `deep-space-blue-300` | Descriptions, captions    |
| `--text-faint`     | `deep-space-blue-500` | Meta, breadcrumbs, labels |

### Borders

| Token              | Value                    | Usage                         |
| ------------------ | ------------------------ | ----------------------------- |
| `--border-subtle`  | `rgba(255,255,255,0.05)` | Card borders, subtle dividers |
| `--border-default` | `rgba(255,255,255,0.08)` | Header, modals, separators    |
| `--border-strong`  | `rgba(255,255,255,0.12)` | Hover states, active borders  |
| `--border-hover`   | `rgba(91,156,164,0.20)`  | Card hover accent             |

### Status

| Token              | Value           | Usage                               |
| ------------------ | --------------- | ----------------------------------- |
| `--status-success` | `mint-leaf-500` | HTTP 2xx, success states            |
| `--status-warning` | `amber-500`     | HTTP 4xx, warning/validation states |
| `--status-error`   | `#ff4d4d`       | HTTP 5xx, failure states            |

### Accent

| Token              | Value                  | Usage                   |
| ------------------ | ---------------------- | ----------------------- |
| `--accent-primary` | `mint-leaf-600`        | Button backgrounds      |
| `--accent-hover`   | `mint-leaf-500`        | Button hover state      |
| `--accent-text`    | `mint-leaf-400`        | Punchlines, accent text |
| `--accent-subtle`  | `rgba(9,195,142,0.10)` | Accent background tint  |

### Radius

| Token           | Value    | Usage                         |
| --------------- | -------- | ----------------------------- |
| `--radius-sm`   | `8px`    | Small elements, pills, inputs |
| `--radius-md`   | `12px`   | Buttons, panels, accordions   |
| `--radius-lg`   | `16px`   | Cards, modals                 |
| `--radius-full` | `9999px` | Pill badges, avatars          |

### Shadows

| Token                        | Value                                  | Usage                     |
| ---------------------------- | -------------------------------------- | ------------------------- |
| `--shadow-card`              | `0 4px 20px rgba(0,0,0,0.35)`          | Cards                     |
| `--shadow-elevated`          | `0 8px 32px rgba(0,0,0,0.50)`          | Modals, elevated surfaces |
| `--shadow-btn-primary`       | `0 4px 14px -2px rgba(9,195,142,0.30)` | Primary button            |
| `--shadow-btn-primary-hover` | `0 8px 20px -2px rgba(9,195,142,0.40)` | Primary button hover      |

---

## 3. Spacing

**8px grid only.** Every margin, padding, and gap must use one of these values:

```
4 · 8 · 12 · 16 · 24 · 32 · 40 · 48 · 64
```

Tailwind mapping: `1(4) · 2(8) · 3(12) · 4(16) · 6(24) · 8(32) · 10(40) · 12(48) · 16(64)`

> **Exception:** `1.5(6px)` and `0.5(2px)` are allowed only for micro-adjustments inside icons and badge indicators.

---

## 4. Typography

| Scale       | Size                          | Weight               | Line-Height | Usage                        |
| ----------- | ----------------------------- | -------------------- | ----------- | ---------------------------- |
| **Display** | `clamp(1.75rem, 5vw, 2.5rem)` | Medium (500)         | 1.2         | Detail page setup            |
| **Title**   | `text-4xl / text-5xl`         | Bold–Black (700–900) | 1.05        | Page headings                |
| **Heading** | `text-xl / text-2xl`          | Bold (700)           | 1.4         | Section headings, card setup |
| **Body**    | `text-sm / text-base`         | Medium (500)         | 1.6         | Descriptions, paragraphs     |
| **Caption** | `text-xs`                     | Semibold (600)       | 1.4         | Labels, meta, breadcrumbs    |
| **Micro**   | `text-[10px]`                 | Black (900)          | 1.2         | Version, dev labels, badges  |

**Font:** Lato (primary), Inter (fallback), system-ui.

**Rules:**

- No font sizes outside this scale
- `tracking-tight` for headings, `tracking-tighter` for display
- `tracking-widest` only for uppercase micro labels

---

## 5. Component Standards

### Button

```
Base class: .btn-base
Height: py-3 (12px vertical = ~46px total)
Radius: --radius-lg (16px) for standalone, --radius-md (12px) for inline
Active: scale(0.98)
Hover: translateY(-1px)
```

| Variant       | Background         | Text                  | Border             | Shadow                 |
| ------------- | ------------------ | --------------------- | ------------------ | ---------------------- |
| **Primary**   | `--accent-primary` | `deep-space-blue-950` | `mint-leaf-500/40` | `--shadow-btn-primary` |
| **Secondary** | `white/5`          | `white`               | `--border-default` | none                   |
| **Ghost**     | `transparent`      | `pacific-cyan-400`    | `transparent`      | none                   |

> **Contrast Rule:** Primary buttons MUST use `text-deep-space-blue-950` (dark navy) on the mint-leaf background for AA/AAA accessibility. `text-white` or `text-mint-leaf-50` is prohibited on primary backgrounds.

### Card

```
Base class: .md3-card (interactive) or .md3-card-static (static)
Padding: p-6 md:p-8
Radius: --radius-lg (16px)
Background: --bg-surface
Border: --border-subtle
Shadow: --shadow-card
```

| State     | Border            | Shadow              | Transform          |
| --------- | ----------------- | ------------------- | ------------------ |
| **Rest**  | `--border-subtle` | `--shadow-card`     | none               |
| **Hover** | `--border-hover`  | `--shadow-elevated` | `translateY(-2px)` |

### Dividers

```
Style: Gradient-to-right (transparent → white/8 → transparent)
Width: 96px (640px containers) or Full width (1280px containers)
Height: 1px
Usage: Between setup and interaction, between summary and detail.
```

### Input

```
Background: transparent or --bg-inset
Border: --border-subtle
Focus: 2px solid --accent-text, offset 3px
Radius: --radius-sm (8px) or --radius-md (12px)
```

### Layout Containers

```
Max width: max-w-7xl (1280px) — standard pages
Max width: max-w-[640px] — detail/focus pages
Horizontal padding: px-6 (24px)
Content top: pt-28 (header clearance)
```

---

## 6. Interaction & Motion

### Durations

| Token               | Value   | Usage                      |
| ------------------- | ------- | -------------------------- |
| `--duration-fast`   | `120ms` | Active press, reveal delay |
| `--duration-normal` | `180ms` | Hover, color transitions   |
| `--duration-slow`   | `240ms` | Layout shifts, modal entry |

### Easing

| Token            | Value                        | Usage                             |
| ---------------- | ---------------------------- | --------------------------------- |
| `--ease-default` | `cubic-bezier(0.16,1,0.3,1)` | Primary easing for all transforms |
| `--ease-out`     | `ease-out`                   | Color/opacity transitions         |

### Interaction States

| State             | Effect                                                                      |
| ----------------- | --------------------------------------------------------------------------- |
| **Hover**         | `translateY(-1px)` or `translateY(-2px)` for cards. Color shift via tokens. |
| **Active**        | `scale(0.98)`                                                               |
| **Focus-visible** | `2px solid --accent-text`, `3px offset`                                     |
| **Disabled**      | `opacity: 0.5`, no pointer events                                           |

### Animations

| Name            | Duration            | Easing           | Purpose               |
| --------------- | ------------------- | ---------------- | --------------------- |
| `fade-in`       | `600ms`             | `--ease-default` | Page/section entrance |
| `detail-reveal` | `--duration-normal` | `--ease-out`     | Punchline reveal      |
| `pulse-glow`    | `8s`                | `ease-in-out`    | Ambient loader glow   |

---

## 7. Anti-Goals

These are explicitly prohibited:

- ❌ **Glassmorphism overload** — No frosted-glass backgrounds on content areas
- ❌ **Neon glow borders** — Use `--border-hover` only, never color-saturated box-shadows on cards
- ❌ **Competing focal points** — One primary CTA per view
- ❌ **Decorative motion** — All animation must serve feedback, not decoration
- ❌ **Color as decoration** — Accent colors are functional (action, state), not aesthetic

---

## 8. Enforcement Rules

### DO

- ✅ Use semantic tokens (`--bg-surface`, `--text-muted`, etc.) for all styling
- ✅ Use `.md3-card` / `.md3-card-static` / `.btn-base` base classes
- ✅ Use the spacing scale (4–64, 8px increments)
- ✅ Use the typography scale (Display → Micro)
- ✅ Use system durations (`--duration-fast`, `--duration-normal`, `--duration-slow`)
- ✅ Use system easing (`--ease-default`, `--ease-out`)

### DO NOT

- ❌ Use raw hex colors, rgba values, or Tailwind color classes for semantic roles
- ❌ Introduce new spacing values outside the 8px grid
- ❌ Create one-off component styles — extend the system instead
- ❌ Use `duration-200`, `duration-300`, `duration-500` — use token durations
- ❌ Use custom easing curves — use `--ease-default` or `--ease-out`
- ❌ Use `rounded-2xl`, `rounded-xl`, `rounded-lg` — use `--radius-*` tokens
- ❌ Mix `.btn-premium` with ad-hoc button styles (`.btn-premium` is removed)
- ❌ Hard-code shadows — use `--shadow-card`, `--shadow-elevated`, `--shadow-btn-*`

### API Documentation Layout

To maintain cohesion across technical views:

- **Labels:** Left-aligned.
- **Status/Actions:** Right-aligned (flex justify-between).
- **Status Indicators:** Use `animate-pulse` dot with corresponding status token.
