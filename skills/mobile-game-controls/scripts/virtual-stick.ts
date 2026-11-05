// Virtual analog stick: a pure mapping function and a framework-free DOM control.
// Copy into the project, then adapt names and styling. No dependencies.

export interface StickOptions {
  /** Per-axis deadzone as a fraction of full deflection. */
  deadzone?: number;
  /** Exponent applied to the X axis after the deadzone; above 1 gives finer control near centre. */
  curveX?: number;
  /** Exponent applied to the Y axis after the deadzone. */
  curveY?: number;
}

export interface Axes {
  /** Right is positive, -1..1. */
  x: number;
  /** Up is positive, -1..1. */
  y: number;
}

const clampUnit = (value: number) => Math.max(-1, Math.min(1, value));

function shapeAxis(value: number, deadzone: number, curve: number): number {
  const size = Math.abs(clampUnit(value));
  if (size <= deadzone) return 0;
  const scaled = Math.min(1, (size - deadzone) / (1 - deadzone));
  return Math.sign(value) * scaled ** curve;
}

/** Pure mapping from raw stick position to shaped axes. Unit test this. */
export function shapeStick(raw: Axes, { deadzone = 0.15, curveX = 1.4, curveY = 1 }: StickOptions = {}): Axes {
  return { x: shapeAxis(raw.x, deadzone, curveX), y: shapeAxis(raw.y, deadzone, curveY) };
}

/**
 * Example vehicle mapping with a mode switch: Y throttles normally, but while `special` is held Y
 * balances instead and the forward throttle latched when the mode began keeps being applied.
 */
export function createVehicleMapper(options?: StickOptions) {
  // Updated on every normal frame, so entering the mode keeps the throttle from just before it,
  // not the first frame's Y, which already means balance.
  let latched = 0;
  return (raw: Axes, special: boolean) => {
    const axes = shapeStick(raw, options);
    if (special) return { steer: axes.x, throttle: latched, balance: axes.y };
    latched = Math.max(0, axes.y);
    return { steer: axes.x, throttle: axes.y, balance: 0 };
  };
}

export interface StickControl {
  element: HTMLElement;
  /** Releases input and removes listeners. Call on unmount. */
  destroy(): void;
}

/**
 * Mounts a fixed stick inside `parent`. `onChange` receives raw axes (shape them with `shapeStick`);
 * it is called with zeros on release, cancel, lost capture, and destroy.
 * Style `.stick`, `.stick-knob`, and `.stick.active` in CSS; the element needs `touch-action: none`.
 */
export function mountStick(parent: HTMLElement, onChange: (raw: Axes) => void, reachFraction = 0.62): StickControl {
  const element = document.createElement("div");
  element.className = "stick";
  element.setAttribute("role", "application");
  element.setAttribute("aria-label", "Movement stick");
  element.style.touchAction = "none";
  const knob = document.createElement("span");
  knob.className = "stick-knob";
  element.append(knob);
  parent.append(element);

  let pointer: number | null = null;

  const update = (event: PointerEvent) => {
    const box = element.getBoundingClientRect();
    const reach = (box.width / 2) * reachFraction;
    let dx = event.clientX - (box.left + box.width / 2);
    let dy = event.clientY - (box.top + box.height / 2);
    const length = Math.hypot(dx, dy);
    if (length > reach) {
      dx *= reach / length;
      dy *= reach / length;
    }
    knob.style.transform = `translate(${dx}px, ${dy}px)`;
    onChange({ x: dx / reach, y: -dy / reach });
  };

  const release = () => {
    if (pointer === null) return;
    pointer = null;
    element.classList.remove("active");
    knob.style.transform = "";
    onChange({ x: 0, y: 0 });
  };

  const onDown = (event: PointerEvent) => {
    if (pointer !== null) return;
    event.preventDefault();
    pointer = event.pointerId;
    element.setPointerCapture(event.pointerId);
    element.classList.add("active");
    update(event);
  };
  const onMove = (event: PointerEvent) => {
    if (event.pointerId === pointer) update(event);
  };
  const onUp = (event: PointerEvent) => {
    if (event.pointerId === pointer) release();
  };
  const onHide = () => {
    if (document.hidden) release();
  };
  const block = (event: Event) => event.preventDefault();

  element.addEventListener("pointerdown", onDown);
  element.addEventListener("pointermove", onMove);
  element.addEventListener("pointerup", onUp);
  element.addEventListener("pointercancel", onUp);
  element.addEventListener("lostpointercapture", onUp);
  element.addEventListener("contextmenu", block);
  window.addEventListener("blur", release);
  document.addEventListener("visibilitychange", onHide);

  return {
    element,
    destroy() {
      release();
      element.removeEventListener("pointerdown", onDown);
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerup", onUp);
      element.removeEventListener("pointercancel", onUp);
      element.removeEventListener("lostpointercapture", onUp);
      element.removeEventListener("contextmenu", block);
      window.removeEventListener("blur", release);
      document.removeEventListener("visibilitychange", onHide);
      element.remove();
    },
  };
}
