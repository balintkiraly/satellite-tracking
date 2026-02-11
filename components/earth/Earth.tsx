"use client";

import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { Mesh, TextureLoader, Vector3 } from "three";
import { useSimTime } from "@/store/simTime";
import { getSunDirectionUTC, getEarthRotationUTC } from "@/lib/sun";

export default function Earth() {
  // Load textures
  const dayMap = useLoader(TextureLoader, "/textures/earth.jpg");
  const nightMap = useLoader(TextureLoader, "/textures/nightmap.jpg");
  const cloudsMap = useLoader(TextureLoader, "/textures/earthcloud.jpg");

  // Refs for Earth and clouds
  const earthRef = useRef<Mesh>(null);
  const cloudsRef = useRef<Mesh>(null);

  // Stable shader uniforms
  const uniforms = useRef({
    dayMap: { value: dayMap },
    nightMap: { value: nightMap },
    sunDir: { value: new Vector3() },
  });

  const time = useSimTime((s) => s.time);

  useFrame(() => {
    uniforms.current.sunDir.value.copy(getSunDirectionUTC(time));
    const earthRotationY = getEarthRotationUTC(time);
    if (earthRef.current) earthRef.current.rotation.y = earthRotationY;
    if (cloudsRef.current) cloudsRef.current.rotation.y = earthRotationY;
  });

  return (
    <>
      {/* 🌍 Earth with day/night shader */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[6.371, 64, 64]} />
        <shaderMaterial
          uniforms={uniforms.current}
          vertexShader={`
            varying vec3 vWorldNormal;
            varying vec2 vUv;

            void main() {
              vUv = uv;
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
          opacity={0.25}
          depthWrite={false}
        />
      </mesh>

      {/* 🌫 Atmosphere rim */}
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
