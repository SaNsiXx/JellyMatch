"use client";

import { useEffect, useRef } from "react";
import { FRAGMENT, VERTEX } from "./jellyShader";
import { Picture } from "./Picture";

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
}

/** True when the page should keep the rendered image: phones, reduced motion, Save-Data, no real GPU. */
function preferStatic(gl: WebGL2RenderingContext | null, forced: boolean) {
  if (!gl) return true;
  if (forced) return false;
  const info = gl.getExtension("WEBGL_debug_renderer_info");
  const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
  return /swiftshader|llvmpipe|software|basic render/i.test(renderer);
}

export function HeroJellies() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const forced = new URLSearchParams(location.search).has("jelly");
    const saveData = (navigator as { connection?: { saveData?: boolean } }).connection?.saveData;
    if (!forced && (saveData || !matchMedia("(min-width: 900px) and (prefers-reduced-motion: no-preference)").matches)) return;

    const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: "high-performance" });
    if (preferStatic(gl, forced) || !gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
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
    gl.clearColor(0, 0, 0, 0);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const uRes = u("uRes"), uT = u("uT"), uMouse = u("uMouse"), uHover = u("uHover"), uMerge = u("uMerge"), uScroll = u("uScroll");

    let scale = Math.min(devicePixelRatio, 1.25);
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(r.width * scale));
      canvas.height = Math.max(1, Math.round(r.height * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const target = { x: 0, y: 0, hover: 0 };
    const mouse = { x: 0, y: 0, hover: 0 };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const half = Math.min(r.width, r.height) / 2;
      // Roughly scene units at the jelly plane.
      target.x = ((e.clientX - r.left - r.width / 2) / half) * 2.3;
      target.y = (-(e.clientY - r.top - r.height / 2) / half) * 2.3;
      target.hover = 1;
    };
    const onLeave = () => { target.hover = 0; };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    let visible = true, raf = 0, shown = false, disposed = false;
    let mergeStart = 0, last = 0, frames = 0, windowStart = 0;
    const t0 = performance.now();

    const giveUp = () => {
      canvas.style.opacity = "0";
      canvas.closest<HTMLElement>(".hero-jellies")?.removeAttribute("data-live");
      disposed = true;
    };

    const frame = (now: number) => {
      raf = 0;
      if (disposed || !visible) return;
      raf = requestAnimationFrame(frame);

      if (!mergeStart && document.documentElement.hasAttribute("data-ready")) mergeStart = now;
      // Overshoots a little, like soft jelly settling together.
      const m = mergeStart ? Math.min((now - mergeStart) / 1700, 1) : 0;
      const merge = m === 1 ? 1 : 1 - Math.pow(2, -9 * m) * Math.cos(m * 7.5);

      mouse.x += (target.x - mouse.x) * 0.07;
      mouse.y += (target.y - mouse.y) * 0.07;
      mouse.hover += (target.hover - mouse.hover) * 0.05;

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uT, (now - t0) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uHover, mouse.hover);
      gl.uniform1f(uMerge, merge);
      gl.uniform1f(uScroll, Math.min(scrollY / innerHeight, 1.2));
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (!shown) {
        shown = true;
        canvas.closest<HTMLElement>(".hero-jellies")?.setAttribute("data-live", "");
      }

      // Lower the resolution when frames are slow; drop back to the image if that is not enough.
      if (!forced && last && now - last < 400) {
        frames++;
        if (!windowStart) windowStart = now;
        if (now - windowStart > 1200) {
          const fps = (frames * 1000) / (now - windowStart);
          frames = 0;
          windowStart = now;
          if (fps < 42 && scale > 0.5) {
            scale = Math.max(0.5, scale * 0.75);
            resize();
          } else if (fps < 24 && scale <= 0.5) giveUp();
        }
      }
      last = now;
    };

    const start = () => { if (!raf && !disposed) raf = requestAnimationFrame(frame); };
    const io = new IntersectionObserver(([e]) => {
      visible = !!e?.isIntersecting && !document.hidden;
      last = 0;
      if (visible) start();
    });
    io.observe(canvas);
    const onVisibility = () => {
      visible = !document.hidden;
      last = 0;
      if (visible) start();
    };
    document.addEventListener("visibilitychange", onVisibility);
    start();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className="hero-jellies" data-parallax="hero" aria-hidden="true">
      <div className="hero-jellies-img">
        <Picture name="hero-jellies" alt="" sizes="(min-width: 900px) 58vw, 100vw" priority />
      </div>
      <canvas ref={canvasRef} />
    </div>
  );
}
