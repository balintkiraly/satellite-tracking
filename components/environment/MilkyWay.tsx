"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { TextureLoader, BackSide, Mesh } from "three";
import { useLoader } from "@react-three/fiber";

export default function MilkyWay() {
  const texture = useLoader(TextureLoader, "/textures/milkyway8k.jpg");
  const { camera } = useThree();
  const meshRef = useRef<Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      // Keep Milky Way centered on the camera
      meshRef.current.position.copy(camera.position);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[500, 64, 64]} /> {/* smaller sphere is fine */}
      <meshBasicMaterial map={texture} side={BackSide} />
    </mesh>
  );
}