"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Five ribbons of light on ink. One per founder, and they are stirred by the
 * cursor. A single full-screen fragment shader, no geometry, so it costs one
 * draw call and runs on phones.
 */

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uMouse;
  uniform float uIntro;
  uniform float uScroll;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = m * p;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    float aspect = uRes.x / uRes.y;
    vec2 p = vec2((vUv.x - 0.5) * aspect, vUv.y - 0.5);
    vec2 m = vec2((uMouse.x - 0.5) * aspect, uMouse.y - 0.5);
    float t = uTime * 0.12;

    vec3 ink = vec3(0.047, 0.043, 0.039);
    vec3 verm = vec3(1.0, 0.30, 0.12);
    vec3 amber = vec3(1.0, 0.69, 0.13);
    vec3 rose = vec3(0.96, 0.22, 0.34);

    float w = fbm(p * 1.3 + vec2(t * 0.6, -t * 0.3));
    vec3 acc = vec3(0.0);

    for (int i = 0; i < 5; i++) {
      float fi = float(i);
      float base = -0.16 + fi * 0.11 + p.x * 0.16 - uScroll * 0.6;
      float y = base
        + 0.09 * sin(p.x * 1.7 + t * 2.0 + fi * 1.7)
        + 0.05 * sin(p.x * 3.3 - t * 1.3 + fi * 0.9)
        + (w - 0.5) * 0.36 * (0.6 + 0.4 * sin(fi));
      float dm = length(p - m);
      y += 0.11 * exp(-dm * dm * 6.0) * sin(fi * 1.3 + t * 3.0 + dm * 8.0);

      float d = abs(p.y - y);
      float width = 0.009 + 0.015 * (0.5 + 0.5 * sin(p.x * 2.2 + t * 1.5 + fi * 2.0));
      float core = (width * width) / (d * d + width * width);
      float halo = 0.010 / (d + 0.035);

      float k = 0.5 + 0.5 * sin(p.x * 0.9 + fi * 1.2 + t);
      vec3 col = mix(verm, amber, k);
      col = mix(col, rose, 0.35 * (0.5 + 0.5 * sin(fi * 2.1 - t * 0.7)));
      acc += col * (core * 1.15 + halo * 0.22) * (0.75 + 0.25 * sin(fi + t * 0.5));
    }

    // Soften toward the left edge where the headline sits, and toward the
    // sides in general so the ribbons read as light, not stripes.
    float sideFade = 1.0 - smoothstep(0.30 * aspect, 0.56 * aspect, abs(p.x));
    float leftFade = smoothstep(-0.55 * aspect, 0.05 * aspect, p.x);
    acc *= mix(0.35, 1.0, sideFade) * mix(0.45, 1.0, leftFade) * uIntro;
    acc = 1.0 - exp(-acc * 1.15);

    vec3 col = ink + acc;
    float v = 1.0 - smoothstep(0.35, 1.15, length(vec2(p.x / aspect, p.y) * 1.7));
    col = mix(ink, col, 0.4 + 0.6 * v);
    // Dither so the dark gradients never band.
    col += (hash(gl_FragCoord.xy + uTime) - 0.5) * (1.5 / 255.0);
    gl_FragColor = vec4(col, 1.0);
  }
`;

type Shared = {
  mouse: { x: number; y: number };
  intro: { v: number };
};

function Ribbons({ shared }: { shared: RefObject<Shared> }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const smooth = useRef({ x: 0.5, y: 0.5 });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uIntro: { value: 0 },
      uScroll: { value: 0 },
    }),
    [],
  );

  useFrame((state) => {
    const u = mat.current?.uniforms;
    if (!u) return;
    u.uTime.value = state.clock.elapsedTime;
    const { width, height } = state.size;
    u.uRes.value.set(width, height);
    const s = shared.current;
    smooth.current.x += (s.mouse.x - smooth.current.x) * 0.06;
    smooth.current.y += (s.mouse.y - smooth.current.y) * 0.06;
    u.uMouse.value.set(smooth.current.x, smooth.current.y);
    u.uIntro.value += (s.intro.v - u.uIntro.value) * 0.03;
    const sc = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
    u.uScroll.value = sc;
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

export function HeroCanvas({ active, intro }: { active: boolean; intro: boolean }) {
  // A mutable box shared with the render loop. The ref object itself is
  // passed down; its value is only read inside effects and useFrame.
  const shared = useRef<Shared>({ mouse: { x: 0.5, y: 0.5 }, intro: { v: 0 } });
  const [inView, setInView] = useState(true);
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    shared.current.intro.v = intro ? 1 : 0;
  }, [intro]);

  useEffect(() => {
    function onMove(e: PointerEvent) {
      shared.current.mouse.x = e.clientX / window.innerWidth;
      shared.current.mouse.y = 1 - e.clientY / window.innerHeight;
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={host} className="absolute inset-0" aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        frameloop={active && inView ? "always" : "never"}
        gl={{ antialias: false, powerPreference: "high-performance", alpha: false }}
        camera={{ position: [0, 0, 1] }}
        style={{ position: "absolute", inset: 0 }}
      >
        <Ribbons shared={shared} />
      </Canvas>
    </div>
  );
}
