"use client";

import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { Mesh, TextureLoader } from "three";
import { useSimTime } from "@/store/simTime";
import { useQuality, MOON_SEGMENTS } from "@/store/quality";

// Moon sidereal orbit period ~27.321661 days (seconds)
const MOON_ORBIT_PERIOD_SEC = 27.321661 * 86400;
// Orbit inclination to ecliptic ~5.14°
const MOON_ORBIT_INCLINATION_RAD = (5.14 * Math.PI) / 180;

interface MoonProps {
  earthPosition?: [number, number, number];
}

export default function Moon({ earthPosition = [0, 0, 0] }: MoonProps) {
  const moonRef = useRef<Mesh>(null);
  const orbitRadius = 384;
  const moonRadius = 1;
  const segments = MOON_SEGMENTS[useQuality((s) => s.level)];

  const texture = useLoader(TextureLoader, "/textures/moon.jpg");
  const simTime = useSimTime((state) => state.time);

  useFrame(() => {
    const simSeconds = simTime.getTime() / 1000;
    const t = (simSeconds / MOON_ORBIT_PERIOD_SEC) * 2 * Math.PI;

    // Position in orbital plane (XZ), then apply inclination around X
    const xPlane = orbitRadius * Math.cos(t);
    const zPlane = orbitRadius * Math.sin(t);
    const x = earthPosition[0] + xPlane;
    const y = earthPosition[1] + zPlane * Math.sin(MOON_ORBIT_INCLINATION_RAD);
    const z = earthPosition[2] + zPlane * Math.cos(MOON_ORBIT_INCLINATION_RAD);

    if (moonRef.current) {
      moonRef.current.position.set(x, y, z);
      moonRef.current.rotation.y = t; // tidally locked: same face to Earth
    }
  });

  return (
    <mesh ref={moonRef}>
      <sphereGeometry args={[moonRadius, segments, segments]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}
