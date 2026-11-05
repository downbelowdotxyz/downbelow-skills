# 3D asset acceptance checklist

For each required asset, mark **passed**, **failed**, **not tested**, or **not applicable** with a short reason. Optional features are not failures when the asset contract does not require them. Fix scoped failures before describing the asset as complete; report unavailable checks explicitly.

## Deliverables and provenance

- An actual runtime model exists and its source/export paths are recorded.
- An editable scene or reproducible geometry generator and required inputs exist.
- Origin, license, attribution, and modifications are recorded for acquired content.
- The final asset meets the agreed art direction; temporary blockouts are identified.

## Geometry and transforms

- Dimensions, forward/up direction, origin, and ground placement work in-engine.
- Normals, shading, UVs where required, and silhouettes are correct at gameplay distance.
- Moving components remain separate with correct pivots and predictable node names.
- Exported bounds, hierarchy, and transforms are correct; no unintended geometry is visible.

## Materials and animation

- Required textures resolve; material appearance and color spaces are correct under game lighting.
- Alpha, normals, roughness/metallic, and emissive behave correctly where used.
- Required rigs/clips survive export, play correctly, and transition as intended.
- Root motion/in-place behavior and gameplay attachment points are correct where relevant.

## Collision and performance

- Collision representation matches the engine and game; moving parts contact and clear their surroundings correctly.
- Triangle/vertex counts, material/draw-call counts, texture sizes, and file sizes are recorded against the agreed budget.
- Any LODs, instances, or compression extensions preserve required features and load using production runtime dependencies.
- Representative scene performance is measured; hardware/browser, instance count, quality settings, and measurement method are recorded.

## Technical and runtime verification

- Structural validation has no unresolved errors; relevant warnings are assessed.
- The exact exported asset loads from the project's real runtime path without missing resources or loader errors.
- In-engine visual inspection covers representative viewpoints, lighting, motion, and interactions.
- Game navigation/session flows affected by integration still work.
- Evidence names the files/build tested and distinguishes measured results from unverified assumptions.
