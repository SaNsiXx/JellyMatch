// Ray-marched jelly "M": two rounded arches, lime and violet, that merge into the logo.
// Colour comes from how far the view ray travels through each jelly, so the overlap reads as a pale drop.

export const VERTEX = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

export const FRAGMENT = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uT;
uniform vec2 uMouse;
uniform float uHover;
uniform float uMerge;
uniform float uScroll;
out vec4 fragColor;

const vec3 LIME = vec3(0.776, 1.0, 0.0);
const vec3 VIOLET = vec3(0.545, 0.361, 0.965);
const vec3 BLEND = vec3(0.851, 0.91, 0.627);
const float R = 0.43;

float capsule(vec3 p, vec3 a, vec3 b, float r) {
  vec3 pa = p - a, ba = b - a;
  return length(pa - ba * clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0)) - r;
}
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}
vec3 wobble(vec3 p, float s) {
  float t = uT * 0.7 + s;
  return p + 0.055 * sin(p.yzx * 2.3 + vec3(t, t * 1.3, t * 0.8)) + 0.02 * sin(p.zxy * 5.0 + t * 1.7);
}
vec3 pull(vec3 p) {
  vec2 d = uMouse - p.xy;
  float g = exp(-dot(d, d) * 1.6);
  return p - vec3(d * g * 0.16 * uHover, 0.0);
}
float sep() { return (1.0 - uMerge) * 1.05 + uScroll * 0.42; }

float limeD(vec3 p) {
  p = wobble(pull(p) + vec3(sep(), 0.0, 0.0), 0.0);
  float a = capsule(p, vec3(-1.36, -0.72, 0.0), vec3(-0.56, 0.68, 0.0), R);
  float b = capsule(p, vec3(-0.56, 0.68, 0.0), vec3(0.04, -0.34, 0.0), R);
  return smin(a, b, 0.1);
}
float violetD(vec3 p) {
  p = wobble(pull(p) - vec3(sep(), 0.0, 0.0), 2.4);
  float a = capsule(p, vec3(1.36, -0.72, 0.0), vec3(0.56, 0.68, 0.0), R);
  float b = capsule(p, vec3(0.56, 0.68, 0.0), vec3(-0.04, -0.34, 0.0), R);
  return smin(a, b, 0.1);
}
float map(vec3 p) { return smin(limeD(p), violetD(p), 0.05); }

vec3 normal(vec3 p) {
  vec2 e = vec2(0.003, -0.003);
  return normalize(e.xyy * map(p + e.xyy) + e.yyx * map(p + e.yyx) + e.yxy * map(p + e.yxy) + e.xxx * map(p + e.xxx));
}
float hash(vec3 p) {
  p = fract(p * 0.3183 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / (0.5 * min(uRes.x, uRes.y));
  uv.y -= 0.02;
  vec3 ro = vec3(0.0, 0.0, 5.6);
  vec3 rd = normalize(vec3(uv, -2.85));
  float yaw = uMouse.x * 0.1 + sin(uT * 0.35) * 0.07 + uScroll * 0.35;
  float pitch = -uMouse.y * 0.06 + sin(uT * 0.27) * 0.03;
  ro.xz *= rot(yaw); rd.xz *= rot(yaw);
  ro.yz *= rot(pitch); rd.yz *= rot(pitch);

  float t = 3.6, closest = 9.0, glowLime = 0.0;
  bool hit = false;
  for (int i = 0; i < 52; i++) {
    vec3 p = ro + rd * t;
    float dl = limeD(p), dv = violetD(p);
    float d = smin(dl, dv, 0.05);
    if (d < closest) { closest = d; glowLime = clamp(0.5 + (dv - dl) * 1.5, 0.0, 1.0); }
    if (d < 0.002) { hit = true; break; }
    t += d * 0.82;
    if (t > 8.0) break;
  }

  vec3 glowCol = mix(VIOLET, LIME, glowLime);
  if (!hit) {
    float glow = exp(-closest * 3.4) * 0.5;
    fragColor = vec4(glowCol * glow, glow * 0.25);
    return;
  }

  vec3 p = ro + rd * t;
  vec3 n = normal(p);
  float nv = clamp(dot(n, -rd), 0.0, 1.0);
  float rim = pow(1.0 - nv, 2.6);

  // Travel through the jelly along a slightly refracted ray.
  vec3 rr = refract(rd, n, 0.78);
  float tl = 0.0, tv = 0.0, sparkle = 0.0;
  for (int i = 0; i < 12; i++) {
    vec3 q = p + rr * (0.08 + float(i) * 0.1);
    if (limeD(q) < 0.0) tl += 0.1;
    if (violetD(q) < 0.0) tv += 0.1;
    // Tiny round specks suspended inside the jelly.
    vec3 cell = q * 46.0;
    float dotD = length(fract(cell) - 0.5);
    sparkle += step(0.985, hash(floor(cell))) * smoothstep(0.26, 0.04, dotD);
  }
  float both = smoothstep(0.0, 0.5, min(tl, tv));
  vec3 body = LIME * (1.0 - exp(-tl * 1.7)) * step(tv, tl + 0.3) + VIOLET * (1.0 - exp(-tv * 1.7)) * step(tl, tv + 0.3);
  vec3 tint = tl + tv > 0.0 ? mix(VIOLET, LIME, tl / (tl + tv)) : glowCol;
  body = mix(body, BLEND * 0.95, both);
  // Dark glassy core, bright neon edge.
  float depth = smoothstep(0.3, 1.1, tl + tv);
  float core = mix(mix(0.92, 0.3, depth), 0.92, both);
  vec3 col = body * core + mix(tint, BLEND, both * 0.6) * (rim * 1.5 + pow(1.0 - nv, 1.1) * 0.22);
  col += mix(tint, vec3(1.0), 0.35) * sparkle * 0.7;

  vec3 l1 = normalize(vec3(-0.5, 0.85, 0.6));
  vec3 l2 = normalize(vec3(0.7, 0.3, 0.7));
  col += vec3(1.0) * pow(max(dot(reflect(rd, n), l1), 0.0), 90.0) * 1.3;
  col += vec3(0.95, 0.97, 1.0) * pow(max(dot(reflect(rd, n), l2), 0.0), 26.0) * 0.32;
  col += mix(tint, vec3(1.0), 0.4) * smoothstep(0.55, 0.95, reflect(rd, n).y) * 0.2;

  float alpha = clamp(0.72 + rim * 0.28 + both * 0.2, 0.0, 1.0);
  fragColor = vec4(col, alpha);
}`;
