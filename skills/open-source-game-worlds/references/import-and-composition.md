# Import, optimization, and composition

Read after candidate selection. Prove one representative slice before bulk adoption. Preserve upstream sources and implement transformations in a reproducible import recipe.

## Inspect before running project code

Treat downloaded projects, scripts, plugins, and editor hooks as untrusted inputs. Inspect dependencies and import/build behavior before execution. Prefer data-only import when suitable. Do not run a full upstream game just to extract meshes if static inspection/export can meet the task. Use an isolated staging copy and preserve existing project files.

## Inventory and normalize

Record file formats, dependency paths, packed/external resources, compression/extensions, dimensions, units, axes/handedness, pivots, naming, materials, texture channels, collision, navigation, animation/rigs, source availability, and license coverage. Find missing resources before blaming the renderer.

For 3D, choose a runtime-supported exchange format or native import path. glTF/GLB can be useful for PBR interchange; they do not preserve every native shader, script, lightmap, world behavior, or editor feature. Validate extensions against the actual loader. Use the official [glTF Validator](https://github.com/KhronosGroup/glTF-Validator) when appropriate. Validate units, up axis, winding, tangents, normals, negative/nonuniform scale, skin bind poses, root motion and animation events. Keep a scale reference in the staging scene.

For 2D, preserve tile size, pixels-per-unit, orientation (orthogonal/isometric/hex), layers, tile offsets, animation, collision objects, pivots, object properties, tile flips and sort order. For Tiled maps inspect external tilesets and relative paths using the [TMX/TSX format reference](https://doc.mapeditor.org/en/stable/reference/tmx-map-format/). Runtime parsers may support only part of the format. Test atlas padding, filtering, alpha edges and camera zoom.

For voxel/procedural worlds, pin game/mod/generator versions, seed, parameters, block IDs, schematics, and dependencies. Check saved-world portability, generation time, serialization and upgrades. A seed alone is not a complete reusable world artifact.

## Build a representative slice

Include a typical route, dense view, collision-heavy area, moving/interactive elements, one boundary/transition, and target lighting. Match intended camera and movement speed. Measure load latency, CPU/GPU frame times and tails, memory peaks, draw/material counts, collision/nav cost, and download/installation size on the intended device tier.

Keep render, physics, navigation, streaming, and gameplay metadata separate enough to tune independently. Create simple colliders rather than using all render triangles indiscriminately. Check traversability, stairs/slopes/door widths, spawn safety, hazard boundaries and interaction reach. A visually correct import is not necessarily playable.

## Compose a coherent world

- Define scale/grid, module dimensions, palette, texel density or pixel scale, material response, lighting/time of day, prop density, collision categories and movement clearance.
- Block out routes and landmarks before dressing. Connect entrances, roads/paths, navigation and streaming boundaries; avoid decorative dead ends where play requires access.
- Normalize inconsistent styles deliberately. Check seams, terrain joins, exposure, roughness/metalness, normal-map conventions and color spaces. Mark color textures and data textures correctly; channel packing is runtime-specific.
- Use stable IDs and explicit dependency graphs for cells and shared resources. Keep source-to-derived mappings so moving or re-exporting files does not silently break saves or references.
- Choose cell sizes from visibility, speed, I/O and residency. Keep expensive landmarks or interiors independently streamable when useful. Define loading/unloading hysteresis, shared ownership and collision readiness.

## Optimize measured costs

Use instancing/material reuse for repeated props, spatial batching for compatible static pieces, and culling/LOD/impostors suited to the camera. Avoid merging a whole world into one mesh or archive if it harms culling or streaming. Simplification must preserve silhouette, seams, UVs, material boundaries, animation and collision requirements.

Select texture resolution/mips and GPU compression by target support. Distinguish download bytes, decoded memory, GPU residency, and transient upload buffers. Mesh compression can reduce transfer while increasing decode cost; test decoder deployment and fallback. Keep editable originals and generate runtime variants per tier.

Optional tools: [glTF Transform](https://gltf-transform.dev/) and [meshoptimizer](https://github.com/zeux/meshoptimizer). Read current documentation and pin versions/settings before using them; neither is mandatory. Preserve provenance after deduplication, atlas generation, or scene merging.

Measure before/after with identical route, settings, build type, hardware and cache conditions. Report p95/p99 frame times and hitches alongside visual/motion review, load times, and resident/peak memory. Avoid universal triangle or texture-count limits. If hardware is missing, report estimates and the target-device verification gap.

## Acceptance checks

1. All referenced resources resolve in a clean packaged build, including case-sensitive paths, decoder files, external tilesets, and runtime dependencies.
2. Materials, animation, tile placement, scale, collision, navigation, interactions and boundaries work in play and in motion.
3. Fast traversal, teleport/reversal, interrupted loads, save/load, and repeated load/unload preserve state and resource ownership.
4. Representative and stress views meet agreed device budgets; degraded tiers preserve critical readability and interaction.
5. Shipped assets and generated derivatives match the manifest. Credits, license texts and applicable source obligations are present.

Deliver an import recipe with tool versions, input hashes, transforms, output paths, changed-file mapping, quality tiers and reproduction steps. Clearly label tests that were not possible.
