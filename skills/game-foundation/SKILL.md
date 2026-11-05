---
name: game-foundation
description: Build or audit a game's shared screens, navigation, settings, gameplay lifecycle, and multiplayer session flow. Use for new games, substantial game scaffolds, or explicit foundation audits; keep narrow fixes scoped to the affected behavior.
---

# Game Foundation

Deliver a playable game with a coherent shell around gameplay. Screens may be engine scenes, DOM views, panels, or overlays; do not require separate pages or URLs.

## Establish scope

Inspect the existing game, engine, input system, navigation, and persistence before changing them. Reuse working systems. For a new project, identify the core play loop, win/loss or continuous-play behavior, target devices, input methods, and whether multiplayer is local, online, or absent.

Apply this baseline to a new game or a requested foundation audit. For an isolated feature or bug fix, apply only the relevant lifecycle and acceptance checks. Honor explicit prototype limits and disclose omitted baseline items rather than silently expanding the assignment.

If the rendering stack is undecided, use the companion `pick-engine` skill when available; otherwise resolve the stack from the project and requirements. The foundation does not depend on a specific framework.

## Required experiences

| Experience | Minimum working behavior |
| --- | --- |
| Loading / initialization | Load critical assets and initialize required systems; expose real progress when measurable, otherwise an indeterminate state. Handle failure with retry or a safe return. Never fabricate percentages or add artificial delays. |
| Main menu | Offer Play and Settings, plus the applicable mode/session entry points. Make the next action clear. Use a return/leave action appropriate to browser hosting; do not promise to close arbitrary browser tabs. |
| Lobby / session setup | Required for multiplayer that needs session setup. Support the chosen create/join/matchmaking flow, player presence, capacity, readiness/start rules, cancel/leave, and failed joins. Instant matchmaking can use a compact session panel instead of a room browser. |
| Gameplay | Implement the real play loop, input, camera, and only the HUD information the player needs. Include a discoverable pause/menu entry. |
| Pause menu | Offer Resume, Settings, and Leave; add Restart only when supported. Stop local simulation and gameplay input for pausable single-player. For live multiplayer, explain that the match continues and suppress local gameplay input while the overlay is open. |
| Settings | Provide supported audio, graphics, controls, and accessibility settings. Every control must change behavior. Hide unsupported settings rather than adding decorative toggles. Persist appropriate preferences and provide reset defaults. |

Settings can be one shared panel reachable from the menu and pause overlay. Record its return context so closing it restores the previous screen and correct simulation/input state.

## Conditional modules

Add a module when the requested game actually needs it:

- Results / game over for rounds, completion, elimination, scores, or win/loss conditions; include replay/rematch and menu/leave paths.
- Profile/account for persistent identity or cloud progress; prefer a guest identity when accounts are unnecessary.
- Character, vehicle, or loadout selection when choices affect gameplay or presentation.
- Tutorial/onboarding for unfamiliar controls or mechanics; allow returning to controls later.
- Friends/invites, leaderboards, inventory, or shop only when those features are requested or already part of the game.

Do not invent account systems, currencies, purchases, chat, or cloud storage merely to fill a screen list.

## Navigation and state ownership

Use an explicit state model or the engine's existing lifecycle. A typical flow is:

```text
initialize -> menu -> [session setup] -> gameplay -> [results]
                |                         |
             settings                 pause/menu
                                          |
                                       settings
```

Define valid transitions and a safe way back from every panel. Prevent duplicate starts and stale asynchronous completions from taking over a newer session. Leaving/restarting must clean up the old world's timers, listeners, input captures, network subscriptions, and scene resources. Re-entering gameplay must not create a second loop or double-bind controls.

Separate shell concerns (navigation, preferences, connection/session state) from game rules, world simulation, scoring, and genre-specific HUD. Use the project's conventions; avoid building a general plugin system unless multiple games need one.

## Supporting states and input

- Implement loading, empty, error/retry, confirmation, and notification states where the corresponding operation exists. Recover from missing assets and failed session operations without stranding the player.
- Start audio and pointer lock/fullscreen from an appropriate player gesture. Handle denied requests, lost pointer lock, tab visibility changes, resizing, and focus loss. Clear held inputs on blur to prevent stuck movement.
- Menus must work with the declared input methods. Provide keyboard focus, readable labels/contrast, focus restoration after dialogs, and layouts that fit target viewports and touch safe areas.
- Respect reduced motion where practical; avoid conveying important game state through color or sound alone. Provide touch/controller bindings when those devices are in scope, and keep displayed hints consistent with actual controls.
- Persist appropriate settings with schema/default handling. If storage is unavailable, continue using in-memory preferences. Do not imply that local storage is a cloud save.

## Multiplayer behavior, when applicable

Distinguish real networking from local players or simulated opponents. Online multiplayer needs separate connected clients; do not label bots or mock room cards as working online play.

For online play with friends, implement or integrate a working multiplayer backend, not just a lobby UI. A managed backend can satisfy this responsibility; it need not be a newly written server or a separate machine. Deliver the chosen create/join/invite flow, session ownership, authoritative game rules where needed, and a reachable connection endpoint. A peer-to-peer design is an alternative only when deliberately selected and validated, including its signaling, relay, and authority requirements.

Treat persistence as a separate decision. Invite-code guest rooms can keep active state in server memory without a database; explain that restarting that process loses those rooms and matches. Accounts, permanent friend lists, cross-device progress, inventories, match history, and persistent worlds need durable server-side storage or an appropriate managed persistence service. Browser storage alone does not meet those requirements. Add only the persistent features the game needs, and do not confuse sharing an invite link with maintaining a saved friends list.

Read [multiplayer-backend-setups.md](references/multiplayer-backend-setups.md) when designing friends-based online play or persistence. It contains two worked setup blueprints: guest invite rooms without a database, and authenticated play with PostgreSQL. Adapt them to the selected engine and hosting instead of mandating their example stack.

Choose the authority model to match the game. For competitive or persistent shared state, validate player actions, room membership, and authoritative outcomes on the server rather than trusting client scores/positions. For real-time games, define tick/update rates and interpolation or prediction as needed; turn-based games should not inherit unnecessary real-time machinery.

Handle full/missing rooms, duplicate joins, disconnects, reconnect timeouts, departures, and host/server shutdown. Define host transfer or match termination when relevant. Reconnection must reconcile authoritative state and avoid duplicate player entities; if resuming is unsupported, return to a usable screen with a clear message. Keep local overlay state separate from server-owned match state.

Deliver backend startup/configuration instructions, non-secret environment examples, health/readiness behavior, and frontend endpoint configuration. For persistence, include schema/migrations, authenticated identity mapping, authorization, and a defined save/retry strategy. Keep database credentials server-side. Durable writes should happen at appropriate checkpoints or transactions rather than writing every rendered frame. Define what survives a restart and how the UI handles a save or database failure.

Verify the internet deployment path for actual remote play: a friend's browser cannot reach the developer's `localhost`. Use secure HTTP/socket endpoints for a hosted HTTPS game, confirm long-lived connection support and allowed origins, and document any hosting work still needed. Do not call a local two-tab test verified internet play.

## Verify and finish

Run the game's appropriate build/check commands, then exercise applicable flows in the actual target runtime:

- Cold launch -> menu -> play -> pause -> settings -> resume -> leave -> play again.
- Change settings from both entry points; confirm their effects and persistence after reload when applicable.
- Trigger win/loss and replay when the mode has an ending; verify score/timer/world reset.
- Exercise declared controls, focus loss, resize, and a representative small viewport. Test actual touch/controller input when available; do not claim device testing from viewport emulation alone.
- Trigger a representative loading/network failure and confirm recovery.
- For online multiplayer, use at least two independent clients to create/join or match, start, synchronize play, leave, and disconnect/reconnect. Verify server rejection of an invalid action when authority matters.
- For memory-only rooms, restart the server and verify clean room loss/rejoin behavior. For persistent features, save, restart the application, sign in again, and verify data survived; test that another user cannot read or overwrite private data, accept someone else's friend request, or submit trusted results.
- If deployed for remote friends, verify a client on another device/network can join using the configured public URL. Report local, LAN, and internet verification separately.
- Check runtime logs and failed asset requests, and measure representative play against the project's performance budget.

Fix failures within the requested scope. Distinguish **passed**, **failed**, **not tested**, and **not applicable**; an unavailable browser, device, or backend is not a pass. Report implemented experiences, commands and runtime scenarios exercised, and remaining gaps with their practical impact. Screenshots alone do not establish working gameplay or networking.
