---
name: start
description: First stop for someone making a game with AI. Use when the person is new, just installed these skills, says "where do I begin", "help me make a game", has no idea or engine yet, or comes back to a project and doesn't know what to do next.
---

# Start

Find out where the person is, check their computer is ready, and name **one** next step. Keep the whole thing to a few short messages. Don't run the next step yourself unless they say go.

## 1. Look before asking

Check quietly:

- Does `PROGRESS.md` exist? Does `game-brief.md`?
- Is there game code already (`package.json`, `project.godot`, a `src/` folder, `*.unity`, `*.uproject`)?
- Is this folder a git repository?

**Returning person** (`PROGRESS.md` exists): read it, say in two lines what works and what was next, and offer that next step (usually `build-next`). Ask nothing else. Stop.

## 2. Ask where they are

One question, with these options:

- **No idea yet.** They want to make *a* game. Next: `game-idea`.
- **Rough idea.** "Something with space", "a cozy farming thing". Ask for it in a few words. Next: `game-idea` with their words.
- **Clear idea.** They can say the genre and what the player does. Ask for it in one sentence. Next: `game-idea` to write it down in 5 minutes. If they'd rather skip that, go straight to `pick-engine` and write the brief afterwards.
- **I already have a game started.** Say what you found on disk. Next: write a `PROGRESS.md` from the code (what runs, how to start it, what seems unfinished), then `build-next` or `fix-bug`.

If what they say doesn't match what's on disk ("no idea" but there's code), mention it once and ask again.

## 3. Check the computer is ready

Run the version checks yourself and report in one line each. Don't install anything without asking.

| Tool | Check | Needed for |
|---|---|---|
| Git | `git --version` | Save points. Always. |
| Node.js 20+ | `node --version` | Browser games (the default). |
| Godot | `godot --version` (on macOS also `/Applications/Godot.app/Contents/MacOS/Godot --version`) | Only if they choose Godot. |

If something is missing, give the official download link (git-scm.com, nodejs.org, godotengine.org) and wait. On Windows, recommend installing Git for Windows, which also adds a terminal that runs these commands.

Then note, without asking, what **you** can use to see and test the game. Nothing here is required; it decides how `playtest` works later:

| Capability | How to tell | If missing |
|---|---|---|
| A browser you can drive | You have a browser or browser-automation tool (built-in browser pane, Playwright MCP, Chrome extension, or similar) | `npx playwright` can run a headless browser on demand when Node is installed. Otherwise the person plays and pastes screenshots or console errors. |
| Blender | `blender --version` | Only needed for converting or fixing 3D models; free packs usually include glTF already. |

Don't ask them to install MCP servers or extra tools now. Mention one only when a later step actually needs it, with a one-line reason. Write what you found to the **Tools available** line in `PROGRESS.md` once it exists, so later sessions don't check again.

## 4. Set expectations, then hand off

Tell them, in about four lines:

- How this works: we write a one-page plan, set up the tools, then build the game one small playable piece at a time. Each piece gets tested and saved.
- What to expect: a first playable version of a small game is realistic in a few sessions. Big ideas (open worlds, MMOs, online multiplayer) get trimmed to a small first version, and that's normal.
- Their job: decide what the game is, play every step, and say what feels wrong.

End with the single next step as a question, for example: "Ready to come up with the idea together?"
