"use client"

import { useMemo, useRef, useEffect } from "react"
import { Mesh, Vector3, Quaternion, ConeGeometry, MeshStandardMaterial } from "three"
import { latLonAltToXYZ } from "@/lib/coords"

interface GroundStationConeProps {
  lat: number
  lon: number
  earthRadius?: number
  satelliteAlt?: number
}

export default function GroundStationCone({
  lat,
  lon,
  earthRadius = 6.371,
  satelliteAlt = 0.4, // 400 km in Earth radii units
}: GroundStationConeProps) {
  const meshRef = useRef<Mesh>(null)

  // Compute position and cone size
  const { x, y, z } = latLonAltToXYZ(lat, lon, 0, earthRadius)
  const coneHeight = 1.5
  const coneAngle = Math.acos(earthRadius / (earthRadius + satelliteAlt))
  const coneRadius = Math.tan(coneAngle) * coneHeight

  useEffect(() => {
    if (!meshRef.current) return

    const normal = new Vector3(x, y, z).normalize() // direction away from Earth center
    const defaultAxis = new Vector3(0, 1, 0) // Three.js cone points +Y
    const quaternion = new Quaternion().setFromUnitVectors(defaultAxis, normal)

    meshRef.current.setRotationFromQuaternion(quaternion)
  }, [x, y, z])

  return (
    <mesh ref={meshRef} position={[x, y, z]}>
      <coneGeometry args={[coneRadius, coneHeight, 32]} />
      <meshStandardMaterial color="yellow" opacity={0.4} transparent />
    </mesh>
  )
}
