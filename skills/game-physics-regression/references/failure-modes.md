# Failure modes by symptom

## Sinks into the ground

- **Visual offset**: the render model's origin is not at the contact point, or wheel radius in the model differs from the physics wheel radius. Physics clearance is fine in the trace. Fix the model pivot or the visual offset.
- **Suspension too soft** for the mass, or rest length too short: the chassis bottoms out on landings or slopes.
- **Collider smaller than the visual**: wheels or deck collider inset from the mesh.
- **Ground sampled at the wrong point**: height lookup at the body center instead of each contact; terrain heightfield and visual terrain built from different resolutions or functions.

## Flung, spinning, or launched

- **Large impulses at spawn**: spawning inside or touching geometry, or with inputs already held (full steering lock at zero speed can produce huge yaw rates in some controllers). Clear inputs or ramp them in on spawn; spawn slightly above the ground.
- **Divide by small speed**: slip angles or steering formulas that divide by forward speed blow up near zero. Clamp the denominator.
- **Unclamped forces or torques** from assist controllers (balance, upright, yaw assist) fighting each other.
- **Variable time step** fed into an integrator tuned for a fixed step.

## Tunnels through obstacles

- Thin colliders at high speed without continuous collision detection. Enable CCD for the fast body or thicken colliders.
- Kinematic movement that teleports past geometry instead of using a shape cast.

## Jitter or wobble

- Rendering the latest physics step instead of interpolating between the last two steps.
- Camera following raw physics contacts; damping that depends on frame rate.
- Two systems writing the same transform (animation and physics).
- Network corrections snapping instead of smoothing.

## Crashes or falls when it should not

- Crash detection thresholds that trigger on normal landings or curbs; check the angle and impact values in the trace at the crash step.
- Obstacles placed on the natural line of travel; check the map rather than the physics.
- The scenario steers open loop and drifts into scenery: a test problem, not a physics problem.

## Non-deterministic tests

- Unseeded randomness, wall-clock time, or async loading order inside the simulation.
- Shared simulation instances across tests; create and dispose per test.
- Floating-point differences across platforms: assert with tolerances.
