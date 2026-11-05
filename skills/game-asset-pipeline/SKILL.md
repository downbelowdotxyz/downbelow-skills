---
name: game-asset-pipeline
description: Build a reproducible pipeline that takes third-party or generated 3D/2D assets from upstream download to shipped runtime files — pinned sources with checksums, scripted fetch, headless conversion (Blender, glTF tools), scale and pivot normalization, colliders, a provenance manifest, credits, and tests that keep shipped files honest. Use when importing asset packs, kits, characters, textures, or props into a game, or when regenerating existing imports.
---

# Game Asset Pipeline

Every shipped asset should be reproducible from a pinned upstream with one command, traceable to its license, and checked by tests. Choose sources and verify licenses with `open-source-game-worlds` and author or fix models with `game-3d-assets` if those skills are available; this skill covers the mechanics between "chosen" and "in the game". It does not depend on a particular engine or language.

## Before downloading

1. **Check disk space** where downloads and scratch files will go (`df -h`). Asset packs and Blender temp files can fill a small temp volume mid-run. Put scratch output in a git-ignored folder inside the project or a large volume, not a tiny system temp.
2. **Confirm the selection** with the user when it is large or replaces existing content: which packs, which pieces, approximate download size.
3. **Read the source's terms and download method.** Some sites serve files through an API (use it, with a descriptive User-Agent); others hide download links behind page scripts. Reading the page's own download code to find the file URL is fine; bypassing payment, login, captchas, or rate limits is not. Respect "no redistribution of the raw pack" terms by keeping upstream files out of git.

## Pipeline stages

Use the layout and file shapes in [pipeline-layout.md](references/pipeline-layout.md).

1. **Pin.** A script resolves the selection to exact file URLs, sizes, and checksums and writes `sources.json`. Run it only when the selection changes.
2. **Fetch.** A script downloads pinned files into `upstream/` (git-ignored), verifies checksums, and records SHA-256 hashes in a lock file. It skips files already present and valid.
3. **Convert.** A headless build turns upstream files into runtime files: Blender in background mode for format conversion, joining, decimation, and baking; glTF tools for compression and texture resizing. Normalize units (meters), up axis, forward axis, and pivots (ground contact at the origin for props and characters, attachment points named consistently).
4. **Collide.** Generate simple collision shapes (boxes, capsules, convex hulls) from the converted geometry or from a declared table; never use full render meshes as physics colliders unless the engine requires it.
5. **Record.** Write a manifest listing each component: source URL, author, license with local evidence, upstream hash, derived output paths with hashes and byte sizes, triangle counts, and texture sizes.
6. **Credit.** Update the project's credits file from the manifest, even when the license does not require attribution.
7. **Test.** Add or update tests from [verification.md](references/verification.md) so shipped files match the manifest and meet budgets.
8. **Wire up.** Add an npm/make script for each stage and document the one command that rebuilds everything.

## Integration checks

Load the result in the game, not only in a viewer. Check scale against the player, grounding (no sinking into or floating above surfaces), attachment points (hands on grips, feet on pedals or deck), collider alignment with visuals, and frame cost. For characters and vehicles, a dev-only lab page that shows one asset from several angles in scripted states makes posture and fit problems easy to see; keep before/after screenshots with the change.

## Report

List what was imported (with licenses), the commands to rebuild, budgets and measured sizes, test results, and anything not verified in the running game.
