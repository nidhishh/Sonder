---
name: Sonder v2 POC
description: Verified, live-first 3-minute voice dating app prototype & PM telemetry workbench in the Hybrid Portfolio Level-Shifter retro aesthetic.
colors:
  vermilion-stage: "#ff5a36"
  espresso-ink: "#2b0a00"
  butter-cream: "#fff0d6"
  terracotta-muted: "#6e2811"
  arcade-violet: "#1a0033"
  deep-crt-violet: "#120624"
  caller-pane-violet: "#210c3d"
  lavender-muted: "#d6b8ff"
  coin-yellow: "#ffe600"
  berry-night: "#2a0a12"
  hot-coral: "#ff5c8a"
  rose-cream: "#ffe9ee"
  terminal-obsidian: "#04110a"
  terminal-panel: "#020a05"
  phosphor-green: "#39ff88"
  mint-white: "#d8ffe8"
  mint-muted: "#7be0a8"
  cyan-signal: "#2bd9ff"
typography:
  display:
    fontFamily: "'Fredoka', sans-serif"
    fontSize: "26px"
    fontWeight: 700
    lineHeight: 1.1
  headline:
    fontFamily: "'Fredoka', sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.15
  title:
    fontFamily: "'Fredoka', sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "'VT323', 'Courier New', monospace"
    fontSize: "21px"
    fontWeight: 400
    lineHeight: 1.35
  label:
    fontFamily: "'Press Start 2P', monospace"
    fontSize: "9px"
    fontWeight: 400
    lineHeight: 1.45
  telemetry:
    fontFamily: "'JetBrains Mono', monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "8px"
  md: "14px"
  lg: "20px"
  device: "32px"
  pill: "999px"
spacing:
  xs: "6px"
  sm: "10px"
  md: "14px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.espresso-ink}"
    textColor: "{colors.butter-cream}"
    typography: "{typography.title}"
    rounded: "{rounded.pill}"
    padding: "11px 18px"
  button-gold:
    backgroundColor: "{colors.coin-yellow}"
    textColor: "{colors.espresso-ink}"
    typography: "{typography.title}"
    rounded: "{rounded.pill}"
    padding: "11px 18px"
  chip-filter:
    backgroundColor: "{colors.caller-pane-violet}"
    textColor: "{colors.butter-cream}"
    rounded: "{rounded.pill}"
    padding: "6px 13px"
  chip-filter-active:
    backgroundColor: "{colors.coin-yellow}"
    textColor: "{colors.espresso-ink}"
    rounded: "{rounded.pill}"
    padding: "6px 13px"
  terminal-action:
    backgroundColor: "{colors.terminal-obsidian}"
    textColor: "{colors.mint-white}"
    typography: "{typography.telemetry}"
    padding: "9px 11px"
---

# Design System: Sonder v2 POC

## Overview

**Creative North Star: "The Hybrid Arcade Vibe-Tester"**

Sonder's visual system inherits the tactile indie-arcade DNA of `nidhishh.github.io/portfolio-website/` to solve a specific psychological problem in urban Indian online dating: live calling feels intimidating when framed like a corporate video conference, yet unsafe when framed like an anonymous chat roulette. By combining warm rounded display typography (`Fredoka`), 8-bit hardware timers (`Press Start 2P`), readable CRT narrative text (`VT323`), and neo-brutalist `4px` ink borders with hard offset shadows, the interface turns a 3-minute voice vibe check into a low-stakes, high-trust game stage.

As the user advances through the 6-screen funnel, the page background dynamically shifts across three distinct atmospheric registers while keeping the right-hand **PM Director's Console** anchored in a high-contrast phosphor terminal (`JetBrains Mono` on `#020a05`).

**Key Characteristics:**
- **Stage-Driven Palette Shifting:** Warm Daylight Vermilion (`#ff5a36`) and Butter Cream (`#fff0d6`) for verification and curiosity, transitioning into Late-Night Arcade Violet (`#1a0033`) and Coin Gold (`#ffe600`) for the 9–11 PM queue and 3-minute voice call, and Berry Night (`#2a0a12`) for mutual match celebration.
- **Tactile Neo-Brutalist Geometry:** Solid `3px`–`4px` borders paired with zero-blur hard offset shadows (`4px 4px 0` to `10px 10px 0`) that physically depress (`translate(2px, 2px)`) when clicked.
- **Procedural Pixel Art & Live Waveforms:** Real-time `8×8`, `16×16`, and `32×32` `<canvas>` pixel sprites (`image-rendering: pixelated`) paired with animated SVG heartbeat/voice polylines and authored geometric SVG icons.
- **Zero-Rejection & Zero-PII Transparency:** One-sided hearts remain visually private, and pre-call camera checks operate locally at `32×32` pixel resolution.

## Colors

The palette pairs high-energy arcade primaries for the dater experience with a disciplined phosphor-green monochrome terminal for product telemetry.

### Primary
- **Sonder Vermilion** (`#ff5a36`): Primary stage ground for Screens 1–2 (`Locked Live Tab` and `Pre-Call Check`), active `Vibe` heart buttons, floating comic speech bubbles, and SVG voice waveforms.
- **Coin-Op Yellow** (`#ffe600`): High-salience accent for active stage steppers, the `03:00` countdown timer, active filter chips, primary dark-mode CTAs, and the in-flow Arcade Control Dock borders and keycaps.

### Secondary
- **Arcade Night Violet** (`#1a0033`): Primary stage ground for Screens 3–4 (`9–11 PM Queue` and `3-Min Split Call`), evoking Bengaluru's 9–11 PM Live Hours.
- **Berry Match Night** (`#2a0a12`) & **Hot Coral** (`#ff5c8a`): Celebration ground and accent for Screen 5–6 (`Mutual Match` and `Unlocked Chat`), also used for one-tap in-call report flags.

### Tertiary
- **Phosphor Terminal Green** (`#39ff88`): Primary accent inside the right-hand PM Director's Console, liveness scan laser lines, completed verification checkmarks, and guardrail pass indicators.
- **Signal Cyan** (`#2bd9ff`): Secondary pixel-avatar tint for male dater persona (`Rohan, 27`).

### Neutral
- **Butter Cream** (`#fff0d6`): Default light-mode phone shell surface, primary text on dark violet cards, and incoming chat message bubbles.
- **Deep Espresso Ink** (`#2b0a00`): Structural border ink, hard drop-shadow color, and primary text on Butter Cream and Coin-Op Yellow surfaces.
- **Deep CRT Violet** (`#120624`) & **Caller Pane Violet** (`#210c3d`): Dark-mode phone shell and split caller cards during the queue and live voice call.
- **Terminal Obsidian** (`#04110a`) & **Terminal Panel** (`#020a05`): Background surfaces for the PM Director's Console and live event stream.
- **Terracotta Muted** (`#6e2811`), **Lavender Muted** (`#d6b8ff`), & **Mint Muted** (`#7be0a8`): Hue-tinted secondary text tokens—never neutral gray.

### Named Rules
**The Zero-Gray Rule.** Secondary and muted text must always be tinted from the active surface's hue (`#6e2811` on Butter Cream, `#d6b8ff` on Arcade Violet, `#7be0a8` on Terminal Obsidian)—never desaturated gray (`#888888` or `#999999`).

**The Day-to-Night Funnel Rule.** Screens 1–2 use the warm Vermilion/Cream daylight register (`#ff5a36` / `#fff0d6`) to lower onboarding anxiety; Screens 3–4 switch the phone shell into Dark Violet (`#120624`) bordered in Coin-Op Yellow (`#ffe600`) to signal entry into the 9–11 PM Live Hour.

## Typography

**Display & Action Font:** `'Fredoka', sans-serif` (`600`–`700` weight)
**Body & Dialogue Font:** `'VT323', 'Courier New', monospace` (`400` weight)
**Hardware & Timer Font:** `'Press Start 2P', monospace` (`400` weight)
**Telemetry Console Font:** `'JetBrains Mono', monospace` (`400`, `700` weight)

**Character:** Friendly, rounded display headlines (`Fredoka`) soften the intensity of live voice calling, while bitmap (`Press Start 2P`) and CRT (`VT323`) faces anchor the countdown clock, queue rank, and live dialogue in playful retro hardware.

### Hierarchy
- **Display** (`700`, `26px`, `1.1` line-height, `Fredoka`): Screen topbar titles (`Discover`, `Getting you ready`, `Finding your match`) and match hero announcements (`It's a match`).
- **Headline** (`700`, `22px`, `1.15` line-height, `Fredoka`): Stage banner headlines above the phone frame and modal dialog titles.
- **Title** (`700`, `18px`–`20px`, `1.2` line-height, `Fredoka`): Primary pill CTA buttons (`Unlock Live`, `Connect 3-Min Call Now`) and caller names (`Kabir, 28 · Bengaluru`).
- **Body** (`400`, `18px`–`21px`, `1.35` line-height, `VT323`, max `65ch`): Screen descriptions, live voice dialogue captions, checklist items, and chat messages.
- **Label** (`400`, `8px`–`10px`, `1.45` line-height, `Press Start 2P`, uppercase): Status bar readouts, queue rank badges (`#1 PRIORITY`), token counters (`3 TOKENS`), and the bottom marquee band.
- **Telemetry** (`400`/`700`, `12px`–`15px`, `1.5` line-height, `JetBrains Mono`): PM Director's Console headings, edge-case buttons, North Star metric cells, and live event logs.

### Named Rules
**The No-Kicker Rule.** Headings (`h1`, `h2`, `h3`) never carry a small eyebrow or kicker label stacked directly above them; status pills sit inline inside a horizontal topbar beside the heading.

**The Tabular Clock Rule.** Every countdown timer (`03:00`), queue wait readout (`18 sec`), and North Star metric (`1.44`) enforces `font-variant-numeric: tabular-nums` so numerals never jitter during 1-second ticks.

## Layout

The application uses a two-column desktop split workbench (`.workbench`, `max-width: 1420px`, `grid-template-columns: minmax(0, 1.12fr) minmax(0, 1fr)`, `gap: 24px`, `padding: 14px 24px 22px`) flanked by a sticky top navigation bar (`.top-deck`) and a non-blocking, in-flow bottom Arcade Control Dock (`.arcade-dock`).

- **Left Stage (`.phone-stage`):** Centers the stage context banner (`.stage-banner`, `max-width: 620px`) above the `356px × 564px` retro phone shell (`.phone-shell`), flanked by floating comic speech bubbles (`.speech-bub`) positioned at the outer edges of `.phone-rig` (`max-width: 640px`) so they never overlap the phone screen.
- **Right Stage (`.director-console`):** Houses the 4-section PM Director's Console divided by `1px solid rgba(57, 255, 136, 0.35)` horizontal terminal hairlines.
- **Responsive Breakpoints:**
  - At `≤ 1180px`, floating outer speech bubbles hide so the phone rig breathes cleanly.
  - At `≤ 1024px`, `.workbench` collapses to a single column (`minmax(0, 1fr)`), stacking the PM Director's Console beneath the playable phone.
  - At `≤ 640px`, button grids (`.cmd-grid`, `.ns-formula`, `.guardrail-list`, `.tier-grid`) stack into single-column lists and the phone shell scales fluidly to `100%` container width with zero horizontal overflow.

## Elevation & Depth

Depth is strictly structural and neo-brutalist: surfaces sit flat on their ground and project sharp, zero-blur offset block shadows in solid ink.

### Shadow Vocabulary
- **Phone Hardware Shadow** (`box-shadow: 8px 8px 0 #2b0a00` on light screens; `10px 10px 0 #090014` on dark screens): Anchors the primary mobile device frame.
- **Banner & Pixel Frame Shadow** (`box-shadow: 5px 5px 0 #2b0a00`): Separates the stage narrative banner and `84px × 84px` pixel icon containers from the page background.
- **CTA Offset Shadow** (`box-shadow: 4px 4px 0 #ff5a36`): Highlights primary pill buttons inside the phone viewport.
- **Terminal Glow Shadow** (`box-shadow: 10px 10px 0 rgba(57, 255, 136, 0.28)`): Gives the right-hand PM Director's Console a distinct phosphor-terminal silhouette.

### Named Rules
**The Physical Press Rule.** Interactive buttons with offset block shadows translate toward their shadow on hover/active (`transform: translate(2px, 2px)` with shadow reduced to `1px 1px 0`) or tilt slightly (`scale(1.04) rotate(-1.5deg)` using exponential ease-out `cubic-bezier(0.22, 1, 0.36, 1)`).

## Shapes

The system contrasts soft, friendly mobile hardware geometry on the left with razor-sharp rectangular terminal geometry on the right:
- **Phone Frame (`.phone-shell`):** `32px` outer border radius with `4px solid` border.
- **Inner Cards & Caller Panes (`.caller-pane`, `.icebreaker-box`, `.chat-log`):** `14px`–`18px` border radius with `3px solid` borders.
- **Primary CTAs & Filter Chips (`.retro-cta`, `.filter-chip`):** Full pill geometry (`999px` radius). Filter chips alternate subtle `-2deg` and `+2deg` sticker rotations.
- **PM Director's Console (`.director-console`, `.term-btn`, `.ns-cell`):** `0px` square corners with crisp `1px`–`2px solid #39ff88` borders.

## Components

### Buttons
- **Primary Retro CTA (`.retro-cta`):** Full-width pill (`999px` radius), `3px solid #2b0a00` border, `#2b0a00` fill, `#fff0d6` text in `Fredoka 700 19px`, `4px 4px 0 #ff5a36` shadow. Gold variant (`.retro-cta.gold`) uses `#ffe600` fill with `#12060b` text on dark screens.
- **Call Control Grid Buttons (`.ctrl-btn`):** 4-column grid items (`12px` radius, `2px solid #fff0d6`, `#230b42` fill) with top SVG icon and bottom `Fredoka 700 13px` label. `.heart-btn.active` switches to `#ff5a36` fill with `#ffe600` border; `.extend-btn.active` switches to `#ffe600` fill.
- **Terminal Command Buttons (`.term-btn`):** Square `0px` radius, `1px solid #39ff88` border on `#04110a`, space-between flex layout in `JetBrains Mono 12px`. Active/hover states invert to `#39ff88` fill with `#020a05` text.

### Chips
- **Shared-Interest Filter Chips (`.filter-chip`):** Pill shape (`999px` radius), `2px solid #fff0d6`, `#280e4a` background, `#fff0d6` text in `Fredoka 600 15px`, alternating `±2deg` rotation. Selected state (`.active`) fills with `#ffe600` and `#12060b` ink.

### Cards / Containers
- **Split Caller Pane (`.caller-pane`):** `16px` radius, `3px solid #ffe600` border on `#210c3d` (`9px 11px` padding), housing an `8×8` pixelated `<canvas>` avatar (`48px × 48px`), caller metadata, SVG heartbeat polyline, and voice caption box.
- **Icebreaker Prompt Bridge (`.icebreaker-box`):** `14px` radius, `3px solid #ff5a36` border on `#2b0a00` (`8px 10px` padding) with inline `NEW` shuffle pill button.

### Inputs / Fields
- **Unlocked Chat Input (`.chat-input`):** `12px` radius, `3px solid #ffe600` border on `#0b0314` dark background, `#fff0d6` text in `VT323 19px`.

### Navigation
- **Global Stage Stepper (`.stage-stepper`):** 6 rectangular buttons (`1. LOCK` through `6. CHAT`) in `Press Start 2P 8px` inside `.top-deck`; active step uses `#ffe600` fill, `#12060b` text, and `3px 3px 0 #ffffff` shadow.
- **Phone Bottom Bar (`.phone-bottomnav`):** 5-column icon + `Press Start 2P 7px` label bar anchored at the bottom of `.phone-shell`.

### Pause-Menu Dialogs (`dialog.retro-dialog`)
- Native `<dialog>` elements styled after arcade pause menus: `4px solid #ffe600` border on `#1a0033` with `8px 8px 0 #ff5a36` shadow and a sticky `#ffe600` title bar (`.dialog-bar`).

## Do's and Don'ts

### Do:
- **Do** use authored inline `<svg>` icons from the unified geometric sprite sheet (`#ic-heart`, `#ic-lock`, `#ic-shield`, `#ic-mic`, `#ic-phone`, `#ic-flag`) and procedural `<canvas>` pixel art (`image-rendering: pixelated`).
- **Do** use exponential ease-out (`cubic-bezier(0.22, 1, 0.36, 1)`) or `steps(2)` for retro state transitions.
- **Do** keep one-sided heart taps visually indistinguishable from no-tap outcomes on Screen 5 to honor Sonder's zero-rejection product rule.
- **Do** keep all verification and location data 100% synthetic (`Zero-PII token`, `32×32` local pixel preview, coarse city zones).

### Don't:
- **Don't** place small kicker or eyebrow labels above `h1`, `h2`, or `h3` headings.
- **Don't** use raw Unicode emoji or dingbat glyphs in place of SVG icons.
- **Don't** use elastic/bounce easing (`cubic-bezier` with control points `> 1.0`), gradient text, decorative background grid overlays, or colored side-stripes (`border-left` > `1px`).
- **Don't** ingest or prompt for real Aadhaar numbers, government ID uploads, phone numbers, or exact GPS coordinates.

