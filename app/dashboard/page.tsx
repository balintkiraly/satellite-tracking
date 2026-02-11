"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";
import Earth from "@/components/Earth";
import Satellite from "@/components/Satellite";
import OrbitPath from "@/components/OrbitPath";
import GroundStationCone from "@/components/GroundStation";
import NoisyStars from "@/components/NoisyStars";
import Sun from "@/components/Sun";
import Moon from "@/components/Moon";
import SatelliteTooltip from "@/components/SatelliteTooltip";
import { useState } from "react";
import MilkyWay from "@/components/MilkyWay";
import { SimulationClock } from "@/components/SimulationClock";
import TimeControls from "@/components/TimeControl";

export default function DashboardPage() {
  const [screenPos, setScreenPos] = useState({ x: 0, y: 0 });

  const [tooltipVisible, setTooltipVisible] = useState(false);
  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [0, 0, 20] }}>
        <SimulationClock />
        <Stats/>
        <Sun />
        <Moon earthPosition={[0, 0, 0]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <MilkyWay />
        <NoisyStars />
        <Earth />
        <Satellite
          setScreenPos={setScreenPos}
          toggleTooltip={() => setTooltipVisible(!tooltipVisible)}
        />
        <OrbitPath />
        <GroundStationCone lat={46.5} lon={19.1} satelliteAlt={0.4} />

        <OrbitControls />
        <directionalLight position={[50, 50, 50]} intensity={1} />
      </Canvas>

        <TimeControls />
      <SatelliteTooltip screenPos={screenPos} visible={tooltipVisible} />
    </div>
  );
}
