"use client";

import { useEffect, useRef } from "react";

const VERTEX = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

// Domain-warped noise: slow liquid light with thin silk filaments. Scroll travels through the field
// and shifts it from violet to lime; the cursor bends it. Kept dark so text stays readable on top.
const FRAGMENT = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uT;
uniform vec2 uMouse;
uniform float uScroll;
out vec4 fragColor;

const vec3 LIME = vec3(0.776, 1.0, 0.0);
const vec3 VIOLET = vec3(0.545, 0.361, 0.965);
const vec3 INK = vec3(0.043, 0.043, 0.059);

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + vec2(13.1, 7.7); a *= 0.5; }
  return v;
}

void main() {
  float aspect = uRes.x / uRes.y;
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = vec2(uv.x * aspect, uv.y);
  vec2 m = vec2(uMouse.x * aspect, uMouse.y);

  vec2 toM = p - m;
  float md = dot(toM, toM);
  p += toM * exp(-md * 9.0) * 0.5;
  p.y -= uScroll * 2.6;

  float t = uT * 0.045;
  vec2 q = vec2(fbm(p * 1.05 + vec2(0.0, t)), fbm(p * 1.05 + vec2(5.2, -t * 0.8)));
  float r = fbm(p * 1.25 + 3.2 * q + vec2(t * 0.6, t));

  float shift = smoothstep(0.32, 0.68, q.y + (uScroll - 0.5) * 0.45);
  vec3 hue = mix(VIOLET, LIME, shift);

  float cloud = pow(r, 2.6) * 0.5;
  float lines = sin(r * 26.0 + q.x * 8.0 + uT * 0.12);
  float silk = pow(1.0 - abs(lines), 14.0) * smoothstep(0.34, 0.66, r);

  vec3 col = INK + hue * cloud * 0.62 + mix(hue, vec3(0.95), 0.18) * silk * 0.3;
  col += mix(VIOLET, LIME, uMouse.x) * exp(-md * 7.0) * 0.05;

  // Falls off towards the edges of the viewport, and never gets bright enough to hurt text contrast.
  col *= 1.0 - 0.32 * dot(uv - 0.5, uv - 0.5) * 2.0;
  col *= min(1.0, 0.22 / max(col.r, max(col.g, col.b)));
  col += (hash(gl_FragCoord.xy + fract(uT)) - 0.5) / 255.0;
  fragColor = vec4(col, 1.0);
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
}

/** Fixed layer behind the whole page. CSS blobs underneath cover phones, reduced motion and no-GPU machines. */
export function AmbientBackground() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current, canvas = canvasRef.current;
    if (!root || !canvas) return;
    const saveData = (navigator as { connection?: { saveData?: boolean } }).connection?.saveData;
    if (saveData || !matchMedia("(min-width: 900px) and (prefers-reduced-motion: no-preference)").matches) return;

    const gl = canvas.getContext("webgl2", { alpha: false, antialias: false, powerPreference: "low-power" });
    if (!gl) return;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    if (info && /swiftshader|llvmpipe|software|basic render/i.test(String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)))) return;
    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX), fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    if (!vs || !fs) return;
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(program, "uRes"), uT = gl.getUniformLocation(program, "uT");
    const uMouse = gl.getUniformLocation(program, "uMouse"), uScroll = gl.getUniformLocation(program, "uScroll");

    let scale = 0.45;
    const resize = () => {
      canvas.width = Math.max(1, Math.round(innerWidth * scale));
      canvas.height = Math.max(1, Math.round(innerHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const target = { x: 0.65, y: 0.6 }, mouse = { x: 0.65, y: 0.6 };
    const onMove = (e: PointerEvent) => {
      target.x = e.clientX / innerWidth;
      target.y = 1 - e.clientY / innerHeight;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0, last = 0, smooth = 0, frames = 0, windowStart = 0, slowWindows = 0, shown = false;
    const t0 = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (now - last < 31) return; // A slow field needs no more than ~30 fps.
      const gap = now - last;
      last = now;

      const max = document.documentElement.scrollHeight - innerHeight;
      smooth += ((max > 0 ? scrollY / max : 0) - smooth) * 0.08;
      mouse.x += (target.x - mouse.x) * 0.05;
      mouse.y += (target.y - mouse.y) * 0.05;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uT, (now - t0) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uScroll, smooth);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!shown) {
        shown = true;
        root.dataset.live = "";
      }

      if (gap > 300) return;
      if (!windowStart) windowStart = now;
      frames++;
      if (now - windowStart > 1500) {
        const fps = (frames * 1000) / (now - windowStart);
        frames = 0;
        windowStart = now;
        if (fps < 22) {
          slowWindows++;
          if (scale > 0.25) {
            scale *= 0.75;
            resize();
          } else if (slowWindows > 3) {
            delete root.dataset.live;
            cancelAnimationFrame(raf);
            raf = -1;
          }
        }
      }
    };
    const onVisibility = () => {
      if (raf === -1) return;
      cancelAnimationFrame(raf);
      raf = document.hidden ? 0 : requestAnimationFrame(frame);
    };
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div ref={rootRef} className="ambient" aria-hidden="true">
      <span className="ambient-blob ambient-a" />
      <span className="ambient-blob ambient-b" />
      <span className="ambient-blob ambient-c" />
      <canvas ref={canvasRef} />
    </div>
  );
}
