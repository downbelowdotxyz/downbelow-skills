# Layout and testing

## Thumb zones in landscape

```text
+--------------------------------------------------------------+
| status / pause      utilities (small)        speed  minimap  |
|                                                              |
| side rail?                                                   |
|                    play area: keep clear                     |
|  .-----.                                        o   o        |
| ( stick )                                     o  (PRIMARY)   |
|  '-----'          contextual prompt                          |
+--------------------------------------------------------------+
```

- Bottom corners belong to thumbs. Anything in them must be a control.
- The centre and the upper middle are the play area. Keep prompts short and near the bottom centre.
- HUD readouts go to the top edge. Group speed with the minimap in one corner rather than spreading them along the bottom.
- Respect safe areas: `max(1rem, env(safe-area-inset-left))` and so on, with `viewport-fit=cover` in the viewport meta tag.

## Button arc

Primary button in the corner, secondary buttons on an arc around its centre. With CSS custom properties:

```css
.tricks { position: absolute; right: max(1.1rem, env(safe-area-inset-right)); bottom: max(0.9rem, env(safe-area-inset-bottom));
  --primary: clamp(62px, 21vh, 84px); --small: clamp(42px, 13.5vh, 54px);
  --reach: calc(var(--primary) / 2 + var(--small) / 2 + 12px);
  width: var(--primary); height: var(--primary); }
.tricks .primary { width: 100%; height: 100%; }
.tricks .secondary { position: absolute;
  right: calc(var(--primary) / 2 + var(--reach) * var(--sin) - var(--small) / 2);
  bottom: calc(var(--primary) / 2 + var(--reach) * var(--cos) - var(--small) / 2); }
/* Angle measured from straight up toward the screen centre: 0, 45 and 90 degrees for three buttons. */
.a0 { --sin: 0; --cos: 1; } .a45 { --sin: 0.707; --cos: 0.707; } .a90 { --sin: 1; --cos: 0; }
```

Use 0/30/60/90 degrees for four secondary buttons. Mirror with `left` for left-handed layouts.

## Sizes

- Minimum touch target about 44 px; 48–56 px for frequent actions; 64–84 px for the primary.
- Size controls with `vh` clamps in landscape, since height is the scarce dimension.
- At least 8 px between targets.

## Icons

- One idea per icon, drawn with a consistent stroke on a shared grid (for example a 32-unit `viewBox`, 2.4 stroke, round caps).
- Build families from a shared motif so related actions read together (for example a handlebar with grips on or off for hand tricks).
- Held state is a strong fill in the game's accent color, not just a slight opacity change.
- `aria-label` and `title` carry the name; teach names once in onboarding or the pause screen.

## Orientation

- Detect with `matchMedia("(orientation: portrait)")` and listen for changes.
- `screen.orientation.lock()` works only in fullscreen on Android Chrome and not on iOS Safari. Treat it as a bonus, never a requirement.
- In the wrong orientation, cover the game with a rotate prompt (phone icon and one line) and unmount the controls so held inputs release. For a single-player game, consider pausing.
- For installable web apps, set `"orientation": "landscape"` in the web app manifest.

## Touch detection

- Use `matchMedia("(pointer: coarse)")`, not user-agent sniffing or screen width. Tablets with keyboards and touch laptops exist; show touch controls when coarse is true and let a setting override.
- Apply touch-only HUD changes under a class on the game root (for example `.touch`) so desktop CSS is untouched.
- Swap keyboard wording in prompts and hints when touch is active.

## Testing in a desktop browser

- Emulate a phone width below 768 px so device emulation also reports `pointer: coarse` (for example 740×360 and 667×375 landscape, 375×812 portrait).
- Synthetic `PointerEvent`s cannot hold pointer capture. For scripted tests, temporarily stub `Element.prototype.setPointerCapture`, `releasePointerCapture`, and `hasPointerCapture` (return true), dispatch `pointerdown`/`pointermove`/`pointerup` with `pointerType: "touch"`, then restore the originals.
- Check that the game responds (speed rises when pushing up, heading changes when steering), the knob returns on release, held buttons show their held state, and nothing overlaps as HUD values grow.
- Hidden browser windows throttle `requestAnimationFrame`; measure the frame rate before trusting any motion result.
- Real-device checks still needed: multi-touch with both thumbs, notch and home-indicator safe areas, haptics if used, and frame rate on a mid-range phone.
