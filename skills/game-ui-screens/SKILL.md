---
name: game-ui-screens
description: Design, restyle, or audit a game's menus, HUD, loading screens, modals, and onboarding so they look and behave like in-game screens rather than web pages — one style contract taken from the strongest existing screen, in-game navigation conventions, and a viewport check matrix. Use when screens "look off", "too plain", "scrunched", inconsistent, or like a website, when building new screens, or when renaming player-facing names.
---

# Game UI Screens

Make every screen feel like part of the same game. Work from the game's own best screen rather than generic web styling, keep navigation game-like, and check every screen at the sizes players use. Adapt to the UI technology (DOM over a canvas, engine UI, or in-scene UI). Use `game-foundation` for the screen flow itself if it is available; this skill covers how screens look and behave.

## 1. Inventory

List every screen and overlay, including the ones that are easy to forget: title, main menu, each mode menu, garage or loadout, settings, lobby or room screens, join and invite flows, loading, pause, results, errors, empty states, the HUD, and dev-only screens. For each, note the file, how it is reached, how it is left, and whether it needs a server or saved data to appear. Screens that need the game server must be run with it, or reported as unverified.

## 2. Extract the style contract

Pick the anchor: the screen that already looks most like the game (usually the title or main menu). Write down its rules before touching other screens: typefaces and title treatment, color tokens, background (live 3D scene, blurred backdrop, art), panel shapes, button states (idle, hover, focus, pressed, disabled), spacing scale, motion, and sound cues. Put the shared parts into tokens or shared classes so screens cannot drift. Read [style-contract.md](references/style-contract.md) for the template and the in-game conventions.

## 3. Apply

- **Full-screen game layouts, not web cards.** No document scroll on desktop; modals fit the viewport; long lists scroll inside their own panel.
- **Game navigation.** Esc or the back control leaves every screen; keyboard and gamepad focus moves predictably with a visible focus state; the primary action is obvious.
- **Onboarding gates as a flow.** If a name or profile is required before some modes, ask for it in one short start step (name field + Play) instead of showing a menu full of locked buttons. Keep the same validation in settings so a later edit cannot break it.
- **One entry where one suffices.** Do not ask players to choose between options that lead to the same place (for example three spawn points on one map); give one primary action and offer the variants inside the game.
- **HUD hierarchy.** Read [hud-and-loading.md](references/hud-and-loading.md). Every number labeled, nothing that reads like debug output, contextual elements only when relevant.
- **Loading screens** have motion that matches the game, real progress where available, and no flash for short loads.
- **Spacing scales with viewport height** (`clamp()` or viewport units) so tall menus neither cram together nor spread out on large screens.

## 4. Renaming player-facing names

When renaming the game, modes, places, or items: search every spelling variant (case, spacing, hyphens, typos) across UI strings, HTML titles, manifests, docs, package names, and storage keys. Migrate saved data when a storage key changes so existing players keep their profile. Keep internal IDs stable unless the task requires changing them.

## 5. Verify

Check every touched screen at 1440×900, 1280×720, 1024×600, and phone size (375×812), plus the project's own targets. Use screenshots, and use `__pt.layout()` from `playtest` (or an equivalent bounding-box check) for page scroll, offscreen controls, and overlaps. Walk each screen's entry and exit. Report screens you could not open and why.
