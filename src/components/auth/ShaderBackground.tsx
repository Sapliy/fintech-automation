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

  // Pseudo-random generator
  vec2 hash(vec2 p) {
      p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
      return fract(sin(p) * 43758.5453) * 2.0 - 1.0;
  }

  // Simplex noise for fluid ripples
  float noise(vec2 p) {
      vec2 i = floor(p + (p.x + p.y) * 0.366025404);
      vec2 a = p - i + (i.x + i.y) * 0.211324865;
      float m = step(a.y, a.x);
      vec2 o = vec2(m, 1.0 - m);
      vec2 b = a - o + 0.211324865;
      vec2 c = a - 1.0 + 2.0 * 0.211324865;
      vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
      vec3 n = h * h * h * h * vec3(dot(a, hash(i + 0.0)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
      return dot(n, vec3(70.0));
  }

  void main() {
    // Normalize coordinates based on resolution
    vec2 uv = vUv;
    uv.x *= uResolution.x / uResolution.y;

    // Time scaling for fluid animation
    float time = uTime * 0.6;
    
    // Layered noise for caustic water ripples
    vec2 p = uv * 4.0;
    
    // Create multiple rippling waves flowing diagonally
    float n1 = noise(p + vec2(time * 0.2, time * 0.3));
    float n2 = noise(p * 2.0 - vec2(time * 0.4, time * 0.1));
    float n3 = noise(p * 4.0 + vec2(time * 0.1, -time * 0.5));
    
    // Combine noise to create sharp, caustic-like water reflections
    float waterPattern = pow(sin(n1 * 3.14 + n2 * 1.5 + n3 * 0.5) * 0.5 + 0.5, 3.0);
    
    // Deform the UV coords to bend the overall "pool"
    vec2 distortedUv = uv + vec2(n1, n2) * 0.15;
    float largeFlow = noise(distortedUv * 2.0 - time * 0.15);

    // Deep ocean base to bright cyan highlights
    vec3 deepWater = vec3(0.016, 0.486, 0.580); // Darker Cyan
    vec3 midWater = vec3(0.024, 0.714, 0.835);  // Base Cyan
    vec3 highlight = vec3(0.8, 0.95, 1.0);      // Very bright cyan/white reflections

    // Mix the depths based on the large flow
    vec3 color = mix(deepWater, midWater, largeFlow * 0.5 + 0.5);
    
    // Add the sharp caustic water highlights on top
    color += highlight * waterPattern * 0.8;
    
    // Add a dark vignette at the bottom and right edges to blend into the container
    float vignette = smoothstep(1.0, 0.2, vUv.x) * smoothstep(0.0, 0.5, vUv.y);
    color *= mix(0.7, 1.0, vignette);

    gl_FragColor = vec4(color, 1.0);
  }
`;

const FlowingWaterShader = () => {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uResolution: {
                value: new THREE.Vector2(
                    typeof window !== 'undefined' ? window.innerWidth : 1920,
                    typeof window !== 'undefined' ? window.innerHeight : 1080
                )
            },
        }),
        []
    );

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime * 0.5;
            materialRef.current.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
        }
    });

    return (
        <mesh ref={meshRef}>
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
        <div className="absolute inset-0 z-0 bg-[#083344] overflow-hidden">
            <Canvas orthographic camera={{ position: [0, 0, 1], zoom: 1 }} style={{ width: '100%', height: '100%' }}>
                <FlowingWaterShader />
            </Canvas>

            {/* Subtle noise overlay to give the surface a bit of premium texture */}
            <div
                className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />
        </div>
    );
}
