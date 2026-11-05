# Upgrading and auditing

## Order of work

1. Read the official migration guides for every minor version crossed (`https://docs.colyseus.io/migrating/0.17`, `.../0.18`).
2. Swap the `colyseus` meta-package for `@colyseus/core` + `@colyseus/ws-transport` if the project uses it. This alone removes most `npm audit` findings, because the meta-package's peer dependencies (auth, Redis, uWebSockets) get installed even when unused.
3. Upgrade server packages, schema, and the client SDK together.
4. `npm dedupe`, then confirm a single `@colyseus/schema` with `npm ls @colyseus/schema`.
5. Typecheck all workspaces and fix the API changes below.
6. Run the unit tests, the headless smoke test, and the two-tab browser check.
7. Restart Vite.
8. Deploy server and client together.

Dev-only findings (test runners such as vitest) can be fixed independently with a major upgrade; they do not ship to players.

## 0.16 → 0.17

| Area | 0.16 | 0.17+ |
|---|---|---|
| Client package | `colyseus.js` | `@colyseus/sdk` |
| Schema | `^3` | `^4` (0.17), `^5` (0.18) |
| Room generics | `Room<State, Metadata>` | `Room<{ state, metadata, client }>`, or `state = new State()` as a field |
| Client generics | `Client<UserData, AuthData>` | `Client<{ userData, auth, messages }>` |
| `onLeave` | `onLeave(client, consented: boolean)` | `onLeave(client, code: number)`; compare with `CloseCode.CONSENTED` |
| Seat reservation | `setSeatReservationTime(15)` | `seatReservationTimeout = 15` |
| Repeated `onMessage(type)` | Replaces the handler | Adds another handler; use the returned unbind function to replace |
| Close codes | `Protocol.WS_CLOSE_*` | `CloseCode.*` (4000 consented, 4001 shutdown, 4002 error, 4003 failed reconnect, 4010 may reconnect) |
| `reserveSeatFor` result | `seatReservation.room.roomId` | `seatReservation.roomId` |
| Protected members | `this.listing` and others | Private, `_listing`; use `setMetadata`/`setMatchmaking` instead |
| refIds | `decoder.root.refIds.get(x)` | `x[$refId]` from `@colyseus/schema` |

## 0.17 → 0.18

| Area | Change |
|---|---|
| Schema | `^5`. Max 63 fields per schema including inherited. `defineTypes()` deprecated in favor of `schema()` with `t.*`. |
| Metadata | `setMetadata()` and `setMatchmaking({ metadata })` replace instead of merge; spread `this.metadata`. |
| `client.id` | Removed; use `client.sessionId`. |
| Fossil-delta serializer | Removed; use schema. |
| Timestep | `setSimulationInterval` → `setTimestep` (old name still works). |
| SDK reconnection | Built in: `onDrop`, `onReconnect`, `onLeave`; remove manual `client.reconnect(token)` loops. |
| SDK room type | `Room<RoomType, State>`; use `Room<any, State>` when the server room type is not shared with the client. |
| Optional peers | `@colyseus/auth`, `ws-transport`, `express`, `zod`, `@pm2/io` are optional peers of core; nothing extra is installed unless you add it. |
| Node | Core and ws-transport require Node 22+. |
| Playground | Locked in production unless guarded explicitly. |

## Quick checks after an upgrade

- `npm audit` count, before and after.
- `npm ls @colyseus/core @colyseus/schema @colyseus/sdk` shows one version of each.
- Private room code join still works (metadata-based `filterBy`).
- A consented leave frees the seat immediately; a dropped connection shows "Reconnecting…" and recovers within the reconnection window.
