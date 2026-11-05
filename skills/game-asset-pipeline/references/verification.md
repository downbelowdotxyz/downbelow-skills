# Asset verification

## Tests to keep in the suite

1. **Shipped equals recorded.** The runtime asset folders contain exactly the files in the manifest, and each file's SHA-256 matches. Catches stray, stale, or hand-edited outputs.
2. **License evidence.** Every component has `status: verified-for-use`, an allowed license identifier, and a local evidence file that exists.
3. **Budgets.** Triangle counts, texture dimensions, and file sizes are within the project's per-asset and per-scene budgets.
4. **Code references resolve.** Every model or texture name referenced in code or level data exists in the manifest, and every manifest entry is used (or is explicitly marked spare).
5. **Geometry sanity.** Bounding boxes at the expected scale (for example a character 1.6–1.9 m tall); props grounded at y = 0; named attachment nodes present (grips, feet, sockets).
6. **Colliders.** Every placed solid prop has a collider; collider bounds are close to the visual bounds.

Example (Vitest, adapt paths):

```ts
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, it } from "vitest";

const REPO = resolve(__dirname, "../..");
const manifest = JSON.parse(readFileSync(resolve(REPO, "assets/world/manifest.json"), "utf8"));
const recorded = new Map(
  manifest.components.flatMap((c: any) => c.derived_outputs.map((o: any) => [o.path, o.sha256])),
);

it("ships only recorded, unchanged files", () => {
  const dir = "public/world/models";
  const shipped = readdirSync(resolve(REPO, dir)).map((n) => `${dir}/${n}`);
  expect(shipped.sort()).toEqual([...recorded.keys()].filter((p) => p.startsWith(dir)).sort());
  for (const [path, sha] of recorded)
    expect(createHash("sha256").update(readFileSync(resolve(REPO, path))).digest("hex"), path).toBe(sha);
});
```

## In-game checks

- Scale against the player character and vehicles; doors, benches, and rails at believable heights.
- Grounding: nothing sinks into or floats above the ground, including the player's vehicle. If the visual sinks but physics is correct, fix the visual offset; if physics penetrates, see `game-physics-regression`.
- Attachments: hands on grips, feet on deck or pedals, held items in hand, in every animation state.
- Collisions match what the player sees.
- Lighting: materials respond correctly (normal map convention, OpenGL vs DirectX green channel; color vs linear textures).
- Frame cost before and after (`webgl-frame-profiling` for browser games).

## Lab page

For characters, vehicles, and rigs, a dev-only page that renders one asset from four sides at once, driven by URL params (for example `?state=turn&vehicle=a&avatar=b`), shows posture and fit problems that are hard to see in gameplay. Save before/after screenshots under `docs/` with the change.
