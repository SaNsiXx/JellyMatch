import { fragment, vertex } from "./jellyShader";

/**
 * Gooey WebGL jellies for the hero.
 *  - idle: a lime/violet cluster orbits and breathes; touching blobs fuse (pale overlap like the logo)
 *  - swarm: smaller jellies drift around the whole hero; the cursor collects them and they fuse on contact
 *  - pointer: a jelly follows the cursor, pulls everything nearby towards it and merges with it
 *  - scroll (`progress` 0→1): the cluster gathers into one big jelly that squeezes out lime drops — the shortlist
 *  - speed (scroll velocity, pointer speed) makes the surface ripple
 * Every blob is a damped spring, so all motion overshoots and settles like jelly.
 */

type Vec3 = [number, number, number];
type Blob = { o: Vec3; r: number; kind: number; f: Vec3; ph: number };

const CLUSTER: Blob[] = [
  { o: [-0.58, 0.32, 0.0], r: 0.6, kind: 0, f: [0.31, 0.27, 0.22], ph: 0.0 },
  { o: [0.46, 0.46, -0.2], r: 0.54, kind: 1, f: [0.26, 0.33, 0.2], ph: 1.7 },
  { o: [0.04, -0.34, 0.2], r: 0.66, kind: 1, f: [0.22, 0.24, 0.3], ph: 3.1 },
  { o: [-0.66, -0.6, -0.1], r: 0.36, kind: 0, f: [0.37, 0.29, 0.25], ph: 4.4 },
  { o: [0.8, -0.42, 0.1], r: 0.4, kind: 0, f: [0.29, 0.35, 0.27], ph: 5.2 },
  { o: [0.12, 0.98, -0.3], r: 0.28, kind: 1, f: [0.34, 0.25, 0.31], ph: 2.4 },
  { o: [-0.22, 0.72, 0.25], r: 0.34, kind: 0, f: [0.27, 0.31, 0.24], ph: 0.9 },
  { o: [0.58, 0.04, -0.35], r: 0.46, kind: 1, f: [0.24, 0.28, 0.33], ph: 3.8 },
];

/**
 * Swarm of smaller jellies spread over the hero, as fractions of the half-viewport (x, y in -1..1),
 * radius as a fraction of the half-height. Desktop anchors keep clear of the headline column on the left.
 */
type Drifter = { a: [number, number]; r: number; kind: number; ph: number };
const SWARM: Drifter[] = [
  { a: [-0.86, 0.8], r: 0.075, kind: 1, ph: 0.3 },
  { a: [-0.38, 0.9], r: 0.05, kind: 0, ph: 1.1 },
  { a: [0.08, 0.76], r: 0.09, kind: 0, ph: 2.0 },
  { a: [0.94, 0.84], r: 0.065, kind: 1, ph: 2.9 },
  { a: [0.97, -0.12], r: 0.08, kind: 0, ph: 3.7 },
  { a: [0.88, -0.78], r: 0.1, kind: 1, ph: 4.5 },
  { a: [0.42, -0.86], r: 0.06, kind: 0, ph: 5.3 },
  { a: [0.02, -0.6], r: 0.085, kind: 1, ph: 0.7 },
  { a: [-0.42, -0.84], r: 0.055, kind: 0, ph: 1.6 },
  { a: [-0.94, -0.7], r: 0.07, kind: 1, ph: 2.4 },
  { a: [0.12, 0.22], r: 0.06, kind: 1, ph: 3.2 },
  { a: [-0.05, -0.12], r: 0.05, kind: 0, ph: 4.1 },
];
const DROPS = 5;
const N = CLUSTER.length + SWARM.length + 1 + DROPS; // cluster + swarm + cursor + drops
const CURSOR = CLUSTER.length + SWARM.length;

const CAM_Z = 6;
const TAN_HALF = 0.32;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const elastic = (t: number) =>
  t <= 0 ? 0 : t >= 1 ? 1 : Math.pow(2, -9 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;

type Spring = { p: number[]; v: number[] }; // x, y, z, r

export type JellyOptions = { reduced: boolean; coarse: boolean };

export class JellyField {
  private gl: WebGLRenderingContext;
  private prog: WebGLProgram;
  private loc: Record<string, WebGLUniformLocation | null> = {};
  private springs: Spring[] = Array.from({ length: N }, () => ({ p: [0, 0, 0, 0], v: [0, 0, 0, 0] }));
  private blobBuf = new Float32Array(N * 4);
  private kindBuf = new Float32Array(N);
  private raf = 0;
  private running = false;
  private visible = true;
  private last = 0;
  private time = 0;
  private born = -1;
  private scale: number;
  private frameAvg = 16;
  private progress = 0;
  private wobble = 0;
  private velocity = 0;
  private pointer = { x: 0, y: 0, inside: false, speed: 0, lastX: 0, lastY: 0 };
  private hover = 0;
  private dispose: (() => void)[] = [];

  constructor(
    private canvas: HTMLCanvasElement,
    private opts: JellyOptions,
  ) {
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: "high-performance" });
    if (!gl) throw new Error("WebGL unavailable");
    // CPU-emulated WebGL (no GPU / blocklisted driver) would block the main thread every frame — use the static fallback
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
    // (window.__jmForceWebGL lets automated visual checks bypass this)
    const force = (window as Window & { __jmForceWebGL?: boolean }).__jmForceWebGL;
    if (!force && /swiftshader|llvmpipe|software|basic render/i.test(renderer)) throw new Error(`software renderer: ${renderer}`);
    this.gl = gl;
    // phones have small viewports, so they can afford a sharper buffer
    this.scale = opts.coarse ? 0.75 : 0.62;

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, vertex));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fragment(N, opts.coarse ? 44 : 64)));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? "link");
    gl.useProgram(prog);
    this.prog = prog;

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    for (const u of ["uRes", "uTime", "uCamZ", "uTanHalf", "uBlob", "uKind", "uWobble", "uGoo"]) this.loc[u] = gl.getUniformLocation(prog, u);
    gl.uniform1f(this.loc.uCamZ!, CAM_Z);
    gl.uniform1f(this.loc.uTanHalf!, TAN_HALF);

    CLUSTER.forEach((b, i) => (this.kindBuf[i] = b.kind));
    SWARM.forEach((d, j) => (this.kindBuf[CLUSTER.length + j] = d.kind));
    this.kindBuf[CURSOR] = 0; // lime, like the CTAs
    for (let j = 0; j < DROPS; j++) this.kindBuf[CURSOR + 1 + j] = 0;

    this.resize();
    // start everything at its idle position with zero radius → the intro "pops" them in
    this.layout(0, true);

    const ro = new ResizeObserver(() => this.resize());
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      this.visible = !!e?.isIntersecting;
      if (this.visible) this.kick();
    });
    io.observe(canvas);
    const onVis = () => !document.hidden && this.kick();
    document.addEventListener("visibilitychange", onVis);
    const onLost = (e: Event) => {
      e.preventDefault();
      this.stop();
    };
    canvas.addEventListener("webglcontextlost", onLost);
    this.dispose.push(() => {
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("webglcontextlost", onLost);
    });

    if (!opts.coarse && !opts.reduced) {
      const onMove = (e: PointerEvent) => {
        const r = canvas.getBoundingClientRect();
        const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        const [hw, hh] = this.half();
        this.pointer.x = ((e.clientX - r.left) / r.width) * 2 * hw - hw;
        this.pointer.y = hh - ((e.clientY - r.top) / r.height) * 2 * hh;
        this.pointer.speed += Math.hypot(e.clientX - this.pointer.lastX, e.clientY - this.pointer.lastY);
        this.pointer.lastX = e.clientX;
        this.pointer.lastY = e.clientY;
        this.pointer.inside = inside;
      };
      const onLeave = () => (this.pointer.inside = false);
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      this.dispose.push(() => {
        window.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("pointerleave", onLeave);
      });
    }
  }

  /** World half-extent of the z=0 plane. */
  private half(): [number, number] {
    const hh = CAM_Z * TAN_HALF;
    return [hh * (this.canvas.clientWidth / Math.max(1, this.canvas.clientHeight)), hh];
  }

  private resize() {
    const w = Math.max(1, Math.round(this.canvas.clientWidth * this.scale));
    const h = Math.max(1, Math.round(this.canvas.clientHeight * this.scale));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
      this.gl.viewport(0, 0, w, h);
      this.gl.uniform2f(this.loc.uRes!, w, h);
    }
    this.kick();
  }

  /** Cluster placement for the current viewport: right of the copy on wide screens, above it on phones. */
  private frame() {
    const [hw, hh] = this.half();
    const aspect = hw / hh;
    if (aspect >= 1.15) return { cx: hw * 0.44, cy: 0.02, s: Math.min(1.2, hw * 0.34), mx: hw * 0.1, my: 0.1 };
    // narrower screens: the copy sits low, so the jellies live in the top band above it
    if (aspect >= 0.8) return { cx: hw * 0.36, cy: hh * 0.58, s: hw * 0.34, mx: hw * 0.2, my: hh * 0.5 };
    return { cx: hw * 0.14, cy: hh * 0.66, s: hw * 0.42, mx: 0, my: hh * 0.55 };
  }

  /** Compute targets for every blob and step the springs (or snap them when `snap`). */
  private layout(dt: number, snap = false) {
    const { cx, cy, s, mx, my } = this.frame();
    const [, hh] = this.half();
    const t = this.time;
    const p = this.progress;
    const gather = easeInOut(smooth(0.02, 0.5, p));
    const appearT = this.born < 0 ? 0 : this.time - this.born;
    const hover = this.hover;

    const targets: number[][] = [];
    CLUSTER.forEach((b, i) => {
      const orbit: Vec3 = [
        cx + (b.o[0] + Math.sin(t * b.f[0] + b.ph) * 0.2) * s,
        cy + (b.o[1] + Math.cos(t * b.f[1] + b.ph) * 0.17) * s,
        (b.o[2] + Math.sin(t * b.f[2] + b.ph) * 0.3) * s,
      ];
      const merged: Vec3 = [mx + b.o[0] * s * 0.3, my + b.o[1] * s * 0.3 + Math.sin(t * 2.1 + b.ph) * 0.04, b.o[2] * s * 0.3];
      const pos = orbit.map((v, k) => v + (merged[k]! - v) * gather) as Vec3;
      // pointer pull: the cluster leans into the cursor and stretches towards it
      if (hover > 0.01) {
        const dx = this.pointer.x - pos[0];
        const dy = this.pointer.y - pos[1];
        const pull = Math.exp(-Math.hypot(dx, dy) * 0.7) * 0.7 * hover * (1 - gather * 0.6);
        pos[0] += dx * pull;
        pos[1] += dy * pull;
      }
      // breathing + a squeeze while the big jelly pushes drops out
      const squeeze = 1 + Math.sin(t * 1.6 + b.ph) * 0.04 + smooth(0.5, 0.62, p) * (1 - smooth(0.62, 0.9, p)) * 0.12;
      const appear = this.opts.reduced ? 1 : elastic(clamp01((appearT - i * 0.09) / 1.4));
      targets.push([...pos, b.r * s * (1 + gather * 0.14) * squeeze * appear]);
    });

    // swarm: drifts around the hero, gets collected by the cursor, sucked into the big jelly on scroll
    const [hw] = this.half();
    const narrow = hw / hh < 0.8;
    const count = this.opts.coarse ? 8 : SWARM.length;
    const absorb = easeInOut(smooth(0.05, 0.55, p));
    SWARM.forEach((d, j) => {
      if (j >= count) {
        targets.push([0, 0, 0, 0]);
        return;
      }
      // phones: the copy fills the lower part, so the swarm lives in the top band
      const ay = narrow ? 0.35 + ((d.a[1] + 1) / 2) * 0.6 : d.a[1];
      const drift: Vec3 = [
        d.a[0] * hw * 0.92 + Math.sin(t * 0.23 + d.ph) * hh * 0.12,
        ay * hh * 0.9 + Math.cos(t * 0.19 + d.ph * 1.3) * hh * 0.1,
        Math.sin(t * 0.3 + d.ph) * 0.4,
      ];
      const into: Vec3 = [mx + d.a[0] * s * 0.18, my + d.a[1] * s * 0.18, 0];
      const pos = drift.map((v, k) => v + (into[k]! - v) * absorb) as Vec3;
      if (hover > 0.01) {
        const dx = this.pointer.x - pos[0];
        const dy = this.pointer.y - pos[1];
        const grab = Math.exp(-Math.hypot(dx, dy) * 1.05) * 0.85 * hover * (1 - absorb);
        pos[0] += dx * grab;
        pos[1] += dy * grab;
      }
      const appear = this.opts.reduced ? 1 : elastic(clamp01((appearT - 0.55 - j * 0.07) / 1.2));
      const breathe = 1 + Math.sin(t * 1.9 + d.ph) * 0.06;
      targets.push([...pos, d.r * 1.5 * hh * (narrow ? 0.8 : 1) * breathe * appear * (1 - absorb * 0.55)]);
    });

    // cursor jelly
    targets.push([this.pointer.x, this.pointer.y, 0.6, 0.36 * s * hover * (1 - gather * 0.5)]);

    // shortlist drops: peel off the bottom of the merged jelly and fall
    for (let j = 0; j < DROPS; j++) {
      const local = clamp01((p - 0.48 - j * 0.07) / 0.34);
      const r = 0.17 * s * smooth(0, 0.12, local) * (1 - smooth(0.88, 1, local));
      const spread = (j - (DROPS - 1) / 2) * 0.42 * s;
      targets.push([mx + spread * smooth(0, 0.5, local), my - 0.5 * s - local * hh * 1.3, 0.25, r]);
    }

    const k = 120;
    const c = 13;
    targets.forEach((tg, i) => {
      const sp = this.springs[i]!;
      for (let a = 0; a < 4; a++) {
        if (snap) {
          sp.p[a] = a === 3 ? 0 : tg[a]!;
          sp.v[a] = 0;
          continue;
        }
        const acc = k * (tg[a]! - sp.p[a]!) - c * sp.v[a]!;
        sp.v[a]! += acc * dt;
        sp.p[a]! += sp.v[a]! * dt;
      }
      this.blobBuf.set([sp.p[0]!, sp.p[1]!, sp.p[2]!, Math.max(0, sp.p[3]!)], i * 4);
    });
  }

  private draw() {
    const gl = this.gl;
    gl.uniform1f(this.loc.uTime!, this.time);
    gl.uniform4fv(this.loc.uBlob!, this.blobBuf);
    gl.uniform1fv(this.loc.uKind!, this.kindBuf);
    gl.uniform1f(this.loc.uWobble!, this.wobble);
    gl.uniform1f(this.loc.uGoo!, 0.52);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  private loop = (now: number) => {
    this.raf = 0;
    if (!this.running || !this.visible || document.hidden) return;
    const dt = Math.min(0.033, this.last ? (now - this.last) / 1000 : 0.016);
    this.last = now;
    this.time += dt;

    this.hover += ((this.pointer.inside ? 1 : 0) - this.hover) * Math.min(1, dt * 4);
    const wobbleTarget = Math.min(1, Math.abs(this.velocity) * 0.035 + this.pointer.speed * 0.0025);
    this.wobble += (wobbleTarget - this.wobble) * Math.min(1, dt * 3);
    this.pointer.speed *= 0.85;

    // a few sub-steps keep the springs stable at low frame rates
    const sub = 3;
    for (let i = 0; i < sub; i++) this.layout(dt / sub);
    this.draw();

    // adaptive resolution: keep ~50 fps on weaker GPUs
    this.frameAvg = this.frameAvg * 0.94 + dt * 1000 * 0.06;
    if (this.frameAvg > 24 && this.scale > 0.34) {
      this.scale *= 0.85;
      this.frameAvg = 16;
      this.resize();
    }

    if (this.opts.reduced && this.time > 0.5) return; // one settled frame is enough
    this.raf = requestAnimationFrame(this.loop);
  };

  private kick() {
    if (this.running && !this.raf && this.visible && !document.hidden) {
      this.last = 0;
      this.raf = requestAnimationFrame(this.loop);
    }
  }

  /** Begin rendering; the jellies pop in with an elastic stagger. */
  start() {
    this.running = true;
    this.born = this.time;
    this.kick();
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  setProgress(p: number) {
    this.progress = clamp01(p);
    this.kick();
  }

  setVelocity(v: number) {
    this.velocity = v;
  }

  destroy() {
    this.stop();
    this.dispose.forEach((d) => d());
    this.gl.deleteProgram(this.prog);
    this.gl.getExtension("WEBGL_lose_context")?.loseContext();
  }
}
