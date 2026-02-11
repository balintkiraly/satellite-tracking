"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Group, Vector3 } from "three";
import { getLatLon } from "@/lib/satellite";
import { latLonAltToXYZ } from "@/lib/coords";
import { useSimTime } from "@/store/simTime";

const TLE1 = "1 25544U 98067A   23042.51809028  .00012544  00000+0  24459-3 0  9993";
const TLE2 = "2 25544  51.6430 175.1745 0008488  89.5512  46.2820 15.50015568399915";

export default function SatelliteWithTooltip({
  setScreenPos,
  toggleTooltip,
}: {
  setScreenPos: (pos: { x: number; y: number }) => void;
  toggleTooltip: () => void;
}) {
  const ref = useRef<Group>(null);
  const { camera, gl } = useThree();
  const simTime = useSimTime((s) => s.time);

  useFrame(() => {
    const pos = getLatLon(TLE1, TLE2, simTime);
    if (pos && ref.current) {
      const { x, y, z } = latLonAltToXYZ(pos.lat, pos.lon, pos.alt, 6.371);
      ref.current.position.set(x, y, z);

      // project to screen coordinates
      const vector = new Vector3(x, y, z).project(camera);
      setScreenPos({
        x: (vector.x * 0.5 + 0.5) * gl.domElement.clientWidth,
        y: (-vector.y * 0.5 + 0.5) * gl.domElement.clientHeight,
      });
    }
  });

  return (
    <group
      ref={ref}
      scale={[1, 1, 1]}
      onClick={() => toggleTooltip()} // hide tooltip on click
    >
      {/* Satellite body */}
      <mesh>
        <boxGeometry args={[0.12, 0.12, 0.12]} />
        <meshStandardMaterial color="#ffffff" emissive="#00ffff" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}
