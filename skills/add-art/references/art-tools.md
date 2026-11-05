# Art and sound tools for beginners

Snapshot checked 2026-11. Prices and terms change: confirm on the tool's own site before telling someone what it costs. Recommend **one** tool, the one that fits the job, not the whole list.

## 2D

| Job | First pick | Also good | Notes |
|---|---|---|---|
| Pixel art and animation | **Piskel** (browser, free) | **Pixelorama** (free, open source), **Aseprite** (about $20; the source can be compiled for free), **LibreSprite** (free fork of old Aseprite) | Start at 16×16 or 32×32 with a small palette (Lospec has free palettes). Export PNG sprite sheets. |
| Painted or hand-drawn art | **Krita** (free, open source) | GIMP for photo-style editing | Draw bigger than needed and scale down in the export, not in the game. |
| Clean shapes, UI, icons | **Inkscape** (free, open source) | Graphite (free, open source, newer) | Export PNG at the size the game shows it (2× for sharp screens). |
| Levels and tile maps | **Tiled** (free, open source) | **LDtk** (free, open source) | Phaser loads Tiled JSON directly. Godot has its own TileMap editor, so use that instead. |
| Bone-based animation | Godot's AnimationPlayer, or DragonBones (free) | Spine (paid) | Only for characters with many moves; frame-by-frame is simpler for a first game. |

## 3D

| Job | First pick | Also good | Notes |
|---|---|---|---|
| Low-poly or blocky models | **Blockbench** (free, open source) | MagicaVoxel (free) or Goxel (open source) for voxels | Easiest 3D start. Exports glTF directly. |
| Anything else: modeling, UVs, rigging, animation | **Blender** (free, open source) | — | Powerful but steep. For a first game, prefer a free kit plus small edits in Blender. |
| Character rigging and animation | **Mixamo** (free with an Adobe account; not open source) | Blender | Upload a humanoid model, get a skeleton and stock animations. Check Adobe's current terms. |
| Textures and materials | Free CC0 textures from Poly Haven or ambientCG | Material Maker (open source), ArmorPaint (paid builds, open source code) | Downscale to 512–1024 px for web games. |

Command-line helpers the agent can use without installing anything permanently:

- `npx @gltf-transform/cli inspect model.glb` reports sizes, textures, and animations. `… optimize in.glb out.glb` shrinks a model.
- `blender -b --python script.py` converts or fixes models without opening the editor, if Blender is installed (see `game-asset-pipeline`).

## Sound and music

| Job | First pick | Also good |
|---|---|---|
| Retro sound effects in one click | **jsfxr** (browser) | Bfxr, ChipTone |
| Recording and editing sounds | **Audacity** (free, open source) | — |
| Simple music | **BeepBox** (browser, open source) | Bosca Ceoil Blue (open source) |
| Full music production | LMMS (free, open source) | — |
| Ready-made sounds and music | Kenney audio packs (CC0) | Freesound (check each sound's license), OpenGameArt |

Export short sound effects as `.ogg` or `.mp3` (both are widely supported) and keep music loops under a few MB.

## AI generation

It's useful, but set expectations:

- **Images and sprites:** good for concepts, backgrounds, and icons. Getting the same character in many poses, or clean pixel art at exact sizes, is hard; expect to clean up by hand (in Piskel or Krita) or use the result as a reference to draw over.
- **3D models** (Meshy, Tripo, and open models such as TRELLIS or Hunyuan3D): fine for props and placeholders. Expect messy geometry, too many triangles, odd pivots, and no rig. Run them through `gltf-transform optimize`, check the scale, and fix the pivot.
- **Music and sound:** check that the service allows use in a game you might sell.
- **Rules:** each tool has its own terms for commercial use, so read them. Steam requires a disclosure of AI-generated content when you submit a game; itch.io lets you tag it; many game jams ban it. Record AI-generated assets in `CREDITS.md` too ("generated with X").
