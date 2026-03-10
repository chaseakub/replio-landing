# Replio Landing Page Builder — Cinematic Mutator Architecture

## Role & Execution Directive

Act as a World-Class Senior Creative Technologist and Lead Frontend Engineer. Build a high-fidelity, cinematic "1:1 Pixel Perfect" landing page for Replio. Every element should feel like a premium digital instrument built for serious QSR operators. This is not a generic SaaS landing page — it is a statement.

---

## Brand Brief (Pre-Loaded — Do Not Ask)

**Brand:** Replio
**Website:** ReplioHQ.com
**Core Thesis:** One dashboard. Every platform. Zero missed guests.
**Secondary Tagline:** Built by an operator. For operators.
**Founded by:** Chase Kubala — Multi-Unit Chick-fil-A Operating Partner, Houston TX

**3 Core Pillars:**
1. **Universal Dashboard** — Every review from Google, Yelp, Facebook, DoorDash, TripAdvisor in one place. Stop switching between 7 apps.
2. **AI Response Engine** — HEARD-based AI drafts personalized responses instantly. Operator approves in one click. Sounds like you wrote it.
3. **Zero Missed Guests** — Urgent alerts for serious issues. Daily digest in under 2 minutes. Never find out about a problem from a 1-star review again.

**Key Stats (use as live data elements):**
- 97% of guests read reviews before visiting
- 1-star drop = 5–9% revenue loss
- Average operator takes 72 hours to respond
- $8K additional revenue per star increase on Yelp
- 73% of all restaurant reviews live on Google

**CTA:** Join the Founding Operators Waitlist → ReplioHQ.com

---

## Aesthetic Archetype — Custom Replio Dark (Based on Archetype 2: Obsidian Vault)

Override the standard Obsidian Vault palette with Replio's exact brand colors:

| Token | Value |
|---|---|
| Background | `#140606` |
| Primary Accent | `#E4002B` |
| Dark Red (secondary) | `#8C0016` |
| Card Background | `#1F0808` |
| White | `#FFFFFF` |
| Muted Text | `#A08080` |
| Light Gray | `#D4B8B8` |

**Typography:**
- Headings: `"Syne"` — bold, modern, premium
- Drama/Pull Quotes: `"Playfair Display"` Italic
- Data/Stats: `"JetBrains Mono"` — gives operator dashboard feel
- Body: `"DM Sans"`

**Visual Identity Rules:**
- Dark near-black everything. Red is used sparingly — only for the most important elements.
- Platform logos (Google, Yelp, Facebook, DoorDash, TripAdvisor) must appear as glowing cards or animated tiles.
- Stats must feel LIVE — animated counters, not static numbers.
- The word "REPLIO" should appear at least once in massive display type.
- Every button must feel physical — `scale-[0.97]` on active, red glow on hover.
- Red accent bars, borders, and dividers throughout.

---

## Structural Typology — D: The Linear Narrative (Cinematic Scroll)

- Classic vertical orientation with heavy use of GSAP `pin: true`
- Hero pins in place as user scrolls, fading into the background
- The 3 Pillar cards stack on top of each other dynamically as user scrolls through
- Platform cards (Google, Yelp, etc.) animate in one by one as user reaches that section
- Stats counter up when they enter the viewport
- Final CTA section rises from the bottom with a red glow

**Section Order:**
1. **Hero** — Full screen. "REPLIO" massive. Tagline. Animated platform logos orbiting or flowing in. CTA button.
2. **The Problem** — Stats animate in. Pain points hit hard. "You find out about problems from a 1-star review."
3. **Pillar 1** — Universal Dashboard (mock dashboard UI element)
4. **Pillar 2** — AI Response Engine (show a mock review with AI response generating in real time)
5. **Pillar 3** — Zero Missed Guests (HEARD framework visual)
6. **Social Proof** — Operator quote, stats wall
7. **CTA** — Founding Operators Waitlist. Red. Cinematic. Final.

---

## Fixed Interaction System

- **Global Noise:** Apply SVG `<feTurbulence>` noise layer over entire page (subtle, adds texture)
- **Animation Backbone:** GSAP `power3.out` for all entrances
- **Cursor:** Custom red dot cursor that scales up on hover over interactive elements
- **Scroll Progress:** Thin red line at top of viewport showing scroll progress
- **Buttons:** Physical feel — `scale-[0.97]` on active, red glow `box-shadow: 0 0 20px #E4002B` on hover
- **Platform Cards:** Subtle red glow on hover, smooth lift animation
- **Stats:** Count up animation using GSAP when entering viewport

---

## Tech Stack

```bash
npm create vite@latest replio-landing -- --template react
cd replio-landing
npm install gsap lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Import Google Fonts in `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Playfair+Display:ital@1&family=JetBrains+Mono:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
```

GSAP via npm (already installed above) — register ScrollTrigger in `App.jsx`:
```js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
```

---

## Execution Sequence

1. **Analyze & Map:** Replio Dark Archetype + Linear Narrative Typology = a cinematic, dark, operator-grade scrolling experience with pinned hero and stacking pillar reveals.
2. **Draft Copy:** Write all copy in Chase's voice — direct, operator-first, no fluff. Stats lead. Pain first. Solution second.
3. **Scaffold:** Run the setup commands above.
4. **Implement:** Write complete `App.jsx` as a single file. All CSS via Tailwind + inline styles for brand colors. All animations via GSAP ScrollTrigger.
5. **DOUBLE-CHECK PROTOCOL (CRITICAL):**
   - Are there placeholder images? (FAIL — use CSS gradients and SVG elements only, no external images)
   - Is it a standard linear page without GSAP pin animations? (FAIL)
   - Are platform logos missing? (FAIL — Google, Yelp, Facebook, DoorDash, TripAdvisor must all appear)
   - Are stats static? (FAIL — all stats must animate on scroll entry)
   - Does the red accent feel random? (FAIL — red is reserved for the most important elements only)
   - Fix all issues before presenting.
6. **Deliver:** Full working `App.jsx` ready to run. Open in browser with `npm run dev`.

---

## Final Standard

This landing page should make a QSR operator stop scrolling and think: *"Someone finally built this for me."* It should feel premium, operator-grade, and like nothing else in the restaurant tech space.

---

## Security Playbook

### Authentication & Sessions
- Set session expiration limits. JWT sessions should never exceed 7 days and must use refresh token rotation.
- Never use AI-built auth. Use Clerk, Supabase, or Auth0.
- Keep API keys strictly secured. Use process.env keys.

### Secure API Development
- Rotate secrets every 90 days minimum.
- Verify all suggested packages before installing.
- Always opt for newer, more secure package versions.
- Run npm audit fix after every build.
- Sanitize all inputs using parameterized queries always.

### API & Access Control
- Enable Row-Level Security in your DB from day one.
- Remove all console.log statements before deploying production domain.
- Use CORS to restrict access to your allow-listed production domain.
- Validate all redirect URLs against an allow-list.
- Add auth and rate limiting to every endpoint.

### Data & Infrastructure
- Cap AI API costs within your code and dashboard.
- Add DDoS protection via Cloudflare or Vercel edge config.
- Lock down storage access so users can only use their own files.
- Validate upload limits by signature, not by extension.
- Verify webhook signatures before processing payment data.

### Other Rules
- Review permissions server-side — UI-level checks are not security.
- Log critical actions: deletions, role changes, payments, exports.
- Build real account deletion flows.
- Automate backups then actually test them. An untested backup is useless.
- Keep test and production environments fully separate.
- Never let webhooks touch real systems in the test environment.
