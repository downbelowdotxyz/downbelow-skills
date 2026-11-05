// Headless multiplayer smoke test for a Colyseus 0.18 server.
// Usage (from a folder that resolves @colyseus/sdk, such as apps/web):
//   npx tsx room-smoke-test.mts <server-url> <room-name> [players-field] [extra-join-options-json]
//   npx tsx room-smoke-test.mts http://localhost:2567 game players '{"name":"Tester"}'
// The room must be registered with .filterBy(["code"]) and store its code in state.code
// (or metadata.code). State is decoded by reflection, so no schema import is needed.
import { Client } from "@colyseus/sdk";

const [url = "http://localhost:2567", roomName = "game", playersField = "", extraJson = "{}"] = process.argv.slice(2);
const extra = JSON.parse(extraJson) as Record<string, unknown>;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
setTimeout(() => {
  console.error("TIMEOUT after 30 s");
  process.exit(1);
}, 30_000).unref();

type AnyRoom = Awaited<ReturnType<Client["create"]>>;

// Finds the collection of players: the named field, or the first map-like field in state.
function players(room: AnyRoom): string[] {
  const state = room.state as Record<string, unknown>;
  const field = playersField || Object.keys(state).find((key) => typeof (state[key] as { forEach?: unknown })?.forEach === "function");
  const collection = field ? (state[field] as { forEach(cb: (value: unknown, key: string) => void): void }) : undefined;
  const ids: string[] = [];
  collection?.forEach((_value, key) => ids.push(key));
  return ids.sort();
}

const results: Record<string, unknown> = {};
const fail = (message: string) => {
  console.log(JSON.stringify(results, null, 1));
  console.error("FAIL:", message);
  process.exit(1);
};

const host = await new Client(url).create(roomName, { name: "SmokeHost", ...extra });
await wait(400);
const code = (host.state as { code?: string }).code;
results.created = { roomId: host.roomId, code };
if (!code) fail("state.code is empty; private rooms need a code to join by");

const guest = await new Client(url).join(roomName, { name: "SmokeGuest", ...extra, code });
await wait(600);
results.sameRoom = host.roomId === guest.roomId;
results.hostSees = players(host).length;
results.guestSees = players(guest).length;
if (!results.sameRoom) fail("guest joined a different room");
if (results.hostSees !== 2 || results.guestSees !== 2) fail("each client should see two players");

try {
  await new Client(url).join(roomName, { name: "Nobody", ...extra, code: "ZZZZZZ" });
  fail("joining with a wrong code succeeded");
} catch (error) {
  results.wrongCode = `rejected (${(error as Error).message})`;
}

const guestLeave = await guest.leave(true);
await wait(500);
results.guestLeaveCode = guestLeave;
results.hostSeesAfterLeave = players(host).length;
if (results.hostSeesAfterLeave !== 1) fail("consented leave should remove the player immediately");

results.hostLeaveCode = await host.leave(true);
console.log(JSON.stringify(results, null, 1));
console.log("PASS");
process.exit(0);
