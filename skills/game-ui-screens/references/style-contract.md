# Style contract

Fill this from the anchor screen. Keep it in the project (for example next to the UI tokens) so later screens follow it.

```text
Anchor screen:                  (file, why it is the anchor)
Display type:                   family, weight, case, skew/italic, letter spacing, size scale
Body type:                      family, size scale, line height
Color tokens:                   background, surface, primary accent, secondary accent, text, muted, danger, success
Background treatment:           live scene / blurred scene / art / gradient; overlay opacity
Panels:                         shape (skewed, clipped corners, rounded), border, shadow, blur
Buttons:                        idle / hover / focus / pressed / disabled / selected
Focus indicator:                visible on keyboard and gamepad focus
Spacing scale:                  base unit and clamp() rules tied to viewport height
Motion:                         enter/exit durations, easing, idle animation, reduced-motion behavior
Sound cues:                     hover, confirm, back, error (if the game has UI audio)
Iconography:                    set, stroke/fill, size
Back control:                   key/button and on-screen hint
```

## In-game conventions

A screen reads as "website" when it has: a white or flat page background, small centered form cards, browser-default inputs and selects, document scrolling, hyperlinks for navigation, and long paragraphs. It reads as "in-game" when it has:

- Edge-to-edge composition over the game's backdrop, with a strong title treatment.
- Large, chunky primary actions; secondary actions visually quieter.
- Styled inputs, toggles, sliders, and selectors (no raw browser controls).
- A persistent back hint (for example "Esc Back") and keyboard/gamepad focus.
- Short labels; descriptions only where a choice needs explaining.
- Live previews where they help (the selected vehicle or character rendered in 3D, a map thumbnail).
- Consistent screen transitions.

## Modal fit

Pause, settings, and results modals should fit without scrolling on desktop sizes. On phones, scroll inside the modal body, never the page. Keep the close/back control visible at all times.

## Accessibility baseline

Text contrast against the busiest backdrop, focus visible, reduced motion respected, controls reachable without a mouse, touch targets at least about 44 px on touch devices.
