# Project setup

## Layout

```text
package.json              # "workspaces": ["apps/*", "packages/*"]
packages/shared/          # schema, message/input types, validation, constants
apps/server/              # Express + Colyseus
apps/web/                 # Vite client
```

Name workspace packages with a scope (`@game/shared`) and depend on them with `"*"`. If you rename the scope later, delete stale symlinks in `node_modules/@oldscope` (they show up as "extraneous" in `npm ls`).

## Versions

```jsonc
// apps/server/package.json
"dependencies": {
  "@colyseus/core": "^0.18.25",
  "@colyseus/ws-transport": "^0.18.4",
  "@colyseus/schema": "^5.0.43",
  "@game/shared": "*",
  "express": "^5.1.0"
},
"scripts": { "dev": "tsx watch src/index.ts", "start": "tsx src/index.ts", "typecheck": "tsc --noEmit" }

// packages/shared/package.json
"dependencies": { "@colyseus/schema": "^5.0.43" }

// apps/web/package.json
"dependencies": { "@colyseus/sdk": "^0.18.9", "@game/shared": "*" }
```

After installing, confirm a single schema copy:

```bash
npm ls @colyseus/schema
```

If more than one path appears (for example one under `apps/server/node_modules`), run `npm dedupe` and check again. Two copies break encoding even at the same version.

## Shared schema

```ts
// packages/shared/src/schema.ts
import { schema, t } from "@colyseus/schema";

export const PlayerState = schema({
  name: t.string().default("Player"),
  x: t.float32().default(0),
  y: t.float32().default(0),
  z: t.float32().default(0),
  ready: t.boolean().default(false),
  lastInputSeq: t.uint32().default(0),
}, "PlayerState");
export type PlayerState = InstanceType<typeof PlayerState>;

export const GameState = schema({
  code: t.string().default(""),
  hostId: t.string().default(""),
  phase: t.string().default("lobby"),
  players: t.map(PlayerState),
}, "GameState");
export type GameState = InstanceType<typeof GameState>;
```

- Pick the smallest numeric type that fits (`uint8`, `float32`); state is sent as binary patches.
- At most 63 fields per schema, inherited ones included. Nest groups of fields into child schemas.
- Keep derived or per-client-only data out of the schema.
- If the project already uses classes with `defineTypes()`, it keeps working with a deprecation warning. Fields must be `declare`d without initializers and defaults set in the constructor, because Vite and tsx compile class fields with define semantics that overwrite the schema accessors. Migrate to `schema()` when convenient.

## Server entry

```ts
// apps/server/src/index.ts
import { createServer } from "node:http";
import express from "express";
import { Server } from "@colyseus/core";
import { WebSocketTransport } from "@colyseus/ws-transport";
import { GameRoom } from "./rooms/GameRoom";

const port = Number(process.env.PORT ?? 2567);
const app = express();
app.use(express.json());
app.get("/health", (_req, res) => { res.json({ ok: true }); });

const httpServer = createServer(app);
const gameServer = new Server({ transport: new WebSocketTransport({ server: httpServer }) });
gameServer.define("game", GameRoom).filterBy(["code"]);
await gameServer.listen(port);
console.log(`listening on ${port}`);
```

Add CORS middleware if the web client calls Express routes from another origin.

## Room skeleton

```ts
// apps/server/src/rooms/GameRoom.ts
import { CloseCode, Room, type Client } from "@colyseus/core";
import { GameState, PlayerState, sanitizeInput, type InputCommand } from "@game/shared";

const codes = new Set<string>();
function takeCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  do code = Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
  while (codes.has(code));
  codes.add(code);
  return code;
}

export class GameRoom extends Room<{ state: GameState; metadata: { code: string } }> {
  private queues = new Map<string, InputCommand[]>(); // not "inputs": Room 0.18 has its own

  override onCreate(): void {
    this.maxClients = 8;
    this.setPatchRate(50);                 // state patches every 50 ms (20 Hz)
    const state = new GameState();
    state.code = takeCode();
    this.setState(state);
    this.setMetadata({ code: state.code }); // filterBy(["code"]) matches joins against this

    this.onMessage("input", (client, raw: unknown) => {
      const queue = this.queues.get(client.sessionId);
      if (queue && queue.length < 30) queue.push(sanitizeInput(raw));
    });

    this.setTimestep(() => this.tick());   // fixed simulation step
  }

  override onJoin(client: Client, options: { name?: string }): void {
    const player = new PlayerState();
    player.name = String(options?.name ?? "Player").slice(0, 16);
    this.state.players.set(client.sessionId, player);
    this.queues.set(client.sessionId, []);
    if (!this.state.hostId) this.state.hostId = client.sessionId;
  }

  override async onLeave(client: Client, code?: number): Promise<void> {
    if (code !== CloseCode.CONSENTED) {
      try {
        await this.allowReconnection(client, 20);
        return;
      } catch {
        // Seat expired.
      }
    }
    this.state.players.delete(client.sessionId);
    this.queues.delete(client.sessionId);
  }

  override onDispose(): void {
    codes.delete(this.state.code);
  }

  private tick(): void {
    // Apply queued inputs, step the simulation, write results into this.state.
  }
}
```

Room subclasses share a namespace with the base class. In 0.18 the base `Room` already has members such as `state`, `clients`, `clock`, `metadata`, `inputs`, `maxClients`, and `presence`; a subclass field with one of those names fails to compile or silently shadows the base. Use distinct names (`queues`, `sim`, `director`).

## Client connection module

```ts
// apps/web/src/net/connection.ts
import { Client, type Room } from "@colyseus/sdk";
import { GameState } from "@game/shared";

export type GameRoom = Room<any, GameState>;

let room: GameRoom | null = null;

export function serverUrl(): string {
  const configured = import.meta.env.VITE_GAME_SERVER;
  if (configured) return configured;
  const protocol = location.protocol === "https:" ? "https:" : "http:";
  return `${protocol}//${location.hostname}:2567`;
}

export const getRoom = () => room;

export async function createRoom(options: { name: string }): Promise<GameRoom> {
  await leaveRoom();
  room = await new Client(serverUrl()).create("game", options, GameState);
  return room;
}

export async function joinRoom(code: string, options: { name: string }): Promise<GameRoom> {
  await leaveRoom();
  room = await new Client(serverUrl()).join("game", { ...options, code }, GameState);
  return room;
}

export async function leaveRoom(): Promise<void> {
  const current = room;
  room = null;
  await current?.leave(true).catch(() => {});
}
```

Declare the env var for TypeScript in `src/vite-env.d.ts`:

```ts
interface ImportMetaEnv { readonly VITE_GAME_SERVER?: string }
```

## Invite links

Put the room code in the URL (`?room=ABC123`), prefill the join screen from it, and still require the player's name before joining. Map join errors ("no rooms found…") to a friendly "That room code is not open."
