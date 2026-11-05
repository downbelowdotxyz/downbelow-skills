# Playtest checklists

Pick the sets that the change touches. Record each item as observed, not observed (with reason), or failed.

## Controls

- Every binding for the action works (for example WASD and arrow keys), alone and combined with modifiers.
- Opposite inputs held together resolve predictably.
- Context-specific remaps hold (for example Up/Down switching to balance while a stunt key is held).
- Keys release cleanly: no stuck input after blur, pause, or screen change.
- Touch and gamepad paths still work if the project has them; key hints update for the active device.

## Movement and physics feel

- Start, accelerate, top speed, brake, and stop on each surface type.
- Turn at low and high speed; no snapping, jitter, or sudden spin.
- The player stays on the ground surface: no sinking into it, floating above it, or clipping through obstacles.
- Jumps and landings on each ramp type; crash and respawn; reset key.
- Frame deltas over the route are steady (use `__pt.frames`); camera follows without wobble.

## HUD and screens

- Every number and icon is labeled or self-explanatory; nothing reads like debug output.
- Corner elements do not overlap each other or safe areas at desktop and phone widths.
- Contextual elements appear only when relevant (combo, trick stats, hints).
- Each menu route can be entered and left, including with Esc or the back control.
- `__pt.layout()` reports no page scroll, offscreen controls, or overlaps on the screens touched.

## World and spawn points

- Each named spawn, zone, or teleport target loads and is playable.
- Renamed places show the new name in menus, HUD, minimap, and pause menu.
- Removed or moved obstacles are gone from visuals and collisions.

## Multiplayer and server-dependent screens

- If a screen needs the game server, start it or state that it was not checked; do not infer it from code.
- Invite and room-code links (URL params) land on the right screen with a saved and a fresh profile.

## Viewport matrix

When UI changed: 1440×900, 1280×720, 1024×600, and a phone size (375×812). Add the project's own targets.
