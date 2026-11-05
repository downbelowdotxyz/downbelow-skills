# Netcode

## Authority

The server owns the truth: positions, scores, timers, room phase. Clients send intent (inputs, choices), never results. Validate every message on the server: type-check, clamp numbers to their range, cap string lengths, reject unknown enum values, and rate-limit per client (cap the queue length).

## Rates

| Rate | Typical | Notes |
|---|---|---|
| Simulation (`setTimestep`) | 30–60 Hz | Fixed step; same step size on client and server if the client predicts. |
| State patches (`setPatchRate`) | 10–20 Hz (50–100 ms) | Lower saves bandwidth; interpolation hides it. |
| Client input sends | Every client simulation step, or on change | Include a sequence number. |

## Shared simulation

Put the simulation in a shared package (`packages/physics` or `packages/shared`) so the server runs it authoritatively and the client can run the same code for prediction. Keep it deterministic: fixed step, no wall-clock time, seeded randomness, no async loading inside the step.

## Prediction and reconciliation (local player)

1. On each client step: build the input, give it the next `seq`, send it, apply it locally, and keep it in a pending list (cap around 30).
2. The server applies inputs in order and writes the last processed `seq` into the player's state (`lastInputSeq`).
3. On each state patch: drop pending inputs with `seq <= lastInputSeq`, reset the local player to the server state, and re-apply the remaining pending inputs.
4. Smooth small corrections over a few frames; snap large ones.

## Interpolation (remote players)

Render other players about 100 ms in the past, blending between the two buffered snapshots around that time. Do not extrapolate far; snap if the gap exceeds a threshold (teleports, respawns).

## Rendering

Render the local player interpolated between its last two simulation steps, not the raw latest step. Keep network state out of UI-framework render cycles: write snapshots into refs or stores read inside the render loop. Re-rendering a React tree on every patch causes periodic hitches.

## Reconnection (SDK 0.18)

- The SDK retries a dropped connection automatically on the same `Room` object.
- `room.onDrop(cb)`: connection lost, retrying. Show "Reconnecting…" and stop sending inputs. Messages sent while dropped are buffered and flushed on reconnect, which would replay stale inputs.
- `room.onReconnect(cb)`: back. Resume sending.
- `room.onLeave(cb)`: the room really ended (consented leave, server shutdown, or retries exhausted). Show "Disconnected".
- `room.leave(true)` cancels retries. `room.leave(false)` acts like a drop.
- The server must call `allowReconnection(client, seconds)` in `onLeave` for non-consented leaves, or there is nothing to reconnect to.
- Close codes: 1000 normal, 4000 consented, 4001 server shutdown, 4002 error, 4003 failed to reconnect, 4010 may try to reconnect. Do not use 4000–4010 for your own codes.

## Lobby flow

A common shape: create or join a private room, show the code and invite link, list players with ready states, let the host start, and switch every client into gameplay when `state.phase` changes. Drive screen changes from state (`room.onStateChange`) rather than from separate "go" messages, so late joiners and reconnects see the right screen.
