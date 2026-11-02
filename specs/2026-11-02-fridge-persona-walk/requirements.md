# Fridge: the persona exits and returns (8e): requirements

Branch: `feature/fridge-persona-walk`

Roadmap item 8e (`specs/roadmap.md`). In the fridge advisor (`specs/2026-10-22-fridge-advisor/`, `specs/2026-10-29-fridge-film/`) the persona stands beside the closed fridge on step 1 and disappears when step 2 starts: fridge D22 says "The persona steps out after the intro", and the code hides it at the end of the camera's glide (`showFigure` in `js/fridge-advisor-scene.js`). Nothing on screen explains where it went, so it looks like a bug. Here the persona walks out of the frame instead, the fridge has the stage to itself for the tour and the sliders, and the persona walks back in for the result.

## Scope

**In:**

1. Leaving step 1: the persona turns and walks out of the frame to the right in about a second, with the rig's walk clip (D1, D2)
2. Steps 2 to 6: the fridge alone, as today (D3)
3. Arriving on step 7: the persona walks back in from the right and stands just right of the fridge, next to the open freezer, as the amount appears; it turns toward the viewer and idles (D4, D5, D6)
4. Step 7's camera pulls back a little, so the open freezer and the persona's head and upper body are side by side (D5)
5. Going back reverses each walk: 7 to 6 walks out, 2 to 1 walks back in (D7)
6. Reduced motion: the persona simply shows on steps 1 and 7 and not in between (D8)

**Out (not in this branch):**

- Any acting beyond walking and idling: opening the doors, carrying food, cheering (8b)
- Any change to the steps, copy, sliders, formula, food, doors, the cooling moment or the hand-over to the opening (fridge D4, D9 to D12, D15; 9a D1)
- The tour's freezer step (step 4) keeps its close-up; only the result gets the wider frame
- The panel, the sheet and its sizes (8d D1 to D4; 9b D24)

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **Out to the right** (interview): on leaving step 1 the persona turns to face right (its yaw eased to about +90 degrees in 0.2 s) and walks along x away from the fridge until it is outside the frame, then it is hidden (`visible = false`, so it costs nothing on steps 2 to 6). On desktop it passes behind the floating panel's edge on its way out; that is fine, it is still leaving the frame | Interview. Away from the fridge is the natural exit; the panel only covers the last part of the walk |
| D2 | **The walk:** the rig's `Walking_A` clip from `rig-medium-movement.glb` (already loaded by `createFigure()`; nothing new to download), looped while it moves, cross-faded from and back to `Idle_A`. About 1 s from its spot to outside the frame. The clip's `timeScale` is set from the distance and the duration so the feet do not slide, and the numbers (distance, duration, turn time, time scale) live in `js/fridge-advisor-config.js` under `figure.walk`, to tune by eye | Roadmap: "about 1 s, the rig's movement clip". One config object, as every other fridge number (fridge D7) |
| D3 | **Walk and camera together:** the walk starts with the camera's glide from the intro pose to step 2's, not before it, so step 2 is not delayed. The persona leaves the frame partly by walking and partly because the camera moves toward the fridge | The tour keeps its pace; a second of waiting on every Next would feel slow. Open question 1 checks it reads as walking out |
| D4 | **Back in on step 7:** the persona starts outside the frame on the right, already facing left, and walks to its result spot while the fridge door shuts, the frost passes and the freezer opens (fridge D15), so it arrives as the amount appears. At its spot it turns toward the viewer, a little toward the freezer, and goes back to `Idle_A` | Interview: "stands next to the open freezer as the amount appears" |
| D5 | **The result frame** (interview: close in, framed wider): step 7 gets its own camera pose, `result`, a little further back than the freezer close-up of step 4, so the open freezer with its food (still readable) and the persona's head and upper body stand side by side in the area the panel leaves free. The persona's result spot is closer to the fridge than its intro spot (`figure.result` in the config: x, z, yaw). Its legs may be cropped. On a phone (the docked panel, 8d D4) the same pose is framed in the free area above the panel | Interview. Keeps the freezer's contents readable while the persona is clearly there |
| D6 | **On arrival it only idles** (interview): no reaction to the amount; acting is 8b | Interview. Keeps 8b's scope whole |
| D7 | **Back reverses it:** Back from 7 to 6 turns the persona to face right and walks it out (then hidden); Back from 2 to 1 shows it outside the frame on the right, facing left, and walks it back to its intro spot, where it turns as on load. Back from 5 to 4 and similar keep it hidden | Roadmap: "Going back reverses it" |
| D8 | **Reduced motion** (system setting or `?reduced`): no walk and no turn; the persona is shown at its spot on steps 1 and 7 and hidden on steps 2 to 6, at once. The clip stays still, as today (`figure.update` skips the mixer) | AGENTS.md: every animation has a reduced-motion path. Roadmap |
| D9 | **Interruptions:** a newer step cancels a walk in progress (the scene's `seq` and `cancel(tween)` rule): the persona continues from where it is toward the new goal, or is hidden at once if the new step does not show it and it is already out of the frame. Fast Next and Back never leave it stuck halfway, facing the wrong way, or walking on the spot | A walk is a second long; people click faster than that |
| D10 | **Files:** `js/fridge-advisor-scene.js` (`showFigure` becomes a walk: position, yaw, the clip, the reverse; the `result` pose), `js/fridge-advisor-config.js` (`figure.result`, `figure.walk`, `camera.pose.result`, step 7's `stage: 'result'`). No change to `js/profile-persona-character.js` (`setLoop` with `timeScale` already exists), no new asset, page, storage key or dependency | Small, contained diff (AGENTS.md) |
| D11 | **Fridge D22 amended:** "The persona steps out after the intro" now means it walks out (D1 to D3) and comes back for the result (D4, D5). The rest of D22 (the framing of screens 2 to 7, the food sizes) is unchanged, except step 7's pose (D5) | Keeps the fridge spec's record straight |

## Context

- `js/fridge-advisor-scene.js` about line 444: `showFigure(on)` shows the persona at once, or hides it at the end of a tween as long as the camera's glide (`cfg.motion.glide`, 0.8 s); `goTo(step)` calls `showFigure(step.stage === 'intro')`, then `glideTo(step.stage)`, then the doors (with the cooling sequence on step 7, guarded by `seq`). The scene's own `tween()`, `cancel()` and `runTweens(dt)` drive every animation; with reduced motion the frame only renders when `dirty`.
- The persona is placed once at `cfg.figure` (x 1.2, z 0.35, yaw -0.4) with `figure.setLoop('Idle_A')`. `createFigure()` loads `rig-medium-movement.glb`, whose clips are `Running_A` and `Walking_A`; `setLoop(name, { timeScale })` cross-fades between loops (0 with reduced motion).
- `js/fridge-advisor-config.js` `STEPS`: step 4 (`tour-freezer`) and step 7 (`result`) both use `stage: 'freezer'`; `camera.pose.freezer` looks at the freezer from close (`width` 1.5, `height` 1.1, `fill`). The persona is about as tall as the fridge (seen in the browser at step 1).
- The camera frames each pose in the free area the panel leaves (`setFree`, 8d D8, D9), so a new pose works on desktop and on the phone without extra code.

## Open questions

1. Does the walk read as walking out when the camera glides at the same time (D3)? If not, the glide starts a little later, at most 0.3 s. Settled by eye in group 1.
2. Does `Walking_A` look right at the speed needed to leave the frame in about a second, or does `Running_A` (slower time scale) read better? Settled by eye in group 1.
3. The result spot and pose (D5): how far back the camera goes and where the persona stands so neither the freezer's food nor the persona's face is crowded, on desktop and at 390. Settled in group 2.
