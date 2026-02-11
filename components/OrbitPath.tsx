"use client"

import { useMemo, useRef } from "react"
import { Line } from "@react-three/drei"
import { getLatLon } from "@/lib/satellite"
import { latLonAltToXYZ } from "@/lib/coords"
import { Vector3, Color } from "three";
import { useFrame } from "@react-three/fiber"
import { useSimTime } from "@/lib/simTime"

const TLE1 = "1 25544U 98067A   23042.51809028  .00012544  00000+0  24459-3 0  9993"
const TLE2 = "2 25544  51.6430 175.1745 0008488  89.5512  46.2820 15.50015568399915"

interface OrbitPathProps {
  points?: Vector3[]; // pass orbit points if needed
}

export default function OrbitPath({ points }: OrbitPathProps) { 

  const lineRef = useRef<any>(null);
  
  useFrame(({ clock }) => {
    if (lineRef.current) {
      lineRef.current.material.opacity = 0.5 + 0.1 * Math.sin(clock.getElapsedTime() * 2);
    }
  });
  const time = useSimTime((s) => s.time);
  const orbitPoints = useMemo(() => {
    const pts: [number, number, number][] = []
    const now = time ? new Date(time) : new Date();
    for (let i = 0; i < 100; i++) {
      const future = new Date(now.getTime() + i * 60000) // 1 min steps
      const pos = getLatLon(TLE1, TLE2, future)
      if (pos) {
        const { x, y, z } = latLonAltToXYZ(pos.lat, pos.lon, pos.alt, 6.371)
        pts.push([x, y, z])
      }
    }
    return pts
  }, [])

  return (
    <Line
    ref={lineRef}
      points={orbitPoints} 
      color={new Color(0x00ffff)}
      lineWidth={0.5}          // subtle thin line
      transparent
      opacity={0.4}            // low opacity for soft glow
      blending={1}             // AdditiveBlending
      dashed={false}
    />
  );
}
