---
name: build-next
description: Build the next piece of the game from the plan, run it, check it works, and save a checkpoint. Use when someone says "keep going", "what's next", "build the next thing", "add <feature>", or comes back to continue their game. One MVP item (or one requested feature) per run.
---

# Build the Next Piece

One small piece per run, finished and playable. The loop is: **pick → say what they'll see → build → run and look → save → hand it to them to play.**

## 1. Pick the piece

Read `PROGRESS.md` and `game-brief.md`. If `PROGRESS.md` is missing, create it from [progress-template.md](references/progress-template.md), filling it in from the code.

- If they asked for something specific, that's the piece. If it's in **Out of scope** or adds a big new system (accounts, online play, saving, a shop), say so in one line and ask whether to add it to the MVP or keep it for later.
- Otherwise take the first unchecked item in **Build order**.
- If the piece is big, build the smallest slice of it that's still playable ("one enemy that walks toward you" before "an enemy system").

Say it in two lines before writing code: what you'll build and what they'll see when it's done. For example: "Next: coins. You'll see yellow coins scattered around; touching one makes it vanish and the score goes up by 1."

## 2. Build it

- Fit into the code that's already there. Match its style, file layout, and names. Read before you write.
- Keep things simple and easy to tune: put numbers people will want to tweak (speed, jump height, spawn rate) at the top of the file or in one settings object, with a short comment.
- Placeholder art (colored shapes, simple sounds) is fine and expected. Note what's placeholder in `PROGRESS.md`. When they want real art or sound, use `add-art`.
- Don't reorganize unrelated code, rename things, or add libraries unless this piece needs it. If you think a cleanup is needed, say so and do it as its own step.
- Add a quick automated test only for real logic that's easy to get wrong (scoring, timers, inventory math). Never test instead of looking.

## 3. Run it and look

Use `playtest` (browser games) or the engine's screenshot run (Godot: see `playtest`). Check that:

- the new piece does what you said it would,
- the things that already worked still work (start the game, move, the main loop),
- there are no errors in the console or log.

If something's wrong, fix it now; that's part of this step. If you can't run the game in this environment, say so and give them a short checklist to try instead. Don't call it done.

## 4. Save

- Tick the item in `game-brief.md` if it's finished.
- Update `PROGRESS.md`: Works now, Next step, Known problems, any Decision made.
- Commit with a plain message ("Add coins and score") and say "Saved a checkpoint."

## 5. Hand it over

Tell them exactly how to try it: what to run or refresh, what to press, what should happen. Then ask one question about **feel**, not code: "Is the jump too floaty?", "Should coins be rarer?" Their answer is the next tweak.

Then offer the next step from the build order.

## When the MVP is done

All MVP items checked means version one exists. Congratulate them and offer, in this order:

1. **Polish pass**: game feel (screen shake, hit sounds, particles, squash and stretch), a title screen and a game-over screen with "play again", and real art and sound (`add-art`). Use `game-foundation` for menus, pause, and settings, and `game-ui-screens` so they look like part of the game.
2. **Let a friend play it**: `ship-it`.
3. **Pick one Out-of-scope item** to move into a new MVP list.
