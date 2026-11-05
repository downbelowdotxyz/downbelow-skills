# Engine selection reference

These are decision heuristics. Check current official documentation for the project's exact versions, plugins, devices, and hosting; this is not a frozen compatibility table.

| Candidate | Consider when | Cost or question to resolve |
| --- | --- | --- |
| Phaser | A browser-first 2D game needs scenes, input, animation, and common game systems. | Keep fully 3D requirements out of a 2D framework; select built-in or external physics based on actual mechanics. |
| Three.js | A custom 3D experience benefits from direct control of rendering and world structure. | Plan game lifecycle, UI, physics, and networking separately; do not mistake a rendered scene for a complete game. |
| React Three Fiber | Three.js content fits a React component workflow already valuable to the project. | Verify React/Fiber/Three peer compatibility; keep frequent simulation updates out of unnecessary UI state churn. |
| Babylon.js | A browser 3D game benefits from integrated scene, animation, debugging, and engine systems. | Verify the renderer, physics plugin, asset loader, and bundle strategy actually used by the project. |
| PlayCanvas | Web 3D fits an entity/component workflow or a collaborative visual editor. | Choose engine-only versus hosted editor workflow deliberately; verify export, asset ownership, and physics dependencies. |
| Godot | An editor-centered 2D/3D workflow or native plus web targets suits the project. | Verify exact version/language/export support, renderer, threading, and deployment constraints with an early web export. |
| Unity | An existing Unity project, editor workflow, ecosystem, or cross-platform requirements justify the toolchain. | Validate Web platform restrictions, language/runtime features, download/memory costs, packages, and build hosting early. |

No option is universally best for mobile, complex physics, or multiplayer. A simpler stack, including native Canvas for a very small game, can be appropriate when it demonstrably meets requirements.

## Supporting layers

| Responsibility | Decision criteria |
| --- | --- |
| Physics | Start with sufficient engine-native collision/physics. Evaluate Rapier, Havok integration, or another solver only for a concrete capability gap. Check 2D/3D, bindings, timestep, WASM setup, licensing, and target runtime. |
| Networking | Raw WebSockets, Socket.IO, and Colyseus offer different levels of transport and room/state machinery. Pick according to reconnection, room lifecycle, authority, synchronization, and hosting needs. A transport alone does not implement authoritative game rules. |
| UI | DOM/HTML/CSS or React can suit web menus and accessibility; engine UI may better fit an editor pipeline. Define focus/input ownership across canvas and overlays. |
| Backend | Online friends-based play needs a working session/networking backend or managed equivalent. Use a compatible runtime/host; confirm long-lived connections, public endpoint configuration, room ownership, and authoritative simulation needs. |
| Storage | Guest invite rooms can live in one server process's memory. Accounts, saved friends/progress, and durable worlds need persistent storage. Keep credentials and trusted writes server-side; adding a database does not distribute live room state or automatically preserve matches. |

## Official documentation entry points

- [Phaser overview](https://docs.phaser.io/phaser/getting-started/what-is-phaser)
- [Three.js documentation](https://threejs.org/docs/)
- [React Three Fiber introduction and version pairing](https://r3f.docs.pmnd.rs/getting-started/introduction)
- [Babylon.js documentation](https://doc.babylonjs.com/)
- [PlayCanvas manual](https://developer.playcanvas.com/user-manual/)
- [Godot Web export](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html)
- [Unity Web platform manual, version selector](https://docs.unity3d.com/6000.0/Documentation/Manual/webgl.html)
- [Rapier documentation](https://rapier.rs/docs/)
- [Colyseus documentation](https://docs.colyseus.io/)
- [Socket.IO documentation](https://socket.io/docs/v4/)

The Godot and Unity pages illustrate export constraints; use their version selectors to match the project. Do not infer native platform capabilities from web support, or web support from native/editor behavior.
