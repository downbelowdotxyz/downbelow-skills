---
name: fix-bug
description: Find and fix one problem in the game without breaking anything else. Use when something is broken, weird, or "not working": a crash, a blank screen, the player falling through the floor, a button that does nothing, a score that's wrong, or "it worked yesterday".
---

# Fix a Bug

Understand it, see it happen, find the real cause, make the smallest fix, prove it's fixed. Don't rewrite systems or switch tools to get away from a bug.

## 1. Get the story

If it isn't already clear, ask for three things in one message:

- **What you did**: the steps ("start the game, jump onto the second platform").
- **What you expected.**
- **What happened instead**: plus any red error text, or a screenshot.

Beginners often can't find errors. Tell them where to look: in a browser, right-click → Inspect → **Console** tab; in Godot, the **Output** and **Debugger** panels at the bottom.

## 2. See it yourself

Reproduce it before changing code: run the game (`playtest`) and follow their steps, or read the error and find the line. If you can't reproduce it, say so, try a variation or two (other screen size, other browser, after restarting), and ask one focused question. Don't guess-fix something you've never seen fail.

**"It worked before"**: use git. `git log --oneline` shows the checkpoints, and `git diff <checkpoint>` shows what changed since. The cause is almost always in that change. Explain this to them once; it's the most useful habit they can learn.

## 3. Find the cause

Look for why it happens, not just where. Common causes in first games:

| Symptom | Usual cause |
|---|---|
| Blank or black screen | A JavaScript error on load (read the console), a wrong asset path, the camera pointing at nothing, or the canvas size being 0. |
| Something moves faster on some computers | Movement not multiplied by frame time (`delta`). |
| Falls through floors, sticks to walls | Collision shapes the wrong size or offset, moving too far in one frame, or moving the object directly instead of through physics. See `game-physics-regression`. |
| Keys stop working | Focus lost to a menu or text field, a listener added twice, or a held key never released on window blur. |
| Things happen twice after restarting | Old listeners, timers, or loops not cleaned up when the scene restarts. |
| Works locally, broken online | Asset paths that start with `/` or have the wrong letter case. See `ship-it`. |
| Blank page when opening `index.html` directly | Browsers block loading files from `file://`. Run the dev server (`npm run dev`) instead. |
| Pixel art looks blurry | Image smoothing is on. See `add-art` [import-gotchas.md](../add-art/references/import-gotchas.md). |
| 3D model is huge, tiny, lying down, or floating | Wrong export scale, Z-up vs Y-up, or the pivot in the wrong place. See [import-gotchas.md](../add-art/references/import-gotchas.md). |
| No sound | Browsers block audio until the first click or key press. |
| Save data gone | `localStorage` lives in one browser on one device; clearing site data, private windows, or a different URL (localhost vs the published site) all start fresh. |

If you add temporary logs or debug drawing to find it, remove them afterwards.

## 4. Fix it, smallest change first

Change only what causes the bug. If the right fix is bigger (the code's structure is the real problem), explain the choice in two lines and let them pick: quick patch now, or proper fix as its own step.

## 5. Prove it

- Follow their original steps again and confirm it no longer happens.
- Check that the nearby things still work (`playtest`).
- If the bug was in logic that's easy to break again (score, collisions, timers), add one small test or a debug check that would catch it.
- Commit ("Fix: player fell through moving platforms") and update **Known problems** in `PROGRESS.md`.

Explain the cause in one or two plain sentences. That's how they learn to spot it next time.
