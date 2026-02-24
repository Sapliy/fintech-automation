'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vUv;

  // Hash for pseudo-random values
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  // Smooth noise
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1,0)), f.x),
      mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x),
      f.y
    );
  }

  // Draw a glowing line segment between two points
  float lineSegment(vec2 p, vec2 a, vec2 b, float width) {
    vec2 ab = b - a;
    vec2 ap = p - a;
    float t = clamp(dot(ap, ab) / dot(ab, ab), 0.0, 1.0);
    float d = length(ap - t * ab);
    return smoothstep(width, 0.0, d);
  }

  // Draw a glowing dot / node
  float node(vec2 p, vec2 center, float radius) {
    float d = length(p - center);
    return smoothstep(radius, radius * 0.2, d);
  }

  void main() {
    vec2 uv = vUv;
    // Correct for aspect ratio
    float aspect = uResolution.x / uResolution.y;
    vec2 uvAspect = vec2(uv.x * aspect, uv.y);

    // Grid settings
    float cols = 14.0;
    float rows = cols / aspect;
    vec2 cellSize = vec2(1.0 / cols, 1.0 / rows);

    // The grid coordinates (0..cols, 0..rows)
    vec2 gridPos = vec2(uvAspect.x * cols / aspect, uv.y * rows);
    vec2 cellIdx = floor(gridPos);
    vec2 cellFrac = fract(gridPos);

    // --- 1. Grid squares ---
    vec2 innerDist = abs(cellFrac - 0.5);
    float square = 1.0 - smoothstep(0.40, 0.44, max(innerDist.x, innerDist.y));

    // Node positions are at grid intersections (corners of cells)
    // We'll draw lines in uv space for precision

    // --- 2. Animated flow lines between nodes ---
    // Nodes live at integer multiples of cellSize
    // For each cell, we potentially draw a horizontal and vertical flow line

    float lineGlow = 0.0;
    float nodeGlow = 0.0;
    float dataDot = 0.0;

    // Line width in uv space
    float lw = 0.003;

    // Check neighbors in a 3x3 window around current cell
    for (float dy = -1.0; dy <= 1.0; dy += 1.0) {
      for (float dx = -1.0; dx <= 1.0; dx += 1.0) {
        vec2 ni = cellIdx + vec2(dx, dy);

        // Each node at ni has a random seed
        float seed = hash(ni);
        float seed2 = hash(ni + vec2(37.3, 91.7));

        // Node center in uv space (at grid intersections)
        vec2 nCenter = (ni + 0.5) * cellSize;
        // back to non-aspect for drawing
        nCenter.x /= aspect / 1.0;
        // Actually let's work in aspect-corrected uvAspect space consistently
        // Recompute in aspect space
        vec2 nCenterA = vec2((ni.x + 0.5) / cols, (ni.y + 0.5) / rows);
        nCenterA.x *= aspect;

        // Draw glowing node dot
        float nd = length(uvAspect - nCenterA);
        float nr = 0.008 + seed * 0.006;
        float pulse = 0.5 + 0.5 * sin(uTime * (1.5 + seed * 1.5) + seed * 6.28);
        nodeGlow += smoothstep(nr * (1.0 + pulse * 0.5), 0.0, nd) * (0.4 + pulse * 0.6);

        // Draw horizontal line to right neighbor
        vec2 rightIdx = ni + vec2(1.0, 0.0);
        vec2 rightCenterA = vec2((rightIdx.x + 0.5) / cols * aspect, (rightIdx.y + 0.5) / rows);

        // Only draw if hash activates this edge (not all edges active)
        float hEdgeSeed = hash(ni * 3.7 + vec2(1.0, 0.0));
        if (hEdgeSeed > 0.35) {
          float hLine = lineSegment(uvAspect, nCenterA, rightCenterA, lw);
          lineGlow += hLine * 0.3;

          // Animated data packet along this edge
          float packetSpeed = 0.4 + hEdgeSeed * 0.6;
          float packetOffset = hash(ni + vec2(5.5, 2.2));
          float t = fract(uTime * packetSpeed * 0.25 + packetOffset);
          vec2 packetPos = mix(nCenterA, rightCenterA, t);
          float pd = length(uvAspect - packetPos);
          float packetGlow = smoothstep(0.018, 0.0, pd);
          float trail = smoothstep(0.06, 0.0, abs(dot(uvAspect - packetPos, normalize(rightCenterA - nCenterA)) - 0.0));
          dataDot += packetGlow * 1.5 + trail * hLine * 0.5;
        }

        // Draw vertical line to top neighbor
        vec2 topIdx = ni + vec2(0.0, 1.0);
        vec2 topCenterA = vec2((topIdx.x + 0.5) / cols * aspect, (topIdx.y + 0.5) / rows);

        float vEdgeSeed = hash(ni * 2.1 + vec2(0.0, 1.0));
        if (vEdgeSeed > 0.45) {
          float vLine = lineSegment(uvAspect, nCenterA, topCenterA, lw);
          lineGlow += vLine * 0.3;

          float packetSpeed = 0.3 + vEdgeSeed * 0.5;
          float packetOffset = hash(ni + vec2(9.1, 4.4));
          float t = fract(uTime * packetSpeed * 0.25 + packetOffset);
          vec2 packetPos = mix(nCenterA, topCenterA, t);
          float pd = length(uvAspect - packetPos);
          float packetGlow = smoothstep(0.018, 0.0, pd);
          dataDot += packetGlow * 1.5;
        }
      }
    }

    // --- Colors ---
    // Dark base
    vec3 bgDark    = vec3(0.012, 0.016, 0.028);
    vec3 squareCol = vec3(0.018, 0.028, 0.055);
    vec3 lineCol   = vec3(0.18, 0.72, 0.95);   // cyan-blue
    vec3 nodeCol   = vec3(0.15, 0.65, 1.00);   // brighter blue
    vec3 dataCol   = vec3(0.55, 0.95, 1.00);   // white-cyan for data packets
    vec3 accentCol = vec3(0.45, 0.30, 1.00);   // purple accent nodes

    // Secondary purple lines for variety
    float purpleNodeSeed = hash(cellIdx + vec2(11.3, 77.7));
    vec3 finalNodeCol = mix(nodeCol, accentCol, step(0.75, purpleNodeSeed));

    // Build color
    vec3 color = bgDark;
    color = mix(color, squareCol, square * 0.8);
    color += lineCol * lineGlow * 1.2;
    color += finalNodeCol * nodeGlow * 0.8;
    color += dataCol * dataDot;

    // Subtle horizontal scan overlay (very faint)
    float scanLine = sin(uv.y * uResolution.y * 1.5) * 0.5 + 0.5;
    color -= scanLine * 0.012;

    // Vignette
    vec2 vig = vUv - 0.5;
    float vignette = 1.0 - dot(vig, vig) * 2.2;
    color *= clamp(vignette, 0.0, 1.0);

    // Subtle animated radial glow from center
    float centerGlow = smoothstep(0.9, 0.0, length(uv - 0.5));
    color += vec3(0.02, 0.05, 0.12) * centerGlow * (0.5 + 0.5 * sin(uTime * 0.4));

    gl_FragColor = vec4(color, 1.0);
  }
`;

const FlowGridShader = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: {
        value: new THREE.Vector2(
          typeof window !== 'undefined' ? window.innerWidth : 1920,
          typeof window !== 'undefined' ? window.innerHeight : 1080
        ),
      },
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uResolution.value.set(
        window.innerWidth,
        window.innerHeight
      );
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
};

export default function ShaderBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden" style={{ background: '#020617' }}>
      <Canvas
        orthographic
        camera={{ position: [0, 0, 1], zoom: 1 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: false, alpha: false }}
      >
        <FlowGridShader />
      </Canvas>

      {/* Fine noise grain for premium texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.06,
          mixBlendMode: 'screen',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
        }}
      />

      {/* Edge fade at bottom to blend into content */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, #020617)',
        }}
      />
    </div>
  );
}