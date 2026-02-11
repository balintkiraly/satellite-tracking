"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { DirectionalLight, Mesh, Vector3 } from "three";
import { useSimTime } from "@/store/simTime";
import { getSunDirectionUTC } from "@/lib/sun";

const SUN_DISTANCE = 500;

export default function Sun() {
  const meshRef = useRef<Mesh>(null);
  const lightRef = useRef<DirectionalLight>(null);
  const time = useSimTime((s) => s.time);
  const pos = useRef(new Vector3());

  useFrame(() => {
    pos.current.copy(getSunDirectionUTC(time)).multiplyScalar(SUN_DISTANCE);
    if (meshRef.current) meshRef.current.position.copy(pos.current);
    if (lightRef.current) lightRef.current.position.copy(pos.current);
  });

  return (
    <>
      <directionalLight
        ref={lightRef}
        intensity={1.5}
        color={0xffffff}
        castShadow
      />
      {/* Optional: visualize sun as a small emissive sphere 
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="yellow" />
      </mesh>
      */}
    </>
  );
}
