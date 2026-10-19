# Mission

UZ Bank is an e-banking UX prototype that looks and behaves like a real banking app, and at the same time is the live showcase of Klaudiusz's design system. Every page runs the real tokens, components, motion and colour themes, so the design system is never shown as static documentation alone: it is shown working.

## Problem

Design systems are usually presented as component galleries and Figma files. That proves the parts exist, not that they hold together in a product. A banking app is a demanding test: dense data, trust, accessibility, flows with consequences. This prototype shows the system carrying a whole product, including the parts that are hard to show in Figma: motion, theming, legibility settings and personalisation.

## Who it's for

- **Viewers:** hiring managers, design leads and peers looking at Klaudiusz's work. They see a polished app; nothing should look unfinished or broken.
- **Klaudiusz:** the author, using it to explore and document design-system ideas (motion, colour, 3D) in a realistic context.

It is not a real bank: no accounts, no backend, no real money. All data is a local simulation.

## What it shows

- Everyday banking: Overview, Payments, Profile, account and custody account details, positions, bookings, payment and trade flows.
- Personalisation: User Type (three sliders set a profile and a 3D character), Legibility (type and spacing scale), Theme (colour themes, Monochrome or Multi-color, Light and Dark).
- The design system itself (admin only): Motion, Components, Character kit, and next a Playground.

## Principles

Durable reasoning behind decisions already made. Check a change against these before re-arguing it.

1. **Presentable at all times.** `main` is live. Nothing reaches it half done.
2. **The design system is the product.** Use tokens and existing components; when something new is needed, it becomes part of the system, documented on a design system page.
3. **Monochrome first, colour on purpose.** The default look is the UZ Bank navy on white and white on navy. Colour is spent in one place (the interactive accent), never sprinkled.
4. **Motion has a job.** Every animation explains a change (where you came from, what is new, what needs attention), and every one has a reduced-motion path.
5. **Accessible by default.** Contrast, keyboard, focus and legibility settings are part of the design, not a pass at the end.
6. **Simulation, not backend.** Data lives in the browser (`localStorage`); there is nothing to secure and nothing to sync.

## Non-goals

- Not a real banking product: no auth beyond the demo admin switch, no server, no real data
- Not a framework showcase: the stack stays deliberately plain (see `tech-spec.md`)
- Not the iOS app or the backend in `apps/`: this spec covers `apps/web`
