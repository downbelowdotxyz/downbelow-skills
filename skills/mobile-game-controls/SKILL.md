---
name: mobile-game-controls
description: Choose screen orientation and touch controls for a mobile or mobile-web game based on its genre, then build them — virtual analog sticks (deadzone, response curve, fixed or floating), thumb-zone button layouts with icon buttons, axis remapping during special moves, HUD relocation, rotate prompts, and phone-size verification. Use when a game needs touch controls, when mobile controls feel wrong, are text buttons, or cover the HUD, or when deciding portrait vs landscape.
---

# Mobile Game Controls

Touch controls should feel like the game's genre, leave the play area visible, and expose every action the desktop version has. Decide orientation and scheme from how the game is played, mock the layout before writing code, then build and verify at real phone sizes. Works for browser games (DOM over canvas) and native or engine UIs; examples use web APIs. Use `game-ui-screens` for visual style and `playtest` for browser verification if they are available.

## 1. Inventory the inputs

List every action from the keyboard or gamepad bindings, with its type: continuous axis (steer, move, aim, throttle), held button (boost, wheelie, crouch), tap (jump, fire once, reset), or toggle (camera, map). Note actions with no touch equivalent today; missing actions are a common mobile bug. Note context switches, such as a key that changes meaning while another is held.

## 2. Choose orientation and scheme by genre

Read [orientation-by-genre.md](references/orientation-by-genre.md). Rules of thumb:
- **Landscape** when the player steers or aims continuously while doing other actions: racing, riding, shooters, action, sports, platformers, twin-stick. Two thumbs, one per side.
- **Portrait** for one-handed play: endless runners with swipes, puzzle, match-3, card, idle, tower defense, vertical scrollers.
- Follow the genre's convention over novelty. For example, racing games put steering or the stick under the left thumb and actions under the right. If the user asks for something unconventional, show both versions in the mockup and recommend the convention, with mirroring offered as a setting.

## 3. Pick the control types

- **Virtual analog stick** for continuous 2D input (steer + throttle, move, aim). It replaces 4 or more direction buttons and gives partial values. Read [analog-stick.md](references/analog-stick.md) for deadzone, curve, fixed vs floating, and multi-touch.
- **Icon buttons** for held and tapped actions, sized for thumbs, with the most-used action largest and closest to the thumb's resting point. No text labels on the play surface; use `aria-label` and a short onboarding hint instead.
- **Gestures** (swipe, tap anywhere) for portrait, one-thumb games.
- **Tilt** only as an option, never the default; it needs a permission prompt on iOS and is hard to play in bed or on transport.
- **Context remapping**: when a held action changes what the stick does (for example, balance during a stunt), mirror the desktop behavior and keep any value the remap would otherwise drop, such as latching the throttle when the stick's vertical axis switches to balance.

## 4. Mock it up first

Before writing code, show an interactive mockup at a phone landscape or portrait size: draggable stick, pressable buttons, readouts of the values they produce, and the HUD in its new positions. Get agreement on the side, sizes, and icons. This is cheaper than rebuilding the layout.

## 5. Build

Follow [layout-and-testing.md](references/layout-and-testing.md):
- Keep the input mapping pure (stick position in, game input out) so it can be unit tested.
- Feed analog values into the game's input path alongside keyboard input; sum and clamp so both work at once.
- Use pointer events with pointer capture, `touch-action: none`, and release every input on pointer cancel, lost capture, pause, and unmount.
- Move HUD elements out of the thumb zones; adjust only on touch (`(pointer: coarse)`), leaving desktop unchanged.
- Show a rotate prompt in the wrong orientation; browsers cannot reliably lock orientation outside fullscreen, and iOS Safari cannot lock it at all.
- Replace keyboard wording ("Press R") with touch wording when on touch.

## 6. Verify

Unit test the mapping (deadzone, full deflection, curve monotonic, clamping, remap modes). In the browser, check at least 740×360 and 667×375 landscape (or 375×812 portrait), the wrong orientation, and desktop. Drive the stick and buttons, confirm the game responds, and check for overlaps between controls and HUD as values grow (stats appearing, long names, multiplayer lists). Report anything not tried on a real device: multi-touch feel, safe areas on notched phones, and performance.
