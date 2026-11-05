---
name: game-performance-engineering
description: Profile, budget, optimize, and regression-test game performance across engines and platforms. Use for frame pacing, CPU/GPU bottlenecks, physics, streaming, networking, memory, and game performance reviews.
---

# Game Performance Engineering

Improve a measured player or server outcome while preserving required gameplay, visual quality, and correctness. Adapt to the existing engine, renderer, language, platform, and build system. This skill covers 2D, 3D, browser, mobile, native, dedicated-server, and XR workloads. No engine or companion skill is required.

## Establish the performance contract

Inspect the repository, captures, build settings, and target devices before choosing tools. Recover known requirements from project context. Ask only for missing constraints that materially affect the work; otherwise label provisional assumptions.

Record target hardware and OS, resolution and quality, player/entity counts, frame or server tick rate, load and traversal expectations, network conditions, memory limits, and correctness constraints. Distinguish estimates from measurements. Do not invent universal triangle, draw-call, memory, or FPS limits.

Read [measurement-and-budgets.md](references/measurement-and-budgets.md) to define budgets, scenarios, and capture methods. Copy relevant sections of [templates.md](references/templates.md) into the project's reporting format.

## Measure, explain, change, verify

1. Reproduce the symptom in a representative packaged build on target hardware. Capture a baseline with a repeatable route, seed, input sequence, or load. If hardware or profiling is unavailable, implement useful instrumentation and report the verification gap.
2. Classify the limiting path with evidence: CPU, GPU, synchronization, storage/network I/O, allocation/GC, thermal throttling, shader compilation, or external pacing. A slow main-thread marker alone does not establish causality.
3. Form a falsifiable hypothesis and choose one bounded change. State the expected metric improvement, quality/gameplay tradeoff, and rollback. Prioritize measured constraints over speculative micro-optimization.
4. Read only applicable sections of [systems-playbook.md](references/systems-playbook.md). Change code or content within the requested scope. Preserve simulation timing, authoritative state, saves, and resource ownership unless their modification is part of the task.
5. Repeat the baseline protocol and compare distributions across runs. Read [validation-and-regression.md](references/validation-and-regression.md) for tests and gates. Verify visuals and behavior; retain evidence or reproducible capture instructions.
6. Keep, revise, or revert based on results. Stop when agreed criteria pass, or report the remaining constraint and next experiment. Do not call an unmeasured change an improvement.

## Keep these decisions explicit

- Measure frame times and pacing, including tails and hitches; average FPS is insufficient.
- Separate CPU and GPU measurements. Their pipelined work often overlaps, so adding their durations usually misstates elapsed frame time.
- Separate render cadence, simulation cadence, network updates, and input latency. Increasing a tick interval changes behavior.
- Track resident and peak memory, including transition overlap and graphics resources. Small downloads do not imply low runtime memory.
- Make quality tiers deliberate. Protect gameplay-critical visibility, collision, and authoritative networking.
- Preserve baseline settings for optimization comparisons. Report quality reductions as separate results.

## Deliver the result

Provide the contract, bottleneck and evidence, implemented changes, comparable before/after metrics, correctness and quality checks, limitations, and rollback or reproduction details. For an audit, deliver prioritized experiments with expected benefit, confidence, effort, and verification steps. Do not imply audit recommendations are implemented.
