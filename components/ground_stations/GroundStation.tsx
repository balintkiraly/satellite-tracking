"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Vector3, Quaternion } from "three";
import { latLonAltToXYZ } from "@/lib/coords";
import { useSimTime } from "@/store/simTime";
import { getEarthRotationUTC } from "@/lib/sun";

interface GroundStationConeProps {
  lat: number;
  lon: number;
  earthRadius?: number;
  satelliteAlt?: number;
}

function rotateY(v: Vector3, angle: number, out: Vector3): Vector3 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  out.x = v.x * c - v.z * s;
  out.y = v.y;
  out.z = v.x * s + v.z * c;
  return out;
}

export default function GroundStationCone({
  lat,
  lon,
  earthRadius = 6.371,
  satelliteAlt = 0.4,
}: GroundStationConeProps) {
  const meshRef = useRef<Mesh>(null);

  const coneHeight = 1.5;
  const coneAngle = Math.acos(earthRadius / (earthRadius + satelliteAlt));
  const coneRadius = Math.tan(coneAngle) * coneHeight;

  const localPos = useMemo(
    () => latLonAltToXYZ(lat, lon, 0, earthRadius),
    [lat, lon, earthRadius]
  );
  const localNormal = useMemo(
    () =>
      new Vector3(
        -localPos.x,
        -localPos.y,
        -localPos.z
      ).normalize(),
    [localPos.x, localPos.y, localPos.z]
  );

  const time = useSimTime((s) => s.time);
  const worldPos = useRef(new Vector3());
  const worldNormal = useRef(new Vector3());
  const quat = useRef(new Quaternion());
  const defaultAxis = useRef(new Vector3(0, 1, 0));
  const localPosVec = useRef(
    new Vector3(localPos.x, localPos.y, localPos.z)
  );

  useFrame(() => {
    const rot = getEarthRotationUTC(time);
    localPosVec.current.set(localPos.x, localPos.y, localPos.z);
    // Apply opposite rotation: latLonAltToXYZ frame matches Earth when we use -rot
    rotateY(localPosVec.current, -rot, worldPos.current);
    rotateY(localNormal, -rot, worldNormal.current);
    quat.current.setFromUnitVectors(
      defaultAxis.current,
      worldNormal.current
    );
    if (meshRef.current) {
      meshRef.current.position.copy(worldPos.current);
      meshRef.current.setRotationFromQuaternion(quat.current);
    }
  });

  return (
    <mesh ref={meshRef}>
      <coneGeometry args={[coneRadius, coneHeight, 32]} />
      <meshStandardMaterial color="#00aaff" opacity={0.4} transparent />
    </mesh>
  );
}
