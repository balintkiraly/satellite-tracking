"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Mesh } from "three"

export default function Sun() {
  
  const ref = useRef<Mesh>(null)

  useFrame(() => {
    if (ref.current) {
      // Slowly rotate for subtle effect
      ref.current.rotation.y += 0.001
    }
  })

  return (
    <>
      <directionalLight
        position={[50, 50, 50]}
        intensity={1.5}
        color={0xffffff}
        castShadow
      />
      <mesh ref={ref} position={[50, 50, 50]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="yellow" />
      </mesh>
    </>
  )
}
