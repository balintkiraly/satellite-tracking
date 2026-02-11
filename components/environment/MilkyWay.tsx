"use client";

import { useLoader } from "@react-three/fiber";
import { TextureLoader, BackSide } from "three";

export default function MilkyWay() {
  const texture = useLoader(TextureLoader, "/textures/milkyway.jpg");

  return (
    <mesh>
      <sphereGeometry args={[1000, 64, 64]} />
      <meshBasicMaterial map={texture} side={BackSide} />
    </mesh>
  );
}
