---
name: playtest
description: Play the running game to prove a change works. Start or reuse the dev server, wait until gameplay is ready, send scripted input, read the screen and game state, and capture screenshots. Also covers Godot screenshot runs and asking the person to play. Use after any gameplay, controls, HUD, world, or visual change, and whenever you are about to say "it works".
---

# Playtest

Prove a change in the running game, not only in code or tests. A playtest is repeatable: a known starting state, scripted input, an observed result, and evidence (numbers or a screenshot). Then the person plays it too, because only they can say whether it feels right.

## Which browser to use

Check the **Tools available** line in `PROGRESS.md` first. Use, in order:

1. Your own browser or browser-automation tool (a built-in browser pane, Playwright MCP, a Chrome extension).
2. A headless browser on demand: `npx playwright` (Node required; it may download a browser the first time, so say so and ask before it runs). Use the no-throttling flags listed in [scripts/harness.js](scripts/harness.js).
3. Neither: the person plays. Give them the 30-second script below and ask for a screenshot and any red console text.

Don't stop to install an MCP server for this. If one would clearly help because they'll playtest often, mention it once in a line.

## Browser games

### Before opening the browser

1. **Reuse a running dev server.** Read `package.json` scripts and check which ports are already in use (`lsof -iTCP -sTCP:LISTEN -nP | grep node` on macOS/Linux). If a server for this folder is running, use it. Don't start a new one on a new port every time; old servers pile up. If none is running, start one in the background.
2. **Know what "ready" means.** Find the signal that gameplay has started: a debug flag, a HUD element, the loading screen being gone. A debug flag is better than matching text. Read [debug-bridge.md](references/debug-bridge.md); if the game has no bridge and you'll playtest more than once, offer to add one. It's about 20 lines.
3. **Know how input is read.** Find the input listener: its target (`window`, `document`, or the canvas), whether it reads `code` or `key`, and whether it needs focus or pointer lock. Phaser's keyboard plugin listens on `window` by default. Synthetic `KeyboardEvent`s are "untrusted"; if the game ignores them, use the browser tool's real key presses instead.

### Run it

1. **Check the page runs at full speed.** Hidden or covered browser windows slow `requestAnimationFrame` to about 1 FPS or stop it, which breaks motion, physics, and loading without any error. Run `__pt.health()` from [scripts/harness.js](scripts/harness.js) first, and again if loading stalls. If the frame rate is far too low, ask the person to bring the browser window on screen, or use a headless browser with the flags listed in that file. Don't report timing results from a throttled page.
2. **Install the harness.** Evaluate `scripts/harness.js` in the page. It adds `window.__pt` with key hold/tap, timed routes, a ready wait, error capture, layout checks, and a frame timer. Adjust key codes and the ready check to the game.
3. **Set the starting state** with the game's own tools: URL parameters, saved settings in `localStorage`, the debug bridge. Note what you changed and undo it afterwards.
4. **Drive input with a fixed script.** Use `__pt.route([...])` with explicit durations so the run can be repeated. Release every key at the end. To compare "feel", run the same route before and after the change.
5. **Observe.** Read state through the bridge (position, score, current screen) and the HUD text. Take screenshots at the moments that matter. Collect `__pt.errors()` and the console.
6. **Cover what the change touched**: each control, each screen it appears on, desktop and phone widths when the UI changed. [checklists.md](references/checklists.md) has the common sets.

## Godot

The `godot` command may not be on the PATH. On macOS it's usually `/Applications/Godot.app/Contents/MacOS/Godot`. Ask once if you can't find it.

Capture real frames, never with `--headless` (it skips drawing):

```bash
godot --path . --windowed --resolution 1280x720 --write-movie shots/check.png --quit-after 90 res://main.tscn
```

This writes `shots/check00000000.png` … one per frame; look at the last one. Launch straight into the scene you changed by passing its `.tscn`. Read the output log for errors. For input-driven checks, add a temporary debug script that simulates the input with `Input.action_press` and remove it afterwards, or ask the person to play.

Other engines: use the engine's own screenshot command from a windowed build. If you can't capture anything, say so.

## Ask the person to play

After your own check, give them a 30-second script: "Refresh, press Space three times, walk into the red block. Expected: you bounce back and lose one heart." Ask what felt off. Their "it feels slow / floaty / unfair" is a real result. Turn it into a numeric tweak (speed, gravity, timing) and try again.

## Report

Say what you exercised, the route and starting state, what you saw (numbers, screenshots), and what you didn't check and why (throttled page, needs a server, couldn't launch Godot). Remove temporary probes, flags, and test saves. Never describe behavior you didn't observe as working.
