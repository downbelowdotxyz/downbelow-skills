# Validation and regression

Read before accepting a change or adding a recurring benchmark. Reuse existing tests. Add checks for behavior or meaningful performance contracts, not implementation wording.

| Area | Relevant checks |
| --- | --- |
| Rendering | Fixed-camera and motion review for LOD, transparency, shadows, UI readability, animation |
| Physics | Fast collision, stacks/triggers, variable render cadence, catch-up limits, replay within the determinism contract |
| Streaming | Cold/warm load, fast traversal, teleport, cancellation, missing assets, collision/nav seams, saves |
| Memory | Repeated scene cycles, bounded caches/pools, shared ownership, transition peaks, long sessions |
| Networking | Intended maximum players/entities, RTT/jitter/loss/reordering, join/reconnect, interest boundaries, correction and overload |
| Device tiers | Weakest supported device, fallback readability, missing feature support, sustained thermal load |

Screenshots miss popping, judder, late collision, and intermittent hitches. Image comparisons need stable seeds and platform tolerances. State checks need an explicit replay contract; do not assume bit-exact cross-platform physics.

## Benchmark design

Store build/content revisions, scenario/input/seed, settings, device fingerprint, tool versions, warmup, duration, raw metrics, per-run summaries, and artifacts. Pin a representative route; maintain a separate evolving stress case. Label synthetic tests.

Keep sample definitions consistent. Separate loading/gameplay when the contract does, but still report loading. Do not silently discard slow frames or failed runs. Predefine exclusions such as capture interruptions and retain reasons.

Derive gates from targets and observed variance. Combine absolute budgets, relative tolerance, and noise allowance. For lower-is-better metrics, an illustrative investigation rule is `candidate > baseline + max(baseline * allowed_fraction, noise_floor)`. This detects potential regressions; it is not statistical proof or a universal recommended percentage. Tail metrics need repeated runs and enough samples.

Use stable devices for timing gates. Shared CI is useful for correctness, asset limits, protocol sizes, and gross regressions; noisy timing should trigger investigation. Do not hide deadline failures by raising tolerance until they pass.

## Practical automation

- Per change: affected correctness checks, content/import checks, and a targeted benchmark when hardware is representative.
- Scheduled or release: weakest tier, sustained play, load/unload cycles, cold start, maximum load, and network impairment where applicable.
- Static content gates: calibrated texture/residency estimates, material counts, LOD availability, dependency completeness, and cell budgets.
- Runtime telemetry where authorized: aggregate frame-time buckets, memory peaks, load latency, tier and build, following existing project collection/privacy rules.

Keep raw evidence or exact reproduction steps. If hardware/build/backend is unavailable, distinguish local checks from unverified acceptance criteria. A faster unit benchmark alone does not prove a faster game.

Accept when improvement repeats and affected behavior/quality passes. Revise or revert when cost moves to another critical path, peaks exceed budget, or quality fails. Report independent optimizations separately when effects cannot be isolated.
