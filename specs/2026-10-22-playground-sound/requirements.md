# Playground sound: requirements

Branch: `feature/playground-sound`

Roadmap item 5 (`specs/roadmap.md`). The sound follow-up that Payday run left out (payday-run D3). Two sounds only: footsteps and a coin pickup.

## Scope

**In:**

1. Footsteps that follow the run clip's foot contacts, on hard ground in the town and on grass in the forest
2. A coin pickup sound whose pitch climbs for quick consecutive pickups
3. Web Audio API playback of recorded CC0 samples (Kenney), no library
4. A mute button in the HUD, remembered in a new key `uzBankWebPlaygroundSound`
5. Audio that pauses with the Quit dialog and when the tab is hidden
6. Volumes and the pitch steps in `js/playground-config.js`

**Out (not in this branch):**

- Any other sound: gates, chest, the payday burst, the result screen, UI clicks, music, ambience (see D12)
- Sound in the still (reduced motion) version (D9)
- A volume slider (mute on or off only)
- Gameplay changes (roadmap item 6)
- Settings dialog (visual parameters, theme; possibly the mute button): deferred to roadmap item 7

**Agreed before this spec, confirmed and not re-opened:** Kenney CC0 recordings, copied only the chosen files into `apps/web/assets/audio/`; Web Audio API, no library; footsteps triggered by the run clip's foot contacts (two per cycle) so they follow each profile's `timeScale`, with random variation plus a small pitch and volume spread; the surface switches with the forest; the coin pitch rises for quick pickups and resets after a short pause; sound starts with the Start button, on by default; the HUD mute button is remembered; audio pauses with the Quit dialog and a hidden tab; no footsteps in the still version; volumes and pitch steps in the config.

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | Source files, all from Kenney (CC0): **town footsteps** `footstep_concrete_000` to `_003` (Impact Sounds, 0.11 s each); **forest footsteps** `footstep_grass_001` to `_004` (Impact Sounds, 0.59 to 0.69 s each; `_000` is left out, it is the longest at 0.78 s); **coin** `impactMetal_light_001` (Impact Sounds, 0.25 s). Kenney has no coin pack, so the coin is a short metal ping that stays clean when pitched up. Four variations per surface avoid a machine-gun repeat; the same one is never played twice in a row | Interview. Chosen by file length and role, not by ear, so they can be swapped at review. Alternatives named in the interview: `chip-lay-1` (softer, shorter) and `impactBell_heavy_002` (musical but 0.7 s, blurs in a run of 100 coins) |
| D2 | Format: converted to **mono 16-bit WAV at 44.1 kHz** with `afconvert` and shipped as `.wav`. Safari's Web Audio does not reliably decode Ogg Vorbis, WAV decodes everywhere. Mono, because the sounds are played on a stereo bus and the source stereo is not worth doubling the size. About 330 KB for all nine files; the licence text is copied beside them (`License.txt`) | The brief asks to check Safari and convert if needed. WAV has no encoder delay (AAC adds a leading gap that would hit the 0.11 s footsteps). If the size matters later, AAC is the fallback |
| D3 | One new module, `js/playground-audio.js` (ES module, no dependency): creates the `AudioContext` on the Start click, decodes the buffers once, exposes `unlock()`, `footstep(surface)`, `coin()`, `suspend()`, `resume()`, `setMuted(bool)`. Sounds play as one-shot `AudioBufferSourceNode`s through two gain nodes (a per-sound gain and a master gain). Sample files are fetched at page load (bytes only) and decoded after the context exists | Keeps the game files free of Web Audio detail; another named sound later is one table entry (D12). Fetching early hides the load, decoding after unlock works in Safari |
| D4 | Autoplay rule: the `AudioContext` is created and resumed inside the Start (and Play again) click handler, which is a user gesture inside the Playground page (also when it runs in the sheet's iframe). Nothing plays before it. If creation or decoding fails, the game runs silently and the mute button stays visible but harmless | Browser rule; sound failure must never break the game |
| D5 | Footsteps are triggered from the run clip's phase, not a timer. Each frame the loop reads the running action's normalised time; when it crosses one of the contact phases in `CONFIG.sound.footPhases` (two per cycle, starting values from reading the `Running_A` foot bones, tuned by eye and ear), one step plays. Because the action's `timeScale` is already the profile's (0.8, 1, 1.25), Beat, Lena and Max get their own cadence for free. Steps play only in the `running` state, never while paused, idle or finished | Roadmap and the brief: "triggered by the run clip's foot contacts". Phase crossing survives dropped frames and pausing because it follows the clip, not the clock |
| D6 | Surface: `s < CONFIG.forest.from` is `town` (concrete), otherwise `forest` (grass). One check per step | The surface switches with the forest, which has a single start distance |
| D7 | Variation per step: a random pick among the surface's samples (never the one just used), `playbackRate` spread of plus or minus `pitchSpread` (starting 6 percent), gain spread of plus or minus `volumeSpread` (starting 15 percent). All in config | Brief. Cheap and enough to avoid repetition |
| D8 | Coin pitch ladder: each pickup within `coin.window` seconds (starting 0.5) of the previous one raises the pitch by `coin.stepSemitones` (starting 1), up to `coin.maxSteps` (starting 8, so about an octave less a tone); after the window passes without a pickup the next coin starts at the base pitch. `playbackRate = 2 ^ (steps * stepSemitones / 12)`. Several coins collected in one frame play as a single sound at the next rung, not one voice each | Brief, tunable. One voice per frame keeps a burst of 100 coins from becoming a wall of noise. Not a musical scale: simple semitone steps; tuned by ear |
| D9 | Reduced motion (the still version): no footsteps, and no coin sound either, since nothing is picked up one by one there. The mute button is hidden in the still version because there is nothing to mute | Brief: "no footsteps". Coin sounds follow from the same logic, recorded here so it can be overruled |
| D10 | Mute button: a 44 px round button top right, immediately left of the close button, in the same style as it (`view__nav-btn` look, neutral inks, visible focus ring in `--color-fg-interactive`). Icons `#i-volume-2` (on) and `#i-volume-x` (muted), both already in the sprite. A toggle button: `aria-pressed`, label "Sound" with the state in `aria-label` ("Mute sound" / "Unmute sound"). Muting sets the master gain to 0 (it is not a pause), so unmuting mid-run is instant. The setting is read at page load; first visit is on | Interview: top right, left of the close button. The existing sprite icons avoid new assets |
| D11 | Storage: new key `uzBankWebPlaygroundSound`, `"on"` or `"off"`, written when the button is toggled, read at load (missing or unreadable means on). Listed in `apps/web/README.md` and `specs/tech-spec.md`. Storage failures are swallowed like `uzBankWebPlaygroundBest` | AGENTS.md: keys start with `uzBankWeb` and are listed. Same try/catch pattern as the best run |
| D12 | Gates, chest, the payday burst and the result screen get no sound in this branch. Noted as a possible follow-up; the audio table in `playground-audio.js` is written so one more named sound is a config entry plus one call | Interview: two sounds only. Kept open for roadmap item 6 |
| D13 | Pause behaviour: `audio.suspend()` when the state becomes `paused` (the Quit dialog is open, by Escape, the close button, blur, rotation or a hidden tab) and `audio.resume()` on Keep playing; also on `visibilitychange` when hidden. Quit run or finishing closes the context's playback (suspend) and the next Start resumes it. Sounds already playing are cut by suspension, not left to ring out | Brief. `AudioContext.suspend()` freezes in-flight tails exactly where they were, so nothing plays under the dialog |
| D14 | Volumes in `CONFIG.sound`: `master 1`, `footstep 0.35`, `coin 0.6`, per-surface multipliers (`town 1`, `forest 0.9`), `pitchSpread`, `volumeSpread`, `footPhases`, the coin ladder. Starting values, tuned by ear. Footsteps quiet, the coin clear | Interview: footsteps a background rhythm, coin the reward |
| D15 | A page script for sound is not added to `playground.html`; `js/playground.js` imports `./playground-audio.js`. The mute button is added to the page markup inside `.view__main` beside the close button. No new page, so the five-place registration does not apply | Same module graph as the other `playground-*.js` files |

## Context

- `js/playground.js` already has the game states (`ready`, `running`, `paused`, `stepping`, `finished`) and the single `setState` that calls `figure.setLoop(CONFIG.runClip, { timeScale })` (about line 306). The sound hooks go there and in the loop.
- Pauses already funnel through `requestQuit()` (about line 423), which sets `paused`; `visibilitychange`, `blur` and rotation call it. Audio only needs to follow the state, no second pause path.
- Coins: `coins.collect(s, x)` returns the number picked up this frame (about line 390), the right place for D8.
- Top bar today: HUD pill left, balance centred, close button right. The new button goes beside the close button (`.playground__close`).
- The Playground opens in a sheet iframe (payday-run D19); a user gesture inside the iframe is enough for audio.
- `specs/2026-10-19-payday-run/requirements.md` D3 ("No sound in v1") is superseded by this spec.

## Open questions

- Exact foot-contact phases of `Running_A`: read from the clip's foot bones while building, then tuned by ear (D5).
- Whether `footstep_grass` tails (0.6 s) overlap too much at Max's pace; if so, trim the samples with `afconvert` or lower the gain (D14).
