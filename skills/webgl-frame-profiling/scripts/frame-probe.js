// WebGL frame probe: evaluate in the game page. Adds window.__probe.
//   await __probe.health()           -> visibility and rAF rate (refuse to measure when throttled)
//   __probe.pick()                   -> attaches to the largest canvas's WebGL context
//   await __probe.capture(5, "label") -> warm-up 1.5 s, record 5 s, return a summary
//   __probe.start(); ...; __probe.stop() -> manual window (for example around a scripted route)
// GPU timing needs EXT_disjoint_timer_query_webgl2 (Chromium desktop; often absent elsewhere).
// Timer queries wrap the whole frame from the first draw to the next rAF, so overlapping
// queries are never issued. Remove with __probe.uninstall().
(() => {
  if (window.__probe) window.__probe.uninstall();
  const G = window.WebGL2RenderingContext?.prototype;
  const G1 = window.WebGLRenderingContext?.prototype;
  const DRAWS = ["drawElements", "drawArrays", "drawElementsInstanced", "drawArraysInstanced", "drawRangeElements"];
  const saved = [];
  const P = (window.__probe = { gl: null, ext: null, draws: 0, tris: 0, frames: [], gpu: [], pending: [], q: null, recording: false, alive: true });

  const triangles = (gl, name, a) => {
    if (a[0] !== gl.TRIANGLES) return 0;
    const count = name === "drawRangeElements" ? a[3] : name.startsWith("drawElements") ? a[1] : a[2];
    const instances = name === "drawElementsInstanced" ? a[4] : name === "drawArraysInstanced" ? a[3] : 1;
    return (count / 3) * instances;
  };
  for (const proto of [G, G1].filter(Boolean))
    for (const name of DRAWS) {
      const orig = proto[name];
      if (!orig) continue;
      saved.push([proto, name, orig]);
      proto[name] = function (...a) {
        if (this === P.gl) {
          if (P.recording && P.ext && !P.q) { P.q = this.createQuery(); this.beginQuery(P.ext.TIME_ELAPSED_EXT, P.q); }
          P.draws++;
          P.tris += triangles(this, name, a);
        }
        return orig.apply(this, a);
      };
    }

  let last = 0;
  const tick = (t) => {
    if (!P.alive) return;
    const gl = P.gl;
    if (gl && P.q) { gl.endQuery(P.ext.TIME_ELAPSED_EXT); P.pending.push(P.q); P.q = null; }
    if (gl && P.pending.length)
      P.pending = P.pending.filter((q) => {
        if (!gl.getQueryParameter(q, gl.QUERY_RESULT_AVAILABLE)) return true;
        const ns = gl.getQueryParameter(q, gl.QUERY_RESULT);
        if (!gl.getParameter(P.ext.GPU_DISJOINT_EXT) && P.recording) P.gpu.push(ns / 1e6);
        gl.deleteQuery(q);
        return false;
      });
    if (P.recording && last) P.frames.push({ dt: t - last, draws: P.draws, tris: P.tris });
    P.draws = 0; P.tris = 0; last = t;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  const q = (xs, p) => { const s = [...xs].sort((a, b) => a - b); return s.length ? s[Math.min(s.length - 1, Math.floor(p * s.length))] : null; };
  const r = (x) => (x == null || Number.isNaN(x) ? null : +x.toFixed(2));
  const wait = (ms) => new Promise((res) => setTimeout(res, ms));

  P.health = () => new Promise((res) => {
    let n = 0; const t0 = performance.now();
    const f = () => (n++, performance.now() - t0 < 1000 ? requestAnimationFrame(f) : res({ visibility: document.visibilityState, rafPerSecond: n, throttled: document.hidden || n < 30 }));
    requestAnimationFrame(f);
    setTimeout(() => res({ visibility: document.visibilityState, rafPerSecond: n, throttled: true }), 1500);
  });

  // Calling getContext again with the context's own type returns the existing context.
  P.pick = (canvas) => {
    const c = canvas ?? [...document.querySelectorAll("canvas")].sort((a, b) => b.width * b.height - a.width * a.height)[0];
    P.gl = c && (c.getContext("webgl2") || c.getContext("webgl"));
    P.ext = P.gl?.getExtension?.("EXT_disjoint_timer_query_webgl2") ?? null;
    return { canvas: c ? `${c.width}x${c.height}` : null, webgl2: !!(P.gl && window.WebGL2RenderingContext && P.gl instanceof WebGL2RenderingContext), gpuTimer: !!P.ext, dpr: devicePixelRatio };
  };
  P.start = () => { if (!P.gl) P.pick(); P.frames = []; P.gpu = []; P.recording = true; };
  P.stop = () => {
    P.recording = false;
    const dts = P.frames.map((f) => f.dt);
    const mean = dts.reduce((a, b) => a + b, 0) / dts.length;
    return {
      frames: dts.length, fps: r(1000 / mean), p50: r(q(dts, 0.5)), p95: r(q(dts, 0.95)), p99: r(q(dts, 0.99)), max: r(Math.max(...dts)),
      over20ms: dts.filter((d) => d > 20).length, over33ms: dts.filter((d) => d > 33).length,
      draws: q(P.frames.map((f) => f.draws), 0.5), ktris: Math.round((q(P.frames.map((f) => f.tris), 0.5) ?? 0) / 1000),
      gpuN: P.gpu.length, gpuP50: r(q(P.gpu, 0.5)), gpuP95: r(q(P.gpu, 0.95)), gpuMax: r(P.gpu.length ? Math.max(...P.gpu) : null),
      hidden: document.hidden,
    };
  };
  P.capture = async (seconds = 5, label = "") => {
    await wait(1500);
    P.start();
    await wait(seconds * 1000);
    return { label, ...P.stop() };
  };
  // Wraps any async action (for example a scripted route) in a capture window.
  P.during = async (action, label = "") => { P.start(); const result = await action(); return { label, ...P.stop(), result }; };

  P.uninstall = () => {
    P.alive = false; P.recording = false;
    for (const [proto, name, orig] of saved) proto[name] = orig;
    delete window.__probe;
  };
  return "frame probe installed";
})();
