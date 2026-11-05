---
name: ship-it
description: Put the game online so friends can play it from a link, on itch.io or GitHub Pages, with a quick pre-launch check. Use when someone says "share", "publish", "put it online", "let my friends play", "upload to itch", or "deploy".
---

# Ship It

Get a build that works from a fresh link on someone else's device, then help the person upload it. Publishing is public and under their name: **they** create accounts, log in, and press publish. You prepare everything and walk them through it.

## 1. Quick pre-launch check

Fix what's broken; skip what doesn't apply.

- [ ] The game starts from a cold load to playable, with no console errors.
- [ ] There's a title or start screen with a clear "Play", and a way to play again after winning or losing.
- [ ] The controls are shown somewhere (title screen, pause menu, or the itch page).
- [ ] Sound starts only after a click or key press (browsers block autoplay), and there's a mute option.
- [ ] Every asset they didn't make is allowed for this use. Check `CREDITS.md` against the asset folders, and put the credits on the game page too. Use `add-art`'s [licenses.md](../add-art/references/licenses.md): no "NC" assets if the game is sold or has ads, and replace anything with an unknown license.
- [ ] AI-generated assets are noted in `CREDITS.md`. Steam requires disclosing them; on itch.io, tag them; many jams ban them.
- [ ] It works at a small window size. If it's meant for phones, try a phone-sized viewport and real touch input (`mobile-game-controls`).

## 2. Make the build

**Vite (Phaser / Three.js / canvas):**

1. Set `base: './'` in `vite.config.js` so asset paths work in any folder. itch.io and GitHub Pages both serve from subfolders.
2. Asset paths must match the file names' letter case exactly. Most web hosts are case-sensitive even if their computer isn't.
3. `npm run build`, then serve the result locally (`npx vite preview`) and play it once. This catches most "works on my machine" problems.
4. Zip the **contents** of `dist/` so `index.html` sits at the top level of the zip, not inside a folder.

**Godot:** use Project → Export → Web. Download the export templates if Godot asks. Export to an empty folder and name the main file `index.html`. Check the current Godot docs for your version on threads and `SharedArrayBuffer`: a single-threaded export avoids special server headers, and itch.io has a "SharedArrayBuffer support" option for threaded builds. Test with Godot's own "Run in Browser" button before uploading.

## 3. Upload: walk them through it

**itch.io** (best for games; free, has comments and a devlog):
1. They sign in at itch.io → Dashboard → Create new project.
2. Kind of project: **HTML**. Upload the zip and tick "This file will be played in the browser".
3. Set the viewport size to the game's size (e.g. 1280×720), and enable the fullscreen button and mobile-friendly options if they apply.
4. Add a short description, the controls, a screenshot (take one with `playtest`), and the credits.
5. Visibility: **Draft** or **Restricted** first to test the link, then Public when they're happy.

**GitHub Pages** (good if the code is already on GitHub): offer to add a GitHub Actions workflow that builds and deploys to Pages. Explain that it publishes the game publicly, and get a yes before pushing anything.

## 4. Verify the real link

Open the published URL in a fresh browser window (and on a phone if relevant). Play from start to game over. Check the console for failed asset loads (404s). Remember that a game on `localhost` can't be reached by friends; only the published link can.

## 5. After launch

Commit, tag the version (`git tag v0.1`), and record the link in `PROGRESS.md`. Suggest they ask two or three friends to play **without help** and write down where they get stuck. That's the best input for the next round of `build-next`.

Then mention, in a few lines, where to go from here (details and costs in `pick-engine`'s [ways-to-build.md](../pick-engine/references/ways-to-build.md#where-games-get-published)):

- **Game jams** (itch.io's jam list, Ludum Dare, GMTK Game Jam): a theme and a deadline, plus players who comment. The fastest way to finish more games.
- **Web portals** (Poki, CrazyGames, and others) for polished browser games that load fast.
- **Steam** later, for a desktop game ready for a store page ($100 per game).
