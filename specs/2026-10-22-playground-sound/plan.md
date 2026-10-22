# Playground sound: plan

Branch: `feature/playground-sound`. Decisions are cited as D1 to D15 from `requirements.md`.

Each group ends with something to hear or see in the browser (`cd apps/web && npm run dev`, `http://localhost:5174/overview.html`, signed in as admin, then open the Playground). On the feature branch each group is committed on its own once implementation is approved. Nothing is merged to `main` without an explicit ask.

## 1. Sound files and the audio module

What you hear: from the browser console, with the module loaded, a step and a coin play on demand.

- [x] Convert the chosen files (D1) to mono 16-bit 44.1 kHz WAV with `afconvert` and copy them to `apps/web/assets/audio/playground/`: `step-town-1..4.wav`, `step-forest-1..4.wav`, `coin.wav`, plus `License.txt` from Kenney Impact Sounds (D2)
- [x] `js/playground-config.js`: add the `sound` block (volumes, spreads, `footPhases`, coin ladder), with a comment like the other blocks (D14)
- [x] `js/playground-audio.js` (new): `AudioContext` created in `unlock()`, buffers fetched at load and decoded after, `footstep(surface)`, `coin()`, `suspend()`, `resume()`, `setMuted()`; one-shot sources through a per-sound and a master gain; failure leaves the game silent (D3, D4, D7, D8)

## 2. Footsteps

What you hear: press Start and the runner's feet land in time with the animation, faster for Max than for Beat, on hard ground, and on grass once the forest starts.

- [x] `js/playground.js`: call `audio.unlock()` in the Start and Play again handlers (D4); read the run action's phase each frame in the `running` state and play a step on each `footPhases` crossing; pick the surface from `s` against `CONFIG.forest.from` (D5, D6)
- [x] Read the `Running_A` foot-contact phases from the clip and set the starting `footPhases`; tune by ear
- [x] Check all three profiles (Beat, Lena, Max) and a Safari run (D2) (not done: only Lena in Chrome; no Safari, see validation.md)

## 3. Coin sound

What you hear: every coin you collect pings; a quick run of pickups climbs in pitch and the next coin after a pause starts low again.

- [x] `js/playground.js`: call `audio.coin()` once per frame in which `coins.collect` returns more than zero (D8)
- [x] Tune `window`, `stepSemitones`, `maxSteps` and the footstep/coin balance by ear (D14)

## 4. Mute button and remembered setting

What you see: a round sound button left of the close button; clicking it mutes and unmutes instantly and survives a reload.

- [x] `playground.html`: the button beside the close button, with `#i-volume-2` and `#i-volume-x`, `aria-pressed` and a state-dependent `aria-label` (D10)
- [x] `css/styles.css`: placement and style matching the close button, in `--color-*` tokens, focus ring `--color-fg-interactive`; at 390px the top row (name, balance, sound, close) must not overlap, otherwise the HUD name wraps or shortens
- [x] `js/playground.js` and `js/playground-audio.js`: read and write `uzBankWebPlaygroundSound` (D11), `setMuted`
- [x] Hide the button in the still (reduced motion) version (D9)

## 5. Pause, hidden tab, still version

What you hear: nothing under the Quit dialog or in a background tab; no sound at all in `?reduced`.

- [x] `js/playground.js`: `audio.suspend()` when the state becomes `paused`, `audio.resume()` on Keep playing; suspend on `visibilitychange` hidden (D13)
- [x] Confirm no footsteps or coin sound in `?reduced` (D9)
- [x] Confirm Quit run, finish and Play again start from a clean audio state (no stuck loop, no step from the previous run)

## 6. Wrap-up

- [x] `npm run build` in `apps/web` succeeds and `dist/` contains `assets/audio/playground/`
- [ ] Run `validation.md`, including the baseline smoke test copied there; fill in the "Checked on" line (partly run; the baseline smoke test and by-ear checks are left for Klaudiusz)
- [x] Docs: mark roadmap item 5 done; `CHANGELOG.md` under `Unreleased` (Added: the sounds, the mute button, the new key and the assets; Changed: payday-run D3 superseded); `apps/web/README.md` (the key, `playground-audio.js`, `assets/audio/playground/`); `specs/tech-spec.md` (storage keys, a line under Other systems for Web Audio and the "no sound" mention if present)
- [x] Note in `specs/2026-10-19-payday-run/requirements.md` D3 that sound was added by this spec
