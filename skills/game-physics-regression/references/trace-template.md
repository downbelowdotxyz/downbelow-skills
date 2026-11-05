# Trace template

Adapt the API calls to the project's simulation. Keep it in the test folder so it runs with the project's config and path aliases, and delete it when done.

```ts
// tests/physics/zz-trace.test.ts — SCRATCH, delete before committing
import { it } from "vitest";
import { Simulation } from "<project physics package>";

const yawPitchRoll = (q: { x: number; y: number; z: number; w: number }) => {
  const yaw = Math.atan2(2 * (q.w * q.y + q.x * q.z), 1 - 2 * (q.y * q.y + q.z * q.z));
  const pitch = Math.asin(Math.max(-1, Math.min(1, 2 * (q.w * q.x - q.y * q.z))));
  const roll = Math.atan2(2 * (q.w * q.z + q.x * q.y), 1 - 2 * (q.x * q.x + q.z * q.z));
  return [yaw, pitch, roll].map((r) => Math.round(r * 57.3));
};

// One row per variant; change these to sweep the suspected cause.
const variants = [
  { name: "steer 0", spawn: { x: 0, z: 0 }, steer: () => 0 },
  { name: "steer held", spawn: { x: 0, z: 0 }, steer: () => 0.6 },
  { name: "weave", spawn: { x: 0, z: 0 }, steer: (i: number) => 0.6 * Math.cos((i / 120) * Math.PI * 2) },
];

it("trace", async () => {
  for (const v of variants) {
    const sim = await Simulation.create();
    sim.addBody("a", { ...v.spawn, yaw: Math.PI / 2 });
    const rows: string[] = [];
    let minY = Infinity, maxSpeed = 0;
    for (let i = 0; i < 600; i++) {
      sim.setInput("a", { throttle: 1, steer: v.steer(i) });
      sim.step();
      const p = sim.getPose("a");
      const speed = Math.hypot(p.vx, p.vy, p.vz);
      minY = Math.min(minY, p.y - sim.groundHeightAt(p.x, p.z));
      maxSpeed = Math.max(maxSpeed, speed);
      if (i % 30 === 0 || p.crashed)
        rows.push(`${i} pos ${p.x.toFixed(1)},${p.y.toFixed(2)},${p.z.toFixed(1)} v${speed.toFixed(1)} ypr${yawPitchRoll(p.q)}${p.crashed ? " CRASH" : ""}`);
      if (p.crashed || !Number.isFinite(p.x)) break;
    }
    console.log(`${v.name}: minClearance ${minY.toFixed(3)} maxSpeed ${maxSpeed.toFixed(1)}\n  ` + rows.join("\n  "));
    sim.dispose();
  }
});
```

Run only this file and filter the output:

```bash
npx vitest run tests/physics/zz-trace.test.ts 2>&1 | grep -E "^(steer|weave|  )"
```

## Turning it into a regression test

```ts
it("spawning with steering held does not fling the vehicle", async () => {
  for (const id of VEHICLE_IDS) {
    const sim = await Simulation.create();
    sim.addBody(id, { x: 0, z: 0, yaw: 0, vehicle: id });
    for (let i = 0; i < 240; i++) {
      sim.setInput(id, { throttle: 1, steer: 1 });
      sim.step();
      const p = sim.getPose(id);
      expect(Math.hypot(p.vx, p.vy, p.vz), `${id} step ${i}`).toBeLessThan(MAX_PLAUSIBLE_SPEED);
      expect(p.y - sim.groundHeightAt(p.x, p.z), `${id} step ${i}`).toBeGreaterThan(-GROUND_TOLERANCE);
    }
    sim.dispose();
  }
});
```

For scenario tests (ride a line of ramps, complete a lap), steer like a player: compute the heading error to a target line or waypoint and apply proportional steering, rather than replaying fixed inputs that drift off course.
