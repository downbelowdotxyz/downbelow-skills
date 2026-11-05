# Import gotchas

Handle the ones that apply, and tell the person about each in one sentence as you fix it. Check the engine's current docs for exact setting names.

## 2D

- **Blurry pixel art.** Games smooth images when scaling by default. Turn it off: Phaser `pixelArt: true` in the game config; Godot Project Settings → Rendering → Textures → Default Texture Filter → Nearest; plain canvas `ctx.imageSmoothingEnabled = false` and CSS `image-rendering: pixelated`. Also scale by whole numbers (2×, 3×, 4×), or pixels come out uneven.
- **Sprite sheets.** One image holding all frames, in a grid. Tell the engine the frame width and height and any spacing or margin; wrong numbers cause frames that "slide" or show slivers of neighbors.
- **Atlases.** Many small images packed into one file plus a JSON map. Faster to load and draw. Most free packs include a sheet or atlas; use it instead of hundreds of single files.
- **Transparent edges.** Use PNG with transparency, not JPG. A white or dark halo around sprites usually means the image was exported with a background or premultiplied colors.
- **Different sizes in one pack.** Pick one base tile size (16, 32, 64) and stick to it, so things line up on the grid.

## 3D

- **Use glTF / GLB.** It's the standard format for web and Godot: one `.glb` file holds the mesh, materials, and animations. Convert FBX and OBJ to glTF (Blender, or the pack often includes it).
- **Wrong size.** 1 unit = 1 meter in Three.js, Godot, and glTF. A model that's huge or invisible is usually exported in centimeters, or simply very big or small. Measure the bounding box (`gltf-transform inspect`) and scale once at import, not all over the code.
- **Lying down or facing backwards.** Blender is Z-up; glTF and most engines are Y-up. Blender's glTF exporter converts this ("+Y Up" option). Models also face different "forward" directions; rotate once at import.
- **Pivot in the wrong place.** The origin should be at a character's feet, a door's hinge, a wheel's center. Otherwise objects float, sink, or rotate around the wrong point. Fix it in Blender (Set Origin) or wrap the model in a parent object offset to the right spot.
- **Collision.** Don't collide with the detailed mesh. Use simple shapes (box, capsule, sphere) or a separate simple collision mesh. Players stuck on invisible edges usually means mesh collision.
- **Too heavy for the web or phones.** Texture size and the number of separate objects matter more than triangle count. Keep textures at 512–1024 px, reuse materials, and merge static props. `gltf-transform optimize` helps.
- **Animations missing.** Check they were exported (`gltf-transform inspect` lists them) and that the names in the code match.
- **Dark or flat-looking models.** PBR materials need light: add an environment light or HDRI sky (Poly Haven has CC0 HDRIs) as well as one direct light.

## Audio

- **No sound in the browser.** Browsers block audio until the player clicks, taps, or presses a key. Start audio from the first input (a "Click to play" title screen solves this).
- **Formats.** Use `.ogg` or `.mp3` for web games, `.ogg` or `.wav` in Godot. Keep music as one loop file of a few MB, not a huge WAV.
- **Too loud.** Normalize volumes so effects don't drown each other out, and give music and effects separate volume settings.

## Files and folders

- Lowercase file names, no spaces (`player-run.png`). Web hosts are case-sensitive even when the computer isn't, so `Player.png` vs `player.png` breaks only after publishing.
- Keep the original downloads (zip, license file) in an `assets-source/` folder or note the URL, so assets can be traced and re-exported later.
- Git and large binaries: past roughly 50 MB of art, or with files over 10 MB, use Git LFS (`git lfs install`, `git lfs track "*.glb" "*.png" "*.ogg"`) before committing. GitHub rejects single files over 100 MB.
