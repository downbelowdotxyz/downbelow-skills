---
name: open-source-game-worlds
description: Discover, evaluate, license-check, import, optimize, and compose reusable open-source 2D/3D worlds, maps, modular environments, and assets. Use when selecting or integrating existing world content, with provenance and redistribution requirements.
---

# Open Source Game Worlds

Turn reusable content into a coherent, playable environment with traceable sources, verified permissions for the intended use, and measured runtime cost. Support complete worlds, example scenes, tilemaps, voxel content, terrain data, modular kits, textures, and props. Adapt to the user's engine and art direction. No engine or companion skill is required.

## Define what can be reused

Inspect existing project conventions and requirements. Identify 2D/3D presentation, perspective, genre-independent interaction needs, target runtime/devices, formats, scale, editable-source needs, desired visual style, performance limits, and whether the result ships as a game, public repository, downloadable world, editor template, or asset bundle.

Distinguish software code, artwork, world/map layouts, databases, and service/API terms. Publicly viewable source, free downloads, or a free engine do not establish reusable asset rights. For artwork, use the applicable open-content license rather than describing every license as an OSI software license. Keep restricted 'free for games' alternatives separate from open-content candidates.

## Discover and evaluate

Use [source-catalog.md](references/source-catalog.md) as leads, not a certification list. Search official creators and upstream repositories for the required environment type. Follow mirrors and showcase pages back to the original. Verify current availability, exact file/version, and license evidence before recommending adoption. If browsing is unavailable, report leads as unverified and do not invent checked dates or terms.

Compare a focused shortlist on visual fit, playable layout, runtime/import compatibility, dependency burden, editability, maintenance, measured cost, and licensing suitability. Identify whether each candidate is a complete playable environment, a sample, or components requiring composition. Use the scorecard in [templates.md](references/templates.md); legal/format blockers cannot be averaged away by an attractive score.

## Verify rights before integration

Follow [license-verification.md](references/license-verification.md). Pin the source and keep license evidence, file coverage, authorship, exceptions, and intended-distribution obligations. Record all included dependencies, including textures, audio, fonts, scripts, and embedded components.

Use `unverified`, `blocked`, or `verified-for-use` with a precise use scope. Unclear candidates may remain in a research area, but do not integrate or redistribute them as approved content. Continue with suitable verified alternatives. Escalate only the specific unresolved permission or compatibility question that requires an owner decision.

## Prove the import, then compose

Read [import-and-composition.md](references/import-and-composition.md). Import one representative slice into an isolated staging area first. Confirm transforms, materials, collision, navigation, dependencies, and target-device cost before expanding. Preserve upstream originals, reproducible conversion settings, stable IDs, and provenance through derived assets.

Normalize style and physical conventions; build connected playable spaces; partition for streaming and culling; derive appropriate runtime variants. Test representative views, traversal, boundaries, load/unload, and distribution artifacts. If `game-performance-engineering` is available, it can deepen profiling; otherwise use this skill's measurement and acceptance guidance directly.

## Deliver the result

Provide source and license-evidence links, pinned versions/checksums, candidate decisions, actual integration work, import recipes, asset manifest, required credits/notices/source obligations, and measured quality/performance results. State incomplete or unverified items. For discovery-only requests, deliver the shortlist and evaluation without implying assets were imported or licensed for every future use.
