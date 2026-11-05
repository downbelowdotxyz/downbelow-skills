---
name: colyseus-vite-multiplayer
description: Build, upgrade, test, and deploy a real-time multiplayer web game using a Colyseus (0.18) game server and a Vite client — shared schema package, authoritative room with fixed timestep, private room codes, client prediction, the SDK's built-in reconnection, version and dependency pitfalls, headless smoke tests, two-tab browser checks, and split hosting (static web + WebSocket server). Use when starting a Colyseus + Vite game, adding multiplayer to a Vite game, upgrading Colyseus, fixing npm audit findings in a Colyseus stack, or debugging rooms, joins, state sync, or reconnects.
---

# Colyseus + Vite Multiplayer

Ship multiplayer that shares one state definition between server and client, keeps the server authoritative, and is proven with real clients before deploy. Targets Colyseus 0.18 (`@colyseus/core`, `@colyseus/ws-transport`, `@colyseus/sdk`) with `@colyseus/schema` 5 and a Vite (React or plain TS) client. Use `playtest` for browser checks if it is available.

## 1. Lay out the project

Use an npm workspaces monorepo: `packages/shared` (schema classes, message and input types, constants, validation), `apps/server` (Express + Colyseus), `apps/web` (Vite client), and optionally `packages/physics` (simulation used by both). Read [project-setup.md](references/project-setup.md) for package versions, the server entry, a room skeleton, schema definitions, and the client connection module.

Hard rules that cost real debugging time when missed:
- **Depend on `@colyseus/core` and `@colyseus/ws-transport`, not the `colyseus` meta-package.** The meta-package lists auth, Redis, and uWebSockets as peer dependencies, which npm installs, along with their vulnerable transitive dependencies.
- **Exactly one copy of `@colyseus/schema`.** Server, shared, and client must resolve the same copy, or state classes are not recognized when encoding. Check with `npm ls @colyseus/schema` and fix with `npm dedupe`.
- **Matching minor versions everywhere**: core, ws-transport, and sdk all 0.18.x; schema ^5. Server and client protocol versions must match; deploy them together.
- **Define schema with `schema({...}, "Name")` and `t.*` builders.** `defineTypes()` is deprecated, and decorator or class-field definitions break under Vite/tsx define semantics unless fields are `declare`d.

## 2. Build the room

- Server-authoritative: clients send inputs (with sequence numbers), the server simulates at a fixed timestep (`setTimestep`) and patches state (`setPatchRate`). Validate and clamp every message on the server.
- Private rooms: generate a short code in `onCreate`, store it with `setMetadata({ code })`, and register the room with `.filterBy(["code"])` so `client.join("room", { code })` matches it. `setMetadata` replaces metadata in 0.18; spread `this.metadata` to keep other fields.
- Reconnects: in `onLeave(client, code)`, call `allowReconnection(client, seconds)` unless `code === CloseCode.CONSENTED`.
- Read [netcode.md](references/netcode.md) for prediction, reconciliation, interpolation, and rate choices.

## 3. Build the client

- One connection module owns the `Client` and the current room; screens read it from there. Type rooms as `Room<any, State>` (the first parameter is the server room type).
- Pass the schema class as the third argument to `create`/`join`/`joinOrCreate` so state is typed and decoded into your classes.
- The SDK reconnects on its own: handle `onDrop` (show "Reconnecting…", stop sending inputs), `onReconnect` (resume), and `onLeave` (room really ended). Do not write a manual reconnect loop on top.
- Leave with `room.leave(true)` when the player chooses to leave, so the server does not hold their seat.
- Read the server URL from `import.meta.env.VITE_GAME_SERVER`, defaulting to the page host on port 2567 in development.

## 4. Test before deploying

Read [testing-and-deploy.md](references/testing-and-deploy.md):
1. Unit test shared logic (input validation, simulation, scoring) without a network.
2. Run [scripts/room-smoke-test.mts](scripts/room-smoke-test.mts) against a running server: two clients create and join a private room, see each other, a wrong code is rejected, and leaves return the consented close code.
3. Run the server and Vite together and use two browser tabs through the real menus: create, join by code or invite link, ready up, start, ride or play, and confirm each tab sees the other moving.
4. After changing dependencies, restart Vite (stale pre-bundled dependencies cause "504 Outdated Optimize Dep" errors).

## 5. Deploy

Static client on a CDN host (Vercel, Netlify, Cloudflare Pages), WebSocket server on a host that keeps long-lived connections (Render, Fly.io, Railway, a VM). Node 22+ for Colyseus 0.18. Set `VITE_GAME_SERVER` at client build time. Ship server and client protocol changes in the same release.

## Upgrading or auditing

Read [upgrading.md](references/upgrading.md) for the 0.16 → 0.17 → 0.18 breaking changes and an audit cleanup order. Verify each step with the smoke test and a two-tab run.
