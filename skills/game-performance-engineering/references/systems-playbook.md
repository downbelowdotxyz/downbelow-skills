# Systems playbook

Use the section implicated by a capture. Every intervention needs an observable metric and a correctness or quality guardrail.

## Rendering and animation

| Evidence | Candidate intervention | Verify |
| --- | --- | --- |
| CPU submission/state-change cost | Instance repeats; group compatible materials; batch static content spatially | Thread time, draw count, culling, per-instance variation |
| Pixel cost or transparent overlap | Reduce overlapping layers/particles; simplify shaders; tune costly passes or render scale | GPU time at fixed camera, readability, transparency ordering |
| Vertex/geometry cost | Mesh LOD, impostors, animation LOD, culling, skinning budgets | GPU time, popping, silhouettes, shadows, skinning |
| Shadow/light passes dominate | Tune casters, cascades, distance/resolution and overlapping lights; bake suitable static lighting | Pass time, leaks, dynamic interaction and time-of-day requirements |
| Texture bandwidth/residency pressure | Right-size textures; mipmaps; supported GPU compression; material reuse | Resident memory, uploads, sharpness, normal/data maps |
| Shader/pipeline hitches | Collect variants; prebuild/warm where supported; bound variant growth | Cold start, misses, warmup cost/memory |

For 2D, inspect sprite/UI batching, atlas changes, masks, offscreen effects, layout invalidation, alpha overdraw, and tile-chunk rebuilds. Pixel art needs deliberate filtering, scale policy, atlas padding, and mip behavior.

Large merged meshes can defeat culling, streaming, and lightmap organization. Large atlases can force unrelated textures into residency. Instancing does not remove fragment cost. Occlusion has its own cost. Benchmark grouping and camera paths.

Transfer compression differs from GPU compression. Geometry compression trades bytes for decode/upload work. JPEG/PNG size does not predict decoded residency. Verify runtime format/extension support and fallbacks.

## Physics, simulation, navigation, AI

Measure broad phase, narrow phase, contacts, solver, callbacks, queries, animation, navigation, and agents separately. Look for excess active bodies, dense contacts, complex colliders, duplicate queries, and callback allocations.

Consider simple collision proxies, layers/masks, sleeping, spatial indexing, query caching with invalidation, and selective continuous collision detection. Distance-based simulation detail must preserve required interaction and authoritative state. Visual LOD must not silently disable required collision.

Use a fixed simulation step when the design needs it; bound catch-up and define overload behavior. Test fast bodies, tunneling, stacks, input sampling, interpolation, replay, and slow frames. Larger time steps, fewer solver iterations, and skipped updates can change gameplay and determinism. Expose these tradeoffs.

Stagger noncritical sensing/path requests with bounded latency. Partition navigation, reuse valid paths, and invalidate when obstacles or regions change. Test narrow passages, offscreen agents, and boundaries.

## Streaming and storage

Trace acquisition, decompression, deserialization, main-thread creation, GPU upload, collision/nav activation, and publication separately. Async I/O does not make later stages asynchronous.

Size cells from measured traversal speed, sight lines, reuse, memory, and I/O latency. A starting relation is `prefetch_distance >= max_speed * measured_readiness_latency + safety_margin`, with compatible units. Include turns, vertical movement, teleports, and visibility. Readiness includes usable collision/navigation.

Bound requests, queued bytes, decode jobs, per-frame integration work, and transition overlap. Prioritize the next playable region; cancel stale work safely. Use stable IDs, shared ownership, eviction hysteresis, and late/missing-data fallbacks. Do not evict resources referenced by active cells.

Test cold/warm transitions, reversals, interruption, fast traversal, teleport, save/load, and outages. Consider origin shifting only when precision needs justify it, coordinating physics, particles, navigation, networking, and saves.

## Networking

Profile servers and clients separately. Track tick work/backlog, serialization, queues, bytes/packets, relevance, RTT/jitter/loss, correction magnitude, and interpolation-buffer delay.

Consider spatial interest management, per-entity rates, deltas with acknowledged baselines, quantization with error bounds, and bounded aggregation. Match reliability/ordering to message semantics; bulk reliable traffic can delay urgent messages. Include protocol/encryption overhead and test transport limits rather than assuming a universal safe payload.

Preserve authoritative validation. Prediction, interpolation, reconciliation, and lag compensation need impaired-network tests. Do not save bandwidth by trusting client state or removing validation. Test joins, despawns, relevance changes, loss/reordering, reconnect, maximum load, and slow clients. Bound queues and define overload/backpressure behavior.

## Memory and allocation

Attribute memory to ownership/lifetime. Distinguish leaks, delayed GPU destruction, bounded caches, fragmentation, and pending collection. Inspect retained references after repeated transitions at comparable idle states.

Remove hot-path churn, reuse bounded buffers, compact data, and deduplicate when evidence supports it. Pools can increase retained memory; cap them and define exhaustion behavior. Forced GC during play is not a substitute for diagnosing allocation pressure.

Budget source, decoded, staging, and GPU copies plus transition overlap. For an uncompressed texture, base bytes are `width * height * bytes_per_pixel`; a full mip chain adds approximately one third for typical power-of-two 2D textures. Compressed formats use block-based calculations. Include layers, cube faces, render targets, multisampling, and depth. Separate estimates from device measurements.

Release textures, buffers, audio, jobs, subscriptions, and native handles using runtime lifecycle rules. Shared assets must survive one owner's unload and release after the final owner. Dropped references may not promptly release graphics resources in browser/managed runtimes.
