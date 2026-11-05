# HUD and loading screens

## HUD audit

For each HUD element, answer: what does it tell the player, when do they need it, and does anything else already show it? Remove or merge duplicates.

- **Corners have jobs.** A common layout: top-left identity and objective, top-right map or position, bottom-left status (speed, health, boost), bottom-right contextual actions or key hints. Keep the center clear for play.
- **Label every number.** "42" means nothing; "42 km/h" or an icon with a tooltip does.
- **No debug output.** Raw coordinates, IDs, frame stats, and unlabeled colored boxes belong behind a debug toggle.
- **Contextual only when relevant.** Trick or combo stats when they are nonzero; a rider list only in multiplayer; hints fade once the player has used the control, and come back after inactivity if needed.
- **Minimap.** Rotate with the player or show a heading arrow; zoom to the scale of play; draw roads or paths and points of interest, not just dots.
- **Device-aware hints.** Show keyboard, gamepad, or touch prompts for the active input; hide keyboard hints on touch devices.
- **Safe areas.** Respect notches and rounded corners on phones (`env(safe-area-inset-*)`).
- **Cost.** HUD updates should not re-render the 3D scene; update HUD values from a store or refs at a capped rate.

## Loading screens

- Motion that belongs to the game (the vehicle, character, or a world element animated in CSS, a lightweight canvas, or the engine), not only a spinner.
- Real progress if asset loading reports it; otherwise an indeterminate animation, never a fake bar that stalls at 99%.
- A tip or controls reminder, rotated on long loads.
- Branding consistent with the title screen.
- A minimum display time (around 300–500 ms) so fast loads do not flash; a timeout path with a retry message for loads that fail.
- One shared component for every load (boot, entering a match, changing maps) so they stay consistent.

To review a loading screen that disappears too quickly, add a temporary dev flag that holds it open, and remove the flag afterwards.
