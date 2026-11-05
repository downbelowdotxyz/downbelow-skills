---
name: game-world-layout
description: Understand, explain, and change how a game's world is structured — maps, zones, spawn points, obstacles, checkpoints, teleports, and their names — and keep data, colliders, rendering, server, minimap, menus, and tests consistent. Use when asked why worlds look the same, to add, remove, rename, or move places or obstacles, to rework a play area's composition, or to decide between separate worlds and spawn points on one map.
---

# Game World Layout

Know what the world actually is before changing it, then change every place that depends on it. Players and users often say "worlds" or "maps" for things the code treats as spawn points, zones, or reskins; name them precisely. Engine and genre independent. Use `open-source-game-worlds` for sourcing new world content and `game-asset-pipeline` for importing it, if available.

## 1. Map the world model

Before answering questions or editing, write a short inventory using [world-inventory.md](references/world-inventory.md):

- How many distinct maps exist, and where each is defined (data files, procedural code, terrain functions, scene files).
- What a "zone", "spot", "level", or "mode" means in this code, and how the player reaches each one (menu entries, spawn IDs, teleports, URL params).
- Every consumer of world data: physics colliders, terrain height, rendering and props, server-side simulation or validation, minimap, menu and pause screens, HUD labels, challenges or checkpoints, tests.
- Which content was changed recently and how: a full new layout, or only new textures and props on the same layout. Say which plainly when asked why things look the same.

## 2. Decide the change with the user when it is structural

Renames and small moves can go ahead. For structural choices, give a recommendation and confirm:
- **Separate worlds vs spawn points on one map.** If options all lead to the same map, one primary entry (one Ride or Play button) with in-game travel (teleports, a map screen) is usually clearer than a menu of near-identical choices. Separate worlds are worth it when they differ in layout, rules, or mood.
- **Reskin vs new layout.** New textures and props do not make a new world. A new layout needs new geometry, colliders, spawn points, and routes.

## 3. Change it everywhere

Follow the change checklist in [world-inventory.md](references/world-inventory.md#change-checklist). For renames, change player-facing names and keep internal IDs stable unless the task requires otherwise; if IDs change, migrate saved data and URLs. For moved or removed obstacles, update colliders, visuals, minimap, checkpoints, spawn clearance, and tests together.

## 4. Composition

When reworking a play area, read [composition.md](references/composition.md): compact over empty, one consistent scale based on the player, clear lines of travel, readable landmarks, and surrounding context so the space feels like part of a larger place.

## 5. Verify

Run the world, physics, and gameplay tests, then visit every changed zone in the running game (`playtest` for browser games): spawn there, ride or walk the main lines, check names in menus and HUD, and screenshot. Report zones you did not visit.
