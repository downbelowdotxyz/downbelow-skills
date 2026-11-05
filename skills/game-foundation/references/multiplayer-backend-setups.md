# Multiplayer backend and database setup examples

These are worked implementation blueprints for an agent building a game, not generated applications. Example configuration and schema snippets can be copied into the proposed files; the room handlers, game rules, authentication integration, and client still have to be implemented and tested. Neither setup deploys itself or requires a paid provider.

Both examples use a browser game, Node.js, and Socket.IO as one coherent option. An engine with its own networking, Colyseus, or a managed multiplayer service can fulfill the same responsibilities. Check installed versions and hosting support before adapting either setup.

## Choose by required behavior

| Requirement | A: guest invite rooms | B: accounts and persistent data |
| --- | --- | --- |
| Play online with friends using a code/link | Yes | Yes |
| Game backend | One Node.js process | One Node.js process initially |
| Active room and match state | Server memory | Server memory initially |
| Database | None | PostgreSQL |
| Identity | Temporary server-issued guest session | Verified account session |
| Saved friends/progress/history | Not included | Stored in PostgreSQL |
| App process restarts | Rooms/matches disappear | Rooms/matches disappear; committed account data survives |
| Resume a live match after a crash | Not included | Not included unless snapshots/recovery are added |

The game backend and database are separate responsibilities, even if hosted on the same machine. A saved friends list is optional; a shareable invite code alone is enough to play with friends.

## Example A: guest room server, no database

Use for a small party, racing, or arcade game where players create a room, share a code, play, and leave without saving accounts or progress.

```text
Browser A ----\
              HTTPS + Socket.IO -> Node game server
Browser B ----/                    rooms + match state in memory
                                  no database
```

### Suggested project layout and configuration

```text
client/                  chosen engine, menus, lobby, HUD
server/
  package.json           chosen supported Node version and locked dependencies
  src/index.mjs          HTTP health endpoint and socket server
  src/rooms.mjs          create/join/leave, membership, expiry, host rules
  src/game.mjs           authoritative rules and simulation
  .env.example           non-secret configuration
```

In a new `server/` package, bootstrap dependencies with:

```sh
npm init -y
npm install socket.io
```

Install `socket.io-client` in the browser package if the chosen engine/client uses npm. Socket.IO requires a compatible Socket.IO client, not a raw WebSocket connection. Retain generated lockfiles.

Example `server/.env.example`:

```dotenv
HOST=127.0.0.1
PORT=3001
CLIENT_ORIGIN=http://localhost:5173
MAX_ROOM_PLAYERS=4
ROOM_IDLE_TTL_SECONDS=600
REJOIN_GRACE_SECONDS=30
```

These application-specific environment names must be read and validated by the implementation; copying the file does not implement them. Configure the browser's public server URL to `http://localhost:3001` for local development. If using Vite, `VITE_GAME_SERVER_URL` is a suitable public configuration name; other build tools have their own conventions.

### Room and game contract to implement

Keep game records in a `Map` keyed by a server-generated room code. Socket.IO rooms are broadcast groups; keep player readiness, host identity, game phase, simulation state, and expiry in explicit application records. Generate collision-checked invite codes with secure randomness, bound room count and payload/event rates, and expire abandoned rooms. Codes are invitations, not permanent user authentication.

| Event | Server behavior |
| --- | --- |
| `room:create` | Issue a guest identity/session, allocate a room, join creator, return invite code and snapshot. |
| `room:join` | Validate code/capacity/game phase, join that guest, broadcast current roster. |
| `player:ready` | Validate membership and set readiness for that player only. |
| `match:start` | Check host permission and readiness rules; create a fresh authoritative match. |
| `player:input` | Validate membership, payload, sequence/rate, and game phase; apply permitted actions. |
| `room:leave` | Remove player, transfer host or end session according to policy, and clean up. |
| `room:resume` | Validate an unexpired server-issued rejoin credential and restore that player's slot or reject cleanly. |
| `room:snapshot` | Server sends roster, phase, and authorized world state; client replaces stale state. |

Return bounded-time success/error acknowledgments for player-triggered operations. A reconnecting socket ID is not a permanent identity: use a server-issued session/rejoin credential when retaining a slot. On an unrecoverable reconnect, return to the join/menu flow. Socket.IO reconnection or connection recovery does not eliminate application-level state reconciliation.

This is a protocol design, not a universal event list. Adapt it for the game; turn-based play needs actions/turn ownership rather than a continuous physics tick. For an authoritative real-time example, a starting budget might be 30 simulation steps/sec and 10–20 snapshots/sec; measure and tune rather than treating these as engine requirements.

### Local and internet setup

Implement an `npm run dev` script that starts the server entry point and explicitly loads local configuration. Run client and server in separate terminals; open two independent browser sessions and use one to create a code and the other to join.

For actual remote friends, host the client and a backend with long-lived connection support. Configure the public backend URL and approved client origin, terminate TLS, and ensure the proxy forwards the chosen transport. `localhost` always points to the player's own machine. For LAN-only tests bind the server to a reachable interface and use the development machine's LAN address; report that separately from internet deployment.

Start with one backend process. Multiple processes require room routing/ownership and compatible message coordination. A Socket.IO adapter can distribute broadcasts; it does not automatically distribute the application `Map` or authoritative simulation. If HTTP long-polling is enabled across multiple nodes, account for the documented session-affinity requirements.

### Acceptance checks

- Two independent clients create/join one room, ready, start, observe the same authoritative play, leave, and rematch.
- Invalid/full rooms, non-host start attempts, invalid inputs, and expired rejoin attempts fail clearly.
- Temporary disconnect follows the defined grace policy; a failed resume offers a usable recovery path.
- Restarting the process invalidates old rooms cleanly; the UI lets players create/join a new room.
- A public deployment is tested from another device/network before claiming remote play works.

## Example B: game server plus PostgreSQL

Use when the same game also needs real accounts, a saved friends list, cross-device progress, or match history. Keep live room coordination on the server; save durable data at defined checkpoints.

```text
Browser A ----\
              HTTPS + Socket.IO -> Node API/game server -> PostgreSQL
Browser B ----/                    live rooms in memory    users, friendships,
                                  verified identity       progress, results
```

Extend A with `server/src/auth.mjs`, `server/src/db.mjs`, and `server/db/001_initial.sql`. Add `pg` to the server package using `npm install pg`. Use a trusted authentication/session integration already present in the project or select one deliberately. The schema below assumes authentication is external; it does not implement sign-up, login, passwords, or token verification.

### Local database setup

Example `compose.yaml` at the game project's root, using PostgreSQL 17 as an illustrative supported major rather than requiring the newest release:

```yaml
services:
  db:
    image: postgres:17
    environment:
      POSTGRES_DB: game
      POSTGRES_USER: game
      POSTGRES_PASSWORD: local-dev-only
    ports:
      - "127.0.0.1:5432:5432"
    volumes:
      - game_pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U game -d game"]
      interval: 5s
      timeout: 3s
      retries: 10
volumes:
  game_pgdata:
```

This configuration is for local development. Use deployment-specific secrets, access controls, TLS, backups, and a version-appropriate data directory for the chosen production database. A named volume survives ordinary container replacement; it does not replace backups.

Additional server-only environment configuration:

```dotenv
DATABASE_URL=postgresql://game:local-dev-only@127.0.0.1:5432/game
```

An example `pg` connection, after loading and validating server environment configuration:

```js
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
await pool.query('SELECT 1'); // readiness includes the required database
```

Keep the pool long-lived and close it during graceful shutdown. Use parameterized queries and transactions for related updates. Never expose `DATABASE_URL` through client environment variables or accept a client-supplied user ID as proof of identity.

### Starter schema

Save as `server/db/001_initial.sql` when implementing this example:

```sql
BEGIN;

CREATE TABLE app_users (
  id uuid PRIMARY KEY,
  auth_issuer text NOT NULL,
  auth_subject text NOT NULL,
  display_name text NOT NULL CHECK (char_length(display_name) BETWEEN 1 AND 40),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (auth_issuer, auth_subject)
);

CREATE TABLE friendships (
  user_low uuid NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  user_high uuid NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  requested_by uuid NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('pending', 'accepted')),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_low, user_high),
  CHECK (user_low < user_high),
  CHECK (requested_by = user_low OR requested_by = user_high)
);
CREATE INDEX friendships_by_high ON friendships(user_high);

CREATE TABLE player_progress (
  user_id uuid PRIMARY KEY REFERENCES app_users(id) ON DELETE CASCADE,
  progress_version integer NOT NULL DEFAULT 1 CHECK (progress_version > 0),
  data jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(data) = 'object'),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE matches (
  id uuid PRIMARY KEY,
  mode text NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE match_results (
  match_id uuid NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  score bigint NOT NULL,
  PRIMARY KEY (match_id, user_id)
);

COMMIT;
```

Generate UUIDs on the trusted server. Map the verified identity's issuer/subject to a local user; an email or display name is not a stable authentication key. For a friendship, sort the pair by UUID order so reverse duplicate requests use the same row, reject self-requests, and allow only the recipient to accept a pending request. Visibility and allowed operations are enforced in authenticated server handlers; foreign keys and checks alone do not provide per-user authorization.

Validate the progress JSON against the game's schema and size limits. Choose per-user save serialization or optimistic concurrency if multiple devices can update progress. Use a stable server-generated match ID and one transaction for the match, results, and applicable progression updates; a retry must not award rewards twice. Only trusted server code may finalize results. This starter schema does not implement live-world snapshots, chat, blocking, purchases, or a complete leaderboard design.

Once the compose and migration files exist, run from the game root:

```sh
docker compose up -d --wait db
docker compose exec -T db psql -v ON_ERROR_STOP=1 -U game -d game < server/db/001_initial.sql
```

The initial migration is for a fresh database and should be applied once, then tracked by the project's migration system. Do not rerun it blindly on existing data. When the Node server runs on the host use the URL above; inside the same Compose network use hostname `db` and port `5432` instead of `127.0.0.1`. Configure startup to load the environment before creating the connection pool, then start the implemented server/client as in A.

### Persistence and failure contract

- Verify authentication at HTTP/socket entry points and bind actions to that verified user. Revalidate authorization for private room joins, friend invitations, and durable reads/writes.
- Save progress at defined milestones and committed match results at match end. Do not put SQL writes in every rendering/simulation frame. Some persistent-world games need more frequent logs/snapshots; design those separately.
- Use explicit acknowledgments for saves. If the DB is unavailable, report pending/failed persistence honestly and use bounded retries with idempotency; do not show an uncommitted reward as saved.
- Accounts, accepted friendships, progress, and results survive an app restart. Live in-memory rooms do not. Supporting crash-resumable matches requires snapshots/event logs and a separate recovery design.
- Persisted friends are different from live presence. Presence comes from authenticated active sessions and privacy rules, not just an `online` column that can become stale after a crash.

### Acceptance checks

In addition to A's applicable checks, verify two real accounts can sign in, send/accept a friend request, invite/join, and play. Verify an unrelated account cannot read private progress, accept someone else's request, join a restricted room, or submit trusted results. Save progress and results, restart the app, and sign in again from another browser to confirm persistence. Restart the database container without deleting its volume and confirm committed data remains. Simulate a save failure and a repeated match-completion request to check honest feedback and no duplicate rewards. Document any auth provider or hosting setup still required.

## Official implementation references

- [Socket.IO rooms and server-side membership](https://socket.io/docs/v4/rooms/)
- [Socket.IO connection recovery and its limits](https://socket.io/docs/v4/connection-state-recovery/)
- [Socket.IO multi-node deployment](https://socket.io/docs/v4/using-multiple-nodes/)
- [node-postgres connection configuration](https://node-postgres.com/features/connecting)
- [node-postgres parameterized queries](https://node-postgres.com/features/queries)
- [node-postgres transactions](https://node-postgres.com/features/transactions)
- [PostgreSQL constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)
- [Official PostgreSQL container configuration](https://hub.docker.com/_/postgres)
