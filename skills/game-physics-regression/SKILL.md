---
name: game-physics-regression
description: Diagnose game physics and movement bugs — sinking into the ground, getting flung, tunneling, jitter, unstable spawns, failing scenario tests — by reproducing them headless with a throwaway trace, finding the root cause, and leaving a regression test that asserts the invariant. Use for vehicle, character, and rigid-body bugs, and when a physics or gameplay scenario test fails.
---

# Game Physics Regression

Turn "it looks wrong" into a number, find why, fix it, and leave a test that would have caught it. Works with any engine whose simulation can step without rendering (Rapier, cannon-es, Ammo, Box2D, Jolt, a custom integrator, or a server-authoritative sim).

## 1. Is the failure new?

Before blaming the current change, run the failing test on a clean tree (stash, or a separate worktree at the base commit). Also check whether another session or person is editing the physics or test files right now; their in-progress edits can make tests fail in your run. Report pre-existing failures as such.

## 2. Reproduce headless

Write a throwaway trace test next to the real ones, with a name that marks it as scratch (for example `zz-trace.test.ts`). It creates the simulation, places the body the way the game does, applies a scripted input per step, and prints compact rows every N steps: step, position, speed, orientation (yaw/pitch/roll), contacts, state flags. Use [trace-template.md](references/trace-template.md). Print only what answers the question; long dumps hide the moment it goes wrong.

Sweep the inputs that matter (steering amplitude, speed, spawn position, held inputs at spawn, time step) in one run so the boundary between working and failing shows up in a single table.

## 3. Find the root cause

Read [failure-modes.md](references/failure-modes.md) for common causes by symptom. Confirm the cause by changing only that part and rerunning the trace. If you edit engine code experimentally, keep the original recoverable with git (stash or a scratch branch), not with ad-hoc backup copies.

Separate three cases:
- **Physics bug**: the simulation does something impossible (energy from nowhere, penetration, NaN). Fix the simulation.
- **Visual bug**: physics is right but the rendered model is offset, scaled, or interpolated wrongly. Fix the visual.
- **Bad test**: the scenario does something no player would do (open-loop inputs that steer off the course, a spawn inside geometry). Rewrite the test to behave like a player, for example steering toward a target line with a simple controller, and say so plainly.

## 4. Lock it in

Convert the finding into a regression test that asserts the invariant, not the trace output: never below the ground surface by more than a tolerance, speed below a physical cap, no NaN, still upright after N steps, reaches the checkpoint without crashing. Cover every vehicle or character variant the bug could affect. Run the full suite twice to catch non-determinism. Delete the scratch trace file.

## 5. Check it in the game

Replay the situation in the running game (`playtest` for browser games) and confirm it looks right. Physics tests do not catch visual offsets.

## Report

State the symptom, the trace evidence, the root cause, the fix, the new test, the full-suite result, and anything pre-existing or left unverified.
