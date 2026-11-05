# Pipeline layout

One folder per asset domain (world, characters, vehicles, UI art). Adjust names to the project.

```text
assets/<domain>/
  pipeline/
    pin.mjs            # selection -> sources.json (URLs, sizes, checksums). Run when the selection changes.
    fetch.mjs          # sources.json -> upstream/ (verified), writes upstream.lock.json
    build.mjs          # orchestrates conversion; calls Blender or glTF tools
    build_<domain>.py  # Blender script run headless
  sources.json         # committed
  upstream.lock.json   # committed: sha256 of every upstream file
  manifest.json        # committed: provenance + derived outputs
  upstream/            # git-ignored: original downloads
<runtime dir>/<domain>/  # for example public/<domain>/ — committed or built in CI
```

`.gitignore`:

```gitignore
# Pinned upstream originals; re-download with npm run assets:<domain> (verified against upstream.lock.json)
assets/<domain>/upstream/
```

## sources.json

```json
{
  "provider": "Example Provider",
  "license": "CC0-1.0",
  "pinnedOn": "YYYY-MM-DD",
  "components": [
    {
      "id": "street_lamp_01",
      "kind": "model",
      "use": "Street lamps along the main road",
      "page": "https://provider.example/a/street_lamp_01",
      "author": "Name",
      "files": { "street_lamp_01.gltf": { "url": "https://...", "size": 123456, "md5": "..." } }
    }
  ]
}
```

## fetch.mjs core

```js
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const HEADERS = { "User-Agent": "<project>-asset-pipeline/0.1" };
const sources = JSON.parse(readFileSync(join(root, "sources.json"), "utf8"));
const digest = (alg, bytes) => createHash(alg).update(bytes).digest("hex");
const lock = {};

for (const c of sources.components)
  for (const [name, entry] of Object.entries(c.files)) {
    const path = join(root, "upstream", c.id, name);
    let bytes = existsSync(path) ? readFileSync(path) : null;
    if (!bytes || digest("md5", bytes) !== entry.md5) {
      const res = await fetch(entry.url, { headers: HEADERS });
      if (!res.ok) throw new Error(`${entry.url}: HTTP ${res.status}`);
      bytes = Buffer.from(await res.arrayBuffer());
      if (digest("md5", bytes) !== entry.md5) throw new Error(`${c.id}/${name}: checksum mismatch`);
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, bytes);
    }
    lock[`upstream/${c.id}/${name}`] = digest("sha256", bytes);
  }
writeFileSync(join(root, "upstream.lock.json"), JSON.stringify(lock, null, 2) + "\n");
```

When a provider only gives a zip per pack, pin the zip's checksum, extract into `upstream/<pack>/`, and list the pieces used in the manifest.

## Headless Blender

```bash
blender -b --factory-startup -P assets/<domain>/pipeline/build_<domain>.py -- --in assets/<domain>/upstream --out public/<domain>
```

- Find the binary first (`which blender`, or `/Applications/Blender.app/Contents/MacOS/Blender` on macOS); report if it is missing rather than skipping the stage.
- `--factory-startup` avoids user add-ons and preferences changing the output.
- Parse script arguments after `--` from `sys.argv`.
- Apply transforms, set origins, and export with fixed exporter options so builds are deterministic.

## glTF post-processing

`npx @gltf-transform/cli` handles `dedup`, `prune`, `resize`, `weld`, `simplify`, `meshopt`/`draco`, and `ktx2`/`webp` textures. Pin the CLI version in the project's dev dependencies.

## manifest.json component

```json
{
  "asset_id": "street_lamp_01",
  "source": { "page": "https://...", "author": "Name", "upstream": ["upstream/street_lamp_01/street_lamp_01.gltf"] },
  "license": {
    "status": "verified-for-use",
    "identifier_or_expression": "CC0-1.0",
    "evidence": [{ "url": "https://...", "local_snapshot_or_license_path": "assets/<domain>/licenses/provider.txt", "checked_on": "YYYY-MM-DD" }]
  },
  "derived_outputs": [{ "path": "public/<domain>/models/street_lamp_01.glb", "sha256": "...", "bytes": 48213 }],
  "technical": { "triangles": 2400, "textures": ["1024x1024"], "scale": "meters", "pivot": "ground" }
}
```
