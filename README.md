# 🧡 Sonder — Reimagining the Dating Mechanism

> **A Product Teardown & Interactive POC**  
> *Author: Nidhish Javvadi | BITS Pilani | [LinkedIn](https://linkedin.com/in/nidhish-javvadi) | [GitHub](https://github.com/nidhishh)*  
> 📄 **[Download Presentation Deck v2 (PDF)](./Sonder_v2.pdf)** · **[Download Original Deck (PDF)](./SONDER.pdf)**  
> 🎮 **[Launch Interactive Web Prototype (GitHub Pages)](https://nidhishh.github.io/Sonder/)**

---

## 📌 Executive Summary

Dating apps face a category-wide retention and fatigue crisis: **75% of users report seeing fake or AI profiles**, while **2 in 3 app users have never met a match in person**. The traditional swipe-and-text paradigm imposes a massive "verification & effort gap" where daters spend ~5 days texting strangers only to find zero chemistry in person.

**Sonder** moves a verified voice to **Minute 1 of discovery**:
- **Real-Time Vibe Check:** Connects verified daters in a low-commitment, 3-minute live voice call *before* matching.
- **Concentrated Liquidity:** Runs scheduled **Live Hours (Thu–Sun, 9–11 PM)** in Bengaluru to achieve median queue wait times `< 40s`.
- **Zero Additional Infrastructure:** Built on existing RTC, audio calling, and paywall infrastructure that dating apps already own.
- **Immediate Trust & Signal:** Evaluates tone, humor, and chemistry upfront with mandatory pre-call verification and zero-rejection mutual opt-in.

---

## 🎮 Interactive Prototype (POC)

A zero-dependency interactive prototype is built directly into this repository in an arcade retro aesthetic (inheriting the visual DNA of [nidhishh.github.io/portfolio-website](https://nidhishh.github.io/portfolio-website/)).

### Running Locally
Simply clone and open `index.html` in any modern web browser:
```bash
git clone https://github.com/nidhishh/Sonder.git
cd Sonder
# Open index.html in your browser
```

### What's Inside the Prototype
1. **6-Stage Core Funnel (Left Phone Simulator):**
   - **Screen 1 (`1. LOCK`):** Curiosity lock badge building FOMO + Bengaluru Live Hour status pill + Freemium token tracker.
   - **Screen 2 (`2. SCAN`):** Pre-call liveness & ambient lighting scan (`32×32` local pixel preview with Zero-PII ingestion).
   - **Screen 3 (`3. QUEUE`):** Shared-interest filter chips (`Within 10 km`, `Travel`, `Music`) + transparent queue rank (`#1 Priority` for women vs. `#4` standard).
   - **Screen 4 (`4. CALL`):** Split-screen 3-minute voice call with live ECG voice waveform, rotating icebreakers, Mute, `Vibe ♥`, `Extend +3m`, and early `<30s` safe exit.
   - **Screen 5 (`5. MATCH`):** Mutual heart celebration (`It's a match ♥`) or zero-rejection neutral wrap screen (one-sided hearts stay 100% invisible).
   - **Screen 6 (`6. CHAT`):** Post-match chat seeded with the call's icebreaker + 1-tap call rating to train matching.
2. **PM Director's Console (Right Terminal Stage):**
   - **Persona Switcher:** Toggle between **Ananya (26, BLR · Women's Priority <25s)** and **Rohan (27, MUM · Wait ~40s)**.
   - **Freemium Tier Switcher:** Test `Free ₹0` (3 calls/hr), `Plus ₹499/mo` (unlimited + rematch), and `Priority ₹799/mo` (fast queue).
   - **Slide 6 Edge-Case Lab:** 1-click triggers for `<30s Hang-Up (0 Penalty + Token Refund)`, `>90s Queue Timeout`, `Mutual +3m Extend`, and `Abuse Mid-Call (1-Tap Report)`.
   - **Slide 8 North Star & Guardrail Telemetry:** Real-time formula breakdown (`1.44 = 6.0 calls/wk × 60% completion × 40% mutual heart rate`) and live event stream (`live_tab_view`, `verify_pass`, `queue_wait_s`, `call_completed`, `mutual_heart`).
3. **Keyboard Shortcuts:**
   - `[1–6]`: Jump across funnel screens
   - `[H]`: Toggle secret Vibe Heart
   - `[R]`: Shuffle new icebreaker prompt
   - `[E]`: Extend call (+3 minutes)
   - `[M]`: Toggle microphone mute

---

## 📊 Market Opportunity & Business Alignment

* **Dating Market Snapshot:** 82M online daters in India, 33M in top-8 metros, 37% already video-call before a first date (on WhatsApp without safety/verification).
* **Why Incumbents Won't Copy It (Innovator's Dilemma):** Incumbents monetize time inside the swipe feed (boosts, `Hinge+ ₹1,199/mo`, `HingeX ₹1,499/mo`). A call-first model shrinks time in the feed. A new app builds around the call; incumbents would cannibalize their primary revenue engine.
* **Bengaluru Beachhead Liquidity Math:**
  $$\ge 300\text{ callers live at once} \times 1\text{ in }10\text{ compatible (age, interests, }\le 10\text{ km)} \to \sim 30\text{ candidates} \to \text{wait } < 40\text{s}$$
  Packs demand into Thu–Sun, 9–11 PM (8 hours/week) so 2,000 verified users feel like a crowd.

---

## 🖼️ User Experience Flow

```
[ Locked Live Tab ] 
       │ (curiosity & FOMO, 9–11 PM live hour)
       ▼
[ Pre-Call Verification ] (face liveness, ambient lighting, zero-PII profile token)
       │
       ▼
[ Shared-Interest Queue ] (transparent queue position, median wait < 40s)
       │
       ▼
[ 3-Minute Live Voice Call ] (icebreaker prompts, split-card UI, +3m mutual extend)
       │
       ▼
[ Instant Mutual Match ] (both tapped heart → unlocks direct chat; one-sided hearts stay hidden)
```

---

## 🛡️ Risk Matrix & Mitigations (Slide 8 Spec)

| Critical Risk | Severity | Mitigation Strategy | Telemetry Metric |
| :--- | :--- | :--- | :--- |
| **Cold Start / Empty Queue** | High | One city first, Live Hours 9–11 PM Thu–Sun, 2,000-verified launch gate. | Median wait (`< 40s`) |
| **Gender Imbalance (~26% women)** | High | Women-first invites, priority queue placement, women set call filters. | Women's wait (`< 25s`), M:F ratio |
| **Safety & Bad Actors** | High | 3 layers: ID + selfie verify, pre-call AI scan, one-tap mid-call report. | Reports per 1,000 calls (`< 5`) |
| **Call & Social Anxiety** | Medium | Voice-first v1, strict 3-minute hard stop, shuffleable icebreakers. | Call completion rate (`> 60%`) |
| **Privacy (DPDP Act 2023)** | Medium | No raw audio recorded; consented, time-boxed metadata retained for review. | Data requests & zero PII |

---

## 📂 Repository Contents
```text
.
├── index.html              # Main interactive prototype (Phone Simulator + PM Console)
├── styles.css              # Hybrid Level-Shifter retro theme & responsive layout
├── app.js                  # State machine, procedural pixel sprites, audio synth & telemetry
├── PRODUCT.md              # Product truth, personas, positioning & Zero-PII guardrails
├── DESIGN.md               # Normative design system tokens, tonal ramps & component rules
├── Sonder_v2.pdf           # Full high-resolution product case presentation deck (v2)
├── SONDER.pdf              # Original presentation deck
└── .impeccable/            # Design system sidecar & verification review captures
    ├── design.json         # Extended design system machine-readable sidecar
    └── review/             # Verification review captures (desktop, mobile, call stage)
```

---

## 📄 License & Attribution
Product Strategy & Architecture by **Nidhish Javvadi**. Created as a product case teardown and proof-of-concept for live discovery in modern dating.
