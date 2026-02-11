"use client";

import { useRef, useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { Mesh, TextureLoader, Vector3 } from "three";
import { useSimTime } from "@/store/simTime";
import { useQuality, EARTH_TEXTURES, EARTH_SEGMENTS } from "@/store/quality";
import { getSunDirectionUTC, getEarthRotationUTC } from "@/lib/sun";

export default function Earth() {
  const quality = useQuality((s) => s.level);
  const textures = EARTH_TEXTURES[quality];
  const segments = EARTH_SEGMENTS[quality];

  const dayMap = useLoader(TextureLoader, textures.day);
  const nightMap = useLoader(TextureLoader, textures.night);
  const cloudsMap = useLoader(TextureLoader, textures.clouds);

  const earthRef = useRef<Mesh>(null);
  const cloudsRef = useRef<Mesh>(null);

  const uniforms = useRef({
    dayMap: { value: dayMap },
    nightMap: { value: nightMap },
    sunDir: { value: new Vector3() },
  });

  // Update shader textures when quality (and thus texture URLs) changes
  useEffect(() => {
    uniforms.current.dayMap.value = dayMap;
    uniforms.current.nightMap.value = nightMap;
  }, [dayMap, nightMap]);

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
        <sphereGeometry args={[6.371, segments, segments]} />
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
        <sphereGeometry args={[6.371, segments, segments]} />
        <meshStandardMaterial
          map={cloudsMap}
          transparent
          opacity={0.25}
          depthWrite={false}
        />
      </mesh>

      {/* 🌫 Atmosphere rim */}
      <mesh scale={[1.02, 1.02, 1.02]}>
        <sphereGeometry args={[6.371, segments, segments]} />
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
