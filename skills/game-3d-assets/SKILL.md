---
name: game-3d-assets
description: Create, modify, optimize, or integrate actual 3D game models with editable sources, materials, animation/pivots, collision, runtime exports, and in-engine verification. Use for game assets and pipelines; a concept image or render alone is not a finished model.
---

# Game 3D Assets

Deliver real geometry that loads and behaves correctly in the chosen game engine. A concept image, beauty render, or screenshot is supporting evidence, not a substitute for the runtime asset.

## Establish the asset contract

Inspect the existing engine, importers, asset conventions, art direction, camera distance, and device/performance targets. Identify each asset's role: hero object, character, prop, environment, or repeated background element. Define scale/dimensions, orientation, origin/pivots, required moving parts/clips, material style, collision needs, and approximate on-screen size.

Set asset budgets from the scene budget: visible instance count, triangles/vertices, material slots/draw calls, texture resolution/memory, bones/animation, and download size. A single universal triangle count is not a useful quality standard. Reuse existing appropriate assets before creating replacements.

For a significant asset pipeline, read [asset-pipeline.md](references/asset-pipeline.md). Use [acceptance-checklist.md](references/acceptance-checklist.md) before delivery and when auditing existing models.

## Select an available production route

- Use Blender/manual or scripted modeling for editable geometry, components, rigging, UVs, and export. Discover the installed executable/version and inspect its supported scripting/export APIs before writing version-sensitive automation.
- Use existing licensed models where appropriate; retain attribution and record modifications.
- Use AI modeling services such as Meshy or Tripo only when available and within the user's authorized scope. They are optional providers, not assumed dependencies. Do not imply a service ran when no tool/account is connected.
- Use texture/material tools, including Substance when available, for actual material needs; simple coherent materials may be sufficient for stylized work.
- Code-generated meshes are valid final assets when intentionally modeled, editable/reproducible, exportable, and verified. Unmodified primitives remain blockouts unless primitive geometry is the requested art style.

If a preferred tool is missing, choose a viable available route or report the specific blocked deliverable. Do not silently replace a requested 3D model with a raster image or call a partial blockout production-ready.

## Build for gameplay

Create recognizable silhouettes and geometry appropriate to the game's viewing distance and art direction. Provide deliberate materials, UVs where textures require them, and clean normals. Avoid adding details that consume resources without affecting the intended view.

Separate moving components and put their pivots at functional joints. For a vehicle, wheels rotate around axle centers and steering rotates around the steering pivot; the visual mesh should not dictate an impractical physics shape. For characters, validate bind pose, skin weights, and required clips. Use engine metadata or companion files for collision and sockets when the delivery format does not preserve their semantics.

Preserve an editable source (`.blend`, another appropriate source scene, or a reproducible geometry generator with its inputs). Keep source and runtime exports distinct. Do not overwrite licensed originals or destroy the only editable source during optimization.

## Export and optimize

Prefer glTF 2.0 / GLB for browser runtime delivery when the engine supports the required features. GLB is a packaging choice, not proof that every resource is embedded or every material/animation feature is supported. Other formats can be appropriate for established native/editor pipelines; verify the actual importer instead of forcing GLB universally.

Check axis/unit conversion, transforms, hierarchy, texture paths, material translation, and animation clips. Bake unsupported source features where needed. Optimize with measured purpose: reuse instances/materials, remove unused data, right-size textures, simplify meshes or add LODs when beneficial. Treat Draco/Meshopt/KTX2 as compatibility decisions requiring runtime decoders/transcoders and testing, not automatic switches.

## Verify in the game

Validate the export structurally with a format validator when available, then load the actual exported file through the project's real importer and deployed asset path. Inspect under game lighting/camera and exercise scale, pivots, animation, collision, and repeated instances. Check console/network errors and representative performance. A valid file can still be visually or mechanically wrong.

Fix export/integration defects and verify the affected behavior again. Keep the game's shell and session flows functional while integrating assets; use the companion `game-foundation` skill when available for a requested full-game audit.

Report source and export paths, generator commands if used, provenance/license, asset metrics, visual/runtime checks, and limitations. Clearly distinguish created files from proposed work and measured results from targets. If engine verification was unavailable, state that the asset is exported but not yet verified in-engine.
