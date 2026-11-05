# Debug bridge

A debug bridge is a small dev-only object on `window` that exposes what playtests and profiling need. Without one, every session rebuilds access by patching `getContext`, importing pre-bundled dependencies by hashed URL, or scraping HUD text. Those hacks break when the bundler hash, the HUD wording, or the renderer setup changes.

## Contract

Expose it only in development builds (`import.meta.env.DEV`, `process.env.NODE_ENV !== "production"`, or a `?debug` flag that production ignores). Keep it read-mostly; anything that changes state should be an explicit method.

```ts
interface GameDebugBridge {
  ready: boolean;                       // true once gameplay accepts input
  screen: string;                       // "title" | "menu" | "loading" | "playing" | "paused" | ...
  snapshot(): Record<string, unknown>;  // local player: position, velocity/speed, contacts, state flags, score
  renderer?: unknown;                   // engine renderer (THREE.WebGLRenderer, BABYLON.Engine, Phaser.Game, ...)
  scene?: unknown;
  camera?: unknown;
  composer?: unknown;                   // post-processing chain, if any
  setQuality?(tier: string): void;
  teleport?(spotId: string): void;      // jump to a named spawn, zone, or checkpoint
  setPostProcessing?(on: boolean): void;
}
declare global { interface Window { __game?: GameDebugBridge } }
```

Keep `snapshot()` small and serializable so it can be returned from a page evaluation.

## Wiring examples

**React Three Fiber**: inside the `<Canvas>` tree:

```tsx
function DebugBridge({ session }: { session: React.MutableRefObject<Session | null> }) {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    window.__game = {
      ready: true,
      get screen() { return session.current?.screen ?? "playing"; },
      snapshot: () => session.current?.localSnapshot() ?? {},
      renderer: gl, scene, camera,
    };
    return () => { delete window.__game; };
  }, [gl, scene, camera, session]);
  return null;
}
```

**Plain three.js**: after creating the renderer: `if (import.meta.env.DEV) window.__game = { ready: false, renderer, scene, camera, snapshot: () => player.snapshot() };`, then set `ready = true` when the first playable frame renders.

**Phaser**: `window.__game = { get ready() { return game.scene.isActive("Play"); }, renderer: game.renderer, snapshot: () => playScene.player.snapshot() }`.

**Babylon**: expose `engine`, `scene`, `scene.activeCamera`; `engine.getFps()` is a convenient cross-check, not a substitute for frame-time sampling.

## Tests

Add one unit test or type check that the bridge is not created in a production build, or guard it so the bundler strips it. Mention the bridge in the project's agent instructions so later sessions use it instead of rebuilding access.
