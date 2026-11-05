# World inventory

Fill this in before changing the world. Keep a copy in the project docs if none exists; it saves the next session from rediscovering it.

```text
Maps:
  <map id> — <player-facing name> — defined in <files> — built by <procedural code / scene file / data>
Zones / spots per map:
  <zone id> — <player-facing name> — bounds or center — spawn point(s) — how reached (menu / teleport / URL)
Obstacles and features:
  ramps, rails, jumps, buildings, props — defined in <files>; colliders from <source>
Checkpoints / challenges:
  <id> — zone — defined in <files>
Consumers of world data:
  physics colliders:     <files>
  terrain height:        <files>
  rendering / props:     <files>
  server simulation:     <files>
  minimap:               <files>
  menus / pause / HUD:   <files>
  tests:                 <files>
Recent changes:          <commit or session> — new layout / reskin / props only
```

Useful searches: player-facing names (exact and lowercase), zone IDs, spawn function names, the coordinates of a well-known spot, and the obstacle type names.

## Change checklist

**Rename a place**
- [ ] Player-facing strings: menus, pause teleports, HUD and minimap labels, loading tips, challenge descriptions, docs.
- [ ] Spelling variants: case, hyphenation, abbreviations.
- [ ] Internal IDs unchanged, or migrated (saved progress, URLs, server messages, analytics).
- [ ] Tests referencing names updated.

**Move, add, or remove obstacles**
- [ ] Data or code that places them.
- [ ] Colliders (client and server if both simulate).
- [ ] Visual props and any merged or instanced batches.
- [ ] Minimap drawing.
- [ ] Checkpoints and challenge routes that pass through them.
- [ ] Spawn clearance: nothing spawns inside or facing an obstacle.
- [ ] Tests that ride over or around them.

**Add a zone or map**
- [ ] Bounds, ground surfaces, and terrain height.
- [ ] Spawn point(s) and how the player reaches it.
- [ ] Colliders, props, lighting.
- [ ] Minimap, menus, teleports, loading.
- [ ] Server knows the map if it validates positions.
- [ ] A physics or scenario test that spawns there and moves without crashing.
- [ ] Frame cost checked.

**Change entry structure (worlds vs spawn points)**
- [ ] Menu entries and their handlers.
- [ ] Pause-menu travel options.
- [ ] Default spawn when entering.
- [ ] Invite or room links that carry a map or spawn.
