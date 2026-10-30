# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

static HTML/CSS/JS (zero-dependency single-page prototype matching `nidhishh.github.io/portfolio-website/` for instant local execution and GitHub Pages deployment)

## Users

- **Primary Dater Personas (Urban India, ages 21–32, Bengaluru beachhead):**
  - **Ananya (26, Marketing Manager, Bengaluru):** Safety-first dater who screens profiles for days because 78% of Indian women encounter fake profiles; needs to confirm a match is real and safe in minutes before investing a week of texting.
  - **Rohan (27, Investment Banker, Mumbai/Bengaluru):** High-intent dater suffering from low reply rates (~26% women supply constraint); needs a guaranteed 3-minute live voice conversation so his humour and personality are heard rather than skimmed past.
- **Evaluators / Viewers:** Product managers, hiring panels, and peers reviewing the Sonder v2 product case deck (`Sonder_v2.pdf`) via the Slide 6 clickable prototype link.

## Product Purpose

Sonder is a verified, live-first dating app for urban India where discovery happens on a time-boxed **3-minute voice call** during scheduled **Live Hours (Thu–Sun, 9–11 PM)** *before* matching—replacing a week of low-conviction text screening with a real chemistry signal by Minute 1.

Success is measured by the North Star metric: **Mutual hearts per weekly active caller** (target `≈ 1.4` = `6 calls/wk` × `60% completion` × `40% mutual-heart rate`), without optimizing for addictive swipe-feed session time.

## Positioning

Every incumbent (Tinder, Bumble, Hinge) gates voice/video calling *after* the match because their revenue depends on keeping users inside the swipe feed (`Hinge+ ₹1,199/mo`, `HingeX ₹1,499/mo`). Omegle offered instant live calls but shut down due to zero verification and safety failures. Sonder occupies the empty **Fast + Verified** quadrant: mandatory pre-call verification + interest/proximity queue (`< 40s` wait) + 3-minute voice-first call + mutual-only `♥` match.

## Operating Context

- Used primarily during concentrated **Bengaluru Live Hours (9–11 PM, Thu–Sun)** to guarantee local liquidity (`≥ 300` concurrent callers, `< 40s` median wait).
- Evaluated alongside `Sonder_v2.pdf` and Nidhish's portfolio (`https://nidhishh.github.io/portfolio-website/`), requiring both the 6-stage mobile caller experience and a live **PM Director's Console** to inspect personas, edge cases, and AARRR/Guardrail telemetry.

## Capabilities and Constraints

- **6-Stage Core Loop:**
  1. `Locked Live Tab` (`live_tab_view`) — FOMO curiosity hook + Live Hour countdown + Freemium token counter.
  2. `Pre-Call Verification` (`verify_pass`) — Face visibility, profile match, and ambient lighting/mic check before entering the queue.
  3. `Fair Queue` (`queue_wait_s`) — Shared interest chips (`Age 24–30`, `Within 10 km`, `Travel`, `Music`), live queue position (`#4 in queue · ~40s`), and women's priority queue (`< 25s`).
  4. `3-Minute Voice Call` (`call_completed`) — Split-screen dark UI (caller on top, you below), `03:00` hard-stop timer, shuffleable Icebreaker Prompts, live audio/ECG waveform, Mute, `♥ Vibe`, `+3 min Extend` (requires mutual tap), `Pass / Hang Up`, and one-tap `⚑ Report`.
  5. `Instant Mutual Match` (`mutual_heart`) — Both tapped `♥` unlocks chat immediately; **one-sided hearts remain 100% invisible** (zero rejection signal).
  6. `Unlocked Chat & Post-Call Rating` (`rate_call`) — Direct chat seeded with the call's icebreaker + post-call vibe rating to train the matching engine.
- **Edge Cases (Slide 6 Spec):**
  - **No match in 90s:** Offer next Live Hour slot + priority pass.
  - **Hang-up `< 30s`:** No call-limit penalty, token refunded, immediate re-queue, no `♥` asked.
  - **Abuse mid-call:** One-tap end + report; time-boxed session metadata logged without recording audio.
  - **One-sided `♥`:** Nothing shown; no rejection signal.
- **Freemium Tiers (Slide 5 Spec):**
  - `Free (₹0)`: 3 calls / Live Hour, mutual `♥` chat.
  - `Plus (₹499/mo)`: Unlimited calls, `+3 min` extend, rematch.
  - `Priority (₹799/mo)`: Priority queue, see who `♥` you.
- **Privacy & Zero-PII Guardrail (Mandatory):** Never ingest, prompt for, or store real government IDs (e.g., Aadhaar), phone numbers, or exact GPS coordinates. Use privacy-safe simulated verification tokens, optional local-only pixelated camera preview, and coarse city-zone labels (`Bengaluru · Indiranagar`).

## Brand Commitments

- **Retro Portfolio Aesthetic (`nidhishh.github.io/portfolio-website/`):**
  - Typography: `Fredoka` (rounded display & tactile buttons), `Press Start 2P` (8-bit headers, countdowns, badges, marquee bands), `VT323` (retro CRT dialogue & body), `JetBrains Mono` (PM Director's Console & telemetry HUD).
  - Hybrid Level-Shifter Palette:
    - **Level 1 (Locked Tab & Pre-Call Check):** Vermilion (`#ff5a36`), Butter Cream (`#fff0d6`), Deep Espresso Ink (`#2b0a00`).
    - **Level 2 (9–11 PM Queue & 3-Min Call):** Deep Arcade Violet (`#1a0033`), Coin-Op Yellow (`#ffe600`), Neon Magenta (`#ff2bd6`), Cyan (`#2bd9ff`).
    - **Level 3 (PM Director's Console & Telemetry HUD):** Terminal Obsidian (`#04110a`), Phosphor Green (`#39ff88`), Mint Text (`#d8ffe8`).
  - Signature Motifs: `4px` solid ink borders with `8px 8px 0` hard offset shadows, `8×8` & `16×16` pixel-art canvas avatars that bob and morph, animated SVG heartbeat/voice polyline, scrolling `★ SWIPE LESS ★ TALK MORE ★` marquee ticker bands, giant outlined `.ghost` backdrop text, and pause-menu `<dialog>` modals.

## Evidence on Hand

- `Sonder_v2.pdf` (8-slide product case deck with market sizing, personas, positioning 2×2, MoSCoW, 5-screen prototype spec, 3-phase GTM, and North Star/AARRR metrics).
- `https://nidhishh.github.io/portfolio-website/` (incumbent retro design language and Level 01 Sonder mini-widget).
- All caller interactions, queue metrics, and telemetry events in the POC are illustrative/synthetic demonstrations and must be clearly labeled as such.

## Product Principles

1. **Trust Before Talk, Voice Before Text:** Verification happens before the queue, and a 3-minute voice call happens before any profile swipe or text chat.
2. **Low Stakes, Zero Rejection:** A strict 3-minute hard stop, voice-only default, `< 30s` no-penalty bailout, and invisible one-sided hearts remove social and call anxiety.
3. **Design for the Supply Constraint:** Because women represent ~26% of Indian online daters and carry higher safety risk, women get priority queue placement, filter control, and 3-layer safety guardrails.
4. **Fast Matches That Leave the App Are a Win:** Optimize for `Mutual hearts per weekly caller (≈ 1.4)` and `< 40s` queue waits—never for time-in-feed.

