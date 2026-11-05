# Ways to build a game

Snapshot checked 2026-11. Pricing, royalties, and licenses change: confirm on the official site before quoting a cost. Use this when someone asks "what are my options", or when the default (Phaser / Three.js in the browser) doesn't fit. Recommend one option with a reason; don't recite the table.

**How well AI tools handle it** matters for beginners. Text-based projects (code and plain-text scene files) are easy for an agent to read, change, run, and test. Editor-heavy tools need more clicking by the person.

## No code or low code

| Tool | Good for | Cost / license | With an AI agent |
|---|---|---|---|
| GDevelop | 2D (some 3D), visual events | Open source (MIT) | Limited: mostly editor work. |
| Construct | 2D in the browser | Paid subscription | Limited. |
| GameMaker | 2D | Free for non-commercial use; paid to sell | Okay: GML scripts are text. |
| RPG Maker | Classic JRPGs | Paid | Limited. |
| Roblox Studio, Fortnite UEFN | Games inside those platforms, with a built-in audience | Free; platform rules and revenue share apply | Okay (Luau, Verse); the platform owns distribution. |
| Twine, Ren'Py, Bitsy | Text adventures, visual novels, tiny story games | Open source | Good: mostly text. |

## Browser frameworks (the default here)

| Tool | Good for | License | With an AI agent |
|---|---|---|---|
| **Phaser** | 2D: platformers, top-down, arcade, puzzle | MIT | Excellent: lots of examples; the agent can run and play it in a browser. |
| KAPLAY (formerly Kaboom) | Very simple 2D | MIT | Excellent. |
| PixiJS | Fast 2D drawing only (you add input, physics, scenes) | MIT | Good. |
| **Three.js** | 3D | MIT | Excellent: the most examples. You add game structure yourself. |
| Babylon.js | 3D with more built in (physics, inspector, GUI) | Apache 2.0 | Good. |
| PlayCanvas | 3D, engine plus an online editor | Engine MIT; hosted editor | Good with the engine alone. |
| Plain canvas | Tiny one-screen games | — | Excellent. |

## Full engines with an editor

| Engine | Good for | Cost / license | With an AI agent |
|---|---|---|---|
| **Godot** | 2D and 3D; desktop, web, mobile | MIT, no fees | Good: GDScript and `.tscn` scenes are plain text; CLI can screenshot and export. |
| Unity | 3D and mobile; huge tutorial base | Free tier with revenue limits; paid plans | Okay: C# is fine, but scenes and the editor need the person; slow to run headless. |
| Unreal | High-end 3D | Free; 5% royalty after $1M gross per game | Hard for beginners: heavy, Blueprint graphs aren't text. |
| Defold | Light 2D, mobile and web | Free, source available | Good: Lua, text files. |
| Bevy (Rust), Stride (C#), O3DE (C++) | Code-first engines | Open source | Okay, but not beginner-friendly languages. |

## Code-only libraries

LÖVE (Lua), Raylib (C, with bindings for many languages), MonoGame (C#), Pygame (Python). Great for learning programming, and AI agents handle them well. You build menus, scenes, and export yourself. Web export is harder than with Phaser.

## Fantasy consoles

PICO-8 (paid) and TIC-80 (open source): tiny screens, tiny palettes, built-in sprite, map, and sound editors. The limits make finishing easy, and the games run in the browser. A good choice for someone who likes retro style.

## Where games get published

| Place | Cost | Good for |
|---|---|---|
| itch.io | Free | First games, browser games, jams, feedback. |
| GitHub Pages | Free | Browser games when the code is on GitHub. |
| Web portals (Poki, CrazyGames, and others) | Free; revenue share from ads | Polished browser games that load fast. Check each portal's requirements. |
| Steam | $100 per game (Steam Direct, recoupable after sales) | Desktop games ready for a store page; AI content must be disclosed. |
| Mobile stores | Apple yearly developer fee; Google one-time fee | Phone games; more review steps. |
