# DAEMON design system

## Overview

The page addresses the people who keep the IMD swarm daemon running. Its terminal character comes from one monospace family, a near-black canvas, off-white text, green actions, an oversized DAEMON heading and its block cursor. Numbered section labels, wide spacing and a consistent left edge organize the facts. The desktop hero pairs the copy with the supplied logo; this specific arrangement is not a rule for unrelated content.

Implementation sources: `src/styles.css`, `src/App.tsx`, `src/Live.tsx`. There is one dark appearance, no theme switch and no component framework. All required sections stay in the assignment's order.

## Colors

All color definitions are in `src/styles.css`: primitives are mapped to semantic roles. Components consume role tokens.

| Role token | Primitive / exact value | Use |
| --- | --- | --- |
| `--color-bg` | `--neutral-950`, `#0b0b0c` | Page, outline controls |
| `--color-surface` | `--neutral-900`, `#111113` | Contract container and swarm cards |
| `--color-hover` | `--neutral-850`, `#19191b` | Hover and pressed controls |
| `--color-border` | `--neutral-700`, `#353538` | Structural dividers and card boundaries |
| `--color-control-border` | `--neutral-500`, `#76767b` | Interactive control outlines and decorative logo brackets |
| `--color-muted` | `--neutral-400`, `#a2a2a8` | Supporting copy, metadata, labels |
| `--color-text` / `--color-focus` | `--neutral-50`, `#f2f0ea` | Main text and focus perimeter |
| `--color-accent` | `--green-400`, `#3fcf7f` | Main action, links, cursor, brand marks, allocation bar |
| `--color-on-accent` | `--neutral-950`, `#0b0b0c` | Text on green buttons and text selection |

Green is the sole accent. It also appears decoratively as explicitly required for the cursor; shape, underline, labels and context distinguish actions from decoration. Status messages use text rather than an extra status palette. Measured rendered contrast: main text/page 17.26:1, muted/page 7.75:1, green/page and dark/green 9.78:1, muted/card 7.43:1. See `artifacts/browser-measurements.json` for the sampled pairs; these numbers do not claim exhaustive accessibility compliance.

## Typography

`--font-mono` is `'IBM Plex Mono', 'SFMono-Regular', Consolas, 'Liberation Mono', monospace`. Local Latin WOFF2 faces supply normal styles at weights 400, 500 and 600 (`public/assets/ibm-plex-mono-latin-*-normal.woff2`). All three were observed loaded in Chromium. `font-display: swap`; regular weight is preloaded; `font-synthesis: none`. No italic or synthetic bold is requested.

| Role | Size | Weight / line-height |
| --- | --- | --- |
| `--text-display`, h1 | `clamp(2rem, 11vw, 5rem)` | 600 / 1.1, tracking −0.06em |
| `--text-tagline` | `clamp(1.125rem, 2.2vw, 1.375rem)` | 400 / 1.4, tracking −0.04em |
| `--text-heading`, h2 | 1.125rem | 500 / 1.4 |
| `--text-body`, body and card h3 | 1rem | 400 body, 500 h3 / 1.6 |
| `--text-label` | .875rem | 400 / 1.6 or 1.7 for allocation copy |
| `--text-small` | .8125rem | 400; action buttons 500 |
| `--text-caption` | .75rem | 400; eyebrow tracking .08em, uppercase in CSS |
| Metric values | `clamp(1.125rem, 2.6vw, 1.625rem)` | 500 / 1.4, tabular numbers |

The allocation subheading is deliberately .8125rem / 400. Body line-height is unitless 1.6; the hero description and allocation descriptions use 1.7, footer copy 1.8. Descriptions use `text-wrap: pretty`, headings `balance`. Hero copy is capped at 47ch, the swarm introduction at 65ch, node description at 60ch, and short footer text at 80ch. Addresses wrap anywhere and remain fully selectable; there is no ellipsis or hidden contract suffix. Contract text is .8125rem on mobile and .75rem beside its inline desktop control.

## Layout

Spacing tokens `--space-1/2/3/4/6/8/12/16/20` correspond to .25/.5/.75/1/1.5/2/3/4/5rem. Reuse them for gaps and padding. `.shell` is centered with a 70rem maximum width and 1.25rem mobile gutters. Body has no fixed height or overflow-hiding workaround.

Below 40rem, the logo is above the hero text, metrics form two columns, the primary action fills a row, the two secondary buttons share the next row, and swarm cards stack. The contract and copy control can wrap into separate rows. Section padding is 3rem. Header items can wrap when enlarged text needs room. The logo's decorative `.art-frame` contains only the image, so brackets cannot collide with a wrapping caption.

At 40rem, gutters become 2rem, metrics use four columns, three swarm cards share a row, token facts gain a 6rem label column, footer content aligns in a row and hero actions fit inline. At 60rem, the hero becomes a 1.6:1 two-column grid with a 4rem gap and 5rem vertical padding; token/node sections use a 17rem heading column with a 3rem gap; section padding rises to 4rem. The logo is capped at 23rem on desktop and `min(60%, 14rem)` on smaller layouts.

Observed screenshots cover 320, 375, 640 and 1440 pixels. Programmatic reflow checks also cover 960 and 1280, plus 200% root text size at 375. Browser-native zoom and physical-device behavior are not represented by those checks.

## Elevation & Depth

Flat surfaces, no shadows, no overlays, no sticky navigation. One-pixel borders separate sections and define card/contract surfaces. A lighter control border distinguishes outline actions. The only elevated layer is the keyboard skip link (`z-index: 5`). The original logo's near-black background blends into the page with `mix-blend-mode: lighten`; the asset itself is unchanged.

## Shapes

`--radius: 3px` applies to buttons, the contract box, and cards. Corners are nearly square, consistent with the terminal direction. The network marker is a 6px circle. The decorative allocation strip is 6px tall, with labeled 88/10/2 proportions repeated in accessible text. Inline copy SVG uses `currentColor`, 1.5px strokes, and a 1.125rem box. It and the text arrows are decorative, never the only accessible name.

## Components

- **`App` / hero** (`src/App.tsx`): one h1, four h2 sections, semantic main/header/footer, and a first-focusable skip link. `.button` is an ordinary navigation anchor. `.button-primary` is the only filled action. Actions have at least 48px height; copy and utility controls at least 44px at the default font size. Inline prose links use their natural text bounds.
- **`CopyContract`** (`src/App.tsx`): full address plus native button. On success the label becomes “Copied” and the stable polite status announces success. Denied/unavailable clipboard access selects the full address and shows persistent manual-copy instructions. It never claims success on failure.
- **`Live`** (`src/Live.tsx`): a definition list with stable tabular values; loading/empty/failure display `—`. Nonurgent status text describes retries. Refresh runs every 60 seconds with a 10-second timeout. Pause freezes the current values with a stale-data notice; resume fetches immediately. Numerical refreshes are not repeatedly announced through a live region.
- **Token facts / allocation** (`src/App.tsx`): short lists with visible labels, percentages, full claim address and source link. The colored proportion bar is decorative and excluded from assistive technology.
- **Swarm cards** (`src/App.tsx`): Token and Logo are full-card anchors with explicit job destinations and hover/focus states. This page is a static card with the required IPFS attribution and no invented URL.
- **Cursor control** (`src/App.tsx`, `src/styles.css`): 1.2-second `step-end` blink under `prefers-reduced-motion: no-preference`. A footer control pauses/resumes it; reduced motion makes it static and hides the unnecessary control. No page entrance, parallax, or layout animation. Control color/background/border transitions last 150ms only when motion is allowed.

Every interactive element uses native keyboard behavior and a 2px off-white focus outline with 5px offset. Hover colors are gated by `(hover: hover)`; active state is immediate. Forced colors uses `Highlight` for focus and native button border colors; the logo's blend mode resets to `normal` so it remains visible over a system white canvas. Without JavaScript, inert enhancement controls are hidden and a Live-section message links readers toward DEX Screener.

## Do's and Don'ts

- Start from `.shell`, the existing spacing tokens, and semantic heading order. Use `.content-section` only where its section separator is appropriate.
- Use `.button-primary` for the main destination; keep adjacent actions outlined and prose links underlined. Preserve exact financial addresses and destinations in `src/constants.ts`.
- Keep long identifiers selectable and wrap them. Keep failures local and recoverable, with `—` for missing metrics.
- Keep assets local, `base: './'`, and publish the complete export. Do not add wallet infrastructure, forms, tracking, invented token claims, or a second accent.
- If another page is ever commissioned, reuse this typography, shell and action patterns, export its HTML explicitly, and test its gateway subpath. Do not assume server-side route rewrites.
