# Virtual analog stick

A copyable implementation is in [scripts/virtual-stick.ts](../scripts/virtual-stick.ts): a pure mapping function plus a framework-free DOM stick. Adapt it to React, Vue, or engine UI by keeping the same event handling.

## Parameters

| Parameter | Typical value | Why |
|---|---|---|
| Base size | `clamp(118px, 38vh, 172px)` landscape | Scales with phone height; large enough for a thumb arc. |
| Knob size | about 38% of base | Visible under the thumb edge. |
| Reach (full deflection) | about 60% of base radius | Full input before the thumb leaves the base. |
| Deadzone | 0.12–0.18 radial or per axis | Ignores thumb drift at rest. Rescale after it so the edge of the deadzone reads 0, not 0.15. |
| Response curve | exponent 1.3–1.6 for steering | Finer control near centre, full lock at the edge. Use 1.0 for movement where speed should track the thumb linearly. |
| Return | knob springs back about 120 ms on release | Shows the input ended. Send zero immediately, not after the animation. |

Per-axis deadzones suit vehicles (steer and throttle are separate controls). A radial deadzone suits character movement (direction matters more than axes).

## Fixed vs floating

- **Fixed**: the base stays in place. Best for vehicles and games with a visible steering control; players learn where centre is.
- **Floating**: the base appears where the thumb lands within the left zone. Best for character movement in action games; avoids missing the stick. Keep the zone large (left 40% of the screen, below the top HUD) and show a faint ghost stick at rest.
- **Dynamic follow**: the base follows the thumb when it is dragged past the edge. Useful for long sessions; disorienting for racing.

## Mapping

Map screen space to game axes once: right positive, up positive (screen Y is inverted). Clamp to -1..1. For vehicles, typical mappings are:
- X steers, Y throttles (up) and brakes or reverses (down).
- Or X steers only, with pedals as buttons. Offer this as an option for players who brake by accident.

Sum stick values with keyboard values and clamp, so a connected keyboard or gamepad still works.

## Mode switches

When a held action changes the meaning of an axis (for example, while a stunt button is held, up/down balances instead of throttling):
- Mirror what the keyboard does in the same situation.
- Latch any value the switch would drop and keep sending it until the switch ends. Take it from the last frame before the switch: on the first frame of the mode the axis already means the new thing, so reading it then latches the wrong value.
- Never let the latched value carry over a brake or reverse into the special mode unless the game wants that.
- Show the change: tint the stick or swap its arrow hints while the mode is active, if players need the cue.

## Multi-touch and robustness

- Use pointer events and `setPointerCapture` so a thumb that drifts off the stick keeps controlling it.
- Track the pointer id that started the drag; ignore other pointers on the stick.
- Release on `pointerup`, `pointercancel`, `lostpointercapture`, page blur, visibility change, pause, orientation change, and unmount.
- `touch-action: none` on the stick and buttons stops scrolling and pinch zoom; also block the context menu and text selection (`-webkit-user-select`, `-webkit-touch-callout`).
- Do not use `click` for game buttons; it waits for release and can be delayed. Use `pointerdown` and `pointerup`.

## Tests

- Inside the deadzone reads zero on both axes.
- Full deflection reads exactly ±1.
- Output is monotonic across the range and clamps out-of-range input.
- Each mode switch: the remapped axis moves the new target, the latched value holds, and braking is not latched.
