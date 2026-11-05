# Measurement and budgets

Read when defining targets or designing captures. Choose tools for the existing engine, graphics API, and platform.

## Derive budgets from the experience

Frame interval in milliseconds is `1000 / target_fps`: 30 FPS is 33.33 ms, 60 is 16.67 ms, 90 is 11.11 ms, and 120 is 8.33 ms. These are cadence intervals, not guaranteed available work or input-latency targets. Presentation queues, compositor deadlines, XR runtime requirements, and synchronization can impose different limits.

Define a frame-time percentile target, hitch threshold and allowed frequency, and sustained-load duration. State the percentile method. A provisional 60 FPS tier might target p95 presented intervals at or below 16.67 ms and separately limit frames above 50 ms. This is an illustration, not a default recommendation. Choose headroom and tail limits from the actual device and experience.

For servers, `1000 / tick_hz` is the tick interval. Budget p95/p99 processing time, deadline misses, backlog, and delivery separately; include concurrency and host limits.

| Budget | Measure and constrain |
| --- | --- |
| CPU | Critical-path threads, workers, waits, per-system time, sustained utilization |
| GPU | Frame/pass time, bandwidth pressure, geometry/shading, upload stalls |
| Memory | CPU resident/committed, managed/native heaps, VRAM where observable, transition peaks and post-unload retention |
| Loading | Cold launch, time to controllable state, transition p95, I/O, decode, upload, shader creation |
| Streaming | Bytes/work per second, readiness deadline, per-frame upload/integration time, bounded queues |
| Networking | Bytes/packets per second per client/server, corrections, jitter/loss, tick backlog |
| Content | Per-cell and per-tier geometry, materials, texture residency, colliders, animation/AI counts |
| Energy | Sustained clocks, thermal state, battery impact where relevant |

Calibrate content limits with representative assets and worst-case views on the weakest supported tier. Draw-call and triangle counts are useful counters and calibrated gates, not hardware-independent predictions.

Do not add overlapping CPU thread durations or CPU/GPU durations to infer elapsed frame time. Analyze dependencies. On unified memory, document accounting semantics and avoid counting shared allocations twice.

## Capture comparable evidence

Record build/content revision; release/debug and profiler settings; engine/runtime/compiler; graphics backend/driver; CPU/GPU/RAM; OS; resolution, upscaler and quality; display refresh, VSync and cap; power/thermal state; background load; scenario seed/input/camera route; entity/client counts; storage/cache state; network shaping; warmup and capture durations.

Warm up steady-state measurements and run cold-start tests separately. Document which cache was cleared or avoided. Shader caches, import caches, network caches, and OS caches differ. Do not erase user data to simulate a cold run.

Repeat scenarios several times, alternating baseline/candidate order when drift is likely. Capture long enough to include the rare hitch or transition. Keep per-run results rather than pooling away bad runs. State sample counts; short captures do not establish reliable p99 behavior.

Cover representative play, plausible stress, traversal/teleports, and repeated load/unload where relevant. Browser captures need actual browser, canvas dimensions, device pixel ratio, tab visibility, and backend. Headless throughput does not establish visible frame pacing.

## Diagnose the critical path

1. Capture presented/displayed intervals when possible, application frame times, CPU/GPU durations, and counters. Label timer meanings and waits. A render-loop callback interval is not confirmed display time.
2. Correlate hitches with GC/allocation, I/O, pipeline creation, upload, physics, AI, networking, and synchronization.
3. Use a controlled diagnostic toggle. Lowering resolution can test pixel-work cost; freezing simulation can test simulation cost. Restore required settings and behavior for acceptance.
4. Inspect dependencies and queues. A waiting thread may indicate another subsystem is late. A cap can hide headroom.
5. Estimate profiler overhead with lightly instrumented runs. Handle unavailable/disjoint GPU timers and capture-tool perturbation explicitly.

Report p50, p95, p99, maximum, counts over defined hitch thresholds, and missed-deadline rate using consistent samples. Throughput FPS is `1000 / mean(frame_ms)` for contiguous frame intervals, not mean instantaneous FPS. Define any '1% low' calculation. Measure input-to-response latency separately when that is the complaint.

## Optional tool starting points

Prefer existing instrumentation and the engine profiler. Mark meaningful work and asynchronous dependencies instead of every tiny function.

- [Tracy](https://github.com/wolfpld/tracy): instrumented CPU/GPU and allocation profiling where supported.
- [Perfetto](https://perfetto.dev/docs/): system tracing and scheduling/I/O correlation on supported platforms.
- [RenderDoc](https://github.com/baldurk/renderdoc): graphics frame inspection; verify backend/platform support. A frame capture alone does not establish sustained pacing.

Primary-source entry points checked 2026-11-01. Read current engine/platform documentation for setup, support, and overhead. Do not add a profiler dependency merely because it is listed here.
