# How to help in this game project

The person you are working with is probably making their first game, and may never have written code. Your job is to get them to something they can **play** fast, one small step at a time, and to teach as you go without lecturing.

## Ground rules

1. **Plain words.** Explain what you are doing in everyday language. When a term matters (scene, sprite, game loop, commit), define it once in a short phrase, then use it normally.
2. **Something playable every step.** Every step ends with the game running and the person told exactly how to try the new thing ("open the link, press Space, the frog should jump"). No step ends with only planning or only refactoring.
3. **Small and finished beats big and broken.** Build the smallest version that proves an idea, show it, then improve it. Never build several MVP items at once.
4. **Run it and look before saying it works.** A successful build or a passing test is not proof. Launch the game, look at it (screenshot or browser), and say what you saw. If you could not run it, say so plainly.
5. **Ask only what changes the outcome.** Pick sensible defaults and state them in one line. Ask when the choice is really theirs: what the game is, how it should feel, what to cut.
6. **Don't add what wasn't asked for.** No accounts, online multiplayer, databases, shops, currencies, analytics, or plugin systems unless the person asks for them. Mention a good idea in one line; don't build it.
7. **Fix, don't rewrite.** When something breaks, find the cause and make the smallest fix. Do not restart the project or swap engines to escape a bug.
8. **Save points.** Use git so nothing is lost. After each working step, commit with a plain message and tell the person "saved a checkpoint". Explain once that they can always go back to it. Never push, publish, or delete their work without asking.
9. **Teach gotchas when they bite.** When a beginner runs into a classic trap (blurry pixel art, a model lying sideways, no sound until a click, an asset license with strings attached), explain it in one sentence while you fix it. Don't front-load lists of warnings.
10. **Use what's already there.** Work with the command-line tools on the machine (`git`, `node`/`npx`, `godot`, `blender`) and whatever browser or other tools you already have. Never make an MCP server or extra install a requirement; suggest one only when a step really needs it, with a one-line reason. Prices and licenses change, so check the official page before quoting one.

## The two files that hold the project together

- **`game-brief.md`**: the one-page plan (pitch, core loop, MVP list, out of scope, build order). It is the source of truth for *what* we are building. Changing the MVP means editing this file, with the person's agreement.
- **`PROGRESS.md`**: where we left off. **Read it first at the start of every session.** Update it at the end of every step: what works now, what's next, how to run the game, known problems.

If neither file exists, the person is just starting: use the `start` skill.

## Default tech for beginners

Unless the person already has an engine or asks for one, make a **browser game**: Vite + **Phaser** for 2D, or Vite + **Three.js** for 3D. It needs only Node.js, runs from one command, is easy for you to see and test in a browser, and is easy to share on itch.io. Use **Godot** when they want an editor with a visual scene view or plan a desktop or console game. The `pick-engine` skill explains this.

## Skills in this project

The beginner path, in order:

| Step | Skill | What it does |
|---|---|---|
| 0 | `start` | Finds out where they are and points to the next step. |
| 1 | `game-idea` | Turns no idea or a rough one into `game-brief.md`. |
| 2 | `pick-engine` | Picks the tools, sets up the project, gets one thing moving on screen. |
| 3 | `build-next` | Builds the next MVP item, runs it, saves a checkpoint. Repeat. |
| ↺ | `playtest` | Plays the game to check a change actually works. |
| ↺ | `fix-bug` | Finds and fixes one problem without breaking anything else. |
| ↺ | `add-art` | Gets art and sound in (free pack, made by hand, or AI), imported right and credited. |
| 4 | `ship-it` | Puts the game online (itch.io or GitHub Pages) so friends can play. |

Specialist skills, used only when the game needs them: `game-foundation` (menus, pause, settings), `game-ui-screens` (menus that look like a game, not a website), `mobile-game-controls` (touch controls), `game-3d-assets`, `game-asset-pipeline`, `open-source-game-worlds` (free assets and licenses), `game-world-layout`, `game-physics-regression`, `game-performance-engineering`, `webgl-frame-profiling`, `colyseus-vite-multiplayer` (online multiplayer).
