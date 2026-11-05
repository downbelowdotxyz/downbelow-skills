# Practical 3D asset pipeline

## 1. Plan source and runtime ownership

Follow the repository's layout. If none exists, a useful convention is:

```text
art/source/<asset>/       editable scenes, textures, generator and inputs
public/assets/models/    runtime exports for a web project
docs/assets.md           asset provenance, budgets, and verification evidence
```

These are examples, not required directories. Do not serve large authoring files to the browser. Keep an asset inventory when multiple assets or licenses make traceability useful. Record asset ID, role, source/export paths, dimensions, forward/up conventions, moving nodes, clips, collision representation, provenance, license, and budget. Record counts and sizes after export; modifiers and mesh splits can change them.

## 2. Author or acquire

For procedural Blender work, keep a reproducible script and inputs. Use explicit units and deterministic naming; when randomness is intentional, preserve a seed. Run in a dedicated source scene or background process rather than clearing a user's open scene. Discover the installed Blender version and supported operators/options first.

Model silhouette and proportions before secondary details. Do not require realism for a stylized game. Check normals and shading, remove unintended internal/duplicate faces, and use topology suitable for deformation when skinned. Preserve intentional seams, hard edges, and separate parts; joining all geometry can destroy gameplay pivots.

Imported or generated meshes often need cleanup: assess topology, UVs, normals, texture resolution, holes, disconnected pieces, and licenses. Do not assume a preview reveals these defects. Keep the original and make edits in a derived source.

## 3. Materials and textures

Choose a coherent art/material approach, including unlit or vertex color when appropriate. For PBR, verify base color, metallic/roughness, normal, occlusion, emissive, and alpha behavior as used. Color maps and numerical data maps need correct color-space treatment; confirm engine/importer behavior to avoid double conversion.

Blender procedural nodes do not necessarily export as equivalent runtime shaders. Bake required results or translate to supported materials. Check UV orientation, normal-map convention, alpha mode, and texture references in the game. Use atlases/material sharing only when they help measured draw calls and do not break animation or visual requirements.

## 4. Transforms, moving parts, and collision

Establish authoring conventions, export conversion, and engine conventions separately. glTF's coordinate convention does not guarantee the authored asset's intended forward direction. Verify with a known dimension and visible orientation in-engine; avoid stacked compensating rotations across importer, prefab, and physics body.

Apply/freeze transforms only when appropriate to the rig and exporter. Applying transforms after skinning or animation can damage the result. Verify negative/nonuniform scale, joint origins, sockets, bounding boxes, and ground contact.

Use simple collision shapes or compound convex approximations for dynamic bodies where supported. Static environment collision can use different representations according to engine limits and measured cost. Do not assume a high-detail render mesh is a valid dynamic collider. Test contact, clearance, slopes, and fast motion representative of the game.

## 5. Animation

Define clip names and semantics: looping, duration, root motion versus in-place, transitions, and required events. Export the intended actions/tracks, not accidental authoring animations. Verify all moving parts/skin influences survive export and that optimization preserves required nodes. Test actual clip playback and transitions, not only the bind pose.

## 6. Runtime export and validation

1. Export a baseline asset with a documented exporter/version and settings.
2. Inspect structure and metrics; run [Khronos glTF Validator](https://github.com/KhronosGroup/glTF-Validator) for glTF/GLB when available. Resolve errors; assess and document relevant warnings.
3. Confirm external URIs resolve or resources are packaged as intended. Reject a missing texture or unsupported required extension as a delivery defect.
4. Load through the real engine importer with the same decoder/material configuration as production. Check transformed bounds, materials, animation, and collision.
5. Capture useful in-engine views as evidence and record the exact asset tested.

Structural validation does not certify visual quality, collision, licensing, or performance. A standalone viewer helps isolate problems but does not replace integration testing.

## 7. Optimize from measurements

Inspect with the installed version of [glTF Transform](https://gltf-transform.dev/) or equivalent tooling. Check current CLI help before using version-specific flags. Write optimized outputs separately, then compare visual quality, clips, node names, load/decode time, GPU memory, frame time, and download size.

Draco/Meshopt compression adds decoder requirements; KTX2/Basis texture delivery adds transcoder/support requirements. Include those runtime resources in the build and verify they load. Compression ratios do not guarantee faster startup or lower runtime cost. LODs, instancing, material merging, and mesh simplification should preserve pivots, animations, collision references, and the intended silhouette.

Measure in a representative scene at the expected instance count on a named device/browser. Record settings and unmeasured items; avoid estimating FPS from a mesh's triangle count.

## Official references

- [glTF overview and specification entry point](https://www.khronos.org/gltf/)
- [Blender glTF importer/exporter manual](https://docs.blender.org/manual/en/latest/addons/import_export/scene_gltf2.html) — select the installed Blender version.
- [Khronos glTF Validator](https://github.com/KhronosGroup/glTF-Validator)
- [glTF Transform documentation](https://gltf-transform.dev/)

Consult the chosen engine's version-specific loader/importer documentation for supported extensions and setup. Keep source authoring features distinct from runtime format features.
