"use client";

import { useLoader, useFrame } from "@react-three/fiber";
import { TextureLoader, Vector3 } from "three";
import { useRef } from "react";
import { getSunDirectionUTC } from "@/lib/sun";

export default function Earth() {
  const dayMap = useLoader(TextureLoader, "/textures/earth.jpg");
  const nightMap = useLoader(TextureLoader, "/textures/nightmap.jpg");
  const cloudsMap = useLoader(TextureLoader, "/textures/earthcloud.jpg");

  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  // ✅ Stable uniforms (VERY important)
  const uniforms = useRef({
    dayMap: { value: dayMap },
    nightMap: { value: nightMap },
    sunDir: { value: new Vector3() },
  });

  useFrame(() => {
    // Update Sun direction every frame (UTC-aligned)
    uniforms.current.sunDir.value.copy(getSunDirectionUTC(new Date()));

    // Subtle cloud motion
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0004;
    }
  });

  return (
    <>
      {/* 🌍 Earth (day/night shader) */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[6.371, 64, 64]} />
        <shaderMaterial
          uniforms={uniforms.current}
          vertexShader={`
            varying vec3 vWorldNormal;
            varying vec2 vUv;

            void main() {
              vUv = uv;

              // WORLD-space normal (camera-independent)
              vWorldNormal = normalize(mat3(modelMatrix) * normal);

              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform sampler2D dayMap;
            uniform sampler2D nightMap;
            uniform vec3 sunDir;

            varying vec3 vWorldNormal;
            varying vec2 vUv;

            void main() {
              float light = dot(normalize(vWorldNormal), normalize(sunDir));
              light = clamp(light, -1.0, 1.0);

              vec3 dayColor = texture2D(dayMap, vUv).rgb;
              vec3 nightColor = texture2D(nightMap, vUv).rgb;

              // Smooth terminator transition
              float nightFactor = smoothstep(0.15, -0.25, light);

              vec3 color = mix(dayColor, nightColor, nightFactor);

              gl_FragColor = vec4(color, 1.0);
            }
          `}
        />
      </mesh>

      {/* ☁️ Clouds */}
      <mesh ref={cloudsRef} scale={[1.003, 1.003, 1.003]}>
        <sphereGeometry args={[6.371, 64, 64]} />
        <meshStandardMaterial
          map={cloudsMap}
          transparent
          opacity={0.45}
          depthWrite={false}
        />
      </mesh>

      {/* 🌫 Atmosphere (simple rim) */}
      <mesh scale={[1.02, 1.02, 1.02]}>
        <sphereGeometry args={[6.371, 64, 64]} />
        <meshBasicMaterial
          color="#88ccff"
          transparent
          opacity={0.18}
          side={2} // BackSide
        />
      </mesh>
    </>
  );
}
