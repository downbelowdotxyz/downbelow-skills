---
name: webgl-frame-profiling
description: Measure and fix frame time, GPU cost, and smoothness of a WebGL/WebGL2 browser game in the live page — GPU timer queries, draw and triangle counts, frame-delta distributions, and on/off experiments for shadows, post-processing, resolution, and materials. Use when a browser game is slow, stutters, or "doesn't feel smooth", or before and after a rendering change.
---

# WebGL Frame Profiling

Find which part of the frame costs the most, change one thing, and prove the result with comparable captures. This skill is the browser and WebGL-specific companion to a general performance process (use `game-performance-engineering` for contracts and budgets if it is available). It works with three.js, React Three Fiber, Babylon, PlayCanvas, Phaser in WebGL mode, or raw WebGL.

## Set up a valid capture

1. **Fix the conditions.** Record browser, GPU, resolution, `devicePixelRatio`, quality tier, and the route. A capture taken at a different size or tier is a different experiment.
2. **Make sure nothing else changes the code under you.** If another session or person is editing the renderer, world, or shaders, a baseline taken now will not match the code you change later. Use a separate worktree, or wait and re-baseline.
3. **Make sure the page is not throttled.** Hidden or occluded windows cap or stop `requestAnimationFrame`, and `document.visibilityState` may still report `"visible"`, so measure the rAF rate itself. Check before and after every capture with `__pt.health()` from `playtest` or with the probe's `health()`. If throttled, stop and ask for a visible window or a headless browser with background throttling disabled. Never report throttled numbers.
4. **Know the cap.** With vsync the frame rate tops out at the display rate (often 60). Frame times below 16.7 ms are hidden at 60 Hz, so use GPU time to see the remaining headroom.
5. **Install the probe** from [scripts/frame-probe.js](scripts/frame-probe.js). It finds the game's WebGL context, counts draws and triangles per frame, and reads GPU time via `EXT_disjoint_timer_query_webgl2` when the browser exposes it. Prefer the project's debug bridge for renderer, scene, and composer access over reaching into bundled modules.

## Measure, explain, change, verify

1. **Baseline.** Warm up about 1.5 s after spawn or load (shader compiles and uploads cause one-off spikes), then capture at least 3 runs: standing still at a representative spot and riding a fixed route. Report p50, p95, p99, max, frames over 20 ms and over 33 ms, draws, triangles, and GPU p50/p95.
2. **Classify the bottleneck.** GPU time near the frame time means GPU-bound; long frames with low GPU time mean CPU, garbage collection, or main-thread work. Run the experiments in [experiments.md](references/experiments.md): resolution scale (fill-rate), post-processing off, shadows off, single material or shader swap, render loop paused (CPU idle cost), per-pass timing.
3. **Pick one change** that the evidence points to. Typical wins: skip shading work for invisible surfaces, cheaper post-processing (half-resolution bloom, or tone mapping in the renderer instead of a full-screen pass), smaller shadow maps or fewer shadow casters, merged or instanced props, a capped pixel ratio per quality tier.
4. **Re-measure with the same protocol** and compare distributions. Check visuals with screenshots from the same camera position before and after. Run the project's tests and typecheck.
5. **Keep or revert.** Report quality tradeoffs separately (for example "Medium no longer has bloom"). Remove the probe, any library monkeypatches, and temporary flags.

## Smoothness is more than FPS

A steady 60 FPS can still look jerky. When the complaint is "not smooth", also check the items in [experiments.md](references/experiments.md#smoothness-audit): rendering interpolated between fixed physics steps, camera smoothing, input easing, UI frameworks re-rendering the 3D scene on every network or state tick, and obstacles placed on the main racing line.

## Report

Give the conditions, the baseline and after distributions, the experiment that identified the cost, the change, the quality tradeoffs, and what was not measured (other tiers, other devices, throttled runs). Use the record in [experiments.md](references/experiments.md#capture-record).
