# Experiments

Each experiment changes one thing in the live page, captures with the same protocol, and restores the original. Run them through the project's debug bridge when possible. Record each result in the capture record below.

## Classify the bottleneck

| Experiment | How (three.js / R3F shown; adapt to the engine) | Reading |
|---|---|---|
| Resolution scale | `renderer.setPixelRatio(dpr * 0.5)` or shrink the canvas to quarter pixels | Large GPU drop: fill-rate or fragment shading bound. Little change: vertex, draw-count, or CPU bound. |
| Post-processing off | Render `scene` with `camera` directly instead of the composer; move tone mapping to `renderer.toneMapping` so colors stay comparable | Drop shows the full-screen pass cost. Time each effect separately by disabling one at a time. |
| Shadows off | `renderer.shadowMap.enabled = false`, or `castShadow = false` on large groups such as trees | Shadow pass cost; try a smaller shadow map or fewer casters before removing shadows. |
| Material swap | Temporarily give the heaviest meshes (terrain, water) a plain material | Expensive shader. Look for texture reads or branches evaluated for surfaces that are never visible. |
| Render loop paused | R3F `set({ frameloop: "never" })`; otherwise stop the engine's render call | Remaining main-thread time is simulation, UI, or networking, not rendering. |
| Draw count | `renderer.info.render.calls` and the probe's `draws` | Hundreds of small props: merge, instance, or cull. |
| CPU render time | Wrap `renderer.render` with `performance.now()` | High CPU render time with low GPU time: scene graph traversal, too many objects, or per-frame allocations. |

To patch a library prototype loaded by Vite, find its module URL with `performance.getEntriesByType("resource")` (paths under `/node_modules/.vite/deps/` carry a `?v=` hash), then `await import(url)`. This breaks on every dependency re-bundle, so prefer exposing the object through the debug bridge.

## Smoothness audit

Run the same route before and after, sampling frame deltas, and review these in code:

- **Fixed-step simulation, interpolated rendering.** If physics runs at a fixed rate (for example 60 Hz) and rendering draws the latest physics state directly, motion judders whenever the two rates beat. Keep the previous and current state and render the blend by the leftover accumulator fraction.
- **Camera.** Follow the interpolated pose, smooth with frame-rate-independent damping (`1 - Math.exp(-k * dt)`), and do not let it react to per-step contact noise.
- **Input.** Ease steering and throttle toward their targets; instant full-lock inputs read as twitchy and can destabilize physics.
- **UI framework re-renders.** React, Vue, and similar UIs that re-render the 3D scene tree on every network snapshot or state tick (for example 20 Hz) cause periodic hitches. Keep per-frame data in refs or stores read inside the render loop.
- **Garbage collection.** Per-frame allocation of vectors, arrays, or closures in hot loops shows up as periodic long frames.
- **Level layout.** Props or trees on the main line of travel force sudden corrections that feel like stutter.

## Capture record

```text
Date / commit:
Browser, GPU, display Hz:
Resolution x DPR, quality tier:
Scenario: spawn point / route, duration, runs
Baseline: fps p50/p95/p99/max, >20 ms, >33 ms, draws, ktris, GPU p50/p95
Experiment(s) and readings:
Change made:
After: (same fields)
Visual differences (screenshots):
Not measured / caveats:
```
