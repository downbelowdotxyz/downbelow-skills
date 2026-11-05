// Playtest harness: evaluate in the game page (agent JS tool, Playwright page.evaluate, DevTools console).
// Adds window.__pt. Re-evaluating replaces it. Remove with `delete window.__pt` when done.
//
// Headless Chromium that must not throttle timers or rAF:
//   --disable-background-timer-throttling --disable-renderer-backgrounding
//   --disable-backgrounding-occluded-windows
(() => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const errors = [];
  addEventListener("error", (e) => errors.push(String(e.message)));
  addEventListener("unhandledrejection", (e) => errors.push("unhandled: " + String(e.reason)));

  // Change TARGET if the game listens on document or the canvas instead of window.
  const TARGET = window;
  const held = new Set();
  const send = (type, code) =>
    TARGET.dispatchEvent(new KeyboardEvent(type, { code, key: keyFor(code), bubbles: true, cancelable: true }));
  const keyFor = (code) =>
    code.startsWith("Key") ? code.slice(3).toLowerCase()
    : code.startsWith("Digit") ? code.slice(5)
    : ({ Space: " ", ShiftLeft: "Shift", ShiftRight: "Shift", ControlLeft: "Control", Escape: "Escape", Enter: "Enter" }[code] ?? code);

  const quantile = (xs, p) => {
    const s = [...xs].sort((a, b) => a - b);
    return s.length ? s[Math.min(s.length - 1, Math.floor(p * s.length))] : null;
  };
  const round = (x) => (x == null ? null : +x.toFixed(2));

  // Counts rAF callbacks over `ms`. Throttled or hidden pages report far below the display rate.
  const rafRate = (ms = 1000) =>
    new Promise((resolve) => {
      let n = 0;
      const t0 = performance.now();
      const f = () => (n++, performance.now() - t0 < ms ? requestAnimationFrame(f) : resolve((n * 1000) / ms));
      requestAnimationFrame(f);
      setTimeout(() => resolve((n * 1000) / ms), ms + 500);
    });

  window.__pt = {
    wait,
    errors: () => [...errors],

    async health() {
      const fps = await rafRate(1000);
      return {
        visibility: document.visibilityState,
        focused: document.hasFocus(),
        rafPerSecond: Math.round(fps),
        throttled: document.hidden || fps < 30,
        viewport: `${innerWidth}x${innerHeight}@${devicePixelRatio}`,
      };
    },

    // Edit the predicate for the project: prefer a debug-bridge flag such as window.__game?.ready.
    async ready({ timeoutMs = 30000, predicate } = {}) {
      const ok = predicate ?? (() => window.__game?.ready ?? !/loading/i.test(document.body.innerText));
      const t0 = performance.now();
      while (performance.now() - t0 < timeoutMs) {
        if (ok()) return { ready: true, ms: Math.round(performance.now() - t0) };
        await wait(250);
      }
      // Loading that never finishes is often a throttled page, not a game bug.
      return { ready: false, health: await this.health(), text: document.body.innerText.slice(0, 300) };
    },

    down(code) { held.add(code); send("keydown", code); },
    up(code) { held.delete(code); send("keyup", code); },
    releaseAll() { for (const c of [...held]) this.up(c); },
    async tap(code, ms = 80) { this.down(code); await wait(ms); this.up(code); },

    // steps: [{ hold: ["KeyW"], ms: 2000 }, { hold: ["KeyW", "KeyA"], ms: 1200 }, { tap: "Space" }, { ms: 500 }]
    // Keys not listed in the next step's `hold` are released. Returns per-step samples from `sample()`.
    async route(steps, sample = () => window.__game?.snapshot?.()) {
      const log = [];
      try {
        for (const step of steps) {
          const want = new Set(step.hold ?? []);
          for (const c of [...held]) if (!want.has(c)) this.up(c);
          for (const c of want) if (!held.has(c)) this.down(c);
          if (step.tap) await this.tap(step.tap);
          if (step.ms) await wait(step.ms);
          log.push({ step: step.label ?? JSON.stringify(step), state: sample?.() ?? null });
        }
      } finally {
        this.releaseAll();
      }
      return log;
    },

    // Frame-delta sampler for smoothness checks while a route runs: await __pt.frames(() => __pt.route(...))
    async frames(during, { skip = 5 } = {}) {
      const deltas = [];
      let last = performance.now(), run = true;
      const tick = (t) => { deltas.push(t - last); last = t; if (run) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
      const result = await during();
      run = false;
      const d = deltas.slice(skip);
      const mean = d.reduce((a, b) => a + b, 0) / d.length;
      return {
        frames: d.length, fps: round(1000 / mean),
        p50: round(quantile(d, 0.5)), p95: round(quantile(d, 0.95)), p99: round(quantile(d, 0.99)),
        max: round(Math.max(...d)), over20ms: d.filter((x) => x > 20).length, over33ms: d.filter((x) => x > 33).length,
        hidden: document.hidden, result,
      };
    },

    // Clicks the last visible control whose text, or one line of it, matches (case-insensitive).
    // Line matching handles labels split across elements, such as a kicker line above the main label.
    click(text) {
      const want = text.trim().toUpperCase();
      const norm = (s) => s.replace(/\s+/g, " ").trim().toUpperCase();
      const controls = [...document.querySelectorAll("button, [role=button], a, [tabindex]")]
        .filter((e) => e.offsetParent !== null && !e.disabled)
        .reverse();
      const el =
        controls.find((e) => norm(e.innerText) === want) ??
        controls.find((e) => e.innerText.split("\n").some((line) => norm(line) === want));
      el?.click();
      return el ? norm(el.innerText) : false;
    },

    // UI fit check: page scroll, elements outside the viewport, and overlapping siblings in `selector`.
    layout(selector = "button, h1, h2, [role=dialog]") {
      const els = [...document.querySelectorAll(selector)].filter((e) => e.offsetParent !== null);
      const boxes = els.map((e) => [e, e.getBoundingClientRect()]);
      const offscreen = boxes.filter(([, r]) => r.right > innerWidth + 1 || r.bottom > innerHeight + 1 || r.left < -1 || r.top < -1);
      const overlaps = [];
      for (let i = 0; i < boxes.length; i++)
        for (let j = i + 1; j < boxes.length; j++) {
          const [a, ra] = boxes[i], [b, rb] = boxes[j];
          if (a.contains(b) || b.contains(a)) continue;
          if (ra.left < rb.right && rb.left < ra.right && ra.top < rb.bottom && rb.top < ra.bottom)
            overlaps.push([a.textContent.trim().slice(0, 30), b.textContent.trim().slice(0, 30)]);
        }
      const se = document.scrollingElement;
      return {
        viewport: `${innerWidth}x${innerHeight}`,
        pageScrolls: se.scrollHeight > se.clientHeight + 1,
        offscreen: offscreen.map(([e]) => e.textContent.trim().slice(0, 40)),
        overlaps: overlaps.slice(0, 20),
      };
    },
  };
  return "playtest harness installed";
})();
