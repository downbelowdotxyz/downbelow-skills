# Testing and deploy

## Headless smoke test

[scripts/room-smoke-test.mts](../scripts/room-smoke-test.mts) connects real SDK clients to a running server. Copy it into the web app folder (so it resolves `@colyseus/sdk` and the shared package) and run it with tsx:

```bash
PORT=2599 npx tsx apps/server/src/index.ts
```

```bash
cd apps/web && npx tsx room-smoke-test.mts http://localhost:2599 game
```

It checks: a client creates a room and gets a code; a second client joins by code into the same room; both see two players; a wrong code is rejected; a consented leave removes the player and returns close code 4000. Adjust the room name, options, state collection (`players`), and the schema import to the project. Delete the copy afterwards or keep it as a script under `apps/web/scripts/`.

On macOS there is no `timeout` command; the script exits itself after 30 seconds instead.

## Two-tab browser check

Run the server and the Vite dev server, then:

1. Tab A: set a distinct player name, create a private room, note the code.
2. Tab B: set another name, open the invite link (`?room=CODE`) or type the code, join.
3. Confirm the lobby in both tabs lists both players; ready up; host starts.
4. In gameplay, move tab B's player and confirm tab A sees it move (and the reverse).
5. Check the browser console in both tabs and the server log.

Both tabs share `localStorage` on the same origin; change the saved name and reload before each tab joins. Background tabs are throttled, so bring each tab forward while it loads or moves.

## Vite pitfalls

- After adding, removing, or upgrading dependencies, restart the Vite dev server. A running server serves stale pre-bundled modules and the browser shows "504 (Outdated Optimize Dep)" and failed hot reloads.
- `import.meta.env` values are baked in at build time; set `VITE_GAME_SERVER` in the hosting provider's build environment, not only at runtime.
- In development the client defaults to `http://<page host>:2567`; open the game via the same hostname you expect to reach the server on (for example `127.0.0.1` vs `localhost` on some setups).

## Deploy

| Part | Host | Settings |
|---|---|---|
| Web client | Vercel, Netlify, Cloudflare Pages | Root `apps/web` (or a workspace build command), output `dist`, env `VITE_GAME_SERVER=https://your-server.example`. |
| Game server | Render, Fly.io, Railway, VM | Node 22+, start `npm run start -w <server package>`, health check `/health`, `PORT` from the host. WebSockets must be allowed and not time out quickly. |

Render example:

```yaml
services:
  - type: web
    name: game-server
    runtime: node
    buildCommand: npm ci
    startCommand: npm run start -w @game/server
    healthCheckPath: /health
    envVars:
      - key: NODE_VERSION
        value: 22
```

Notes:
- Free tiers sleep when idle; the first join after a sleep waits for a cold start. Show a "Connecting…" state with a timeout and retry.
- In-memory rooms do not survive a restart or deploy; players reconnecting after a deploy get "Disconnected".
- One server process is enough for small games. Scaling to several processes needs `@colyseus/redis-presence` and `@colyseus/redis-driver`; add them only then.
- Deploy server and client together whenever the Colyseus protocol or the schema changes; old clients cannot talk to a new server across a Colyseus minor version.
