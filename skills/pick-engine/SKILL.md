---
name: pick-engine
description: Choose the engine and tools for a game, set up the project, and get one thing moving on screen. Use after the game idea is written down, when someone asks "what engine should I use", "Phaser or Godot", or wants their project set up. Also use before switching engines on an existing project.
---

# Pick the Engine and Set Up

Choose the simplest tools that fit the game, set up a project that runs, and finish with **one thing the player controls moving on screen**. That's the first save point.

## 1. Read first

Read `game-brief.md` if it exists. Check what's already on disk (`package.json`, `project.godot`, Unity or Unreal project files). **If a project already works in some engine, keep it.** Switching engines restarts the project; only suggest it for a concrete blocker, and explain the cost.

If they've already named an engine, use it.

## 2. Choose

| The game is… | Use | Why |
|---|---|---|
| 2D, plays in a browser (most first games) | **Phaser + Vite** | One command to run, the AI can see and test it in a browser, easy to share on itch.io. |
| 3D, plays in a browser | **Three.js + Vite** | Same benefits. Keep the world small: Three.js draws scenes, and we add the game parts ourselves. |
| They want a visual editor, or a desktop or console game | **Godot 4** | Free editor with a scene view; exports to desktop and web. More clicking in the editor, fewer browser tools for the AI. |
| They already know Unity or Unreal | That engine | Familiarity beats everything. Expect slower AI testing loops. |
| Tiny game (one screen, a few shapes) | **Plain HTML canvas + Vite** | Nothing to learn. |

Say your pick and the reason in two lines and ask if that's OK. If they ask what the options are, or want no-code tools, a fantasy console, or a specific platform (Roblox, Steam, mobile), read [ways-to-build.md](references/ways-to-build.md). For harder cases (physics-heavy, many objects, online play, mobile-first), read [engine-matrix.md](references/engine-matrix.md) before choosing.

Don't add separate physics, networking, state, or UI libraries now. Add them later, only when a build step really needs one.

## 3. Set up

Check the current official docs for the version you install. Don't rely on memory for setup commands or APIs.

**Browser (Phaser / Three.js / canvas):**

1. Create a Vite project in the current folder (`npm create vite@latest`, vanilla JavaScript or TypeScript; ask which only if they care, otherwise use JavaScript for readability). Add `phaser` or `three` with npm.
2. Replace the sample page with a full-window game canvas.
3. Make the first playable thing: a shape or sprite the player moves with arrow keys / WASD (or touch, if the game is phone-first), plus a visible background so it's clearly running.
4. Start the dev server and open it. Use `playtest` to confirm the thing actually moves when a key is pressed.

**Godot:**

1. Create the project (`project.godot`, a `main.tscn` main scene, a player node with a script that moves it with the arrow keys).
2. Check it runs: `godot --path . --windowed --resolution 1280x720 --write-movie shots/first.png --quit-after 60`, then look at the last screenshot. Ask the person to press Play in the editor and confirm it moves.

## 4. Save the first checkpoint

- `git init` if needed. Add a `.gitignore` for the engine (`node_modules/`, `dist/`, `.godot/`, `shots/`). Commit: "First playable: player moves". If they plan big 3D or audio assets, mention that Git LFS will come in later (`add-art` sets it up when needed).
- Fill the brief's **Tech** line.
- Create `PROGRESS.md` from the `build-next` skill's [progress template](../build-next/references/progress-template.md): how to run the game, what works, the next step (build order item 1).

## 5. Tell them how to run it themselves

Give the exact command and URL (or "open Godot, press F5"), and explain what a dev server is in one line: "it serves your game to your browser and reloads when the code changes; leave it running while we work." Then point to `build-next`.
