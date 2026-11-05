---
name: add-art
description: Get art, models, music, or sound effects into the game, from a free pack, made in a beginner-friendly tool, or AI-generated, then import it correctly and credit it. Use when someone says "make it look better", "replace the squares", "I need a character / tileset / 3D model", "add sounds or music", or asks what tools to draw or model with.
---

# Add Art and Sound

Get one set of assets in, looking right in the game, with its license recorded. Start with the cheapest path that works. Squares are fine until the game is fun; if the core loop isn't working yet, say so once and offer to keep placeholders.

## 1. Pin down what's needed

In one message, find out or suggest: what it's for (player, enemies, tiles, UI, props, music, sound effects), the style from the brief's **Look & sound** line, 2D or 3D, and whether this is placeholder or "for real". Matching style matters more than quality: one consistent pack beats five mismatched good ones.

## 2. Choose the path

Offer these in order, and recommend the first one that fits:

1. **Free pack.** Fastest, and the license is clear. For most first games, start with Kenney (CC0, 2D and 3D, consistent styles), then the other sources in the `open-source-game-worlds` catalog ([source-catalog.md](../open-source-game-worlds/references/source-catalog.md)). Search for packs that cover the whole set (player, tiles, and enemies in one style).
2. **Make it themselves.** Good when they want it to feel like *theirs*. Pick the tool from [art-tools.md](references/art-tools.md) and give them a 5-minute starting recipe: canvas size, palette, export format, and where to save the file. Encourage tiny: a 16×16 character is a real character.
3. **AI-generate it.** Good for concept art, props, and placeholders. Read the warnings in [art-tools.md](references/art-tools.md#ai-generation) and pass them on: messy 3D models, inconsistent styles between images, terms that vary by tool, and Steam's disclosure rule.

You can mix paths (a free tileset with a hand-drawn hero). Keep the look consistent.

## 3. Check the license before it touches the project

For each asset from someone else, read [licenses.md](references/licenses.md), open the asset's own page, and confirm the license there. A search snippet or a list (including this skill's) isn't enough, because terms change. Save the license file that comes with the pack. If the license is unclear, non-commercial while they might sell the game, or share-alike they don't understand, explain the catch in one sentence and pick something else.

Add a line to `CREDITS.md` right away: asset, author, source URL, license, date downloaded. Create the file if it's missing.

## 4. Import it the right way

Put assets in one predictable folder (`public/assets/` for Vite, `assets/` for Godot), with lowercase file names that have no spaces. Then follow [import-gotchas.md](references/import-gotchas.md) for the type: pixel-art scaling, sprite sheets, 3D scale and orientation, pivots, collision shapes, texture sizes, audio formats, and the click-to-unlock rule for browser audio. Explain the one gotcha that applies in a sentence as you handle it.

Big files: if the asset folder grows past roughly 50 MB, or single files are over 10 MB, set up Git LFS before committing, and tell them why in one line.

## 5. Look at it in the game

Run `playtest`. Check that the asset shows at the right size, faces the right way, animates, collides with its real shape (not its bounding box, unless intended), and doesn't blur or flicker. For sound: it plays after the first click or key press, isn't too loud, and can be muted.

## 6. Save

Commit ("Add Kenney pixel platformer art"), update `PROGRESS.md` (what's placeholder and what's final), and ask one question about the look: "Is the character readable against the background?"

For bigger asset work, hand off to the specialists: `game-3d-assets` (making or fixing real 3D models), `game-asset-pipeline` (importing many packs reproducibly), `open-source-game-worlds` (whole environments).
