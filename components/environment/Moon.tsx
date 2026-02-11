"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";

interface MoonProps {
  earthPosition?: [number, number, number];
}

export default function Moon({ earthPosition = [0, 0, 0] }: MoonProps) {
  const moonRef = useRef<Mesh>(null);
  const orbitRadius = 60; // scaled distance
  const moonRadius = 1.1; // scaled radius

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.05; // orbital speed
    const x = earthPosition[0] + orbitRadius * Math.cos(t);
    const z = earthPosition[2] + orbitRadius * Math.sin(t);
    const y = earthPosition[1]; // same plane
    if (moonRef.current) {
      moonRef.current.position.set(x, y, z);
    }
  });

  const texture = useLoader(TextureLoader, "/textures/moon.jpg");

  return (
    <mesh ref={moonRef}>
      <sphereGeometry args={[moonRadius, 32, 32]} />
      <meshStandardMaterial color="lightgray" />

      <meshStandardMaterial map={texture} />
    </mesh>
  );
}
